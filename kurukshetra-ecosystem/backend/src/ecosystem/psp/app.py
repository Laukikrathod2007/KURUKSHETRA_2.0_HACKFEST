"""PSP Application simulation (Google Pay, PhonePe, Paytm, BHIM).

Demonstrates the cross-PSP visibility boundary:
Each PSP app queries and records ONLY its own app-local history.
A payment made on PhonePe does NOT appear in GPay's local history.
Only the NPCI switch sits above both apps.
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.config import format_inr
from ecosystem.models import AppLocalHistory, SavedBeneficiary
from ecosystem.npci import switch


class PspApp:
    def __init__(self, psp_id: str, name: str, default_account_id: str):
        self.psp_id = psp_id
        self.name = name
        self.default_account_id = default_account_id

    def lookup_vpa(
        self,
        session: Session,
        *,
        customer_id: str,
        payer_account_id: Optional[str] = None,
        payee_vpa: str,
        declared_purpose: Optional[str] = None,
        raw_uri: Optional[str] = None,
        trace_id: Optional[str] = None,
    ) -> dict[str, Any]:
        """Initiate ReqValAdd via NPCI switch."""
        tid = trace_id or f"trc_{uuid.uuid4().hex[:12]}"
        acc_id = payer_account_id or self.default_account_id
        return switch.handle_req_val_add(
            session,
            trace_id=tid,
            psp_id=self.psp_id,
            payer_id=customer_id,
            payer_account_id=acc_id,
            payee_vpa=payee_vpa,
            declared_purpose=declared_purpose,
            raw_uri=raw_uri,
        )

    def pay(
        self,
        session: Session,
        *,
        txn_id: str,
        amount_paise: int,
        user_acknowledged: bool = False,
        pin_verified: bool = True,
        trace_id: str,
    ) -> dict[str, Any]:
        """Initiate ReqPay via NPCI switch."""
        return switch.handle_req_pay(
            session,
            trace_id=trace_id,
            txn_id=txn_id,
            amount_paise=amount_paise,
            user_acknowledged=user_acknowledged,
            pin_verified=pin_verified,
        )

    def get_app_history(self, session: Session, customer_id: str) -> list[dict[str, Any]]:
        """Strictly app-local history -- never queries other PSPs."""
        stmt = (
            select(AppLocalHistory)
            .where(
                AppLocalHistory.psp_id == self.psp_id,
                AppLocalHistory.customer_id == customer_id,
            )
            .order_by(AppLocalHistory.occurred_at.desc())
        )
        rows = session.scalars(stmt).all()
        return [
            {
                "payee_ref": r.payee_ref,
                "amount_paise": r.amount_paise,
                "amount_formatted": format_inr(r.amount_paise),
                "direction": r.direction.value,
                "occurred_at": r.occurred_at.isoformat(),
                "succeeded": r.succeeded,
            }
            for r in rows
        ]

    def save_beneficiary(
        self,
        session: Session,
        *,
        customer_id: str,
        payee_ref: str,
        nickname: str = "",
    ) -> SavedBeneficiary:
        saved = SavedBeneficiary(
            psp_id=self.psp_id,
            customer_id=customer_id,
            payee_ref=payee_ref,
            nickname=nickname,
            added_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
        )
        session.add(saved)
        session.flush()
        return saved

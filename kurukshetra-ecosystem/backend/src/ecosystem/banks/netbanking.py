"""Internet Banking (Net-Banking) portal simulation.

Flow:
1. "Add Payee" (Account Number + IFSC) -> Kurukshetra Hook 1
2. Initiate transfer -> Pre-debit verification -> Kurukshetra Hook 2
3. Supports IMPS (instant) and NEFT (deferred settlement / cooling-off)
4. Atomic double-entry CBS transfer on approval
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.banks import cbs
from ecosystem.config import format_inr
from ecosystem.models import (
    Account,
    Bank,
    Customer,
    Direction,
    Rail,
    RiskZone,
    SavedBeneficiary,
    Transaction,
    TxnState,
)
from ecosystem.risk import engine
from ecosystem.risk.contracts import (
    EventType,
    PayerContext,
    PaymentMethod,
    RecipientContext,
    RiskDecision,
    TransactionAnalysisRequest,
    TransactionDetails,
)
from ecosystem.traces import TraceRecorder


def add_payee(
    session: Session,
    *,
    trace_id: str,
    customer_id: str,
    beneficiary_account_number: str,
    ifsc: str,
    nickname: str = "",
) -> dict[str, Any]:
    """Add a netbanking beneficiary with Kurukshetra Hook 1 screening."""
    recorder = TraceRecorder(trace_id, session)

    # Resolve beneficiary account
    stmt = select(Account).where(
        Account.account_number == beneficiary_account_number,
        Account.ifsc == ifsc,
    )
    ben_account = session.scalars(stmt).first()
    if not ben_account:
        return {"success": False, "error": "BENEFICIARY_ACCOUNT_NOT_FOUND"}

    ben_customer = session.get(Customer, ben_account.customer_id)
    ben_name = ben_customer.name if ben_customer else "Unknown"

    recorder.emit(
        component="NETBANKING",
        action="ADD_PAYEE_INITIATED",
        summary=f"Payer {customer_id} requested adding beneficiary {ben_name} ({beneficiary_account_number}/{ifsc})",
        detail={"account_number": beneficiary_account_number, "ifsc": ifsc, "name": ben_name},
    )

    # Kurukshetra Hook 1 screening
    risk_req = TransactionAnalysisRequest(
        event=EventType.VPA_RESOLUTION,
        transaction_id=f"nb_val_{uuid.uuid4().hex[:10]}",
        trace_id=trace_id,
        payment_method=PaymentMethod.NETBANKING,
        payer_context=PayerContext(payer_id_hash=customer_id),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=f"{ifsc}_{beneficiary_account_number}",
            resolved_name=ben_name,
            mc_code=ben_account.mcc,
            raw_handle_string=f"{beneficiary_account_number}@{ifsc}",
            beneficiary_account_id=ben_account.account_id,
        ),
    )
    risk: RiskDecision = engine.evaluate(session, risk_req)

    recorder.emit(
        component="KURUKSHETRA",
        action="PAYEE_SCREENING_COMPLETED",
        summary=f"Kurukshetra NetBanking screening: {risk.risk_zone.value} (Score: {risk.risk_score})",
        detail={"score": risk.risk_score, "zone": risk.risk_zone.value, "reasons": risk.reasons},
    )

    saved = SavedBeneficiary(
        psp_id=None,  # NetBanking has no PSP id
        customer_id=customer_id,
        payee_ref=f"{ifsc}_{beneficiary_account_number}",
        nickname=nickname or ben_name,
        added_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(saved)

    return {
        "success": True,
        "beneficiary": {
            "name": ben_name,
            "account_number": beneficiary_account_number,
            "ifsc": ifsc,
            "branch": ben_account.branch_state,
        },
        "risk": risk.model_dump(),
    }


def transfer_funds(
    session: Session,
    *,
    trace_id: str,
    customer_id: str,
    payer_account_id: str,
    beneficiary_account_id: str,
    amount_paise: int,
    transfer_mode: str = "IMPS",  # IMPS or NEFT
    user_acknowledged: bool = False,
) -> dict[str, Any]:
    """Execute NetBanking transfer with pre-debit Kurukshetra Hook 2 check."""
    recorder = TraceRecorder(trace_id, session)
    txn_id = f"txn_{uuid.uuid4().hex[:12]}"

    payer_account = session.get(Account, payer_account_id)
    ben_account = session.get(Account, beneficiary_account_id)
    if not payer_account or not ben_account:
        return {"success": False, "error": "ACCOUNT_NOT_FOUND"}

    ben_customer = session.get(Customer, ben_account.customer_id)
    ben_name = ben_customer.name if ben_customer else "Unknown"

    recorder.emit(
        component="NETBANKING",
        action="TRANSFER_INITIATED",
        summary=f"Transfer request of {format_inr(amount_paise)} via {transfer_mode} to {ben_name}",
        txn_id=txn_id,
        detail={"mode": transfer_mode, "amount": format_inr(amount_paise)},
    )

    # Kurukshetra Hook 2 Pre-flight
    risk_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=txn_id,
        trace_id=trace_id,
        payment_method=PaymentMethod.NETBANKING,
        payer_context=PayerContext(
            payer_id_hash=customer_id,
            payer_account_id=payer_account.account_id,
        ),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=f"{ben_account.ifsc}_{ben_account.account_number}",
            resolved_name=ben_name,
            mc_code=ben_account.mcc,
            beneficiary_account_id=ben_account.account_id,
        ),
        transaction=TransactionDetails(amount_paise=amount_paise),
    )

    risk: RiskDecision = engine.evaluate(session, risk_req)

    recorder.emit(
        component="KURUKSHETRA",
        action="PREFLIGHT_EVALUATION",
        summary=f"Pre-flight Risk: {risk.risk_zone.value} (Score: {risk.risk_score})",
        txn_id=txn_id,
    )

    txn = Transaction(
        txn_id=txn_id,
        trace_id=trace_id,
        rail=Rail.NETBANKING,
        payer_customer_id=customer_id,
        payer_account_id=payer_account.account_id,
        payee_ref=f"{ben_account.ifsc}_{ben_account.account_number}",
        payee_account_id=ben_account.account_id,
        payee_name_resolved=ben_name,
        amount_paise=amount_paise,
        risk_score=risk.risk_score,
        risk_zone=RiskZone(risk.risk_zone.value),
        state=TxnState.RISK_EVALUATED,
    )
    session.add(txn)

    if risk.risk_zone == RiskZone.FREEZE:
        txn.state = TxnState.BLOCKED
        recorder.emit(
            component="NETBANKING",
            action="TRANSFER_BLOCKED",
            summary="Net-Banking transfer blocked by fraud protection policy. Zero balance movement.",
            txn_id=txn_id,
        )
        return {"status": "BLOCKED", "decision": risk.model_dump(), "message": "Transfer blocked."}

    if risk.risk_zone in (RiskZone.COACH, RiskZone.STEP_UP) and not user_acknowledged:
        txn.state = TxnState.AWAITING_ACK
        recorder.emit(
            component="NETBANKING",
            action="WARNING_DISPLAYED",
            summary="Net-Banking portal prompt: user confirmation required for unverified payee transfer",
            txn_id=txn_id,
        )
        return {"status": "AWAITING_ACK", "decision": risk.model_dump(), "message": "Confirmation required."}

    # Execute transfer
    debit_entry, credit_entry = cbs.execute_transfer(
        session,
        remitter_account_id=payer_account.account_id,
        beneficiary_account_id=ben_account.account_id,
        amount_paise=amount_paise,
        txn_id=txn_id,
        narration=f"NETBANKING/{transfer_mode}/{ben_name}",
    )

    txn.state = TxnState.COMPLETED
    txn.completed_at = dt.datetime.now(dt.UTC).replace(tzinfo=None)

    recorder.emit(
        component="NETBANKING",
        action="SETTLEMENT_EXECUTED",
        summary=f"{transfer_mode} transfer of {format_inr(amount_paise)} successfully completed.",
        txn_id=txn_id,
        detail={
            "remitter_balance": format_inr(payer_account.balance_paise),
            "beneficiary_balance": format_inr(ben_account.balance_paise),
        },
    )

    return {
        "status": "COMPLETED",
        "txn_id": txn_id,
        "mode": transfer_mode,
        "amount_formatted": format_inr(amount_paise),
        "remitter_balance": format_inr(payer_account.balance_paise),
        "beneficiary_balance": format_inr(ben_account.balance_paise),
        "decision": risk.model_dump(),
    }

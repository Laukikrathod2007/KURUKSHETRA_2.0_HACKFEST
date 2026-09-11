"""Mock NetBanking IB gateway adapter.

Per docs/02-transaction-lifecycle.md: add-payee is the NetBanking equivalent
of ReqValAdd, and the pre-debit confirmation screen is the equivalent of
ReqPay pre-flight. Reuses ~90% of the same Tier 0/1 core, keyed on
account+IFSC instead of a VPA.
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter
from pydantic import BaseModel

from kurukshetra.contracts import (
    EventType,
    PayerContext,
    PaymentMethod,
    RecipientContext,
    RiskDecision,
    TransactionAnalysisRequest,
    TransactionDetails,
)
from kurukshetra.engine_core import evaluate

router = APIRouter(tags=["mock-netbanking"])


class AddPayeeRequest(BaseModel):
    customer_id_hash: str
    account_ifsc_ref_hash: str  # account_number + IFSC, hashed together
    resolved_name: str | None = None


class ConfirmTransferRequest(BaseModel):
    customer_id_hash: str
    account_ifsc_ref_hash: str
    resolved_name: str | None = None
    amount: float
    transfer_type: str = "IMPS"  # IMPS settles instantly; NEFT/RTGS have a batch window


@router.post("/netbanking/add-payee")
def add_payee(req: AddPayeeRequest) -> dict:
    transaction_id = f"nb_{uuid.uuid4().hex[:10]}"
    engine_req = TransactionAnalysisRequest(
        event=EventType.VPA_RESOLUTION,
        transaction_id=transaction_id,
        payment_method=PaymentMethod.NETBANKING,
        payer_context=PayerContext(payer_id_hash=req.customer_id_hash),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=req.account_ifsc_ref_hash,
            resolved_name=req.resolved_name,
        ),
    )
    risk: RiskDecision = evaluate(engine_req)
    return {"transaction_id": transaction_id, "risk": risk.model_dump(mode="json")}


@router.post("/netbanking/confirm-transfer")
def confirm_transfer(req: ConfirmTransferRequest) -> dict:
    transaction_id = f"nb_{uuid.uuid4().hex[:10]}"
    engine_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=transaction_id,
        payment_method=PaymentMethod.NETBANKING,
        payer_context=PayerContext(payer_id_hash=req.customer_id_hash),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=req.account_ifsc_ref_hash,
            resolved_name=req.resolved_name,
        ),
        transaction=TransactionDetails(amount=req.amount),
    )
    risk: RiskDecision = evaluate(engine_req)

    note = None
    if req.transfer_type in ("NEFT", "RTGS") and risk.risk_zone.value in ("COACH", "FREEZE"):
        note = "NEFT/RTGS settles in a batch window, not instantly -- the cooling-off hold has zero UX cost here."

    return {"transaction_id": transaction_id, "risk": risk.model_dump(mode="json"), "note": note}

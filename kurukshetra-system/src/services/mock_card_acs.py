"""Mock 3-D Secure ACS adapter -- stands in for a card issuer's Access
Control Server calling out for a Risk-Based-Authentication signal during a
card-not-present checkout. Card-present (POS/ATM) has no interceptable UX
moment and is out of scope -- see docs/00-implementation-plan.md section 2.3.

Reuses the exact same Tier 0/1 core as UPI (docs/02-transaction-lifecycle.md
"Card lifecycle") -- only this adapter differs.
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

router = APIRouter(tags=["mock-card-acs"])


class CardAuthRequest(BaseModel):
    cardholder_id_hash: str
    merchant_ref_hash: str
    merchant_name: str
    merchant_category_code: str
    amount: float


@router.post("/card/authorize")
def authorize(req: CardAuthRequest) -> dict:
    """The ACS calls this for an RBA risk signal; it informs -- but does not
    make -- the issuer's frictionless-pass / OTP-challenge / decline call."""
    transaction_id = f"card_{uuid.uuid4().hex[:10]}"
    engine_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=transaction_id,
        payment_method=PaymentMethod.CARD_CNP,
        payer_context=PayerContext(payer_id_hash=req.cardholder_id_hash),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=req.merchant_ref_hash,
            resolved_name=req.merchant_name,
            mc_code=req.merchant_category_code,
        ),
        transaction=TransactionDetails(amount=req.amount),
    )
    risk: RiskDecision = evaluate(engine_req)

    rba_action = {
        "ALLOW": "FRICTIONLESS_PASS",
        "STEP_UP": "OTP_CHALLENGE",
        "COACH": "OTP_CHALLENGE",
        "FREEZE": "DECLINE",
    }[risk.risk_zone.value]

    return {"transaction_id": transaction_id, "rba_recommendation": rba_action, "risk": risk.model_dump(mode="json")}

"""Mock NPCI Switch -- stands in for NPCI's UPI switch.

Field names mirror NPCI's published UPI API spec closely enough that
swapping this for the real switch is a transport/serialization change, not a
logic change (see docs/04-infrastructure-and-mocks.md). Directory resolution
here is entirely fictional/seeded -- in production this step is NPCI's own
Mapper/switch, not something Kurukshetra ever does itself.

Calls straight into kurukshetra.engine_core in-process: this and the risk
engine are logically separate systems but deploy as one consolidated backend
(docs/00-council-verdict.md's "fewest moving parts for a live demo").
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter
from pydantic import BaseModel

from kurukshetra.contracts import (
    EventType,
    PayerContext,
    Provenance,
    RecipientContext,
    RiskDecision,
    TransactionAnalysisRequest,
    TransactionDetails,
)
from kurukshetra.engine_core import evaluate

router = APIRouter(tags=["mock-npci-switch"])

# Fictional seeded directory: beneficiary_ref -> (resolved_name, mc_code)
DIRECTORY: dict[str, tuple[str, str]] = {
    "grocer.local@oksbi": ("Suresh Kirana Store", "5411"),
    "military.canteen.cctv@oksbi": ("Ramesh G", "0000"),
    "cbi.clearance.cell@sbi": ("Manoj Kumar", "0000"),
    "tneb.billing.officer@oksbi": ("Arun Kumar", "0000"),
}


class ReqValAdd(BaseModel):
    payer_id_hash: str
    beneficiary_ref_hash: str
    declared_purpose: str | None = None
    raw_uri: str | None = None
    arrived_via: str = "MANUAL_ENTRY"


class ReqPay(BaseModel):
    transaction_id: str
    payer_id_hash: str
    beneficiary_ref_hash: str
    resolved_name: str
    mc_code: str
    amount: float
    declared_purpose: str | None = None


def resolve_and_score_val_add(req: ReqValAdd) -> dict:
    resolved_name, mc_code = DIRECTORY.get(req.beneficiary_ref_hash, ("Unknown Individual", "0000"))
    transaction_id = f"txn_{uuid.uuid4().hex[:10]}"

    engine_req = TransactionAnalysisRequest(
        event=EventType.VPA_RESOLUTION,
        transaction_id=transaction_id,
        payer_context=PayerContext(payer_id_hash=req.payer_id_hash),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=req.beneficiary_ref_hash,
            resolved_name=resolved_name,
            mc_code=mc_code,
            raw_handle_string=req.beneficiary_ref_hash,
            declared_purpose=req.declared_purpose,
        ),
        provenance=Provenance(arrived_via=req.arrived_via, raw_uri=req.raw_uri),
    )
    risk: RiskDecision = evaluate(engine_req)

    return {
        "transaction_id": transaction_id,
        "resolved_name": resolved_name,
        "mc_code": mc_code,
        "risk": risk.model_dump(mode="json"),
    }


def score_pay(req: ReqPay) -> dict:
    engine_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=req.transaction_id,
        payer_context=PayerContext(payer_id_hash=req.payer_id_hash),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=req.beneficiary_ref_hash,
            resolved_name=req.resolved_name,
            mc_code=req.mc_code,
            raw_handle_string=req.beneficiary_ref_hash,
            declared_purpose=req.declared_purpose,
        ),
        transaction=TransactionDetails(amount=req.amount),
    )
    risk: RiskDecision = evaluate(engine_req)
    return {"transaction_id": req.transaction_id, "risk": risk.model_dump(mode="json")}


@router.post("/ReqValAdd")
def req_val_add(req: ReqValAdd) -> dict:
    return resolve_and_score_val_add(req)


@router.post("/ReqPay")
def req_pay(req: ReqPay) -> dict:
    return score_pay(req)

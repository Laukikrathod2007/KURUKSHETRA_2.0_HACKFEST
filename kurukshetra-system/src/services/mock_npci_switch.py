"""Mock NPCI Switch -- FastAPI service on port 8001.

Stands in for NPCI's UPI switch. Speaks `ReqValAdd`/`ReqPay`-shaped requests
(field names mirror NPCI's published UPI API spec closely enough that
swapping this for the real switch is a transport/serialization change, not a
logic change -- see docs/04-infrastructure-and-mocks.md).

Directory resolution here is entirely fictional/seeded -- in production this
step is NPCI's own Mapper/switch, not something Kurukshetra ever does itself.
"""
from __future__ import annotations

import uuid

import httpx
from fastapi import FastAPI
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

app = FastAPI(title="Mock NPCI Switch")

ENGINE_URL = "http://127.0.0.1:8000"

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


@app.post("/ReqValAdd")
def req_val_add(req: ReqValAdd) -> dict:
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
    decision = httpx.post(f"{ENGINE_URL}/v1/score-vpa", json=engine_req.model_dump(mode="json"), timeout=5.0)
    decision.raise_for_status()
    risk = RiskDecision.model_validate(decision.json())

    return {
        "transaction_id": transaction_id,
        "resolved_name": resolved_name,
        "mc_code": mc_code,
        "risk": risk.model_dump(mode="json"),
    }


@app.post("/ReqPay")
def req_pay(req: ReqPay) -> dict:
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
    decision = httpx.post(
        f"{ENGINE_URL}/v1/score-transaction", json=engine_req.model_dump(mode="json"), timeout=5.0
    )
    decision.raise_for_status()
    risk = RiskDecision.model_validate(decision.json())

    return {"transaction_id": req.transaction_id, "risk": risk.model_dump(mode="json")}


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}

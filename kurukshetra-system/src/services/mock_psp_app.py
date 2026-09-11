"""Mock PSP App -- FastAPI service on port 8002.

Stands in for a UPI app (GPay/PhonePe/Paytm/BHIM). This is the "client" a
demo operator drives -- it calls the Mock NPCI Switch at exactly the two
protocol hook points a real app would (ReqValAdd on recipient select,
ReqPay on tapping Pay), then renders the resulting decision.
"""
from __future__ import annotations

import httpx
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Mock PSP App")

SWITCH_URL = "http://127.0.0.1:8001"


class InitiatePayment(BaseModel):
    payer_id_hash: str
    beneficiary_ref_hash: str
    declared_purpose: str | None = None
    raw_uri: str | None = None
    arrived_via: str = "MANUAL_ENTRY"


class ConfirmPayment(BaseModel):
    transaction_id: str
    payer_id_hash: str
    beneficiary_ref_hash: str
    resolved_name: str
    mc_code: str
    amount: float
    declared_purpose: str | None = None


@app.post("/pay/initiate")
def initiate(req: InitiatePayment) -> dict:
    """EVENT 1: user has entered/selected a recipient. Resolve + Tier 0/1 score."""
    resp = httpx.post(f"{SWITCH_URL}/ReqValAdd", json=req.model_dump(), timeout=5.0)
    resp.raise_for_status()
    result = resp.json()

    zone = result["risk"]["risk_zone"]
    if zone == "FREEZE":
        ui = "RED — recipient is blocked before you can even proceed to amount entry."
    elif zone in ("COACH",):
        ui = "ORANGE — proceed with caution; you'll be asked to confirm explicitly at payment time."
    elif zone == "STEP_UP":
        ui = "YELLOW — recipient looks new; a light confirmation step will appear at payment time."
    else:
        ui = "GREEN — recognized recipient, nothing unusual."

    return {**result, "ui_hint": ui}


@app.post("/pay/confirm")
def confirm(req: ConfirmPayment) -> dict:
    """EVENT 2: user entered an amount and tapped Pay. Amount-dependent scoring + final decision."""
    resp = httpx.post(f"{SWITCH_URL}/ReqPay", json=req.model_dump(), timeout=5.0)
    resp.raise_for_status()
    result = resp.json()

    zone = result["risk"]["risk_zone"]
    action = {
        "ALLOW": "Proceeding straight to PIN entry. Kurukshetra is not called again for this transaction.",
        "STEP_UP": "Showing a lightweight confirmation screen before PIN entry.",
        "COACH": "Rendering an intervention screen; explicit acknowledgment required before PIN entry.",
        "FREEZE": "HARD BLOCK. PIN screen is not reached. No acknowledgment can bypass this.",
    }[zone]

    return {**result, "next_step": action}


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}

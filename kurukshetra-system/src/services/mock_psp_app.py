"""Mock PSP App -- stands in for a UPI app (GPay/PhonePe/Paytm/BHIM).

This is the "client" a demo operator drives -- it calls the mock switch at
exactly the two protocol hook points a real app would (ReqValAdd on
recipient select, ReqPay on tapping Pay), then renders the resulting
decision. Calls the switch's functions directly in-process (see
mock_npci_switch.py's module docstring for why).
"""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from services.mock_npci_switch import ReqPay, ReqValAdd, resolve_and_score_val_add, score_pay

router = APIRouter(tags=["mock-psp-app"])


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


_UI_HINT = {
    "FREEZE": "RED — recipient is blocked before you can even proceed to amount entry.",
    "COACH": "ORANGE — proceed with caution; you'll be asked to confirm explicitly at payment time.",
    "STEP_UP": "YELLOW — recipient looks new; a light confirmation step will appear at payment time.",
    "ALLOW": "GREEN — recognized recipient, nothing unusual.",
}

_NEXT_STEP = {
    "ALLOW": "Proceeding straight to PIN entry. Kurukshetra is not called again for this transaction.",
    "STEP_UP": "Showing a lightweight confirmation screen before PIN entry.",
    "COACH": "Rendering an intervention screen; explicit acknowledgment required before PIN entry.",
    "FREEZE": "HARD BLOCK. PIN screen is not reached. No acknowledgment can bypass this.",
}


@router.post("/pay/initiate")
def initiate(req: InitiatePayment) -> dict:
    """EVENT 1: user has entered/selected a recipient. Resolve + Tier 0/1 score."""
    result = resolve_and_score_val_add(ReqValAdd(**req.model_dump()))
    zone = result["risk"]["risk_zone"]
    return {**result, "ui_hint": _UI_HINT[zone]}


@router.post("/pay/confirm")
def confirm(req: ConfirmPayment) -> dict:
    """EVENT 2: user entered an amount and tapped Pay. Amount-dependent scoring + final decision."""
    result = score_pay(ReqPay(**req.model_dump()))
    zone = result["risk"]["risk_zone"]
    return {**result, "next_step": _NEXT_STEP[zone]}

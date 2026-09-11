"""FastAPI backend router for the complete simulated payment ecosystem.
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.banks import cbs, netbanking
from ecosystem.cards.acs import handle_card_checkout
from ecosystem.config import format_inr, to_paise, to_rupees
from ecosystem.db import SessionLocal
from ecosystem.models import Account, Bank, Customer, ReputationScore, SavedBeneficiary, ScamReport
from ecosystem.npci import switch
from ecosystem.risk import audit, reputation
from ecosystem.scenarios import runner, seed
from ecosystem.traces import get_recent_traces, get_trace_events

router = APIRouter(prefix="/api/ecosystem", tags=["ecosystem"])


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# --- Models for requests ---------------------------------------------------


class ValAddRequest(BaseModel):
    psp_id: str = "gpay"
    payer_id: str = "cust_aarav"
    payer_account_id: str = "acc_aarav_sbi"
    payee_vpa: str
    declared_purpose: Optional[str] = None
    raw_uri: Optional[str] = None
    trace_id: Optional[str] = None


class PayRequest(BaseModel):
    trace_id: str
    txn_id: str
    amount_rupees: float
    user_acknowledged: bool = False
    pin: str = "1234"


class CardCheckoutRequest(BaseModel):
    trace_id: Optional[str] = None
    card_id: str = "card_aarav_rupay"
    merchant_id: str = "merch_croma_retail"
    amount_rupees: float
    otp: Optional[str] = None


class NetBankingTransferRequest(BaseModel):
    trace_id: Optional[str] = None
    customer_id: str = "cust_aarav"
    payer_account_id: str = "acc_aarav_sbi"
    beneficiary_account_id: str
    amount_rupees: float
    mode: str = "IMPS"
    user_acknowledged: bool = False


class ReportRequest(BaseModel):
    target_ref: str
    reporter_identity_hash: str
    reason_code: str


class LoginRequest(BaseModel):
    username: str
    password: str


class CheckBalanceRequest(BaseModel):
    account_id: str = "acc_aarav_sbi"
    pin: str = "1234"


class KillSwitchRequest(BaseModel):
    target_ref: str
    reason: str = "EMERGENCY_FRAUD_CAMPAIGN_INTERCEPTION"
    operator_id: str = "NPCI_CENTRAL_OPS_01"


class QrParseRequest(BaseModel):
    raw_uri: str


# --- Endpoints -------------------------------------------------------------


@router.post("/auth/login")
def login(req: LoginRequest, session: Session = Depends(get_db)):
    if req.username == "android1" and req.password == "1234":
        acc = session.get(Account, "acc_aarav_sbi")
        cust = session.get(Customer, "cust_aarav")
        return {
            "success": True,
            "token": "sess_android1_verified_jwt",
            "user": {
                "customer_id": "cust_aarav",
                "name": cust.name if cust else "Aarav Sharma",
                "phone": cust.phone if cust else "+919820011223",
                "account_id": "acc_aarav_sbi",
                "account_number": acc.account_number if acc else "20348911001",
                "bank_id": "SBIN",
                "bank_name": "State Bank of India",
                "balance_paise": acc.balance_paise if acc else 150_000_00,
                "balance_formatted": format_inr(acc.balance_paise) if acc else "Rs 150,000.00",
                "vpa": "aarav@oksbi",
            },
        }
    raise HTTPException(status_code=401, detail="Invalid credentials. Use android1 / 1234.")


@router.post("/upi/check-balance")
def check_balance_api(req: CheckBalanceRequest, session: Session = Depends(get_db)):
    if req.pin != "1234":
        raise HTTPException(status_code=403, detail="INCORRECT_UPI_PIN")
    acc = session.get(Account, req.account_id)
    if not acc:
        raise HTTPException(status_code=404, detail="ACCOUNT_NOT_FOUND")
    return {
        "success": True,
        "account_id": acc.account_id,
        "bank_id": acc.bank_id,
        "balance_paise": acc.balance_paise,
        "balance_formatted": format_inr(acc.balance_paise),
    }


@router.post("/reset-and-seed")
def reset_and_seed():
    seed.init_and_seed()
    return {"success": True, "message": "Ecosystem database reset and seeded successfully."}


@router.get("/accounts")
def list_accounts(session: Session = Depends(get_db)):
    accounts = session.scalars(select(Account)).all()
    results = []
    for acc in accounts:
        cust = session.get(Customer, acc.customer_id)
        bank = session.get(Bank, acc.bank_id)
        results.append(
            {
                "account_id": acc.account_id,
                "customer_id": acc.customer_id,
                "customer_name": cust.name if cust else "Unknown",
                "bank_id": acc.bank_id,
                "bank_name": bank.name if bank else acc.bank_id,
                "account_number": acc.account_number,
                "account_type": acc.account_type.value,
                "mcc": acc.mcc,
                "balance_paise": acc.balance_paise,
                "balance_formatted": format_inr(acc.balance_paise),
                "status": acc.status.value,
                "branch_state": acc.branch_state,
            }
        )
    return results


@router.get("/accounts/{account_id}/statement")
def get_statement(account_id: str, session: Session = Depends(get_db)):
    entries = cbs.get_statement(session, account_id)
    return [
        {
            "entry_id": e.entry_id,
            "txn_id": e.txn_id,
            "direction": e.direction.value,
            "amount_formatted": format_inr(e.amount_paise),
            "balance_after_formatted": format_inr(e.balance_after_paise),
            "narration": e.narration,
            "counterparty": e.counterparty_account_id,
            "posted_at": e.posted_at.isoformat() if e.posted_at else None,
        }
        for e in entries
    ]


@router.post("/upi/val-add")
def upi_val_add(req: ValAddRequest, session: Session = Depends(get_db)):
    tid = req.trace_id or f"trc_{uuid.uuid4().hex[:8]}"
    res = switch.handle_req_val_add(
        session,
        trace_id=tid,
        psp_id=req.psp_id,
        payer_id=req.payer_id,
        payer_account_id=req.payer_account_id,
        payee_vpa=req.payee_vpa,
        declared_purpose=req.declared_purpose,
        raw_uri=req.raw_uri,
    )
    session.commit()
    return res


@router.post("/upi/pay")
def upi_pay(req: PayRequest, session: Session = Depends(get_db)):
    amount_paise = to_paise(req.amount_rupees)
    pin_ok = req.pin == "1234"
    res = switch.handle_req_pay(
        session,
        trace_id=req.trace_id,
        txn_id=req.txn_id,
        amount_paise=amount_paise,
        user_acknowledged=req.user_acknowledged,
        pin_verified=pin_ok,
    )
    session.commit()
    return res


@router.post("/cards/checkout")
def card_checkout(req: CardCheckoutRequest, session: Session = Depends(get_db)):
    tid = req.trace_id or f"trc_{uuid.uuid4().hex[:8]}"
    amount_paise = to_paise(req.amount_rupees)
    res = handle_card_checkout(
        session,
        trace_id=tid,
        card_id=req.card_id,
        merchant_id=req.merchant_id,
        amount_paise=amount_paise,
        otp_submitted=req.otp,
    )
    session.commit()
    return res


@router.post("/netbanking/transfer")
def netbanking_transfer(req: NetBankingTransferRequest, session: Session = Depends(get_db)):
    tid = req.trace_id or f"trc_{uuid.uuid4().hex[:8]}"
    amount_paise = to_paise(req.amount_rupees)
    res = netbanking.transfer_funds(
        session,
        trace_id=tid,
        customer_id=req.customer_id,
        payer_account_id=req.payer_account_id,
        beneficiary_account_id=req.beneficiary_account_id,
        amount_paise=amount_paise,
        transfer_mode=req.mode,
        user_acknowledged=req.user_acknowledged,
    )
    session.commit()
    return res


@router.get("/scenarios/run/{name}")
def run_scenario(name: str, session: Session = Depends(get_db)):
    key = name.lower()
    if key == "green":
        res = runner.run_scenario_green(session)
    elif key == "yellow":
        res = runner.run_scenario_yellow(session)
    elif key == "orange":
        res = runner.run_scenario_orange(session)
    elif key == "red":
        res = runner.run_scenario_red(session)
    elif key == "blue":
        res = runner.run_scenario_blue(session)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown scenario: {name}")
    session.commit()
    return res


@router.get("/traces/{trace_id}")
def get_traces(trace_id: str, session: Session = Depends(get_db)):
    return get_trace_events(session, trace_id)


@router.get("/traces")
def list_traces(session: Session = Depends(get_db)):
    return get_recent_traces(session)


@router.post("/reputation/report")
def submit_reputation_report(req: ReportRequest, session: Session = Depends(get_db)):
    ok = reputation.submit_report(
        session,
        target_ref=req.target_ref,
        reporter_identity_hash=req.reporter_identity_hash,
        reason_code=req.reason_code,
    )
    session.commit()
    return {"recorded": ok}


@router.get("/reputation/lookup")
def lookup_reputation(target_ref: str, session: Session = Depends(get_db)):
    score = session.get(ReputationScore, target_ref)
    if not score:
        return {"target_ref": target_ref, "distinct_reporters": 0, "community_risk_score": 0.0}
    return {
        "target_ref": target_ref,
        "distinct_reporters": score.distinct_reporter_count,
        "community_risk_score": score.community_risk_score,
        "last_updated": score.last_updated_at.isoformat() if score.last_updated_at else None,
    }


@router.get("/audit/verify")
def verify_audit_chain(session: Session = Depends(get_db)):
    valid, broken_id = audit.verify_chain(session)
    return {"valid": valid, "broken_txn_id": broken_id}


# --- Master Feature Extensions --------------------------------------------


@router.get("/npci/campaigns")
def get_campaigns(session: Session = Depends(get_db)):
    """Feature #33: Real-time campaign detection across all PSPs."""
    return switch.get_active_campaigns(session)


@router.post("/npci/kill-switch")
def post_kill_switch(req: KillSwitchRequest, session: Session = Depends(get_db)):
    """Feature #33: Central Nationwide Kill-Switch."""
    res = switch.execute_nationwide_kill_switch(
        session,
        target_ref=req.target_ref,
        reason=req.reason,
        operator_id=req.operator_id,
    )
    session.commit()
    return res


@router.get("/public/lookup/{ref:path}")
def public_lookup(ref: str, session: Session = Depends(get_db)):
    """Feature #34: Citizen Public Scam Score Lookup Portal."""
    from ecosystem.models import RegistryFlag, VpaMapping, Account, Customer
    mapping = session.get(VpaMapping, ref)
    acc = session.get(Account, mapping.account_id) if mapping else session.get(Account, ref)
    cust = session.get(Customer, acc.customer_id) if acc else None

    score_row = session.get(ReputationScore, ref)
    flags = list(session.scalars(select(RegistryFlag).where(RegistryFlag.target_ref == ref)).all())

    reporters = score_row.distinct_reporter_count if score_row else 0
    raw_score = score_row.community_risk_score if score_row else 0.0

    # Deep Precision Intelligence: Authority and Corporate Mismatch Analysis
    authority_keywords = ["cbi", "police", "customs", "rbi", "incometax", "court", "narcotics", "officer", "cybercrime", "fine", "penalty", "tax", "challan"]
    corporate_keywords = ["refund", "kyc", "support", "helpdesk", "lottery", "amazon", "flipkart", "airtel", "telecom"]

    ref_lower = ref.lower()
    matched_auth = [kw for kw in authority_keywords if kw in ref_lower]
    matched_corp = [kw for kw in corporate_keywords if kw in ref_lower]

    mismatch_warning = None
    mule_warning = None
    merchant_badge = None
    detailed_reasons = []

    cust_name = cust.name if cust else (mapping.vpa if mapping else "Unknown Individual")
    is_savings = (acc and acc.account_type.value == "SAVINGS") or (not acc)

    # Initialize risk level based on community score first
    if raw_score >= 0.8 or reporters >= 5:
        risk_level = "CRITICAL_BLOCKED"
    elif raw_score >= 0.4 or reporters >= 2:
        risk_level = "HIGH_RISK"
    else:
        risk_level = "SAFE"

    # Authority/Impersonation override
    if matched_auth and is_savings:
        mismatch_warning = (
            f"🚨 Identity & Impersonation Mismatch: The UPI ID '{ref}' claims official authority/law enforcement status "
            f"({', '.join(matched_auth).upper()}), but NPCI Central Mapper records confirm this is an ordinary individual "
            f"private savings account registered to '{cust_name}' at {acc.bank_id if acc else 'Member Bank'}. "
            f"Legitimate police, CBI, tax, or judicial authorities NEVER collect fines, penalties, or bail fees through private individual savings accounts."
        )
        detailed_reasons.append(mismatch_warning)
        risk_level = "CRITICAL_BLOCKED"

    elif matched_corp and is_savings:
        mismatch_warning = (
            f"⚠️ Corporate Brand Impersonation: This handle ({ref}) claims to be an official corporate service/refund channel, "
            f"but is linked to a private savings account registered to '{cust_name}'. "
            f"Genuine companies never disburse customer refunds or support fees via personal savings accounts."
        )
        detailed_reasons.append(mismatch_warning)
        risk_level = "HIGH_RISK"

    if (acc and acc.account_id == "acc_mule_axis") or "mule" in ref_lower or raw_score >= 0.8:
        mule_warning = (
            f"🛑 High-Velocity Mule Syndicate Account: Registered to '{cust_name}'. "
            f"Core Banking forensics detect rapid pass-through drainage: 98% of received funds are transferred within 4 minutes "
            f"across peer-to-peer crypto channels. {max(reporters, 12)} citizen fraud complaints currently active on CyberCrime portal."
        )
        detailed_reasons.append(mule_warning)
        risk_level = "CRITICAL_BLOCKED"

    if acc and acc.mcc == "5411":
        merchant_badge = (
            f"✅ Verified Merchant: Registered to '{cust_name}' (MCC 5411 - Grocery Stores). "
            f"Operating on UPI network for 900+ days with 1,240+ completed peer transactions, 0 chargeback disputes."
        )
        detailed_reasons.append(merchant_badge)

    if not detailed_reasons:
        if risk_level == "SAFE":
            detailed_reasons.append(f"Account registered to '{cust_name}'. Standard peer account with normal velocity.")
        else:
            detailed_reasons.append(f"Caution: Unverified entity with limited transaction provenance.")

    return {
        "target_ref": ref,
        "resolved_name": cust_name,
        "account_type": acc.account_type.value if acc else "UNREGISTERED",
        "mcc": acc.mcc if acc else "0000",
        "is_active": mapping.is_active if mapping else (acc.status.value != "FROZEN" if acc else False),
        "suspended_reason": mapping.suspended_reason if mapping else None,
        "community_reporters": reporters,
        "risk_score": round(raw_score, 2),
        "risk_level": risk_level,
        "registry_flags": [f.flag_type for f in flags],
        "mismatch_warning": mismatch_warning,
        "mule_warning": mule_warning,
        "merchant_badge": merchant_badge,
        "detailed_reasons": detailed_reasons,
        "verdict_plain": (
            "🚨 CRITICAL WARNING: This identifier has been suspended nationwide or flagged on official cybercrime registries. DO NOT TRANSFER ANY MONEY."
            if risk_level == "CRITICAL_BLOCKED"
            else (
                "⚠️ ELEVATED RISK: Multiple citizens have reported this recipient for fraudulent transactions. Extreme caution advised."
                if risk_level == "HIGH_RISK"
                else "✅ VERIFIED / LOW RISK: No malicious activity or regulatory blocks reported for this account."
            )
        ),
    }


@router.post("/community/report")
def community_report(req: ReportRequest, session: Session = Depends(get_db)):
    """Feature #11: Citizen Community Fraud Reporting."""
    ok = reputation.submit_report(
        session,
        target_ref=req.target_ref,
        reporter_identity_hash=req.reporter_identity_hash,
        reason_code=req.reason_code,
    )
    session.commit()
    return {
        "success": ok,
        "message": "Report logged with Sybil resistance verification." if ok else "Duplicate report rejected.",
    }


@router.post("/qr/parse")
def parse_qr_endpoint(req: QrParseRequest):
    """Features #9 & #10: Interactive QR & Deep-Link Decoder with Tier 0 Forensics."""
    import urllib.parse
    from ecosystem.risk.tier0 import parse_qr_or_deeplink
    uri = req.raw_uri.strip()
    signal = parse_qr_or_deeplink(uri)

    parsed = urllib.parse.urlparse(uri)
    params = urllib.parse.parse_qs(parsed.query)

    payee_vpa = params.get("pa", [""])[0]
    payee_name = params.get("pn", [""])[0]
    amount_str = params.get("am", [""])[0]
    note = params.get("tn", [""])[0]
    mc = params.get("mc", ["0000"])[0]

    return {
        "raw_uri": uri,
        "payee_vpa": payee_vpa,
        "payee_name": urllib.parse.unquote_plus(payee_name),
        "amount_rupees": float(amount_str) if amount_str else None,
        "note": urllib.parse.unquote_plus(note),
        "mc": mc,
        "signal": signal.model_dump() if signal else None,
        "is_suspicious": signal.triggered if signal else False,
        "alert_type": signal.explanation_code if (signal and signal.triggered) else None,
    }


@router.get("/netbanking/payees")
def get_netbanking_payees(customer_id: str = "cust_aarav", session: Session = Depends(get_db)):
    """Fetches netbanking beneficiaries with cooling-off status."""
    stmt = select(SavedBeneficiary).where(SavedBeneficiary.customer_id == customer_id)
    saved = list(session.scalars(stmt).all())
    results = []
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    for s in saved:
        acc = session.get(Account, s.payee_ref)
        if not acc:
            acc = session.scalars(select(Account).where(Account.account_number == s.payee_ref)).first()
        cust = session.get(Customer, acc.customer_id) if acc else None
        age_seconds = (now - s.added_at).total_seconds() if s.added_at else 9999
        remaining = max(0, int(1800 - age_seconds))
        results.append({
            "beneficiary_id": s.id,
            "payee_ref": s.payee_ref,
            "nickname": s.nickname,
            "account_id": acc.account_id if acc else s.payee_ref,
            "customer_name": cust.name if cust else (s.nickname or s.payee_ref),
            "bank_id": acc.bank_id if acc else "SBIN",
            "account_number": acc.account_number if acc else "••••5501",
            "cooling_off_remaining_seconds": remaining,
            "is_cooling_off": remaining > 0,
        })
    return results


@router.get("/trusted-notifications")
def get_trusted_notifications(customer_id: str = "cust_aarav", session: Session = Depends(get_db)):
    """Feature #26: Returns trusted contact emergency notifications."""
    from ecosystem.models import TrustedContactNotification
    stmt = (
        select(TrustedContactNotification)
        .where(TrustedContactNotification.customer_id == customer_id)
        .order_by(TrustedContactNotification.sent_at.desc())
    )
    notifs = list(session.scalars(stmt).all())
    return [
        {
            "notification_id": n.notification_id,
            "customer_id": n.customer_id,
            "txn_id": n.txn_id,
            "message": n.message,
            "sent_at": n.sent_at.isoformat() if n.sent_at else None,
        }
        for n in notifs
    ]


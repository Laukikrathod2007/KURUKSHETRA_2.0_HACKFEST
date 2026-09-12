"""Tier 0 -- always-on, in-memory, <10ms target, zero-privileged-access checks.

Features:
- Known beneficiary gate (bypasses heavy Tier 1 execution for established contacts)
- Feature #4: UPI Handle Authority Pattern Detection
- Feature #3: Beneficiary Name vs Claimed Identity
- Feature #9 & #10: QR and Deep-Link Forensics
"""
from __future__ import annotations

import re
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.models import AppLocalHistory, SavedBeneficiary
from ecosystem.risk.contracts import (
    DetectionSignal,
    RecipientContext,
    Severity,
    SignalLabel,
)

AUTHORITY_KEYWORDS = [
    "cbi", "rbi", "police", "customs", "ebill", "tneb", "bescom",
    "incometax", "court", "narcotics", "officer", "cybercrime",
    "fine", "penalty", "tax", "challan",
]
CORPORATE_IMPERSONATION_KEYWORDS = [
    "refund", "kyc", "support", "helpdesk", "lottery", "amazon", "flipkart", "airtel", "telecom",
]
AUTHORITY_MC_CODES = {"9311", "9399"}
OFFICIAL_PURPOSE_ACCOUNT_TYPES = {"GOVT_FINE", "COURT_BAIL", "TAX_PENALTY", "CHALLAN"}


def is_known_beneficiary(
    session: Session,
    customer_id: str,
    beneficiary_ref: str,
    psp_id: Optional[str] = None,
) -> bool:
    """Check if payer has prior successful transactions or a saved contact."""
    # Check saved beneficiaries
    saved_stmt = select(SavedBeneficiary).where(
        SavedBeneficiary.customer_id == customer_id,
        SavedBeneficiary.payee_ref == beneficiary_ref,
    )
    if psp_id:
        saved_stmt = saved_stmt.where(
            (SavedBeneficiary.psp_id == psp_id) | (SavedBeneficiary.psp_id.is_(None))
        )
    if session.scalar(saved_stmt):
        return True

    # Check app-local history
    hist_stmt = select(AppLocalHistory).where(
        AppLocalHistory.customer_id == customer_id,
        AppLocalHistory.payee_ref == beneficiary_ref,
        AppLocalHistory.succeeded.is_(True),
    )
    if psp_id:
        hist_stmt = hist_stmt.where(AppLocalHistory.psp_id == psp_id)
    return session.scalar(hist_stmt) is not None


def check_authority_handle_pattern(recipient: RecipientContext) -> DetectionSignal:
    """Feature #4 -- UPI Handle Authority Pattern Detection."""
    handle = (recipient.raw_handle_string or "").lower()
    matched = [kw for kw in AUTHORITY_KEYWORDS if kw in handle]
    is_unverified_personal = (recipient.mc_code or "0000") not in AUTHORITY_MC_CODES

    triggered = bool(matched) and is_unverified_personal
    return DetectionSignal(
        feature_id=4,
        feature_name="UPI Handle Authority Pattern Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.35 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"matched_keywords": matched, "mc_code": recipient.mc_code},
        explanation_code="AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT"
        if triggered
        else "NO_AUTHORITY_HANDLE_MATCH",
    )


def check_name_clash(recipient: RecipientContext) -> DetectionSignal:
    """Feature #3 -- Beneficiary Name vs Claimed Identity."""
    handle = (recipient.raw_handle_string or "").lower()
    handle_claims_authority = any(kw in handle for kw in AUTHORITY_KEYWORDS)
    declared_official = (recipient.declared_purpose or "") in OFFICIAL_PURPOSE_ACCOUNT_TYPES
    is_personal_savings = (recipient.mc_code or "0000") == "0000"

    triggered = (handle_claims_authority or declared_official) and is_personal_savings
    return DetectionSignal(
        feature_id=3,
        feature_name="Beneficiary Name vs. Claimed Identity",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "resolved_name": recipient.resolved_name,
            "declared_purpose": recipient.declared_purpose,
            "mc_code": recipient.mc_code,
        },
        explanation_code="AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH"
        if triggered
        else "NO_NAME_CLASH",
    )


def parse_qr_or_deeplink(raw_uri: str | None) -> DetectionSignal | None:
    """Features #9 and #10 -- QR / Deep-link forensics."""
    if not raw_uri:
        return None

    match = re.search(r"[?&]am=([0-9.]+)", raw_uri)
    has_amount = match is not None
    is_shortener = any(s in raw_uri for s in ("bit.ly", "tinyurl", "goo.gl"))
    note_match = re.search(r"[?&]tn=([A-Za-z0-9_%+-]+)", raw_uri)
    suspicious_note_terms = ("kyc", "verify", "clear", "reactivat", "claim", "cashback", "bonus")
    note = (note_match.group(1) if note_match else "").lower()
    suspicious_note = any(term in note for term in suspicious_note_terms)

    triggered = has_amount or is_shortener or suspicious_note
    return DetectionSignal(
        feature_id=9,
        feature_name="QR/Deep-Link Forensics",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.3 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"has_prefilled_amount": has_amount, "is_shortener": is_shortener, "note": note},
        explanation_code="QR_OR_LINK_PREFILLED_DEBIT_TRAP"
        if triggered
        else "URI_LOOKS_BENIGN",
    )

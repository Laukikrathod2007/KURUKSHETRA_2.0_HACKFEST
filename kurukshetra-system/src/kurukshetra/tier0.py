"""Tier 0 -- always-on, in-memory, <10ms target, zero-privileged-access checks.

Per docs/03-feature-tier-map.md, these are the genuinely REAL detectors:
feature #3 (name clash), feature #4 (authority-keyword pattern), plus the
known-beneficiary lookup that gates escalation to Tier 1.
"""
from __future__ import annotations

import re

from sqlalchemy.orm import Session

from kurukshetra.contracts import DetectionSignal, RecipientContext, Severity, SignalLabel
from kurukshetra.models import PayerBeneficiaryLink

AUTHORITY_KEYWORDS = [
    "cbi", "rbi", "police", "customs", "ebill", "tneb", "bescom",
    "incometax", "court", "narcotics", "officer",
]
AUTHORITY_MC_CODES = {"9311", "9399"}

OFFICIAL_PURPOSE_ACCOUNT_TYPES = {"GOVT_FINE", "COURT_BAIL"}


def is_known_beneficiary(session: Session, payer_id: str, beneficiary_ref: str) -> bool:
    link = (
        session.query(PayerBeneficiaryLink)
        .filter_by(payer_id=payer_id, beneficiary_ref=beneficiary_ref)
        .one_or_none()
    )
    return link is not None and link.successful_transaction_count > 0


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
        explanation_code="AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT" if triggered else "NO_AUTHORITY_HANDLE_MATCH",
    )


def check_name_clash(recipient: RecipientContext) -> DetectionSignal:
    """Feature #3 -- Beneficiary Name vs. Claimed Identity."""
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
        explanation_code="AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH" if triggered else "NO_NAME_CLASH",
    )


def parse_qr_or_deeplink(raw_uri: str | None) -> DetectionSignal | None:
    """Features #9 and #10 -- pure URI parsing, no external dependency."""
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
        explanation_code="QR_OR_LINK_PREFILLED_DEBIT_TRAP" if triggered else "URI_LOOKS_BENIGN",
    )

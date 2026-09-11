"""Public Scam Score Lookup -- feature #34.

The one feature with no bank/NPCI dependency at all (see
docs/00-implementation-plan.md Phase 1): any citizen can check a UPI ID's
risk profile before paying. Reads the same Reputation DB that backs feature
#11, plus whatever recipient forensics the Mock CBS has -- but never exposes
raw account internals, only an aggregate score and coarse reasons.
"""
from __future__ import annotations

import datetime as dt

from fastapi import APIRouter
from sqlalchemy.orm import Session

from kurukshetra.db import SessionLocal
from kurukshetra.models import CbsAccount, ReputationScore, SwitchMetric

router = APIRouter(tags=["public-lookup"])


def _build_public_profile(session: Session, target_ref: str) -> dict:
    reputation = session.get(ReputationScore, target_ref)
    account = session.get(CbsAccount, target_ref)
    metrics = session.get(SwitchMetric, target_ref)

    score = 0
    reasons: list[str] = []
    positives: list[str] = []
    have_any_data = any(x is not None for x in (reputation, account, metrics))

    if reputation is not None and reputation.distinct_reporter_count >= 3:
        score += min(60, reputation.distinct_reporter_count * 20)
        reasons.append(f"{reputation.distinct_reporter_count} independent users reported this account")

    if account is not None:
        age_days = (dt.datetime.utcnow() - account.opened_at).days
        if age_days < 30:
            score += 25
            reasons.append(f"Account is only {age_days} days old")
        else:
            positives.append(f"Account has been open {age_days} days")
        if account.kyc_tier == "BASIC_OTP":
            score += 10
            reasons.append("Minimal identity verification on the account")
        else:
            positives.append("Full KYC verification on the account")

    if metrics is not None and metrics.lookup_count >= 10:
        abandon_ratio = 1.0 - (metrics.pay_count / metrics.lookup_count)
        if abandon_ratio >= 0.85:
            score += 15
            reasons.append(f"{int(abandon_ratio * 100)}% of people who looked this up chose not to pay")

    score = min(score, 100)
    if not have_any_data:
        verdict = "NO DATA -- this account has no history in our system"
    elif score >= 70:
        verdict = "HIGH RISK -- do not pay"
    elif score >= 35:
        verdict = "CAUTION -- verify independently before paying"
    else:
        verdict = "LOW RISK -- no negative signals found"

    return {
        "target": target_ref,
        "risk_score_out_of_100": score,
        "verdict": verdict,
        "reasons": reasons,
        "positive_signals": positives,
        "disclaimer": "Community-sourced and simulated data. A clean score is not a guarantee of safety.",
    }


@router.get("/public/lookup/{target_ref}")
def public_lookup(target_ref: str) -> dict:
    session = SessionLocal()
    try:
        return _build_public_profile(session, target_ref)
    finally:
        session.close()

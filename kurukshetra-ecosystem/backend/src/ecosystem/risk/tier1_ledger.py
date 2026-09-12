"""Tier 1, amount-dependent, REAL detectors -- run against AppLocalHistory.

Features:
- Feature #6: New-Beneficiary High-Value Outlier (Z-score vs payer historical median)
- Feature #14: Drip Scam Escalation Detection (geometric growth with shrinking intervals)
- Feature #15: Threshold Evasion / Smurfing (multiple sub-threshold transfers in 60 min)
- Feature #16: Refund Reversal Baiting ("Accidental Transfer" trap)
- Feature #17: UPI Collect Request Abuse Detection
- Feature #27: Purpose Declaration Contradiction Detection
- Feature #35: Post-Hold Escalation Detection
"""
from __future__ import annotations

import datetime as dt
import statistics
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.config import (
    DRIP_GROWTH_FACTOR,
    HIGH_VALUE_Z_SCORE,
    POST_HOLD_ESCALATION_WINDOW_MINUTES,
    REFUND_MAX_INBOUND_PAISE,
    REFUND_RATIO_THRESHOLD,
    REFUND_WINDOW_HOURS,
    SMURF_THRESHOLD_PAISE,
    SMURF_WINDOW_MINUTES,
    format_inr,
)
from ecosystem.models import AppLocalHistory, Direction
from ecosystem.risk.contracts import (
    DetectionSignal,
    RecipientContext,
    Severity,
    SignalLabel,
)

OFFICIAL_PURPOSE_ACCOUNT_TYPES = {"GOVT_FINE", "COURT_BAIL", "TAX_PENALTY", "CHALLAN"}
DECEPTIVE_COLLECT_TERMS = ("claim", "refund", "cashback", "bonus", "receive", "reward")


def check_high_value_outlier(
    session: Session,
    customer_id: str,
    amount_paise: int,
    psp_id: Optional[str] = None,
) -> DetectionSignal:
    """Feature #6 -- New-Beneficiary High-Value Outlier."""
    stmt = select(AppLocalHistory.amount_paise).where(
        AppLocalHistory.customer_id == customer_id,
        AppLocalHistory.direction == Direction.DEBIT,
        AppLocalHistory.succeeded.is_(True),
    )
    if psp_id:
        stmt = stmt.where(AppLocalHistory.psp_id == psp_id)

    rows = list(session.scalars(stmt).all())
    triggered = False
    z_score = 0.0
    if len(rows) >= 3:
        mean = statistics.mean(rows)
        stdev = statistics.pstdev(rows) or 1.0
        z_score = (amount_paise - mean) / stdev
        triggered = z_score > HIGH_VALUE_Z_SCORE

    return DetectionSignal(
        feature_id=6,
        feature_name="New-Beneficiary High-Value Outlier",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.3 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={
            "amount": format_inr(amount_paise),
            "amount_paise": amount_paise,
            "z_score": round(z_score, 2),
            "sample_size": len(rows),
        },
        explanation_code="AMOUNT_EXTREME_OUTLIER_VS_HISTORY"
        if triggered
        else "AMOUNT_WITHIN_NORMAL_RANGE",
    )


def check_drip_escalation(
    session: Session,
    customer_id: str,
    beneficiary_ref: str,
    amount_paise: int,
    psp_id: Optional[str] = None,
) -> DetectionSignal:
    """Feature #14 -- Drip Scam Escalation Detection."""
    stmt = (
        select(AppLocalHistory.amount_paise, AppLocalHistory.occurred_at)
        .where(
            AppLocalHistory.customer_id == customer_id,
            AppLocalHistory.payee_ref == beneficiary_ref,
            AppLocalHistory.direction == Direction.DEBIT,
            AppLocalHistory.succeeded.is_(True),
        )
        .order_by(AppLocalHistory.occurred_at.asc())
    )
    if psp_id:
        stmt = stmt.where(AppLocalHistory.psp_id == psp_id)

    rows = list(session.execute(stmt).all())
    triggered = False
    if rows:
        prev_amount, _ = rows[-1]
        if prev_amount > 0 and amount_paise >= DRIP_GROWTH_FACTOR * prev_amount:
            triggered = True

    return DetectionSignal(
        feature_id=14,
        feature_name="Drip Scam Escalation Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.35 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={
            "amount_paise": amount_paise,
            "amount": format_inr(amount_paise),
            "prior_transfer_count": len(rows),
        },
        explanation_code="GEOMETRIC_ESCALATION_TO_SAME_RECIPIENT"
        if triggered
        else "NO_ESCALATION_PATTERN",
    )


def check_threshold_evasion(
    session: Session,
    customer_id: str,
    beneficiary_ref: str,
    amount_paise: int,
    psp_id: Optional[str] = None,
    threshold_paise: int = SMURF_THRESHOLD_PAISE,
) -> DetectionSignal:
    """Feature #15 -- Threshold Evasion (Smurfing)."""
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    window_start = now - dt.timedelta(minutes=SMURF_WINDOW_MINUTES)
    stmt = select(AppLocalHistory.amount_paise).where(
        AppLocalHistory.customer_id == customer_id,
        AppLocalHistory.payee_ref == beneficiary_ref,
        AppLocalHistory.direction == Direction.DEBIT,
        AppLocalHistory.occurred_at >= window_start,
    )
    if psp_id:
        stmt = stmt.where(AppLocalHistory.psp_id == psp_id)

    rows = list(session.scalars(stmt).all())
    all_amounts = rows + [amount_paise]
    all_sub_threshold = all(a < threshold_paise for a in all_amounts)
    cumulative = sum(all_amounts)
    triggered = len(all_amounts) >= 3 and all_sub_threshold and cumulative > threshold_paise

    return DetectionSignal(
        feature_id=15,
        feature_name="Threshold Evasion (Smurfing) Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "transfer_count_in_window": len(all_amounts),
            "cumulative_amount": format_inr(cumulative),
            "threshold": format_inr(threshold_paise),
        },
        explanation_code="STRUCTURED_SUB_THRESHOLD_SPLITTING"
        if triggered
        else "NO_THRESHOLD_EVASION",
    )


def check_refund_reversal(
    session: Session,
    customer_id: str,
    beneficiary_ref: str,
    amount_paise: int,
    psp_id: Optional[str] = None,
) -> DetectionSignal:
    """Feature #16 -- Refund Reversal Scam Detection."""
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    window_start = now - dt.timedelta(hours=REFUND_WINDOW_HOURS)
    stmt = (
        select(AppLocalHistory.amount_paise)
        .where(
            AppLocalHistory.customer_id == customer_id,
            AppLocalHistory.payee_ref == beneficiary_ref,
            AppLocalHistory.direction == Direction.CREDIT,
            AppLocalHistory.occurred_at >= window_start,
        )
        .order_by(AppLocalHistory.occurred_at.desc())
    )
    if psp_id:
        stmt = stmt.where(AppLocalHistory.psp_id == psp_id)

    inbound = session.scalars(stmt).first()
    triggered = False
    ratio = None
    if inbound is not None and 0 < inbound <= REFUND_MAX_INBOUND_PAISE:
        ratio = amount_paise / inbound
        triggered = ratio > REFUND_RATIO_THRESHOLD

    return DetectionSignal(
        feature_id=16,
        feature_name="Refund Reversal Scam Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.45 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "inbound_amount": format_inr(inbound) if inbound is not None else None,
            "outbound_amount": format_inr(amount_paise),
            "ratio": round(ratio, 1) if ratio else None,
        },
        explanation_code="ACCIDENTAL_TRANSFER_TRAP"
        if triggered
        else "NO_REFUND_REVERSAL_PATTERN",
    )


def check_collect_request_abuse(
    collect_note: str | None,
    transaction_type: str,
) -> DetectionSignal | None:
    """Feature #17 -- UPI Collect Request Abuse Detection."""
    if transaction_type != "COLLECT_REQUEST":
        return None
    note = (collect_note or "").lower()
    matched = [term for term in DECEPTIVE_COLLECT_TERMS if term in note]
    triggered = bool(matched)
    return DetectionSignal(
        feature_id=17,
        feature_name="UPI Collect Request Abuse Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.5 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"note": note, "matched_terms": matched},
        explanation_code="DECEPTIVE_COLLECT_REQUEST_NOTE"
        if triggered
        else "COLLECT_NOTE_LOOKS_BENIGN",
    )


def check_purpose_contradiction(recipient: RecipientContext) -> DetectionSignal:
    """Feature #27 -- Purpose Declaration Contradiction Detection."""
    declared_official = (recipient.declared_purpose or "") in OFFICIAL_PURPOSE_ACCOUNT_TYPES
    is_personal_savings = (recipient.mc_code or "0000") == "0000"
    triggered = declared_official and is_personal_savings
    return DetectionSignal(
        feature_id=27,
        feature_name="Purpose Declaration Contradiction Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"declared_purpose": recipient.declared_purpose, "mc_code": recipient.mc_code},
        explanation_code="DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE"
        if triggered
        else "PURPOSE_CONSISTENT",
    )


def check_post_hold_escalation(
    session: Session,
    customer_id: str,
    beneficiary_ref: str,
    amount_paise: int,
    psp_id: Optional[str] = None,
) -> DetectionSignal:
    """Feature #35 -- Post-Hold Escalation Detection."""
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    window_start = now - dt.timedelta(minutes=POST_HOLD_ESCALATION_WINDOW_MINUTES)
    stmt = (
        select(AppLocalHistory.amount_paise)
        .where(
            AppLocalHistory.customer_id == customer_id,
            AppLocalHistory.payee_ref == beneficiary_ref,
            AppLocalHistory.direction == Direction.DEBIT,
            AppLocalHistory.succeeded.is_(True),
            AppLocalHistory.was_held.is_(True),
            AppLocalHistory.occurred_at >= window_start,
        )
    )
    if psp_id:
        stmt = stmt.where(AppLocalHistory.psp_id == psp_id)

    recent_held = session.scalars(stmt).first()
    triggered = recent_held is not None and amount_paise > recent_held
    return DetectionSignal(
        feature_id=35,
        feature_name="Post-Hold Escalation Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.5 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "previous_held_amount": format_inr(recent_held) if recent_held else None,
            "new_amount": format_inr(amount_paise),
        },
        explanation_code="COACHED_COOLING_OFF_BYPASS"
        if triggered
        else "NO_POST_HOLD_ESCALATION",
    )

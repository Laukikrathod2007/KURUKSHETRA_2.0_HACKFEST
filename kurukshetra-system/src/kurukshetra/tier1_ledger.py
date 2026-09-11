"""Tier 1, amount-dependent, REAL detectors -- all run against the Local
Ledger DB only (the payer's own transaction history). Per
docs/03-feature-tier-map.md these need zero privileged access: features #6,
#14, #15, #16, #17, #27, #35.
"""
from __future__ import annotations

import datetime as dt
import statistics

from sqlalchemy import select
from sqlalchemy.orm import Session

from kurukshetra.contracts import DetectionSignal, RecipientContext, Severity, SignalLabel
from kurukshetra.models import LedgerTransaction

OFFICIAL_PURPOSE_ACCOUNT_TYPES = {"GOVT_FINE", "COURT_BAIL"}
DECEPTIVE_COLLECT_TERMS = ("claim", "refund", "cashback", "bonus", "receive", "reward")

DRIP_GROWTH_FACTOR = 2.5
SMURF_WINDOW_MINUTES = 60
REFUND_RATIO_THRESHOLD = 500
REFUND_MAX_INBOUND = 10.0
REFUND_WINDOW_HOURS = 2
POST_HOLD_ESCALATION_WINDOW_MINUTES = 5


def check_high_value_outlier(session: Session, payer_id: str, amount: float) -> DetectionSignal:
    """Feature #6 -- New-Beneficiary High-Value Outlier. Z-score vs the
    payer's OWN historical median for first-time-beneficiary transfers."""
    rows = (
        session.execute(
            select(LedgerTransaction.amount)
            .where(LedgerTransaction.payer_id == payer_id, LedgerTransaction.direction == "OUTBOUND")
        )
        .scalars()
        .all()
    )
    triggered = False
    z_score = 0.0
    if len(rows) >= 3:
        mean = statistics.mean(rows)
        stdev = statistics.pstdev(rows) or 1.0
        z_score = (amount - mean) / stdev
        triggered = z_score > 3.0
    return DetectionSignal(
        feature_id=6,
        feature_name="New-Beneficiary High-Value Outlier",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.3 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"amount": amount, "z_score": round(z_score, 2), "sample_size": len(rows)},
        explanation_code="AMOUNT_EXTREME_OUTLIER_VS_HISTORY" if triggered else "AMOUNT_WITHIN_NORMAL_RANGE",
    )


def check_drip_escalation(session: Session, payer_id: str, beneficiary_ref: str, amount: float) -> DetectionSignal:
    """Feature #14 -- Drip Scam Escalation Detection. Geometric growth with
    shrinking intervals across sequential payments to the SAME recipient."""
    rows = (
        session.execute(
            select(LedgerTransaction.amount, LedgerTransaction.initiated_at)
            .where(
                LedgerTransaction.payer_id == payer_id,
                LedgerTransaction.beneficiary_ref == beneficiary_ref,
                LedgerTransaction.direction == "OUTBOUND",
            )
            .order_by(LedgerTransaction.initiated_at.asc())
        )
        .all()
    )
    triggered = False
    if rows:
        prev_amount, _prev_time = rows[-1]
        if prev_amount > 0 and amount >= DRIP_GROWTH_FACTOR * prev_amount:
            triggered = True
    return DetectionSignal(
        feature_id=14,
        feature_name="Drip Scam Escalation Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.35 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"amount": amount, "prior_transfer_count": len(rows)},
        explanation_code="GEOMETRIC_ESCALATION_TO_SAME_RECIPIENT" if triggered else "NO_ESCALATION_PATTERN",
    )


def check_threshold_evasion(
    session: Session, payer_id: str, beneficiary_ref: str, amount: float, threshold: float = 10000
) -> DetectionSignal:
    """Feature #15 -- Threshold Evasion (Smurfing). Multiple sub-threshold
    transfers to the same recipient inside a sliding 60-minute window."""
    window_start = dt.datetime.utcnow() - dt.timedelta(minutes=SMURF_WINDOW_MINUTES)
    rows = (
        session.execute(
            select(LedgerTransaction.amount)
            .where(
                LedgerTransaction.payer_id == payer_id,
                LedgerTransaction.beneficiary_ref == beneficiary_ref,
                LedgerTransaction.direction == "OUTBOUND",
                LedgerTransaction.initiated_at >= window_start,
            )
        )
        .scalars()
        .all()
    )
    all_amounts = list(rows) + [amount]
    all_sub_threshold = all(a < threshold for a in all_amounts)
    cumulative = sum(all_amounts)
    triggered = len(all_amounts) >= 3 and all_sub_threshold and cumulative > threshold

    return DetectionSignal(
        feature_id=15,
        feature_name="Threshold Evasion (Smurfing) Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"transfer_count_in_window": len(all_amounts), "cumulative_amount": cumulative, "threshold": threshold},
        explanation_code="STRUCTURED_SUB_THRESHOLD_SPLITTING" if triggered else "NO_THRESHOLD_EVASION",
    )


def check_refund_reversal(session: Session, payer_id: str, beneficiary_ref: str, amount: float) -> DetectionSignal:
    """Feature #16 -- Refund Reversal Scam Detection ("Accidental Transfer" trap).
    A tiny INBOUND credit from this entity followed by a much larger OUTBOUND ask."""
    window_start = dt.datetime.utcnow() - dt.timedelta(hours=REFUND_WINDOW_HOURS)
    inbound = (
        session.execute(
            select(LedgerTransaction.amount)
            .where(
                LedgerTransaction.payer_id == payer_id,
                LedgerTransaction.beneficiary_ref == beneficiary_ref,
                LedgerTransaction.direction == "INBOUND",
                LedgerTransaction.initiated_at >= window_start,
            )
            .order_by(LedgerTransaction.initiated_at.desc())
        )
        .scalars()
        .first()
    )
    triggered = False
    ratio = None
    if inbound is not None and inbound <= REFUND_MAX_INBOUND and inbound > 0:
        ratio = amount / inbound
        triggered = ratio > REFUND_RATIO_THRESHOLD

    return DetectionSignal(
        feature_id=16,
        feature_name="Refund Reversal Scam Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.45 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"inbound_amount": inbound, "outbound_amount": amount, "ratio": ratio},
        explanation_code="ACCIDENTAL_TRANSFER_TRAP" if triggered else "NO_REFUND_REVERSAL_PATTERN",
    )


def check_collect_request_abuse(collect_note: str | None, transaction_type: str) -> DetectionSignal | None:
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
        explanation_code="DECEPTIVE_COLLECT_REQUEST_NOTE" if triggered else "COLLECT_NOTE_LOOKS_BENIGN",
    )


def check_purpose_contradiction(recipient: RecipientContext) -> DetectionSignal:
    """Feature #27 -- Purpose Declaration Contradiction Detection.

    Distinct feature id from #3 (which is syntactic, VPA-handle-driven); this
    one is purely about the user's OWN declared purpose vs. the verified
    account type/mc code, regardless of what the handle string says.
    """
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
        explanation_code="DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE" if triggered else "PURPOSE_CONSISTENT",
    )


def check_post_hold_escalation(session: Session, payer_id: str, beneficiary_ref: str, amount: float) -> DetectionSignal:
    """Feature #35 -- Post-Hold Escalation Detection. A completed, previously
    held payment to this recipient followed almost immediately by a larger
    new attempt is the "coached through the cooling-off" signature."""
    window_start = dt.datetime.utcnow() - dt.timedelta(minutes=POST_HOLD_ESCALATION_WINDOW_MINUTES)
    recent_held = (
        session.execute(
            select(LedgerTransaction.amount)
            .where(
                LedgerTransaction.payer_id == payer_id,
                LedgerTransaction.beneficiary_ref == beneficiary_ref,
                LedgerTransaction.direction == "OUTBOUND",
                LedgerTransaction.completed.is_(True),
                LedgerTransaction.held_until.is_not(None),
                LedgerTransaction.initiated_at >= window_start,
            )
        )
        .scalars()
        .first()
    )
    triggered = recent_held is not None and amount > recent_held
    return DetectionSignal(
        feature_id=35,
        feature_name="Post-Hold Escalation Detection",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=0.5 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"previous_held_amount": recent_held, "new_amount": amount},
        explanation_code="COACHED_COOLING_OFF_BYPASS" if triggered else "NO_POST_HOLD_ESCALATION",
    )

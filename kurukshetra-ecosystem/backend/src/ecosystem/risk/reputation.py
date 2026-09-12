"""Community Scam Reports (Feature #11) with Sybil-resistance rules.

Enforces:
- Minimum 3 distinct reporters before risk score escalates
- One report per reporter identity per target
- Exponential decay (14-day half-life)
"""
from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.config import (
    MIN_DISTINCT_REPORTERS_TO_ESCALATE,
    REPUTATION_DECAY_HALF_LIFE_DAYS,
)
from ecosystem.models import ReputationScore, ScamReport
from ecosystem.risk.contracts import DetectionSignal, Severity, SignalLabel


def submit_report(
    session: Session,
    *,
    target_ref: str,
    reporter_identity_hash: str,
    reason_code: str,
) -> bool:
    """Records a community report. Returns False if duplicate reporter."""
    existing = session.execute(
        select(ScamReport).where(
            ScamReport.target_ref == target_ref,
            ScamReport.reporter_identity_hash == reporter_identity_hash,
        )
    ).scalars().first()
    if existing is not None:
        return False

    report = ScamReport(
        report_id=f"rep_{uuid.uuid4().hex[:10]}",
        target_ref=target_ref,
        reporter_identity_hash=reporter_identity_hash,
        reason_code=reason_code,
        reported_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(report)
    session.flush()

    distinct_reporters = session.execute(
        select(ScamReport.reporter_identity_hash).where(ScamReport.target_ref == target_ref)
    ).scalars().all()
    distinct_count = len(set(distinct_reporters))

    community_risk_score = 0.0
    if distinct_count >= MIN_DISTINCT_REPORTERS_TO_ESCALATE:
        community_risk_score = min(1.0, 0.2 * distinct_count)

    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    score_row = session.get(ReputationScore, target_ref)
    if score_row is None:
        session.add(
            ReputationScore(
                target_ref=target_ref,
                distinct_reporter_count=distinct_count,
                community_risk_score=community_risk_score,
                last_updated_at=now,
            )
        )
    else:
        score_row.distinct_reporter_count = distinct_count
        score_row.community_risk_score = max(score_row.community_risk_score, community_risk_score)
        score_row.last_updated_at = now

    return True


def check_community_reports(session: Session, target_ref: str) -> DetectionSignal:
    """Feature #11 -- reads the decayed community risk score."""
    score_row = session.get(ReputationScore, target_ref)
    if score_row is None:
        return DetectionSignal(
            feature_id=11,
            feature_name="Community Scam Reports",
            label=SignalLabel.SIMULATED,
            triggered=False,
            risk_contribution=0.0,
            severity=Severity.LOW,
            evidence={"distinct_reporter_count": 0},
            explanation_code="NO_COMMUNITY_REPORTS",
        )

    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    age_days = (now - score_row.last_updated_at).total_seconds() / 86400
    decay_factor = 0.5 ** (age_days / REPUTATION_DECAY_HALF_LIFE_DAYS)
    effective_score = score_row.community_risk_score * decay_factor
    triggered = score_row.distinct_reporter_count >= MIN_DISTINCT_REPORTERS_TO_ESCALATE

    return DetectionSignal(
        feature_id=11,
        feature_name="Community Scam Reports",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=round(effective_score, 2) if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "distinct_reporter_count": score_row.distinct_reporter_count,
            "raw_score": score_row.community_risk_score,
            "decayed_score": round(effective_score, 3),
            "min_threshold": MIN_DISTINCT_REPORTERS_TO_ESCALATE,
        },
        explanation_code="COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD"
        if triggered
        else "REPORTS_BELOW_ESCALATION_THRESHOLD",
    )

"""Community Scam Reports (feature #11) with the Sybil-resistance rules
specified in docs/04-infrastructure-and-mocks.md and demanded by the
architecture council's peer review: a minimum-reporter threshold, one report
per identity per target, and time-based decay.
"""
from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from kurukshetra.config import MIN_DISTINCT_REPORTERS_TO_ESCALATE, REPUTATION_DECAY_HALF_LIFE_DAYS
from kurukshetra.contracts import DetectionSignal, Severity, SignalLabel
from kurukshetra.models import ReputationScore, ScamReport


def submit_report(session: Session, *, target_ref: str, reporter_identity_hash: str, reason_code: str) -> bool:
    """Records a report. Returns False (no-op) if this reporter already
    reported this target -- the one-report-per-identity rate limit."""
    existing = (
        session.execute(
            select(ScamReport).where(
                ScamReport.target_ref == target_ref,
                ScamReport.reporter_identity_hash == reporter_identity_hash,
            )
        )
        .scalars()
        .first()
    )
    if existing is not None:
        return False

    session.add(
        ScamReport(
            report_id=f"rep_{uuid.uuid4().hex[:10]}",
            target_ref=target_ref,
            reporter_identity_hash=reporter_identity_hash,
            reason_code=reason_code,
        )
    )
    # Flush first so the count below always includes the row just added,
    # regardless of the session's autoflush setting.
    session.flush()

    distinct_reporters = (
        session.execute(select(ScamReport.reporter_identity_hash).where(ScamReport.target_ref == target_ref))
        .scalars()
        .all()
    )
    distinct_count = len(set(distinct_reporters))

    score_row = session.get(ReputationScore, target_ref)
    community_risk_score = 0.0
    if distinct_count >= MIN_DISTINCT_REPORTERS_TO_ESCALATE:
        community_risk_score = min(1.0, 0.2 * distinct_count)

    if score_row is None:
        session.add(
            ReputationScore(
                target_ref=target_ref,
                distinct_reporter_count=distinct_count,
                community_risk_score=community_risk_score,
            )
        )
    else:
        score_row.distinct_reporter_count = distinct_count
        score_row.community_risk_score = max(score_row.community_risk_score, community_risk_score)
        score_row.last_updated_at = dt.datetime.utcnow()

    session.commit()
    return True


def check_community_reports(session: Session, target_ref: str) -> DetectionSignal:
    """Feature #11 -- reads the (decayed) community risk score for this
    target. Escalation only fires once the minimum-reporter threshold from
    submit_report has been crossed -- a single report, or a Sybil cluster
    under that threshold, cannot move the decision on its own."""
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

    age_days = (dt.datetime.utcnow() - score_row.last_updated_at).total_seconds() / 86400
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
        explanation_code="COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD" if triggered else "REPORTS_BELOW_ESCALATION_THRESHOLD",
    )

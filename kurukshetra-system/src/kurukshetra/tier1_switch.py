"""Features #1 and #2 -- PSP-scoped switch-level counters.

Per docs/03-feature-tier-map.md these are labeled Simulated: the true
cross-PSP version (seeing every app's ReqValAdd/ReqPay traffic at once)
requires NPCI-native deployment. This is the honest single-PSP proxy --
weaker, but built on real counters, not a fabricated number.
"""
from __future__ import annotations

import datetime as dt

from sqlalchemy.orm import Session

from kurukshetra.contracts import DetectionSignal, Severity, SignalLabel
from kurukshetra.models import SwitchMetric

BURST_MULTIPLIER = 50  # lookups/hour vs. baseline to flag a burst
ABANDON_RATIO_MIN_LOOKUPS = 10
ABANDON_RATIO_THRESHOLD = 0.85


def record_lookup(session: Session, target_ref: str) -> None:
    row = session.get(SwitchMetric, target_ref)
    now = dt.datetime.utcnow()
    if row is None:
        session.add(SwitchMetric(target_ref=target_ref, lookup_count=1, first_lookup_at=now, last_lookup_at=now))
    else:
        row.lookup_count += 1
        row.last_lookup_at = now
    session.commit()


def record_pay(session: Session, target_ref: str) -> None:
    row = session.get(SwitchMetric, target_ref)
    if row is not None:
        row.pay_count += 1
        session.commit()


def check_abandon_ratio(session: Session, target_ref: str) -> DetectionSignal:
    """Feature #1 -- Verify-to-Abandon Ratio."""
    row = session.get(SwitchMetric, target_ref)
    if row is None or row.lookup_count < ABANDON_RATIO_MIN_LOOKUPS:
        return DetectionSignal(
            feature_id=1,
            feature_name="Verify-to-Abandon Ratio",
            label=SignalLabel.SIMULATED,
            triggered=False,
            risk_contribution=0.0,
            severity=Severity.LOW,
            evidence={"lookup_count": row.lookup_count if row else 0},
            explanation_code="INSUFFICIENT_LOOKUP_VOLUME",
        )

    ratio = 1.0 - (row.pay_count / row.lookup_count)
    triggered = ratio >= ABANDON_RATIO_THRESHOLD
    return DetectionSignal(
        feature_id=1,
        feature_name="Verify-to-Abandon Ratio",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.3 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"lookup_count": row.lookup_count, "pay_count": row.pay_count, "abandon_ratio": round(ratio, 2)},
        explanation_code="HIGH_ABANDONMENT_RATE" if triggered else "NORMAL_ABANDONMENT_RATE",
    )


def check_resolution_burst(session: Session, target_ref: str) -> DetectionSignal:
    """Feature #2 -- Resolution Burst Detection."""
    row = session.get(SwitchMetric, target_ref)
    if row is None:
        return DetectionSignal(
            feature_id=2,
            feature_name="Resolution Burst Detection",
            label=SignalLabel.SIMULATED,
            triggered=False,
            risk_contribution=0.0,
            severity=Severity.LOW,
            evidence={},
            explanation_code="NO_LOOKUP_HISTORY",
        )

    window_hours = max((dt.datetime.utcnow() - row.first_lookup_at).total_seconds() / 3600, 1 / 60)
    current_rate = row.lookup_count / window_hours
    triggered = current_rate > row.baseline_lookups_per_hour * BURST_MULTIPLIER and row.lookup_count >= 20

    return DetectionSignal(
        feature_id=2,
        feature_name="Resolution Burst Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.35 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"current_rate_per_hour": round(current_rate, 2), "baseline_per_hour": row.baseline_lookups_per_hour},
        explanation_code="ACTIVE_CAMPAIGN_BURST" if triggered else "NORMAL_LOOKUP_VELOCITY",
    )

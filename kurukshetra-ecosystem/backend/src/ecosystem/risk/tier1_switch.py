"""Features #1 and #2 -- NPCI Switch-level metrics counters.

Only the NPCI switch sees traffic across ALL PSPs (GPay, PhonePe, Paytm).
This powers:
- Feature #1: Verify-to-Abandon Ratio (high lookup abandonment indicates phishing victims walking away)
- Feature #2: Resolution Burst Detection (sudden spike across multiple PSPs indicates active scam campaign)
"""
from __future__ import annotations

import datetime as dt
from typing import Optional

from sqlalchemy.orm import Session

from ecosystem.config import (
    ABANDON_RATIO_MIN_LOOKUPS,
    ABANDON_RATIO_THRESHOLD,
    BURST_MULTIPLIER,
)
from ecosystem.models import SwitchMetric
from ecosystem.risk.contracts import DetectionSignal, Severity, SignalLabel


def record_lookup(session: Session, target_ref: str, psp_id: Optional[str] = None) -> None:
    row = session.get(SwitchMetric, target_ref)
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    if row is None:
        session.add(
            SwitchMetric(
                target_ref=target_ref,
                lookup_count=1,
                pay_count=0,
                distinct_psp_count=1 if psp_id else 0,
                first_lookup_at=now,
                last_lookup_at=now,
                baseline_lookups_per_hour=0.05,
            )
        )
    else:
        row.lookup_count += 1
        row.last_lookup_at = now
        if psp_id:
            row.distinct_psp_count = max(row.distinct_psp_count, 1)


def record_pay(session: Session, target_ref: str) -> None:
    row = session.get(SwitchMetric, target_ref)
    if row is not None:
        row.pay_count += 1


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

    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    window_hours = max((now - row.first_lookup_at).total_seconds() / 3600, 1 / 60)
    current_rate = row.lookup_count / window_hours
    triggered = current_rate > row.baseline_lookups_per_hour * BURST_MULTIPLIER and row.lookup_count >= 10

    return DetectionSignal(
        feature_id=2,
        feature_name="Resolution Burst Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.35 if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={
            "current_rate_per_hour": round(current_rate, 2),
            "baseline_per_hour": row.baseline_lookups_per_hour,
            "distinct_psps": row.distinct_psp_count,
        },
        explanation_code="ACTIVE_CAMPAIGN_BURST" if triggered else "NORMAL_LOOKUP_VELOCITY",
    )

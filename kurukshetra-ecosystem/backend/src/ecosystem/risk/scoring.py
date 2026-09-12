"""Deterministic weighted scoring engine and fallback degradation contract.

Pure mathematical scoring without any LLMs in the decision loop:
- ALLOW: 0.00 - 0.30 -> PROCEED
- STEP_UP: 0.31 - 0.65 -> SHOW_CONFIRMATION_SCREEN
- COACH: 0.66 - 0.85 -> REQUIRE_ACKNOWLEDGMENT
- FREEZE: 0.86 - 1.00 -> HARD_BLOCK
"""
from __future__ import annotations

from ecosystem.config import ALLOW_MAX, COACH_MAX, STEP_UP_MAX
from ecosystem.risk.contracts import (
    DataCompleteness,
    DetectionSignal,
    RiskDecision,
    RiskZone,
)

_ZONE_ACTION = {
    RiskZone.ALLOW: "PROCEED",
    RiskZone.STEP_UP: "SHOW_CONFIRMATION_SCREEN",
    RiskZone.COACH: "REQUIRE_ACKNOWLEDGMENT",
    RiskZone.FREEZE: "HARD_BLOCK",
}


def _zone_for_score(score: float) -> RiskZone:
    if score <= ALLOW_MAX:
        return RiskZone.ALLOW
    if score <= STEP_UP_MAX:
        return RiskZone.STEP_UP
    if score <= COACH_MAX:
        return RiskZone.COACH
    return RiskZone.FREEZE


def score_transaction(
    *,
    transaction_id: str,
    signals: list[DetectionSignal],
    tier_reached: int,
    is_known_beneficiary: bool,
    data_completeness: DataCompleteness,
) -> RiskDecision:
    """Aggregate detection signals into a deterministic decision.
    Fallback contract: missing data never defaults to safe for unknown payees.
    """
    raw_score = min(1.0, sum(s.risk_contribution for s in signals if s.triggered))
    zone = _zone_for_score(raw_score)

    if not is_known_beneficiary and data_completeness != DataCompleteness.FULL:
        floor = RiskZone.STEP_UP
        zone_order = [RiskZone.ALLOW, RiskZone.STEP_UP, RiskZone.COACH, RiskZone.FREEZE]
        if zone_order.index(zone) < zone_order.index(floor):
            zone = floor

    confidence = 1.0 if data_completeness == DataCompleteness.FULL else 0.7
    fired = [s for s in signals if s.triggered]
    reasons = [s.explanation_code for s in fired]

    return RiskDecision(
        transaction_id=transaction_id,
        risk_score=round(raw_score, 2),
        confidence=confidence,
        risk_zone=zone,
        decision=_ZONE_ACTION[zone],
        data_completeness=data_completeness,
        tier_reached=tier_reached,
        checks_executed=[s.feature_name for s in signals],
        signals=signals,
        reasons=reasons,
        recommended_action=_ZONE_ACTION[zone],
    )

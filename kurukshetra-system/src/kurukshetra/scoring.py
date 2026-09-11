"""Deterministic weighted scoring engine + the fallback/degradation contract.

No LLM anywhere in this module -- this is the council-confirmed boundary
(docs/00-council-verdict.md): the LLM never decides risk, only explains it
afterward via the MCP layer.
"""
from __future__ import annotations

from kurukshetra.config import ALLOW_MAX, COACH_MAX, STEP_UP_MAX
from kurukshetra.contracts import (
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
    """Combine every signal gathered so far into one decision.

    Fallback contract (docs/02-transaction-lifecycle.md): a missing/degraded
    data source is never silently treated as "safe" for a NEW beneficiary --
    it raises the effective risk floor by one zone. Known beneficiaries are
    unaffected, since Tier 0 already cleared them before Tier 1 ran at all.
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
        risk_score=raw_score,
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

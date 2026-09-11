"""4-Tier Policy Router and Decision Engine for Kurukshetra."""

from __future__ import annotations
from kurukshetra.contracts import (
    ActionDirective,
    AccountContext,
    TelemetryVector,
    RiskVerdict,
)


class PolicyRouter:
    def __init__(
        self,
        allow_threshold: float = 0.30,
        coach_threshold: float = 0.65,
        freeze_threshold: float = 0.85,
        uncertainty_clamp_threshold: float = 0.35,
    ):
        self.allow_threshold = allow_threshold
        self.coach_threshold = coach_threshold
        self.freeze_threshold = freeze_threshold
        self.uncertainty_clamp_threshold = uncertainty_clamp_threshold

    def route_decision(
        self,
        verdict: RiskVerdict,
        telemetry: TelemetryVector,
        context: AccountContext,
    ) -> ActionDirective:
        """Evaluates the 4-tier decision matrix in strict priority order."""
        
        # --- Tier 0: Regulatory & Hard Safety Overrides ---
        if context.is_sanctioned_recipient:
            return ActionDirective.INTERVENE_FREEZE
        
        if telemetry.remote_access_software_active and context.amount >= 500.0:
            return ActionDirective.INTERVENE_FREEZE

        # --- Tier 1: Epistemic Uncertainty & Safe-Harbor Clamping ---
        # If high risk but model has high unfamiliarity/uncertainty, downgrade to prevent false-positive freeze
        if verdict.calibrated_risk_score >= self.coach_threshold:
            if verdict.epistemic_uncertainty > self.uncertainty_clamp_threshold:
                return ActionDirective.INTERVENE_STEP_UP

        # --- Tier 3: Customer Vulnerability Adjustments ---
        effective_coach_thresh = self.coach_threshold
        if context.is_vulnerable_customer or context.customer_age >= 70:
            effective_coach_thresh = 0.50

        # --- Tier 2: Statistical Risk Scoring Matrix ---
        score = verdict.calibrated_risk_score
        if score < self.allow_threshold:
            return ActionDirective.ALLOW
        elif score < effective_coach_thresh:
            return ActionDirective.INTERVENE_STEP_UP
        elif score < self.freeze_threshold:
            return ActionDirective.INTERVENE_COACH
        else:
            return ActionDirective.INTERVENE_FREEZE

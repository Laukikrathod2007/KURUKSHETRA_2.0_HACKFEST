"""Interception Orchestrator for Real-Time Payment Clearance."""

from __future__ import annotations
import time
from typing import Tuple
from kurukshetra.contracts import (
    TelemetryVector,
    AccountContext,
    InterceptionResponse,
    ActionDirective,
    EvidenceDossier,
)
from kurukshetra.risk_engine import RiskEngine
from kurukshetra.policy_router import PolicyRouter
from kurukshetra.intervention import InterventionEngine
from kurukshetra.explainability import ExplainabilityEngine


class InterceptionOrchestrator:
    """Coordinates the synchronous pre-clearance critical path (P99 <= 45ms)."""

    def __init__(
        self,
        risk_engine: RiskEngine = None,
        policy_router: PolicyRouter = None,
        intervention_engine: InterventionEngine = None,
        explainability_engine: ExplainabilityEngine = None,
        hard_timeout_ms: float = 45.0,
    ):
        self.risk_engine = risk_engine or RiskEngine()
        self.policy_router = policy_router or PolicyRouter()
        self.intervention_engine = intervention_engine or InterventionEngine()
        self.explainability_engine = explainability_engine or ExplainabilityEngine()
        self.hard_timeout_ms = hard_timeout_ms

    def intercept(
        self,
        transaction_id: str,
        telemetry: TelemetryVector,
        context: AccountContext,
        inject_latency_ms: float = 0.0,
    ) -> Tuple[InterceptionResponse, EvidenceDossier]:
        """Executes the synchronous interception pipeline."""
        start_time = time.perf_counter()
        degraded_tier = "NONE"

        # Check circuit breaker / synthetic delay
        if inject_latency_ms > 0:
            time.sleep(inject_latency_ms / 1000.0)

        current_elapsed = (time.perf_counter() - start_time) * 1000.0
        if current_elapsed >= self.hard_timeout_ms:
            # TIER 3 FAIL-OPEN SAFE HARBOR
            degraded_tier = "TIER_3_FAIL_OPEN"
            verdict = self.risk_engine.evaluate(transaction_id, telemetry, context)
            response = InterceptionResponse(
                transaction_id=transaction_id,
                directive=ActionDirective.ALLOW,
                risk_score=0.0,
                epistemic_uncertainty=1.0,
                dwell_gate_seconds=0,
                counter_coaching_title="Fail-Open Clearance",
                total_latency_ms=round(current_elapsed, 2),
                degraded_tier=degraded_tier,
            )
            dossier = self.explainability_engine.build_evidence_dossier(
                transaction_id, verdict, ActionDirective.ALLOW, context
            )
            return response, dossier

        # 1. Evaluate Risk via ML engine
        verdict = self.risk_engine.evaluate(transaction_id, telemetry, context)

        # 2. Route Action Directive via Policy Engine
        directive = self.policy_router.route_decision(verdict, telemetry, context)

        # 3. Build Evidence Dossier
        dossier = self.explainability_engine.build_evidence_dossier(
            transaction_id, verdict, directive, context
        )

        total_elapsed = (time.perf_counter() - start_time) * 1000.0

        # 4. Construct Interception Verdict for Client SDK
        response = self.intervention_engine.render_intervention(
            transaction_id=transaction_id,
            directive=directive,
            verdict=verdict,
            total_latency_ms=total_elapsed,
            degraded_tier=degraded_tier,
        )

        return response, dossier

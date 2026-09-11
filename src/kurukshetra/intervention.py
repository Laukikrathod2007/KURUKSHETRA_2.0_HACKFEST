"""Intervention Engine, 5-Second Dwell Gate, and Behavioral Counter-Coaching."""

from __future__ import annotations
import time
from typing import Dict, Tuple, Optional
from kurukshetra.contracts import (
    ActionDirective,
    ScamTypology,
    InterceptionResponse,
    RiskVerdict,
)


COACHING_TEMPLATES: Dict[ScamTypology, Tuple[str, str, str]] = {
    ScamTypology.IMPERSONATION_POLICE: (
        "URGENT: Potential Law Enforcement Impersonation Scam",
        "Police, CBI, Customs, and judicial officials will NEVER call you on WhatsApp, threaten immediate arrest, or demand that you transfer funds to a 'safe verification account'.",
        "I confirm that NO ONE asked me to transfer funds to verify my innocence or keep this payment confidential.",
    ),
    ScamTypology.REMOTE_ACCESS_TAKEOVER: (
        "CRITICAL ALERT: Remote Screen Control Active",
        "We detected remote screen-sharing software (such as AnyDesk, TeamViewer, or RustDesk) running on your device. Bank fraud teams will NEVER instruct you to install remote software to resolve an issue.",
        "I confirm that NO STRANGER is currently viewing or controlling my screen.",
    ),
    ScamTypology.IMPERSONATION_BANK_SUPPORT: (
        "SECURITY NOTICE: Unverified Bank Support Contact",
        "Legitimate bank fraud prevention teams will NEVER call you demanding immediate fund transfers to protect your account. Your money is already safe within your account.",
        "I confirm that I initiated this payment myself without phone guidance from an unverified caller.",
    ),
    ScamTypology.INVESTMENT_CRYPTO_PIG_BUTCHERING: (
        "HIGH RISK: High-Yield Investment Warning",
        "High-return investment platforms requiring payments to individual third-party bank accounts or crypto exchanges are overwhelmingly fraudulent schemes designed to steal your capital.",
        "I understand that legitimate financial brokers do not accept funds into personal individual savings accounts.",
    ),
    ScamTypology.MULE_RAPID_DISPERSION: (
        "HIGH RISK: Suspected Money Mule Recipient",
        "The recipient account has been flagged for rapid fund dispersion patterns typical of intermediary accounts used by organized crime networks.",
        "I personally know and have physically verified the identity of this recipient.",
    ),
}

DEFAULT_COACHING = (
    "SECURITY WARNING: Unusual Payment Destination",
    "This high-value payment to an unverified recipient shows significant indicators of coercive fraud. Please pause and verify before proceeding.",
    "I confirm that this transaction is authentic and not made under external urgency or coaching.",
)


class InterventionEngine:
    def __init__(self, dwell_seconds: int = 5):
        self.dwell_seconds = dwell_seconds
        self.quarantine_queue: Dict[str, dict] = {}

    def render_intervention(
        self,
        transaction_id: str,
        directive: ActionDirective,
        verdict: RiskVerdict,
        total_latency_ms: float,
        degraded_tier: str = "NONE",
    ) -> InterceptionResponse:
        """Constructs the client interception directive packet."""
        
        dwell = 0
        title = ""
        body = ""
        affirmation = ""

        if directive == ActionDirective.INTERVENE_COACH:
            dwell = self.dwell_seconds
            t_data = COACHING_TEMPLATES.get(verdict.detected_typology, DEFAULT_COACHING)
            title, body, affirmation = t_data

        elif directive == ActionDirective.INTERVENE_FREEZE:
            title = "TRANSACTION QUARANTINED: 4-Hour Cooling-Off Period"
            body = (
                "For your protection against urgent coercion scams, this transfer has been placed on a 4-hour security hold. "
                "Our anti-fraud team is verifying recipient legitimacy. No funds have left your account."
            )
            affirmation = "You may cancel this transfer at any time from your transaction history."
            # Spool to quarantine queue
            self.quarantine_queue[transaction_id] = {
                "transaction_id": transaction_id,
                "timestamp": time.time(),
                "hold_duration_sec": 14400,
                "typology": verdict.detected_typology.value,
                "score": verdict.calibrated_risk_score,
            }

        elif directive == ActionDirective.INTERVENE_STEP_UP:
            title = "Biometric Re-Authentication Required"
            body = "Please confirm your identity with FaceID or your hardware security key."
            affirmation = "Biometric authentication required."

        return InterceptionResponse(
            transaction_id=transaction_id,
            directive=directive,
            risk_score=verdict.calibrated_risk_score,
            epistemic_uncertainty=verdict.epistemic_uncertainty,
            dwell_gate_seconds=dwell,
            counter_coaching_title=title,
            counter_coaching_body=body,
            affirmation_question=affirmation,
            total_latency_ms=round(total_latency_ms, 2),
            degraded_tier=degraded_tier,
        )

    def simulate_client_dwell_interaction(
        self,
        response: InterceptionResponse,
        user_aborts_scam: bool,
        elapsed_dwell_seconds: float,
    ) -> Tuple[bool, str]:
        """Simulates the mobile client SDK executing the 5-second dwell gate."""
        if response.directive == ActionDirective.ALLOW:
            return True, "PROCEED_TO_PIN"

        if response.directive == ActionDirective.INTERVENE_FREEZE:
            return False, "BLOCKED_COOLING_OFF_ACTIVE"

        if response.directive == ActionDirective.INTERVENE_COACH:
            if user_aborts_scam:
                return False, "USER_ABORTED_COGNITIVE_SPELL_BROKEN"
            
            # User attempts override: assert 5-second dwell gate
            if elapsed_dwell_seconds < response.dwell_gate_seconds:
                return False, "OVERRIDE_REJECTED_DWELL_GATE_ACTIVE"
            
            return True, "PROCEED_AFTER_DWELL_CONFIRMATION"

        if response.directive == ActionDirective.INTERVENE_STEP_UP:
            return True, "PROCEED_STEP_UP_AUTHENTICATED"

        return False, "UNKNOWN_STATE"

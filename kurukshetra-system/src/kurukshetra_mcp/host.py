"""The MCP Host -- in-process orchestrator for the consolidated backend.

Invoked if and only if the deterministic scoring engine has already produced
COACH or FREEZE (see kurukshetra.engine_core / kurukshetra.scoring). Calls
the exact same tool functions the standalone FastMCP server exposes
(kurukshetra_mcp/tools.py), just without a wire-protocol hop, per the
hosting-topology decision to keep the demo's critical path to one process.

Never receives PIN/OTP/CVV, never calls back into Tier 0/1/scoring, and never
decides risk -- it only communicates a decision that has already been made.
"""
from __future__ import annotations

from kurukshetra.contracts import RiskDecision, RiskZone
from kurukshetra.db import SessionLocal
from kurukshetra_mcp import tools

# Registry flags carry CONCEPTUAL-labeled reason codes dynamically
# (CONCEPTUAL_<FLAG_TYPE>_MATCH) -- explain_decision annotates these so the
# user-facing text never implies a live government-data query.
_CONCEPTUAL_PREFIX = "CONCEPTUAL_"


def build_intervention(decision: RiskDecision, *, payer_id: str, amount: float | None) -> dict | None:
    """Returns None for ALLOW/STEP_UP (MCP is never invoked for those)."""
    if decision.risk_zone not in (RiskZone.COACH, RiskZone.FREEZE):
        return None

    conceptual_codes = {r for r in decision.reasons if r.startswith(_CONCEPTUAL_PREFIX)}
    explanation = tools.explain_decision(decision.reasons, conceptual_codes)
    template = tools.select_intervention_template(decision.risk_zone.value, decision.reasons)

    session = SessionLocal()
    try:
        trusted_contact_result = None
        if decision.risk_zone == RiskZone.FREEZE:
            trusted_contact_result = tools.notify_trusted_contact(
                session, payer_id=payer_id, transaction_id=decision.transaction_id, amount=amount
            )

        helpline = None
        if template == "BANK_HELPLINE_SCREEN":
            helpline = tools.check_helpline_directory("sbi")

        tools.log_intervention_outcome(
            session,
            transaction_id=decision.transaction_id,
            intervention_template_id=template,
            user_action="PENDING",
        )
    finally:
        session.close()

    return {
        "intervention_template": template,
        "explanation": explanation,
        "requires_explicit_acknowledgment": decision.risk_zone == RiskZone.COACH,
        "hard_block": decision.risk_zone == RiskZone.FREEZE,
        "trusted_contact_notification": trusted_contact_result,
        "helpline": helpline,
    }

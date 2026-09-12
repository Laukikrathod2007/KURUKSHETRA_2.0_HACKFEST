"""MCP Host orchestrator -- in-process caller for COACH and FREEZE interventions.

Invoked strictly when the deterministic scoring engine has produced COACH or FREEZE.
Never receives PIN/OTP/credentials and never decides risk.
"""
from __future__ import annotations

from typing import Any, Optional

from sqlalchemy.orm import Session

from ecosystem.mcp import tools
from ecosystem.risk.contracts import RiskDecision, RiskZone

_CONCEPTUAL_PREFIX = "CONCEPTUAL_"


def build_intervention(
    session: Session,
    decision: RiskDecision,
    *,
    customer_id: str,
    amount_paise: Optional[int] = None,
) -> Optional[dict[str, Any]]:
    """Constructs intervention packet for COACH or FREEZE decisions."""
    if decision.risk_zone not in (RiskZone.COACH, RiskZone.FREEZE):
        return None

    conceptual_codes = {r for r in decision.reasons if r.startswith(_CONCEPTUAL_PREFIX)}
    evidence_map = {s.explanation_code: s.evidence for s in decision.signals if s.triggered}
    explanation = tools.explain_decision(decision.reasons, conceptual_codes, evidence_map=evidence_map)
    template = tools.select_intervention_template(decision.risk_zone.value, decision.reasons)

    trusted_contact_result = None
    if decision.risk_zone == RiskZone.FREEZE:
        trusted_contact_result = tools.notify_trusted_contact(
            session,
            customer_id=customer_id,
            txn_id=decision.transaction_id,
            amount_paise=amount_paise,
        )

    helpline = tools.check_helpline_directory("cybercrime")
    tools.log_intervention_outcome(
        session,
        txn_id=decision.transaction_id,
        template_id=template,
        user_action="PENDING",
    )

    return {
        "intervention_template": template,
        "explanation": explanation,
        "requires_explicit_acknowledgment": decision.risk_zone == RiskZone.COACH,
        "hard_block": decision.risk_zone == RiskZone.FREEZE,
        "trusted_contact_notification": trusted_contact_result,
        "helpline": helpline,
        "warning_title": "Urgent Security Warning"
        if decision.risk_zone == RiskZone.COACH
        else "Transaction Intercepted and Blocked",
    }

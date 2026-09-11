from kurukshetra.contracts import (
    DataCompleteness,
    RiskDecision,
    RiskZone,
)
from kurukshetra_mcp import tools
from kurukshetra_mcp.host import build_intervention


def test_explain_decision_produces_plain_language():
    text = tools.explain_decision(["AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH"])
    assert "personal" in text.lower()
    assert "AUTHORITY_CLAIM" not in text  # raw codes must not leak into user-facing text


def test_explain_decision_annotates_conceptual_signals():
    text = tools.explain_decision(["CONCEPTUAL_I4C_CFCFRMS_MATCH"], {"CONCEPTUAL_I4C_CFCFRMS_MATCH"})
    assert "illustrative" in text.lower()


def test_explain_decision_handles_no_reasons():
    assert "No specific risk signals" in tools.explain_decision([])


def test_template_selection_is_deterministic():
    assert tools.select_intervention_template("COACH", ["DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE"]) == "PURPOSE_CONTRADICTION_SCREEN"
    assert tools.select_intervention_template("FREEZE", ["CROSS_STATE_MULE_SYNDICATE_PROFILE"]) == "ACCOUNT_TIMELINE_SCREEN"
    assert tools.select_intervention_template("COACH", ["AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT"]) == "BANK_HELPLINE_SCREEN"
    assert tools.select_intervention_template("COACH", ["SOMETHING_ELSE"]) == "GENERIC_COACH_SCREEN"


def _decision(zone: RiskZone) -> RiskDecision:
    return RiskDecision(
        transaction_id="t1",
        risk_score=0.9,
        confidence=1.0,
        risk_zone=zone,
        decision="X",
        data_completeness=DataCompleteness.FULL,
        tier_reached=1,
        reasons=["AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT"],
        recommended_action="X",
    )


def test_mcp_host_not_invoked_for_allow_or_step_up():
    """MCP must never run for non-flagged transactions -- it is strictly
    post-decision, and only for COACH/FREEZE."""
    assert build_intervention(_decision(RiskZone.ALLOW), payer_id="p", amount=100) is None
    assert build_intervention(_decision(RiskZone.STEP_UP), payer_id="p", amount=100) is None


def test_helpline_directory_falls_back_to_national_helpline():
    assert "1930" in tools.check_helpline_directory("unknown-bank")
    assert "1800-1234" in tools.check_helpline_directory("sbi")

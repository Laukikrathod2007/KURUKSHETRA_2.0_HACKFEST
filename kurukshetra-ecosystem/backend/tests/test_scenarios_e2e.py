"""End-to-End tests for all 5 canonical payment ecosystem demo scenarios.
"""
from __future__ import annotations

import pytest

from ecosystem.db import reset_db, session_scope
from ecosystem.scenarios import runner, seed


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed.seed_all(session)


def test_scenario_green_e2e():
    with session_scope() as session:
        res = runner.run_scenario_green(session)
        assert res["status"] == "COMPLETED"
        assert res["risk_zone"] == "ALLOW"
        assert res["tier_reached"] == 0  # Tier 0 bypass verified!
        assert len(res["traces"]) > 5


def test_scenario_yellow_e2e():
    with session_scope() as session:
        res = runner.run_scenario_yellow(session)
        assert res["status"] == "AWAITING_CONFIRM"
        assert res["risk_zone"] == "STEP_UP"
        assert res["completeness"] == "PARTIAL"


def test_scenario_orange_e2e():
    with session_scope() as session:
        res = runner.run_scenario_orange(session)
        assert res["lookup_risk_zone"] == "COACH"
        assert res["status"] == "BLOCKED"
        assert res["risk_zone"] == "FREEZE"
        assert res["balance_protected"] is True
        assert res["intervention_screen"] is not None
        assert res["intervention_screen"]["intervention_template"] == "PURPOSE_CONTRADICTION_SCREEN"


def test_scenario_red_e2e():
    with session_scope() as session:
        res = runner.run_scenario_red(session)
        assert res["status"] == "BLOCKED"
        assert res["risk_zone"] == "FREEZE"
        assert res["risk_score"] >= 0.85
        assert res["zero_money_moved"] is True


def test_scenario_blue_e2e():
    with session_scope() as session:
        res = runner.run_scenario_blue(session)
        assert res["status"] == "CHALLENGE_REQUIRED"
        assert res["action"] == "OTP_CHALLENGE"

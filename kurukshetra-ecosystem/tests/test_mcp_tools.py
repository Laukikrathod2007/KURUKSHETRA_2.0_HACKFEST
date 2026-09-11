"""Unit tests for FastMCP intervention tools.
"""
from __future__ import annotations

import pytest

from ecosystem.config import to_paise
from ecosystem.db import reset_db, session_scope
from ecosystem.mcp import tools
from ecosystem.scenarios.seed import seed_all


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed_all(session)


def test_explain_decision():
    reasons = [
        "AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH",
        "INSTANT_CASH_OUT_MULE_PATTERN",
    ]
    explanation = tools.explain_decision(reasons)
    assert "personal account" in explanation
    assert "pass-through mule" in explanation


def test_select_intervention_template():
    template1 = tools.select_intervention_template(
        "COACH", ["DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE"]
    )
    assert template1 == "PURPOSE_CONTRADICTION_SCREEN"

    template2 = tools.select_intervention_template(
        "FREEZE", ["INSTANT_CASH_OUT_MULE_PATTERN"]
    )
    assert template2 == "ACCOUNT_TIMELINE_SCREEN"


def test_notify_trusted_contact():
    with session_scope() as session:
        res = tools.notify_trusted_contact(
            session,
            customer_id="cust_aarav",
            txn_id="txn_alert_01",
            amount_paise=to_paise(75_000),
        )
        assert res["customer_id"] == "cust_aarav"
        assert "75,000" in res["message"]


def test_check_helpline_directory():
    sbi_hl = tools.check_helpline_directory("SBIN")
    assert "1800" in sbi_hl
    cyber_hl = tools.check_helpline_directory("unknown")
    assert "1930" in cyber_hl

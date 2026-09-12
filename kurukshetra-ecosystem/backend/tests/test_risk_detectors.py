"""Unit tests for individual Kurukshetra risk detectors and audit trail.
"""
from __future__ import annotations

import datetime as dt
import pytest

from ecosystem.config import to_paise
from ecosystem.db import reset_db, session_scope
from ecosystem.models import AppLocalHistory, Direction
from ecosystem.risk import audit, reputation
from ecosystem.risk.contracts import RecipientContext
from ecosystem.risk.tier1_ledger import (
    check_drip_escalation,
    check_purpose_contradiction,
    check_refund_reversal,
    check_threshold_evasion,
)
from ecosystem.scenarios.seed import seed_all


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed_all(session)


def test_drip_escalation_detector():
    with session_scope() as session:
        now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
        # Prior payment was Rs 100
        session.add(
            AppLocalHistory(
                psp_id="gpay",
                customer_id="cust_test",
                payee_ref="target@upi",
                amount_paise=to_paise(100),
                direction=Direction.DEBIT,
                succeeded=True,
                occurred_at=now - dt.timedelta(hours=1),
            )
        )
        session.flush()

        # Rs 150 (1.5x) should not trigger (threshold is 2.5x)
        sig_quiet = check_drip_escalation(session, "cust_test", "target@upi", to_paise(150), psp_id="gpay")
        assert sig_quiet.triggered is False

        # Rs 300 (3.0x) should trigger drip escalation!
        sig_fire = check_drip_escalation(session, "cust_test", "target@upi", to_paise(300), psp_id="gpay")
        assert sig_fire.triggered is True
        assert sig_fire.risk_contribution > 0


def test_threshold_evasion_smurfing():
    with session_scope() as session:
        now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
        # Two previous transfers of Rs 4,000 each in last 20 mins
        for i in range(2):
            session.add(
                AppLocalHistory(
                    psp_id="gpay",
                    customer_id="cust_test",
                    payee_ref="smurf@upi",
                    amount_paise=to_paise(4000),
                    direction=Direction.DEBIT,
                    succeeded=True,
                    occurred_at=now - dt.timedelta(minutes=20 - i * 5),
                )
            )
        session.flush()

        # 3rd transfer of Rs 4,000 brings cumulative to Rs 12,000 (> Rs 10,000 threshold)
        sig = check_threshold_evasion(session, "cust_test", "smurf@upi", to_paise(4000), psp_id="gpay")
        assert sig.triggered is True
        assert sig.explanation_code == "STRUCTURED_SUB_THRESHOLD_SPLITTING"


def test_reputation_sybil_threshold():
    with session_scope() as session:
        target = "test.scammer@upi"

        # 1st report: should not trigger escalation
        reputation.submit_report(session, target_ref=target, reporter_identity_hash="user_1", reason_code="SCAM")
        sig1 = reputation.check_community_reports(session, target)
        assert sig1.triggered is False

        # Duplicate report from same user: should be rate-limited and ignored
        added = reputation.submit_report(session, target_ref=target, reporter_identity_hash="user_1", reason_code="SCAM")
        assert added is False

        # 2nd report: still below min threshold of 3
        reputation.submit_report(session, target_ref=target, reporter_identity_hash="user_2", reason_code="SCAM")
        sig2 = reputation.check_community_reports(session, target)
        assert sig2.triggered is False

        # 3rd report: crosses threshold of 3!
        reputation.submit_report(session, target_ref=target, reporter_identity_hash="user_3", reason_code="SCAM")
        sig3 = reputation.check_community_reports(session, target)
        assert sig3.triggered is True
        assert sig3.risk_contribution >= 0.6


def test_purpose_contradiction():
    recipient = RecipientContext(
        beneficiary_ref_hash="fake.police@upi",
        resolved_name="Manoj Kumar",
        mc_code="0000",  # Personal savings
        declared_purpose="GOVT_FINE",
    )
    sig = check_purpose_contradiction(recipient)
    assert sig.triggered is True
    assert sig.severity.value == "CRITICAL"


def test_hash_chained_audit_integrity():
    with session_scope() as session:
        audit.write_entry(session, txn_id="tx1", decision="ALLOW", risk_score=0.1, evidence={})
        audit.write_entry(session, txn_id="tx2", decision="STEP_UP", risk_score=0.4, evidence={})
        audit.write_entry(session, txn_id="tx3", decision="FREEZE", risk_score=0.9, evidence={})

        valid, broken_id = audit.verify_chain(session)
        assert valid is True
        assert broken_id is None

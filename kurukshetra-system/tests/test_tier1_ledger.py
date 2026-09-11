import datetime as dt

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from kurukshetra.contracts import RecipientContext
from kurukshetra.db import Base
from kurukshetra.models import LedgerTransaction
from kurukshetra.tier1_ledger import (
    check_collect_request_abuse,
    check_drip_escalation,
    check_purpose_contradiction,
    check_refund_reversal,
    check_threshold_evasion,
)


@pytest.fixture()
def session():
    engine = create_engine("sqlite://", future=True)
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine, future=True)
    s = maker()
    yield s
    s.close()


def _tx(session, *, amount, direction="OUTBOUND", minutes_ago=0, beneficiary="mule@axis"):
    session.add(
        LedgerTransaction(
            transaction_id=f"t{amount}{direction}{minutes_ago}",
            payer_id="payer1",
            beneficiary_ref=beneficiary,
            amount=amount,
            direction=direction,
            initiated_at=dt.datetime.utcnow() - dt.timedelta(minutes=minutes_ago),
        )
    )
    session.commit()


def test_drip_escalation_fires_on_geometric_growth(session):
    _tx(session, amount=5000, minutes_ago=60)
    signal = check_drip_escalation(session, "payer1", "mule@axis", 25000)
    assert signal.triggered is True


def test_drip_escalation_quiet_on_similar_amounts(session):
    _tx(session, amount=5000, minutes_ago=60)
    signal = check_drip_escalation(session, "payer1", "mule@axis", 5500)
    assert signal.triggered is False


def test_threshold_evasion_fires_on_structured_splitting(session):
    _tx(session, amount=9999, minutes_ago=20)
    _tx(session, amount=9999, minutes_ago=10)
    signal = check_threshold_evasion(session, "payer1", "mule@axis", 9999)
    assert signal.triggered is True
    assert signal.evidence["cumulative_amount"] > 10000


def test_threshold_evasion_quiet_on_single_large_payment(session):
    signal = check_threshold_evasion(session, "payer1", "mule@axis", 45000)
    assert signal.triggered is False


def test_refund_reversal_fires_on_micro_credit_macro_debit(session):
    _tx(session, amount=10, direction="INBOUND", minutes_ago=30)
    signal = check_refund_reversal(session, "payer1", "mule@axis", 50000)
    assert signal.triggered is True
    assert signal.evidence["ratio"] == 5000


def test_refund_reversal_quiet_without_micro_credit(session):
    signal = check_refund_reversal(session, "payer1", "mule@axis", 50000)
    assert signal.triggered is False


def test_collect_request_abuse_fires_on_deceptive_note():
    signal = check_collect_request_abuse("Cashback Received - Tap to Claim", "COLLECT_REQUEST")
    assert signal is not None and signal.triggered is True


def test_collect_request_abuse_skipped_for_normal_payment():
    assert check_collect_request_abuse("dinner split", "P2P") is None


def test_purpose_contradiction_fires_on_govt_fine_to_personal_account():
    rc = RecipientContext(beneficiary_ref_hash="x@sbi", mc_code="0000", declared_purpose="GOVT_FINE")
    assert check_purpose_contradiction(rc).triggered is True


def test_purpose_contradiction_quiet_for_verified_merchant():
    rc = RecipientContext(beneficiary_ref_hash="x@sbi", mc_code="9311", declared_purpose="GOVT_FINE")
    assert check_purpose_contradiction(rc).triggered is False

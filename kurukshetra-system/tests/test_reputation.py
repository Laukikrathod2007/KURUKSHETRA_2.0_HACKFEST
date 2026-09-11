import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from kurukshetra.db import Base
from kurukshetra.reputation import check_community_reports, submit_report


@pytest.fixture()
def session():
    engine = create_engine("sqlite://", future=True)
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine, future=True)
    s = maker()
    yield s
    s.close()


def test_single_report_does_not_escalate(session):
    """Sybil resistance: one reporter must never be able to move the decision."""
    submit_report(session, target_ref="v@axis", reporter_identity_hash="h1", reason_code="SCAM")
    signal = check_community_reports(session, "v@axis")
    assert signal.triggered is False
    assert signal.explanation_code == "REPORTS_BELOW_ESCALATION_THRESHOLD"


def test_duplicate_reporter_is_rate_limited(session):
    assert submit_report(session, target_ref="v@axis", reporter_identity_hash="h1", reason_code="SCAM") is True
    assert submit_report(session, target_ref="v@axis", reporter_identity_hash="h1", reason_code="SCAM") is False
    signal = check_community_reports(session, "v@axis")
    assert signal.evidence["distinct_reporter_count"] == 1


def test_three_distinct_reporters_escalate(session):
    for h in ("h1", "h2", "h3"):
        submit_report(session, target_ref="v@axis", reporter_identity_hash=h, reason_code="SCAM")
    signal = check_community_reports(session, "v@axis")
    assert signal.triggered is True
    assert signal.evidence["distinct_reporter_count"] == 3


def test_unreported_target_is_clean(session):
    signal = check_community_reports(session, "never.seen@axis")
    assert signal.triggered is False
    assert signal.explanation_code == "NO_COMMUNITY_REPORTS"

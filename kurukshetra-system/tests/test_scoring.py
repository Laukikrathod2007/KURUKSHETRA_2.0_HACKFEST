from kurukshetra.contracts import DataCompleteness, DetectionSignal, RiskZone, Severity, SignalLabel
from kurukshetra.scoring import score_transaction


def _signal(triggered: bool, contribution: float) -> DetectionSignal:
    return DetectionSignal(
        feature_id=99,
        feature_name="test-signal",
        label=SignalLabel.REAL,
        triggered=triggered,
        risk_contribution=contribution,
        severity=Severity.HIGH,
        explanation_code="TEST",
    )


def test_known_beneficiary_with_no_signals_allows():
    decision = score_transaction(
        transaction_id="t1",
        signals=[_signal(False, 0.0)],
        tier_reached=0,
        is_known_beneficiary=True,
        data_completeness=DataCompleteness.FULL,
    )
    assert decision.risk_zone == RiskZone.ALLOW


def test_new_beneficiary_with_partial_data_never_allows():
    """The fallback contract: missing evidence on a new beneficiary must not
    silently resolve to ALLOW, even with zero fired signals."""
    decision = score_transaction(
        transaction_id="t2",
        signals=[_signal(False, 0.0)],
        tier_reached=1,
        is_known_beneficiary=False,
        data_completeness=DataCompleteness.PARTIAL,
    )
    assert decision.risk_zone != RiskZone.ALLOW
    assert decision.risk_zone == RiskZone.STEP_UP


def test_high_contribution_signals_reach_freeze():
    decision = score_transaction(
        transaction_id="t3",
        signals=[_signal(True, 0.5), _signal(True, 0.45)],
        tier_reached=1,
        is_known_beneficiary=False,
        data_completeness=DataCompleteness.FULL,
    )
    assert decision.risk_zone == RiskZone.FREEZE

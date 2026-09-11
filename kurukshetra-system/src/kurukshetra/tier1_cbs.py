"""Tier 1, SIMULATED detectors -- real algorithms running against the Mock
CBS Service's seeded data (docs/04-infrastructure-and-mocks.md). Stands in
for a bank's Core Banking System; in production this is a feature-export
pipeline, never live raw CBS access. Features #7, #18, #19, #20, #21.
"""
from __future__ import annotations

import datetime as dt
import statistics

from sqlalchemy import select
from sqlalchemy.orm import Session

from kurukshetra.contracts import DetectionSignal, Severity, SignalLabel
from kurukshetra.models import CbsAccount, CbsLedgerEntry


def _account_and_entries(session: Session, account_ref: str):
    account = session.get(CbsAccount, account_ref)
    entries = (
        session.execute(select(CbsLedgerEntry).where(CbsLedgerEntry.account_ref == account_ref))
        .scalars()
        .all()
    )
    return account, entries


def check_rapid_drainage(session: Session, account_ref: str) -> DetectionSignal:
    """Feature #7 -- Rapid Fund Drainage Velocity. Median residence time
    between a credit and the next debit."""
    account, entries = _account_and_entries(session, account_ref)
    if account is None or not entries:
        return _no_data_signal(7, "Rapid Fund Drainage Velocity")

    entries_sorted = sorted(entries, key=lambda e: e.occurred_at)
    residence_times = []
    pending_credit_time: dt.datetime | None = None
    for e in entries_sorted:
        if e.direction == "CREDIT":
            pending_credit_time = e.occurred_at
        elif e.direction == "DEBIT" and pending_credit_time is not None:
            residence_times.append((e.occurred_at - pending_credit_time).total_seconds())
            pending_credit_time = None

    if not residence_times:
        return _no_data_signal(7, "Rapid Fund Drainage Velocity")

    median_seconds = statistics.median(residence_times)
    triggered = median_seconds < 300
    return DetectionSignal(
        feature_id=7,
        feature_name="Rapid Fund Drainage Velocity",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.45 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"median_residence_seconds": median_seconds},
        explanation_code="INSTANT_CASH_OUT_MULE_PATTERN" if triggered else "NORMAL_FUND_RESIDENCE",
    )


def check_one_way_account(session: Session, account_ref: str) -> DetectionSignal:
    """Feature #18 -- One-Way Account Detection (Pure Sink Anomaly)."""
    account, entries = _account_and_entries(session, account_ref)
    if account is None or not entries:
        return _no_data_signal(18, "One-Way Account Detection")

    inbound = [e for e in entries if e.direction == "CREDIT"]
    outbound = [e for e in entries if e.direction == "DEBIT"]
    unique_senders = len(inbound)  # simplification: one synthetic sender per seeded credit row
    unique_beneficiaries = max(len(outbound), 1)
    sink_ratio = unique_senders / unique_beneficiaries
    triggered = sink_ratio > 20 and account.account_type != "MERCHANT"

    return DetectionSignal(
        feature_id=18,
        feature_name="One-Way Account Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"sink_ratio": round(sink_ratio, 2), "account_type": account.account_type},
        explanation_code="PURE_SINK_MULE_ACCOUNT" if triggered else "BIDIRECTIONAL_CASH_FLOW",
    )


def check_burst_drain_dormant(session: Session, account_ref: str) -> DetectionSignal:
    """Feature #19 -- Burst-Drain-Dormant Lifecycle Detection."""
    account, entries = _account_and_entries(session, account_ref)
    if account is None:
        return _no_data_signal(19, "Burst-Drain-Dormant Lifecycle")

    dormant_before = (dt.datetime.utcnow() - account.opened_at).days > 180 and account.current_balance < 500
    recent_window = dt.datetime.utcnow() - dt.timedelta(hours=48)
    recent_credits = [e for e in entries if e.direction == "CREDIT" and e.occurred_at >= recent_window]
    burst_inflow = sum(e.amount for e in recent_credits)
    recent_debits = [e for e in entries if e.direction == "DEBIT" and e.occurred_at >= recent_window]
    drained = sum(e.amount for e in recent_debits)
    drain_ratio = (drained / burst_inflow) if burst_inflow else 0.0

    triggered = bool(recent_credits) and burst_inflow > 10_000 and drain_ratio > 0.9

    return DetectionSignal(
        feature_id=19,
        feature_name="Burst-Drain-Dormant Lifecycle Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.5 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"burst_inflow_48h": burst_inflow, "drain_ratio": round(drain_ratio, 2)},
        explanation_code="COMPROMISED_DORMANT_ACCOUNT" if triggered else "NO_BURST_DRAIN_PATTERN",
    )


def check_scam_hours(session: Session, account_ref: str) -> DetectionSignal:
    """Feature #20 -- Scam Hours Activity Concentration."""
    account, entries = _account_and_entries(session, account_ref)
    credits = [e for e in entries if e.direction == "CREDIT"]
    if len(credits) < 5:
        return _no_data_signal(20, "Scam Hours Activity Concentration")

    def is_business_hours(ts: dt.datetime) -> bool:
        return ts.weekday() < 5 and 10 <= ts.hour < 18

    concentrated = sum(1 for e in credits if is_business_hours(e.occurred_at))
    ratio = concentrated / len(credits)
    triggered = ratio >= 0.95

    return DetectionSignal(
        feature_id=20,
        feature_name="Scam Hours Activity Concentration",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.2 if triggered else 0.0,
        severity=Severity.MEDIUM if triggered else Severity.LOW,
        evidence={"business_hours_ratio": round(ratio, 2), "sample_size": len(credits)},
        explanation_code="BOILER_ROOM_SHIFT_PATTERN" if triggered else "NORMAL_TEMPORAL_DISTRIBUTION",
    )


def check_account_graph(session: Session, account_ref: str) -> DetectionSignal:
    """Feature #21 -- Recipient Account Graph Analysis (age/KYC/geo-dispersion)."""
    account, entries = _account_and_entries(session, account_ref)
    if account is None:
        return _no_data_signal(21, "Recipient Account Graph Analysis")

    age_days = (dt.datetime.utcnow() - account.opened_at).days
    recent_window = dt.datetime.utcnow() - dt.timedelta(hours=48)
    recent_states = {e.counterparty_state for e in entries if e.occurred_at >= recent_window and e.counterparty_state}
    geo_entropy = len(recent_states)

    triggered = age_days < 7 and account.kyc_tier == "BASIC_OTP" and geo_entropy >= 5
    risk = 0.0
    if age_days < 7:
        risk += 0.2
    if geo_entropy >= 5:
        risk += 0.3

    return DetectionSignal(
        feature_id=21,
        feature_name="Recipient Account Graph Analysis",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=round(risk, 2) if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"account_age_days": age_days, "kyc_tier": account.kyc_tier, "distinct_states_48h": geo_entropy},
        explanation_code="CROSS_STATE_MULE_SYNDICATE_PROFILE" if triggered else "NORMAL_ACCOUNT_PROFILE",
    )


def _no_data_signal(feature_id: int, feature_name: str) -> DetectionSignal:
    """No CBS record exists for this account yet (e.g. an account not in the
    seed set). Not-triggered, but callers should treat this as incomplete
    data for the fallback contract, not as a clean bill of health."""
    return DetectionSignal(
        feature_id=feature_id,
        feature_name=feature_name,
        label=SignalLabel.SIMULATED,
        triggered=False,
        risk_contribution=0.0,
        severity=Severity.LOW,
        evidence={"reason": "no_cbs_record"},
        explanation_code="NO_CBS_DATA_AVAILABLE",
    )

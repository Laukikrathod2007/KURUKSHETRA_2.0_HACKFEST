"""Tier 1, SIMULATED detectors -- Core Banking System (CBS) beneficiary forensics.

Features:
- Feature #7: Rapid Fund Drainage Velocity (median residence time < 300s before cash-out)
- Feature #18: One-Way Account Detection (pure sink anomaly, inflow from many senders, zero legitimate spend)
- Feature #19: Burst-Drain-Dormant Lifecycle Detection (dormant account suddenly receiving large burst and draining >90%)
- Feature #20: Scam Hours Activity Concentration (boiler room working shift patterns)
- Feature #21: Recipient Account Graph Analysis (new account <7 days, minimal KYC, multi-state dispersion)
"""
from __future__ import annotations

import datetime as dt
import statistics
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.config import (
    CBS_BURST_DRAIN_RATIO,
    CBS_BURST_INFLOW_THRESHOLD_PAISE,
    CBS_DORMANT_DAYS,
    CBS_DORMANT_MAX_BALANCE_PAISE,
    CBS_DRAINAGE_MEDIAN_SECONDS,
    CBS_GRAPH_MAX_AGE_DAYS,
    CBS_GRAPH_MIN_GEO_ENTROPY,
    CBS_ONE_WAY_MIN_INBOUND,
    CBS_ONE_WAY_SINK_RATIO,
    CBS_SCAM_HOURS_MIN_CREDITS,
    CBS_SCAM_HOURS_RATIO,
    format_inr,
)
from ecosystem.models import Account, Direction, KycTier, LedgerEntry
from ecosystem.risk.contracts import DetectionSignal, Severity, SignalLabel


def _no_data_signal(feature_id: int, feature_name: str) -> DetectionSignal:
    return DetectionSignal(
        feature_id=feature_id,
        feature_name=feature_name,
        label=SignalLabel.SIMULATED,
        triggered=False,
        risk_contribution=0.0,
        severity=Severity.LOW,
        evidence={"reason": "NO_CBS_DATA_AVAILABLE"},
        explanation_code="NO_DATA",
    )


def check_rapid_drainage(session: Session, account_id: str) -> DetectionSignal:
    """Feature #7 -- Rapid Fund Drainage Velocity."""
    account = session.get(Account, account_id)
    if not account:
        return _no_data_signal(7, "Rapid Fund Drainage Velocity")

    stmt = (
        select(LedgerEntry)
        .where(LedgerEntry.account_id == account_id)
        .order_by(LedgerEntry.posted_at.asc())
    )
    entries = list(session.scalars(stmt).all())
    if not entries:
        return _no_data_signal(7, "Rapid Fund Drainage Velocity")

    residence_times = []
    pending_credit_time: Optional[dt.datetime] = None
    for e in entries:
        if e.direction == Direction.CREDIT:
            pending_credit_time = e.posted_at
        elif e.direction == Direction.DEBIT and pending_credit_time is not None:
            diff = (e.posted_at - pending_credit_time).total_seconds()
            if diff >= 0:
                residence_times.append(diff)
            pending_credit_time = None

    if not residence_times:
        return _no_data_signal(7, "Rapid Fund Drainage Velocity")

    median_seconds = statistics.median(residence_times)
    triggered = median_seconds < 300  # less than 5 minutes

    return DetectionSignal(
        feature_id=7,
        feature_name="Rapid Fund Drainage Velocity",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.45 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"median_residence_seconds": round(median_seconds, 1)},
        explanation_code="INSTANT_CASH_OUT_MULE_PATTERN"
        if triggered
        else "NORMAL_FUND_RESIDENCE",
    )


def check_one_way_account(session: Session, account_id: str) -> DetectionSignal:
    """Feature #18 -- One-Way Account Detection (Pure Sink Anomaly)."""
    account = session.get(Account, account_id)
    if not account:
        return _no_data_signal(18, "One-Way Account Detection")

    stmt = select(LedgerEntry).where(LedgerEntry.account_id == account_id)
    entries = list(session.scalars(stmt).all())
    if not entries:
        return _no_data_signal(18, "One-Way Account Detection")

    inbound = [e for e in entries if e.direction == Direction.CREDIT]
    outbound = [e for e in entries if e.direction == Direction.DEBIT]
    unique_senders = len({e.counterparty_account_id for e in inbound if e.counterparty_account_id}) or len(inbound)
    unique_beneficiaries = max(len({e.counterparty_account_id for e in outbound if e.counterparty_account_id}) or len(outbound), 1)

    sink_ratio = unique_senders / unique_beneficiaries
    is_personal = account.mcc == "0000"
    triggered = sink_ratio >= 10 and is_personal and len(inbound) >= 5

    return DetectionSignal(
        feature_id=18,
        feature_name="One-Way Account Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.4 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={"sink_ratio": round(sink_ratio, 1), "account_type": account.account_type.value},
        explanation_code="PURE_SINK_MULE_ACCOUNT"
        if triggered
        else "BIDIRECTIONAL_CASH_FLOW",
    )


def check_burst_drain_dormant(session: Session, account_id: str) -> DetectionSignal:
    """Feature #19 -- Burst-Drain-Dormant Lifecycle Detection."""
    account = session.get(Account, account_id)
    if not account:
        return _no_data_signal(19, "Burst-Drain-Dormant Lifecycle")

    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    stmt = select(LedgerEntry).where(LedgerEntry.account_id == account_id)
    entries = list(session.scalars(stmt).all())

    dormant_before = (now - account.opened_at).days > 180 and account.balance_paise < 50_000  # < Rs 500
    recent_window = now - dt.timedelta(hours=48)
    recent_credits = [e for e in entries if e.direction == Direction.CREDIT and e.posted_at >= recent_window]
    burst_inflow = sum(e.amount_paise for e in recent_credits)
    recent_debits = [e for e in entries if e.direction == Direction.DEBIT and e.posted_at >= recent_window]
    drained = sum(e.amount_paise for e in recent_debits)
    drain_ratio = (drained / burst_inflow) if burst_inflow else 0.0

    triggered = bool(recent_credits) and burst_inflow > 100_000_00 and drain_ratio > 0.9  # > Rs 1,00,000

    return DetectionSignal(
        feature_id=19,
        feature_name="Burst-Drain-Dormant Lifecycle Detection",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=0.5 if triggered else 0.0,
        severity=Severity.CRITICAL if triggered else Severity.LOW,
        evidence={
            "burst_inflow_48h": format_inr(burst_inflow),
            "drain_ratio": round(drain_ratio, 2),
            "dormant_prior": dormant_before,
        },
        explanation_code="COMPROMISED_DORMANT_ACCOUNT"
        if triggered
        else "NO_BURST_DRAIN_PATTERN",
    )


def check_scam_hours(session: Session, account_id: str) -> DetectionSignal:
    """Feature #20 -- Scam Hours Activity Concentration."""
    stmt = select(LedgerEntry).where(
        LedgerEntry.account_id == account_id,
        LedgerEntry.direction == Direction.CREDIT,
    )
    credits = list(session.scalars(stmt).all())
    if len(credits) < 5:
        return _no_data_signal(20, "Scam Hours Activity Concentration")

    def is_business_hours(ts: dt.datetime) -> bool:
        return ts.weekday() < 5 and 10 <= ts.hour < 18

    concentrated = sum(1 for e in credits if is_business_hours(e.posted_at))
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
        explanation_code="BOILER_ROOM_SHIFT_PATTERN"
        if triggered
        else "NORMAL_TEMPORAL_DISTRIBUTION",
    )


def check_account_graph(session: Session, account_id: str) -> DetectionSignal:
    """Feature #21 -- Recipient Account Graph Analysis."""
    account = session.get(Account, account_id)
    if not account:
        return _no_data_signal(21, "Recipient Account Graph Analysis")

    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)
    age_days = (now - account.opened_at).days
    stmt = select(LedgerEntry).where(LedgerEntry.account_id == account_id)
    entries = list(session.scalars(stmt).all())

    recent_window = now - dt.timedelta(hours=48)
    recent_states = {
        e.counterparty_state
        for e in entries
        if e.posted_at >= recent_window and e.counterparty_state
    }
    geo_entropy = len(recent_states)

    triggered = age_days < 7 and account.kyc_tier == KycTier.BASIC_OTP and geo_entropy >= 3
    risk = 0.0
    if age_days < 7:
        risk += 0.2
    if geo_entropy >= 3:
        risk += 0.25

    return DetectionSignal(
        feature_id=21,
        feature_name="Recipient Account Graph Analysis",
        label=SignalLabel.SIMULATED,
        triggered=triggered,
        risk_contribution=risk if triggered else 0.0,
        severity=Severity.HIGH if triggered else Severity.LOW,
        evidence={"account_age_days": age_days, "kyc_tier": account.kyc_tier.value, "geo_entropy_states": geo_entropy},
        explanation_code="MULE_SYNDICATE_GRAPH_SIGNATURE"
        if triggered
        else "BENIGN_ACCOUNT_GRAPH",
    )

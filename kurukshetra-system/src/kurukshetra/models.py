"""ORM models -- one table set per docs/04-infrastructure-and-mocks.md database."""
from __future__ import annotations

import datetime as dt

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from kurukshetra.db import Base


def _now() -> dt.datetime:
    return dt.datetime.utcnow()


# ---------------------------------------------------------------------------
# 1. Local Ledger DB (Real) -- the payer's own app-side transaction history.
# ---------------------------------------------------------------------------
class Payer(Base):
    __tablename__ = "payers"
    payer_id: Mapped[str] = mapped_column(String, primary_key=True)
    display_name: Mapped[str] = mapped_column(String)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    beneficiary_ref: Mapped[str] = mapped_column(String, primary_key=True)
    first_seen_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class PayerBeneficiaryLink(Base):
    __tablename__ = "payer_beneficiary_link"
    payer_id: Mapped[str] = mapped_column(String, primary_key=True)
    beneficiary_ref: Mapped[str] = mapped_column(String, primary_key=True)
    first_transaction_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    successful_transaction_count: Mapped[int] = mapped_column(Integer, default=0)


class LedgerTransaction(Base):
    __tablename__ = "transactions"
    transaction_id: Mapped[str] = mapped_column(String, primary_key=True)
    payer_id: Mapped[str] = mapped_column(String)
    beneficiary_ref: Mapped[str] = mapped_column(String)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="INR")
    direction: Mapped[str] = mapped_column(String, default="OUTBOUND")  # OUTBOUND / INBOUND
    initiated_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    decision: Mapped[str] = mapped_column(String, default="")
    held_until: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)


class SwitchMetric(Base):
    """PSP-scoped ReqValAdd/ReqPay counters -- features #1 and #2. See
    docs/03-feature-tier-map.md: the true cross-PSP version of these needs
    NPCI-native deployment; this is the honest single-PSP proxy."""

    __tablename__ = "switch_metrics"
    target_ref: Mapped[str] = mapped_column(String, primary_key=True)
    lookup_count: Mapped[int] = mapped_column(Integer, default=0)
    pay_count: Mapped[int] = mapped_column(Integer, default=0)
    first_lookup_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    last_lookup_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    baseline_lookups_per_hour: Mapped[float] = mapped_column(Float, default=0.05)


# ---------------------------------------------------------------------------
# 2. Reputation / Community DB (Real logic, seeded data)
# ---------------------------------------------------------------------------
class ScamReport(Base):
    __tablename__ = "scam_reports"
    report_id: Mapped[str] = mapped_column(String, primary_key=True)
    target_ref: Mapped[str] = mapped_column(String)
    reporter_identity_hash: Mapped[str] = mapped_column(String)
    reason_code: Mapped[str] = mapped_column(String)
    reported_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class ReputationScore(Base):
    __tablename__ = "reputation_scores"
    target_ref: Mapped[str] = mapped_column(String, primary_key=True)
    distinct_reporter_count: Mapped[int] = mapped_column(Integer, default=0)
    community_risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    last_updated_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ---------------------------------------------------------------------------
# 3. Mock CBS Service (Simulated) -- stands in for a bank's Core Banking System.
# ---------------------------------------------------------------------------
class CbsAccount(Base):
    __tablename__ = "cbs_accounts"
    account_ref: Mapped[str] = mapped_column(String, primary_key=True)
    opened_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    kyc_tier: Mapped[str] = mapped_column(String, default="BASIC_OTP")
    account_type: Mapped[str] = mapped_column(String, default="SAVINGS")
    mc_code: Mapped[str] = mapped_column(String, default="0000")
    current_balance: Mapped[float] = mapped_column(Float, default=0.0)


class CbsLedgerEntry(Base):
    __tablename__ = "cbs_ledger_entries"
    entry_id: Mapped[str] = mapped_column(String, primary_key=True)
    account_ref: Mapped[str] = mapped_column(String, ForeignKey("cbs_accounts.account_ref"))
    direction: Mapped[str] = mapped_column(String)  # CREDIT / DEBIT
    amount: Mapped[float] = mapped_column(Float)
    counterparty_state: Mapped[str] = mapped_column(String, default="")
    occurred_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ---------------------------------------------------------------------------
# 4. Mock Government Registry (Conceptual) -- always carries a CONCEPTUAL label.
# ---------------------------------------------------------------------------
class RegistryFlag(Base):
    __tablename__ = "registry_flags"
    target_ref: Mapped[str] = mapped_column(String, primary_key=True)
    flag_type: Mapped[str] = mapped_column(String)
    reference_id: Mapped[str] = mapped_column(String)
    flagged_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class InterventionOutcome(Base):
    """Feature #36 -- Intervention Effectiveness Tracking. Which template was
    shown for a COACH/FREEZE decision, and whether the user proceeded or
    aborted. Written by the MCP tool `log_intervention_outcome`."""

    __tablename__ = "intervention_outcomes"
    outcome_id: Mapped[str] = mapped_column(String, primary_key=True)
    transaction_id: Mapped[str] = mapped_column(String)
    intervention_template_id: Mapped[str] = mapped_column(String)
    user_action: Mapped[str] = mapped_column(String)  # 'PROCEEDED' / 'ABORTED' / 'PENDING'
    recorded_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class TrustedContactNotification(Base):
    """Feature #26 -- mocked delivery channel for the trusted-contact override."""

    __tablename__ = "trusted_contact_notifications"
    notification_id: Mapped[str] = mapped_column(String, primary_key=True)
    payer_id: Mapped[str] = mapped_column(String)
    transaction_id: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    sent_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ---------------------------------------------------------------------------
# 5. Audit Log (Real) -- append-only, hash-chained.
# ---------------------------------------------------------------------------
class AuditEntry(Base):
    __tablename__ = "audit_entries"
    sequence_no: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    transaction_id: Mapped[str] = mapped_column(String)
    prev_hash: Mapped[str] = mapped_column(String)
    entry_hash: Mapped[str] = mapped_column(String)
    decision: Mapped[str] = mapped_column(String)
    risk_score: Mapped[float] = mapped_column(Float)
    evidence_json: Mapped[str] = mapped_column(String)  # JSON-serialized, no raw PII
    written_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)

"""The complete ecosystem data model.

Tables are grouped by WHO OWNS THEM in the real world. That ownership is not
cosmetic -- it is the thing that makes the simulation honest. A real PSP
cannot read another PSP's history table; a real fraud engine cannot read raw
CBS rows. The grouping below records those boundaries, and the service layer
respects them.

Money is INTEGER PAISE everywhere. See ecosystem/config.py.
"""
from __future__ import annotations

import datetime as dt
import enum

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ecosystem.db import Base


def _now() -> dt.datetime:
    return dt.datetime.now(dt.UTC).replace(tzinfo=None)


# ===========================================================================
# ENUMS
# ===========================================================================


class Rail(str, enum.Enum):
    UPI = "UPI"
    CARD = "CARD"
    NETBANKING = "NETBANKING"


class AccountType(str, enum.Enum):
    SAVINGS = "SAVINGS"
    CURRENT = "CURRENT"
    MERCHANT = "MERCHANT"


class AccountStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    FROZEN = "FROZEN"
    DORMANT = "DORMANT"


class KycTier(str, enum.Enum):
    FULL = "FULL"
    BASIC_OTP = "BASIC_OTP"
    MINIMAL = "MINIMAL"


class TxnState(str, enum.Enum):
    """See docs/01-system-model.md section 6 for the state machine."""

    INITIATED = "INITIATED"
    RESOLVED = "RESOLVED"
    RISK_EVALUATED = "RISK_EVALUATED"
    AWAITING_CONFIRM = "AWAITING_CONFIRM"  # STEP_UP
    AWAITING_ACK = "AWAITING_ACK"  # COACH
    AWAITING_AUTH = "AWAITING_AUTH"  # PIN / OTP
    AUTHORIZED = "AUTHORIZED"
    DEBITED = "DEBITED"
    COMPLETED = "COMPLETED"
    BLOCKED = "BLOCKED"  # terminal -- FREEZE
    FAILED = "FAILED"  # terminal -- auth failed / insufficient funds
    CANCELLED = "CANCELLED"  # terminal -- user backed out
    REVERSED = "REVERSED"  # terminal -- credit leg failed after debit


class Direction(str, enum.Enum):
    DEBIT = "DEBIT"
    CREDIT = "CREDIT"


class RiskZone(str, enum.Enum):
    ALLOW = "ALLOW"
    STEP_UP = "STEP_UP"
    COACH = "COACH"
    FREEZE = "FREEZE"


class SignalLabel(str, enum.Enum):
    REAL = "REAL"
    SIMULATED = "SIMULATED"
    CONCEPTUAL = "CONCEPTUAL"


# ===========================================================================
# OWNED BY: BANKS  (core banking system -- the actual money)
# ===========================================================================


class Bank(Base):
    __tablename__ = "banks"
    bank_id: Mapped[str] = mapped_column(String, primary_key=True)  # e.g. "SBIN"
    name: Mapped[str] = mapped_column(String)
    ifsc_prefix: Mapped[str] = mapped_column(String)


class Customer(Base):
    """A human being. Owned by their bank (KYC record)."""

    __tablename__ = "customers"
    customer_id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String, index=True)
    kyc_tier: Mapped[KycTier] = mapped_column(Enum(KycTier), default=KycTier.FULL)
    pan_hash: Mapped[str | None] = mapped_column(String, nullable=True)
    declared_occupation: Mapped[str | None] = mapped_column(String, nullable=True)
    declared_annual_income_paise: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_senior_citizen: Mapped[bool] = mapped_column(Boolean, default=False)
    home_state: Mapped[str] = mapped_column(String, default="Maharashtra")
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class Account(Base):
    """A bank account. `balance_paise` here IS the money -- the single source
    of truth that ledger postings move."""

    __tablename__ = "accounts"
    account_id: Mapped[str] = mapped_column(String, primary_key=True)
    bank_id: Mapped[str] = mapped_column(String, ForeignKey("banks.bank_id"))
    customer_id: Mapped[str] = mapped_column(String, ForeignKey("customers.customer_id"))
    account_number: Mapped[str] = mapped_column(String)
    ifsc: Mapped[str] = mapped_column(String)
    account_type: Mapped[AccountType] = mapped_column(Enum(AccountType), default=AccountType.SAVINGS)
    mcc: Mapped[str] = mapped_column(String, default="0000")  # 0000 = personal, not a merchant
    balance_paise: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[AccountStatus] = mapped_column(Enum(AccountStatus), default=AccountStatus.ACTIVE)
    kyc_tier: Mapped[KycTier] = mapped_column(Enum(KycTier), default=KycTier.FULL)
    branch_state: Mapped[str] = mapped_column(String, default="Maharashtra")
    opened_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class LedgerEntry(Base):
    """Double-entry posting. A completed payment produces exactly two of
    these -- a DEBIT at the payer's bank, a CREDIT at the payee's bank.
    A BLOCKED payment produces zero. This invariant is asserted in tests."""

    __tablename__ = "ledger_entries"
    entry_id: Mapped[str] = mapped_column(String, primary_key=True)
    account_id: Mapped[str] = mapped_column(String, ForeignKey("accounts.account_id"), index=True)
    txn_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    direction: Mapped[Direction] = mapped_column(Enum(Direction))
    amount_paise: Mapped[int] = mapped_column(Integer)
    balance_after_paise: Mapped[int] = mapped_column(Integer)
    counterparty_account_id: Mapped[str | None] = mapped_column(String, nullable=True)
    counterparty_state: Mapped[str | None] = mapped_column(String, nullable=True)
    narration: Mapped[str] = mapped_column(String, default="")
    posted_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now, index=True)


# ===========================================================================
# OWNED BY: NPCI  (routing metadata -- NOT a ledger)
# ===========================================================================


class VpaMapping(Base):
    """NPCI Central Mapper: VPA -> account. NPCI is the only party that sees
    all of these across every bank and PSP."""

    __tablename__ = "vpa_mappings"
    vpa: Mapped[str] = mapped_column(String, primary_key=True)
    account_id: Mapped[str] = mapped_column(String, ForeignKey("accounts.account_id"), index=True)
    psp_handle: Mapped[str] = mapped_column(String)  # oksbi, ybl, paytm...
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    suspended_reason: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class SwitchMetric(Base):
    """Per-VPA lookup/payment counters across ALL PSPs. Only NPCI can compute
    this -- it is the structural advantage of the NPCI-native position, and
    the basis for features #1, #2 and #13."""

    __tablename__ = "switch_metrics"
    target_ref: Mapped[str] = mapped_column(String, primary_key=True)
    lookup_count: Mapped[int] = mapped_column(Integer, default=0)
    pay_count: Mapped[int] = mapped_column(Integer, default=0)
    distinct_psp_count: Mapped[int] = mapped_column(Integer, default=0)
    first_lookup_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    last_lookup_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)
    baseline_lookups_per_hour: Mapped[float] = mapped_column(Float, default=0.05)


class SettlementObligation(Base):
    """NPCI records who owes whom. Real UPI settles on a deferred net basis;
    the sim records the obligation at the moment both legs succeed."""

    __tablename__ = "settlement_obligations"
    settlement_id: Mapped[str] = mapped_column(String, primary_key=True)
    txn_id: Mapped[str] = mapped_column(String, index=True)
    remitter_bank_id: Mapped[str] = mapped_column(String)
    beneficiary_bank_id: Mapped[str] = mapped_column(String)
    amount_paise: Mapped[int] = mapped_column(Integer)
    recorded_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ===========================================================================
# OWNED BY: PAYMENT APPS (PSPs)  -- each app sees ONLY its own slice
# ===========================================================================


class Psp(Base):
    __tablename__ = "psps"
    psp_id: Mapped[str] = mapped_column(String, primary_key=True)  # gpay, phonepe, paytm, bhim
    name: Mapped[str] = mapped_column(String)
    sponsor_bank_id: Mapped[str] = mapped_column(String)


class AppLocalHistory(Base):
    """THE Q3 ANSWER, made concrete.

    'Has this payer paid this payee before?' lives HERE -- scoped to one app.
    GPay's row set and PhonePe's row set are different. No party holds the
    union except NPCI (which sees instructions, not app history). The demo
    can show one app's blind spot directly by querying this per-psp.
    """

    __tablename__ = "app_local_history"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    psp_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    payee_ref: Mapped[str] = mapped_column(String, index=True)  # VPA or account+IFSC
    amount_paise: Mapped[int] = mapped_column(Integer)
    direction: Mapped[Direction] = mapped_column(Enum(Direction), default=Direction.DEBIT)
    txn_id: Mapped[str | None] = mapped_column(String, nullable=True)
    was_held: Mapped[bool] = mapped_column(Boolean, default=False)
    succeeded: Mapped[bool] = mapped_column(Boolean, default=True)
    occurred_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now, index=True)


class SavedBeneficiary(Base):
    """A payee the customer has explicitly saved in an app / netbanking."""

    __tablename__ = "saved_beneficiaries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    psp_id: Mapped[str | None] = mapped_column(String, nullable=True)  # null = netbanking
    customer_id: Mapped[str] = mapped_column(String, index=True)
    payee_ref: Mapped[str] = mapped_column(String)
    nickname: Mapped[str] = mapped_column(String, default="")
    added_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ===========================================================================
# OWNED BY: CARD NETWORK / ISSUER
# ===========================================================================


class Card(Base):
    __tablename__ = "cards"
    card_id: Mapped[str] = mapped_column(String, primary_key=True)
    account_id: Mapped[str] = mapped_column(String, ForeignKey("accounts.account_id"))
    masked_number: Mapped[str] = mapped_column(String)
    network: Mapped[str] = mapped_column(String, default="RUPAY")
    issuer_bank_id: Mapped[str] = mapped_column(String)
    expiry: Mapped[str] = mapped_column(String, default="12/29")


class Merchant(Base):
    __tablename__ = "merchants"
    merchant_id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    mcc: Mapped[str] = mapped_column(String, default="5411")
    settlement_account_id: Mapped[str] = mapped_column(String)
    acquirer_bank_id: Mapped[str] = mapped_column(String)
    onboarded_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ===========================================================================
# THE TRANSACTION ITSELF  (shared spine across all rails)
# ===========================================================================


class Transaction(Base):
    __tablename__ = "transactions"
    txn_id: Mapped[str] = mapped_column(String, primary_key=True)
    trace_id: Mapped[str] = mapped_column(String, index=True)
    rail: Mapped[Rail] = mapped_column(Enum(Rail))
    psp_id: Mapped[str | None] = mapped_column(String, nullable=True)

    payer_customer_id: Mapped[str] = mapped_column(String, index=True)
    payer_account_id: Mapped[str] = mapped_column(String, index=True)
    payee_ref: Mapped[str] = mapped_column(String, index=True)  # VPA / account+IFSC / merchant
    payee_account_id: Mapped[str | None] = mapped_column(String, nullable=True)
    payee_name_resolved: Mapped[str | None] = mapped_column(String, nullable=True)

    amount_paise: Mapped[int] = mapped_column(Integer, default=0)
    declared_purpose: Mapped[str | None] = mapped_column(String, nullable=True)
    state: Mapped[TxnState] = mapped_column(Enum(TxnState), default=TxnState.INITIATED, index=True)

    risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_zone: Mapped[RiskZone | None] = mapped_column(Enum(RiskZone), nullable=True)
    user_acknowledged: Mapped[bool] = mapped_column(Boolean, default=False)
    failure_reason: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now, index=True)
    completed_at: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)


# ===========================================================================
# OWNED BY: KURUKSHETRA (the fraud engine) + shared reputation service
# ===========================================================================


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    assessment_id: Mapped[str] = mapped_column(String, primary_key=True)
    txn_id: Mapped[str] = mapped_column(String, index=True)
    hook: Mapped[str] = mapped_column(String)  # HOOK_1_RESOLUTION / HOOK_2_PREFLIGHT
    risk_score: Mapped[float] = mapped_column(Float)
    risk_zone: Mapped[RiskZone] = mapped_column(Enum(RiskZone))
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    data_completeness: Mapped[str] = mapped_column(String, default="FULL")
    tier_reached: Mapped[int] = mapped_column(Integer, default=0)
    signals_json: Mapped[str] = mapped_column(Text, default="[]")
    elapsed_ms: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class ScamReport(Base):
    __tablename__ = "scam_reports"
    report_id: Mapped[str] = mapped_column(String, primary_key=True)
    target_ref: Mapped[str] = mapped_column(String, index=True)
    reporter_identity_hash: Mapped[str] = mapped_column(String)
    reason_code: Mapped[str] = mapped_column(String)
    reported_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class ReputationScore(Base):
    __tablename__ = "reputation_scores"
    target_ref: Mapped[str] = mapped_column(String, primary_key=True)
    distinct_reporter_count: Mapped[int] = mapped_column(Integer, default=0)
    community_risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    last_updated_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class RegistryFlag(Base):
    """CONCEPTUAL ONLY -- stands in for I4C/CFCFRMS, Aadhaar-PAN freeze, TRAI.
    Never presented as a live government query."""

    __tablename__ = "registry_flags"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    target_ref: Mapped[str] = mapped_column(String, index=True)
    flag_type: Mapped[str] = mapped_column(String)
    reference_id: Mapped[str] = mapped_column(String)
    flagged_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class InterventionOutcome(Base):
    __tablename__ = "intervention_outcomes"
    outcome_id: Mapped[str] = mapped_column(String, primary_key=True)
    txn_id: Mapped[str] = mapped_column(String, index=True)
    template_id: Mapped[str] = mapped_column(String)
    user_action: Mapped[str] = mapped_column(String, default="PENDING")
    recorded_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class TrustedContactNotification(Base):
    __tablename__ = "trusted_contact_notifications"
    notification_id: Mapped[str] = mapped_column(String, primary_key=True)
    customer_id: Mapped[str] = mapped_column(String)
    txn_id: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    sent_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


# ===========================================================================
# OBSERVABILITY  (every component writes here; the demo reads it)
# ===========================================================================


class TraceEvent(Base):
    """One row per step of a transaction's journey through the ecosystem.
    This is what makes the system watchable rather than merely functional."""

    __tablename__ = "trace_events"
    event_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trace_id: Mapped[str] = mapped_column(String, index=True)
    txn_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    seq: Mapped[int] = mapped_column(Integer)
    component: Mapped[str] = mapped_column(String)  # PSP_APP / NPCI_SWITCH / BANK_CBS / KURUKSHETRA / MCP ...
    action: Mapped[str] = mapped_column(String)
    summary: Mapped[str] = mapped_column(String)
    detail_json: Mapped[str] = mapped_column(Text, default="{}")
    elapsed_ms: Mapped[float] = mapped_column(Float, default=0.0)
    at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)


class AuditEntry(Base):
    """Append-only, hash-chained record of every risk decision."""

    __tablename__ = "audit_entries"
    sequence_no: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    txn_id: Mapped[str] = mapped_column(String, index=True)
    prev_hash: Mapped[str] = mapped_column(String)
    entry_hash: Mapped[str] = mapped_column(String)
    decision: Mapped[str] = mapped_column(String)
    risk_score: Mapped[float] = mapped_column(Float)
    evidence_json: Mapped[str] = mapped_column(Text, default="{}")
    written_at: Mapped[dt.datetime] = mapped_column(DateTime, default=_now)

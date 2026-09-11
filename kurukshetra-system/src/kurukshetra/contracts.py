"""Canonical input/output contracts.

Mirrors docs/06-canonical-contracts.md exactly. Every component boundary in the
system speaks these shapes -- the mock NPCI switch, the mock PSP app, the risk
engine, and (eventually) the MCP host all import from here rather than
re-declaring fields, so the contract can only drift in one place.
"""
from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class EventType(str, Enum):
    VPA_RESOLUTION = "VPA_RESOLUTION"
    PAYMENT_PREFLIGHT = "PAYMENT_PREFLIGHT"


class PaymentMethod(str, Enum):
    UPI = "UPI"
    CARD_CNP = "CARD_CNP"
    NETBANKING = "NETBANKING"


class TransactionType(str, Enum):
    P2P = "P2P"
    P2M = "P2M"
    COLLECT_REQUEST = "COLLECT_REQUEST"


class ArrivedVia(str, Enum):
    MANUAL_ENTRY = "MANUAL_ENTRY"
    QR_SCAN = "QR_SCAN"
    DEEP_LINK = "DEEP_LINK"


class RiskZone(str, Enum):
    ALLOW = "ALLOW"
    STEP_UP = "STEP_UP"
    COACH = "COACH"
    FREEZE = "FREEZE"


class DataCompleteness(str, Enum):
    FULL = "FULL"
    PARTIAL = "PARTIAL"
    DEGRADED = "DEGRADED"


class SignalLabel(str, Enum):
    REAL = "REAL"
    SIMULATED = "SIMULATED"
    CONCEPTUAL = "CONCEPTUAL"


class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class PayerContext(BaseModel):
    payer_id_hash: str
    app_local_history_ref: Optional[str] = None


class RecipientContext(BaseModel):
    beneficiary_ref_hash: str
    resolved_name: Optional[str] = None
    mc_code: Optional[str] = None
    raw_handle_string: Optional[str] = None
    declared_purpose: Optional[str] = None


class TransactionDetails(BaseModel):
    amount: Optional[float] = None
    currency: str = "INR"
    type: TransactionType = TransactionType.P2P


class Provenance(BaseModel):
    arrived_via: ArrivedVia = ArrivedVia.MANUAL_ENTRY
    raw_uri: Optional[str] = None


class TransactionAnalysisRequest(BaseModel):
    event: EventType
    transaction_id: str
    payment_method: PaymentMethod = PaymentMethod.UPI
    payer_context: PayerContext
    recipient_context: RecipientContext
    transaction: TransactionDetails = Field(default_factory=TransactionDetails)
    provenance: Provenance = Field(default_factory=Provenance)


class DetectionSignal(BaseModel):
    feature_id: int
    feature_name: str
    label: SignalLabel
    triggered: bool
    risk_contribution: float
    severity: Severity
    evidence: dict[str, Any] = Field(default_factory=dict)
    explanation_code: str


class RiskDecision(BaseModel):
    transaction_id: str
    risk_score: float
    confidence: float
    risk_zone: RiskZone
    decision: str
    data_completeness: DataCompleteness
    tier_reached: int
    checks_executed: list[str] = Field(default_factory=list)
    signals: list[DetectionSignal] = Field(default_factory=list)
    reasons: list[str] = Field(default_factory=list)
    recommended_action: str
    audit_ref: Optional[str] = None

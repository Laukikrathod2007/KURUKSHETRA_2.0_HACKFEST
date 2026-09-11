"""Core Data Contracts, Enums, and Protocol Payloads for Kurukshetra."""

from __future__ import annotations
from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import time


class ActionDirective(str, Enum):
    ALLOW = "ALLOW"
    INTERVENE_STEP_UP = "INTERVENE_STEP_UP"
    INTERVENE_COACH = "INTERVENE_COACH"
    INTERVENE_FREEZE = "INTERVENE_FREEZE"


class ScamTypology(str, Enum):
    BENIGN = "BENIGN"
    IMPERSONATION_POLICE = "IMPERSONATION_POLICE"
    IMPERSONATION_BANK_SUPPORT = "IMPERSONATION_BANK_SUPPORT"
    REMOTE_ACCESS_TAKEOVER = "REMOTE_ACCESS_TAKEOVER"
    INVESTMENT_CRYPTO_PIG_BUTCHERING = "INVESTMENT_CRYPTO_PIG_BUTCHERING"
    ROMANCE_GROOMING = "ROMANCE_GROOMING"
    ADVANCE_FEE_LOAN = "ADVANCE_FEE_LOAN"
    MULE_RAPID_DISPERSION = "MULE_RAPID_DISPERSION"


class TelemetryVector(BaseModel):
    """Client device and behavioral telemetry captured at payment intent."""
    active_call: bool = False
    call_duration_seconds: int = 0
    call_type: str = "NONE"  # GSM, VOIP, NONE
    remote_access_software_active: bool = False
    remote_access_package_name: str = "NONE"
    screen_sharing_active: bool = False
    touch_flight_time_variance: float = 0.05
    touch_pressure_deviation: float = 0.02
    hesitation_dwell_time_ms: int = 400
    is_device_rooted: bool = False
    hardware_attestation_valid: bool = True


class AccountContext(BaseModel):
    """Pre-warmed sender and recipient relational features."""
    sender_account_hash: str
    recipient_account_hash: str
    amount: float
    currency: str = "USD"
    sender_account_age_days: int = 365
    sender_24h_velocity_count: int = 1
    sender_24h_cumulative_outflow: float = 100.0
    sender_balance_before_tx: float = 5000.0
    is_first_time_recipient: bool = False
    payee_relationship_age_hours: int = 720
    recipient_mule_cluster_score: float = 0.05
    recipient_in_degree_24h: int = 1
    is_sanctioned_recipient: bool = False
    customer_age: int = 42
    is_vulnerable_customer: bool = False


class FeatureAttribution(BaseModel):
    feature_name: str
    feature_value: float
    shap_attribution: float
    human_readable_label: str


class RiskVerdict(BaseModel):
    transaction_id: str
    calibrated_risk_score: float
    epistemic_uncertainty: float
    detected_typology: ScamTypology
    top_attributions: List[FeatureAttribution] = Field(default_factory=list)
    inference_latency_ms: float = 0.0


class InterceptionResponse(BaseModel):
    transaction_id: str
    directive: ActionDirective
    risk_score: float
    epistemic_uncertainty: float
    dwell_gate_seconds: int = 0
    counter_coaching_title: str = ""
    counter_coaching_body: str = ""
    affirmation_question: str = ""
    total_latency_ms: float = 0.0
    degraded_tier: str = "NONE"  # NONE, TIER_1_CACHE_DROP, TIER_2_MODEL_DROP, TIER_3_FAIL_OPEN


class EvidenceDossier(BaseModel):
    transaction_id: str
    timestamp_epoch_ms: int = Field(default_factory=lambda: int(time.time() * 1000))
    sender_account_hash: str
    recipient_account_hash: str
    amount: float
    directive: ActionDirective
    calibrated_risk_score: float
    epistemic_uncertainty: float
    detected_typology: ScamTypology
    top_attributions: List[FeatureAttribution]
    tipping_off_sanitized: bool = True
    adverse_action_reasons: List[str] = Field(default_factory=list)
    merkle_root_hash: str = ""

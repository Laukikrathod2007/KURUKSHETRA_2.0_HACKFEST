from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ActionDecision(str, Enum):
    ALLOW = "ALLOW"
    VERIFY = "VERIFY"
    PAUSE = "PAUSE"
    BLOCK = "BLOCK"

class PersonaType(str, Enum):
    SENIOR_CITIZEN = "SENIOR_CITIZEN"     # Susceptible to authority, digital arrest, fake utility cuts
    STUDENT_YOUTH = "STUDENT_YOUTH"       # Susceptible to crypto, part-time job/Telegram tasks, gaming
    SME_BUSINESS = "SME_BUSINESS"         # Susceptible to vendor invoice fraud, CEO impersonation
    GENERAL = "GENERAL"                   # Standard retail user

class TechnicalLiteracy(str, Enum):
    LOW = "LOW"         # Needs ultra-simple terms, maternal/paternal reassuring tone, zero jargon
    MEDIUM = "MEDIUM"   # Standard consumer language
    HIGH = "HIGH"       # Direct, technical alerts, fraud taxonomy acceptable

class UserProfile(BaseModel):
    user_id: str = "usr_default"
    persona_type: PersonaType = PersonaType.GENERAL
    technical_literacy: TechnicalLiteracy = TechnicalLiteracy.MEDIUM
    avg_txn_amount: float = Field(default=1500.0, description="30-day historical mean amount")
    max_typical_txn: float = Field(default=5000.0, description="Highest legitimate transaction on record")
    frequent_counterparties: List[str] = Field(default_factory=list)
    vulnerability_notes: Optional[str] = None

class PaymentRequest(BaseModel):
    transaction_id: str = Field(..., description="Unique transaction ID")
    user_id: Optional[str] = Field("usr_default", description="ID of sender")
    user_phone: Optional[str] = Field(None, description="Sender contact phone for emergency call")
    user_name: Optional[str] = Field("User", description="Name of sender")
    user_profile: Optional[UserProfile] = Field(default_factory=UserProfile, description="Dynamic user profile baseline")
    amount: float = Field(..., description="Transaction amount")
    currency: str = Field("INR", description="Currency")
    recipient_id: str = Field(..., description="UPI ID, Account No, or VPA")
    recipient_name: str = Field(..., description="Name of recipient")
    payment_note: Optional[str] = Field("", description="Transaction remarks/description")
    device_id: Optional[str] = Field("dev_default", description="Device fingerprint")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentSignal(BaseModel):
    agent_name: str
    risk_score: float = Field(..., ge=0, le=100)
    flagged: bool
    findings: List[str]
    confidence: float = Field(..., ge=0.0, le=1.0)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class RiskDossier(BaseModel):
    transaction_id: str
    user_id: str
    user_name: str
    user_phone: Optional[str]
    user_profile: Optional[UserProfile] = Field(default_factory=UserProfile)
    amount: float
    currency: str
    recipient_id: str
    recipient_name: str
    payment_note: str
    composite_risk_score: float
    risk_level: RiskLevel
    recommended_action: ActionDecision
    detected_scam_types: List[str]
    anomaly_summary: str
    txn_signals: AgentSignal
    recipient_signals: AgentSignal
    intent_signals: AgentSignal
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TruGenSessionResponse(BaseModel):
    session_id: str
    conversation_url: str
    agent_id: str
    context_injected: bool

class EmergencyCallRequest(BaseModel):
    transaction_id: str
    phone_number: Optional[str] = None

class EmergencyCallResponse(BaseModel):
    call_id: str
    status: str
    provider: str = "vapi"
    phone_number: str

class ProblemUploadRequest(BaseModel):
    user_name: Optional[str] = "User"
    user_phone: Optional[str] = None
    problem_text: str = Field(..., description="Raw text of the problem: SMS, chat transcript, email, or user complaint")
    source_channel: Optional[str] = Field("text", description="whatsapp, sms, phone_call, email, document_ocr")
    media_url: Optional[str] = None

class IncidentAnalysis(BaseModel):
    incident_id: str
    user_name: str
    raw_problem: str
    scam_category: str
    risk_level: RiskLevel
    risk_score: float = Field(..., ge=0, le=100)
    impersonated_entity: Optional[str] = None
    demanded_amount: Optional[str] = None
    coercion_tactics: List[str]
    immediate_guidance: str
    aria_first_message: str
    guardian_prompt: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


"""
Agentic Guardian — FastAPI Server
Exposes the full multi-agent pipeline, TruGen video sessions,
and Vapi emergency calls over HTTP.

Run with:
    uvicorn guardian.main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import uuid

from .models.schemas import (
    PaymentRequest, RiskDossier,
    ProblemUploadRequest, IncidentAnalysis,
    EmergencyCallRequest, EmergencyCallResponse,
    TruGenSessionResponse, UserProfile
)
from .agents.orchestrator import GuardianOrchestrator
from .agents.incident_agent import IncidentAnalyzer
from .services.trugen import TruGenService
from .services.vapi import VapiService
from .services.redis_client import SessionStore
from .config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agentic Guardian API",
    description="Real-Time Payment Scam Interception — PS09 KURUKSHETRA 2.0",
    version="1.0.0",
)

# ── CORS — allow frontend on localhost:3000 ─────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────────────────────────────────────────
# HEALTH
# ────────────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "operational",
        "service": "Agentic Guardian",
        "vapi_configured": not settings.vapi_api_key.startswith("dev_"),
        "trugen_configured": not settings.trugen_api_key.startswith("dev_"),
    }


# ────────────────────────────────────────────────────────────────────────────
# CORE: ANALYZE A PAYMENT
# POST /analyze
# ────────────────────────────────────────────────────────────────────────────

@app.post("/analyze", response_model=RiskDossier)
async def analyze_payment(payment: PaymentRequest):
    """
    Main endpoint — runs the full 3-agent pipeline and returns a RiskDossier.
    Called by the frontend Payment Simulator on every submission.
    """
    try:
        logger.info(f"Analyzing payment {payment.transaction_id} — ₹{payment.amount} to {payment.recipient_name}")
        dossier = GuardianOrchestrator.evaluate(payment)
        SessionStore.save_dossier(dossier)
        return dossier
    except Exception as e:
        logger.exception(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ────────────────────────────────────────────────────────────────────────────
# TRUGEN: LAUNCH VIDEO AVATAR SESSION
# POST /aria/video
# ────────────────────────────────────────────────────────────────────────────

@app.post("/aria/video", response_model=TruGenSessionResponse)
async def launch_video_guardian(request: EmergencyCallRequest):
    """
    Retrieves the stored dossier for a transaction and launches
    a TruGen AI video avatar session pre-loaded with full context.
    Returns the iframe embed URL for the frontend to display.
    """
    dossier = SessionStore.get_dossier(request.transaction_id)
    if not dossier:
        raise HTTPException(status_code=404, detail=f"No dossier found for transaction {request.transaction_id}")

    try:
        session = await TruGenService.create_guardian_session(dossier)
        logger.info(f"TruGen session created: {session.session_id} → {session.conversation_url}")
        return session
    except Exception as e:
        logger.exception(f"TruGen session creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ────────────────────────────────────────────────────────────────────────────
# VAPI: TRIGGER EMERGENCY PHONE CALL
# POST /aria/call
# ────────────────────────────────────────────────────────────────────────────

@app.post("/aria/call", response_model=EmergencyCallResponse)
async def trigger_emergency_call(request: EmergencyCallRequest):
    """
    Triggers an outbound emergency phone call via Vapi AI to the user's
    registered phone number, with Aria pre-briefed on the exact threat context.
    """
    dossier = SessionStore.get_dossier(request.transaction_id)
    if not dossier:
        raise HTTPException(status_code=404, detail=f"No dossier found for transaction {request.transaction_id}")

    try:
        result = await VapiService.trigger_emergency_call(
            dossier,
            target_phone=request.phone_number or dossier.user_phone
        )
        logger.info(f"Vapi call triggered: {result.call_id} → {result.phone_number}")
        return result
    except Exception as e:
        logger.exception(f"Vapi call failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ────────────────────────────────────────────────────────────────────────────
# INCIDENT: ANALYZE UPLOADED PROBLEM TEXT
# POST /incident/analyze
# ────────────────────────────────────────────────────────────────────────────

@app.post("/incident/analyze", response_model=IncidentAnalysis)
async def analyze_incident(request: ProblemUploadRequest):
    """
    Accepts raw problem text from a user (SMS, WhatsApp chat, email).
    Classifies the scam type, extracts demanded amount, builds TruGen prompt.
    """
    try:
        analysis = IncidentAnalyzer.analyze_uploaded_problem(request)
        return analysis
    except Exception as e:
        logger.exception(f"Incident analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/incident/video", response_model=TruGenSessionResponse)
async def launch_incident_video(request: ProblemUploadRequest):
    """
    One-shot endpoint: analyze uploaded problem AND immediately launch
    the TruGen video session with Aria's opening speech.
    """
    try:
        analysis = IncidentAnalyzer.analyze_uploaded_problem(request)
        session = await TruGenService.create_incident_video_session(analysis)
        return session
    except Exception as e:
        logger.exception(f"Incident video launch failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ────────────────────────────────────────────────────────────────────────────
# DECISION: UPDATE FINAL HUMAN DECISION
# POST /decision/{transaction_id}
# ────────────────────────────────────────────────────────────────────────────

class DecisionUpdate(BaseModel):
    action: str       # ALLOW, BLOCK, VERIFY
    reason: Optional[str] = ""

@app.post("/decision/{transaction_id}")
def update_decision(transaction_id: str, body: DecisionUpdate):
    """
    Records the human's final override decision after the intervention.
    """
    SessionStore.update_decision(transaction_id, body.action, body.reason)
    return {"status": "recorded", "transaction_id": transaction_id, "action": body.action}


@app.get("/dossier/{transaction_id}", response_model=RiskDossier)
def get_dossier(transaction_id: str):
    """Retrieve stored dossier for a transaction."""
    dossier = SessionStore.get_dossier(transaction_id)
    if not dossier:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return dossier

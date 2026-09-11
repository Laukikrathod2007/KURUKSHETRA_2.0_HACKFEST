"""
Agentic Guardian Security Core Module
PS09 — Real-time Multi-Agent Fraud Interceptor with TruGen AI & Vapi AI
"""

from guardian.models.schemas import (
    PaymentRequest, RiskDossier, RiskLevel, ActionDecision,
    TruGenSessionResponse, EmergencyCallResponse,
    ProblemUploadRequest, IncidentAnalysis
)
from guardian.agents.orchestrator import GuardianOrchestrator
from guardian.agents.incident_agent import IncidentAnalyzer
from guardian.services.trugen import TruGenService
from guardian.services.vapi import VapiService
from guardian.utils.prompt_builder import build_dynamic_guardian_prompt

def evaluate_payment(payment_data: dict | PaymentRequest) -> RiskDossier:
    """
    Evaluates a transaction across the multi-agent pipeline (Txn, Recipient, Intent).
    Returns a complete RiskDossier with risk score (0-100), scam narrative, and recommended action.
    """
    if isinstance(payment_data, dict):
        payment_obj = PaymentRequest(**payment_data)
    else:
        payment_obj = payment_data
    return GuardianOrchestrator.evaluate(payment_obj)

def analyze_problem(problem_data: dict | ProblemUploadRequest) -> IncidentAnalysis:
    """
    Parses unstructured user input (uploaded SMS, WhatsApp chat, email, or complaint text).
    Extracts impersonation patterns, coercion tactics, and builds dynamic TruGen prompts and speech lines.
    """
    if isinstance(problem_data, dict):
        req = ProblemUploadRequest(**problem_data)
    else:
        req = problem_data
    return IncidentAnalyzer.analyze_uploaded_problem(req)

async def ask_aria(dossier: RiskDossier) -> TruGenSessionResponse:
    """
    Spawns an interactive TruGen AI live video avatar session for a paused transaction.
    """
    return await TruGenService.create_guardian_session(dossier)

async def launch_incident_video_guardian(analysis: IncidentAnalysis) -> TruGenSessionResponse:
    """
    Dynamically launches TruGen AI video avatar pre-briefed on the user's uploaded problem,
    speaking opening remarks specific to the uploaded incident.
    """
    return await TruGenService.create_incident_video_session(analysis)

async def emergency_call(dossier: RiskDossier, phone_number: str = None) -> EmergencyCallResponse:
    """
    Dispatches an ultra-low latency emergency outbound call via Vapi AI to the customer's phone.
    """
    return await VapiService.trigger_emergency_call(dossier, target_phone=phone_number)

__all__ = [
    "evaluate_payment",
    "analyze_problem",
    "ask_aria",
    "launch_incident_video_guardian",
    "emergency_call",
    "PaymentRequest",
    "ProblemUploadRequest",
    "IncidentAnalysis",
    "RiskDossier",
    "RiskLevel",
    "ActionDecision",
    "build_dynamic_guardian_prompt"
]


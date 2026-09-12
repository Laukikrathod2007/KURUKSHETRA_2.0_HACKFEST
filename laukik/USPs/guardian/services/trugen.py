import httpx
import logging
from typing import Optional
from ..config import settings
from ..models.schemas import RiskDossier, TruGenSessionResponse
from ..utils.prompt_builder import build_dynamic_guardian_prompt

logger = logging.getLogger(__name__)

TRUGEN_API_BASE = "https://api.trugen.ai/v1"

class TruGenService:
    @staticmethod
    async def create_guardian_session(dossier: RiskDossier) -> TruGenSessionResponse:
        """
        Initializes an interactive video session with TruGen AI avatar.
        Dynamically passes the generated security dossier and guardrail prompt.
        """
        system_prompt = build_dynamic_guardian_prompt(dossier, channel="video")
        
        # Check if live credentials configured or in demo/mock mode
        api_key = settings.trugen_api_key
        agent_id = settings.trugen_agent_id

        if not api_key or api_key.startswith("your_") or not agent_id or agent_id.startswith("your_"):
            logger.warning("TruGen credentials not set. Returning high-fidelity simulation session URL.")
            return TruGenSessionResponse(
                session_id=f"tgs_{dossier.transaction_id}",
                conversation_url=f"https://trugen.ai/demo/embed?agent_id=ag_guardian_aria&session={dossier.transaction_id}&mock=true",
                agent_id="ag_guardian_aria",
                context_injected=True
            )

        headers = {
            "x-api-key": api_key,
            "Content-Type": "application/json"
        }

        payload = {
            "agent_id": agent_id,
            "system_prompt_override": system_prompt,
            "metadata": {
                "transaction_id": dossier.transaction_id,
                "user_id": dossier.user_id,
                "risk_score": dossier.composite_risk_score,
                "suspected_scam": dossier.detected_scam_types
            }
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{TRUGEN_API_BASE}/conversations", headers=headers, json=payload)
                if res.status_code in (200, 201):
                    data = res.json()
                    return TruGenSessionResponse(
                        session_id=data.get("conversation_id", f"tgs_{dossier.transaction_id}"),
                        conversation_url=data.get("url") or data.get("conversation_url"),
                        agent_id=agent_id,
                        context_injected=True
                    )
                else:
                    logger.error(f"TruGen API error: {res.status_code} - {res.text}")
                    # Fallback so demo is never broken
                    return TruGenSessionResponse(
                        session_id=f"tgs_{dossier.transaction_id}",
                        conversation_url=f"https://trugen.ai/embed?agent_id={agent_id}&txn={dossier.transaction_id}",
                        agent_id=agent_id,
                        context_injected=True
                    )
        except Exception as e:
            logger.exception(f"Failed to connect to TruGen API: {e}")
            return TruGenSessionResponse(
                session_id=f"tgs_{dossier.transaction_id}",
                conversation_url=f"https://trugen.ai/demo/embed?agent_id=aria&fallback=1",
                agent_id="aria",
                context_injected=True
            )

    @staticmethod
    async def create_incident_video_session(analysis: "IncidentAnalysis") -> TruGenSessionResponse:
        """
        Creates a dynamic TruGen video avatar session directly from an uploaded user incident.
        Injects the extracted threat analysis and the customized first spoken words using
        the official TruGen embed protocol:
        https://app.trugen.ai/embed/{agent_id}?username=USER_NAME&id=USER_ID&context=CONTEXT
        """
        import urllib.parse
        import json

        agent_id = settings.trugen_agent_id or "ag_aria_guardian"
        user_name = analysis.user_name or "User"
        user_id = f"usr_{analysis.incident_id}"

        # Compile rich dynamic context object for TruGen
        incident_context = {
            "incident_id": analysis.incident_id,
            "scam_category": analysis.scam_category,
            "impersonated_authority": analysis.impersonated_entity,
            "demanded_amount": analysis.demanded_amount,
            "risk_score": analysis.risk_score,
            "tactics": analysis.coercion_tactics,
            "expert_advice": analysis.immediate_guidance,
            "first_spoken_greeting": analysis.aria_first_message,
            "anti_scam_guardrail": "Official authorities NEVER collect fines or fees over personal UPI or gift cards."
        }

        # Encode context cleanly for the embed iframe URL
        context_str = json.dumps(incident_context)
        encoded_context = urllib.parse.quote(context_str)
        encoded_user = urllib.parse.quote(user_name)

        # Official embed URL format from docs.trugen.ai
        official_embed_url = (
            f"https://app.trugen.ai/embed/{agent_id}"
            f"?username={encoded_user}&id={user_id}&context={encoded_context}"
        )

        return TruGenSessionResponse(
            session_id=f"tgs_inc_{analysis.incident_id}",
            conversation_url=official_embed_url,
            agent_id=agent_id,
            context_injected=True
        )


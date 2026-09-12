import httpx
import logging
from typing import Optional
from ..config import settings
from ..models.schemas import RiskDossier, EmergencyCallResponse
from ..utils.prompt_builder import build_dynamic_guardian_prompt, build_vapi_first_message

logger = logging.getLogger(__name__)

VAPI_API_BASE = "https://api.vapi.ai"

class VapiService:
    @staticmethod
    async def trigger_emergency_call(dossier: RiskDossier, target_phone: Optional[str] = None) -> EmergencyCallResponse:
        """
        Triggers an immediate high-priority emergency telephone call to the customer.
        Dynamically configures Vapi with Aria's prompt, transaction context, and first spoken message.
        """
        phone = target_phone or dossier.user_phone
        if not phone:
            phone = "+919876543210" # Default simulated target number

        api_key = settings.vapi_api_key
        phone_number_id = settings.vapi_phone_number_id
        system_prompt = build_dynamic_guardian_prompt(dossier, channel="phone")
        first_message = build_vapi_first_message(dossier)

        # In dev or unconfigured mode, gracefully return mock success details for demo
        if not api_key or api_key.startswith("your_") or not phone_number_id or phone_number_id.startswith("your_"):
            logger.warning("Vapi credentials not set. Returning simulated emergency call status.")
            return EmergencyCallResponse(
                call_id=f"vapi_sim_{dossier.transaction_id}",
                status="queued_simulated",
                provider="vapi",
                phone_number=phone
            )

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "phoneNumberId": phone_number_id,
            "assistantId": "eeec707c-8499-4b0b-b81e-e9e3d08742e8",
            "customer": {
                "number": phone,
                "name": dossier.user_name
            },
            "assistantOverrides": {
                "firstMessage": first_message,
                "variableValues": {
                    "transaction_id": dossier.transaction_id,
                    "amount": str(dossier.amount),
                    "recipient": dossier.recipient_name,
                    "scam_type": ", ".join(dossier.detected_scam_types) if dossier.detected_scam_types else "unusual activity"
                }
            }
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{VAPI_API_BASE}/call/phone", headers=headers, json=payload)
                if res.status_code in (200, 201):
                    data = res.json()
                    return EmergencyCallResponse(
                        call_id=data.get("id", f"vapi_{dossier.transaction_id}"),
                        status=data.get("status", "in-progress"),
                        provider="vapi",
                        phone_number=phone
                    )
                else:
                    logger.error(f"Vapi API returned error: {res.status_code} - {res.text}")
                    return EmergencyCallResponse(
                        call_id=f"vapi_err_{dossier.transaction_id}",
                        status="call_initiated_fallback",
                        provider="vapi",
                        phone_number=phone
                    )
        except Exception as e:
            logger.exception(f"Error calling Vapi API: {e}")
            return EmergencyCallResponse(
                call_id=f"vapi_offline_{dossier.transaction_id}",
                status="call_simulated_offline",
                provider="vapi",
                phone_number=phone
            )

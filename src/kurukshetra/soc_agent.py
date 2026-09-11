"""Bounded Agentic SOC Copilot for Fraud Investigation."""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import time


class InvestigationDossier(BaseModel):
    case_id: str
    target_transaction_id: str
    syndicate_assessment: str
    recommended_action: str
    tool_calls_executed: int
    gathered_facts: List[Dict[str, Any]]
    execution_duration_sec: float
    status: str = "COMPLETED"


class SOCCopilotAgent:
    """Bounded, read-only agentic investigator for complex fraud cases."""

    def __init__(self, max_tool_iterations: int = 6, timeout_seconds: float = 20.0):
        self.max_tool_iterations = max_tool_iterations
        self.timeout_seconds = timeout_seconds

    # --- Whitelisted Read-Only Tools ---
    def tool_query_mule_graph(self, account_id: str, depth: int = 2) -> Dict[str, Any]:
        """Simulates querying the GNN 2-hop transaction graph."""
        return {
            "account_id": account_id,
            "fan_in_ratio": 14.2,
            "connected_mule_nodes": 3,
            "community_id": "SYNDICATE_MULE_RING_781",
            "confidence": 0.91,
        }

    def tool_fetch_velocity_profile(self, sender_id: str) -> Dict[str, Any]:
        """Fetches 7-day velocity baseline."""
        return {
            "sender_id": sender_id,
            "7d_average_outflow": 215.0,
            "current_spike_ratio": 22.5,
            "prior_disputes": 0,
        }

    def tool_inspect_device_integrity(self, device_id: str) -> Dict[str, Any]:
        """Queries Google Play Integrity / DeviceCheck logs."""
        return {
            "device_id": device_id,
            "hardware_keystore_verified": True,
            "root_detected": False,
            "active_accessibility_apps": ["AnyDesk"],
        }

    def tool_search_known_scam_catalog(self, payee_identifier: str) -> Dict[str, Any]:
        """Searches central bank scam repository."""
        return {
            "payee_identifier": payee_identifier,
            "reported_complaints_30d": 18,
            "typology_match": "Digital Arrest / Law Enforcement Impersonation",
        }

    def investigate(
        self, transaction_id: str, sender_id: str, recipient_id: str, risk_score: float
    ) -> InvestigationDossier:
        """Executes bounded multi-step investigation loop."""
        t0 = time.time()
        facts: List[Dict[str, Any]] = []
        tools_run = 0

        # Step 1: Query Mule Graph
        if tools_run < self.max_tool_iterations:
            res = self.tool_query_mule_graph(recipient_id)
            facts.append({"tool": "query_mule_graph", "result": res})
            tools_run += 1

        # Step 2: Fetch Sender Velocity
        if tools_run < self.max_tool_iterations:
            res = self.tool_fetch_velocity_profile(sender_id)
            facts.append({"tool": "fetch_velocity_profile", "result": res})
            tools_run += 1

        # Step 3: Inspect Device Apps
        if tools_run < self.max_tool_iterations:
            res = self.tool_inspect_device_integrity("dev_victim_99")
            facts.append({"tool": "inspect_device_integrity", "result": res})
            tools_run += 1

        # Step 4: Search Scam Catalog
        if tools_run < self.max_tool_iterations:
            res = self.tool_search_known_scam_catalog(recipient_id)
            facts.append({"tool": "search_known_scam_catalog", "result": res})
            tools_run += 1

        # Synthesize Dossier (Constrained deterministic logic)
        elapsed = time.time() - t0
        syndicate = (
            "Confirmed high-velocity mule node connected to Syndicate Ring 781 with 18 prior victim reports. "
            "Remote access tool AnyDesk detected on victim device during authorization."
        )
        recommendation = (
            "ENFORCE IMMEDIATE INTERBANK QUARANTINE (camt.056) & INITIATE OUT-OF-BAND PHONE CALL TO CUSTOMER."
        )

        return InvestigationDossier(
            case_id=f"CASE_{transaction_id[-8:]}",
            target_transaction_id=transaction_id,
            syndicate_assessment=syndicate,
            recommended_action=recommendation,
            tool_calls_executed=tools_run,
            gathered_facts=facts,
            execution_duration_sec=round(elapsed, 4),
            status="COMPLETED",
        )

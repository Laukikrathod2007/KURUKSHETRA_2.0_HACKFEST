"""Explainability Engine, Causal Attributions, AML Filter, and WORM Hashing."""

from __future__ import annotations
import hashlib
import json
import re
from typing import List, Dict
from kurukshetra.contracts import (
    RiskVerdict,
    ActionDirective,
    AccountContext,
    EvidenceDossier,
    FeatureAttribution,
)


RESTRICTED_AML_PATTERNS = [
    r"mule[\s_-]?cluster",
    r"syndicate",
    r"law[\s_-]?enforcement[\s_-]?blacklist",
    r"gnn[\s_-]?embedding",
    r"interbank[\s_-]?flag",
]

ADVERSE_ACTION_REASON_CODES = {
    "active_call": "Unusual concurrent phone call activity during transaction initiation.",
    "remote_access_software_active": "Unverified remote screen control software detected.",
    "balance_drain_ratio": "Requested amount constitutes an anomalous portion of total available funds.",
    "is_first_time_recipient": "High-value transfer initiated to a newly registered, unverified payee.",
    "velocity_count_24h": "Outbound transaction frequency exceeds established profile baseline.",
    "hesitation_dwell_time_ms": "Interaction timing deviates significantly from account authentication norms.",
}


class ExplainabilityEngine:
    def __init__(self):
        self.worm_archive: List[str] = []

    def build_evidence_dossier(
        self,
        transaction_id: str,
        verdict: RiskVerdict,
        directive: ActionDirective,
        context: AccountContext,
    ) -> EvidenceDossier:
        """Constructs an immutable, verifiable EvidenceDossier."""
        
        # 1. Map top negative SHAP attributions to regulatory adverse action codes
        adverse_reasons = []
        for attr in verdict.top_attributions:
            if attr.shap_attribution > 0.05 and attr.feature_name in ADVERSE_ACTION_REASON_CODES:
                adverse_reasons.append(ADVERSE_ACTION_REASON_CODES[attr.feature_name])

        # 2. Sanitize customer-facing attributes via AML Anti-Tipping-Off filter
        sanitized_attributions = self.apply_tipping_off_filter(verdict.top_attributions)

        # 3. Compute Merkle cryptographic hash for WORM auditability
        record_payload = {
            "tx_id": transaction_id,
            "score": verdict.calibrated_risk_score,
            "directive": directive.value,
            "sender": context.sender_account_hash,
            "recipient": context.recipient_account_hash,
            "amount": context.amount,
        }
        merkle_hash = hashlib.sha256(
            json.dumps(record_payload, sort_keys=True).encode("utf-8")
        ).hexdigest()

        dossier = EvidenceDossier(
            transaction_id=transaction_id,
            sender_account_hash=context.sender_account_hash,
            recipient_account_hash=context.recipient_account_hash,
            amount=context.amount,
            directive=directive,
            calibrated_risk_score=verdict.calibrated_risk_score,
            epistemic_uncertainty=verdict.epistemic_uncertainty,
            detected_typology=verdict.detected_typology,
            top_attributions=sanitized_attributions,
            tipping_off_sanitized=True,
            adverse_action_reasons=adverse_reasons[:3],
            merkle_root_hash=merkle_hash,
        )

        # Commit to append-only WORM archive
        self.worm_archive.append(merkle_hash)
        return dossier

    def apply_tipping_off_filter(
        self, attributions: List[FeatureAttribution]
    ) -> List[FeatureAttribution]:
        """Strips internal AML surveillance terms from customer-facing feature descriptions."""
        safe_list: List[FeatureAttribution] = []
        for attr in attributions:
            safe_label = attr.human_readable_label
            for pattern in RESTRICTED_AML_PATTERNS:
                if re.search(pattern, safe_label, re.IGNORECASE):
                    safe_label = "Recipient account profile undergoing verification"
            
            safe_list.append(
                FeatureAttribution(
                    feature_name=attr.feature_name,
                    feature_value=attr.feature_value,
                    shap_attribution=attr.shap_attribution,
                    human_readable_label=safe_label,
                )
            )
        return safe_list

import json
import logging
from typing import Optional, Dict
from ..models.schemas import RiskDossier

logger = logging.getLogger(__name__)

# In-memory fast cache with fallback support
_memory_cache: Dict[str, dict] = {}

class SessionStore:
    @staticmethod
    def save_dossier(dossier: RiskDossier) -> None:
        key = f"guardian:txn:{dossier.transaction_id}"
        _memory_cache[key] = dossier.model_dump(mode="json")
        logger.info(f"Saved risk dossier to session store for txn: {dossier.transaction_id}")

    @staticmethod
    def get_dossier(transaction_id: str) -> Optional[RiskDossier]:
        key = f"guardian:txn:{transaction_id}"
        raw = _memory_cache.get(key)
        if not raw:
            return None
        return RiskDossier.model_validate(raw)

    @staticmethod
    def update_decision(transaction_id: str, final_action: str, reason: str = ""):
        key = f"guardian:txn:{transaction_id}"
        if key in _memory_cache:
            _memory_cache[key]["final_action"] = final_action
            _memory_cache[key]["resolution_note"] = reason
            logger.info(f"Updated final decision for {transaction_id}: {final_action}")

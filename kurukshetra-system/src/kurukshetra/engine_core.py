"""Core decision logic, decoupled from FastAPI.

Both the HTTP router (engine_api.py) and any in-process caller (the mock
NPCI switch, once everything is one deployed service) call these functions
directly -- no network hop between "the engine" and "the switch" once they
live in the same process, which is both faster and matches the single
consolidated-backend deployment decided in docs/00-council-verdict.md's
spirit of minimizing moving parts for a live demo.
"""
from __future__ import annotations

import logging
import time

from kurukshetra.audit import write_entry
from kurukshetra.contracts import (
    DataCompleteness,
    DetectionSignal,
    RiskDecision,
    TransactionAnalysisRequest,
)
from kurukshetra.db import SessionLocal
from kurukshetra.scoring import score_transaction
from kurukshetra.tier0 import (
    check_authority_handle_pattern,
    check_name_clash,
    is_known_beneficiary,
    parse_qr_or_deeplink,
)

log = logging.getLogger("kurukshetra.engine")


def _run_tier1(req: TransactionAnalysisRequest) -> tuple[list[DetectionSignal], DataCompleteness]:
    """Seam for Phase 3's Tier 1 detectors (Mock CBS / Reputation).

    Returns no additional signals yet and reports PARTIAL completeness so the
    fallback contract in `scoring.score_transaction` correctly raises the
    risk floor for new beneficiaries until those services exist.
    """
    return [], DataCompleteness.PARTIAL


def evaluate(req: TransactionAnalysisRequest) -> RiskDecision:
    """Shared by both /v1/score-vpa (Event 1) and /v1/score-transaction (Event 2).

    Tier 0 always runs. Tier 1 only runs if the beneficiary is new or a
    Tier 0 check fired -- this is the actual progressive-computation claim.
    """
    started = time.perf_counter()
    session = SessionLocal()
    try:
        known = is_known_beneficiary(
            session, req.payer_context.payer_id_hash, req.recipient_context.beneficiary_ref_hash
        )

        signals: list[DetectionSignal] = [
            check_name_clash(req.recipient_context),
            check_authority_handle_pattern(req.recipient_context),
        ]
        qr_signal = parse_qr_or_deeplink(req.provenance.raw_uri)
        if qr_signal:
            signals.append(qr_signal)

        tier_reached = 0
        data_completeness = DataCompleteness.FULL

        any_tier0_fired = any(s.triggered for s in signals)
        if not known or any_tier0_fired:
            tier_reached = 1
            tier1_signals, data_completeness = _run_tier1(req)
            signals.extend(tier1_signals)

        decision = score_transaction(
            transaction_id=req.transaction_id,
            signals=signals,
            tier_reached=tier_reached,
            is_known_beneficiary=known,
            data_completeness=data_completeness,
        )

        entry = write_entry(
            session,
            transaction_id=req.transaction_id,
            decision=decision.decision,
            risk_score=decision.risk_score,
            evidence={"reasons": decision.reasons, "tier_reached": tier_reached, "event": req.event.value},
        )
        decision.audit_ref = str(entry.sequence_no)

        elapsed_ms = (time.perf_counter() - started) * 1000
        log.info(
            "evaluate txn=%s event=%s known=%s tier=%s zone=%s elapsed_ms=%.2f",
            req.transaction_id, req.event.value, known, tier_reached, decision.risk_zone, elapsed_ms,
        )
        return decision
    finally:
        session.close()

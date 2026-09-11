"""The Kurukshetra Risk Engine -- FastAPI service on port 8000.

Phase 1/2 scope (docs/07-build-order.md): Tier 0 wired end-to-end against the
Local Ledger DB. Tier 1 (Mock CBS / Reputation / Registry calls) is the next
phase -- the escalation hook (`_run_tier1`) is already the seam where that
plugs in, and `score-transaction` already honours the fallback contract for
when that data isn't available yet.
"""
from __future__ import annotations

import logging
import time

from fastapi import FastAPI

from kurukshetra.audit import write_entry
from kurukshetra.contracts import (
    DataCompleteness,
    DetectionSignal,
    RiskDecision,
    TransactionAnalysisRequest,
)
from kurukshetra.db import get_session, init_db
from kurukshetra.tier0 import (
    check_authority_handle_pattern,
    check_name_clash,
    is_known_beneficiary,
    parse_qr_or_deeplink,
)
from kurukshetra.scoring import score_transaction

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("kurukshetra.engine")

app = FastAPI(title="Kurukshetra Risk Engine")


@app.on_event("startup")
def _startup() -> None:
    init_db()
    log.info("Kurukshetra Risk Engine started. DB initialized.")


def _run_tier1(req: TransactionAnalysisRequest) -> tuple[list[DetectionSignal], DataCompleteness]:
    """Placeholder seam for Phase 3's Tier 1 detectors (Mock CBS / Reputation).

    Returns no additional signals yet and reports PARTIAL completeness so the
    fallback contract in `scoring.score_transaction` correctly raises the
    risk floor for new beneficiaries until those services exist.
    """
    return [], DataCompleteness.PARTIAL


@app.post("/v1/score-vpa", response_model=RiskDecision)
def score_vpa(req: TransactionAnalysisRequest) -> RiskDecision:
    """Event 1 -- ReqValAdd. Tier 0 only; no amount is known yet."""
    started = time.perf_counter()
    session = next(get_session())
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
            evidence={"reasons": decision.reasons, "tier_reached": tier_reached, "event": "VPA_RESOLUTION"},
        )
        decision.audit_ref = str(entry.sequence_no)

        elapsed_ms = (time.perf_counter() - started) * 1000
        log.info(
            "score-vpa txn=%s known=%s tier=%s zone=%s elapsed_ms=%.2f",
            req.transaction_id, known, tier_reached, decision.risk_zone, elapsed_ms,
        )
        return decision
    finally:
        session.close()


@app.post("/v1/score-transaction", response_model=RiskDecision)
def score_transaction_endpoint(req: TransactionAnalysisRequest) -> RiskDecision:
    """Event 2 -- ReqPay pre-flight. Amount-dependent detectors run here.

    Phase 1/2 scope: reuses the same Tier 0 evaluation as score-vpa (a real
    client would pass through the resolved recipient context unchanged) plus
    records the amount. Amount-dependent Tier 1 detectors (#6, #14, #15, #16)
    are the next slice to add against the Local Ledger DB.
    """
    return score_vpa(req)


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}

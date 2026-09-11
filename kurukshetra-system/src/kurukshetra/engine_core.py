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
from kurukshetra.registry import check_registry_flags
from kurukshetra.reputation import check_community_reports
from kurukshetra.scoring import score_transaction
from kurukshetra.tier0 import (
    check_authority_handle_pattern,
    check_name_clash,
    is_known_beneficiary,
    parse_qr_or_deeplink,
)
from kurukshetra.tier1_cbs import (
    check_account_graph,
    check_burst_drain_dormant,
    check_one_way_account,
    check_rapid_drainage,
    check_scam_hours,
)
from kurukshetra.tier1_ledger import (
    check_collect_request_abuse,
    check_drip_escalation,
    check_high_value_outlier,
    check_post_hold_escalation,
    check_purpose_contradiction,
    check_refund_reversal,
    check_threshold_evasion,
)
from kurukshetra.tier1_switch import check_abandon_ratio, check_resolution_burst

log = logging.getLogger("kurukshetra.engine")


def _run_tier1(req: TransactionAnalysisRequest, session) -> tuple[list[DetectionSignal], DataCompleteness]:
    """Tier 1 -- real detectors against seeded/simulated recipient-side data
    (Mock CBS, Reputation) plus real amount-dependent local-ledger detectors.
    Data completeness degrades to PARTIAL only if the Mock CBS has no record
    for this account at all (see tier1_cbs._no_data_signal).
    """
    beneficiary_ref = req.recipient_context.beneficiary_ref_hash
    payer_id = req.payer_context.payer_id_hash

    signals: list[DetectionSignal] = []
    signals.append(check_abandon_ratio(session, beneficiary_ref))
    signals.append(check_resolution_burst(session, beneficiary_ref))
    signals.append(check_community_reports(session, beneficiary_ref))
    signals.append(check_rapid_drainage(session, beneficiary_ref))
    signals.append(check_one_way_account(session, beneficiary_ref))
    signals.append(check_burst_drain_dormant(session, beneficiary_ref))
    signals.append(check_scam_hours(session, beneficiary_ref))
    signals.append(check_account_graph(session, beneficiary_ref))
    signals.extend(check_registry_flags(session, beneficiary_ref))

    cbs_missing = any(s.evidence.get("reason") == "no_cbs_record" for s in signals)

    amount = req.transaction.amount
    if amount is not None:
        signals.append(check_high_value_outlier(session, payer_id, amount))
        signals.append(check_drip_escalation(session, payer_id, beneficiary_ref, amount))
        signals.append(check_threshold_evasion(session, payer_id, beneficiary_ref, amount))
        signals.append(check_refund_reversal(session, payer_id, beneficiary_ref, amount))
        signals.append(check_purpose_contradiction(req.recipient_context))
        signals.append(check_post_hold_escalation(session, payer_id, beneficiary_ref, amount))

        collect_signal = check_collect_request_abuse(req.transaction.collect_note, req.transaction.type.value)
        if collect_signal:
            signals.append(collect_signal)

    completeness = DataCompleteness.PARTIAL if cbs_missing else DataCompleteness.FULL
    return signals, completeness


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
            tier1_signals, data_completeness = _run_tier1(req, session)
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

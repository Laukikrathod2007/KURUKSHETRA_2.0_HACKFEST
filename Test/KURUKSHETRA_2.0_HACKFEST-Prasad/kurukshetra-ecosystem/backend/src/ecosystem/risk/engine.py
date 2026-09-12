"""Master Kurukshetra risk interception engine.

Coordinates:
- Hook 1 (VPA_RESOLUTION) & Hook 2 (PAYMENT_PREFLIGHT)
- Tier 0 (<10ms) fast path
- Tier 1 (<45ms) deep forensic analysis
- Tier 2 conceptual registry integration
- Deterministic scoring & degradation fallback
- SHA-256 hash-chained audit logging
- MCP post-decision intervention assembly
"""
from __future__ import annotations

import logging
import time

from sqlalchemy.orm import Session

from ecosystem import events
from ecosystem.config import TIER0_BUDGET_MS, TIER1_BUDGET_MS
from ecosystem.mcp.host import build_intervention
from ecosystem.risk.audit import write_entry
from ecosystem.risk.contracts import (
    DataCompleteness,
    DetectionSignal,
    RiskDecision,
    TransactionAnalysisRequest,
)
from ecosystem.risk.registry import check_registry_flags
from ecosystem.risk.reputation import check_community_reports
from ecosystem.risk.scoring import score_transaction
from ecosystem.risk.tier0 import (
    check_authority_handle_pattern,
    check_name_clash,
    is_known_beneficiary,
    parse_qr_or_deeplink,
)
from ecosystem.risk.tier1_cbs import (
    check_account_graph,
    check_burst_drain_dormant,
    check_one_way_account,
    check_rapid_drainage,
    check_scam_hours,
)
from ecosystem.risk.tier1_ledger import (
    check_collect_request_abuse,
    check_drip_escalation,
    check_high_value_outlier,
    check_post_hold_escalation,
    check_purpose_contradiction,
    check_refund_reversal,
    check_threshold_evasion,
)
from ecosystem.risk.tier1_switch import check_abandon_ratio, check_resolution_burst

log = logging.getLogger("kurukshetra.risk.engine")


def _run_tier1(
    session: Session,
    req: TransactionAnalysisRequest,
) -> tuple[list[DetectionSignal], DataCompleteness]:
    beneficiary_ref = req.recipient_context.beneficiary_ref_hash
    customer_id = req.payer_context.payer_id_hash
    psp_id = req.payer_context.psp_id
    beneficiary_acc_id = req.recipient_context.beneficiary_account_id or beneficiary_ref

    signals: list[DetectionSignal] = []

    # 1. Switch metrics (only NPCI switch sees cross-PSP lookups)
    signals.append(check_abandon_ratio(session, beneficiary_ref))
    signals.append(check_resolution_burst(session, beneficiary_ref))

    # 2. Community reputation with decay and Sybil threshold
    signals.append(check_community_reports(session, beneficiary_ref))

    # 3. CBS Beneficiary forensics
    signals.append(check_rapid_drainage(session, beneficiary_acc_id))
    signals.append(check_one_way_account(session, beneficiary_acc_id))
    signals.append(check_burst_drain_dormant(session, beneficiary_acc_id))
    signals.append(check_scam_hours(session, beneficiary_acc_id))
    signals.append(check_account_graph(session, beneficiary_acc_id))

    # 4. Tier 2 conceptual registry flags
    signals.extend(check_registry_flags(session, beneficiary_ref))

    # Check for missing CBS data
    cbs_missing = any(s.evidence.get("reason") == "NO_CBS_DATA_AVAILABLE" for s in signals)

    # 5. Amount & behavior detectors (if amount is present)
    amount_paise = req.transaction.amount_paise
    if amount_paise is not None:
        signals.append(check_high_value_outlier(session, customer_id, amount_paise, psp_id=psp_id))
        signals.append(check_drip_escalation(session, customer_id, beneficiary_ref, amount_paise, psp_id=psp_id))
        signals.append(check_threshold_evasion(session, customer_id, beneficiary_ref, amount_paise, psp_id=psp_id))
        signals.append(check_refund_reversal(session, customer_id, beneficiary_ref, amount_paise, psp_id=psp_id))
        signals.append(check_purpose_contradiction(req.recipient_context))
        signals.append(check_post_hold_escalation(session, customer_id, beneficiary_ref, amount_paise, psp_id=psp_id))

        collect_signal = check_collect_request_abuse(req.transaction.collect_note, req.transaction.type.value)
        if collect_signal:
            signals.append(collect_signal)

    completeness = DataCompleteness.PARTIAL if cbs_missing else DataCompleteness.FULL
    return signals, completeness


def evaluate(session: Session, req: TransactionAnalysisRequest) -> RiskDecision:
    """Executes progressive risk evaluation: Tier 0 -> Tier 1 -> Tier 2."""
    started = time.perf_counter()

    customer_id = req.payer_context.payer_id_hash
    beneficiary_ref = req.recipient_context.beneficiary_ref_hash
    psp_id = req.payer_context.psp_id

    # Check known beneficiary status in this specific app
    known = is_known_beneficiary(session, customer_id, beneficiary_ref, psp_id=psp_id)

    # Tier 0 always runs
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
        tier1_signals, data_completeness = _run_tier1(session, req)
        signals.extend(tier1_signals)

    decision = score_transaction(
        transaction_id=req.transaction_id,
        signals=signals,
        tier_reached=tier_reached,
        is_known_beneficiary=known,
        data_completeness=data_completeness,
    )

    elapsed_ms = (time.perf_counter() - started) * 1000
    budget_ms = TIER1_BUDGET_MS if tier_reached >= 1 else TIER0_BUDGET_MS
    latency_budget_exceeded = elapsed_ms > budget_ms

    # Record append-only immutable audit entry
    audit_entry = write_entry(
        session,
        txn_id=req.transaction_id,
        decision=decision.decision,
        risk_score=decision.risk_score,
        evidence={
            "reasons": decision.reasons,
            "tier_reached": tier_reached,
            "event": req.event.value,
            "known": known,
            "completeness": data_completeness.value,
            "elapsed_ms": round(elapsed_ms, 2),
            "degraded_mode": "LATENCY_BUDGET_EXCEEDED" if latency_budget_exceeded else None,
        },
    )
    decision.audit_ref = str(audit_entry.sequence_no)

    # Invoke MCP if COACH or FREEZE
    intervention_screen = build_intervention(
        session,
        decision,
        customer_id=customer_id,
        amount_paise=req.transaction.amount_paise,
    )
    decision.intervention_screen = intervention_screen

    events.publish({
        "trace_id": req.trace_id,
        "txn_id": req.transaction_id,
        "node": {
            "id": req.recipient_context.beneficiary_account_id or beneficiary_ref,
            "type": "VPA",
            "label": req.recipient_context.resolved_name or beneficiary_ref,
            "risk_zone": decision.risk_zone.value,
            "risk_score": decision.risk_score,
        },
        "edges": [
            {
                "from": req.payer_context.payer_account_id or customer_id,
                "to": req.recipient_context.beneficiary_account_id or beneficiary_ref,
                "amount_paise": req.transaction.amount_paise,
                "direction": "OUTFLOW",
            }
        ],
        "signals": [s.model_dump() for s in decision.signals if s.triggered],
        "source": "DETERMINISTIC_ENGINE",
    })

    log.info(
        "Kurukshetra evaluate txn=%s event=%s known=%s tier=%s zone=%s elapsed_ms=%.2f",
        req.transaction_id,
        req.event.value,
        known,
        tier_reached,
        decision.risk_zone.value,
        elapsed_ms,
    )
    return decision

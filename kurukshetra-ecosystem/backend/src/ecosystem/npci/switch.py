"""NPCI UPI Switch simulation.

Orchestrates:
- VPA resolution via Central Mapper
- Invocation of Kurukshetra Hook 1 (Resolution-time) & Hook 2 (Pre-flight)
- Policy enforcement: ALLOW, STEP_UP, COACH, FREEZE
- Two-legged Core Banking debit/credit settlement
- Zero ledger entries guaranteed on FREEZE
- Cross-PSP switch metrics updates
- Granular event emission to TraceRecorder
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Any, Optional

from sqlalchemy.orm import Session

from ecosystem.banks import cbs
from ecosystem.config import format_inr
from ecosystem.models import (
    Account,
    AccountStatus,
    AppLocalHistory,
    Direction,
    Rail,
    RiskAssessment,
    RiskZone,
    SettlementObligation,
    SwitchMetric,
    Transaction,
    TxnState,
    VpaMapping,
)
from ecosystem.npci.mapper import resolve_or_provision_vpa
from ecosystem.risk import audit, engine
from ecosystem.risk.contracts import (
    ArrivedVia,
    EventType,
    PayerContext,
    Provenance,
    RecipientContext,
    RiskDecision,
    TransactionAnalysisRequest,
    TransactionDetails,
)
from ecosystem.risk.tier1_switch import record_lookup, record_pay
from ecosystem.traces import TraceRecorder


def handle_req_val_add(
    session: Session,
    *,
    trace_id: str,
    psp_id: str,
    payer_id: str,
    payer_account_id: str,
    payee_vpa: str,
    declared_purpose: Optional[str] = None,
    raw_uri: Optional[str] = None,
    arrived_via: str = "MANUAL_ENTRY",
) -> dict[str, Any]:
    """Handles ReqValAdd (VPA lookup) from a PSP app."""
    recorder = TraceRecorder(trace_id, session)
    txn_id = f"txn_{uuid.uuid4().hex[:12]}"

    recorder.emit(
        component="PSP_APP",
        action="REQ_VAL_ADD_SENT",
        summary=f"Payer {payer_id} on {psp_id.upper()} requested resolution for {payee_vpa}",
        txn_id=txn_id,
        detail={"vpa": payee_vpa, "psp_id": psp_id, "declared_purpose": declared_purpose},
    )

    # 1. Resolve via NPCI Central Mapper -- or provision a new account on the
    # fly if this VPA has never been seen before (see mapper.py docstring:
    # real UPI resolves any registered VPA, not just a curated demo list).
    resolved = resolve_or_provision_vpa(session, payee_vpa)
    if resolved.newly_provisioned:
        recorder.emit(
            component="NPCI_SWITCH",
            action="MAPPER_NEW_ACCOUNT_PROVISIONED",
            summary=f"{payee_vpa} was never seen before -- provisioned as a new {resolved.kyc_tier}-KYC account "
            f"({resolved.customer_name}, {resolved.bank_name}), {resolved.mcc} MCC",
            txn_id=txn_id,
            detail=resolved.model_dump(),
        )

    # 1b. Check if VPA is suspended under Nationwide Kill-Switch
    if not resolved.is_active:
        recorder.emit(
            component="NPCI_SWITCH",
            action="VPA_NATIONWIDE_SUSPENDED",
            summary=f"VPA {payee_vpa} is revoked nationwide: {resolved.suspended_reason}",
            txn_id=txn_id,
            detail={"suspended_reason": resolved.suspended_reason},
        )
        return {
            "success": False,
            "error": "VPA_NATIONWIDE_SUSPENDED",
            "reason": resolved.suspended_reason or "Account suspended by regulatory order",
            "vpa": payee_vpa,
            "txn_id": txn_id,
            "trace_id": trace_id,
        }

    # 2. Record lookup metric at switch level (cross-PSP)
    record_lookup(session, payee_vpa, psp_id=psp_id)

    recorder.emit(
        component="NPCI_SWITCH",
        action="MAPPER_RESOLVED",
        summary=f"Resolved {payee_vpa} -> {resolved.customer_name} ({resolved.bank_name}, MCC {resolved.mcc})",
        txn_id=txn_id,
        detail=resolved.model_dump(),
    )

    # 3. Invoke Kurukshetra Hook 1
    recorder.emit(
        component="NPCI_SWITCH",
        action="INVOKE_KURUKSHETRA_HOOK_1",
        summary="Calling Kurukshetra Hook 1 (Resolution Intelligence)",
        txn_id=txn_id,
    )

    risk_req = TransactionAnalysisRequest(
        event=EventType.VPA_RESOLUTION,
        transaction_id=txn_id,
        trace_id=trace_id,
        payer_context=PayerContext(
            payer_id_hash=payer_id,
            payer_account_id=payer_account_id,
            psp_id=psp_id,
        ),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=payee_vpa,
            resolved_name=resolved.customer_name,
            mc_code=resolved.mcc,
            raw_handle_string=payee_vpa,
            declared_purpose=declared_purpose,
            beneficiary_account_id=resolved.account_id,
        ),
        provenance=Provenance(
            raw_uri=raw_uri,
            arrived_via=ArrivedVia(arrived_via) if arrived_via in {e.value for e in ArrivedVia} else ArrivedVia.MANUAL_ENTRY,
        ),
    )

    risk: RiskDecision = engine.evaluate(session, risk_req)

    recorder.emit(
        component="KURUKSHETRA",
        action="HOOK_1_EVALUATED",
        summary=f"Risk zone: {risk.risk_zone.value} (Score: {risk.risk_score}, Tier {risk.tier_reached})",
        txn_id=txn_id,
        detail={
            "risk_score": risk.risk_score,
            "risk_zone": risk.risk_zone.value,
            "tier_reached": risk.tier_reached,
            "reasons": risk.reasons,
        },
    )

    # Persist transaction record in RESOLVED state
    txn = Transaction(
        txn_id=txn_id,
        trace_id=trace_id,
        rail=Rail.UPI,
        psp_id=psp_id,
        payer_customer_id=payer_id,
        payer_account_id=payer_account_id,
        payee_ref=payee_vpa,
        payee_account_id=resolved.account_id,
        payee_name_resolved=resolved.customer_name,
        declared_purpose=declared_purpose,
        state=TxnState.RESOLVED,
        risk_score=risk.risk_score,
        risk_zone=RiskZone(risk.risk_zone.value),
    )
    session.add(txn)

    # Persist RiskAssessment
    assessment = RiskAssessment(
        assessment_id=f"risk_{uuid.uuid4().hex[:10]}",
        txn_id=txn_id,
        hook="HOOK_1_RESOLUTION",
        risk_score=risk.risk_score,
        risk_zone=RiskZone(risk.risk_zone.value),
        confidence=risk.confidence,
        data_completeness=risk.data_completeness.value,
        tier_reached=risk.tier_reached,
        signals_json=risk.model_dump_json(include={"signals"}),
    )
    session.add(assessment)

    recorder.emit(
        component="NPCI_SWITCH",
        action="RESP_VAL_ADD_SENT",
        summary=f"RespValAdd returned to {psp_id.upper()} with resolved name and risk metadata",
        txn_id=txn_id,
    )

    return {
        "success": True,
        "txn_id": txn_id,
        "trace_id": trace_id,
        "resolved": resolved.model_dump(),
        "risk": risk.model_dump(),
    }


def handle_req_pay(
    session: Session,
    *,
    trace_id: str,
    txn_id: str,
    amount_paise: int,
    user_acknowledged: bool = False,
    pin_verified: bool = True,
) -> dict[str, Any]:
    """Handles ReqPay: Pre-flight scoring, policy gating, and 2-phase CBS settlement."""
    recorder = TraceRecorder(trace_id, session)
    txn = session.get(Transaction, txn_id)
    if not txn:
        # Expected, not a bug: ReqValAdd short-circuits before creating a
        # Transaction row when the VPA is nationwide-suspended (kill-switch),
        # so a client that proceeds to ReqPay anyway lands here rather than
        # on a missing-row programmer error.
        recorder.emit(
            component="NPCI_SWITCH",
            action="REQ_PAY_UNKNOWN_TXN",
            summary=f"ReqPay referenced txn_id {txn_id}, which has no resolved transaction record (likely a suspended VPA at lookup time)",
            txn_id=txn_id,
        )
        return {
            "status": "FAILED",
            "error": "TRANSACTION_NOT_FOUND",
            "message": "This transaction could not be found. The recipient may have been suspended after lookup -- please look it up again.",
            "txn_id": txn_id,
        }

    txn.amount_paise = amount_paise
    txn.user_acknowledged = user_acknowledged

    recorder.emit(
        component="PSP_APP",
        action="REQ_PAY_SENT",
        summary=f"Payment request initiated for {format_inr(amount_paise)} to {txn.payee_ref}",
        txn_id=txn_id,
        detail={"amount_paise": amount_paise, "amount": format_inr(amount_paise)},
    )

    # 1. Invoke Kurukshetra Hook 2 (Pre-flight scoring with amount)
    recorder.emit(
        component="NPCI_SWITCH",
        action="INVOKE_KURUKSHETRA_HOOK_2",
        summary="Calling Kurukshetra Hook 2 (Full Pre-flight Risk Scoring)",
        txn_id=txn_id,
    )

    payee_acc = session.get(Account, txn.payee_account_id) if txn.payee_account_id else None
    mc_code = payee_acc.mcc if payee_acc else "0000"

    risk_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=txn_id,
        trace_id=trace_id,
        payer_context=PayerContext(
            payer_id_hash=txn.payer_customer_id,
            payer_account_id=txn.payer_account_id,
            psp_id=txn.psp_id,
        ),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=txn.payee_ref,
            resolved_name=txn.payee_name_resolved,
            mc_code=mc_code,
            raw_handle_string=txn.payee_ref,
            declared_purpose=txn.declared_purpose,
            beneficiary_account_id=txn.payee_account_id,
        ),
        transaction=TransactionDetails(amount_paise=amount_paise),
    )

    risk: RiskDecision = engine.evaluate(session, risk_req)
    txn.risk_score = risk.risk_score
    txn.risk_zone = RiskZone(risk.risk_zone.value)
    txn.state = TxnState.RISK_EVALUATED

    recorder.emit(
        component="KURUKSHETRA",
        action="HOOK_2_EVALUATED",
        summary=f"Pre-flight Risk: {risk.risk_zone.value} (Score: {risk.risk_score}, Action: {risk.recommended_action})",
        txn_id=txn_id,
        detail={
            "risk_score": risk.risk_score,
            "risk_zone": risk.risk_zone.value,
            "decision": risk.decision,
            "reasons": risk.reasons,
        },
    )

    # 2. Enforce Policy Decision
    if risk.risk_zone == RiskZone.FREEZE:
        txn.state = TxnState.BLOCKED
        txn.failure_reason = f"Security block: {risk.reasons[0] if risk.reasons else 'High scam probability'}"
        recorder.emit(
            component="NPCI_SWITCH",
            action="PAYMENT_HARD_BLOCKED",
            summary="Payment HARD BLOCKED by Kurukshetra policy. Zero money moved.",
            txn_id=txn_id,
            detail={"reasons": risk.reasons, "balance_change": 0},
        )
        return {
            "status": "BLOCKED",
            "decision": risk.model_dump(),
            "amount_paise": amount_paise,
            "message": "Payment blocked for your protection against detected fraudulent scheme.",
        }

    if risk.risk_zone == RiskZone.COACH and not user_acknowledged:
        txn.state = TxnState.AWAITING_ACK
        recorder.emit(
            component="NPCI_SWITCH",
            action="INTERVENTION_REQUIRED",
            summary="Payment requires explicit coaching acknowledgement from payer before proceeding",
            txn_id=txn_id,
        )
        return {
            "status": "AWAITING_ACK",
            "decision": risk.model_dump(),
            "amount_paise": amount_paise,
            "message": "Security warning: confirmation required.",
        }

    if risk.risk_zone == RiskZone.STEP_UP and not user_acknowledged:
        txn.state = TxnState.AWAITING_CONFIRM
        recorder.emit(
            component="NPCI_SWITCH",
            action="CONFIRMATION_REQUIRED",
            summary="Payment requires step-up confirmation for unfamiliar payee",
            txn_id=txn_id,
        )
        return {
            "status": "AWAITING_CONFIRM",
            "decision": risk.model_dump(),
            "amount_paise": amount_paise,
            "message": "Please confirm this payment to an unverified recipient.",
        }

    # 3. Authentication step (Common Library simulation)
    txn.state = TxnState.AWAITING_AUTH
    if not pin_verified:
        txn.state = TxnState.FAILED
        txn.failure_reason = "Incorrect UPI PIN"
        recorder.emit(
            component="NPCI_COMMON_LIB",
            action="AUTH_FAILED",
            summary="UPI PIN authentication failed",
            txn_id=txn_id,
        )
        return {"status": "FAILED", "error": "INCORRECT_PIN"}

    recorder.emit(
        component="NPCI_COMMON_LIB",
        action="AUTH_SUCCESS",
        summary="Encrypted UPI PIN verified against Remitter Bank key",
        txn_id=txn_id,
    )

    # 4. Two-Phase CBS Settlement (Payer Debit & Payee Credit)
    payer_acc = cbs.get_account(session, txn.payer_account_id)
    payee_acc = cbs.get_account(session, txn.payee_account_id) if txn.payee_account_id else None

    if not payer_acc or not payee_acc:
        txn.state = TxnState.FAILED
        txn.failure_reason = "Account missing"
        return {"status": "FAILED", "error": "ACCOUNT_MISSING"}

    # Leg 1: Remitter Bank DEBIT
    has_funds, reason = cbs.check_balance(session, payer_acc.account_id, amount_paise)
    if not has_funds:
        txn.state = TxnState.FAILED
        txn.failure_reason = reason
        recorder.emit(
            component="REMITTER_CBS",
            action="DEBIT_FAILED",
            summary=f"Debit declined by {payer_acc.bank_id}: {reason}",
            txn_id=txn_id,
        )
        return {"status": "FAILED", "error": reason}

    debit_entry, credit_entry = cbs.execute_transfer(
        session,
        remitter_account_id=payer_acc.account_id,
        beneficiary_account_id=payee_acc.account_id,
        amount_paise=amount_paise,
        txn_id=txn_id,
        narration=f"UPI/{txn.payee_ref}",
    )

    recorder.emit(
        component="REMITTER_CBS",
        action="DEBIT_POSTED",
        summary=f"{payer_acc.bank_id} debited {format_inr(amount_paise)}. New balance: {format_inr(payer_acc.balance_paise)}",
        txn_id=txn_id,
        detail={"balance_after": format_inr(payer_acc.balance_paise), "entry_id": debit_entry.entry_id},
    )

    recorder.emit(
        component="BENEFICIARY_CBS",
        action="CREDIT_POSTED",
        summary=f"{payee_acc.bank_id} credited {format_inr(amount_paise)}. New balance: {format_inr(payee_acc.balance_paise)}",
        txn_id=txn_id,
        detail={"balance_after": format_inr(payee_acc.balance_paise), "entry_id": credit_entry.entry_id},
    )

    # 5. Record NPCI Settlement Obligation
    obligation = SettlementObligation(
        settlement_id=f"set_{uuid.uuid4().hex[:10]}",
        txn_id=txn_id,
        remitter_bank_id=payer_acc.bank_id,
        beneficiary_bank_id=payee_acc.bank_id,
        amount_paise=amount_paise,
        recorded_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(obligation)

    # 6. Update PSP App-Local History
    if txn.psp_id:
        app_hist = AppLocalHistory(
            psp_id=txn.psp_id,
            customer_id=txn.payer_customer_id,
            payee_ref=txn.payee_ref,
            amount_paise=amount_paise,
            direction=Direction.DEBIT,
            txn_id=txn_id,
            succeeded=True,
            occurred_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
        )
        session.add(app_hist)

    # 7. Update Switch Metrics
    record_pay(session, txn.payee_ref)

    txn.state = TxnState.COMPLETED
    txn.completed_at = dt.datetime.now(dt.UTC).replace(tzinfo=None)

    recorder.emit(
        component="NPCI_SWITCH",
        action="PAYMENT_COMPLETED",
        summary=f"Payment of {format_inr(amount_paise)} successfully completed and settled across banks.",
        txn_id=txn_id,
        detail={
            "remitter_balance": format_inr(payer_acc.balance_paise),
            "beneficiary_balance": format_inr(payee_acc.balance_paise),
            "ledger_entries": [debit_entry.entry_id, credit_entry.entry_id],
        },
    )

    return {
        "status": "COMPLETED",
        "txn_id": txn_id,
        "amount_paise": amount_paise,
        "amount_formatted": format_inr(amount_paise),
        "remitter_balance": format_inr(payer_acc.balance_paise),
        "beneficiary_balance": format_inr(payee_acc.balance_paise),
        "decision": risk.model_dump(),
    }


def execute_nationwide_kill_switch(
    session: Session,
    *,
    target_ref: str,
    reason: str = "EMERGENCY_FRAUD_CAMPAIGN_INTERCEPTION",
    operator_id: str = "NPCI_CENTRAL_OPS_01",
) -> dict[str, Any]:
    """Feature #33: Nationwide Kill-Switch.
    Centrally revokes VPA routing in NPCI Mapper and freezes beneficiary account in CBS.
    """
    mapping = session.get(VpaMapping, target_ref)
    account_id = mapping.account_id if mapping else None

    # 1. Revoke in NPCI Central Mapper
    if mapping:
        mapping.is_active = False
        mapping.suspended_reason = reason

    # 2. Freeze in CBS
    account_frozen = False
    if account_id:
        acc = session.get(Account, account_id)
        if acc:
            acc.status = AccountStatus.FROZEN
            account_frozen = True

    # 3. Add immutable audit record
    audit_entry = audit.write_entry(
        session,
        txn_id=f"ks_{uuid.uuid4().hex[:10]}",
        decision="NATIONWIDE_KILL_SWITCH",
        risk_score=1.0,
        evidence={
            "target_ref": target_ref,
            "reason": reason,
            "operator_id": operator_id,
            "vpa_revoked": bool(mapping),
            "account_frozen": account_frozen,
            "account_id": account_id,
        },
    )
    session.flush()

    return {
        "success": True,
        "target_ref": target_ref,
        "vpa_revoked": bool(mapping),
        "account_id": account_id,
        "account_frozen": account_frozen,
        "audit_entry_id": audit_entry.sequence_no,
        "hash": audit_entry.entry_hash,
        "reason": reason,
        "status": "NATIONWIDE_KILL_SWITCH_ACTIVE",
    }


def get_active_campaigns(session: Session) -> list[dict[str, Any]]:
    """Feature #33: Real-Time Campaign Detection across all PSPs."""
    from sqlalchemy import select
    from ecosystem.models import SwitchMetric, Customer

    metrics = list(session.scalars(select(SwitchMetric)).all())
    campaigns = []

    for m in metrics:
        mapping = session.get(VpaMapping, m.target_ref)
        account = session.get(Account, mapping.account_id) if mapping else None
        customer = session.get(Customer, account.customer_id) if account else None

        abandon_ratio = 0.0
        if m.lookup_count > 0:
            abandon_ratio = round(1.0 - (m.pay_count / m.lookup_count), 2)

        is_burst = m.lookup_count >= 5 and (m.distinct_psp_count >= 2 or abandon_ratio >= 0.7)
        is_suspended = mapping.is_active is False if mapping else False

        campaigns.append({
            "target_ref": m.target_ref,
            "customer_name": customer.name if customer else "Unknown",
            "bank_id": account.bank_id if account else "UNKNOWN",
            "account_id": account.account_id if account else "UNKNOWN",
            "lookup_count": m.lookup_count,
            "pay_count": m.pay_count,
            "abandon_ratio": abandon_ratio,
            "distinct_psp_count": m.distinct_psp_count,
            "is_burst": is_burst,
            "is_suspended": is_suspended,
            "suspended_reason": mapping.suspended_reason if mapping else None,
            "risk_level": "CRITICAL" if (is_burst or is_suspended) else ("ELEVATED" if abandon_ratio > 0.5 else "LOW"),
        })

    # Sort so most critical campaigns appear first
    campaigns.sort(key=lambda x: (x["is_suspended"], x["is_burst"], x["lookup_count"]), reverse=True)
    return campaigns


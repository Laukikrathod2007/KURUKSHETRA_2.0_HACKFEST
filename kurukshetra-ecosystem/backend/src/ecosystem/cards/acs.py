"""Card CNP (Card-Not-Present) and 3-D Secure Access Control Server (ACS) simulation.

Flow:
Merchant -> Acquirer Bank -> RuPay/Visa Network -> Issuer Bank 3DS ACS.
Kurukshetra supplies an RBA (Risk-Based Authentication) risk signal:
- FRICTIONLESS (Low Risk): Direct capture without OTP.
- OTP_CHALLENGE (Medium/High Risk): Step-up OTP prompt required.
- DECLINE (Critical Risk): Immediate refusal.
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
    Card,
    Direction,
    Merchant,
    Rail,
    RiskZone,
    Transaction,
    TxnState,
)
from ecosystem.risk import engine
from ecosystem.risk.contracts import (
    EventType,
    PayerContext,
    PaymentMethod,
    Provenance,
    RecipientContext,
    RiskDecision,
    TransactionAnalysisRequest,
    TransactionDetails,
)
from ecosystem.traces import TraceRecorder


def handle_card_checkout(
    session: Session,
    *,
    trace_id: str,
    card_id: str,
    merchant_id: str,
    amount_paise: int,
    otp_submitted: Optional[str] = None,
) -> dict[str, Any]:
    """Execute Card CNP transaction with Kurukshetra RBA check."""
    recorder = TraceRecorder(trace_id, session)
    txn_id = f"txn_{uuid.uuid4().hex[:12]}"

    card = session.get(Card, card_id)
    merchant = session.get(Merchant, merchant_id)
    if not card or not merchant:
        return {"success": False, "error": "CARD_OR_MERCHANT_NOT_FOUND"}

    payer_account = session.get(Account, card.account_id)
    merchant_account = session.get(Account, merchant.settlement_account_id)
    if not payer_account or not merchant_account:
        return {"success": False, "error": "SETTLEMENT_ACCOUNTS_MISSING"}

    recorder.emit(
        component="CARD_NETWORK",
        action="AUTH_REQUEST_RECEIVED",
        summary=f"Merchant {merchant.name} (MCC {merchant.mcc}) requested card payment of {format_inr(amount_paise)}",
        txn_id=txn_id,
        detail={"card": card.masked_number, "network": card.network, "amount": format_inr(amount_paise)},
    )

    # 1. Invoke Kurukshetra Card Risk Evaluation
    recorder.emit(
        component="CARD_ACS",
        action="INVOKE_KURUKSHETRA_RBA",
        summary="Requesting Kurukshetra Risk-Based Authentication (RBA) signal",
        txn_id=txn_id,
    )

    risk_req = TransactionAnalysisRequest(
        event=EventType.PAYMENT_PREFLIGHT,
        transaction_id=txn_id,
        trace_id=trace_id,
        payment_method=PaymentMethod.CARD_CNP,
        payer_context=PayerContext(
            payer_id_hash=payer_account.customer_id,
            payer_account_id=payer_account.account_id,
        ),
        recipient_context=RecipientContext(
            beneficiary_ref_hash=merchant.merchant_id,
            resolved_name=merchant.name,
            mc_code=merchant.mcc,
            beneficiary_account_id=merchant_account.account_id,
        ),
        transaction=TransactionDetails(amount_paise=amount_paise),
    )

    risk: RiskDecision = engine.evaluate(session, risk_req)

    recorder.emit(
        component="KURUKSHETRA",
        action="RBA_RECOMMENDATION",
        summary=f"Kurukshetra 3DS Risk recommendation: {risk.risk_zone.value} (Score: {risk.risk_score})",
        txn_id=txn_id,
        detail={"risk_score": risk.risk_score, "zone": risk.risk_zone.value, "reasons": risk.reasons},
    )

    txn = Transaction(
        txn_id=txn_id,
        trace_id=trace_id,
        rail=Rail.CARD,
        payer_customer_id=payer_account.customer_id,
        payer_account_id=payer_account.account_id,
        payee_ref=merchant.name,
        payee_account_id=merchant_account.account_id,
        payee_name_resolved=merchant.name,
        amount_paise=amount_paise,
        risk_score=risk.risk_score,
        risk_zone=RiskZone(risk.risk_zone.value),
        state=TxnState.RISK_EVALUATED,
    )
    session.add(txn)

    # Determine 3DS Action
    if risk.risk_zone == RiskZone.FREEZE:
        txn.state = TxnState.BLOCKED
        txn.failure_reason = "Card authorization declined due to high fraud score"
        recorder.emit(
            component="CARD_ACS",
            action="CARD_DECLINED",
            summary="3-D Secure authorization declined by Issuer Bank. Zero ledger entries.",
            txn_id=txn_id,
        )
        return {
            "status": "DECLINED",
            "action": "DECLINE",
            "txn_id": txn_id,
            "decision": risk.model_dump(),
            "message": "Card transaction declined by issuing bank security policy.",
        }

    # Step-up OTP challenge
    if risk.risk_zone in (RiskZone.STEP_UP, RiskZone.COACH) and not otp_submitted:
        txn.state = TxnState.AWAITING_AUTH
        recorder.emit(
            component="CARD_ACS",
            action="3DS_CHALLENGE_TRIGGERED",
            summary="3DS Step-Up Challenge initiated: One-Time Password sent to registered mobile",
            txn_id=txn_id,
        )
        return {
            "status": "CHALLENGE_REQUIRED",
            "action": "OTP_CHALLENGE",
            "txn_id": txn_id,
            "decision": risk.model_dump(),
            "message": "Please enter the 6-digit OTP sent to your phone to complete authentication.",
        }

    # If OTP submitted or frictionless
    if otp_submitted and otp_submitted != "123456":  # Simulated valid OTP
        txn.state = TxnState.FAILED
        txn.failure_reason = "Invalid OTP"
        recorder.emit(
            component="CARD_ACS",
            action="OTP_VERIFICATION_FAILED",
            summary="3DS OTP verification failed",
            txn_id=txn_id,
        )
        return {"status": "FAILED", "error": "INVALID_OTP"}

    recorder.emit(
        component="CARD_ACS",
        action="AUTH_APPROVED",
        summary="3DS Authentication approved. Proceeding to ledger capture.",
        txn_id=txn_id,
    )

    # Post Core Banking transfer
    debit_entry, credit_entry = cbs.execute_transfer(
        session,
        remitter_account_id=payer_account.account_id,
        beneficiary_account_id=merchant_account.account_id,
        amount_paise=amount_paise,
        txn_id=txn_id,
        narration=f"CARD/{card.masked_number}/{merchant.name}",
    )

    txn.state = TxnState.COMPLETED
    txn.completed_at = dt.datetime.now(dt.UTC).replace(tzinfo=None)

    recorder.emit(
        component="ISSUER_CBS",
        action="CARD_DEBIT_CAPTURED",
        summary=f"Issuer debited {format_inr(amount_paise)}. Payer balance: {format_inr(payer_account.balance_paise)}",
        txn_id=txn_id,
    )

    return {
        "status": "COMPLETED",
        "action": "FRICTIONLESS" if risk.risk_zone == RiskZone.ALLOW else "CHALLENGE_SUCCESS",
        "txn_id": txn_id,
        "amount_paise": amount_paise,
        "amount_formatted": format_inr(amount_paise),
        "remitter_balance": format_inr(payer_account.balance_paise),
        "beneficiary_balance": format_inr(merchant_account.balance_paise),
        "decision": risk.model_dump(),
    }

"""Scenario execution runner.

Runs any of the 5 canonical demo scenarios end-to-end through the simulated ecosystem:
1. GREEN: Everyday Grocer (ALLOW -> Tier 0 bypass -> balance moves)
2. YELLOW: Unknown Merchant (STEP_UP -> partial data fallback)
3. ORANGE: Digital Arrest Extortion (COACH at lookup -> FREEZE at amount -> MCP screen)
4. RED: Mule Syndicate (FREEZE -> multi-reporter + rapid drain -> zero money moved)
5. BLUE: Card CNP (3DS Risk-Based Authentication Challenge)
"""
from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.orm import Session

from ecosystem.banks import cbs
from ecosystem.cards.acs import handle_card_checkout
from ecosystem.config import format_inr, to_paise
from ecosystem.npci import switch
from ecosystem.psp.app import PspApp
from ecosystem.traces import get_trace_events


def _suspended_result(scenario: str, title: str, trace_id: str, val_res: dict[str, Any], session: Session) -> dict[str, Any]:
    """A scenario whose target VPA has been killed by the nationwide kill-switch.

    ReqValAdd short-circuits before creating a Transaction row in that case, so
    there is no txn to pay against -- the scenario ends at the switch, which is
    itself the correct outcome to show.
    """
    return {
        "scenario": scenario,
        "title": title,
        "trace_id": trace_id,
        "txn_id": val_res.get("txn_id"),
        "status": "BLOCKED_AT_SWITCH",
        "risk_zone": "FREEZE",
        "risk_score": 1.0,
        "reasons": [val_res.get("error", "VPA_NATIONWIDE_SUSPENDED")],
        "suspended_reason": val_res.get("reason"),
        "zero_money_moved": True,
        "traces": get_trace_events(session, trace_id),
    }


def run_scenario_green(session: Session, psp_id: str = "gpay") -> dict[str, Any]:
    """Scenario 1: Safe Everyday Grocer payment."""
    trace_id = f"trc_green_{uuid.uuid4().hex[:8]}"
    app = PspApp(psp_id, "Google Pay", "acc_aarav_sbi")

    # 1. Lookup
    val_res = app.lookup_vpa(
        session,
        customer_id="cust_aarav",
        payer_account_id="acc_aarav_sbi",
        payee_vpa="grocer.local@oksbi",
        trace_id=trace_id,
    )
    if not val_res.get("success", True):
        return _suspended_result("GREEN", "Everyday Trusted Grocer Payment", trace_id, val_res, session)
    txn_id = val_res["txn_id"]

    # Before balances
    aarav_before = cbs.get_account(session, "acc_aarav_sbi").balance_paise
    suresh_before = cbs.get_account(session, "acc_suresh_sbi").balance_paise

    # 2. Pay Rs 450
    amount_paise = to_paise(450)
    pay_res = app.pay(
        session,
        txn_id=txn_id,
        amount_paise=amount_paise,
        user_acknowledged=True,
        pin_verified=True,
        trace_id=trace_id,
    )

    # After balances
    aarav_after = cbs.get_account(session, "acc_aarav_sbi").balance_paise
    suresh_after = cbs.get_account(session, "acc_suresh_sbi").balance_paise

    traces = get_trace_events(session, trace_id)

    return {
        "scenario": "GREEN",
        "title": "Everyday Trusted Grocer Payment",
        "trace_id": trace_id,
        "txn_id": txn_id,
        "status": pay_res["status"],
        "amount": format_inr(amount_paise),
        "tier_reached": pay_res["decision"]["tier_reached"],
        "risk_zone": pay_res["decision"]["risk_zone"],
        "risk_score": pay_res["decision"]["risk_score"],
        "balances": {
            "payer": {"before": format_inr(aarav_before), "after": format_inr(aarav_after)},
            "payee": {"before": format_inr(suresh_before), "after": format_inr(suresh_after)},
        },
        "traces": traces,
    }


def run_scenario_yellow(session: Session, psp_id: str = "gpay") -> dict[str, Any]:
    """Scenario 2: Unknown New Merchant (Step-up required)."""
    trace_id = f"trc_yellow_{uuid.uuid4().hex[:8]}"
    app = PspApp(psp_id, "Google Pay", "acc_aarav_sbi")

    val_res = app.lookup_vpa(
        session,
        customer_id="cust_aarav",
        payer_account_id="acc_aarav_sbi",
        payee_vpa="newshop.mumbai@oksbi",
        trace_id=trace_id,
    )
    if not val_res.get("success", True):
        return _suspended_result("YELLOW", "Unregistered New Merchant", trace_id, val_res, session)
    txn_id = val_res["txn_id"]

    amount_paise = to_paise(2500)
    # Attempt payment without prior acknowledgement
    pay_res = app.pay(
        session,
        txn_id=txn_id,
        amount_paise=amount_paise,
        user_acknowledged=False,
        trace_id=trace_id,
    )

    traces = get_trace_events(session, trace_id)

    return {
        "scenario": "YELLOW",
        "title": "Unregistered New Merchant",
        "trace_id": trace_id,
        "txn_id": txn_id,
        "status": pay_res["status"],
        "amount": format_inr(amount_paise),
        "tier_reached": pay_res["decision"]["tier_reached"],
        "risk_zone": pay_res["decision"]["risk_zone"],
        "risk_score": pay_res["decision"]["risk_score"],
        "completeness": pay_res["decision"]["data_completeness"],
        "traces": traces,
    }


def run_scenario_orange(session: Session, psp_id: str = "gpay") -> dict[str, Any]:
    """Scenario 3: Digital Arrest Extortion Scam."""
    trace_id = f"trc_orange_{uuid.uuid4().hex[:8]}"
    app = PspApp(psp_id, "Google Pay", "acc_aarav_sbi")

    # 1. Lookup with declared official purpose
    val_res = app.lookup_vpa(
        session,
        customer_id="cust_aarav",
        payer_account_id="acc_aarav_sbi",
        payee_vpa="cbi.clearance.cell@sbi",
        declared_purpose="GOVT_FINE",
        trace_id=trace_id,
    )
    if not val_res.get("success", True):
        return _suspended_result("ORANGE", "Digital Arrest Extortion Scheme", trace_id, val_res, session)
    txn_id = val_res["txn_id"]

    aarav_before = cbs.get_account(session, "acc_aarav_sbi").balance_paise

    # 2. Attempt payment of Rs 75,000
    amount_paise = to_paise(75_000)
    pay_res = app.pay(
        session,
        txn_id=txn_id,
        amount_paise=amount_paise,
        user_acknowledged=False,
        trace_id=trace_id,
    )

    aarav_after = cbs.get_account(session, "acc_aarav_sbi").balance_paise
    traces = get_trace_events(session, trace_id)

    return {
        "scenario": "ORANGE",
        "title": "Digital Arrest Extortion Scheme",
        "trace_id": trace_id,
        "txn_id": txn_id,
        "lookup_risk_zone": val_res["risk"]["risk_zone"],
        "status": pay_res["status"],
        "amount": format_inr(amount_paise),
        "risk_zone": pay_res["decision"]["risk_zone"],
        "risk_score": pay_res["decision"]["risk_score"],
        "intervention_screen": pay_res["decision"].get("intervention_screen"),
        "balance_protected": aarav_before == aarav_after,
        "payer_balance": format_inr(aarav_after),
        "traces": traces,
    }


def run_scenario_red(session: Session, psp_id: str = "gpay") -> dict[str, Any]:
    """Scenario 4: Money Mule Syndicate Account."""
    trace_id = f"trc_red_{uuid.uuid4().hex[:8]}"
    app = PspApp(psp_id, "Google Pay", "acc_aarav_sbi")

    val_res = app.lookup_vpa(
        session,
        customer_id="cust_aarav",
        payer_account_id="acc_aarav_sbi",
        payee_vpa="mule.syndicate@axis",
        trace_id=trace_id,
    )
    if not val_res.get("success", True):
        return _suspended_result("RED", "Mule Syndicate Rapid Drain Account", trace_id, val_res, session)
    txn_id = val_res["txn_id"]

    aarav_before = cbs.get_account(session, "acc_aarav_sbi").balance_paise
    mule_before = cbs.get_account(session, "acc_mule_axis").balance_paise

    amount_paise = to_paise(50_000)
    pay_res = app.pay(
        session,
        txn_id=txn_id,
        amount_paise=amount_paise,
        user_acknowledged=False,
        trace_id=trace_id,
    )

    aarav_after = cbs.get_account(session, "acc_aarav_sbi").balance_paise
    mule_after = cbs.get_account(session, "acc_mule_axis").balance_paise
    traces = get_trace_events(session, trace_id)

    return {
        "scenario": "RED",
        "title": "Mule Syndicate Rapid Drain Account",
        "trace_id": trace_id,
        "txn_id": txn_id,
        "status": pay_res["status"],
        "amount": format_inr(amount_paise),
        "risk_zone": pay_res["decision"]["risk_zone"],
        "risk_score": pay_res["decision"]["risk_score"],
        "reasons": pay_res["decision"]["reasons"],
        "zero_money_moved": (aarav_before == aarav_after) and (mule_before == mule_after),
        "payer_balance": format_inr(aarav_after),
        "mule_balance": format_inr(mule_after),
        "traces": traces,
    }


def run_scenario_blue(session: Session) -> dict[str, Any]:
    """Scenario 5: Card CNP E-commerce Checkout."""
    trace_id = f"trc_blue_{uuid.uuid4().hex[:8]}"
    amount_paise = to_paise(85_000)

    # Initial checkout without OTP -> triggers challenge
    res = handle_card_checkout(
        session,
        trace_id=trace_id,
        card_id="card_aarav_rupay",
        merchant_id="merch_croma_retail",
        amount_paise=amount_paise,
        otp_submitted=None,
    )

    traces = get_trace_events(session, trace_id)
    return {
        "scenario": "BLUE",
        "title": "Card CNP E-Commerce Checkout",
        "trace_id": trace_id,
        "status": res["status"],
        "action": res["action"],
        "risk_zone": res["decision"]["risk_zone"],
        "risk_score": res["decision"]["risk_score"],
        "traces": traces,
    }

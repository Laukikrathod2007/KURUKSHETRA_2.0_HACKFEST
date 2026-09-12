"""MCP tool implementations for post-decision intervention and explainability.

Invoked ONLY when the deterministic scoring engine has produced COACH or FREEZE.
Operates strictly on inert, structured evidence.
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from ecosystem.config import format_inr
from ecosystem.models import InterventionOutcome, TrustedContactNotification

_EXPLANATION_TEMPLATES: dict[str, str] = {
    "AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT": "This UPI ID uses an official-sounding keyword (like 'CBI', 'police', or an electricity board), but it belongs to a private, unverified personal account -- not a government or enterprise account.",
    "AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH": "You are being asked to pay someone claiming official authority, but the account you are sending to is an ordinary individual savings account. Official fines and court bail are never collected into personal accounts.",
    "DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE": "You specified this payment is for a government fine or court bail, but the recipient account is a personal savings account, not an official government treasury account.",
    "QR_OR_LINK_PREFILLED_DEBIT_TRAP": "This QR code or link is pre-filled to SEND money, not receive it. Scanning a QR code or entering your PIN will debit your account.",
    "AMOUNT_EXTREME_OUTLIER_VS_HISTORY": "This amount is dramatically higher than your normal payments to new beneficiaries -- a hallmark signature of an urgent, coercive scam.",
    "GEOMETRIC_ESCALATION_TO_SAME_RECIPIENT": "Your transfers to this recipient have been geometrically escalating in size -- a classic 'drip' grooming pattern.",
    "STRUCTURED_SUB_THRESHOLD_SPLITTING": "Multiple payments sent to the same recipient just under regulatory reporting limits within a short window (structuring/smurfing).",
    "ACCIDENTAL_TRANSFER_TRAP": "You received only a tiny sum from this person, but they are now requesting a large sum back. This is an accidental transfer refund scam.",
    "DECEPTIVE_COLLECT_REQUEST_NOTE": "This is an incoming collect request that will DEDUCT money from your account upon PIN entry.",
    "COACHED_COOLING_OFF_BYPASS": "You recently completed a cooling-off hold for this recipient and are immediately attempting a larger amount.",
    "HIGH_ABANDONMENT_RATE": "Over 85% of people who looked up this recipient chose not to proceed with payment.",
    "ACTIVE_CAMPAIGN_BURST": "This account is experiencing an abnormal lookup burst across multiple PSP apps simultaneously.",
    "COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD": "Multiple independent users have reported this recipient account for fraudulent activity.",
    "INSTANT_CASH_OUT_MULE_PATTERN": "Incoming funds in this account are emptied within minutes (median residence time <300s) -- pass-through mule account signature.",
    "PURE_SINK_MULE_ACCOUNT": "This account receives funds from dozens of senders with near-zero legitimate merchant or personal debit activity.",
    "COMPROMISED_DORMANT_ACCOUNT": "A previously dormant account with sudden high-volume inflows and immediate 90%+ drainage.",
    "BOILER_ROOM_SHIFT_PATTERN": "Inbound credits occur strictly during call-center boiler room operational hours.",
    "MULE_SYNDICATE_GRAPH_SIGNATURE": "Account is under 7 days old with minimal KYC and receives payments originating across diverse states.",
}

_CONCEPTUAL_NOTE = " (Illustrative signal: live government registry integration requires formal regulatory MoUs and is simulated here.)"

_HELPLINE_DIRECTORY: dict[str, str] = {
    "sbi": "1800-11-2211 / 1800-425-3800 (State Bank of India 24x7)",
    "hdfc": "1800-202-6161 / 1860-267-6161 (HDFC Bank Customer Support)",
    "axis": "1860-419-5555 / 1860-500-5555 (Axis Bank Emergency Helpline)",
    "icici": "1800-1080 (ICICI Bank 24x7 Fraud Assistance)",
    "cybercrime": "1930 (National Cyber Crime Reporting Helpline)",
}


def explain_decision(
    reasons: list[str],
    conceptual_reason_codes: set[str] | None = None,
    use_llm: bool = True,
    evidence_map: dict[str, dict[str, Any]] | None = None,
) -> str:
    """Explains decision to the victim in clear, empathetic, urgent English.
    Uses LLM reasoning when API key is available; falls back cleanly to deterministic templates.
    Dynamically interpolates real forensic evidence metrics when available.
    """
    import os
    conceptual_reason_codes = conceptual_reason_codes or set()
    evidence_map = evidence_map or {}
    if not reasons:
        return "No specific risk indicators were flagged for this transaction."

    # 1. Deterministic baseline with computed evidence interpolation
    sentences = []
    for code in reasons:
        ev = evidence_map.get(code, {})
        text = _EXPLANATION_TEMPLATES.get(code)
        
        # Inject dynamic forensic evidence if available
        if code == "INSTANT_CASH_OUT_MULE_PATTERN" and "median_residence_seconds" in ev:
            med_s = ev["median_residence_seconds"]
            text = f"Incoming funds in this account are emptied within minutes (median residence time {med_s:.0f}s vs <300s threshold) -- pass-through mule account signature."
        elif code == "AMOUNT_EXTREME_OUTLIER_VS_HISTORY" and "z_score" in ev:
            z = ev["z_score"]
            amt = ev.get("amount", "")
            text = f"This payment amount ({amt}) is dramatically higher than your normal payments to new beneficiaries (statistical Z-score: {z:.2f}) -- a hallmark signature of an urgent, coercive scam."
        elif code == "PURE_SINK_MULE_ACCOUNT" and "sink_ratio" in ev:
            sr = ev["sink_ratio"]
            text = f"This account displays an extreme sink ratio ({sr:.1f}x) receiving funds from dozens of senders with near-zero legitimate merchant or personal debit activity -- pass-through mule characteristics."
        elif code == "HIGH_ABANDONMENT_RATE" and "abandon_ratio" in ev:
            pct = int(ev["abandon_ratio"] * 100)
            text = f"Over {pct}% of people who looked up this recipient chose not to proceed with payment."
        elif code == "COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD" and "distinct_reporter_count" in ev:
            rc = ev["distinct_reporter_count"]
            text = f"Multiple independent citizens ({rc} verified complaints) have reported this recipient account for fraudulent activity."
        
        if text is None:
            text = f"An anomaly was flagged by detection check: {code}."
        if code in conceptual_reason_codes:
            text += _CONCEPTUAL_NOTE
        sentences.append(text)
    deterministic_explanation = " ".join(sentences)

    # 2. Generative LLM synthesis enhancement when API key is configured
    if use_llm and (os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")):
        try:
            import json
            import urllib.request

            gemini_key = os.getenv("GEMINI_API_KEY")
            if gemini_key:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": (
                                "You are the Kurukshetra Agentic Guardian payment fraud protection AI. "
                                "Explain this detected payment scam to a potential victim in 1-2 empathetic, urgent, crystal-clear sentences. "
                                "Do not use technical jargon. Focus on warning them what will happen if they proceed.\n\n"
                                f"Detected risk indicators: {', '.join(reasons)}\n"
                                f"Forensic details: {deterministic_explanation}"
                            )
                        }]
                    }],
                    "generationConfig": {
                        "maxOutputTokens": 100,
                        "temperature": 0.2
                    }
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=1.8) as resp:
                    if resp.status == 200:
                        data = json.loads(resp.read().decode("utf-8"))
                        candidates = data.get("candidates", [])
                        if candidates:
                            gen_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                            if gen_text:
                                return f"{gen_text} {deterministic_explanation}"
        except Exception:
            pass

    return deterministic_explanation


def select_intervention_template(risk_zone: str, reasons: list[str]) -> str:
    reason_set = set(reasons)
    purpose_codes = {
        "AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH",
        "DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE",
        "AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT",
    }
    mule_codes = {
        "INSTANT_CASH_OUT_MULE_PATTERN",
        "PURE_SINK_MULE_ACCOUNT",
        "COMPROMISED_DORMANT_ACCOUNT",
        "MULE_SYNDICATE_GRAPH_SIGNATURE",
    }

    if reason_set & purpose_codes:
        return "PURPOSE_CONTRADICTION_SCREEN"
    if reason_set & mule_codes:
        return "ACCOUNT_TIMELINE_SCREEN"
    if "COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD" in reason_set:
        return "COMMUNITY_FRAUD_WARNING_SCREEN"
    return "GENERIC_COACH_SCREEN"


def notify_trusted_contact(
    session: Session,
    *,
    customer_id: str,
    txn_id: str,
    amount_paise: Optional[int] = None,
) -> dict:
    amt_str = format_inr(amount_paise) if amount_paise else "a high-value amount"
    message = (
        f"Kurukshetra Alert: An urgent transaction of {amt_str} from user {customer_id} "
        f"was intercepted and blocked. If you are being pressured or threatened, contact 1930 immediately."
    )
    notification = TrustedContactNotification(
        notification_id=f"notif_{uuid.uuid4().hex[:10]}",
        customer_id=customer_id,
        txn_id=txn_id,
        message=message,
        sent_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(notification)
    session.flush()
    return {
        "notification_id": notification.notification_id,
        "customer_id": customer_id,
        "message": message,
        "status": "SIMULATED_DELIVERY_SUCCESS",
    }


def log_intervention_outcome(
    session: Session,
    *,
    txn_id: str,
    template_id: str,
    user_action: str = "PENDING",
) -> str:
    outcome = InterventionOutcome(
        outcome_id=f"outc_{uuid.uuid4().hex[:10]}",
        txn_id=txn_id,
        template_id=template_id,
        user_action=user_action,
        recorded_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(outcome)
    session.flush()
    return outcome.outcome_id


def check_helpline_directory(bank_id: str) -> str:
    b = bank_id.lower().strip()
    if "sbi" in b:
        return _HELPLINE_DIRECTORY["sbi"]
    if "hdfc" in b:
        return _HELPLINE_DIRECTORY["hdfc"]
    if "axis" in b:
        return _HELPLINE_DIRECTORY["axis"]
    if "icici" in b or "icic" in b:
        return _HELPLINE_DIRECTORY["icici"]
    return _HELPLINE_DIRECTORY["cybercrime"]

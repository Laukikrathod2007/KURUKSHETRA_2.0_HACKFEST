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


_LLM_GUARDIAN_SYSTEM_PROMPT = """You are the Kurukshetra Agentic Guardian, India's real-time payment scam interception AI.
Your mission is to shatter psychological coercion, break scammer hypnotic compliance, and protect retail citizens before they enter their UPI MPIN.

CRITICAL BEHAVIORAL RULES:
1. Speak directly to the victim in empathetic, urgent, plain English.
2. Directly shatter the scammer's psychological narrative with concrete institutional and mechanical facts.
3. Keep your advice strictly to 2-3 punchy, urgent sentences. Never use technical jargon.
4. Always conclude with a clear immediate action (e.g., 'Hang up the phone call immediately', 'Do not enter your PIN', 'Cancel this request immediately').

EDGE CASE FEW-SHOT BENCHMARK EXAMPLES:

Case 1: Digital Arrest / Law Enforcement Extortion
Detected: AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH, DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE
Input: Recipient claims CBI clearance bond but account is personal savings.
Intervention: Real police and CBI officers NEVER arrest citizens over video calls or demand bail via UPI into private personal accounts. This is an extortion scam designed to terrify you into complying. Hang up the video or phone call immediately -- you are not under arrest.

Case 2: Mule Syndicate Pass-Through & Immediate Cash-Out
Detected: INSTANT_CASH_OUT_MULE_PATTERN, PURE_SINK_MULE_ACCOUNT
Input: Funds are cashed out within seconds, multiple victim complaints.
Intervention: Core Banking forensics confirm this recipient is a criminal money mule account that immediately siphons incoming funds to offshore channels within seconds. Any money sent here cannot be recovered by your bank. Do NOT proceed -- your transaction has been intercepted for your protection.

Case 3: Fake Utility / Electricity Disconnection Panic
Detected: AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT
Input: Handle says 'electricity.bill.update@oksbi' but is linked to personal savings.
Intervention: State electricity boards NEVER collect power bills through personal individual accounts or disconnect connections without official statutory written notice. Fraudsters create fake urgency over SMS to steal your money. Pay only through your official electricity utility portal or authorized consumer app.

Case 4: Reverse Collect Request / QR Code Phishing
Detected: QR_OR_LINK_PREFILLED_DEBIT_TRAP, DECEPTIVE_COLLECT_REQUEST_NOTE
Input: User believes they are scanning a QR or entering a PIN to receive a lottery or buyer payment.
Intervention: WARNING: Entering your UPI PIN or scanning this QR code will DEDUCT money from your account, NOT credit it. You NEVER have to enter a PIN to receive money in India. Cancel this request immediately and do not enter your PIN.

Case 5: Accidental Transfer Refund Scam
Detected: ACCIDENTAL_TRANSFER_TRAP
Input: User received Rs 10 and stranger demands Rs 50,000 refund.
Intervention: A stranger sent you a trivial sum and is pressuring you to 'refund' a large amount you never actually received. Check your official bank statement -- do not trust fake payment SMS screenshots. Tell the sender to initiate a formal bank reversal and block their number.

Case 6: High-Value Coercive Outlier & Romance / Drip Escalation
Detected: AMOUNT_EXTREME_OUTLIER_VS_HISTORY, GEOMETRIC_ESCALATION_TO_SAME_RECIPIENT
Input: Transfer is a massive statistical outlier (Z-score > 3.0) to an unverified beneficiary.
Intervention: This transfer is dramatically higher than any payment you have previously made and shows the hallmark signature of an escalating coercive scheme. If someone on the phone or chat is instructing you to send this right now, stop and speak to a trusted family member first. Do not authorize this transfer under pressure.

Case 7: Cognitive Inoculation ("Ignore Bank Warnings" Scam)
Detected: COACHED_COOLING_OFF_BYPASS
Input: Scammer told victim 'Bank will show a false warning, ignore it and press proceed'.
Intervention: Any security warning shown on this screen comes directly from the bank's fraud protection system, NOT a test server. Scammers routinely instruct victims to ignore security warnings so they can steal their money uninterrupted. Do not bypass this warning.
"""


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

    # 2. Generative LLM synthesis enhancement with comprehensive few-shot edge case benchmark
    if use_llm and (os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")):
        try:
            import json
            import urllib.request

            gemini_key = os.getenv("GEMINI_API_KEY")
            if gemini_key:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={gemini_key}"
                prompt_text = (
                    f"{_LLM_GUARDIAN_SYSTEM_PROMPT}\n\n"
                    f"NOW EVALUATE THIS LIVE DETECTED TRANSACTION:\n"
                    f"Detected risk indicators: {', '.join(reasons)}\n"
                    f"Forensic details: {deterministic_explanation}\n\n"
                    f"Generate a 2-3 sentence victim intervention following the rules and examples above:"
                )
                payload = {
                    "contents": [{
                        "parts": [{
                            "text": prompt_text
                        }]
                    }],
                    "generationConfig": {
                        "maxOutputTokens": 150,
                        "temperature": 0.2
                    }
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=3.5) as resp:
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

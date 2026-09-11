"""The five MCP tool implementations, as plain functions.

Per docs/05-mcp-architecture.md: these are invoked ONLY when the deterministic
scoring engine has already produced COACH or FREEZE. No tool here decides
risk -- they operate strictly on the frozen evidence bundle the engine
already computed. `explain_decision` is the ONLY place any LLM call would
happen; it currently runs on deterministic templates (see its docstring for
the exact seam to swap in a real model call).

Both kurukshetra_mcp/server.py (the standalone, independently-runnable
FastMCP server) and kurukshetra_mcp/host.py (the in-process orchestrator used
by the consolidated backend) call these same functions, so there is exactly
one implementation of each tool's behavior.
"""
from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy.orm import Session

from kurukshetra.models import InterventionOutcome, TrustedContactNotification

# ---------------------------------------------------------------------------
# explain_decision
# ---------------------------------------------------------------------------

_EXPLANATION_TEMPLATES: dict[str, str] = {
    "AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT": "This UPI ID uses an official-sounding keyword (like 'CBI', 'police', or a utility name), but it belongs to a private, unverified personal account -- not a government or enterprise merchant account.",
    "AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH": "You're being asked to pay someone claiming government or law-enforcement authority, but the account you're sending to is an ordinary individual savings account. Real government fines and bail are never collected into personal accounts.",
    "DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE": "You said this payment is for a government fine or court bail, but the recipient account is a personal savings account, not an official treasury or court account.",
    "QR_OR_LINK_PREFILLED_DEBIT_TRAP": "This QR code or link is pre-filled to SEND money, not receive it. Scanning a QR code or opening a payment link never brings money into your account.",
    "AMOUNT_EXTREME_OUTLIER_VS_HISTORY": "This amount is far larger than anything you've sent to a new recipient before -- a common signature of a coerced, high-pressure payment.",
    "GEOMETRIC_ESCALATION_TO_SAME_RECIPIENT": "Your payments to this recipient have been rapidly increasing in size -- a classic 'drip' pattern used to build trust before demanding a much larger sum.",
    "STRUCTURED_SUB_THRESHOLD_SPLITTING": "You're sending several payments to the same recipient, each just under a reporting threshold, in a short window -- a pattern used to avoid bank scrutiny.",
    "ACCIDENTAL_TRANSFER_TRAP": "You received only a tiny amount from this person, not the large sum they're now asking you to 'return'. Do not send this money.",
    "DECEPTIVE_COLLECT_REQUEST_NOTE": "This is a request that will DEDUCT money from your account, despite its note suggesting you're about to receive something. A UPI PIN is never required to receive money.",
    "COACHED_COOLING_OFF_BYPASS": "You just completed a delayed payment to this recipient and are already trying to send a larger amount -- this matches a pattern where a scammer coaches victims through a bank's cooling-off period.",
    "HIGH_ABANDONMENT_RATE": "A large share of people who looked up this account recently chose not to pay after seeing the registered name.",
    "ACTIVE_CAMPAIGN_BURST": "This account is being looked up by an unusually large number of people right now -- a signature of an active, coordinated scam campaign.",
    "COMMUNITY_FRAUD_REPORTS_ABOVE_THRESHOLD": "Multiple independent users have reported this account for fraud in the recent past.",
    "INSTANT_CASH_OUT_MULE_PATTERN": "Money arriving in this account is withdrawn or forwarded within minutes, almost every time -- a signature of a pass-through mule account, not a normal personal account.",
    "PURE_SINK_MULE_ACCOUNT": "This account receives money from many unrelated people and sends almost nothing back out for normal expenses -- a signature of a money-mule collection account.",
    "COMPROMISED_DORMANT_ACCOUNT": "This account was inactive for a long time and has suddenly received a burst of large deposits that are being drained almost immediately.",
    "BOILER_ROOM_SHIFT_PATTERN": "Nearly all deposits into this account arrive during standard weekday office hours -- a pattern seen in commercial scam call centers, not personal accounts.",
    "CROSS_STATE_MULE_SYNDICATE_PROFILE": "This account is only a few days old, has minimal identity verification, and has received payments from people across many different states in the last two days.",
}

_CONCEPTUAL_NOTE = " (Note: this specific signal is illustrative only in this build -- real-time government registry integration requires a regulatory agreement and is not live here.)"


def explain_decision(reasons: list[str], conceptual_reason_codes: set[str] | None = None) -> str:
    """Turns fired reason codes into one plain-language explanation.

    SEAM for a real LLM call: replace this function's body with a call to
    your model of choice, passing `reasons` (and only `reasons` -- never raw
    untrusted text) as structured, quoted evidence. Keep the instruction
    portion of that prompt static and never derived from the evidence, per
    the prompt-injection boundary in docs/05-mcp-architecture.md.
    """
    conceptual_reason_codes = conceptual_reason_codes or set()
    if not reasons:
        return "No specific risk signals were identified for this transaction."

    sentences = []
    for code in reasons:
        text = _EXPLANATION_TEMPLATES.get(code)
        if text is None:
            # Conceptual/registry codes are dynamic (CONCEPTUAL_<FLAG_TYPE>_MATCH) --
            # build a generic, clearly-labeled sentence instead of silently dropping them.
            text = f"A flag matched an external registry check ({code})."
        if code in conceptual_reason_codes:
            text += _CONCEPTUAL_NOTE
        sentences.append(text)
    return " ".join(sentences)


# ---------------------------------------------------------------------------
# select_intervention_template
# ---------------------------------------------------------------------------

_PURPOSE_CODES = {"AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH", "DECLARED_PURPOSE_CONTRADICTS_ACCOUNT_TYPE"}
_TIMELINE_CODES = {
    "CROSS_STATE_MULE_SYNDICATE_PROFILE",
    "COMPROMISED_DORMANT_ACCOUNT",
    "INSTANT_CASH_OUT_MULE_PATTERN",
    "PURE_SINK_MULE_ACCOUNT",
}
_HELPLINE_CODES = {"AUTHORITY_HANDLE_UNVERIFIED_ACCOUNT"}


def select_intervention_template(risk_zone: str, reasons: list[str]) -> str:
    """Deterministic mapping, not a free-form agent decision -- keeps the UI
    predictable and testable. Maps to the remaining Category H screens."""
    reason_set = set(reasons)
    if reason_set & _PURPOSE_CODES:
        return "PURPOSE_CONTRADICTION_SCREEN"
    if reason_set & _TIMELINE_CODES:
        return "ACCOUNT_TIMELINE_SCREEN"
    if reason_set & _HELPLINE_CODES:
        return "BANK_HELPLINE_SCREEN"
    return "GENERIC_COACH_SCREEN"


# ---------------------------------------------------------------------------
# notify_trusted_contact (feature #26 -- mocked delivery channel)
# ---------------------------------------------------------------------------


def notify_trusted_contact(session: Session, *, payer_id: str, transaction_id: str, amount: float | None) -> dict:
    message = (
        f"Kurukshetra alert: a high-risk payment of {amount if amount else 'an amount'} "
        f"was flagged for {payer_id}. Please check in with them directly."
    )
    notification = TrustedContactNotification(
        notification_id=f"notif_{uuid.uuid4().hex[:10]}",
        payer_id=payer_id,
        transaction_id=transaction_id,
        message=message,
    )
    session.add(notification)
    session.commit()
    # Mocked delivery channel: in production this triggers a real SMS/push
    # send; here we only log the notification's existence.
    return {"notification_id": notification.notification_id, "delivered": "MOCKED", "message": message}


# ---------------------------------------------------------------------------
# log_intervention_outcome (feature #36)
# ---------------------------------------------------------------------------


def log_intervention_outcome(
    session: Session, *, transaction_id: str, intervention_template_id: str, user_action: str
) -> str:
    outcome = InterventionOutcome(
        outcome_id=f"outc_{uuid.uuid4().hex[:10]}",
        transaction_id=transaction_id,
        intervention_template_id=intervention_template_id,
        user_action=user_action,
    )
    session.add(outcome)
    session.commit()
    return outcome.outcome_id


# ---------------------------------------------------------------------------
# check_helpline_directory (feature #30)
# ---------------------------------------------------------------------------

_HELPLINE_DIRECTORY = {
    "sbi": "1800-1234 (SBI Official Customer Care)",
    "icici": "1800-1080 (ICICI Bank Official Customer Care)",
    "axis": "1860-419-5555 (Axis Bank Official Customer Care)",
    "oksbi": "1800-1234 (SBI Official Customer Care)",
}


def check_helpline_directory(bank_id: str) -> str:
    return _HELPLINE_DIRECTORY.get(bank_id.lower(), "1930 (National Cyber Crime Helpline)")

import re
import uuid
from typing import Dict, Any, List
from ..models.schemas import ProblemUploadRequest, IncidentAnalysis, RiskLevel

SCAM_PATTERNS = {
    "DIGITAL_ARREST": {
        "keywords": ["cbi", "police", "customs", "arrest", "warrant", "court", "narcotics", "parcel with drugs", "money laundering"],
        "entity": "Law Enforcement / Police / CBI",
        "tactic": "Fear of immediate physical arrest or fake court inquiry",
        "guidance": "Real law enforcement agencies never hold interrogations over Skype/WhatsApp or demand money via UPI/crypto.",
        "risk_score": 95.0
    },
    "ELECTRICITY_BILL": {
        "keywords": ["electricity", "power cut", "meter", "disconnect", "electric bill", "power supply", "tonight 9:30"],
        "entity": "State Electricity Department",
        "tactic": "Panic over utility service disconnection within hours",
        "guidance": "Electricity boards never send personal phone numbers to pay pending bills or threaten night disconnections.",
        "risk_score": 85.0
    },
    "TASK_JOB_SCAM": {
        "keywords": ["telegram", "daily profit", "like youtube", "part time", "rating task", "deposit to unlock", "crypto doubling"],
        "entity": "Fake Recruitment / Task Marketing Agency",
        "tactic": "Greed & sunk-cost trap: depositing money to withdraw earned commission",
        "guidance": "Legitimate jobs never require candidates to deposit their own money to withdraw salary or commission.",
        "risk_score": 90.0
    },
    "CEO_FRAUD": {
        "keywords": ["boss", "meeting", "gift card", "apple gift", "google play", "steam", "client emergency", "confidential"],
        "entity": "Company Executive / Employer",
        "tactic": "Urgency from authority figure requiring gift card codes",
        "guidance": "Company executives never request gift cards over message. Call your manager directly on their personal line.",
        "risk_score": 88.0
    },
    "KYC_BANK_BLOCK": {
        "keywords": ["kyc", "pan expired", "account suspended", "debit card blocked", "update immediately", "apk download"],
        "entity": "Bank Security / Support Desk",
        "tactic": "Panic over frozen bank account or downloading malicious APK link",
        "guidance": "Banks never request APK installation or confidential credentials over SMS links.",
        "risk_score": 85.0
    }
}

class IncidentAnalyzer:
    @staticmethod
    def analyze_uploaded_problem(request: ProblemUploadRequest) -> IncidentAnalysis:
        text = request.problem_text.lower()
        incident_id = f"inc_{uuid.uuid4().hex[:8]}"
        user_name = request.user_name or "Customer"

        matched_category = "UNKNOWN_SUSPICIOUS"
        entity = "Unidentified Counterparty"
        tactic = "Unverified urgency or financial pressure"
        guidance = "Exercise extreme caution and do not send funds or share OTPs until independently verified."
        risk_score = 50.0

        for cat_name, data in SCAM_PATTERNS.items():
            if any(k in text for k in data["keywords"]):
                matched_category = cat_name
                entity = data["entity"]
                tactic = data["tactic"]
                guidance = data["guidance"]
                risk_score = data["risk_score"]
                break

        # Extract potential amount if present in text
        amount_match = re.search(r"(?:rs\.?|inr|₹|\$)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)", text, re.IGNORECASE)
        demanded_amount = amount_match.group(0) if amount_match else "Unspecified Amount"

        risk_level = RiskLevel.CRITICAL if risk_score >= 80 else (RiskLevel.HIGH if risk_score >= 60 else RiskLevel.MEDIUM)

        # Build dynamic first spoken words for TruGen avatar
        if matched_category == "DIGITAL_ARREST":
            first_msg = (
                f"Hello {user_name}, I have reviewed the incident you uploaded. "
                f"The claims that you face police arrest or court proceedings over this parcel are completely fake. "
                f"Are you currently on a call with these individuals?"
            )
        elif matched_category == "ELECTRICITY_BILL":
            first_msg = (
                f"Hello {user_name}, I checked the message you shared regarding the power cut. "
                f"This is a common utility scam; government electricity boards never send notices like this. "
                f"Have you paid them any money yet?"
            )
        elif matched_category == "TASK_JOB_SCAM":
            first_msg = (
                f"Hello {user_name}, I reviewed the task offer you uploaded. "
                f"Requiring deposits to withdraw earnings is a hallmark of Telegram task scams. "
                f"Please do not send any more funds. How much did they ask for?"
            )
        elif matched_category == "CEO_FRAUD":
            first_msg = (
                f"Hello {user_name}, I reviewed the request for gift cards supposedly from your boss. "
                f"This is an impersonation tactic called CEO fraud. Real employers never ask for gift cards."
            )
        else:
            first_msg = (
                f"Hello {user_name}, I'm Aria from your security team. "
                f"I've carefully analyzed the problem you uploaded. What made you suspicious about this situation?"
            )

        # Build complete dynamic prompt for TruGen AI
        prompt = f"""
You are Aria, a dedicated Human-like Financial Security Specialist speaking live on video to protect {user_name}.

============================================================
UPLOADED PROBLEM ANALYSIS (ALREADY ANALYZED - USER DOES NOT NEED TO RE-EXPLAIN):
============================================================
- Incident Reference: {incident_id}
- Source Channel: {request.source_channel}
- User's Uploaded Narrative: "{request.problem_text.strip()}"
- Detected Scam Type: {matched_category}
- Impersonated Authority/Entity: {entity}
- Extracted Demanded Sum: {demanded_amount}
- Psychological Coercion Tactic: {tactic}
- Expert Safety Guidance: {guidance}
- Risk Level: {risk_score}/100 ({risk_level})

============================================================
YOUR INTERACTIVE CONVERSATION GOAL:
============================================================
1. Your first spoken sentence MUST address the uploaded incident immediately using the first message provided below.
2. Listen empathetically to {user_name}. They may be terrified of arrest, worried about bills, or distressed about losing money.
3. Keep your spoken turns brief and conversational (1 to 2 short sentences per turn).
4. Strictly enforce anti-scam rules:
   - Remind them that official institutions never ask for transfers via personal UPI or gift cards.
   - Advise them to hang up any active calls and block the scammer's number.
   - Reassure them that their bank balance is safe.
"""

        return IncidentAnalysis(
            incident_id=incident_id,
            user_name=user_name,
            raw_problem=request.problem_text,
            scam_category=matched_category,
            risk_level=risk_level,
            risk_score=risk_score,
            impersonated_entity=entity,
            demanded_amount=demanded_amount,
            coercion_tactics=[tactic],
            immediate_guidance=guidance,
            aria_first_message=first_msg,
            guardian_prompt=prompt.strip()
        )

import re
from typing import List
from ..models.schemas import PaymentRequest, AgentSignal

URGENCY_TRIGGERS = [
    r"\burgent\b", r"\bimmediately\b", r"\basap\b", r"\bemergency\b", 
    r"\bfast\b", r"\bhurry\b", r"\bwithin 10 mins\b", r"\btoday itself\b"
]

COERCION_TRIGGERS = [
    r"\bcustoms\b", r"\bcourier penalty\b", r"\barrest\b", r"\bpolice\b", 
    r"\bcbi\b", r"\bcourt\b", r"\belectricity\b", r"\bpower cut\b", r"\bdisconnect\b",
    r"\bkyc\b", r"\baccount block\b", r"\bboss\b", r"\bgift card\b", r"\bpension\b",
    r"\btax fine\b", r"\bprocessing fee\b", r"\blottery\b", r"\btask\b", r"\btelegram job\b",
    r"\bcrypto\b", r"\bdigital arrest\b"
]

class IntentAgent:
    @staticmethod
    def analyze(payment: PaymentRequest) -> AgentSignal:
        findings = []
        note = (payment.payment_note or "").lower()
        score = 0.0

        urgency_detected = [t for t in URGENCY_TRIGGERS if re.search(t, note)]
        coercion_detected = [t for t in COERCION_TRIGGERS if re.search(t, note)]

        profile = payment.user_profile
        is_vulnerable = profile and profile.persona_type in ["SENIOR_CITIZEN", "STUDENT_YOUTH"]

        if urgency_detected:
            score += 40.0 if is_vulnerable else 30.0
            clean_terms = [t.replace(r"\b", "") for t in urgency_detected]
            findings.append(f"High urgency psychological priming detected: '{', '.join(clean_terms)}'")

        if coercion_detected:
            score += 65.0 if is_vulnerable else 50.0
            clean_terms = [t.replace(r"\b", "") for t in coercion_detected]
            findings.append(f"Authoritative coercion or fee-impersonation keywords detected: '{', '.join(clean_terms)}'")

        if not note and payment.amount > 10000:
            score += 15.0
            findings.append("Large value transaction executed with zero descriptive purpose note")

        flagged = score >= 35.0
        return AgentSignal(
            agent_name="IntentCoercionAgent",
            risk_score=min(score, 100.0),
            flagged=flagged,
            findings=findings if findings else ["Note demonstrates standard personal commerce intent"],
            confidence=0.94,
            metadata={"urgency_terms": urgency_detected, "coercion_terms": coercion_detected}
        )

from ..models.schemas import PaymentRequest, AgentSignal

KNOWN_SCAM_KEYWORDS = ["lottery", "customs", "verify", "police", "kyc", "crypto", "safe", "gift", "refund"]

class RecipientAgent:
    @staticmethod
    def analyze(payment: PaymentRequest) -> AgentSignal:
        findings = []
        score = 5.0
        rec_id = payment.recipient_id.lower()
        rec_name = payment.recipient_name.lower()

        profile = payment.user_profile
        frequent = [c.lower() for c in (profile.frequent_counterparties if profile else [])]

        # Frequent trusted counterparty check (Lowers false positive friction)
        if rec_id in frequent or any(rec_id in c for c in frequent):
            return AgentSignal(
                agent_name="RecipientIntelligenceAgent",
                risk_score=0.0,
                flagged=False,
                findings=[f"Trusted frequent counterparty verified in user's personal relationship graph"],
                confidence=0.98,
                metadata={"trusted_counterparty": True}
            )

        # Check for suspicious naming or known scam indicators
        if any(keyword in rec_id or keyword in rec_name for keyword in KNOWN_SCAM_KEYWORDS):
            score += 45.0
            findings.append("Recipient handle or name contains high-risk impersonation keyword")

        # Check for numeric-only or mule account patterns
        if rec_id.split("@")[0].isdigit() and len(rec_id.split("@")[0]) > 8:
            score += 20.0
            findings.append("Recipient VPA uses a disposable numeric syntax typical of synthetic mule wallets")

        # Newly seen recipient check
        score += 15.0
        findings.append("First-time recipient with zero prior counterparty relationship for this user")

        flagged = score >= 35.0
        return AgentSignal(
            agent_name="RecipientIntelligenceAgent",
            risk_score=min(score, 100.0),
            flagged=flagged,
            findings=findings if findings else ["Recipient verified with positive historical trust standing"],
            confidence=0.91,
            metadata={"first_time_recipient": True}
        )

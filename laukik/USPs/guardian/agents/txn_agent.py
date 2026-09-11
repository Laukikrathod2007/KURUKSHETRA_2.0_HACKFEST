from ..models.schemas import PaymentRequest, AgentSignal

class TransactionAgent:
    @staticmethod
    def analyze(payment: PaymentRequest) -> AgentSignal:
        findings = []
        score = 5.0 # baseline low risk

        profile = payment.user_profile
        baseline_avg = profile.avg_txn_amount if profile else 1500.0
        max_typical = profile.max_typical_txn if profile else 5000.0

        # Relative anomaly calculation based on THIS user's history
        ratio = payment.amount / max(baseline_avg, 1.0)
        
        if payment.amount > max_typical * 3:
            score += 50.0
            findings.append(f"Amount ({payment.currency} {payment.amount:,.2f}) is 3x higher than user's all-time historical maximum ({payment.currency} {max_typical:,.2f})")
        elif ratio > 8.0:
            score += 35.0
            findings.append(f"Amount is {ratio:.1f}x higher than this user's typical average expenditure ({payment.currency} {baseline_avg:,.2f})")
        elif ratio > 3.0:
            score += 20.0
            findings.append(f"Noticeable spike ({ratio:.1f}x) above user's normal baseline")

        # Round number high-value cash-out signature
        if payment.amount in [10000, 25000, 50000, 100000]:
            score += 10.0
            findings.append("Large round-figure transaction typical of rushed scam extraction")

        flagged = score >= 35.0
        return AgentSignal(
            agent_name="TransactionVelocityAgent",
            risk_score=min(score, 100.0),
            flagged=flagged,
            findings=findings if findings else ["Transaction pattern within normal limits"],
            confidence=0.88,
            metadata={"baseline_amount": baseline_avg}
        )

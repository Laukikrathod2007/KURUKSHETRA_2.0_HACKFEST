from ..models.schemas import (
    PaymentRequest, RiskDossier, RiskLevel, ActionDecision
)
from .txn_agent import TransactionAgent
from .recipient_agent import RecipientAgent
from .intent_agent import IntentAgent

class GuardianOrchestrator:
    @staticmethod
    def evaluate(payment: PaymentRequest) -> RiskDossier:
        # Run parallel agent evaluations
        txn_sig = TransactionAgent.analyze(payment)
        rec_sig = RecipientAgent.analyze(payment)
        intent_sig = IntentAgent.analyze(payment)

        # Weighted composite risk scoring: Intent (45%), Recipient (35%), Txn (20%)
        composite_score = (
            (intent_sig.risk_score * 0.45) +
            (rec_sig.risk_score * 0.35) +
            (txn_sig.risk_score * 0.20)
        )
        composite_score = round(min(max(composite_score, 0.0), 100.0), 1)

        # Map to Risk Level and Recommended Action
        detected_scams = []
        if intent_sig.metadata.get("coercion_terms"):
            detected_scams.append("Authoritative Impersonation / Urgent Demand")
        if "urgent" in (payment.payment_note or "").lower():
            detected_scams.append("Urgency Social Engineering")
        if rec_sig.risk_score >= 40:
            detected_scams.append("Unverified Synthetic Counterparty")
        if not detected_scams and composite_score > 40:
            detected_scams.append("Behavioral Outlier Transfer")

        if composite_score >= 80.0:
            risk_level = RiskLevel.CRITICAL
            action = ActionDecision.PAUSE # Triggers Aria modal + Emergency Vapi Call
        elif composite_score >= 60.0:
            risk_level = RiskLevel.HIGH
            action = ActionDecision.PAUSE # Triggers Aria modal
        elif composite_score >= 35.0:
            risk_level = RiskLevel.MEDIUM
            action = ActionDecision.VERIFY # Show confirmation badge + optional Aria consult
        else:
            risk_level = RiskLevel.LOW
            action = ActionDecision.ALLOW

        # Human-explainable narrative builder
        all_findings = txn_sig.findings + rec_sig.findings + intent_sig.findings
        summary = (
            f"Transfer of {payment.currency} {payment.amount:,.2f} to {payment.recipient_name} flagged with {risk_level} "
            f"risk ({composite_score}/100). Key triggers: {'; '.join(all_findings[:3])}."
        )

        return RiskDossier(
            transaction_id=payment.transaction_id,
            user_id=payment.user_id,
            user_name=payment.user_name or "Valued Customer",
            user_phone=payment.user_phone,
            user_profile=payment.user_profile,
            amount=payment.amount,
            currency=payment.currency,
            recipient_id=payment.recipient_id,
            recipient_name=payment.recipient_name,
            payment_note=payment.payment_note or "",
            composite_risk_score=composite_score,
            risk_level=risk_level,
            recommended_action=action,
            detected_scam_types=detected_scams,
            anomaly_summary=summary,
            txn_signals=txn_sig,
            recipient_signals=rec_sig,
            intent_signals=intent_sig
        )

# Explanation & Evidence Framework

## 1. Executive Summary & Tripartite Transparency Model

A pervasive failure in existing AI-driven fraud systems is treating "explainability" as a monolithic concept—such as generating a list of raw SHAP values or a generic AI disclaimer. In financial risk systems, different stakeholders operate under radically different legal constraints, cognitive bandwidths, and operational objectives.

The *Agentic Guardian* establishes a **Tripartite Explanation Model** that decouples decision transparency into three distinct, specialized representations:

```text
                           THE TRIPARTITE TRANSPARENCY MODEL
                           
   [In-Line Risk Evaluation Engine] ──► Generates Atomic Decision Envelope (JSON)
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 [User Layer]  [Analyst Layer] [Audit Layer]
 Consumer      SOC Investigator Regulatory
 Causal Notice Case Synthesis   Immutable Ledger
 (Actionable   (Deep Causal     (WORM Cryptographic
  Plain Eng)    Investigation)   Chain for Law/CFPB)
```

---

## 2. Layer 1: Consumer-Facing Causal Transparency

### 2.1 Design Objectives & Legal Boundaries
- **Audience**: Stressed or coerced retail payment users.
- **Tone & Cognitive Level**: 6th-grade reading level; calm, objective, empowering; zero accusatory or alarmist phrasing (`REQ-SAF-003`).
- **Statutory Constraint (AML Tipping-Off Safe Harbor)**:
  - The explanation **MUST NOT** mention that a Suspicious Activity Report (SAR) has been filed, that law enforcement is monitoring the recipient, or that a confidential intelligence flag exists (`REQ-EXP-002`, POCA §333A, PMLA).
  - The explanation **MUST** articulate observable, behavioral, or public account facts.

### 2.2 Standardized Consumer Explanation Dictionary

| Detection Scenario | Permitted Consumer Phrasing | Strictly Prohibited Phrasing |
| :--- | :--- | :--- |
| **New Payee + Active Call** | *"You are transferring money to a newly registered account while on an active phone call. Impersonators often keep victims on the phone."* | *"Beneficiary is flagged by police as a scam mule."* (Violates AML Tipping-Off) |
| **Unusual Large Amount** | *"This transfer is significantly larger than your normal payments. Please take a moment to verify the destination."* | *"Our AI detected an abnormal anomaly score of 0.89."* (Incomprehensible) |
| **Rapid Outflow / Smurfing** | *"Multiple consecutive transfers have been made from your account in the last 2 hours."* | *"Account flagged for smurfing and money laundering."* (Legal liability) |

---

## 3. Layer 2: SOC Analyst Case Synthesis Package

### 3.1 Design Objectives & Cognitive Load Reduction
- **Audience**: Tier-1 and Tier-2 Bank Fraud Operations Investigators.
- **Operational Objective**: Reduce case review time from 15 minutes to under 3 minutes (`REQ-STK-005`, `REQ-EXP-003`).

### 3.2 Contents of the Synthesis Package
The workbench auto-generates a structured, one-page case file containing:
1. **Executive Summary Narrative**: A 3-sentence plain-English distillation:
   > *"Sender [User A] initiated a ₹1,50,000 transfer to new payee [VPA B] while participating in a 42-minute phone call. Recipient account was created 4 hours ago and has received 12 incoming transfers totaling ₹8,20,000 with immediate ATM withdrawals. High probability Digital Arrest impersonation scam."*
2. **Top Contributing Feature Vectors (SHAP / Causal Attribution)**:
   - Recipient Account Age: $<24\text{ hours}$ (+0.38 risk weight).
   - Concurrent Call Active: `true` (+0.29 risk weight).
   - Amount vs 90-Day Max: $4.2\times$ (+0.18 risk weight).
   - Typing Hesitation Anomaly: $+2.4\sigma$ (+0.09 risk weight).
3. **Epistemic Confidence Interval**: $\text{Confidence} = 94.2\%$ ($\sigma = 0.08$); model has robust data coverage across all critical features.
4. **Interactive Graph Visualizer**: 2-hop graph showing sender $\rightarrow$ recipient $\rightarrow$ downstream mule liquidity off-ramps.

---

## 4. Layer 3: Regulatory & Forensic Audit Record

### 4.1 Design Objectives & Non-Repudiation
- **Audience**: Regulatory bank examiners (Federal Reserve, OCC, RBI, FCA), internal model risk validators (SR 11-7), and judicial evidence standards.
- **Storage Policy**: Written to Write-Once-Read-Many (WORM) storage with cryptographic SHA-256 block-chaining (`REQ-OBS-001`, `REQ-SAF-006`, `REQ-NFR-008`).

### 4.2 Schema of the Atomic Audit Record
Each transaction generates a canonical, cryptographically sealed record:
```json
{
  "audit_version": "1.0",
  "decision_uuid": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "transaction_id": "TX-2026-09-11-987654321",
  "timestamp_utc": "2026-09-11T13:45:12.458Z",
  "sender_account_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "recipient_account_hash": "ca978112ca1bbdcafac231b39a23dc4da78608144160926129a81b307e9d43e8",
  "amount": 150000.00,
  "currency": "INR",
  "payment_channel": "UPI",
  "inputs_digest": "3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b",
  "telemetry_summary": {
    "drafting_dwell_ms": 48200,
    "hesitation_events": 4,
    "clipboard_pasted": true,
    "phone_call_active": true,
    "screen_share_active": false
  },
  "model_metadata": {
    "model_id": "guardian-ensemble-prod",
    "model_version": "2.4.1",
    "weights_digest": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
  },
  "decision_output": {
    "continuous_risk_score": 0.814,
    "epistemic_uncertainty": 0.082,
    "classified_typology": "DIGITAL_ARREST",
    "assigned_directive": "INTERVENE",
    "execution_duration_ms": 38.4
  },
  "user_interaction_record": {
    "dialog_presented": true,
    "dialog_dwell_ms": 14200,
    "challenge_completed": true,
    "stated_purpose_selected": "FAMILY_SUPPORT",
    "user_confirmed_proceed": true
  },
  "post_settlement_actions": {
    "mule_containment_dispatched": true,
    "containment_dispatch_ms": 42100,
    "iso20022_message_id": "CAMT056-20260911-0001"
  },
  "cryptographic_signatures": {
    "gateway_signature": "MEUCIQDx...[Ed25519 Signature]...",
    "previous_block_hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
  }
}
```
This atomic envelope guarantees that years after a disputed transaction, the bank can deterministically prove exactly what data was evaluated, what the model scored, what was displayed to the consumer, and how the user interacted.

# Auditability and Forensics: Immutable Decision Traces, Reason Codes, and Evidentiary Integrity

---

## 1. Executive Understanding
In high-stakes financial systems, **an automated decision that cannot be forensically reconstructed and legally defended is an unacceptable corporate and operational risk**. If a banking risk engine blocks a legitimate ₹1,00,000 transfer for an emergency medical surgery, or allows an extortionist to drain a pensioner's savings, the institution will face regulatory scrutiny from the **Banking Ombudsman, consumer protection courts, and law enforcement agencies**.

Auditability requires that for every evaluated payment, the system creates an **immutable, cryptographically anchored Decision Record** capturing the complete causal lineage: exact telemetry inputs, model and prompt version hashes, intermediate tool executions, feature attribution reason codes, and user interaction outcomes.

---

## 2. The Mandatory Forensic Audit Record Schema

Every evaluation executed by the Guardian must emit a standardized JSON record to an append-only forensic event log:

```json
{
  "audit_version": "2.1",
  "record_id": "aud_9f83a2e1-4b12-4891-b12e-8c347910fa22",
  "timestamp_utc": "2026-09-11T13:45:12.304912Z",
  "transaction_identifiers": {
    "upi_rrn": "625419082341",
    "remitter_vpa_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "beneficiary_vpa": "customs.dept.support@okhdfcbank",
    "amount_inr": 48500.00
  },
  "input_telemetry_snapshot": {
    "stated_purpose_note": "Confiscation parcel clearance penalty",
    "resolved_cbs_legal_name": "Raju Paswan",
    "is_first_time_beneficiary": true,
    "active_telephony_call": true,
    "screen_dwell_seconds": 16.4,
    "device_integrity_status": "PLAY_INTEGRITY_HARDWARE_ATTESTED"
  },
  "evaluation_engine_lineage": {
    "rule_engine_version": "v1.14.2",
    "gbdt_model_hash": "sha256:7c9e5b6a38210f...",
    "agent_system_prompt_hash": "sha256:d41d8cd98f00...",
    "inference_duration_ms": 28.4
  },
  "evidentiary_verdict": {
    "final_risk_score": 0.892,
    "deterministic_rule_triggers": [],
    "top_contributing_reason_codes": [
      {"code": "RECIPIENT_ENTITY_CLASH", "weight": 0.42},
      {"code": "ACTIVE_CALL_HIGH_VALUE", "weight": 0.31},
      {"code": "FIRST_TIME_PAYEE_SPIKE", "weight": 0.18}
    ],
    "selected_friction_tier": "TIER_2_COGNITIVE_CHALLENGE"
  },
  "user_interaction_outcome": {
    "intervention_presented": "LEGAL_NAME_VERIFICATION_CHALLENGE",
    "user_action": "USER_ABORTED_TRANSACTION",
    "dwell_on_intervention_seconds": 22.1,
    "final_payment_status": "CANCELLED_BY_REMITTER"
  },
  "cryptographic_attestation": {
    "record_hmac": "9b1b6e4b85c88b2c45e8a609d936e76... (Signed by Server Private Key)"
  }
}
```

---

## 3. Cryptographic Immutability and WORM Storage

To ensure audit logs are admissible as evidence under the **Bharatiya Sakshya Adhiniyam (BSA) 2023** (replacing Section 65B of the Indian Evidence Act):
1. **Write-Once-Read-Many (WORM) Storage:** Logs are streamed from Kafka directly into an immutable S3 bucket with Object Lock enabled in Compliance Mode (preventing modification or deletion even by root administrators for 7 years).
2. **Merkle Tree Anchoring:** Every hour, all generated decision hashes are combined into a cryptographic Merkle Tree. The hourly Merkle Root is digitally signed with an HSM-backed certificate and timestamped via an external RFC 3161 Timestamping Authority (TSA).

```
                      TAMPER-EVIDENT AUDIT ANCHORING
  [Decision Record 1] ──► Hash 1 ──┐
                                   ├─► Node A ──┐
  [Decision Record 2] ──► Hash 2 ──┘            │
                                                ├─► [MERKLE ROOT HASH]
  [Decision Record 3] ──► Hash 3 ──┐            │   • Signed via HSM
                                   ├─► Node B ──┘   • Anchored to WORM Log
  [Decision Record 4] ──► Hash 4 ──┘
```

---

## 4. Operational Usability: The Fraud Operations Copilot

An audit trail is useless if it cannot be parsed rapidly by human investigators:
- In production, when a victim contacts the bank or files a 1930 report, the bank's fraud analyst enters the UPI RRN.
- The forensic portal immediately renders a **Visual Causal Reconstruction**:
  - Highlights the exact legal name discrepancy.
  - Displays the timeline of user interaction (e.g., user lingered for 16 seconds while on a phone call).
  - Shows the exact cognitive challenge rendered and whether the user ignored or acknowledged it.
- Automatically compiles a standardized **First Information Report (FIR) evidentiary dossier** ready for transmission to law enforcement within 60 seconds.

---

## 5. Epistemic Assessment for PS09

| Dimension | Auditability Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Legal Admissibility** | **Electronic records require strict cryptographic custody.** | Enforce **HMAC attestation and WORM logging** on all decision outputs. |
| **Reason Attribution** | **Black-box scores without reason codes are indefensible.** | Every model output must produce **standardized reason codes** (e.g., TreeSHAP weights or deterministic flags). |
| **Operational Impact** | **Reduces fraud ops resolution time from hours to seconds.** | The architecture must generate **structured, machine-readable forensic logs** for every transaction. |

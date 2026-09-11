# Audit Model: Forensic Logging Schema, Cryptographic Immutability, and Legal Admissibility

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Transaction audit history.*
- *• What a strong solution demonstrates: safe autonomous decision-making, explainability.*

In financial cybersecurity, **an automated intervention that cannot be forensically reconstructed and legally defended in a court of law is a severe regulatory liability**. If a system intervenes to block or pause a transaction, the institution must be able to prove *exactly why* the action was taken, *which model* evaluated it, *what evidence* was observed, and *what the user did*.

The Audit Model specifies the **immutable forensic record schema, cryptographic Merkle tree anchoring, and legal admissibility protocols** under Indian law.

---

## 2. The Complete Forensic Decision Dossier Schema

Every transaction evaluated by GuardianPay emits a standardized JSON document:

```json
{
  "$schema": "https://guardianpay.internal/schemas/v1/audit_dossier.json",
  "audit_record_id": "aud_018f4a21-9b12-7011-8201-9f201b459812",
  "timestamp_utc": "2026-09-11T13:46:12.402194Z",
  "transaction_metadata": {
    "tx_id": "tx_018f4a21-9921-7210-9110-384102910481",
    "remitter_user_token": "hmac_sha256:7f81a2...",
    "beneficiary_vpa": "customs.clearance@okhdfcbank",
    "amount_inr": 48500.00,
    "ingress_channel": "CLIPBOARD_PASTE",
    "stated_payment_note": "CBI clearance bond parcel release"
  },
  "client_telemetry_digest": {
    "is_cellular_call_active": true,
    "clipboard_paste_latency_ms": 112,
    "screen_dwell_time_ms": 18450,
    "play_integrity_attestation": "HARDWARE_BACKED_EVAL_PASS",
    "installed_malware_detected": []
  },
  "evaluation_lineage": {
    "hot_path_model_hash": "sha256:4c81a29f8e12...",
    "semantic_slm_hash": "sha256:d19e0b812f34...",
    "agent_prompt_template_hash": "sha256:912ef01a8b44...",
    "rule_engine_version": "v2.4.1"
  },
  "risk_assessment_result": {
    "hot_gbdt_score": 0.88,
    "semantic_clash_score": 0.98,
    "agent_posterior_scam_weight": 0.94,
    "fused_risk_score": 0.938,
    "risk_category": "CRITICAL",
    "treeshap_reason_codes": [
      {"code": "RECIPIENT_ENTITY_CLASH", "attribution_weight": 0.45},
      {"code": "ACTIVE_CALL_HIGH_VALUE", "attribution_weight": 0.35},
      {"code": "FIRST_TIME_PAYEE_SPIKE", "attribution_weight": 0.18}
    ]
  },
  "recipient_verification_ground_truth": {
    "resolved_cbs_legal_name": "Raju Paswan",
    "mcc_code": "0000",
    "account_category": "INDIVIDUAL_P2P",
    "i4c_blacklist_hit": false
  },
  "intervention_execution": {
    "selected_friction_tier": "TIER_3_CALL_INTERLOCK",
    "challenge_rendered": "CALL_TERMINATION_REQUIRED",
    "user_interaction_outcome": "CALL_DISCONNECTED_THEN_ABORTED",
    "dwell_on_challenge_ms": 24100,
    "final_transaction_status": "CANCELLED_BY_REMITTER"
  },
  "cryptographic_attestation": {
    "gateway_ecdsa_signature": "MEQCIG9f... (Signed by Edge HSM)",
    "merkle_leaf_hash": "sha256:a81b29...",
    "s3_worm_uri": "s3://guardianpay-audit-vault-mumbai/2026/09/11/aud_018f4a21.json"
  }
}
```

---

## 3. Cryptographic Immutability and Merkle Anchoring

To prevent retroactive tampering by rogue administrators or compromised internal systems:
1. **Append-Only WORM Storage:** Audit records are streamed directly from Apache Kafka into an AWS S3 bucket with **Object Lock enabled in Compliance Mode**. Records cannot be altered, overwritten, or deleted by any user (including root) for 7 years.
2. **Hourly Merkle Tree Root Commit:** 
   - Every hour, all generated decision hashes are combined into a binary Merkle tree:
     $$\text{Root} = \text{MerkleTree}(\text{Hash}_1, \text{Hash}_2, \dots, \text{Hash}_N)$$
   - The root hash is timestamped via an RFC 3161 Timestamping Authority and published to an immutable public transparency ledger.

```
                      IMMUTABLE MERKLE TREE AUDIT ANCHORING
  [Audit Record 1] ──► H1 ──┐
                            ├─► H12 ──┐
  [Audit Record 2] ──► H2 ──┘         │
                                      ├─► [HOURLY MERKLE ROOT]
  [Audit Record 3] ──► H3 ──┐         │   • Signed by HSM Private Key
                            ├─► H34 ──┘   • Committed to WORM Storage
  [Audit Record 4] ──► H4 ──┘
```

---

## 4. Legal Admissibility under Bharatiya Sakshya Adhiniyam (BSA) 2023

Under **Section 63 of the Bharatiya Sakshya Adhiniyam 2023** (replacing Section 65B of the Indian Evidence Act):
- Electronic records are admissible as primary evidence in cybercrime trials provided their cryptographic integrity, operational custody, and machine creation conditions are certified.
- **Automated Certificate Generation:** GuardianPay includes an administrative utility that exports any transaction audit dossier as an officially formatted **BSA Section 63 Electronic Evidence Certificate**, signed with the bank's digital corporate seal for immediate submission to the police and 1930 portal.

---

## 5. Epistemic Assessment for PS09

The Audit Model directly delivers on **Core Requirement 9 (`PROBLEM_STATEMENT.md`)**. It converts real-time operational telemetry into an **immutable, cryptographically verifiable forensic trail** that protects consumers, supports law enforcement, and insulates financial institutions from regulatory liability.

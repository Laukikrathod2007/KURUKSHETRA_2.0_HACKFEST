# Data Model: Conceptual Entities, Relational Schemas, and Entity-Relationship Diagram

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Transaction-risk analysis.*
- *• Recipient verification workflow.*
- *• Risk score/category.*
- *• Explainable security alerts.*
- *• Transaction audit history.*

The Data Model formalizes the structural representation of all information assets in GuardianPay. It defines the schemas, lifecycle states, constraints, and relationships connecting **Users, Accounts, Transactions, Recipients, Sensor Telemetry, Agentic Investigations, Interventions, and Audit Records**.

---

## 2. Entity-Relationship Diagram (ERD)

```
  ┌───────────────┐               ┌─────────────────┐
  │     USER      │1             *│  LINKED_DEVICE  │
  │ • user_id     ├───────────────┤ • device_hash   │
  │ • phone_hash  │               │ • play_integrity│
  └───────┬───────┘               └─────────────────┘
          │1
          │
          │*
  ┌───────┴───────┐1             *┌─────────────────┐
  │    ACCOUNT    ├───────────────┤   TRANSACTION   │
  │ • account_id  │               │ • tx_id         │
  │ • ifsc_code   │               │ • amount        │
  │ • primary_vpa │               │ • stated_note   │
  └───────────────┘               │ • ingress_type  │
                                  └────────┬────────┘
                                           │1
                 ┌─────────────────────────┼─────────────────────────┐
                 │1                        │1                        │1
                 ▼                         ▼                         ▼
  ┌────────────────────────┐┌────────────────────────┐┌────────────────────────┐
  │   RECIPIENT_ENTITY     ││    RISK_ASSESSMENT     ││   AGENT_INVESTIGATION  │
  │ • recipient_vpa        ││ • eval_id              ││ • investigation_id     │
  │ • resolved_legal_name  ││ • gbdt_score           ││ • hypothesis_tested    │
  │ • mcc_code             ││ • clash_score          ││ • tools_invoked        │
  │ • category (P2P/P2M)   ││ • fused_risk_score     ││ • reconciliation_text  │
  └────────────────────────┘│ • top_reason_codes     │└────────────────────────┘
                            │ • selected_tier        │
                            └──────────┬─────────────┘
                                       │1
                                       │
                                       ▼1
                            ┌────────────────────────┐1               1┌──────────────────────┐
                            │      INTERVENTION      ├─────────────────┤     AUDIT_EVENT      │
                            │ • intervention_id      │                 │ • audit_record_id    │
                            │ • challenge_type       │                 │ • merkel_root_hash   │
                            │ • user_response        │                 │ • hmac_signature     │
                            │ • dwell_time_ms        │                 │ • s3_worm_uri        │
                            └────────────────────────┘                 └──────────────────────┘
```

---

## 3. Detailed Entity Schemas

### Entity 1: `Transaction`
- **Purpose:** Represents the payment event initiated by the user.
- **Attributes:**
  - `tx_id` (UUIDv7, Primary Key): Time-ordered unique transaction identifier.
  - `user_id` (String): Pseudonymous hash of remitter account.
  - `recipient_vpa` (String): Target Virtual Payment Address (e.g., `customs.dept@okhdfcbank`).
  - `amount` (Decimal 12, 2): Transaction magnitude in INR.
  - `stated_note` (String, Optional): Free-form payment note (`tn` parameter).
  - `ingress_channel` (Enum): `QR_CAMERA`, `DEEP_LINK`, `CLIPBOARD_PASTE`, `MANUAL_ENTRY`.
  - `clipboard_paste_latency_ms` (Integer): Time from input focus to paste.
  - `is_cellular_call_active` (Boolean): Telephony state at initiation.
  - `screen_dwell_time_ms` (Integer): Pre-PIN screen dwell time.
  - `created_at_utc` (Timestamp): Initiation timestamp with microsecond resolution.

---

### Entity 2: `RecipientEntity`
- **Purpose:** Fulfills *Recipient verification workflow* requirement; captures CBS ground truth.
- **Attributes:**
  - `recipient_vpa` (String, Primary Key): Virtual Payment Address.
  - `resolved_legal_name` (String): Verified Core Banking KYC legal name from `RespValAdd`.
  - `mcc_code` (String): 4-digit Merchant Category Code (e.g. `0000` = P2P, `4900` = Utilities).
  - `account_category` (Enum): `INDIVIDUAL_P2P`, `VERIFIED_MERCHANT_P2M`, `GOVERNMENT_ENTITY`.
  - `is_i4c_blacklisted` (Boolean): True if flagged on National Cybercrime Reporting Portal.
  - `first_seen_timestamp_utc` (Timestamp): Earliest recording of VPA in the network.
  - `inward_velocity_1h` (Integer): Count of unique incoming transfers in rolling 1 hour.

---

### Entity 3: `RiskAssessment`
- **Purpose:** Fulfills *Transaction-risk analysis* and *Risk score/category* requirements.
- **Attributes:**
  - `eval_id` (UUIDv7, Primary Key): Unique risk evaluation identifier.
  - `tx_id` (UUIDv7, Foreign Key): Associated transaction.
  - `gbdt_risk_score` (Float, $0.00 - 1.00$): Calibrated tabular risk probability.
  - `semantic_clash_score` (Float, $0.00 - 1.00$): Purpose vs. Payee discrepancy score.
  - `agent_confidence_score` (Float, $0.00 - 1.00$): Warm-path agentic posterior.
  - `fused_risk_score` (Float, $0.00 - 1.00$): Multi-signal weighted risk score.
  - `risk_category` (Enum): `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  - `reason_codes` (JSON Array): Top 3 TreeSHAP feature codes with attribution weights.
  - `selected_friction_tier` (Enum): `TIER_0_PASS`, `TIER_1_ADVISORY`, `TIER_2_CHALLENGE`, `TIER_3_CALL_INTERLOCK`, `TIER_5_BLOCK`.

---

### Entity 4: `AgentInvestigation`
- **Purpose:** Fulfills *Safe autonomous decision-making* and *Rule-based/LLM reasoning* requirements.
- **Attributes:**
  - `investigation_id` (UUIDv7, Primary Key): Unique agent investigation trace ID.
  - `eval_id` (UUIDv7, Foreign Key): Associated evaluation.
  - `hypothesis_scam_weight` (Float): Posterior belief in Hypothesis A (Scam).
  - `hypothesis_legit_weight` (Float): Posterior belief in Hypothesis B (Emergency).
  - `tools_invoked` (JSON Array): List of diagnostic tools queried with latency and outputs.
  - `reconciliation_text` (String): Structured textual explanation of evidence synthesis.
  - `execution_latency_ms` (Integer): Total time spent in agentic loop.

---

### Entity 5: `Intervention`
- **Purpose:** Fulfills *User confirmation step* and *Pause/block mechanism* requirements.
- **Attributes:**
  - `intervention_id` (UUIDv7, Primary Key): Intervention instance.
  - `tx_id` (UUIDv7, Foreign Key): Associated transaction.
  - `challenge_type` (Enum): `LEGAL_NAME_TYPING`, `CALL_TERMINATION`, `COOLING_OFF_HOLD`, `MALWARE_BLOCK`.
  - `ui_explanation_rendered` (String): Exact explainable text shown to user.
  - `user_action` (Enum): `CONFIRMED_NAME_MATCH`, `ABORTED_PAYMENT`, `CALL_DISCONNECTED`, `OVERRIDDEN`.
  - `user_dwell_on_challenge_ms` (Integer): Time user spent deliberating on challenge.
  - `final_outcome` (Enum): `PROCEEDED_TO_PIN`, `PAYMENT_ABORTED_BY_USER`, `TERMINATED_BY_SYSTEM`.

---

### Entity 6: `AuditEvent`
- **Purpose:** Fulfills *Transaction audit history* requirement; immutable forensic dossier.
- **Attributes:**
  - `audit_record_id` (UUIDv7, Primary Key): Globally unique audit identifier.
  - `tx_id` (UUIDv7, Unique): Associated transaction.
  - `complete_dossier_json` (JSONB): Full serialized causal snapshot of all upstream entities.
  - `hmac_signature` (String): Server ECDSA / HMAC digital signature.
  - `merkle_root_hash` (String): Hourly Merkle root commit hash.
  - `s3_worm_uri` (String): Immutable S3 Object Lock compliance storage pointer.

---

## 4. Epistemic Assessment for PS09

The Data Model provides a **tightly coupled, normalized, and auditable data foundation** that directly reflects every functional requirement of `PROBLEM_STATEMENT.md`. Zero fields are arbitrary; every attribute serves an explicit analytical or regulatory purpose.

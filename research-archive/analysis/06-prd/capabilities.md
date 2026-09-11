# Minimum Product Capabilities

## 1. Executive Summary & Derivation Methodology

Product capabilities define **what the software system is capable of executing**. In strict alignment with the bare-minimum PRD principle, every capability specified in this document is derived directly from validated **MUST** requirements established in Phase 5. Capabilities that do not trace to a validated MUST requirement have been excluded from the core MVP.

Ten core product capabilities form the complete functional engine of the Agentic Guardian MVP.

---

## 2. Core MVP Capability Inventory

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CORE MVP CAPABILITIES MATRIX                                   │
├────────┬──────────────────────────────────────────┬─────────────────────────────┬────────────────┤
│ Cap ID │ Capability Name                          │ Primary Requirement         │ Validated Gap  │
├────────┼──────────────────────────────────────────┼─────────────────────────────┼────────────────┤
│ CAP-01 │ Ephemeral Pre-Flight Telemetry Intake    │ REQ-FUNC-001, REQ-CTX-002   │ VG-02, VG-05   │
│ CAP-02 │ Communication State Attestation          │ REQ-FUNC-003, REQ-CTX-004   │ VG-05          │
│ CAP-03 │ Sub-45ms Real-Time Risk Classification   │ REQ-TIME-001, REQ-FUNC-007  │ VG-02, VG-07   │
│ CAP-04 │ Epistemic Uncertainty Quantification     │ REQ-DEC-002, REQ-SAF-002    │ VG-07, VG-08   │
│ CAP-05 │ Social Engineering Typology Profiling    │ REQ-FUNC-004, REQ-DEC-003   │ VG-04          │
│ CAP-06 │ Dynamic De-Biasing Dialog Orchestration  │ REQ-FUNC-009, REQ-INT-002   │ VG-01, VG-04   │
│ CAP-07 │ Temporal Cooling-Off Hold Management     │ REQ-INT-005, REQ-ERR-001    │ VG-04, VG-07   │
│ CAP-08 │ Emergency Life-Safety Payment Bypass     │ REQ-SAF-001, REQ-ERR-002    │ VG-07          │
│ CAP-09 │ Out-of-Band Mule Containment Dispatch    │ REQ-FUNC-010, REQ-TIME-003  │ VG-03, VG-06   │
│ CAP-10 │ Immutable Decision & Override Auditing   │ REQ-OBS-001, REQ-SAF-006    │ VG-08, VG-10   │
└────────┴──────────────────────────────────────────┴─────────────────────────────┴────────────────┘
```

---

## 3. Detailed Capability Specifications

### 3.1 CAP-01: Ephemeral Pre-Flight Telemetry Intake
- **Capability ID**: `CAP-01`
- **Name**: Ephemeral Pre-Flight Telemetry Intake
- **Description**: Lightweight mobile client collector passively monitoring user typing cadence, touch hesitation intervals, field focus duration, and clipboard paste occurrences during payment drafting.
- **Purpose**: Exploits the 30-120 second drafting window to collect behavioral signals before transaction submission, overcoming in-line switch latency ceilings.
- **Requirement(s) Satisfied**: `REQ-FUNC-001`, `REQ-CTX-002`, `REQ-NFR-002`.
- **Gap(s) Addressed**: `VG-02` (Latency vs. AI), `VG-05` (Communicative Vacuums).
- **Actor(s)**: Payment Sender (Consumer).
- **Inputs**: Raw touch timestamps, UI focus events, clipboard paste notifications.
- **Outputs**: Serialized behavioral feature vector cached in client RAM.
- **Dependencies**: Host mobile banking app thread container.
- **Priority**: **MUST**.

---

### 3.2 CAP-02: Communication State Attestation
- **Capability ID**: `CAP-02`
- **Name**: Communication State Attestation
- **Description**: On-device binary environment scanner that evaluates whether a cellular/VoIP voice call is currently active or a remote desktop screen-sharing session is broadcasting during payment entry.
- **Purpose**: Identifies active remote coercers, remote access trojans (RATs), and scammer phone calls.
- **Requirement(s) Satisfied**: `REQ-FUNC-003`, `REQ-CTX-004`, `REQ-SEC-002`.
- **Gap(s) Addressed**: `VG-05` (Communicative Context Vacuums).
- **Actor(s)**: Payment Sender, Host OS.
- **Inputs**: OS telephony manager state flag (`CALL_STATE_OFFHOOK`), media projection manager display flags.
- **Outputs**: Boolean flags: `is_voice_call_active`, `is_screen_shared`.
- **Dependencies**: Mobile OS permission sandbox.
- **Priority**: **MUST**.

---

### 3.3 CAP-03: Sub-45ms Real-Time Risk Classification
- **Capability ID**: `CAP-03`
- **Name**: Sub-45ms Real-Time Risk Classification
- **Description**: High-throughput inference pipeline that assembles real-time telemetry, historical sender baselines, and recipient risk profiles into a calibrated risk score $R \in [0.0, 1.0]$.
- **Purpose**: Evaluates payment risk strictly within national payment switch clearance latency deadlines.
- **Requirement(s) Satisfied**: `REQ-TIME-001`, `REQ-FUNC-007`, `REQ-STK-002`, `REQ-NFR-001`.
- **Gap(s) Addressed**: `VG-02` (Real-Time Physics Ceiling), `VG-07` (Blunt Binary Intervention).
- **Actor(s)**: Bank Payment Switch Gateway.
- **Inputs**: Core transaction payload, pre-flight telemetry vector, cached historical baseline.
- **Outputs**: Calibrated continuous risk score, feature attribution vector, evaluation execution time.
- **Dependencies**: High-availability inference service, low-latency in-memory cache.
- **Priority**: **MUST**.

---

### 3.4 CAP-04: Epistemic Uncertainty Quantification
- **Capability ID**: `CAP-04`
- **Name**: Epistemic Uncertainty Quantification
- **Description**: Statistical confidence calculator evaluating whether a high risk score is driven by verified scam anomalies or merely by novel/sparse customer feature baselines.
- **Purpose**: Prevents high-friction blocks on benign users with sparse profiles, enforcing the $\le 10:1$ customer insult ceiling.
- **Requirement(s) Satisfied**: `REQ-DEC-002`, `REQ-SAF-002`, `REQ-ERR-001`.
- **Gap(s) Addressed**: `VG-07` (Customer Insult Cascades), `VG-08` (Explainability Gaps).
- **Actor(s)**: Bank Switch Gateway, Fraud SOC Ops.
- **Inputs**: Model leaf node distributions / ensemble variance across prediction estimators.
- **Outputs**: Uncertainty metric $\sigma \in [0.0, 1.0]$, confidence tier (`HIGH`, `MEDIUM`, `LOW`).
- **Dependencies**: Machine learning inference engine (`CAP-03`).
- **Priority**: **MUST**.

---

### 3.5 CAP-05: Social Engineering Typology Profiling
- **Capability ID**: `CAP-05`
- **Name**: Social Engineering Typology Profiling
- **Description**: Multi-class categorization component mapping transaction anomaly vectors into specific psychological manipulation archetypes (Digital Arrest, Romance Scam, Fake Investment, Job Scam).
- **Purpose**: Enables the system to select tailored de-biasing content rather than displaying ineffective generic warning modals.
- **Requirement(s) Satisfied**: `REQ-FUNC-004`, `REQ-DEC-003`, `REQ-INT-003`.
- **Gap(s) Addressed**: `VG-04` (Pre-Coaching Weaponization).
- **Actor(s)**: Payment Sender, Risk Engine.
- **Inputs**: Synthesized feature vector (recipient age, velocity, call state, typing cadence).
- **Outputs**: Typology label (`DIGITAL_ARREST`, `INVESTMENT`, `ROMANCE`, `BENIGN`).
- **Dependencies**: Risk classification pipeline (`CAP-03`).
- **Priority**: **MUST**.

---

### 3.6 CAP-06: Dynamic De-Biasing Dialog Orchestration
- **Capability ID**: `CAP-06`
- **Name**: Dynamic De-Biasing Dialog Orchestration
- **Description**: Client-side interactive dialog manager that renders randomized cognitive challenges, counter-coaching scripts, and plain-English risk explanations prior to PIN entry.
- **Purpose**: Disrupts victim System 1 tunnel vision and neutralizes scammer pre-coaching narratives.
- **Requirement(s) Satisfied**: `REQ-FUNC-009`, `REQ-INT-002`, `REQ-INT-003`, `REQ-EXP-001`.
- **Gap(s) Addressed**: `VG-01` (Intent Decoupling), `VG-04` (Pre-Coaching Failure).
- **Actor(s)**: Payment Sender (Victim).
- **Inputs**: Typology profile (`CAP-05`), causal factor attributions, localized language dictionary.
- **Outputs**: Interactive UI challenge requiring active cognitive acknowledgment.
- **Dependencies**: Host banking application UI rendering engine.
- **Priority**: **MUST**.

---

### 3.7 CAP-07: Temporal Cooling-Off Hold Management
- **Capability ID**: `CAP-07`
- **Name**: Temporal Cooling-Off Hold Management
- **Description**: State management component enforcing a configurable time-delay on high-value, extreme-risk first-time transfers, keeping funds sequestered in the sender's account.
- **Purpose**: Provides a mandatory emotional cooling-off window for victims to exit acute psychological panic.
- **Requirement(s) Satisfied**: `REQ-INT-005`, `REQ-ERR-001`, `REQ-DEC-005`.
- **Gap(s) Addressed**: `VG-04` (Coercive Persistence), `VG-07` (Proportional Intervention).
- **Actor(s)**: Payment Sender, Core Banking Engine.
- **Inputs**: Risk directive (`Level 4 Hold`), transaction amount, configured hold duration ($T_{\text{lock}}$).
- **Outputs**: Hold registration event, core banking ledger sequester directive.
- **Dependencies**: Core banking transactional hold interface.
- **Priority**: **MUST**.

---

### 3.8 CAP-08: Emergency Life-Safety Payment Bypass
- **Capability ID**: `CAP-08`
- **Name**: Emergency Life-Safety Payment Bypass
- **Description**: Dedicated fail-safe workflow allowing consumers to immediately bypass protective holds for verified emergency medical, legal, or utility expenses.
- **Purpose**: Prevents physical or life-safety harm caused by algorithmic payment blocking.
- **Requirement(s) Satisfied**: `REQ-SAF-001`, `REQ-ERR-002`, `REQ-SAF-004`.
- **Gap(s) Addressed**: `VG-07` (Harmful Erroneous Blockades).
- **Actor(s)**: Payment Sender.
- **Inputs**: User emergency declaration, verified hospital/utility merchant category code (MCC).
- **Outputs**: Immediate override of hold directive to Allow; post-debit monitoring escalation.
- **Dependencies**: Merchant category directory; client UI bypass trigger.
- **Priority**: **MUST**.

---

### 3.9 CAP-09: Out-of-Band Mule Containment Dispatch
- **Capability ID**: `CAP-09`
- **Name**: Out-of-Band Mule Containment Dispatch
- **Description**: Sub-60-second message dispatcher generating cryptographically signed ISO 20022 `camt.056` payment advisories transmitted to beneficiary institutions.
- **Purpose**: Halts rapid mule cash-out at ATMs or crypto exchanges before funds can be liquidated.
- **Requirement(s) Satisfied**: `REQ-FUNC-010`, `REQ-TIME-003`, `REQ-STK-003`, `REQ-SEC-006`.
- **Gap(s) Addressed**: `VG-03` (Bilateral Asymmetry), `VG-06` (Mule Cash-Out Velocity).
- **Actor(s)**: Recipient Bank Gateway.
- **Inputs**: Settlement confirmation event, evaluated recipient risk score, PKI signing key.
- **Outputs**: Signed ISO 20022 message payload dispatched over inter-bank network.
- **Dependencies**: National inter-bank clearing switch / messaging network.
- **Priority**: **MUST**.

---

### 3.10 CAP-10: Immutable Decision & Override Auditing
- **Capability ID**: `CAP-10`
- **Name**: Immutable Decision & Override Auditing
- **Description**: Cryptographically chained audit logging pipeline committing all transaction features, model scores, user UI interactions, and teller/analyst overrides to WORM storage.
- **Purpose**: Guarantees regulatory compliance (SR 11-7, ECOA), non-repudiation, and forensic post-incident reconstruction.
- **Requirement(s) Satisfied**: `REQ-OBS-001`, `REQ-OBS-003`, `REQ-SAF-006`, `REQ-NFR-008`.
- **Gap(s) Addressed**: `VG-08` (Audit Gaps), `VG-10` (Regulatory Verification).
- **Actor(s)**: Fraud SOC Ops, Regulatory Auditors.
- **Inputs**: Complete transaction decision record, human override credentials, timestamps.
- **Outputs**: SHA-256 chained audit record persisted to append-only WORM volume.
- **Dependencies**: Immutable storage cluster.
- **Priority**: **MUST**.

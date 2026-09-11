# Core Product Feature Specifications

## 1. Executive Summary & Derivation Chain

A feature is the **concrete software mechanism** through which a product capability is realized. In accordance with the bare-minimum PRD principle, every feature authored in this document emerges from an unbroken chain:

$$\text{Validated Gap} \longrightarrow \text{System Requirement} \longrightarrow \text{Product Capability} \longrightarrow \text{Concrete Feature}$$

Zero speculative or ungrounded features are permitted. If a feature does not satisfy a validated MUST requirement or directly defend against a validated failure mode, it is excluded from the MVP.

---

## 2. Core MVP Feature Matrix

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 CORE MVP FEATURE MATRIX                                                │
├────────┬──────────────────────────────────┬───────────────────────────┬────────┬───────────────────┬──────────┬────────┤
│ Feat ID│ Feature Name                     │ Requirement Satisfied     │ Gap ID │ Primary Actor     │ Priority │ MVP?   │
├────────┼──────────────────────────────────┼───────────────────────────┼────────┼───────────────────┼──────────┼────────┤
│ FEAT-01│ Pre-Flight Telemetry Hook SDK    │ REQ-FUNC-001, REQ-CTX-002 │ VG-02  │ Payment Sender    │ MUST     │ YES    │
│ FEAT-02│ Telephony & Screen Broadcast Flag│ REQ-FUNC-003, REQ-CTX-004 │ VG-05  │ Payment Sender/OS │ MUST     │ YES    │
│ FEAT-03│ In-Line Risk Inference Engine    │ REQ-TIME-001, REQ-FUNC-007│ VG-02  │ Switch Gateway    │ MUST     │ YES    │
│ FEAT-04│ Multi-Tier Policy Decision Router│ REQ-DEC-001, REQ-DEC-005  │ VG-07  │ Switch Gateway    │ MUST     │ YES    │
│ FEAT-05│ Typology-Specific De-Biasing UI  │ REQ-FUNC-009, REQ-INT-003 │ VG-04  │ Payment Sender    │ MUST     │ YES    │
│ FEAT-06│ Anti-Habituation Cognitive Gate  │ REQ-INT-002, REQ-FUNC-008 │ VG-04  │ Payment Sender    │ MUST     │ YES    │
│ FEAT-07│ Temporal Cooling-Off Time-Lock   │ REQ-INT-005, REQ-ERR-001  │ VG-07  │ Core Banking / Ptr│ MUST     │ YES    │
│ FEAT-08│ Life-Critical Payment Bypass Gate│ REQ-SAF-001, REQ-ERR-002  │ VG-07  │ Payment Sender    │ MUST     │ YES    │
│ FEAT-09│ Fast Fail-Open Circuit Breaker   │ REQ-RES-002, REQ-INT-007  │ VG-02  │ Switch Gateway    │ MUST     │ YES    │
│ FEAT-10│ ISO 20022 Mule Alert Dispatcher  │ REQ-FUNC-010, REQ-TIME-003│ VG-03  │ Recipient Bank    │ MUST     │ YES    │
│ FEAT-11│ SOC Case Synthesis Workbench     │ REQ-EXP-003, REQ-STK-005  │ VG-06  │ Fraud SOC Analyst │ SHOULD   │ YES    │
│ FEAT-12│ WORM Append-Only Decision Logger │ REQ-OBS-001, REQ-SAF-006  │ VG-08  │ Compliance Auditor│ MUST     │ YES    │
└────────┴──────────────────────────────────┴───────────────────────────┴────────┴───────────────────┴──────────┴────────┘
```

---

## 3. Detailed Specifications of MVP Features

### 3.1 FEAT-01: Pre-Flight Telemetry Hook SDK
- **Feature ID**: `FEAT-01`
- **Component**: Client Mobile SDK (Android AAR / iOS Framework).
- **Functionality**:
  - Automatically binds to payment input fields (Payee VPA, Account Number, Amount).
  - Measures inter-keystroke timing intervals, touch contact area, swipe velocity, and clipboard paste occurrences.
  - Maintains an ephemeral ring buffer in memory; discards raw coordinates $\le 100\text{ms}$ after transaction submission (`REQ-PRIV-002`).
- **Trigger**: User focuses on any transaction input field.
- **Output**: JSON/Protobuf telemetry payload attached to the payment initiation packet.
- **Fail-Safe**: If SDK encounters an unhandled exception, it silently terminates without crashing the host app (`REQ-RES-004`).

---

### 3.2 FEAT-02: Telephony & Screen Broadcast Sensor Hook
- **Feature ID**: `FEAT-02`
- **Component**: Client Mobile SDK.
- **Functionality**:
  - Interrogates native OS managers for active call status (`TelecomManager.getCallState()`) and active virtual displays (`MediaProjectionManager`).
  - Evaluates whether third-party remote control applications (e.g., AnyDesk, TeamViewer) are running in the foreground or holding active accessibility overlays.
- **Trigger**: Transaction "Proceed to Pay" button tap.
- **Output**: Binary status indicators: `is_phone_call_active: true/false`, `is_screen_shared: true/false`.
- **Privacy Boundary**: Zero audio recording, zero screen capture, zero network traffic inspection.

---

### 3.3 FEAT-03: Sub-45ms In-Line Risk Inference Engine
- **Feature ID**: `FEAT-03`
- **Component**: High-Performance Backend Decision Gateway.
- **Functionality**:
  - Exposes low-latency gRPC endpoint over mTLS 1.3.
  - Deserializes transaction request, fetches cached customer baseline profile in $\le 10\text{ms}$, and executes multi-class gradient-boosted decision trees.
  - Generates calibrated risk score $R \in [0.0, 1.0]$ and epistemic uncertainty $\sigma \in [0.0, 1.0]$.
- **Performance Guarantee**: P99 response time $\le 45\text{ms}$ under 15,000 TPS baseline load (`REQ-NFR-001`).

---

### 3.4 FEAT-04: Multi-Tier Policy Decision Router
- **Feature ID**: `FEAT-04`
- **Component**: Decoupled Business Rules Engine.
- **Functionality**:
  - Ingests model risk scores and routes them into deterministic operational directives based on configurable YAML/JSON policies (`REQ-ADP-005`):
    - $R < 0.30 \rightarrow$ `Directive: Allow`
    - $0.30 \le R < 0.65 \rightarrow$ `Directive: Inform`
    - $0.65 \le R < 0.85 \rightarrow$ `Directive: Intervene`
    - $R \ge 0.85 \rightarrow$ `Directive: Hold`
  - Restricts high-friction directives when epistemic confidence is low ($\sigma > 0.35$), preventing customer insult cascades (`REQ-DEC-002`).

---

### 3.5 FEAT-05: Typology-Specific De-Biasing Modal
- **Feature ID**: `FEAT-05`
- **Component**: Client UI Component (Dynamic React Native / Flutter / Native Module).
- **Functionality**:
  - Injected before PIN entry screen when `Directive: Intervene` is received.
  - Displays plain-language explanation tailored to the identified scam typology:
    - *Digital Arrest*: Explains that police, CBI, and RBI never demand video calls or funds transfers to "safe accounts".
    - *Fake Investment*: Highlights that the recipient is a retail personal account, not a SEBI/SEC registered broker.
  - Features anti-coaching warning: *"Is someone instructing you what to say right now? Hang up immediately."*

---

### 3.6 FEAT-06: Anti-Habituation Cognitive Gate
- **Feature ID**: `FEAT-06`
- **Component**: Client UI Component.
- **Functionality**:
  - Defeats automatic conditioned clicking by randomizing button positions ("Cancel Payment" vs. "Proceed Anyway").
  - Requires the user to answer an interactive cognitive confirmation (e.g., selecting the true stated purpose of the transfer from a randomized list).
  - Enforces a minimum 5-second unhurried reading dwell time before the confirmation button activates.

---

### 3.7 FEAT-07: Temporal Cooling-Off Time-Lock Manager
- **Feature ID**: `FEAT-07`
- **Component**: Backend State Service & Core Banking Connector.
- **Functionality**:
  - Triggered upon `Directive: Hold` for uncharacteristic first-time payments exceeding value thresholds.
  - Sequestering funds within the sender's account for a configurable cooling-off window (default: 4 hours, configurable via `VAL-01`).
  - Renders countdown timer and provides a prominent "Cancel & Recall Payment" button in the banking app.

---

### 3.8 FEAT-08: Life-Critical Payment Emergency Bypass Gate
- **Feature ID**: `FEAT-08`
- **Component**: Client UI & Policy Gateway.
- **Functionality**:
  - Provides a single-tap "Medical / Emergency Life-Safety Bypass" button on held transactions (`REQ-SAF-001`).
  - Prompts user to affirm emergency status under warning of fraud risk; instantly releases payment to the switch for clearance.
  - Automatically flags transaction for expedited post-settlement monitoring without holding funds.

---

### 3.9 FEAT-09: Fast Fail-Open Hardware/Software Circuit Breaker
- **Feature ID**: `FEAT-09`
- **Component**: Switch Gateway Interceptor.
- **Functionality**:
  - Monitors execution clock on in-line scoring calls.
  - If latency reaches $45\text{ms}$ without a decision, or if an unhandled network exception occurs, the breaker trips instantly.
  - Emits `Directive: Allow` with `ReasonCode: TIMEOUT_FAILOPEN` in $\le 5\text{ms}$ (`REQ-RES-002`).
  - Ensures national retail payment switch connections never time out or drop transactions.

---

### 3.10 FEAT-10: ISO 20022 Mule Containment Message Dispatcher
- **Feature ID**: `FEAT-10`
- **Component**: Asynchronous Event Consumer & Inter-Bank Dispatcher.
- **Functionality**:
  - Subscribes to debit settlement events for transactions flagged with high risk ($R \ge 0.70$).
  - Assembles ISO 20022 `camt.056` Payment Cancellation Request / Provisional Hold Advisory.
  - Digitally signs payload with the bank's PKI certificate and transmits it to the beneficiary bank gateway within $\le 60\text{s}$ of settlement (`REQ-FUNC-010`).

---

### 3.11 FEAT-11: SOC Analyst Case Synthesis Workbench
- **Feature ID**: `FEAT-11`
- **Component**: Web-Based Operational Dashboard (React / TypeScript).
- **Functionality**:
  - Displays prioritized alert queues for transactions under Hold or subject to user challenge.
  - Generates synthesized 3-paragraph plain-English summary of the fraud hypothesis, timeline graph, and contributing risk factors (`REQ-EXP-003`).
  - Enforces dual-control multi-signature workflows for releasing held funds (`REQ-HITL-003`).

---

### 3.12 FEAT-12: WORM Append-Only Decision Logger
- **Feature ID**: `FEAT-12`
- **Component**: Secure Audit Storage Pipeline.
- **Functionality**:
  - Receives asynchronous fire-and-forget streams of complete decision envelopes (UUID, inputs, model version, scores, directives, timestamps).
  - Computes cryptographic SHA-256 block chains across sequential log entries (`REQ-SAF-006`).
  - Commits records to immutable WORM storage volumes with 7-year regulatory retention guarantees (`REQ-NFR-008`).

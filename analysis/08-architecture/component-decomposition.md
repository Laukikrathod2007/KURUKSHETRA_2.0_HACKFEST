# Component Decomposition & Interface Specifications

## 1. Executive Summary & Modular Breakdown

The *Agentic Guardian* is decomposed into **eight modular software components**, each possessing strict single-responsibility boundaries, explicit input/output contracts, and documented failure behaviors.

This document defines the interface specifications, data contracts, and operational roles of each component.

---

## 2. Component Inventory & Responsibility Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          COMPONENT RESPONSIBILITY MATRIX                                         │
├────────┬───────────────────────────────┬───────────────────────────┬───────────────────┬─────────────────────────┤
│ Comp ID│ Component Name                │ Architectural Plane       │ Primary Language  │ Primary Interface       │
├────────┼───────────────────────────────┼───────────────────────────┼───────────────────┼─────────────────────────┤
│ CMP-01 │ Mobile Telemetry SDK          │ Client Plane (Zone 0)     │ Kotlin / Swift    │ In-App Native Bridge    │
│ CMP-02 │ In-Line Ingress Proxy         │ Ingress DMZ (Zone 1)      │ Envoy / Go        │ gRPC / REST (mTLS 1.3)  │
│ CMP-03 │ Context & Feature Assembler   │ Scoring Engine (Zone 2)   │ Go / Rust         │ Internal Memory Buffer  │
│ CMP-04 │ ML Inference & Calibrator     │ Scoring Engine (Zone 2)   │ C++ / ONNX Runtime│ C-ABI / Python Worker   │
│ CMP-05 │ Policy & Directive Router     │ Decision Plane (Zone 2)   │ Go / Rust         │ Structured JSON Policy  │
│ CMP-06 │ Fail-Open Circuit Breaker     │ Gateway Interceptor (Z1/2)│ Go / C++          │ Low-Level Socket Hook   │
│ CMP-07 │ Mule Alert Dispatcher         │ Post-Settlement (Zone 3)  │ Python / Go       │ Kafka Consumer / REST   │
│ CMP-08 │ Immutable WORM Logger         │ Audit Vault (Zone 3)      │ Go / Rust         │ Kafka Consumer / Object │
└────────┴───────────────────────────────┴───────────────────────────┴───────────────────┴─────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 CMP-01: Mobile Telemetry SDK
- **Component ID**: `CMP-01`
- **Responsibilities**:
  - Monitors user interaction on payment drafting fields; measures inter-keystroke timing, touch pressure, and focus dwell time.
  - Queries OS telephony manager (`CALL_STATE_OFFHOOK`) and screen recording status.
  - Intercepts payment navigation to render de-biasing dialogs (`CMP-01.UI`) when directed.
- **Interfaces**:
  - *Ingress*: UI event listeners on mobile banking form fields.
  - *Egress*: Serialized Protobuf telemetry payload attached to payment authorization call.
- **Failure Mode**: Global try-catch sandbox; on error, component silently unhooks and allows standard host banking UI flow.

---

### 3.2 CMP-02: In-Line Ingress Proxy
- **Component ID**: `CMP-02`
- **Responsibilities**:
  - Terminates incoming mutual TLS 1.3 connections from switch gateway and mobile clients.
  - Enforces client token-bucket rate limiting (max 10 req/min per device UUID).
  - Validates cryptographic mobile runtime attestation tokens (Play Integrity).
- **Interfaces**:
  - *Ingress*: `POST /v1/evaluate` (gRPC / HTTPS).
  - *Egress*: Internal socket forwarding to `CMP-03`.

---

### 3.3 CMP-03: Context & Feature Assembler
- **Component ID**: `CMP-03`
- **Responsibilities**:
  - Deserializes incoming transaction payload and client telemetry.
  - Queries local Redis Sentinel tier to pull sender 90-day baseline and recipient risk attributes in $\le 10\text{ms}$.
  - Merges tabular, behavioral, and counterparty features into a fixed-width 128-float feature vector.
- **Interfaces**:
  - *Ingress*: Deserialized transaction envelope from `CMP-02`.
  - *Egress*: Normalized float vector passed directly to `CMP-04`.

---

### 3.4 CMP-04: ML Inference Engine & Conformal Calibrator
- **Component ID**: `CMP-04`
- **Responsibilities**:
  - Executes multi-class LightGBM / GBDT models using optimized C++ ONNX Runtime.
  - Computes continuous risk probability $R \in [0.0, 1.0]$ and typology classification in $\le 15\text{ms}$.
  - Applies split-conformal prediction calibration to output epistemic uncertainty metric $\sigma \in [0.0, 1.0]$.
- **Interfaces**:
  - *Ingress*: 128-float feature vector from `CMP-03`.
  - *Egress*: Struct `{ risk_score: 0.82, uncertainty: 0.08, typology: "DIGITAL_ARREST", exec_ms: 12.4 }`.

---

### 3.5 CMP-05: Decoupled Policy & Directive Router
- **Component ID**: `CMP-05`
- **Responsibilities**:
  - Ingests risk score and uncertainty; evaluates against dynamic policy thresholds (`REQ-ADP-005`).
  - Assigns operational directive (`ALLOW`, `INFORM`, `INTERVENE`, `HOLD`).
  - Downgrades high-risk directives if uncertainty $\sigma > 0.35$, enforcing the customer insult ceiling.
  - Generates top-3 causal reason codes for downstream adverse action disclosure.
- **Interfaces**:
  - *Ingress*: Model inference output from `CMP-04`.
  - *Egress*: Machine-readable decision directive returned to switch gateway; copies envelope to Kafka.

---

### 3.6 CMP-06: Fast Fail-Open Circuit Breaker
- **Component ID**: `CMP-06`
- **Responsibilities**:
  - Operates as a hardware/software watchdog timer on the synchronous in-line clearance socket.
  - If total elapsed execution time from socket ingress reaches $45\text{ms}$, severs evaluation thread immediately.
  - Emits `Directive: ALLOW` with `ReasonCode: TIMEOUT_FAILOPEN` in $\le 5\text{ms}$.
- **Interfaces**:
  - *Internal*: Intercepts communication between `CMP-02` and `CMP-05`.

---

### 3.7 CMP-07: Out-of-Band Mule Alert Dispatcher
- **Component ID**: `CMP-07`
- **Responsibilities**:
  - Consumes cleared transaction events from Kafka topic `transaction.decisions.v1`.
  - If risk $R \ge 0.70$, constructs standardized ISO 20022 `camt.056` Payment Cancellation / Hold Advisory.
  - Signs payload with institutional PKI private key and dispatches to recipient bank gateway in $\le 60\text{s}$.
- **Interfaces**:
  - *Ingress*: Kafka topic subscription.
  - *Egress*: HTTPS POST over mTLS to beneficiary bank external endpoints.

---

### 3.8 CMP-08: Immutable WORM Audit Logger
- **Component ID**: `CMP-08`
- **Responsibilities**:
  - Consumes decision records from Kafka topic `transaction.decisions.v1`.
  - Computes SHA-256 block hash linked to the previous transaction record.
  - Flushes audit envelopes to Write-Once-Read-Many (WORM) storage with a 7-year immutable retention policy.
- **Interfaces**:
  - *Ingress*: Kafka topic subscription.
  - *Egress*: Append-only writes to object storage / WORM compliance volumes.

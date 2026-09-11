# Component Specifications: Detailed Engineering Blueprints

---

## 1. Executive Understanding
This document defines the **granular engineering specifications for all ten primary subsystems** in the GuardianPay architecture. For each component, we specify its exact responsibilities, input/output contracts, state management, latency budgets, failure semantics, security controls, and scaling mechanisms.

---

## 2. Component Specification Catalogue

### Component 1: `ClientSensorExtractor`
- **Subsystem:** Client Guardian SDK (Mobile TPAP Layer).
- **Language / Runtime:** Native Android Kotlin / C++ (via JNI) & iOS Swift.
- **Responsibilities:**
  - Queries `TelephonyManager.CALL_STATE_OFFHOOK` at payment trigger.
  - Measures clipboard paste latency from field focus to input population.
  - Monitors screen dwell time on the pre-PIN review activity.
  - Queries `PackageManager` for installed packages: AnyDesk, TeamViewer, RustDesk.
- **Inputs:** Android OS system services and UI touch events.
- **Outputs:** `SensorTelemetryDigest` (Binary flags, dwell time integer, paste latency integer).
- **Internal State:** Ephemeral in-memory circular buffers (flushed on activity destroy).
- **Latency Budget:** $\le 1.5\text{ms}$.
- **Security & Privacy:** Strictly zero storage on flash disk; raw gyroscope/accelerometer streams are summarized into scalar metrics and purged from RAM immediately.
- **Failure Mode:** If sensor driver throws an exception, returns safe default (`is_call_active = FALSE`).

---

### Component 2: `ClientInterlockController`
- **Subsystem:** Client Guardian SDK (Mobile TPAP Layer).
- **Language / Runtime:** Kotlin / Jetpack Compose / Android Native View.
- **Responsibilities:**
  - Intercepts the "Proceed to Pay" button click.
  - Verifies the cryptographic ECDSA signature on the server's directive.
  - Renders Tier 2 Cognitive Challenges (forcing manual legal name typing).
  - Enforces Tier 3 Call Interlocks (listening for `CALL_STATE_IDLE`).
  - Unlocks the transition to the NPCI Common Library MPIN activity only when conditions are met.
- **Inputs:** `SignedInterventionDirective` from Edge Gateway.
- **Outputs:** Android Intent to launch NPCI Common Library OR transaction cancellation event.
- **Latency Budget:** Instant UI rendering ($<16\text{ms}$ frame time).
- **Security:** Hardened against Frida hooking via native C++ signature verification.
- **Failure Mode:** If signature is invalid, defaults to defensive local confirmation modal.

---

### Component 3: `IngressGatewayService`
- **Subsystem:** Edge Risk Gateway (Bank / Cloud Layer).
- **Language / Runtime:** Go 1.22 / Envoy Proxy.
- **Responsibilities:**
  - Terminates TLS; validates client API keys and mTLS certificates.
  - Unpacks JSON request payload; generates unique UUIDv7 `evaluation_id`.
  - Dispatches parallel asynchronous reads to Aerospike feature store.
- **Inputs:** HTTPS POST request from Client SDK.
- **Outputs:** Internal gRPC `TransactionContext` message to `HotPathRiskScorer`.
- **Latency Budget:** $\le 2.0\text{ms}$ (p99).
- **Scaling Strategy:** Stateless; auto-scales horizontally across Kubernetes pods.
- **Failure Mode:** Returns HTTP 503; triggers client SDK circuit breaker.

---

### Component 4: `HotPathRiskScorer`
- **Subsystem:** Edge Risk Gateway (Bank / Cloud Layer).
- **Language / Runtime:** C++ compiled LightGBM engine with Go wrapper.
- **Responsibilities:**
  - Assembles 25+ tabular features from request payload and Aerospike cache.
  - Evaluates LightGBM gradient boosted tree ensemble.
  - Calibrates raw margins into true probability $P(\text{Scam}) \in [0, 1]$ via Platt scaling.
  - Computes top 3 TreeSHAP reason codes.
  - Directs routing: if $P < 0.20$, emits `TIER_0_PASS`; if $0.20 \le P \le 0.85$, escalates to warm path.
- **Inputs:** `TransactionContext` + Historical feature vector from Aerospike.
- **Outputs:** `RiskAssessmentResult` (`P_scam`, TreeSHAP codes, routing recommendation).
- **Latency Budget:** $\le 4.5\text{ms}$ (p99).
- **Failure Mode:** If scoring fails, falls back to deterministic rule matrix.

---

### Component 5: `EntityResolutionAdapter`
- **Subsystem:** Warm-Path Intelligence Enclave.
- **Language / Runtime:** Go / Python Asyncio.
- **Responsibilities:**
  - Formulates and dispatches `ReqValAdd` query through NPCI switch simulator / API.
  - Parses `RespValAdd` response: extracts KYC Legal Name and Merchant Category Code (MCC).
- **Inputs:** Beneficiary VPA (`pa`).
- **Outputs:** `EntityIdentityRecord` (Legal Name string, MCC integer, P2P/P2M enum).
- **Latency Budget:** $\le 150\text{ms}$ (external bank CBS network dependency).
- **Failure Mode:** If `ReqValAdd` times out (>200ms), flags `entity_resolution_status = UNKNOWN`.

---

### Component 6: `SemanticClashAnalyzer`
- **Subsystem:** Warm-Path Intelligence Enclave.
- **Language / Runtime:** Python 3.11 / ONNX Runtime C++ / INT8 IndicBERT.
- **Responsibilities:**
  - Sanitizes payment note text (`tn`); classifies psychological manipulation intent.
  - Computes cosine distance between stated purpose vector and resolved entity vector.
  - Outputs `semantic_clash_score` ($0.0 - 1.0$).
- **Inputs:** Stated purpose string + `EntityIdentityRecord`.
- **Outputs:** `SemanticRiskVector` (Clash score, intent classes, urgency level).
- **Latency Budget:** $\le 35\text{ms}$ on CPU.
- **Security:** Strict regex pre-filter stripping prompt injection strings.

---

### Component 7: `AgenticInvestigationOrchestrator`
- **Subsystem:** Warm-Path Intelligence Enclave.
- **Language / Runtime:** Python 3.11 / LangGraph / Bounded State Machine.
- **Responsibilities:**
  - Instantiates competing hypotheses ($H_{\text{Scam}}$ vs. $H_{\text{Emergency}}$).
  - Executes read-only diagnostic tools (biller lookup, blacklist query).
  - Reconciles contradictory evidence and formats Pydantic JSON recommendation.
  - Enforces hard 1,800ms execution timeout circuit breaker.
- **Inputs:** `TransactionContext` + `RiskAssessmentResult` + `SemanticRiskVector`.
- **Outputs:** Validated `AgenticRecommendation` JSON object.
- **Latency Budget:** $\le 1,800\text{ms}$.
- **Failure Mode:** If timeout occurs, aborts thread and returns hot-path GBDT recommendation.

---

### Component 8: `PolicyEnforcementEngine`
- **Subsystem:** Edge Risk Gateway.
- **Language / Runtime:** Go 1.22.
- **Responsibilities:**
  - Evaluates fused risk score against dynamic amount-scaled threshold curves.
  - Selects final friction directive: `TIER_0_PASS`, `TIER_1_ADVISORY`, `TIER_2_CHALLENGE`, `TIER_3_CALL_INTERLOCK`, or `TIER_5_BLOCK`.
- **Inputs:** `RiskAssessmentResult` + `AgenticRecommendation` + Transaction Amount.
- **Outputs:** Unsigned `FrictionDirective`.
- **Latency Budget:** $\le 0.5\text{ms}$.

---

### Component 9: `CryptographicAttestationService`
- **Subsystem:** Edge Risk Gateway.
- **Language / Runtime:** Go 1.22 (Hardware Security Module / Go `crypto/ecdsa`).
- **Responsibilities:**
  - Generates ECDSA P-256 digital signature over decision payload:
    $$\text{Sig} = \text{Sign}_{K_{\text{priv}}}(\text{eval\_id} \,||\, \text{tx\_id} \,||\, \text{Directive} \,||\, \text{Timestamp})$$
- **Inputs:** Unsigned `FrictionDirective`.
- **Outputs:** `SignedInterventionDirective` returned to Client SDK.
- **Latency Budget:** $\le 1.0\text{ms}$.

---

### Component 10: `WormAuditSink`
- **Subsystem:** Asynchronous Cold Streaming & Audit Vault.
- **Language / Runtime:** Apache Kafka Producer / AWS S3 Object Lock SDK.
- **Responsibilities:**
  - Formats immutable JSON decision dossier.
  - Emits message to Kafka topic `payment.evaluated` (partitioned by VPA hash).
  - Writes records to S3 Compliance WORM storage; computes hourly Merkle tree roots.
- **Inputs:** Complete causal transaction dossier.
- **Outputs:** Cryptographic transaction receipt hash.
- **Latency Budget:** Asynchronous background execution (zero impact on payment SLA).

# Final System Architecture: The Federated Dual-Path Tiered Triage Specification

---

## 1. Executive Understanding
This document defines the **final, authoritative technical architecture of GuardianPay (PS09)**, locking the subsystem specifications, data flows, execution boundaries, and interfaces decided in ADR-001.

GuardianPay is architected as an **Asymmetric, Cooperative Multi-Tier Defense System** split between an ultra-lightweight client-side mobile SDK and a cloud-native edge risk microservice cluster.

---

## 2. Complete End-to-End System Architecture

```
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                           CLIENT SMART GUARDIAN SDK (TPAP MOBILE LAYER)                     │
  │                                                                                             │
  │  ┌───────────────────────┐   ┌────────────────────────┐   ┌──────────────────────────────┐  │
  │  │ Intent URI Parser     │   │ Native Sensor Listener │   │ Package Inspector            │  │
  │  │ (pa, pn, am, tn, cu)  │   │ (CALL_STATE_OFFHOOK)   │   │ (Detects AnyDesk / RustDesk) │  │
  │  └──────────┬────────────┘   └───────────┬────────────┘   └──────────────┬───────────────┘  │
  │             │                            │                               │                  │
  │             ▼                            ▼                               ▼                  │
  │  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
  │  │ Client Orchestrator & Local Rule Shield                                               │  │
  │  │ • IF AnyDesk == Active -> HARD BLOCK (Error: MALWARE_SCREEN_SHARE_DETECTED)           │  │
  │  │ • Dispatches signed digest to Gateway via mTLS: Payload = Hash(Telemetry)             │  │
  │  └───────────────────────────────────────┬───────────────────────────────────────────────┘  │
  └──────────────────────────────────────────┼──────────────────────────────────────────────────┘
                                             │
                                             │ [mTLS Encrypted JSON over HTTP/2]
                                             ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                            EDGE RISK GATEWAY (BANK / CLOUD LAYER)                           │
  │                                                                                             │
  │  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
  │  │ Ingress API Gateway (Go / Envoy Proxy)                                                │  │
  │  │ • Terminates TLS in < 2ms; unpacks telemetry digest; generates unique `eval_id`        │  │
  │  └───────────────────────────────────────┬───────────────────────────────────────────────┘  │
  │                                          │                                                  │
  │                                          ▼                                                  │
  │  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
  │  │ Aerospike In-Memory Feature Store (Redis Enterprise Cluster)                          │  │
  │  │ • Retrieves: 90-day User Velocity, Rolling Spending Baselines, Mule Blacklist Hashes   │  │
  │  │ • Latency Budget: < 1.0ms (Sub-millisecond p99)                                        │  │
  │  └───────────────────────────────────────┬───────────────────────────────────────────────┘  │
  │                                          │                                                  │
  │                                          ▼                                                  │
  │  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
  │  │ HOT-PATH TABULAR RISK ENGINE (LightGBM C++ Runtime)                                   │  │
  │  │ • Evaluates 25+ features: Amount Z-score, Payee Age, Call Flag, Paste Velocity        │  │
  │  │ • Computes Calibrated Risk Score $P(\text{Scam})$ & TreeSHAP Reason Codes in < 5ms    │  │
  │  └───────────────────────────────────────┬───────────────────────────────────────────────┘  │
  │                                          │                                                  │
  │                  ┌───────────────────────┴───────────────────────┐                          │
  │                  ▼ (Clear Pass: $P < 0.20$ - 99.5% Vol)          ▼ (Ambiguous: $0.20 \le P \le 0.85$ - 0.5% Vol)
  │  ┌─────────────────────────────┐         ┌───────────────────────────────────────────────┐  │
  │  │ FAST-PATH PASS DIRECTIVE    │         │ WARM-PATH AGENTIC REASONING ENCLAVE           │  │
  │  │ • Directive: TIER_0_PASS    │         │ (Executes during User Pre-PIN Dwell Window)   │  │
  │  │ • Sub-10ms Total Round-Trip │         │                                               │  │
  │  └──────────────┬──────────────┘         │ 1. RespValAdd Core Banking Identity Resolution│  │
  │                 │                        │    Queries beneficiary CBS legal KYC name     │  │
  │                 │                        │                                               │  │
  │                 │                        │ 2. Contextual NLP & Semantic Clash Classifier │  │
  │                 │                        │    Compares purpose note against legal entity │  │
  │                 │                        │                                               │  │
  │                 │                        │ 3. Bounded Agent Hypothesis Reasoning Loop    │  │
  │                 │                        │    Evaluates Extortion Scam vs Emergency      │  │
  │                 │                        │    Hard Circuit Breaker Timeout: 1,800ms      │  │
  │                 │                        └───────────────────────┬───────────────────────┘  │
  │                 │                                                │                          │
  │                 │                                                ▼                          │
  │                 │                        ┌───────────────────────────────────────────────┐  │
  │                 │                        │ DETERMINISTIC POLICY DECISION MATRIX          │  │
  │                 │                        │ • Fuses Risk $P \times \text{Amount} \times H$│  │
  │                 │                        │ • Selects Directive: TIER_2 or TIER_3         │  │
  │                 │                        └───────────────────────┬───────────────────────┘  │
  │                 │                                                │                          │
  │                 └────────────────────────┬───────────────────────┘                          │
  │                                          │                                                  │
  │                                          ▼                                                  │
  │  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
  │  │ Cryptographic Attestation Engine (ECDSA Signer)                                       │  │
  │  │ • Digitally signs decision payload: `ECDSA_Sign(Action, ReasonCodes, TxID)`           │  │
  │  └───────────────────────────────────────┬───────────────────────────────────────────────┘  │
  └──────────────────────────────────────────┼──────────────────────────────────────────────────┘
                                             │
                                             │ [ECDSA Signed Directive Returned to Client]
                                             ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                           CLIENT UI INTERVENTION & CHECKOUT CONTROL                         │
  │                                                                                             │
  │ • IF Directive == TIER_0_PASS:                                                              │
  │   Unlocks "Pay" button immediately -> Invokes NPCI Common Library MPIN Activity             │
  │                                                                                             │
  │ • IF Directive == TIER_2_CHALLENGE:                                                         │
  │   Locks "Pay" button -> Renders Cognitive Challenge: "Type '[CBS Name]' to confirm payment" │
  │                                                                                             │
  │ • IF Directive == TIER_3_CALL_INTERLOCK:                                                    │
  │   Locks "Pay" button -> Displays Security Interlock: "Hang up active phone call to proceed" │
  └──────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                             │
                                             │ [User Completes Action or Aborts]
                                             ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════
  ASYNCHRONOUS COLD-PATH AUDIT & STREAMING LOGGING (APACHE KAFKA / S3 WORM)
  ═══════════════════════════════════════════════════════════════════════════════════════════════
  • Emits decision event to Kafka Topic: `payment.evaluated`
  • Streams immutable JSON dossier into S3 Object Lock WORM storage (BSA 2023 compliant)
  • Updates Feature Store (Feast) and refreshes local Redis mule blacklist caches
```

---

## 3. Subsystem Breakdown and Responsibilities

### Subsystem 1: Client Smart Guardian SDK (TPAP Integration)
- **Technology:** Native Android Kotlin / C++ (JNI) and iOS Swift.
- **Responsibilities:**
  - Zero-privilege sensor polling (`CALL_STATE_OFFHOOK`, dwell time, clipboard paste velocity).
  - Immediate local blocking of remote-access APKs (AnyDesk, TeamViewer, RustDesk).
  - Formatting and dispatching the encrypted telemetry digest to the gateway.
  - Verifying the server's ECDSA cryptographic response signature.
  - Interlocking the Pre-PIN checkout activity and rendering dynamic cognitive challenge screens.

### Subsystem 2: Ingress API Gateway
- **Technology:** High-performance Go microservices behind an Envoy proxy cluster.
- **Responsibilities:** TLS termination, client token authentication, non-blocking request routing, and circuit-breaker telemetry.

### Subsystem 3: Hot-Path Tabular Risk Engine
- **Technology:** C++ compiled LightGBM runtime reading from Aerospike / Redis Enterprise.
- **Responsibilities:**
  - Feature extraction across 25+ tabular dimensions in $<1\text{ms}$.
  - Evaluating the primary supervised fraud scoring model in $<5\text{ms}$.
  - Generating top 3 TreeSHAP reason codes for auditability.
  - Partitioning traffic: emitting `TIER_0_PASS` for $P < 0.20$ or escalating to warm-path for $0.20 \le P \le 0.85$.

### Subsystem 4: Warm-Path Agentic Reasoning Enclave
- **Technology:** Python 3.11 / FastAPI microservices running quantized IndicBERT models and LangGraph/custom bounded agent loops.
- **Responsibilities:**
  - Executing asynchronous `ReqValAdd` query to fetch Core Banking KYC legal name and MCC.
  - Computing the Entity-Purpose Semantic Clash score ($0.0 - 1.0$).
  - Evaluating competing hypotheses ($H_{\text{Scam}}$ vs. $H_{\text{Emergency}}$) across diagnostic tools.
  - Synthesizing structured JSON friction recommendations within the $1,800\text{ms}$ hard timeout budget.

### Subsystem 5: Deterministic Policy Decision Engine
- **Technology:** Go-based deterministic rule matrix.
- **Responsibilities:**
  - Evaluating fused risk score, transaction magnitude ($\text{Amount}$), and agent recommendations against amount-scaled threshold curves.
  - Selecting final friction tier ($T0$ through $T3$).
  - Digitally signing the verdict using server ECDSA private keys.

### Subsystem 6: Asynchronous Streaming & WORM Vault
- **Technology:** Apache Kafka, Apache Flink, and AWS S3 Compliance WORM storage.
- **Responsibilities:** Immutable logging of causal decision dossiers, Merkle tree root hashing, and near-real-time feature store updates.

---

## 4. Epistemic Assessment for PS09

The final architecture represents a **rigorous, production-defensible synthesis**: it places deterministic and statistical models on the sub-10ms hot path where speed is paramount, reserves agentic reasoning for the warm pre-PIN dwell window where context is essential, and grounds all interventions in observable, unforgeable legal entity facts.

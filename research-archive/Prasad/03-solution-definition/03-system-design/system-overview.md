# System Overview: Structural Blueprint, Operational Topology, and Architectural Narrative

---

## 1. Executive Narrative
GuardianPay (PS09) is an **intelligent, hybrid multi-tier payment interception architecture** engineered specifically for the ultra-high-throughput, sub-second operational constraints of the Indian Unified Payments Interface (UPI).

Rather than forcing an unscalable, high-latency Large Language Model (LLM) into the synchronous payment authorization loop, GuardianPay enforces an elegant **separation of temporal concerns**:
1. **The Hot Path ($<10\text{ms}$):** On-device telemetry extractors and an edge-based compiled Gradient Boosted Decision Tree (GBDT) screen 100% of transaction volume, clearing 99.5% of legitimate commerce with zero latency overhead.
2. **The Warm Path ($1.5\text{s} - 2.5\text{s}$):** During the natural human Pre-PIN review dwell window, ambiguous transactions ($0.20 \le P \le 0.85$, representing 0.5% of volume) are routed to a **Selective Agentic Reasoner**. The agent executes bounded, read-only diagnostic queries, compares the stated payment purpose against the CBS legal KYC name (`RespValAdd`), and prepares a dynamic cognitive challenge.
3. **The Cold Path (Asynchronous Streaming):** Event streams ingested into Apache Kafka update distributed feature stores, refresh mule reputation caches, and commit immutable audit dossiers to WORM storage.

---

## 2. Master System Blueprint

```
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  LAYER 1: CLIENT-SIDE GUARDIAN SDK (EMBEDDED IN TPAP APP - PHONEPE / GPAY / BHIM)
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  [User Enters Payment Details] ──► [Native Telephony Listener (`CALL_STATE_OFFHOOK`)]
                                ──► [Clipboard Paste Latency & Dwell Time Tracker]
                                ──► [Remote Access Package Scanner (AnyDesk / RustDesk)]
                                ──► [Local Rule Engine (Hard RBI statutory limits)]
                                           │
                                           │ (mTLS Encrypted Transaction Telemetry)
                                           ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  LAYER 2: EDGE RISK GATEWAY (HIGH-THROUGHPUT GO / RUST MICROSERVICES CLUSTER)
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ 1. HOT-PATH SCORING ENGINE (LightGBM C++ Runtime - Execution: < 8ms)                        │
  │    • Ingests 25+ tabular features from In-Memory Redis Feature Cache                        │
  │    • Computes Calibrated Risk Score: $P(\text{Scam})$ & TreeSHAP Reason Codes               │
  └──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼ (Risk $P < 0.20$: 99.5% Volume)               ▼ (Risk $0.20 \le P \le 0.85$: 0.5% Volume)
  ┌─────────────────────────────┐                 ┌─────────────────────────────────────────────┐
  │ FAST-PATH PASS DIRECTIVE    │                 │ LAYER 3: WARM-PATH AGENTIC REASONING ENCLAVE│
  │ • Response: TIER_0_PASS     │                 │ (Execution: 1.5s - 2.2s during Dwell Window)│
  │ • Sub-10ms round-trip       │                 │ • Entity-Purpose Semantic Clash (IndicBERT) │
  └──────────────┬──────────────┘                 │ • Competing Hypothesis Testing (Agent Loop) │
                 │                                │ • Diagnostic Tools: RespValAdd / Biller API │
                 │                                └──────────────────────┬──────────────────────┘
                 │                                                       │
                 │                                                       ▼
                 │                                ┌─────────────────────────────────────────────┐
                 │                                │ LAYER 4: BOUNDED POLICY DECISION ENGINE     │
                 │                                │ • Evaluates Risk $\times$ Amount $\times$ H │
                 │                                │ • Directs UI: Legal Name Challenge / Interlk│
                 │                                └──────────────────────┬──────────────────────┘
                 │                                                       │
                 └───────────────────────┬───────────────────────────────┘
                                         │
                                         ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  LAYER 5: PRE-PIN CHECKOUT UI (INTERVENTION ENFORCEMENT)
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  • TIER 0: Unlocks "Pay" button instantly -> Transitions to NPCI Common Library MPIN Activity
  • TIER 2: Locks "Pay" button -> Displays Cognitive Challenge: "Type 'Suresh Patel' to proceed"
  • TIER 3: Locks "Pay" button -> Displays Call Interlock: "Hang up active call to proceed"
                                         │
                                         │ (Transaction Finalized / Aborted)
                                         ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  LAYER 6: ASYNCHRONOUS COLD STREAMING & AUDIT (KAFKA / WORM VAULT)
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  • Kafka Topic: `payment.evaluated` -> Streams to S3 WORM Compliance Vault (BSA 2023)
  • Updates Feature Store (Feast) & refreshes local Redis mule reputation caches
```

---

## 3. Structural Subsystem Responsibilities

1. **Client Guardian SDK:** Implemented in native Android (Kotlin/C++) and iOS (Swift). Responsibilities: Capturing zero-permission hardware signals (call state, package inventory, touch dwell), enforcing UI interlocks, and rendering cognitive typing screens over the host app's checkout activity.
2. **Edge Risk Gateway:** High-performance Go microservices terminating mTLS in $<2\text{ms}$. Responsibilities: Ingestion parsing, Redis feature store retrieval, C++ LightGBM scoring, and circuit-breaker management.
3. **Warm-Path Agentic Enclave:** Python/FastAPI microservices hosting quantized Small Language Models (SLMs) and bounded agent reasoning loops. Responsibilities: Performing semantic entity resolution, executing diagnostic tool queries, and synthesizing structured JSON friction directives.
4. **Policy Decision Engine:** Deterministic rule matrix evaluating the fused risk dossier against amount-scaled thresholds. Responsibilities: Selecting the final friction tier and issuing cryptographically signed verdicts.
5. **WORM Forensic Vault:** Kafka-based event streaming pipeline. Responsibilities: Writing immutable decision records to S3 Object Lock storage with hourly Merkle tree root anchoring.

---

## 4. Epistemic Assessment for PS09

The system overview establishes that GuardianPay is a **balanced, hybrid, multi-tier architecture** that honors the real-world operational constraints of the Indian UPI ecosystem while deploying advanced AI reasoning where it delivers maximum protective value.

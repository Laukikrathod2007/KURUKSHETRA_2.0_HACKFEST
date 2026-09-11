# Real-Time Decisioning: Hot-Path SLAs, Warm-Path Synthesis, and Asynchronous Pipelines

---

## 1. Executive Understanding
In high-throughput retail payment systems, **a decision that arrives 50 milliseconds too late is identical to a system crash**. Payment gateways enforce unforgiving latency budgets: an authorization API that fails to respond within the Service Level Agreement (SLA) triggers an automatic timeout, causing aborted checkouts, stranded inventory, and severe consumer frustration.

A production-grade scam interceptor cannot be architected as a monolithic processing block. It must decompose intelligence gathering and inference across **three distinct temporal tiers: Hot Path, Warm Path, and Cold Path**.

---

## 2. The Three-Tier Temporal Decisioning Topology

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THREE-TIER TEMPORAL TOPOLOGY                                    │
├─────────────────────┬───────────────────┬─────────────────────────┬───────────────────────┤
│ TIER                │ LATENCY BUDGET    │ COMPUTE INFRASTRUCTURE  │ CORE RESPONSIBILITIES │
├─────────────────────┼───────────────────┼─────────────────────────┼───────────────────────┤
│ **1. HOT PATH**     │ **< 15 ms**       │ • On-Device Native SDK  │ • Hard safety rules   │
│ (In-Line Switch)    │ (Synchronous)     │ • Edge API Gateway / Go │ • Static blacklist hit│
│                     │                   │ • In-Memory Redis Cache │ • Fast GBDT inference │
├─────────────────────┼───────────────────┼─────────────────────────┼───────────────────────┤
│ **2. WARM PATH**    │ **150 - 2,500 ms**│ • Edge Microservices    │ • Entity discrepancy  │
│ (Pre-PIN Review)    │ (Concurrent Dwell)│ • Small LM / Semantic   │ • Selective Agentic   │
│                     │                   │ • Distributed Feature St│   Investigation       │
├─────────────────────┼───────────────────┼─────────────────────────┼───────────────────────┤
│ **3. COLD PATH**    │ **Seconds - Days**│ • Apache Kafka & Flink  │ • Graph clustering    │
│ (Asynchronous)      │ (Background Batch)│ • Graph DB / Spark      │ • Label maturation    │
│                     │                   │ • Model Training Cluster│ • Retrospective AML   │
└─────────────────────┴───────────────────┴─────────────────────────┴───────────────────────┘
```

---

## 3. Deep Architectural Flow Across Decision Horizons

```
                      REAL-TIME TRANSACTION DECISION PIPELINE
                               [User Scans QR / Enters VPA]
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    ═══════════════════════                                   ═══════════════════════
    HOT PATH (Sub-15ms)                                       WARM PATH (Concurrent)
    ═══════════════════════                                   ═══════════════════════
    1. Read Device Sensors                                    1. Execute `RespValAdd`
       (Call state, AnyDesk flag)                                (Fetch CBS Legal Name)
    2. Check Local Redis Cache                                2. Query High-Speed Feature
       (Known Mule Blacklist)                                    Store (Payee Graph Velocity)
    3. Evaluate Hard Compliance Rules                         3. If Risk in Gray Zone:
       (Daily limits, Device binding)                            Invoke Quantized SLM /
    4. Run On-Device GBDT Risk Score                             Selective Agentic Reasoner
               │                                                         │
               ▼                                                         ▼
       [Hot Path Cleared]                                        [Synthesize Context]
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            │
                                            ▼
                      ┌───────────────────────────────────────────┐
                      │ PRE-PIN INTERVENTION GATE                 │
                      │ (Decides whether to show PIN pad or       │
                      │  render Cognitive Interruption Shield)    │
                      └─────────────────────┬─────────────────────┘
                                            │
                             [User Submits Valid MPIN]
                                            │
                                            ▼
    ══════════════════════════════════════════════════════════════════════════════════
    COLD PATH (Asynchronous Streaming - Kafka / Flink / Spark)
    ══════════════════════════════════════════════════════════════════════════════════
    • Emit Transaction Event to Kafka Topic: `payment.completed`
    • Stream into Graph Engine: Update In/Out degree velocity counters
    • Update Feature Store (Feast): Refresh rolling 24h user spending baseline
    • Ingest into Offline Audit Store for Regulatory Reporting
```

---

## 4. Exploiting the "Pre-PIN Review Window"

The critical architectural breakthrough for **PS09** is recognizing that **the system does not have to squeeze all complex reasoning into the sub-50ms switch path**.

In standard human payment psychology:
- After entering the amount, the user pauses on the confirmation screen to review the payee details and tap "Proceed to Pay".
- **Empirical Dwell Time:** This human review window lasts between **1.5 seconds and 4.0 seconds**.
- **The Warm Path Opportunity:** While the human eye is reading the screen, the system can asynchronously trigger:
  1. Semantic entity mismatch resolution (`RespValAdd` vs. entered purpose).
  2. Edge-based Small Language Model (SLM) intent classification (30ms).
  3. Pre-computation of cognitive challenge phrases if the risk score enters the ambiguous threshold.

---

## 5. Resilience Engineering: Circuit Breakers and Graceful Degradation

If an external intelligence service (e.g., an external blacklist API or cloud LLM gateway) experiences network degradation or outage:
- **The Circuit Breaker Pattern (Netflix Hystrix / Resilience4j):** If error rate exceeds 5% or latency exceeds 300ms over a 10-second rolling window, the circuit **TRIPS OPEN**.
- **Graceful Degradation Policy:**
  - The system automatically bypasses the failing warm-path agent.
  - The transaction falls back to **On-Device Deterministic Rules + Local GBDT Scoring**.
  - Under no circumstances does a third-party AI service failure halt national payment processing.

---

## 6. Epistemic Assessment for PS09

| Dimension | Real-Time Decisioning Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Hot Path Bounds** | **Strictly < 15ms:** Complex agentic loops cannot execute in the direct synchronous path. | Reserve hot path strictly for **deterministic rules, local sensor checks, and fast GBDT scoring**. |
| **Warm Path Opportunity** | **1.5s - 3.0s window available:** Human dwell time provides adequate room for selective AI reasoning. | Leverage pre-PIN review pause to run **semantic discrepancy and targeted agentic verification**. |
| **Fail-Safe Operation** | **Mandatory Fail-Open with Local Fallback:** Cloud AI failure must never block legitimate payments. | Architect local on-device heuristics capable of standalone defense during network disconnects. |

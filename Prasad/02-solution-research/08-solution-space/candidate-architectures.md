# Candidate Reference Architectures: Structural Topologies, Latency Profiles, and Tradeoffs

---

## 1. Executive Understanding
To avoid prematurely fixating on a single implementation, we formalize **six distinct reference architectural candidates** representing different design philosophies across the solution space.

Each candidate represents a coherent engineering approach with specific tradeoffs across **latency, financial cost, privacy compliance, fraud coverage, and operational complexity**. These candidates serve as the formal inputs for comparative evaluation in Phase 3.

---

## 2. The Six Reference Architecture Candidates

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           CANDIDATE REFERENCE ARCHITECTURES                               │
├─────────────────────┬─────────────────────────────────┬──────────────┬────────────────────┤
│ CANDIDATE           │ STRUCTURAL COMPOSITION          │ LATENCY      │ TARGET DOMAIN      │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture A:** │ Deterministic Rules + GBDT      │ **< 5 ms**   │ Traditional Bank   │
│ *Traditional Risk*  │ (LightGBM) + Static UI Warnings │ (Hot Path)   │ Switch Transaction │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture B:** │ On-Device Sensor Telemetry +    │ **< 10 ms**  │ Mobile Client      │
│ *Behavioral Guard*  │ Touch Dynamics + Call Listener  │ (On-Device)  │ Device Hardening   │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture C:** │ Dual-Path: Hot-Path GBDT +      │ Hot: 8 ms    │ **Primary Hybrid   │
│ *Tiered Triage*     │ Warm-Path Selective Agentic AI  │ Warm: 1.8 s  │  Benchmark**       │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture D:** │ Near-Real-Time Streaming Graph  │ 50 - 250 ms  │ Central Switch &   │
│ *Graph Interceptor* │ Engine + TGNs + Mule Clusters   │ (Async Hub)  │ Bank AML Core      │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture E:** │ In-App Conversational Security  │ 3,000 -      │ Consumer Protective│
│ *Debiasing Copilot* │ Assistant / Voice Interrupter   │ 15,000 ms    │ Advisory Chatbot   │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Architecture F:** │ Multi-Layer Federated Defense:   │ Layered:     │ **Full-Ecosystem   │
│ *Federated Defense* │ Device SDK + Edge SLM + Agent   │ 2ms to 2.2s  │  Target Vision**   │
└─────────────────────┴─────────────────────────────────┴──────────────┴────────────────────┘
```

---

## 3. Deep Technical Specification of Candidate Architectures

### Candidate Architecture A: The Traditional Risk Engine (Rules + GBDT)
- **Mechanics:** Transaction attributes are evaluated by in-memory Drools rules followed by a C++ compiled LightGBM model querying an Aerospike feature store.
- **Latency:** 2–5ms.
- **Strengths:** Handles 50,000+ TPS; micro-cent operational cost; 100% compliant with legacy banking switches.
- **Weaknesses:** Catches <20% of APP social engineering scams; relies on static warning banners that suffer 95%+ habituation blindness.

### Candidate Architecture B: Client-Side Behavioral Sensor Guardian
- **Mechanics:** A native Android/iOS SDK running directly inside the TPAP application. Listens to `CALL_STATE_OFFHOOK`, monitors screen dwell time, clipboard paste velocity, and inspects installed packages for AnyDesk/RustDesk.
- **Latency:** Instant (<2ms).
- **Strengths:** Zero server infrastructure cost; zero DPDP privacy violations (data never leaves phone); instantly detects screen sharing and active call coercion.
- **Weaknesses:** Blind to recipient history, mule network clusters, and fund laundering; crippled on iOS due to Apple sandbox restrictions.

### Candidate Architecture C: The Dual-Path Tiered Triage Engine (The Benchmark Hybrid)
- **Mechanics:** 
  - **Tier 1 (Hot Path, 8ms):** Rules and GBDT screen 100% of transactions. If $P(\text{Scam}) < 0.20$, pass immediately to PIN.
  - **Tier 2 (Warm Path, 1.8s):** During the user's pre-PIN dwell window, transactions with risk $0.20 \le P \le 0.85$ invoke a selective Agentic Reasoner that resolves `RespValAdd` legal names against stated intent, evaluates semantic notes, and constructs a dynamic cognitive challenge.
- **Latency:** Hot: 8ms; Warm: 1.8s.
- **Strengths:** 99.5% of transactions experience zero friction and zero AI cost; concentrates heavy reasoning strictly on ambiguous edge cases.
- **Weaknesses:** Requires tight client-server coordination and robust circuit breakers for warm-path timeouts.

### Candidate Architecture D: Graph-Centric Mule Interceptor
- **Mechanics:** Transaction streams are ingested into Apache Kafka and mapped in real time across a distributed graph database (TigerGraph / Neo4j). Graph Neural Networks (TGNs) calculate dynamic mule probability scores based on rapid fund dispersal and degree velocity.
- **Latency:** 50–250ms (Asynchronous).
- **Strengths:** Unmatched ability to dismantle multi-layered mule rings and track syndicated laundering.
- **Weaknesses:** Extreme infrastructure compute cost; completely blind to remitter-side psychological coercion.

### Candidate Architecture E: In-App Conversational Debiasing Copilot
- **Mechanics:** When an anomalous transaction is initiated, the payment app pauses and launches an interactive voice or text dialog: *"Rameshji, who instructed you to send this ₹45,000?"*
- **Latency:** 5 to 20 seconds of interactive user engagement.
- **Strengths:** Maximum psychological impact; actively disrupts scammer coaching and cognitive hypnosis.
- **Weaknesses:** Severe user friction; completely unacceptable for routine payments; easily abandoned by frustrated legitimate users.

### Candidate Architecture F: The Multi-Layer Federated Defense (The Ecosystem Standard)
- **Mechanics:** Synthesizes Candidate B (On-device sensor telemetry) on the client, Candidate C (Tiered Triage) at the edge gateway, and Candidate D (Graph intelligence) in the cold streaming path, bound together by a **Deterministic Policy Decision Matrix**.
- **Strengths:** True defense-in-depth covering the entire scam lifecycle.
- **Weaknesses:** High architectural and engineering complexity.

---

## 4. Epistemic Assessment for PS09

| Dimension | Architectural Takeaway |
| :--- | :--- |
| **Leading Contender** | **Architecture C (Dual-Path Tiered Triage):** Strikes the optimal balance between real-time scalability, cost control, and deep agentic debiasing. |
| **Essential Client Augmentation**| Incorporate key elements of **Architecture B (Sensor Telemetry)** into Architecture C's client-side SDK. |
| **Rejection of Pure Paradigms**| Reject pure Architecture A (too blind to scams) and pure Architecture E (too slow and intrusive for payments). |

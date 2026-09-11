# Scalability and Throughput: Peak-Load Engineering, Distributed Caching, and Compute Economics

---

## 1. Executive Understanding
Designing a fraud detection prototype for 10 transactions per second in a test environment is trivial; designing a system that survives **national-scale peak bursts of 25,000+ Transactions Per Second (TPS)** during Diwali, Dhanteras, or monthly salary days is an extraordinary distributed systems challenge.

In payment infrastructure, scalability is not merely about provisioning more virtual machines. It requires **strict mathematical bounds on algorithmic complexity, asynchronous event partitioning, memory-efficient feature architectures, and defensible compute economics**.

---

## 2. Macro Scale Demands of the Indian UPI Infrastructure

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           UPI SYSTEM THROUGHPUT PARAMETERS                                │
├───────────────────────────────────┬───────────────────────────────────────────────────────┤
│ METRIC                            │ PRODUCTION VALUE (2025 / 2026 BENCHMARKS)             │
├───────────────────────────────────┼───────────────────────────────────────────────────────┤
│ **Daily Transaction Volume**      │ 500,000,000+ transactions / day                       │
│ **Average Steady-State TPS**      │ 6,000 - 9,000 TPS                                     │
│ **Peak Burst TPS (Festivals)**    │ **20,000 - 30,000 TPS**                               │
│ **Maximum Permissible Latency**   │ Switch Timeout: 2,000 ms; Risk Budget: < 35 ms        │
│ **Target Infrastructure SLA**     │ 99.999% Availability ("Five Nines" = 5.26 min downtime│
│                                   │ per year across national network)                     │
└───────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. The Compute Economics: Why Naive AI Architectures Go Bankrupt

Consider the computational economics of evaluating transactions across different technological paradigms at 500 million daily transactions:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      COMPUTE COST MATRIX AT 500 MILLION TX / DAY                          │
├─────────────────────┬───────────────────┬─────────────────────┬───────────────────────────┤
│ PARADIGM            │ COST PER 1K TX    │ DAILY COMPUTE COST  │ ANNUAL INFRASTRUCTURE COST│
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **1. Rules & GBDT** │ $0.001            │ $500 / day          │ **$182,500 / year**       │
│    (Go / C++ Tree)  │ (Lightweight CPU) │                     │ (Highly Economical)       │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **2. On-Device SLM**│ $0.000 (Uses user │ $0 / day            │ **$0 Server Cost**        │
│    (Quantized NPU)  │ device hardware)  │ (Client distributed)│ (Private & Infinitely Sc.)│
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **3. Cloud LLM (All)│ $10.00            │ **$5,000,000 / day**│ **$1.825 BILLION / year** │
│    (GPT-4o / Claude)│ ($0.01 / call)    │                     │ (Completely Unviable)     │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **4. Tiered Triage**│ $0.05             │ **$25,000 / day**   │ **$9.125 Million / year** │
│    (0.5% Escalated) │ (Blended rate)    │                     │ (Viable for Large Banks)  │
└─────────────────────┴───────────────────┴─────────────────────┴───────────────────────────┘
```

### The Architectural Takeaway
Any proposal claiming to run a cloud LLM or multi-agent debate on every UPI transaction is **financially and computationally illiterate**. A production architecture **must** filter out 99%+ of volume using sub-millisecond deterministic rules and lightweight GBDTs, reserving cloud-based contextual reasoning strictly for the fraction of transactions falling in the ambiguous risk corridor.

---

## 4. Distributed Systems Architecture for Peak Throughput

```
                     HIGH-THROUGHPUT FRAUD INGESTION & SCORING
                                 [25,000 Peak TPS]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ Envoy Proxy / Edge API Gateway (Go)   │
                     │ • Terminates TLS in < 2ms             │
                     │ • Non-blocking asynchronous I/O (epoll│
                     └───────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
  ┌─────────────────────────────┐                 ┌─────────────────────────────┐
  │ IN-MEMORY FEATURE STORE     │                 │ STATISTIC RISK WORKERS      │
  │ (Aerospike / Redis Cluster) │                 │ (Rust / ONNX Runtime C++)   │
  │ • 10M+ read IOPS            │◄───────────────►│ • Evaluates LightGBM model  │
  │ • Sub-millisecond p99       │                 │ • Sub-5ms inference latency │
  │ • Read-replicas per region  │                 │ • Auto-scales horizontally  │
  └─────────────────────────────┘                 └──────────────┬──────────────┘
                                                                 │
                                                                 ▼
                                                  ┌─────────────────────────────┐
                                                  │ APACHE KAFKA EVENT LOG      │
                                                  │ • Topic: `tx.evaluated`     │
                                                  │ • Partition Key: Hash(VPA)  │
                                                  │ • Zero-loss write to disk   │
                                                  └─────────────────────────────┘
```

### 1. Partitioning Strategy for State Consistency
In payment streaming, transactions relating to the same account must be processed in **strict chronological order** to prevent race conditions in velocity counters:
- Kafka topics are partitioned using `MurmurHash3(Remitter_Account_ID)` or `MurmurHash3(Beneficiary_VPA)`.
- This guarantees that all transactions for a specific user land on the same consumer thread, eliminating distributed locking overhead while maintaining exact sliding-window state.

### 2. High-Density Feature Caching (Aerospike / Redis)
- Tabular models require historical features (e.g., 30-day transaction count, rolling average ticket size).
- Querying a relational database (PostgreSQL/Oracle) at 25,000 TPS causes immediate connection pool exhaustion.
- **Production Solution:** Real-time features reside in **Aerospike or Redis Enterprise clusters**, storing pre-aggregated serialized protocol buffers with read latencies consistently below **0.8 milliseconds**.

---

## 5. Load Shedding and Graceful Degradation Under Extreme Surge

During unforeseen traffic surges (e.g., flash sales or network disruptions):
1. **Dynamic Tier Shedding:** If queue depth exceeds a safety threshold:
   - Disable deep semantic NLP analysis.
   - Fall back to purely statistical Z-score and deterministic velocity rules.
2. **Priority Ingress Queuing:** Micro-payments below ₹500 (representing 60%+ of volume but <5% of total scam financial loss) are routed through an ultra-lightweight fast path, reserving heavy fraud evaluation workers for high-value transfers ($> ₹10,000$).

---

## 6. Epistemic Assessment for PS09

| Dimension | Scalability Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Hot Path Compute** | **Must be O(1) or O(log N):** Complex graph traversals or deep network loops cannot scale to 25,000 TPS. | Precompute features in background streaming; keep hot path strictly read-only. |
| **Cost Bounds** | **Serverless / Cloud AI on all traffic is financially impossible.** | The Guardian must distribute compute: **On-Device local inference** + **Selective Cloud Escalation**. |
| **Resilience to Surges**| **System must support dynamic load shedding.** | Design modular layers that can gracefully decouple under peak load without halting payments. |

# Data Architecture: Caching, Streaming, and Immutable Storage

## 1. Executive Summary & Epistemic Storage Partitioning

In payment cybersecurity systems, a single monolithic database cannot satisfy the mutually exclusive demands of sub-10ms in-line feature retrieval, high-throughput event streaming (45,000 TPS), offline graph neural network training, and 7-year legally non-repudiable audit compliance.

The *Agentic Guardian* establishes a **Polyglot Storage Architecture** partitioned across four specialized storage tiers:

```text
               THE POLYGLOT DATA ARCHITECTURE TIERS
               
 [TIER 1: ULTRA-FAST IN-MEMORY CACHE] ──► Redis Sentinel Tier (Cluster)
                                          Sub-10ms Feature Baselines & Pre-Computed GNNs
 
 [TIER 2: DISTRIBUTED EVENT STREAMING] ──► Apache Kafka / Redpanda Cluster
                                          Non-Blocking Async Event Bus (15k-45k TPS)
 
 [TIER 3: ANALYTICS & FEATURE STORE]  ──► Parquet / ClickHouse / Data Lake
                                          Offline Concept Drift, Retraining & Modeling
 
 [TIER 4: IMMUTABLE AUDIT VAULT]      ──► Append-Only WORM Object Storage
                                          Cryptographic SHA-256 Chaining, 7-Yr Retention
```

---

## 2. Storage Tier Specifications

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          DATA TIER SPECIFICATION MATRIX                                          │
├──────┬────────────────────┬───────────────────────┬──────────────┬───────────────┬───────────────────────────────┤
│ Tier │ Technology Engine  │ Primary Data Stored   │ Latency SLA  │ Retention TTL │ Statutory / Functional Purpose│
├──────┼────────────────────┼───────────────────────┼──────────────┼───────────────┼───────────────────────────────┤
│ 1    │ Redis (Sentinel)   │ User 90-day baselines,│ P99 ≤ 8ms    │ 90 Days       │ Sub-45ms In-Line Feature Store│
│      │ In-Memory RAM      │ Recipient risk scores │              │ Sliding Window│ (REQ-TIME-001, REQ-CTX-001)   │
├──────┼────────────────────┼───────────────────────┼──────────────┼───────────────┼───────────────────────────────┤
│ 2    │ Apache Kafka /     │ Decision envelopes,   │ P99 ≤ 15ms   │ 7 Days        │ Asynchronous decoupling of    │
│      │ Redpanda Bus       │ Mule alert events     │ (Publish)    │ Durable Log   │ audit and downstream systems  │
├──────┼────────────────────┼───────────────────────┼──────────────┼───────────────┼───────────────────────────────┤
│ 3    │ ClickHouse / S3    │ Historical telemetry, │ Seconds /    │ 180 Days      │ Concept drift monitoring &    │
│      │ Parquet Data Lake  │ Aggregated training ML│ Minutes      │ Max Purge TTL │ unsupervised clustering       │
├──────┼────────────────────┼───────────────────────┼──────────────┼───────────────┼───────────────────────────────┤
│ 4    │ WORM Object Store  │ Signed decision logs, │ Seconds      │ 7 Years       │ SEC Rule 17a-4, SR 11-7,      │
│      │ (S3 Object Lock)   │ Overrides, Audits     │ (Async Commit│ Strict WORM   │ ECOA Non-Repudiation Audit    │
└──────┴────────────────────┴───────────────────────┴──────────────┴───────────────┴───────────────────────────────┘
```

---

## 3. Deep Analysis of Data Architecture Tiers

### 3.1 Tier 1: In-Memory Feature Cache (Redis Sentinel Tier)
- **Role**: Powers the sub-10ms feature assembly pipeline for in-line risk scoring (`CMP-03`).
- **Data Models**:
  - `sender:{account_hash}:baseline`: Hash storing 90-day transaction count, max amount, average amount, standard deviation, and typical transfer hours.
  - `beneficiary:{vpa_hash}:profile`: Hash storing account age, inbound transaction count in last 24 hours, outbound pass-through ratio, and consortium negative flags.
  - `beneficiary:{vpa_hash}:gnn_embedding`: 32-dimensional float vector pre-computed by background streaming GNNs representing the entity's multi-hop network neighborhood.
- **Failover & Replication**: Deployed as a Redis Sentinel cluster with multi-AZ read replicas. If the primary master fails, Sentinel executes automatic failover in $\le 3\text{ seconds}$.

---

### 3.2 Tier 2: Asynchronous Event Streaming Backbone (Kafka)
- **Role**: Decouples all downstream I/O from the synchronous payment clearance socket.
- **Key Partitioned Topics**:
  - `transaction.decisions.v1`: High-throughput stream capturing the atomic decision envelope emitted by `CMP-05`. Partitioned by `sender_account_hash` to preserve causal ordering.
  - `mule.containment.alerts.v1`: Priority stream consumed by `CMP-07` for assembling and dispatching out-of-band ISO 20022 `camt.056` hold advisories to receiving institutions within $\le 60\text{s}$.
  - `telemetry.drift.v1`: Low-priority stream feeding raw feature vectors into the offline feature store for daily drift detection and unsupervised clustering.

---

### 3.3 Tier 3: Analytics Feature Store & Automated Purge Pipeline
- **Role**: Powers model retraining, Population Stability Index (PSI) calculations, and unsupervised clustering (`CAP-04`, `ACAP-04`).
- **Privacy & Statutory Retention Boundary**:
  - Under GDPR Article 5(1)(e) and the India DPDP Act 2023, personal behavioral data cannot be retained indefinitely.
  - Raw client interaction telemetry (touch intervals, typing dynamics, device environment flags) is retained for **exactly 180 days** (`REQ-PRIV-005`).
  - An automated cron daemon executes rolling partition drops on Day 181, purging raw behavioral vectors while preserving aggregated mathematical statistical weights.

---

### 3.4 Tier 4: Immutable WORM Compliance Vault
- **Role**: Fulfills legal non-repudiation, model governance auditability (Federal Reserve SR 11-7), and judicial evidence admissibility (`REQ-OBS-001`, `REQ-SAF-006`).
- **Cryptographic Chaining Protocol**:
  - Decision envelopes consumed from Kafka are grouped into micro-blocks every 5 seconds.
  - Each micro-block calculates a SHA-256 Merkle root and includes the cryptographic hash of the previous micro-block, establishing an immutable cryptographic hash chain.
  - Micro-blocks are written to Write-Once-Read-Many (WORM) storage (e.g., AWS S3 Object Lock in Compliance Mode or NetApp SnapLock).
  - Storage policies physically and cryptographically prevent modification, deletion, or overwriting by any user (including root administrators) for the entire 7-year regulatory retention period.

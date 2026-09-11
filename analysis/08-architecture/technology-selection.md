# Technology Selection & Architecture Decision Records (ADR)

## 1. Technology Selection Principles

Kurukshetra adheres to the **Principle of Least Powerful Adequate Tool**:
1. **Never use an LLM where statistical ML suffices.**
2. **Never use statistical ML where a deterministic rule or hash-lookup suffices.**
3. **Never use distributed consensus on the synchronous critical path.**
4. **Choose mature, battle-tested runtimes with predictable microsecond garbage-collection pauses over experimental frameworks.**

---

## 2. Comprehensive Technology Selection Matrix

| Subsystem / Layer | Considered Options | Selected Technology | Technical Justification | Addressed Requirements | Architectural Trade-Offs |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **In-Line Orchestrator Language (`CMP-01`)** | Go, Rust, C++, Java 21, Python (FastAPI) | **Go 1.22+** | Predictable sub-millisecond GC pauses, superior native concurrency (`goroutines` + `netpoll`), rapid development velocity compared to C++/Rust, native cgo linkage to C++ ONNX runtime. | REQ-PERF-01 (P99 $\le 45\text{ms}$), REQ-AV-01 (99.999% uptime) | Slightly higher memory footprint than Rust; requires cgo boundary management for C++ calls. |
| **In-Line ML Inference Engine (`CMP-03`)** | PyTorch C++, ONNX Runtime C++, TensorRT, Python Triton | **Microsoft ONNX Runtime C++** | Zero-copy tensor evaluation on AVX-512 x86_64 CPUs; evaluates 250 GBDT trees in $< 4.5\text{ms}$ without GPU dependencies or Python GIL bottlenecks. | REQ-PERF-02 (Inference $\le 8\text{ms}$), REQ-DET-01 | Requires compiling trained Python models to `.onnx` protobuf format before deployment. |
| **Machine Learning Algorithm (`M-01`)** | Deep Neural Nets (MLP/Transformer), XGBoost, LightGBM, Random Forest | **LightGBM (GBDT)** | Superior performance on tabular financial features; native missing-value split paths; exact microsecond TreeSHAP attribution; orders of magnitude faster than Deep Learning. | REQ-DET-01, REQ-EXP-01 (Exact TreeSHAP attributions) | Less suited for raw unstructured text/audio than Transformers, but transaction tabular context dominates. |
| **In-Memory Feature Cache (`CMP-01-Cache`)** | Redis Sentinel, Apache Ignite, Memcached, Aerospike | **Redis Sentinel Cluster (v7.2)** | Sub-1.5ms read latency over VPC loopback, native TTL expiration, high-availability master-replica automated failover, battle-tested in global payment switches. | REQ-PERF-01 (P99 context retrieval $\le 4\text{ms}$) | In-memory RAM cost is higher than SSD-backed stores; mitigated by aggressive 30-minute sliding TTL. |
| **Event Streaming Backbone** | Apache Kafka, RabbitMQ, AWS SQS, Apache Pulsar | **Apache Kafka (Strimzi Operator)** | High-throughput distributed log (100k+ msg/sec), immutable partitioned ordering by `account_id`, native MirrorMaker 2.0 multi-region replication, replayability for model evaluation. | REQ-AUD-01, REQ-PERF-03 (Decoupled streaming plane) | Higher operational complexity than RabbitMQ; justified by strict ordering and replay requirements. |
| **Analytical Telemetry Data Lake** | ClickHouse, Snowflake, PostgreSQL, Elasticsearch | **ClickHouse** | Columnar compression ($> 5\times$), blazing fast analytical aggregations across billions of transaction rows, native SQL interface, sub-second aggregation queries for velocity counters. | REQ-OBS-01, REQ-PERF-04 | Not suited for point-in-time ACID transactional mutations; paired with Redis for operational mutations. |
| **Audit Log WORM Vault (`CMP-06`)** | AWS S3 Object Lock, Azure Blob Immutable, Hadoop HDFS, Local Disk | **AWS S3 Object Lock (Compliance Mode)** | Legally certified non-rewritable WORM storage complying with SEC Rule 17a-4, FINRA, and FATF 7-year retention mandates; zero ransomware or insider override risk. | REQ-SEC-03, REQ-AUD-02 (Non-repudiation) | Data cannot be deleted even by root AWS account until retention period expires (intended safety feature). |
| **SOC Copilot LLM (`CMP-08`)** | OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Local Mistral-7B, Llama 3 70B | **Mistral-7B Instruct (v0.3) / Claude 3.5 Sonnet** | Mistral-7B can be self-hosted on private bank VPC for complete data sovereignty; Claude 3.5 Sonnet provides state-of-the-art tool-use and reasoning for complex forensic dossiers. | REQ-AGN-01, REQ-PRIV-01 (Zero PII leak) | LLM inference takes 1–5 seconds; strictly relegated to asynchronous analyst workbench (zero in-line impact). |
| **Client Banking App SDK (`CMP-02`)** | React Native, Flutter, Native Kotlin / Swift | **Native Kotlin (Android) & Swift (iOS)** | Direct access to hardware TEE, telephony call state listeners (`TelecomManager`), and native UI window overlay gates without bridge latency or cross-platform serialization overhead. | REQ-INT-01, REQ-SEC-01 (Hardware attestation) | Dual codebase maintenance; justified by hardware-level security and microsecond rendering requirements. |
| **Distributed Observability** | OpenTelemetry + Prometheus + Jaeger vs Datadog | **OpenTelemetry + Prometheus + Grafana + Jaeger** | Open-source, vendor-neutral standard; zero proprietary vendor lock-in; lightweight agent sidecars; native support for W3C distributed trace context propagation. | REQ-OBS-01, REQ-OBS-02 | Requires internal management of Prometheus and Jaeger collectors; eliminates multimillion-dollar SaaS fees. |

---

## 3. Technology Rejection Log: Explicit Anti-Patterns

1. **REJECTED: Cloud LLMs in the In-Line Clearance Path**:
   - *Why Rejected*: Cloud LLM APIs (GPT-4, Claude) exhibit P99 latencies of 1,200ms–4,000ms and failure rates $> 0.2\%$, violating the $45\text{ms}$ hard payment switch deadline by $30\times$. Additionally, non-deterministic outputs present severe regulatory compliance liabilities.
2. **REJECTED: Vector Databases for In-Line Feature Lookups (Pinecone / Milvus in Critical Path)**:
   - *Why Rejected*: Approximate Nearest Neighbor (ANN) index searches introduce 15ms–40ms latency overhead. Kurukshetra instead pre-computes GNN graph embeddings asynchronously and stores the resulting flat 16-dim vectors in Redis for $1\text{ms}$ direct key lookups.
3. **REJECTED: Python FastAPI for In-Line Orchestrator**:
   - *Why Rejected*: Python's Global Interpreter Lock (GIL) and non-deterministic garbage collection spikes produce unacceptable latency jitter ($> 80\text{ms}$ at high concurrency). Go was selected for rock-solid concurrency and predictable latency.

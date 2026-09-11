# System Architecture Overview & Core Architectural Patterns

## 1. Executive Summary & Architectural Mission

The *Agentic Guardian for Real-Time Payment Scam Interception* is a high-performance, fault-tolerant, hybrid edge-cloud cyber-physical system. Its mission is to intercept authorized push payment (APP) scams in real time by executing multi-modal risk scoring, uncertainty quantification, and dynamic cognitive interventions within the uncompromising physical latency budgets of national retail payment clearing switches ($\le 45\text{ms}$).

The architecture converts the bare-minimum PRD (`06-prd/`) and validated system requirements (`05-requirements/`) into a concrete, implementable engineering design.

---

## 2. Core Architectural Pattern: The Decoupled Asymmetric Control Loop

Traditional financial fraud architectures fail because they attempt to execute heavy, distributed computations (graph neural networks, external telephone carrier lookups, multi-turn LLM reasoning) synchronously within the critical in-line transaction clearance path, inevitably breaching switch connection timeouts (`CF-01`).

To resolve this fundamental physics paradox, the Guardian implements the **Decoupled Asymmetric Control Loop**:

```text
               THE DECOUPLED ASYMMETRIC CONTROL LOOP
               
  [CLIENT PRE-FLIGHT LAYER (30s - 120s)]
  Passively captures touch hesitation, clipboard pastes, and active call flags.
  Pre-warms local memory cache with recipient risk profile.
                 │
                 ▼
  [IN-LINE CRITICAL PATH (≤ 45ms)] ◄─── National Switch Authorization Request
  Executes in-memory feature assembly + GBDT inference + Conformal Calibration.
  Emits deterministic operational directive (Allow / Inform / Intervene / Hold).
  Guaranteed Fail-Open in ≤5ms via hardware/software circuit breaker.
                 │
                 ▼
  [CLIENT PRE-PIN COGNITIVE INTERCEPT]
  Suppresses PIN pad; executes stateful de-biasing challenge if flagged.
                 │
                 ▼
  [ASYNCHRONOUS POST-SETTLEMENT FABRIC (≤ 60s)]
  Event-driven streaming bus dispatches signed ISO 20022 camt.056 mule alerts.
  Background pipelines update GNN graph embeddings and WORM audit logs.
```

---

## 3. The Five Architectural Planes

The Guardian is partitioned into five specialized, decoupled architectural planes:

1. **Client Telemetry & Intervention Plane**: A lightweight, sandboxed mobile SDK embedded in the host banking application, providing ephemeral telemetry capture, local environment attestation, and pre-PIN UI de-biasing dialog rendering.
2. **In-Line Edge Gateway Plane**: An ultra-low-latency, stateless inference gateway (Go / C++ / Rust or high-performance FastAPI) deployed at the edge of the bank's switch routing fabric, terminating requests in $\le 45\text{ms}$ over mTLS 1.3.
3. **Decision & Policy Plane**: A decoupled business rules engine that separates statistical machine learning scoring from compliance risk thresholds, mapping risk and uncertainty vectors into operational directives (`Allow`, `Inform`, `Intervene`, `Hold`).
4. **Asynchronous Intelligence & Streaming Plane**: A distributed event streaming backbone (Apache Kafka / Redpanda) powering offline graph neural network embedding updates, cross-rail velocity aggregation, and unsupervised zero-day scam clustering.
5. **Observability, Audit & Recovery Plane**: An immutable, append-only WORM storage cluster recording SHA-256 block-chained decision envelopes for regulatory non-repudiation, paired with an automated ISO 20022 mule containment dispatcher.

---

## 4. Key Architectural Decisions (ADRs)

- **ADR-01: Ephemeral In-Memory Client Processing**: Raw touch coordinates, accelerometer data, and keystroke timings are processed ephemerally in volatile RAM and purged $\le 100\text{ms}$ post-scoring (`REQ-PRIV-002`), ensuring absolute GDPR Article 9 compliance.
- **ADR-02: Strict Separation of In-Line Inference from Graph Traversals**: Multi-hop graph neural networks execute asynchronously in background pipelines, pre-computing 32-dimensional node embeddings stored in low-latency Redis clusters (`<3ms` lookup), keeping in-line scoring well within the 45ms switch SLA.
- **ADR-03: Deterministic Fail-Open Circuit Breaker**: If any in-line evaluation exceeds $45\text{ms}$ or encounters an unhandled runtime exception, an isolated circuit breaker emits `Directive: Allow` in $\le 5\text{ms}$ (`REQ-RES-002`), ensuring zero payment gridlock.
- **ADR-04: Multi-Tiered Proportional Friction**: Replaces blunt binary blocking with a 4-tier operational spectrum, enforcing a strict customer insult ratio $\le 10:1$ (`REQ-SAF-002`).
- **ADR-05: WORM Append-Only Cryptographic Logging**: Decision records are committed with SHA-256 cryptographic chaining to immutable storage volumes, fulfilling SEC Rule 17a-4 and Federal Reserve SR 11-7 requirements (`REQ-OBS-001`).

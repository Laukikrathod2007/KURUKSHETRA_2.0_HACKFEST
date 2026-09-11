# High-Level System Architecture (C4 Container Model)

## 1. Executive Summary & C4 Model Overview

The *Agentic Guardian for Real-Time Payment Scam Interception* is engineered as a distributed, service-oriented system designed for extreme concurrency, sub-45ms execution determinism, and zero-loss audit durability.

This document presents the **C4 Container-Level System Architecture**, illustrating the boundaries, internal microservices, data stores, inter-process communication protocols, and execution topology.

---

## 2. C4 Container Diagram

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           C4 CONTAINER-LEVEL ARCHITECTURE                                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [CONTAINER 1: CLIENT APPLICATION RUNTIME (Zone 0)]                                                                     │
│  ┌──────────────────────────────────────────────────┐  ┌────────────────────────────────────────────────────────────┐ │
│  │ Host Mobile Banking Application (Android / iOS)  │  │ Guardian Mobile Telemetry SDK (FEAT-01)                    │ │
│  │ - Initiates Payment & Transaction Entry UI       │  │ - Ephemeral In-RAM Touch Hesitation & Cadence Collector    │ │
│  │ - Enforces Pre-PIN Navigation & PIN Pad Lockdown │  │ - Call Status & Remote Screen Broadcast Hook (FEAT-02)     │ │
│  └────────────────────────┬─────────────────────────┘  │ - Dynamic Typology De-Biasing Dialog Engine (FEAT-05/06) │ │
│                           │                            └────────────────────────────┬───────────────────────────────┘ │
│                           │ ISO 20022 Payment Request                               │ mTLS 1.3 Telemetry Payload      │
│                           ▼                                                         ▼                                 │
├───────────────────────────┼─────────────────────────────────────────────────────────┼─────────────────────────────────┤
│ [CONTAINER 2: IN-LINE SWITCH GATEWAY (Zone 1/2)]                                    │                                 │
│  ┌────────────────────────▼─────────────────────────┐                               │                                 │
│  │ Core Banking Switch Routing Node                 │                               │                                 │
│  │ - Intercepts In-Line ISO 20022 Authorizations    │                               │                                 │
│  │ - Enforces Hard 50ms Switch Timeout Deadline     │                               │                                 │
│  │ - Fast Fail-Open Circuit Breaker Interceptor     │                               │                                 │
│  └────────────────────────┬─────────────────────────┘                               │                                 │
│                           │ Synchronous gRPC Call (≤45ms Budget)                    │                                 │
│                           ▼                                                         │                                 │
│ [CONTAINER 3: CORE GUARDIAN SCORING ENGINE (Zone 2)]                                │                                 │
│  ┌──────────────────────────────────────────────────┐                               │                                 │
│  │ Ingress Feature Assembler & Deserializer         │◄──────────────────────────────┘                                 │
│  │ - Merges Real-Time Telemetry with Baseline Cache │                                                                 │
│  └────────────────────────┬─────────────────────────┘                                                                 │
│                           │ Pre-Warmed In-Memory Read (≤10ms)                                                         │
│                           ▼                                                                                           │
│  ┌──────────────────────────────────────────────────┐  ┌────────────────────────────────────────────────────────────┐ │
│  │ Low-Latency In-Memory Cache (Redis Sentinel Tier)│  │ Real-Time Model Inference Runtime (FEAT-03)                │ │
│  │ - 90-Day Sender Behavioral Profile               │  │ - Multi-Class LightGBM / GBDT Feature Evaluator            │ │
│  │ - Beneficiary Risk Scores & Negative VPA Lists   │  │ - Conformal Uncertainty Estimator (CAP-04)                 │ │
│  │ - Pre-Computed 32-D GNN Node Embeddings          │  │ - Execution Latency: ≤15ms                                 │ │
│  └──────────────────────────────────────────────────┘  └────────────────────────────┬───────────────────────────────┘ │
│                                                                                     │ Continuous Risk & Uncertainty   │
│                                                                                     ▼                                 │
│  ┌──────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────┐ │
│  │ Decoupled Policy Rules & Directive Engine (FEAT-04)                                                               │ │
│  │ - Evaluates Calibrated Risk vs. Proportional Value Boundaries                                                     │ │
│  │ - Assigns Operational Directive: ALLOW (L1) / INFORM (L2) / INTERVENE (L3) / HOLD (L4)                           │ │
│  │ - Generates Causal Factor Attribution Codes for Downstream Display & Adverse Action                               │ │
│  └────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                           │                                                                                           │
│                           ├──────────────────────────────────┐ Asynchronous Event Stream (Zero In-Line Drag)          │
│                           │ Returns Directive (≤45ms)        ▼                                                        │
│                           ▼                    [CONTAINER 4: ASYNCHRONOUS DATA & EVENT STREAMING BUS (Zone 3)]        │
│                Switch Gateway Clears           ┌────────────────────────────────────────────────────────────────────┐ │
│                or Prompts Client UI            │ Distributed Kafka / Redpanda Cluster                               │ │
│                                                │ - Topic: `transaction.decisions.v1` (Audit Persistence)            │ │
│                                                │ - Topic: `mule.containment.alerts.v1` (Sub-60s Dispatch)           │ │
│                                                │ - Topic: `telemetry.drift.v1` (Unsupervised Clustering)            │ │
│                                                └─────────┬──────────────────────────┬───────────────────────┬───────┘ │
│                                                          │                          │                       │         │
│                                                          ▼                          ▼                       ▼         │
│ [CONTAINER 5: POST-SETTLEMENT FABRIC]          [CONTAINER 6: AUDIT VAULT] [CONTAINER 7: SOC WORKBENCH]                │
│  ┌──────────────────────────────────────────┐  ┌────────────────────────┐ ┌─────────────────────────────────────────┐ │
│  │ Mule Containment Dispatcher (FEAT-10)    │  │ Immutable WORM Logger  │ │ Web-Based Analyst Console (FEAT-11)     │ │
│  │ - Dispatches ISO 20022 camt.056 Advisories│  │ - SHA-256 Block Chaining│ - Case Synthesis Packages & Graphs      │ │
│  │ - Transmits to Beneficiary Bank (≤60s)   │  │ - 7-Year Legal Retent. │ │ - Dual-Control Hold Override Gateway    │ │
│  └──────────────────────────────────────────┘  └────────────────────────┘ └─────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. High-Level System Plane Responsibilities

1. **Client Plane (Mobile Container)**: Operates within the Android/iOS sandboxed runtime; captures non-invasive touch dynamics and communication states; intercepts UI navigation prior to PIN entry.
2. **In-Line Scoring Plane (High-Performance Edge)**: Stateless Go / C++ / ONNX microservices deployed in redundant Kubernetes pods behind Envoy proxies; terminates switch calls in $\le 45\text{ms}$.
3. **Cache & State Plane (In-Memory Redis Tier)**: High-availability Redis cluster storing 90-day relational baselines, beneficiary risk metrics, and pre-computed GNN embeddings, guaranteeing sub-10ms reads.
4. **Streaming Plane (Distributed Kafka Backbone)**: Asynchronous event fabric decouples heavy operations (audit logging, model retraining, inter-bank dispatch) from the in-line clearance path.
5. **Recovery & Governance Plane**: Dispatches out-of-band mule containment advisories to receiving institutions, stores cryptographically non-repudiable audit logs, and powers the SOC workbench.

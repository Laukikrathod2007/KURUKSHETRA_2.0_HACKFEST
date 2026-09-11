# Architectural Drivers & Quality Attribute Specifications

## 1. Executive Summary & Epistemic Scope

System architectures in safety-critical financial environments are not shaped by aesthetic preference; they are governed by uncompromising **Architectural Drivers**—the non-functional requirements, physical latency ceilings, statutory legal constraints, and availability mandates that dictate every structural boundary.

In strict compliance with Part 2 of the Phase 8 mandate, this document defines the primary quality attributes and performance budgets governing the *Agentic Guardian*.

---

## 2. Global Quality Attribute Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          ARCHITECTURAL DRIVERS MATRIX                                            │
├────┬─────────────────────────────┬───────────────────────────┬───────────────────────────────────────────────────┤
│ ID │ Quality Attribute           │ Metric / Target Bound     │ Requirement / Statutory Source                    │
├────┼─────────────────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ QA1│ In-Line Response Latency    │ P99 ≤ 45ms; P99.9 ≤ 48ms  │ REQ-TIME-001, REQ-NFR-001 (National Switch SLA)   │
│ QA2│ Mission-Critical Availab.   │ 99.999% (≤5.26m down/yr)  │ REQ-RES-001, REQ-NFR-004 (Core Banking Mandate)   │
│ QA3│ Horizontal Throughput       │ 15,000 TPS baseline       │ REQ-NFR-003 (National Festival Peak Volume)       │
│    │                             │ 45,000 TPS peak capacity  │                                                   │
│ QA4│ Customer Insult Ceiling     │ Insult Ratio ≤ 10:1       │ REQ-SAF-002, REQ-ERR-001 (Consumer Churn Bounds)  │
│ QA5│ Fail-Open Determinism       │ Circuit break in ≤ 5ms    │ REQ-RES-002, REQ-INT-007 (Gridlock Prevention)    │
│ QA6│ Post-Settlement Alert SLA   │ Message dispatch ≤ 60s    │ REQ-TIME-003, REQ-FUNC-010 (Mule Cash-Out Ceiling)│
│ QA7│ Data Privacy & Ephemeral RAM│ Zero raw biometric disks  │ REQ-PRIV-002, REQ-PRIV-003 (GDPR Art 9, DPDP Act) │
│ QA8│ Cryptographic Non-Repudiat. │ 100% SHA-256 block chains │ REQ-SAF-006, REQ-OBS-001 (SR 11-7, ECOA Audit)    │
└────┴─────────────────────────────┴───────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. Deep Analysis of Critical Drivers

### 3.1 Driver QA1: The In-Line Latency Budget ($\le 45\text{ms}$)
- **The Physical Constraint**: National payment clearing switches (e.g., NPCI UPI, US FedNow, UK Faster Payments) enforce a hard timeout threshold of $50\text{ms}$ to $100\text{ms}$ on third-party security interceptors. Any gateway taking longer than $50\text{ms}$ is dropped, resulting in payment drops or forced unmonitored clearance.
- **The Budget Partitioning**:
  - Network Ingress & TLS 1.3 Termination: $\le 8\text{ms}$.
  - Request Deserialization & Schema Validation: $\le 2\text{ms}$.
  - In-Memory Baseline Feature Lookup (Redis Cache): $\le 10\text{ms}$.
  - Multi-Modal ML Inference (GBDT / ONNX Runtime): $\le 15\text{ms}$.
  - Conformal Calibration & Policy Directive Routing: $\le 5\text{ms}$.
  - Network Serialization & Egress Response: $\le 5\text{ms}$.
  - **Total P99 Target**: $\mathbf{45\text{ms}}$ (Leaves $5\text{ms}$ buffer before hard $50\text{ms}$ switch drop).

---

### 3.2 Driver QA2: Five-Nines High Availability (99.999%)
- **The Operational Constraint**: Because the Guardian operates in-line with retail payment authorization, a complete outage of the Guardian directly halts all consumer payment processing across the host bank.
- **Architectural Response**:
  - Stateless inference microservices deployed across multi-zone Kubernetes clusters.
  - Active-active multi-region replication with automatic BGP Anycast DNS failover.
  - Dedicated **Fast Fail-Open Circuit Breaker (`FEAT-09`)**: If the entire Guardian cluster becomes completely unreachable or loses power, the switch connector defaults to `Allow` in $\le 5\text{ms}$, guaranteeing that bank customers can continue purchasing food, gas, and emergency services even during severe data center disasters.

---

### 3.3 Driver QA3: Scalability & Peak Throughput (15,000 to 45,000 TPS)
- **The Scale Constraint**: During national holiday shopping peaks (e.g., Diwali in India, Singles Day in Asia, Cyber Monday in the US), payment clearing networks experience sudden $3\times$ to $5\times$ traffic surges.
- **Architectural Response**:
  - Zero synchronous disk I/O on the critical in-line path. All telemetry logging, audit records, and feature streams are dispatched via asynchronous, non-blocking ring buffers to distributed Kafka brokers.
  - Horizontal pod auto-scaling triggered by CPU utilization ($>60\%$) and ingress queue depth.

---

### 3.4 Driver QA4: Strict Epistemic Customer Insult Ceiling ($\le 10:1$)
- **The Economic Constraint**: Retail banks operate under intense commercial pressure. If a fraud engine blocks 50 legitimate payments for every 1 scam caught (insult ratio 50:1), commercial churn and executive pressure force the bank to disable the system.
- **Architectural Response**:
  - Formal decoupling of risk probability from epistemic uncertainty (`CAP-04`).
  - Automated dynamic threshold adjustments that downgrade high-uncertainty flags from hard holds to non-blocking ambient advisories, mathematically bounding the insult ratio $\le 10:1$.

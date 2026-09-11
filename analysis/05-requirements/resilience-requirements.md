# Availability and Resilience Requirements in Scam Defense

## 1. Executive Summary & Context

A real-time payment defense system operates in the critical path of national financial commerce. If a central risk scoring gateway crashes or hangs, it does not merely degrade a fraud detection tool; it threatens to **shut down the entire payment switch**, preventing millions of citizens from buying food, fueling vehicles, or conducting commerce. Conversely, if a system fails insecurely by crashing and dropping all fraud filters unconditionally, it creates a catastrophic exploitation window for criminal syndicates.

In strict compliance with Part 14 of the Phase 5 mandate, this document defines the **availability, resilience, and failure-handling requirements** of the system. Without prescribing specific cloud clusters, container orchestrators, or load balancers, it specifies the required behaviors of the system under operational failure, network partitions, partial data availability, and downstream outages.

---

## 2. Failure Domain Taxonomy

```text
                     SYSTEM FAILURE AND RECOVERY MODES
                     
  Failure Scenario                      Required System Resilience Behavior
  ──────────────────────────────────────────────────────────────────────────────────────────
  Central Risk Engine Timeout (>50ms)   Immediate graceful fail-open to local compiled baseline;
                                        Zero payment message drops at the switch.
  ──────────────────────────────────────────────────────────────────────────────────────────
  Telecom / External API Failure        Graceful fallback; score computed using local telemetry;
                                        Tagged with `EXTERNAL_SIGNAL_UNAVAILABLE`.
  ──────────────────────────────────────────────────────────────────────────────────────────
  Client Network Intermittency          Client buffers interaction events locally in volatile RAM;
                                        Transmits aggregated feature vector upon reconnect.
  ──────────────────────────────────────────────────────────────────────────────────────────
  De-Biasing Dialogue Engine Crash      Isolated client exception; UI reverts to standard PIN
                                        screen without crashing host mobile banking app.
```

---

## 3. Detailed Resilience Requirement Specifications

### 3.1 REQ-RES-001: Five-Nines High Availability for In-Line Clearance
- **Statement**: System components operating within the synchronous in-line payment clearance path MUST maintain an operational service availability of **not less than 99.999% (five nines)**, corresponding to less than 5.26 minutes of unscheduled downtime per calendar year.
- **Rationale**: National instant payment rails (NPCI UPI, FedNow, Faster Payments) enforce five-nines uptime standards. Any in-line dependency that fails to meet this availability benchmark will be disconnected by the central switch operator to protect payment network liquidity.
- **Traceability Link**: VG-02 (Switch Latency vs. Deep AI), REQ-STK-004; Central Bank Switch Operating Rules.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The in-line risk scoring gateway maintains an audited uptime availability $\ge 99.999\%$ across a continuous 365-day rolling measurement window under continuous production traffic.
- **Dependencies**: High-availability clustering; multi-region active-active deployment capabilities.
- **Epistemic Uncertainty**: None; non-negotiable financial infrastructure standard.

---

### 3.2 REQ-RES-002: Deterministic Fast Fail-Open Isolation
- **Statement**: If the in-line risk scoring engine fails to return a completed risk score payload within **45 milliseconds**, or experiences an internal software panic, the gateway MUST execute an automated, non-blocking fail-open directive, allowing the payment message to proceed to switch clearance under default baseline limit rules while asynchronously logging an operational failure alert.
- **Rationale**: A hard network timeout (drop) creates severe customer panic, checkout abandonment, and switch queue congestion. It is operationally preferable to let a single suspicious transaction pass under baseline limits than to drop thousands of legitimate transactions during an infrastructure blip.
- **Traceability Link**: REQ-TIME-001 (Switch Budget), REQ-INT-007 (Safe Failure); Phase 3 `real-time-systems.md`.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Under simulated gateway failure injection (100% simulated node failure), the payment gateway releases 100% of pending payment messages within $\le 50\text{ms}$ without dropping a single switch message.
- **Dependencies**: In-process circuit breakers; local fallback evaluation tables.
- **Epistemic Uncertainty**: Fraud exposure window during prolonged core infrastructure degradation.

---

### 3.3 REQ-RES-003: Partial Data and Feature Degradation Tolerance
- **Statement**: The risk decision engine MUST be capable of producing valid, calibrated risk scores and action directives even when up to 50% of optional external features (such as telecom active call status, behavioral biometrics, or inter-bank payee age indicators) are missing, delayed, or corrupt.
- **Rationale**: Mobile network transit is inherently unstable; carriers experience outages, and client OS permissions vary. A system that crashes or refuses to score transactions when a single feature is missing cannot operate in real-world consumer mobile environments.
- **Traceability Link**: VG-05 (Telephony Silo), REQ-CTX-004; Dimension B & C.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The decision engine successfully outputs a valid risk tier and decision directive when tested against evaluation datasets with 50% randomly masked feature inputs, dynamically widening its confidence interval without throwing unhandled exceptions.
- **Dependencies**: Imputation pipelines or ensemble trees natively supporting missing feature branches.
- **Epistemic Uncertainty**: Mathematical bounds of accuracy degradation under missing feature combinations.

---

### 3.4 REQ-RES-004: Client-Side UI Thread Isolation and Crash Immunity
- **Statement**: System SDKs and components executing on client mobile devices MUST execute within isolated background execution threads, ensuring that any crash, memory overflow, or unhandled exception within the fraud defense module CANNOT crash the host mobile banking application, freeze the user interface, or prevent basic manual account navigation.
- **Rationale**: If a third-party fraud security SDK crashes the banking app while an elderly user is trying to check their balance or make a payment, user trust is destroyed, and the bank faces catastrophic app store rating collapse.
- **Traceability Link**: REQ-FUNC-001 (Mobile Intake), REQ-SAF-001; Mobile App Engineering Standards.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Simulated fatal exceptions (e.g., out-of-memory errors, null pointer panics) injected into the client defense SDK are caught and contained within the module boundary, with zero host application termination across 100,000 automated mobile test sessions.
- **Dependencies**: Mobile OS process isolation; robust top-level exception handling.
- **Epistemic Uncertainty**: Behavioral variance across highly fragmented Android OEM operating systems.

---

### 3.5 REQ-RES-005: Stale Intelligence Resilience and Graceful Aging
- **Statement**: The system MUST be capable of operating continuously and generating defensible decisions even if external threat intelligence feeds, national cybercrime blacklists, or graph embeddings become disconnected or stale for up to 72 consecutive hours.
- **Rationale**: National cybercrime portals (e.g., I4C, IC3) experience scheduled maintenance and API outages. The local banking defense system must remain self-reliant and resilient, avoiding systemic lockups when external feeds are unavailable.
- **Traceability Link**: VG-06 (SOC Triage), Phase 3 Institutional Mechanisms.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: In simulated 72-hour air-gapped test environments, the system continues to process and score real-time transactions using local cached baselines and rules, maintaining at least 70% of its baseline scam interception accuracy.
- **Dependencies**: Local cached threat tables; graceful time-decay weighting on stale indicators.
- **Epistemic Uncertainty**: Optimal decay curve for stale graph embeddings over multi-day disconnection periods.

---

## 4. Summary Matrix of Resilience Requirements

| Requirement ID | Resilience Area | Core System Mandate | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-RES-001** | High Availability | $99.999\%$ service availability matching switch SLAs | **MUST** | VG-02, Switch SLA |
| **REQ-RES-002** | Timeout Behavior | Deterministic sub-45ms fail-open circuit breaking | **MUST** | REQ-TIME-001, Safety |
| **REQ-RES-003** | Partial Data | Graceful scoring with up to 50% missing feature inputs | **MUST** | VG-05, REQ-CTX-004 |
| **REQ-RES-004** | Client Stability | Complete thread isolation; zero host mobile app crashes | **MUST** | REQ-FUNC-001, UX |
| **REQ-RES-005** | Stale Data | Self-reliant operation for up to 72h during external feed outages | **MUST** | Institutional Limits |

These resilience requirements ensure that the system operates as robust, mission-critical infrastructure capable of surviving network partitions, external API outages, and hardware faults without compromising payment network availability or consumer safety.

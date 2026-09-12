# Non-Functional Requirements in Scam Defense Systems

## 1. Executive Summary & Purpose

Non-functional requirements (NFRs) define the **quality attributes, operational constraints, and performance boundaries** that the system must satisfy to be viable in production. In payment defense, non-functional requirements are not optional polish; they are **hard operational gates**. A mathematically brilliant scam detection algorithm that requires 300ms of inference time is dead on arrival at a 50ms payment switch; an intervention screen that causes UI thread stutter on budget smartphones will be promptly removed by retail mobile banking teams.

In strict compliance with Part 18 of the Phase 5 mandate, this document defines the **non-functional requirements** of the system across eight critical quality dimensions. It avoids generic software engineering boilerplate, focusing strictly on the unique operational, performance, and legal constraints governing financial fraud and scam interception systems.

---

## 2. Master Non-Functional Requirements Matrix

```text
                     EIGHT CORE QUALITY ATTRIBUTE DOMAINS
                     
  [1. Performance & Latency]           [2. Throughput & Scalability]
  In-line scoring P99 < 80ms           Sustained 50,000 TPS peak load
  
  [3. Reliability & Availability]      [4. Security & Tamper Resistance]
  99.999% availability (Five Nines)    Hardware attestation & anti-tamper
  
  [5. Privacy & Data Minimization]     [6. Usability & Ergonomics]
  Ephemeral client sensor processing   Sub-second UI response, grade-6 text
  
  [7. Modularity & Maintainability]    [8. Auditability & Observability]
  Decoupled policy hot-reloading       Immutable append-only forensic logs
```

---

## 3. Detailed Non-Functional Requirement Specifications

### 3.1 Performance & Latency Requirements

#### REQ-NFR-001: In-Line Risk Decision Latency Profile
- **Statement**: System components operating within the synchronous in-line clearance path MUST return completed risk payloads with an end-to-end execution latency of:
  - **P50 $\le 20\text{ milliseconds}$**
  - **P95 $\le 35\text{ milliseconds}$**
  - **P99 $\le 75\text{ milliseconds}$**
  under sustained production load, enforcing a hard circuit-breaker drop at 80ms.
- **Rationale**: Real-time payment clearing switches (NPCI, FedNow, Faster Payments) enforce hard network timeout drops of 2,000ms–2,500ms for total end-to-end processing. The fraud risk engine is allocated an internal processing window of <50ms.
- **Traceability Link**: VG-02 (Switch Latency vs. Deep AI), REQ-TIME-001; Phase 3 `real-time-systems.md`.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Continuous load testing at 20,000 TPS over 48 hours demonstrates a verified P99 latency $\le 75\text{ms}$ with zero transactions exceeding the 80ms timeout ceiling.

---

#### REQ-NFR-002: Client-Side Interaction Response and Overhead
- **Statement**: Mobile client defense components MUST execute interaction telemetry processing, feature aggregation, and de-biasing UI rendering with a local response latency of **less than 1,000 milliseconds**, consuming **not more than 5% of peak host CPU** and **not more than 35 megabytes of RAM** on baseline mobile hardware.
- **Rationale**: Any client-side SDK that induces visible UI stutter, delays button clicks, or accelerates battery drain will be rejected by mobile banking product teams and uninstalled by consumers.
- **Traceability Link**: REQ-FUNC-001, REQ-TIME-002; Mobile Banking Usability Standards.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: On benchmarked entry-level mobile devices (e.g., Android devices with 3GB RAM and quad-core processors), client SDK execution introduces zero dropped UI frames (maintains 60 FPS) and consumes $\le 3.5\%$ average CPU during active typing sessions.

---

### 3.2 Throughput & Scalability Requirements

#### REQ-NFR-003: High-Throughput Horizontal Scalability
- **Statement**: The backend risk scoring infrastructure MUST scale horizontally to sustain an aggregate transactional throughput of **not less than 50,000 transactions per second (TPS)** with linear resource scaling, supporting burst spikes up to **75,000 TPS** during national retail holidays or flash-sale events without degrading latency SLAs.
- **Rationale**: National instant payment rails (such as India's UPI, which processes over 500 million daily transactions) regularly experience colossal volume surges during festive periods. The risk engine must scale elastically without becoming a liquidity choke point.
- **Traceability Link**: REQ-STK-004 (Central Switch SLA); NPCI System Capacity Benchmarks.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Distributed load testing demonstrates linear throughput scaling up to 75,000 TPS with zero degradation in P99 latency SLAs (<75ms) and zero message loss.

---

### 3.3 Reliability & Availability Requirements

#### REQ-NFR-004: Mission-Critical Service Availability (Five Nines)
- **Statement**: The core risk scoring and transaction clearance gateway MUST maintain an operational service availability of **not less than 99.999% (five nines)** across a rolling 365-day window, permitting not more than 5.26 minutes of total unscheduled service interruption per year.
- **Rationale**: Core banking settlement rails are classified as Critical National Infrastructure (CNI). Unscheduled outages disrupt commerce and invite severe regulatory penalties from central banks.
- **Traceability Link**: REQ-STK-004, REQ-RES-001; Central Bank Infrastructure Operating Standards.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Audited production uptime logs demonstrate $\ge 99.999\%$ continuous availability across all active clearing gateway nodes over a 12-month evaluation period.

---

### 3.4 Security & Cryptographic Integrity Requirements

#### REQ-NFR-005: Cryptographic Assurance and Zero Plain-Text Exposure
- **Statement**: All inter-service communications, telemetry streams, and database persistence layers MUST utilize cryptographically certified cipher suites (minimum AES-256 at rest, TLS 1.3 in transit with forward secrecy), ensuring that zero unencrypted customer financial identifiers, account numbers, or behavioral biometric vectors are exposed across physical or logical boundaries.
- **Rationale**: Compliance with PCI-DSS v4.0, Federal Information Processing Standards (FIPS 140-3), and banking secrecy legislation.
- **Traceability Link**: REQ-SEC-001, REQ-PRIV-004; Financial Security Regulations.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Comprehensive third-party penetration testing and automated static/dynamic code analysis confirm 100% compliance with TLS 1.3 and AES-256 encryption, with zero plain-text PII detected in memory dumps, network packets, or persistent logs.

---

### 3.5 Usability & Cognitive Ergonomics Requirements

#### REQ-NFR-006: Accessible and Non-Disruptive Cognitive Ergonomics
- **Statement**: All user-facing risk communication, interactive prompts, and de-biasing dialogs MUST adhere to Web Content Accessibility Guidelines (WCAG 2.2 Level AA), utilize plain language evaluated at or below a **Grade 6 reading comprehension level**, and provide multi-language localization supporting all official regional languages in active operational jurisdictions.
- **Rationale**: Scam victims include elderly, digitally illiterate, and non-native language speakers. Complex technical warnings or jargon-laden disclaimers fail to communicate risk to the most vulnerable cohorts.
- **Traceability Link**: VG-04 (Pre-Coaching Failure), REQ-SAF-003, REQ-EXP-001; Consumer Accessibility Standards.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: 100% of consumer-facing dialog strings score $\ge 70$ on the Flesch-Kincaid Reading Ease scale (Grade 6 level or simpler) and pass formal accessibility audits across high-contrast, screen-reader, and dynamic font-scaling modes.

---

### 3.6 Modularity & Maintainability Requirements

#### REQ-NFR-007: Modular Policy Decoupling and Dynamic Configuration
- **Statement**: The system architecture MUST maintain strict modular separation between core feature extraction, mathematical risk modeling runtimes, and business policy rule evaluation, enabling administrators to deploy updated risk thresholds, cooling-off parameters, and negative watchlists across production nodes within **less than 15 minutes** without requiring system compilation, service restarts, or switch downtime.
- **Rationale**: Scammers adapt their money mule accounts and phishing handles rapidly. Modifying policy parameters must be an agile operational workflow, decoupled from heavy model retraining and deployment cycles.
- **Traceability Link**: VG-08 (Model Governance), REQ-ADP-002, REQ-ADP-005; Software Maintainability Standards.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Policy configuration changes committed via the administrative interface propagate to active inference runtimes across all distributed cluster nodes within $\le 15\text{ minutes}$ with zero dropped transactions.

---

### 3.7 Observability & Forensic Auditability Requirements

#### REQ-NFR-008: Immutable Append-Only Audit Trail Persistence
- **Statement**: All transactional decision dossiers, model version hashes, user interaction records, and manual human overrides MUST be committed to an append-only, tamper-evident storage medium with a write-acknowledgement latency of **less than 100 milliseconds** post-decision, maintaining retrievability for a statutory compliance retention window of **not less than 5 years**.
- **Rationale**: Essential for legal non-repudiation, regulatory compliance audits under Federal Reserve SR 11-7, and providing admissible forensic evidence for law enforcement criminal prosecutions.
- **Traceability Link**: REQ-FUNC-011, REQ-OBS-001, REQ-SAF-006; Statutory AML Retention Rules.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Automated integrity audits verify that historical audit records cannot be modified, overwritten, or deleted by any administrative role, and historical queries by transaction UTR return within $\le 3.0\text{ seconds}$ across a 5-year archive.

---

## 4. Summary Matrix of Non-Functional Requirements

| Requirement ID | Quality Domain | Core Performance / Constraint Mandate | Priority | Traceability Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-NFR-001** | Performance | In-line switch latency P50 $\le 20\text{ms}$, P99 $\le 75\text{ms}$ | **MUST** | VG-02, Switch SLA |
| **REQ-NFR-002** | Mobile UX | Client response $<1,000\text{ms}$; $\le 5\%$ CPU overhead; 60 FPS | **MUST** | REQ-FUNC-001 |
| **REQ-NFR-003** | Scalability | Sustained $50,000\text{ TPS}$ with burst capacity up to $75,000\text{ TPS}$ | **MUST** | REQ-STK-004 |
| **REQ-NFR-004** | Availability | Five nines ($99.999\%$) availability; $<5.26\text{m}$ downtime/year | **MUST** | REQ-RES-001 |
| **REQ-NFR-005** | Security | TLS 1.3 in transit, AES-256 at rest; zero plain-text PII | **MUST** | REQ-SEC-001 |
| **REQ-NFR-006** | Usability | WCAG 2.2 AA accessibility; Grade-6 reading comprehension | **MUST** | REQ-SAF-003 |
| **REQ-NFR-007** | Maintainability | Decoupled policy hot-reloading within $<15\text{ minutes}$ | **MUST** | REQ-ADP-005 |
| **REQ-NFR-008** | Auditability | Immutable append-only audit persistence with 5-year retention | **MUST** | REQ-OBS-001 |

These non-functional requirements establish the strict engineering quality benchmarks, performance boundaries, and statutory constraints within which any eventual solution architecture must operate.

# Non-Functional Requirements: Latency SLAs, Scalability, and Security Standards

---

## 1. Executive Understanding
Non-Functional Requirements (NFRs) define the **operational physics, resilience boundaries, and legal constraints** within which GuardianPay must function. In payment infrastructure, failing an NFR is just as catastrophic as a functional software bug: a model that catches 100% of scams but takes 4 seconds to execute will be immediately uninstalled by banks due to payment switch timeouts.

Where numerical targets represent industry standards or statutory rules (e.g. NPCI switch timeouts, DPDP Act penalties), they are cited directly. Where targets are derived by the engineering team, they are explicitly designated as **[Engineering Assumptions]**.

---

## 2. Performance & Latency SLAs

### NFR-LAT-01: Hot-Path Synchronous Latency SLA
- **Requirement:** The synchronous hot-path evaluation pipeline (sensor extraction + in-memory cache lookup + GBDT inference) MUST complete in **$\le 15\text{ms}$ at the 99th percentile (p99)** on commodity server hardware or edge gateways.
- **Rationale:** NPCI payment switches enforce a hard end-to-end timeout of 2,000ms. Banking risk engines are allocated a maximum budget of 35ms.
- **Priority:** MUST HAVE.
- **Source:** Phase 1 NPCI UPI Procedural Guidelines & Phase 2 Real-Time Decisioning.
- **Validation Criteria:** Micro-benchmarked under 5,000 concurrent requests; p99 latency does not exceed 15.0ms.

### NFR-LAT-02: Warm-Path Pre-PIN Review Latency SLA
- **Requirement:** When the selective agentic investigator is invoked, total reasoning, tool querying, and challenge preparation MUST complete in **$\le 2,200\text{ms}$ (p95)**, operating strictly within the human pre-PIN review dwell window.
- **Rationale:** Exploits the natural 1.5s–4.0s pause while the user confirms transaction details, ensuring zero perceived UI freezing.
- **Priority:** MUST HAVE.
- **Source:** [Engineering Assumption based on human payment dwell telemetry].
- **Validation Criteria:** 95% of agent investigations return structured friction directives within 2,200ms.

---

## 3. Throughput & Scalability

### NFR-SCL-01: National Peak Burst Capacity
- **Requirement:** The server-side risk gateway MUST scale horizontally to sustain a peak throughput of **$\ge 25,000\text{ Transactions Per Second (TPS)}$** with zero queue overflow.
- **Rationale:** Indian payment infrastructure experiences massive traffic spikes during national festivals (Diwali, Dhanteras) and monthly salary cycles.
- **Priority:** MUST HAVE.
- **Source:** Phase 1 Operational Context & Phase 2 Scalability.
- **Validation Criteria:** Load-tested in simulated distributed environment using Locust/k6; sustains 25,000 TPS for 30 minutes without memory leaks.

### NFR-SCL-02: Stateless Horizontal Compute Architecture
- **Requirement:** All hot-path risk workers and warm-path agent gateways MUST be completely stateless, maintaining zero in-memory session locks. State must reside exclusively in distributed low-latency caches (Redis / Aerospike).
- **Rationale:** Enables instant auto-scaling via Kubernetes HPA (Horizontal Pod Autoscaler) within $<15\text{seconds}$ of a traffic surge.
- **Priority:** MUST HAVE.
- **Validation Criteria:** Pods can be terminated or spawned dynamically under full load with zero dropped transactions.

---

## 4. Availability & Reliability

### NFR-REL-01: High Availability ("Five Nines")
- **Requirement:** The Guardian service MUST achieve an operational availability of **$99.999\%$ ("Five Nines")**, equating to less than 5.26 minutes of unscheduled downtime per calendar year.
- **Rationale:** Aligns with national financial critical infrastructure standards mandated by the Reserve Bank of India.
- **Priority:** MUST HAVE.
- **Source:** RBI Master Directions on Digital Payment Security.
- **Validation Criteria:** Measured across dual-region active-active cloud clusters (Mumbai and Hyderabad data centers).

### NFR-REL-02: Tiered Autonomous Graceful Degradation
- **Requirement:** In the event of a total cloud network partition, edge gateway failure, or AI service outage, the client SDK MUST automatically trip its circuit breaker within $\le 120\text{ms}$ and fall back to **Autonomous On-Device Local Heuristics**.
- **Rationale:** Cloud outages must NEVER freeze national payment rails or cause broad checkout failures.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Reliability (Section 06-production/reliability.md).
- **Validation Criteria:** Simulating a cloud crash results in 0ms failure to local rules: low-value transfers pass, remote APK blocks remain active.

---

## 5. Privacy & Data Protection

### NFR-PRV-01: DPDP Act 2023 Statutory Compliance
- **Requirement:** The system MUST strictly enforce the Data Minimization and Purpose Limitation principles of the **Digital Personal Data Protection (DPDP) Act 2023**.
- **Rationale:** Non-compliance incurs statutory penalties up to ₹250 Crore and immediate regulatory shutdown.
- **Priority:** MUST HAVE.
- **Source:** DPDP Act 2023 (Act No. 22 of 2023, Government of India).
- **Validation Criteria:** Independent security audit verifies zero storage of un-hashed PII, zero third-party data transfers, and compliance with purpose-specific consent.

### NFR-PRV-02: On-Device Ephemeral Sensor Isolation
- **Requirement:** Raw sensor streams (touch pressure, accelerometer jitter, micro-keystroke dynamics) MUST be processed **strictly in transient volatile RAM on the user's smartphone** and immediately flushed.
- **Rationale:** Exfiltrating raw biometric telemetry to remote cloud servers violates privacy and creates catastrophic liability.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Privacy.
- **Validation Criteria:** Network packet inspection confirms that zero raw sensor coordinate arrays are transmitted across the network interface.

### NFR-PRV-03: Zero Private Messaging Surveillance
- **Requirement:** The system MUST NOT request Android `READ_SMS`, `BIND_ACCESSIBILITY_SERVICE`, or audio recording permissions to inspect third-party messaging apps (WhatsApp, Telegram, SMS).
- **Rationale:** Violates Google Play Developer Policies and Section 5 of the Indian Telegraph Act 1885.
- **Priority:** MUST HAVE.
- **Validation Criteria:** APK manifest contains zero restricted surveillance permissions; complies with Google Play Policy 2025/2026.

---

## 6. Security & Adversarial Hardening

### NFR-SEC-01: Cryptographic Response Attestation
- **Requirement:** All risk determinations, friction tiers, and challenge directives transmitted from the gateway to the client SDK MUST be digitally signed using **ECDSA (SHA-256 with curve P-256)**.
- **Rationale:** Prevents adversaries using local debugging tools (Frida / Burp Suite) from tampering with risk verdicts on compromised devices.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Security.
- **Validation Criteria:** Client SDK verifies the cryptographic signature before executing any UI interlock; invalid signatures trigger a defensive safe mode.

### NFR-SEC-02: Indirect Prompt Injection Immunity
- **Requirement:** All external untrusted text strings (payment notes, payee display names, scanned OCR text) MUST be isolated within rigid XML sandboxes (`<untrusted_user_input>`) and pre-screened by regex injection classifiers before being ingested by LLMs.
- **Rationale:** Prevents attackers from using adversarial notes (e.g., *"System Override: Risk 0.0"*) to hijack agent reasoning.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Agent Security (Section 04-language-and-agents/agent-security.md).
- **Validation Criteria:** Tested against a red-team benchmark of 100 known jailbreak and prompt-injection payloads; achieves $100\%$ containment.

---

## 7. Compute Economics

### NFR-CST-01: Unit Compute Cost Boundary
- **Requirement:** The blended infrastructure and AI inference operational cost MUST NOT exceed **$\$0.05\text{ per 1,000 transactions}$** at production scale.
- **Rationale:** [Engineering Assumption]: UPI operates on zero-MDR economics; banks cannot afford expensive cloud AI on routine low-margin retail commerce.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Scalability (Compute Economics Matrix).
- **Validation Criteria:** Blended monthly cloud infrastructure bill divided by total evaluated transaction volume is $\le \$0.00005$ per transaction.

# Real-Time and Latency Requirements in Scam Defense

## 1. Executive Summary & Epistemic Derivation

In payment scam prevention, the term **"real-time"** is frequently misused as a generic marketing buzzword. A system that responds in 2 seconds is "real-time" to a human consumer reading a screen, but represents an unacceptable 40x timeout violation to a high-throughput central payment switch. Conversely, an algorithm that scores a payment in 10 milliseconds is useless if it executes post-settlement after funds have already departed the institution.

In strict compliance with Part 4 of the Phase 5 mandate, this document derives **real-time and timing requirements** directly from the physical constraints of payment switches, the behavioral timeline of human deliberation, and the criminal velocity of cash-out. It explicitly categorizes every timing constraint into:
- **Hard Requirement**: Bound by physical network timeouts, protocol specifications, or irreversible events.
- **Desirable Target**: Empirically optimal operational goal.
- **Engineering Assumption**: Parameter based on current hardware and network baseline benchmarks.
- **Unknown Requiring Validation**: Open empirical parameter requiring field calibration.

---

## 2. The Three Operational Epochs and Their Latency Budgets

```text
                     THE THREE OPERATIONAL LATENCY BUDGETS
                     
  [Epoch 1: Pre-Flight Mobile Drafting Window]
  Total Session Duration: 2 to 5 Minutes
  ├─ User enters amount, beneficiary details, reads prompts
  ├─ Permissible Cognitive Reasoning Latency: 500ms – 2,000ms
  └─ [LOCUS FOR DEEP REASONING & CONVERSATIONAL DE-BIASING]
  
  [Epoch 2: In-Line Payment Clearance Switch]
  Total End-to-End Budget: 2,000ms – 2,500ms (Hard Switch Timeout)
  ├─ Total Risk Scoring Window: <50ms – 100ms (P99 < 80ms)
  └─ [LOCUS FOR FAST TABULAR RULES & COMPILED DECISION TREES ONLY]
  
  [Epoch 3: Post-Settlement Streaming Containment]
  Total Criminal Cash-Out Window: 60s – 180s (ATM / Crypto off-ramp)
  ├─ Maximum Inter-Bank Containment Dispatch: <30s (Desirable: <15s)
  └─ [LOCUS FOR STREAMING MULE GRAPH TRAVERSAL & AUTO-FREEZES]
```

---

## 3. Detailed Real-Time Requirement Specifications

### 3.1 REQ-TIME-001: In-Line Payment Switch Risk Evaluation Budget
- **Statement**: Any component of the risk decision system that executes directly within the synchronous payment clearing path MUST return a complete risk score payload within **less than 50 milliseconds (P99 < 80ms)** from the moment the payment message arrives at the risk gateway.
- **Nature of Constraint**: **Hard Requirement**.
- **Rationale**: National instant payment switches (e.g., NPCI UPI, FedNow, UK Faster Payments) enforce hard end-to-end round-trip network timeouts of 2,000ms to 2,500ms. Banking risk engines are strictly allocated an internal processing window of <50ms. Any engine breaching 100ms causes immediate message drops and switch timeout errors.
- **Traceability Link**: VG-02 (Switch Latency vs. Deep AI Paradox); Phase 3 `real-time-systems.md`.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Under stress testing of 10,000 transactions per second (TPS), the in-line risk scoring engine delivers risk outputs with a P95 latency $\le 35\text{ms}$ and a P99 latency $\le 75\text{ms}$.
- **Dependencies**: In-memory feature caching; pre-compiled model evaluation (e.g., ONNX / TensorRT / compiled C++ decision trees).
- **Epistemic Uncertainty**: None; this is an established mathematical and protocol specification.

---

### 3.2 REQ-TIME-002: Pre-Flight Interactive Cognitive Response Budget
- **Statement**: System components operating on the client mobile device during the pre-flight drafting session MUST deliver conversational de-biasing prompts, interactive speed bumps, and contextual guidance within **500ms to 1,500ms** of a user interaction trigger, with an absolute upper bound of 2,000ms.
- **Nature of Constraint**: **Engineering Assumption** (Human-Computer Interaction standard).
- **Rationale**: During active user interaction, human cognitive psychology establishes that response delays under 1,000ms feel seamless and conversational. Delays exceeding 2,000ms disrupt user thought flow, induce frustration, and trigger app abandonment.
- **Traceability Link**: VG-01 (Intent Decoupling), VG-04 (Habituation & Pre-Coaching); Phase 2 Temporal Analysis (Epoch 2).
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The client interaction engine presents contextual guidance or de-biasing dialog responses within $\le 1,200\text{ms}$ in 95% of user interactions on standard 4G/5G mobile networks.
- **Dependencies**: Client-side edge processing or lightweight streaming API connection to backend advisory service.
- **Epistemic Uncertainty**: Mobile network latency variance in rural or degraded cellular environments (K-GAP-01).

---

### 3.3 REQ-TIME-003: Post-Settlement Streaming Mule Containment Dispatch
- **Statement**: Automated inter-bank threat notifications and beneficiary credit hold requests MUST be generated and dispatched to receiving institutions or central clearing networks within **less than 30 seconds (Desirable Target: <15 seconds)** of transaction settlement confirmation.
- **Nature of Constraint**: **Hard Requirement** (Irreversible event horizon).
- **Rationale**: Criminal syndicates begin automated multi-hop smurfing within 30 to 60 seconds, and ATM cash withdrawals occur within 3 to 10 minutes. Containment messaging arriving after 90 seconds finds an account balance of $0.00.
- **Traceability Link**: VG-06 (Mule Velocity vs. SOC Triage), IND-GAP-02 (Freeze Window); FM-07.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: For all transactions flagged as critical-risk post-settlement, an authenticated containment payload is emitted to the streaming bus within $\le 20\text{ms}$ of scoring, and reaches the counterparty API endpoint within $\le 15\text{s}$ in over 95% of simulated test runs.
- **Dependencies**: Event-driven streaming message bus (e.g., Apache Kafka / Apache Flink); standardized inter-bank hold APIs.
- **Epistemic Uncertainty**: The physical latency of receiving bank core banking systems in posting holds to account ledgers upon API receipt.

---

### 3.4 REQ-TIME-004: External Telecommunications Signaling Query Timeout
- **Statement**: Any external query dispatched to telecommunications carrier gateways (e.g., querying active voice call state via GSMA Open Gateway APIs) during pre-flight drafting MUST enforce a strict timeout ceiling of **not more than 400 milliseconds**, failing gracefully to an internal default state upon timeout expiration.
- **Nature of Constraint**: **Desirable Target & Engineering Assumption**.
- **Rationale**: External third-party carrier APIs incur public internet transit and carrier gateway processing. Allowing unbounded polling could hang the banking application checkout flow.
- **Traceability Link**: VG-05 (Telephony & Communicative Silo), REQ-STK-007; Phase 3 Independent Discoveries.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: If a telecom carrier API fails to return a response within 400ms, the system terminates the query, logs a timeout event, and proceeds with payment processing using local client heuristics without blocking the user.
- **Dependencies**: Carrier API integration; non-blocking asynchronous HTTP client.
- **Epistemic Uncertainty**: Carrier gateway availability and response time percentiles under high carrier network load.

---

### 3.5 REQ-TIME-005: Dynamic Policy and Negative Intelligence Propagation Latency
- **Statement**: The system MUST propagate newly approved threat indicators, compromised UPI IDs, suspect telephone numbers, and heuristic rule adjustments to all active real-time scoring nodes globally within **less than 60 minutes (Desirable Target: <15 minutes)** of administrative sign-off.
- **Nature of Constraint**: **Desirable Target**.
- **Rationale**: Scammers rotate disposable mule accounts and phishing handles rapidly. A blacklist update taking 24 hours to deploy is ineffective against 6-hour mule funnels.
- **Traceability Link**: VG-04 (Pre-Coaching), Dimension I (Adaptability Retraining Lag); Phase 4 Adaptability.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: An administrative blacklist update payload deployed at $T=0$ is verified active and evaluating incoming transactions on 100% of production gateway nodes at $T+45\text{ minutes}$.
- **Dependencies**: Distributed configuration management pipeline; in-memory cache invalidation.
- **Epistemic Uncertainty**: Cross-region cache synchronization consistency under distributed network partitions.

---

## 4. Summary Matrix of Real-Time Requirements

| Requirement ID | Operational Epoch | Timing Parameter | Nature of Constraint | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **REQ-TIME-001** | In-Line Clearance | $< 50\text{ms}$ execution latency (P99 $< 80\text{ms}$) | **Hard Requirement** | **MUST** |
| **REQ-TIME-002** | Pre-Flight Session | $500\text{ms} - 1,500\text{ms}$ cognitive response latency | **Engineering Assumption** | **MUST** |
| **REQ-TIME-003** | Post-Settlement | $< 30\text{s}$ automated containment dispatch (Target $<15\text{s}$) | **Hard Requirement** | **MUST** |
| **REQ-TIME-004** | Pre-Flight External | $\le 400\text{ms}$ external carrier query timeout | **Desirable Target** | **SHOULD** |
| **REQ-TIME-005** | Intelligence Update | $< 60\text{ minutes}$ threat intelligence propagation | **Desirable Target** | **SHOULD** |

By establishing these explicit, grounded timing bounds, the real-time requirements ensure that future system architecture designs respect the physical latency limits of payment clearing while aggressively exploiting the temporal windows of user drafting and streaming post-settlement.

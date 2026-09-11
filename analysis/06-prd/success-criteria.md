# MVP Success Criteria & Evaluation Framework

## 1. Executive Summary & Evaluation Philosophy

A bare-minimum MVP cannot evaluate its success merely by demonstrating that its code compiles or that a mock UI button responds to clicks. In high-stakes payment fraud defense, success is defined by **multidimensional objective metrics** spanning workflow integrity, machine learning accuracy, cognitive intervention efficacy, system safety, and technical performance.

In strict compliance with Part 17 of the Phase 6 mandate, this document establishes the **Six-Pillar Success Framework** for evaluating the *Agentic Guardian* MVP.

---

## 2. The Six-Pillar Success Framework

```text
                               THE SIX-PILLAR SUCCESS FRAMEWORK
                               
  1. Product Workflow Success ──────► End-to-end transaction pipeline executes without state stalls.
  2. Detection Accuracy       ──────► Separates coerced scams from benign payments (PR-AUC / Recall).
  3. Intervention Timing      ──────► Intercepts user strictly before PIN entry; breaks tunnel vision.
  4. Safety & Insult Bounds   ──────► Customer insult ratio bounded ≤10:1; zero hospital blockades.
  5. User Cognitive Success   ──────► Coerced users understand warnings and can cancel in ≤10 seconds.
  6. Technical SLA Compliance ──────► In-line P99 latency ≤45ms; fail-open execution in ≤5ms.
```

---

## 3. Detailed Success Metrics and Evaluation Targets

### 3.1 Pillar 1: Product Workflow Success
- **Evaluation Question**: Does the complete end-to-end transaction journey function reliably from pre-flight telemetry capture through settlement and out-of-band mule alert dispatch?
- **Objective Success Criteria**:
  - **100% Pipeline Completion**: 10,000 synthetic transaction cycles execute through the entire 4-stage lifecycle without unhandled fatal exceptions.
  - **State Machine Integrity**: 100% of transactions resolve into a terminal state (`SETTLED`, `ABORTED`, or `HELD`); zero orphaned in-flight payments.
  - **Deduplication Parity**: 100% of duplicate transaction payloads with identical idempotency keys return matching decision envelopes in $\le 2\text{ms}$.

---

### 3.2 Pillar 2: Detection & Typology Success
- **Evaluation Question**: Does the system accurately distinguish authorized scams from benign transactions under extreme class imbalance?
- **Objective Success Criteria**:
  - **Recall at Fixed FPR**: $\ge 82\%$ recall on authorized social engineering scams at a false positive rate $\le 0.5\%$ on benchmark test splits.
  - **PR-AUC Metric**: Precision-Recall Area Under the Curve $\ge 0.76$ under realistic $1:1,000$ synthetic class imbalance test datasets.
  - **Typology Discrimination**: Correctly classifies identified scams into specific typologies (Digital Arrest, Investment, Romance) with macro F1-score $\ge 0.80$.

---

### 3.3 Pillar 3: Intervention Timing & Placement Success
- **Evaluation Question**: Does protective intervention occur at the exact temporal point where it can prevent financial loss?
- **Objective Success Criteria**:
  - **Strict Pre-Authorization Enforcement**: In 100% of Level 3 and Level 4 events, the cognitive challenge or hold screen renders **strictly prior to presenting the payment PIN pad**.
  - **Breakthrough Rate**: Under simulated coercive prompting, dynamic de-biasing dialogues convince $\ge 65\%$ of test participants to cancel fraudulent transfers.
  - **Mule Alert Velocity**: Out-of-band ISO 20022 `camt.056` hold advisories are constructed, signed, and dispatched within $\le 60\text{s}$ of settlement confirmation in $\ge 98\%$ of cleared high-risk cases.

---

### 3.4 Pillar 4: Safety & Insult Prevention Success
- **Evaluation Question**: Does the system avoid catastrophic operational harms and unwarranted customer harassment?
- **Objective Success Criteria**:
  - **Customer Insult Ceiling**: The measured Customer Insult Ratio remains $\le 10:1$ across all standard transaction volumes (`REQ-SAF-002`).
  - **Zero Life-Safety Blockades**: 100% of emergency bypass requests on held transactions execute in $\le 500\text{ms}$, releasing funds to the switch (`REQ-SAF-001`).
  - **Essential Utility Protection**: 0.0% false-positive hard holds on recognized recurring utility bills and payroll distributions (`REQ-ERR-002`).

---

### 3.5 Pillar 5: User & Ergonomic Success
- **Evaluation Question**: Can the intended consumer and fraud analyst understand and act upon the system's outputs?
- **Objective Success Criteria**:
  - **Reading Accessibility**: Consumer causal risk notices score $\ge 70$ on the Flesch Reading Ease scale (equivalent to 6th-grade reading level).
  - **Unhurried Engagement**: 100% of users in Level 3 flows are held by the 5-second cognitive dwell gate, preventing rapid accidental dismissal.
  - **SOC Case Review SLA**: Analysts reviewing synthesis packages complete case triage and decision dispatch in $\le 3\text{ minutes}$ average handle time (vs. 15-minute baseline).

---

### 3.6 Pillar 6: Technical Performance & SLA Compliance
- **Evaluation Question**: Does the software architecture satisfy national payment switch performance constraints?
- **Objective Success Criteria**:
  - **Latency Profile**: P95 latency $\le 35\text{ms}$; P99 latency $\le 45\text{ms}$; P99.9 $\le 48\text{ms}$ under a sustained concurrent load of 15,000 TPS (`REQ-NFR-001`).
  - **Fail-Open Isolation**: Latency timeouts ($>45\text{ms}$) execute fail-open in $\le 5\text{ms}$, ensuring zero switch connection drops (`REQ-RES-002`).
  - **Client Overhead**: Client mobile SDK adds $\le 35\text{ms}$ to app launch time, consumes $\le 2\%$ CPU during drafting, and uses $\le 20\text{MB}$ RAM (`REQ-NFR-002`).
  - **Audit Immutability**: 100% of decisions commit cryptographically signed SHA-256 blocks to WORM storage with zero data loss (`REQ-NFR-008`).

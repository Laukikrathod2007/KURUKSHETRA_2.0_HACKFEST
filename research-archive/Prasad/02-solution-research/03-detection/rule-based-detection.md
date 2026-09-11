# Rule-Based Detection: Deterministic Controls, Velocity Thresholds, and Heuristic Boundaries

---

## 1. Executive Understanding
In production payment infrastructure, **rule-based systems remain the first, fastest, and most legally defensible line of defense**. While modern machine learning and AI receive disproportionate academic attention, over 70% of production fraud interventions in tier-1 banking systems are triggered by deterministic rules.

Deterministic rules provide three operational guarantees that probabilistic models cannot match:
1. **Sub-5ms Execution Latency:** O(1) or O(log N) evaluation directly in the hot transactional path.
2. **Absolute Auditability:** Deterministic trigger logic produces unambiguous reason codes (`RULE_VELOCITY_EXCEEDED`, `RULE_KNOWN_MULE_HIT`) required for regulatory reporting under RBI Master Directions.
3. **Zero Stochastic Hallucination:** Rules never infer or guess; they evaluate boolean predicates against exact state.

However, rule-based systems suffer from severe structural vulnerabilities: **rule explosion, high maintenance friction, and susceptibility to adversarial threshold gaming**.

---

## 2. Taxonomy of Production Rule Classes in UPI

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION RULE TAXONOMY IN UPI                                 │
├───────────────────┬───────────────────────────────────┬──────────────┬────────────────────┤
│ RULE CLASS        │ OPERATIONAL MECHANISM             │ TYPICAL LAT. │ REGULATORY / POLICY│
├───────────────────┼───────────────────────────────────┼──────────────┼────────────────────┤
│ **1. Statutory /  │ • Hard ₹1,00,000 daily limit      │ < 1 ms       │ RBI / NPCI Master  │
│   Mandatory**     │ • ₹2,000 new account 24h cap      │              │ Circular on Digital│
│                   │ • New device 24h cooling-off      │              │ Payment Security   │
├───────────────────┼───────────────────────────────────┼──────────────┼────────────────────┤
│ **2. Velocity &   │ • Sliding window counter (Redis)  │ 2 - 5 ms     │ Bank Internal Risk │
│   Frequency**     │ • Max 10 transactions / 24 hours  │              │ Policy (Fraud Ops) │
│                   │ • Beneficiary inward velocity cap │              │                    │
├───────────────────┼───────────────────────────────────┼──────────────┼────────────────────┤
│ **3. Entity &     │ • National I4C / CFCFRMS hash hit │ 1 - 3 ms     │ MHA Cybercrime     │
│   Blacklist**     │ • Bank-internal mule VPA register │ (in-memory)  │ Coordination Centre│
│                   │ • Malicious APK package detection │              │                    │
├───────────────────┼───────────────────────────────────┼──────────────┼────────────────────┤
│ **4. Heuristic    │ • IF (New Payee == True) AND      │ 3 - 8 ms     │ Dynamic TPAP Risk  │
│   Compound**      │   (Active Call == True) AND       │              │ Filter Engine      │
│                   │   (Amount > ₹15,000) -> CHALLENGE │              │                    │
└───────────────────┴───────────────────────────────────┴──────────────┴────────────────────┘
```

---

## 3. Deep Architectural Analysis of Rule Engines

### High-Throughput In-Memory Rule Evaluation
Production engines (such as customized Drools, Go-based rule trees, or in-memory Rust rule evaluators) compile rules into abstract syntax trees (AST) or Directed Acyclic Graphs (DAG):
- Velocity counters rely on Redis sliding-window sorted sets (`ZREMRANGEBYSCORE` + `ZCARD`), computing rolling transaction counts within 3ms.
- Entity sets (blacklists of phone numbers, VPAs, IFSC codes) reside in distributed in-memory bloom filters or Redis sets with sub-millisecond lookup latency.

### The Adversarial Failure Mode: Threshold Gaming
Because rules evaluate static boundaries, organized fraud syndicates systematically probe and map rule thresholds:
- If a bank sets an intervention trigger at **₹50,000**, the scammer instructs the victim to transfer **₹49,990**, or execute **five sequential transfers of ₹9,900**.
- If a velocity rule triggers at **5 transfers per hour**, the scammer spaces transfers across **15-minute intervals** or routes them across multiple victim bank accounts.

```
                  ATTACKER EVASION OF STATIC THRESHOLD RULES
  [ Bank Rule: Block transfer if Single Amount >= ₹50,000 ]
                           │
                           ▼
  [ Attacker Instruction to Victim: "Transfer ₹49,500 now, and ₹49,500 after 1 hour" ]
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Result: Transaction 1 (₹49,500) -> ALLOWED (Rule Evaded)│
  │ Result: Transaction 2 (₹49,500) -> ALLOWED (Rule Evaded)│
  │ Total Loss to Victim: ₹99,000                           │
  └─────────────────────────────────────────────────────────┘
```

---

## 4. Rule Complexity and Operational Decay

As new scam variants emerge, fraud operations teams reflexively append new rules to the engine. Over 24–36 months, this creates **Rule Sprawl**:
1. **Rule Overlap & Redundancy:** Multiple legacy rules fire on the same condition, skewing reason-code telemetry.
2. **False-Positive Accumulation:** Obsolete rules designed for seasonal scams (e.g., Diwali gift lottery scams) remain active year-round, generating thousands of spurious transaction rejections.
3. **Evaluation Latency Creep:** Evaluating 5,000+ sequential rules pushes latency beyond the 50ms budget, degrading user checkout speed.

---

## 5. Epistemic Assessment for PS09

| Dimension | Rule-Based System Capability | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Detection of APP Scams** | **Extremely Poor (15% coverage):** Legitimate users authorizing payments bypass static velocity and threshold limits. | Rules cannot be the primary scam intelligence layer; they are blind to psychological coercion. |
| **Hot Path Filtering** | **Exceptional (Sub-5ms):** Instantly filters known safe regular transfers and hard-blocks confirmed blacklisted entities. | Must form the **outermost triage shield** before any expensive ML or agent is invoked. |
| **Regulatory Compliance** | **Indispensable:** Mandatory enforcement of RBI circular daily limits and mandatory cooling-off windows. | Core deterministic compliance rules must remain hardcoded and non-negotiable. |
| **Contextual Awareness** | **Zero:** Cannot parse linguistic urgency, psychological pressure, or social engineering intent. | Must hand off ambiguous transactions to contextual models. |

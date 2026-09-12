# Intervention and De-Biasing Requirements in Scam Defense

## 1. Executive Summary & Epistemic Protocol

In Authorized Push Payment (APP) scams, **detection without effective intervention is completely sterile**. A risk engine may compute with 99% certainty that a payment is a scam, but if the resulting intervention consists of a generic static disclaimer that the victim dismisses in 600 milliseconds, the victim's funds are lost.

In strict compliance with Part 7 of the Phase 5 mandate, this document defines the **required capabilities and constraints of the system's intervention mechanisms**. It focuses entirely on **WHAT the intervention must achieve**—disrupting cognitive coercion, neutralizing scammer pre-coaching, scaling friction proportionally to risk, and enabling temporal cooling-off—without prematurely dictating specific UI designs, wireframes, or graphical modal features.

---

## 2. The Intervention Progression Model

```text
                      THE PROGRESSIVE INTERVENTION SPECTRUM
                      
  Low Risk / High Confidence                      Critical Risk / High Confidence
  Zero Disruption                                 Compulsory Containment
  ─────────────────────────────────────────────────────────────────────────────►
  Tier 1: Silent Pass   Tier 2: Advisory Cue   Tier 3: De-Biasing     Tier 4: Time-Lock
  - Standard clearance  - Non-blocking badge   - Interactive dialogue - 2h to 24h delay
  - Friction = 0        - Friction = Minimal   - Friction = Moderate  - Friction = High
```

---

## 3. Detailed Intervention Requirement Specifications

### 3.1 REQ-INT-001: Pre-Authorization Intervention Window
- **Statement**: Any intervention directed at de-biasing the payer or preventing uncoerced payment authorization MUST execute within the client-side pre-authorization window—prior to the final cryptographic signing and dispatch of the payment message to the clearing switch.
- **Rationale**: Instant payment switches (UPI, FedNow, Pix) execute final, irrevocable settlement in <2.5 seconds. Once the payment instruction is cleared by the switch, funds cannot be unilaterally recalled. Intervention to stop the victim must occur *before* the transaction leaves the device.
- **Traceability Link**: VG-01 (Intent Decoupling), VG-02 (Switch Latency Ceiling); Phase 2 Temporal Analysis (Epoch 2).
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The intervention framework is capable of halting transaction dispatch and engaging the user on the client device prior to the transmission of the authorization signature payload.
- **Dependencies**: Client-side application execution control; mobile UI hooks.
- **Epistemic Uncertainty**: None; this is an architectural prerequisite for real-time prevention.

---

### 3.2 REQ-INT-002: Habituation-Resistant Dynamic Risk Communication
- **Statement**: The system MUST communicate transaction risk and counterparty discrepancies using dynamic, variable presentation mechanics that resist neurological habituation, inattentional blindness, and automated muscle-memory dismissal.
- **Rationale**: Over 85% of mobile banking users dismiss static warning screens in under 800ms without conscious reading. Warnings that rely on repetitive, static text fail to reach the executive prefrontal cortex (System 2).
- **Traceability Link**: VG-04 (Habituation & Pre-Coaching Failure), Dimension F; *ACM TOCHI* Behavioral Studies.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: In usability evaluation trials, the risk communication mechanism achieves an average user interaction dwell time of $\ge 5.0\text{ seconds}$ and prevents automated single-tap dismissal within $<1,500\text{ms}$.
- **Dependencies**: Dynamic content rendering capabilities within client interface.
- **Epistemic Uncertainty**: Longitudinal habituation decay rates across repeated exposures over 12 to 24 months (K-GAP-02).

---

### 3.3 REQ-INT-003: Pre-Coaching Evasion and Cognitive Grounding
- **Statement**: For transactions exhibiting high-risk social engineering indicators (Tier 3 or 4), the intervention mechanism MUST present non-standard, randomized cognitive verification prompts that cannot be anticipated or scripted in advance by a remote scammer.
- **Rationale**: Scammers train on standard bank questionnaires and instruct victims: *"Select 'Personal Payment to Family'."* Non-standard cognitive challenges (such as requiring the user to identify contradictions between the transfer reason and payee account type) break the scammer's scripted coaching tree.
- **Traceability Link**: VG-04 (Pre-Coaching Failure), FM-05; NASC Victim Audits.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The system prompts users with dynamically randomized cognitive checks that increase voluntary transaction abandonment by $\ge 35\%$ in simulated coached impersonation tests compared to static multiple-choice questionnaires.
- **Dependencies**: Dynamic reasoning prompt generation engine.
- **Epistemic Uncertainty**: User comprehension rates across diverse digital literacy and linguistic backgrounds.

---

### 3.4 REQ-INT-004: Proportional Micro-Friction Calibration
- **Statement**: The system MUST scale user friction proportionally to the calculated risk tier and transaction value, ensuring that low-risk or routine transactions experience zero operational delay, while high-risk, high-value transfers receive progressive cognitive friction.
- **Rationale**: Uncalibrated, binary friction (blocking transactions outright) creates severe customer insult (40:1 ratio), paralyzes call centers, and triggers commercial checkout abandonment.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), Dimension J; REQ-STK-002.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Under production transaction volume distributions, the intervention system introduces active user friction to fewer than **1.0% of total transactions**, while capturing $\ge 75\%$ of total scam-exposed dollar value.
- **Dependencies**: Calibrated risk scoring engine (REQ-DEC-001); risk-to-friction mapping policy.
- **Epistemic Uncertainty**: Merchant conversion sensitivity thresholds across different retail payment categories.

---

### 3.5 REQ-INT-005: Temporal Cooling-Off Delays (Time-Locks)
- **Statement**: For critical-risk transactions exceeding configured value thresholds to unestablished counterparties, the system MUST be capable of enforcing a temporary, reversible cooling-off delay (such as a 2-hour or 24-hour hold on funds release) while maintaining the payer's ability to cancel the transfer unconditionally during the hold period.
- **Rationale**: Breaking the acute physiological arousal and System 1 panic induced by scammers requires time. Field evidence demonstrates that a mandatory 2-hour pause breaks the scammer's live phone grip and allows the victim's rational executive function to recover.
- **Traceability Link**: VG-01 (Intent Decoupling), Dimension B (Temporal Gaps); Phase 3 Commonwealth Bank Case Study.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The system successfully places an outbound funds hold on flagged transfers, provides the user with an automated cancellation mechanism, and logs an average scam loss reduction of $\ge 40\%$ on high-value transfers subjected to cooling-off delays.
- **Dependencies**: Sending bank core ledger support for pending/held debit authorization states.
- **Epistemic Uncertainty**: Commercial tolerance of retail merchants and consumer regulatory restrictions on delaying instant payments.

---

### 3.6 REQ-INT-006: External Cognitive Circuit Breaker (Collaborative Guardian Authorization)
- **Statement**: The system SHOULD support an optional, configurable collaborative authorization mechanism for vulnerable or designated accounts, requiring transactions exceeding specific risk thresholds to receive secondary co-authorization from a pre-appointed trusted third party (e.g., family guardian or fiduciary) before funds clear.
- **Rationale**: Completely eliminates the single-point-of-failure psychological vulnerability of social engineering. When an elderly or manipulated victim is entirely under a scammer's trance, an uncompromised external perspective is the most reliable way to halt the transfer.
- **Traceability Link**: IND-GAP-04 (Solitary User Interface Deficit); Phase 3 Independent Discoveries (Collaborative Custody).
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: Designated collaborative accounts cannot debit funds exceeding threshold values without a cryptographic co-signature or push approval from the registered trusted guardian endpoint within a configurable response window.
- **Dependencies**: Multi-party authorization protocol; secondary user registration workflow.
- **Epistemic Uncertainty**: User adoption rates and legal liability frameworks for secondary third-party approvers.

---

### 3.7 REQ-INT-007: Safe Failure and Unblocking Guarantees (Graceful Fail-Open)
- **Statement**: In the event of system communication timeouts, backend service unavailability, or degraded network connectivity, the intervention engine MUST fail safely, allowing legitimate transactions to proceed under default baseline security rules without indefinitely locking the user out of their financial assets.
- **Rationale**: An aggressive security system that traps legitimate consumers in unresolvable UI states or blocks emergency hospital payments during an infrastructure outage violates banking safety principles and triggers catastrophic regulatory penalties.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), Dimension H (Safety & Operational Risks); REQ-STK-002.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Upon experiencing an internal component failure or network timeout ($\ge 2,000\text{ms}$), the client application logs an incident record, displays a standard security disclosure, and permits standard payment authorization to proceed without hard blocking.
- **Dependencies**: Fault-tolerant client-side circuit breakers; automated failover state logic.
- **Epistemic Uncertainty**: Fraud exposure window during catastrophic central infrastructure degradation.

---

## 4. Summary Matrix of Intervention Requirements

| Requirement ID | Capability Area | Summary Specification | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-INT-001** | Timing Window | Execution strictly within pre-authorization window before switch dispatch | **MUST** | VG-01, VG-02 |
| **REQ-INT-002** | Communication | Habituation-resistant dynamic risk presentation ($\ge 5\text{s}$ engagement) | **MUST** | VG-04 |
| **REQ-INT-003** | De-Biasing | Randomized cognitive verification prompts defeating scammer pre-coaching | **MUST** | VG-04 |
| **REQ-INT-004** | Calibration | Proportional micro-friction limiting active challenges to $<1.0\%$ of volume | **MUST** | VG-07 |
| **REQ-INT-005** | Temporal Pause | Reversible cooling-off delays (2h–24h) with unconditional user cancellation | **MUST** | VG-01, Dim B |
| **REQ-INT-006** | Guardian Anchor | Optional collaborative co-authorization by designated trusted guardians | **SHOULD** | IND-04 |
| **REQ-INT-007** | Safety | Graceful fail-open behavior under infrastructure or network failure | **MUST** | VG-07, Safety |

These intervention requirements ensure that detected risk is translated into intelligent, persuasive, and calibrated action capable of breaking psychological deception without inflicting unmanageable commercial damage.

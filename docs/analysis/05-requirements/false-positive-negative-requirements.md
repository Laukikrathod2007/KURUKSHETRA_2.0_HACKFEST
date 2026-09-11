# False-Positive and False-Negative Trade-Off Requirements

## 1. Executive Summary & Epistemic Protocol

In academic machine learning benchmarks, performance is evaluated using symmetrical statistical aggregates (such as ROC-AUC or macro F1-score) where every error is treated as having identical cost. In real-world financial systems, however, **error costs are profoundly asymmetric and context-dependent**:
- A **False Negative** on a $50,000 digital arrest life-savings transfer causes total financial ruin to an elderly citizen and triggers massive regulatory reimbursement liability for the bank.
- A **False Positive** on a $50,000 corporate payroll batch paralyzes employee salaries and destroys commercial client relationships.
- A **False Positive** on a $15 grocery purchase insults a customer, delays checkout queues, and causes digital wallet churn.

In strict compliance with Part 11 of the Phase 5 mandate, this document translates the research findings into **system-level error trade-off requirements**. It establishes asymmetric error tolerance bounds, defines acceptable versus unacceptable error categories, and mandates reversible, proportional intervention mechanics.

---

## 2. The Asymmetric Cost-Utility Matrix

```text
                     THE ASYMMETRIC ERROR-COST MATRIX
                     
  Transaction Category              False Positive Consequence   False Negative Consequence
  ──────────────────────────────────────────────────────────────────────────────────────────
  High-Value ($10k+) New Payee      Mild user hesitation;         CATASTROPHIC:
                                    Acceptable trade-off          Life savings lost permanently
  ──────────────────────────────────────────────────────────────────────────────────────────
  Low-Value (<$50) Established      SEVERE INSULT:                Tolerable:
  Merchant / Utility Payment        Checkout abandonment          Minimal financial exposure
  ──────────────────────────────────────────────────────────────────────────────────────────
  Emergency / Medical Transfer      UNACCEPTABLE:                 Severe:
                                    Human physical harm           Standard scam risk
```

---

## 3. Detailed Error Trade-Off Requirement Specifications

### 3.1 REQ-ERR-001: Asymmetric Value-Weighted Error Tolerance
- **Statement**: The system MUST implement an asymmetric, value-weighted decision boundary where the acceptable false-positive rate dynamically scales with the potential financial loss:
  1. *Transactions $\ge \$10,000$ to unestablished payees*: The system MUST prioritize minimizing False Negatives (targeting $\ge 90\%$ scam catch rate), tolerating an active user challenge insult ratio of up to **15:1**.
  2. *Transactions $<\$100$ to repeat or verified payees*: The system MUST prioritize minimizing False Positives (targeting $<0.05\%$ challenge rate), tolerating higher false negatives on micro-amounts to eliminate checkout friction.
- **Rationale**: A $50,000 scam loss causes existential personal ruin, whereas a $15 scam causes minor inconvenience. Uniform thresholding either permits high-value scams or paralyzes low-value commerce.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), Dimension J; Phase 3 Evaluation Methods.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The system applies dynamic decision threshold curves that restrict active friction on sub-$100 transactions to $\le 0.05\%$ of volume, while capturing $\ge 85\%$ of scam transactions exceeding $10,000 in historical backtesting.
- **Dependencies**: Transaction valuation ingestion; dynamic threshold calibration module.
- **Epistemic Uncertainty**: Tuning threshold curves across varying socioeconomic demographics and regional currency scales.

---

### 3.2 REQ-ERR-002: Categorical Prohibition of Unacceptable False Positives
- **Statement**: The system MUST NOT apply disruptive intervention (such as transaction blocking, mandatory delays, or interactive speed bumps) to:
  1. Verified recurring utility bill payments (electricity, water, municipal gas).
  2. Verified payroll distributions to authenticated employee accounts.
  3. Internal transfers between accounts owned by the same authenticated individual at the same institution (me-to-me transfers).
- **Rationale**: These transaction classes possess zero empirical scam probability. Subjecting routine utility or payroll transfers to security friction creates pure customer insult with zero fraud-prevention benefit.
- **Traceability Link**: VG-07 (Customer Insult Ceiling); FM-08.
- **Priority**: **MUST (Negative Constraint)**.
- **Measurable Acceptance Condition**: Automated intervention rules enforce explicit whitelisting bypasses that guarantee zero active friction on verified utility, payroll, and intra-account transfers, maintaining a 0.0% false challenge rate on these categories.
- **Dependencies**: Merchant category verification (MCC); account ownership cross-referencing.
- **Epistemic Uncertainty**: Risk of scammers abusing merchant aggregator accounts to mimic utility bills.

---

### 3.3 REQ-ERR-003: Reversibility Guarantee for Intermediate Interventions
- **Statement**: All intermediate security interventions executed prior to formal human adjudication (specifically: interactive verification dialogs, cognitive speed bumps, and cooling-off delays) MUST be completely reversible, ensuring that if an intervention was triggered by a False Positive, the legitimate user can complete the transfer without financial penalty, lost interest, or permanent account damage.
- **Rationale**: If a security challenge is irreversible or destructive (such as instantly closing an account or reporting a customer to credit bureaus upon suspicion), any false positive inflicts irreversible harm. Reversible friction bounds the cost of error.
- **Traceability Link**: VG-07 (Insult Ceiling), REQ-SAF-004; Phase 3 Comparative Matrix.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: 100% of transactions subjected to temporary cooling-off holds or interactive friction can be completed or cancelled by the authenticated user without incurring penalty fees, degraded credit scoring, or secondary administrative hurdles upon verification.
- **Dependencies**: Core banking support for reversible debit staging; transparent cancellation UI.
- **Epistemic Uncertainty**: None; foundational consumer protection requirement.

---

### 3.4 REQ-ERR-004: Proportional Friction Scaling and Cognitive Budgeting
- **Statement**: The system MUST enforce a **cognitive friction budget** that caps the maximum cumulative security friction experienced by a single user across a 30-day window, preventing friction fatigue and prompt habituation on accounts that frequently execute legitimate atypical transfers.
- **Rationale**: A business contractor who routinely pays new suppliers will quickly learn to click past security warnings with closed eyes if they are challenged on every single invoice. Friction must be budgeted across time.
- **Traceability Link**: VG-04 (Habituation & Pre-Coaching Failure), Dimension J; Behavioral Economics Data.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: If a user successfully passes two consecutive interactive cognitive challenges for new payees within 7 days without fraud escalation, the system transitions subsequent low-to-medium risk transfers to silent monitoring or lightweight advisory badges, preventing prompt fatigue.
- **Dependencies**: User multi-session interaction state tracking; progressive trust scoring.
- **Epistemic Uncertainty**: Risk of a scammer timing an attack precisely after a user has exhausted their friction budget.

---

### 3.5 REQ-ERR-005: Systematic Continuous Error Auditing and Calibration
- **Statement**: The system MUST continuously calculate, record, and publish rolling 7-day and 30-day operational error metrics—specifically: (a) Precision-Recall AUC (PR-AUC), (b) Recall at 0.01% FPR, (c) False Positive Ratio (Insult Ratio), and (d) Net Economic Loss in basis points—flagging automated alerts whenever the Customer Insult Ratio exceeds 12:1.
- **Rationale**: Prevents silent drift and threshold decay. If a model drifts and begins insulting 30 customers per scam caught, automated safeguards must trigger threshold recalibration before call centers collapse.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), VG-08 (Model Governance); Phase 3 Evaluation Methods.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Real-time observability pipelines update rolling PR-AUC and Insult Ratios every 60 minutes, automatically dispatching an operational alert to risk engineering teams if the rolling insult ratio breaches 12:1 over a 6-hour window.
- **Dependencies**: Real-time event streaming; automated metric computation pipelines.
- **Epistemic Uncertainty**: Delay in receiving verified negative labels to compute real-time PR-AUC accurately.

---

## 4. Summary Matrix of Error Trade-Off Requirements

| Requirement ID | Error Domain | Core Requirement Mandate | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-ERR-001** | Value Asymmetry | Asymmetric decision boundary: high recall on $\ge \$10\text{k}$; zero friction on $<\$100$ | **MUST** | VG-07, Dim J |
| **REQ-ERR-002** | Prohibited Errors | Zero active friction on utility bills, payroll, and intra-account transfers | **MUST (Neg)** | VG-07 |
| **REQ-ERR-003** | Reversibility | All intermediate interventions must be 100% reversible without penalty | **MUST** | VG-07, Safety |
| **REQ-ERR-004** | Friction Budgeting | Capping cumulative friction to prevent prompt habituation on active users | **SHOULD** | VG-04, Dim J |
| **REQ-ERR-005** | Error Auditing | Continuous monitoring of PR-AUC and auto-alert if insult ratio $>12:1$ | **MUST** | VG-07, VG-08 |

These error trade-off requirements ensure that the system's machine learning and decision boundaries are calibrated against real-world economic and human realities, maximizing scam prevention where losses are devastating while rigorously protecting routine commerce from disruptive false alarms.

# Evaluation Methods and Performance Metrics in Fraud Defense

## 1. Executive Summary & Context

Evaluating payment fraud and scam defense systems is fraught with methodological traps. In standard machine learning domains, metrics such as overall accuracy ($Accuracy = \frac{TP+TN}{Total}$) or Receiver Operating Characteristic Area Under Curve (ROC-AUC) are conventional benchmarks. In real-world payment networks, however, where scam transactions represent fewer than 1 in 10,000 events ($0.01\%$ prevalence), **standard accuracy is completely meaningless** (a trivial model predicting "always legitimate" achieves $99.99\%$ accuracy while stopping zero scams).

Furthermore, evaluating an authorized scam defense system cannot be reduced to a static machine learning confusion matrix. In production banking environments, an evaluation framework must measure the intersection of four competing vectors: **machine learning discriminative power**, **latency budgets**, **operational operational costs**, and **customer friction**.

This document systematically examines the evaluation methodologies and performance metrics utilized across academic literature, commercial vendor audits, and institutional payment networks.

---

## 2. Four-Tier Evaluation Framework

Modern financial institutions and rigorous researchers evaluate defense systems across four distinct operational tiers:

```
                      THE FOUR-TIER EVALUATION HIERARCHY
                      
  Tier 4: Business & Financial Impact (Loss Prevented, Net Fraud Basis Points)
  ▲
  │
  Tier 3: Operational & Human Impact (Alert Queue Triage, Investigator Saturation)
  ▲
  │
  Tier 2: Customer Experience & Friction (Insult Rate, Abandonment, Latency)
  ▲
  │
  Tier 1: Algorithmic & Statistical Quality (PR-AUC, Recall @ Max FPR, Calibration)
```

| Evaluation Tier | Focus Area | Primary Metrics | Stakeholder | Critical Failure If Ignored |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Algorithmic** | Statistical discrimination under extreme imbalance | Precision-Recall AUC (PR-AUC), Recall at fixed FPR (e.g., Recall @ 0.01% FPR), Brier Score | Data Science / ML Engineering | Massive false-positive avalanches; models that rank probabilities poorly. |
| **Tier 2: Customer UX** | User friction, checkout drop-off, brand trust | False Positive Ratio (FPR:TPR), Customer Insult Rate, Cart Abandonment Rate, P99 Latency | Product Management / Digital Channels | Legitimate users churn to competing banks due to aggressive, annoying security blocks. |
| **Tier 3: Operations** | Cost of human review, SOC workload | Daily Alert Volume, Time to Triage, Queue Clearance Latency, Analyst Burnout Rate | Fraud Operations / SOC Directors | Backlog explosion; alerts remain unreviewed until after money is cashed out. |
| **Tier 4: Financial/Legal**| Direct dollar loss, regulatory compliance | Value-Weighted Fraud Basis Points (bps), Net Fraud Loss, Reimbursement Cost, Regulatory Penalties | Chief Risk Officer (CRO) / Executive Board | Financial insolvency or heavy regulatory fines (e.g., UK PSR APP reimbursement mandates). |

---

## 3. Tier 1: Algorithmic & Statistical Metrics

### 3.1 Why ROC-AUC is Severely Misleading
Receiver Operating Characteristic (ROC) plots the True Positive Rate ($TPR = \frac{TP}{TP+FN}$) against the False Positive Rate ($FPR = \frac{FP}{FP+TN}$).
- In payment systems, the number of True Negatives ($TN$) is massive (billions of legitimate transactions).
- Consequently, the denominator for FPR ($FP + TN$) is dominated by $TN$.
- Even if a model generates 100,000 False Positives ($FP$), the calculated FPR remains deceptively microscopic (e.g., $FPR = \frac{100,000}{100,000 + 100,000,000} \approx 0.099\%$).
- An algorithm can report a stellar **ROC-AUC of 0.98** while flooding fraud analysts with 50 false alerts for every 1 true scam detected.

### 3.2 Precision-Recall AUC (PR-AUC) and Average Precision (AP)
Because PR curves evaluate Precision ($\frac{TP}{TP+FP}$) against Recall ($\frac{TP}{TP+FN}$), they explicitly isolate the positive minority class and are completely unaffected by the colossal volume of True Negatives.
- A model with high PR-AUC guarantees that when an alert is fired, the probability of it being a genuine scam is high.
- In academic benchmarks (such as Feedzai BAF), PR-AUC is recognized as the only statistically rigorous aggregate metric for imbalanced financial evaluation.

### 3.3 Recall at Constrained False-Positive Rate (Recall @ Fixed FPR)
In production banking operations, fraud executives do not operate across an entire curve; they operate under a hard, non-negotiable operational ceiling on false positives.
- The standard operational metric is **Recall @ 0.1% FPR** or **Recall @ 0.01% FPR**.
- *Definition*: *"If the bank permits at most 1 false alarm per 10,000 legitimate transactions, what percentage of total scams can the system catch?"*
- A model reporting 95% unconstrained recall is useless if achieving that recall requires a 1% FPR, which would paralyze a national payment switch processing 500 million daily transactions with 5 million false blocks per day.

### 3.4 Calibration & Probabilistic Reliability (Brier Score)
In downstream decision systems, risk scores are mapped directly to business policies (e.g., scores >0.8 trigger account freeze; 0.5–0.8 trigger phone call). If a model output of "0.85" does not actually correspond to an 85% empirical probability of fraud, hard thresholds fail.
- **Brier Score**: Measures mean squared difference between predicted probabilities and actual outcomes:
  $$BS = \frac{1}{N} \sum_{t=1}^N (f_t - o_t)^2$$
- Well-calibrated models enable dynamic economic utility optimization, balancing expected loss against expected customer friction.

---

## 4. Tier 2: Customer Friction & Experience Metrics

### 4.1 The False Positive Ratio (Customer Insult Ratio)
While data scientists measure FPR as a percentage, fraud operations teams measure the **False Positive Ratio (FPR : TPR)**, commonly known as the **Customer Insult Ratio**:
$$\text{Insult Ratio} = \frac{\text{False Positives (Legitimate Customers Blocked)}}{\text{True Positives (Scams Stopped)}}$$
- In unauthorized credit card fraud, industry-acceptable insult ratios range from **3:1 to 10:1** (blocking 3 to 10 innocent transactions to catch 1 card thief).
- In authorized push payment scams, because the user is authorizing the payment themselves, aggressive blocks feel insulting and paternalistic. If the insult ratio exceeds **5:1**, customer complaint volume spikes dramatically.

### 4.2 Checkout / Transaction Abandonment Rate
Measures the percentage of legitimate users who abandon their intended transaction when presented with security friction (e.g., a 2-minute cooling-off period, interactive quiz, or step-up verification):
$$\text{Abandonment Rate} = \frac{\text{Legitimate Users Dropping Out at Intervention}}{\text{Total Legitimate Users Challenged}}$$
- In digital commerce and instant P2P transfers, abandonment directly translates into lost merchant revenue, diminished platform engagement, and customer churn to alternative payment providers.

### 4.3 Intervention Latency Distribution (P50, P99, P99.9)
Latency cannot be summarized by a simple mean. In real-time clearing rails (UPI, FedNow):
- The **P99 and P99.9 tail latencies** determine whether transactions breach network switch timeout thresholds (e.g., 2,500ms total round-trip).
- If an AI inference engine has a mean latency of 20ms but a P99 latency of 3,000ms due to garbage collection or context retrieval, 1% of all customer transactions will fail outright with gateway timeout errors.

---

## 5. Tier 3: Operational & Human Review Metrics

### 5.1 Alert Volume vs. Queue Capacity (Analyst Saturation)
Financial crime investigation units (SOCs) operate with fixed human staffing.
- **Queue Saturation Threshold**: An average human fraud investigator can thoroughly review between **20 and 40 complex alerts per 8-hour shift**.
- If a detection system generates 1,000 alerts per day for a team of 10 analysts (capacity = 300 alerts/day), the alert backlog grows exponentially.
- *Operational Failure*: Unreviewed alerts sit in queues for 24 to 72 hours. In authorized instant push payments, funds are cashed out via mules within **90 seconds** of settlement. An alert reviewed 4 hours post-transaction is an alert that stops zero financial loss.

### 5.2 Mean Time to Triage (MTTT) and Mean Time to Containment (MTTC)
- **MTTT**: Time elapsed from alert generation to the initial review by a Tier-1 analyst.
- **MTTC**: Time elapsed from alert generation to the execution of a protective freeze on the recipient mule account or cancellation of outward wires.

---

## 6. Tier 4: Business, Financial & Regulatory Metrics

### 6.1 Value-Weighted vs. Count-Weighted Detection
Traditional machine learning evaluates **count-weighted recall** (treating a $5 scam transfer identically to a $500,000 corporate escrow scam). Financial institutions evaluate **value-weighted metrics**:
$$\text{Value-Weighted Recall} = \frac{\sum \text{Dollar Value of Intercepted Scams}}{\sum \text{Total Dollar Value of All Scams}}$$
- A system that catches 90% of all scam transactions by count (mostly $10 phishing tests) but misses the top 10% of high-value investment scams ($50,000+ each) may leave over **70% of total financial loss unmitigated**.

### 6.2 Net Fraud Loss in Basis Points (bps)
The universal banking metric for fraud performance is expressed in **basis points (bps)** of total transaction processing volume ($1 \text{ bps} = 0.01\% = \$100 \text{ loss per } \$1,000,000 \text{ processed}$):
$$\text{Fraud Bps} = \left( \frac{\text{Net Unrecovered Scam Losses}}{\text{Total Gross Payment Volume}} \right) \times 10,000$$
- Tier-1 global banks target net fraud rates between **0.5 bps and 2.5 bps**. Any defense system must demonstrate a measurable reduction in net bps without increasing customer insult operational costs beyond the saved basis points.

### 6.3 Net Economic Utility (NEU)
Advanced financial risk modeling synthesizes all four tiers into a unified economic objective function:
$$\text{NEU} = \sum \text{Losses Prevented} - \left( \sum \text{Investigator Review Costs} + \sum \text{False Positive Customer Churn Cost} + \sum \text{Regulatory Non-Compliance Fines} \right)$$
- An AI system is only economically viable in production if $\Delta \text{NEU} > 0$. If the cost of false positives and investigator alert triage exceeds the dollar volume of scams prevented, the system is economically unviable, regardless of its theoretical F1 score.

---

## 7. Concept Drift & Adversarial Robustness Evaluation

Because scammers continuously evolve their deception tactics, static cross-validation generates dangerously optimistic evaluations.

```text
                     TEMPORAL CONCEPT DRIFT EVALUATION
                     
  Traditional (Flawed) K-Fold Cross-Validation:
  [ RANDOM SHUFFLE OF ALL DATES ] ──► Future data leaks into training!
                                       Yields unrealistically high 0.99 AUC.
  
  Production-Grade Out-of-Time (OOT) Rolling Evaluation:
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │ Train: Month 1│─► Test: Month 2 │ │               │
  └───────────────┘ └───────────────┘ │               │
  ┌───────────────────────────────┐   │               │
  │ Train: Month 1 - 2            │──►│ Test: Month 3 │
  └───────────────────────────────┘   └───────────────┘
  Evaluates real-world performance degradation under adversarial tactics drift.
```

### 7.1 Out-of-Time (OOT) Temporal Splitting
- Never evaluate fraud systems using randomized k-fold cross-validation. Random shuffling causes severe **future-information leakage** (e.g., a mule account flagged on Day 15 is used to train on Day 3 data).
- Robust evaluation requires strict **chronological out-of-time evaluation**: train on Months 1–3, evaluate strictly on Month 4; retrain on Months 1–4, evaluate on Month 5.
- Demonstrates how fast model efficacy degrades as criminal rings deploy new typologies (e.g., shifting from fake electricity bill scams to digital arrest scams).

### 7.2 Adversarial Perturbation Testing
- Stress-testing models against intentional evasion tactics:
  - *Amount Smurfing*: Splitting a $10,000 transfer into 10 transfers of $999.
  - *Mule Aging*: Testing whether mule accounts dormant for 180 days bypass graph scoring.
  - *Lexical Obfuscation*: Changing payment remarks from "crypto investment" to "wedding gift" or "home repair".

---

## 8. Summary of Findings: Evaluation Methods

| Metric | Context / Locus | Primary Utility | Major Blindspot / Hazard |
| :--- | :--- | :--- | :--- |
| **Accuracy** | Baseline ML | Zero utility in fraud | Masked by 99.99% legitimate majority class. |
| **ROC-AUC** | Model Benchmarking | General ranking | Obscures massive false-positive floods due to large TN. |
| **PR-AUC** | Algorithmic Selection | Evaluates true precision on rare positive class | Does not reflect business loss amounts. |
| **Recall @ 0.01% FPR** | Production Deployment | Measures catch-rate under realistic operational ceilings | Ignores latency and customer friction. |
| **Insult Ratio (FPR:TPR)**| Customer Operations | Measures user annoyance and friction | Does not reflect dollar values. |
| **Value-Weighted Recall**| Financial Risk (CRO) | Evaluates actual dollar capital saved | Favors high-value transactions; may ignore vulnerable low-income victims. |
| **Net Economic Utility** | Executive Business Case| Synthesizes fraud loss, operational cost, and customer friction | Difficult to parameterize customer churn dollar value accurately. |

```text
CORE LANDSCAPE TAKEAWAY:
Evaluating a payment scam defense system on accuracy or ROC-AUC is fatal. 
Production-grade systems are evaluated on Precision-Recall AUC, Recall at 
strictly bounded False Positive Rates (e.g., 0.01% FPR), Value-Weighted 
Loss Reduction, and Net Economic Utility. An approach that catches 90% of scams 
is useless if it creates an investigator backlog that takes hours to clear 
or alienates legitimate customers with intrusive friction.
```

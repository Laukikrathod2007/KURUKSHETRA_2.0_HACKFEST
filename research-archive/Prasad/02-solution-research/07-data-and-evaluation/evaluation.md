# Evaluation Metrics: The Failure of Accuracy, PR-AUC, and Financial Loss Prevention

---

## 1. Executive Understanding
In payment fraud prevention, **relying on standard classification accuracy is a catastrophic methodological error**. Because fraud occurs in less than 0.1% of transactions, an utterly useless model that predicts `LEGITIMATE` for 100% of inputs achieves **99.90% accuracy** while permitting 100% of financial devastation.

Evaluating a production-grade scam interceptor requires an **Evidentiary Metric Hierarchy** spanning statistical discriminative power (PR-AUC), financial loss prevention, operational system latency, and human intervention efficacy.

---

## 2. The Multi-Tier Evaluation Metric Hierarchy

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE METRIC EVALUATION HIERARCHY                                 │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ METRIC TIER         │ SPECIFIC FORMULAS & INDICATORS  │ OPERATIONAL PURPOSE               │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **1. Statistical &  │ • Precision-Recall AUC (PR-AUC) │ • Evaluates classifier performance│
│   Discriminative**  │ • Recall at 0.1% False Pos Rate │   under extreme class imbalance   │
│                     │ • F2-Score ($\beta=2$, Recall)  │ • Replaces deceptive ROC-AUC      │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **2. Financial &    │ • Value-Weighted Fraud Catch %  │ • Measures actual currency saved  │
│   Economic**        │ • Net Economic Value (NEV)      │ • Penalizes blocking large safe tx│
│                     │ • $\mathbb{E}[\text{Loss Avoided}]$│ • Balances friction vs losses     │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **3. Operational &  │ • p99 Latency (ms)              │ • Enforces hot-path SLA compliance│
│   Systems**         │ • Throughput (TPS)              │ • Prevents switch timeouts        │
│                     │ • Battery / RAM draw on device  │ • Measures edge resource footprint│
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **4. Behavioral &   │ • Scam De-escalation Rate       │ • Measures cognitive friction     │
│   Intervention**    │ • False Alarm Abandonment Rate  │   success in breaking coercion    │
│                     │ • Dwell Time on Warning Screen  │ • Tracks user friction fatigue    │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **5. Agentic &      │ • Tool Selection Precision      │ • Audits autonomous reasoning     │
│   Forensic**        │ • Evidentiary Hallucination Rate│ • Verifies explanation faithfulness│
│                     │ • Reason Code Faithfulness (SHAP│   to underlying data signals      │
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Deep Statistical Analysis: Why PR-AUC Dominates ROC-AUC

In highly imbalanced datasets ($N_{\text{neg}} = 999,000, N_{\text{pos}} = 1,000$):
- **ROC-AUC Fallacy:** The False Positive Rate is defined as $\text{FPR} = \frac{\text{FP}}{\text{FP} + \text{TN}}$. Because True Negatives ($\text{TN}$) exceed 999,000, even if the model generates **10,000 False Positives** (ruining the experience of 10,000 safe users), the FPR remains:
  $$\text{FPR} = \frac{10,000}{10,000 + 989,000} \approx 0.01 \quad (1\%)$$
  The ROC curve looks outstanding ($\text{AUC} > 0.98$), completely masking that for every 1 true scam caught, **10 innocent customers were falsely flagged**.
- **Precision-Recall Curve (PR-AUC):** PR-AUC plots Precision ($\frac{\text{TP}}{\text{TP} + \text{FP}}$) directly against Recall ($\frac{\text{TP}}{\text{TP} + \text{FN}}$). In the scenario above, Precision drops to a dismal:
  $$\text{Precision} = \frac{1,000}{1,000 + 10,000} \approx 0.09 \quad (9\%)$$
  PR-AUC immediately exposes this failure, making it the **only honest statistical metric for fraud evaluation**.

---

## 4. The Net Economic Value (NEV) Objective Function

In commercial fintech, models are not optimized for abstract mathematical purity; they are optimized for **Net Financial Protection**:

$$\text{NEV} = \sum_{i \in \text{TP}} \text{Amount}_i - \sum_{j \in \text{FP}} C_{\text{friction}}(\text{Amount}_j) - \sum_{k \in \text{FN}} \text{Amount}_k$$

Where:
- $\text{TP}$: Successfully intercepted scams (Direct financial loss averted for victim).
- $\text{FN}$: Missed scams (Total loss incurred by victim).
- $C_{\text{friction}}$: Quantified cost of false alarms:
  - If friction is a subtle cognitive challenge: $C_{\text{friction}} \approx ₹25$ (minor user annoyance).
  - If friction is a hard transaction block: $C_{\text{friction}} \approx 0.15 \times \text{Amount}$ (user abandons payment app for a competitor).

```
                     NET ECONOMIC VALUE SURFACE
  High 
   ▲             Optimal Threshold Corresponds to Max(NEV)
   │                       ╭───────╮
N  │                      ╭╯       ╰╮
E  │                     ╭╯         ╰╮
V  │                    ╭╯           ╰╮
   │      Under-Blocked │             │ Over-Friction
   │      (High FN)     │             │ (High FP Churn)
   │ ───────────────────┴─────────────┴──────────────────────►
  Low                  Decision Threshold ($\tau$)          High
```

---

## 5. Evaluating the Agent: Agency and Hallucination Metrics

When an LLM agent participates in the investigation:
1. **Tool Call Precision:** Did the agent invoke appropriate diagnostic tools?
   $$\text{TCP} = \frac{\text{Relevant Tool Invocations}}{\text{Total Tool Invocations}}$$
   Penalizes agents that run random API queries, wasting latency and cloud compute.
2. **Evidentiary Hallucination Rate (EHR):** Percentage of times the agent's explanation references a "fact" not present in the input telemetry or tool responses:
   - *Example Failure:* Agent asserts *"Beneficiary VPA was created 2 years ago"* when no such feature exists in the input record.
   - **Target SLA for PS09:** $\text{EHR} = 0.00\%$ (enforced via structured factual grounding).

---

## 6. Epistemic Assessment for PS09

| Dimension | Evaluation Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Primary Metric** | **PR-AUC and Value-Weighted Catch Rate.** | Never report raw accuracy; report PR-AUC and Net Economic Value protected. |
| **Operational SLA** | **Latency p99 < 15ms (Hot) / < 2,500ms (Warm).** | Benchmark execution latency under simulated concurrency before claiming viability. |
| **Intervention Success**| **Measured by de-escalation, not just blocks.** | Measure how effectively cognitive friction prompts victims to abort coerced payments. |

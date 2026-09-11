# Evaluation Strategy: Multi-Faceted Benchmarks, Economic Value, and Metric Standards

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **What a Strong Solution Demonstrates (`PROBLEM_STATEMENT.md`)**:
- *• Real-time security reasoning, fraud prevention, human-in-the-loop intervention, explainability, and safe autonomous decision-making.*

In financial security engineering, **evaluating a system with classification accuracy is an unscientific failure**. A model that predicts `SAFE` for 100% of transactions achieves 99.9% accuracy while catching zero scams.

This document defines the **Comprehensive Evaluation Strategy for GuardianPay**, establishing rigorous statistical, financial, operational, and human-in-the-loop benchmark protocols to prove that the system delivers on all requirements of `PROBLEM_STATEMENT.md`.

---

## 2. The Six Evaluation Dimensions

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE SIX EVALUATION DIMENSIONS                                   │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ DIMENSION           │ PRIMARY METRICS                 │ ACCEPTANCE BENCHMARK TARGET       │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **1. Statistical &  │ • Precision-Recall AUC (PR-AUC) │ • PR-AUC $\ge 0.88$               │
│    Discriminative** │ • Recall at 0.1% False Pos Rate │ • Recall $\ge 90\%$ at FPR $\le 0.1\%$│
│                     │ • F2-Score ($\beta = 2$, Recall)│ • F2-Score $\ge 0.85$             │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **2. Financial &    │ • Net Economic Value (NEV)      │ • Prevents $\ge 85\%$ of total    │
│    Economic**       │ • Value-Weighted Fraud Catch %  │   simulated financial scam loss   │
│                     │ • False Alarm Friction Cost     │ • Net Economic Value $> +₹5.0M$   │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **3. Operational &  │ • Hot-Path p99 Latency          │ • Hot Path $\le 15.0\text{ms}$    │
│    System SLAs**    │ • Warm-Path p95 Latency         │ • Warm Path $\le 2,200\text{ms}$  │
│                     │ • Peak Burst Throughput         │ • Sustains $\ge 25,000\text{ TPS}$│
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **4. Human Inter-   │ • Scam De-escalation Abort %    │ • $\ge 60\%$ coerced victims abort│
│    vention & UX**   │ • Legitimate Completion Rate    │ • $\ge 92\%$ safe users complete  │
│                     │ • Challenge Dwell Time          │ • Median challenge time $< 10\text{s}$│
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **5. Agentic &      │ • Tool Selection Precision (TCP)│ • TCP $\ge 95\%$                  │
│    Diagnostic**     │ • Evidentiary Hallucination Rate│ • Hallucination Rate $= 0.00\%$   │
│                     │ • Reasoning Faithfulness        │ • $100\%$ alerts map to TreeSHAP  │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **6. Adversarial    │ • Prompt Injection Containment  │ • $100\%$ injection attempts fail │
│    Robustness**     │ • Blank-Note Catch Rate         │ • $\ge 75\%$ coercion caught blank│
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Mathematical Metric Formulations

### 1. Precision-Recall Area Under Curve (PR-AUC)
$$\text{PR-AUC} = \sum_{k=1}^K (\text{Recall}_k - \text{Recall}_{k-1}) \times \text{Precision}_k$$
- Directly reflects performance on the minority positive class without distortion from millions of easy true negatives.

### 2. Net Economic Value (NEV)
$$\text{NEV} = \sum_{i \in \text{TP}} \text{Amount}_i - \sum_{j \in \text{FP}} C_{\text{friction}}(\text{Amount}_j) - \sum_{k \in \text{FN}} \text{Amount}_k$$
- Ensures that the system is optimized for **real-world financial protection**, heavily penalizing missed high-value scams while accounting for the mild friction cost of cognitive challenges.

---

## 4. Evaluation Benchmark Protocols

1. **The Synthetic Cohort Benchmark:** Evaluating the model suite against a hold-out test set of 100,000 transactions (99.85% legitimate commerce, 0.15% injected scams across the 8 typologies).
2. **The Zero-Day Generalization Test:** Evaluating the model against a "Zero-Day Extortion Typology" held out entirely from the training pipeline, testing inductive semantic reasoning.
3. **The Concurrency Stress Benchmark:** Simulating 5,000 virtual users firing simultaneous requests to verify sub-15ms hot-path compliance using k6.

---

## 5. Epistemic Assessment for PS09

The Evaluation Strategy provides a **scientifically rigorous, mathematically honest validation framework** that proves GuardianPay delivers real-time security reasoning, explainable alerts, and effective fraud prevention.

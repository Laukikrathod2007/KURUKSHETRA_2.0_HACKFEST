# Model Governance: Drift Detection, Champion-Challenger Pipelines, and Algorithmic Fairness

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **What a Strong Solution Demonstrates (`PROBLEM_STATEMENT.md`)**:
- *• Safe autonomous decision-making.*
- *• Real-time security reasoning.*

In financial risk systems, **a machine learning model is a living asset that begins decaying the moment it is trained**. Fraud syndicates constantly alter their communication scripts, rotation intervals, and laundering pipelines to evade static decision boundaries.

This document formalizes the **Model Governance Framework for GuardianPay**, establishing automated drift detection, Champion-Challenger canary deployments, 30-day label maturity buffering, and algorithmic fairness audits in compliance with RBI Model Risk Management principles.

---

## 2. The Model Lifecycle and Deployment Pipeline

```
                      CONTINUOUS MODEL GOVERNANCE LIFECYCLE
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. RETRAINING ON MATURE LABEL COHORTS                                       │
  │ • Trains strictly on historical cohorts older than 30 days (t - 60 to t - 30│
  │ • Prevents corrupted label bias from delayed police FIR filings             │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 2. SHADOW / DARK DEPLOYMENT (7-Day Production Benchmark)                    │
  │ • Challenger Model receives 100% of production traffic in shadow mode       │
  │ • Inference latency and risk scores evaluated with ZERO user intervention   │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ [Passes Shadow Benchmark]
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 3. CANARY CHAMPION-CHALLENGER ROLLOUT                                       │
  │ • 5% -> 25% -> 50% -> 100% traffic allocation via weighted Envoy router     │
  │ • Real-time tracking of False Positive friction rates and user complaints   │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 4. REAL-TIME COVARIATE & CONCEPT DRIFT MONITORING                           │
  │ • Population Stability Index (PSI) calculated on sliding 24-hour windows    │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Drift Monitoring Protocols: The Population Stability Index (PSI)

To detect distribution shifts before delayed fraud labels mature, the governance worker monitors the PSI for all 25 features every 24 hours:

$$\text{PSI} = \sum_{b=1}^B \left( P_{\text{actual}}(b) - P_{\text{expected}}(b) \right) \times \ln\left( \frac{P_{\text{actual}}(b)}{P_{\text{expected}}(b)} \right)$$

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              DRIFT ACTION THRESHOLDS                                      │
├─────────────────────┬───────────────────┬─────────────────────────────────────────────────┤
│ PSI RANGE           │ DRIFT STATUS      │ AUTOMATED OPERATIONAL RESPONSE                  │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **PSI < 0.10**      │ **STABLE**        │ Normal operation; no model retraining required. │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **0.10 <= PSI <= 0.25** **MODERATE SHIFT**│ Triggers operational alert; queues feature      │
│                     │                   │ re-normalization and recalibration analysis.    │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **PSI > 0.25**      │ **SEVERE DRIFT**  │ Automatically switches traffic to conservative  │
│                     │                   │ fallback rules engine; triggers emergency train.│
└─────────────────────┴───────────────────┴─────────────────────────────────────────────────┘
```

---

## 4. Algorithmic Fairness and Equalized Odds (RBI Alignment)

In digital public infrastructure like UPI, **security algorithms must not discriminate based on socioeconomic geography, age, or regional language**:
- **Fairness Constraint:** The system enforces **Equalized Odds** across all demographic segments:
  $$P(\text{Tier 2 Challenge} \,|\, \text{Legitimate}, \text{Age} \ge 60) = P(\text{Tier 2 Challenge} \,|\, \text{Legitimate}, \text{Age} < 60) \pm 0.02$$
  Ensures that elderly or rural users are not subjected to disproportionate false-alarm friction.

---

## 5. Epistemic Assessment for PS09

Model Governance ensures that GuardianPay **maintains safe, auditable, and uncorrupted autonomous decision-making throughout its operational lifecycle**, satisfying the long-term governance expectations of enterprise banking regulators.

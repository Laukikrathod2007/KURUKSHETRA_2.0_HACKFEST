# Model Governance: Concept Drift, Champion-Challenger Deployment, and Continuous Retraining

---

## 1. Executive Understanding
In adversarial financial domains, **a machine learning model begins decaying the exact second it is deployed to production**. Fraud syndicates constantly alter their communication scripts, rotation intervals, and laundering pipelines to evade static decision boundaries.

Model governance is the formal engineering and operational discipline that guarantees risk models remain **accurate, fair, uncorrupted, and compliant with regulatory standards throughout their lifecycle**. It replaces ad-hoc manual model updates with **continuous monitoring, automated drift detection, canary rollouts, and Champion-Challenger validation**.

---

## 2. The Model Lifecycle Pipeline in High-Stakes Banking

```
                      CONTINUOUS MODEL GOVERNANCE LIFECYCLE
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. OFFLINE TRAINING & VALIDATION                                            │
  │ • Trained on mature label cohorts (t - 60 days to t - 14 days)              │
  │ • Strict cost-sensitive loss optimization & probability calibration         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 2. REPRODUCTIBILITY & AUDIT REGISTRATION (MLflow / W&B)                     │
  │ • Cryptographic hash of code, weights, training dataset, and hyperparams    │
  │ • Algorithmic fairness audit (zero disparate impact across demographic segments)
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 3. SHADOW / DARK DEPLOYMENT (Zero User Impact)                              │
  │ • Candidate Model (Challenger) receives 100% of live production traffic     │
  │ • Evaluates inference latency, memory footprint, and outputs shadow scores  │
  │ • Zero physical interventions triggered; compared against Champion          │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ [Passes 7-Day Shadow SLA]
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 4. CANARY & CHAMPION-CHALLENGER PROMOTION                                   │
  │ • 1% -> 5% -> 25% -> 100% traffic allocation via weighted Envoy router      │
  │ • Real-time monitoring of user friction, complaints, and false positive rates
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 5. CONTINUOUS DRIFT MONITORING (Evidentiary Health Checks)                  │
  │ • Real-time Population Stability Index (PSI) and feature distribution tracking
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detecting and Responding to Drift

In production, models face two distinct forms of operational degradation:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           DRIFT TYPOLOGY & METRIC RESPONSES                               │
├─────────────────────┬─────────────────────────────────┬──────────────┬────────────────────┤
│ DRIFT TYPE          │ DEFINITION & CAUSE              │ METRIC       │ OPERATIONAL ACTION │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Covariate Drift** │ Input feature distributions     │ Population   │ • Trigger feature  │
│ (Feature Shift)     │ change while relationship to    │ Stability    │   re-scaling       │
│                     │ fraud remains unchanged         │ Index (PSI)  │ • Retrain baseline │
│                     │ (e.g. Diwali spending surge)    │              │   distributions    │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **Concept Drift**   │ The fundamental relationship    │ False Neg.   │ • Emergency alert  │
│ (Adversarial Shift) │ between features and fraud shifts│ rate surge;  │ • Deploy targeted  │
│                     │ (e.g. New "Digital Arrest" scam │ Brier Score  │   heuristic patch  │
│                     │  emerges with zero prior labels)│ decay        │ • Fast-track train │
└─────────────────────┴─────────────────────────────────┴──────────────┴────────────────────┘
```

### The Population Stability Index (PSI)
To track feature distribution changes without waiting for delayed labels, the monitoring pipeline calculates the PSI for every feature across sliding 24-hour cohorts:
$$\text{PSI} = \sum_{b=1}^B \left( P_{\text{actual}}(b) - P_{\text{expected}}(b) \right) \times \ln\left( \frac{P_{\text{actual}}(b)}{P_{\text{expected}}(b)} \right)$$
- $\text{PSI} < 0.10$: Minimal shift; model is stable.
- $0.10 \le \text{PSI} \le 0.25$: Moderate shift; triggers warning and alerts fraud data science team.
- $\text{PSI} > 0.25$: Significant shift; automatically shifts traffic to the conservative fallback rules engine and queues retraining.

---

## 4. Algorithmic Fairness and Demographic Bias (RBI Alignment)

In digital public infrastructure (DPI) like UPI, **a security model must not discriminate based on socioeconomic geography, age, or linguistic dialect**:
- A model that assigns higher baseline fraud risk to users living in specific pin codes (e.g., Mewat or Jamtara districts) without individualized behavioral evidence violates fundamental fairness doctrines.
- **Fairness Invariant:** Production models must be validated using **Equalized Odds**:
  $$P(\hat{Y} = 1 \,|\, Y = 0, A = a) = P(\hat{Y} = 1 \,|\, Y = 0, A = b)$$
  The False Positive Rate (legitimate users facing intrusive friction) must remain statistically invariant across protected demographic groups ($A$).

---

## 5. Epistemic Assessment for PS09

| Dimension | Model Governance Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Model Freshness** | **Static models decay rapidly.** | Retraining pipelines must be automated and tied to mature ground-truth label ingestion. |
| **Deployment Safety** | **Never deploy unverified models directly.** | Enforce **Shadow Mode and Canary Rollouts** for any new model or agent prompt template. |
| **Auditability** | **Every prediction must link to an exact model version.** | Log immutable model registry hashes alongside every transaction risk evaluation. |

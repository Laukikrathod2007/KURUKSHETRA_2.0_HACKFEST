# Supervised Machine Learning: Gradient Boosted Trees, Class Imbalance, and Ground-Truth Lag

---

## 1. Executive Understanding
In commercial fraud prevention, **Gradient Boosted Decision Trees (GBDTs)—specifically LightGBM, XGBoost, and CatBoost—remain the undisputed production benchmark for tabular transaction risk scoring**. Despite the rise of deep learning and generative AI, tree-based gradient boosting models dominate banking risk engines worldwide due to four properties:
1. **Exceptional Tabular Discriminative Power:** Superior handling of heterogeneous feature types (continuous amounts, categorical MCC codes, boolean flags) without requiring complex normalization.
2. **Sub-10ms Inference Latency:** C++ compiled tree traversal evaluates hundreds of decision trees in single-digit milliseconds.
3. **Robustness to Extreme Feature Distributions:** Natural invariance to monotonic transformations and outliers in long-tailed financial data.
4. **Direct Feature Attribution:** Seamless integration with TreeSHAP for deterministic regulatory reason-code generation.

However, supervised fraud modeling suffers from severe operational headwinds: **extreme class imbalance ($<0.01\%$ positive class), delayed ground-truth labels (14–90 day lag), and aggressive adversarial concept drift**.

---

## 2. Comparative Analysis of Model Families in Payment Fraud

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      SUPERVISED FRAUD MODEL FAMILY COMPARISON                             │
├─────────────────────┬──────────────┬──────────────┬──────────────┬────────────────────────┤
│ MODEL FAMILY        │ INFERENCE MS │ MEMORY USAGE │ EXPLAINABILITY│ DISCRIMINATIVE POWER   │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Logistic Reg.**   │ < 0.5 ms     │ < 1 MB       │ Direct Coeff.│ Low (Linear only)      │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **GBDT (LightGBM)** │ 1 - 5 ms     │ 10 - 50 MB   │ TreeSHAP     │ **Highest on Tabular** │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **CatBoost**        │ 3 - 8 ms     │ 20 - 80 MB   │ TreeSHAP     │ **Best for Categories**│
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **TabNet / FT-Trans**│ 25 - 60 ms   │ 200 - 500 MB │ Attention Map│ Moderate (High compute)│
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **LSTM / GRU Seq.** │ 15 - 40 ms   │ 100 - 300 MB │ Integrated Gr│ High for Event Streams │
└─────────────────────┴──────────────┴──────────────┴──────────────┴────────────────────────┘
```

---

## 3. Critical Production Challenges in Fraud Supervised ML

### 1. Extreme Class Imbalance (The 1:10,000 Ratio)
In UPI, fraudulent or scammed transactions represent a fraction of a percent ($0.005\% - 0.02\%$) of total transaction volume.
- **The Failure of Accuracy:** A trivial classifier that predicts "Legitimate" for every transaction achieves $99.98\%$ accuracy while failing entirely to protect users.
- **Cost-Sensitive Learning:** Rather than synthetic oversampling (SMOTE, which distorts high-dimensional tabular correlations), production engines modify the loss function:
  $$\mathcal{L}_{\text{weighted}} = - \sum \left( w_{\text{pos}} y_i \log(\hat{p}_i) + (1 - y_i) \log(1 - \hat{p}_i) \right)$$
  where $w_{\text{pos}} = \frac{N_{\text{neg}}}{N_{\text{pos}}}$ or is parameterized by the actual financial exposure ($Amount$).
- **Focal Loss:** Down-weights well-classified easy negative examples to focus gradient updates on hard ambiguous boundaries:
  $$\text{FL}(p_t) = -\alpha_t (1 - p_t)^\gamma \log(p_t)$$

### 2. The Ground-Truth Lag (Delayed Feedback Horizon)
Supervised learning requires labeled targets ($y \in \{0, 1\}$). In consumer payment scams:
- **The Reporting Window:** Victims realize they have been defrauded hours or days after the event.
- **The Police Filing Window:** Formal FIR filings on the I4C 1930 portal typically occur 24 to 72 hours post-incident.
- **The Bank Reconciliation Window:** Chargeback and fraud classification across remitter and beneficiary banks takes **14 to 60 days**.

```
                         THE GROUND-TRUTH FEEDBACK DELAY
  Day 0               Day 1               Day 3               Day 14 - 60
────┼───────────────────┼───────────────────┼─────────────────────┼─────────────►
  Scam Payment        Victim Realizes     Victim Files 1930     Bank Tags Mule;
  Executed            Scam                Cybercrime Report     Supervised Label Matures
  (Target: UNKNOWN)   (Target: UNREPORTED)(Target: POLICE LOG)  (Target: GROUND TRUTH = 1)
```

**Consequence:** A model trained on data from the last 7 days is trained on **severely corrupted labels** where many fraudulent transactions are mislabeled as legitimate. Production systems enforce a **Label Maturity Horizon (30–60 day buffer)**, training only on historical cohorts where label maturity exceeds 95%.

### 3. Probability Calibration
GBDT models output raw margins or poorly calibrated sigmoid probabilities that do not reflect true statistical odds.
- If a model predicts $P(\text{Scam}) = 0.85$, exactly 85 out of 100 transactions in that bucket must be actual scams.
- Uncalibrated probabilities distort Bayesian evidence fusion and cost-sensitive thresholding.
- **Production Solution:** Post-hoc calibration using **Platt Scaling (Logistic Calibration)** or **Isotonic Regression** fitted on an out-of-fold calibration dataset.

---

## 4. Feature Engineering: The Secret Engine of Fraud ML

Modern fraud ML succeeds or fails based on feature engineering across time windows:
1. **Velocity Aggregations:** Transaction count and sum over 5m, 1h, 6h, 24h, 7d windows.
2. **Ratio / Relative Features:** Current transaction amount divided by user's 30-day average amount ($\frac{\text{Amount}}{\mu_{30\text{d}}}$).
3. **Entropy Features:** Diversity of recipient VPAs contacted in the last 48 hours.
4. **Temporal Features:** Circular encoding of hour of day ($\sin(2\pi \cdot \text{hour} / 24)$, $\cos(2\pi \cdot \text{hour} / 24)$).
5. **Entity Linkage Features:** Count of distinct mobile numbers associated with this device fingerprint over 30 days.

---

## 5. Epistemic Assessment for PS09

| Dimension | Supervised ML Capability | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Tabular Scoring** | **State of the Art:** Unmatched speed and accuracy for numerical transaction and device telemetry. | Must serve as the **core quantitative risk engine** for scoring transaction metadata. |
| **Inference Latency** | **Exceptional (1–5ms):** Highly compatible with the sub-100ms hot path before PIN entry. | Runs comfortably on edge server gateways during beneficiary name resolution. |
| **Zero-Day Scam Generalization** | **Poor:** Blind to novel linguistic narratives, psychological manipulation, or unobserved attack typologies. | Cannot detect new social-engineering scripts without retraining. |
| **Semantic & Contextual Nuance** | **Incapable:** GBDT models cannot process free-form WhatsApp chat screenshots, call transcripts, or complex intent. | Must be augmented with contextual NLP/LLM layers for text and intent analysis. |

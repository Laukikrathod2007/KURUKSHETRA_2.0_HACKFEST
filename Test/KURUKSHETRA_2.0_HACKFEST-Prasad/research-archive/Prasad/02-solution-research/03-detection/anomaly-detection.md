# Anomaly Detection: Unsupervised Baselines, Isolation Techniques, and Behavioral Deviations

---

## 1. Executive Understanding
In payment fraud prevention, **supervised learning only recognizes scams that have already happened; anomaly detection identifies when a user's current action is fundamentally incompatible with their historical baseline**. 

When a 62-year-old pensioner who has executed exclusively ₹200–₹800 utility bills for three years suddenly initiates a ₹48,500 transfer to an unfamiliar individual VPA at 2:45 AM, the transaction does not violate any statutory daily limit (₹1,00,000 cap). A rule engine marks it valid. However, in behavioral vector space, this event represents an **extreme outlier ($>5\sigma$ deviation)**.

Anomaly detection provides zero-day detection capability by modeling the manifold of "normal" behavior and calculating a distance or reconstruction error for new events.

---

## 2. Taxonomy of Anomaly Detection Techniques

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                       ANOMALY DETECTION TECHNIQUES FOR PAYMENTS                           │
├─────────────────────┬─────────────────────────────────────┬──────────────┬────────────────┤
│ METHODOLOGY         │ MATHEMATICAL FOUNDATION             │ INFERENCE MS │ DATA EFFICIENCY│
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **1. Statistical &  │ • Rolling Z-Score / Gaussian PDF    │ < 1 ms       │ High (Requires │
│   Parametric**      │ • Median Absolute Deviation (MAD)   │              │ 20+ tx history)│
│                     │ • Empirical Quantile Estimation     │              │                │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **2. Tree Partition │ • Isolation Forest (iForest)        │ 2 - 6 ms     │ Moderate       │
│   (iForest)**       │ • Extended Isolation Forests        │              │ Tabular multi- │
│                     │ • Random recursive path length      │              │ dimensional    │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **3. Reconstruction │ • Deep Autoencoders (Dense/Variat.) │ 8 - 25 ms    │ High volume of │
│   Error (Deep ML)** │ • Sequence Autoencoders (LSTM/GRU)  │              │ normal unlab-  │
│                     │ • Reconstruction loss threshold     │              │ eled events    │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **4. Density /      │ • Local Outlier Factor (LOF)        │ > 50 ms      │ Poor at scale  │
│   Distance Based**  │ • One-Class SVM (OC-SVM)            │ (high memory)│ (O(N) search)  │
└─────────────────────┴─────────────────────────────────────┴──────────────┴────────────────┘
```

---

## 3. Deep Algorithmic Mechanics in Production

### 1. Rolling Statistical Baselines (User-Centric Profiling)
For each user, the system maintains real-time feature profiles in low-latency key-value storage (Redis / Aerospike):
- $\mu_{\text{amount}}, \sigma_{\text{amount}}$: Rolling 90-day transaction amount mean and standard deviation (log-transformed to handle long-tailed distributions).
- Hour-of-day probability mass function (PMF): Categorical distribution of transaction timestamps.
- Payee category entropy: Dispersion across merchant vs. P2P recipients.

When a new transaction $x$ arrives:
$$Z = \frac{\ln(x) - \mu_{\ln(X)}}{\sigma_{\ln(X)}}$$
If $Z > 3.5$, the transaction is mathematically atypical.

### 2. Isolation Forests (iForest)
Isolation Forest operates on the principle that anomalies are "few and different," making them susceptible to isolation with fewer random axis-aligned splits than normal points.
- **Ensemble:** 100–200 isolation trees trained on historical user-session vectors (amount, time delta since last session, device orientation variance, UI dwell time).
- **Anomaly Score:** $s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$, where $E(h(x))$ is the average path length across trees.
- **Advantage:** Low memory footprint, fast inference (3ms in C++/ONNX runtime), no assumption of normal distribution.

### 3. Deep Autoencoder Reconstruction Anomaly Detection
Autoencoders compress multi-modal user session telemetry into a low-dimensional bottleneck (latent vector $z$) and attempt reconstruction:
$$\mathcal{L}_{\text{recon}} = ||x - \hat{x}||^2$$
- The autoencoder is trained strictly on confirmed legitimate payment sessions.
- In a social-engineering scam (where the user exhibits abnormal screen dwell time, active background telephony, and an atypical ticket size), the latent bottleneck cannot reconstruct the unusual feature combination, yielding a high reconstruction error $\mathcal{L}_{\text{recon}} > \tau$.

---

## 4. The Achilles' Heel: Legitimate Anomalies

The primary failure mode of anomaly detection in consumer fintech is the **high False Positive Rate (FPR) driven by benign life events**:
1. **Festive & Wedding Season Spikes:** In India, Diwali, Dhanteras, and wedding seasons cause sudden 10x spikes in spending to new jewelers and vendors, triggering widespread false anomaly alerts.
2. **Medical Emergencies:** A frantic midnight transfer to a hospital or pharmacy creates an extreme statistical anomaly (abnormal hour, new payee, urgent dwell time). **Blocking a legitimate medical emergency due to an anomaly false positive causes catastrophic real-world harm.**
3. **Cold-Start Users:** New UPI users lack an established baseline; applying strict anomaly thresholds either blocks every legitimate payment or disables detection entirely.

```
                   THE ANOMALY DILEMMA IN CONSUMER PAYMENTS
  ┌──────────────────────────────────────────────┐
  │ TRANSACTION PROFILE:                         │
  │ • Amount: ₹75,000 (Historical Average: ₹400) │
  │ • Time: 3:15 AM (Usual Hours: 10 AM - 9 PM)  │
  │ • Recipient: First-time individual VPA       │
  └──────────────────────┬───────────────────────┘
                         │
        Is this a Scam or a Hospital Emergency?
        ───────────────────────────────────────
           ▲                               ▲
           │                               │
  [SCAM SCENARIO]                 [HOSPITAL EMERGENCY]
  Victim coerced by fake          User paying ICU admission
  "Digital Arrest" threat.        deposit for injured parent.
```

---

## 5. Epistemic Assessment for PS09

| Dimension | Anomaly Detection Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Zero-Day Protection** | **High:** Capable of flagging novel scam typologies without prior labeled training examples. | Essential as a **risk amplifier**, surfacing suspicious outliers that need contextual review. |
| **Standalone Decisiveness** | **Unacceptable:** Using anomaly scores alone to block transactions generates an unmanageable false-positive burden. | **Anomaly detection must NEVER trigger an unconditional block.** It should only trigger cognitive step-up or invoke contextual analysis. |
| **Inference Performance** | **High (sub-10ms via ONNX):** iForest and statistical Z-scores execute comfortably within hot-path budgets. | Can execute synchronously on device or edge gateway prior to MPIN display. |
| **Contextual Discrimination**| **Blind:** An autoencoder cannot distinguish between a hospital payment and an extortion payment. | Requires contextual fusion with semantic and recipient intelligence. |

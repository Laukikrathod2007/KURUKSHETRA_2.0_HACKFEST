# Detection Approach Taxonomy: Algorithmic Paradigms, Signal Inputs & Trade-Offs

---

## 1. Executive Summary

Existing financial crime systems deploy a diverse array of analytical paradigms to detect illicit transactions. However, no single algorithmic approach possesses universal efficacy across the entire fraud and scam spectrum. Each paradigm represents an engineering compromise between **inference latency, computational cost, feature data requirements, explainability, and detection precision**.

This document constructs an exhaustive, multi-dimensional **Detection Approach Taxonomy**. It systematically analyzes nine distinct detection paradigms utilized across industry, central banking, and academia: **Deterministic Rules & Thresholds**, **Statistical Anomaly Estimators**, **Supervised Gradient-Boosted Trees (GBDT)**, **Unsupervised Deep Anomaly Models**, **Behavioral Biometrics**, **Graph Neural Networks (GNNs)**, **Sequential Temporal Models**, **Hybrid Dual-Path Cascades**, and **Intelligence Blacklist Registries**.

---

## 2. Global Detection Taxonomy Matrix

The following comprehensive matrix details the operational mechanics, signal dependencies, latency budgets, and failure modes across all nine detection paradigms:

| Paradigm | Primary Signal Inputs | Target Threat Strengths | Primary Operational Blind Spots | Latency Profile | Explainability / Auditability | Data Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Deterministic Rules & Thresholds** | Amount, time of day, country code, payee type, velocity counter. | Catches crude, high-velocity bot attacks and regulatory limit violations. | Extremely brittle; easily bypassed once adversaries deduce thresholds. | **Ultra-Fast (< 5ms)** | **Maximum (100% Deterministic)** | Minimal (Single transaction payload). |
| **2. Statistical Estimators (Z-Score / Counters)** | Rolling 1h/24h spending volume, average transaction size, Z-score deviation. | Detects sudden volumetric surges and rapid draining of dormant accounts. | Fails on low-value scams or payments that match customer’s typical baseline. | **Fast (< 15ms)** | **High (Statistical deviation)** | Moderate (Rolling customer history). |
| **3. Supervised GBDT (XGBoost / LightGBM)** | 200–500 engineered tabular features (velocity, recency, ratios, device hash). | Industry standard for tabular pattern matching; catches non-linear feature interactions. | Fails on novel scam typologies; trained heavily on historical *unauthorized* fraud. | **Fast (< 30ms)** | **Moderate (TreeSHAP feature attributions)** | High (Extensive historical labeled fraud data). |
| **4. Unsupervised Anomaly (Autoencoders / iForest)** | Raw multi-dimensional transaction vectors, latent reconstruction errors. | Detects completely novel zero-day attacks without requiring historical fraud labels. | High false-positive rate; flags legitimate novelty (e.g., buying a car) as fraud. | **Moderate (< 80ms)** | **Low (Latent space distance)** | Moderate (Unlabeled baseline transactions). |
| **5. Behavioral Biometrics (Sensor Dynamics)** | Capacitive touch area, stroke curvature, typing cadence, phone gyro jitter. | Detects live telephone dictation, screen-sharing shadowing, and victim coercion. | Vulnerable to physical movement noise (walking, riding transit); budget handset decay. | **Fast (< 50ms on device)** | **Moderate to Low (Complex neural embeddings)** | High (Raw millisecond client sensor streams). |
| **6. Graph Neural Networks (CARE-GNN / HGT)** | Multi-hop transfer edges, account-device bipartite graphs, neighbor similarity. | Uncovers organized money mule rings, layering chains, and camouflaged laundering. | Prohibitive inference latency (250–1500ms); massive distributed GPU infrastructure cost. | **Slow (250ms – 1500ms)** | **Low (Message-passing attention weights)** | Extreme (Full global interbank transaction graph). |
| **7. Sequential Transformers** | Chronological sequence of past $N$ events, inter-arrival times ($\Delta t$), MCC tokens. | Detects multi-day escalating commitments (e.g., task scams, grooming sequences). | Cold-start failure on accounts with low transaction frequency; memory intensive. | **Moderate (< 100ms)** | **Moderate (Self-attention heatmaps)** | High (Historical event sequence logs). |
| **8. Hybrid Cascading Systems (Fast/Slow)** | Tiered signals: Fast payload checks -> Local behavioral scoring -> Out-of-band graph. | Combines ultra-low latency for simple transactions with deep evaluation for high-risk transfers. | Architectural complexity; requires asynchronous event buses and eventual consistency. | **Dual-Path (Fast: 30ms; Slow: 2000ms)**| **Mixed (Multi-tiered decision audits)** | Multi-tiered (Distributed streaming state). |
| **9. Centralized Intelligence Blacklists** | Reported mule VPAs, fraudulent phone numbers, blacklisted device IMEIs (I4C/CIFAS). | Zero false positives on confirmed repeat offenders; immediate regulatory defensibility. | Completely reactive; scammers burn and rotate mule accounts within 24 to 72 hours. | **Fast (< 20ms local cache)** | **Maximum (Exact match audit)** | Minimal (Regularly synchronized blacklist index). |

---

## 3. Deep Dive into the False-Positive vs. False-Negative Trade-Off

The fundamental operational barrier in fraud detection engineering is the **Precision-Recall Trade-Off under Extreme Class Imbalance**:
*   *The Math*: In retail instant payments, scams account for approximately **1 out of every 5,000 to 10,000 transactions (0.01% to 0.02% base rate)**.
*   *The Consequence of False Positives*:
    *   If a detection model achieves a seemingly spectacular **99% specificity (1% false-positive rate)** and **90% sensitivity (recall)**:
    *   For every 10,000 transactions, there are 2 actual scams and 9,998 legitimate payments.
    *   The model catches ~1.8 scams (True Positives).
    *   The model falsely flags $9,998 \times 0.01 \approx 100$ legitimate payments (False Positives).
    *   *The False Positive Ratio is 100 : 1.8 (~55 : 1)*!
*   *The Business Reality*: For every single scam intercepted, the bank blocks or disrupts **55 innocent customers**. In real-world retail banking, a 55:1 false-positive ratio triggers thousands of furious customer support calls, merchant contract disputes, and rapid customer attrition to competitor banks.
*   *The Engineering Lesson*: A model cannot rely purely on statistical anomaly detection. It requires **multi-signal triangulation**—combining behavioral duress with counterparty mule risk—to push false-positive ratios below 5:1.

---

## 4. Methodological Summary

This detection taxonomy proves that:
1.  **Pure tabular models (XGBoost)** cannot solve scams because the transaction parameters look normal.
2.  **Pure graph models (GNNs)** cannot operate within synchronous switch latency constraints (<300ms).
3.  **Pure behavioral models (BioCatch)** cannot verify whether the recipient is a mule.

The future of detection lies in **architectural tiering**: using lightweight local behavioral models during the pre-flight formulation window to trigger selective, out-of-band network intelligence queries before the transaction hits the clearing switch.

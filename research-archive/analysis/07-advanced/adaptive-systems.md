# Adaptive Systems: Concept Drift, Unsupervised Clustering, and Active Governance

## 1. Executive Summary & The Imperative of Dynamic Adaptation

Financial payment fraud is an **adversarially co-evolving socio-technical system**. Unlike computer vision or speech recognition—where natural data distributions remain relatively stable over years—fraud distributions drift rapidly as organized syndicates adapt to bank security measures.

When banks deploy new friction on ₹50,000 transfers, syndicates immediately instruct victims to send ₹49,990. When a specific bank's risk model begins catching WhatsApp investment lures, syndicates shift to Telegram or fake job postings. A static machine learning model deployed into production degrades in accuracy within 30 to 90 days.

In strict compliance with Part 7 of the Phase 7 mandate, this document specifies the **Adaptive Systems Architecture** of the *Agentic Guardian*, establishing autonomous concept drift detection, unsupervised zero-day clustering, dynamic policy propagation, and safe shadow-mode canary evaluation.

---

## 2. Adaptive Systems Control Loop

```text
                           THE CONTINUOUS ADAPTIVE CONTROL LOOP
                           
  [Live Production Traffic] ──────► In-Line Scoring Engine (Model v2.4)
            │
            ├── Emits Feature Telemetry ──► Daily Population Stability Index (PSI)
            │                                Wasserstein Distance Drift Monitor
            │                                        │
            ├── Flagged High Friction   ──► Unsupervised Clustering (HDBSCAN)
            │   (Unlabeled Anomalies)        Zero-Day Syndicate Lure Discovery
            │                                        │
            └── Shadow Pipeline Engine  ◄── Candidate Retrained Model (v2.5)
                (Parity Benchmarking)        Evaluates 100% Traffic Without Impact
                                                     │
                                                     ▼
                                            Canary Promotion (1% -> 100%)
```

---

## 3. Core Adaptive Mechanisms

### 3.1 Mechanism 1: Automated Concept Drift & Distribution Shift Monitoring
- **Mathematical Metrics**:
  - **Population Stability Index (PSI)**: Evaluates shifting distributions across the top 20 most predictive features on a rolling 24-hour window:
    $$\text{PSI} = \sum \left( \text{Actual}_i - \text{Expected}_i \right) \times \ln\left(\frac{\text{Actual}_i}{\text{Expected}_i}\right)$$
    - $\text{PSI} < 0.10 \rightarrow$ Normal stability.
    - $0.10 \le \text{PSI} \le 0.25 \rightarrow$ Moderate shift; trigger automated calibration alert.
    - $\text{PSI} > 0.25 \rightarrow$ Severe concept drift; trigger automated model retraining pipeline (`REQ-ADP-001`).
  - **Wasserstein Distance (Earth Mover's Distance)**: Detects subtle shifts in continuous behavioral biometrics (e.g., typing cadence changes induced by seasonal app redesigns or OS updates).

---

### 3.2 Mechanism 2: Unsupervised Zero-Day Scam Clustering
- **Mathematical Approach**: Density-based clustering (HDBSCAN) combined with autoencoder anomaly embeddings (`ACAP-04`, `REQ-ADP-003`).
- **Operational Workflow**:
  - Operates on the set of transactions where the supervised model scored low/medium risk, but where anomalous behavioral signals occurred (e.g., prolonged hesitation, unusual copy-pasting, or high victim cancellation rates).
  - Unsupervised algorithms cluster these outlier vectors in high-dimensional feature space without requiring pre-existing human fraud labels.
  - When an unclassified cluster reaches $\ge 15$ transactions sharing common counterparty VPAs, device signatures, or temporal cadences, the system auto-generates an **Emerging Syndicate Signature** and queues the cluster for expedited Tier-2 investigator review.

---

### 3.3 Mechanism 3: Dynamic Sub-60-Minute Threat Intelligence Propagation
- **Architectural Design**: Decoupled policy distribution fabric powered by lightweight, signed configuration buses (`REQ-ADP-002`, `REQ-TIME-005`).
- **Operational Workflow**:
  - When a law enforcement agency (e.g., I4C 1930 portal or Interpol) flags a new batch of 500 mule bank accounts, compliance officers import the signed CSV/JSON feed.
  - The distribution coordinator compiles the entities into a compressed, high-performance in-memory Bloom filter and Cuckoo filter index.
  - The signed index propagates to all globally distributed edge inference nodes within $\le 60\text{ minutes}$ without requiring software re-compilation, container restarts, or downtime.

---

### 3.4 Mechanism 4: Shadow-Mode Canary Deployment Pipeline
- **Architectural Design**: High-throughput message mirroring evaluating candidate models in parallel against live production streams (`REQ-ADP-004`).
- **Operational Workflow**:
  - Every live production transaction authorization request is mirrored asynchronously to a container cluster hosting Candidate Model $M_{t+1}$.
  - Candidate Model $M_{t+1}$ generates predictions, risk scores, and hypothetical directives. These outputs are logged to a shadow evaluation ledger with zero user impact and zero latency addition to the main clearance path.
  - Automated evaluation dashboards compare rolling PR-AUC, Brier calibration scores, and hypothetical customer insult ratios across 14 consecutive days.
  - If Candidate Model $M_{t+1}$ demonstrates statistically superior Net Economic Utility and respects the $\le 10:1$ insult ceiling, it is promoted via automated progressive canary routing ($1\% \rightarrow 5\% \rightarrow 25\% \rightarrow 100\%$).

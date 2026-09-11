# Open-Source Systems & Research Prototypes: Repositories, Simulators & Benchmarks

---

## 1. Executive Summary

Open-source implementations, benchmarking toolkits, and synthetic transaction simulators represent an indispensable component of the prior art landscape. They allow researchers to inspect concrete code implementations, evaluate reproducible baseline models, and run controlled experiments without violating proprietary banking secrecy.

However, a critical finding of this survey is that **the vast majority of open-source "fraud detection" repositories address generic credit card fraud, synthetic identity fraud, or AML batch laundering—almost none model real-time Authorized Push Payment (APP) scams**.

This document systematically analyzes the leading open-source repositories, simulation frameworks, and research prototypes relevant to the domain. Each implementation is evaluated based on its **code maturity, architectural purpose, empirical methodology, reproducible performance, known limitations, and direct relevance to real-time scam interception**.

---

## 2. Comprehensive Open-Source Systems Survey

### 2.1 PaySim: Synthetic Financial Simulator for Mobile Money Fraud
*   **Repository & Provenance**: Developed by Lopez-Rojas et al. (Blekinge Institute of Technology); open-sourced on GitHub and Kaggle (over 1,500 citations).
*   **Maturity**: High (Industry and academic gold standard for synthetic mobile transaction modeling).
*   **Purpose & Scope**: Simulates mobile money transfer networks based on real-world aggregate financial logs from an African telecommunications provider (operating under the M-Pesa mobile money paradigm).
*   **Technical Methodology**: Uses multi-agent simulation (MAS) to model benign customer financial behavior (transfers, cash-ins, cash-outs, merchant debits) mixed with malicious agent behaviors (funds siphoning and account draining). Generates continuous tabular CSV datasets containing 6.3 million transactions across 744 hourly time steps.
*   **Evaluation & Limitations in Scam Research**:
    *   *The Scam Void*: PaySim models **unauthorized account theft** (an attacker compromises an agent account and transfers funds to their own cash-out node). It contains **zero social engineering mechanics, zero pre-flight behavioral biometrics, and zero victim coaching signals**.
    *   *Static Feature Vector*: Contains only 11 basic transaction columns (`step`, `type`, `amount`, `nameOrig`, `oldbalanceOrg`, `newbalanceOrig`, `nameDest`, `oldbalanceDest`, `newbalanceDest`, `isFraud`, `isFlaggedFraud`).

---

### 2.2 PyGOD & PyTorch Geometric (PyG) Fraud Toolkits
*   **Repository & Provenance**: Open-source Python libraries (`pygod.org` and PyTorch Geometric team); actively maintained by research consortiums across Carnegie Mellon, UIUC, and Notre Dame.
*   **Maturity**: High (Production-grade research framework with continuous unit testing and GPU acceleration).
*   **Purpose & Scope**: Provides standardized implementations of state-of-the-art Graph Neural Networks designed specifically for graph anomaly detection and transaction network fraud.
*   **Included Algorithms**: Implements `CARE-GNN`, `GraphConsis`, `PC-GNN`, `DOMINANT`, `CoLA`, and `AnomalyDAE` under a unified Scikit-Learn-style API (`model.fit()`, `model.predict()`).
*   **Evaluation & Limitations in Scam Research**:
    *   *Streaming Deficit*: PyGOD models operate in static or transductive batch settings. They assume the entire transaction graph is resident in memory. They lack native primitives for **streaming sub-50ms node inference** required in live payment authorization switches.
    *   *Relevance*: Highly valuable for offline money mule community detection; unsuitable for synchronous in-flight rail interception.

---

### 2.3 Bank Account Fraud (BAF) Suite (Feedzai / NeurIPS 2022)
*   **Repository & Provenance**: Published by Feedzai at NeurIPS 2022 (`github.com/feedzai/bank-account-fraud`); peer-reviewed research dataset and evaluation framework.
*   **Maturity**: Production-grade research suite.
*   **Purpose & Scope**: The first publicly available, realistic, and legally sanitized benchmark specifically designed to evaluate fairness, temporal concept drift, and performance in banking fraud models.
*   **Technical Methodology**: Synthesizes 1 million bank account applications and transactional behaviors, incorporating 30 complex features (device OS, session duration, velocity metrics, housing status, credit risk tokens).
*   **Evaluation & Limitations in Scam Research**:
    *   *Focus*: Specifically models **synthetic identity fraud and first-party fraud during account opening (new account fraud)**.
    *   *Scam Gap*: Does not model ongoing authorized push payments on existing, legitimate customer accounts; however, it provides the definitive baseline for detecting how money mules open synthetic accounts.

---

### 2.4 Apache Flink & Faust: Streaming Complex Event Processing (CEP) Engines
*   **Repository & Provenance**: Apache Software Foundation (`flink.apache.org`) and Robinhood (`github.com/robinhood/faust`).
*   **Maturity**: Maximum (Production enterprise backbone for high-throughput stream processing).
*   **Purpose & Scope**: Stateful stream processing frameworks capable of processing millions of events per second with sub-10ms event latencies over distributed message queues (Kafka, Pulsar).
*   **Relevance to Real-Time Payment Surveillance**:
    *   *Real-Time Capability*: Flink provides true **low-latency streaming stateful computation**. It is the reference open-source architecture used by modern banks to maintain rolling velocity counters (e.g., "count of transactions to this VPA in the last 15 minutes across all branches").
    *   *Limitations*: Operates as an **asynchronous event listener**. It can generate alerts and invoke webhooks to freeze accounts within seconds, but cannot sit in-line as a blocking RPC proxy in the primary synchronous payment clearing path without introducing significant networking overhead.

---

## 3. Comparative Summary of Open-Source Prior Art

| Open-Source Project | Primary Focus / Paradigm | Production Maturity | Key Architectural Contribution | Critical Gap for Real-Time Scam Interception |
| :--- | :--- | :--- | :--- | :--- |
| **PaySim** | Multi-Agent Mobile Money Simulator | High (Academic Standard) | Generates synthetic tabular mobile money transaction streams at scale. | Models unauthorized credential theft; contains zero social engineering or behavioral features. |
| **PyGOD / PyG** | Graph Neural Network Anomaly Toolkits | High (PyTorch Ecosystem) | Standardized implementations of `CARE-GNN`, `PC-GNN`, and graph anomaly algorithms. | Batch-oriented GPU training; lacks sub-50ms streaming inference for live payment switches. |
| **Feedzai BAF** | Banking Fraud & Fairness Benchmark | High (NeurIPS 2022) | Realistically simulates modern banking fraud data drift, fairness, and tabular complexity. | Focuses on new account creation / synthetic identity fraud; does not model P2P push scams. |
| **Apache Flink** | Stateful Streaming Event Processing | Maximum (Enterprise Grade)| High-throughput, sub-10ms rolling velocity counters and temporal windowing over Kafka. | Asynchronous surveillance engine; cannot synchronously block in-flight RPC requests without latency overhead. |

---

## 4. Methodological Summary

This open-source landscape audit reveals an acute **prior art deficit**:
*   Researchers have access to excellent synthetic tabular datasets (PaySim) and graph libraries (PyGOD), but **no open-source framework currently models the interaction between a deceived victim, a payment app UI, and a real-time clearing switch**.
*   Any system developed for real-time scam interception must synthesize streaming event primitives (Flink) with client-side behavioral modeling, bridging a gap that current open-source tooling leaves completely unaddressed.

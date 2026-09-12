# Advanced AI & Machine Learning Directions

## 1. Executive Summary & Algorithmic Scope

While the bare-minimum MVP relies on battle-tested Gradient Boosted Decision Trees (GBDT) for sub-45ms real-time scoring, modern machine learning research offers powerful mathematical frameworks that can dramatically elevate scam detection accuracy, explainability, and multi-hop graph intelligence.

In strict compliance with Part 5 of the Phase 7 mandate, this document critically assesses **five advanced AI/ML research directions**. It evaluates their theoretical foundation, empirical evidence, computational trade-offs, and appropriate architectural placement within the payment defense lifecycle.

---

## 2. Advanced AI Technology Evaluation Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ADVANCED AI EVALUATION MATRIX                                  │
├────────┬──────────────────────────────────┬───────────────────────────┬─────────────┬────────────┤
│ Tech ID│ AI / ML Direction                │ Primary Operational Role  │ Latency Reg.│ Feasibil.  │
├────────┼──────────────────────────────────┼───────────────────────────┼─────────────┼────────────┤
│ TAI-01 │ Inductive Graph Neural Networks  │ Multi-hop mule clustering │ Asynchronous│ Very High  │
│ TAI-02 │ Edge-Quantized Small Lang Models │ On-device Socratic dialog │ Near-Real-T.│ High       │
│ TAI-03 │ Split-Conformal Uncertainty Pred │ Epistemic risk calibration│ In-Line     │ Immediate  │
│ TAI-04 │ Causal Discovery & Counterfactual│ Adversarial de-biasing    │ Asynchronous│ High       │
│ TAI-05 │ Zero-Knowledge ML Verification   │ Cross-bank model audits   │ Offline     │ Emerging   │
└────────┴──────────────────────────────────┴───────────────────────────┴─────────────┴────────────┘
```

---

## 3. Deep Analysis of Advanced AI Directions

### 3.1 TAI-01: Inductive Dynamic Graph Neural Networks (GNNs)
- **Mathematical Foundation**: Inductive spatial-temporal graph neural networks (e.g., GraphSAGE, Temporal Graph Networks - TGN) computing structural node embeddings across heterogeneous payment graphs (Senders, Beneficiaries, Devices, VPAs).
- **Why It Matters**: Mules do not operate in isolation; they form dense, high-velocity subgraphs designed to layer stolen funds. Traditional tabular models evaluate only the immediate counterparty, blind to 2-hop liquidity pooling.
- **Latency Physics & Placement**: Executing a 2-hop GNN inference across a graph of 50 million nodes takes $80\text{ms}$ to $250\text{ms}$—far too slow for the synchronous $\le 45\text{ms}$ in-line switch budget (`CF-01`).
- **Architectural Solution**: GNNs execute **asynchronously in near-real-time streaming pipelines** (e.g., streaming Kafka graphs). The GNN continuously updates a low-dimensional node embedding vector stored in Redis. The in-line GBDT model simply pulls this pre-computed 32-dimensional embedding vector in $\le 3\text{ms}$, combining deep graph intelligence with sub-millisecond execution.

---

### 3.2 TAI-02: Edge-Quantized Small Language Models (SLMs) on Device
- **Mathematical Foundation**: 1-bit to 4-bit quantized Small Language Models (1.5B to 3B parameters, such as Gemma-2-2B, Llama-3.2-1B, or Phi-3.5-mini) running natively on modern smartphone Neural Processing Units (Apple Neural Engine, Snapdragon NPU).
- **Why It Matters**: Solves the latency, cost, and privacy paradox of cloud LLMs. By running locally in client RAM, the model can engage the victim in a dynamic Socratic de-biasing conversation (`ACAP-01`) in $\le 300\text{ms}$ per token with **zero telemetry leaving the device**, completely honoring GDPR Article 9.
- **Safety Boundary**: The SLM is restricted to a structured JSON schema using constrained decoding (e.g., Guidance or Outlines), ensuring it can only output vetted de-biasing prompts and cannot hallucinate arbitrary banking advice.

---

### 3.3 TAI-03: Split-Conformal Prediction & Risk Calibration
- **Mathematical Foundation**: Distribution-free conformal prediction frameworks guaranteeing finite-sample coverage guarantees on error rates.
- **Why It Matters**: Traditional machine learning models output pseudo-probabilities that are notoriously uncalibrated, particularly under extreme class imbalance (1:50,000 scam ratio). A raw output of `0.72` might correspond to a true risk of 15% or 95%.
- **Implementation**: Split-conformal calibration computes a dynamic prediction set and non-conformity score for every transaction. If the prediction set contains both `Benign` and `Scam` with high ambiguity, the system flags high epistemic uncertainty (`CAP-04`) and automatically downgrades the intervention to avoid customer insult cascades.
- **Feasibility**: Can be evaluated directly inside the sub-45ms in-line inference pipeline with negligible compute overhead ($\le 0.5\text{ms}$).

---

### 3.4 TAI-04: Causal Inference & Counterfactual Transparency
- **Mathematical Foundation**: Causal DAG (Directed Acyclic Graph) discovery and Structural Causal Models (Pearl's do-calculus) computing counterfactual explanations.
- **Why It Matters**: Mandated by Fair Credit Reporting Act (FCRA) and ECOA adverse action rules (`REQ-EXP-005`). Regulators and consumers require knowing not just *what* correlated with a block, but *what minimum action would change the decision*.
- **Implementation**: The causal engine computes counterfactuals: *"If the recipient account had a verified tenure greater than 30 days and the transaction did not occur during an active phone call, the payment would have cleared without hold."* This provides actionable legal transparency while completely shielding confidential SAR flags (`CF-06`).

---

### 3.5 TAI-05: Zero-Knowledge Machine Learning (ZKML) Proofs
- **Mathematical Foundation**: Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs) generating verifiable cryptographic proofs that a specific machine learning model was executed honestly on private data without revealing the model weights or input features.
- **Why It Matters**: Enables inter-bank regulatory audits and consortium risk verification (`REQ-IND-003`). Bank A can mathematically prove to Bank B and the central regulator that a transaction was evaluated using an approved, un-tampered model version that satisfied all non-discrimination fairness constraints, without exposing proprietary customer transaction data.
- **Feasibility**: High proof-generation overhead (several seconds); strictly suited for **offline regulatory audits and dispute arbitrations**, not in-line transaction scoring.

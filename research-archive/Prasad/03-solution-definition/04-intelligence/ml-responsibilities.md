# Machine Learning Responsibilities: Model Specialization, Scopes, and Boundaries

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Transaction-risk analysis.*
- *• Rule-based and/or LLM-based reasoning.*
- *• Risk score/category.*

Machine learning in GuardianPay is not deployed as an opaque monolith. Rather than forcing a single model to solve numerical tabular scoring, natural-language comprehension, and policy enforcement simultaneously, GuardianPay assigns **distinct, specialized responsibilities across the computational stack**.

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           MACHINE LEARNING SPECIALIZATION STACK                           │
├─────────────────────┬───────────────────┬──────────────┬──────────────────────────────────┤
│ COMPONENT           │ ALGORITHM FAMILY  │ LATENCY SLA  │ SCOPE & PRIMARY RESPONSIBILITY   │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **1. Hot-Path Risk  │ Gradient Boosted  │ < 5 ms       │ • Numerical tabular scoring      │
│   Scorer**          │ Trees (LightGBM)  │ (C++ Native) │ • Amount Z-scores, velocity math │
│                     │                   │              │ • Outputs Risk Score & TreeSHAP  │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **2. Semantic Intent│ Quantized Small   │ < 30 ms      │ • Multilingual Hinglish parsing  │
│   Classifier**      │ Transformer (SLM) │ (CPU/NPU)    │ • Stated purpose note extraction │
│                     │ (IndicBERT INT8)  │              │ • Psychological threat tagging   │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **3. Entity Clash   │ Dense Vector      │ < 2 ms       │ • Cosine distance between stated │
│   Comparator**      │ Embedding Match   │ (In-Memory)  │   intent and CBS legal entity    │
│                     │                   │              │ • Quantifies impersonation gap   │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **4. Agentic        │ Bounded LLM Agent │ 1.5s - 2.2s  │ • Competing hypothesis testing   │
│   Investigator**    │ (Llama-3 / Claude)│ (Pre-PIN)    │ • Tool verification orchestration│
│                     │                   │              │ • Synthesizes explainable alert  │
└─────────────────────┴───────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 2. Component 1: Hot-Path Tabular Risk Scorer (LightGBM)

- **Problem Being Solved:** Directly satisfies the core requirement for *Transaction-risk analysis* and *Risk score/category* within the strict sub-15ms payment switch latency envelope.
- **Input Features (25 dimensions):**
  - Transaction amount, log-transformed amount, rolling 90-day user mean ($\mu$) and standard deviation ($\sigma$).
  - Hour of day (sine/cosine encoded), day of week.
  - Ingress channel (Camera QR, Deep Link, Clipboard Paste, Manual VPA).
  - Clipboard paste velocity ($<150\text{ms}$ boolean).
  - Active telephony call state (`CALL_STATE_OFFHOOK` boolean).
  - Pre-PIN screen dwell time ratio.
  - Beneficiary VPA network age (days), 1-hour inward velocity counter.
- **Output:** 
  - Calibrated probability $P_{\text{GBDT}} \in [0.00, 1.00]$.
  - Risk Category: `LOW` ($P < 0.20$), `MEDIUM` ($0.20 \le P < 0.60$), `HIGH` ($0.60 \le P < 0.85$), `CRITICAL` ($P \ge 0.85$).
  - Top 3 TreeSHAP feature contribution codes.
- **Training Signal:** Binary cross-entropy on historical and synthetic transaction records with class-weighted loss ($w_{\text{pos}} = 50.0$) to counter severe class imbalance.
- **Evaluation Metric:** Precision-Recall AUC (PR-AUC) and False Positive Rate at 95% Recall.
- **Failure Mode & Fallback:** If LightGBM fails, the system falls back to deterministic rule thresholding.

---

## 3. Component 2: Semantic Intent Classifier (IndicBERT)

- **Problem Being Solved:** Directly addresses *urgency-based social engineering* and *impersonation* stated in `PROBLEM_STATEMENT.md` Challenge.
- **Input:** Raw payment note string (`tn`), scanned invoice text, or payee display name (`pn`).
- **Output:** Multi-label intent probability vector across 5 axes:
  1. `AUTHORITY_COERCION` (CBI, Police, Court, Arrest, Customs)
  2. `TIME_SCARCITY` (Immediate, 10 minutes, disconnection tonight)
  3. `FINANCIAL_GAIN` (VIP task, double profit, investment return)
  4. `PANIC_THREAT` (Electricity cut-off, account blocked)
  5. `COGNITIVE_INOCULATION` (Ignore bank warning, test transfer)
- **Model Form Factor:** 4-bit INT8 quantized `IndicBERT-v2` running via ONNX Runtime.
- **Latency Requirement:** $\le 30\text{ms}$ on commodity CPU or mobile edge.
- **Failure Mode & Fallback:** If text is blank or model fails, outputs neutral vector (all zeros); missing text is handled by conjunction features.

---

## 4. Component 3: Entity Clash Comparator

- **Problem Being Solved:** Fulfills the *Recipient verification workflow* and *Impersonation detection* requirements.
- **Mechanism:**
  1. Maps the stated purpose text to an **Intent Category Embedding**: $\vec{v}_{\text{intent}} \in \mathbb{R}^{256}$.
  2. Maps the resolved CBS KYC Legal Name and MCC to an **Entity Category Embedding**: $\vec{v}_{\text{entity}} \in \mathbb{R}^{256}$.
  3. Computes the Semantic Inconsistency Score:
     $$S_{\text{clash}} = 1.0 - \max(0, \cos(\vec{v}_{\text{intent}}, \vec{v}_{\text{entity}}))$$
- **Rule Boundary:** If the stated intent relates to an official institution (e.g. "MSEB Electricity") but the entity category is `INDIVIDUAL_P2P`, $S_{\text{clash}} \ge 0.95$.

---

## 5. What Machine Learning Is FORBIDDEN From Doing

To guarantee safety and determinism:
1. **NO Direct Transaction Execution:** ML models and LLMs cannot initiate, debit, or transfer funds.
2. **NO Autonomous Unchecked Blocking:** An ML score alone cannot issue a permanent, un-overridable block on ambiguous transactions; hard blocks are reserved strictly for deterministic malware/blacklist violations.
3. **NO Hallucinated Evidence Generation:** Models cannot generate ungrounded risk claims; every alert must map to deterministic TreeSHAP codes and verified CBS lookup data.

---

## 6. Epistemic Assessment for PS09

By strictly segmenting ML into **Sub-5ms Tabular Scoring (GBDT)**, **Quantized Semantic NLP (IndicBERT)**, and **Bounded Agentic Hypothesis Testing**, GuardianPay directly satisfies all Core Requirements of `PROBLEM_STATEMENT.md` with zero architectural bloat.

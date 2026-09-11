# Candidate Assessment: Viability Classification and Engineering Justifications

---

## 1. Executive Understanding
To conclude the solution-space exploration, we formally classify every evaluated technological approach into five distinct viability categories: **Strong Candidate, Conditional Candidate, Experimental Candidate, Weak Candidate, and Toy / Demo-Only Anti-Pattern**.

This taxonomy prevents the team from pursuing dead ends in Phase 3, ensuring that engineering resources are concentrated strictly on **architectures that are empirically defensible, computationally scalable, and demonstrably differentiated**.

---

## 2. Formal Viability Classification Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY VIABILITY CLASSIFICATION                             │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ CLASSIFICATION TIER │ TECHNOLOGICAL APPROACH          │ CORE ENGINEERING JUSTIFICATION    │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **1. STRONG         │ • Dual-Path Tiered Triage       │ • Sub-10ms scalability on 99.5%   │
│    CANDIDATES**     │   (Hot GBDT + Warm Agent)       │   volume; concentrates AI compute │
│ (Primary Phase 3    │ • Entity-Purpose Semantic Clash │ • Decisive against impersonation; │
│  Focus)             │ • Dynamic Cognitive Challenges  │ • Shatters psychological coercion │
│                     │ • Native Pre-PIN Chokepoint     │ • Operates before MPIN commit     │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **2. CONDITIONAL    │ • On-Device Behavioral Biometrics│ • Excellent on Android; crippled  │
│    CANDIDATES**     │   (Keystroke/Sensor Dynamics)   │   by iOS sandboxing; sensor noise │
│ (Viable if platform │ • Precomputed Graph Embeddings  │ • Requires central bank/switch    │
│  prereqs met)       │   (Mule Ring Clustering)        │   graph access (cold path)        │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **3. EXPERIMENTAL   │ • Temporal Graph Networks (TGN) │ • Heavy GPU compute requirements; │
│    CANDIDATES**     │   running in real-time streaming│   unproven at 25,000 TPS scale    │
│ (Promising but      │ • Multimodal Vision-Language    │ • High latency (300-800ms);       │
│  compute-heavy)     │   OCR on fake documents         │   viable only for user-uploaded doc│
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **4. WEAK           │ • Monolithic LLM Gatekeeper     │ • Breaches 2,000ms switch SLA;    │
│    CANDIDATES**     │   (Evaluating all transactions) │   annual compute cost > $1.5B     │
│ (Rejected for PS09) │ • Static Keyword Matching       │ • High false positives; trivial   │
│                     │ • Passive Text Warning Banners  │ • 95%+ habituation blindness      │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **5. TOY / DEMO     │ • Naive ChatGPT Prompt Wrapper  │ • Fails latency, privacy, security│
│    ANTI-PATTERNS**  │ • Scraper of Private WhatsApp   │ • Illegal under DPDP Act 2023;    │
│ (Must Avoid)        │ • Unbounded Autonomous Agent    │ • Severe financial loss liability │
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Detailed Justifications for Classifications

### Why Dual-Path Tiered Triage is a "Strong Candidate"
- **The Latency Invariant:** In high-volume payments, 99.5% of transactions must pass in $<10\text{ms}$. Dual-Path architecture decouples the fast-path GBDT from the warm-path agent.
- **The Economic Invariant:** Redirection of only 0.5% of transactions to cloud AI brings annual infrastructure operational costs down from $\$1.8\text{B}$ to under $\$10\text{M}$ for a tier-1 bank.
- **The Forensic Invariant:** Produces deterministic TreeSHAP feature attributions alongside grounded natural-language explanations.

### Why Monolithic LLMs are Classified as "Weak Candidates"
- **The Switch SLA Breach:** Cloud LLM inference (800ms–3,000ms) consistently breaches the 2,000ms switch timeout, triggering `U30` transaction drops.
- **The Stochastic Liability:** LLMs cannot provide mathematical guarantees of determinism required under RBI Banking Ombudsman dispute frameworks.

### Why Private Messaging Scraping is a "Toy / Forbidden Anti-Pattern"
- **Legal Suicide:** Reading third-party WhatsApp or SMS messages violates the Indian Telegraph Act, 1885, DPDP Act 2023, and Google Play Core Policies, resulting in immediate app store de-platforming and criminal wiretapping liability.

---

## 4. Synthesis of Recommended Directions for Phase 3

Based on our solution-space research, Phase 3 (Architecture & System Design) must focus on **evaluating three deeply refined hybrid configurations**:
1. **Direction 1: Client-Centric Intelligent Guardian (TPAP Layer)**
   - Integrates native Android sensor telemetry, local quantized SLM semantic checking, and in-app cognitive challenges.
2. **Direction 2: Gateway-Centric Dual-Path Risk Engine (Bank/PSP Layer)**
   - High-throughput Go/Rust gateway running GBDT hot-path filtering, selectively invoking an asynchronous agentic investigator during the pre-PIN review pause.
3. **Direction 3: End-to-End Federated Guardian (Hybrid Client + Cloud Enclave)**
   - Synchronizes lightweight client telemetry with edge semantic verification and central mule reputation graphs.

---

## 5. Epistemic Assessment for PS09

| Principle | Final Assessment |
| :--- | :--- |
| **Definitive Rejection** | Eliminate standalone LLM gatekeepers, passive text popups, and invasive chat surveillance. |
| **Validated Path** | Concentrate Phase 3 design on **Dual-Path Tiered Triage with Dynamic Cognitive Interruption**. |
| **Agentic Value** | The agent belongs **in the warm investigative corridor for ambiguous edge cases**, never in the synchronous switch loop. |

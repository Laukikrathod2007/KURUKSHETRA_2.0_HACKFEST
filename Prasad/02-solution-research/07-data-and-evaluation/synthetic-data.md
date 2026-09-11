# Synthetic Data Generation: Agent-Based Simulation, Scam Typologies, and Ground-Truth Fidelity

---

## 1. Executive Understanding
Because real-world UPI scam telemetry is locked behind banking secrecy and privacy laws, **principled synthetic generation and agent-based simulation are the only scientifically viable methods for training and benchmarking multi-modal scam interceptors**.

However, naive synthetic generation—such as sampling uniform random numbers or using unconstrained LLM text generation—creates toy artifacts that fail to reflect the statistical physics of financial networks. A production-grade simulator must enforce **rigorous statistical baselines (log-normal amounts, diurnal rhythms, scale-free graph topologies) and inject empirically grounded scam behavioral signatures derived from verified cybercrime case studies**.

---

## 2. Multi-Modal Synthetic Simulation Architecture

```
                    SYNTHETIC UPI SCAM SIMULATION ENGINE
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. POPULATION BEHAVIORAL GENERATOR (Agent-Based Simulation)                │
  │ • 10,000 Synthetic User Agents parameterized by demographic archetypes       │
  │ • Spending baseline: Log-Normal distribution ($\mu = 5.8, \sigma = 1.2$)    │
  │ • Temporal baseline: Diurnal circadian curve (Peak: 11 AM - 1 PM & 7 - 9 PM)│
  │ • Payee Network: Preferential attachment scale-free graph ($\gamma = 2.4$)   │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 2. SCAM TYPOLOGY INJECTION ENGINE (Empirical Attack Scripts)                │
  │ • Synthesizes 8 verified Indian attack classes with exact micro-telemetry:  │
  │   - Digital Arrest / Extortion (High ticket, Active Call, Panic Biometrics) │
  │   - Fake Utility Bill (CBS Name Mismatch, Indic Urgency Note, Individual)   │
  │   - Task / Part-Time Job (Escalating Ponzi ladder, Layered Mule Network)    │
  │   - Remote Access APK (AnyDesk background process, Fast Clipboard Paste)    │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 3. MULTILINGUAL LINGUISTIC NARRATIVE GENERATOR                              │
  │ • Fine-tuned LLM generator creating code-switched Hinglish/Indic notes      │
  │ • Injects realistic OCR artifacts, typos, phonetic transliterations         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 4. MULTI-MODAL EMITTED DATASET (Parquet / JSON Lines)                       │
  │ • 1,000,000 Transactions (99.85% Benign, 0.15% Multi-Modal Scam Injections) │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Parametric Design of Scam Archetypes

To benchmark detection models, the simulator injects specific feature correlations across modalities:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      SIMULATED SCAM TYPOLOGY SIGNATURES                                   │
├───────────────────┬──────────────┬──────────────┬──────────────┬──────────────────────────┤
│ SCAM TYPOLOGY     │ AMOUNT (INR) │ ACTIVE CALL? │ NAME MATCH?  │ TYPICAL PAYMENT NOTE     │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────────────┤
│ **Digital Arrest**│ ₹45,000 -    │ **TRUE**     │ **CLASH**    │ "CBI clearance bond for  │
│                   │ ₹2,50,000    │ (98% prob.)  │ (Govt vs Ind)│  parcel narcotics case"  │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────────────┤
│ **Fake Utility**  │ ₹2,500 -     │ TRUE         │ **CLASH**    │ "Electricity bill update │
│                   │ ₹18,000      │ (65% prob.)  │ (Board vs Ind│  nahi toh line cut hogi" │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────────────┤
│ **Task / Crypto** │ ₹10,000 -    │ FALSE        │ Ind vs Ind   │ "VIP Level 3 investment  │
│                   │ ₹80,000      │ (Chat guided)│ (New payee)  │  task deposit refund"    │
├───────────────────┼──────────────┼──────────────┼──────────────┼──────────────────────────┤
│ **Remote Access** │ ₹49,990      │ **TRUE**     │ Ind vs Ind   │ "Refund verification fee │
│ (AnyDesk / Rust)  │ (Threshold)  │ (Screen-sh.) │ (Clipboard)  │  reversal test"          │
└───────────────────┴──────────────┴──────────────┴──────────────┴──────────────────────────┘
```

---

## 4. What Simulation Can Prove vs. What it Cannot Prove

```
  ┌────────────────────────────────────────────────────────┐
  │ WHAT SIMULATION CAN SCIENTIFICALLY PROVE:              │
  │ • Mathematical convergence of fusion algorithms.      │
  │ • Latency budgets and throughput bottlenecks under load│
  │ • Relative discriminative lift of multi-modal features │
  │   (e.g., adding Call Flag boosts PR-AUC by +0.22).     │
  │ • Resilience of the architecture to component outages. │
  └────────────────────────────────────────────────────────┘
                             VS
  ┌────────────────────────────────────────────────────────┐
  │ WHAT SIMULATION CANNOT PROVE:                          │
  │ • True human psychological compliance under terror     │
  │   (Simulated agents do not feel actual panic).         │
  │ • Zero-day attacker tactics that human engineers have  │
  │   not yet conceived or parameterized.                  │
  │ • Exact real-world distribution of Hinglish slang in   │
  │   unmonitored private phone calls.                     │
  └────────────────────────────────────────────────────────┘
```

### The Scientific Integrity Principle
When presenting results to technical judges, the team must **never disguise synthetic data as live production banking logs**:
- State clearly: *"This benchmark evaluates a synthetic cohort of 1,000,000 transactions generated via Agent-Based Modeling, parameterized by published RBI loss statistics and verified I4C cybercrime typologies."*
- This level of honesty demonstrates profound scientific maturity and instantly separates the team from naive hackathon claims.

---

## 5. Epistemic Assessment for PS09

| Dimension | Synthetic Simulation Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Benchmarking Role** | **Indispensable:** The only way to train and stress-test the complete multi-modal pipeline. | Build a dedicated, deterministic synthetic data generator for Phase 4 evaluation. |
| **Statistical Grounding** | **Must match real-world distributions.** | Calibrate transaction amounts, timestamps, and network graphs to published NPCI/RBI statistics. |
| **Evaluation Integrity** | **Maintain strict train/test separation across scam typologies.** | Test the model against a "Zero-Day Scam Typology" held out entirely from the training set. |

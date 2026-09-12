# Multi-Signal Evidence Fusion: Reconciling Heterogeneous Risk Telemetry

---

## 1. Executive Understanding
In production fraud prevention, **no single signal is authoritative, and naive linear scoring leads to catastrophic failure modes**. A simple weighted sum ($\sum w_i x_i$) fails when signals exhibit non-linear interactions, conflicting indications, or extreme variances in confidence. For instance, a high transaction amount alone is harmless, and an active phone call alone is routine; however, the **conjunction** of an active phone call, an urgent payment note, a new beneficiary, and an institutional name mismatch represents a 99.4% probability of an active impersonation scam.

**Evidence Fusion** is the mathematical and architectural discipline of synthesizing deterministic rules, continuous ML risk scores, graph topology metrics, behavioral biometrics, and semantic NLP embeddings into a calibrated, explainable, and actionable risk determination.

---

## 2. Theoretical Frameworks for Evidence Synthesis

```
                       HETEROGENEOUS SIGNAL INPUTS
  ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐ ┌──────────────────┐
  │ Deterministic   │ │ Supervised GBDT  │ │ Semantic NLP /  │ │ Behavioral / OS │
  │ Rule Flags (0/1)│ │ Fraud Score (0-1)│ │ LLM Risk Vector │ │ Biometrics (Z) │
  └────────┬────────┘ └────────┬─────────┘ └────────┬────────┘ └────────┬─────────┘
           │                   │                    │                   │
           ▼                   ▼                    ▼                   ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                  STAGE 1: HARD SAFETY & OVERRIDE GATES                      │
  │   • Known I4C Police Blacklist Hit? -> HARD BLOCK (Override)                │
  │   • Active AnyDesk Screen-Share?    -> HARD BLOCK (Override)                │
  │   • Whitelisted Regular Contact?    -> FAST-PATH PASS                       │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ Passed Gates (Ambiguous Zone)
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                  STAGE 2: BAYESIAN EVIDENTIARY FUSION                       │
  │   • Update Prior Scam Probability $P(Scam)$ using Likelihood Ratios:        │
  │     $Odds(Scam | E) = Odds(Scam) \times \prod LR(E_k)$                      │
  │   • Resolve Conflicting Evidence via Dempster-Shafer Belief Functions       │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ Fused Posterior Risk + Uncertainty ($\sigma$)
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                  STAGE 3: BOUNDED POLICY DECISION ENGINE                    │
  │   • Evaluates Risk Score $\times$ Severity $\times$ Evidence Confidence     │
  │   • Selects Optimal Intervention (Silent Pass / Banner / Challenge / Pause) │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### Method 1: Hierarchical Cascading (Rule Overrides ML)
In high-stakes financial systems, **deterministic security rules must have veto power over probabilistic models**. 
- If a beneficiary VPA matches an active police FIR on the I4C cybercrime portal, the system does not calculate an ML probability; it issues an unconditional hard block.
- Conversely, probabilistic machine learning handles the wide "gray zone" where no blacklists or hard violations exist.

### Method 2: Bayesian Updating with Likelihood Ratios
For ambiguous transactions, evidence is combined by updating the prior probability of scam using Likelihood Ratios ($LR$):
$$\Lambda(E_1, E_2, \dots, E_n) = \prod_{k=1}^n \frac{P(E_k | \text{Scam})}{P(E_k | \text{Legitimate})}$$
This formulation prevents double-counting correlated signals (e.g., payment note mentioning "police" and payment note mentioning "arrest") by clustering features into conditionally independent dimensions prior to fusion.

### Method 3: Dempster-Shafer Theory of Evidence
When dealing with missing or unobservable data (e.g., offline beneficiary age unknown, or iOS device where call state is invisible), standard Bayesian models artificially collapse uncertainty into false negatives. Dempster-Shafer assigns probability mass to the **power set of hypotheses**:
- Mass assigned to $\{Scam\}$
- Mass assigned to $\{Legitimate\}$
- Mass assigned to $\{Uncertain / Unknown\}$
This explicitly distinguishes between "we know the payee is legitimate" and "we lack sufficient data to evaluate the payee."

---

## 3. Resolving Signal Conflicts: Production Scenarios

| Scenario | Signal A (Indicating Safe) | Signal B (Indicating Risk) | Fusion Mechanism | Resulting Action |
| :--- | :--- | :--- | :--- | :--- |
| **Case 1: The High-Net-Worth Payee** | Remitter regularly transfers ₹1,00,000+; high device trust score. | First-time recipient; unusual transaction hour (2:00 AM). | Bayesian update dampens amount risk; flags temporal novelty. | **Passive Warning Banner:** "First transfer to this payee. Verify account details." |
| **Case 2: The Inoculated Scam Victim** | User enters normal ticket size (₹2,500); calmly types MPIN. | Beneficiary name mismatch ("BSNL Bill" vs "Sunil Kumar"); active phone call. | **Non-linear Conjunction:** Mismatch $\times$ Active Call multiplies risk exponentially. | **Cognitive Challenge:** Forces user to acknowledge legal recipient name before proceeding. |
| **Case 3: The Cold-Start Account** | Device is clean; zero malware; no blacklist match. | Beneficiary VPA registered 3 hours ago; receives 50 incoming transfers from distinct states. | Graph & Recipient velocity dominates local device cleanliness. | **Mandatory Step-Up:** Intercepts transfer; displays velocity anomaly advisory. |

---

## 4. Architectural Boundaries and Failures in Naive Fusion

1. **The Averaging Trap:** Never compute a naive weighted average of risk scores. If 9 signals are zero (normal device, normal location, normal IP) and 1 signal is 1.0 (AnyDesk screen recording active), a weighted average outputs 0.10 (Low Risk), resulting in total protection failure.
2. **Feature Correlation Multipliers:** Feeding both an NLP scam score and a raw keyword count into an uncalibrated regression leads to extreme collinearity, skewing confidence intervals.
3. **The Silent Failure Mode:** If an external intelligence service (e.g., remote VPA reputation API) times out or errors, the fusion engine must fail into a **Graceful Degradation Mode** using on-device and deterministic rules, rather than blocking the user or blindly approving the transaction.

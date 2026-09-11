# Risk Decision Requirements in Scam Defense

## 1. Executive Summary & Purpose

A payment defense system is fundamentally a **decision engine**. However, legacy fraud detection systems generate an impoverished output: a single, scalar probability score (e.g., `0.84`) that indicates *that* something is anomalous, but reveals nothing about *why* it is anomalous, *what* specific scam is occurring, or *how confident* the system is in its assessment.

In strict compliance with Part 5 of the Phase 5 mandate, this document defines the required **decision-making capabilities** of the system. It specifies requirements for multi-level risk stratification, explicit epistemic uncertainty modeling, typology classification, and factual factor attribution. In keeping with our core principles, it defines the necessary properties of the decision output without prescribing specific machine learning algorithms or heuristic formulas.

---

## 2. Decision Output Structure

A compliant risk decision payload must be multi-dimensional, providing rich operational guidance to downstream intervention and review systems:

```text
                     THE MULTI-DIMENSIONAL DECISION PAYLOAD
                     
  Risk Decision Output
  ├── 1. Calibrated Risk Tier: [Low | Guarded | Elevated | Critical]
  ├── 2. Scam Probability Score: [0.000 to 1.000]
  ├── 3. Epistemic Confidence Interval: [Lower Bound, Upper Bound]
  ├── 4. Primary Typology Classification: [Digital Arrest | Pig-Butchering | ...]
  ├── 5. Factual Factor Attributions: [Factor 1, Factor 2, Factor 3]
  └── 6. Recommended Action Directive: [Pass | Advise | De-Bias | Delay | Block]
```

---

## 3. Detailed Risk Decision Requirement Specifications

### 3.1 REQ-DEC-001: Multi-Level Risk Stratification
- **Statement**: The system MUST categorize every evaluated transaction into one of at least four distinct, operational risk tiers:
  1. *Tier 1 (Low / Routine)*: Normal user variance; typical behavior.
  2. *Tier 2 (Guarded / Atypical)*: Mildly unusual payment parameters; no active scam indicators.
  3. *Tier 3 (Elevated / Scam-Consistent)*: Transaction exhibits explicit social engineering indicators or behavioral coercion patterns.
  4. *Tier 4 (Critical / High-Exposure)*: Coerced victim indicators combined with high-risk beneficiary mule attributes or national blacklist matches.
- **Rationale**: Binary approve/block systems fail in retail payments. Tiered stratification enables downstream systems to apply surgical micro-friction and reserve disruptive holds strictly for critical-threat scenarios.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), Dimension J; FM-04, FM-08.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The decision engine deterministically assigns every evaluated transaction to a distinct tier, with fewer than 0.1% of transactions classified as unassigned or ambiguous.
- **Dependencies**: Integrated feature synthesis; risk threshold calibration.
- **Epistemic Uncertainty**: Calibration boundaries between Tier 2 (atypical) and Tier 3 (scam-consistent) under novel payment contexts.

---

### 3.2 REQ-DEC-002: Explicit Epistemic Confidence and Uncertainty Quantification
- **Statement**: The system MUST output an explicit measure of statistical confidence and epistemic uncertainty alongside every risk probability score, distinguishing between situations where the system has high confidence in a low risk score versus situations where data is missing, stale, or ambiguous.
- **Rationale**: An uncalibrated score of "0.50" could mean "we evaluated 50 clear features and it is borderline" or "we have zero data on this payee and cannot tell." Downstream intervention must treat missing data differently from verified safety.
- **Traceability Link**: VG-08 (Model Governance & Opacity Barrier), Dimension G; SR 11-7 Guidelines.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Every emitted risk decision includes a confidence score ($\in [0, 1]$) or probability interval (e.g., 90% confidence interval width); decisions with confidence below 0.60 are explicitly tagged with a `DATA_INSUFFICIENT` flag.
- **Dependencies**: Probabilistic or ensemble uncertainty estimation capabilities.
- **Epistemic Uncertainty**: Computational overhead of generating Bayesian or conformal prediction intervals in real time.

---

### 3.3 REQ-DEC-003: Social Engineering Typology Discrimination
- **Statement**: For any transaction categorized as Tier 3 (Elevated) or Tier 4 (Critical), the system MUST output a primary hypothesized scam typology classification chosen from a standardized taxonomy (including: Digital Arrest / Impersonation, Pig-Butchering / Investment Scam, Task / Employment Trap, Purchase Scam, or Remote Access Coercion).
- **Rationale**: Victims of digital arrest require completely different intervention language (countering police threats) than victims of investment scams (countering FOMO and sunk-cost fallacies). Interventions must match the psychological manipulation.
- **Traceability Link**: VG-01 (Intent Decoupling), VG-04 (Pre-Coaching Failure); Phase 2 Typologies.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: In test datasets of verified scam incidents, the system assigns the correct typology classification in at least 80% of elevated-risk cases.
- **Dependencies**: Multi-class typology classification features; behavioral and interaction indicators.
- **Epistemic Uncertainty**: Classification performance on complex hybrid scams that blend romance and investment fraud.

---

### 3.4 REQ-DEC-004: Causal Factor Attribution and Explainability Generation
- **Statement**: The system MUST provide an auditable list of at least three primary, human-interpretable factual factors that contributed to the risk score for every transaction classified as Elevated or Critical risk.
- **Rationale**: Black-box scores violate Model Risk Management (SR 11-7) and prevent sending banks from issuing legally compliant Adverse Action notices under consumer protection statutes (ECOA / CFPB Circular 2022-03).
- **Traceability Link**: VG-08 (Model Governance & ECOA Barrier), VG-10 (Tipping Off Paradox); REQ-STK-006.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The output payload contains specific, human-readable reason codes (e.g., `PAYEE_ACCOUNT_RECENTLY_ACTIVATED`, `CONCURRENT_VOICE_CALL_ACTIVE`, `VALUE_EXCEEDS_90D_BASELINE_BY_8X`) for 100% of non-routine decisions.
- **Dependencies**: Decision attribution layer; standardized banking reason code ontology.
- **Epistemic Uncertainty**: Ensuring reason codes do not violate AML "tipping-off" legal boundaries (VG-10).

---

### 3.5 REQ-DEC-005: Operational Action Directive Formulation
- **Statement**: The system MUST translate risk scores, confidence bounds, and typology attributions into an actionable operational directive specifying the recommended downstream handling:
  1. `DIRECTIVE_ALLOW`: Unrestricted clearance.
  2. `DIRECTIVE_ADVISE`: In-app contextual advisory cue.
  3. `DIRECTIVE_DEBIAS`: Compulsory interactive de-biasing dialog.
  4. `DIRECTIVE_DELAY`: Enforce temporary cooling-off hold (e.g., 2h–24h) on outbound funds.
  5. `DIRECTIVE_RESTRICT`: Hard transaction decline and automated beneficiary mule alert dispatch.
- **Rationale**: Prevents downstream banking apps from misinterpreting raw mathematical probabilities into arbitrary, uncoordinated security responses.
- **Traceability Link**: VG-07 (Customer Insult Ceiling), Dimension F; Phase 3 Comparative Matrix.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Every risk evaluation maps deterministically to exactly one action directive based on institutionally configured risk policy matrices.
- **Dependencies**: Policy configuration engine; risk-to-action mapping tables.
- **Epistemic Uncertainty**: Harmonization of directive definitions across different participating banking institutions.

---

### 3.6 REQ-DEC-006: Decision State Memory and Trajectory Tracking
- **Statement**: The system SHOULD maintain stateful memory across multiple sequential transactions from the same sender within a 30-day rolling window, tracking the trajectory of payee additions and escalating cumulative risk scores if gradual value buildup ("slow-burn") patterns are detected.
- **Rationale**: Single-transaction evaluation is blind to pig-butchering funnels where early small deposits intentionally establish false legitimate baselines before large withdrawals.
- **Traceability Link**: VG-01 (Intent Decoupling), Dimension A (Slow-Burn Blindness); Phase 2 Causal Chains.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: The system detects multi-stage escalating transfer sequences to unestablished payees and elevates the cumulative risk score by at least two tiers prior to the fourth sequential transfer.
- **Dependencies**: Sender multi-session state store; rolling window aggregation cache.
- **Epistemic Uncertainty**: Storage scaling and memory eviction policies across hundreds of millions of retail payment accounts.

---

## 4. Summary Matrix of Risk Decision Requirements

| Requirement ID | Decision Capability Area | Summary Specification | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-DEC-001** | Risk Stratification | Categorization into 4 operational tiers (Low, Guarded, Elevated, Critical) | **MUST** | VG-07 |
| **REQ-DEC-002** | Uncertainty Modeling | Explicit confidence score ($\in [0, 1]$) and missing data flags | **MUST** | VG-08 |
| **REQ-DEC-003** | Typology Classification | Discrimination across 5 standardized social engineering typologies | **MUST** | VG-01, VG-04 |
| **REQ-DEC-004** | Causal Attribution | Human-interpretable factual reason codes for all non-routine decisions | **MUST** | VG-08, VG-10 |
| **REQ-DEC-005** | Action Directives | Deterministic mapping to 5 standardized operational directives | **MUST** | VG-07, Dim F |
| **REQ-DEC-006** | Trajectory Memory | Stateful 30-day tracking of escalating multi-stage slow-burn funnels | **SHOULD** | VG-01, Dim A |

These risk decision requirements ensure that the system produces actionable, transparent, and multi-dimensional operational intelligence rather than opaque, isolated numerical scores.

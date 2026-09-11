# Advanced Explainability: Causal Attribution, Counterfactuals, and Safe Harbors

## 1. Executive Summary & Epistemic Scope

Explainability in financial machine learning has long been dominated by **correlational feature importance methods** (such as TreeSHAP or LIME). While mathematically elegant for data science benchmarking, correlational explanations are dangerously inadequate for production payment security:
1. **Misleading Correlations**: SHAP values often attribute high risk to benign demographic features (e.g., location or device model) rather than causal criminal mechanics.
2. **Regulatory Non-Compliance**: The CFPB Circular 2022-03 explicitly states that generic algorithmic factor lists do not satisfy the legal requirements for Adverse Action notices under the Equal Credit Opportunity Act (ECOA).
3. **The Tipping-Off Criminal Paradox**: Simply reciting top model features to a user risks committing a felony under Anti-Money Laundering (AML) statutes if the feature discloses confidential law enforcement intelligence (`CF-06`).

In strict compliance with Part 10 of the Phase 7 mandate, this document explores **advanced causal explainability frameworks**, focusing on counterfactual explanations, causal factor attribution, and standardized safe-harbor disclosure lexicons.

---

## 2. Advanced Explainability Architecture

```text
               THE CAUSAL EXPLAINABILITY PIPELINE
               
 [Risk Decision Output] ────► Structural Causal Model (SCM DAG)
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
 [Consumer Counterfactual]  [Regulatory Adverse Action] [AML Tipping-Off Filter]
 "Payment held because of    Deterministic Top-4         Strips all SAR flags &
  new payee + active call.    Principal Reason Codes      intelligence markers;
  Verify payee to proceed."   compliant with ECOA         protects legal compliance
```

---

## 3. Deep Analysis of Advanced Explainability Capabilities

### 3.1 Causal Attribution vs. Correlational SHAP Values
- **The Problem with SHAP**: Correlational SHAP explains what the *machine learning model's trees did*, not *why the transaction is fraudulent in reality*. If a model tree splits on `device_battery_level < 15%` because of an artifact in the training split, SHAP reports battery level as a principal reason for declining a payment, exposing the bank to regulatory sanctions.
- **The Causal Alternative (Structural Causal Models)**:
  - Models the transaction environment as a **Directed Acyclic Graph (DAG)** of cause and effect:
    $$\text{Scammer Coercion} \longrightarrow \text{Active Phone Call} \longrightarrow \text{Touch Hesitation} \longrightarrow \text{New Mule VPA}$$
  - The causal attribution engine evaluates interventions on the DAG. It identifies only those features that have an active causal path to the threat typology (`REQ-DEC-004`).
  - Result: Explanations reflect authentic criminal mechanics (e.g., uncharacteristic transfer under active call), eliminating spurious correlation artifacts.

---

### 3.2 Consumer Counterfactual Explanations
- **Mathematical Definition**: A counterfactual explanation answers the user's fundamental question: *"What is the minimum set of facts that must change for this payment to be approved?"*
  $$\arg\min_{x'} d(x, x') \quad \text{such that} \quad f(x') = \text{Allow}$$
- **Operational Implementation**:
  - Instead of telling a confused consumer *"Risk Score is 0.84"*, the system generates a direct, actionable counterfactual:
    > *"This transfer is currently held because you are sending funds to an unverified recipient while on an active telephone call. If you disconnect the call and verify the recipient's identity via your bank's secure beneficiary list, this transfer can be cleared immediately."*
  - **Empirical Impact**: Empowers legitimate consumers to resolve false-alarm frictions self-sufficiently, while giving coerced victims a clear, logical exit path from the scammer's instructions.

---

### 3.3 Regulatory Adverse Action Disclosures (CFPB / ECOA Compliance)
- **Legal Mandate**: Under the Equal Credit Opportunity Act (12 CFR Part 1002) and CFPB Circular 2022-03, when a consumer's transaction is delayed or denied based on automated algorithms, the creditor must provide specific, actionable principal reasons. Vague declarations like *"declined by risk model"* are illegal.
- **The Standardized Reason Code Engine**:
  - The Guardian maps causal feature attributions into standardized, pre-vetted industry reason codes:
    - `CODE-01`: Uncharacteristic outbound transaction amount relative to 90-day spending history.
    - `CODE-02`: Beneficiary account registration tenure less than threshold for transfer volume.
    - `CODE-03`: Concurrent external communication session active during credential drafting.
    - `CODE-04`: Mismatch between user-declared payment intent and counterparty profile.
  - Automatically exports signed Adverse Action disclosures within $\le 500\text{ms}$ of any transaction decline (`REQ-EXP-005`).

---

### 3.4 Operational Resolution of the AML "Tipping-Off" Paradox
- **The Core Statutory Conflict (`CF-06`)**:
  - PMLA Section 45 and UK Proceeds of Crime Act 2002 Section 333A impose severe criminal penalties (up to 5 years imprisonment) for disclosing that a Suspicious Activity Report (SAR) has been filed or that an account is under money-laundering investigation.
  - If a payment is held because the destination account is on a national cybercrime mule list, telling the user *"Beneficiary is a flagged criminal mule"* is a **criminal tipping-off offense**.
- **The Safe-Harbor Lexicon Filter**:
  - The Guardian implements an automated compliance safe-harbor filter (`REQ-EXP-002`):
    - All outbound consumer-facing text is parsed through a strict whitelist of approved behavioral phrasing.
    - Any reference to internal risk scores, blacklists, police reports, SARs, or law enforcement investigations is mathematically and programmatically blocked.
    - The explanation is strictly grounded in **objective transaction facts**:
      > *"Payment delayed: The destination account has experienced an unusually high volume of incoming transfers in the last 24 hours. For your security, this payment is paused."*
  - Satisfies consumer protection transparency mandates while maintaining absolute criminal safe-harbor compliance under AML statutes.

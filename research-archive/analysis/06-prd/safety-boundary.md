# Safety Boundaries & Algorithmic Authority Limits

## 1. Executive Summary & Philosophy of Bounded Authority

In safety-critical financial systems, the damage caused by an autonomous algorithm exceeding its legitimate operational authority can equal or exceed the harm caused by financial fraud itself. An unconstrained algorithm can arbitrarily freeze legitimate commerce, cause medical catastrophes by blocking hospital admissions, perpetuate systemic racial or demographic discrimination, or trigger catastrophic model collapse by training on its own hallucinated predictions.

In strict compliance with Part 12 of the Phase 6 mandate, this document establishes the **Safety Boundaries and Algorithmic Authority Limits** of the *Agentic Guardian*. It defines with mathematical and legal precision **what the system is allowed to do, and what it is categorically forbidden from doing**.

---

## 2. The Algorithmic Authority Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ALGORITHMIC AUTHORITY MATRIX                                   │
├──────────────────────────────────┬───────────────────────────────────────────────────────────────┤
│ AUTONOMOUS ACTION PERMITTED      │ • Inject non-blocking informational guidance (Level 2).       │
│ (Real-Time Sub-45ms Operations)  │ • Inject interactive cognitive de-biasing challenges (Level 3)│
│                                  │ • Enforce temporary, reversible cooling-off time-locks (L4).  │
│                                  │ • Dispatch out-of-band mule advisories to recipient banks.    │
│                                  │ • Execute deterministic fail-open on timeouts or errors.      │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ MANDATORY HUMAN REVIEW REQUIRED  │ • Permanent account closure or commercial debanking.          │
│ (Human Investigator Monopoly)    │ • Formal filing of Suspicious Activity Reports (SARs).        │
│                                  │ • Permanent asset forfeiture or irreversible fund freezing.   │
│                                  │ • Releasing holds flagged by multi-agency negative lists.     │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ CATEGORICALLY FORBIDDEN ACTIONS  │ • Hard-blocking life-critical medical / utility transfers.    │
│ (Absolute System Prohibitions)   │ • Recording or exfiltrating private voice call audio.         │
│                                  │ • Monetizing risk telemetry for marketing or credit scoring.  │
│                                  │ • Training machine learning models on synthetic predictions.  │
│                                  │ • Silently dropping transactions or causing switch timeouts.  │
└──────────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Safety Policy Specifications

### 3.1 Policy SAF-POL-01: Proportionality and Customer Insult Limits
- **Authority Limit**: The system is permitted to introduce friction, but its operational false-positive rate is bounded by law and bank policy.
- **Safety Ceiling**: The rolling 7-day **Customer Insult Ratio must not exceed $10:1$** across any customer tier (`REQ-SAF-002`).
  - If the insult ratio approaches $8:1$, the system automatically emits an alert to risk operations.
  - If the insult ratio breaches $10:1$, the policy engine automatically raises the risk cutoff for Level 3 friction ($0.65 \rightarrow 0.72$), protecting benign retail commerce from harassment.

---

### 3.2 Policy SAF-POL-02: Categorical Prohibition on Life-Safety Blockades
- **Authority Limit**: The system is **categorically forbidden** from enforcing an unchallengeable hold on life-critical, medical, humanitarian, or essential public utility payments (`REQ-SAF-001`, `REQ-ERR-002`).
- **Enforcement Mechanism**:
  - Merchant Category Codes (MCC) matching hospitals, blood banks, emergency ambulances, and municipal power/water utilities are excluded from Level 4 holds.
  - If an unlisted personal account transfer is placed on hold and the user activates the emergency bypass flow (`CAP-08`), the system must immediately release the hold and clear the payment, transferring the risk to post-debit investigative monitoring.

---

### 3.3 Policy SAF-POL-03: Mandatory Human Monopoly on Irreversible Adverse Determinations
- **Authority Limit**: The product is strictly an **advisory and protective guardian**; it possesses **zero authority to execute irreversible adverse legal actions** against any consumer (`REQ-HITL-002`, GDPR Article 22, CFPB Circular 2022-03).
- **Enforcement Mechanism**:
  - Permanent account deactivation, inclusion on shared criminal blacklists, and statutory SAR filings require affirmative human review, digital signature, and independent compliance sign-off.
  - The system is prohibited from declaring a customer "fraudulent"; it may only report statistical anomaly probabilities.

---

### 3.4 Policy SAF-POL-04: Non-Coercive Cognitive Grounding
- **Authority Limit**: All user-facing de-biasing content must adhere to ethical behavioral ergonomics. The system is forbidden from using manipulative, threatening, or panic-inducing visual design (`REQ-SAF-003`).
- **Enforcement Mechanism**:
  - **Forbidden Elements**: Blinking red warning text, loud sirens, countdown timers shorter than 30 seconds that simulate panic, accusatory language (e.g., *"You are committing a crime"*).
  - **Mandated Elements**: Calming, objective, neutral language (e.g., *"Security check: Please take a moment to confirm these details"*), high contrast, accessibility compliance (WCAG 2.1 AA).

---

### 3.5 Policy SAF-POL-05: Prevention of Algorithmic Model Collapse
- **Authority Limit**: The machine learning model retraining pipeline is **strictly prohibited from ingesting automated model predictions as ground-truth labels** (`REQ-SAF-005`).
- **Enforcement Mechanism**:
  - Training corpora must consist exclusively of **verified downstream outcomes** (confirmed fraud reports verified by bank investigators or national clearing chargebacks) and verified benign transaction histories.
  - Synthetic model outputs and unverified automated flags are mathematically quarantined from training datasets.

---

### 3.6 Policy SAF-POL-06: Strict Purpose Limitation and Privacy Firewalls
- **Authority Limit**: Risk telemetry collected by the client SDK exists solely for the purpose of real-time scam interception. It is **categorically forbidden from being repurposed, monetized, or shared** (`REQ-PRIV-001`).
- **Enforcement Mechanism**:
  - Raw touch telemetry, device environment states, and clipboard events are stored in ephemeral client RAM and discarded $\le 100\text{ms}$ post-evaluation (`REQ-PRIV-002`).
  - No risk telemetry data is shared with marketing, advertising networks, commercial credit scoring bureaus, or third-party analytics trackers.

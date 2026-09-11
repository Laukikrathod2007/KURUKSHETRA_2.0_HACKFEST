# Evidence Architecture: Unified Telemetry Schema, Weighting Calibration, and Contradiction Resolution

---

## 1. Executive Understanding
In high-stakes fraud detection, **treating all evidence as equally authoritative is a fatal architectural pathology**. A payment amount is a weak indicator; an unverified recipient is usually innocent; an active phone call is often benign; but their mathematical conjunction—evaluated through an explicit **Evidentiary Hierarchy**—yields high-fidelity scam discrimination.

This document formalizes the **Unified Evidentiary Schema, the mathematical fusion algorithms, and the formal contradiction resolution rules** that govern risk assessment in GuardianPay.

---

## 2. The Unified Evidentiary Data Schema

Every signal ingested by the Guardian is normalized into a standardized **Evidence Item Object**:

```json
{
  "evidence_id": "ev_8b21c4-912a",
  "signal_category": "RECIPIENT_INTELLIGENCE",
  "signal_name": "RESPVALADD_LEGAL_NAME_CLASH",
  "raw_value": "Suresh Ramesh Patel",
  "normalized_score": 0.98,
  "evidentiary_weight": 0.95,
  "confidence": 0.99,
  "provenance": {
    "source_system": "BENEFICIARY_CORE_BANKING",
    "verification_method": "NPCI_RESPVALADD_PROTOCOL",
    "timestamp_utc": "2026-09-11T13:42:01.102Z",
    "ttl_seconds": 3600
  },
  "attacker_manipulability": "ZERO",
  "evidentiary_tier": "TIER_1_STRONG"
}
```

---

## 3. The 5-Tier Evidentiary Weighting Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE EVIDENTIARY WEIGHTING MATRIX                                │
├──────┬────────────────────────┬────────┬──────────────┬───────────────┬───────────────────┤
│ TIER │ SIGNAL NAME            │ WEIGHT │ CONFIDENCE   │ MANIPULABILITY│ OPERATIONAL VALUE │
├──────┼────────────────────────┼────────┼──────────────┼───────────────┼───────────────────┤
│ **T1**│ CBS Legal Name Mismatch│ 0.95   │ 0.99 (CBS)   │ **ZERO**      │ Decisive proof of │
│      │ AnyDesk APK Active     │ 0.98   │ 1.00 (OS)    │ Low           │ impersonation     │
│      │ I4C Police Blacklist   │ 0.99   │ 0.95 (MHA)   │ Low           │ Confirmed malware │
├──────┼────────────────────────┼────────┼──────────────┼───────────────┼───────────────────┤
│ **T2**│ Active Cellular Call   │ 0.75   │ 0.95 (OS)    │ Low           │ Severe coercion   │
│      │ P2P Handle on Utility  │ 0.85   │ 0.90 (MCC)   │ Low           │ indicator         │
│      │ Ticket Size $Z > 4.0\sigma$│ 0.70│ 0.85 (Stat)  │ None          │ High anomaly      │
├──────┼────────────────────────┼────────┼──────────────┼───────────────┼───────────────────┤
│ **T3**│ Indic Urgency Keywords │ 0.45   │ 0.80 (NLP)   │ High (Blank)  │ Contextual threat │
│      │ Screen Dwell $> 15\text{s}$│ 0.50│ 0.75 (Sensor)│ Moderate      │ Hesitation/coach  │
│      │ Clipboard Fast Paste   │ 0.60   │ 0.85 (Sensor)│ Moderate      │ Out-of-band chat  │
├──────┼────────────────────────┼────────┼──────────────┼───────────────┼───────────────────┤
│ **T4**│ Isolated High Amount   │ 0.25   │ 1.00 (Input) │ None          │ Weak alone; safe  │
│      │ First-Time Recipient   │ 0.20   │ 1.00 (Graph) │ None          │ Routine commerce  │
├──────┼────────────────────────┼────────┼──────────────┼───────────────┼───────────────────┤
│ **T5**│ Raw Display Name (`pn`)│ 0.05   │ 0.20 (User)  │ **EXTREME**   │ Completely forged │
│      │ User Assertion ("Safe")│ 0.00   │ 0.10 (Human) │ **EXTREME**   │ Victim is coerced │
└──────┴────────────────────────┴────────┴──────────────┴───────────────┴───────────────────┘
```

---

## 4. Mathematical Evidence Fusion Engine

Evidence is fused across three deterministic computational stages:

```
                      THE MULTI-STAGE FUSION PIPELINE
  [Raw Evidence Vector E] ──► [Stage 1: Hard Deterministic Gates]
                                       │ (No Hard Violation)
                                       ▼
                              [Stage 2: Bayesian Likelihood Updating]
                                       │ (Posterior Odds Computed)
                                       ▼
                              [Stage 3: Dempster-Shafer Uncertainty Handling]
                                       │
                                       ▼
                              [Final Calibrated Risk Score P & Uncertainty σ]
```

### Stage 1: Deterministic Safety & Override Gates
- If `AnyDesk_Active == TRUE` or `I4C_Blacklist_Hit == TRUE`, the system bypasses probabilistic math and issues an immediate `ACTION: TIER_5_BLOCK`.
- If the payee is an established whitelisted contact ($>10$ historical transfers), risk is dampened by 80%.

### Stage 2: Bayesian Evidentiary Updating
For ambiguous transactions, the posterior probability of a scam is computed via log-odds:
$$\ln\left( \frac{P(\text{Scam} \,|\, E)}{1 - P(\text{Scam} \,|\, E)} \right) = \ln\left( \frac{P(\text{Scam})}{1 - P(\text{Scam})} \right) + \sum_{k=1}^K w_k \cdot \ln(LR(e_k))$$
Where $LR(e_k) = \frac{P(e_k \,|\, \text{Scam})}{P(e_k \,|\, \text{Legitimate})}$ is the empirically calibrated Likelihood Ratio, and $w_k$ is the evidentiary weight.

### Stage 3: Dempster-Shafer Uncertainty Allocation
When external data is unavailable (e.g., offline banking switch causes `RespValAdd` to timeout), standard Bayesian systems produce false negatives. Dempster-Shafer assigns explicit mass to **Uncertainty ($\Theta$)**:
$$m(\{Scam\}) + m(\{Legitimate\}) + m(\{\text{Uncertain}\}) = 1.0$$
If $m(\{\text{Uncertain}\}) > 0.40$ on a high-value transfer, the system triggers a conservative **Tier 1 Advisory Banner**, safely alerting the user without locking their transaction.

---

## 5. Formal Contradiction Resolution Rules

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                             CONTRADICTION RESOLUTION RULES                                │
├─────────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ SIGNAL A (INDICATES SAFE)   │ SIGNAL B (INDICATES RISK)   │ FORMAL RESOLUTION POLICY      │
├─────────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ User regularly spends       │ First-time payee;           │ **NO BLOCK / ADVISORY ONLY:** │
│ ₹1,00,000+; clean device.   │ 2:30 AM transaction.        │ User baseline dampens risk;   │
│                             │                             │ renders non-blocking banner.  │
├─────────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ User states: "This is my    │ Stated note: "Police bail"; │ **COGNITIVE CHALLENGE:**      │
│ personal friend".           │ CBS Name: Private rural P2P.│ Objective entity clash        │
│                             │                             │ overrides subjective claim.   │
├─────────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Zero blacklist complaints;  │ Ticket size > ₹50,000;      │ **CALL INTERLOCK ACTIVATED:** │
│ fresh clean VPA.            │ Active phone call active.   │ Fresh mule vulnerability      │
│                             │                             │ supersedes clean blacklist.   │
└─────────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 6. Epistemic Assessment for PS09

The evidence architecture guarantees that GuardianPay **evaluates transactions based on factual mathematical weights and verifiable Core Banking data**, entirely eliminating the fragility and false alarms of naive scoring engines.

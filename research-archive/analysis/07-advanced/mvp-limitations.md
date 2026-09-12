# MVP Structural Limitations & Residual Vulnerabilities

## 1. Executive Summary & Epistemic Purpose

A bare-minimum MVP is intentionally constrained. In Phase 6, we defined the smallest coherent product that satisfies the core MUST requirements—focusing strictly on pre-flight mobile telemetry, in-line sub-45ms GBDT risk scoring, pre-PIN templated de-biasing dialogues, temporal cooling-off holds, and sub-60s out-of-band mule alerts.

While this minimal baseline provides a decisive leap over legacy post-settlement fraud monitoring, it leaves **seven fundamental structural limitations** unaddressed. Identifying what the MVP *cannot* do is the mandatory starting point for evidence-backed advanced exploration.

---

## 2. Inventory of MVP Structural Limitations

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MVP LIMITATIONS INVENTORY                                      │
├────┬─────────────────────────────┬───────────────────────────────────────────────────────────────┤
│ ID │ Limitation Domain           │ Concrete Operational Breakdown in MVP Baseline                │
├────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ L01│ Pre-Coached Lie Adaptation  │ Templated dialogs cannot dynamically counter personalized     │
│    │                             │ scammer counter-scripts in real time.                         │
│ L02│ Solitary Household Isolation│ Victims living alone under severe panic have no physical or   │
│    │                             │ third-party guardian circuit breaker.                         │
│ L03│ Single-Institution Myopia   │ Cannot query cross-bank mule accounts via zero-knowledge      │
│    │                             │ cryptography (relies on uncoordinated point-to-point APIs).   │
│ L04│ Zero-Day Typology Blindness │ GBDT inference only recognizes previously labeled scam        │
│    │                             │ feature distributions; blind to brand-new criminal lures.     │
│ L05│ Static Decision Boundaries  │ Risk thresholds require manual configuration; cannot          │
│    │                             │ dynamically adapt to intraday syndicate attack surges.        │
│ L06│ Terminal Off-Ramp Recovery  │ Out-of-band mule alerts (≤60s) still fail if syndicate        │
│    │                             │ liquidates at an ATM in under 45 seconds.                     │
│ L07│ Analyst Cognitive Bottleneck│ SOC investigators must still manually reconstruct 2-hop       │
│    │                             │ entity graphs and author regulatory SAR narratives.           │
└────┴─────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 3. Deep Analysis of Structural Limitations

### 3.1 L01: Rigid Templated De-Biasing vs. Adversarial Real-Time Coaching
- **The Limitation**: The MVP relies on parameterized, pre-rendered de-biasing dialogs (`FEAT-05`). 
- **The Failure Mode**: Transnational syndicates maintain continuous live phone calls with victims. If the app displays a static template (*"Police never ask for money over video calls"*), the scammer immediately adapts via voice: *"The corrupt officers inside your bank are trying to stop you from transferring to the government vault; tell the app you are sending money to your cousin."* The static dialog cannot engage in dynamic Socratic refutation of the scammer's live claims.

### 3.2 L02: The Solitary Victim Vacuum
- **The Limitation**: The MVP operates exclusively between the victim's smartphone and the bank's backend.
- **The Failure Mode**: Over 60% of catastrophic "digital arrest" and elder romance scams target isolated individuals living alone. When subjected to intense psychological fear or emotional attachment, solitary self-affirmation fails. The MVP lacks a mechanism to safely alert a pre-authorized trusted family member or co-guardian without violating user privacy (`IND-04`).

### 3.3 L03: Single-Institution Information Asymmetry
- **The Limitation**: The MVP evaluates recipient risk using local bank data and basic switch lookups.
- **The Failure Mode**: Syndicates operate across dozens of retail banks. A mule account at Bank B may receive ₹50,000 from Bank A, ₹50,000 from Bank C, and ₹50,000 from Bank D within 10 minutes. Because banks cannot lawfully share customer account lists without violating financial secrecy statutes (`REQ-PRIV-004`), each sending bank sees only a single minor transfer, remaining blind to the aggregate velocity surge.

### 3.4 L04: Supervised Learning Latency on Zero-Day Lures
- **The Limitation**: The MVP's in-line engine relies on supervised gradient-boosted decision trees (`FEAT-03`) trained on historical fraud labels.
- **The Failure Mode**: When syndicates invent a completely new manipulation narrative (e.g., weaponizing deepfake audio of a regional executive or a novel government subsidy scheme), the transaction features do not match historical fraud distributions. The supervised model assigns a low risk score until hundreds of victims file complaints weeks later.

### 3.5 L05: Inflexible Policy Knobs Under Coordinated DDoS / Surges
- **The Limitation**: Policy thresholds separating Allow, Inform, Intervene, and Hold are static configuration parameters (`FEAT-04`).
- **The Failure Mode**: During coordinated holiday attack campaigns (e.g., Diwali or Black Friday shopping peaks), syndicates deliberately inject high volumes of micro-transactions to overwhelm the gateway. Static thresholds cannot autonomously tighten or loosen based on real-time macro network threat levels.

### 3.6 L06: Terminal Off-Ramp Liquidation Velocity
- **The Limitation**: The MVP dispatches out-of-band mule containment within $\le 60\text{s}$ of ledger debit (`FEAT-10`).
- **The Failure Mode**: Highly organized syndicates station runners at physical ATMs with debit cards or execute instant crypto-swap conversions within 30 to 45 seconds of settlement. Even a 60-second dispatch is too late to recover funds once cash has left the ATM dispenser.

### 3.7 L07: Manual Case Synthesis and SAR Authoring
- **The Limitation**: While the MVP provides a one-page synthesis package (`FEAT-11`), human SOC analysts must still manually draft formal regulatory filing narratives and investigate cross-entity networks.
- **The Failure Mode**: As transaction volumes scale exponentially, bank SOC teams face alert fatigue, resulting in unreviewed alerts and multi-week backlogs for law enforcement evidence submission.

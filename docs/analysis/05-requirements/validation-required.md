# Register of Requirements Requiring Empirical Validation

## 1. Executive Summary & Epistemic Purpose

A paramount principle of rigorous systems engineering—codified in Part 25 of the Phase 5 mandate—is the **categorical rejection of false precision**. In complex socio-technical domains like fraud interception, engineering teams often succumb to the temptation of inventing arbitrary numerical thresholds (e.g., *"the cooling-off delay must be exactly 3 hours"*, or *"the customer insult ceiling must be 8.5:1"*) in the absence of empirical ground truth.

Inventing values creates an illusion of certainty that misleads architects, developers, and compliance officers, frequently resulting in catastrophic operational failure during production deployment. 

This document establishes the **Formal Register of Requirements Requiring Validation**. It identifies six foundational system concepts whose existence is logically necessary, but whose precise parameters, thresholds, or operational boundaries depend on missing empirical data, regulatory rulings, or live field trials. For each concept, this document defines the rationale, the missing evidence, the mandatory validation methodology, and the concrete operational hazards of premature assumption.

---

## 2. Register of Unvalidated Requirement Concepts

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REQUIREMENTS REQUIRING VALIDATION REGISTER                                     │
├────────┬─────────────────────────────────────────────────┬──────────────────────┬─────────────┬──────────────────┤
│ Val ID │ Requirement Concept                             │ Missing Evidence     │ Severity    │ Governance Stage │
├────────┼─────────────────────────────────────────────────┼──────────────────────┼─────────────┼──────────────────┤
│ VAL-01 │ Quantitative Cooling-Off Window Duration        │ Victim De-Biasing RCT│ Critical    │ Field A/B Trial  │
│ VAL-02 │ Demographic-Specific Insult Ratio Ceilings      │ Attrition Curves     │ High        │ Pilot Rollout    │
│ VAL-03 │ Short-Session Behavioral Biometric Sample Bound │ FMR / FNMR Profiling │ High        │ Lab Benchmark    │
│ VAL-04 │ Inter-Bank Automated Hold Indemnity Framework   │ Central Bank Compact │ Catastrophic│ Regulatory Ruling│
│ VAL-05 │ Conversational De-Biasing Linguistic Breakthrough│ Cognitive HCI Trials│ Critical    │ Usability Lab    │
│ VAL-06 │ Carrier Telephony Signaling API Response Latency│ Commercial SLAs      │ High        │ Network Load Test│
└────────┴─────────────────────────────────────────────────┴──────────────────────┴─────────────┴──────────────────┘
```

---

## 3. Detailed Parameter & Hypothesis Analysis

### 3.1 VAL-01: Quantitative Cooling-Off Window Duration

```text
  [Transaction Initiated] ──────► [Cooling-Off Window: T_lock] ──────► [Fund Release / Confirmation]
                                             ▲
                                  WHAT IS THE OPTIMAL T_lock?
                         (2 Hours? 4 Hours? 12 Hours? 24 Hours?)
```

- **Requirement Concept**: The exact temporal duration ($T_{\text{lock}}$) enforced during Level 4 (Hold) protective interventions on high-value, uncharacteristic first-time payments (`REQ-INT-005`).
- **Why It Matters**:
  - The cooling-off window is designed to allow acute psychological arousal (System 1 cortisol spikes induced by digital arrest or fear tactics) to decay, restoring rational cognitive control (System 2 deliberative thought).
  - If $T_{\text{lock}}$ is too short, the victim remains under the active influence of the scammer's voice call and re-authorizes the payment.
  - If $T_{\text{lock}}$ is too long, legitimate urgent payments (e.g., emergency medical admissions, bail, property auction deposits) are delayed, causing severe physical, financial, or emotional harm to benign customers.
- **Missing Evidence**:
  - Empirical psychological half-life curves of acute social engineering panic in real-world victim cohorts.
  - Quantified customer abandonment curves as a function of hold duration across payment amounts ($1,000 to $50,000+).
- **What Needs to Be Validated**:
  - Controlled behavioral trials and retrospective post-incident victim surveys evaluating victim self-realization rates at 1 hour, 2 hours, 4 hours, and 12 hours post-intervention.
- **Consequence of Getting It Wrong**:
  - *If Underestimated*: Victims confirm fraudulent transfers while still on the telephone with the scammer; defense mechanism fails completely.
  - *If Overestimated*: Severe consumer backlash, loss of commercial competitiveness, merchant lawsuits, and potential physical danger if life-critical payments are delayed.

---

### 3.2 VAL-02: Demographic-Specific Customer Insult Ratio Ceilings

- **Requirement Concept**: Distinct, mathematically calibrated customer insult ratio ceilings ($\text{CIR}_{\text{max}}$) for different demographic and transaction archetypes (`REQ-SAF-002`, `REQ-ERR-001`).
- **Why It Matters**:
  - A flat insult ceiling (e.g., $\le 10:1$) fails to account for dramatic variance in fraud exposure across customer segments. Senior citizens (aged 65+) account for disproportionately high losses in investment and impersonation scams, whereas tech-literate young adults experience high volumes of benign micro-transactions with low scam rates.
  - Applying uniform false-positive tolerances creates excessive friction for young digital natives while offering inadequate protection for vulnerable elder populations.
- **Missing Evidence**:
  - Longitudinal customer churn metrics correlated with security friction across segmented demographic brackets.
  - Empirical false-positive distribution data under privacy-compliant demographic auditing.
- **What Needs to Be Validated**:
  - Segmented model calibration evaluating the trade-off between customer churn and fraud loss reduction when $\text{CIR}$ is allowed to reach 15:1 for high-risk elderly accounts versus restricted to $\le 3:1$ for young mobile-first cohorts.
- **Consequence of Getting It Wrong**:
  - High attrition among young digital banking users due to annoying prompts; catastrophic scam losses among elderly customers whose fraud signals were suppressed to meet an arbitrary global insult target.

---

### 3.3 VAL-03: Minimum Behavioral Biometric Sample Window for Short Sessions

- **Requirement Concept**: The minimum interaction duration and event threshold ($N_{\text{events}}$) required before client-side behavioral biometrics (keystroke dynamics, swipe trajectory curvature, touch pressure) can reliably score an anomaly (`REQ-FUNC-001`, `REQ-CTX-002`).
- **Why It Matters**:
  - In modern payment applications, a practiced user entering a familiar payment flow may complete the entire transaction in under 4 seconds, generating fewer than 15 touch events.
  - If the behavioral biometric model requires a 15-second baseline or 50+ touch events to achieve statistical confidence, it cannot execute on the majority of fast, streamlined transactions.
- **Missing Evidence**:
  - False Match Rate (FMR) and False Non-Match Rate (FNMR) curves of modern on-device transformer or LSTM biometric models operating on short sequences ($<5\text{s}$).
  - Hardware variance: touch digitizer sampling rates across budget Android devices versus flagship iOS devices.
- **What Needs to Be Validated**:
  - Laboratory and beta-testing benchmarks measuring ROC-AUC on session lengths ranging from 2 seconds to 30 seconds across varied smartphone hardware.
- **Consequence of Getting It Wrong**:
  - High false alarms on fast, decisive typers; or total model silence on quick transactions, rendering behavioral biometrics useless for rapid scam interception.

---

### 3.4 VAL-04: Inter-Bank Automated Hold Indemnity & Dispute Resolution Framework

- **Requirement Concept**: The legally binding operational protocol, liability allocation formula, and indemnity compact governing automated inter-bank beneficiary containment signals (`REQ-STK-003`, `REQ-FUNC-010`, `REQ-SEC-006`).
- **Why It Matters**:
  - Real-time mule containment requires the receiving institution to place a provisional hold on inbound funds within 60 seconds of settlement.
  - If the receiving bank faces direct civil liability for freezing a benign account based on an automated signal from another bank, no receiving bank will honor the signal without manual human verification—instantly destroying the 60-second containment window.
- **Missing Evidence**:
  - National banking regulator circulars or statutory safe harbors explicitly shielding receiving banks from liability when executing provisional holds requested via authenticated inter-bank scam signals.
- **What Needs to Be Validated**:
  - Formal multilateral banking association agreements (e.g., NPCI in India, Pay.UK in Britain, Federal Reserve FedNow operating rules) defining cross-institutional indemnity and dispute settlement timelines.
- **Consequence of Getting It Wrong**:
  - Receiving banks reject automated hold requests, allowing 100% of mule syndicates to cash out stolen funds within 120 seconds of settlement.

---

### 3.5 VAL-05: Conversational De-Biasing Linguistic Breakthrough Rates

- **Requirement Concept**: The empirical efficacy of specific cognitive linguistic prompts and interactive framing styles (e.g., Socratic questioning vs. authoritative warnings vs. peer social proof) in breaking active scammer coercion (`REQ-INT-003`, `REQ-FUNC-009`).
- **Why It Matters**:
  - Criminal syndicates heavily pre-coach victims ("the bank will tell you this is a scam because they want to seize your money; you must tell them you are sending it to your brother").
  - Traditional authoritative warnings (*"WARNING: You may be a victim of fraud"*) reinforce the scammer's narrative, causing the victim to dismiss the warning immediately. The exact conversational structure that triggers System 2 cognitive re-appraisal without eliciting psychological reactance is unknown.
- **Missing Evidence**:
  - Randomized Controlled Trials (RCTs) testing de-biasing dialog variations on live or clinically simulated victim cohorts.
  - Quantitative cognitive breakthrough rates across varying educational, cultural, and linguistic demographics.
- **What Needs to Be Validated**:
  - Comprehensive HCI usability testing in controlled, IRB-approved environments simulating coercive social engineering attacks to identify optimal conversational interaction flows.
- **Consequence of Getting It Wrong**:
  - Users dismiss de-biasing dialogues as annoying app popups, rendering the entire conversational guardian architecture impotent against coached victims.

---

### 3.6 VAL-06: Telecommunications Network Carrier API Latency & Reliability SLAs

- **Requirement Concept**: The P99 latency distribution, query failure rate, and enterprise throughput capacity of national telecommunications network APIs (e.g., GSMA Open Gateway / Camara Project SIM Swap and Call Status endpoints) under peak national loads (`REQ-TIME-004`, `REQ-STK-007`).
- **Why It Matters**:
  - To detect active scammer calls on sandboxed mobile operating systems without invasive device permissions, the system relies on querying carrier networks during pre-flight drafting.
  - If carrier APIs exhibit P99 latencies exceeding $300\text{ms}$, or if network queries drop packets under peak loads, integrating this signal degrades app performance or forces frequent timeout fallbacks.
- **Missing Evidence**:
  - Production SLA commitments, rate limits, and latency profiles from tier-1 telecom operators under high-concurrency enterprise workloads (10,000+ API calls/sec).
- **What Needs to Be Validated**:
  - Live network performance benchmarking across cellular operators under peak calling hours, testing network hop times and availability SLAs.
- **Consequence of Getting It Wrong**:
  - Payment flows freeze while awaiting carrier network responses; or the system constantly times out and falls back to fail-open, completely negating the benefit of carrier integration.

---

## 4. Governance of Unvalidated Parameters

To maintain the architectural integrity of the project, all parameters listed in this register are governed by three mandatory protocols:

1. **Parameter Isolation**: In all downstream technical specifications, these parameters must be defined as **configurable environment variables** or dynamic policy settings, never hardcoded into algorithm logic.
2. **Defensive Defaulting**: Until empirical field validation is completed, all default parameter values must err on the side of **consumer safety and fail-open resilience** (e.g., conservative cooling-off times, strict insult suppression, and rapid timeouts).
3. **Formal Validation Roadmap**: Phase 6 and Phase 7 must incorporate explicit laboratory and pilot testing milestones designed specifically to resolve these six open questions prior to national production release.

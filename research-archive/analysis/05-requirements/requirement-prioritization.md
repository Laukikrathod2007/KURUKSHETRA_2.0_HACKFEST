# System Requirement Prioritization Framework & Inventory

## 1. Executive Summary & Prioritization Methodology

In complex socio-technical systems—particularly those operating in high-velocity, safety-critical financial environments—the failure to establish an objective, evidence-grounded requirement hierarchy leads to scope collapse, catastrophic engineering trade-offs, or fatal operational vulnerabilities. If everything is prioritized as urgent, engineering teams inevitably sacrifice safety, privacy, or latency constraints under delivery pressure.

This document establishes the **Formal Requirement Prioritization Framework** for the *Agentic Guardian for Real-Time Payment Scam Interception* system. It evaluates all 100 system requirements specified across the Phase 5 knowledge base, categorizing them according to a calibrated adaptation of the **MoSCoW methodology**, augmented with explicit epistemic confidence bounds and operational risk calculus.

---

## 2. Epistemic Prioritization Criteria

Prioritization in Phase 5 is not determined by stakeholder political preference or subjective product ambition. It is derived strictly from **causal necessity, statutory mandate, and failure severity** established in Phases 1 through 4:

```text
                               PRIORITIZATION DECISION TREE
                               
                 Does the absence of this requirement:
                 (A) Cause catastrophic scam interception failure (FM-01/FM-02/FM-03)?
                 (B) Violate statutory banking/switch SLA law (PFRDA, RBI, PSR, PCI)?
                 (C) Cause irrecoverable user harm or severe life-safety impacts?
                                       │
                      ┌────────────────┴────────────────┐
                     YES                                NO
                      │                                 │
                      ▼                                 ▼
                 [ MUST ]                Does its absence cause:
          Non-negotiable core;           (A) Significant operational cost / queue surge?
          system cannot launch           (B) Measurable drop in precision or recall?
          without 100% compliance       (C) Impaired long-term model adaptability?
                                                        │
                                       ┌────────────────┴────────────────┐
                                      YES                                NO
                                       │                                 │
                                       ▼                                 ▼
                                  [ SHOULD ]               Is it an edge capability
                           Vital for scale & efficacy;     providing marginal lift?
                           deferred only under strict                    │
                           documented operational risk        ┌──────────┴──────────┐
                                                             YES                    NO
                                                              │                     │
                                                              ▼                     ▼
                                                          [ COULD ]            [ UNKNOWN ]
                                                     Desirable optimization;  Missing empirical
                                                     future enhancement        field data
```

### 2.1 Definitional Tiers

1. **MUST (Mandatory Core)**:
   - *Definition*: A requirement that must be satisfied unconditionally in the initial production release.
   - *Causal Justification*: Omitting this requirement either (1) renders real-time interception physically or mathematically impossible, (2) violates non-negotiable payment switch SLAs (e.g., `<50ms` in-line budget), (3) triggers catastrophic consumer financial ruin via authorized deception, or (4) violates criminal, privacy, or banking statutes (e.g., GDPR Article 9, DPDP Act, ECOA).
   - *Downgrade Policy*: Cannot be downgraded under any circumstance.

2. **SHOULD (High-Impact Operational)**:
   - *Definition*: A requirement that is highly critical to operational viability, investigative efficiency, or system scalability, but whose temporary absence does not cause immediate regulatory shutdown or complete defense failure.
   - *Causal Justification*: Omitting this requirement creates operational friction (e.g., higher manual triage time for SOC analysts, slower model updating, reduced synthetic simulation fidelity), which can be temporarily mitigated via manual procedures.

3. **COULD (Desirable Enhancements)**:
   - *Definition*: Useful capabilities that enhance user experience, provide marginal risk lift, or offer edge-case optimizations without being required for core threat interception.
   - *Causal Justification*: Provides incremental utility; lowest implementation urgency.

4. **UNKNOWN / VALIDATION REQUIRED (Empirical Hypotheses)**:
   - *Definition*: A requirement concept that is logically compelling but currently lacks sufficient empirical ground truth or field validation to determine its exact operational bounds or necessity.
   - *Causal Justification*: Requires targeted pilot trials or regulatory clarification before binding engineering commitment.

---

## 3. Comprehensive Requirement Prioritization Inventory (100 Requirements)

The following tables systematically classify every requirement across all 16 functional and non-functional families.

### 3.1 Stakeholder Requirements (`REQ-STK-001` to `REQ-STK-008`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-STK-001** | Contextual Cognitive Safeguarding | **MUST** | Protects authorized victims under active manipulation (VG-01, VG-04). | Victims authorize fraudulent transfers despite mechanical 2FA; total scam failure. |
| **REQ-STK-002** | Calibrated In-Line Decisioning & Insult Suppression | **MUST** | Protects sending banks from severe commercial churn and switch disconnects. | Bank faces customer revolt or drops the guardian due to payment blockage. |
| **REQ-STK-003** | Automated Rapid Beneficiary Containment | **MUST** | Solves the 60-second mule cash-out physics ceiling (VG-03, VG-06). | Funds settle into mule accounts and are laundered within seconds; zero recovery. |
| **REQ-STK-004** | Switch SLA & Rail-Agnostic Compliance | **MUST** | Central payment switch enforces non-negotiable sub-50ms hard timeouts. | Bank's risk gateway is dropped or throttled by national switch infrastructure. |
| **REQ-STK-005** | Operational Queue De-Saturation & Causal Triage | **SHOULD** | Prevents SOC alert fatigue and investigator burnout (VG-06, VG-08). | SOC triage time exceeds 30 mins; backlog leads to unreviewed fraud alerts. |
| **REQ-STK-006** | Regulatory Auditability & Adverse Action Compliance | **MUST** | Legal obligation under CFPB Circular 2022-03, ECOA, and SR 11-7. | Regulatory enforcement action, civil money penalties, and mandatory suspension. |
| **REQ-STK-007** | Privacy-Preserving Telephony Signaling Federation | **SHOULD** | Enables call state detection without telecom payload capture (VG-05). | Inability to verify active impersonation calls on strict sandboxed OS environments. |
| **REQ-STK-008** | Rapid Evidentiary Telemetry for Syndicate Disruption | **SHOULD** | Enables law enforcement to freeze downstream mule chains and seize assets. | Laundering networks operate with impunity across secondary and tertiary rails. |

---

### 3.2 Functional Requirements (`REQ-FUNC-001` to `REQ-FUNC-012`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-FUNC-001** | Pre-Flight Mobile Telemetry Ingestion | **MUST** | Captures behavioral and context signals during drafting (VG-02). | Evaluation is forced into the `<50ms` in-line window, causing model starvation. |
| **REQ-FUNC-002** | Multi-Dimensional Context Synthesis | **MUST** | Core detection capability synthesizing behavioral, historical, and rail signals. | Inability to distinguish authentic transactions from coerced authorizations. |
| **REQ-FUNC-003** | External Communication State Detection | **MUST** | Identifies active calls and screen-sharing sessions during transaction entry. | Complete blindness to remote access trojans (RATs) and live scammer calls. |
| **REQ-FUNC-004** | Social Engineering Typology Classification | **MUST** | Required to select the appropriate de-biasing protocol (digital arrest vs. investment). | Generic warnings are displayed, which scammers easily pre-coach victims to bypass. |
| **REQ-FUNC-005** | Inter-Bank Beneficiary Risk Ingestion | **MUST** | Incorporates receiving account age, velocity, and mule risk scores. | Blindness to recipient mule history; sending bank cannot evaluate counterparty. |
| **REQ-FUNC-006** | Presentation-Layer Visual Deception Intake | **COULD** | Ingests UI screenshots or OCR text of fraudulent investment dashboards. | Relies solely on metadata; cannot inspect deceptive visual proof displayed to user. |
| **REQ-FUNC-007** | Multi-Tiered Calibrated Risk Scoring | **MUST** | Generates calibrated risk scores and confidence bounds under sub-50ms SLA. | System cannot stratify risk or trigger proportional interventions. |
| **REQ-FUNC-008** | Progressive Contextual Micro-Friction | **MUST** | Introduces cognitive friction proportional to risk (re-reading, cooling-off). | Users click through static modals within 800ms without reading warnings. |
| **REQ-FUNC-009** | Stateful Cognitive De-Biasing Engagement | **MUST** | Interactive dialogue breaking scammer trance and deconstructing illusions. | High-risk victims proceed to authorize multi-lakh transfers under active coercion. |
| **REQ-FUNC-010** | Near-Real-Time Beneficiary Containment Messaging | **MUST** | Dispatches inter-bank containment signals to beneficiary banks `<60s`. | Mule accounts cash out funds before receiving bank fraud ops are alerted. |
| **REQ-FUNC-011** | Forensic Audit & Evidence Capture | **MUST** | Captures immutable record of signals, scores, and warnings for post-incident audit. | Inability to demonstrate regulatory compliance or defend against indemnity claims. |
| **REQ-FUNC-012** | Continuous Adversarial Drift & Rule Ingestion | **SHOULD** | Ingests emerging scam signatures and negative entity lists within 60 mins. | System degrades rapidly as syndicates rotate mule accounts and lure scripts. |

---

### 3.3 Real-Time Timing Requirements (`REQ-TIME-001` to `REQ-TIME-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-TIME-001** | In-Line Payment Switch Risk Evaluation Budget | **MUST** | In-line decisioning must terminate within $\le 45\text{ms}$ (switch SLA $\le 50\text{ms}$). | Payment switch terminates connection; transactions fail or bypass risk engine. |
| **REQ-TIME-002** | Pre-Flight Interactive Cognitive Response Budget | **MUST** | Client-side risk rendering and dialog response must occur $\le 300\text{ms}$. | User experiences UI freezing, triggering drop-offs or transaction retry storms. |
| **REQ-TIME-003** | Post-Settlement Streaming Mule Containment Dispatch | **MUST** | Out-of-band mule alert must be dispatched and received within $\le 60\text{s}$. | Mule syndicate completes ATM cash-out or crypto conversion; recovery zero. |
| **REQ-TIME-004** | External Telecommunications Signaling Query Timeout | **SHOULD** | Carrier API queries must timeout gracefully at $\le 200\text{ms}$ during pre-flight. | Slow carrier networks freeze client app or delay transaction clearance. |
| **REQ-TIME-005** | Dynamic Policy & Negative Intelligence Propagation | **SHOULD** | Global blacklist and rule updates must reach edge evaluators in $\le 60\text{m}$. | New syndicates exploit zero-day mule batches across institutions for hours. |

---

### 3.4 Risk Decision Requirements (`REQ-DEC-001` to `REQ-DEC-006`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-DEC-001** | Multi-Level Risk Stratification | **MUST** | Enforces 4 distinct operational tiers (Allow, Inform, Intervene, Hold). | Binary decisions force unacceptable false-positive blocks or unmonitored scams. |
| **REQ-DEC-002** | Epistemic Confidence & Uncertainty Quantification | **MUST** | Prevents high-friction blocks when risk score is driven by feature absence. | Benign users with sparse profiles are blocked, creating severe customer insult. |
| **REQ-DEC-003** | Social Engineering Typology Discrimination | **MUST** | Identifies specific psychological manipulation vectors (Digital Arrest, Romance). | Inability to generate typology-specific de-biasing interventions. |
| **REQ-DEC-004** | Causal Factor Attribution & Explainability | **MUST** | Mandated by ECOA and SR 11-7 for adverse action disclosures and audit. | Regulatory rejection of black-box scoring; legal non-compliance. |
| **REQ-DEC-005** | Operational Action Directive Formulation | **MUST** | Translates risk score into explicit executable directives for core banking. | Downstream core banking engines cannot interpret raw floating-point risk scores. |
| **REQ-DEC-006** | Decision State Memory & Trajectory Tracking | **SHOULD** | Tracks multi-payment structuring across hours/days (smurfing behavior). | Syndicates bypass single-transaction thresholds by splitting transfers into chunks. |

---

### 3.5 Context Requirements (`REQ-CTX-001` to `REQ-CTX-006`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-CTX-001** | Transactional Baseline & Relational History | **MUST** | Core signal baseline: establishes standard sender spending and beneficiary links. | Inability to recognize deviation from authentic historical user behavior. |
| **REQ-CTX-002** | Pre-Flight Interaction Timing & Input Mechanics | **MUST** | Captures hesitation, copy-pasting, and rapid navigation in pre-flight. | System loses the 30-120 second pre-flight observation window before PIN entry. |
| **REQ-CTX-003** | Beneficiary Account Risk Attributes | **MUST** | Evaluates recipient account tenure, velocity, and cross-bank flags. | Zero visibility into destination risk; blind authorization of mule transfers. |
| **REQ-CTX-004** | Telephony & Device Environment Status | **SHOULD** | Evaluates active call status and remote desktop sharing presence. | Blindness to live scammer coaching and remote screen takeover attacks. |
| **REQ-CTX-005** | User Self-Reported Contextual Intent | **COULD** | Gathers user-declared purpose during high-risk progressive friction. | System cannot verify discrepancies between stated purpose and beneficiary type. |
| **REQ-CTX-006** | Explicit Exclusion of Inaccessible Data | **MUST** | Prohibits dependency on private encrypted messaging payloads and audio. | Architecture stalls attempting to acquire legally and technically impossible data. |

---

### 3.6 Intervention Requirements (`REQ-INT-001` to `REQ-INT-007`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-INT-001** | Pre-Authorization Intervention Window | **MUST** | Interventions must execute strictly before irreversible PIN/biometric entry. | Warning displayed post-debit is useless; funds have irrevocably left the ledger. |
| **REQ-INT-002** | Habituation-Resistant Dynamic Risk Communication | **MUST** | Prevents automatic conditioned clicking through static security dialogs. | Users dismiss warnings in `<800ms` without cognitive comprehension. |
| **REQ-INT-003** | Pre-Coaching Evasion & Cognitive Grounding | **MUST** | Neutralizes scammer scripts ("bank is corrupt", "tell them it's for family"). | Scammer coaches victim to lie to the app; fraud completes unhindered. |
| **REQ-INT-004** | Proportional Micro-Friction Calibration | **MUST** | Enforces friction budget; restricts severe delays to extreme high-risk cases. | Widespread user annoyance, app uninstalls, and conversion collapse. |
| **REQ-INT-005** | Temporal Cooling-Off Delays (Time-Locks) | **MUST** | Mandatory cooling-off for high-value uncharacteristic first-time transfers. | Victims in acute psychological panic transfer life savings in a single session. |
| **REQ-INT-006** | External Cognitive Circuit Breaker (Trusted Contact) | **SHOULD** | Dual-authorization / trusted third-party alert for vulnerable/elderly users. | Isolated victims under severe coercive trance cannot self-rescue. |
| **REQ-INT-007** | Safe Failure & Unblocking Guarantees (Fail-Open) | **MUST** | Fail-open design ensures system downtime never halts legitimate national commerce. | System crash blocks national payment rails; catastrophic bank liability. |

---

### 3.7 Explainability Requirements (`REQ-EXP-001` to `REQ-EXP-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-EXP-001** | Consumer-Facing Causal Transparency | **MUST** | Translates risk factors into clear, empowering language for the victim. | Victim does not understand why the payment is flagged and assumes app error. |
| **REQ-EXP-002** | AML "Tipping Off" Legal Safe-Harbor Compliance | **MUST** | Ensures user explanations do not disclose confidential SAR or law enforcement data. | Sending bank incurs criminal liability under PMLA / UK Proceeds of Crime Act. |
| **REQ-EXP-003** | Operational SOC Analyst Case Synthesis | **SHOULD** | Generates plain-English narrative summarizing the fraud hypothesis for analysts. | SOC analysts spend 15+ minutes reconstructing graph links, exhausting queue capacity. |
| **REQ-EXP-004** | Regulatory Model Risk Management Auditability | **MUST** | Mandated by Federal Reserve SR 11-7 / OCC 2011-12 model risk governance. | Model is banned by regulatory examiners; cannot be deployed in production. |
| **REQ-EXP-005** | Adverse Action Notice Compliance | **MUST** | Legal obligation under CFPB Circular 2022-03 and Equal Credit Opportunity Act. | Civil lawsuits, regulatory enforcement fines, and exclusion penalties. |

---

### 3.8 Human-in-the-Loop Requirements (`REQ-HITL-001` to `REQ-HITL-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-HITL-001** | Bounded Automation for Real-Time Protective Actions | **MUST** | Authorizes automated soft interventions (micro-friction, cooling-off) `<50ms`. | Real-time defense collapses; human investigators cannot act within 50ms. |
| **REQ-HITL-002** | Mandatory Human Monopoly on Irreversible Determinations | **MUST** | Prohibits automated permanent account closures, debanking, or SAR filings. | Severe legal liability for discriminatory debanking and unlawful financial exclusion. |
| **REQ-HITL-003** | Human Override Governance & Dual-Control Auditing | **MUST** | Governs bank teller, support agent, and analyst overrides of security flags. | Corrupted or socially engineered frontline staff override fraud locks for criminals. |
| **REQ-HITL-004** | Escalation Routing for Borderline & High-Value Cases | **SHOULD** | Directs high-uncertainty / high-value transfers into prioritized analyst queues. | Edge cases slip through unreviewed or cause unnecessary transaction aborts. |
| **REQ-HITL-005** | Analyst Feedback Ingestion for Model Supervision | **SHOULD** | Ingests analyst case determinations as ground-truth supervisory training data. | Models suffer from confirmation bias and train on unverified synthetic outputs. |

---

### 3.9 Safety Requirements (`REQ-SAF-001` to `REQ-SAF-006`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-SAF-001** | Prevention of Life-Critical Payment Blockades | **MUST** | Emergency bypass pathway for hospital, bail, disaster, and life-critical funds. | Catastrophic physical or human harm caused by algorithmic payment blocking. |
| **REQ-SAF-002** | Bounded Proportionality & Insult Protection | **MUST** | Hard ceiling enforcing customer insult ratio $\le 10:1$ across all risk bands. | High false positives drive legitimate customers away; bank disables system. |
| **REQ-SAF-003** | Cognitive Grounding & Non-Coercive De-Escalation | **MUST** | Mandates calm, objective language; prohibits accusatory or panic-inducing text. | Heightened cortisol amplifies victim tunnel vision and drives victim toward scammer. |
| **REQ-SAF-004** | Right to Challenge & Redress Guarantee | **MUST** | Dedicated dispute and immediate review mechanism for wrongfully blocked users. | Financial exclusion, discrimination complaints, and loss of consumer recourse. |
| **REQ-SAF-005** | Prevention of Uncontrolled Algorithmic Feedback Loops | **MUST** | Prohibits automated predictions from polluting ground-truth training datasets. | Model collapse: machine learning models drift into runaway hallucinated risk bands. |
| **REQ-SAF-006** | Cryptographic & Operational Non-Repudiation | **MUST** | Cryptographic chaining of all risk decisions, overrides, and timestamps. | Disputed fraud losses cannot be audited; bank loses regulatory dispute cases. |

---

### 3.10 False-Positive / False-Negative Requirements (`REQ-ERR-001` to `REQ-ERR-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-ERR-001** | Asymmetric Value-Weighted Error Tolerance | **MUST** | Optimizes Net Economic Utility; allows higher false-positive tolerance for high values. | Micro-payments are heavily frictioned while multi-million frauds bypass checks. |
| **REQ-ERR-002** | Categorical Prohibition of Unacceptable False Positives | **MUST** | Zero hard blocks on low-value recurring bills, payroll, and government utilities. | Critical societal commerce is blocked; massive consumer backlash and fines. |
| **REQ-ERR-003** | Reversibility Guarantee for Intermediate Interventions | **MUST** | Intermediate frictions (re-reading, biometric step-up) must be resolvable by user. | Benign users are permanently stuck in payment dead-ends without recourse. |
| **REQ-ERR-004** | Proportional Friction Scaling & Cognitive Budgeting | **MUST** | Enforces user friction budget (maximum 1 interactive challenge per 30 days). | Warning fatigue: users routinely bypass all prompts due to friction saturation. |
| **REQ-ERR-005** | Systematic Continuous Error Auditing & Calibration | **SHOULD** | Weekly precision-recall calibration and customer insult tracking at fixed FPR. | Silent model drift degrades economic utility and increases customer churn unnoticed. |

---

### 3.11 Security Requirements (`REQ-SEC-001` to `REQ-SEC-006`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-SEC-001** | Cryptographic Payload Integrity & Mutual Authentication | **MUST** | Enforces mTLS 1.3 and payload signatures across all risk gateway endpoints. | Man-in-the-middle attacks intercept, alter, or spoof risk scores and transactions. |
| **REQ-SEC-002** | Client-Side Telemetry Anti-Tamper & Runtime Attestation | **MUST** | Verifies device integrity, app signature, and absence of instrumentation hooks. | Malware/trojans spoof device telemetry, reporting benign state during fraud. |
| **REQ-SEC-003** | Adversarial Prompt Injection & Coercion Resistance | **MUST** | Hardens conversational de-biasing components against prompt injection attacks. | Scammer feeds bypass prompts into the dialog window, disabling security checks. |
| **REQ-SEC-004** | Role-Based Access Control & Separation of Duties | **MUST** | Mandates dual control on policy updates and restricts override privileges. | Rogue insider or compromised analyst account disables fraud rules for syndicates. |
| **REQ-SEC-005** | DoS Resilience & API Rate-Limiting | **MUST** | Protects risk decision engine from traffic spikes designed to force fail-open. | Syndicates flood gateway with bogus traffic, forcing fail-open and passing scams. |
| **REQ-SEC-006** | Cryptographic Non-Repudiation of Inter-Bank Signals | **MUST** | Signs all outbound mule containment messages with institutional private keys. | Bad actors inject forged hold messages across banks, causing chaos and fund freezes. |

---

### 3.12 Privacy Requirements (`REQ-PRIV-001` to `REQ-PRIV-006`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-PRIV-001** | Strict Purpose Limitation & Commercial Firewalls | **MUST** | Prohibits monetization or marketing use of risk telemetry (GDPR / DPDP Act). | Massive regulatory fines (up to 4% global turnover) and consumer trust collapse. |
| **REQ-PRIV-002** | Client-Side Ephemeral Processing of Sensor Telemetry | **MUST** | Raw touch coordinates and accelerometer streams processed on-device; never stored. | Creation of illegal biometric surveillance database; severe privacy non-compliance. |
| **REQ-PRIV-003** | Special Category Biometric Data Compliance | **MUST** | Derives behavioral biometrics without violating GDPR Article 9 explicit consent rules. | Class-action privacy lawsuits and mandatory injunctions halting app operations. |
| **REQ-PRIV-004** | Privacy-Preserving Inter-Bank Entity Querying | **MUST** | Mandates cryptographic hashing / PSI for cross-bank mule and beneficiary queries. | Unlawful cross-institutional data sharing violating financial secrecy acts. |
| **REQ-PRIV-005** | Data Retention Limits & Right-to-Erasure Boundaries | **MUST** | Enforces 180-day TTL on raw features while preserving AML audit records for 5-10 yrs. | Retaining unneeded personal data indefinitely creates massive regulatory breach exposure. |
| **REQ-PRIV-006** | Algorithmic Transparency & Data Subject Access | **MUST** | Provides mechanism to fulfill GDPR Article 15 and Article 22 explanation requests. | Legal non-compliance with data subject rights under modern privacy regimes. |

---

### 3.13 Resilience Requirements (`REQ-RES-001` to `REQ-RES-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-RES-001** | Five-Nines High Availability for In-Line Clearance | **MUST** | Mandates 99.999% uptime for the core decision gateway ($\le 5.26\text{m}$ down/yr). | Decision engine downtime directly halts retail payment processing across the bank. |
| **REQ-RES-002** | Deterministic Fast Fail-Open Isolation | **MUST** | In-line circuit breakers isolate failures in $\le 5\text{ms}$, defaulting to fail-open. | Slow risk engine hangs in-line clearance, triggering cascading switch timeouts. |
| **REQ-RES-003** | Partial Data & Feature Degradation Tolerance | **MUST** | Model must execute and output calibrated risk even when 50% of signals are missing. | Telemetry dropouts or network lag cause complete evaluation aborts or crashes. |
| **REQ-RES-004** | Client-Side UI Thread Isolation & Crash Immunity | **MUST** | Client telemetry and micro-friction run in sandboxed threads; zero app crashes. | Scam guardian crashes host mobile banking app during active user transactions. |
| **REQ-RES-005** | Stale Intelligence Resilience & Graceful Aging | **SHOULD** | Engine gracefully discounts confidence when external blacklist feeds go offline. | Outdated intelligence causes false blocks or total blindness to emerging mules. |

---

### 3.14 Observability & Auditability Requirements (`REQ-OBS-001` to `REQ-OBS-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-OBS-001** | Comprehensive Transaction Decision Recording | **MUST** | Records atomic snapshot of inputs, scores, and directives for every evaluated event. | Inability to prove why a transaction was allowed or blocked during forensic audits. |
| **REQ-OBS-002** | Real-Time Operational Performance Telemetry | **MUST** | Emits sub-second metrics on evaluation latency, timeout rates, and directive counts. | Engineering and ops teams have zero visibility into emerging gateway outages. |
| **REQ-OBS-003** | Immutable Human Override & Intervention Logging | **MUST** | Logs teller/analyst overrides and user interaction timestamps to append-only stores. | Untracked insider corruption and inability to audit overridden fraud cases. |
| **REQ-OBS-004** | Forensic Replay & Deterministic Simulation Capability | **SHOULD** | Enables replaying historical events through new candidate models with bit-level parity. | Candidate models cannot be safely validated on past production fraud before rollout. |
| **REQ-OBS-005** | Continuous Error Metric Tracking | **SHOULD** | Tracks rolling PR-AUC, Recall@FPR, and insult ratios across customer segments. | Undetected accuracy degradation over time leading to silent fraud exposure. |

---

### 3.15 Adaptability Requirements (`REQ-ADP-001` to `REQ-ADP-005`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-ADP-001** | Automated Concept Drift & Degradation Detection | **MUST** | Monitors population stability (PSI) and feature distributions in near-real-time. | Model accuracy silently collapses as scammers alter payment amounts and lures. |
| **REQ-ADP-002** | Dynamic Sub-60-Minute Threat Intelligence Ingestion | **MUST** | Ingests novel scam signatures, mule VPA lists, and patterns without code redeploy. | Emergency hotfixes require full software release cycles taking weeks. |
| **REQ-ADP-003** | Unsupervised Emerging Threat Clustering | **SHOULD** | Clusters outlier transactions and unexplained anomalies to discover zero-day scams. | System only detects known, labeled scams; completely blind to novel vectors. |
| **REQ-ADP-004** | Shadow-Mode Candidate Model Evaluation | **SHOULD** | Evaluates new ML pipelines against live production streams with zero user impact. | Risky all-at-once model deployments risk production outages and false-positive spikes. |
| **REQ-ADP-005** | Decoupled Policy Governance Architecture | **MUST** | Enforces strict separation between statistical scoring and business action policies. | Data scientists hardcode risk thresholds; compliance cannot rapidly adjust rules. |

---

### 3.16 Non-Functional Requirements (`REQ-NFR-001` to `REQ-NFR-008`)

| Requirement ID | Requirement Title | Priority | Core Classification Rationale | Impact If Omitted |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-NFR-001** | In-Line Risk Decision Latency Profile | **MUST** | P99 latency $\le 45\text{ms}$; P99.9 $\le 48\text{ms}$ under peak transaction load. | Breaches national payment switch SLAs; gateway is forcibly bypassed. |
| **REQ-NFR-002** | Client-Side Interaction Response & Overhead | **MUST** | App launch overhead $\le 50\text{ms}$; CPU usage $\le 2\%$; battery consumption negligible. | Mobile banking app stutters or drains battery, leading to mass user complaints. |
| **REQ-NFR-003** | High-Throughput Horizontal Scalability | **MUST** | Sustains 15,000 TPS baseline with auto-scaling to 45,000 TPS during peak festivals. | Gateway collapses during national holidays (Diwali, Cyber Monday), freezing payments. |
| **REQ-NFR-004** | Mission-Critical Service Availability (Five Nines) | **MUST** | System guarantees 99.999% availability for core in-line transaction decisioning. | Routine maintenance or cluster failures halt consumer payment processing. |
| **REQ-NFR-005** | Cryptographic Assurance & Zero Plain-Text Exposure | **MUST** | Hardware-grade encryption (AES-256-GCM / TLS 1.3) with zero plain-text storage of PII. | Data breaches expose bank account numbers and user identities to hackers. |
| **REQ-NFR-006** | Accessible & Non-Disruptive Cognitive Ergonomics | **MUST** | WCAG 2.1 AA compliance; multi-lingual de-biasing support for diverse user bases. | Elderly or non-English-fluent users cannot comprehend warnings, increasing fraud loss. |
| **REQ-NFR-007** | Modular Policy Decoupling & Dynamic Configuration | **MUST** | Thresholds and intervention logic configurable via signed configuration pipelines. | Changes to risk appetites require multi-week engineering refactoring. |
| **REQ-NFR-008** | Immutable Append-Only Audit Trail Persistence | **MUST** | Decision records written to WORM (Write Once Read Many) storage with 7-yr retention. | Bank cannot defend decisions during regulatory enforcement or class-action audits. |

---

## 4. Priority Distribution & Statistical Analysis

### 4.1 Global Priority Distribution

```text
========================================================================================
PRIORITY CLASS                     REQUIREMENT COUNT       PERCENTAGE OF TOTAL
========================================================================================
MUST (Mandatory Core)                     78                      78.0%
SHOULD (High-Impact Operational)          20                      20.0%
COULD (Desirable Enhancements)             2                       2.0%
UNKNOWN / VALIDATION REQUIRED             -- (Cross-cutting)       N/A (Registered in validation-required.md)
----------------------------------------------------------------------------------------
TOTAL FORMAL REQUIREMENTS                100                     100.0%
========================================================================================
```

### 4.2 Priority Breakdown by Requirement Family

```text
┌──────────────────────────────────────┬───────┬────────┬───────┬─────────┐
│ Requirement Family                   │ MUST  │ SHOULD │ COULD │ TOTAL   │
├──────────────────────────────────────┼───────┼────────┼───────┼─────────┤
│ Stakeholder Requirements (STK)       │   5   │   3    │   0   │    8    │
│ Functional Requirements (FUNC)       │  10   │   1    │   1   │   12    │
│ Real-Time Timing (TIME)              │   3   │   2    │   0   │    5    │
│ Risk Decisioning (DEC)               │   5   │   1    │   0   │    6    │
│ Context & Telemetry (CTX)            │   4   │   1    │   1   │    6    │
│ Intervention & De-Biasing (INT)      │   6   │   1    │   0   │    7    │
│ Explainability & Audit (EXP)         │   4   │   1    │   0   │    5    │
│ Human-in-the-Loop (HITL)             │   3   │   2    │   0   │    5    │
│ Safety & Harm Prevention (SAF)       │   6   │   0    │   0   │    6    │
│ Error & Insult Calibration (ERR)     │   4   │   1    │   0   │    5    │
│ Security & Anti-Tamper (SEC)         │   6   │   0    │   0   │    6    │
│ Privacy & Statutory Rights (PRIV)    │   6   │   0    │   0   │    6    │
│ Resilience & Availability (RES)      │   4   │   1    │   0   │    5    │
│ Observability & Auditability (OBS)   │   3   │   2    │   0   │    5    │
│ Adaptability & Drift (ADP)           │   3   │   2    │   0   │    5    │
│ Non-Functional Performance (NFR)     │   8   │   0    │   0   │    8    │
├──────────────────────────────────────┼───────┼────────┼───────┼─────────┤
│ TOTAL                                │  78   │  20    │   2   │  100    │
└──────────────────────────────────────┴───────┴────────┴───────┴─────────┘
```

---

## 5. Strategic Boundary: MVP vs. Enterprise Scale

To ensure engineering feasibility while strictly honoring the non-negotiable core, the system defines clear implementation boundaries:

### 5.1 The Mandatory Core (MVP Baseline - 78 Requirements)
- Must include **all 78 MUST requirements**.
- Omitting even one MUST requirement creates an immediate fatal failure:
  - Dropping `REQ-TIME-001` leads to payment switch exclusion.
  - Dropping `REQ-INT-001` renders scam prevention post-facto and useless.
  - Dropping `REQ-PRIV-001` or `REQ-PRIV-003` invites statutory GDPR/DPDP prosecution.
  - Dropping `REQ-SAF-001` creates catastrophic life-safety liabilities.
  - Dropping `REQ-RES-002` causes national payment gridlock if the service stutters.

### 5.2 Enterprise Scaled Horizon (Full System - 100 Requirements)
- Deploys the **20 SHOULD requirements** and **2 COULD requirements**.
- Automates SOC case synthesis (`REQ-EXP-003`), integrates carrier network signaling (`REQ-STK-007`), enables deterministic offline forensic replays (`REQ-OBS-004`), and activates unsupervised zero-day cluster detection (`REQ-ADP-003`).
- These capabilities transform the guardian from an effective transaction shield into an enterprise-grade, self-healing intelligence ecosystem.

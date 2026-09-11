# System Requirement Conflicts, Trade-Offs, and Unresolved Tensions

## 1. Executive Summary & Purpose

In complex, multi-stakeholder financial defense architectures, system requirements do not exist in harmonious isolation. Requirements derived from different operational imperatives—such as national payment switch latency, criminal anti-money laundering statutes, consumer privacy protections, cognitive de-biasing ergonomics, and banking fraud liability—frequently exert opposing forces upon system design.

In strict compliance with Part 20 of the Phase 5 mandate, this document identifies, dissects, and registers the **seven fundamental requirement conflicts** inherent to the *Agentic Guardian for Real-Time Payment Scam Interception*. Rather than prematurely or arbitrarily choosing a side, this document rigorously models the underlying mechanics, affected stakeholders, severity, open decisions, and empirical evidence required to resolve each conflict.

---

## 2. Global Conflict Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          SYSTEM REQUIREMENT CONFLICT MAP                                         │
├──────┬──────────────────────────────────────────┬─────────────────────────────┬─────────────┬────────────────────┤
│ ID   │ Conflicting Imperative A                 │ Conflicting Imperative B    │ Severity    │ Primary Domain     │
├──────┼──────────────────────────────────────────┼─────────────────────────────┼─────────────┼────────────────────┤
│ CF-01│ In-Line Latency Budget (≤45ms)           │ Multi-Modal Context Depth   │ Catastrophic│ Physics vs Compute │
│ CF-02│ Insult Suppression (Insult Ratio ≤10:1)  │ Detection Sensitivity       │ High        │ Statistical Risk   │
│ CF-03│ Telephony & Interaction Context          │ Privacy & Data Minimization │ High        │ Security vs Privacy│
│ CF-04│ Real-Time Sub-Second Action              │ Meaningful Human Oversight  │ Critical    │ Automation vs HITL │
│ CF-05│ Habituation-Resistant Cognitive Friction │ Seamless User Experience    │ High        │ Safety vs UX       │
│ CF-06│ Consumer Causal Adverse Action Notices   │ AML Tipping-Off Prohibition │ Critical    │ Regulatory Legal   │
│ CF-07│ Rapid Automated Mule Containment (≤60s)  │ Beneficiary Legal Due Process│ High       │ Inter-Bank Compact │
└──────┴──────────────────────────────────────────┴─────────────────────────────┴─────────────┴────────────────────┘
```

---

## 3. Deep Analysis of System Requirement Conflicts

### 3.1 Conflict CF-01: In-Line Latency Budget vs. Multi-Modal Contextual Complexity

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-TIME-001: In-Line Decision Budget (≤ 45 ms)    │
                      │ REQ-STK-004: Switch SLA Compliance                │
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-FUNC-002: Multi-Dimensional Context Synthesis │
                      │ REQ-FUNC-005: Inter-Bank Beneficiary Risk Ingest  │
                      │ REQ-CTX-003: Beneficiary Graph Intelligence       │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-TIME-001` / `REQ-STK-004` / `REQ-NFR-001`: Mandate that all in-line risk scoring must terminate deterministically within $\le 45\text{ms}$ to prevent switch timeouts.
  - `REQ-FUNC-002` / `REQ-FUNC-005` / `REQ-CTX-003`: Require synthesizing cross-institutional beneficiary graph signals, device telemetry, and behavioral interactions to detect complex social engineering.
- **Source of Conflict**:
  - The physical limits of distributed computing. Performing a cross-network HTTPS API call to query a beneficiary bank's risk ledger takes $60\text{ms}$ to $180\text{ms}$ under standard TLS Handshake and network routing conditions—instantly blowing past the entire $45\text{ms}$ in-line switch budget. Executing deep multi-agent LLM reasoning or large graph neural network (GNN) embeddings within $45\text{ms}$ is computationally infeasible at national scale (15,000–45,000 TPS).
- **Stakeholders Affected**:
  - Central Payment Switch (UPI, FedNow, Faster Payments), Sending Bank Switch Gateway Engineers, Risk Ops, Fraud Victims.
- **Severity**: **Catastrophic**. (Breaching the $45\text{ms}$ budget triggers immediate switch timeouts, transaction clearance failure, and potential disconnection from the national payment network).
- **Unresolved Decision**:
  - Does the system perform synchronous in-line network queries, or does it enforce a strict architectural bifurcation where all external data is cached asynchronously during pre-flight drafting (`REQ-FUNC-001`), restricting in-line evaluation strictly to pre-computed vector lookups?
- **Evidence Needed to Resolve**:
  - Network round-trip latency benchmarks between major retail banks and the central switch; empirical profiling of sub-10ms GBDT feature stores versus distributed graph queries.

---

### 3.2 Conflict CF-02: Customer Insult Suppression vs. Aggressive Scam Detection Sensitivity

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-SAF-002: Customer Insult Ratio ≤ 10:1          │
                      │ REQ-ERR-002: Categorical Prohibition on False Blocks│
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-FUNC-007: High-Sensitivity Threat Interception │
                      │ REQ-STK-001: Zero Loss to Coerced Authorization    │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-SAF-002` / `REQ-ERR-002`: Enforce a strict customer insult ceiling ($\le 10:1$) and categorically forbid hard blocking legitimate recurring bills, payroll, and emergency transfers.
  - `REQ-FUNC-007` / `REQ-STK-001`: Demand aggressive interception of authorized scams, which often mimic legitimate first-time payments (e.g., buying a used car, paying an unlisted home contractor).
- **Source of Conflict**:
  - Extreme class imbalance. Authorized push payment scams occur at a base rate of roughly 1 in 25,000 to 1 in 50,000 legitimate retail transactions. In such an imbalanced regime, even a highly accurate model with a $99.9\%$ specificity ($0.1\%$ False Positive Rate) will generate **25 to 50 false positives for every single true scam detected** (an insult ratio of 25:1 to 50:1), violently breaching `REQ-SAF-002`.
- **Stakeholders Affected**:
  - Retail Consumers, Commercial Merchants, Sending Bank Executive Leadership (concerned with customer churn), Fraud Risk Officers.
- **Severity**: **High**. (If insult suppression dominates, multi-lakh scams slip through unchecked; if sensitivity dominates, tens of thousands of benign consumers are blocked daily, sparking customer revolt and app abandonment).
- **Unresolved Decision**:
  - What exact value-weighted risk threshold ($\text{Cutoff}_V$) separates a frictionless approval from non-disruptive micro-friction, and what threshold justifies a mandatory temporal cooling-off lock?
- **Evidence Needed to Resolve**:
  - Value-weighted customer attrition curves: at what friction level do customers abandon transactions or switch banks? Production PR-AUC curves under realistic class imbalance ratios.

---

### 3.3 Conflict CF-03: Contextual Richness & Telephony Ingestion vs. Statutory Privacy & Data Minimization

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-FUNC-003: External Communication State Capture │
                      │ REQ-CTX-004: Telephony & Remote Screen Telemetry   │
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-PRIV-001: Statutory Purpose Limitation         │
                      │ REQ-PRIV-002: Ephemeral Client-Side Processing     │
                      │ REQ-PRIV-003: GDPR Article 9 Biometric Bounds      │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-FUNC-003` / `REQ-CTX-004`: Require detecting whether the user is on an active telephone call, participating in a remote screen-sharing session (AnyDesk, TeamViewer), or subject to RAT manipulation during payment drafting.
  - `REQ-PRIV-001` / `REQ-PRIV-002` / `REQ-PRIV-003`: Require absolute adherence to GDPR, India DPDP Act, and California CCPA, prohibiting continuous background surveillance, voice recording, or unauthorized device scanning.
- **Source of Conflict**:
  - The technical mechanism of signal acquisition. Operating systems (iOS, modern Android) sandboxing models treat call detection, screen capture, and process inspection as high-privilege surveillance APIs. Collecting these signals risks regulatory sanctions, app store rejection, or consumer perception of spyware.
- **Stakeholders Affected**:
  - Bank Privacy Officers, Data Protection Authorities (DPA, EDPB), Mobile OS Platform Vendors (Apple, Google), Fraud Investigators.
- **Severity**: **High**. (Violating privacy statutes carries statutory fines up to 4% of global turnover or ₹250 crore under India DPDP; omitting telephony signals blinds the system to 80% of digital arrest and tech support scams).
- **Unresolved Decision**:
  - Can telephony and screen state detection be legally and technically restricted to **ephemeral, on-device binary state indicators** (e.g., `is_call_active: true`, derived via non-recording OS flags or GSMA Open Gateway network APIs) without transferring raw sensor data off the device?
- **Evidence Needed to Resolve**:
  - Formal Data Protection Impact Assessment (DPIA) signed by regulatory counsel; testing GSMA Open Gateway Call Status API latency and carrier availability.

---

### 3.4 Conflict CF-04: Sub-Second Real-Time Action vs. Meaningful Human Oversight (HITL)

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-TIME-001: Sub-50ms Automated Intervention      │
                      │ REQ-HITL-001: Bounded Automation for Real-Time Act │
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-HITL-002: Mandatory Human Monopoly on Adverse   │
                      │ REQ-SAF-004: Right to Challenge and Redress SLA    │
                      └─────────────────────────┴──────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-TIME-001` / `REQ-HITL-001`: Dictate that protective interventions (e.g., cooling-off delay, biometric step-up, challenge question) must execute in real time before funds leave the account.
  - `REQ-HITL-002` / `REQ-SAF-004`: State that no customer may suffer an adverse determination or permanent restriction solely based on automated profiling without human review and a right to challenge.
- **Source of Conflict**:
  - The temporal disconnect between automated clearance and human response. Automated systems make determinations in 30 milliseconds; human fraud analysts take 3 to 15 minutes to review a single case. If a customer is trying to pay for groceries or an urgent rideshare, an automated 30-minute "hold for analyst review" is functionally equivalent to an outright block (an adverse determination).
- **Stakeholders Affected**:
  - Consumer Protection Regulators (CFPB, RBI, FCA), Fraud SOC Operations Teams, Retail Consumers waiting in live checkout queues.
- **Severity**: **Critical**. (Automating full blocks creates massive regulatory exposure for arbitrary debanking; requiring human review before any friction causes 99% of scam payments to clear before an analyst ever opens the alert).
- **Unresolved Decision**:
  - What constitutes an "adverse determination"? Does a reversible 4-hour cooling-off window during which the user can self-authenticate constitute an adverse action requiring prior human sign-off, or is it a protective safety boundary?
- **Evidence Needed to Resolve**:
  - Legal analysis of CFPB Circular 2022-03 and Equal Credit Opportunity Act (ECOA) defining whether temporary security frictions constitute "adverse action"; human investigator throughput capacity models.

---

### 3.5 Conflict CF-05: Habituation-Resistant Cognitive Friction vs. Seamless User Experience

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-INT-002: Habituation-Resistant Dynamic Prompts │
                      │ REQ-INT-003: Active Cognitive De-Biasing Dialogs   │
                      │ REQ-INT-005: Mandatory Cooling-Off Time Locks     │
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-NFR-006: Accessible & Non-Disruptive UX        │
                      │ REQ-ERR-004: Strict Monthly Friction Budgeting     │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-INT-002` / `REQ-INT-003` / `REQ-INT-005`: Require breaking victim psychological tunnel vision using interactive de-biasing, forced reading comprehension checks, and cooling-off delays.
  - `REQ-NFR-006` / `REQ-ERR-004`: Demand seamless, frictionless user journeys, high payment conversion rates, and strict adherence to a monthly friction budget (max 1 challenge per month for benign users).
- **Source of Conflict**:
  - The psychological mechanics of persuasion. Scammers systematically prime victims to expect warnings ("the bank app will lie to you; just click agree"). To defeat this pre-coaching, the intervention must demand active cognitive effort (System 2 engagement). However, product management and retail merchants operate under intense commercial incentives to eliminate every millisecond of friction to maximize conversion.
- **Stakeholders Affected**:
  - Mobile Banking Product Teams, Payment Merchants, E-Commerce Platforms, Vulnerable Users under coercive control.
- **Severity**: **High**. (Weak friction is instantly clicked through by coached victims; strong friction leads to payment abandonment, merchant churn, and user complaints against the bank).
- **Unresolved Decision**:
  - Under what specific combination of risk signals is interactive cognitive friction permissible, and what is the exact escalation path from subtle micro-friction to hard time-locks?
- **Evidence Needed to Resolve**:
  - Human-computer interaction (HCI) field trials measuring the exact drop-off in payment conversion versus the breakthrough rate of cognitive de-biasing across varied scam typologies.

---

### 3.6 Conflict CF-06: Adverse Action Causal Transparency vs. AML "Tipping Off" Criminal Prohibition

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-EXP-001: Consumer Causal Transparency          │
                      │ REQ-EXP-005: Adverse Action Disclosures (ECOA)     │
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-EXP-002: AML "Tipping Off" Legal Safe-Harbor   │
                      │ Statutory Criminal Penalties (PMLA, POCA)         │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-EXP-001` / `REQ-EXP-005`: Consumer credit and banking regulations require providing consumers with specific, actionable, and truthful reasons when a transaction or service is declined or delayed.
  - `REQ-EXP-002`: Anti-Money Laundering (AML) statutes strictly forbid "tipping off" any person that a Suspicious Activity Report (SAR) has been filed or that a beneficiary account is under active law enforcement surveillance.
- **Source of Conflict**:
  - Direct statutory collision. If a payment is blocked because the destination VPA belongs to a known mule syndicate flagged by police, telling the user: *"Payment blocked: Beneficiary is a flagged criminal mule"* legally constitutes the felony offense of **tipping off** under the UK Proceeds of Crime Act 2002 (POCA §333A) and Indian Prevention of Money Laundering Act (PMLA). Conversely, saying a vague *"Payment declined for security"* violates CFPB adverse action transparency rules and leaves the victim vulnerable to scammer re-routing.
- **Stakeholders Affected**:
  - Bank AML Compliance Officers, Bank Legal Counsel, Consumer Financial Protection Regulators, Victims.
- **Severity**: **Critical**. (Tipping-off carries personal criminal liability and imprisonment for bank compliance staff; adverse action failure carries civil enforcement penalties and litigation).
- **Unresolved Decision**:
  - What standardized, legally vetted lexicon can be deployed that clearly conveys behavioral risk to the sender (e.g., *"This recipient account was created today and has unusual turnover"*) without disclosing confidential intelligence, SAR filings, or law enforcement investigations?
- **Evidence Needed to Resolve**:
  - Joint regulatory guidance or safe-harbor opinion letters from financial intelligence units (FinCEN, FIU-IND) and consumer protection agencies (CFPB, RBI Ombudsman).

---

### 3.7 Conflict CF-07: Rapid Automated Beneficiary Containment vs. Receiving Bank Due Process

```text
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-STK-003: Rapid Automated Mule Containment ≤60s │
                      │ REQ-FUNC-010: Inter-Bank Out-of-Band Signal Dispatch│
                      └─────────────────────────┬──────────────────────────┘
                                                ▲
                                                │ FUNDAMENTAL TENSION
                                                ▼
                      ┌────────────────────────────────────────────────────┐
                      │ REQ-SAF-004: Due Process & Anti-Exclusion Guarantees│
                      │ Receiving Bank Autonomy & Legal Liability Bounds   │
                      └────────────────────────────────────────────────────┘
```

- **Conflicting Requirements**:
  - `REQ-STK-003` / `REQ-FUNC-010`: Require dispatching automated signals to the beneficiary bank within $\le 60\text{s}$ of settlement to freeze incoming funds before the syndicate executes ATM cash-out or crypto conversion.
  - `REQ-SAF-004` / Receiving Bank Legal Safeguards: Forbid freezing consumer funds without verifiable legal due process, court order, or authoritative regulatory directive.
- **Source of Conflict**:
  - Inter-bank liability and sovereign jurisdiction. The sending bank's automated risk model is not an authoritative legal mandate for the receiving bank. If receiving bank Bank B automatically freezes Account Y based solely on a real-time webhook from sending bank Bank A, and Account Y turns out to be a benign merchant whose legitimate business is ruined, **Bank B faces direct civil liability and damages lawsuits**, not Bank A.
- **Stakeholders Affected**:
  - Receiving Banks (Beneficiary Institutions), Sending Banks, Benign Merchants mistakenly flagged as mules, Law Enforcement.
- **Severity**: **High**. (Without rapid automated containment, 100% of mule funds are liquidated within 120 seconds; with unverified automated containment, legitimate bank accounts across the country are wrongfully frozen without judicial review).
- **Unresolved Decision**:
  - What level of containment action is legally permissible under inter-bank agreements? (e.g., Placing an outbound debit restriction on the specific newly received funds for 2 hours versus freezing the entire beneficiary account).
- **Evidence Needed to Resolve**:
  - National banking association compacts (e.g., NPCI circulars on mule account freezing, UK PSR mandatory reimbursement operational guidelines) defining inter-bank indemnity frameworks.

---

## 4. Conflict Resolution Framework & Research Governance

To ensure these seven fundamental tensions are managed with scientific integrity throughout subsequent design and architecture phases, the project enforces three governance rules:

1. **No Silent Engineering Compromises**: No developer or data scientist may arbitrarily relax a safety, privacy, or latency requirement in code without an explicit, documented reference to these conflict IDs.
2. **Explicit Pareto-Frontier Modeling**: In Phase 6 (PRD) and Phase 7 (Architecture), systems must model these trade-offs as multi-objective optimization problems with parameterizable policy knobs, rather than hardcoded heuristics.
3. **Continuous Stakeholder Validation**: The legal and regulatory conflicts (CF-03, CF-04, CF-06, CF-07) must be submitted to external banking and compliance counsel for formal opinion letters prior to production deployment.

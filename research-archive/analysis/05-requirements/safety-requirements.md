# Safety Requirements in Scam Defense

## 1. Executive Summary & Epistemic Protocol

In safety-critical systems engineering (such as aviation, medical devices, and nuclear infrastructure), safety is defined as **the prevention of harm caused by system actions, decisions, or failures**. A payment defense system operates within a safety-critical socio-technical domain: an incorrect algorithmic decision can directly cause catastrophic financial ruin to an individual, paralyze a business's payroll, trap a consumer in an emergency, or trigger unlawful financial exclusion.

In strict compliance with Part 10 of the Phase 5 mandate, this document defines the **safety requirements** of the system. For every identified systemic harm, it establishes a formal requirement designed to eliminate or mitigate the failure mode, backed by explicit rationale, severity classifications, and **measurable acceptance conditions**.

---

## 2. Taxonomy of Systemic Harms in Payment Defense

```text
                       TAXONOMY OF SYSTEMIC HARMS
                       
  [Type 1: Protective False Negative Harm]
  System fails to intervene ──► Victim loses life savings; psychological trauma
  
  [Type 2: Disruptive False Positive Harm]
  System blocks legitimate transfer ──► User stranded; missed medical/rent payment
  
  [Type 3: Cognitive & Psychological Harm]
  System uses aggressive panic UI ──► Heightens victim anxiety; induces reactance
  
  [Type 4: Due Process & Exclusion Harm]
  System issues opaque, unappealable ban ──► Consumer de-banked without legal recourse
```

---

## 3. Detailed Safety Requirement Specifications

### 3.1 REQ-SAF-001: Prevention of Life-Critical Payment Blockades
- **Failure Being Prevented**: An automated fraud block prevents a legitimate consumer from executing an urgent, time-sensitive, life-critical payment (e.g., hospital emergency admission fees, utility reconnection, urgent bail, or essential medication purchases).
- **Requirement Statement**: The system MUST provide an expedited, authenticated emergency exception pathway that permits users to bypass non-critical security holds for designated emergency merchant categories or verified humanitarian transfers, logging the override under heightened post-authorization monitoring.
- **Rationale**: Trapping a legitimate consumer in an automated security hold during a genuine medical or personal emergency creates unacceptable human harm and exposes financial institutions to severe legal liability for catastrophic damages.
- **Evidence**: Consumer complaints documented by the UK Financial Ombudsman Service (FOS) and Australian AFCA regarding consumers stranded abroad or denied medical treatment due to unchallengeable automated fraud blocks.
- **Severity**: **CATASTROPHIC (Safety Level 1)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The emergency exception pathway allows an authenticated user to complete a verified emergency transfer within less than 3 minutes, with 100% of exception events flagged for immediate Tier-2 human compliance review.
- **Dependencies**: Category-code identification (MCC); multi-factor emergency challenge mechanism.
- **Epistemic Uncertainty**: Risk of scammers exploiting the "emergency exception" pathway by coaching victims to claim fake medical emergencies.

---

### 3.2 REQ-SAF-002: Bounded Proportionality and Insult Protection
- **Failure Being Prevented**: Aggressive model thresholds generate widespread false alarms that alienate innocent customers, trigger catastrophic commercial cart abandonment, and overwhelm bank customer service infrastructure.
- **Requirement Statement**: The system MUST enforce an automated safety ceiling that constrains active user intervention (speed bumps, questionnaires, and cooling-off delays) to an aggregate operational insult ratio of not more than **10 false challenges for every 1 true positive scam detected (10:1)** across baseline retail payment streams.
- **Rationale**: An unconstrained machine learning model tuned for 99% recall can easily generate a 50:1 insult ratio, shutting down legitimate digital commerce and causing massive customer churn.
- **Evidence**: Operational data from global payment service providers (Feedzai / Featurespace 2024): Any fraud engine exceeding a 10:1 insult ratio triggers executive override and model de-tuning due to customer complaints and merchant disputes.
- **Severity**: **HIGH (Commercial & Operational Harm)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Under rolling 24-hour evaluation, the system's automated intervention rate does not exceed 1.5% of total legitimate transaction volume, maintaining an empirically verified insult ratio $\le 10:1$.
- **Dependencies**: Real-time insult ratio tracking telemetry; dynamic threshold self-regulation.
- **Epistemic Uncertainty**: Calibration stability during extreme seasonal transaction surges (e.g., Black Friday, Diwali).

---

### 3.3 REQ-SAF-003: Cognitive Grounding and Non-Coercive De-Escalation
- **Failure Being Prevented**: User-facing security screens employ alarmist, aggressive, or authoritarian language (*"CRITICAL SECURITY THREAT: YOUR ACCOUNT IS AT RISK"*) that amplifies the victim's System 1 panic, pushing them deeper into the scammer's psychological grip.
- **Requirement Statement**: All user-facing risk communication and intervention dialogues MUST utilize neutral, empathetic, non-accusatory, and calming language designed to lower physiological arousal, encourage conscious reflection, and avoid aggressive paternalistic confrontation.
- **Rationale**: Scammers induce panic to shut down logical thinking. An aggressive bank warning reinforces the victim's panic state and triggers psychological reactance (Brehm's theory), causing the victim to perceive the bank as an adversary.
- **Evidence**: Behavioral psychology research (*Behavioural Public Policy*, 2023): Empathetic, grounding language increased scam recognition by 44% compared to aggressive threat warnings, which increased user error by 22%.
- **Severity**: **HIGH (Psychological Harm & Intervention Failure)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: 100% of user-facing UI text, prompts, and dialog templates pass behavioral linguistic audits, scoring zero on threatening vocabulary (e.g., "Illegal", "Penalty", "Violated") and utilizing verified cognitive grounding frameworks.
- **Dependencies**: Behavioral linguistic review of copy; UX copy guidelines.
- **Epistemic Uncertainty**: Cultural and linguistic nuances across diverse regional demographics.

---

### 3.4 REQ-SAF-004: Right to Challenge and Redress Guarantee (Anti-Exclusion)
- **Failure Being Prevented**: A consumer is subjected to automated payment blocks, account holds, or financial de-platforming with no accessible mechanism to contest the decision, speak to a human, or seek timely redress.
- **Requirement Statement**: The system MUST provide an explicit, transparent, and accessible redress pathway that enables any user whose transaction is blocked or delayed to request an immediate review, submit supporting context, and receive a definitive determination within statutory service windows.
- **Rationale**: Automated systems that make irreversible or disruptive financial decisions without human appeal violate fundamental administrative justice, European GDPR Article 22, and US CFPB consumer protection rules.
- **Evidence**: US CFPB Circular 2022-03 on Algorithmic Adverse Action and UK Treasury Select Committee investigations into wrongful consumer de-banking.
- **Severity**: **CRITICAL (Legal & Human Rights Harm)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Every intervention screen or notification includes a direct, single-click redress access point, routing contested decisions to a human support workflow with an SLA guaranteeing an initial response within 60 minutes.
- **Dependencies**: Customer support escalation queue integration; Adverse Action tracking.
- **Epistemic Uncertainty**: Operational cost of handling high-volume frivolous challenge requests.

---

### 3.5 REQ-SAF-005: Prevention of Uncontrolled Algorithmic Feedback Loops
- **Failure Being Prevented**: The system's automated decisions pollute downstream training datasets (e.g., transactions blocked by an early rule are automatically treated as confirmed scams in future training), creating self-reinforcing algorithmic bias and progressive accuracy degradation.
- **Requirement Statement**: The system MUST segregate automated model predictions from independently verified ground-truth scam dispute labels, preventing unverified automated interventions from feeding into model retraining pipelines without human or empirical validation.
- **Rationale**: Machine learning models trained on their own unverified outputs suffer from model collapse, amplification of historical biases, and catastrophic concept drift.
- **Evidence**: Machine learning theory (*Nature 2024* on model collapse in self-consuming training loops) and financial fraud data engineering audits.
- **Severity**: **HIGH (Systemic Algorithmic Degradation)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Data training pipelines enforce strict data lineage controls that reject synthetic or model-generated risk labels, requiring external verification (customer dispute, police report, or human investigator sign-off) for all positive training samples.
- **Dependencies**: Data lineage metadata tracking; ground-truth label ingestion pipelines.
- **Epistemic Uncertainty**: Delay in acquiring verified ground-truth labels vs. need to retrain models rapidly.

---

### 3.6 REQ-SAF-006: Cryptographic and Operational Non-Repudiation
- **Failure Being Prevented**: A corrupt insider, malicious actor, or system bug alters historical risk evaluation logs, enabling fraudulent manipulation of liability determinations or covering up compliance failures.
- **Requirement Statement**: All generated risk evaluations, user interaction responses, override authorizations, and intervention outcomes MUST be cryptographically hashed and committed to an append-only, tamper-evident log store, ensuring complete non-repudiation.
- **Rationale**: In legal disputes and regulatory audits (e.g., determining whether a bank is liable under mandatory reimbursement mandates), the integrity of the historical risk record must be legally unimpeachable.
- **Evidence**: Banking litigation records before the UK Financial Ombudsman and US commercial arbitration courts where evidentiary integrity of electronic logs was challenged.
- **Severity**: **HIGH (Legal & Financial Harm)**.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: The system generates SHA-256 cryptographic hashes for all decision events and anchors daily block roots to an immutable ledger, ensuring zero undetected post-hoc modifications in automated integrity audits.
- **Dependencies**: Cryptographic hashing libraries; immutable storage infrastructure.
- **Epistemic Uncertainty**: None; standard cryptographic engineering practice.

---

## 4. Summary Matrix of Safety Requirements

| Requirement ID | Failure Mode Prevented | Core Safety Mandate | Severity | Priority |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-SAF-001** | Life-Critical Payment Blocks | Emergency exception pathway for urgent humanitarian/medical transfers | **Catastrophic** | **MUST** |
| **REQ-SAF-002** | Excessive Customer Insult | Automated safety ceiling enforcing $\le 10:1$ insult ratio | **High** | **MUST** |
| **REQ-SAF-003** | System 1 Panic Amplification | Empathetic, grounding language; zero alarmist or aggressive text | **High** | **MUST** |
| **REQ-SAF-004** | Unchallengeable De-Banking | Transparent single-click redress pathway with $<60\text{m}$ SLA | **Critical** | **MUST** |
| **REQ-SAF-005** | Algorithmic Model Collapse | Strict segregation of automated predictions from verified training truth | **High** | **MUST** |
| **REQ-SAF-006** | Evidence Tampering | Cryptographic non-repudiation and immutable append-only decision logging | **High** | **MUST** |

These safety requirements ensure that the system operates within strict ethical, legal, and operational guardrails, actively protecting legitimate consumers from systemic collateral damage while relentlessly intercepting criminal deception.

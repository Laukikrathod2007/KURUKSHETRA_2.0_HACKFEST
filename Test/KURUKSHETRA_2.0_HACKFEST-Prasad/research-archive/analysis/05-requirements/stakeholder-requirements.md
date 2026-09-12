# Stakeholder Requirements in Scam Defense

## 1. Executive Summary & Purpose

A payment defense system does not operate in an abstract technical void; it functions within a complex multi-stakeholder ecosystem where different actors possess conflicting incentives, legal responsibilities, operational constraints, and failure modes. A system that optimizes exclusively for one stakeholder (e.g., maximizing bank fraud loss reduction) while ignoring another (e.g., customer friction or regulatory model compliance) will trigger systemic rejection and fail in production.

In strict compliance with Part 2 of the Phase 5 mandate, this document derives requirements from the **eight primary ecosystem stakeholders** modeled in Phase 2 (`actor-incentive-model.md`). For each stakeholder, it analyzes their critical operational needs, decision points, operational constraints, and failure consequences, translating them into formal, traceable stakeholder requirements (`REQ-STK-001` through `REQ-STK-008`).

---

## 2. Multi-Stakeholder Operational Matrix

```text
                     THE MULTI-STAKEHOLDER ECOSYSTEM
                     
  [1. Payment Users / Victims] ◄──────────────► [2. Sending Banks (Payer PSP)]
  - Demand speed & safety                       - Demand low fraud loss & low insult
  - Vulnerable to coercion & panic              - Constrained by in-line switch budgets
           │                                                   │
           ▼                                                   ▼
  [3. Receiving Banks (Mules)] ◄──────────────► [4. Central Payment Switch]
  - Face regulatory mule pressure               - Strict <50ms throughput SLA
  - Legally barred from sharing PII             - Neutral settlement utility
           │                                                   │
           ▼                                                   ▼
  [5. Fraud SOC Analysts]      ◄──────────────► [6. Regulatory & Legal Bodies]
  - Overwhelmed by alert volume                 - Enforce SR 11-7, ECOA, GDPR, Reimbursement
           │                                                   │
           ▼                                                   ▼
  [7. Telecom Carriers]        ◄──────────────► [8. Law Enforcement Agencies]
  - Hold active call signaling                  - Receive complaints 48h late
  - Demand privacy compliance                   - Demand actionable inter-bank freezes
```

---

## 3. Detailed Stakeholder Requirement Derivations

### 3.1 Stakeholder 1: Payment Users & Consumers (The Potential Victim)
- **Operational Profile**: Digital banking customers executing peer-to-peer (P2P), bill payment, or commercial transfers on mobile devices.
- **Core Needs**: Instant, reliable payment execution for legitimate life needs; protection from catastrophic social engineering deception without being treated patronizingly.
- **Decision to Make**: *"Is this transaction safe to authorize, or am I being actively defrauded?"*
- **Operational Constraints**: Operating under System 1 cognitive stress, urgency, fear, or excitement during scam interactions; prone to inattentional blindness and habituation.
- **Material Failure**: Permanent, unrecoverable loss of life savings; severe psychological trauma; loss of trust in digital payments.
- **Derived Requirement**:
  - **REQ-STK-001: Contextual Cognitive Safeguarding**
    - *Statement*: The system MUST provide payment users with context-specific, non-habituating risk communication before irreversible payment authorization, capable of disrupting psychological coercion and prompting conscious deliberation without imposing intrusive friction on routine payments.
    - *Traceability*: VG-01 (Intent Decoupling), VG-04 (Pre-Coaching Failure); Phase 2 Actor Model (Victim).
    - *Priority*: **MUST**.

---

### 3.2 Stakeholder 2: Sending Banks (Payer PSPs / Account Issuers)
- **Operational Profile**: Retail financial institutions holding the victim's primary transaction account and providing mobile banking applications.
- **Core Needs**: Prevent customer scam losses; minimize mandatory regulatory reimbursement payouts; protect brand reputation; prevent customer churn.
- **Decision to Make**: *"Should this payment be cleared immediately, challenged with step-up verification, delayed for review, or declined?"*
- **Operational Constraints**: Must respond within the core switch risk window (<50ms in-line); cannot exceed commercially acceptable customer insult ceilings (<40:1); must comply with model governance.
- **Material Failure**: Escalating scam reimbursement liabilities (e.g., UK PSR 50/50 liability up to £85,000); customer defections due to aggressive false-positive payment blocks; call-center staffing collapse.
- **Derived Requirement**:
  - **REQ-STK-002: Calibrated In-Line Decisioning and Insult Suppression**
    - *Statement*: The system MUST enable sending banks to evaluate authorized scam risk during pre-flight drafting and in-line clearance without exceeding switch latency budgets and without exceeding an operational customer insult ceiling of 10:1 false positives to true positives.
    - *Traceability*: VG-02 (Switch Latency), VG-07 (Customer Insult Ceiling); Phase 2 Actor Model (Sending Bank).
    - *Priority*: **MUST**.

---

### 3.3 Stakeholder 3: Receiving Banks (Beneficiary PSPs / Mule Acquirers)
- **Operational Profile**: Institutions holding the recipient accounts where scam proceeds land, often neo-banks or commercial retail branches.
- **Core Needs**: Identify and neutralize money mule accounts; prevent account opening fraud; comply with inbound regulatory liability; avoid freezing innocent customer accounts.
- **Decision to Make**: *"Is this inbound payment flowing into an active money mule, and should the account's outgoing credits be immediately frozen?"*
- **Operational Constraints**: Legally prohibited by bank secrecy laws from disclosing customer PII to competitor banks; faces regulatory liability if it facilitates money laundering.
- **Material Failure**: Regulatory enforcement penalties; mandatory reimbursement of scam proceeds under shared-liability regimes; reputation as a "preferred mule bank."
- **Derived Requirement**:
  - **REQ-STK-003: Automated Rapid Beneficiary Containment**
    - *Statement*: The system MUST enable receiving institutions to ingest real-time inter-bank risk indicators and execute automated, protective outbound credit restrictions on suspected mule accounts within 60 seconds of fund settlement, prior to terminal cash-out.
    - *Traceability*: VG-03 (Inter-Bank Asymmetry), VG-06 (Mule Velocity vs. SOC Triage), IND-GAP-02; Phase 2 Actor Model (Receiving Bank).
    - *Priority*: **MUST**.

---

### 3.4 Stakeholder 4: Payment Networks & Central Switches (NPCI, FedNow, Pay.UK)
- **Operational Profile**: Operators of the national real-time payment clearing rails responsible for message routing, liquidity settlement, and switch uptime.
- **Core Needs**: Maintain 99.999% rail availability; sustain peak throughput (50,000+ TPS); preserve sub-2.5s end-to-end settlement SLAs; maintain public trust in the national payment system.
- **Decision to Make**: *"Does this payment message conform to network security rules, and can it be settled across central bank reserves?"*
- **Operational Constraints**: In-line processing window strictly bounded (<50ms); zero tolerance for heavy, non-deterministic computational bottlenecks.
- **Material Failure**: Network-wide gateway timeouts; switch outages during peak retail periods; systemic loss of public faith in instant payment rails.
- **Derived Requirement**:
  - **REQ-STK-004: Switch SLA and Rail-Agnostic Compliance**
    - *Statement*: The system MUST ensure that all in-line risk scoring and data exchange operations strictly adhere to switch timeout budgets (<50ms network SLA) and operate without degrading core payment clearing availability or transaction throughput.
    - *Traceability*: VG-02 (Switch Latency vs. Deep AI); Phase 2 Actor Model (Central Switch).
    - *Priority*: **MUST**.

---

### 3.5 Stakeholder 5: Fraud Operations & SOC Investigators (Tier-1 / Tier-2 Analysts)
- **Operational Profile**: Security Operations Center teams responsible for triaging fraud alerts, reviewing high-risk transactions, and filing regulatory reports.
- **Core Needs**: Actionable, causal alert explanations; prioritized alert queues; automated investigative evidence synthesis; reduced false-positive noise.
- **Decision to Make**: *"Is this alert a true scam requiring account freezing and law enforcement referral, or a benign false positive?"*
- **Operational Constraints**: Linear human capacity (25–40 cases/day); severe cognitive fatigue from alert backlogs; strict Service Level Agreements (SLAs).
- **Material Failure**: Unreviewed alerts sitting in queues while funds are cashed out; rubber-stamping high-risk alerts due to fatigue; analyst burnout and turnover.
- **Derived Requirement**:
  - **REQ-STK-005: Operational Queue De-Saturation and Causal Triage**
    - *Statement*: The system MUST provide fraud investigation teams with pre-triaged, causally explainable case packages that highlight specific social engineering typologies, reducing manual triage time per complex alert to under 3 minutes and eliminating low-confidence queue noise.
    - *Traceability*: VG-06 (Mule Velocity vs. SOC Triage), VG-08 (Model Governance), Dimension H; Phase 2 Actor Model (Fraud Operations).
    - *Priority*: **SHOULD**.

---

### 3.6 Stakeholder 6: Regulatory Authorities (Central Banks, CFPB, FCA, DPAs)
- **Operational Profile**: Statutory bodies governing banking safety, consumer protection, fair lending, and data privacy.
- **Core Needs**: Enforce compliance with Model Risk Management (SR 11-7); ensure non-discriminatory Adverse Action reporting (ECOA); protect consumer data rights (GDPR/DPDP); ensure market stability.
- **Decision to Make**: *"Does this automated decisioning system meet statutory standards for fairness, repeatability, explainability, and consumer protection?"*
- **Operational Constraints**: Mandates strict auditability; prohibits black-box non-deterministic decision systems from denying consumer financial services without cause.
- **Material Failure**: Systemic algorithmic bias; unlawful financial exclusion; widespread consumer privacy violations; unchecked growth in economic crime.
- **Derived Requirement**:
  - **REQ-STK-006: Regulatory Auditability and Adverse Action Compliance**
    - *Statement*: The system MUST generate deterministic, auditable decision trails and legally compliant Adverse Action reason codes for all automated transaction interventions, satisfying Model Risk Management (SR 11-7) and consumer protection mandates.
    - *Traceability*: VG-08 (Model Governance & ECOA Barrier), VG-10 (Tipping Off Paradox); Phase 2 Actor Model (Regulators).
    - *Priority*: **MUST**.

---

### 3.7 Stakeholder 7: Telecommunications Providers (MNOs / Mobile Carriers)
- **Operational Profile**: Mobile network operators managing cellular voice calls, SMS routing, and mobile data infrastructure.
- **Core Needs**: Monetize network APIs (e.g., GSMA Open Gateway); prevent network abuse (SIM swapping, call spoofing); protect subscriber privacy; comply with telecom regulations.
- **Decision to Make**: *"Can this subscriber's network signaling state (active call, SIM tenure) be verified securely for banking authorization without exposing raw communication data?"*
- **Operational Constraints**: Cannot inspect encrypted VoIP audio (WhatsApp/Telegram); must protect subscriber communications under telecom secrecy laws.
- **Material Failure**: Regulatory fines for illegal subscriber tracking; network congestion from automated API polling; subscriber churn due to privacy concerns.
- **Derived Requirement**:
  - **REQ-STK-007: Privacy-Preserving Telephony Signaling Federation**
    - *Statement*: The system MUST be capable of ingesting high-level telephony status signals (such as active call state or SIM change status) via standardized carrier APIs without requiring the inspection or storage of private communication content or violating telecommunications privacy statutes.
    - *Traceability*: VG-05 (Telephony & Communicative Silo), IND-GAP-01; Phase 3 Independent Discoveries (GSMA Open Gateway).
    - *Priority*: **SHOULD**.

---

### 3.8 Stakeholder 8: Law Enforcement Agencies (Cybercrime Police / I4C)
- **Operational Profile**: Specialized cybercrime investigation units (e.g., Indian Cyber Crime Coordination Centre - I4C, UK National Economic Crime Centre, FBI IC3).
- **Core Needs**: Rapid evidentiary freezing of money mule networks; actionable cross-jurisdictional intelligence; traceable transaction trails; dismantling of criminal call centers.
- **Decision to Make**: *"Which beneficiary accounts and phone numbers represent active criminal syndicates requiring immediate judicial seizure?"*
- **Operational Constraints**: Overwhelmed by volume (>1.5 million complaints/year); hampered by inter-state and international jurisdictional boundaries; operating on delayed victim reports.
- **Material Failure**: Complete inability to recover stolen citizen funds; criminal syndicates operating with total legal impunity; public loss of faith in law enforcement.
- **Derived Requirement**:
  - **REQ-STK-008: Rapid Evidentiary Telemetry for Syndicate Disruption**
    - *Statement*: The system MUST be capable of producing cryptographically verifiable, standardized forensic evidence packages of intercepted scam incidents, supporting rapid law enforcement mule freezing and cross-jurisdictional syndicate attribution.
    - *Traceability*: VG-03 (Bilateral Asymmetry), VG-06 (SOC Triage), IND-GAP-02 (Freeze Window); Phase 2 Actor Model (Law Enforcement).
    - *Priority*: **SHOULD**.

---

## 4. Summary Matrix of Stakeholder Requirements

| Requirement ID | Stakeholder Group | Primary Operational Capability Required | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-STK-001** | Payment Users (Victims) | Contextual, de-biasing risk communication prior to authorization | **MUST** | VG-01, VG-04 |
| **REQ-STK-002** | Sending Banks (Issuers) | In-line risk scoring meeting <50ms switch budget & <10:1 insult ratio | **MUST** | VG-02, VG-07 |
| **REQ-STK-003** | Receiving Banks (Mules) | Automated mule credit restrictions executed within 60s post-settlement | **MUST** | VG-03, VG-06, IND-02 |
| **REQ-STK-004** | Central Payment Switch | Strict adherence to sub-50ms switch timeouts with zero throughput drag | **MUST** | VG-02 |
| **REQ-STK-005** | Fraud SOC Investigators | Causal, pre-triaged alert packages reducing case triage to <3 minutes | **SHOULD** | VG-06, VG-08 |
| **REQ-STK-006** | Regulatory Bodies | Deterministic auditability and auditable Adverse Action disclosures (ECOA) | **MUST** | VG-08, VG-10 |
| **REQ-STK-007** | Telecom Providers | Privacy-preserving ingestion of carrier signaling without payload capture | **SHOULD** | VG-05 |
| **REQ-STK-008** | Law Enforcement | Verifiable forensic evidence packages for rapid inter-bank freezing | **SHOULD** | VG-03, VG-06, IND-02 |

These stakeholder requirements ensure that every subsequent functional and technical requirement is anchored in the verified operational needs of the human and institutional actors who must operate, use, and regulate the system.

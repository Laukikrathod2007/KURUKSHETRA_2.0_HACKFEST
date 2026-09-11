# Human-in-the-Loop and Governance Requirements in Scam Defense

## 1. Executive Summary & Epistemic Protocol

In artificial intelligence engineering, the role of human oversight is often treated with uncritical assumptions: either assuming that artificial intelligence can completely replace human judgment, or asserting that "a human must approve every high-risk transaction." In Phase 4, we proved that both assumptions collapse in real-time retail payments:
- **Full Automation Fallacy**: Pure automated decisioning without human governance risks systemic bias, catastrophic customer insult, and unchallengeable financial exclusion.
- **Universal Human Approval Fallacy**: Instant payment networks process hundreds of millions of daily transactions; human investigators take 4 to 24 hours to triage queues, while money disperses in 90 seconds. Human review cannot act as an in-line gatekeeper for real-time clearance.

In strict compliance with Part 9 of the Phase 5 mandate, this document defines the **human-in-the-loop and governance requirements**, establishing precise, evidence-backed boundaries between **decisions that can safely be automated** and **decisions that strictly require human authority**.

---

## 2. The Automation-Human Authority Matrix

```text
                     THE DECISION AUTHORITY TAXONOMY
                     
  Decision Type                      Authority Locus       Execution Latency   Override Mechanism
  ──────────────────────────────────────────────────────────────────────────────────────────
  Interactive Cognitive De-Biasing   Fully Automated       Pre-Flight (<2s)    User completes quiz
  Temporary Cooling-Off Hold (2-24h) Fully Automated       At Clearance (<50ms)User cancel / Phone support
  Near-Real-Time Mule Hold Request   Semi-Automated API    Post-Settlement (30s)Receiving bank compliance
  Permanent Account Closure / Ban    Human Review ONLY     Offline (Hours/Days) Senior Risk Committee
  Adverse Action Dispute Override    Human Review ONLY     Offline (24-48h)     Formal Ombudsman Appeal
```

---

## 3. Detailed Human-in-the-Loop Requirement Specifications

### 3.1 REQ-HITL-001: Bounded Automation for Real-Time Protective Actions
- **Statement**: The system MUST be authorized to execute automated, real-time protective actions—specifically: (a) injecting interactive cognitive friction, (b) presenting contextual de-biasing dialogs, (c) placing temporary, reversible cooling-off holds (up to 24 hours), and (d) dispatching near-real-time inter-bank hold alerts—without requiring prior manual human analyst approval.
- **Rationale**: Given that payment settlement occurs in <2.5s and mule dispersion occurs in <90s, requiring human analyst sign-off before initiating temporary protective friction mathematically guarantees that zero scams will ever be stopped in-flight.
- **Traceability Link**: VG-02 (Switch Latency), VG-06 (Mule Velocity vs. SOC Triage); REQ-STK-002, REQ-STK-004.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: Automated pre-flight friction and temporary cooling-off holds execute within their defined latency budgets with zero dependency on human analyst queue availability.
- **Dependencies**: Policy configuration tables; automated intervention engine.
- **Epistemic Uncertainty**: None; this is an operational necessity.

---

### 3.2 REQ-HITL-002: Mandatory Human Monopoly on Irreversible Adverse Determinations
- **Statement**: The system MUST NOT possess the autonomous authority to execute permanent, irreversible adverse actions—specifically: permanently terminating a customer's account, submitting formal criminal referrals to police, or placing an identity on permanent national negative blacklists—without explicit, documented review and sign-off by an authorized human risk investigator.
- **Rationale**: Automated models make mistakes. Subjecting citizens to permanent financial de-banking or criminal branding based on purely automated algorithmic outputs violates fundamental human rights, constitutional due process, and European GDPR Article 22.
- **Traceability Link**: VG-08 (Model Governance & ECOA Barrier), Dimension H; Basel Committee Governance Guidelines.
- **Priority**: **MUST (Negative Constraint)**.
- **Measurable Acceptance Condition**: 100% of permanent account terminations and formal law enforcement cybercrime filings originate from an authenticated, cryptographically signed action executed by a human compliance officer.
- **Dependencies**: Role-based access control (RBAC); case management administrative workflow.
- **Epistemic Uncertainty**: Institutional definitions of what constitutes a "temporary restriction" versus a "constructive permanent closure."

---

### 3.3 REQ-HITL-003: Human Override Governance and Dual-Control Auditing
- **Statement**: Authorized human personnel (such as senior fraud managers or branch supervisors) MUST be capable of overriding automated transaction holds and security restrictions, provided that every override: (a) requires dual-authorization for high-value transfers exceeding configured thresholds, (b) mandates entry of a structured justification code, and (c) creates an immutable, tamper-evident audit log.
- **Rationale**: Frontline tellers and customer support staff are easily pressured or deceived by coached victims (*"My son needs emergency surgery, unlock my money now"*). Uncontrolled single-click overrides represent a catastrophic operational vulnerability.
- **Traceability Link**: VG-04 (Pre-Coaching), Dimension H (Frontline Staff Overrides); ACFCS Benchmarking.
- **Priority**: **MUST**.
- **Measurable Acceptance Condition**: System blocks unilateral single-user overrides on accounts flagged as Critical risk exceeding $5,000, requiring a secondary approval from a certified risk supervisor and logging both employee IDs with an immutable timestamp.
- **Dependencies**: Dual-control approval workflows; identity management integration.
- **Epistemic Uncertainty**: Staffing friction and operational delay introduced by dual-control requirements during branch peak hours.

---

### 3.4 REQ-HITL-004: Escalation Routing for Borderline and High-Value Scenarios
- **Statement**: The system MUST automatically route transactions falling into ambiguous, high-uncertainty risk bands (where risk is elevated but confidence is low) or high-value transfers subject to temporary cooling-off holds to a prioritized human analyst investigation queue, accompanied by an auto-generated causal case summary.
- **Rationale**: Directs scarce human cognitive resources precisely to the highest-leverage cases where automated classification is uncertain, rather than drowning analysts in low-value routine alerts.
- **Traceability Link**: VG-06 (Mule Velocity vs. SOC Triage), VG-07 (Customer Insult Ceiling); REQ-STK-005.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: Borderline transactions are prioritized in the analyst case management queue based on dollar exposure and uncertainty width, with 100% of cases presenting a pre-compiled investigative summary (REQ-EXP-003) upon case opening.
- **Dependencies**: Case management queue integration; dynamic priority queuing algorithms.
- **Epistemic Uncertainty**: Optimal parameterization of the "ambiguity band" threshold.

---

### 3.5 REQ-HITL-005: Analyst Feedback Ingestion for Continuous Model Supervision
- **Statement**: The system MUST capture human investigator case adjudications (e.g., "Confirmed Scam - Digital Arrest", "False Alarm - Legitimate Purchase", "Unresolved Dispute") as structured feedback, linking analyst determinations directly to historical decision logs to support model validation, concept drift monitoring, and retuning.
- **Rationale**: Supervised learning engines require verified ground truth labels to detect adversarial tactic shifts and evaluate model calibration. Human expert determinations are the primary source of high-quality labels.
- **Traceability Link**: VG-08 (Model Governance), Dimension I (Adaptability); Phase 3 Evolution.
- **Priority**: **SHOULD**.
- **Measurable Acceptance Condition**: 100% of human investigator case resolutions are ingested into the offline training and audit store within 24 hours of case closure, formatted in standardized machine-readable schemas.
- **Dependencies**: Integration with bank SOC case resolution software; data pipeline pipelines.
- **Epistemic Uncertainty**: Label noise introduced by inconsistent analyst judgments across distributed global operations teams.

---

## 4. Summary Matrix of Human-in-the-Loop Requirements

| Requirement ID | Oversight Area | Summary Specification | Priority | Source Gap Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-HITL-001** | Automated Actions | Bounded automation for pre-flight friction and temporary holds | **MUST** | VG-02, VG-06 |
| **REQ-HITL-002** | Human Monopoly | Zero autonomous authority for permanent closures or criminal referrals | **MUST (Neg)** | VG-08, Dim H |
| **REQ-HITL-003** | Override Governance | Dual-control authorization and mandatory audit logging for overrides | **MUST** | VG-04, Dim H |
| **REQ-HITL-004** | Escalation Routing | Priority queue routing for high-value and high-uncertainty transfers | **SHOULD** | VG-06, VG-07 |
| **REQ-HITL-005** | Feedback Ingestion | Structured analyst case resolutions linked to model monitoring pipelines | **SHOULD** | VG-08, Dim I |

These human-in-the-loop requirements ensure that machine automation acts decisively where speed is of the essence, while human judgment is preserved and fortified where legal due process, ethical fairness, and institutional authority are mandatory.

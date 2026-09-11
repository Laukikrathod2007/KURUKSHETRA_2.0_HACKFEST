# Requirements Discovery Framework and Derivation Method

## 1. Executive Summary & Purpose

Phase 5 represents the critical architectural pivot of the Kurukshetra research program. Having established the project context (Phase 0), mastered the domain fundamentals (Phase 1), modeled the causal mechanics and failure modes of authorized scams (Phase 2), mapped the existing landscape and empirical limitations (Phase 3), and validated the structural gaps (Phase 4), our mandate is now to determine:

> **"What must a successful solution be capable of doing, and what constraints must it satisfy, given what we now know?"**

This document establishes the **Requirements Discovery Framework** for Phase 5. It defines the formal derivation methodology, the epistemic standards governing requirement justification, the standardized requirement schema, and the strict boundaries separating **requirements (WHAT must be true)** from **product features and architectures (HOW the system is built)**.

---

## 2. The Core Derivation Chain

A requirement cannot be generated from personal intuition, speculative technology trends, or arbitrary feature wishlists. Every requirement formulated in Phase 5 must emerge from an **unbroken, defensible chain of justification**:

```text
                     THE DEFENSIBLE DERIVATION CHAIN
                     
  [Phase 1 & 3: Research Evidence]
  Statutory laws, switch latency specs, academic GNN benchmarks, victim audits
                │
                ▼
  [Phase 2: Validated Problem Finding]
  FM-01 Credential Deception, FM-03 Two-Ended Asymmetry, FM-06 Latency Paradox
                │
                ▼
  [Phase 4: Validated Landscape Gap]
  VG-01 Intent Decoupling, VG-02 Latency vs. AI, VG-04 Pre-Coaching Failure
                │
                ▼
  [Phase 5: Required System Capability]
  Ability to verify authentic human volition prior to irreversible fund debit
                │
                ▼
  [Phase 5: Testable System Requirement]
  REQ-SYS-001 (Specification with measurable acceptance criteria)
```

If a proposed requirement cannot demonstrate this chain back to an empirical finding in Phases 0–4, it is rejected as unjustified.

---

## 3. The Strict Solution-Neutral Boundary

To prevent premature engineering commitment, Phase 5 enforces an absolute boundary between **system requirements** and **product implementations**:

```text
  PERMITTED IN PHASE 5 (Requirements)      FORBIDDEN IN PHASE 5 (Design / Architecture)
  ──────────────────────────────────────────────────────────────────────────────────────────
  Required System Capabilities             Specific User Interface Wireframes / Screen Mockups
  Functional Input/Output Behaviors        Exact Product Feature Specifications
  Real-Time Timing & Latency Deadlines     System Architecture Diagrams & Service Meshes
  Safety Constraints & Failure Handling    Database Schemas & Storage Engines (SQL vs. NoSQL)
  Statutory Privacy & Regulatory Bounds    Programming Languages (Rust, Go, Python, TypeScript)
  Measurable Acceptance Criteria           Specific Machine Learning Models (XGBoost, GNN, ONNX)
  Data Dependencies & Access Assumptions   Specific LLM Models or Agent Frameworks (LangChain, AutoGen)
  Human Oversight & Override Bounds        Cloud Infrastructure Vendors (AWS, GCP, Azure)
```

### The Definitional Test:
- **A Requirement describes WHAT the system must be capable of doing and what constraints it must obey.**
- **A Feature describes HOW a specific product team decides to satisfy that capability.**
- *Example*:
  - *Requirement (WHAT)*: "The system must be capable of communicating specific counterparty risk indicators to the user before payment authorization in a manner that requires active cognitive engagement."
  - *Feature (HOW - Forbidden in Phase 5)*: "Display a red modal dialog containing three multiple-choice buttons and a 10-second countdown timer."

---

## 4. Standardized Requirement Specification Schema

Every requirement authored in this knowledge base conforms to a rigorous, eight-element specification schema:

```text
REQ-[FAMILY]-[NUMBER]
├── Title: Concise, unambiguous designation of the required capability or constraint.
├── Statement: Formal specification stating what the system MUST, SHOULD, or COULD do.
├── Rationale: Explicit explanation of why this capability is strictly necessary.
├── Traceability Link: Direct pointer to the supporting Phase 4 Gap (e.g., VG-01) and Phase 2 Finding.
├── Priority: Formal MoSCoW classification (MUST / SHOULD / COULD / UNKNOWN).
├── Acceptance Condition: Objective, measurable verification test determining satisfaction.
├── System Dependencies: Necessary data feeds, platform capabilities, or prerequisite states.
└── Epistemic Uncertainty: Documented assumptions or parameters requiring empirical field validation.
```

---

## 5. Overview of Requirement Families

Phase 5 organizes requirements across nineteen specialized analytical domains:

```text
05-requirements/
├── stakeholder-requirements.md           <── Requirements of victims, banks, switches, police
├── functional-requirements.md            <── Core capabilities: intake, detection, decisioning
├── real-time-requirements.md             <── Timing budgets: pre-flight, in-line, streaming
├── risk-decision-requirements.md         <── Decisioning: risk stratification, uncertainty
├── context-requirements.md               <── Context tiers: required, convenient, inaccessible
├── intervention-requirements.md          <── User communication, de-biasing, micro-friction
├── explainability-requirements.md        <── User, analyst, and regulatory transparency
├── human-in-the-loop-requirements.md     <── Automation boundaries, override governance
├── safety-requirements.md                <── Harm prevention: erroneous blocks, unchallengeable calls
├── false-positive-negative-requirements.md<── Customer insult limits, error trade-offs
├── security-requirements.md              <── Telemetry protection, anti-tamper, evasion defense
├── privacy-requirements.md               <── GDPR, DPDP compliance, biometric data rules
├── resilience-requirements.md            <── Failure handling, graceful degradation, timeouts
├── observability-auditability.md         <── Event logging, decision records, forensic replay
├── adaptability-requirements.md          <── Concept drift monitoring, novel typology updates
├── data-requirements.md                  <── Inventory of attributes, sources, sensitivities
├── non-functional-requirements.md        <── Scalability, throughput, maintainability, UX
├── requirement-conflicts.md              <── Analysis of trade-offs (sensitivity vs. insult)
└── validation-required.md                <── Register of parameters needing field trials
```

By adhering strictly to this derivation framework, Phase 5 produces a requirements baseline that is mathematically grounded, operationally realistic, regulatory-compliant, and ready for downstream engineering without premature solution bias.

# Explicit MVP Exclusions: What is NOT in the Product

## 1. Executive Summary & Exclusion Criteria

A bare-minimum PRD derives its discipline as much from what it **refuses to build** as from what it includes. In high-stakes engineering, feature bloat dilutes focus, introduces unvetted attack surfaces, and jeopardizes critical sub-50ms clearance deadlines.

In strict compliance with Part 15 of the Phase 6 mandate, this document defines the formal **NOT IN MVP** register. Every item on this list is excluded based on one of four objective criteria:
1. **Not Required for Core Interception**: Peripheral functionality that does not prevent push-payment loss.
2. **Insufficiency of Empirical Evidence**: Capabilities whose operational efficacy or legal validity remains unvalidated (`validation-required.md`).
3. **Disproportionate Engineering Complexity**: High-overhead architectures that threaten delivery timelines without proportional risk lift.
4. **Natural Post-MVP Evolution**: Advanced capabilities logically deferred to Phase 7.

---

## 2. The Formal "NOT IN MVP" Register

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       NOT IN MVP REGISTER                                        │
├────────┬──────────────────────────────────┬─────────────────────────────┬────────────────────────┤
│ Exc ID │ Excluded Capability / Feature    │ Exclusion Rationale         │ Target Horizon         │
├────────┼──────────────────────────────────┼─────────────────────────────┼────────────────────────┤
│ EXC-01 │ Autonomous Debanking & Closures  │ Violation of Due Process    │ Strictly Forbidden     │
│ EXC-02 │ Raw Voice Audio Stream Recording │ Severe Privacy Non-Compl.   │ Strictly Forbidden     │
│ EXC-03 │ Visual OCR of Payment Dashboards │ Disproportionate Compute    │ Phase 7 (Advanced)     │
│ EXC-04 │ Inter-Bank Cryptographic PSI     │ Regulatory Compact Missing  │ Phase 7 (Consortium)   │
│ EXC-05 │ Ambient Acoustic Coercion Sensor │ Uncalibrated FMR in field   │ Phase 7 (Experimental) │
│ EXC-06 │ Multi-Hop Blockchain Tracing     │ Post-Settlement Scope Creep │ External Law Enforce.  │
│ EXC-07 │ Automated Dynamic LLM Dialogues  │ Latency & Injection Risk    │ Phase 7 (Agentic Lab)  │
│ EXC-08 │ Autonomous SAR Filing to FIU     │ Statutory Legal Monopoly    │ Bank Compliance Staff  │
└────────┴──────────────────────────────────┴─────────────────────────────┴────────────────────────┘
```

---

## 3. Detailed Exclusion Rationales

### 3.1 EXC-01: Autonomous Debanking and Account Termination
- **Why Excluded**: Permitting an automated AI algorithm to permanently close customer bank accounts or freeze total assets without human intervention violates GDPR Article 22, the Equal Credit Opportunity Act, and basic constitutional due process (`REQ-HITL-002`).
- **Boundary**: The MVP can place a temporary 4-hour hold on a specific uncharacteristic transaction, but possesses zero authority to terminate an account or seize funds.

### 3.2 EXC-02: Continuous Voice Call Audio Recording & Transcription
- **Why Excluded**: Recording customer phone calls during banking app usage constitutes illegal electronic eavesdropping under wiretap acts, GDPR Article 9, and the India DPDP Act 2023 (`REQ-PRIV-002`).
- **Boundary**: The MVP restricts telephony sensing strictly to **binary operating system call status flags** (`is_call_active: true/false`), with zero audio captured, stored, or processed.

### 3.3 EXC-03: Presentation-Layer Visual Screenshot OCR & Reverse Search
- **Why Excluded**: Ingesting and performing on-device OCR or visual perceptual hashing on user screenshots of fraudulent investment apps adds 400ms to 800ms of compute latency and heavy memory overhead, threatening client app stability.
- **Boundary**: Deferred to Phase 7 as an optional, asynchronous background forensic capability (`REQ-FUNC-006`).

### 3.4 EXC-04: Cryptographic Private Set Intersection (PSI) Consortiums
- **Why Excluded**: While mathematically proven in Phase 3 (`IND-02`), live inter-bank PSI requires a multilateral legal agreement and shared cryptographic consortium infrastructure between competing commercial banks that does not exist in hackathon environments.
- **Boundary**: The MVP simulates inter-bank beneficiary intelligence via standard mock API lookups; full cryptographic PSI is deferred to enterprise consortium deployment.

### 3.5 EXC-05: Real-Time Generative LLM Multi-Turn De-Biasing Dialogues
- **Why Excluded**: Generating unconstrained, real-time natural language responses via cloud-hosted Large Language Models introduces non-deterministic latency (800ms to 3,000ms), catastrophic hallucination risks, and vulnerability to adversarial jailbreaks / prompt injections (`REQ-SEC-003`).
- **Boundary**: The MVP utilizes **deterministic, templated de-biasing dialogs** tailored to verified typology classifications (`FEAT-05`), ensuring instant sub-50ms local rendering and zero hallucination.

### 3.6 EXC-06: Multi-Hop Cryptocurrency and Dark Web Tracing
- **Why Excluded**: Tracing stolen funds across Bitcoin/Monero mixers or centralized foreign crypto exchanges belongs to specialized post-facto blockchain forensics firms (e.g., Chainalysis, TRM Labs) and national law enforcement agencies (`REQ-STK-008`).
- **Boundary**: The Guardian's mission is **real-time pre-authorization interception and immediate 60-second mule containment** on domestic fiat rails.

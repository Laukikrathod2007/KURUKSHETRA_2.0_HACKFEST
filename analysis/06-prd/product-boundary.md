# Product Boundary: Inclusions, Exclusions, and External Dependencies

## 1. Executive Summary & Purpose

A bare-minimum Product Requirements Document (PRD) succeeds by establishing **unambiguous perimeters**. Without explicit negative boundaries, engineering projects succumb to scope creep, conflating core protection capabilities with peripheral banking features, unvalidated AI research, or speculative infrastructure.

This document defines the strict operational boundaries of the *Agentic Guardian for Real-Time Payment Scam Interception* MVP.

---

## 2. Product Boundary Framework

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MVP PRODUCT BOUNDARY MATRIX                                    │
├──────────────────────────────────┬───────────────────────────────────────────────────────────────┤
│ 1. PRODUCT INCLUDES (Core MVP)   │ • Client-side pre-flight telemetry SDK (timing, hesitation). │
│                                  │ • In-line sub-45ms risk scoring engine & 4-tier decisioning.  │
│                                  │ • Dynamic pre-PIN cognitive de-biasing dialog generator.      │
│                                  │ • Emergency life-critical payment bypass pathway.             │
│                                  │ • Automated ISO 20022 out-of-band mule containment dispatch.  │
│                                  │ • WORM-compliant immutable decision & override logging.       │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 2. EXCLUDED FROM MVP             │ • Native mobile banking core (account creation, ledgers).     │
│                                  │ • Autonomous permanent account closure or debanking.         │
│                                  │ • Continuous audio recording or raw microphone exfiltration.  │
│                                  │ • Autonomous filing of criminal SARs without human review.    │
│                                  │ • Direct enforcement of freezes inside foreign bank systems.  │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 3. EXTERNAL SYSTEM DEPENDENCIES  │ • Host mobile banking app runtime (Android/iOS sandbox).     │
│                                  │ • Core banking payment switch gateway (ISO 20022 / UPI API).  │
│                                  │ • Bank customer historical master cache (Redis / In-Memory).  │
│                                  │ • Inter-bank messaging rail (NPCI, FedNow, Pay.UK switch).    │
├──────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 4. UNKNOWN / VALIDATION REQUIRED │ • Exact duration of temporal cooling-off window (VAL-01).     │
│                                  │ • Demographic customer insult ceiling thresholds (VAL-02).   │
│                                  │ • Carrier telephony API P99 latency SLA (VAL-06).             │
└──────────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Boundary Analysis

### 3.1 Product Includes (The MVP Scope)
1. **Client-Side Telemetry Collector**: Lightweight mobile SDK embedded within the host banking application, capturing touch dynamics, hesitation intervals, copy-paste events, and foreground app status during payment drafting (`REQ-FUNC-001`, `REQ-CTX-002`).
2. **In-Line Risk Evaluation Engine**: Sub-45ms decisioning microservice receiving transaction payloads, synthesizing feature vectors, and calculating calibrated risk and epistemic uncertainty (`REQ-TIME-001`, `REQ-FUNC-007`, `REQ-DEC-002`).
3. **Four-Tier Policy Decision Gateway**: Deterministic translation of risk scores into operational directives: L1 (Allow), L2 (Inform), L3 (Intervene), and L4 (Hold) (`REQ-DEC-001`, `REQ-DEC-005`).
4. **Stateful De-Biasing Interaction Manager**: Pre-PIN interactive dialog system presenting randomized cognitive challenges, scam-typology specific grounding facts, and pre-coaching evasion prompts (`REQ-INT-002`, `REQ-INT-003`, `REQ-FUNC-009`).
5. **Fail-Open Safety Circuit Breaker**: Hardware/software circuit breaker isolating latency anomalies ($>45\text{ms}$) or system exceptions in $\le 5\text{ms}$, guaranteeing uninterrupted payment clearance (`REQ-RES-002`, `REQ-INT-007`).
6. **Out-of-Band Mule Alert Dispatcher**: Sub-60-second message dispatcher generating cryptographically signed containment advisories sent to beneficiary institutions (`REQ-FUNC-010`, `REQ-TIME-003`).
7. **Compliance & Audit Persistence**: Cryptographically hashed, append-only event logging capturing all decision factors, timestamps, and teller/analyst overrides (`REQ-OBS-001`, `REQ-OBS-003`, `REQ-SAF-006`).

### 3.2 Product Excludes (Intentionally Deferred or Prohibited)
1. **Host Banking Operations**: The product does not manage bank account ledgers, balance inquiries, deposit interest calculations, loan underwriting, or user onboarding.
2. **Autonomous Debanking & Account Closure**: The product is strictly forbidden from permanently terminating customer accounts or filing formal Suspicious Activity Reports (SARs) without affirmative human investigator sign-off (`REQ-HITL-002`).
3. **Raw Audio Surveillance & Call Recording**: The product does not record, transcribe, or exfiltrate phone call audio or private chat conversations; it operates strictly on binary state indicators (`REQ-PRIV-002`, `REQ-CTX-006`).
4. **Direct Foreign Ledger Execution**: The product dispatches out-of-band containment requests to receiving banks, but cannot directly alter or freeze the internal database of a third-party financial institution.
5. **Post-Settlement Asset Recovery / Crypto Tracing**: The product does not trace multi-hop cryptocurrency wash trading or execute blockchain seizure warrants.

### 3.3 External System Dependencies
- **Mobile Platform Host**: Android (API level 28+) and iOS (version 15+) host application containers providing secure sandboxing, runtime attestation, and UI presentation threads.
- **Switch Network Interface**: Upstream transaction routing gateway (e.g., ISO 20022 message processor) capable of routing authorization packets to the guardian gateway within a dedicated $<50\text{ms}$ synchronous network hop.
- **Institutional Customer Cache**: Core banking fast cache (sub-10ms lookup) providing customer transaction baselines, account age, and relationship history.
- **National Telecommunications API Gateway**: GSMA Open Gateway / Camara Project endpoints providing mobile network carrier verification (SIM swap, roaming, active call status).

### 3.4 Unresolved Boundaries Requiring Field Validation
As cataloged in `validation-required.md`, the exact operational boundaries of the following capabilities remain dynamic parameters subject to empirical calibration:
- The exact duration ($T_{\text{lock}}$) of high-risk cooling-off holds (`VAL-01`).
- The demographic-specific customer insult ratio ceilings across age cohorts (`VAL-02`).
- The inter-bank legal indemnity compact governing receiving-bank automated holds (`VAL-04`).

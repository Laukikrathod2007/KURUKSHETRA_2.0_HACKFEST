# Context and Information Requirements in Scam Defense

## 1. Executive Summary & Epistemic Protocol

In Phase 4, we established that payment fraud engines suffer from severe **contextual myopia**: they evaluate transactions as isolated, point-in-time tabular events, completely blind to the social engineering, telephony, and inter-bank environment in which the payment occurs. However, in attempting to solve this context deficit, system designers frequently fall into the trap of assuming **omniscient data access**—assuming that the system can freely inspect encrypted chat apps, monitor all phone calls, or peer into competitor bank databases.

In strict compliance with Part 6 of the Phase 5 mandate, this document defines the **context and information requirements** of the system. It enforces a mandatory three-tier epistemic classification:
1. **Tier 1: Required Information**: Essential data signals without which authorized scam defense cannot function.
2. **Tier 2: Convenient Information**: High-value telemetry that enhances precision, but for which graceful fallbacks must exist.
3. **Tier 3: Inaccessible / Forbidden Information**: Context that would be valuable, but which the system **MUST NOT assume access to** due to legal, cryptographic, or platform boundaries.

---

## 2. The Three-Tier Context Classification Matrix

```text
                     THE THREE-TIER CONTEXT MATRIX
                     
  [Tier 1: Required Information]
  - Sender transaction parameters (Amount, Payee ID, Timestamp)
  - Sender 90-day baseline transaction history
  - Pre-flight drafting interaction timestamps (dwell time, paste events)
  - Beneficiary account age & tenure indicators (from clearing rail)
  
  [Tier 2: Convenient Information]
  - Cellular telephony active call status (via carrier API)
  - Client device screen-sharing status (AnyDesk / TeamViewer presence)
  - Behavioral biometrics (swipe curvature, cadence)
  - Payment memo natural language text
  
  [Tier 3: Inaccessible Context (Strictly Forbidden to Assume)]
  - Content of encrypted OTT messages (WhatsApp / Telegram text)
  - Ambient microphone audio or live voice call recordings
  - Raw PII of counterparties at competing banks (Bank secrecy laws)
  - Background screen capture of third-party apps on iOS
```

---

## 3. Detailed Context Requirement Specifications

### 3.1 REQ-CTX-001: Transactional Baseline and Relational History (Required)
- **What Information is Needed**: Sender's 90-day transaction history, including historical beneficiary identifiers, transaction values, frequencies, typical payment hours, and recent credit additions.
- **Why it Matters**: Required to establish authentic spending baselines and detect sudden, massive deviations in value or recipient category.
- **When Available**: Instantaneous at session initialization; cached in operational memory.
- **Provider**: Sending Bank (Issuer core banking ledger).
- **Access Assumption**: **Assumed Available** (Directly within bank domain).
- **Fallback if Unavailable**: The system falls back to population-level median thresholds and flags the transaction with `BASELINE_HISTORY_ABSENT`, applying conservative heuristic checks.
- **Requirement Statement**: The system MUST ingest and maintain access to a rolling 90-day historical baseline of the sender's transaction values, payee identifiers, and frequencies prior to evaluating transaction risk.
- **Priority**: **MUST**.

---

### 3.2 REQ-CTX-002: Pre-Flight Interaction Timing and Input Mechanics (Required)
- **What Information is Needed**: Granular interaction timing deltas during payment setup: time spent on payee selection screen, dwell time on amount entry, clipboard paste events for account numbers, and time elapsed before final authorization button activation.
- **Why it Matters**: Distinguishes fluent, habitual payments from dictated, hesitated, or rushed transfers executed under acute pressure.
- **When Available**: Continuously generated during the 2-to-5 minute pre-flight drafting window.
- **Provider**: Client Mobile Banking Application.
- **Access Assumption**: **Assumed Available** (Within app's own native runtime).
- **Fallback if Unavailable**: System relies strictly on backend transaction attributes, suppressing client-side hesitation scoring.
- **Requirement Statement**: The system MUST capture client-side interaction timestamps, field dwell times, and clipboard paste indicators within the payment application interface during the pre-authorization session.
- **Priority**: **MUST**.

---

### 3.3 REQ-CTX-003: Beneficiary Account Risk Attributes (Required)
- **What Information is Needed**: High-level risk indicators regarding the recipient account: account tenure tier (e.g., <7 days, <30 days, >180 days), recent velocity tier, and whether the account has been flagged in inter-bank mule registries.
- **Why it Matters**: Prevents sending funds into brand-new or high-velocity mule accounts; resolves the two-ended asymmetric blindness (VG-03).
- **When Available**: During pre-flight payee entry (via directory lookup) or in-line clearing (via switch risk payload).
- **Provider**: Central Payment Switch / Beneficiary Clearing Directory.
- **Access Assumption**: **Requires Institutional Integration** (Via enhanced CoP or switch risk APIs).
- **Fallback if Unavailable**: System marks counterparty risk as `UNKNOWN_COUNTERPARTY_RISK`, elevating reliance on sender behavioral and interaction indicators.
- **Requirement Statement**: The system MUST be capable of ingesting high-level beneficiary risk attributes (tenure bracket, recent velocity bracket, and consortium flag status) without violating counterparty privacy laws.
- **Priority**: **MUST**.

---

### 3.4 REQ-CTX-004: Telephony and Device Environment Status (Convenient)
- **What Information is Needed**: Status flags indicating whether the user's phone is currently on an active voice call, whether remote screen-sharing tools (AnyDesk, TeamViewer) are actively running, or whether developer debugging modes are enabled.
- **Why it Matters**: Provides definitive, high-confidence evidence of tech support or digital arrest coercion.
- **When Available**: Real-time during the pre-flight drafting window.
- **Provider**: Mobile OS APIs (Android) or Telecommunications Carrier APIs (GSMA Open Gateway).
- **Access Assumption**: **Platform & Carrier Dependent** (Available on modern Android with permissions; requires carrier API on iOS).
- **Fallback if Unavailable**: The system assumes telephony state is unknown and does not penalize the user, relying on behavioral de-biasing dialogues instead.
- **Requirement Statement**: The system SHOULD ingest external device environment indicators (active voice call status, active screen-sharing connections) when available via compliant OS APIs or telecom carrier federations, but MUST operate gracefully in their absence.
- **Priority**: **SHOULD**.

---

### 3.5 REQ-CTX-005: User Self-Reported Contextual Intent (Convenient / Interactive)
- **What Information is Needed**: User-provided clarification regarding the underlying purpose of the transaction (e.g., whether the payment is for goods, investment, family emergency, or official fees) obtained through interactive dialogue.
- **Why it Matters**: Captures the victim's subjective epistemic belief, allowing the system to detect contradictions between user belief and counterparty reality (e.g., user believes they are paying a court bail, but payee is an individual retail account).
- **When Available**: During the pre-flight interactive de-biasing workflow.
- **Provider**: End User (Direct interaction).
- **Access Assumption**: **Interactive Assumption** (Requires user engagement; subject to scammer coaching).
- **Fallback if Unavailable**: System proceeds with standard calibrated risk directives based on passive signals.
- **Requirement Statement**: The system SHOULD be capable of eliciting structured contextual intent declarations from the user during elevated-risk sessions to identify contradictions between user belief and transaction metadata.
- **Priority**: **SHOULD**.

---

### 3.6 REQ-CTX-006: Explicit Exclusion of Inaccessible Data (Forbidden to Assume)
- **Statement**: The system MUST NOT be architected with dependencies on:
  1. Capturing, reading, or decrypting third-party private messaging content (WhatsApp, Telegram, Signal).
  2. Recording, intercepting, or analyzing raw acoustic audio streams from cellular telephone calls.
  3. Continuous background screen recording of third-party applications outside the banking app container.
  4. Accessing raw, unanonymized balance ledgers or PII of accounts held at competing financial institutions.
- **Rationale**: Assuming access to these signals violates fundamental privacy legislation (GDPR, India DPDP Act), telecommunications wiretapping statutes, and mobile operating system application sandboxing policies (Apple iOS App Store Guidelines). Any system dependent on them is legally and technically non-viable.
- **Traceability Link**: VG-03 (Bank Secrecy), VG-05 (Mobile OS Sandbox), Dimension C & E; Regulatory Standards.
- **Priority**: **MUST (Negative Constraint)**.
- **Measurable Acceptance Condition**: The system architecture, data pipelines, and client SDKs contain zero code, dependencies, or permissions designed to intercept private messaging text, record ambient telephony audio, or scrape external application displays.
- **Dependencies**: Privacy-by-design compliance audits.
- **Epistemic Uncertainty**: None; this is an absolute legal and architectural constraint.

---

## 4. Summary Matrix of Context Requirements

| Requirement ID | Information Category | Classification | Provider | Fallback Strategy | Priority |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **REQ-CTX-001** | Sender 90-Day Baseline History | **Required** | Sending Bank | Population median heuristics | **MUST** |
| **REQ-CTX-002** | Client Interaction Timing Deltas | **Required** | Mobile App SDK | Backend-only transaction scoring | **MUST** |
| **REQ-CTX-003** | Beneficiary Risk Attributes | **Required** | Switch / Rail | Flagged as unknown counterparty | **MUST** |
| **REQ-CTX-004** | Telephony & Remote Tool Status | **Convenient** | Telco / Mobile OS | Neutral assumption; zero penalty | **SHOULD** |
| **REQ-CTX-005** | User Self-Reported Intent | **Convenient** | End User | Passive risk directive fallback | **SHOULD** |
| **REQ-CTX-006** | Inaccessible Data Prohibition | **Forbidden** | N/A (Excluded) | Mandatory architectural exclusion | **MUST (Neg)** |

By enforcing this strict three-tier classification, the context requirements ensure that the system is equipped with the rich contextual intelligence necessary to intercept scams, without relying on legally impossible or platform-prohibited data dependencies.

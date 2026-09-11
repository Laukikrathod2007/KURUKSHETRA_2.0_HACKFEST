# Functional Requirements Catalogue: Formal System Specifications

---

## 1. Executive Understanding
This catalogue defines the complete functional requirements for GuardianPay. Every requirement is derived directly from empirical findings in Phases 0, 1, and 2, and is specified with an explicit **Rationale, Priority (MoSCoW), Regulatory Source, and Deterministic Acceptance Criteria**.

---

## 2. Telemetry Observation & Ingress Requirements

### FR-OBS-01: Payment Ingress & Metadata Capture
- **Requirement:** The system MUST capture all parameters supplied in the UPI initiation intent: Payee VPA (`pa`), Payee Display Name (`pn`), Amount (`am`), Transaction Note (`tn`), Currency (`cu`), and Ingress Channel (`QR_CAMERA`, `DEEP_LINK`, `MANUAL_ENTRY`, `CLIPBOARD_PASTE`).
- **Rationale:** Foundational input features for the quantitative risk engine.
- **Priority:** MUST HAVE.
- **Source:** Phase 1 UPI Specification (NPCI Circular OC-121).
- **Acceptance Criteria:** Given any standard `upi://pay` URI, the parser extracts 100% of defined parameters into a validated data model within $<0.5\text{ms}$.

### FR-OBS-02: Clipboard Ingress Velocity Tracking
- **Requirement:** The system MUST calculate the elapsed time between the user focusing the VPA input field and the population of text from the clipboard buffer.
- **Rationale:** A paste latency $<150\text{ms}$ indicates an address copied from an external coaching channel (WhatsApp/SMS).
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Behavioral Research (Section 03-detection/behavioral-intelligence.md).
- **Acceptance Criteria:** Generates a boolean flag `is_fast_clipboard_paste = TRUE` if paste latency $<150\text{ms}$.

---

## 3. Behavioral & Sensor Dynamics Requirements

### FR-SEN-01: Active Telephony Call State Detection
- **Requirement:** The system MUST query the operating system's telephony manager at payment initiation to determine whether an active cellular voice call is in progress (`CALL_STATE_OFFHOOK`).
- **Rationale:** Over 90% of "Digital Arrest" and extortion scams are executed while the scammer maintains an active phone call to coach the victim.
- **Priority:** MUST HAVE.
- **Source:** Phase 1 Cybercrime Case Studies & Phase 2 Signal Reliability.
- **Acceptance Criteria:** Returns `is_cellular_call_active = TRUE` within $<1\text{ms}$ on Android without requesting call recording or audio permissions.

### FR-SEN-02: Remote Access Package Detection
- **Requirement:** The system MUST inspect the device's installed package inventory for confirmed remote desktop applications: AnyDesk (`com.anydesk.anydeskandroid`), TeamViewer (`com.teamviewer.quicksupport.market`), and RustDesk.
- **Rationale:** Remote desktop tools allow scammers to view OTPs and account numbers under the guise of "customer support".
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Threat Landscape (Section 01-threat-landscape/threat-model.md).
- **Acceptance Criteria:** Returns `is_remote_access_installed = TRUE` in $<2\text{ms}$ if any target package is detected.

### FR-SEN-03: Screen Dwell Time Tracking
- **Requirement:** The system MUST measure the elapsed dwell time (in milliseconds) spent by the user on the Pre-PIN confirmation screen.
- **Rationale:** Hesitation ($>3\times$ baseline) indicates coercion, confusion, or active scammer verbal coaching.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Behavioral Intelligence.
- **Acceptance Criteria:** Accurately records screen dwell time with $\pm 50\text{ms}$ precision.

---

## 4. Recipient Intelligence & Name Resolution Requirements

### FR-REC-01: CBS Legal Identity Resolution via `RespValAdd`
- **Requirement:** The system MUST execute the NPCI `ReqValAdd` protocol to resolve the official Core Banking KYC legal account holder name and Merchant Category Code (MCC) for the beneficiary VPA.
- **Rationale:** Core banking records cannot be forged by fraudsters; exposes institutional impersonation.
- **Priority:** MUST HAVE.
- **Source:** Phase 1 NPCI Architecture & Phase 2 Recipient Intelligence.
- **Acceptance Criteria:** Correctly stores `resolved_legal_name` and `resolved_mcc` prior to unlocking the MPIN activity.

### FR-REC-02: Handle Typo-Squatting and Punycode Detection
- **Requirement:** The system MUST calculate the Levenshtein distance and identify homoglyph character substitutions between the beneficiary VPA handle and a dictionary of protected institutional keywords (`sbi`, `police`, `customs`, `bill`, `care`, `refund`).
- **Rationale:** Detects fake handles masquerading as institutions (e.g., `sbi-refund.helpdesk@ybl`).
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Threat Model.
- **Acceptance Criteria:** Flags any personal P2P handle containing protected institutional substrings with `is_typosquat_handle = TRUE`.

---

## 5. Contextual NLP & Semantic Requirements

### FR-NLP-01: Entity-Purpose Semantic Clash Calculation
- **Requirement:** The system MUST compute a semantic clash score ($0.0 - 1.0$) comparing the stated purpose (from `tn` note or user input) against the resolved beneficiary legal name and category (`RespValAdd`).
- **Rationale:** Prevents extortion by detecting when official claims (e.g. "customs duty") are routed to private individuals.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Contextual Risk (Section 03-detection/contextual-risk.md).
- **Acceptance Criteria:** Stated purpose relating to Government / Utility / Police paid to an individual P2P account outputs `clash_score >= 0.90`.

### FR-NLP-02: Multilingual Indic Intent Classification
- **Requirement:** The system MUST classify payment note text across five psychological manipulation dimensions: Authority/Coercion, Time Scarcity, Financial Gain/Ponzi, Panic/Threat, and Cognitive Inoculation in English, Hindi, and code-mixed Hinglish.
- **Rationale:** Detects extortion scripts that avoid simple English keywords.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Social-Engineering Detection.
- **Acceptance Criteria:** Correctly tags Indic threats (*"bijli cut off hogi"*, *"CBI clearance"*) with confidence $\ge 0.85$ within $<35\text{ms}$ on quantized models.

---

## 6. Quantitative Risk Scoring Requirements

### FR-RSK-01: Sub-10ms Tabular GBDT Scoring
- **Requirement:** The hot-path risk engine MUST evaluate a compiled LightGBM model over 25+ tabular transaction and telemetry features in $<10\text{ms}$ on commodity CPU hardware.
- **Rationale:** Meets national payment switch latency budgets without causing transaction drops.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Real-Time Decisioning.
- **Acceptance Criteria:** Ingestion to calibrated risk score $P(\text{Scam})$ completes in $\le 8\text{ms}$ at 99th percentile.

### FR-RSK-02: Feature Attribution Reason Codes (TreeSHAP)
- **Requirement:** For every scored transaction, the engine MUST generate the top 3 contributing feature reason codes derived from TreeSHAP values.
- **Rationale:** Mandatory for regulatory explainability under RBI Model Risk Management guidelines.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Auditability & Governance.
- **Acceptance Criteria:** Emits standardized reason codes (e.g., `ACTIVE_CALL_WITH_NEW_PAYEE`, `ENTITY_NAME_MISMATCH`) for every decision.

---

## 7. Agentic Investigation & Reasoning Requirements

### FR-AGT-01: Selective Warm-Path Agentic Triage
- **Requirement:** The system MUST invoke the Agentic Reasoner ONLY when the hot-path GBDT score falls within the ambiguous corridor ($0.20 \le P \le 0.85$), and MUST bypass the agent for transactions with $P < 0.20$.
- **Rationale:** Preserves compute economics and prevents latency degradation on 99.5% of safe volume.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Agentic Patterns (Pattern B: Tiered Triage).
- **Acceptance Criteria:** Agent is invoked on $\le 0.8\%$ of total transaction traffic in benchmark tests.

### FR-AGT-02: Competing Hypothesis Formulation
- **Requirement:** When invoked, the agent MUST evaluate at least two competing hypotheses: Hypothesis A (Malicious Social Engineering / Extortion) and Hypothesis B (Legitimate Urgent Commercial / Emergency Transfer), querying diagnostic tools to resolve contradictions.
- **Rationale:** Prevents false-positive blocks on emergency transfers.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Agentic Capabilities.
- **Acceptance Criteria:** Emits a structured evidentiary JSON object articulating evidence supporting and refuting both hypotheses.

### FR-AGT-03: Hard Circuit Breaker on Agent Execution
- **Requirement:** The agentic execution pipeline MUST enforce a strict timeout of $1,800\text{ms}$. If reasoning exceeds this threshold, the agent is aborted and the system falls back to deterministic rule policy.
- **Rationale:** Guarantees that slow LLM responses never hang user checkout screens.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Reliability.
- **Acceptance Criteria:** Aborts agent and yields fallback verdict in $\le 1,800\text{ms}$ with zero unhandled exceptions.

---

## 8. Intervention & Interlocking Requirements

### FR-POL-01: Dynamic Legal Name Typing Challenge
- **Requirement:** When risk score $0.40 \le P < 0.75$ and an entity clash is detected, the system MUST interlock the checkout UI, requiring the user to manually type the beneficiary's CBS legal KYC name before unlocking the "Pay" button.
- **Rationale:** Forces System 2 cognitive processing, breaking the scammer's psychological hypnosis.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Existing Interventions.
- **Acceptance Criteria:** The "Pay" button remains disabled until the user types the exact legal name string; provides an immediate "Cancel & Report" button.

### FR-POL-02: Active Phone Call Interlock
- **Requirement:** When risk score $P \ge 0.75$ and an active cellular call is detected, the system MUST lock payment execution until the operating system confirms the phone call has been terminated (`CALL_STATE_IDLE`).
- **Rationale:** Physically severs the scammer's real-time psychological coaching channel.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Intervention Models.
- **Acceptance Criteria:** Payment cannot proceed while `CALL_STATE_OFFHOOK = TRUE`.

---

## 9. Forensics & Auditability Requirements

### FR-AUD-01: Immutable Cryptographic Decision Dossier
- **Requirement:** The system MUST emit an immutable JSON audit dossier for every evaluated transaction containing: unique Transaction ID, UTC timestamp, input telemetry snapshot, model version hashes, agent tool outputs, TreeSHAP reason codes, friction tier, and user interaction outcome.
- **Rationale:** Legal admissibility under the Bharatiya Sakshya Adhiniyam (BSA) 2023 for cybercrime prosecution.
- **Priority:** MUST HAVE.
- **Source:** Phase 2 Auditability.
- **Acceptance Criteria:** Audit record is digitally signed with an HMAC-SHA256 server key and committed to append-only storage in $<5\text{ms}$.

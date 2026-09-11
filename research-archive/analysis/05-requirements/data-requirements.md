# Data Requirements and Inventory in Scam Defense

## 1. Executive Summary & Protocol

Data is the foundational medium of threat assessment. However, in requirements engineering, data specifications frequently degenerate into speculative wishlists: analysts assume that any data that sounds useful (e.g., private chat logs, ambient microphone audio, competitor bank account balances) can simply be ingested into the system.

In strict compliance with Part 17 of the Phase 5 mandate, this document establishes a **comprehensive requirements-level data inventory**. It defines **what data the system needs, why it is needed, when it becomes available, who provides it, whether access is realistic, and its statutory privacy classification**. In keeping with our core principles, it defines data requirements without designing physical database schemas, table structures, or storage engines.

---

## 2. Requirements-Level Data Inventory

| Data Category & Attribute | Purpose & Why Needed | Temporal Availability | Authoritative Source | Requirement Status | Access Assumption & Feasibility | Sensitivity & Privacy Tier |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **D-01: Transaction Parameters** *(Amount, Currency, Timestamp, Channel)* | Core payload required to evaluate transaction value, velocity, and basic clearing rules. | In-Line Clearance (<50ms) | Sending Bank Core Switch | **REQUIRED** | **Assumed Available**: Standard payment message payload. | **Confidential**: Standard financial transaction data. |
| **D-02: Counterparty Identifier** *(Payee Account Number, Sort Code, UPI ID)* | Establishes recipient identity for directory lookup and network graph mapping. | Pre-Flight & In-Line | User input / Payment Switch | **REQUIRED** | **Assumed Available**: Mandatory for payment routing. | **Confidential**: Banking identifier subject to secrecy. |
| **D-03: Sender Historical Baseline** *(90-day velocity, historical payees, typical amounts)* | Establishes authentic spending baseline to detect statistical deviations and unusual activity. | Pre-Flight Session Setup | Sending Bank Data Warehouse | **REQUIRED** | **Assumed Available**: Stored within the sending bank’s internal systems. | **Confidential**: Internal customer banking history. |
| **D-04: Client Interaction Timing** *(Payee dwell time, amount dwell time, paste flags)* | Distinguishes habitual, fluent payments from hesitant, dictated, or rushed coerced entries. | Pre-Flight Drafting (2–5m) | Client Mobile Application SDK | **REQUIRED** | **Assumed Available**: Captured directly by mobile banking app SDK. | **Internal / Behavioral**: Telemetry generated within app sandbox. |
| **D-05: Device Integrity State** *(Root/jailbreak status, emulator, app signature hash)* | Detects synthetic device farms, automated bots, and compromised execution environments. | Pre-Flight Initialization | Client Mobile Application SDK | **REQUIRED** | **Assumed Available**: Accessible via OS APIs (Play Integrity / App Attest). | **Internal Technical**: Device hardware and OS metadata. |
| **D-06: Remote Access Software Status** *(Active AnyDesk, TeamViewer, RustDesk connection)* | High-confidence indicator of tech-support scams, remote takeover, and guided fraud transfers. | Pre-Flight Drafting Window | Client Mobile OS / RASP SDK | **REQUIRED** | **Platform Dependent**: Reliable on Android; restricted on iOS. | **Internal Technical**: Running process and accessibility flags. |
| **D-07: Beneficiary Account Tenure** *(Account creation timestamp bracket, e.g., <7d, <30d)* | High-confidence indicator of disposable money mule accounts receiving initial scam proceeds. | Pre-Flight or In-Line | Central Switch / Receiving Bank | **REQUIRED** | **Requires Integration**: Needs switch risk directory (CoP / DPIP API). | **Confidential**: Inter-bank risk metadata. |
| **D-08: Beneficiary Velocity Ratio** *(Inflow-to-outflow ratio, rapid post-deposit drain)* | Core signature of pass-through money mules (funds drained within 60 seconds). | In-Line or Post-Settlement | Receiving Bank Ledger / Switch | **REQUIRED** | **Requires Integration**: Currently siloed inside receiving bank. | **Confidential**: Counterparty operational telemetry. |
| **D-09: Cellular Voice Call State** *(Active cellular voice call flag during payment entry)* | Core indicator of live impersonation coercion (victim on call with scammer during transfer). | Pre-Flight Drafting Window | Telco Carrier API / Mobile OS | **CONVENIENT** | **Uncertain / External**: Available on Android; requires CAMARA API on iOS. | **Sensitive Telephony**: Network signaling metadata. |
| **D-10: Payment Memo Semantic Text** *(Free-text transaction remark, e.g., "Court bail", "Gift")* | Provides natural language cues regarding transaction context and scammer pre-coaching. | Pre-Flight / In-Line | User input in payment form | **CONVENIENT** | **Assumed Available**: Included in standard UPI / Faster Payments payloads. | **Confidential**: User-entered financial communication. |
| **D-11: Behavioral Touch Cadence** *(Touch pressure, swipe curvature, inter-key delay)* | Secondary indicator of physiological stress tremor or hesitant dictation. | Pre-Flight Drafting Window | Client Mobile Application SDK | **CONVENIENT** | **Assumed Available**: Captured within native app view container. | **Special Category**: Biometric data under GDPR Article 9. |
| **D-12: Presentation Visual Artifacts** *(OCR text from fake police warrants, forged summons)* | Catches social engineering deception at presentation layer before payment entry. | Pre-Flight Window | Client Mobile Presentation Layer | **CONVENIENT** | **Uncertain**: Requires on-device OCR; restricted on iOS. | **Highly Sensitive**: User screen and document images. |
| **D-13: National Cybercrime Blacklists** *(Reported suspect UPI IDs, accounts, phone numbers)* | Definitive match against confirmed cybercrime syndicate infrastructure. | Pre-Flight or Post-Settlement | Law Enforcement (I4C, IC3) | **CONVENIENT** | **External Dependency**: Subject to national cybercrime portal latency. | **Restricted / Public**: Official cybercrime intelligence. |
| **D-14: Private OTT Chat Transcripts** *(Raw text/audio inside WhatsApp, Telegram, Signal)* | Direct evidence of social engineering dialogue and scammer promises. | Pre-Flight Window | Third-Party Messaging Apps | **FORBIDDEN** | **IMPOSSIBLE**: End-to-end encrypted; sandboxed by iOS/Android. | **Extremely Sensitive PII**: Private communications. |
| **D-15: Ambient Telephony Call Audio** *(Live microphone recordings of scammer voice call)* | Audio evidence of verbal threats, extortion, and synthesized deepfakes. | Pre-Flight Window | Device Microphone / Audio Stack | **FORBIDDEN** | **ILLEGAL**: Prohibited by wiretapping and surveillance statutes. | **Extremely Sensitive**: Wiretap-grade communications data. |
| **D-16: Competitor Raw Account Ledgers** *(Full unmasked balance and transaction history at Bank B)* | Comprehensive view of counterparty financial health and historical behavior. | Pre-Flight / In-Line | Competitor Receiving Bank | **FORBIDDEN** | **LEGALLY BARRED**: Prohibited by banking secrecy and privacy laws. | **Highly Confidential**: Bank customer financial records. |

---

## 3. Epistemic Access Assumptions & Boundary Rules

### 3.1 The "Assumed Available" Boundary
The system’s baseline functional capabilities (REQ-FUNC-001 through REQ-FUNC-004) depend strictly upon data classified as **Assumed Available**:
- Data internal to the sending bank (D-01, D-02, D-03).
- Data generated natively within the banking mobile app container (D-04, D-05).
- Under no circumstances will core security decisioning halt if external third-party feeds fail.

### 3.2 The "Requires Integration" Boundary
Certain critical capabilities—specifically evaluating recipient mule risk (D-07, D-08)—require institutional collaboration:
- These data dependencies require formal integration with central payment switch risk headers (e.g., NPCI DPIP, FedNow FraudClassifier) or privacy-preserving cryptographic consortiums (REQ-PRIV-004).
- The system must enforce fallback heuristics (REQ-RES-003) when counterparty risk data is withheld by participating institutions.

### 3.3 The "Categorically Forbidden" Boundary
The system architecture and requirements explicitly prohibit any operational reliance on data items **D-14, D-15, and D-16**:
- The system **MUST NOT** assume access to private chat transcripts, ambient voice call audio, or raw competitor bank balances.
- Any proposed fraud interception feature requiring these inputs is rejected as legally and architecturally invalid.

---

## 4. Summary Matrix of Data Requirements

| Requirement ID | Data Domain | Core Requirement Mandate | Priority | Traceability Link |
| :--- | :--- | :--- | :---: | :---: |
| **REQ-DAT-001** | Internal Ingestion | Ingestion of transaction parameters, payee ID, and 90-day baseline history | **MUST** | D-01, D-02, D-03 |
| **REQ-DAT-002** | Client Telemetry | Ingestion of interaction timing deltas, dwell times, and paste flags | **MUST** | D-04, D-05 |
| **REQ-DAT-003** | Counterparty Data | Ingestion of standardized beneficiary tenure and velocity brackets | **MUST** | D-07, D-08 |
| **REQ-DAT-004** | Telephony Signaling | Ingestion of high-level active call state via compliant carrier APIs | **SHOULD** | D-09 |
| **REQ-DAT-005** | Forbidden Data Ban | Absolute prohibition on ingesting encrypted chats, call audio, or raw ledgers | **MUST (Neg)** | D-14, D-15, D-16 |

This data requirements inventory establishes clear, defensible boundaries regarding what information the system can legitimately consume, grounding future technical specifications in legal, platform, and operational realities.

# Data and Signal Landscape in Fraud and Scam Defense

## 1. Executive Summary & Context

The efficacy of any detection, prevention, or intervention system is fundamentally bounded by the **information landscape** available to it. In payment scam prevention, this information landscape is highly fragmented: no single participant in the payment lifecycle possesses an omniscient view of the transaction. A signal visible to a client-side mobile application (e.g., active screen-sharing software or touch tremor) is invisible to the core payment switch; conversely, signals visible to inter-bank clearing networks (e.g., recipient account multi-bank velocity) are strictly hidden from the client application.

This document systematically maps the **universe of data signals** utilized in contemporary fraud and scam defense. For each signal class, it documents access locus, temporal availability, diagnostic indication, technical limitations, privacy/regulatory constraints, and empirical evidentiary support.

---

## 2. Signal Access Matrix Across Ecosystem Loci

To understand the structural boundaries of defense systems, we first define the five primary operational loci in the payment ecosystem:
1. **Client Device / App**: The mobile banking or payment application running on the sender's smartphone.
2. **Sending Bank (Payer PSP / Issuer)**: The financial institution holding the victim's account.
3. **Payment Switch / Central Rail**: The instant settlement switch (e.g., NPCI UPI, FedNow, Pay.UK Faster Payments, Banco Central do Brasil Pix).
4. **Receiving Bank (Beneficiary PSP / Acquirer)**: The institution holding the recipient's (often mule) account.
5. **Telecommunications Provider (Telco)**: Mobile network operators managing voice, SMS, and data connectivity.

```text
                  THE INFORMATION ASYMMETRY LANDSCAPE
                  
[Client Device]          [Sending Bank]          [Payment Switch]        [Receiving Bank]
- Touch Dynamics         - Account Balance       - Sender-Receiver ID    - Beneficiary Age
- Active Call State      - Historical Baseline   - Inter-Bank Velocity   - Cash-Out Velocity
- Remote Access Tools    - KYC Identity          - Switch Rule Flags     - Inflow/Outflow Ratio
- Clipboard Copy-Paste   - IP & Device History                           - Mule Risk Score
       │                       │                        │                       │
       ▼                       ▼                        ▼                       ▼
(Payload Sent) ────────► (Core Switch Risk) ────► (Clearing Rail) ──────► (Settlement Complete)
  [Device signals         [Internal balance &       [Minimal payload       [Recipient behavior
   stripped/hashed]        history only]             metadata only]         isolated]
```

| Signal Class | Client App | Sending Bank | Central Switch | Receiving Bank | Telco / Carrier |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Device Integrity & Remote Access** | **Direct** | Hashed Token | No | No | No |
| **Behavioral Biometrics (Touch/Gyro)** | **Direct** | Hashed Score | No | No | No |
| **Active Telephony Call State** | **Direct (OS Perm)** | No | No | No | **Direct** |
| **Sender Transaction History** | Cached | **Direct** | Partial | No | No |
| **Beneficiary Account Age & History**| No | No | No | **Direct** | No |
| **Inter-Bank Flow & Mule Velocity** | No | No | **Direct** | Partial | No |
| **Network Location (Cell Tower / IP)** | IP / GPS | IP only | IP only | No | **Direct** |

---

## 3. Exhaustive Taxonomy of Defense Signals

### 3.1 Device & Application Integrity Signals

| Signal Parameter | Access Point | Temporal Availability | Diagnostic Indication | Limitations & Evasion | Privacy & Regulatory Bounds | Evidence of Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Remote Access Tool (RAT) Presence** (e.g., AnyDesk, TeamViewer, RustDesk) | Client App (via OS package manager / accessibility query) | Pre-session to Session runtime | High indicator of tech-support scam, remote screen control, or guided scam transfer | Scammers use obscure open-source tools or legitimate enterprise utilities; sideloaded APKs bypass standard package queries. | Requires `QUERY_ALL_PACKAGES` permission on Android; heavily scrutinized by Google Play Store policies. | **Extremely High**: Sardine, BioCatch, and ThreatFabric show >65% correlation with tech-support scams. |
| **Android Accessibility Service Abuse** | Client App (via Android `AccessibilityManager`) | Real-time session runtime | Malware overlay attacks; automated keystroke injection; unauthorized screen scraping | Legitimate accessibility tools used by visually impaired users generate false positives. | Regulated by Google Play Store declaration; restricted on modern Android versions (Android 13+). | **Critical**: Primary vector for banking trojans (SharkBot, TeaBot). |
| **Root / Jailbreak & Emulator Detection** | Client App (system file checks, safety net/Play Integrity API) | Pre-session initialization | Synthetic device farm; automated bot orchestration; reverse-engineering attack | Advanced hooking frameworks (Magisk, Frida, Zygisk) can spoof hardware attestation. | Minimal privacy impact; standard system attestation. | **High for unauthorized fraud**, Low for social engineering scams (scams happen on legitimate consumer devices). |
| **SIM Swap / eSIM Re-issuance State** | Telco API (GSMA Open Gateway API) | Real-time pre-auth check | Account takeover (ATO); interception of SMS 2FA | Legitimate SIM replacements (loss/upgrade) trigger false positives; carrier API latency (~200ms–800ms). | Requires user consent under GDPR / DPDP; subject to carrier API commercial fees. | **High for ATO fraud**, Minimal for authorized push payment scams where victim holds active SIM. |

---

### 3.2 Behavioral Biometrics & Sensor Dynamics

| Signal Parameter | Access Point | Temporal Availability | Diagnostic Indication | Limitations & Evasion | Privacy & Regulatory Bounds | Evidence of Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Touchscreen Dynamics** (swipe velocity, touch pressure, curvature, surface area) | Client App (touch event listeners) | During session drafting (continuous) | Distinguishes familiar, habitual user input from hesitant, coached, or unfamiliar input | High variance across physical environments (walking, riding a bus, cold weather). | Highly sensitive biometric data under GDPR (requires explicit processing justification). | **Moderate-High**: BioCatch and academic studies demonstrate ~82% ROC-AUC for coached scam detection. |
| **Hesitation / Dwell Time & Inter-Key Latency** | Client App (UI text input fields) | During payment detail entry | Cognitive conflict; victim hesitating while being dictated an unfamiliar account number by phone | Natural user distraction (e.g., looking up an invoice or grocery bill) mirrors hesitation. | Text input logging risks capturing sensitive credentials if not carefully decoupled. | **Moderate**: Differentiates memorized transfer to family from dictation-driven transfer. |
| **Device Motion & Tremor (Gyroscope / Accelerometer)** | Client App (hardware IMU sensor polling) | Continuous during session | Physiological stress tremor; holding phone to ear while operating screen (one-handed typing during call) | High environmental noise (car vibration, train motion); differences in device hardware calibration. | Raw sensor access unrestricted on Android; iOS enforces throttling or permission prompts. | **Emerging**: Academic HCI research shows measurable micro-tremor amplitude increases under acute threat. |
| **Clipboard Paste Velocity & Mechanics** | Client App (clipboard event listeners) | At moment of payee entry | Instant paste of external account number / UPI ID without manual typing; indicates scammer communication link | Legitimate users frequently copy-paste account numbers from WhatsApp or email invoices. | Modern iOS and Android display prominent system toast alerts when apps inspect clipboard. | **Moderate**: High correlation with rapid scam execution when combined with active call state. |

---

### 3.3 Telephony & External Communication Signals

| Signal Parameter | Access Point | Temporal Availability | Diagnostic Indication | Limitations & Evasion | Privacy & Regulatory Bounds | Evidence of Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Active Voice Call State** (Concurrent Phone Call) | Client App (`TelecomManager` / `CallStateListener`) or Telco | Real-time during payment drafting | Victim is on an active voice call with the scammer while authorizing a payment | Legitimate users frequently talk to friends, spouses, or business partners while making payments. | Android 12+ requires `READ_PHONE_STATE` permission; Apple iOS strictly isolates call status from third-party apps. | **Extremely High**: Australian banks and UK data reveal >70% of impersonation scams occur during concurrent phone call. |
| **Inbound Call Spoofing & Carrier Reputation** | Telco / Carrier level (STIR/SHAKEN / DoT systems) | Network level at call arrival | Scammer spoofing bank's official inbound telephone number | Encrypted VoIP services (WhatsApp, Telegram, Signal) bypass traditional telco STIR/SHAKEN checks entirely. | Managed at national telecom regulatory boundary; banks lack direct access. | **Critical for impersonation**, but shifting rapidly to VoIP channels. |
| **Recent Communication Intercepts (SMS/WhatsApp)** | Client App (Android notification listener / SMS inbox) | Real-time | Detects active phishing links, urgent extortion texts, or OTP requests | Apple iOS strictly prohibits SMS or notification inspection; Android requires dangerous permissions. | Severe privacy invasion; strictly illegal under GDPR, EU privacy laws, and India DPDP 2023 without explicit statutory exemption. | **High diagnostic signal**, but legally and architecturally unavailable in production banking apps. |

---

### 3.4 Beneficiary & Counterparty Graph Signals

| Signal Parameter | Access Point | Temporal Availability | Diagnostic Indication | Limitations & Evasion | Privacy & Regulatory Bounds | Evidence of Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Beneficiary Account Age (Tenure)** | Receiving Bank / Central Switch | Real-time pre-settlement query | Brand-new account opened <7 days ago receiving sudden high-value transfer (classic "mule" profile) | Mules frequently "age" accounts for 6 months with small transactions before activating for scam cash-out. | Bank secrecy laws prevent receiving bank from exposing account age directly to sender. | **Extremely High**: UK CoP and Australian data show >60% of scam losses flow into accounts <30 days old. |
| **Inflow-to-Outflow Velocity Ratio** | Receiving Bank | Near-real-time (post-deposit) | Funds immediately wired out or withdrawn at ATM within 60 seconds of receipt ("pass-through mule") | Legitimate payroll or bill-paying accounts can exhibit rapid outflow patterns. | Available strictly within receiving bank domain; invisible to sending bank. | **Gold standard for mule identification** (Featurespace, Sardine, Feedzai). |
| **Cross-Institution Graph Centrality (Degree)** | Central Switch / Inter-Bank Consortium | Real-time / Streaming bus | Account receiving funds from multiple unrelated senders across different banks simultaneously | Requires centralized consortium visibility (e.g., NPCI DPIP, Mastercard CFR, Feedzai BAF). | Inter-bank data sharing constraints; banking secrecy regulations. | **Decisive**: Uncovers coordinated investment scam collections and distributed mule rings. |
| **National Suspect Registry Match** (e.g., I4C / Scamwatch) | National Gateway / API lookup | Real-time query (50ms–200ms) | Account, phone number, or UPI ID previously reported in verified cybercrime police complaints | High latency in victim reporting (victims take 24h–72h to report); fraudsters abandon accounts before registry updates. | Governed by statutory cybercrime frameworks; public data protection carve-outs exist. | **Absolute when matched**, but suffers from temporal lag (cold intelligence). |

---

### 3.5 Transaction Contextual & Temporal Signals

| Signal Parameter | Access Point | Temporal Availability | Diagnostic Indication | Limitations & Evasion | Privacy & Regulatory Bounds | Evidence of Utility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Deviation from Baseline Velocity & Value** | Sending Bank | In-line clearance | Unusually large transfer relative to sender's 90-day historical mean (e.g., 10x standard deviation) | High false-positive rate on legitimate life events (buying a car, paying college tuition, wedding gifts). | Internal bank data; zero external privacy hurdles. | **Standard baseline signal**; high recall, moderate precision. |
| **Transaction Draft Duration** | Client App | Pre-authorization window | Very short draft time (scripted/rushed) or excessively prolonged draft time (confusion, dictation) | High variance across user age groups and digital literacy levels. | Minimal privacy impact; local client telemetry. | **Moderate**: Useful in ensemble models with behavioral biometrics. |
| **Payment Memo / Remarks Text Analysis** | Sending Bank / Central Switch | In-line clearance | Natural language cues: "Police security fee", "Release tax", "Crypto profit", "Family emergency" | Scammers instruct victims to enter innocent memo descriptions ("Gift", "Renovation", "Car purchase"). | Text analysis is computationally trivial, but lexical evasion by fraudsters is trivial. | **Low standalone value** due to active fraudster coaching. |

---

## 4. Signal Evasion & Adversarial Countermeasures

Scammers systematically adapt their tactics to neutralize data signals as soon as detection systems deploy them:

```text
       DEFENSE SIGNAL                               SCAMMER EVASION COUNTERMEASURE
┌──────────────────────────────┐              ┌──────────────────────────────────────────┐
│ Screen-Sharing / RAT         │ ───────────► │ Shift to secondary device (victim views  │
│ Detection on App             │              │ laptop while operating phone independently)
├──────────────────────────────┤              ├──────────────────────────────────────────┤
│ Active Voice Call Detection  │ ───────────► │ Shift from Cellular Call to WhatsApp/    │
│ via OS Telephony API         │              │ Telegram VoIP or asynchronous texting    │
├──────────────────────────────┤              ├──────────────────────────────────────────┤
│ Fast Beneficiary Account Age │ ───────────► │ "Sleep & Age" Mules (dormant 6 months    │
│ Alerts                       │              │ before scam deployment)                  │
├──────────────────────────────┤              ├──────────────────────────────────────────┤
│ Touch Biometrics & Tremor    │ ───────────► │ Scammer takes over session directly via  │
│ Anomaly Detection            │              │ RAT unattended access or full credential ATO
└──────────────────────────────┘              └──────────────────────────────────────────┘
```

1. **The Second-Device Workaround**:
   - When banks deployed client-side checks detecting active screen-sharing software (AnyDesk), scammers instructed victims to install AnyDesk on their home desktop PC or tablet while executing the payment on their unmonitored smartphone, completely blinding client-side RAT detection.
2. **The Telecom Shift (PSTN to VoIP)**:
   - When mobile apps began checking `CallStateListener` to identify active phone calls during payment entry, criminal syndicates shifted communication to WhatsApp Voice, Telegram, or Signal, which do not reliably register on legacy mobile OS telephony listeners.
3. **Mule Aging & Micro-Warmups**:
   - To defeat beneficiary age checks (e.g., accounts <30 days old), organized crime networks purchase hundreds of student or compromised accounts and conduct small, legitimate peer-to-peer transactions for several months ("sleeper accounts") before routing major scam proceeds through them.

---

## 5. Regulatory, Privacy, and OS Platform Boundaries

The collection and processing of fraud signals are strictly bounded by mobile operating system policies and international privacy legislation.

### 5.1 Mobile OS Sandboxing (Android vs. iOS)
- **Apple iOS**:
  - Enforces strict application sandboxing. Banking apps **cannot** inspect running processes, detect installed third-party apps, read clipboard content without explicit user permission, or access telephony call state.
  - Behavioral biometrics on iOS are limited to touch coordinates within the app's own web/native views. Raw gyroscope and accelerometer data are increasingly restricted or rate-limited.
- **Google Android**:
  - Historically offered broader device telemetry, but Google Play Store policies (2023–2026) have progressively restricted `QUERY_ALL_PACKAGES` and Accessibility Services.
  - Apps attempting to read telephony call status or background package lists without formal enterprise/security exemptions face expulsion from the Play Store.

### 5.2 Privacy Regulations (GDPR, EU AI Act, India DPDP 2023)
- **Biometric Classification**: Under GDPR Article 9, behavioral biometrics (typing cadence, swipe dynamics) constitute "special category biometric data" if used for unique personal identification, requiring explicit consent or rigorous statutory legal bases (e.g., fraud prevention under legitimate public interest).
- **Proportionality & Purpose Limitation**: Financial institutions cannot continuously harvest ambient sensor telemetry (accelerometer, microphone, clipboard) without demonstrating that the collection is strictly necessary and proportionate to fraud mitigation.
- **Cross-Border Inter-Bank Data Sharing**: Bank secrecy and cross-border data transfer laws often prevent a receiving bank in one jurisdiction (e.g., UK or India) from sharing detailed beneficiary KYC telemetry with a sending bank in another, creating permanent data silos that benefit international scam rings.

---

## 6. Summary of Findings: Data & Signal Landscape

| Signal Category | Standalone Diagnostic Power | System Availability | Chief Operational Vulnerability |
| :--- | :--- | :--- | :--- |
| **Device & App Integrity** | Extremely High for RAT/Malware | Client App Only (Android-heavy) | OS platform policy restrictions; second-device evasion |
| **Behavioral Biometrics** | Moderate-High for Coached Hesitation | Client App Only | Environmental noise; high biometric privacy thresholds |
| **Telephony / Call State** | High for Impersonation Scams | Client App / Telco | Shift to encrypted VoIP (WhatsApp/Signal) |
| **Beneficiary Mule Dynamics** | Decisive for Cash-Out Interception | Receiving Bank / Central Switch | Invisible to sending bank; inter-bank data silos |
| **Sender Transaction Deviation** | High Recall / Poor Precision | Sending Bank | High false-positive rate on legitimate unusual purchases |

```text
CORE LANDSCAPE TAKEAWAY:
No single entity possesses all necessary signals to detect authorized scams. 
Client apps see the victim's hesitation and device state, but cannot see 
the recipient's mule risk; receiving banks see rapid cash-out velocity, 
but cannot see the sender's social engineering trance. 
Existing systems fail primarily because these critical signals remain 
isolated within architectural, regulatory, and platform silos.
```

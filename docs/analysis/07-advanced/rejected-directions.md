# Formally Rejected Directions & Architectural Anti-Patterns

## 1. Executive Summary & The Value of Rejection

A rigorous engineering investigation is defined as much by what it **formally rejects** as by what it adopts. In high-stakes financial cyber-defense, speculative technologies that look impressive in pitch decks frequently introduce catastrophic operational vulnerabilities, regulatory liabilities, or physics violations in production.

In strict compliance with Part 18 of the Phase 7 mandate, this document records the **six technological and operational directions evaluated and formally rejected** during Phase 7 research, accompanied by explicit empirical, mathematical, and legal justifications.

---

## 2. Register of Formally Rejected Directions

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REJECTED DIRECTIONS REGISTER                                   │
├────────┬──────────────────────────────────┬─────────────────────────────┬────────────────────────┤
│ Rej ID │ Proposed Capability / Concept    │ Fatal Flaw / Primary Hazard │ Primary Violation      │
├────────┼──────────────────────────────────┼─────────────────────────────┼────────────────────────┤
│ REJ-01 │ Real-Time Cloud LLM in Clearance │ Non-Deterministic Latency   │ Switch SLA (<50ms)     │
│ REJ-02 │ Autonomous Debanking & Seizures  │ Algorithmic Due Process Fail│ GDPR Art 22 / Due Proc.│
│ REJ-03 │ Continuous Call Audio Recording  │ Severe Wiretap & Privacy Liab│ Wiretap Acts / DPDP Act│
│ REJ-04 │ Multi-Hop Crypto Tracing In-Line │ Latency & Post-Facto Mismatch│ Clearance Physics      │
│ REJ-05 │ Universal Mandatory Cooling-Off  │ Extreme Commercial Friction │ Insult Ceiling (≤10:1) │
│ REJ-06 │ Keystroke Biometrics on Short Tx │ High False Non-Match Rate   │ Sample Size Physics    │
└────────┴──────────────────────────────────┴─────────────────────────────┴────────────────────────┘
```

---

## 3. Detailed Rejection Justifications

### 3.1 REJ-01: Real-Time Generative Cloud LLM in the In-Line Clearance Path
- **The Concept**: Routing transaction payloads to an external cloud-hosted Large Language Model (e.g., GPT-4 or Claude 3.5 Sonnet) during in-line switch evaluation to "reason about fraud intent".
- **Fatal Engineering Flaw**:
  - **Physics Violation**: Cloud LLM API calls exhibit P99 network and inference latencies ranging from $800\text{ms}$ to $3,500\text{ms}$. The national payment switch enforces a hard $\le 50\text{ms}$ connection timeout (`REQ-TIME-001`, `CF-01`). An LLM in the in-line path guarantees a 100% switch timeout rate.
  - **Adversarial Vulnerability**: Cloud LLMs are vulnerable to prompt injection attacks where scammers instruct victims to paste specific bypass tokens into payment remark fields (`REQ-SEC-003`).
- **Verdict**: **REJECTED FROM IN-LINE PATH**. (Constrained Small Language Models are permitted strictly on the client device for pre-PIN UI dialogues `ACAP-01` or offline in the SOC console `ACAP-07`).

---

### 3.2 REJ-02: Autonomous Debanking, Permanent Account Closure, and Fund Seizures (Level 5 Autonomy)
- **The Concept**: Allowing an autonomous AI agent to permanently freeze bank accounts, terminate customer relationships, or seize assets without human review when a high risk score is calculated.
- **Fatal Legal & Ethical Flaw**:
  - **Statutory Violation**: Direct violation of **GDPR Article 22** and the Equal Credit Opportunity Act (ECOA), which prohibit decisions producing significant legal effects based solely on automated processing.
  - **Severe Civil Liability**: An autonomous freeze on an unverified fraud score can ruin a legitimate small business or deprive an innocent family of basic sustenance, exposing the bank to massive civil damages lawsuits and civil rights sanctions (`REQ-HITL-002`).
- **Verdict**: **CATEGORICALLY REJECTED AND LEGALLY FORBIDDEN**.

---

### 3.3 REJ-03: Continuous Background Phone Call Audio Surveillance
- **The Concept**: Continuously recording and transcribing user microphone audio to listen for scammer keywords during active phone calls.
- **Fatal Privacy & Regulatory Flaw**:
  - **Criminal Wiretap Liability**: In the United States (Electronic Communications Privacy Act), India (Telegraph Act / DPDP Act 2023), and the European Union (GDPR Article 9), recording private voice conversations without two-party consent is a **felony offense**.
  - **Consumer Trust Destruction**: Banking applications that demand continuous background microphone surveillance are rapidly rejected by Apple App Store and Google Play Store review boards and abandoned by consumers (`REQ-PRIV-002`, `CF-03`).
- **Verdict**: **STRICTLY PROHIBITED**. Telephony sensing must remain strictly restricted to **ephemeral binary OS flags** (`is_call_active`) or carrier network APIs (`REQ-FUNC-003`, `REQ-STK-007`).

---

### 3.4 REJ-04: Multi-Hop Cryptocurrency & Dark Web Tracing in the In-Line Clearance Path
- **The Concept**: Performing real-time blockchain lookups across Bitcoin, Ethereum, and Tron ledgers during in-line bank payment clearance to check if the beneficiary account is associated with a crypto off-ramp.
- **Fatal Architecture Flaw**:
  - **Post-Facto Mismatch**: Fiat payment switches clear fiat currency (INR, USD, GBP) to domestic retail bank accounts. Cryptocurrency conversion occurs *after* the mule has received the fiat transfer and moved it to a peer-to-peer crypto broker.
  - **Latency Penalty**: Distributed blockchain RPC lookups add $200\text{ms}$ to $1,000\text{ms}$ of latency with zero real-time interception value for domestic bank transfers.
- **Verdict**: **EXCLUDED FROM GUARDIAN ARCHITECTURE**. (Blockchain tracing belongs to specialized post-facto law enforcement forensic tools).

---

### 3.5 REJ-05: Universal Mandatory Cooling-Off Periods on All First-Time Payments
- **The Concept**: Forcing every consumer to wait 4 hours before any first-time payment to a new payee can clear.
- **Fatal Commercial Flaw**:
  - **Customer Insult Explosion**: In modern retail digital economies, consumers execute dozens of benign first-time payments monthly (paying a new food delivery vendor, an auto-rickshaw driver, or an unlisted retail shop).
  - Enforcing universal 4-hour holds on all new payees generates an astronomical customer insult ratio ($>500:1$), paralyzes everyday mobile commerce, and drives customers to abandon the bank for a frictionless competitor (`REQ-SAF-002`, `CF-02`).
- **Verdict**: **REJECTED AS A GLOBAL DEFAULT**. (Cooling-off holds must remain strictly restricted to **extreme-risk, high-value anomalies** where active social engineering manipulation signals are affirmatively present).

---

### 3.6 REJ-06: Behavioral Keystroke Dynamics on Short (<2 Second) Payment Entry Flows
- **The Concept**: Calculating biometric anomaly scores on users who type a short payee name and amount in under 2 seconds.
- **Fatal Mathematical Flaw**:
  - **Insufficient Sample Size (`VAL-03`)**: A 2-second typing interaction generates fewer than 10 keystroke intervals. Academic literature in behavioral biometrics demonstrates that statistical variance on sequences shorter than 30 keystrokes produces unacceptably high False Match Rates ($>25\%$).
  - Triggering fraud friction based on a 2-second sample creates high false alarms on decisive, practiced typers.
- **Verdict**: **REJECTED FOR SHORT SESSIONS**. (Behavioral typing biometrics are evaluated only when the interaction window provides $\ge 25$ discrete input events; otherwise the model falls back gracefully to transaction-intrinsic features `REQ-RES-003`).

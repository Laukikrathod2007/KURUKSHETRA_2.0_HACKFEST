# Core Product Workflow & Transaction Lifecycle

## 1. Executive Summary & Workflow Architecture

The core operational workflow of the *Agentic Guardian for Real-Time Payment Scam Interception* spans four distinct temporal phases across the payment lifecycle: **Pre-Flight Drafting**, **In-Line Authorization**, **Pre-PIN Cognitive Intervention**, and **Post-Settlement Streaming Containment**.

This document maps the end-to-end processing pipeline, identifying inputs, processing nodes, decision forks, outputs, human touchpoints, and deterministic fallback paths.

---

## 2. End-to-End Operational Flow Diagram

```text
  [STAGE 1: PRE-FLIGHT DRAFTING WINDOW (30s - 120s)]
  User enters payee & amount in Mobile Banking App
         │
         ├── Passive Telemetry SDK captures touch intervals, field focus, copy-paste
         ├── Background query checks active phone call / screen sharing state
         └── Pre-computed beneficiary risk profile fetched into client memory cache
         │
  [STAGE 2: TRANSACTION INITIATION & IN-LINE SCORING (≤ 45ms)]
  User taps "Proceed to Pay" ──────► Switch Gateway sends payload to Guardian Engine
         │
         ├── Feature Vector Assembled (Telemetry + History + Counterparty) [≤15ms]
         ├── ML Classifier & Uncertainty Quantification Evaluated [≤15ms]
         └── Decision Gateway assigns Operational Directive [≤5ms]
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼
    Level 1: ALLOW     Level 2: INFORM    Level 3: INTERVENE  Level 4: HOLD
   (Risk < 0.30)     (0.30 ≤ R < 0.65)   (0.65 ≤ R < 0.85)   (Risk ≥ 0.85)
         │                  │                  │                  │
  [STAGE 3: CLIENT-SIDE COGNITIVE INTERVENTION (PRE-PIN ENTRY)]   │
  Direct to PIN      Non-blocking banner Dynamic de-biasing   Temporary Time-Lock
  entry screen       displays payee age  challenge prompt     enforced on funds
         │                  │                  │                  │
         │           User acknowledges   User completes Q&A   Customer routes
         │                  │            or aborts payment    to SOC / Redress
         │                  │                  │                  │
         └──────────────────┴──────────────────┴──────────────────┘
                                    │
                       User enters PIN & confirms
                                    │
  [STAGE 4: SETTLEMENT & POST-SETTLEMENT CONTAINMENT (≤ 60s)]
  Core Banking clears debit ──────► National Switch settles credit
                                    │
                                    ├── Risk > 0.70? ──► Dispatch Out-of-Band
                                    │                    camt.056 Mule Hold to
                                    │                    Beneficiary Bank (≤60s)
                                    │
                                    └── Persist signed audit payload to WORM log
```

---

## 3. Detailed Stage-by-Stage Operational Walkthrough

### 3.1 Stage 1: Pre-Flight Telemetry Intake & Asynchronous Enrichment
- **Trigger**: User opens the payment entry screen in the mobile banking application.
- **Inputs**: Keystroke timing intervals, touch pressure/curvature, clipboard event timestamps, beneficiary account identifier (VPA/IBAN), transaction amount, foreground application lifecycle events.
- **Processing**:
  - The client SDK initializes a lightweight, ephemeral state buffer in local RAM.
  - An asynchronous background query retrieves the sender's 90-day relational profile and recipient risk flags from the local cache (`REQ-CTX-001`, `REQ-CTX-003`).
  - Binary device environment checks evaluate whether a standard telephony call is active or screen-sharing services are running (`REQ-FUNC-003`).
- **Output**: Pre-flight telemetry packet serialized in memory, ready for instant transmission.

### 3.2 Stage 2: In-Line Evaluation & Policy Decisioning ($\le 45\text{ms}$)
- **Trigger**: User clicks "Proceed to Pay".
- **Inputs**: Pre-flight telemetry packet + Core transaction authorization request payload (Source Account, Destination Account, Amount, Currency, Timestamp).
- **Processing**:
  1. *Assembly ($0-15\text{ms}$)*: Guardian API deserializes inputs and merges real-time telemetry with cached historical baselines.
  2. *Inference ($15-30\text{ms}$)*: Calibrated machine learning classifier outputs continuous risk score $R \in [0.0, 1.0]$, social engineering typology probabilities, and epistemic uncertainty bounds ($\sigma$).
  3. *Policy Evaluation ($30-35\text{ms}$)*: Decoupled policy rules engine evaluates risk against value thresholds:
     - **Level 1 (Allow)**: $R < 0.30 \rightarrow$ Unimpeded authorization.
     - **Level 2 (Inform)**: $0.30 \le R < 0.65 \rightarrow$ Ambient contextual advisory banner.
     - **Level 3 (Intervene)**: $0.65 \le R < 0.85 \rightarrow$ Interactive de-biasing challenge modal.
     - **Level 4 (Hold)**: $R \ge 0.85 \rightarrow$ Temporal cooling-off delay; fund hold.
- **Timeout / Exception Fallback**: If total elapsed evaluation time reaches $45\text{ms}$ or an unhandled exception occurs, the hardware circuit breaker triggers **Deterministic Fail-Open** (`REQ-RES-002`), returning `Directive: Allow` with `ReasonCode: TIMEOUT_FAILOPEN` in $\le 5\text{ms}$.
- **Output**: Machine-readable decision directive returned to payment switch gateway.

### 3.3 Stage 3: Pre-PIN Cognitive Intervention & De-Biasing
- **Trigger**: Receipt of `Directive: Inform`, `Directive: Intervene`, or `Directive: Hold` at the client application.
- **Processing**:
  - **Level 2 Flow**: Displays subtle contextual banner (e.g., *"Note: You have never sent money to this recipient before"*). User can immediately proceed to PIN entry.
  - **Level 3 Flow**: Suppresses the standard PIN pad. Injects a randomized, stateful de-biasing modal (`REQ-FUNC-009`):
    - Explains specific risk rationale using plain language (`REQ-EXP-001`).
    - Surfaces scammer pre-coaching scripts (e.g., *"If someone on the phone told you this is a government fee or safe account, hang up now"*).
    - Requires active cognitive acknowledgment (randomized button layout, System 2 question).
    - If user cancels: Transaction aborts; account enters protective state (`REQ-IND-004`).
    - If user persists and completes challenge: Client permits progression to PIN entry.
  - **Level 4 Flow**: Enforces temporal cooling-off hold (`REQ-INT-005`). Funds are sequestered in the sender's account; emergency life-critical bypass pathway is presented (`REQ-SAF-001`).
- **Output**: Final user authorization confirmation or transaction abandonment.

### 3.4 Stage 4: Post-Settlement Streaming Mule Containment ($\le 60\text{s}$)
- **Trigger**: Receipt of ledger debit confirmation from core banking.
- **Processing**:
  - If transaction had evaluated risk score $R \ge 0.70$ and user bypassed Level 3 friction, the system dispatches an asynchronous event to the streaming containment bus.
  - The Mule Containment Dispatcher constructs an authenticated ISO 20022 `camt.056` payment freeze advisory signed with the bank's digital certificate (`REQ-FUNC-010`, `REQ-SEC-006`).
  - Payload is transmitted to the beneficiary institution's fraud gateway via secure inter-bank clearing rails within $\le 60\text{s}$ of ledger debit.
- **Audit Logging**: Complete atomic snapshot (inputs, model version, raw score, uncertainty, user clicks, timestamps) written to append-only WORM persistence (`REQ-OBS-001`).
- **Output**: Containment advisory delivered; audit record immutably stored.

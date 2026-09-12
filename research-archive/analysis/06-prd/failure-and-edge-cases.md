# Failure Modes, Edge Cases, and Fallback Behaviors

## 1. Executive Summary & Design Principle

Payment risk engines operating within mission-critical national clearing networks cannot afford fragile assumptions. Network partitions occur, mobile clients lose cellular coverage, downstream caches crash, and adversaries intentionally generate high-volume traffic to exploit system timeouts.

In strict compliance with Part 11 of the Phase 6 mandate, this document defines the **deterministic fallback behaviors** of the *Agentic Guardian* across ten explicit operational failure scenarios. The guiding architectural principle is: **Fail Safe, Fail Fast, and Never Silently Halt National Commerce**.

---

## 2. Failure Handling Matrix

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            FAILURE & FALLBACK MATRIX                                             │
├────┬─────────────────────────────┬───────────────────────────┬───────────────────────────────────────────────────┤
│ ID │ Operational Failure Scenario│ Detection & Trigger Bound │ Deterministic System Fallback Behavior            │
├────┼─────────────────────────────┼───────────────────────────┼───────────────────────────────────────────────────┤
│ E01│ In-Line Latency Timeout     │ Elapsed time ≥ 45ms       │ Circuit breaker executes Fail-Open (Allow) in ≤5ms│
│ E02│ Incomplete / Missing Data   │ Missing features > 30%    │ Impute neutral median; evaluate; flag uncertainty │
│ E03│ Core Cache / DB Unreachable │ Redis lookup timeout >10ms│ Fall back to local SQLite replica / neutral weight│
│ E04│ Epistemic Confidence Low    │ Epistemic uncertainty >.35│ Downgrade Level 4 Hold to Level 2 Inform advisory │
│ E05│ Client SDK Crash / ANR      │ Client UI worker error    │ Isolate thread; host app renders standard PIN pad │
│ E06│ Duplicate Transaction Event │ Duplicate idempotency key │ Return cached decision envelope instantly (≤2ms)  │
│ E07│ Network Partition to Benef. │ Recipient bank unreachable│ Queue containment advisory in durable dead-letter │
│ E08│ User Rejects Warning (L3)   │ User taps "Proceed"       │ Log explicit consumer override; unlock PIN pad    │
│ E09│ Teller / Analyst Override   │ Staff override initiated  │ Enforce dual-custody approval; log audit token    │
│ E10│ Life-Critical Medical Emerg.│ User taps emergency bypass│ Immediately release hold; escalate post-debit SOC │
└────┴─────────────────────────────┴───────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. Detailed Failure Scenario Specifications

### 3.1 Scenario E01: In-Line Evaluation Latency Timeout ($>45\text{ms}$)
- **Root Cause**: Heavy database lock contention, garbage collection pauses, or sudden network routing degradation between switch gateway and risk engine.
- **Trigger**: System execution timer reaches $45\text{ms}$ without a model output.
- **System Behavior**:
  - Hardware/software circuit breaker immediately halts execution thread (`REQ-RES-002`).
  - Emits `Directive: Allow` with `ReasonCode: TIMEOUT_FAILOPEN` within $\le 5\text{ms}$.
  - Payment switch clears the payment without interruption; zero transactions are dropped or hung.
  - Background daemon logs latency anomaly to Prometheus metrics for operational alert generation (`REQ-OBS-002`).

---

### 3.2 Scenario E02: Incomplete or Missing Telemetry Data
- **Root Cause**: Budget mobile devices dropping touch sensor events, or aggressive battery savers killing background telemetry hooks.
- **System Behavior**:
  - The model input assembler checks feature completeness.
  - Missing numerical values are imputed using population median weights (`REQ-RES-003`).
  - Epistemic uncertainty metric $\sigma$ is automatically incremented in proportion to the number of missing features.
  - If $\sigma > 0.35$, policy engine automatically caps the maximum allowable intervention tier to Level 2 (Inform), preventing high-friction false blocks.

---

### 3.3 Scenario E03: Core Banking Customer Cache Unreachable
- **Root Cause**: Network partition or crash of the central in-memory Redis cluster hosting customer historical baselines.
- **Trigger**: Cache lookup query fails to respond within $10\text{ms}$.
- **System Behavior**:
  - Query terminates; system falls back to a local, read-only replicated cache hosted directly on the scoring node.
  - If local replica is also unavailable, the engine evaluates the transaction using **transaction-intrinsic features** (amount, payee attributes, time-of-day, client telemetry) without historical baselines.
  - Epistemic uncertainty increases; decision proceeds without stalling the in-line clearance budget.

---

### 3.4 Scenario E04: High Risk Anomaly with Low Epistemic Confidence
- **Root Cause**: A benign customer executes their very first transaction on a newly opened account to pay a freelance contractor. The model detects a high anomaly score simply because no baseline history exists.
- **System Behavior**:
  - Uncertainty calculator flags $\sigma > 0.35$ (`REQ-DEC-002`).
  - System policy forbids executing a Level 4 Hold or high-friction block (`REQ-SAF-002`).
  - Action directive is automatically downgraded to **Level 2 (Inform)**, displaying an advisory banner: *"First-time transfer: Please verify the account number carefully before proceeding."*
  - Legitimate payment clears smoothly; customer insult is avoided.

---

### 3.5 Scenario E05: Client SDK UI Thread Exception or Crash
- **Root Cause**: Unhandled rendering bug or memory pressure inside the mobile banking app container.
- **System Behavior**:
  - The Guardian client SDK executes strictly within an isolated background worker thread (`REQ-RES-004`).
  - If the de-biasing dialog throws an uncaught exception, a global top-level try-catch block suppresses the error and immediately hands UI control back to the host application's primary navigation controller.
  - The host app renders the standard PIN entry pad; the user experiences zero app freeze or force-close crash.

---

### 3.6 Scenario E06: Idempotency & Duplicate Transaction Ingestion
- **Root Cause**: Flaky mobile network causing the client app to re-transmit the payment authorization request multiple times.
- **System Behavior**:
  - Every evaluation request carries a unique `idempotency_key` (hash of Sender + Payee + Amount + Client UUID + Session Nonce).
  - The gateway checks its in-flight deduplication cache.
  - If an identical key is evaluated within a 60-second sliding window, the engine bypasses inference and returns the previously generated decision envelope in $\le 2\text{ms}$.
  - Prevents double-scoring, duplicate de-biasing modals, and multiple outbound containment dispatches.

---

### 3.7 Scenario E07: Out-of-Band Beneficiary Bank Unreachable
- **Root Cause**: The receiving bank's fraud API gateway is down, timing out, or rejecting incoming HTTP connections.
- **System Behavior**:
  - The Mule Containment Dispatcher attempts delivery up to 3 times over a 15-second window.
  - Upon persistent delivery failure, the signed ISO 20022 `camt.056` advisory is routed to a persistent, replicated Kafka dead-letter queue (DLQ).
  - An automated alert notifies the sending bank's SOC desk to transmit the mule notification via the central clearing switch's secondary messaging channel.

---

### 3.8 Scenario E08: Coerced User Persists Through Level 3 Challenge
- **Root Cause**: A victim under intense psychological manipulation (System 1 tunnel vision) chooses to ignore warnings and completes the cognitive test to send funds.
- **System Behavior**:
  - The system respects consumer autonomy and does not indefinitely trap the user (`REQ-ERR-003`).
  - The client unlocks the PIN entry pad and permits the user to authorize the payment.
  - The system logs the explicit override and immediately dispatches an urgent streaming mule containment alert (`CAP-09`) to the recipient bank the instant settlement clears.

---

### 3.9 Scenario E09: Bank Staff / Teller Override of Flagged Transactions
- **Root Cause**: Scammer instructs victim to visit a physical bank branch or call phone support to demand the removal of a security hold.
- **System Behavior**:
  - Frontline staff interface requires entering an explicit business justification code and supervisor dual-authorization (`REQ-HITL-003`).
  - Single-user overrides are locked for transfers exceeding ₹25,000 / $500.
  - The system records employee ID, IP, workstation certificate, and supervisor token into the immutable WORM audit log (`REQ-OBS-003`).

---

### 3.10 Scenario E10: Emergency Life-Safety Payment Bypass
- **Root Cause**: Legitimate urgent transfer for emergency hospital admission or disaster relief is caught in a Level 4 Hold.
- **System Behavior**:
  - User taps the prominent "Emergency Medical / Utility Bypass" link (`REQ-SAF-001`).
  - System prompts user for a single-touch legal affirmation: *"I affirm this payment is for an urgent medical or humanitarian emergency."*
  - The hold is instantly released; payment routes to the switch for immediate debit.
  - Case is automatically routed to an expedited post-settlement SOC monitoring queue.

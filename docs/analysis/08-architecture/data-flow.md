# End-to-End Data Flows: Sequence Specifications across Four Epochs

## 1. Executive Summary & Lifecycle Sequencing

The data flows of the *Agentic Guardian* operate across four distinct chronological epochs in the payment lifecycle:
- **Epoch 1: Pre-Flight Drafting Window (30s to 120s)**
- **Epoch 2: In-Line Clearance Evaluation ($\le 45\text{ms}$)**
- **Epoch 3: Client Pre-PIN Cognitive Intercept (Variable User Time)**
- **Epoch 4: Post-Settlement Streaming Containment ($\le 60\text{s}$)**

This document specifies the exact sequence of network messages, data transformations, and state transitions across all four epochs.

---

## 2. Master Sequence Diagram

```text
User/App                Mobile SDK              Switch GW             Scoring Cluster          Redis Cache          Kafka Bus          Recip. Bank
   │                        │                       │                        │                      │                   │                   │
   │── 1. Enter Payee/Amt ─►│                       │                        │                      │                   │                   │
   │   (Typing & Hesitation)│                       │                        │                      │                   │                   │
   │                        │── 2. Pre-Warm Query ──┼────────────────────────┼─────────────────────►│                   │                   │
   │                        │◄─ 3. Cached Recip Risk┼────────────────────────┼──────────────────────│                   │                   │
   │                        │                       │                        │                      │                   │                   │
   │── 4. Tap "Proceed" ───►│                       │                        │                      │                   │                   │
   │                        │── 5. Attach Telemetry►│                        │                      │                   │                   │
   │                        │                       │── 6. gRPC Evaluate ───►│                      │                   │                   │
   │                        │                       │   (Start 45ms Clock)   │── 7. Get Baseline ──►│                   │                   │
   │                        │                       │                        │◄─ 8. Return Floats ──│                   │                   │
   │                        │                       │                        │── 9. GBDT + Conformal│                   │                   │
   │                        │                       │                        │   (12ms Inference)   │                   │                   │
   │                        │                       │                        │── 10. Route Policy ──│                   │                   │
   │                        │                       │◄─ 11. Return Directive─│   (Directive: L3)    │── 12. Publish ───►│                   │
   │                        │◄─ 13. Render Challenge│   (Elapsed: 38ms)      │                      │   Decision Event  │                   │
   │                        │                       │                        │                      │                   │                   │
   │◄─ 14. Display Modal ───│                       │                        │                      │                   │                   │
   │   (5s Cognitive Gate)  │                       │                        │                      │                   │                   │
   │── 15. Complete Q&A ───►│                       │                        │                      │                   │                   │
   │── 16. Enter PIN/Auth ─►│── 17. Submit PIN ────►│                        │                      │                   │                   │
   │                        │                       │── 18. Clear to Switch ─┼──────────────────────┼───────────────────┼──────────────────►│
   │                        │                       │   (Settlement Debit)   │                      │                   │   (Credit Ledger) │
   │                        │                       │                        │                      │                   │                   │
   │                        │                       │                        │                      │                   │◄── 19. Consume ───│
   │                        │                       │                        │                      │                   │   (Mule Dispatch) │
   │                        │                       │                        │                      │                   │                   │
   │                        │                       │                        │                      │                   │── 20. camt.056 ──►│
   │                        │                       │                        │                      │                   │   (Hold ≤60s)     │
```

---

## 3. Detailed Data Flow by Epoch

### 3.1 Epoch 1: Pre-Flight Drafting Data Flow (30s - 120s)
1. **User Interaction**: The consumer selects a payee and enters the transfer amount.
2. **SDK Telemetry Buffering**: The embedded mobile SDK (`CMP-01`) initializes an ephemeral circular buffer in volatile RAM, recording inter-keystroke intervals ($\Delta t$), touch surface area ($A$), and field focus timestamps.
3. **Communication Attestation**: The SDK queries local OS APIs: `TelecomManager.getCallState()` returns integer `2` (`CALL_STATE_OFFHOOK`), setting `is_voice_call_active: true`.
4. **Pre-Warming Fetch**: The SDK issues a non-blocking background HTTPS query to pre-fetch the recipient account's risk tier from the bank's edge cache into local RAM, eliminating cold network lookups during the later in-line stage.

### 3.2 Epoch 2: In-Line Clearance Evaluation Flow ($\le 45\text{ms}$)
5. **Authorization Submission**: User taps "Proceed to Pay". The client app combines the payment request with the encrypted telemetry payload and transmits it to the switch gateway.
6. **Synchronous Invocation**: The Switch Gateway (`CMP-02`) strips outer network headers and initiates a synchronous gRPC call to `ScoringEngine.EvaluateTransaction()` (`CMP-03`), starting the hard $45\text{ms}$ execution clock.
7. **In-Memory Assembly ($0-12\text{ms}$)**: `CMP-03` fetches the sender's 90-day relational profile and recipient GNN embeddings from Redis (`Tier 1`), compiling a normalized 128-float vector.
8. **Inference & Calibration ($12-28\text{ms}$)**: `CMP-04` executes the LightGBM ONNX model in C++, calculating risk score $R = 0.814$, typology = `DIGITAL_ARREST`, and conformal uncertainty $\sigma = 0.082$.
9. **Directive Formulation ($28-34\text{ms}$)**: `CMP-05` evaluates business policy rules. Because $R \ge 0.65$ and $\sigma \le 0.35$, it assigns `Directive: INTERVENE` and generates causal reason code `CODE-03` (Active Call + New Recipient).
10. **Asynchronous Publish & Egress ($34-38\text{ms}$)**: `CMP-05` dispatches the decision envelope to Kafka topic `transaction.decisions.v1` in a non-blocking background thread and returns the directive payload to the switch gateway. Total in-line elapsed time: $\mathbf{38.2\text{ms}}$.

### 3.3 Epoch 3: Pre-PIN Cognitive Intervention Flow
11. **PIN Pad Lockdown**: Receiving `Directive: INTERVENE`, the client SDK suppresses the standard OS PIN pad.
12. **Modal Rendering**: The SDK renders the Typology-Specific De-Biasing Modal (`FEAT-05`) containing the plain-language causal notice and the 5-second anti-habituation cognitive gate (`FEAT-06`).
13. **User Action**: The user reads the warning, selects the transaction reason, and affirms comprehension. Upon completion, the SDK unlocks the PIN pad.
14. **Credential Entry**: User enters PIN. The client app submits the cryptographically signed authorization packet to the core banking ledger for clearing.

### 3.4 Epoch 4: Post-Settlement Streaming Containment Flow ($\le 60\text{s}$)
15. **Debit Settlement Event**: Core banking confirms successful debit and emits a ledger settlement event to Kafka.
16. **Containment Consumption**: The Mule Alert Dispatcher (`CMP-07`) consumes the event, recognizes that the transaction carried a risk score $R = 0.814$, and constructs an ISO 20022 `camt.056` Payment Cancellation Request.
17. **Inter-Bank Transmission**: `CMP-07` signs the message with the bank's PKI certificate and transmits it to the beneficiary bank gateway over mTLS 1.3 within $42\text{ seconds}$ of settlement.
18. **Audit Sealing**: The WORM Logger (`CMP-08`) commits the decision record into an immutable SHA-256 block chain on WORM storage (`Tier 4`).

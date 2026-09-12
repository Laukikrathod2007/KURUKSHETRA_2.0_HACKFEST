# The Demonstrable MVP: Scope, Proofs, and Simulation Strategy

## 1. Executive Summary & Demonstration Objective

In advanced fintech and AI systems engineering, a demonstration prototype must avoid two fatal traps:
1. **The Fictional Toy**: A superficial mockup with hardcoded strings and fake buttons that proves nothing about real-time systems physics or algorithm validity.
2. **The Over-Engineered Monolith**: An attempt to replicate an entire national central switch, telecom carrier network, and retail banking core, collapsing under its own integration weight.

The **Agentic Guardian Demonstrable MVP** is an executable, vertically integrated software system engineered to prove six core empirical capabilities under realistic operational constraints.

---

## 2. The Six Core Proof Obligations

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE SIX CORE MVP PROOF OBLIGATIONS                             │
├────┬─────────────────────────────┬───────────────────────────────────────────────────────────────┤
│ #  │ Proof Dimension             │ Concrete Demonstration Mechanism                              │
├────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 1  │ Problem Realism             │ Replicates authentic social engineering attacks (Digital      │
│    │                             │ Arrest, Fake Investment) with active coaching and hesitation. │
│ 2  │ Detection Capability        │ Demonstrates sub-45ms multi-modal scoring and calibration     │
│    │                             │ separating benign transactions from coerced scam attempts.    │
│ 3  │ Intervention Placement      │ Proves that cognitive de-biasing interrupts the user journey  │
│    │                             │ strictly BEFORE the irreversible PIN entry pad is displayed.  │
│ 4  │ Causal Evidence & Audit     │ Emits plain-English consumer notices, SOC analyst synthesis   │
│    │                             │ packages, and cryptographically hashed WORM audit records.    │
│ 5  │ Safety & Fail-Open Limits   │ Injects network timeouts (>45ms) and life-safety bypasses to  │
│    │                             │ prove fail-open execution (≤5ms) and emergency clearance.     │
│ 6  │ Evaluated Outcome           │ Measures cognitive de-biasing success, false positive insult  │
│    │                             │ suppression (≤10:1), and out-of-band mule alert dispatch.     │
└────┴─────────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 3. Production Reality vs. Hackathon Prototype Boundary

To maintain scientific integrity, the MVP explicitly distinguishes what operates as **production-ready code** versus what is **simulated via mock test harnesses**:

```text
┌──────────────────────────────────┬──────────────────────────────────┬─────────────────────────────┐
│ Architectural Component          │ Production Implementation Target │ Hackathon Prototype Reality │
├──────────────────────────────────┼──────────────────────────────────┼─────────────────────────────┤
│ Client Telemetry SDK             │ Native Android / iOS AAR Module  │ Real Mobile Web / React SDK │
│ Touch Dynamics & Hesitation      │ Hardware Digitizer Interrupts    │ Real High-Precision Events  │
│ Telephony & Call Detection       │ Carrier API + OS Telephony Mgr   │ Active Browser / Mock State │
│ In-Line Inference Engine         │ Distributed C++ / Go gRPC Cluster│ Real FastAPI / ONNX Gateway │
│ ML Scoring Model                 │ LightGBM / GBDT Ensemble         │ Real Trained LightGBM Model │
│ Core Banking Switch Gateway      │ National ISO 20022 Clearing Node │ High-Fidelity Mock Switch   │
│ Beneficiary Bank Mule System     │ External Bank Core Ledger        │ Realistic Mock Beneficiary  │
│ WORM Audit Trail                 │ AWS S3 Object Lock / Dedicated   │ Real Append-Only Hash Chain │
└──────────────────────────────────┴──────────────────────────────────┴─────────────────────────────┘
```

---

## 4. End-to-End Demonstrable Scenarios

The MVP executes three fully testable end-to-end user scenarios:

### Scenario 1: The Coerced "Digital Arrest" Intercept
- **Setup**: Simulated victim enters ₹1,50,000 payment to a newly created VPA while receiving an active voice call. Client SDK records erratic typing cadence and clipboard paste.
- **System Execution**:
  1. User taps "Proceed". Risk engine scores transaction in $32\text{ms}$: $R = 0.82$, Typology = `DIGITAL_ARREST`.
  2. The PIN pad is suppressed. The **Typology-Specific De-Biasing Modal** appears (`FEAT-05`).
  3. Modal warns: *"Police and CBI never demand payments over video calls or safe accounts."*
  4. User taps "Cancel & Protect Funds".
  5. Transaction is aborted; account enters 48-Hour Protective State; zero funds lost.

### Scenario 2: The High-Value Legitimate Transfer (Insult Suppression)
- **Setup**: Benign customer pays ₹85,000 for a used vehicle to an unlisted contact. No active call, fluid typing dynamics.
- **System Execution**:
  1. Risk engine scores transaction in $24\text{ms}$: $R = 0.42$, Epistemic Uncertainty $\sigma = 0.38$.
  2. High uncertainty triggers automated policy downgrade to **Level 2 (Inform)** (`FEAT-04`).
  3. Ambient informational banner renders: *"New Payee: Please verify details before confirming."*
  4. User immediately enters PIN; payment clears with zero blocking; customer insult avoided.

### Scenario 3: Network Latency Injection & Deterministic Fail-Open
- **Setup**: Chaos test harness introduces artificial $80\text{ms}$ delay in feature assembly pipeline.
- **System Execution**:
  1. Circuit breaker timer reaches $45\text{ms}$.
  2. Gateway trips fail-open in $3.2\text{ms}$, returning `Directive: Allow` with `ReasonCode: TIMEOUT_FAILOPEN` (`FEAT-09`).
  3. Payment clears seamlessly; payment switch SLA is protected.

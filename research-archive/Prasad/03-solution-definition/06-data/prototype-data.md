# Prototype Data Strategy: Simulation Rationale, Scenarios, and Integrity Boundaries

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **What Participants Should Build & Expected Demo (`PROBLEM_STATEMENT.md`)**:
- *• Develop a working software prototype that implements the objective above and demonstrates the required end-to-end workflow.*
- *• Create several simulated payment scenarios: a normal payment, a new/unverified recipient, a suspicious payment request, and a high-risk transaction requiring intervention.*

In academic and hackathon evaluation, pretending that a prototype has live access to real banking mainframes or confidential police databases instantly destroys credibility. 

This document defines the **Prototype Data Strategy**, explicitly detailing what is simulated, why simulation is scientifically necessary, how simulated scenarios reflect production banking systems, and what the prototype conclusively proves.

---

## 2. The Mandatory Simulation Transparency Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        SIMULATION TRANSPARENCY SPECIFICATION                              │
├─────────────────────┬───────────────────────────────┬─────────────────────────────────────┤
│ SUBSYSTEM           │ HACKATHON PROTOTYPE SIMULATION│ PRODUCTION ENTERPRISE SYSTEM        │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **1. Recipient      │ In-memory SQLite mock table   │ Real-time NPCI `ReqValAdd` switch   │
│   Resolution**      │ returning verified CBS names  │ API routing to 400+ bank CBS servers│
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **2. Background     │ Native Android Telephony API  │ Native OEM-hardened Android SDK     │
│   Call State**      │ on physical test device       │ with background power management    │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **3. I4C Mule       │ Redis cache pre-loaded with   │ Real-time streaming API sync with   │
│   Blacklist**       │ 5,000 synthetic mule hashes   │ MHA / I4C National Cybercrime Portal│
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **4. User Spending  │ Pre-seeded Redis user profile │ Enterprise Feature Store (Feast /   │
│   Baselines**       │ with 90-day spending history  │ Aerospike) updated via Kafka stream │
└─────────────────────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. The Four Core Simulated Demo Scenarios (Per `PROBLEM_STATEMENT.md`)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE FOUR MANDATORY DEMO SCENARIOS                               │
├─────────────────────┬───────────────────┬──────────────┬──────────────┬───────────────────┤
│ SCENARIO NAME       │ INPUT PARAMETERS  │ SENSOR STATE │ EXPECTED RISK│ EXPECTED OUTCOME  │
├─────────────────────┼───────────────────┼──────────────┼──────────────┼───────────────────┤
│ **1. Normal         │ Amount: ₹150      │ Call: FALSE  │ $P = 0.002$  │ **TIER 0 PASS:**  │
│    Payment**        │ Payee: `grocer@`  │ Dwell: 1.8s  │ Low Risk     │ Immediate MPIN pad│
│                     │ Ingress: QR Scan  │ Paste: FALSE │              │ Zero added latency│
├─────────────────────┼───────────────────┼──────────────┼──────────────┼───────────────────┤
│ **2. New / Unveri-  │ Amount: ₹3,500    │ Call: FALSE  │ $P = 0.280$  │ **TIER 1 ADVISORY │
│    fied Recipient** │ Payee: `rohit@ybl`│ Dwell: 3.2s  │ Medium Risk  │ BANNER:** High-   │
│                     │ First-time payee  │ Paste: FALSE │              │ contrast KYC card │
├─────────────────────┼───────────────────┼──────────────┼──────────────┼───────────────────┤
│ **3. Suspicious Pay-│ Amount: ₹24,500   │ Call: FALSE  │ $P = 0.720$  │ **TIER 2 COGNITIVE│
│    ment Request**   │ Note: "Power Bill"│ Dwell: 6.4s  │ High Risk    │ CHALLENGE:** Force│
│                     │ CBS: Suresh Patel │ Paste: TRUE  │ (Clash=0.98) │ typing Suresh Patel
├─────────────────────┼───────────────────┼──────────────┼──────────────┼───────────────────┤
│ **4. High-Risk Extor│ Amount: ₹1,25,000 │ **Call: TRUE │ **$P = 0.94$ │ **TIER 3 CALL     │
│    tion Scam**      │ Note: "CBI bond"  │ Dwell: 19.4s │ Critical     │ INTERLOCK:** Locks│
│ (Digital Arrest)    │ CBS: Raju Paswan  │ Paste: TRUE  │ (Coercion)   │ until call hangup │
└─────────────────────┴───────────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## 4. Pre-Seeded Prototype Datasets and Mock Registries

The prototype includes pre-packaged test data assets:
1. **`mock_cbs_recipients.json`:** 50 pre-configured Virtual Payment Addresses mapping to synthetic Core Banking KYC names, IFSC branches, and MCC codes (representing genuine utilities, hospitals, groceries, and known mule accounts).
2. **`mock_user_profiles.json`:** Historical 90-day transaction logs for 10 simulated user archetypes (Student, Daily Wage Worker, Corporate Executive, Pensioner) to establish realistic baselines ($\mu, \sigma$).
3. **`mock_i4c_blacklist.txt`:** 5,000 SHA-256 hashes of reported mule VPAs loaded into the local Redis cache.

---

## 5. What the Prototype Proves vs. What It Does NOT Prove

```
  ┌────────────────────────────────────────────────────────┐
  │ WHAT THE PROTOTYPE CONCLUSIVELY PROVES:                │
  │ • The multi-signal fusion pipeline functions end-to-end│
  │ • The hot path executes within the sub-15ms budget.    │
  │ • The Entity-Purpose Semantic Clash exposes deception. │
  │ • Dynamic cognitive friction physically breaks System 1│
  │   compliance before the MPIN screen is invoked.        │
  └────────────────────────────────────────────────────────┘
                             VS
  ┌────────────────────────────────────────────────────────┐
  │ WHAT THE PROTOTYPE DOES NOT PROVE:                     │
  │ • Real-world human psychological panic conversion rates│
  │   under physical extortion.                            │
  │ • Actual inter-bank network latency over physical NPCI │
  │   leased lines under national congestion.              │
  └────────────────────────────────────────────────────────┘
```

---

## 6. Epistemic Assessment for PS09

The Prototype Data Strategy strictly fulfills the **"What Participants Should Build" and "Expected Demo" mandates of `PROBLEM_STATEMENT.md`**. It provides a reproducible, scientifically honest demonstration harness that judges can run and verify in real time.

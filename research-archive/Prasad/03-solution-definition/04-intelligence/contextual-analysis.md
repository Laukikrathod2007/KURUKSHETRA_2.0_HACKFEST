# Contextual Analysis: Semantic Inconsistency, Ingress Profiling, and Narrative Synthesis

---

## 1. Executive Understanding & Alignment with Problem Statement

Under the **Challenge and Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Digital payment scams involve impersonation, unusual recipients, urgency-based social engineering, or fraudulent transaction patterns.*
- *• Core Requirement: Recipient verification workflow.*
- *• Core Requirement: Explainable security alerts.*

Conventional fraud engines analyze transactions in a vacuum: evaluating isolated numbers (₹45,000) against static velocity rules. In contrast, **Contextual Analysis evaluates the payment within the complete operational narrative that induced it**.

By cross-referencing **the Ingress Channel, the Stated Transaction Purpose, the Active Communication State, and the Resolved CBS Legal Identity**, GuardianPay exposes deceptive intent even when individual parameters appear routine.

---

## 2. The Four Pillars of Contextual Telemetry

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE FOUR CONTEXTUAL TELEMETRY PILLARS                           │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ CONTEXTUAL PILLAR   │ TELEMETRY ASSETS COLLECTED      │ SCAM EXPOSURE MECHANISM           │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **1. Ingress Origin │ • Physical Camera Scanned QR    │ • Distinguishes legitimate street │
│    Profiling**      │ • External App Deep Link (URI)  │   merchant QRs from phishing links│
│                     │ • Immediate Clipboard VPA Paste │   or out-of-band chat directions  │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **2. Linguistic &   │ • Payment Note text (`tn`)      │ • Exposes manufactured urgency,   │
│    Intent Context** │ • Scanned invoice / bill text   │   extortion threats, and Ponzi    │
│                     │ • Payee Display Name (`pn`)     │   task recruitment narratives     │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **3. Recipient KYC  │ • Core Banking Legal KYC Name   │ • The unforgeable ground truth:   │
│    Identity**       │ • Merchant Category Code (MCC)  │   exposes institutional           │
│                     │ • P2P Personal vs P2M Merchant  │   impersonation via RespValAdd    │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **4. Behavioral     │ • Active phone call boolean     │ • Captures the physical signature │
│    Concurrency**    │ • Pre-PIN screen dwell time     │   of active remote verbal coaching│
│                     │ • Touch keystroke flight rhythm │   and psychological panic         │
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. The Triangular Semantic Inconsistency Check

The cornerstone of GuardianPay's contextual analysis is the **Triangular Consistency Model**, which links three observable facts:

```
                       THE TRIANGULAR CONSISTENCY MODEL
                            [Stated Purpose: "tn"]
                          "Electricity Bill Update"
                                     ▲
                                    ╱ ╲
        Purpose-Payee Clash        ╱   ╲  Amount / Purpose Fit
       (Electricity Board         ╱     ╲ (Normal Bill vs
        is NOT an Individual)    ╱       ╲ Outlier Extortion)
                                ▼         ▼
    [Resolved CBS Legal Entity] ──────────► [Transaction Magnitude]
     "Mukesh Ramesh Patel (P2P)"                  ₹24,500
```

### The Analytical Workflow
1. **Input Extraction:** 
   - Stated Purpose = `"Electricity Bill Update"` (from `tn` parameter).
   - Resolved CBS Legal Payee = `"Mukesh Ramesh Patel"`, MCC = `0000` (Individual P2P Account).
   - Amount = ₹24,500.
2. **Category Mapping:**
   - Stated Entity Class = `MUNICIPAL_UTILITY_PROVIDER` (Power Grid).
   - Actual Account Entity Class = `PRIVATE_INDIVIDUAL_SAVINGS`.
3. **Clash Scoring:**
   - Because genuine electricity boards in India exclusively receive payments through accredited Merchant aggregators (MCC 4900 - Utilities), routing an "Electricity Bill" to an individual P2P account represents an **impossible real-world event**.
   - `clash_score = 0.98` (Extreme Impersonation Certainty).
4. **Synthesis Output:**
   - Directly triggers **Tier 2 Cognitive Challenge**, generating an explainable alert:
     > *"You indicated you are paying an Electricity Bill. However, this bank account legally belongs to an individual: **Mukesh Ramesh Patel**. Electricity boards never use personal savings accounts."*

---

## 4. Ingress Channel Provenance Profiling

The channel through which the transaction entered the application establishes strong prior probabilities:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      INGRESS PROVENANCE RISK CALIBRATION                                  │
├─────────────────────┬──────────────┬──────────────┬───────────────────────────────────────┤
│ INGRESS CHANNEL     │ BASE PRIOR   │ RISK STATUS  │ OPERATIONAL INTERPRETATION            │
├─────────────────────┼──────────────┼──────────────┼───────────────────────────────────────┤
│ **Physical Merchant │ $P = 0.001$  │ Highly Safe  │ In-person retail checkout (groceries, │
│   Camera Scan**     │              │              │ fuel, restaurant); safe baseline.     │
├─────────────────────┼──────────────┼──────────────┼───────────────────────────────────────┤
│ **Direct In-App     │ $P = 0.005$  │ Safe         │ Established peer-to-peer relationship │
│   Contact Select**  │              │              │ with historical transaction ledger.   │
├─────────────────────┼──────────────┼──────────────┼───────────────────────────────────────┤
│ **Clipboard VPA     │ $P = 0.120$  │ Elevated     │ Payee copied from external chat or    │
│   Fast Paste**      │              │ Prior        │ SMS; indicates out-of-band coaching.  │
├─────────────────────┼──────────────┼──────────────┼───────────────────────────────────────┤
│ **Deep-Link URI     │ $P = 0.180$  │ High Prior   │ Payment launched via link clicked in  │
│   From Chat App**   │              │              │ WhatsApp / Telegram / Browser.        │
└─────────────────────┴──────────────┴──────────────┴───────────────────────────────────────┘
```

---

## 5. Adversarial Blank-Note Defense

When scammers instruct victims: *"Leave the payment note completely empty so the bank doesn't flag it"*:
- A naive text classifier returns nothing.
- **The Contextual Conjunction Rule:** The engine evaluates the **absence of expected context**:
  $$\text{Risk}(\text{Blank Note}) \propto \text{Amount} \times \text{IsFirstTimePayee} \times \text{IsCallActive}$$
- If a transfer is $> ₹25,000$ to an unlinked personal account with a blank note while an active phone call is running, the **conjunction of missing context + high ticket size + active call** substitutes for the missing text, driving the risk score into Tier 2 / Tier 3.

---

## 6. Epistemic Assessment for PS09

Contextual analysis directly fulfills the problem statement's mandate to intercept **impersonation and urgency-based social engineering**. It converts raw data into **unforgeable evidentiary relationships** that power explainable security alerts.

# Information Availability by Time: The Temporal Matrix of Transaction Signals

---

## 1. Executive Understanding (Layer 1)
In distributed real-time systems, information is not static; it manifests along a strict temporal progression. The central challenge of **Real-Time Scam Interception** is that **the most reliable fraud evidence manifests AFTER the transaction completes, while the decision to stop the transaction must be made BEFORE it completes**.

Post-transaction signals—such as the recipient account immediately moving funds into three secondary accounts within 45 seconds, or 10 other victims reporting the same VPA to the 1930 cybercrime helpline—provide near 100% certainty of a scam. However, once the payment has completed, this certainty is useless for prevention. 

A production-grade guardian must operate exclusively on the **sub-set of information available during the narrow pre-authorization window**, learning to make high-stakes protective decisions under partial, imperfect, and emerging information.

---

## 2. The Master Temporal Information Availability Matrix (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INFORMATION AVAILABILITY BY TEMPORAL STAGE               │
├─────────────────────────────────────┬───────────┬───────────┬───────────────┤
│ Information Attribute               │ Before    │ During    │ After         │
│                                     │ Payment   │ (Pre-PIN) │ (Post-Settled)│
├─────────────────────────────────────┼───────────┼───────────┼───────────────┤
│ Payer Historical Baseline Profile   │ AVAILABLE │ AVAILABLE │ AVAILABLE     │
│ Client Hardware & OS Integrity      │ AVAILABLE │ AVAILABLE │ AVAILABLE     │
│ Contact Book Social Graph           │ AVAILABLE │ AVAILABLE │ AVAILABLE     │
│ Payment Intent Amount & Note (`tn`) │ NONE      │ AVAILABLE │ AVAILABLE     │
│ Destination VPA & Handle Domain     │ NONE      │ AVAILABLE │ AVAILABLE     │
│ Bank-Verified Payee Legal Name      │ NONE      │ AVAILABLE │ AVAILABLE     │
│ Interaction Dwell Time on Screen    │ NONE      │ AVAILABLE │ AVAILABLE     │
│ Recipient Inward Cash-Out Velocity  │ NONE      │ NONE      │ AVAILABLE     │
│ Victim Cybercrime FIR / 1930 Report │ NONE      │ NONE      │ AVAILABLE     │
│ Central Bank Net Settlement State   │ NONE      │ NONE      │ AVAILABLE     │
└─────────────────────────────────────┴───────────┴───────────┴───────────────┘
```

---

## 3. Deep Temporal Attribute Matrix & Limitations (Layer 3)

| Information Attribute | Before Payment | During Payment (Pre-PIN) | After Payment | Potential Source | Confidence & Engineering Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Payer Profile Baseline** | **YES** | **YES** | **YES** | Local App Storage / TPAP Profile DB | **High Confidence:** Historical average ticket size, frequent payees, and typical transaction hours. |
| **Destination VPA (`pa`)** | NO | **YES** | **YES** | Input URI / QR Code / User Entry | **High Confidence:** Raw string target. Can be evaluated for syntax and domain handle. |
| **Transaction Note (`tn`)** | NO | **YES** | **YES** | Input URI / User Remarks Field | **Medium Confidence:** Untrusted user input. Highly informative if keywords present; useless if blank. |
| **Bank Registered Name** | NO | **YES** | **YES** | Beneficiary Bank via `ReqValAdd` | **High Confidence:** Official KYC legal name. Essential for detecting impersonation. |
| **Recipient Age / Creation Date**| NO | **PARTIAL** | **YES** | NPCI Central Mapper / PSP Telemetry | **Medium Confidence:** Third-party apps rarely have direct access to exact VPA creation timestamps. |
| **Screen Dwell Time & Hesitation**| NO | **YES** | **YES** | In-App Gesture Event Listeners | **High Confidence:** Measures millisecond dwell time on confirmation screen. High latency indicates confusion. |
| **Active Telephony Call Status** | **YES** | **YES** | **YES** | Android `TelecomManager` API | **Medium Confidence:** Indicates user is on a phone call while paying. High correlation with vishing scams. |
| **National Blacklist Status** | NO | **YES** | **YES** | Police 1930 / I4C CFCFRMS Database | **High Confidence if Present:** But zero records on brand-new "virgin" mule accounts (Label Lag). |
| **Mule Outward Dispersal Pattern**| NO | NO | **YES** | Beneficiary Bank CBS Ledger | **Useless for Pre-PIN Interception:** Manifests 30–120 seconds after funds are credited. |
| **Victim Fraud Complaint / FIR** | NO | NO | **YES** | 1930 Portal / Police FIR | **Useless for Real-Time:** Takes hours to days for victim to realize and report. |

---

## 4. Boundaries & Epistemic Realities for PS09 (Layer 4)

### 4.1 The Pre-PIN Decision Envelope
* The only column that can prevent financial loss is **"During Payment (Pre-PIN)"**.
* **The Engineering Takeaway:** All agentic tool calls, recipient lookups, linguistic analysis of notes, and risk evaluations must be **fully executable within the Pre-PIN dwell window ($1.5\text{s} - 4.0\text{s}$)**.
* Relying on post-transaction graph clustering or downstream fund tracking—while valuable for law enforcement forensics—is fundamentally out of scope for **Real-Time Payment Scam Interception**.

---
**Primary References:**
1. National Payments Corporation of India: *UPI Message Specification: Data Fields Available at Pre-Auth Stage*.
2. Federal Reserve Bank of Boston: *Real-Time Data Availability and Risk Scoring in Fast Payment Systems*.
3. ACM Transactions on Management Information Systems: *Temporal Dynamics of Financial Cyber Fraud Detection*.

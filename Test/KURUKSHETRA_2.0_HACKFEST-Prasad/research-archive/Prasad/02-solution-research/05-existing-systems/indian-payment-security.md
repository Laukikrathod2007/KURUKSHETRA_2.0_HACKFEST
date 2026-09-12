# Indian Payment Security: NPCI Infrastructure, RBI Regulatory Mandates, and I4C Integration

---

## 1. Executive Understanding
India's digital payment ecosystem is an engineering marvel, processing over 15 billion UPI transactions monthly with sub-two-second settlement. However, the ecosystem was architected primarily for **frictionless throughput and real-time irrevocability**, making it an exceptionally fertile substrate for Authorized Push Payment (APP) scams.

Security governance in India is distributed across three institutional tiers:
1. **The Reserve Bank of India (RBI):** Statutory regulator establishing prudential security directions, liability frameworks, and authentication mandates.
2. **National Payments Corporation of India (NPCI):** Umbrella utility managing the UPI switch, API specifications (`ReqPay`, `RespValAdd`), and central fraud intelligence (CFMS).
3. **Ministry of Home Affairs / I4C:** Law enforcement infrastructure operating the National Cybercrime Reporting Portal (NCRP) and the 1930 emergency freeze network.

Understanding how these entities operate—and where their jurisdictional and technical boundaries lie—is essential for grounding **PS09** in regulatory and operational reality.

---

## 2. Institutional Architecture of Payment Security in India

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        INDIAN PAYMENT SECURITY GOVERNANCE                                 │
├─────────────────────┬─────────────────────────────────────┬───────────────────────────────┤
│ ENTITY              │ CORE TECHNICAL RESPONSIBILITY       │ PRIMARY LIMITATION            │
├─────────────────────┼─────────────────────────────────────┼───────────────────────────────┤
│ **RBI**             │ • Master Directions on Digital      │ • Liability circulars place   │
│ (Regulator)         │   Payment Security Controls         │   100% loss on victim if MPIN │
│                     │ • Mandates 2FA & SIM-binding        │   was entered willingly       │
├─────────────────────┼─────────────────────────────────────┼───────────────────────────────┤
│ **NPCI**            │ • Central Fraud Management System   │ • Switch sees transaction     │
│ (Network Switch)    │   (CFMS) transaction risk scoring   │   metadata, but zero client UI│
│                     │ • `ReqValAdd` KYC name resolution   │   or behavioral sensor data   │
├─────────────────────┼─────────────────────────────────────┼───────────────────────────────┤
│ **I4C / 1930**      │ • Citizen Financial Cyber Fraud     │ • **Strictly post-facto:**   │
│ (Law Enforcement)   │   Reporting System (CFCFRMS)        │   Lien placed hours/days after│
│                     │ • Automated inter-bank freeze APIs  │   funds have been laundered   │
├─────────────────────┼─────────────────────────────────────┼───────────────────────────────┤
│ **Banks (CBS)**     │ • Account ledger debit/credit       │ • Legacy mainframes incapable │
│ (Remitter / Ben.)   │ • Core KYC identity maintenance     │   of sub-50ms contextual AI   │
├─────────────────────┼─────────────────────────────────────┼───────────────────────────────┤
│ **TPAP Apps**       │ • User interaction UI/UX           │ • Sandboxed; no visibility    │
│ (PhonePe, GPay)     │ • On-device telemetry & pre-PIN UI │   into beneficiary CBS history│
└─────────────────────┴─────────────────────────────────────┴───────────────────────────────┘
```

---

## 3. Deep Analysis of Existing Defenses

### 1. The NPCI Central Fraud Management System (CFMS)
NPCI operates CFMS at the switch layer, evaluating transactions in-flight:
- **Signals Used:** Velocity across banks, historical dispute flags on VPAs, abnormal ticket size spikes at the network level.
- **Intervention:** Returns a risk score to the remitter bank's UPI switch; can decline transactions with error codes like `U16 - Risk Threshold Exceeded`.
- **Limitation:** CFMS has zero visibility into the user's screen, background calls, or psychological state. It cannot detect that a user authorizing a ₹25,000 transfer is sitting in fear under a fake police "Digital Arrest".

### 2. The Citizen Financial Cyber Fraud Management System (CFCFRMS / 1930)
Operated by the Indian Cyber Crime Coordination Centre (I4C) under the Ministry of Home Affairs:
- **Operational Workflow:** Victim calls helpline **1930** $\to$ Police operator logs transaction ID and beneficiary VPA $\to$ CFCFRMS broadcasts automated API lien requests to the beneficiary bank $\to$ Beneficiary bank freezes account balance.
- **The Temporal Failure Horizon:** In practice, organized fraud syndicates extract or layer funds into crypto/ATM withdrawals within **2 to 5 minutes** of credit. The average victim contacts 1930 **after 45 to 180 minutes**. By the time the CFCFRMS freeze API executes, the mule account balance is zero.

```
                     THE TEMPORAL DISCONNECT IN 1930 FREEZES
  Minute 0          Minute 2          Minute 5                 Minute 90
─────┼─────────────────┼─────────────────┼────────────────────────┼─────────────►
   Victim            Mule Receives     Funds Layered /          Victim Calls 1930;
   Sends Money       ₹50,000           Withdrawn at ATM         CFCFRMS Freezes Empty Mule
   (IRREVERSIBLE)    (Balance: ₹50K)   (Balance: ₹0)            (RECOVERY = ₹0.00)
```

### 3. The RBI Regulatory Liability Asymmetry
Under **RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 (Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions)**:
- If an unauthorized transaction occurs due to bank negligence or third-party breach without customer fault, the customer has **Zero Liability**.
- **The APP Scam Carve-Out:** However, if the transaction occurs where the customer willingly authorized the payment or shared credentials:
  > *"In cases where the loss is due to negligence by the customer, such as where he has shared the payment credentials, the customer will bear the entire loss until he reports the unauthorised transaction to the bank."*
- **Consequence:** Victims of Authorized Push Payment scams bear **100% of the financial loss**. Banks have historically lacked direct financial incentive to aggressively intercept APP scams because the loss does not sit on their balance sheets.

---

## 4. Current Commercial TPAP Security Implementations (PhonePe, Google Pay, Paytm)

Leading TPAP applications implement localized defenses:
1. **SafetyNet & Play Integrity:** Verifies device bootloader integrity; blocks execution on rooted devices or virtual environments.
2. **Screen-Sharing Detection:** Apps query `ActivityManager` and package managers to detect active screen-recording or known remote access APKs (AnyDesk, TeamViewer, RustDesk), terminating the app or blanking the payment screen (`FLAG_SECURE`).
3. **Passive High-Risk Banners:** When a user enters an unverified VPA or a VPA reported by other users, apps render a yellow or red warning banner:
   > *"Payee is not in your contacts. Ensure you know this person."*
   - **The Habituation Failure:** Because these banners appear on millions of completely legitimate first-time payments (paying a street vendor or auto driver), users develop **Alert Fatigue (Habituation)** and dismiss them reflexively.

---

## 5. Epistemic Assessment for PS09

| Dimension | Indian System Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Interception Point** | Post-facto reporting (1930) is too slow; the money vanishes in minutes. | The Guardian must intercept **before the MPIN is submitted (Pre-Commit Window)**. |
| **Information Silos** | NPCI switch and banks will not share proprietary internal scores with a client app. | Guardian must rely primarily on **client-observable telemetry** and **publicly accessible APIs (`RespValAdd`)**. |
| **Regulatory Alignment** | RBI's push for "Digital India Trust" and cooling-off periods supports cognitive friction. | Guardian's interventions must align with RBI mandates for customer-consented step-up authentication. |

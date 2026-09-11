# Payment Ecosystem Actors: Responsibilities, Information Boundaries, and Control Capabilities

---

## 1. Executive Understanding (Layer 1)
In digital payment networks, no single entity possesses complete end-to-end visibility of a transaction. A payment involves an intricate web of specialized actors: consumers, technology aggregators, licensed commercial banks, central clearing houses, regulatory bodies, and law enforcement agencies. 

Security and scam interception fail in the real world primarily because of **asymmetric information and fragmented control**:
* The entity with the best view of user behavior and social communication context (the mobile OS / messaging app) has zero visibility into banking ledgers.
* The entity that controls the front-end user experience (the TPAP) does not hold the user's money or know the recipient's true risk history across other banks.
* The entity that holds the money (the Remitter Bank) sees only raw financial routing messages stripped of all conversational context.
* The central switch (NPCI) has multi-bank telemetry, but operates under strict sub-second performance constraints that preclude human-in-the-loop deliberation.

---

## 2. Actor Responsibility & Capability Matrix (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INFORMATION & CONTROL BOUNDARIES BY ACTOR                │
├───────────────────┬───────────────────────────────┬─────────────────────────┤
│ Actor             │ Information Possessed         │ Direct Controls & Limits│
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **User (Payer)**  │ • Subjective payment intent   │ • Enters secret PIN     │
│                   │ • Social/verbal context       │ • Can cancel in app     │
│                   │ • Sees confirmation screen    │ ✖ Blind to mule records │
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **TPAP**          │ • Client device fingerprint   │ • Renders warning UI    │
│ (Google Pay,      │ • Payment note & amount       │ • Can abort pre-PIN app │
│  PhonePe)         │ • Contact list & app history  │ ✖ Cannot view bank ledger│
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **PSP Bank**      │ • VPA-to-Account mappings     │ • Cryptographic signing │
│ (Axis, HDFC,      │ • API traffic velocity        │ • API rate limiting     │
│  Yes Bank)        │ • Inbound/outbound batch rate │ ✖ No UI interaction     │
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **NPCI Switch**   │ • Cross-bank transaction graph│ • Global risk rules     │
│                   │ • Systemic velocity per VPA   │ • Can decline switch msg│
│                   │ • Device ID blacklist         │ ✖ No access to user chat│
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **Remitter Bank** │ • Payer account balance & KYC │ • Validates MPIN in HSM │
│ (CBS & HSM)       │ • Historical debit patterns   │ • Can reject debit      │
│                   │ • Remitter internal risk score│ ✖ No view of payee KYC  │
├───────────────────┼───────────────────────────────┼─────────────────────────┤
│ **Beneficiary**   │ • Recipient account KYC & age │ • Can block credit      │
│ **Bank**          │ • Inward credit velocity      │ • Freezes account on 91 │
│                   │ • Account status (active/dorm)│ ✖ No view of remitter   │
└───────────────────┴───────────────────────────────┴─────────────────────────┘
```

---

## 3. Deep Operational Profiles (Layer 3)

### 3.1 The Consumer (Payer / Victim)
* **Role:** Originator of the payment intent and custodian of the authentication secret (MPIN).
* **Information Horizon:** Knows why they want to send money (e.g., "Paying electricity bill to avoid power cut at 6 PM"), but cannot verify whether the recipient VPA `billdesk.utility@ybl` belongs to the state electricity company or an extortionist in Bharatpur.
* **Psychological Vulnerability:** Subject to cognitive tunneling, authority bias, and urgency panic. When told by an impersonator that an app warning is a "technical bug," the user readily bypasses standard confirmation dialogs.

### 3.2 The Third-Party Application Provider (TPAP)
* **Role:** Front-end client software publisher (Google Pay, PhonePe, Paytm, CRED).
* **Technical Controls:**
  * Validates basic input formats (VPA regex, amount limits).
  * Implements on-device anomaly heuristics (e.g., flagging a first-time high-value transfer).
  * Displays the confirmation screen and invokes the encrypted NPCI Common Library (CL) for MPIN entry.
* **Boundaries:** Forbidden by NPCI from inspecting or storing the raw MPIN. Lacks authority to freeze user bank accounts.

### 3.3 The Remitter Bank (Issuing Institution)
* **Role:** Safeguards the customer's deposits and hosts the Core Banking System (CBS) (e.g., Finacle, BaNCS).
* **Technical Controls:**
  * Authenticates the encrypted MPIN block using a tamper-resistant Hardware Security Module (HSM).
  * Executes the debit entry on the customer's savings ledger:
    $$\text{Balance}_{\text{new}} = \text{Balance}_{\text{current}} - \text{Amount}$$
  * Executes bank-level Fraud Risk Management (FRM) rules (e.g., blocking debit if account was dormant or if total daily limit exceeded).
* **Blind Spot:** Cannot determine whether the user is sending money to a scammer or a genuine contractor because the user's secret PIN was entered correctly.

### 3.4 The Beneficiary Bank (Acquiring Institution)
* **Role:** Holds the recipient's account where scam proceeds land.
* **Crucial Vulnerability:** Beneficiary banks in India vary widely in KYC rigor. While Tier-1 private banks have sophisticated onboarding, regional rural banks (RRBs), co-operative banks, and neo-banking partner accounts frequently suffer from lax offline verification, allowing scam syndicates to open **mule accounts** en masse using forged or rented identity documents.

### 3.5 Law Enforcement & Cybercrime Ecosystem (I4C / 1930 / CFCFRMS)
* **Role:** Post-incident cybercrime investigation and inter-bank freezing.
* **Mechanism:** When a victim calls the **1930 National Cybercrime Helpline**, police operators log the transaction UTR into the **Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)**. An automated API alert is dispatched to the beneficiary bank to freeze the recipient account before funds are withdrawn.
* **The Reality Gap:** Scammers move funds through 3 to 5 layers of mule accounts within **180 seconds** of receipt. By the time a victim calls 1930 (usually 1–2 hours later), the money has already been converted into cash at an ATM or converted into cryptocurrency on a peer-to-peer exchange.

---

## 4. Boundaries & Misconceptions (Layer 4)

### 4.1 The Myth of Institutional Omniscience
* **Misconception:** *"The bank knows all my contacts, so it should know I've never paid this person before."*
  * *Correction:* In UPI's multi-tier architecture, banks do not have access to the user's mobile device address book. Only the TPAP has contact book permissions. The bank's database contains only historical financial transaction logs, not social relationships.
* **Misconception:** *"NPCI should immediately block any account that gets reported for fraud."*
  * *Correction:* Unilateral blocking without due process exposes payment networks to catastrophic legal liability (tortious interference and breach of contract) if a legitimate business is falsely frozen. Consequently, institutional freezing requires formal police reports (Section 91 CrPC) or verified multi-bank fraud complaints.

---
**Primary References:**
1. National Payments Corporation of India: *Roles and Responsibilities of UPI Ecosystem Entities (Circular NPCI/2021-22/012)*.
2. Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs: *Standard Operating Procedures for CFCFRMS Portal*.
3. Reserve Bank of India: *Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions (DBR.No.Leg.BC.78/09.07.005/2017-18)*.

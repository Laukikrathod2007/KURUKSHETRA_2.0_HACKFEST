# Forensic Case Studies: Detailed Attack Walkthroughs, Signals, and Interception Points

---

## 1. Case Study 1: The "Digital Arrest" Multi-Tranche Extortion
* **Location:** Bengaluru, Karnataka (Documented Cyber Crime Police FIR, 2023).
* **Victim:** 68-year-old retired PSU Chief Engineer.
* **Total Loss:** ₹1.45 Crore transferred across 8 tranches over 72 hours.
* **Threat Classification:** High-Value Authority & Coercion Scam (Tier 3 Cartel).

### Attack Walkthrough & Mechanical Progression
```
[Day 1, 10:30 AM]: Automated IVR Call: "FedEx Mumbai. Parcel containing 14 fake passports seized."
       │
       ▼
[Day 1, 11:15 AM]: Transferred to fake "CBI Officer" on Skype video in realistic police set.
       │ Fake Supreme Court Arrest Warrant presented via WhatsApp PDF.
       ▼
[Day 1 - Day 3]: Continuous 72-hour video surveillance ("Digital Arrest"). Victim isolated in room.
       │ Coercion: "Transfer all FDs to Secret RBI Escrow Account for audit or face immediate jail."
       ▼
[Day 1, 3:00 PM]: Tranche 1: UPI P2P transfer of ₹1,00,000 to VPA `sanjay.traders@okicici`.
[Day 2, 11:00 AM]: Tranche 2: RTGS transfer of ₹25,00,000 to `M. Kumar Enterprises`.
[Day 2, 4:30 PM]: Tranche 3: UPI P2P transfer of ₹1,00,000 to VPA `sharma.logistics@ybl`.
[Day 3, 10:00 AM]: Tranches 4-8: Four RTGS transfers totaling ₹1.18 Crore to corporate current mules.
```

### Forensic Signals Available at Pre-PIN Review (Stage 7)
* **Identity Divergence:** Note stated `RBI Verification Bond`, but `ReqValAdd` returned `Sanjay Traders` (Personal/Proprietorship VPA).
* **Channel Anomaly:** Government bodies and central regulators in India **never receive funds via P2P UPI handles (`@okicici`, `@ybl`)**.
* **Payer Behavioral Baseline:** Victim's 365-day median transaction was ₹450; sudden burst of maximum-limit transfers.
* **Environmental Signal:** Continuous active Skype VoIP call ongoing during the banking interaction.

### Interception Opportunity
The Guardian detects that a transaction claiming to be "RBI Verification" is routing to an individual commercial VPA. The system **halts the pre-PIN review**, places a **mandatory 15-minute cooling pause**, and displays a **targeted cognitive challenge**:
> *"The Reserve Bank of India (RBI) NEVER asks citizens to transfer money for police verification. You are on an active call. Real police do not conduct 'Digital Arrests' over Skype."*

---

## 2. Case Study 2: The Electricity Bill Disconnection Panic
* **Location:** Delhi NCR (Documented Police Special Cell Case, 2024).
* **Victim:** 42-year-old school teacher.
* **Total Loss:** ₹85,000 (Immediate drain).
* **Threat Classification:** Urgency-Driven Impersonation Scam.

### Attack Walkthrough & Mechanical Progression
1. **The Hook:** Bulk SMS received at 6:45 PM: *"Electricity will be disconnected at 8:30 PM tonight due to pending bill. Call Officer Sharma at 9958XXXXXX."*
2. **The Escalation:** Panicked teacher calls. Scammer claims: *"Bill is paid, but the ₹10 portal update fee is missing. Pay ₹10 right now to update the slip."*
3. **The Trap:** Scammer dispatches an embedded web payment link opening an intent payload:
   `upi://pay?pa=subhash44@ybl&pn=BSES_DISCOM_FEE&am=85000&tn=Electricity_Update_Token`
   The display string masks the true amount under small fonts while emphasizing the word "Token".
4. **The Cognitive Blindness:** The victim, convinced she is paying ₹10 to avoid a power cut, enters her MPIN without scrutinizing the four extra zeros!

### Forensic Signals Available at Pre-PIN Review (Stage 7)
* **Amount Disparity:** User intended ₹10; intent payload contained ₹85,000.
* **Name Mismatch:** Display string said `BSES_DISCOM_FEE`; bank-verified name returned `Subhash Kumar`.
* **Handle Anomaly:** Utility collections must route via verified aggregators (`@billdesk`); this VPA was on a retail consumer handle (`@ybl`).
* **Semantic Urgency:** The note contained `Disconnection` and `Token`.

### Interception Opportunity
The Guardian computes an instant name mismatch (Levenshtein score 0.04), detects a personal handle masquerading as an electricity board, and identifies a massive ticket size anomaly. The system **hard-blocks the intent** and renders a high-contrast explainable alert:
> *"BLOCKED: You are sending ₹85,000 to a private individual named 'Subhash Kumar'. Official electricity boards do not collect bills via personal handles."*

---

## 3. Case Study 3: The OLX Military Officer Reverse QR Code Scam
* **Location:** Pune, Maharashtra (Documented Cyber Crime Division FIR, 2023).
* **Victim:** 29-year-old software engineer selling a refrigerator for ₹18,000.
* **Total Loss:** ₹36,000 (Two successive transactions).
* **Threat Classification:** Protocol Deception / Reverse Payment Scam.

### Attack Walkthrough & Mechanical Progression
1. **The Hook:** Buyer contacts seller on OLX, claims to be an Army Officer. Agrees to buy without bargaining.
2. **The Deceptive Proposition:** *"Army accounts cannot send money directly; I can only pay via merchant QR. Scan this QR in PhonePe and type your PIN to receive the ₹18,000 into your account."*
3. **The Victim Action:** The seller scans the QR code. PhonePe renders a payment screen with pre-filled amount ₹18,000. Believing PIN is required to receive funds, the seller enters his PIN.
4. **The Loss:** ₹18,000 is instantly debited!
5. **The Double-Dip:** Scammer claims: *"Technical reversal error! Scan this ₹36,000 correction QR to get your refund plus price."* Panicked victim scans again, types PIN, and loses another ₹36,000!

### Forensic Signals Available at Pre-PIN Review (Stage 7)
* **Flow Inversion:** The user was acting as a seller in an external marketplace, but the intent was a direct **outbound debit**.
* **Pre-Filled Amount in P2P QR:** P2P QR codes rarely have pre-filled amounts unless generated maliciously.
* **Payee Name Deception:** The QR string contained `pn=Army_Canteen_Welfare_Credit`, but bank lookup returned `Ramesh M. (Individual)`.

### Interception Opportunity
The Guardian intercepts the QR scan before MPIN launch, detecting an outbound debit on a P2P handle with a pre-filled amount:
> *"WARNING: Entering your UPI PIN will DEDUCT ₹18,000 from your account! You CANNOT receive money by entering your PIN. This is a known marketplace scam."*

---
**Primary References:**
1. Maharashtra Cyber: *Compendium of Cyber Financial Case Studies (2023)*.
2. Delhi Police Cyber Crime Unit: *Annual Threat Assessment & Operational Modus Operandi*.
3. Indian Cyber Crime Coordination Centre (I4C): *Advisory on OLX Reverse QR and Digital Arrest Frauds*.

# Recipient Verification: Name Matching, Identity Proofs, and the Trust Fallacy

---

## 1. Executive Understanding (Layer 1)
A core requirement of PS09 is the **Recipient Verification Workflow**. In digital payments, verifying the counterparty is the primary technical defense against impersonation, mistaken payments, and money mule syndicates. 

In traditional bank wire transfers, payers had to enter the beneficiary's exact name, account number, and branch code. However, banks traditionally executed transfers solely on the basis of the **Account Number**, completely ignoring whether the name entered matched the account records! 

Modern instant payment rails have introduced **Payee Verification** mechanisms—such as the UK's **Confirmation of Payee (CoP)** and India's UPI **`ReqValAdd` (Validate Address)** API—which query the beneficiary bank in real time and return the official legal name registered to the receiving account.

The critical domain insight for security engineers, however, is that **Identity Verification is NOT Trustworthiness Verification**. Verifying that an account belongs to a real person does not prove that the person is not a criminal or that the account has not been rented out as a disposable mule.

---

## 2. The Recipient Evidence Hierarchy & Epistemic Meaning (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE RECIPIENT EVIDENCE SPECTRUM                          │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ Evidence Signal   │ What It Actually PROVES   │ What It CANNOT Prove        │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ **1. VPA Syntax &**│ Structure adheres to UPI  │ Zero proof of legitimacy;   │
│ **Handle Domain** │ protocol and routes to PSP│ anyone can create a VPA.    │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ **2. Account Name**│ A bank account exists     │ Does NOT prove account is   │
│ **(`ReqValAdd`)** │ under that legal name.    │ not a rented mule or proxy. │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ **3. Merchant**   │ Business completed basic  │ Does NOT prove business is  │
│ **Onboarding/MCC**│ GST / MSME merchant KYC.  │ not a shell company/scam.   │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ **4. Payer-Payee**│ Payer has a trusted,      │ Does NOT protect if friend's│
│ **History Edge**  │ multi-month history.      │ WhatsApp was compromised.   │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ **5. National**   │ Account has been reported │ Clean record does NOT prove │
│ **Cyber Blacklist**│ in verified police FIRs.  │ safety (could be a new mule)│
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 3. Algorithmic Name Matching & Impersonation Detection (Layer 3)

### 3.1 The UK Confirmation of Payee (CoP) Model
The UK's CoP standard divides name matching into three deterministic tiers using string distance metrics (Levenshtein Distance, Token Sort Ratio, and Jaro-Winkler):
1. **Match:** The name entered by the payer matches the beneficiary record within strict phonetic and spelling tolerances (e.g., `Robert Smith` vs `Bob Smith`).
2. **Close Match:** Mismatch detected, but phonetic similarity exceeds $80\%$ (e.g., `Tata Power Ltd` vs `Tata Power Distribution`). The system displays the actual registered name to the payer for manual verification.
3. **No Match:** High divergence ($<60\%$ similarity). The system warns that the beneficiary name is completely different from what was entered.

### 3.2 Display Name Spoofing in India's UPI Ecosystem
In India, scammers systematically exploit the divergence between the **Payee Display Name (`pn`)** in untrusted URIs and the **Bank Verified Account Name**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DISPLAY NAME SPOOFING MECHANISM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   UNTRUSTED INTENT STRING:                                                  │
│   upi://pay?pa=mule.ramesh@okaxis&pn=BSES_Electricity_Customer_Desk         │
│                                                                             │
│   1. NAIVE PAYMENT APP UI:                                                  │
│   Renders untrusted string directly:                                        │
│   "Paying ₹2,500 to BSES_Electricity_Customer_Desk"                         │
│   (Victim believes they are paying the official power utility!)             │
│                                                                             │
│   2. RECIPIENT VERIFICATION WORKFLOW (GUARDIAN):                            │
│   Executes ReqValAdd query to Axis Bank CBS:                                │
│   Returns Actual Registered Legal Name: "Ramesh Chand"                      │
│   Computes Similarity: Levenshtein("BSES...", "Ramesh Chand") = 0.08        │
│   DETECTS ACUTE IMPERSONATION!                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Boundaries, Misconceptions & Epistemic Realities (Layer 4)

### 4.1 The Mule Identity Blind Spot
* **The Fatal Trap:** An engineer assumes that if the recipient's bank account is fully KYC-verified with a valid Aadhaar and PAN card, the transaction is safe.
* **The Reality:** **100% of money mule accounts in India are KYC-verified!** They belong to real citizens (college students, migrant laborers, rural farmers) who opened accounts legally and then rented their ATM cards and netbanking credentials to scam syndicates for ₹2,000–₹5,000 a month.
* **The Epistemic Mandate for PS09:** Recipient verification cannot rely on KYC existence alone. It must evaluate:
  * **Semantic Divergence:** Claimed entity vs registered legal name.
  * **Relational Novelty:** Has the payer ever transacted with this VPA before?
  * **Account Metadata Age:** When was this VPA or account generated?
  * **Category Consistency:** Is an individual P2P handle receiving payments labeled as official utility/court fines?

---
**Primary References:**
1. UK Payment Systems Regulator (PSR): *Confirmation of Payee (CoP) Requirements and Operating Principles*.
2. National Payments Corporation of India: *Procedural Guidelines for VPA Validation and Beneficiary Name Display in UPI*.
3. Reserve Bank of India: *Advisory on Preventing Identity Impersonation in Retail Push Payments*.

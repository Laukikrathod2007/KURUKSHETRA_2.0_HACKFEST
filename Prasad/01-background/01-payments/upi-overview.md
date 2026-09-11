# Unified Payments Interface (UPI): Architecture, Addressing, and Protocol Specifications

---

## 1. Executive Understanding (Layer 1)
The **Unified Payments Interface (UPI)** is an open-architecture, interoperable payment protocol created by NPCI in 2016. It transforms traditional bank account-to-account transfers—which previously required knowing 11-digit IFSC codes, 16-digit account numbers, and waiting hours for beneficiary activation—into an instantaneous, mobile-native experience using virtual identifiers. 

UPI operates on a **1-Click 2-Factor Authentication (2FA)** paradigm. The first factor is **device binding** (a hardware-level cryptographic key tied to the user's physical SIM card and mobile device ID). The second factor is the **UPI MPIN** (a 4- or 6-digit PIN known only to the user, authenticated directly by the Remitter Bank's Hardware Security Module inside an isolated secure view).

Because UPI decouples user identity from banking details, payment requests can be packaged as **standardized URI strings**, **static/dynamic QR codes**, or **deep-linked app intents**, making the rail universally accessible across consumer operating systems—and simultaneously providing an expansive attack surface for deception engineering.

---

## 2. Technical Protocol & Message Architecture (Layer 2)

### 2.1 The UPI URI Specification
At the software level, almost all UPI transactions initiated via web links, messaging apps, or QR scans adhere to the standardized **NPCI UPI Linking Specification**:

```text
upi://pay?pa=<PayeeVPA>&pn=<PayeeName>&am=<Amount>&cu=<Currency>&tn=<TransactionNote>&tr=<TransactionRef>&mc=<MerchantCode>&mode=<Mode>&sign=<DigitalSignature>
```

| URI Parameter | Technical Definition | Example Value | Scam & Security Significance |
| :--- | :--- | :--- | :--- |
| `pa` | **Payee Virtual Payment Address (VPA)** | `tata.power@icici` or `rajesh8829@ybl` | **Primary Destination Identifier:** Target of Recipient Verification. Scammers create deceptive handles mimicking brands. |
| `pn` | **Payee Name (Display String)** | `Tata Power Official Desk` | **High Impersonation Risk:** In unverified P2P flows, the sender app often renders this untrusted string directly to the user! |
| `am` | **Transaction Amount** | `1500.00` | Financial value at stake. Can be left empty for user entry, or hardcoded. |
| `cu` | **Currency Code** | `INR` | Strictly Indian Rupee for domestic rails. |
| `tn` | **Transaction Note / Memo** | `Bill Due Overdue Disconnection` | **Adversarial Semantic Vector:** Untrusted text used to inject urgency, false instructions, or prompt injection payloads. |
| `tr` | **Transaction Reference ID** | `TXN9817263541` | Merchant/client session identifier used for idempotency. |
| `mc` | **Merchant Category Code (MCC)** | `4900` (Utilities), `0000` (P2P Default) | Indicates merchant classification. Mismatch between MCC and display name is a strong risk signal. |
| `sign` | **Base64 Cryptographic Signature** | `MIICXAIBAAKCAQ...` | **Mandatory for Verified Merchants:** P2M dynamic links signed by a bank private key; P2P links are unsigned. |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UPI PROTOCOL MESSAGE INTERACTION FLOW                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Payer App]         [Payer PSP]           [NPCI Switch]      [Remitter Bank│
│      │                    │                      │                   │      │
│      │ 1. Parse URI/QR    │                      │                   │      │
│      │───────────────────▶│                      │                   │      │
│      │                    │ 2. ReqValAdd (VPA)   │                   │      │
│      │                    │─────────────────────▶│ (Resolves Payee)  │      │
│      │                    │◀─────────────────────│                   │      │
│      │ 3. Display Payee   │                      │                   │      │
│      │    & Amount Screen │                      │                   │      │
│      │                    │                      │                   │      │
│      │ 4. User Enters MPIN│                      │                   │      │
│      │    (Encrypted XML) │                      │                   │      │
│      │───────────────────▶│                      │                   │      │
│      │                    │ 5. ReqPay (Debit)    │                   │      │
│      │                    │─────────────────────▶│ 6. ReqAuthDetails │      │
│      │                    │                      │──────────────────▶│      │
│      │                    │                      │                   │Verify│
│      │                    │                      │ 7. RespDebit (OK) │Debit │
│      │                    │                      │◀──────────────────│      │
│      │                    │                      │                   │      │
│      │                    │                      │[Beneficiary Bank] │      │
│      │                    │                      │ 8. ReqCredit      │      │
│      │                    │                      │──────────────────▶│Credit│
│      │                    │ 9. RespPay (Success) │◀──────────────────│      │
│      │ 10. Success UI     │◀─────────────────────│                   │      │
│      │◀───────────────────│                      │                   │      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Operational Detail & Payment Modes (Layer 3)

### 3.1 P2P vs P2M vs Collect Request Flows
UPI supports four primary operational modes, each with vastly distinct threat models:

1. **P2P Push (Peer-to-Peer Transfer):**
   * *Mechanism:* User opens app, selects contact or enters VPA/phone number, inputs amount, enters PIN.
   * *Security Status:* Direct push payment. No merchant verification required.
   * *Scam Pattern:* Impersonation of friend, loan shark payoff, investment deposit, work-from-home task deposit.
2. **P2M Static QR Scan:**
   * *Mechanism:* Physical printed paper/standee QR code displayed at retail merchant counters (e.g., roadside tea stall).
   * *Payload:* Static URI with merchant VPA and name; amount left blank.
   * *Scam Pattern:* **QR Swap Attack:** Scammer glues their own malicious printed sticker over the merchant's legitimate standee QR code, diverting payments to a mule account.
3. **P2M Dynamic QR / Web Intent:**
   * *Mechanism:* Generated programmatically on an e-commerce checkout page or dynamic POS machine.
   * *Payload:* Cryptographically signed URI including exact amount, order ID, and MCC.
   * *Security Status:* High verification fidelity; signed by acquiring aggregator.
4. **UPI Collect Request (P2P / P2M Pull):**
   * *Mechanism:* Initiated by the payee. Payee submits payer's VPA and an amount. The payer receives an inbound notification: *"X has requested ₹5,000 from you. Pay or Decline."*
   * *Security Status:* Extremely high historical abuse rate!
   * *Scam Pattern:* **"Receive Money" Scam:** Scammer tells victim: *"I am sending you ₹10,000 lottery winnings / refund / OLX payment. Click the link and enter your UPI PIN to receive the money into your account!"* Because unsophisticated users associate PIN entry with ATM authentication (which they also use to check balance), they enter their PIN and get debited ₹10,000!

---

## 4. Boundaries, Misconceptions & Epistemic Uncertainties (Layer 4)

### 4.1 NPCI Policy Interventions on Collect Requests
Due to catastrophic scam losses in 2018–2021 from UPI Collect Requests:
* NPCI capped P2P collect requests at ₹2,000 per transaction for unverified accounts.
* Major TPAPs (PhonePe, Google Pay) completely disabled or heavily buried P2P collect requests, restricting inbound collect requests primarily to verified merchants (e.g., Swiggy, Zomato, Amazon).
* **Engineering Takeaway:** While collect scams were the historic driver of UPI fraud, scammers have overwhelmingly pivoted to **P2P Direct Push Scams via Social Engineering**, where the victim themselves initiates the transfer.

### 4.2 Common Misconceptions
* **Misconception 1: "Entering a UPI PIN can receive money into an account."**
  * *Absolute Invariant:* **UPI PIN is exclusively an authorization for a DEBIT.** There is zero technical scenario in the UPI specification where entering an MPIN results in a credit to the user's account. This rule is absolute, yet thousands of victims fall for this daily.
* **Misconception 2: "The Payee Name shown on the screen is verified by the bank."**
  * *Correction:* In P2P UPI, the VPA resolution (`ReqValAdd`) returns the account name registered with the bank, but TPAP user interfaces often prioritize the name stored in the user's phone contact book or the untrusted `pn` string in an inbound QR code, creating deceptive impersonation vulnerabilities.

---
**Primary References:**
1. NPCI: *Unified Payments Interface (UPI) Specification Document v2.1*.
2. NPCI Circular: *NPCI/UPI/OC-87/2020-21: Guidelines on Collect Request and Security Warnings*.
3. Reserve Bank of India: *Report of the Working Group on Digital Lending (2021)*.

# Recipient Intelligence: Legal Entity Resolution, Handle Typology, and Mule Reputation

---

## 1. Executive Understanding
In payment fraud, the remitter's side of the transaction often appears completely legitimate. The fundamental vulnerability of the fraudster is that **they must receive and extract the money**. Therefore, **the recipient endpoint is the most informative anchor in the entire scam lifecycle**.

Recipient intelligence encompasses the verification of beneficiary legal identity, analysis of Virtual Payment Address (VPA) handle semantics, detection of lookalike institutional addresses, and reputation tracking across national cybercrime registries. In the Indian UPI ecosystem, **the NPCI `RespValAdd` protocol provides an indispensable cryptographic window into the true KYC identity of the receiving account**.

---

## 2. The Mechanics of Recipient Resolution: `RespValAdd`

Before an MPIN screen is invoked in UPI, the remitter's TPAP application executes an address validation lookup (`ReqValAdd`) through the NPCI switch to the beneficiary's issuing bank:

```
  [Remitter App]              [NPCI Switch]              [Beneficiary Bank CBS]
        │                           │                              │
        │── 1. ReqValAdd(payeeVPA) ─►│                              │
        │                           │── 2. Query Account by VPA ──►│
        │                           │                              │
        │                           │◄── 3. Return KYC Legal Name ─│
        │◄─ 4. RespValAdd(LegalName)│      ("MUKESH RAMESH PATEL") │
        │                           │                              │
```

### The Decisive Signal: Semantic Entity Discrepancy
When a fraudster impersonates an institution (e.g., "Electricity Department", "SBI Card Verification", or "Customs Bureau"), they manipulate the **Payee Display Name (`pn`)** in QR codes or links. However, they **cannot alter the legal name returned by the Core Banking System (CBS) via `RespValAdd`**:
- **User Expectation:** "MSEB Bill Payment"
- **CBS Legal KYC Name:** "Deepak Kumar Shrivastava"
- **Discrepancy Calculation:** Semantic similarity between expected entity (Institutional Utility) and returned entity (Private Individual) is **0.00**. This single discrepancy is **one of the highest-fidelity scam indicators in consumer fintech**.

---

## 3. Recipient Intelligence Dimensions

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           RECIPIENT RISK INTELLIGENCE SPECTRUM                            │
├─────────────────────┬─────────────────────────────────────┬──────────────┬────────────────┤
│ DIMENSION           │ DATA SOURCE                         │ RELIABILITY  │ VISIBILITY     │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **1. Legal KYC      │ • CBS Account Record via            │ Extremely    │ Real-Time      │
│   Name Match**      │   NPCI `RespValAdd` API             │ High (0.95)  │ Hot Path       │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **2. Handle Typo-   │ • Regex / Levenshtein distance on   │ High         │ Real-Time      │
│   Squatting / Phish**│  VPA handle string (e.g. sbi-care@)│ (0.85)       │ Client-Side    │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **3. P2P vs. P2M    │ • Merchant Category Code (MCC)      │ High         │ Real-Time      │
│   Classification**  │ • Acquirer QR metadata (P2P vs P2M) │ (0.90)       │ Hot Path       │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **4. National Mule  │ • I4C / 1930 Cybercrime Portal      │ Decisive     │ Near-Real-Time │
│   Registry Hit**    │ • NPCI Central Fraud Management     │ (0.99)       │ (Redis Cache)  │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **5. Account Age &  │ • Beneficiary Bank internal ledger  │ Very High    │ **INVISIBLE TO │
│   Inward Velocity** │ • Turnover-to-retention ratio       │ (0.92)       │ REMITTER APP** │
└─────────────────────┴─────────────────────────────────────┴──────────────┴────────────────┘
```

---

## 4. Handle Typology and Semantic Masquerading

Fraud syndicates register VPAs designed to deceive human cognitive heuristics:
1. **Institutional Sub-string Injection:** Creating individual P2P handles containing official keywords:
   - `customs.clearance.dept@okhdfcbank`
   - `sbi.reward.points.online@ybl`
   - `airtel.broadband.support@paytm`
   - **Vulnerability:** A quick glance by the victim reads "customs" or "sbi", ignoring the `@okhdfcbank` consumer handle.
2. **P2P Impersonating P2M:** Legitimate merchants utilize specific Merchant Category Codes (MCC 4900 for Utilities, 5411 for Groceries). Fraudsters collect funds via standard personal P2P handles (MCC 0000) while presenting forged merchant branding.
3. **Punycode and Homoglyph Attacks:** Substituting Cyrillic or Latin lookalike characters in VPA strings to bypass naive substring filters (`paytm` with Cyrillic 'a').

---

## 5. What Recipient Intelligence Proves vs. What it Cannot Prove

```
  ┌────────────────────────────────────────────────────────┐
  │ WHAT RECIPIENT INTELLIGENCE PROVES:                    │
  │ • The exact KYC identity registered with the bank.    │
  │ • Whether the handle is registered as P2P or Merchant. │
  │ • Whether the VPA has prior reported cybercrime FIRs. │
  └────────────────────────────────────────────────────────┘
                             VS
  ┌────────────────────────────────────────────────────────┐
  │ WHAT RECIPIENT INTELLIGENCE CANNOT PROVE:              │
  │ • Whether the KYC owner willingly sold their account   │
  │   (Compromised Student / Low-income Mule).             │
  │ • Whether a brand-new mule has malicious intent        │
  │   (Zero prior complaints on Day 1 of operation).       │
  │ • The current balance or transaction turnover of the   │
  │   beneficiary bank account (Bank Secrecy Laws).        │
  └────────────────────────────────────────────────────────┘
```

### The Cold-Start Mule Dilemma
Organized cybercrime syndicates in India (operating out of Mewat, Jamtara, and Southeast Asian call centers) constantly acquire "fresh" mule bank accounts from rural areas. 
- On **Day 1**, a fresh mule account has **zero complaints** on the I4C portal and no blacklist history.
- **Consequence:** An absence of negative reputation is **not evidence of safety**. Systems that rely exclusively on blacklists fail against 80%+ of active scam transactions.

---

## 6. Epistemic Assessment for PS09

| Dimension | Recipient Intelligence Capability | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Institutional Name Mismatch** | **Decisive:** Catches 90%+ of fake utility, bank support, and government impersonation scams instantly. | Must be a **primary deterministic trigger** in the guardian's pre-PIN evaluation logic. |
| **P2P vs P2M Discrepancy** | **High:** Instantly detects when an institutional claim is being routed to a personal wallet. | High-visibility warning: "You are paying an individual, NOT an institution." |
| **Fresh Mule Exposure** | **Weak in Isolation:** Fresh mules have clean records on Day 1. | Must be fused with **remitter behavioral signals** and **linguistic transaction context**. |
| **API Availability** | **Native in UPI:** `RespValAdd` is already an architectural part of the standard UPI payment flow. | Zero overhead required; the data is already fetched prior to MPIN screen display. |

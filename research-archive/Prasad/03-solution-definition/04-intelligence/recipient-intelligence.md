# Recipient Intelligence: Legal Entity Resolution, Handle Typology, and Reputation Verification

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Recipient verification workflow.*
- *• Digital payment scams can involve unusual recipients, impersonation...*

In digital payment security, the recipient is the ultimate physical anchor of financial crime: **the fraudster must receive and extract the money**. While a scammer can spoof phone numbers, forge display names, and manipulate user psychology, they **cannot alter the legal KYC identity registered with the Core Banking System (CBS) where the funds land**.

Recipient Intelligence in GuardianPay implements an automated, multi-source verification workflow that transforms the Virtual Payment Address (VPA) from an unverified string into a **rich, verified legal entity profile**.

---

## 2. The Recipient Verification Workflow

```
                        THE RECIPIENT VERIFICATION WORKFLOW
                             [Payee VPA Entered / Scanned]
                                          │
                                          ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 1: LOCAL HANDLE TYPOLOGY & PHISHING FILTER (Sub-1ms)                   │
  │ • Regex & Levenshtein check on VPA string against 50+ institutional names   │
  │ • Flags typosquats: `sbi-refund@ybl`, `airtel-care@okhdfcbank`             │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 2: NPCI `ReqValAdd` CORE BANKING IDENTITY RESOLUTION (< 150ms)         │
  │ • Switch routes query to Beneficiary Bank CBS                               │
  │ • CBS returns: Legal KYC Name ("SURESH PATEL") & MCC Code (0000 = P2P)      │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 3: MULE REPUTATION & CYBERCRIME REGISTRY LOOKUP (< 1ms)                │
  │ • Queries in-memory Redis cache of I4C / 1930 Cybercrime Reporting Portal   │
  │ • Checks: Historical FIR flags, dispute count, inward velocity in last 1hr  │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 4: RELATIONAL GRAPH & NOVELTY SCORING                                  │
  │ • Remitter-Payee Relational History: First-time payee vs Recurring contact │
  │ • Emits: `RecipientVerificationProfile` to Risk Engine                      │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Dimensions of the Recipient Profile

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        RECIPIENT VERIFICATION PROFILE SCHEMA                              │
├─────────────────────┬───────────────────┬──────────────┬──────────────────────────────────┤
│ ATTRIBUTE           │ DATA TYPE         │ SOURCE       │ VERIFICATION CERTAINTY           │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `resolved_legal_name`│ String            │ CBS via      │ **100% Deterministic:** Set by   │
│                     │                   │ `RespValAdd` │ bank during Aadhaar/PAN KYC      │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `account_category`  │ Enum: P2P vs P2M  │ CBS MCC Code │ **100% Deterministic:** Official │
│                     │                   │              │ Merchant vs Personal Account     │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `is_typosquat_vpa`  │ Boolean (0 or 1)  │ Local Regex  │ High: Levenshtein distance $\le 2$│
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `is_i4c_mule_hit`   │ Boolean (0 or 1)  │ MHA Portal   │ **Absolute Blacklist Hit**       │
│                     │                   │ (Redis Cache)│ (Triggers immediate hard block)  │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `inbound_velocity`  │ Integer (Count)   │ Feature Store│ Rolling count of unique inbound  │
│                     │                   │              │ transfers in last 1 hour         │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `user_relationship` │ Enum: `FIRST_TIME`│ User Ledger  │ Identifies new payees requiring  │
│                     │ `ESTABLISHED`     │              │ heightened pre-PIN scrutiny      │
└─────────────────────┴───────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 4. Dissecting the "Verified Name" Cognitive Trap

In existing UPI applications (PhonePe, Google Pay), when a user enters a VPA, the app displays:
`Verified Name: SUNIL KUMAR ✔`
- **The Cognitive Pathology:** Research in Phase 2 revealed that lay users interpret the green checkmark or the word "Verified" as an **endorsement of trustworthiness** by Google or PhonePe ("Google verified this person, so it is safe").
- **GuardianPay's Architectural Correction:** 
  - The system replaces generic checkmarks with **Explicit Entity Classification**:
  - `[PERSONAL SAVINGS ACCOUNT — INDIVIDUAL P2P]` (Rendered in amber if paying a merchant).
  - `[ACCREDITED INSTITUTIONAL MERCHANT]` (Rendered in green with official merchant branding).
  - Explicitly states: *"Verified Account Holder Name on Bank Record: Sunil Kumar"*.

---

## 5. What Recipient Intelligence Proves vs. What It Cannot Prove

```
  ┌────────────────────────────────────────────────────────┐
  │ WHAT RECIPIENT INTELLIGENCE PROVES:                    │
  │ • The exact KYC legal name registered with the bank.   │
  │ • Whether the account is a personal P2P or merchant P2M│
  │ • Whether the VPA has prior cybercrime FIR complaints. │
  └────────────────────────────────────────────────────────┘
                             VS
  ┌────────────────────────────────────────────────────────┐
  │ WHAT RECIPIENT INTELLIGENCE CANNOT PROVE:              │
  │ • Whether a clean account was opened 3 hours ago by a  │
  │   student mule who sold their credentials.             │
  │ • Whether the remitter is currently under active phone │
  │   call coercion.                                       │
  │ • The current balance or total turnover of the account │
  │   (Protected by bank secrecy laws).                    │
  └────────────────────────────────────────────────────────┘
```

**Conclusion:** Recipient intelligence is **necessary but not sufficient**. It must be combined with contextual intent and behavioral sensor dynamics within the Risk Engine.

---

## 6. Epistemic Assessment for PS09

The Recipient Intelligence module directly delivers on **Core Requirement 4 (`PROBLEM_STATEMENT.md`)**. By verifying the legal account holder identity against Core Banking records and detecting lookalike handles, it eliminates the primary deception channel used in impersonation scams.

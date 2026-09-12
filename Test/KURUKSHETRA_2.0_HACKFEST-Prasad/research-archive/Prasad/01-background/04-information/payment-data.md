# Payment Data Architecture: Information Categories, Telemetry, and Sensitivity

---

## 1. Executive Understanding (Layer 1)
Data is the foundational fuel of risk appraisal and scam interception. However, in retail payment systems, **data is neither centrally located nor universally accessible**. Information around a payment is fragmented across the user's local operating system, the client application sandbox, third-party communications apps, telecom networks, payment switches, and sovereign banking cores.

For an engineering team designing an "Agentic Guardian," understanding **what data exists, who owns it, when it manifests, and what legal or technical firewalls restrict its access** is essential. Assuming access to data that cannot legally or technically be obtained in production produces an impressive toy that cannot be deployed in the real world.

---

## 2. Comprehensive Data Taxonomy Matrix (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PAYMENT INFORMATION TAXONOMY MATRIX                      │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│ DATA CATEGORY         │ EXAMPLES                    │ PRIVACY SENSITIVITY   │
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│ **1. Transaction**    │ Amount, timestamp, MCC, UTR │ High (Financial PII)  │
│ **2. Recipient**      │ VPA, legal name, handle     │ High (Counterparty)   │
│ **3. Account State**  │ Balance, KYC tier, limits   │ Critical (Banking Sec)│
│ **4. Device Telemetry**│ IMEI, Android ID, root flag │ Medium (Hardware PII) │
│ **5. Interaction**    │ Dwell time, clipboard paste │ Low to Medium         │
│ **6. Out-of-Band**    │ Phone call state, SMS, chat │ CRITICAL (User Comm)  │
│ **7. Threat Intel**   │ Police blacklist, mule flag │ High (Law Enforcement)│
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 3. Deep Analysis of Information Categories (Layer 3)

| Information Category | Specific Data Attributes | Generation Point & Origin | Accessibility Locus | Sensitivity & Regulatory Restriction |
| :--- | :--- | :--- | :--- | :--- |
| **Transaction Data** | Amount, Currency, Note (`tn`), MCC, Channel (QR / Collect / Push), Timestamp. | Payment Intent URI / QR scan payload. | Client TPAP App, PSP, Switch, Both Banks. | Regulated financial data; subject to RBI data localization mandates. |
| **Recipient Data** | VPA (`pa`), Raw Name (`pn`), Bank-Verified Name (`RespValAdd`), Handle domain. | Central Switch VPA Directory & Beneficiary CBS. | Client App (Masked Name), Switch, Beneficiary Bank. | Public identifier (VPA); verified name returned via API. |
| **Account State** | Available balance, daily debit headroom, account status (active/dormant). | Remitter Core Banking System. | **Strictly Remitter Bank CBS.** Hidden from TPAP and Switch! | **Banking Secrecy:** Third-party apps are strictly forbidden from seeing ledger balances. |
| **Device Telemetry** | Hardware model, OS version, rooted/jailbroken flag, emulator check. | Client OS hardware sensors & security keystore. | Local TPAP App & Client Security SDK. | Hardware fingerprinting regulated under DPDP Act 2023. |
| **Interaction Telemetry**| Time spent on confirmation screen (dwell ms), typing cadence, clipboard usage. | Client UI touch events and gesture listeners. | **Strictly Local Client App.** | Low sensitivity; non-PII behavioral telemetry. |
| **Contextual Telemetry**| Ongoing active telephony call, active screen-sharing software (AnyDesk). | Android TelecomManager & Accessibility APIs. | Local Device OS (Requires specialized permissions). | **High Privacy Sensitivity:** Google Play Store heavily restricts telephony and accessibility APIs. |
| **Out-of-Band Context**| WhatsApp messages, SMS phishing text, incoming caller VoIP identity. | Third-party messaging and telecom apps. | **Isolated in Third-Party Sandboxes.** | **Completely Inaccessible** to standard banking apps due to OS sandboxing. |
| **Historical Baseline**| Past 90-day transaction graph, frequent counterparties, average ticket size. | Local app cache or secure backend profile. | TPAP Backend / Bank Data Warehouse. | Personal financial history; requires user consent under DPDP. |

---

## 4. Boundaries, Misconceptions & Epistemic Realities (Layer 4)

### 4.1 The Three Hard Boundaries of Payment Data
1. **The Sandboxing Boundary:** Android and iOS do not permit Google Pay or PhonePe to "read the screen" of WhatsApp or listen to the audio of an incoming phone call. Any scam defense claiming to "read the scammer's chat in real time" is architecturally unviable without a specialized user-installed accessibility profile (which banks actively ban as malware!).
2. **The Banking Ledger Boundary:** The TPAP client app does **not** know the user's real-time bank balance or how much money is left in their fixed deposits. It only knows whether a debit succeeds or fails.
3. **The Data Localization Mandate (RBI Circular DPSS.CO.OD.No.2785/06.08.005/2017-2018):** All transaction data must be stored exclusively on servers located within the territorial borders of India. Transmitting unmasked Indian financial payloads to foreign cloud LLM endpoints (e.g., US-hosted OpenAI or Anthropic APIs) violates sovereign banking directives!

---
**Primary References:**
1. Reserve Bank of India: *Directive on Storage of Payment System Data (RBI/2017-18/153)*.
2. Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023): *Sections on Data Fiduciary Obligations and Data Minimisation*.
3. Google Play Policy: *Financial Services and Sensitive Permissions: Restrictions on Accessibility and Call Log APIs*.

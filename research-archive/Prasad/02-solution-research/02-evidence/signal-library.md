# Signal Library: Multi-Modal Feature Taxonomy, Extraction Points, and Sensitivity

---

## 1. Executive Understanding
In payment scam detection, no single signal provides definitive proof of malicious intent. A robust defensive architecture depends on a **Signal Library**: an organized catalog of measurable, computable attributes extracted from the transaction intent, counterparty profiles, historical baselines, user interaction telemetry, and device state.

This document formalizes the signal library for PS09, classifying potential indicators into **11 distinct signal families**, detailing their technical definitions, origin, extraction latency, and privacy classification under Indian law.

---

## 2. Master Signal Taxonomy Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 11 PAYMENT SIGNAL FAMILIES                           │
├─────────────────────┬───────────────────────────┬───────────────────────────┤
│ 1. Transaction Meta │ 2. User Behavioral        │ 3. Recipient Counterparty │
│ 4. Account State    │ 5. Device Integrity       │ 6. Interaction Telemetry  │
│ 7. Temporal Timing  │ 8. Network / Graph        │ 9. Semantic & NLP Text    │
│ 10. Environmental   │ 11. Threat Intelligence   │                           │
└─────────────────────┴───────────────────────────┴───────────────────────────┘
```

| Signal ID | Signal Name | Feature Definition & Extraction Mechanism | Latency Envelope | Privacy Tier (DPDP Act) |
| :--- | :--- | :--- | :--- | :--- |
| **SIG-TX-01** | `amount_magnitude` | Absolute transfer amount in INR. | Sub-1 ms | High (Financial PII) |
| **SIG-TX-02** | `amount_deviation_zscore`| Normalized deviation from user's 90-day median transaction value: $Z = \frac{x - \mu}{\sigma}$. | Sub-5 ms (from cache) | High (Financial PII) |
| **SIG-TX-03** | `channel_type` | Encoded channel: P2P Push (`0`), P2M Static QR (`1`), Dynamic Web Intent (`2`), Collect (`3`). | Sub-1 ms | Medium |
| **SIG-TX-04** | `mcc_code` | Merchant Category Code (e.g., `4900` Utilities, `6012` Financial Institutions, `0000` P2P). | Sub-1 ms | Low |
| **SIG-RC-01** | `vpa_handle_domain` | The PSP domain suffix (e.g., `@okhdfcbank`, `@ybl`, `@paytm`, `@billdesk`). | Sub-2 ms | Low (Public Handle) |
| **SIG-RC-02** | `bank_name_levenshtein`| String distance between claimed display name (`pn`) and bank legal name (`RespValAdd`). | Sub-10 ms | High (Counterparty) |
| **SIG-RC-03** | `handle_category_mismatch`| Boolean flag: True if handle is personal P2P (`@ybl`), but claimed entity is institutional. | Sub-5 ms | Low |
| **SIG-RC-04** | `payer_payee_history_count`| Total number of historical successful transfers between this payer and this payee. | Sub-5 ms (from cache) | High |
| **SIG-SM-01** | `urgency_token_density`| Ratio of high-stress urgency words (`cutoff`, `immediate`, `warrant`, `FIR`) in note (`tn`). | Sub-15 ms (Regex/NLU) | High (User Text) |
| **SIG-SM-02** | `lure_token_density` | Occurrence of incentive keywords (`lottery`, `task reward`, `refund`, `cashback`, `bonus`). | Sub-15 ms | High (User Text) |
| **SIG-IT-01** | `screen_dwell_time_ms` | Elapsed milliseconds between confirmation screen render and tap on "Pay" button. | Sub-1 ms (Local UI) | Low (Interaction) |
| **SIG-IT-02** | `interaction_hesitation`| Variance in touch coordinates or pause duration preceding final confirmation tap. | Sub-5 ms | Low (Interaction) |
| **SIG-EV-01** | `active_telephony_call`| Boolean flag: True if device is engaged in an active cellular or VoIP voice call. | Sub-5 ms (OS API) | Medium (Telephony State)|
| **SIG-EV-02** | `remote_desktop_active`| Boolean flag: True if an accessibility service or package of AnyDesk/RustDesk is running. | Sub-10 ms (Package check)| Medium (App Sandbox) |
| **SIG-TI-01** | `national_blacklist_hit`| Binary match against I4C / 1930 Citizen Financial Cyber Fraud reported VPA database. | 50 ms - 250 ms (API) | High (Law Enforcement) |

---

## 3. Deep Extraction & Feasibility Analysis

### 3.1 SIG-RC-02: Algorithmic Name Divergence
* **Input Parameters:** Claimed string $S_{\text{claimed}}$ from URI `pn` or payment note; Verified string $S_{\text{verified}}$ from `RespValAdd`.
* **Preprocessing:** Stripping whitespace, punctuation, common honorifics (`Mr`, `Mrs`, `M/s`), and converting to lowercase.
* **Metric Formulation:**
  $$\text{Sim}(S_1, S_2) = 1 - \frac{\text{Levenshtein}(S_1, S_2)}{\max(|S_1|, |S_2|)}$$
* If $\text{Sim} < 0.3$ and $S_{\text{claimed}}$ contains an institutional brand, the signal triggers a high-severity **Impersonation Alert**.

### 3.2 SIG-IT-01: Screen Dwell Time Dynamics
* **Normal Payment Baseline:** Average human dwell time on a familiar UPI confirmation screen is **$800\text{ ms} - 1,800\text{ ms}$**.
* **Panic / Coached Distribution:**
  * *Hasty Panic (Electricity Cutoff):* Dwell time $<400\text{ ms}$ (frantic clicking driven by fear).
  * *Coached Hesitation (Digital Arrest / Vishing):* Dwell time $>8,000\text{ ms}$ with multiple touch cancellations while listening to instructions on a live voice call.

---
**Primary References:**
1. National Payments Corporation of India: *UPI Data Dictionary and Field Specifications v2.1*.
2. Google Android Developers: *AccessibilityService and TelecomManager API Documentation*.
3. UK Payment Systems Regulator: *Technical Specifications for Payee Name Discrepancy Scoring*.

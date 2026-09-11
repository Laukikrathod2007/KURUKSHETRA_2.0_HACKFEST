# Information Availability: Ecosystem Visibility, Latency Horizons, and Boundary Constraints

---

## 1. Executive Understanding
In fraud detection, **an algorithm is only as effective as the data available to it at the precise millisecond of decisioning**. A model that requires the beneficiary bank's historical account turnover cannot execute inside a client-side UPI application (TPAP). Conversely, a bank-side risk engine running inside an Core Banking System (CBS) cannot inspect the remitter's screen dwell time or detect that an active WhatsApp call is running concurrently with payment authorization.

For **PS09 (Agentic Guardian for Real-Time Payment Scam Interception)**, understanding **who sees what, when, and under what latency constraints** is the fundamental prerequisite for designing a credible interception architecture.

---

## 2. The Visibility Partition Matrix

The Indian UPI ecosystem is structurally partitioned across four distinct architectural silos:
1. **Client-Side Device / TPAP Layer** (Google Pay, PhonePe, Paytm, BHIM)
2. **Remitter Bank / PSP Layer** (HDFC, SBI, ICICI issuing CBS and UPI switches)
3. **Central Switch Layer** (NPCI National Payments Switch)
4. **Beneficiary Bank / Acquirer Layer** (Receiving bank and merchant aggregators)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                           CROSS-LAYER INFORMATION MATRIX                                 │
├──────────────────────────┬──────────┬──────────────┬─────────────┬───────────┬───────────┤
│ SIGNAL / DATA ASSET      │ TPAP APP │ REMITTER PSP │ NPCI SWITCH │ BEN. BANK │ EXT. (I4C)│
├──────────────────────────┼──────────┼──────────────┼─────────────┼───────────┼───────────┤
│ Active Call / Screen-Share│   YES    │      NO      │     NO      │    NO     │    NO     │
│ Typing Cadence / Dwell   │   YES    │      NO      │     NO      │    NO     │    NO     │
│ Raw Payment Note (`tn`)  │   YES    │     YES      │    YES      │   YES     │    NO     │
│ Exact GPS / Wi-Fi BSSID  │   YES    │      NO      │     NO      │    NO     │    NO     │
│ Remitter Account Balance │    NO*   │     YES      │     NO      │    NO     │    NO     │
│ Beneficiary Legal Name   │   YES**  │     YES      │    YES      │   YES     │    NO     │
│ Beneficiary Account Age  │    NO    │      NO      │     NO      │   YES     │    NO     │
│ Beneficiary Velocity/Vol │    NO    │      NO      │   PARTIAL   │   YES     │    NO     │
│ Cross-App User Fraud Rep │    NO    │      NO      │    YES      │    NO     │   YES     │
│ Reported Mule Blacklist  │  ASYNC   │    ASYNC     │    ASYNC    │   ASYNC   │   SOURCE  │
└──────────────────────────┴──────────┴──────────────┴─────────────┴───────────┴───────────┘
* TPAP only displays balance if user explicitly triggers check-balance MPIN flow; cannot read background CBS balance.
** Populated via `RespValAdd` protocol lookup prior to MPIN screen.
```

---

## 3. Temporal Horizons and Latency Classes

Signals arrive across three radically different temporal horizons:

```
          HOT PATH (0 - 150ms)                 WARM PATH (150ms - 2s)            COLD PATH (Async / Batched)
┌──────────────────────────────────────┐┌────────────────────────────────┐┌────────────────────────────────┐
│ • Device Sensor Telemetry (Local)    ││ • Beneficiary VPA Lookup       ││ • I4C National Fraud Registry  │
│ • Local App User Session History     ││   (`ReqValAdd` -> `RespValAdd`)││ • Cross-bank Graph Clustering  │
│ • Client Rules & On-Device Embeddings││ • TPAP Server-Side Risk Score  ││ • Retrospective AML Profiling  │
│ • Static Regex / Note Keyword Match  ││ • Remote Mule Reputation Cache ││ • Human Analyst Case Review    │
└──────────────────────────────────────┘└────────────────────────────────┘└────────────────────────────────┘
                 ▲                                       ▲                                        ▲
                 │                                       │                                        │
           Pre-PIN Entry                           Screen Review                         Post-Facto Freeze
```

### Horizon 1: Hot Path (Synchronous, Sub-150ms)
- **Execution Target:** Directly on user device or edge API gateway.
- **Available Data:** Current UI form inputs (Amount, VPA, Note), local app history, device sensor state (active call flag, accessibility service presence), and local encrypted cache.
- **Constraint:** Any call exceeding 200ms degrades user experience; exceeding 2000ms causes UPI app timeout errors (`U30 - Transaction Timeout`).

### Horizon 2: Warm Path (Pre-PIN Review Window, 150ms - 2.5s)
- **Execution Target:** Background query while the user reads the beneficiary name confirmation screen before tapping "Enter UPI PIN".
- **Available Data:** Bank-verified payee name resolution (`RespValAdd`), merchant category code (MCC), TPAP server-side fraud models, high-speed cache of known mule accounts.
- **Constraint:** Must complete before the user submits the biometric/MPIN authorization prompt.

### Horizon 3: Cold Path (Asynchronous, Minutes to Days)
- **Execution Target:** Central fraud intelligence servers, I4C portal, NPCI central fraud registry (CFMS).
- **Available Data:** First Information Reports (FIRs), victim dispute filings, graph clustering across thousands of inter-bank accounts, retrospective AML profiling.
- **Reality:** Cannot prevent the current transaction in real-time unless the mule was already identified in a prior cycle.

---

## 4. Platform and OS Privacy Enclosures (Android vs. iOS)

A critical point of failure in academic security proposals is assuming access to system telemetry that modern operating systems explicitly forbid:

### Android Sandbox Constraints (Android 13 / 14 / 15)
1. **SMS Reading (`READ_SMS`):** Strictly prohibited for general TPAP apps under Google Play Developer Policy unless declared as the default SMS handler. Apps use Google Play SMS Retriever API, which only permits reading proprietary OTP messages formatted with a cryptographic app hash. **A payment app cannot monitor incoming scam text messages from fraudsters.**
2. **Call State & Audio (`READ_PHONE_STATE`, Call Recording):** Apps can detect *if* a cellular voice call is currently active (`TelephonyManager.CALL_STATE_OFFHOOK`), but **cannot listen to call audio, record conversations, or inspect caller numbers** without high-risk permissions that result in Google Play de-listing.
3. **OTT VoIP Calls (WhatsApp, Telegram, Signal):** Cellular phone state listeners **do not detect WhatsApp voice calls**. Detecting OTT calls requires querying active `AudioDeviceInfo` or Notification Listener services, which are heavily restricted.
4. **Accessibility Services (`BIND_ACCESSIBILITY_SERVICE`):** While capable of inspecting screen text of third-party apps (e.g., WhatsApp messages), Google Play strictly restricts Accessibility APIs to accessibility tools for users with disabilities. Any financial app employing accessibility scraping for fraud detection faces immediate de-listing.

### iOS Sandbox Constraints (iOS 16 / 17 / 18)
1. **Total App Sandboxing:** iOS permits zero inter-app communication. A UPI app on iOS cannot know if WhatsApp, Telegram, or AnyDesk is running.
2. **No Call State Inspection:** CallKit does not expose external call status to non-dialer applications.
3. **Zero Screen Scraping:** iOS provides no equivalent to Android Accessibility Service scraping.

---

## 5. Epistemic Invariants for PS09 Architecture

1. **The In-App Perimeter Rule:** The Guardian can only reliably inspect data **generated within its own UI boundaries** (Transaction amount, VPA, note, timing, verified legal name returned by NPCI) plus **strictly permitted OS health signals** (Telephony offhook flag, presence of known screen-share package names in installed applications list).
2. **The "Out-of-Band" Scam Reality:** The vast majority of social engineering happens outside the payment app (WhatsApp, Instagram, Telegram, direct phone call). **The payment app only encounters the scam at the terminal payment execution step.**
3. **The Recipient Information Vacuum:** The remitter's app and bank have **zero visibility** into the beneficiary account balance, account age, or transaction history. They receive exactly one real-time asset from the beneficiary bank: `RespValAdd` (the official account holder legal name).
4. **The Agent Latency Paradox:** An agentic workflow requiring multi-turn LLM reasoning (3 to 10 seconds) **cannot sit synchronously on the UPI authorization switch path**. It can only operate in the **warm pre-PIN user review window** or as an **interactive cognitive intervention before the MPIN screen is invoked**.

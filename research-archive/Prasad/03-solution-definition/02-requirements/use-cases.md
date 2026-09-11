# Use Case Catalogue: Formal Operational Specifications

---

## 1. Executive Understanding
This catalogue formalizes the operational behaviors of GuardianPay into explicit, testable **Use Cases (UC)**. Each use case defines the preconditions, inputs, step-by-step telemetry evaluation, policy decisioning, user interface intervention, and failure handling.

Use cases are prioritized using the **MoSCoW framework** (Must Have, Should Have, Could Have, Out of Scope) to establish strict implementation boundaries for both the prototype and production systems.

---

## 2. Master Use Case Summary

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              USE CASE CATALOGUE SUMMARY                                   │
├────────┬──────────────────────────────────────────────┬──────────────┬────────────────────┤
│ UC-ID  │ USE CASE NAME                                │ PRIORITY     │ PRIMARY MECHANISM  │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **01** │ Routine Low-Value Merchant / Peer Payment    │ **MUST HAVE**│ Sub-5ms Fast Path  │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **02** │ First-Time Recipient Normal Transfer         │ **MUST HAVE**│ Salient Advisory   │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **03** │ Institutional Impersonation (Entity Clash)   │ **MUST HAVE**│ Name Challenge     │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **04** │ Coercive Extortion ("Digital Arrest")        │ **MUST HAVE**│ Call Interlock     │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **05** │ Remote Access APK Presence (AnyDesk)         │ **MUST HAVE**│ Deterministic Block│
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **06** │ High-Value Medical Emergency (Safe Override) │ **MUST HAVE**│ Verified Step-Up   │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **07** │ Task / Investment Ponzi Velocity Spike       │ SHOULD HAVE  │ Graph Velocity     │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **08** │ Malicious Collect Request (`ReqPay`) Inversion│ SHOULD HAVE  │ Intent Warning     │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **09** │ Cloud Risk Gateway Outage / Offline Mode     │ **MUST HAVE**│ Degraded Fallback  │
├────────┼──────────────────────────────────────────────┼──────────────┼────────────────────┤
│ **10** │ Forensic Case Dossier Generation (1930 / FIR)│ SHOULD HAVE  │ WORM Audit Export  │
└────────┴──────────────────────────────────────────────┴──────────────┴────────────────────┘
```

---

## 3. Detailed Specifications for Critical Use Cases

### UC-01: Routine Low-Value Merchant / Peer Payment
- **Priority:** Must Have (Core Usability Baseline).
- **Actor:** Retail UPI User.
- **Trigger:** User scans merchant QR (e.g. ₹60 chai) or sends ₹500 to a frequent contact.
- **Preconditions:** App is authenticated; device integrity is verified.
- **Inputs:** Amount: ₹60; VPA: `merchant@icici`; Ingress: Camera QR; Past History: 20+ transfers.
- **Primary Flow:**
  1. System extracts local features: No active call, normal dwell time, known merchant category.
  2. Hot-path GBDT computes risk score: $P = 0.002 (< 0.15)$.
  3. System issues `ACTION: FAST_PATH_PASS`.
  4. App transitions immediately to NPCI Common Library MPIN pad.
- **Decision:** PASS (Zero added latency, $<5\text{ms}$).
- **Output:** Standard PIN entry screen; zero friction.

---

### UC-03: Institutional Impersonation / Entity-Purpose Semantic Clash
- **Priority:** Must Have (Primary APP Scam Defense).
- **Actor:** Retail UPI User (Potential Victim).
- **Trigger:** User initiates ₹35,000 transfer after being told to pay a "Customs Parcel Fine".
- **Preconditions:** User enters payment note: *"Customs duty fine for parcel release"*.
- **Inputs:** Amount: ₹35,000; VPA: `clearance.dept@okhdfcbank`; Note: `"Customs fine"`.
- **Primary Flow:**
  1. Hot path flags high ticket size to unlinked recipient ($P = 0.45$).
  2. Warm path queries `RespValAdd`: Core Banking returns legal name: `"Suresh Ramesh Patel"`, P2P individual account.
  3. Contextual NLP compares stated intent (Government Customs Duty) with resolved payee (Private Individual P2P): Semantic Clash Score = $0.98$.
  4. Bounded Policy Engine triggers `TIER_2_COGNITIVE_CHALLENGE`.
  5. UI locks the "Pay" button and presents the **Legal Name Verification Challenge**:
     > *"Security Notice: You are transferring ₹35,000 to an individual named **Suresh Ramesh Patel**, NOT the Customs Department. To proceed, type 'Suresh Patel' below."*
  6. User realizes deception and taps **"Cancel Payment & Report Scam"**.
- **Alternative Flow:** If user persists and correctly types the name, the system enforces a 15-minute cooling-off window.
- **Decision:** CHALLENGE / INTERCEPT.
- **Audit Event:** Emits complete causal record with reason code `RECIPIENT_ENTITY_CLASH`.

---

### UC-04: Coercive Extortion ("Digital Arrest" Scam)
- **Priority:** Must Have (High-Loss Crime Interception).
- **Actor:** Retail UPI User under psychological panic.
- **Trigger:** User initiates ₹1,50,000 transfer while being threatened over a live phone call by fake police officers.
- **Inputs:** Amount: ₹1,50,000; Beneficiary: First-time individual VPA; Sensor: `CALL_STATE_OFFHOOK = TRUE`; Dwell: $18.4\text{s}$; Gyro Jitter: $3.8\sigma$.
- **Primary Flow:**
  1. Hot path detects conjunction: Extreme Amount + First-Time Payee + Active Phone Call.
  2. GBDT score jumps to $0.91 (> 0.75)$.
  3. Bounded Policy Engine triggers `TIER_3_CALL_INTERLOCK`:
     > *"High-Risk Security Interlock: This payment is initiated during an active phone call. Police, CBI, and courts NEVER demand money via UPI or over phone calls. **This transaction is locked until you hang up your phone call.**"*
  4. User disconnects the call, breaking the scammer's real-time psychological grip.
  5. UI displays educational briefing and local cybercrime helpline (1930).
- **Decision:** HARD INTERLOCK / CALL DISCONNECT REQUIRED.

---

### UC-05: Remote Access APK Detection (AnyDesk / TeamViewer)
- **Priority:** Must Have (Technical Safety Boundary).
- **Actor:** Retail UPI User coerced into screen sharing.
- **Trigger:** User opens UPI app to receive a "refund" while AnyDesk is streaming in the background.
- **Inputs:** `PackageManager.getInstalledPackages()` contains `com.anydesk.anydeskandroid`.
- **Primary Flow:**
  1. Local Guardian SDK detects active AnyDesk accessibility/overlay service in $<1\text{ms}$.
  2. Hard Deterministic Compliance Rule triggers `ACTION: DETERMINISTIC_BLOCK`.
  3. App refuses to open payment checkout and displays:
     > *"Critical Security Alert: Remote screen-sharing app (AnyDesk) detected. Please uninstall or force-stop AnyDesk before executing payments."*
- **Decision:** IMMEDIATE CLIENT-SIDE BLOCK.

---

### UC-06: High-Value Medical Emergency (Legitimate Override)
- **Priority:** Must Have (False-Positive Harm Prevention).
- **Actor:** Legitimate user paying ₹85,000 to an unlinked hospital account at 2:30 AM.
- **Inputs:** Amount: ₹85,000; MCC: 8062 (Hospitals); Time: 2:30 AM; Active Call: FALSE; Note: "Emergency ICU Deposit".
- **Primary Flow:**
  1. Hot path flags amount anomaly, but MCC resolution identifies an accredited healthcare institution.
  2. Entity-Purpose Match: Purpose (Medical) matches Recipient (Hospital).
  3. Risk score is dampened to $0.28$ (Low-Moderate).
  4. System renders a non-blocking **High-Salience Verification Banner**:
     > *"Transferring ₹85,000 to [Hospital Name]. Verified Healthcare Institution."*
  5. User immediately taps "Proceed" without entering cognitive typing challenges.
- **Decision:** PASS WITH ADVISORY BANNER (Zero critical friction on emergencies).

---

### UC-09: Cloud Risk Gateway Outage / Offline Mode
- **Priority:** Must Have (High Availability Compliance).
- **Trigger:** Cloud API gateway experiences network timeout (>120ms) or 5xx server crash.
- **Primary Flow:**
  1. Client SDK circuit breaker trips to **OPEN**.
  2. SDK automatically falls back to **On-Device Autonomous Heuristics**:
     - Remote access APK check runs locally.
     - Known-mule bloom filter check runs locally in SQLite.
     - Transactions below ₹5,000 pass silently (Fail-Open for small commerce).
     - Transactions above ₹25,000 show a local warning dialog.
- **Decision:** TIERED DEGRADED PASS (Zero switch outage liability).

---

## 4. Epistemic Assessment for PS09

| Principle | Engineering Standard |
| :--- | :--- |
| **Zero Delay on Normal Payments** | UC-01 must execute in $<10\text{ms}$ with zero added clicks. |
| **Surgical Interlocking** | Interlocks in UC-03 and UC-04 must physically disable the payment button until cognitive conditions are satisfied. |
| **Emergency Preservation** | UC-06 guarantees that legitimate medical emergencies are never blocked by automated models. |

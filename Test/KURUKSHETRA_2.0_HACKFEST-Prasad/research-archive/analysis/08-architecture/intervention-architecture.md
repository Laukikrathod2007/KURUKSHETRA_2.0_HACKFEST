# Intervention Architecture & Behavioral De-Biasing Specification

## 1. Architectural Mandate & Temporal Placement

The decisive innovation of Kurukshetra is intervening **prior to payment execution, strictly before the user enters their PIN or provides biometric approval**.

In authorized push payment (APP) scams, the victim is under active cognitive overload or psychological manipulation (e.g., fear of imminent arrest, false urgency regarding lost funds, romantic affinity). Once the user enters their PIN, the payment engine converts the request into an irrevocable real-time rail credit. Therefore, the Intervention Architecture (`CMP-02`) operates as a **synchronous gatekeeper intercepting the mobile application's UI transition loop**.

```mermaid
sequenceDiagram
    autonumber
    actor Victim as Bank Customer
    participant App as Mobile Banking App
    participant SDK as Kurukshetra Client SDK (CMP-02)
    participant Core as Core Banking Payment Gateway
    participant Engine as Kurukshetra Decision Engine (CMP-05)

    Victim->>App: Clicks "Send $4,850"
    App->>SDK: onRequestPaymentExecution(tx_payload)
    Note over SDK: Intercepts flow; suppresses PIN pad rendering
    SDK->>Engine: POST /v1/intercept (Tx + Telemetry)
    Engine-->>SDK: Directive: INTERVENE_COACH (Typology: IMPERSONATION_POLICE)
    
    SDK->>App: Render Full-Screen De-Biasing Gate
    Note over App: PIN entry completely disabled; 5s countdown active
    Victim->>App: Observes Warning & Counter-Coaching Questions
    Note over Victim: Cognitive spell broken; user reads questions
    
    alt User Aborts Payment
        Victim->>App: Clicks "Cancel Payment & Call Bank Support"
        App->>SDK: onPaymentCancelled(reason=USER_SUSPECTS_SCAM)
        SDK-)Core: POST /v1/scam-aborted-telemetry
        App->>Victim: Display Safe Confirmation & Support Contact
    else User Overrides After 5s Dwell
        Victim->>App: Clicks "I understand the risk, continue" (After 5s)
        App->>SDK: onUserOverrideConfirmed()
        SDK->>App: Render Biometric / PIN Pad
        Victim->>App: Enters Authentic PIN
        App->>Core: Execute Payment (Tagged with HIGH_RISK_OVERRIDE)
    end
```

---

## 2. Client-Side Interceptor Architecture (`CMP-02-Client`)

### 2.1 The 5-Second Anti-Habituation Dwell Gate
Standard banking warning modals fail because users develop **habituation blindness**: they reflexively tap "OK" or "Accept" without reading the text.

Kurukshetra enforces a **Deterministic 5-Second Dwell Gate**:
1. **Interactive Disablement**: The "Proceed Anyway" button is physically disabled (alpha = 0.4, unclickable) upon modal mounting.
2. **Visual Progress Ring**: A circular SVG progress bar counts down from 5.0 to 0.0 seconds.
3. **Anti-Reflexive Confirmation**: After the 5 seconds elapse, the user cannot simply tap "Continue." They must actively select an affirmative radio button that invalidates the scammer's specific coaching narrative:
   - *"[ ] I confirm that no one asked me to move money to a 'safe account' or keep this call secret."*
4. **Dynamic Shuffling**: The position of the "Cancel Payment" (safe option, highlighted in high-contrast blue) and "Continue" (danger option, subdued gray) are randomized across sessions to prevent motor-memory tapping.

### 2.2 Typology-Specific Counter-Coaching Renderer

Rather than generic warnings ("Warning: Frauds are common"), Kurukshetra loads **Coercion-Neutralizing Templates** indexed directly to the observed threat profile:

| Detected Typology | Primary Sensor Trigger | Counter-Coaching Narrative Injected into Modal |
| :--- | :--- | :--- |
| **Law Enforcement Impersonation** | Active call + rapid high-value drain + first-time payee | *"Police, CBI, and Customs officers will NEVER call you on WhatsApp, threaten immediate arrest, or ask you to transfer funds to verify your innocence."* |
| **Remote Access / Tech Support** | AnyDesk / TeamViewer active in background | *"You currently have screen-sharing software active. Bank employees will NEVER ask you to install AnyDesk or TeamViewer to fix an account problem."* |
| **Romance / Investment Scam** | High dyadic velocity + crypto exchange or mule recipient | *"High-return investment platforms that require sending money to personal savings accounts or third-party individuals are 100% fraudulent."* |

---

## 3. Asynchronous Account Cooling-Off & Friction Service

For extreme threat scores ($P_{\text{scam}} \ge 0.85$ and high confidence), mere client warnings are insufficient, as deeply indoctrinated victims may still force an override.

In such cases, the system transitions to **Institutional Friction**:
1. **The 4-Hour Inbound Cooling-Off Hold**:
   - The transaction is placed in an asynchronous holding queue (`TRANSACTION_QUARANTINE_QUEUE`).
   - The recipient's account is flagged in the interbank mule clearing database.
   - The victim's app informs them that their transfer is undergoing routine interbank security clearance and will release in 4 hours.
   - **Behavioral Psychology Benefit**: Breaking the scammer's real-time phone connection allows the victim to step out of the stress tunnel and speak with friends, family, or genuine bank representatives.
2. **Out-of-Band Call Verification**:
   - The bank's automated Interactive Voice Response (IVR) or a human fraud specialist places an outbound call to the registered phone number on a separate carrier line to confirm authorization.

---

## 4. Production Integration vs. Hackathon Simulation Boundary

| Feature / Capability | Production Target Architecture | Hackathon Prototype Implementation |
| :--- | :--- | :--- |
| **Payment Rail Interception** | Direct hook into Core Banking API & Payment Switch (ISO 8583 / ISO 20022 message interceptor). | Simulated Banking Client UI (React / Mobile Web) intercepting local mock payment submissions. |
| **Core Switch Hold** | True core-banking hold via ledger reservation API (`pacs.002` pending state). | In-memory transaction state machine simulating pending/cleared/rejected ledger balances. |
| **Mule Account Freeze** | Automated `camt.056` recall message broadcast to partner banking APIs. | Simulated interbank webhook emitting JSON event payloads to an inspector dashboard. |
| **Client Device Telemetry** | Native Kotlin/Swift SDK reading Android `TelecomManager` and `AccessibilityService` APIs. | Browser-based Web Audio, focus tracking, and synthetic telemetry slider injection console. |

---

## 5. Failure Behavior, Error Handling & Safety Guardrails

```text
[Intervention Failure Scenario]           [Architectural Safety Behavior]
Client Modal Rendering Crash ───────────► SDK catches uncaught exception; reverts to native alert dialog.
Countdown Timer Hijacking / Speed-up ───► Timer validated on SDK native layer; client-side tamper proofing.
Customer Refuses to Interact / Quits ────► Transaction remains unexecuted; reservation lock expires after 180s.
Backend Directive Network Timeout ──────► SDK engages local fail-safe rule: If amount > $500, prompt step-up auth.
```

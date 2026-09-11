# Behavioral and Device Intelligence: Sensor Dynamics, Coercion Telemetry, and Device Binding

---

## 1. Executive Understanding
In Authorized Push Payment (APP) scams, the credentials are valid, the MPIN is correct, and the device hardware is authentic. Therefore, **conventional identity verification (AuthN) completely fails**. The only observable distinction between a legitimate user paying a friend and a coerced user paying an extortionist lies in the **micro-behavioral and physical telemetry of the transaction session**.

Behavioral intelligence captures how the user interacts with their device: the physical rhythm of typing, screen dwell times, device orientation stability, clipboard interactions, and concurrent background telephony. Under psychological coercion or active scammer coaching, **human interaction dynamics exhibit measurable physiological stress, hesitation, and robotic obedience**.

---

## 2. Taxonomy of Behavioral and Device Signals

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                    BEHAVIORAL & DEVICE INTELLIGENCE MODALITIES                            │
├─────────────────────┬─────────────────────────────────────┬──────────────┬────────────────┤
│ MODALITY            │ SENSOR TELEMETRY                    │ LATENCY      │ DISCRIMINATIVE │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **1. Keystroke &    │ • Touch dwell time (key-down to up) │ < 1 ms       │ High           │
│   Touch Dynamics**  │ • Flight time between numeric keys  │ (On-Device)  │ (Detects       │
│                     │ • Touch surface area & curvature    │              │  hesitation)   │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **2. Motion &       │ • Accelerometer variance (tremor)   │ 1 - 2 ms     │ Moderate       │
│   Orientation**     │ • Gyroscope rotational jitter       │ (On-Device)  │ (Detects panic/│
│                     │ • Device pitch/roll during auth     │              │  unusual angle)│
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **3. Navigation &   │ • Confirmation screen dwell time    │ < 1 ms       │ Extremely High │
│   Interaction**     │ • Clipboard-to-field paste latency  │ (On-Device)  │ (Distinguishes │
│                     │ • Backspace / correction frequency  │              │  deliberation) │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **4. Environmental  │ • Active cellular call state        │ < 1 ms       │ Decisive       │
│   & Concurrency**   │ • Foreground screen-sharing check   │ (Android OS) │ Conjunction    │
│                     │ • Audio headset / speakerphone flag │              │ Multiplier     │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **5. Device Hard-   │ • Google Play Integrity API token   │ 50 - 200 ms  │ Foundational   │
│   ware & Binding**  │ • SIM-hardware binding (IMSI hash)  │ (Token cache)│ Baseline       │
│                     │ • Root / Magisk / Zygisk presence   │              │ (Anti-emulator)│
└─────────────────────┴─────────────────────────────────────┴──────────────┴────────────────┘
```

---

## 3. Deep Telemetry Mechanics in Payment Coercion

### 1. The "Coaching" Signature (Active Telephony + Rapid Paste)
When a victim is guided by a phone scammer (e.g., fake customer support or digital arrest):
1. **Telephony State:** Android's `TelephonyManager` indicates `CALL_STATE_OFFHOOK` (Active cellular call).
2. **Clipboard Paste Velocity:** The user pastes a beneficiary VPA or account number within **$<100\text{ms}$** of focusing the input field, indicating it was copied directly from an external messaging app (WhatsApp/Telegram) during the call.
3. **Screen Dwell Anomaly:** The user lingers on the beneficiary confirmation screen for an abnormally long period ($>15\text{s}$ vs. normal $2.2\text{s}$) while listening to verbal instructions from the scammer, followed by rapid MPIN submission.

```
                    THE SOCIAL ENGINEERING SENSOR SIGNATURE
  [Active Phone Call Running] ───┐
                                 ├─► [High-Entropy Conjunction Detected]
  [VPA Instant Clipboard Paste] ─┤   • P(Scam) jumps from 0.02 to 0.91
                                 │   • Triggers Cognitive Interruption Shield
  [Screen Dwell Time = 18.4s] ───┘
```

### 2. Keystroke Hesitation vs. Robotic Fluency
- **Normal Legitimate Payment:** The user enters their 4-digit or 6-digit MPIN with a consistent, muscle-memory rhythm (Flight time between digits: $120\text{ms} \pm 25\text{ms}$; zero backspaces).
- **Extortion / Panic State:** When subjected to high-stress digital arrest threats, users exhibit:
  - High variance in inter-digit flight times ($>450\text{ms}$ between digits).
  - Multiple backspaces and corrections on familiar input screens.
  - Micro-tremors detected via 100Hz gyroscope polling (hand jitter $>3\sigma$ above resting baseline).

---

## 4. Hardware Integrity and NPCI SIM-Binding Mandates

Under **NPCI Circular NPCI/UPI/OC-121/2021-22**, UPI applications must enforce strict **Device-to-SIM Binding**:
- During onboarding, the app sends an encrypted SMS from the physical SIM card to the bank's SMS gateway, cryptographically binding the bank account to the phone's hardware ID and SIM IMSI.
- If the SIM is removed, or if the app is cloned inside a virtual sandbox or emulator, the binding is immediately invalidated.
- **Limitation:** Device binding is a powerful defense against Account Takeover (ATO) and credential stuffing, but **provides zero protection against APP scams**, where the authentic user operates their own bound device.

---

## 5. Failure Modes, False Positives, and Regulatory Constraints

1. **Physical Motion Noise:** A legitimate user authorizing a quick payment while walking, running for a bus, or sitting in a bumpy autorickshaw generates accelerometer jitter and high touch variance identical to physiological panic.
2. **Disability and Age Biases:** Elderly users naturally exhibit slower keystroke flight times, frequent backspaces, and prolonged screen dwell times. Naive models penalize elderly users with constant false-positive blocks.
3. **Privacy and DPDP Act 2023 Compliance:** Under India's **Digital Personal Data Protection Act (DPDP) 2023**, raw sensor streams (accelerometer, touch coordinates) can be classified as behavioral biometric data. Systems must process sensor dynamics **strictly on-device** into ephemeral summary metrics, preventing raw biometric exfiltration to cloud servers.

---

## 6. Epistemic Assessment for PS09

| Dimension | Behavioral Intelligence Capability | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **AuthN vs. AuthZ Detection** | **High:** The only layer capable of distinguishing an authorized user from a coerced user. | Essential telemetry component on the **client-side guardian module**. |
| **Execution Latency** | **Instant (Sub-2ms):** Computed entirely on-device via lightweight native Android/iOS SDK code. | Feasible to evaluate synchronously prior to launching the MPIN entry screen. |
| **Standalone Reliability** | **Moderate (Prone to physical noise):** Cannot be used in isolation to block payments. | Must serve as a **contextual risk multiplier**, never an autonomous blocker. |
| **OS Permission Boundaries** | **Restricted:** Apple iOS sandboxing hides call states; Android hides OTT VoIP calls without restricted permissions. | System must degrade gracefully when advanced sensor telemetry is unavailable. |

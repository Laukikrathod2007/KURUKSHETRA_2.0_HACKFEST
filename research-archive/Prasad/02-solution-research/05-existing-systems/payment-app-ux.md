# Payment App UX: User Journeys, Common Library Hand-off, and Cognitive Blind Spots

---

## 1. Executive Understanding
To build an effective payment scam interceptor, one must deeply understand the **exact user experience and interface constraints of modern UPI applications** (Google Pay, PhonePe, Paytm, BHIM). 

A critical architectural reality of UPI is the **Common Library (CL) Sandbox Boundary**: the moment a user taps "Pay", the hosting TPAP application relinquishes control to an isolated, secure OS activity managed directly by NPCI for MPIN entry. **Third-party software cannot intercept, monitor, or render overlays on top of the MPIN screen.** Therefore, any guardian intervention must execute **strictly during the Pre-PIN Review window within the TPAP application**.

---

## 2. The Standard UPI User Flow and Interception Chokepoint

```
                      END-TO-END UPI USER INTERACTION FLOW
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 1: INGRESS & BENEFICIARY SELECTION                                     │
  │ • User scans QR, enters VPA string, or selects phone contact                │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 2: ADDRESS RESOLUTION & VERIFIED NAME DISPLAY (`RespValAdd`)          │
  │ • App fetches legal KYC name from CBS; displays "Verified Name: X"          │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 3: AMOUNT & PAYMENT NOTE ENTRY                                         │
  │ • User types ₹ Amount and optional text note (`tn`)                         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 4: PRE-PIN CONFIRMATION SCREEN (THE CHOKEPOINT)                        │
  │ • Screen shows Account to debit, Payee Name, Amount, "Pay Now" button       │
  │ • Dwell time: 1.5s - 5.0s                                                   │
  │ >>> **THE EXACT ARCHITECTURAL CHOKEPOINT FOR PS09 GUARDIAN** <<<            │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ [User Taps "Pay Now"]
                                         ▼
  ═══════════════════════════════════════════════════════════════════════════════
  NPCI COMMON LIBRARY (CL) BOUNDARY (ISOLATED OS ACTIVITY - FLAG_SECURE)
  ═══════════════════════════════════════════════════════════════════════════════
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 5: MPIN INPUT SCREEN                                                   │
  │ • Rendered by NPCI CL SDK; isolated keypad; screenshots blocked             │
  │ • ZERO TPAP OR GUARDIAN ACCESS POSSIBLE                                     │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ [User Submits MPIN]
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ STEP 6: POINT OF IRREVERSIBLE COMMIT (PIC) & SETTLEMENT                     │
  │ • Encrypted MPIN routed to Issuing Bank CBS; funds debited irrevocably       │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cognitive UX Vulnerabilities in Leading Payment Apps

### 1. Habituation and "Banner Blindness"
Leading apps (Google Pay, PhonePe) display warnings when transferring to a new payee:
- **Visual Design:** A small yellow or gray box stating: *"You're paying someone not in your contacts. Take care."*
- **Psychological Reality:** Because users transfer money to new autorickshaw drivers, vegetable vendors, and small merchants daily, **this banner appears dozens of times a week on legitimate payments**.
- **Result:** The human brain filters out repetitive, non-specific stimuli. Under psychological coercion (e.g., a fake police officer shouting over a phone call), the victim's gaze bypasses the banner completely, focusing exclusively on the bright purple "Proceed to Pay" button.

### 2. The "Verified Name" False Sense of Security
When a user types a scammer's VPA, the app displays:
`Verified Name: SUNIL KUMAR ✔`
- The green checkmark or the word "Verified" is intended to indicate that NPCI successfully resolved the bank account KYC name.
- **Cognitive Misinterpretation:** Lay users frequently interpret the green checkmark as an endorsement of **legitimacy or safety** by Google or PhonePe ("Google has verified this person, so it must not be a fraud").

### 3. The "Collect Request" Cognitive Inversion
One of the most persistent UPI scam vectors involves the **Collect Request (`ReqPay`)**:
- A fraudster on OLX claims they want to send money to the victim to buy an item.
- The fraudster initiates a UPI Collect Request for ₹15,000.
- The victim receives a push notification and opens the app. The screen asks for their UPI PIN.
- The scammer tells the victim: *"Enter your PIN to accept the funds into your bank account."*
- **The Architectural Reality:** In UPI, **entering a PIN is exclusively an action to DEBIT money, never to receive money**. Despite text labels on screen, cognitively distracted victims repeatedly enter their PIN, authorizing a massive outbound debit.

---

## 4. Designing Coexisting Interventions: Friction Principles

A guardian application must coexist with existing app UX without destroying the seamless convenience that makes digital payments viable:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                       UX FRICTION SPECTRUM FOR GUARDIAN                                   │
├───────────────────┬─────────────────────────────────┬─────────────────────────────────────┤
│ FRICTION LEVEL    │ INTERFACE MECHANISM             │ WHEN DEPLOYED                       │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Zero Friction** │ Completely silent; invisible    │ Low Risk ($P < 0.15$); Known Payee; │
│ (Fast Path)       │ execution straight to MPIN      │ Daily routine micro-payment         │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Tier 1: High-   │ High-contrast entity breakdown: │ New Payee; Mild ticket size anomaly;│
│  Salience Banner**│ "Paying INDIVIDUAL, not utility"│ No coercion signals ($0.15 < P <0.4)│
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Tier 2: Contex- │ Interactive dialog forcing      │ Strong impersonation discrepancy;   │
│  tual Challenge** │ user to type confirmation word  │ Active phone call ($0.4 < P < 0.75) │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Tier 3: Cooling-│ Enforced 10-minute pause;       │ Severe scam indicators; known mule  │
│  Off Timeout**    │ forces user to hang up call     │ network pattern ($P > 0.75$)        │
└───────────────────┴─────────────────────────────────┴─────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

1. **Pre-PIN Placement is Mandatory:** The Guardian must actuate its analysis and UI intervention **before the user enters the NPCI Common Library activity**. Once the user is on the PIN pad, interception is technically impossible.
2. **Eliminate Passive Generic Warnings:** Static text banners are ineffective. Interventions must use **dynamic, context-specific cognitive friction** that forces the user to actively read and acknowledge the specific contradiction (e.g., typing the payee's actual legal name).
3. **Guard Against Habituation:** High-friction interventions must be reserved for the **top 1% of transactions**; over-triggering friction causes users to disable the guardian or develop habituation.

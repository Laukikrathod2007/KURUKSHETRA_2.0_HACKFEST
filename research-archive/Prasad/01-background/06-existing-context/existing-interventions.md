# Existing Security Interventions: Real-World Mechanisms, Triggers, and Evasion Tactics

---

## 1. Executive Understanding (Layer 1)
Payment networks and mobile fintech applications employ a range of security interventions designed to protect users at various points in the customer journey. These interventions span **passive advisory banners, active modal confirmations, step-up biometric challenges, delayed transaction holds, and hard account-level velocity restrictions**.

While each intervention was designed with valid security intentions, their real-world efficacy in preventing Authorized Push Payment (APP) scams has been severely limited. Scammers systematically analyze these interventions and **engineer pre-emptive counter-scripts** that coach victims to neutralize, dismiss, or circumvent the protection before the payment is dispatched.

---

## 2. Comparative Matrix of Real-World Interventions (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXISTING SECURITY INTERVENTIONS SPECTRUM                 │
├─────────────────────┬───────────────────┬───────────────────────────────────┤
│ INTERVENTION TYPE   │ OPERATIONAL LOCUS │ PRIMARY EVASION TACTIC            │
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **1. Passive Banner**│ Bottom of Confirm │ Inattentional blindness; victim's │
│ (Text Warning)      │ Screen in App     │ eyes fixate entirely on "Pay" btn │
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **2. Modal Dialog** │ Blocking Pop-up   │ Habituation reflex; user clicks   │
│ (Click to Dismiss)  │ requiring tap     │ "Proceed" in $<300\text{ ms}$     │
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **3. Dynamic Risk** │ High-contrast red │ Scammer coaches: "Ignore the red  │
│    **Badge**        │ warning border    │ text, it's just a routine glitch" │
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **4. New Beneficiary│ Bank Core CBS /   │ Scammer instructs victim to split │
│    **Cooling Hold** │ Netbanking        │ into ₹10k tranches below the limit│
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **5. Step-Up 2FA**  │ In-app SMS OTP    │ Victim willingly types the OTP to │
│    **(Biometric)**  │ or FaceID prompt  │ satisfy the scammer's instruction │
├─────────────────────┼───────────────────┼───────────────────────────────────┤
│ **6. Hard Account** │ Bank CBS or NPCI  │ Scammer directs victim to a       │
│    **Freeze**       │ Switch Core       │ secondary bank account / app      │
└─────────────────────┴───────────────────┴───────────────────────────────────┘
```

---

## 3. Deep Analysis of Intervention Mechanisms (Layer 3)

| Intervention Mechanism | Real-World Industry Example | Trigger Conditions | Reversibility | Operational Purpose | Why Scammers Routinely Bypass It |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Passive Security Banner** | Google Pay *"Unfamiliar Contact"* footer banner. | Payee VPA not found in user's phonebook. | **Instantaneous** (Non-blocking). | Educate user without interrupting checkout velocity. | **Completely Ignored:** Visual salience is too low; zero cognitive disruption. |
| **Dismissible Warning Modal** | PhonePe *"First-time Payment to Individual"* popup. | Recipient VPA has zero transaction history with sender. | **Reversible** (User taps "Pay Anyway"). | Force explicit consent; shift legal liability to user. | **Inoculation Script:** Scammer tells victim in advance: *"An alert will pop up, just tap Continue."* |
| **New Beneficiary Velocity Cap** | State Bank of India (SBI) YONO ₹50,000 first-day cap. | Adding a new beneficiary for IMPS/NEFT transfers. | **Deterministic** (24-hour cooling period). | Prevent massive instant balance drainage by account hijackers. | Scammers tell victim to switch to UPI P2P, which has higher instant limits, or use multiple banks. |
| **Mandatory Cooling-Off Hold** | Commonwealth Bank of Australia (CBA) 24h Crypto Hold. | Outbound transfers to cryptocurrency exchanges. | **Reversible** (Funds held in escrow for 24 hours). | Provide a temporal window for panic adrenaline to clear. | Highly effective against crypto scams, but rarely implemented in India due to merchant backlash. |
| **Remote Access App Detection** | Paytm / BHIM auto-lock on AnyDesk / TeamViewer. | Active Accessibility API usage by known screen-share package. | **Non-Reversible** until remote software uninstalled. | Prevent scammers from viewing OTPs and credentials via screen-share. | Scammers tell victim: *"Uninstall AnyDesk and let's do this over WhatsApp video call instead."* |

---

## 4. Boundaries & Epistemic Realities for PS09 (Layer 4)

### 4.1 The "Inoculation Counter-Script" Phenomenon
* The defining characteristic of professional scam syndicates is that they **study banking security interventions more rigorously than average users do**.
* When banks deploy a new warning screen, scam call centers immediately update their training scripts:
  > *"Sir, when you click proceed, your bank server will show a security message saying 'Account unverified'. Do not panic. That is because the CBI escrow account is a high-security government account. Click 'Agree' so the verification token is registered."*
* By "inoculating" the victim before the app can warn them, the scammer turns the bank's own security warning into **proof of the scammer's insider knowledge**!
* **The Epistemic Takeaway for PS09:** Static warnings are dead on arrival. Interventions must be **dynamic, narrative-disruptive, and cognitive**—forcing the user to break verbal contact with the scammer or answer questions that the scammer's script cannot explain away.

---
**Primary References:**
1. Commonwealth Bank of Australia (CBA): *Assessment of 24-Hour Crypto Payment Holds on Customer Scam Losses (2023)*.
2. UK Payment Systems Regulator: *Evaluating the Effectiveness of Confirmation of Payee and Warning Screens*.
3. Journal of Financial Crime: *The Inefficacy of Passive Warnings in Countering Social Engineering in Instant Payment Networks*.

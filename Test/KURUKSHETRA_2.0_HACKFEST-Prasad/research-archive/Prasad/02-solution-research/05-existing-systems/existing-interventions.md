# Existing Intervention Models: Friction Gradients, Cognitive Interruption, and Asymmetric Costs

---

## 1. Executive Understanding
In cybersecurity, detection without effective intervention is academic vanity. If a fraud engine calculates a 99% probability of a scam but responds with a dismissible dialog box that the victim closes in 200 milliseconds, **the security system has suffered a total functional failure**.

Intervention is the art and science of **applying calibrated operational friction to halt malicious fund flows while preserving frictionless execution for legitimate commerce**. In Authorized Push Payment (APP) scams, where the victim is actively cooperating with the attacker, intervention must do something far more difficult than blocking malware: **it must shatter psychological coercion and restore the victim's rational agency**.

---

## 2. The Comprehensive Intervention Spectrum

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE INTERVENTION SPECTRUM                                       │
├───────────────────┬─────────────────────────────────┬──────────────┬──────────────────────┤
│ INTERVENTION TYPE │ USER EXPERIENCE MECHANISM       │ FRICTION     │ BEST SUITED FOR      │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **1. Silent Pass**│ Zero delay; immediate transition│ None         │ Known payees; routine│
│                   │ to MPIN entry screen            │              │ low-value transfers  │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **2. Salient      │ High-contrast entity breakdown: │ Low          │ Mild anomalies; first│
│   Advisory**      │ "Payee KYC: INDIVIDUAL"         │ (Visual only)│ transfer to vendor   │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **3. Explicit     │ Mandatory checklist: "I verify  │ Moderate     │ Unverified merchant; │
│   Acknowledgment**│ I am not on a phone call"       │ (2 - 4 sec)  │ elevated amount      │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **4. Cognitive    │ User must manually type the     │ High         │ High impersonation   │
│   Challenge**     │ payee's real legal bank name    │ (8 - 15 sec) │ risk; active call    │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **5. Enforced     │ 10-minute to 4-hour hold before │ Extremely    │ Extreme ticket size; │
│   Cooling-Off**   │ settlement; revocable by user   │ High         │ suspected extortion  │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **6. Trusted Circle│ Push notification sent to       │ Collaborative│ Vulnerable elderly;  │
│   Escalation**    │ designated family member        │ (Off-device) │ large life savings   │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **7. Hard Block** │ Transaction terminated; error   │ Total        │ Confirmed I4C police │
│                   │ code returned (`U16`)           │ (Terminal)   │ blacklist; malware   │
└───────────────────┴─────────────────────────────────┴──────────────┴──────────────────────┘
```

---

## 3. Deep Analysis: Cognitive Challenges vs. Passive Dialogs

### Why Passive Dialogs Fail Against Social Engineering
When an attacker conducts a "Digital Arrest" or "Utility Disconnection" scam, they instruct the victim:
> *"The app will show you a warning. That is a routine technical glitch. Just tap 'Agree' and enter your PIN immediately."*

Because passive pop-up buttons require only a single motor reflex (tapping "Confirm" or "OK"), the victim's brain processes the action through **System 1 (Automatic / Reflexive Thinking)**, completely bypassing rational analysis.

### The Cognitive Challenge: Forcing System 2 Deliberation
A cognitive challenge forces the brain to switch to **System 2 (Deliberative / Effortful Thinking)**:
1. **The Legal Name Typing Challenge:** The app disables the "Pay" button and presents an input field:
   > *"You indicated you are paying 'Electricity Department'. However, this bank account legally belongs to **Suresh Kumar**. To proceed, please type 'Suresh Kumar' in the box below."*
2. **The Call-Termination Interlock:** If the OS detects an active background phone call during an ambiguous high-risk payment:
   > *"Security Interlock Active: High-risk payment initiated during an active phone call. For your protection, this payment cannot proceed while you are on a call. Please hang up the call to unlock payment."*
   - This physically severs the scammer's real-time psychological tether over the victim.

---

## 4. Enforced Cooling-Off Periods and Reversibility

In traditional banking (NEFT/RTGS), banks enforce a **2-hour or 4-hour cooling-off period** when a user adds a new beneficiary, restricting the maximum transferable amount to ₹10,000–₹50,000 during the initial window.
- **The UPI Tension:** UPI was designed specifically to eliminate cooling-off delays for instant merchant and peer transfers.
- **Dynamic Cooling-Off:** In 2024–2026, the RBI and NPCI proposed introducing a **4-hour dynamic cooling-off period for first-time payments exceeding ₹2,000 between unlinked users**.
- **Mechanics:** The remitter's account is debited immediately, but the funds are held in a secure escrow buffer at the remitter's bank for 4 hours before credit to the beneficiary. The remitter can cancel the transfer with a single tap if they realize they were defrauded.

---

## 5. The Asymmetric Cost of False Positives

In fraud intervention design, **a false positive is not merely an inconvenience; it can be an emergency disaster**:

```
                    THE DUAL COSTS OF INTERVENTION ERRORS
  ┌──────────────────────────────────────────────┐
  │ FALSE NEGATIVE (Scam Allowed)                │
  │ • Victim loses ₹1,00,000 life savings.       │
  │ • Emotional devastation and distress.        │
  │ • Reputational damage to bank and UPI.       │
  └──────────────────────────────────────────────┘
                         VS
  ┌──────────────────────────────────────────────┐
  │ FALSE POSITIVE (Legitimate Block)            │
  │ • Patient denied admission to ICU hospital.  │
  │ • Traveler stranded at airport midnight.     │
  │ • Severe legal and regulatory ombudsman risk.│
  └──────────────────────────────────────────────┘
```

**Design Rule:** Hard blocks must be reserved strictly for **provably malicious entities** (e.g., active police blacklist hit or active AnyDesk malware). For ambiguous transactions, systems must use **adaptive friction (cognitive challenges or temporary cooling-off)** that allows legitimate users to complete their payments after verified deliberation.

---

## 6. Epistemic Assessment for PS09

| Dimension | Intervention Strategy Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Primary Mechanism** | **Cognitive Interruption:** Breaks psychological coercion without causing irreversible false-positive lockouts. | Must be the core intervention mode when social engineering is detected. |
| **Severing Attack Channel** | **Active Call Interlock:** Forcing call disconnection destroys remote coaching. | Implement a specific interlock when high-value transfers coincide with phone calls. |
| **Hard Blocking Bounds** | **Strictly Constrained:** Hard blocks must never be triggered by an AI model's probabilistic output. | Hard blocks are restricted to deterministic rule violations (malware/blacklist). |

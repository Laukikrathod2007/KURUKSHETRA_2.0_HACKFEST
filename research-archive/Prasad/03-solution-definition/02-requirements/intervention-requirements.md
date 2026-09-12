# Intervention Requirements: Graded Cognitive Friction, Amount-Scaled Thresholds, and Interlock Protocols

---

## 1. Executive Understanding
In Authorized Push Payment (APP) scam defense, **the intervention is the actual point of protection**. If an algorithm detects a scam with 99.9% accuracy but responds with an easily dismissible text pop-up, the security system suffers complete operational failure because a coerced victim will reflexively click "OK" without reading.

Intervention requirements specify the **exact mechanical, visual, and cognitive friction mechanisms** GuardianPay deploys to break psychological compliance, shatter extortion narratives, and interlock transaction execution before the user enters their MPIN.

---

## 2. The Five-Tier Graded Intervention Spectrum

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE GRADED INTERVENTION SPECTRUM                             │
├────────┬─────────────────────────┬──────────────┬─────────────────────────────────────────┤
│ TIER   │ INTERVENTION NAME       │ USER FRICTION│ OPERATIONAL TRIGGER CONDITION           │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T0** │ **Fast-Path Pass**      │ **Zero**     │ $P(\text{Scam}) < 0.15$; Known Payee;   │
│        │ (Invisible Execution)   │ (0 ms delay) │ Routine daily micro-payment             │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T1** │ **Salient Advisory**    │ **Low**      │ $0.15 \le P < 0.40$; New Payee; Normal  │
│        │ (Contextual Banner)     │ (Visual only)│ ticket size; Zero active call flags     │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T2** │ **Cognitive Challenge** │ **Moderate** │ $0.40 \le P < 0.75$; Entity-Purpose     │
│        │ (Legal Name Typing)     │ (5 - 12 sec) │ Clash detected; Unverified Individual   │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T3** │ **Call Interlock**      │ **High**     │ $P \ge 0.75$ AND `CALL_STATE_OFFHOOK`   │
│        │ (Disconnect Required)   │ (Active hold)│ Coercive extortion / "Digital Arrest"   │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T4** │ **Dynamic Cooling-Off** │ **Extreme**  │ First-time transfer $> ₹25,000$ to      │
│        │ (4-Hour Revocable Hold) │ (Time delay) │ fresh account with high velocity spike  │
├────────┼─────────────────────────┼──────────────┼─────────────────────────────────────────┤
│ **T5** │ **Deterministic Block** │ **Total**    │ Active AnyDesk / Screen-share APK OR    │
│        │ (Terminal Refusal)      │ (No bypass)  │ Confirmed I4C National Police Blacklist │
└────────┴─────────────────────────┴──────────────┴─────────────────────────────────────────┘
```

---

## 3. Detailed Specifications for Intervention Tiers

### IR-TIER-01: Tier 1 Salient Visual Advisory (Non-Blocking)
- **Requirement:** When risk score $0.15 \le P < 0.40$, the UI MUST render a high-contrast card above the "Proceed" button displaying:
  1. The resolved Core Banking KYC Legal Name (`RespValAdd`).
  2. The account category (`INDIVIDUAL PERSONAL ACCOUNT` vs. `VERIFIED MERCHANT`).
  3. The number of days the beneficiary VPA has been active in the network.
- **Behavior:** The "Proceed" button remains active. The user is not forced to type anything. Provides high salience without annoying legitimate shoppers.
- **Priority:** MUST HAVE.

### IR-TIER-02: Tier 2 Cognitive Challenge Interlock (System 2 Disruption)
- **Requirement:** When risk score $0.40 \le P < 0.75$ or when an Entity-Purpose Semantic Clash is detected:
  1. The system MUST **disable the "Pay" button**.
  2. The UI renders a dedicated **Cognitive Challenge Screen** stating:
     > *"Security Notice: You indicated this payment is for **[Stated Purpose]**. However, this bank account legally belongs to an individual: **[Resolved Legal Name]**. Electricity boards, police, and government agencies NEVER collect fees via individual personal accounts."*
  3. The screen renders an input box: *"To confirm you personally know and intend to pay this specific individual, please type **[Resolved Legal Name]** below."*
  4. The "Pay" button unlocks ONLY when the typed string exactly matches the legal name.
  5. The screen provides a prominent red button: **"Cancel Payment & Report Scam"**.
- **Rationale:** Forces the victim out of System 1 automated obedience into deliberate System 2 reality testing.
- **Priority:** MUST HAVE.

### IR-TIER-03: Tier 3 Active Call-Termination Interlock
- **Requirement:** When risk score $P \ge 0.75$ and `CALL_STATE_OFFHOOK = TRUE`:
  1. The system MUST **lock the payment workflow completely**.
  2. The screen displays an unyielding security warning:
     > *"CRITICAL SECURITY INTERLOCK: High-risk payment initiated during an active phone call. Law enforcement officers, CBI agents, and bank managers NEVER conduct official investigations over phone calls or demand money via UPI.*
     > 
     > ***This payment cannot proceed while you are on a phone call. Please hang up your call to unlock this screen.***"*
  3. The client SDK registers a telephony listener; the screen remains locked until `CALL_STATE_IDLE` is broadcast by the Android OS.
- **Rationale:** Real-time social engineering depends entirely on the scammer maintaining constant verbal pressure over the phone. Severing the call destroys the psychological tether.
- **Priority:** MUST HAVE.

### IR-TIER-04: Tier 4 Dynamic Cooling-Off Escrow Hold
- **Requirement:** For transactions exceeding ₹25,000 to first-time unlinked beneficiaries where risk is ambiguous ($P \ge 0.60$):
  1. The payment is debited from the remitter but held in an escrow buffer for **4 hours** before credit to the beneficiary.
  2. The remitter receives a persistent notification: *"Transfer of ₹X scheduled to complete in 4 hours. Tap here to cancel and refund if you suspect fraud."*
  3. If the user reports fraud within 4 hours, the funds are instantly returned to their account.
- **Priority:** SHOULD HAVE (Aligns with RBI 2024 proposed cooling-off mandates).

### IR-TIER-05: Tier 5 Deterministic Hard Block
- **Requirement:** If an active remote-access APK is detected (AnyDesk/TeamViewer) or the beneficiary VPA matches an active police FIR hash in the I4C blacklist:
  1. The payment is terminated immediately with error code `U16 - Risk Threshold Exceeded`.
  2. The user is presented with a non-bypassable educational modal explaining the exact malware or blacklist finding.
- **Priority:** MUST HAVE.

---

## 4. Dynamic Threshold Scaling by Financial Magnitude

In compliance with cost-sensitive decision theory, **decision thresholds are not static; they shift dynamically based on transaction amount**:

$$\tau^*(\text{Amount}) = \frac{C_{\text{FP}}}{C_{\text{FP}} + \text{Amount}}$$

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      AMOUNT-SCALED DECISION THRESHOLDS                                    │
├─────────────────────┬──────────────┬──────────────┬──────────────┬────────────────────────┤
│ TICKET SIZE BRACKET │ AMOUNT RANGE │ T1 ADVISORY  │ T2 CHALLENGE │ T3 CALL INTERLOCK      │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Micro-Commerce**  │ < ₹500       │ $P \ge 0.35$ │ $P \ge 0.70$ │ $P \ge 0.90$           │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Standard Retail** │ ₹500 - ₹5,000│ $P \ge 0.20$ │ $P \ge 0.50$ │ $P \ge 0.80$           │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Elevated Value**  │ ₹5k - ₹25k   │ $P \ge 0.12$ │ $P \ge 0.35$ │ $P \ge 0.70$           │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Critical / Life** │ > ₹25,000    │ $P \ge 0.05$ │ $P \ge 0.20$ │ **$P \ge 0.50$**       │
└─────────────────────┴──────────────┴──────────────┴──────────────┴────────────────────────┘
```

- **Impact:** For a ₹100 chai payment, the threshold for friction is high ($P \ge 0.70$), preventing false alarm annoyances. For a ₹75,000 transfer, even slight suspicion ($P \ge 0.20$) immediately triggers the cognitive legal name challenge.

---

## 5. Epistemic Assessment for PS09

| Principle | Architectural Rule |
| :--- | :--- |
| **No Passive Banners on High Risk** | Replace passive warnings with **active typing challenges**. |
| **Physical Channel Severing** | The **Call Interlock** physically terminates the scammer's real-time coercion. |
| **Proportional Friction** | Micro-payments remain frictionless; life-savings transfers face intense cognitive scrutiny. |

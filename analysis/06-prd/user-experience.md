# User Experience & Interaction Logic

## 1. Executive Summary & Core UX Principles

The user experience of the *Agentic Guardian for Real-Time Payment Scam Interception* is not an aesthetic decoration; it is a **safety-critical behavioral circuit breaker**. Traditional anti-fraud UI patterns—such as generic modal popups with bright red text and a solitary "OK" button—fail completely because conditioned cognitive automaticity allows users to dismiss them in under 800 milliseconds without reading.

In strict compliance with Part 7 of the Phase 6 mandate, this document defines the **interaction logic** of the bare-minimum product. It specifies what information is presented, when it appears, the decision the user must confront, the actions available, and the post-decision state transitions.

```text
                               CORE INTERACTION LOGIC
                               
  [Drafting Window]  ──────► Passive Telemetry Capture (Completely Invisible)
           │
  [Tap Proceed]      ──────► In-Line Evaluation (≤45ms - Zero Noticeable Delay)
           │
           ├────────────────────────┬────────────────────────┐
           ▼                        ▼                        ▼
     [Level 1: ALLOW]        [Level 2: INFORM]       [Level 3: INTERVENE]
     Direct to PIN entry     Ambient Info Banner     Stateful De-Biasing Dialog
     (Standard Journey)      (Non-blocking advice)   (Blocks PIN until resolved)
                                                             │
                                                     ┌───────┴───────┐
                                                     ▼               ▼
                                              User Cancels    User Completes
                                              (Aborts Fraud)  Cognitive Gate
                                                                     │
                                                                     ▼
                                                              PIN Pad Unlocked
```

---

## 2. Interaction Flows by Operational Risk Tier

### 2.1 Tier 1 (Low Risk, $R < 0.30$): Zero-Friction Clearance
- **Context**: Routine recurring bill, peer-to-peer transfer to established contact, or standard retail merchant payment.
- **When User Sees It**: Immediately upon tapping "Proceed to Pay".
- **What User Sees**: Standard PIN entry pad or biometric prompt. Zero security warnings, zero interstitial dialogs, zero friction.
- **Action Available**: Enter PIN/biometric to authorize payment.
- **Post-Action State**: Core banking executes settlement; confirmation screen renders normally.

---

### 2.2 Tier 2 (Elevated Contextual Risk, $0.30 \le R < 0.65$): Ambient Guidance
- **Context**: First-time transfer to a new peer payee, or minor uncharacteristic transaction timing, but with high epistemic confidence and no high-risk scam signals.
- **When User Sees It**: Directly on the payment confirmation / PIN entry screen.
- **What User Sees**: Non-blocking ambient advisory banner positioned directly above the payee name and amount:
  - *Information Displayed*: Recipient account tenure and relationship context (e.g., *"You are sending funds to a new payee for the first time. Recipient: [Name / Bank Name]"*).
- **Decision to Make**: Verify payee identity before typing credentials.
- **Action Available**: Proceed directly with PIN entry, or tap "Cancel" to abort.
- **Post-Action State**: User is never blocked; payment proceeds seamlessly upon PIN entry.

---

### 2.3 Tier 3 (High Risk Social Engineering, $0.65 \le R < 0.85$): Cognitive De-Biasing Intercept
- **Context**: High-probability social engineering scam detected (e.g., active phone call + uncharacteristic transfer + newly created mule recipient VPA + atypical touch hesitation).
- **When User Sees It**: Interstitial screen injected immediately upon tapping "Proceed to Pay", strictly **before the PIN pad is rendered**.
- **What User Sees**: Full-screen modal titled *"Security Verification & Safety Check"*:
  1. *Causal Risk Statement*: Clear, plain-language explanation of why the payment is flagged (e.g., *"This payment has been flagged because you are on an active phone call while transferring money to an account that was registered today"*).
  2. *Anti-Coaching Counter-Narrative*: Explicit neutralizer addressing scammer scripts:
     - *"Police, CBI, Customs, and Banks will NEVER ask you to move money to a 'safe account' or demand payment during a video call."*
     - *"If someone told you to tell the bank this is for family or an emergency, hang up immediately. You are speaking with an impersonator."*
  3. *Cognitive Challenge*: Interactive verification requiring active attention:
     - Prompts user to select the real-world reason for payment from a randomized set of options (e.g., "Personal purchase", "Government fine / bail", "Investment return guarantee", "Family support").
     - Randomized confirmation buttons: "Cancel & Protect My Funds" (highlighted primary) and "I Personally Know the Payee, Proceed" (disabled for a mandatory 5-second reading dwell time).
- **Decisions to Make**:
  - Does the transfer match the documented scam patterns?
  - Is the user currently following instructions from an unverified caller?
- **Actions Available**:
  - *Option A (Cancel)*: Tapping "Cancel & Protect My Funds" immediately aborts the transaction, prevents debit, and transitions the account into the 48-Hour Post-Incident Protective State (`REQ-IND-004`).
  - *Option B (Proceed)*: After the 5-second dwell time expires, user selects the payment reason and taps proceed. The dialog closes, and the standard PIN pad is unlocked.
- **Post-Action State**: If user authorizes, the system logs the override and streams an asynchronous out-of-band mule alert (`CAP-09`) to the recipient bank upon settlement.

---

### 2.4 Tier 4 (Severe Anomaly / Structured Liquidation, $R \ge 0.85$): Temporal Cooling-Off Hold
- **Context**: Catastrophic loss risk (e.g., lifetime savings liquidation, multi-lakh transfer to confirmed mule cluster under coercive RAT/call manipulation).
- **When User Sees It**: Directly upon payment submission.
- **What User Sees**: A dedicated holding screen titled *"Transaction Sequestered for Your Protection"*:
  1. *Hold Notice*: Informs user that funds have NOT left their bank account, but payment clearance is paused for a cooling-off window (e.g., 4 hours).
  2. *Active Call Guidance*: Advises user to hang up any active calls and call the bank's verified helpline directly from another device.
  3. *Immediate Cancellation Action*: Prominent "Cancel Transfer Now" button allowing instant self-service fund release back to available balance.
  4. *Emergency Life-Safety Exception*: Prominent secondary link: *"Is this an emergency medical or utility payment? Tap here for emergency bypass"* (`REQ-SAF-001`).
- **Emergency Bypass Flow**:
  - Tapping emergency bypass prompts user to affirm: *"I certify under penalty of fraud that this payment is for an urgent medical or humanitarian emergency."*
  - Tapping "Confirm Emergency" instantly releases the hold and routes the payment to the switch for clearance, logging the emergency declaration and routing the case to expedited SOC monitoring.
- **Post-Action State**: If user cancels, hold terminates; if cooling-off window expires without cancellation, payment auto-clears or routes to Tier-2 SOC analyst.

---

## 3. Human-in-the-Loop Analyst Experience

For bank SOC investigators triaging Level 3 overrides and Level 4 holds, the web-based workbench presents:
1. **Prioritized Queue**: Ranked by financial exposure and epistemic confidence.
2. **One-Page Synthesis Package**: Displays transaction timeline, behavioral anomaly scores, telephony flags, and recipient mule graph attributes.
3. **Dual-Control Actions**: Single-click "Release Hold" (requires second-analyst confirmation) or "Confirm Scam & Initiate Recovery".

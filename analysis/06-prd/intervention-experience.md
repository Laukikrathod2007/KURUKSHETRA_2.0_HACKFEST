# Intervention Experience & Cognitive Circuit Breakers

## 1. Executive Summary & Purpose

Intervention represents the definitive operational moment in the payment scam defense lifecycle. If intervention occurs **after** the user inputs their payment PIN, the funds are irrevocably cleared onto the national switch and the battle is lost. If intervention is **passive or generic**, the pre-coached victim clicks through the modal in milliseconds.

In strict compliance with Part 9 of the Phase 6 mandate, this document defines the functional behavior, timing, presentation, actions, fallbacks, and audit logging for all product interventions.

---

## 2. Core Intervention Behavior Matrix

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              INTERVENTION BEHAVIOR MATRIX                                              │
├──────────────┬────────────────────────┬─────────────┬─────────────────────┬──────────────────────┬─────────────────────┤
│ Intervention │ Operational Trigger    │ Max Latency │ Target Actor        │ Available Actions    │ Primary Fallback    │
├──────────────┼────────────────────────┼─────────────┼─────────────────────┼──────────────────────┼─────────────────────┤
│ INT-INFORM   │ Risk 0.30 - 0.65       │ ≤ 300ms     │ Payment Sender      │ Acknowledge / Cancel │ Silent Dismissal    │
│ INT-CHALLENGE│ Risk 0.65 - 0.85 (L3)  │ ≤ 300ms     │ Payment Sender      │ Answer Q&A / Abort   │ Route to Analyst    │
│ INT-HOLD     │ Risk ≥ 0.85 (L4)       │ ≤ 50ms      │ Sender & Core Bank  │ Cancel / Emerg Bypass│ Auto-expire / Clear │
│ INT-CONTAIN  │ Settlement of L3/L4 tx │ ≤ 60s       │ Recipient Bank      │ Debit Freeze / Queue │ Alert SOC Gateway   │
└──────────────┴────────────────────────┴─────────────┴─────────────────────┴──────────────────────┴─────────────────────┤
```

---

## 3. Detailed Specification of Intervention Modes

### 3.1 Mode 1: Contextual Advisory Banner (INT-INFORM)
- **Trigger**: Transaction evaluated with moderate risk ($0.30 \le R < 0.65$) indicating uncharacteristic timing or new payee, but without affirmative scam manipulation signals.
- **Timing**: Injected synchronously during confirmation screen rendering within $\le 300\text{ms}$ of "Proceed to Pay" tap.
- **Affected Actor**: Payment Sender.
- **Information Shown**: Non-alarmist, factual context regarding the counterparty:
  - *"New Payee Notice: You have never sent money to this account before. Account registered under: [Verified Name]."*
- **Available Actions**:
  - Tapping "Proceed": User proceeds directly to standard PIN entry.
  - Tapping "Cancel": Returns to payment drafting screen.
- **Outcome**: User is gently prompted to double-check recipient details; zero transaction blockage.
- **Fallback**: If banner fails to render within $300\text{ms}$, UI displays standard confirmation screen without delay.
- **Audit Requirement**: Log `banner_rendered: true`, timestamp, and whether payment proceeded.

---

### 3.2 Mode 2: Interactive Cognitive De-Biasing Challenge (INT-CHALLENGE)
- **Trigger**: Transaction evaluated with high risk ($0.65 \le R < 0.85$) indicating probable social engineering (e.g., active call + new beneficiary + typing hesitation).
- **Timing**: Injected immediately prior to PIN pad presentation; completely intercepts the authorization journey.
- **Affected Actor**: Payment Sender (Victim under potential coercion).
- **Information Shown**:
  1. *Typology-Specific Headline*: e.g., *"Urgent Safety Notice: Suspected Impersonation Call"*.
  2. *Causal Explanation*: *"You are currently on a phone call while transferring money to a recently opened personal account."*
  3. *De-Coaching Guidance*: *"Government agencies, police, and banks will NEVER instruct you to transfer money to a safe account or demand payment over the phone. Hang up your call."*
  4. *Interactive Attention Test*: Multiple-choice question: *"What is the real-world reason for this payment?"* with randomized option order.
- **Available Actions**:
  - *Action A (Cancel & Protect)*: Prominently styled primary button. Tapping immediately aborts payment and activates 48-Hour Protective State (`REQ-IND-004`).
  - *Action B (Proceed with PIN)*: Disabled for a mandatory 5-second reading dwell time; requires user to select a purpose option and check *"I understand the bank warned me of an active scam"*.
- **Outcome**:
  - If user cancels: Loss prevented; victim freed from scam trance.
  - If user proceeds: System logs explicit consumer override, releases PIN pad, and prepares downstream streaming containment alert.
- **Fallback**: If de-biasing dialog crashes or hangs, client defaults to fail-open, logging exception and allowing PIN entry (`REQ-RES-004`).
- **Audit Requirement**: Log dialog ID, presented typology, dwell time (ms), selected reason code, button tap events, and timestamp to WORM store.

---

### 3.3 Mode 3: Temporal Cooling-Off Hold (INT-HOLD)
- **Trigger**: Extreme risk ($R \ge 0.85$) on uncharacteristic high-value transfer, or multi-payment smurfing surge exceeding daily limits.
- **Timing**: Enforced in-line by payment switch gateway within $\le 45\text{ms}$.
- **Affected Actor**: Payment Sender and Core Banking Switch.
- **Information Shown**:
  - *"Payment Paused for Security: ₹50,000 held in your account for 4 hours."*
  - *"Funds have NOT left your account. If you were instructed to make this payment by an unknown caller, please cancel now."*
  - Dedicated countdown timer showing remaining cooling-off duration.
- **Available Actions**:
  - *Cancel Transfer*: One-tap immediate release of funds back to active spendable balance.
  - *Emergency Life-Safety Bypass*: Prompts user for medical/utility affirmation (`REQ-SAF-001`), immediately clearing payment.
  - *Call Fraud Support*: One-tap direct call to verified fraud desk.
- **Outcome**: Acute psychological panic decay; scammer loses temporal leverage.
- **Fallback**: If hold state times out without user action, funds auto-clear or route to Tier-2 SOC queue based on policy.
- **Audit Requirement**: Log hold initiation, exact duration, emergency bypass activations, and user cancellation events.

---

### 3.4 Mode 4: Out-of-Band Beneficiary Mule Containment (INT-CONTAIN)
- **Trigger**: Settlement debit confirmation on a transaction with risk $R \ge 0.70$ where the user bypassed Level 3 de-biasing.
- **Timing**: Dispatched asynchronously and received at beneficiary gateway within $\le 60\text{s}$ of debit.
- **Affected Actor**: Receiving Bank Fraud Gateway.
- **Information Provided**:
  - ISO 20022 `camt.056` XML/JSON envelope containing transaction ID, sending bank digital signature, transfer amount, recipient account number, and risk score.
- **Available Actions for Receiving Bank**:
  - Automatically place 2-hour provisional debit restriction on the transferred amount.
  - Flag beneficiary account for urgent mule desk review.
- **Outcome**: Syndicate attempts ATM cash-out or crypto purchase and is declined; stolen funds remain intact in the mule account for recovery.
- **Fallback**: If recipient bank gateway does not acknowledge receipt within 30s, message retries over secondary clearing channel.
- **Audit Requirement**: Cryptographically signed transmission receipt logged in sending bank audit trail.

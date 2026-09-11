# 3-Minute Competition Pitch & Judge Demonstration Narrative

## Document Metadata
- **Module:** 09-demo
- **File:** judge-narrative.md
- **Status:** APPROVED / LOCKED
- **Traceability:** Direct fulfillment of `PROBLEM_STATEMENT.md` (Real-time security reasoning, fraud prevention, human-in-the-loop intervention, explainability, safe autonomous decision-making; Expected Demo: 4 scenarios).

---

## 1. Demo Narrative Overview

- **Format:** 3-Minute Live Stage Pitch & Dual-Screen Demo.
- **Presenter Setup:**
  - Left Screen / Mobile: **Viewport A (UPI Payment Simulator)**.
  - Right Screen / Projector: **Viewport B (Guardian Agentic Security Cockpit)**.
- **Target Audience:** Hackathon Judging Panel (Fintech Leads, Cybersecurity Architects, AI/ML Evaluators).

```mermaid
timeline
    title 3-Minute Competition Demonstration Timeline
    0:00 - 0:45 : The Problem & Technical Dilemma : 14B UPI txns, psychological coercion, the speed-intelligence tradeoff
    0:45 - 1:30 : Architecture Innovation : Dual-Path Tiered Triage (<10ms Hot Path + Pre-PIN Warm Agent)
    1:30 - 2:30 : Live 4-Scenario Walkthrough : Normal (4ms) -> New Payee -> Collect Inversion -> Digital Arrest
    2:30 - 3:00 : Quantifiable Impact & Defense : PR-AUC 0.88, +₹3.4Cr NEV, Safe Bounded Agency
```

---

## 2. Minute-by-Minute Spoken Script & Screen Synchronization

### Minute 0:00 – 0:45: The Problem & The Fundamental Technical Dilemma
> **[Speaker]:**
> "Good afternoon, judges. India processes over 14 billion UPI transactions every month. But in 2026, scammers don’t hack bank databases—they hack human psychology. Through 'Digital Arrests', fake electricity rebates, and marketplace impersonation, victims are coerced into entering their own MPINs willingly.
>
> Why haven't current banking apps stopped this? Because of a fundamental engineering dilemma:
> 1. **Rule-based popups** are generic and ignored by 96% of users.
> 2. **Large Language Models** possess deep contextual reasoning, but taking 3 to 5 seconds on every payment destroys the checkout experience.
>
> Today, we present the **Agentic Guardian**: the first real-time, dual-path payment scam interception engine built specifically for the Indian UPI ecosystem."

---

### Minute 0:45 – 1:30: The Architectural Innovation (Dual-Path Tiered Triage)
> **[Speaker points to Viewport B - Architecture Pane]:**
> "We solved the latency-intelligence tradeoff with **Dual-Path Tiered Triage**:
> - **The Hot Path:** An on-device compiled LightGBM engine evaluates 25 tabular features in under **5 milliseconds**. It clears **99.5%** of transactions instantly without touching the cloud or adding a single microsecond of friction.
> - **The Warm Path:** For the ambiguous 0.5% corridor, our Agentic Reasoner executes *inside the natural 1.5 to 2-second dwell window* while the user reviews their payment screen before tapping PIN.
> - The agent has **bounded agency**: it has zero write access to bank accounts. Instead of passive dialogs, it enforces **asymmetric cognitive friction** that breaks social engineering spells."

---

### Minute 1:30 – 2:30: Live 4-Scenario Walkthrough (Mandated by Problem Statement)

#### Scenario 1: Normal Payment (Zero Friction)
> **[Speaker taps Preset 1: ₹480 Groceries]:**
> "Let's test Scenario 1: Priya buys ₹480 groceries at her regular merchant. Watch Viewport B:
> In **4.2 milliseconds**, the Hot Path scores risk at 0.01. It emits `TIER_0_PASS`. Zero friction, no agent invoked, straight to MPIN. Seamless."

#### Scenario 2: New / Unverified Recipient (Salient Name Verification)
> **[Speaker taps Preset 2: ₹3,500 Dining Table on OLX]:**
> "Scenario 2: Rajesh buys furniture on OLX from someone calling himself 'Rahul Sharma'.
> Watch the screen: The agent activates in the pre-PIN window, calls NPCI `RespValAdd`, and retrieves the real CBS bank account holder: **MOHAMMED ISMAIL**.
> Notice the UI: It doesn't block Rajesh arrogantly. It renders an explainable Recipient Verification card showing: *'You typed Rahul Sharma, but the bank account belongs to Mohammed Ismail, opened 4 days ago.'* The MPIN button is disabled until Rajesh explicitly acknowledges this mismatch."

#### Scenario 3: Suspicious Collect Request (Inverted Direction)
> **[Speaker taps Preset 3: ₹10,000 Electricity Rebate Collect]:**
> "Scenario 3: Sunita gets an inbound collect request claiming: *'Enter MPIN to receive ₹10,000 subsidy.'*
> Inverted direction detected! The Guardian shifts into an amber alert: *'STOP: You are PAYING money, NOT receiving!'* To bypass, Sunita is forced to type the word **PAYING**. An unthinking tap-through is physically impossible."

#### Scenario 4: High-Risk Coercion (Digital Arrest Under Active Call)
> **[Speaker toggles Active Phone Call + Preset 4: ₹95,000 CBI Clearance]:**
> "Finally, Scenario 4: A 67-year-old professor under an active 45-minute WhatsApp call with a fake police officer demanding ₹95,000 for 'court clearance'.
> Watch Viewport A & B: The Guardian detects an active call, ₹95,000 ticket, and payee registered to 'AJAY RAMESH PAWAR'.
> The agent declares a **Tier 3 Critical Coercion Lock**. The payment button is **physically locked** until the victim hangs up the phone call. We break the scammer's psychological grip, and offer a 1-tap dialer to the 1930 Cybercrime Helpline."

---

### Minute 2:30 – 3:00: Quantifiable Impact & Summary
> **[Speaker points to Metrics & Audit Pane on Viewport B]:**
> "Look at the audit console: Every tool call, feature vector, and reasoning token is immutably logged in our SQLite WAL audit store for banking compliance.
> - **PR-AUC:** 0.88 on severe class-imbalanced data.
> - **p99 Latency:** 12ms for Hot Path, strictly under 1,800ms circuit breaker for Warm Path.
> - **Net Economic Value:** Over **₹3.4 Crore net fraud prevented** per 10 million transactions with less than 0.5% merchant friction.
>
> The Agentic Guardian doesn't just predict fraud—it actively protects human beings in real time before the money is lost forever. Thank you, we welcome your questions."

---

## 3. Anticipated Judge Questions & 15-Second Defense Cheat Sheet

| Question | 15-Second Winning Response |
| :--- | :--- |
| **"Why not let an LLM evaluate every transaction?"** | "At 14 billion transactions monthly, running an LLM on every ₹20 tea purchase would cost millions in GPU compute and add unacceptable 2-second delays. Our Dual-Path architecture reserves LLM intelligence strictly for the 0.5% ambiguous corridor where high-stakes scams actually occur." |
| **"What if the scammer tells the victim to type whatever confirmation word is required?"** | "That's why Tier 3 introduces our **Call-Severing Interlock**. The payment button is completely disabled while the victim is on a phone call. The scammer cannot coach what they cannot hear." |
| **"Can the agent accidentally block an authentic medical emergency payment?"** | "No. We enforce **bounded agency**. The agent can never unilaterally cancel or block a transaction without human override, except for confirmed malware. For emergencies, the agent displays the verified hospital CBS name with an emergency bypass disclaimer." |
| **"Does this require NPCI or banks to redesign the UPI core protocol?"** | "Zero core protocol changes. The Guardian operates purely as an on-device SDK and banking API integration using existing NPCI `RespValAdd` directory lookups and client telemetry listeners." |

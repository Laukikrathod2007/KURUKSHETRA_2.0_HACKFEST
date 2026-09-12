# PaySentinel
## Agentic Guardian for Real-Time Payment Scam Interception (PS09)
**Unified Research & Problem Analysis Document — Final**

> **Project Name Rationale:** A sentinel stands guard at a checkpoint — observing, verifying, and only letting the trusted pass. That is exactly this system's role: a guardrail between "tap Pay" and "money moves."

---

## Table of Contents
1. Problem Deconstruction
2. User & Stakeholder Analysis
3. Scam / Threat Taxonomy
4. Research Foundation & Gap Analysis
5. Proposed Solution
6. System Workflow
7. Risk & Feature Model
8. Agent Architecture
9. Decision / Autonomy Policy
10. Explainability & Human-in-the-Loop
11. Audit & Security Design
12. Innovation Features
13. Evaluation Metrics
14. Demo Scenarios
15. Technical Feasibility & Constraints
16. Implementation Plan (Next Document)

---

## 1. Problem Deconstruction

### 1.1 What This Problem Actually Is

PS09 is not a generic fraud-detection ask. It is specifically about **scam interception**, which is a different problem from fraud detection:

| Fraud | Scam |
|---|---|
| Unauthorized transaction (stolen card, account takeover) | **Authorized** transaction — the victim willingly sends the money |
| System catches unauthorized use after the fact | System must catch the victim's own decision *before* they complete it |
| Bank can often reverse it | Once sent via a real-time rail, money moves through mule accounts within minutes and is rarely recoverable |
| Transaction-pattern rule engines work reasonably well | Rule engines are blind here — the transaction itself looks completely normal (valid account, plausible amount) |

This category is known industry-wide as **Authorized Push Payment (APP) fraud**, and it is the fastest-growing fraud category globally — Deloitte projects APP fraud losses in the US alone could reach $15 billion by 2028, and industry commentary at Global Fintech Fest 2026 noted banks often have only a **30–60 second window** to intervene before funds move through mule accounts. This isn't a hypothetical framing device — it's the reason the PS asks for interception *before* completion rather than post-transaction flagging.

### 1.2 Explicit Ask
Build an agentic prototype that intercepts a payment before completion, evaluates risk (rules + LLM), verifies the recipient, produces a risk score/category, and — depending on severity — allows, confirms, pauses, or blocks the transaction, with explainability and an audit trail.

### 1.3 Ambiguities → Assumptions

| Ambiguity | Assumption |
|---|---|
| Real payment rails? | Fully simulated payment engine; no real UPI/bank integration. |
| LLM mandatory? | Use both: deterministic rules for transaction anomalies, LLM for unstructured social-engineering signals. The **decision itself stays rule-driven** (see §5). |
| Recipient verification without real KYC? | Mocked recipient registry (known-good / new / flagged), seeded per demo scenario. |
| "Real-time"? | Synchronous, few-second response in the demo — not literal production SLAs. |
| Scope of "scam"? | Mirrors India's dominant real patterns: impersonation, urgency, fake collect requests, mule accounts (§3). |
| Autonomy vs. confirmation step? | Tiered autonomy: full autonomy only at the extremes (auto-allow / hard-block-with-friction), human confirmation in the middle band (§9). |

---

## 2. User & Stakeholder Analysis

| Stakeholder | Need | Judges success by |
|---|---|---|
| **Payer (consumer)** | Protection without friction on normal payments | Speed when safe, clarity when risky, trust in reasoning |
| **Hackathon evaluator** (proxy for a bank/fintech/regulator) | Explainable, auditable, safely-autonomous system — not a black box | Explainability, human override, audit trail, compliance-style rigor |
| **(Implicit) Recipient / Payee** | Legitimate new recipients shouldn't be wrongly branded scammers | Low false-positive rate, graceful verification path |

Designing only for the payer produces a "scam warning app." Designing for the evaluator too produces a defensible, compliance-aware **agentic system** — that distinction separates a demo from a product.

---

## 3. Scam / Threat Taxonomy

Real scams follow recognizable scripts. Classifying the *type*, not just flagging "suspicious," is what makes an alert explainable and lets the agent reference concrete, real-world manipulation patterns.

| Scam Type | How it manifests | Detectable Signals | Agent Response |
|---|---|---|---|
| **Impersonation scam** | "I'm calling from SBI/Police/RBI" | Authority claim in message text | LLM impersonation sub-score spikes |
| **Urgency / fear scam** | "Pay in 10 minutes or your account is blocked" | Time-pressure phrases, threats | LLM urgency sub-score spikes |
| **Fake customer-support / tech-support scam** | "Google Play support — virus removal fee" | Support/fee pretext + unrelated payment purpose | LLM classifies scam type + rule: fee-for-refund is contradictory |
| **Fake UPI collect request / refund scam** | Attacker frames an outgoing payment as "you'll receive money" | Recipient unknown, intent-mismatch (expects credit, actually a debit) | Rule: contradiction flag, high severity |
| **Investment / too-good-to-be-true scam** | "Urgent investment return — act before midnight" | Deadline pressure + unrealistic return promise | LLM classifies scam type, high urgency sub-score |
| **New / mule recipient** | First-ever payment to an account with suspicious receive/forward velocity | No prior history, rapid in-out fund movement | Recipient verification tier → Confirm/Pause |
| **Unusual amount** | Payment far above the user's historical average | Amount vs. rolling average multiple | Rule-based anomaly score |
| **Account takeover pattern** | New device/session behaving atypically | New device/session flag, odd time-of-day | Behavioral risk contribution |
| **QR / payment redirection scam** | Victim scans a QR believing it will *receive* money, but it authorizes an *outgoing* payment | Intent-mismatch between stated purpose and transaction direction | Rule: high-severity contradiction flag |

This taxonomy feeds directly into the **Risk & Feature Model** (§7) and gives the LLM's output a fixed vocabulary (a closed set of scam-type labels), rather than open-ended free text — which keeps its output auditable.

---

## 4. Research Foundation & Gap Analysis

### 4.1 What Existing Systems Do

| Solution | What it does | Key Gap |
|---|---|---|
| **Card-network AI fraud engines** (e.g., Visa's real-time scoring, reported to have helped prevent tens of billions in fraud annually) | Neural-network risk scoring per transaction using behavioral profiling, velocity checks, graph-based mule detection | No language understanding — cannot read a payment note or know the user was manipulated by a call 10 minutes earlier |
| **Bank rule engines (industry standard)** | Deterministic checks: amount thresholds, new-account flags, velocity limits | Legacy rule-based systems are widely reported to carry very high false-positive rates, overwhelming analysts while real scams still slip through since the transaction itself looks "normal" |
| **Google Pay / Android on-device scam detection (Gemini Nano)** | Real-time on-device analysis of phone calls; screen-share alerts with Google Pay/Paytm/Navi during active calls | Protects the call/screen-share *channel*, not the transaction decision itself; Pixel-only reach in India (under 1% of the Android market); no per-transaction score or audit trail |
| **Bank/NBFC backend ML (e.g., NPCI's MuleHunter AI)** | Flags mule-account patterns using behavioral velocity signals; has reportedly identified hundreds of thousands of mule accounts | Backend/reactive — surfaces to compliance teams, not the payer, and not before the transaction completes |
| **Consumer scam-link/UPI-ID checkers** | Flag phishing pages and suspicious UPI IDs before credential entry | Single-purpose; no recipient-trust workflow, no risk score, no audit history |
| **Academic UPI fraud prototypes** (Random Forest/XGBoost classifiers) | Classify transaction legitimacy from historical pattern data | Pure ML classification — no reasoning over unstructured context, no agentic multi-step pipeline, no human-in-the-loop UX |

### 4.2 What Published Research Validates

These are real, published works that directly inform the design (verified against source):

- **CASE — Conversational Agent for Scam Elucidation** (arXiv:2508.19932, deployed on Google Pay India): shows scams are largely orchestrated *outside* the payment platform (calls, SMS, WhatsApp), so transaction data alone is insufficient — context collection matters. Reported a 21% uplift in scam-enforcement volume after adding conversational context collection. **What we take from it:** our LLM analysis layer reads the transaction's *message context* inline, functioning as an automatic context-collector rather than requiring the user to self-report.

- **SCRIPTMIND — Crime Script Inference for Social-Engineering Detection** (arXiv:2601.13581, accepted EACL 2026 Industry Track): shows LLMs can be prompted/fine-tuned to infer the *type* of scam script being executed, not just flag "suspicious." An 11B fine-tuned model outperformed GPT-4o by 13% on detection accuracy. **What we take from it:** the LLM module should output a **classified scam type** (§3 taxonomy) with reasoning, not a vague suspicion flag.

- **Tiered/layered fraud architecture** (industry consensus, echoed in auditable-fraud-detection research): each layer (rules, verification, LLM) should contribute *only under defined conditions*, and a plausible-sounding LLM rationale is not itself evidence of a correct decision — verifiable, structured signals are needed. **What we take from it:** the architecture in §8 explicitly keeps the LLM as one evidence source among several, never the sole decision-maker (see §5).

- **Explainable interpretability research** (e.g., XAI work on fraud detection, banking-sector interpretability studies): explainability is not a nice-to-have — users who understand *why* a payment is risky are more likely to actually act on the warning. **What we take from it:** every alert must cite concrete, specific evidence, never just a bare number (§10).

### 4.3 Synthesis — The Whitespace
No scanned product or paper combines all of: (1) reasoning over the **actual transaction plus its surrounding natural-language context**, (2) at the **point of payment**, (3) through a **graduated, explainable, human-in-the-loop decision pipeline**, (4) with a **user-visible audit trail**. Card networks protect the transaction numerically; Google protects the call channel; banks protect the backend; academic prototypes classify without reasoning over context. **PaySentinel sits exactly in that gap.**

---

## 5. Proposed Solution

**PaySentinel** intercepts a simulated payment and runs it through a pipeline where **evidence-gathering is distributed but the decision is centralized and deterministic**:

- **LLM's job:** understand unstructured context (message/call text) and produce a *classified scam type + social-engineering sub-scores + reasoning* — evidence only.
- **Rule engine's job:** deterministic anomaly checks (amount, recipient newness, intent-mismatch, velocity).
- **Recipient verification's job:** establish the payee's trust tier.
- **Risk Fusion Engine's job:** combine all sub-scores into one weighted risk score.
- **Policy Engine's job:** map that score to an action (Allow/Confirm/Pause/Block) using **fixed, auditable thresholds** — not an LLM judgment call.

**Why the LLM never decides directly:** an LLM decision is non-deterministic and hard to justify in an audit; a threshold-based policy engine is testable, reproducible, and explainable — exactly what "safe autonomous decision-making" requires in a financial context. **The LLM is a sensor, not a judge.**

### 5.1 The Core Framing
Most fraud systems ask: *"Does this transaction look abnormal?"* PaySentinel asks: *"Does this look like a scam?"* — a scam transaction can be numerically normal (correct amount, valid account, plausible timing). What makes it a scam lives in the payment note, the recipient's trust signals, and the pattern leading up to it — which is why the language-understanding layer is not optional decoration, it is the differentiator.

### 5.2 Core Requirements Mapping

| PS Requirement | Our Implementation |
|---|---|
| Payment simulation interface | Simulated payment flow (recipient, amount, note/message) |
| Transaction-risk analysis | Rule engine + Recipient verification + LLM analysis, fused into one score |
| Rule-based AND LLM-based reasoning | Both present, clearly separated by role (§8) |
| Recipient verification workflow | Dedicated verification step against a mocked trust registry |
| Risk score/category | 0–100 score + category (Low/Medium/High/Critical) |
| User confirmation step | Evidence-backed confirmation, not a generic "Are you sure?" |
| Pause/block mechanism | Policy Engine halts the flow; tiered override friction (§9) |
| Explainable security alerts | Plain-language alert generated from the same structured evidence |
| Transaction audit history | Full evidence-and-decision log per transaction, including allowed ones |

---

## 6. System Workflow

### 6.1 Agent Pipeline
```
Payment Initiated
      ↓
Collect Context   (amount, recipient, message/call text, device/session, user history)
      ↓
Recipient Verification   (known-good / new / flagged, name-match)
      ↓
Rule Engine   (amount anomaly, velocity, intent-mismatch checks)
      ↓
Social-Engineering Analysis (LLM)   (urgency / impersonation / scam-type classification)
      ↓
Risk Fusion Engine   (weighted sum → single 0–100 score)
      ↓
Decision Policy Engine   (score → Allow / Confirm / Pause / Block)
      ↓
Explain Alert   (human-readable reasoning from the same evidence)
      ↓
User Confirmation / Clarification / Override / Block
      ↓
Transaction Execution (simulated)
      ↓
Audit Log
```

### 6.2 Data Flow
```
[Payment UI] → transaction payload (payer, payee, amount, note/message)
     ↓
[Context Collector] → enriches payload: user history, device/session ID, recipient lookup key
     ↓
[Recipient Verification Service] → returns: trust_tier, prior_txn_count, flagged_bool
     ↓
[Rule Engine] → returns: rule_signals[] with individual point values
     ↓
[LLM Analysis Module] → input: message/call text + transaction metadata
                       → returns: { scam_type, urgency_score, impersonation_score, reasoning }
     ↓
[Risk Fusion Engine] → combines rule_signals + LLM sub-scores + recipient trust_tier
                       → returns: final_risk_score (0–100), contributing_factors[]
     ↓
[Policy Engine] → maps final_risk_score → action (Allow/Confirm/Pause/Block)
     ↓
[Explainability Layer] → renders contributing_factors[] as plain-language alert
     ↓
[User Decision] → proceed / cancel / ask Clarification Agent / override
     ↓
[Audit Logger] → persists full record (§11)
```

### 6.3 Real-World Scenario Mapped to the System

**How this actually happens today:** A victim receives a WhatsApp/SMS message: *"Your electricity connection will be disconnected today. Pay ₹9 to avoid disconnection — click this link / scan this QR."* The link opens a UPI **collect request** disguised as a tiny "verification" payment, or the QR is a *payment* QR (not a *receive* QR) — the victim believes they are paying a trivial amount but is actually authorizing a debit-triggering request.

**Where PaySentinel sits:** at the moment the user approves the payment/collect request inside the (simulated) payment app — before the debit executes.

**Pipeline trace:**
1. **Context:** payee = unknown UPI ID, never paid before; message = "electricity disconnection... pay immediately."
2. **Recipient verification:** payee not in known-good registry → `new/unverified` tier.
3. **Rule engine:** intent-mismatch (user believes small/refund payment, transaction is actually a debit-authorizing collect) → high-severity flag.
4. **LLM analysis:** message scores high on urgency ("today," "disconnection") and mild authority impersonation ("electricity board") → classified as **Fake Utility/Collect Scam**.
5. **Risk fusion:** combined score lands in the 75–100 band.
6. **Policy decision:** **Block**, with a high-friction override path.
7. **Explain alert:** plain-language summary (§10).
8. **Audit log:** full record stored regardless of the user's final choice.

This is the single most common real UPI scam pattern in India today — replicating its *shape* (not literal branding) in demo data makes the mocked scenarios feel authentic to judges rather than invented.

---

## 7. Risk & Feature Model

### 7.1 Scoring Formula
```
Risk Score = Recipient Risk + Transaction Risk + Behavioral Risk + Social-Engineering Risk
(clamped to 0–100)
```

### 7.2 Signal Table (Implementation Specification)

| Signal | Category | Example | Weight |
|---|---|---|---|
| New recipient (first payment ever) | Recipient | No prior transaction history | +15 |
| Recipient flagged in scam registry | Recipient | Reported previously | +40 |
| Verified/trusted recipient | Recipient | 20+ successful past payments | −20 |
| Name mismatch (UPI ID vs. displayed name) | Recipient | ID doesn't match claimed identity | +15 |
| Recently-created recipient account | Recipient | Account age < 7 days (simulated) | +20 |
| High amount vs. user average | Transaction | ₹50,000 vs. usual ₹2,000 | +20 |
| Intent-mismatch (expects to receive, actually pays) | Transaction | Collect request disguised as refund | +25 |
| Round-number / scripted amount pattern | Transaction | Matches a known scam-script amount | +10 |
| New device/session | Behavioral | First transaction from this device | +10 |
| Unusual time-of-day | Behavioral | 3 AM payment vs. normal daytime pattern | +5 |
| Velocity (multiple payments in short window) | Behavioral | 3+ payments within an hour | +10 |
| Urgency language | Social-Engineering (LLM) | "Pay within 10 minutes" | +15 |
| Authority/impersonation claim | Social-Engineering (LLM) | "I am from SBI/Police/RBI" | +20 |
| Secrecy/isolation pressure | Social-Engineering (LLM) | "Don't tell anyone, do it now" | +15 |
| Too-good-to-be-true framing | Social-Engineering (LLM) | "You've won ₹1,00,000, pay processing fee" | +15 |

*Weights are illustrative starting values — tunable, but must stay fixed and documented per demo run so scores stay reproducible and explainable.*

### 7.3 Decision Thresholds

| Score Range | Category | Action |
|---|---|---|
| 0–24 | 🟢 Low | Allow |
| 25–49 | 🟡 Medium | Confirm (show reasoning, require explicit tap-to-proceed) |
| 50–74 | 🟠 High | Pause + Verify (extra recipient-verification step, cool-down) |
| 75–100 | 🔴 Critical | Block (override requires explicit multi-step re-confirmation) |

---

## 8. Agent Architecture

| Component | Role | Decision Authority | Output |
|---|---|---|---|
| **Recipient Verification Agent** | Looks up payee trust tier against mocked registry (account age, name-match, prior history) | Evidence only | `{ trust_tier, prior_txn_count, flagged_bool }` |
| **Transaction/Rule Engine** | Deterministic anomaly checks (amount, velocity, intent-mismatch, timing) | Evidence only | `{ signal, value, risk_weight, description }[]` |
| **Intent / Social-Engineering Agent (LLM)** | Reads message/call context, classifies scam type (§3 taxonomy), scores urgency/impersonation/secrecy | Evidence only — **no control over the outcome** | `{ scam_type, urgency_score, impersonation_score, reasoning }` |
| **Risk Fusion Engine** | Weighted-sum combination of all evidence into one score | Computes score (deterministic) | `{ final_risk_score, contributing_factors[] }` |
| **Policy Engine** | Applies fixed thresholds (§7.3) to the score | **Makes the allow/confirm/pause/block decision** | `{ action, override_friction_level }` |
| **Explainability Layer** | Converts contributing factors into a plain-language alert | Presentation only | Rendered alert text |
| **Clarification Agent** *(new — see §12)* | Answers the payer's specific questions about *this* transaction, grounded only in its evidence | Cannot override the Policy Engine's decision | Conversational responses + logged Q&A |
| **Audit Logger** | Persists every step's evidence and outcome | Records only | Audit record (§11) |

This separation is the core architectural argument for judges: **the LLM (in any of its roles) is a sensor or a conversational aid, never the final judge.**

---

## 9. Decision / Autonomy Policy

| Tier | System Behavior | Can User Override? |
|---|---|---|
| **Allow (Low)** | Transaction proceeds automatically, no interruption | N/A |
| **Confirm (Medium)** | Shows a short reasoning summary; user taps "Proceed" or "Cancel"; can invoke Clarification Agent if unsure | Yes, single tap |
| **Pause + Verify (High)** | Transaction held; extra recipient-verification step; cool-down timer; Clarification Agent available | Yes, after completing the verification step |
| **Block (Critical)** | Transaction halted by default | Yes, but requires explicit multi-step override (re-read warning + type confirmation) — never a single tap |

This directly resolves the brief's apparent tension between "pause/block" and "user confirmation": **autonomy scales with risk, and overrides get harder to trigger as risk increases — the system never silently and permanently blocks a legitimate user, and it never lets a single tap dismiss a critical warning.**

---

## 10. Explainability & Human-in-the-Loop

Every alert renders from the same `contributing_factors[]` the Risk Fusion Engine produced — never a free-form LLM paragraph, to keep it consistent and auditable.

**Example rendered alert:**
```
🔴 High Risk — 87/100
Classified as: Fake Utility / Collect-Request Scam

• Recipient has no previous payment history
• Amount is 8× your typical payment
• Message uses urgency language ("pay immediately")
• Recipient is not verified in trusted registry

Recommendation: Payment paused. Verify recipient identity before proceeding.
[ I understand, cancel ]   [ I'm not sure, help me decide ]
```

**Human-in-the-loop rules:**
- Low tier: no human step (avoids alert fatigue — a known UX failure mode across the scanned landscape).
- Medium/High tiers: human sees reasoning *before* being asked to decide, not after.
- Critical tier: override remains possible (preserves user agency) but is deliberately high-friction.
- At any Confirm/Pause/Block tier, the user can tap **"I'm not sure, help me decide"** to open the Clarification Agent (§12) instead of deciding blind.

---

## 11. Audit & Security Design

**Log schema (per transaction):**
```
timestamp → transaction_id → payer → payee → amount → message_context
         → recipient_verification_result → rule_engine_signals[]
         → llm_output{scam_type, urgency_score, impersonation_score, reasoning}
         → final_risk_score → risk_category → policy_decision
         → clarification_agent_transcript (if invoked)
         → user_action (proceeded / cancelled / overrode) → final_status
```

- Every transaction is logged **regardless of outcome**, including allowed ones — the audit trail should demonstrate the system tracks everything, not just failures.
- Audit view in the UI: a searchable/filterable table (by risk tier, date, recipient) — a cheap-to-build, judge-facing deliverable.
- Production note: logs would be encrypted at rest and retained per RBI record-keeping norms — flagged here to show compliance-awareness without needing real encryption in a 24-hr build.

---

## 12. Innovation Features

### 12.1 Flagship Innovation — Clarification Agent (Doubt-Resolution Companion)

**The gap it fills:** every scanned product and the core PS requirements stop at "show a risk alert, let the user decide." But a confused or anxious user facing a Confirm/Pause alert often doesn't know *what to do with* the information — they need a conversation, not just a report.

**How it works:** at any Confirm/Pause/Block tier, the user can tap **"I'm not sure, help me decide"**, opening a chat with the Clarification Agent. This agent:
- Is grounded **only** in the evidence already gathered for this specific transaction (`contributing_factors[]`, recipient verification result, scam-type classification) — it does not answer open-domain questions or fetch new information.
- Answers natural questions like *"Is this really from my bank?"*, *"Why is this risky if the amount is small?"*, *"What happens if I ignore this?"* in plain language.
- **Cannot override the Policy Engine's decision** — it can help the user understand the risk and their options, but the actual allow/cancel/override action still goes through the same tiered friction as §9. This keeps the same "LLM is not the judge" principle intact even in conversational form.
- The full conversation is appended to the audit log, so "the agent talked the user out of / into a decision" is always reviewable.

**Why it matters for judging:** it directly extends "human-in-the-loop intervention" beyond a binary confirm/cancel button into genuine interactive support — which is a distinctive, demo-able feature almost no scanned competitor has, since it requires an agentic (not just classifying) LLM use.

### 12.2 Other Innovation Add-Ons

| # | Feature | Solution Sketch |
|---|---|---|
| 1 | **Confidence breakdown card** | Render `contributing_factors[]` sub-scores as a small bar chart, not just one number |
| 2 | **"Explain like I'm scammed" mode** | One-click simplified-language alert rewrite for low-digital-literacy users |
| 3 | **Adaptive friction (behavioral memory)** | Recipient trust tier improves automatically after repeated safe payments within the session |
| 4 | **Cool-down timer on High/Critical tiers** | Mandatory 30–60s countdown with a visible reasoning panel before override becomes selectable |
| 5 | **Registry feedback loop** | User marks a recipient "confirmed scam" / "false alarm" → mock registry updates live, re-scoring future transactions to that recipient |

---

## 13. Evaluation Metrics

| Metric | What it measures | How to demo it |
|---|---|---|
| **Fraud detection rate** | % of seeded scam scenarios correctly flagged (Pause/Block) | Run all scenarios, show pass/fail table |
| **False-positive rate** | % of legitimate scenarios incorrectly escalated | Normal-payment scenario must stay Allow |
| **Average risk-analysis latency** | Time from "Pay" tap to decision rendered | Timestamp log in UI |
| **Correct decision rate** | Decision matches expected tier per scenario design | Compare against scenario ground truth |
| **Explainability completeness** | Every Confirm/Pause/Block alert cites ≥2 concrete factors | Manual check of rendered alerts |
| **User intervention rate** | % of transactions requiring human confirmation | Should stay low for the Allow-tier bulk of normal traffic |
| **Clarification Agent grounding** | % of its answers traceable to actual `contributing_factors[]` (no fabricated claims) | Manual spot-check of transcripts in audit log |

---

## 14. Demo Scenarios

| # | Scenario | Recipient | Signals Triggered | Expected Tier |
|---|---|---|---|---|
| 1 | **Normal payment** | Trusted, 20+ past payments | None significant | 🟢 Allow |
| 2 | **New/unverified recipient** | First-ever payment, no urgency in message | New recipient (+15) | 🟡 Confirm |
| 3 | **Suspicious payment request** (tech-support scam) | New recipient, "Google support — virus removal fee" | New recipient + urgency + scam-type classification | 🟠 Pause + Verify |
| 4 | **High-risk transaction** (investment scam) | Brand-new account, "urgent investment return — act before midnight" | New/young recipient + deadline pressure + scam-type classification | 🔴 Block |
| 5 | **Fake refund / collect-request scam** | New recipient, "you'll receive a refund" framing but transaction is an outbound debit | Intent-mismatch + urgency | 🔴 Block |
| 6 | **Mule-account pattern** | Recently active recipient receiving many small payments from different users in a short window (simulated registry metadata) | Recipient velocity flag + new recipient | 🟠 Pause + Verify |
| 7 *(feature demo)* | **Confused user on a Confirm-tier alert** | Same as Scenario 2 | User taps "I'm not sure, help me decide" | Clarification Agent walks through the specific evidence, user then makes an informed choice |

Scenario 5 mirrors the real-world walkthrough in §6.3; Scenario 7 is a dedicated showcase of the Clarification Agent (§12.1) and should be run live to demonstrate genuine agentic, conversational human-in-the-loop behavior — not just a static alert.

---

## 15. Technical Feasibility & Constraints

**Scoped for a 24-hour build:**
- All data (recipients, history, scam registry) is mocked JSON/in-memory state — no real payment rail or KYC integration, which the PS explicitly invites.
- Single backend service handling the full pipeline (§6.1) sequentially; no distributed messaging/queue infrastructure needed for a working prototype. A production version could scale this into an event-driven, tiered-escalation architecture (rules as a fast path, LLM/agent calls only on escalation) — worth stating as the production vision, but not something to build live under time pressure.
- **LLM calls:** one structured call for scam-type + sub-score classification per transaction, plus on-demand calls for the Clarification Agent — both use JSON-mode/structured output, keeping latency and integration effort low.
- **Rule engine:** plain deterministic logic, no training required, zero external dependency.
- **Audit log:** a simple local database or structured JSON log with a table UI — inexpensive to build, high demo value.

**Main risk:** over-scoping (e.g., real voice-call analysis, real bank APIs, heavy distributed infrastructure). Mitigation: keep everything simulated and clearly labeled as such in the UI ("Simulated Payment Environment").

**Fallback:** if the LLM API is unavailable during judging, the rule engine + recipient verification still produce a valid (if less nuanced) decision, and the Clarification Agent gracefully states it's temporarily unavailable — the system degrades, it doesn't fail.

**Honest limitations (stated up front, not discovered by judges):**

| Limitation | Honest Statement |
|---|---|
| Recipient verification is simulated | No real UPI/NPCI API connection; account ages and history are mocked. In production, this would use real KYC/NPCI data sources. |
| Behavioral risk uses heuristics, not trained ML | A production system would train on labeled fraud data (e.g., XGBoost/graph models); the prototype uses documented rule weights instead. |
| LLM can hallucinate | Mitigated via structured/JSON-mode output and by treating LLM output as one signal among several — never the sole decision-maker. |
| No real payment execution | Transaction execution is fully simulated; no real money moves. |
| Privacy | In production, payment notes should be anonymized before LLM processing; noted here, not fully implemented in the prototype. |
| Cold-start problem | New users with no transaction history get lighter behavioral analysis by design, not by omission. |

---

## 16. Implementation Plan (Next Document)

This research document defines *what* the system must do and *why*. The next deliverable — **IMPLEMENTATION.md** — will cover: tech stack, data model/schema, prompt design for the LLM and Clarification Agent modules, exact scoring code structure, UI wireframes for each pipeline stage, and the 24-hour build schedule.

---

## Appendix — References

1. Deloitte (2025). "The rise of authorized push payment fraud."
2. Economic Times BFSI / Global Fintech Fest 2026 coverage — real-time payment intervention windows.
3. Jaipuria et al. (2025/2026). "CASE: An Agentic AI Framework for Enhancing Scam Intelligence in Digital Payments." arXiv:2508.19932 (deployed on Google Pay India).
4. Kim et al. (2026). "SCRIPTMIND: Crime Script Inference and Cognitive Evaluation for LLM-based Social Engineering Scam Detection System." arXiv:2601.13581, EACL 2026 Industry Track.
5. Google (Nov 2025 / 2026). Real-Time Scam Detection (Gemini Nano) and DigiKavach program announcements, India.
6. NPCI MuleHunter AI — public reporting on mule-account detection in UPI.
7. Reserve Bank of India — digital payment fraud statistics (2024–2025).
8. Industry commentary on legacy rule-based fraud system false-positive rates and tiered fraud-architecture design patterns.

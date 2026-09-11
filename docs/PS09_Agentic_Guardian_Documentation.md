# PS09 — Agentic Guardian for Real-Time Payment Scam Interception
## Complete Project Documentation

---

## TABLE OF CONTENTS

1. [Problem Understanding](#1-problem-understanding)
2. [Current Systems — What Exists Today](#2-current-systems--what-exists-today)
3. [Gap Analysis — What Current Systems Cannot Do](#3-gap-analysis--what-current-systems-cannot-do)
4. [Research Foundation](#4-research-foundation)
5. [What We Are Building — Solution Overview](#5-what-we-are-building--solution-overview)
6. [Architecture — Detailed Design](#6-architecture--detailed-design)
7. [Agent Design — Each Agent Explained](#7-agent-design--each-agent-explained)
8. [Voice Guardian — Live Conversational Assistant](#8-voice-guardian--live-conversational-assistant)
9. [Technology Stack — With Justification](#9-technology-stack--with-justification)
10. [Core Features Mapped to PS Requirements](#10-core-features-mapped-to-ps-requirements)
11. [Demo Scenarios — Detailed Walkthrough](#11-demo-scenarios--detailed-walkthrough)
12. [What Makes This Different from 200 Other Teams](#12-what-makes-this-different-from-200-other-teams)
13. [Limitations and Honest Scope](#13-limitations-and-honest-scope)

---

## 1. PROBLEM UNDERSTANDING

### 1.1 What the Problem Statement Actually Asks

PS09 is not asking for a generic fraud detection system. It is specifically about **scam interception** — which is fundamentally different.

| Fraud | Scam |
|---|---|
| Unauthorized transaction (stolen card, account takeover) | **Authorized** transaction — the victim *willingly* sends money |
| System catches unauthorized use | System must catch the victim *before they complete* a payment they chose to make |
| Bank can reverse it | Once sent in real-time payments, money is often gone within 30–60 seconds |
| Rule engines work well | Rule engines are **blind** to this — the transaction looks completely normal |

This is called **Authorized Push Payment (APP) fraud** — and it is the fastest-growing fraud category globally.

**Key stat:** Deloitte estimates US losses from APP fraud alone will reach $15 billion by 2028. Globally, banks now have only **30–60 seconds** to intervene before money moves through mule accounts (Global Fintech Fest 2026, Economic Times BFSI).

### 1.2 What Scams Actually Look Like

The PS mentions five specific attack vectors:

1. **Suspicious payment requests** — "You owe a fee to release your package"
2. **Impersonation** — Posing as your bank, tax authority, Amazon, Google Support
3. **Unusual recipients** — First-time payee, newly created account, no transaction history
4. **Urgency-based social engineering** — "Your account will be blocked in 2 hours", "Don't tell anyone"
5. **Fraudulent transaction patterns** — Unusual amounts, timing, frequency for the user

The hardest of these — and the most overlooked — is urgency-based social engineering. The payment note, the recipient name, and the context all carry signals that **only language understanding can decode**. This is the core differentiator of our solution.

---

## 2. CURRENT SYSTEMS — WHAT EXISTS TODAY

### 2.1 Visa/Mastercard — The Gold Standard

**What they do:**
- Visa's AI fraud system generates a **risk score (0–99)** for every transaction in real time
- Processes 500,000+ transactions per second
- Prevented approximately $40 billion in suspected fraud in 2024 (Visa public disclosure)
- Recently launched **A2A Protect** — sends transaction details to Visa via API before money moves, returns a scam likelihood score in milliseconds

**How it works technically:**
- Neural networks trained on billions of historical transactions
- Behavioral profiling per cardholder (usual spend patterns, locations, merchants)
- Graph-based detection (money flow networks, mule account patterns)
- Velocity checks (transaction frequency, amounts in rolling windows)

**What it CANNOT do:**
- It does not read payment notes or memos
- It does not analyze *why* a user is making a payment
- It cannot detect that the user was manipulated by a phone call 10 minutes ago
- It has no language understanding — only numerical and categorical signals

### 2.2 Rule-Based Systems (Industry Standard)

Every bank has a rule engine. Common rules:
- Flag if amount > 5x user's 30-day average
- Flag if recipient account < 30 days old
- Flag if 3+ payments in 1 hour
- Flag if international transfer from domestic-only account

**Problem:** Legacy rule-based systems generate **90–95% false positive rates** (PwC, cited by Oscilar 2026). This means analysts are overwhelmed with false alarms and real fraud slips through.

### 2.3 Stripe Radar / Similar Commercial Tools

- Machine learning models on transaction metadata
- Device fingerprinting, IP geolocation, email age
- Velocity checks across their merchant network
- No user-intent analysis, no language understanding

### 2.4 What Banks Currently Do for APP Fraud Specifically

- Show a generic "Are you sure?" warning before large transfers
- Flag new payees with a "You haven't paid this person before" notice
- Some banks (Barclays, NatWest UK) use **Confirmation of Payee** — checks if the recipient name matches the account

**The gap:** None of these systems reason about the *context* of the payment. None of them analyze urgency language. None of them classify the scam type and explain it to the user in plain English. None of them use an agent that actively investigates before deciding.

---

## 3. GAP ANALYSIS — WHAT CURRENT SYSTEMS CANNOT DO

Based on research, here are the proven, documented gaps:

| Gap | Evidence |
|---|---|
| Cannot detect urgency/social engineering language in payment context | No production system does NLP on payment notes at interception time |
| Cannot classify scam type (romance, impersonation, tech support, investment) | CASE paper (arxiv 2508.19932) identifies this as unsolved at payment layer |
| Cannot explain decisions in plain human language to the end user | ClarityAI (Devpost) was built specifically because no tool did this |
| Cannot combine behavioral + linguistic + network signals in one reasoning loop | SCRIPTMIND paper (arxiv 2601.13581) shows this gap in detection accuracy |
| No human-in-the-loop that is contextual — just generic "confirm?" dialogs | Banks use binary confirm dialogs, not evidence-backed intervention |
| Cannot build evidence chain that explains *specifically* why a payment is risky | ING XAI research (University of Twente) identifies this as active research area |
| 30–60 second intervention window is not being used intelligently | Industry admits only generic friction is applied in this window |

**This is the gap our system fills.**

---

## 4. RESEARCH FOUNDATION

These are real, published research works that directly inform our design. We are not reinventing — we are implementing validated ideas.

### 4.1 CASE — Conversational Agent for Scam Elucidation
**Source:** arxiv.org/abs/2508.19932

**Key finding:** Scams are often orchestrated *outside* the payment platform (via phone, SMS, WhatsApp). Transaction signals alone are insufficient. User-reported context and conversational signals are critical. An agentic framework that collects and reasons about scam context is the right approach.

**What we take from this:** Our Intent Agent analyzes the payment note and transaction context — acting as the "scam context collector" inline, without requiring the user to report anything.

### 4.2 SCRIPTMIND — Crime Script Inference for Social Engineering Detection
**Source:** arxiv.org/html/2601.13581v1

**Key finding:** LLMs can be trained/prompted to infer the *crime script* behind a social engineering attempt — i.e., what type of scam is being executed, what stage it is at, and what the scammer's next move would be. An 11B fine-tuned LLM outperformed GPT-4o by 13% on scam detection accuracy and false-positive reduction.

**What we take from this:** Our Intent Agent uses prompt engineering to classify the scam type and infer the underlying manipulation pattern — not just flag something as "suspicious."

### 4.3 Explainable Agentic System for Conversational Scam Detection
**Source:** arxiv.org/html/2607.11707v2

**Key finding:** Summary-based memory across conversation turns allows detection of scams that unfold over time. The system reached 97.8% accuracy on ConScamBench-278 (a benchmark of 8 scam types). Explainability is essential — users who understand *why* something is risky take protective action more reliably.

**What we take from this:** Our Evidence Builder creates a structured, human-readable explanation of every risk signal before presenting it to the user.

### 4.4 Toward Auditable Fraud Detection (arxiv 2607.19266)
**Key finding:** Each layer of a fraud system (rules, graph features, ML, LLM agent) contributes only under specific conditions. A plausible rationale from an agent is not evidence of a better decision — you need verifiable signals. Layered systems where each component has a defined role outperform single-model approaches.

**What we take from this:** We use a tiered architecture. The LLM agent is NOT in the fast path for all transactions. It is invoked only when lower tiers flag ambiguity. Each agent produces structured evidence, not just a narrative.

### 4.5 Tiered Escalation Architecture (c-sharpcorner.com, industry consensus)
**Key finding:** Sending every transaction through an LLM is architecturally wrong — too slow, too expensive. The correct pattern is:
- Tier 1 (< 50ms): Rules + lightweight ML handles 95%+ of transactions
- Tier 2 (LangGraph multi-agent): Only ambiguous/high-risk transactions escalate here

**What we take from this:** Our architecture uses this exact pattern.

### 4.6 Human-in-the-Loop with LangGraph (LangChain official docs + enterprise deployments)
**Key finding:** LangGraph's interrupt/checkpoint mechanism allows durable pausing of agent execution — the graph state is persisted, a human reviews it, and execution resumes exactly where it left off. This is first-class functionality, not a workaround.

**What we take from this:** Our PAUSE flow uses LangGraph's native HITL. The user sees a full evidence report, makes a decision, and the agent either completes or blocks the transaction.

---

## 5. WHAT WE ARE BUILDING — SOLUTION OVERVIEW

### Project Name: **Agentic Guardian**

### One-Line Description
An AI agent that sits between a user and their payment confirmation button — analyzing every suspicious payment using multi-agent reasoning, language understanding, and recipient verification before the money moves.

### The Core Innovation
Most fraud systems ask: *"Does this transaction look abnormal?"*

We ask: *"Does this transaction look like a scam?"*

These are different questions. A scam transaction can look completely normal numerically (correct amount, valid account, normal timing). What makes it a scam is the *reason behind it* — and that reason lives in the payment note, the recipient's digital footprint, and the behavioral pattern leading up to it.

### What We Build (Strictly PS09 Compliant)

| PS Requirement | Our Implementation |
|---|---|
| Payment simulation interface | FastAPI + React UI simulating UPI/bank transfer flow |
| Transaction-risk analysis | Tiered engine: Rules → Behavioral → LLM |
| Rule-based AND LLM-based reasoning | Both tiers present, clearly separated |
| Recipient verification workflow | Dedicated Recipient Agent with account age, name match, network check |
| Risk score/category | 0–100 score + categorical label (LOW/MEDIUM/HIGH/CRITICAL) |
| User confirmation step | Evidence-backed confirmation dialog, not just "Are you sure?" |
| Pause/block mechanism | LangGraph HITL interrupt — transaction held, user notified |
| Explainable security alerts | LLM-generated plain English explanation of every risk signal |
| Transaction audit history | Postgres table with full evidence chain per transaction |

---

## 6. ARCHITECTURE — DETAILED DESIGN

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                    │
│              Payment Simulator — UPI/Bank Transfer           │
└─────────────────────────────┬───────────────────────────────┘
                              │  POST /pay
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Gateway                            │
│         Auth | Rate Limiting | Request Validation            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                    Apache Kafka Topic
                    [payment.initiated]
                              │
              ┌───────────────┴──────────────┐
              ▼                              ▼
        Redis (Hot Data)              Postgres (Write)
        - User profile                - Transaction record
        - Recent txn history          - Status: PENDING
        - Recipient cache
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│              TIER 1 — FAST PATH (< 50ms)                     │
│                                                              │
│   ┌─────────────┐    ┌───────────────┐    ┌─────────────┐  │
│   │ Rule Engine │    │  Behavioral   │    │  Risk Score │  │
│   │             │    │  Profiler     │    │  Aggregator │  │
│   │ - Amount    │    │  - Velocity   │    │             │  │
│   │   limits    │    │    checks     │    │  0–100      │  │
│   │ - Blocklist │    │  - Time-of-   │    │  score      │  │
│   │ - Hard      │    │    day        │    │             │  │
│   │   rules     │    │  - Freq       │    │  ROUTE:     │  │
│   │             │    │    analysis   │    │  <30: ALLOW │  │
│   └─────────────┘    └───────────────┘    │  >85: BLOCK │  │
│                                           │  30-85: ↓   │  │
│                                           └─────────────┘  │
└──────────────────────────────────────────────────┬──────────┘
                                                   │ ESCALATE
                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│           TIER 2 — LANGGRAPH MULTI-AGENT SYSTEM              │
│                                                              │
│   ┌───────────────────────────────────────────────────────┐ │
│   │                  ORCHESTRATOR NODE                     │ │
│   │         (Routes to agents, manages state)              │ │
│   └──────┬────────────────┬───────────────────┬───────────┘ │
│          │                │                   │              │
│          ▼                ▼                   ▼              │
│   ┌────────────┐  ┌───────────────┐  ┌───────────────┐      │
│   │    TXN     │  │   RECIPIENT   │  │    INTENT     │      │
│   │   AGENT    │  │    AGENT      │  │    AGENT      │      │
│   │            │  │               │  │               │      │
│   │ - Amount   │  │ - Acct age    │  │ - NLP on note │      │
│   │   deviation│  │ - Name match  │  │ - Urgency     │      │
│   │ - Pattern  │  │ - Prev txns   │  │   detection   │      │
│   │   anomaly  │  │   with sender │  │ - Scam type   │      │
│   │ - Time     │  │ - Network     │  │   classifier  │      │
│   │   anomaly  │  │   trust score │  │ - Manipulation│      │
│   │            │  │               │  │   pattern     │      │
│   └─────┬──────┘  └───────┬───────┘  └───────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                           ▼                                  │
│                  ┌─────────────────┐                         │
│                  │ EVIDENCE BUILDER│                         │
│                  │                 │                         │
│                  │ Collects signal │                         │
│                  │ from all agents │                         │
│                  │ Builds structured│                        │
│                  │ evidence report │                         │
│                  │ + plain English │                         │
│                  │ explanation     │                         │
│                  └────────┬────────┘                         │
│                           │                                  │
│                           ▼                                  │
│                  ┌─────────────────┐                         │
│                  │  POLICY/DECISION│                         │
│                  │     AGENT       │                         │
│                  │                 │                         │
│                  │  Weighs evidence│                         │
│                  │  Final decision │                         │
│                  └────────┬────────┘                         │
│                           │                                  │
│         ┌─────────────────┼──────────────────┐               │
│         ▼                 ▼                  ▼               │
│      ALLOW             VERIFY              PAUSE/BLOCK        │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │   VERIFY / PAUSE   │
                    │                   │
                    │  LangGraph HITL   │
                    │  interrupt fires  │
                    │  State persisted  │
                    │  to Postgres      │
                    │                   │
                    │  User sees:       │
                    │  Evidence Report  │
                    │  + Risk Score     │
                    │  + Scam Type      │
                    │  + Plain English  │
                    │    Explanation    │
                    └────────┬──────────┘
                             │
                    ┌────────┴─────────┐
                    │   USER DECISION  │
                    │  PROCEED / CANCEL│
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │   RE-EVALUATE    │
                    │  (agent resumes) │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │   FINAL ACTION   │
                    │  ALLOW / BLOCK   │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │ AUDIT + TELEMETRY│
                    │  Postgres log    │
                    │  Full evidence   │
                    │  chain stored    │
                    └──────────────────┘
```

---

## 7. AGENT DESIGN — EACH AGENT EXPLAINED

### 7.1 Transaction Agent

**Responsibility:** Analyze the numerical and temporal properties of the transaction itself.

**Signals it checks:**
- Amount deviation from user's 30/90-day average (e.g., 5x normal = high risk)
- Time-of-day anomaly (paying at 3 AM when user never has before)
- Velocity — has this user sent 3+ payments in the last hour?
- Round-number bias (scammers often request exact round amounts like ₹50,000)
- First payment to this type of recipient category

**Output:** Structured JSON with signal name, value, risk contribution, and confidence.

```json
{
  "agent": "transaction",
  "signals": [
    {
      "signal": "amount_deviation",
      "value": "8.3x above 90-day average",
      "risk_weight": 0.72,
      "description": "This payment (₹82,000) is 8.3 times larger than your average payment of ₹9,800"
    },
    {
      "signal": "time_anomaly",
      "value": "11:47 PM, user typically pays 9AM-6PM",
      "risk_weight": 0.41,
      "description": "You rarely make payments this late at night"
    }
  ],
  "sub_score": 68
}
```

### 7.2 Recipient Agent

**Responsibility:** Verify the recipient's trustworthiness using available signals.

**Signals it checks:**
- Account age (how long has this UPI ID / account existed?)
- First-time payee flag (have you ever paid this person before?)
- Name consistency (does the registered name match what the user typed?)
- Network trust score (have other users in the system paid this recipient without issues?)
- Simulated blocklist check (known fraud numbers/IDs)
- Account creation proximity to transaction (account created days before being paid = red flag)

**Why this matters:** Research shows newly created accounts used in scams are a strong signal. Visa's A2A Protect scores recipients specifically for this. We simulate this at the prototype level.

**Output:** Structured recipient risk report.

```json
{
  "agent": "recipient",
  "recipient_id": "scammer@upi",
  "signals": [
    {
      "signal": "account_age",
      "value": "4 days",
      "risk_weight": 0.85,
      "description": "This UPI account was created only 4 days ago"
    },
    {
      "signal": "first_time_payee",
      "value": true,
      "risk_weight": 0.55,
      "description": "You have never sent money to this recipient before"
    },
    {
      "signal": "network_trust",
      "value": "0 transactions in network",
      "risk_weight": 0.60,
      "description": "No other users in our network have paid this recipient"
    }
  ],
  "sub_score": 81
}
```

### 7.3 Intent Agent (The Core Differentiator)

**Responsibility:** Analyze the *reason* for the payment using natural language understanding of the payment note/memo and transaction context.

**This is what no rule engine can do.**

**What it analyzes:**
- Payment note / memo text (e.g., "Emergency hospital fees please don't tell wife")
- Urgency markers: "immediately", "last chance", "account blocked", "don't tell anyone", "emergency"
- Impersonation markers: recipient name contains "Google", "Amazon", "RBI", "Police", "Bank"
- Scam type classification:
  - Tech Support Scam ("Your computer has a virus, pay for fix")
  - Investment Scam ("Send ₹10,000 to get ₹1,00,000 return")
  - Romance Scam ("I'm stuck abroad, please send money")
  - Impersonation Scam ("This is RBI, your account is compromised")
  - Refund Scam ("You are owed a refund, pay processing fee first")
  - Family Emergency Scam ("Your son is in hospital")

**How it works:**
Uses a structured LLM prompt that instructs the model to:
1. Identify urgency signals
2. Classify the scam type if any
3. Identify the manipulation technique (fear, urgency, authority, trust)
4. Rate confidence
5. Produce a plain English explanation

**This is grounded in SCRIPTMIND research** — which showed that crime script inference (identifying the *type* and *stage* of scam) dramatically improves detection and false-positive reduction.

**Output:**
```json
{
  "agent": "intent",
  "payment_note": "Emergency! My son is in hospital. Please send ₹50,000 urgently. Don't tell anyone.",
  "signals": [
    {
      "signal": "urgency_language",
      "markers_found": ["Emergency", "urgently"],
      "risk_weight": 0.88
    },
    {
      "signal": "secrecy_instruction",
      "markers_found": ["Don't tell anyone"],
      "risk_weight": 0.91,
      "description": "Legitimate payments never require secrecy. This is a strong scam indicator."
    },
    {
      "signal": "scam_type_classification",
      "scam_type": "FAMILY_EMERGENCY_SCAM",
      "confidence": 0.87,
      "manipulation_technique": "Fear + Urgency",
      "description": "This matches the pattern of a Family Emergency Scam where fraudsters impersonate a family member in crisis to pressure immediate payment"
    }
  ],
  "sub_score": 90
}
```

### 7.4 Evidence Builder

**Responsibility:** Aggregate outputs from all three agents into a unified, structured evidence report.

- Combines sub-scores using a weighted formula
- Generates final risk score (0–100) and category
- Calls LLM once to produce a final plain-English explanation for the user
- Structures the evidence chain for audit storage

**Risk Categories:**
| Score | Category | Action |
|---|---|---|
| 0–29 | LOW | ALLOW automatically |
| 30–59 | MEDIUM | Show advisory, proceed with confirmation |
| 60–79 | HIGH | Show evidence report, require explicit confirmation |
| 80–100 | CRITICAL | PAUSE transaction, show full alert, require re-evaluation |

### 7.5 Policy / Decision Agent

**Responsibility:** Make the final routing decision based on evidence.

- Weighs the combined evidence report
- Applies policy rules (e.g., CRITICAL always pauses regardless)
- Routes to ALLOW, VERIFY (show warning + confirm), or PAUSE/BLOCK
- For PAUSE: triggers LangGraph's interrupt mechanism — the graph state is checkpointed to Postgres and waits for human input

---

## 8. VOICE GUARDIAN — LIVE CONVERSATIONAL ASSISTANT

### 8.1 The Problem This Solves

The text-based evidence report in section 7.4 works well for a tech-savvy user. But this service will be used by everyone — including people who:

- Are elderly and have low digital literacy (the most targeted demographic — FBI data shows phishing and tech support scams are the most commonly reported fraud among older adults in 2025)
- Are in a panic because a scammer just spent 20 minutes pressuring them on the phone
- Cannot process a structured risk report when they are emotionally distressed
- Speak a regional language and do not read English well
- Are visually impaired

When someone is being scammed, they are not in a calm analytical state. They are frightened, confused, and pressured. A wall of text — even good text — is not enough.

**What they need is a voice. A calm, knowledgeable voice that talks them through exactly what is happening and what they should do.**

This is the Voice Guardian.

### 8.2 What Voice Guardian Is

Voice Guardian is a **live, real-time, context-aware conversational voice assistant** that activates automatically when a HIGH or CRITICAL risk payment is flagged.

It is not a pre-recorded message. It is not a phone call. It is an in-app voice assistant that:

- Speaks to the user directly in the browser/app using their microphone and speaker
- Has **full context** about the flagged transaction: the amount, the recipient, the risk score, the scam type detected, the specific signals that triggered the alert
- Guides the user through a natural conversation to help them make an informed decision
- Answers their questions out loud ("Is this really a scam?", "What should I do?", "Can I trust this person?")
- Recommends a clear action: cancel the payment, call the real organization directly, or verify the recipient another way
- Speaks in a calm, reassuring tone — not alarming, not robotic

**It behaves like a knowledgeable friend sitting next to you at the moment you almost got scammed.**

### 8.3 Why This Is Novel

No current payment fraud system does this. Here is what exists today:

| Current Approach | Problem |
|---|---|
| SMS alert: "Suspicious transaction detected" | No guidance. User doesn't know what to do. |
| In-app text warning with risk score | Requires reading, comprehension, calm state. Fails for distressed/low-literacy users. |
| Bank's fraud hotline (call center) | User has to find the number, call, wait on hold. Scammer may still be on the other line. |
| Generic "Are you sure?" dialog | No context, no explanation, easily dismissed. |

Voice Guardian is the first pattern that provides **real-time, context-specific spoken guidance at the exact moment of decision** — in the app, immediately, with full knowledge of the specific threat.

The research supports the need: older adults are more likely to lack confidence in identifying scams (American Bar Association, 2025), and studies show that AI voice cloning is now being used by scammers themselves (grandmother case, ABA 2026). The protection mechanism needs to match the attack vector — voice-based reassurance against voice-based manipulation.

### 8.4 How It Works — Technical Design

```
┌─────────────────────────────────────────────────────────┐
│              PAYMENT FLAGGED AS HIGH / CRITICAL          │
│         (LangGraph Policy Agent fires PAUSE/BLOCK)       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              CONTEXT PACKAGE ASSEMBLED                   │
│                                                          │
│  From Evidence Builder output:                           │
│  - Transaction amount + recipient                        │
│  - Risk score (e.g., 91/100)                             │
│  - Risk category (CRITICAL)                              │
│  - Scam type (e.g., TECH_SUPPORT_SCAM)                   │
│  - Specific signals (urgency language, new account, etc) │
│  - Recommended action                                    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│         VOICE GUARDIAN SYSTEM PROMPT INJECTION           │
│                                                          │
│  The context package is injected into the LLM's         │
│  system prompt BEFORE the voice session starts.          │
│                                                          │
│  Prompt structure:                                       │
│  "You are Voice Guardian, a calm payment security        │
│   assistant. A payment has just been flagged.            │
│   Here is what you know: [context package].              │
│   Your job is to explain this to the user in simple,     │
│   reassuring language, answer their questions, and       │
│   guide them to cancel this payment."                    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           VOICE SESSION OPENS IN BROWSER                 │
│                                                          │
│  OpenAI Realtime API (WebRTC)                            │
│  - Full-duplex: listens and speaks simultaneously        │
│  - Sub-second response latency                           │
│  - Natural interruption handling                         │
│                                                          │
│  ElevenLabs (alternative):                               │
│  - Higher voice quality / emotional tone control         │
│  - Speech Engine WebSocket for custom agent logic        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              LIVE CONVERSATION WITH USER                 │
│                                                          │
│  Voice Guardian speaks first:                            │
│  "Hi, I've paused your payment for your safety.          │
│   You were about to send ₹15,000 to a new account       │
│   for what looks like a tech support fee. I want to      │
│   quickly explain why this is risky. Is that okay?"      │
│                                                          │
│  User can speak naturally:                               │
│  "But they said my computer has a virus..."              │
│                                                          │
│  Voice Guardian responds with context:                   │
│  "That's exactly what tech support scammers say.         │
│   Real companies like Microsoft or Google never call     │
│   you first and ask for payment. The account you're      │
│   paying was created just 4 days ago. I strongly         │
│   recommend cancelling this payment."                    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              USER DECISION + RESUME FLOW                 │
│                                                          │
│  After conversation, user says or clicks:                │
│  "Cancel payment" → LangGraph graph resumes → BLOCK      │
│  "I want to proceed" → Override flow with final warning  │
│                                                          │
│  Decision + conversation summary logged to Postgres      │
└─────────────────────────────────────────────────────────┘
```

### 8.5 The System Prompt Design (Key Technical Detail)

This is what makes Voice Guardian intelligent, not generic. The system prompt is **dynamically constructed** for every flagged transaction.

**Template:**
```
You are Voice Guardian, a warm and calm payment security assistant built into 
[App Name]. Your only job right now is to protect this user from a potential scam.

WHAT YOU KNOW ABOUT THIS PAYMENT:
- Amount: ₹{amount}
- Recipient: {recipient_name} ({recipient_id})
- Payment note: "{payment_note}"
- Risk score: {risk_score}/100
- Risk category: {risk_category}
- Scam type detected: {scam_type}
- Scam confidence: {confidence}%
- Key signals:
  {signal_1}
  {signal_2}
  {signal_3}

YOUR GOAL:
Explain the risk in simple, non-technical language. Be warm and calm, 
not alarming. Do not use jargon. If the user is confused, repeat clearly.
Answer any questions they have using the context above.
Firmly but kindly recommend they cancel this payment.
If they still want to proceed, acknowledge their choice but remind them 
once more of the specific risk. Do not argue.

LANGUAGE: Respond in the same language the user speaks.
TONE: Like a trusted family friend, not a corporate robot.
```

**Why this works:** The LLM does not have to know anything about fraud in general — it has the specific evidence right in its context. It cannot hallucinate risk signals because it is reading them from the Evidence Builder's structured output. The conversation is grounded in real data.

### 8.6 Language Support

Because the system prompt instructs "respond in the same language the user speaks," Voice Guardian automatically works in:
- Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati
- Any language the underlying model (GPT-4o / GPT-Live-1) supports

This is critical for India-specific deployment where a significant portion of payment app users are not English-primary.

### 8.7 What This Looks Like in the Demo

**Demo moment (Scenario 3 — Tech Support Scam):**

1. User fills payment form: ₹15,000 to "Google Support", note: "Virus removal fee"
2. System flags CRITICAL. Payment pauses.
3. UI shows evidence report — AND a "Talk to Voice Guardian" button activates automatically
4. Voice Guardian speaks: *"Hi, I've paused your payment. You were about to send ₹15,000 for a virus removal fee. I need to tell you something important about this — can I explain?"*
5. User (panicked): *"Yes, the support person is still on the phone with me"*
6. Voice Guardian: *"I understand. Please don't worry. The person on the phone is most likely a scammer. Real Google support never calls you first and never asks for payment over the phone. The account you're paying was created just 4 days ago, which is a strong sign of fraud. I'd recommend hanging up that call and cancelling this payment."*
7. User: *"Are you sure? They seemed very official"*
8. Voice Guardian: *"Yes. Official-sounding language is exactly how these scams work. No legitimate tech company operates this way. Your money is safe right now because I've paused the payment. Just say 'cancel' and you're protected."*
9. User: *"Cancel"* → Payment blocked → Logged to audit trail

**This is the moment that wins the hackathon.** No other team will have this.

### 8.8 Technical Stack for Voice Guardian

| Component | Choice | Reason |
|---|---|---|
| Voice session | OpenAI Realtime API (`gpt-realtime-2.1`) | Full-duplex speech-to-speech, sub-second latency, tool calling mid-conversation, WebRTC in browser — production-ready as of Sept 2026 |
| Alternative voice | ElevenLabs Conversational AI | Higher voice quality, emotional expressiveness, Speech Engine WebSocket allows full control of agent logic on our side |
| Dynamic system prompt | Assembled by Evidence Builder | Injects structured fraud evidence before session opens — model speaks from facts, not general knowledge |
| Session trigger | LangGraph Policy Agent → WebSocket event → Frontend | When graph routes to PAUSE/BLOCK, a WebSocket message fires in the frontend to open the voice session |
| Session logging | Conversation transcript saved to Postgres | Full audit trail of what was said, user's decision, and outcome |
| Language detection | Browser `navigator.language` + first-turn detection | Auto-adapts to user's language |

### 8.9 Why OpenAI Realtime API is the Right Choice Here

OpenAI just released `gpt-live-1` (September 2026) — a full-duplex voice model that:
- Listens and speaks simultaneously (no turn-waiting)
- Handles interruptions and backchannels naturally
- Can call tools while the conversation continues
- Completed 83.6% of Tau3 support tasks on first attempt (vs 45.7% for prior model)
- Supports injecting context mid-session via `session.update`

This means Voice Guardian can be updated with new information mid-conversation if the user reveals something (e.g., "They said they're from SBI bank" → system prompt updates to include SBI impersonation context).

---

## 9. TECHNOLOGY STACK — WITH JUSTIFICATION

| Component | Technology | Why |
|---|---|---|
| Backend API | FastAPI (Python) | Async support, fast, matches LangGraph ecosystem |
| Message Queue | Apache Kafka | Decouples payment events from processing; industry standard for financial event streaming |
| Hot Data Cache | Redis | Sub-millisecond lookups for user profile, recent history, recipient cache |
| Persistent Storage | PostgreSQL | Structured audit logs, transaction history, HITL state persistence |
| Agent Orchestration | LangGraph | Native HITL interrupt/checkpoint, stateful graph execution, conditional routing — purpose-built for this use case |
| LLM | OpenAI GPT-4o-mini (or Groq Llama-3) | GPT-4o-mini: cost-effective, fast. Groq: near-zero latency if speed is priority |
| Frontend | React + Tailwind | Clean payment simulator UI, real-time status updates via WebSocket |
| Behavioral ML | Rule-based + heuristics (hackathon scope) | XGBoost is ideal for production but rule-based is sufficient to demonstrate Tier 1 |

**Note on LangGraph specifically:** LangGraph is the correct choice here because:
- It supports durable, stateful graph execution (not just chains)
- Its `interrupt()` function is designed exactly for the PAUSE/HITL use case
- State is persisted between agent steps — agents can share and build on each other's output
- Conditional edges let us route between ALLOW/VERIFY/PAUSE based on score

---

## 9. CORE FEATURES MAPPED TO PS REQUIREMENTS

### 9.1 Payment Simulation Interface ✅
A React-based payment form simulating a UPI/bank transfer flow:
- Sender and recipient fields
- Amount input
- **Payment note / memo field** (this is critical for our Intent Agent)
- Real-time status indicator showing agent analysis in progress
- Four pre-loaded scenario buttons for demo use

### 9.2 Transaction Risk Analysis ✅
Two-tier system:
- **Tier 1:** Rule engine + behavioral profiler (< 50ms)
- **Tier 2:** LangGraph multi-agent (invoked only for ambiguous/high-risk)

### 9.3 Rule-Based AND LLM-Based Reasoning ✅
- Rules: Amount thresholds, account age, velocity limits (Tier 1)
- LLM: Intent classification, scam type detection, evidence narration (Tier 2)
- Both are clearly present and demonstrably different in function

### 9.4 Recipient Verification Workflow ✅
- Recipient Agent checks account age, first-time payee, name consistency, network trust
- This runs as a dedicated step in the LangGraph flow
- Results are surfaced to the user in the confirmation dialog

### 9.5 Risk Score / Category ✅
- 0–100 numerical score
- LOW / MEDIUM / HIGH / CRITICAL categories
- Score breakdown showing contribution from each agent

### 9.6 User Confirmation Step ✅
Not a generic "Are you sure?" — a rich confirmation dialog showing:
- Risk score and category
- Evidence summary (bullet points)
- Scam type classification (if detected)
- Plain English explanation
- PROCEED or CANCEL buttons

### 9.7 Pause / Block Mechanism ✅
- LangGraph `interrupt()` fires for HIGH/CRITICAL transactions
- Transaction status set to PAUSED in Postgres
- User receives alert — cannot proceed until they actively confirm
- BLOCK fires automatically for CRITICAL + confirmed scam type detection

### 9.8 Explainable Security Alerts ✅
Example alert shown to user:

> ⚠️ **HIGH RISK — Payment Paused**
>
> We've paused this payment for your protection. Here's why:
> - The recipient account was created **4 days ago**
> - You have **never paid this recipient before**
> - The payment note contains urgency language: *"Emergency", "urgently", "don't tell anyone"*
> - This matches the pattern of a **Family Emergency Scam**
> - This payment is **8.3x larger** than your typical transaction
>
> Scammers use urgency and secrecy to pressure you into paying before you can think clearly. Please call your family member directly before proceeding.
>
> [CANCEL PAYMENT] [PROCEED ANYWAY]

### 9.9 Transaction Audit History ✅
Postgres table storing:
- Transaction ID, timestamp, sender, recipient, amount
- Full evidence report (JSON)
- Risk score + category
- Agent decision
- Final outcome (ALLOWED / BLOCKED / USER_CANCELLED / USER_PROCEEDED_DESPITE_WARNING)
- Viewable in a dedicated Audit History page in the UI

---

## 10. DEMO SCENARIOS — DETAILED WALKTHROUGH

The PS explicitly asks for these scenarios. Here is exactly what happens in each:

### Scenario 1: Normal Payment ✅
- **Input:** ₹500 to a known contact (paid 15+ times before), note: "Lunch money"
- **Tier 1:** Score 8 → ALLOW
- **Tier 2:** Not invoked
- **User sees:** Green checkmark, "Payment processed" — no friction
- **Shows:** System does not over-block; normal payments flow freely

### Scenario 2: New/Unverified Recipient ⚠️
- **Input:** ₹2,000 to a first-time recipient, note: "Rent deposit"
- **Tier 1:** Score 35 (new payee flag) → Escalate
- **Tier 2:** Recipient Agent flags new account + first payee; Intent Agent finds no scam indicators in note
- **Evidence Builder:** Score 42 → MEDIUM
- **User sees:** Advisory notice — "You've never paid this person before. Verify their details." — with a confirm button
- **Shows:** System handles new recipients with appropriate caution, not over-reaction

### Scenario 3: Suspicious Payment Request 🚨
- **Input:** ₹15,000 to unknown recipient, note: "Google Play support — virus removal fee"
- **Tier 1:** Score 55 → Escalate
- **Tier 2:**
  - Transaction Agent: Amount 3x average, risk 0.45
  - Recipient Agent: New account (12 days old), risk 0.78
  - Intent Agent: Detects "Google" in recipient context + "support" + "fee" → classifies as **TECH SUPPORT SCAM**, confidence 0.91
- **Evidence Builder:** Score 82 → CRITICAL
- **User sees:** Full evidence report, scam type label "TECH SUPPORT SCAM", plain English explanation
- **Action:** Transaction PAUSED, user must actively cancel or override
- **Shows:** LLM catches what rules cannot — the payment note is the key signal here

### Scenario 4: High-Risk Transaction Requiring Intervention 🚨🚨
- **Input:** ₹75,000 to brand-new account (3 days old), note: "Urgent investment return — act before midnight"
- **Tier 1:** Score 78 → Escalate
- **Tier 2:**
  - Transaction Agent: 9x average amount, midnight timing, risk 0.89
  - Recipient Agent: 3-day-old account, zero network transactions, risk 0.95
  - Intent Agent: Detects "Urgent", "act before midnight" (deadline pressure), "investment return" → classifies as **INVESTMENT SCAM**, confidence 0.93
- **Evidence Builder:** Score 96 → CRITICAL
- **Action:** Transaction BLOCKED automatically (score > 95 triggers auto-block)
- **User sees:** "This payment has been blocked. It matches all known patterns of an investment scam. If you believe this is legitimate, contact your bank." + Full evidence report
- **Shows:** Autonomous safe decision-making — agent intervenes without human needed when confidence is high enough

### Scenario 5 (Bonus): Impersonation Scam 🚨
- **Input:** ₹5,000 to "RBI Fraud Prevention Cell", note: "Account verification fee as instructed by bank officer"
- **Intent Agent:** Detects "RBI" (government authority impersonation) + "verification fee" (classic impersonation scam structure)
- **Scam Type:** GOVERNMENT_IMPERSONATION_SCAM
- **Key Explanation Point:** "The RBI and banks **never** ask for fees to protect your account. This is a common impersonation scam."

---

## 11. WHAT MAKES THIS DIFFERENT FROM 200 OTHER TEAMS

After research, here is an honest analysis of what most teams will build vs. what we build:

### What Most Teams Will Build
- FastAPI + some ML model → risk score → show warning
- Basic rule engine (amount > threshold = risky)
- A risk score with no explanation of *why*
- LangGraph used as a simple sequential chain, not true multi-agent
- Generic "Are you sure?" confirmation dialog

### What We Build That Others Won't

**1. Intent Agent with Scam Type Classification**
No team will have an agent that reads the payment note and says "this is specifically a Family Emergency Scam using the Fear + Urgency manipulation pattern." This is backed by real research (SCRIPTMIND) and is directly relevant to the PS's mention of "urgency-based social engineering." This is our biggest differentiator.

**2. Tiered Architecture with Honest Separation**
We explicitly separate Tier 1 (rules, fast path) from Tier 2 (agents, escalation). This shows production awareness. Judges with industry experience will know that sending everything through an LLM is wrong — and will respect that we know it too.

**3. Plain English Evidence Report, Not a Number**
We do not show "Risk Score: 87." We show exactly why, in plain English, with specific evidence. This directly addresses the PS requirement for "explainable security alerts" and is the difference between a tool users trust and one they ignore.

**4. Scam Taxonomy**
We classify into specific scam types: Tech Support, Investment, Romance, Family Emergency, Government Impersonation, Refund. This is novel at the payment interception layer and directly maps to real-world attack patterns.

**5. LangGraph HITL Used Correctly**
Many teams will use LangGraph but won't actually use its interrupt/checkpoint for HITL — they'll fake it with a separate API call. We use `interrupt()` properly, which means the agent graph actually pauses mid-execution and resumes after user input.

---

## 12. LIMITATIONS AND HONEST SCOPE

Being honest about scope is itself a strength in judging. Here is what this prototype does NOT do:

| Limitation | Honest Statement |
|---|---|
| Recipient verification is simulated | We do not connect to real UPI/NPCI APIs. Account ages and network data are simulated. In production, Visa A2A Protect or NPCI APIs would provide this. |
| Behavioral ML is rule-based | We use heuristics, not a trained XGBoost/LSTM model. Production systems would have ML trained on labeled fraud data. |
| LLM can hallucinate | We mitigate this with structured output (JSON schema enforcement) and by treating LLM output as one signal among many, not the sole decision-maker. |
| No real-time payment network | Kafka is present but the actual payment execution is simulated. No real money moves. |
| Privacy | In production, payment notes should be anonymized before LLM processing. We note this but do not fully implement it in the hackathon prototype. |
| Cold start problem | Behavioral profiling requires transaction history. New users with no history receive lighter analysis — this is noted and handled gracefully. |

---

## APPENDIX A — KEY METRICS TO QUOTE IN DEMO

These are real, verified statistics from cited sources:

- Authorized Push Payment (APP) fraud losses projected to reach **$15 billion in the US by 2028** (Deloitte, 2025)
- Banks now have only **30–60 seconds** to detect and stop fraud before money moves through mule accounts (Global Fintech Fest 2026, Economic Times BFSI)
- Legacy rule-based systems generate **90–95% false positive rates** (PwC, cited by Oscilar 2026)
- Visa's AI fraud defense prevented **$40 billion** in suspected fraud in 2024 — yet APP/scam fraud is still rising because it bypasses transaction-level detection
- An 11B LLM fine-tuned with crime script inference (SCRIPTMIND) **outperformed GPT-4o by 13%** on social engineering scam detection (arxiv 2601.13581)
- **75% of digital banking fraud** in H1 2022 was APP fraud (Stripe)
- Real-time payment volumes grew **50%+ year-on-year** in 2025 (Yahoo Finance/industry data)

These numbers tell the story in your demo intro: the problem is massive, growing, and not solved by current systems.

---

## APPENDIX B — REFERENCES

1. Deloitte (2025). "The rise of authorized push payment fraud." deloitte.com
2. Economic Times BFSI (2026). "Banks may have only 30–60 seconds to stop digital fraud." Global Fintech Fest 2026 coverage.
3. Oscilar (2026). "Real-Time Transaction Monitoring: 2026 Guide." oscilar.com
4. Visa (2024). "Visa Prevents Approximately $40 Billion in Fraud Using AI." visa.com newsroom
5. Visa (2026). "Visa Launches Enhanced A2A Protect." visa.com
6. arxiv.org/abs/2508.19932 — CASE: Agentic AI Framework for Scam Intelligence in Digital Payments
7. arxiv.org/html/2601.13581v1 — SCRIPTMIND: Crime Script Inference for Social Engineering Scam Detection
8. arxiv.org/html/2607.11707v2 — Explainable Agentic System for Conversational Scam Detection (97.8% accuracy)
9. arxiv.org/abs/2607.19266 — Toward Auditable Fraud Detection: Graph Features + Agent Investigation
10. LangChain Official Docs — Human-in-the-Loop with LangGraph interrupts
11. c-sharpcorner.com — Architecting Real-Time, Scalable Multi-Agent Fraud Detection with LangGraph (Tiered Architecture)
12. PwC / Oscilar — 90–95% false positive rate in legacy rule-based fraud systems
13. Stripe — APP fraud accounted for 75% of digital banking fraud in H1 2022
14. ING / University of Twente — XAI for fraud detection interpretability

---

*Document version: 1.0 | PS09 — Agentic Guardian for Real-Time Payment Scam Interception*

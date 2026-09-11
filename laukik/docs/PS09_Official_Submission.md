# KURUKSHETRA 2.0
## Problem Statement Documentation
### HACKFEST 2026

---

> *"Every scam starts with a moment of trust being broken.*
> *We built the system that catches that moment — before the money moves."*

---

## COVER PAGE

| | |
|---|---|
| **Team ID** | *(fill in on submission day)* |
| **Team Name** | Midnight Ciphers |
| **Team Leader Name** | Laukik Rathod |
| **Problem Statement No.** | PS09 |
| **Problem Statement Name** | Agentic Guardian for Real-Time Payment Scam Interception |
| **Date of Submission** | September 11, 2026 |

---
---

## SECTION 1 — TEAM DETAILS

| | |
|---|---|
| **Team ID** | *(fill in)* |
| **Team Name** | Midnight Ciphers |
| **Team Leader Name** | Laukik Rathod |
| **Problem Statement Number** | PS09 |
| **Problem Statement Name** | Agentic Guardian for Real-Time Payment Scam Interception |

**Team Members:**

| Name | Name |
|---|---|
| Laukik Rathod | *(fill in)* |
| *(fill in)* | *(fill in)* |
| *(fill in)* | *(fill in)* |

---
---

## SECTION 2 — UNDERSTANDING OF THE PROBLEM

### Problem Statement

*In our own words:*

Digital payment scams are not about stolen cards or hacked accounts. They are about **trust being weaponized**. A scammer calls a user, impersonates a bank officer, creates panic, and the user — a rational person — **willingly** sends money. The transaction looks completely normal. The bank's systems see nothing wrong. Within 30–60 seconds the money is gone through a chain of mule accounts, irreversible.

This is called **Authorized Push Payment (APP) fraud** — and it is the fastest-growing financial crime in the world. The PS09 challenge asks us to build an agentic payment-security assistant that intercepts these scams **before** the payment completes — by reasoning about the *intent* behind a payment, not just its numerical properties.

---

### Problem Analysis / Background

**The core failure of every existing fraud system:**

Every bank and payment network today runs ML models on transaction metadata — amounts, timing, velocity, device fingerprints. These systems are excellent at catching unauthorized transactions (stolen cards, account takeover). They are **structurally blind** to payment scams because:

- A scam transaction has a **normal amount**, **normal timing**, and a **valid account** — rule engines see nothing unusual
- The manipulation that causes the scam lives in **language** — in what the scammer said on the phone, in the urgency written in the payment note
- No production system today reads the payment note or classifies scam intent

**Who is being targeted:**

| Victim Profile | Why They Are Targeted |
|---|---|
| Elderly users | Trust authority figures; less experience with digital scam patterns |
| Emotionally distressed users | Fear and urgency shut down rational thinking |
| Low digital literacy users | Cannot evaluate "Are you sure?" dialogs critically |
| Anyone under time pressure | Urgency is the scammer's primary weapon |

**The numbers:**

| Statistic | Source |
|---|---|
| APP fraud losses projected at **$15 billion** in the US by 2028 | Deloitte, 2025 |
| Banks now have only **30–60 seconds** to stop fraud before money moves | Global Fintech Fest 2026, ET BFSI |
| Legacy rule-based systems produce **90–95% false positive rates** | PwC / Oscilar 2026 |
| Visa prevented **$40 billion** in fraud in 2024 — APP scam losses still rising | Visa Public Disclosure |
| **75% of all digital banking fraud** in H1 2022 was APP fraud | Stripe |

---

### Proposed Solution

We propose **Agentic Guardian** — a five-domain AI security layer that intercepts payment scams by reasoning about the *intent* behind a payment, not just its numerical properties.

**The core insight:**

> Most fraud systems ask: *"Does this transaction look abnormal?"*
> We ask: *"Does this transaction look like a scam?"*

These are completely different questions. Our system:

1. **Reads the payment note** — detecting urgency language, secrecy instructions, and authority impersonation using NLP
2. **Names the scam type** — classifying into 6 specific patterns (Tech Support, Investment, Government Impersonation, Family Emergency, Romance, Refund)
3. **Verifies the recipient** — checking account age, name-category consistency, network trust score
4. **Pauses the payment with full evidence** — showing the user *exactly* why, in plain language
5. **Speaks to the user** — Voice Guardian, a real-time voice assistant, activates for users under pressure who cannot process text

**What makes this different from every other team's approach:**

| What Others Build | What We Build |
|---|---|
| Risk score from transaction numbers | Risk score + **named scam type** from language understanding |
| Generic "Are you sure?" dialog | **Evidence report** — specific bullets, causal narrative, plain English |
| Human-in-the-loop as an afterthought | **LangGraph `interrupt()`** — graph state truly persisted, execution genuinely paused |
| Text-only alerts | **Voice Guardian** — live, context-aware voice conversation |
| Single risk tier | **5 directives**: ALLOW · ADVISE · CHALLENGE · PAUSE · BLOCK |
| No audit | **SHA-256 hash-chained** tamper-evident evidence dossier |

---
---

## SECTION 3 — RESEARCH

### Research Conducted

Our solution is built on published research, verified industry data, and documented technical approaches. Every claim in this document is sourced.

---

**Research Area 1 — The APP Fraud Problem**

APP fraud is fundamentally different from traditional payment fraud because the victim authorizes the transaction themselves. Banks at the Global Fintech Fest 2026 confirmed they now have **30–60 seconds** to detect and stop fraud before money moves through mule accounts — down from a 15-minute window previously. This is because real-time payment rails (UPI, Faster Payments) remove the settlement delay that used to give banks time to investigate.

*Sources: Economic Times BFSI, Deloitte 2025, WTW Global Analysis 2025*

---

**Research Area 2 — Why Current Systems Cannot Stop Scams**

Every major payment network (Visa, Mastercard, Stripe Radar) uses ML models trained on transaction metadata. These models are structurally blind to authorized scams because they do not process payment notes, have no model of user intent, and cannot classify scam types. Visa's newly launched **A2A Protect** (June 2026) is the closest industry attempt — it returns a real-time scam probability score for A2A transfers — but still operates purely on transaction metadata, with no language understanding.

*Sources: Visa A2A Protect announcement June 2026, Oscilar 2026, PwC*

---

**Research Area 3 — LLMs for Scam Detection**

**CASE — Conversational Agent for Scam Elucidation** *(arxiv 2508.19932)*
Scams are often orchestrated outside the payment platform (phone, SMS, WhatsApp). Transaction signals alone are insufficient. An agentic framework that reasons about scam context is the correct approach.
→ *We implement this as our Intent Agent analyzing the payment note inline.*

**SCRIPTMIND — Crime Script Inference** *(arxiv 2601.13581v1)*
LLMs can infer the crime script behind a social engineering attempt — what type of scam, what stage, what manipulation technique. An 11B fine-tuned LLM **outperformed GPT-4o by 13%** on scam detection accuracy.
→ *We implement this as scam type classification with manipulation technique labeling.*

**Explainable Agentic Scam Detection** *(arxiv 2607.11707v2)*
Explainability is essential — users who understand *why* something is risky take protective action more reliably. System reached **97.8% accuracy** across 8 scam types on ConScamBench-278.
→ *We implement this as causal contrast narratives in our Evidence Builder.*

**Toward Auditable Fraud Detection** *(arxiv 2607.19266)*
Each layer of a fraud system contributes only under specific conditions. LLM rationale alone is not evidence of a better decision — verifiable signals are required. Layered systems with defined roles per component outperform single-model approaches.
→ *We implement this as our tiered architecture with the Escalate-Only Invariant.*

---

**Research Area 4 — Voice-Based Scam Defense**

The American Bar Association (2025, 2026) documented that older adults are more likely to lack confidence identifying scams, and that AI voice cloning is now being used by scammers to impersonate family members. Text-based warnings fail for users under emotional pressure. The protection mechanism must match the attack vector.
→ *We implement this as Voice Guardian — a real-time voice assistant.*

---

### Existing Solutions / Similar Work

| Solution | What It Does | Critical Gap | How We Go Further |
|---|---|---|---|
| **Visa A2A Protect** | Real-time scam probability score for A2A transfers | No language understanding, no scam type, no user explanation | Intent Agent + named scam type + plain English evidence |
| **Stripe Radar** | ML on transaction metadata, device fingerprint | No payment note analysis | Linguistic NLP on note field |
| **Bank "Confirm Payee"** | Checks recipient name matches account | Only verifies name, no risk reasoning | Account age + network trust + purpose-category mismatch |
| **Generic confirm dialogs** | Binary yes/no for large transfers | No evidence, no explanation, easily dismissed | Full evidence report with specific causal bullets |
| **Bank fraud hotline** | Human agent available to verify | User must find number, wait on hold — scammer still on line | Voice Guardian activates instantly, in-app, with full context |

---

### References / Sources

1. Deloitte (2025) — "The Rise of Authorized Push Payment Fraud" — deloitte.com
2. Economic Times BFSI (2026) — "Banks may have only 30–60 seconds to stop digital fraud" — Global Fintech Fest 2026
3. Oscilar (2026) — "Real-Time Transaction Monitoring: 2026 Guide" — oscilar.com
4. Visa (2026) — "Visa Launches Enhanced A2A Protect" — corporate.visa.com
5. Stripe — "What is Authorized Push Payment Fraud?" — stripe.com
6. arxiv.org/abs/2508.19932 — CASE: Agentic AI Framework for Scam Intelligence in Digital Payments
7. arxiv.org/html/2601.13581v1 — SCRIPTMIND: Crime Script Inference for Social Engineering Detection
8. arxiv.org/html/2607.11707v2 — Explainable Agentic System for Conversational Scam Detection
9. arxiv.org/abs/2607.19266 — Toward Auditable Fraud Detection
10. American Bar Association (2025, 2026) — AI in Financial Scams Against Older Adults
11. LangChain Official Docs — Human-in-the-Loop with LangGraph

---
---

## SECTION 4 — TECHNICAL DOCUMENTATION

### Technology Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend UI** | React + Tailwind CSS | Real-time WebSocket updates, Voice Guardian WebRTC component, Dual-Viewport Cockpit |
| **Backend API** | Python + FastAPI | Async-native, integrates with LangGraph Python ecosystem |
| **Event Streaming** | Apache Kafka | Decouples payment ingestion from processing — industry standard for financial event pipelines |
| **Hot Feature Cache** | Redis | Sub-millisecond feature lookup for GBDT scoring (<15ms Domain 2 requirement) |
| **Persistent Storage** | PostgreSQL | Audit dossier, LangGraph HITL state checkpoints, voice session transcripts |
| **ML Scoring** | GBDT (LightGBM) | Proven <15ms inference on 114 features, interpretable, no cold start problem |
| **Agent Orchestration** | LangGraph | Native `interrupt()` for durable HITL, stateful graph execution, parallel agent dispatch |
| **LLM — Reasoning** | OpenAI GPT-4o-mini | Structured JSON output enforcement prevents hallucination in agent signal extraction |
| **RAG Vector Store** | ChromaDB / pgvector | Scam typology case library for Intent Agent retrieval (FR-AGT-08) |
| **Voice Assistant** | OpenAI Realtime API (`gpt-realtime-2.1`) | Full-duplex speech-to-speech, <1s latency, WebRTC in browser, dynamic context injection |

---

### Technical Flow / System Architecture Diagram

The system is organized into **five sequential domains**. Each domain has a specific responsibility, a defined input, and a defined output. No domain can skip a domain above it.

```
┌─────────────────────────────────────────────────────────────────┐
│                    👤  USER PAYMENT                              │
│            Amount  ·  Recipient UPI  ·  Payment Note            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
╔═════════════════════════════════════════════════════════════════╗
║  DOMAIN 1 — PAYMENT SIMULATION & RECIPIENT WORKFLOW             ║
║                                                                 ║
║  ┌─────────────────────┐    ┌──────────────────────────────┐   ║
║  │  Payment Canvas      │    │  Recipient Verification      │   ║
║  │  · Note ≤ 500 chars  │    │  Panel (visible before pay)  │   ║
║  │  · Amount ceiling    │    │  · Registered category shown │   ║
║  │  · Client validation │    │  · Account age badge         │   ║
║  └─────────────────────┘    │  · First-time payee badge    │   ║
║                              └──────────────────────────────┘   ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Persona Baseline Loader  ·  Purpose-Identity Clash Det  │   ║
║  │  90-day txn history       ·  "Fine" → Personal Handle?   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════╤══════════════╝
                                                   │
                                                   ▼
╔═════════════════════════════════════════════════════════════════╗
║  DOMAIN 2 — FAST PRE-CLEARANCE & RISK ENGINE       < 15ms       ║
║                                                                 ║
║  ┌─────────────────────┐    ┌──────────────────────────────┐   ║
║  │  GBDT Scorer         │    │  Hard Deterministic Gate     │   ║
║  │  114 features        │    │  Sanctions · Mule lists      │   ║
║  │  Score 0–100         │    │  → BLOCK directly (no AI)    │   ║
║  │  + σ uncertainty     │    └──────────────────────────────┘   ║
║  └──────────┬──────────┘                                        ║
║             │           ┌──────────────────────────────────┐   ║
║             │           │  Velocity Windows                 │   ║
║             │           │  1h + 24h cumulative outflow      │   ║
║             │           │  Slow-drip scam detection         │   ║
║             │           └──────────────────────────────────┘   ║
║             │                                                   ║
║    Score ≤ 29 ──────────────────────────► ⚡ FAST EXIT (ALLOW)  ║
║    Score > 85 ──────────────────────────► 🚫 ML BLOCK           ║
║    Score 30–85 ─────────────────────────► ESCALATE ↓            ║
╚═════════════════════════════════════════════╤═══════════════════╝
                                              │  (ambiguous only)
                                              ▼
╔═════════════════════════════════════════════════════════════════╗
║  DOMAIN 3 — AGENTIC REASONING TIER  (LangGraph)                 ║
║                                                                 ║
║              ┌────────────────────────────┐                     ║
║              │     LangGraph Orchestrator  │                     ║
║              │  Warm-path · Shared state   │                     ║
║              └──────┬──────────┬───────┬───┘                    ║
║                     │          │       │    ┌──────────────┐    ║
║              ┌──────┘   ┌──────┘  ┌───┘    │  RAG Store   │    ║
║              ▼          ▼         ▼         │  Scam case   │    ║
║       ┌──────────┐ ┌──────────┐ ┌────────┐ │  typology    │    ║
║       │   TXN    │ │RECIPIENT │ │INTENT  │ │  library     │    ║
║       │  AGENT   │ │  AGENT   │ │ AGENT  │ └──────┬───────┘    ║
║       │          │ │          │ │        │        │            ║
║       │ Amount   │ │ Acct age │ │ NLP on │ ◄──────┘            ║
║       │ Velocity │ │ Name     │ │ note   │                     ║
║       │ Timing   │ │ match    │ │ Scam   │                     ║
║       │ Patterns │ │ Network  │ │ type   │                     ║
║       └────┬─────┘ └────┬─────┘ └───┬────┘                     ║
║            └────────────┼───────────┘                           ║
║                         ▼                                       ║
║              ┌─────────────────────┐                            ║
║              │   EVIDENCE BUILDER  │                            ║
║              │  Weighted score     │                            ║
║              │  Causal narrative   │                            ║
║              │  Plain English      │                            ║
║              └──────────┬──────────┘                            ║
║    Escalate-Only Invariant: F_final = max(Domain2, Domain3)     ║
╚═════════════════════════════════╤═══════════════════════════════╝
                                  │
                                  ▼
╔═════════════════════════════════════════════════════════════════╗
║  DOMAIN 4 — DECISION POLICY & GOVERNANCE                        ║
║                                                                 ║
║         Centralized Decision Gatekeeper                         ║
║         Emits exactly ONE of five directives:                   ║
║                                                                 ║
║   Score  < 30  ──────────────────────► ✅  ALLOW                ║
║   Score 30–49  ──────────────────────► 💡  ADVISE               ║
║   Score 50–64  ──────────────────────► ⚠️   CHALLENGE            ║
║   Score 65–94  ──────────────────────► ⏸   PAUSE  ←── HITL     ║
║   Score ≥  95  ──────────────────────► 🚫  BLOCK  (terminal)    ║
║                                                                 ║
║   Safety Invariant: Final action ≥ Domain 2 decision            ║
║   PAUSE always has an informed "Proceed Anyway" path            ║
║   BLOCK (confirmed mule/sanctions) has NO override              ║
╚═════════════════════════════════╤═══════════════════════════════╝
                                  │
                                  ▼
╔═════════════════════════════════════════════════════════════════╗
║  DOMAIN 5 — COGNITIVE INTERVENTION, EXPLAINABILITY & AUDIT      ║
║                                                                 ║
║  ┌──────────────────┐  ┌──────────────┐  ┌───────────────────┐ ║
║  │  Cognitive Dwell │  │ Explainability│  │  Voice Guardian   │ ║
║  │  Gate            │  │ Engine        │  │                   │ ║
║  │  4–6s countdown  │  │ Causal        │  │  Live voice       │ ║
║  │  Cannot be skipped│  │ contrast      │  │  conversation     │ ║
║  │  Counter-coaching│  │ narratives    │  │  Full context     │ ║
║  │  text shown      │  │ Non-accusatory│  │  injected         │ ║
║  └──────────────────┘  └──────────────┘  └───────────────────┘ ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │              DUAL-VIEWPORT SECURITY COCKPIT               │  ║
║  │  ┌───────────────────────┐  ┌───────────────────────┐   │  ║
║  │  │   CONSUMER VIEW       │  │   SOC ANALYST VIEW    │   │  ║
║  │  │ Plain English · Badge │  │ Agent JSON · Score    │   │  ║
║  │  │ Scam type · Evidence  │  │ SHAP features · σ     │   │  ║
║  │  │ [CANCEL] [PROCEED]    │  │ Audit hash chain      │   │  ║
║  │  └───────────────────────┘  └───────────────────────┘   │  ║
║  └──────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐  ║
║  │  TAMPER-EVIDENT EVIDENCE DOSSIER                          │  ║
║  │  SHA-256 hash chaining · Append-only · Cryptographic     │  ║
║  │  hash(n) = SHA256( hash(n-1) + txn_id + evidence_json )  │  ║
║  └──────────────────────────────────────────────────────────┘  ║
╚═════════════════════════════════════════════════════════════════╝
```

---

### Working / Implementation Approach

**Step 1 — User Initiates Payment (Domain 1)**

The user fills a payment form: sender, recipient UPI ID, amount, and a **payment note** — the field every other fraud system ignores, and our most important input. Before the user sees a "Send" button, the **Recipient Verification Panel** renders the recipient's registered category, account age, and first-time-payee status. The Persona Baseline Loader pulls 90 days of transaction history from Redis to establish the user's personal normal.

---

**Step 2 — Fast Pre-Clearance (Domain 2, < 15ms)**

A Kafka consumer reads the payment event. A GBDT model scores the transaction on 114 features — all served from Redis for sub-millisecond lookup. A Hard Deterministic Override Gate checks against confirmed sanctions and mule account lists, bypassing all AI for immediate BLOCK. Rolling velocity windows track 1-hour and 24-hour cumulative outflow to catch slow-drip scams.

- **Score ≤ 29 + low uncertainty →** FAST EXIT, payment allowed instantly, zero friction
- **Score > 85 →** ML BLOCK
- **Score 30–85 →** escalates to Domain 3

---

**Step 3 — Agentic Reasoning (Domain 3)**

Only ambiguous transactions reach here. The LangGraph Orchestrator dispatches **three agents in parallel**:

**Transaction Agent** — examines numerical and temporal signals: amount vs personal baseline (not population average), time-of-day anomaly, round-number flag, velocity patterns. Outputs structured JSON with signal name, value, risk weight, plain-English description.

**Recipient Agent** — examines the recipient's trustworthiness: account age in days, first-time payee flag, name-to-category consistency (Purpose-Identity Clash), network trust score (how many other users have paid this recipient), simulated blocklist check.

**Intent Agent** — the core differentiator. Uses LLM with structured output enforcement to analyze the payment note:
- Extracts urgency markers: *"emergency", "immediately", "last chance", "act before midnight"*
- Detects secrecy instructions: *"don't tell anyone", "keep this between us"*
- Identifies authority impersonation: recipient named "RBI", "Google Support", "Amazon", "Police"
- Classifies scam type from our taxonomy of 6 patterns with confidence score
- Names the manipulation technique: Fear, Urgency, Authority, Trust, Deadline Pressure

The **Evidence Builder** aggregates all three agents' outputs, applies weighted scoring (Intent weight = 0.40 — highest, because scams live in language), and generates a plain-English causal narrative for the user. A RAG retrieval step fetches the top-3 matching precedents from the scam case library to enrich classification.

The **Escalate-Only Invariant** is enforced: Domain 3 can only raise the score above Domain 2's output — it can never manufacture safety.

---

**Step 4 — Policy Decision (Domain 4)**

The Policy Agent receives the Evidence Builder's output and emits exactly one of five directives:

| Directive | Condition | What Happens |
|---|---|---|
| ✅ **ALLOW** | Score < 30 | Payment executes immediately. Zero friction. |
| 💡 **ADVISE** | Score 30–49 | Soft advisory shown. Single confirm required. |
| ⚠️ **CHALLENGE** | Score 50–64 | Evidence report shown. Dwell gate enforced. Explicit confirmation. |
| ⏸ **PAUSE** | Score 65–94 | LangGraph `interrupt()` fires. State persisted. Voice Guardian activates. User has informed override path. |
| 🚫 **BLOCK** | Score ≥ 95 | Terminal block. No override. Full evidence shown. Logged permanently. |

---

**Step 5 — Cognitive Intervention (Domain 5)**

For CHALLENGE and PAUSE directives:

The **Cognitive Dwell Gate** enforces a 4–6 second countdown that cannot be skipped. Counter-coaching text is shown during the countdown: *"Scammers create urgency. Take a breath. Read this carefully."* This is grounded in behavioral psychology — breaking the scammer's manufactured urgency with enforced pause.

The **Explainability Engine** generates a consumer-facing causal narrative (non-accusatory, AML anti-tipping-off sanitized) and a technical SOC analyst view with agent JSON, SHAP feature attributions, and model uncertainty.

For PAUSE, **Voice Guardian** activates — a real-time voice assistant powered by OpenAI Realtime API. The Evidence Builder's output is injected into the system prompt. The voice model speaks to the user using only verified facts — it cannot hallucinate risk signals because it is constrained to structured data from Domain 3.

Every outcome is stored in the **Tamper-Evident Evidence Dossier** — an append-only Postgres log with SHA-256 hash chaining, making the audit trail cryptographically verifiable.

---

### AI / ML Details

**Domain 2 — GBDT Scorer**

Model: LightGBM Gradient Boosted Decision Trees
Features: 114 total across 6 groups
Inference time target: < 15ms (all features served from Redis)
Output: score (0–100) + uncertainty estimate σ
Uncertainty handling: if σ > 0.35, friction is dampened on edge cases (FR-RISK-04) to prevent false alarm fatigue

**114 Feature Groups:**

| Group | Count | Examples |
|---|---|---|
| Transactional | 22 | amount, log(amount), amount_deviation_ratio, is_round_number, time_of_day |
| Velocity | 18 | txn_count_1h, outflow_sum_1h, outflow_sum_24h, inter_txn_delta_min |
| Recipient | 24 | account_age_days, first_time_payee, name_match_score, network_trust_score |
| User profile | 20 | avg_txn_amount_90d, known_payee_count, account_tenure_days |
| Linguistic | 18 | note_length, note_entropy, urgency_word_count, secrecy_word_count |
| Relational | 12 | payee_network_size, mule_proximity_score, shared_payee_overlap |

**Domain 3 — Intent Agent (LLM)**

Model: OpenAI GPT-4o-mini with `response_format: json_schema` enforcement
Scam taxonomy: 6 types with confidence score and manipulation technique label
Hallucination prevention: structured output schema enforcement — model cannot return free-form text where signals are expected; LLM output treated as one signal among many, not sole decision-maker

**Risk Score Formula:**

```
F = (0.25 × S_txn) + (0.35 × S_rec) + (0.40 × S_int)

Final = max(Domain2_score, F)    ← Escalate-Only Invariant

Decision:
  F < 30             → ALLOW
  30 ≤ F < 50        → ADVISE
  50 ≤ F < 65        → CHALLENGE
  65 ≤ F < 95        → PAUSE
  F ≥ 95             → BLOCK
```

**Voice Guardian — OpenAI Realtime API**

Model: `gpt-realtime-2.1`
Protocol: WebRTC in browser (full-duplex, no turn-waiting)
Latency: < 1 second response
Context: Evidence Builder output injected as system prompt before session opens
Language: Auto-adapts to user's spoken language — Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and others

---

### GitHub Repository Link

**Repository:** https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST

**Branch:** `laukik`

---
---

## SECTION 5 — ORIGINALITY & PLAGIARISM DECLARATION

☐ We confirm that the solution submitted by our team is developed during the hackathon. We have not submitted a pre-built project as our primary solution. Any open-source code, APIs, datasets, libraries, templates, or AI-assisted development used by us have been appropriately acknowledged below.

---

### Open-Source / External Resources Used

| Resource | How Used |
|---|---|
| **LangGraph (LangChain)** | Agent graph orchestration and `interrupt()` for HITL — used as-is per official documentation |
| **FastAPI** | Backend API framework |
| **Apache Kafka** | Event streaming — standard library, no custom modifications |
| **Redis** | Hot feature cache |
| **PostgreSQL** | Persistent storage and audit log |
| **LightGBM** | GBDT model implementation |
| **ChromaDB** | RAG vector store for scam typology library |
| **React + Tailwind CSS** | Frontend framework |
| **OpenAI Python SDK** | API calls to GPT-4o-mini and Realtime API (used within the product) |

No pre-built fraud detection models or pre-labeled datasets were used. All agent logic, prompt designs, scam taxonomy, domain architecture, weighting formulas, the 5-domain feature requirement framework, and the Voice Guardian contextual prompt design are original work developed during the hackathon.

---

### AI Tools Used

| Tool | How Used |
|---|---|
| **Kiro (AI Development Environment)** | Research assistance, architecture design review, documentation drafting |
| **OpenAI GPT-4o-mini** | Runtime LLM powering Intent Agent and Evidence Builder — used *within* the product, not during ideation |
| **OpenAI Realtime API** | Voice Guardian voice sessions — used *within* the product |

---

**Team Leader Signature:** _____________________________ &nbsp;&nbsp;&nbsp;&nbsp; **Date:** September 11, 2026

---
---

## SECTION 6 — UPLOADS / ATTACHMENTS CHECKLIST

- ☐ **Technical Flow / Architecture Diagram** — embedded in Section 4, ASCII + Mermaid format
- ☐ **Research / Reference Document** — Section 3 above with 11 cited sources
- ☐ **Project Documentation / Technical Report** — this document
- ☐ **GitHub Repository Link** — https://github.com/Laukikrathod2007/KURUKSHETRA_2.0_HACKFEST (branch: `laukik`)
- ☐ **Screenshots of Working Prototype** — to be added after build
- ☐ **Dataset / Sample Data** — simulated payment scenarios with sample agent JSON outputs in Section 4
- ☐ **Additional Diagrams** — Voice Guardian flow, Domain-by-domain flows embedded in Section 4

---

### DEMO SCENARIOS — Quick Reference

*The PS requires four scenarios. We demonstrate five.*

| # | Scenario | Amount | Key Signal | Final Score | Directive | What It Shows |
|---|---|---|---|---|---|---|
| 1 | Normal Payment | ₹500 | Known contact, "Lunch money" | 6 | ✅ ALLOW | Zero friction for safe payments |
| 2 | New Recipient | ₹2,000 | First-time payee, clean note | 38 | 💡 ADVISE | Proportional caution, not alarm |
| 3 | Tech Support Scam | ₹15,000 | "Google support fee — act now or lose access" | 83 | ⏸ PAUSE + Voice Guardian | Intent Agent catches what rules cannot |
| 4 | Investment Scam | ₹75,000 | "Act before midnight" + 3-day-old account | 97 | 🚫 AUTO-BLOCK | Safe autonomous decision at high confidence |
| 5 | Govt. Impersonation | ₹5,000 | "RBI verification fee" | 79 | ⏸ PAUSE + Voice Guardian | India-specific scam taxonomy |

---

*Kurukshetra 2.0 — HACKFEST 2026*
*Team: Midnight Ciphers | PS09 — Agentic Guardian*
*Detect. Intercept. Protect.*

---

*Kurukshetra 2.0 – HACKFEST 2026 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Page*

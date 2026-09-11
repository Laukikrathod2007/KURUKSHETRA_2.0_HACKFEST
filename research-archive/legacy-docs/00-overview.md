# Project Overview & Scope
## Project Kurukshetra — Agentic Guardian

---

## 1. Problem Statement (Authoritative)

`ps.md`, verbatim:

> **Challenge:** Digital payment scams can involve suspicious payment
> requests, impersonation, unusual recipients, urgency-based social
> engineering, or potentially fraudulent transaction patterns. Users need
> protection before a suspicious transaction is completed.
>
> **Objective:** Build an agentic payment-security assistant capable of
> analyzing a payment request, evaluating risk, verifying relevant
> information, and taking appropriate protective action before transaction
> completion.
>
> **Core Requirements:** Payment simulation interface · Transaction-risk
> analysis · Rule-based and/or LLM-based reasoning · Recipient verification
> workflow · Risk score/category · User confirmation step · Pause/block
> mechanism · Explainable security alerts · Transaction audit history.
>
> **Expected Demo:** A normal payment; a new/unverified recipient; a
> suspicious payment request; a high-risk transaction requiring
> intervention — demonstrate how the agent handles each differently.
>
> **What a Strong Solution Demonstrates:** Real-time security reasoning ·
> Fraud prevention · Human-in-the-loop intervention · Explainability ·
> Safe autonomous decision-making.

Full requirement traceability is in [`01-srs.md`](./01-srs.md) §2.

---

## 2. Design Filter

Every requirement, architectural choice, and differentiator in this spec
is filtered through one causal statement:

> A user is about to authorize sending money based on a **false belief**
> about who they're paying or why. The only lever any protective system
> has is inserting a **true fact**, or a **deliberate delay**, into the
> gap between "believes" and "authorizes," before the payment is
> confirmed. A capability that does neither is not core.

This is called **the Core Lever** in the rest of this documentation set.

Two consequences that shape the whole design:

- This is **Authorized Push Payment (APP) scam** interception: the victim
  authenticates genuinely and authorizes the payment themselves, so
  credential/device-anomaly checks (2FA, biometrics) do not help — only
  reasoning about the payment's content and context does. This is why
  ps.md asks for "rule-based **and** LLM-based reasoning": rules catch
  numeric abnormality, only language/context reasoning catches
  manipulation of a numerically-normal payment.
- Once a payment is authorized, it is effectively irreversible within
  minutes, so the only architecturally honest place to intervene is the
  **confirmation step, before the user commits** — not inside a
  synchronous payment-clearing call. See
  [`02-architecture.md`](./02-architecture.md) §2 for why.

---

## 3. Scope Decision

**This project is a standalone, consumer-facing payment simulator with an
embedded Guardian agent** — one user, one simulated device, one payment
at a time. It is **not** bank/national-switch infrastructure.

**Why:** `ps.md` describes "a payment request" (singular, device-local)
and asks for a working prototype of an end-to-end workflow — not
transaction-per-second targets or inter-bank integration. Enterprise-scale
framing (message queues, HSMs, multi-region deployment, inter-bank
cryptography) is preserved only as far as the out-of-scope list below;
it is not built, diagrammed as built, or depended on by any demo.

### 3.1 Explicitly out of scope

- Real bank, UPI, or NPCI integration of any kind.
- National payment-switch-scale infrastructure.
- Real device telemetry (real call-state APIs, real accessibility-service
  data, real biometric sensors). Any device signal used (e.g. "a call is
  currently active") is a **simulated UI toggle**, never live device
  access.
- Real recipient KYC/identity data — recipient identity resolution is a
  **mock directory** this project owns.
- **Any simulated multi-user network signal** (e.g., "3 other users
  recently flagged this recipient"). A single-user simulator has no
  honest way to produce this; hardcoding it to fire in a demo is
  fabricated evidence. Rejected outright — see §5.3, C1.
- Reading the content of other apps (WhatsApp, SMS, call audio) — illegal
  and technically blocked by OS sandboxing; never modeled as available.
- Any autonomous, permanent, unappealable action without a human in the
  loop.

---

## 4. Objectives

1. Real-time-feeling security reasoning over a simulated payment, using
   both deterministic rules/ML and genuine LLM reasoning, each doing what
   it's actually good at.
2. A working, non-stubbed, bounded agentic investigator — replacing the
   fully-mocked agent module in the existing partial prototype.
3. Recipient verification via a purpose-vs-identity consistency check.
4. Graduated, explainable, human-in-the-loop intervention that resists
   habituation/dismissal.
5. A deterministic policy layer the LLM can only push toward more
   caution, never less, plus a proven fail-open path.
6. A full, tamper-evident audit trail of every decision.
7. No fabricated benchmark numbers, no overclaimed autonomy, no simulated
   capability presented as real infrastructure.

---

## 5. Differentiator Decisions (binding scope)

### 5.1 CORE — must be built and demonstrated

| # | Capability | ps.md requirement it answers |
|---|---|---|
| **D1** | Entity–Purpose Consistency Check — payment's stated purpose vs. recipient's resolved identity/category | Recipient verification workflow |
| **D2** | Real bounded LLM agent classifying manipulation pattern (urgency, secrecy, authority) and scam type from the payment note | "Urgency-based social engineering," "impersonation," LLM-based reasoning |
| **D3** | Graduated, anti-habituation intervention UI (forced active engagement, not a dismissible dialog) | User confirmation step, pause/block mechanism |
| **D4** | Plain-language causal evidence report, not a raw score | Explainable security alerts |
| **D5** | Deterministic-policy-supreme invariant: LLM can escalate risk, never de-escalate below the deterministic floor | Safe autonomous decision-making |
| **D6** | Tamper-evident, hash-chained audit log | Transaction audit history |
| **D7** | Fail-open demonstration (system degrades gracefully if AI reasoning fails) | Safe autonomous decision-making |
| **D8** | Uncertainty-aware decisioning (thin evidence ≠ strong evidence) | Safe autonomous decision-making; prevents over-blocking legitimate payments |
| **D9** | Adversarial / prompt-injection red-team demonstration | Safe autonomous decision-making, proven live rather than asserted |
| **D10** | Multi-specialist reasoning: the warm-path agent runs a small, fixed set of specialist lenses (identity/purpose, linguistic manipulation, behavioral velocity, historical pattern) and a coordinator synthesizes them into one verdict | "Analyzing a payment request... evaluating risk" — deepens D2 into genuine multi-angle reasoning rather than one pass |
| **D11** | Historical pattern retrieval (RAG) against a small, project-authored corpus of documented scam typologies | Recipient/pattern verification; explainability (cites the closest known pattern, not just a raw classification) |
| **D12** | Velocity-window detection: rolling-window features (transaction count/amount over recent time windows) added to the hot path | Transaction-risk analysis; closes a specific gap in the original design — slow-burn, multi-tranche scams (e.g. escalating "task scam" transfers) that a single-transaction view misses |

D1 and D2 are built as **one fused reasoning capability**, not two
separate bolt-ons: the agent forms a hypothesis about the payment's
purpose and checks it against the resolved recipient identity as part of
a single reasoning pass. D10 formalizes this fusion into an explicit
multi-specialist structure — see §5.1.2 below and
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §2 for the full design.

### 5.1.1 Why D10–D12 were added, and what was deliberately *not* copied

D10–D12 were added after comparing this project against a real,
independently-built agentic fraud-detection system
(`streaming-fraud-intelligence`, github.com/siddharthaDevineni) that uses
five parallel specialist LLM agents and a RAG store of historical
confirmed-fraud cases. Two things from that comparison were adopted, and
one thing was explicitly and deliberately **not** adopted:

- **Adopted:** the idea that a single reasoning pass under-uses what an
  LLM-driven investigation can do — multiple specialist lenses, each
  looking at a different facet of the evidence, produce a richer,
  more defensible verdict than one generalist pass. This is D10.
- **Adopted, but re-scoped for honesty:** retrieval against a case
  corpus. Their system retrieves against *live, cross-customer confirmed
  fraud cases* — which requires real multi-user data this project does
  not have and, per §5.3 C1, refuses to fabricate. **This project's RAG
  corpus (D11) is a small, static, project-authored reference set of
  documented scam typologies** (tech-support scam, romance scam,
  investment/pig-butchering scam, government-impersonation scam, etc.) —
  closer to a curated reference textbook than a live case database. This
  is buildable and honest; a fabricated live case-flagging signal is not.
  See [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.5 for
  the corpus specification.
- **Explicitly NOT adopted:** their design lets the LLM ensemble assess
  its own confidence/tier rather than a separate deterministic formula.
  This project keeps D5 (deterministic-policy-supreme invariant)
  unchanged — D10's coordinator still emits the same schema-validated,
  escalate-only verdict defined in
  [`03-agent-and-tools.md`](./03-agent-and-tools.md) §7, and the Policy
  Engine, not any agent, still has sole final authority (FR-POL-01,
  FR-POL-04). Adding more reasoning depth does not relax who is allowed
  to decide.

### 5.1.2 The specialist set (D10)

Four specialists, not five copied verbatim from another project's fraud
taxonomy — each chosen because it maps to a signal this problem actually
has, per the Core Lever (§2):

| Specialist | Question it answers | Backed by |
|---|---|---|
| Identity & Purpose | Does what this payment claims to be for match who the recipient actually is? | D1, FR-REC-02 |
| Linguistic Manipulation | Does the note show urgency, secrecy, or authority-impersonation language? | D2, FR-AGT-03 |
| Behavioral Velocity | Is this payment's timing/amount/frequency unusual against a rolling window of this user's own history — not just a single-transaction comparison? | D12 (new), FR-RISK-07 |
| Historical Pattern | Does this payment's shape resemble a known, documented scam typology? | D11 (new), FR-AGT-08 |

A **Coordinator** step (FR-AGT-07) reconciles the four findings into the
single structured verdict the Policy Engine consumes — it does not add a
fifth independent voice, it synthesizes the other four. This keeps the
system inspectable (four specific questions, four specific answers, one
synthesis) rather than an opaque ensemble. Full design in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §2.

### 5.2 BONUS — build only after core is complete and demo-stable

| # | Capability | Why bonus, not core |
|---|---|---|
| **B1** | Simulated trusted-contact / co-approval step for high-risk + low-confidence + vulnerable-user cases | Refines *what happens next* for one user segment; does not change whether the system detects a scam. Cheap to add (a toggle + a simulated notification) once core is solid. |
| **B2** | Feedback-driven corpus growth: an operator can mark a past decision "confirmed scam," which adds it as a new retrievable case in the D11 corpus | A scoped, honest analog to the "online learning" idea from the comparison project — it enriches *retrieval*, not the trained risk model itself (no live retraining of the hot-path model is attempted; see §5.3 C9). Valuable to show the system can improve, but not required for the core demo to be complete. |

### 5.3 CUT — explicitly rejected, not built

| # | Capability | Why |
|---|---|---|
| **C1** | Simulated multi-user recipient-risk signal | Fabricates state a single-user simulator cannot honestly have. |
| **C2** | Enterprise/bank-grade production architecture as a build target | Not buildable or verifiable in this environment; would not survive cross-examination if presented as built. |
| **C3** | Reading third-party app content (messages, call audio) | Illegal and technically blocked on real devices. |
| **C4** | Real-time LLM/GNN inference inside a hard sub-50ms hot path | Physically incompatible with LLM latency; reasoning happens pre-confirmation instead (`02-architecture.md` §2). |
| **C5** | Autonomous, permanent, unappealable blocking | No legally/ethically defensible basis without a human path. |
| **C6** | Literal fund custody / "escrow hold" as a cooling-off mechanism | Requires ledger write access, contradicting the system's own no-fund-custody invariant. Any cooling-off is a soft UI pause only. |
| **C7** | Exotic/experimental ideas (scambaiter decoys, biometric coercion detection, acoustic deepfake detection, blockchain tracing, FX locks) | Require hardware/data/infrastructure this project cannot access; none change whether the Core Lever fires. |
| **C8** | Reporting evaluation numbers as if empirically proven on real-world data | This project reports only what it measures on its own synthetic suite — see [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §1. |
| **C9** | Live retraining of the hot-path risk model from feedback (true "online learning") | Genuine online learning (as in the comparison project's River-based approach) requires a real feedback-label pipeline and drift monitoring this project cannot honestly run in a hackathon timeframe. B2 (feedback-driven RAG corpus growth) is the honest, scoped substitute — it grows what can be *retrieved*, not the trained model's weights. |
| **C10** | Retrieving against live, cross-user confirmed-fraud case data | Would require real multi-user data this project does not have — the same reason C1 is rejected. D11's corpus is static and project-authored instead (§5.1.1). |

---

## 6. System Naming

Internal/codebase name: `kurukshetra` (matches the existing
`src/kurukshetra/` module). User/demo-facing name: **Agentic Guardian**
(matches ps.md's own title).

---

## 7. Document Map

| Document | Purpose |
|---|---|
| [`PRD.md`](./PRD.md) | Single comprehensive, standalone narrative covering the entire project end to end — read this if you want everything in one document |
| [`01-srs.md`](./01-srs.md) | Functional & non-functional requirements, traced to ps.md |
| [`02-architecture.md`](./02-architecture.md) | System architecture, components, data flow |
| [`03-agent-and-tools.md`](./03-agent-and-tools.md) | Guardian agent reasoning loop, tool contracts, output schema |
| [`04-risk-and-policy.md`](./04-risk-and-policy.md) | Risk scoring, uncertainty handling, policy tiers, friction UI |
| [`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) | Threats, safety invariants, failure handling, privacy |
| [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) | Metrics, test scenarios, honest-evaluation policy |
| [`07-demo-script.md`](./07-demo-script.md) | Judge-facing walkthrough |
| [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) | Data model, mock data, scenario definitions |

---

## 8. Non-Goals

- Not a general-purpose fraud-detection platform.
- Not a compliance or regulatory-reporting product.
- Not a claim of production readiness or real-world measured performance.
- Not an unbounded multi-agent "swarm" — D10 adds four fixed specialist
  lenses plus one coordinator (five reasoning steps total, not an
  open-ended negotiating ensemble), all still subordinate to one
  deterministic Policy Engine; see
  [`02-architecture.md`](./02-architecture.md) §1 and
  [`03-agent-and-tools.md`](./03-agent-and-tools.md) §2 for the
  reasoning and the bound.
- Not a system where the LLM assesses its own final confidence/authority
  — that decision stays with deterministic code no matter how many
  specialist lenses feed into it (§5.1.1).

## 9. Assumptions & Constraints

- Single developer workstation; no real bank/NPCI/UPI API access; no real
  transaction data; no GPU cluster.
- All recipient, user-history, and device-telemetry data is synthetic and
  owned by this project — stated wherever such data is used, not only
  here.
- One user, one simulated device, one payment at a time — no concurrency
  or multi-tenant claims.
- The LLM used by the agent is an external dependency that can be slow,
  wrong, or unavailable; every design decision assumes this.

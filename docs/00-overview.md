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

D1 and D2 are built as **one fused reasoning capability**, not two
separate bolt-ons: the agent forms a hypothesis about the payment's
purpose and checks it against the resolved recipient identity as part of
a single reasoning pass.

### 5.2 BONUS — build only after core is complete and demo-stable

| # | Capability | Why bonus, not core |
|---|---|---|
| **B1** | Simulated trusted-contact / co-approval step for high-risk + low-confidence + vulnerable-user cases | Refines *what happens next* for one user segment; does not change whether the system detects a scam. Cheap to add (a toggle + a simulated notification) once core is solid. |

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

---

## 6. System Naming

Internal/codebase name: `kurukshetra` (matches the existing
`src/kurukshetra/` module). User/demo-facing name: **Agentic Guardian**
(matches ps.md's own title).

---

## 7. Document Map

| Document | Purpose |
|---|---|
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
- Not a multi-agent "swarm" — a single bounded agent is sufficient; see
  [`02-architecture.md`](./02-architecture.md) §1 for the reasoning.

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

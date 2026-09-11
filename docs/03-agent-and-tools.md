# Agent & Tool Specification
## Project Kurukshetra — Agentic Guardian

Specifies the Guardian agent referenced in
[`02-architecture.md`](./02-architecture.md) §3–4 (warm path) and
[`01-srs.md`](./01-srs.md) §3.4 (FR-AGT). A project named "Agentic
Guardian" whose agent turns out to be a fixed pipeline narrated by an LLM
is a credibility risk. This document commits to a specific, testable
design and a pre-agreed fallback if it proves unstable to build in time.

---

## 1. What the Agent Solves

Per the Core Lever (`00-overview.md` §2), the agent's job is:

> Given a payment's stated purpose, its resolved recipient identity, and
> the user's history, determine whether there is a **false belief** the
> user appears to hold about who they are paying or why — and produce
> evidence a human can act on.

This is a narrow, well-defined reasoning task. It is not a general
chat assistant, not a fraud "co-pilot" with broad authority, and not a
decision-maker. It produces evidence; the Policy Engine
(`02-architecture.md` §5 step 7) decides.

---

## 2. Tool Set (Read-Only, Bounded)

The agent has access to a **small, fixed set of read-only tools** — never
write access, never fund movement, never external network access beyond
these mocked lookups.

| Tool | Input | Output | Notes |
|---|---|---|---|
| `resolve_recipient_identity` | `recipient_id` | `{identity_category, account_age_days, is_first_time_for_user}` | Backed by the mock Recipient Directory. Usually already resolved by the hot path (`02-architecture.md` §5 step 2) and passed in as context, so the agent typically does **not** need to call this itself — included as a tool primarily so the agent can re-check or clarify a specific field if its reasoning needs it. |
| `check_purpose_consistency` | `stated_purpose_category, identity_category` | `{consistent: bool, explanation}` | Deterministic comparison logic (not an LLM judgment) — the agent calls this to get a structured verdict on D1 rather than reasoning about it freeform, keeping this safety-relevant check auditable and consistent. |
| `lookup_user_payment_history` | `recipient_id` | `{has_paid_before: bool, prior_payment_count, typical_amount_range}` | Backed by the synthetic User History Store. |
| `classify_manipulation_language` | `note_text` | `{urgency: bool, secrecy: bool, authority_claim: bool, matched_phrases[]}` | A deterministic keyword/pattern pre-classifier the agent can call to get a structured starting signal before applying its own language understanding — this keeps the *first pass* auditable, while the agent's own reasoning (not this tool) is what produces the final `manipulation_signals` and `scam_typology` in its verdict. |

**Explicitly not provided as tools:** anything with write access;
anything claiming access to real bank, NPCI, or UPI systems; anything
claiming access to another app's content, call audio, or device sensors
beyond the simulated toggles already surfaced to the hot path; anything
resembling a "GNN mule-graph lookup" or "biometric attestation service" —
capabilities that cannot honestly exist in this environment and were
identified as a specific defect in the prior partial prototype (see §6).

---

## 3. Conditional Tool-Calling — The Honesty Commitment

This is the point most likely to draw scrutiny — the commitment below is
binding for whichever variant gets built.

### 3.1 Target design (build this if at all possible)

The agent calls tools **conditionally, based on intermediate findings**,
not in a fixed sequence regardless of what it learns. Concretely:

1. The agent always starts with `classify_manipulation_language` on the
   note (cheap, always relevant) and `check_purpose_consistency` using
   the purpose/identity context it was given.
2. **Only if** `check_purpose_consistency` returns `consistent: false`,
   **or** the manipulation classifier flags urgency/secrecy/authority
   language, does the agent call `lookup_user_payment_history` — because
   at that point "has this user paid this recipient before, safely,
   many times" is the specific fact that could resolve the ambiguity
   (e.g., a long-standing relationship makes an isolated odd note far
   less alarming; a first-time payment with both flags is far more
   alarming).
3. The agent then produces its structured verdict, citing exactly which
   evidence it used.

This means the tool actually called, and the order, **varies by
transaction** — a genuinely different reasoning path for the "normal
payment with an odd note" case versus the "first-time recipient with
urgency language" case. This is what makes it honest to describe as
conditional/adaptive reasoning rather than a fixed pipeline with an LLM
narrating over it.

### 3.2 Pre-committed fallback (use this without shame if the target design is not demo-stable in time)

If the conditional tool-selection logic cannot be made reliable in the
available build time, the fallback is: the agent calls all tools in a
**fixed order** every time, and the LLM's actual reasoning work is
entirely in **interpreting** the combined evidence (producing the scam
typology, confidence, and plain-language rationale from the note text and
the tool outputs) rather than in **choosing what to look up**.

**This fallback must be labeled accurately in every document, the demo
script, and any judge-facing material as "structured-output reasoning
over a fixed evidence-gathering pipeline,"** not as "adaptive tool
selection" or "autonomous agent behavior." A fixed pipeline honestly
described is a perfectly respectable hackathon deliverable; a fixed
pipeline dishonestly described as adaptive is a liability the moment a
judge opens the code or asks "show me it skip a tool." §3.1 vs §3.2 is a
binary choice to be made and stated plainly, not blurred.

---

## 4. Agent Prompt Structure

The agent's system instructions are structurally isolated from
user-controllable content (see
[`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) §2 for
the full injection-defense design). At a structural level, the prompt
contains, in clearly delimited, non-user-editable sections:

1. **Role and boundaries**: the agent's sole job (§1), its tool set (§2),
   and an explicit, repeated statement that it has no authority to
   approve, deny, or move funds — it only produces evidence for the
   policy layer.
2. **Context** (system-populated, not free user text): resolved recipient
   identity category, purpose–identity consistency result, user history
   summary, hot-path tier.
3. **Untrusted content, explicitly tagged as such**: the raw payment
   note text, wrapped so the model is instructed to treat it as data to
   analyze, never as instructions to follow.
4. **Required output schema** (§5) — the model is instructed to respond
   only in this schema; anything else is treated as a schema-validation
   failure and triggers the fallback path (NFR-REL-01).

---

## 5. Output Schema

```json
{
  "scam_typology": "string | null",
  "manipulation_signals": {
    "urgency": "boolean",
    "secrecy": "boolean",
    "authority_claim": "boolean"
  },
  "purpose_identity_consistent": "boolean",
  "confidence": "float [0.0-1.0]",
  "evidence": [
    "string — one short, specific, plain-language observation per item"
  ],
  "recommended_tier_delta": "NONE | RAISE_ONE | RAISE_TO_MAX"
}
```

Constraints enforced outside the model, in code, not trusted to the
model's own compliance:

- `recommended_tier_delta` can only ever be interpreted by the Policy
  Engine as **raising** caution relative to the hot-path tier — there is
  no schema value that can lower it, and even if the field were
  malformed or adversarially manipulated, the Policy Engine's own logic
  has no code path that reduces caution based on agent output
  (`01-srs.md` FR-POL-04). This is the concrete implementation of the
  "LLM can only escalate" invariant, not merely a prompt instruction the
  model is trusted to follow.
- `confidence` directly feeds the uncertainty-dampening logic in
  [`04-risk-and-policy.md`](./04-risk-and-policy.md) §3 — a low-confidence
  verdict is not permitted to drive the most severe (PAUSE) action alone.

---

## 6. What This Replaces From the Prior Partial Prototype

The existing partial codebase (`src/kurukshetra/soc_agent.py`) contains a
module that calls four fixed "tools" in a fixed order, each of which
returns a hardcoded dictionary literal regardless of input, with zero
real LLM calls and zero adaptive behavior. Two of its four mocked tools
(a graph-neural-network mule-cluster lookup and a device hardware
attestation service) represent capabilities that **cannot honestly exist**
in this project's environment at all — not just capabilities that are
mocked for the demo, but capabilities with no truthful mock available,
since the project has no real device or interbank graph data to stand in
for. This document supersedes that module's design entirely. The build
phase should treat `soc_agent.py` as fully replaced, not extended — the
one component discarded rather than built upon; every other module in
`src/kurukshetra/` is extended, not rewritten (see
[`02-architecture.md`](./02-architecture.md) §4).

---

## 7. Timeout, Retry, and Fail-Open (Cross-Reference)

Specified fully in `01-srs.md` NFR-PERF-02 and NFR-REL-01/02: a hard
timeout (3–5s), one retry on timeout or schema-invalid output, then fail
open to the hot-path tier alone with the degradation event logged and
demonstrable as its own scenario. The demo must additionally have a
pre-scripted, cached response path independent of this in-product
fail-open behavior, purely to protect the live presentation from network
flakiness — see [`07-demo-script.md`](./07-demo-script.md) §6 for that
demo-specific safeguard, which is distinct from (and in addition to) the
product's own fail-open design.

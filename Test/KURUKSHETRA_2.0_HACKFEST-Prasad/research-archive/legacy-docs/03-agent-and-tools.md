# Agent & Tool Specification
## Project Kurukshetra — Agentic Guardian

Specifies the Guardian agent referenced in
[`02-architecture.md`](./02-architecture.md) §3–4 (warm path) and
[`01-srs.md`](./01-srs.md) §10 (FR-AGT). A project named "Agentic
Guardian" whose agent turns out to be a fixed pipeline narrated by an LLM
is a credibility risk. This document commits to a specific, testable
design — now a bounded multi-specialist structure (D10) plus historical
pattern retrieval (D11) — and a pre-agreed fallback if any part of it
proves unstable to build in time.

---

## 1. What the Agent Solves

Per the Core Lever (`00-overview.md` §2), the agent's job is:

> Given a payment's stated purpose, its resolved recipient identity, the
> user's history, and how this payment compares to known scam patterns,
> determine whether there is a **false belief** the user appears to hold
> about who they are paying or why — and produce evidence a human can
> act on.

This is a narrow, well-defined reasoning task, decomposed into four
narrower sub-questions (§2) rather than one broad pass. It is not a
general chat assistant, not a fraud "co-pilot" with broad authority, and
not a decision-maker at any stage. It produces evidence; the Policy
Engine (`02-architecture.md` §5 step 9) decides — this remains true no
matter how many specialist lenses feed into that evidence.

---

## 2. The Specialist Architecture (D10)

Four specialists, each answering one specific question, plus a
Coordinator that synthesizes their answers into one verdict. This is a
**fixed-shape decomposition**, not an open-ended multi-agent negotiation
— see `00-overview.md` §5.1.1 and §8 for why this distinction matters and
what was deliberately not copied from the comparison project that
inspired it.

| Specialist | Question | Primary inputs | Tools it may call |
|---|---|---|---|
| **Identity & Purpose** | Does the recipient's actual registered identity match what this payment claims it's for? | `identity_category`, `stated_purpose_category` (both already computed by the hot path) | `check_purpose_consistency` (usually only to re-confirm; rarely needs to call `resolve_recipient_identity` itself since the hot path already did) |
| **Linguistic Manipulation** | Does the note contain urgency, secrecy, or authority-impersonation language, and what does it imply? | Raw note text (explicitly untrusted, §5) | `classify_manipulation_language` |
| **Behavioral Velocity** | Is this payment's timing, amount, or frequency unusual against a *rolling window* of this user's own history — not just a single-transaction comparison? | Pre-computed velocity features from the hot path (`04-risk-and-policy.md` §1); may drill deeper | `lookup_user_payment_history` |
| **Historical Pattern** | Does this payment's overall shape resemble a known, documented scam typology? | Note text + resolved identity + purpose-consistency result, combined into a query | `retrieve_similar_scam_pattern` (RAG, §3) |
| **Coordinator** | Given all of the above, what is the single best verdict? | The four specialists' individual findings (whichever returned — §4 for degradation) | None — synthesizes only, calls no tools, introduces no new evidence of its own |

Specialists run **concurrently**, not sequentially (each has its own
sub-timeout inside the total warm-path budget —
[`02-architecture.md`](./02-architecture.md) §6), and the Coordinator
runs once all specialists have returned or timed out. This bounds total
latency to roughly one specialist round-trip plus one synthesis
round-trip, not four sequential round-trips.

---

## 3. Tool Set (Read-Only, Bounded)

The agent (across all five reasoning steps above) has access to a
**small, fixed set of read-only tools** — never write access, never fund
movement, never external network access beyond these mocked/local
lookups.

| Tool | Input | Output | Notes |
|---|---|---|---|
| `resolve_recipient_identity` | `recipient_id` | `{identity_category, account_age_days, is_first_time_for_user}` | Backed by the mock Recipient Directory. Usually already resolved by the hot path (`02-architecture.md` §5 step 2) and passed in as context — included so a specialist can re-check or clarify a specific field if its reasoning needs it. |
| `check_purpose_consistency` | `stated_purpose_category, identity_category` | `{consistent: bool, explanation}` | Deterministic comparison logic (not an LLM judgment) — called to get a structured verdict on D1 rather than reasoning about it freeform, keeping this safety-relevant check auditable and consistent. |
| `lookup_user_payment_history` | `recipient_id` | `{has_paid_before: bool, prior_payment_count, typical_amount_range}` | Backed by the synthetic User History Store. |
| `classify_manipulation_language` | `note_text` | `{urgency: bool, secrecy: bool, authority_claim: bool, matched_phrases[]}` | A deterministic keyword/pattern pre-classifier — keeps the *first pass* auditable, while the Linguistic Manipulation specialist's own reasoning (not this tool) produces the final `manipulation_signals` and contributes to `scam_typology`. |
| `retrieve_similar_scam_pattern` **(new, D11)** | A short query text (note + purpose/identity summary) | `{typology, similarity_score [0.0-1.0], corpus_entry_id, description}`, or `null` if nothing clears a minimum similarity floor | Backed by the small, static, project-authored corpus in [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.5 — embedding similarity search, **not** a live or cross-user case lookup (`00-overview.md` §5.1.1, C10). Returns `null` rather than a forced weak match — the specialist must not report a pattern match that isn't actually a good one. |

**Explicitly not provided as tools:** anything with write access;
anything claiming access to real bank, NPCI, or UPI systems; anything
claiming access to another app's content, call audio, or device sensors
beyond the simulated toggles already surfaced to the hot path; anything
resembling a "GNN mule-graph lookup" or "biometric attestation service" —
capabilities that cannot honestly exist in this environment and were
identified as a specific defect in the prior partial prototype (see §7);
anything that queries live, cross-user, or growing case data (that's
exactly what `retrieve_similar_scam_pattern`'s static corpus deliberately
is not — see `00-overview.md` §5.3, C10, and B2 for the one narrow,
explicitly-scoped exception where an *operator-confirmed* case may be
added to the corpus after the fact).

---

## 4. Conditional Tool-Calling — The Honesty Commitment

This is the point most likely to draw scrutiny — the commitment below is
binding for whichever variant gets built, and now applies **per
specialist**, not to one monolithic agent.

### 4.1 Target design (build this if at all possible)

Each specialist calls its tool(s) **conditionally, based on what it
already has versus what it still needs** — not reflexively on every
transaction regardless of findings. Concretely, for the Identity &
Purpose specialist as the running example (the same principle applies to
the others):

1. It first checks whether `check_purpose_consistency`'s result was
   already computed and passed in as context (it usually was, by the hot
   path). If so, it does not re-call the tool — it reasons over the
   existing result.
2. It only calls `resolve_recipient_identity` itself if it needs to
   clarify a specific field not already in context (e.g., double-checking
   `account_age_days` against a borderline threshold).

Cross-specialist conditionality also exists: the **Historical Pattern**
specialist's query to `retrieve_similar_scam_pattern` is constructed
using the *other* specialists' preliminary findings when available (e.g.,
if Linguistic Manipulation already flagged "urgency + secrecy," that
informs the query), rather than querying on raw note text alone — this is
what makes the retrieval step genuinely informed by the reasoning
happening elsewhere, not an isolated lookup.

This means the tool calls actually made, and their inputs, **vary by
transaction** — a genuinely different reasoning path per case. This is
what makes it honest to describe the system as doing conditional/adaptive
reasoning rather than running a fixed pipeline with an LLM narrating over
it.

### 4.2 Pre-committed fallback (use this without shame if the target design is not demo-stable in time)

If cross-specialist conditionality (or even per-specialist conditionality)
cannot be made reliable in the available build time, the fallback is:
every specialist always calls its full tool set in a **fixed order**
every time, and each specialist's actual reasoning work is entirely in
**interpreting** the tool outputs (and, for the Coordinator,
**reconciling** the four specialists' outputs) rather than in **choosing
what to look up**.

**This fallback must be labeled accurately in every document, the demo
script, and any judge-facing material as "structured multi-perspective
reasoning over fixed evidence-gathering pipelines,"** not as "adaptive
tool selection" or "autonomous agent behavior." A fixed pipeline honestly
described is a perfectly respectable hackathon deliverable; a fixed
pipeline dishonestly described as adaptive is a liability the moment a
judge opens the code or asks "show me it skip a tool." §4.1 vs §4.2 is a
binary choice to be made and stated plainly per specialist, not blurred.

---

## 5. Degradation Semantics — When a Specialist Fails or Times Out

Unlike the original single-agent design (where any failure meant a
single fail-open), a multi-specialist structure needs an explicit rule
for **partial** failure:

- Each specialist has its own sub-timeout
  ([`02-architecture.md`](./02-architecture.md) §6). If a specialist
  times out or returns schema-invalid output, it is dropped — its
  "vote" is simply absent, not treated as a finding of "no concern."
- The Coordinator synthesizes from **whichever specialists did return**.
  If zero specialists returned (e.g., the LLM API itself is fully down),
  this is identical to total warm-path failure and triggers the standard
  fail-open path (NFR-REL-01) — proceed on `hot_tier` alone.
- If the Coordinator itself fails or returns schema-invalid output after
  specialists succeeded, this is also treated as total warm-path failure
  — a synthesis failure does not fall back to "trust one specialist
  arbitrarily," it falls back to the hot path, consistent with the
  project's fail-open philosophy.
- Every degradation case (partial or total) is logged in the audit record
  (`08-data-and-scenarios.md` §1.4) with which specialists actually
  returned, so this is inspectable after the fact, not silently
  smoothed over.

---

## 6. Agent Prompt Structure

Every specialist's and the Coordinator's system instructions are
structurally isolated from user-controllable content (see
[`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) §2 for
the full injection-defense design). At a structural level, each prompt
contains, in clearly delimited, non-user-editable sections:

1. **Role and boundaries**: that specialist's one specific question (§2),
   its tool set (§3), and an explicit, repeated statement that it has no
   authority to approve, deny, or move funds — it only produces evidence
   for the Coordinator (which in turn only produces evidence for the
   Policy Engine).
2. **Context** (system-populated, not free user text): whatever
   pre-computed fields are relevant to that specialist's question (§2's
   "Primary inputs" column).
3. **Untrusted content, explicitly tagged as such**: the raw payment note
   text (seen directly by Linguistic Manipulation and Historical Pattern;
   passed only as an already-summarized field to the others), wrapped so
   the model is instructed to treat it as data to analyze, never as
   instructions to follow.
4. **Required output schema** — each specialist emits its own narrow
   structured output; the Coordinator's prompt additionally contains all
   four specialists' outputs verbatim and is instructed to reconcile,
   not invent new evidence. Anything that fails schema validation at any
   stage is treated as that stage's failure (§5), not partially trusted.

---

## 7. Output Schema (Coordinator's Final Verdict)

This is the one schema the Policy Engine actually consumes — individual
specialists have their own narrower internal schemas, but only this final,
synthesized object crosses into the Policy Engine.

```json
{
  "scam_typology": "string | null",
  "manipulation_signals": {
    "urgency": "boolean",
    "secrecy": "boolean",
    "authority_claim": "boolean"
  },
  "purpose_identity_consistent": "boolean",
  "velocity_anomaly": {
    "detected": "boolean",
    "description": "string | null"
  },
  "matched_pattern": {
    "typology": "string | null",
    "similarity_score": "float [0.0-1.0] | null",
    "corpus_entry_id": "string | null"
  },
  "specialist_agreement": "unanimous | majority | split | insufficient_data",
  "confidence": "float [0.0-1.0]",
  "evidence": [
    "string — one short, specific, plain-language observation per item"
  ],
  "recommended_tier_delta": "NONE | RAISE_ONE | RAISE_TO_MAX"
}
```

`specialist_agreement` is a transparency field, not a decision input —
it tells the operator/judge view how many of the four lenses
independently pointed the same direction, which is a genuinely useful
"how sure is this ensemble, and why" signal distinct from the numeric
`confidence` value, and directly demonstrable in the operator view
(FR-EXP-03).

Constraints enforced outside the model, in code, not trusted to the
model's own compliance:

- `recommended_tier_delta` can only ever be interpreted by the Policy
  Engine as **raising** caution relative to the hot-path tier — there is
  no schema value that can lower it, and even if the field were
  malformed or adversarially manipulated, the Policy Engine's own logic
  has no code path that reduces caution based on agent output
  (`01-srs.md` FR-POL-04). This is the concrete implementation of the
  "LLM can only escalate" invariant, not merely a prompt instruction the
  model is trusted to follow, and it applies identically regardless of
  how many specialists contributed to the verdict.
- `confidence` directly feeds the uncertainty-dampening logic in
  [`04-risk-and-policy.md`](./04-risk-and-policy.md) §3 — a low-confidence
  verdict is not permitted to drive the most severe (PAUSE) action alone.
- The Coordinator does not get to declare its own `confidence` unbounded
  by the specialists' actual findings — this is the specific design
  choice this project makes differently from the comparison project
  referenced in `00-overview.md` §5.1.1, where the LLM ensemble assesses
  its own final authority. Here, `confidence` is expected to be visibly
  traceable to specific `evidence[]` items in the operator view, not an
  opaque self-report.

---

## 8. What This Replaces From the Prior Partial Prototype

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

## 9. Timeout, Retry, and Fail-Open (Cross-Reference)

Specified fully in `01-srs.md` NFR-PERF-02 and NFR-REL-01/02, with
numbers updated for the multi-specialist structure
([`02-architecture.md`](./02-architecture.md) §6): each specialist has an
individual sub-timeout (≤3s), the Coordinator has its own (≤1.5s), and
the whole warm path has a hard total cap (≤6s). One retry is permitted
per failed stage (a specialist, or the Coordinator), not per whole warm
path, before that stage is treated as degraded (§5). The demo must
additionally have a pre-scripted, cached response path independent of
this in-product fail-open behavior, purely to protect the live
presentation from network flakiness — see
[`07-demo-script.md`](./07-demo-script.md) §6 for that demo-specific
safeguard, which is distinct from (and in addition to) the product's own
fail-open design.

# Risk Engine & Decision Policy Specification
## Project Kurukshetra — Agentic Guardian

Companion to [`02-architecture.md`](./02-architecture.md) (hot path,
policy layer) and [`03-agent-and-tools.md`](./03-agent-and-tools.md)
(warm path). Defines the deterministic scoring, uncertainty handling,
tier structure, and friction UI that together implement D8 (uncertainty-
aware decisioning) and D5 (deterministic-policy-supreme invariant).
Numeric parameters below are the same **[calibration defaults]** defined
in [`01-srs.md`](./01-srs.md) §6 — restated here in operational context,
not redefined.

---

## 1. Hot-Path Feature Set

| Feature | Description | Source |
|---|---|---|
| `amount_deviation` | Payment amount relative to this user's own historical distribution | User History Store |
| `recipient_novelty` | First-time recipient for this user (boolean/recency) | Recipient Directory + User History Store |
| `time_anomaly` | How unusual this time-of-day/velocity is for this user | User History Store |
| `recipient_account_age` | Simulated age of the recipient's account in the mock directory | Recipient Directory |
| `purpose_identity_mismatch` | Output of the deterministic purpose–identity comparison (D1, FR-REC-02) | Recipient Directory + note purpose classification |
| `velocity_txn_count[window]` | Number of payments this user has sent in a rolling window (e.g. last 1h, last 24h) | User History Store, computed locally — no real streaming infrastructure (`01-srs.md` FR-RISK-07) |
| `velocity_cumulative_amount[window]` | Total amount sent by this user in the same rolling windows | User History Store |
| `hard_block` | Simulated blocklist hit, or any other hard rule — **not a score input**, evaluated independently before scoring (see §2) | Rule layer |

This feature set is intentionally small and inspectable — every feature
maps to a specific, explainable real-world signal, not an opaque
engineered representation. This directly supports FR-EXP-01
(plain-language explanations must name specific evidence).

---

## 2. Hot-Path Scoring & Tiers

The hot path combines the rule layer and a trained gradient-boosted-tree
model (trained on the synthetic dataset defined in
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md)) into an integer
`hot_score` on a **0–100** scale and a `hot_confidence ∈ [0.0, 1.0]` (how
much evidence the model actually had — see §3).

**`hard_block` is evaluated first and independently of scoring** — it is
a boolean rule-layer fact (FR-RISK-03), not a tier on the score scale.
If `hard_block = true`, the transaction routes directly to the **BLOCK**
action (§4, §5) and `hot_score`/tiering below is not used to decide the
outcome, regardless of its value.

**Score-driven tiers** (apply only when `hard_block = false`):

| Score band | Tier | Meaning |
|---|---|---|
| 0–29 | LOW | No concerning signal found |
| 30–59 | MEDIUM | Worth a second look — routes to the warm path |
| 60–84 | HIGH | Multiple concerning signals, or one strong signal (e.g. purpose–identity mismatch) — routes to the warm path with elevated starting caution |
| 85–100 | CRITICAL | Strong combined signal — routes toward PAUSE (see §4) |

Only LOW (with `hot_confidence >= 0.40`) is eligible for the
zero-friction fast exit (FR-RISK-05); MEDIUM and HIGH always invoke the
warm path (FR-AGT-01); CRITICAL does not invoke the warm path — a
confidently strong combined signal is not something further LLM
reasoning should be needed to confirm, though it remains a **PAUSE**
(overridable), distinct from **BLOCK** (never overridable, `hard_block`
only — see §4).

These bands are calibration defaults (`01-srs.md` §6), verified against
the synthetic scenario suite during the build phase — see
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §3 for
the tuning procedure (including a held-out scenario split, to avoid the
self-grading trap of tuning and evaluating on the same cases).

---

## 3. Uncertainty-Aware Decisioning (D8)

A `hot_score`/agent `confidence` produced from thin evidence must not be
treated identically to one produced from strong evidence — this is the
project's explicit answer to the over-blocking failure mode (e.g., a
genuine, large, one-off payment with little prior history should not be
auto-escalated to PAUSE purely because the user has no history to compare
against).

**Rule:** if the evidence backing a caution-raising signal is thin
(`hot_confidence < 0.40` — `01-srs.md` §6), the Policy Engine dampens the
action by one tier from what the raw score alone would suggest,
**except** where `hard_block = true` or an explicit high-confidence agent
finding (e.g., a clear secrecy/urgency match with a resolved
purpose–identity mismatch, `agent.confidence >= 0.40`) is present. This
prevents "we don't know much about this payment" from being treated the
same as "we know this payment is dangerous" — they call for different
responses (ask a clarifying question vs. pause), even though a naive
score might rate them similarly.

This logic is directly demonstrated in its own scenario (see
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md), Scenario 6).

---

## 4. Policy Engine — Final Authority

```
action = policy_decide(hard_block, hot_tier, agent_verdict, hot_confidence)

Rules (in priority order):
  1. If hard_block == true → action = BLOCK.
     Terminal. Agent not consulted (FR-RISK-03 AC2). No override path
     exists for this action (FR-POL-05). Nothing below applies.

  2. Else: base_tier = hot_tier   # LOW / MEDIUM / HIGH / CRITICAL

  3. If agent was invoked and agent.recommended_tier_delta != NONE:
       base_tier = raise(base_tier, agent.recommended_tier_delta)
       # can only go up — never lowers base_tier (FR-AGT-06, FR-POL-04)

  4. If the raised signal's supporting evidence is thin (§3):
       base_tier = dampen_one_tier(base_tier), unless step 1 applied or
       a high-confidence agent finding is present

  5. final_tier = base_tier
  6. action = tier_to_action(final_tier)
       # LOW → ALLOW, MEDIUM → ADVISE, HIGH → CHALLENGE, CRITICAL → PAUSE
```

**Invariant (tested, not just documented):** for any input where
`hard_block = false`, `final_tier` is never lower than what `hot_tier`
alone would have produced. This is the concrete, verifiable form of "the
LLM can only escalate, never de-escalate" (FR-POL-04), checked directly
in the evaluation harness (`06-evaluation-and-testing.md` §2.1).
`hard_block = true` is a separate, absolute rule outside this scoring
invariant entirely — it does not compete with or get softened by score,
confidence, or agent output.

---

## 5. Action → UI Friction Mapping (D3)

Five actions exist. **PAUSE and BLOCK are distinct** — this replaces an
earlier version of this document that conflated the two under a single
"PAUSE" action with contradictory override behavior (see
[`01-srs.md`](./01-srs.md) §4, finding F-1).

| Action | Trigger | UI behavior | Anti-habituation mechanism |
|---|---|---|---|
| **ALLOW** | `hot_tier = LOW`, confident | Payment proceeds immediately, no interruption | None needed — the "don't annoy the confident-safe majority" case |
| **ADVISE** | `final_tier = MEDIUM` | Non-blocking banner (e.g., "You haven't paid this recipient before") | Visible but no extra action required — proportionate to a mild signal |
| **CHALLENGE** | `final_tier = HIGH` | Pay action disabled until the user actively engages — types the resolved recipient identity, or waits out a `4000ms` enforced countdown | Requires active engagement, not a reflexive tap — targets the documented sub-second dismissal pattern of generic "Are you sure?" dialogs |
| **PAUSE** | `final_tier = CRITICAL` (score/agent-driven) | Full evidence report shown; user must explicitly choose "Cancel" or "I understand the risk, proceed anyway" — no default/implicit path | The most protective *overridable* surface; "proceed anyway" is always available and always explicitly logged as an override (FR-INT-03) |
| **BLOCK** | `hard_block = true` (rule-driven, independent of score) | Pay action permanently disabled for this attempt; only "Cancel" (and optionally a simulated support/recourse link) is offered | **No override path exists.** This is the one place the system deliberately fails closed — it represents a hard rule, not a probabilistic judgment (FR-POL-05) |

---

## 6. Override Handling

If a user proceeds despite a CHALLENGE or PAUSE warning:

- The transaction still "completes" (in the simulation) — the system
  advises and delays, it does not forcibly prevent an adult user's
  informed choice, consistent with FR-HITL-01.
- The audit record explicitly tags this as `user_override_after_warning`,
  distinct from an uncontested ALLOW — this is not swept into the same
  bucket as a payment the system was never concerned about
  (`01-srs.md` FR-INT-03, FR-AUD-01).
- This override event is itself a demonstrable moment in the evaluation
  harness: the system should be able to report "how often did users
  override a CHALLENGE/PAUSE in the scenario suite," which is a
  meaningful signal about whether the friction design is calibrated
  well, not just whether detection "worked."

**BLOCK has no override event to log**, by design — there is no path by
which a user proceeds past it (FR-POL-05 AC2). The audit record for a
BLOCK still captures the full decision (FR-AUD-01); it simply never
contains a `user_override_after_warning` or `proceeded` value for
`user_decision` — only `cancelled` (the only available outcome) is valid.

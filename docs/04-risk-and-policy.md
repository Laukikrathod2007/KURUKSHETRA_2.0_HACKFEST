# Risk Engine & Decision Policy Specification
## Project Kurukshetra — Agentic Guardian

Companion to [`02-architecture.md`](./02-architecture.md) (hot path,
policy layer) and [`03-agent-and-tools.md`](./03-agent-and-tools.md)
(warm path). Defines the deterministic scoring, uncertainty handling,
tier structure, and friction UI that together implement D8 (uncertainty-
aware decisioning) and D5 (deterministic-policy-supreme invariant).

---

## 1. Hot-Path Feature Set

| Feature | Description | Source |
|---|---|---|
| `amount_deviation` | Payment amount relative to this user's own historical distribution | User History Store |
| `recipient_novelty` | First-time recipient for this user (boolean/recency) | Recipient Directory + User History Store |
| `time_anomaly` | How unusual this time-of-day/velocity is for this user | User History Store |
| `recipient_account_age` | Simulated age of the recipient's account in the mock directory | Recipient Directory |
| `purpose_identity_mismatch` | Output of the deterministic purpose–identity comparison (D1) | Recipient Directory + note purpose classification |
| `hard_override_flags` | Simulated blocklist hit, or any other hard rule | Rule layer |

This feature set is intentionally small and inspectable — every feature
maps to a specific, explainable real-world signal, not an opaque
engineered representation. This directly supports FR-EXP-01
(plain-language explanations must name specific evidence).

---

## 2. Hot-Path Scoring & Tiers

The hot path combines the rule layer and a trained gradient-boosted-tree
model (trained on the synthetic dataset defined in
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md)) into a single
`hot_score ∈ [0, 1]` and a `hot_confidence ∈ [0, 1]` (how much evidence
the model actually had — see §3).

| Tier | Score band (indicative — exact cut points are a build-time calibration detail, not fixed here) | Meaning |
|---|---|---|
| **LOW** | confidently low `hot_score` | No concerning signal found |
| **MEDIUM** | ambiguous `hot_score`, or any single moderate signal | Worth a second look — routes to the warm path |
| **HIGH** | multiple concerning signals, or one strong signal (e.g. purpose–identity mismatch) | Routes to the warm path with elevated starting caution |
| **CRITICAL (hard override only)** | a hard rule fired (e.g. simulated blocklist) | Bypasses scoring entirely (FR-RISK-03) |

Only LOW is eligible for the zero-friction fast exit (FR-RISK-05); MEDIUM
and HIGH always invoke the warm path (FR-AGT-01); CRITICAL bypasses the
warm path entirely, since a hard deterministic rule is by definition not
something further LLM reasoning should be able to soften.

Exact numeric thresholds are a calibration exercise performed against the
synthetic scenario suite during the build phase, not hardcoded in this
document — see [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md)
§3 for how they should be tuned and validated (including on a held-out
scenario split, to avoid the self-grading trap of tuning and evaluating
on the same cases).

---

## 3. Uncertainty-Aware Decisioning (D8)

A `hot_score`/agent `confidence` produced from thin evidence must not be
treated identically to one produced from strong evidence — this is the
project's explicit answer to the over-blocking failure mode (e.g., a
genuine, large, one-off payment with little prior history should not be
auto-escalated to PAUSE purely because the user has no history to compare
against).

**Rule:** if the evidence backing a caution-raising signal is thin
(new user, sparse history, or agent `confidence` below a defined floor),
the Policy Engine dampens the action by one tier from what the raw score
alone would suggest, **except** where a hard override (FR-RISK-03) or an
explicit high-confidence agent finding (e.g., a clear secrecy/urgency
match with a resolved purpose–identity mismatch) is present. This
prevents "we don't know much about this payment" from being treated the
same as "we know this payment is dangerous" — they call for different
responses (ask a clarifying question vs. block), even though a naive
score might rate them similarly.

This logic is directly demonstrated in its own scenario (see
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md), Scenario 6).

---

## 4. Policy Engine — Final Authority

```
final_tier = policy_combine(hot_tier, agent_verdict, hot_confidence)

Rules (in priority order):
  1. If hot_tier == CRITICAL (hard override) → action = PAUSE, agent not
     consulted, not overridable by anything the agent might have said.
  2. Else: base = hot_tier
  3. If agent was invoked and agent.recommended_tier_delta != NONE:
       base = raise(base, agent.recommended_tier_delta)      # can only
                                                                # go up
  4. If the raised signal's supporting evidence is thin (§3):
       base = dampen_one_tier(base), unless step 1 or a high-confidence
       agent finding applies
  5. final_tier = base
  6. action = tier_to_action(final_tier)   # LOW→ALLOW, MEDIUM→ADVISE,
                                            # HIGH→CHALLENGE,
                                            # CRITICAL→PAUSE
```

**Invariant (tested, not just documented):** for any input, `final_tier`
is never lower than what `hot_tier` alone would have produced. This is
the concrete, verifiable form of "the LLM can only escalate, never
de-escalate" (FR-POL-04), and is checked directly in the evaluation
harness (`06-evaluation-and-testing.md` §2.1).

---

## 5. Action → UI Friction Mapping (D3)

| Action | UI behavior | Anti-habituation mechanism |
|---|---|---|
| **ALLOW** | Payment proceeds immediately, no interruption | None needed — this is the "don't annoy the 95% of legitimate payments" case |
| **ADVISE** | Non-blocking banner shown alongside the normal confirm flow (e.g., "You haven't paid this recipient before") | Visible but does not require an extra action — proportionate to a mild signal |
| **CHALLENGE** | The pay action is disabled until the user actively engages: e.g., must type the resolved recipient identity name, or the button is disabled for a short enforced countdown before it activates | Requires active engagement, not a single reflexive tap — directly targets the documented sub-second dismissal pattern of generic "Are you sure?" dialogs |
| **PAUSE** | Full evidence report shown; user must explicitly choose "Cancel" or "I understand the risk, proceed anyway" — no default/implicit path | The most protective surface; the "proceed anyway" choice is always available (never a silent, unappealable block outside the hard-override case) but is always explicitly logged as an override (FR-INT-03) |

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

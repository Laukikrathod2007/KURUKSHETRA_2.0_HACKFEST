# Software Requirements Specification & Product Requirements Document (SRS/PRD)
## Project Kurukshetra — Agentic Guardian

---

## 1. Document Control

**Purpose:** this is the binding, detailed specification of every
capability the system must have. Where [`00-overview.md`](./00-overview.md)
decides *what* to build and *why*, this document specifies *exactly what
each requirement means*, to the level of inputs, flows, numeric
parameters, and pass/fail acceptance criteria, so a build team needs no
further clarification to implement or test any requirement.

**ID scheme:** `FR-<AREA>-<NN>` (functional) / `NFR-<AREA>-<NN>`
(non-functional). IDs are stable and referenced by every other document in
this set — see [`README.md`](./README.md) for the full document map.
Numeric parameters marked **[calibration default]** are concrete values
to build against, tunable during the calibration procedure in
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §3 —
they are not placeholders to be argued about, they are the number to code
against until a calibration run says otherwise.

**Priority:** Must (demoable core) / Should (bonus tier, build only after
Must is complete and demo-stable). Nothing outside this document is in
scope — see [`00-overview.md`](./00-overview.md) §3.1 and §5.3 for the
binding out-of-scope list.

---

## 2. Actors

| Actor | Description |
|---|---|
| **Payer (User)** | The person using the simulated payment app to send money. Primary actor for every requirement below. |
| **Guardian Agent** | The combined deterministic + LLM reasoning pipeline sitting between the payer's "Pay" action and simulated settlement. Not a human actor — included here because several requirements describe its behavior as if it were one ("the agent shall…"). |
| **Trusted Contact** *(Should-tier only)* | A simulated secondary party who can be notified/co-approve for a vulnerable-user, high-risk, low-confidence case (FR-INT-04). |
| **Operator/Judge** | Anyone inspecting the audit history, the technical evidence trace, or the red-team suite — a read-only actor with access to a more technical view than the Payer sees. |
| **Adversary (Red-Team Tester)** | Anyone deliberately crafting a payment note or recipient scenario to try to manipulate the Guardian Agent's output (FR-POL-04, scenario 7 in [`08-data-and-scenarios.md`](./08-data-and-scenarios.md)). |

---

## 3. User Stories

| # | Story | Primary FR(s) |
|---|---|---|
| US-1 | As a payer, I want my routine payments to go through instantly with no interruption, so the system doesn't get in my way when nothing is wrong. | FR-RISK-05, FR-POL-03 |
| US-2 | As a payer, I want to be told, gently, when I'm paying someone for the first time, without being blocked, so I can make an informed choice without friction I don't need. | FR-REC-03, FR-INT-01 |
| US-3 | As a payer, I want the system to check whether the person I'm paying is actually who my payment note says they are, so a scammer can't just fake a name or a story. | FR-REC-01, FR-REC-02 |
| US-4 | As a payer, I want the system to notice if my payment note sounds like I'm being pressured or manipulated, and tell me why, so I can recognize a scam I might be in the middle of. | FR-AGT-01, FR-AGT-03, FR-EXP-01 |
| US-5 | As a payer, I want a real pause — not a dialog I can tap through without reading — when something is seriously wrong, so I have a real chance to reconsider. | FR-INT-01, FR-POL-03 |
| US-6 | As a payer, I want to still be able to proceed if I disagree with the system's caution, so I'm never trapped by a false alarm. | FR-POL-01, FR-INT-03 |
| US-7 | As a payer, I want a payment to someone on a confirmed blocklist to be stopped outright, not just discouraged, so obviously known-bad destinations can't be paid by mistake. | FR-POL-05 |
| US-8 | As a payer, I want to see exactly why the system flagged something, in plain language, not a score I can't interpret. | FR-EXP-01, FR-EXP-02 |
| US-9 | As a payer, I want a record of every payment decision the system made, so I can review it later or show it to someone if I was scammed anyway. | FR-AUD-01, FR-AUD-03 |
| US-10 | As a payer, I don't want the system to nuke a big, unusual, but genuine one-off payment just because it's unusual and I have no history with the recipient. | FR-RISK-04, uncertainty rule (see [`04-risk-and-policy.md`](./04-risk-and-policy.md) §3) |
| US-11 | As an operator/judge, I want to see the system's actual reasoning trace (which checks fired, what the agent found), not just its final answer, so I can verify it isn't just a black box. | FR-EXP-03 |
| US-12 | As an adversary/tester, I want to try to trick the AI into approving something dangerous by hiding instructions in the payment note, and I want that attempt to visibly fail. | FR-POL-04 |
| US-13 | As a payer, I want the system to notice if I'm sending several smaller payments to the same or related recipients in a short window, not just judge each one alone, so a scam that escalates gradually doesn't slip through one transaction at a time. | FR-RISK-07 |
| US-14 | As a payer, I want the system to recognize when my situation matches a known, documented scam pattern (not just generic "urgency"), and tell me specifically what it resembles, so the warning feels concrete, not generic. | FR-AGT-08 |
| US-15 | As an operator/judge, I want to see how many independent reasoning angles agreed on a verdict, not just a single confidence number, so I can judge how solid the system's reasoning actually is. | FR-AGT-07 |

---

## 4. `ps.md` Traceability & Alignment Audit

Every `ps.md` requirement, mapped to the FR/NFR IDs that satisfy it, with
an explicit status. This table is the answer to "does the documentation
actually match the problem statement" — anything not **Full** is called
out with what was added or fixed to close the gap.

| `ps.md` requirement | FR/NFR IDs | Status | Note |
|---|---|---|---|
| Payment simulation interface | FR-SIM-01…05 | Full | FR-SIM-05 (recipient-check panel) added by this audit — see below |
| Transaction-risk analysis | FR-RISK-01…07 | Full | FR-RISK-06 (0–100 displayed score) added by this audit; FR-RISK-07 (velocity windows) added afterward, exceeding baseline |
| Rule-based and/or LLM-based reasoning | FR-RISK-01, FR-AGT-01…08 | Full | Both are built, exceeding the "and/or" minimum; FR-AGT-07/08 (multi-specialist + RAG) further exceed it |
| Recipient verification workflow | FR-REC-01…05 | Full | FR-REC-05 added by this audit — verification must be a *visible* step, not only a backend signal feeding a score |
| Risk score/category | FR-RISK-04, FR-RISK-06, FR-POL-01 | Full | Numeric 0–100 scale now specified (§6), not just abstract tiers |
| User confirmation step | FR-INT-01…04 | Full | — |
| Pause/block mechanism | FR-POL-01…05, FR-INT-01…03 | **Fixed** | See finding F-1 below — the prior spec conflated "pause" and "block" into one action with self-contradictory override behavior. Now two distinct actions: PAUSE (always overridable) and BLOCK (never overridable, hard-override only). |
| Explainable security alerts | FR-EXP-01…03 | Full | — |
| Transaction audit history | FR-AUD-01…04 | Full | FR-AUD-04 (filtering) added by this audit |
| Demo: normal / new recipient / suspicious / high-risk | Scenarios 1–4, [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) | Full | — |
| Demo: system handles each differently | FR-POL-01, action mapping (§6) | Full | Five distinct actions now exist (ALLOW/ADVISE/CHALLENGE/PAUSE/BLOCK), not four |
| Real-time security reasoning | NFR-PERF-01…02 | Full | Framed honestly as confirmation-step responsiveness, not payment-rail latency — see [`02-architecture.md`](./02-architecture.md) §2 |
| Fraud prevention | Emergent from FR-RISK + FR-AGT + FR-POL | Full | — |
| Human-in-the-loop intervention | FR-HITL-01…02 | Full | — |
| Explainability | FR-EXP-01…03 | Full | — |
| Safe autonomous decision-making | FR-POL-04, FR-POL-05, FR-RISK-04 (uncertainty) | Full | — |
| *(beyond baseline)* Multi-perspective reasoning & pattern memory | FR-RISK-07, FR-AGT-07…09 | **Added** | Not required by `ps.md`; added based on state-of-the-art multi-agent fraud research (`00-overview.md` §5.1.1) to deepen "evaluating risk" and "analyzing a payment request" beyond the required minimum, without weakening the safety invariants above. |

### Audit findings and fixes applied

**F-1 (defect, fixed): PAUSE and BLOCK were conflated.** The previous
version of this documentation set routed every hard deterministic
override (e.g., a recipient on the simulated blocklist) to the same
`PAUSE` action used for score-driven high-risk cases — but separately
claimed, in the threat model and architecture documents, that the hard
deterministic case was "the one case with no user override path." Since
`PAUSE` was defined elsewhere as *always* offering a "proceed anyway"
option, these two statements directly contradicted each other. **Fix:**
a fifth, distinct action, **BLOCK**, is introduced (FR-POL-05), reserved
exclusively for hard deterministic overrides. `PAUSE` remains a
score/agent-driven action that always retains an explicit override path.
This also gives `ps.md`'s "pause/block mechanism" wording a literal,
non-overlapping implementation of both words instead of one action doing
double duty. This fix is propagated to
[`04-risk-and-policy.md`](./04-risk-and-policy.md),
[`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md), and
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md) (new Scenario 8).

**F-2 (gap, closed): "Recipient verification workflow" had no visible
workflow.** The prior spec computed recipient-verification signals
entirely server-side and folded them into a score, with no UI moment
where the user actually sees a verification step happen. **Fix:**
FR-REC-05 requires a dedicated, visible recipient-check panel in the
payment composition flow (detailed in §18, UI Screen Inventory).

**F-3 (gap, closed): "Risk score/category" had no numeric score.** Tiers
(LOW/MEDIUM/HIGH/CRITICAL) existed, but no score was ever specified as
shown to the user — only an internal `[0,1]` float existed in the
architecture doc, never surfaced. **Fix:** FR-RISK-06 requires a
displayed integer score on a 0–100 scale, alongside the tier label. See
§6 for the full scale definition.

**F-4 (gap, closed): audit history had no filtering.** `ps.md`'s
"transaction audit history" was satisfied at a minimum (a browsable list),
but with no way to find a specific past decision. **Fix:** FR-AUD-04
(Should-tier) adds filtering by date, tier, and recipient.

**F-5 (checked, no defect found): "rule-based and/or LLM-based
reasoning."** The literal wording only requires one or the other. The
system builds both, which is a scope choice already justified in
[`00-overview.md`](./00-overview.md), not a compliance gap — noted here
only to confirm it was checked.

---

## 5. Transaction Lifecycle State Machine

Every transaction moves through exactly one path through this state
machine. States are the source of truth for what the UI, the audit log,
and the test suite all key off of.

```
DRAFT
  │  user submits (FR-SIM-01)
  ▼
SUBMITTED
  │  validation passes (§17)
  ▼
HOT_EVALUATING
  │  rules + model complete (FR-RISK-01)
  ▼
HOT_EVALUATED ──[hard_block flag set]──► BLOCKED_TERMINAL ──► AUDITED
  │  [hard_block flag not set]
  │
  ├─[hot_tier == LOW, hot_confidence high]──► ALLOWED_COMPLETE ──► AUDITED
  │
  └─[hot_tier == MEDIUM or HIGH]
         │
         ▼
    WARM_EVALUATING
         │
         ├─[agent responds in time, valid schema]──► WARM_EVALUATED
         │
         └─[timeout / error / invalid schema]──► WARM_DEGRADED (fail-open, NFR-REL-01)
         │
         ▼
    POLICY_DECIDED  (final_tier + action computed, FR-POL-01)
         │
         ├─[action == ALLOW]──────► ALLOWED_COMPLETE ──────────────► AUDITED
         ├─[action == ADVISE]─────► ADVISED_COMPLETE ─────────────► AUDITED
         ├─[action == CHALLENGE]──► CHALLENGE_PENDING
         │        ├─[user completes challenge]──► CHALLENGE_PASSED ──► AUDITED
         │        └─[user abandons]─────────────► USER_CANCELLED ────► AUDITED
         └─[action == PAUSE]──────► PAUSE_PENDING
                  ├─[user cancels]───────────────► USER_CANCELLED ────► AUDITED
                  └─[user proceeds anyway]────────► OVERRIDE_COMPLETE ──► AUDITED
```

| State | Terminal? | Notes |
|---|---|---|
| `DRAFT` | No | User is still composing the payment |
| `SUBMITTED` | No | Passed field-level validation (§17) |
| `HOT_EVALUATING` / `WARM_EVALUATING` | No | Transient processing states, not user-visible as distinct screens |
| `BLOCKED_TERMINAL` | **Yes** | Reached only via a hard deterministic override (FR-POL-05); no transition out except to `AUDITED` |
| `ALLOWED_COMPLETE`, `ADVISED_COMPLETE`, `CHALLENGE_PASSED`, `OVERRIDE_COMPLETE` | Yes | All represent "payment simulated as sent," distinguished in the audit record by how they got there |
| `USER_CANCELLED` | Yes | Payment does not proceed |
| `AUDITED` | Yes (absorbing) | Every path ends here — an audit record is written for every transaction with no exception (FR-AUD-01) |
| `WARM_DEGRADED` | No (intermediate) | Not a dead end — always continues to `POLICY_DECIDED` using the hot-path tier alone |

---

## 6. Risk Score Scale & Decision Tiers

**Score scale [calibration default]:** integer `0`–`100`, higher = more
concerning. Displayed to the user and in the operator view (FR-RISK-06).

**Score-driven tiers [calibration default]** — apply only when
`hard_block` is not set (see below for the independent hard-override
path):

| Score band | Tier | Action | Friction (§ FR-POL-03) |
|---|---|---|---|
| 0–29 | LOW | ALLOW | None |
| 30–59 | MEDIUM | ADVISE | Non-blocking banner |
| 60–84 | HIGH | CHALLENGE | Active engagement required |
| 85–100 | CRITICAL | PAUSE | Full evidence report, always overridable |

**Hard-override path [calibration default]** — evaluated first, before
any scoring, independent of the tiers above:

> If `hard_block == true` (a rule-layer fact, e.g. the recipient matches
> the simulated blocklist — FR-RISK-03), the action is **BLOCK**
> regardless of score. Scoring is not computed for display purposes in
> this path (or if computed, is not shown — the reason given to the user
> is the specific rule that fired, not a score). BLOCK has no "proceed
> anyway" path (FR-POL-05).

**Confidence scale [calibration default]:** float `0.0`–`1.0`. Below
`0.40`, evidence is treated as thin and the uncertainty-dampening rule
(FR-RISK-04, detailed in [`04-risk-and-policy.md`](./04-risk-and-policy.md)
§3) reduces the action by one tier unless a hard override or a
high-confidence agent finding applies.

These exact cut points are starting values for implementation, verified
and adjusted against the calibration procedure in
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §3 — they
are not to be left unset or invented ad hoc during implementation.

---

## 7. Functional Requirements — Payment Simulation (FR-SIM)

#### FR-SIM-01 — Compose a payment [Must]
**Source:** `ps.md` "payment simulation interface"
**Description:** The system shall provide a UI to compose a simulated
payment.
**Inputs:**

| Field | Type | Constraint |
|---|---|---|
| `recipient_id` | string | Non-empty; see §17 |
| `amount` | decimal | `> 0`, `<= 10,000,000` (demo ceiling) |
| `note` | string | `<= 500` characters; optional but see FR-REC-05 for the empty-note case |
| `sender_id` | string | Fixed to the active demo persona |

**Acceptance Criteria:**
- AC1: Given the compose screen is open, when all required fields are
  valid, then the "Review & Pay" action becomes enabled.
- AC2: Given `amount <= 0` or `amount > 10,000,000`, when the user
  attempts to submit, then submission is blocked with a field-level
  validation message (no risk evaluation is invoked for invalid input).
**Dependencies:** §17 (Data Validation Rules)

#### FR-SIM-02 — Persistent demo user profile [Must]
**Source:** `ps.md` "transaction-risk analysis" (novelty/unusualness
requires a comparison baseline)
**Description:** The system shall maintain at least one persistent demo
user profile with a synthetic transaction history (prior recipients,
typical amounts, typical times), so "unusual for this user" signals are
computed from real stored data, not hardcoded per scenario.
**Acceptance Criteria:**
- AC1: Given the demo persona has 10+ prior payments to Recipient X, when
  a new payment to Recipient X is submitted, then `FR-REC-03`'s
  first-time-payee flag evaluates to `false`.
- AC2: Given the demo persona has never paid Recipient Y, when a payment
  to Recipient Y is submitted, then the first-time-payee flag evaluates
  to `true`.
**Dependencies:** [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.1, §2

#### FR-SIM-03 — Simulation only, no real money movement [Must]
**Source:** `00-overview.md` §3 (scope decision), `ps.md` "payment
simulation interface"
**Description:** The system shall simulate, not execute, real money
movement. No UI text, log message, or documentation may claim or imply a
connection to a real bank, UPI, or NPCI system.
**Acceptance Criteria:**
- AC1: Given any completed-transaction state (§5), when the confirmation
  is rendered, then the UI displays an explicit "simulated" label.
- AC2: Given the codebase or UI is inspected, then no string, endpoint,
  or comment claims real bank/NPCI/UPI connectivity.

#### FR-SIM-04 — Pre-defined scenario loading [Must]
**Source:** `ps.md` "Expected Demo"
**Description:** The system shall support loading pre-defined scenarios
via a selector, for reliable, repeatable demonstration.
**Acceptance Criteria:**
- AC1: Given the scenario selector is open, when a scenario is chosen,
  then all of its fields (recipient, amount, note, and any simulated
  device-state toggles) are pre-filled exactly as specified in
  [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §3.
- AC2: Given a scenario is loaded twice in sequence, then it produces the
  same `hot_tier` both times (hot path determinism).
**Dependencies:** [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §3

#### FR-SIM-05 — Recipient verification panel [Must] *(added by audit finding F-2)*
**Source:** `ps.md` "recipient verification workflow"
**Description:** The payment composition flow shall render a distinct,
visible **Recipient Check** panel after the recipient is identified and
before the user proceeds to risk evaluation, showing: resolved identity
category, simulated account age, and first-time-payee status. This makes
recipient verification a workflow step the user (and a judge) can see
happening, not only a backend signal folded silently into a score.
**Main Flow:**
1. User enters/selects a `recipient_id`.
2. System calls the Recipient Directory (FR-REC-01) synchronously.
3. Recipient Check panel renders with the three fields above, before the
   amount/note fields become relevant to risk evaluation.
**Acceptance Criteria:**
- AC1: Given a recognized `recipient_id`, when it is entered, then the
  Recipient Check panel renders within the hot-path latency budget
  (NFR-PERF-01) showing identity category, account age, and first-time
  status.
- AC2: Given an unrecognized `recipient_id`, when it is entered, then the
  panel explicitly shows "unresolved / not on file" rather than a blank
  or misleading state.
**Dependencies:** FR-REC-01, FR-REC-03, FR-REC-04

---

## 8. Functional Requirements — Transaction Risk Analysis (FR-RISK)

#### FR-RISK-01 — Hot-path scoring [Must]
**Source:** `ps.md` "transaction-risk analysis," "rule-based… reasoning"
**Description:** The system shall compute a deterministic, sub-second risk
score for every submitted payment using rule checks plus a trained
tabular ML model (gradient-boosted trees), before any LLM call.
**Inputs:** `amount_deviation`, `recipient_novelty`, `time_anomaly`,
`recipient_account_age`, `purpose_identity_mismatch`, `hard_override_flags`
(full definitions in [`04-risk-and-policy.md`](./04-risk-and-policy.md) §1).
**Outputs:** `hot_score` (integer, 0–100), `hot_tier` (LOW/MEDIUM/HIGH/CRITICAL),
`hot_confidence` (float, 0.0–1.0), `hard_block` (boolean).
**Acceptance Criteria:**
- AC1: Given identical inputs, when scored twice, then `hot_score` is
  identical both times (determinism).
- AC2: Given a transaction with no unusual features, when scored, then
  `hot_score <= 29` (LOW).
**Dependencies:** FR-REC-01, FR-REC-02, FR-SIM-02

#### FR-RISK-02 — Minimum hot-path feature set [Must]
**Source:** `ps.md` "transaction-risk analysis"
**Description:** The hot-path feature set shall include, at minimum:
amount relative to the user's own history, recipient novelty, time-of-day/
velocity anomaly, and a purpose–identity consistency placeholder
(populated by FR-REC-02 when available; treated as "unknown/neutral," not
"safe," when not yet available).
**Dependencies:** FR-REC-02

#### FR-RISK-03 — Hard deterministic override [Must]
**Source:** `ps.md` "pause/block mechanism"
**Description:** A hard rule (e.g., recipient present in the simulated
blocklist) shall set `hard_block = true` and bypass scoring entirely,
routing directly to the BLOCK action (FR-POL-05) — regardless of any
other signal.
**Acceptance Criteria:**
- AC1: Given a recipient on the simulated blocklist, when a payment to
  them is submitted at any amount, then `hard_block = true` and the
  resulting action is BLOCK, not PAUSE.
- AC2: Given `hard_block = true`, when the pipeline evaluates the
  transaction, then the Guardian Agent (FR-AGT) is never invoked.
**Dependencies:** FR-POL-05

#### FR-RISK-04 — Tier mapping and uncertainty dampening [Must]
**Source:** `ps.md` "risk score/category," "safe autonomous
decision-making"
**Description:** The system shall map `hot_score` to a tier using the
documented, inspectable thresholds in §6 — not a black-box cutoff — and
shall apply the uncertainty-dampening rule (§6, "Confidence scale") when
`hot_confidence < 0.40`.
**Acceptance Criteria:**
- AC1: Given `hot_score = 90` and `hot_confidence = 0.30` (thin evidence,
  no hard override, no high-confidence agent finding), when tiered, then
  the resulting action is dampened by one tier from what score alone
  would produce (PAUSE → CHALLENGE).
- AC2: Given `hot_score = 90` and `hot_confidence = 0.85`, when tiered,
  then no dampening applies.
**Dependencies:** [`04-risk-and-policy.md`](./04-risk-and-policy.md) §3

#### FR-RISK-05 — Zero-friction fast exit [Must]
**Source:** `ps.md` "Expected Demo" (normal payment)
**Description:** The hot path alone shall be sufficient to handle a
confidently-LOW transaction with zero added friction — no agent call, no
visible delay.
**Acceptance Criteria:**
- AC1: Given `hot_tier = LOW` and `hot_confidence >= 0.40`, when
  evaluated, then the Guardian Agent is not invoked and the action is
  ALLOW within the hot-path latency budget (NFR-PERF-01).

#### FR-RISK-06 — Displayed numeric score [Must] *(added by audit finding F-3)*
**Source:** `ps.md` "risk score/category"
**Description:** The final risk assessment shall be presented to the
user, and in the operator view, as an integer score on the 0–100 scale
(§6) alongside its tier label — never a tier label alone, never a raw
internal float.
**Acceptance Criteria:**
- AC1: Given any non-BLOCK, non-ALLOW action, when the evidence report is
  rendered (FR-EXP-01), then it displays both a numeric score and a tier
  label.
- AC2: Given a BLOCK action, when rendered, then the specific rule that
  fired is shown instead of (or in addition to) a score, since scoring is
  not the basis for a hard override.

#### FR-RISK-07 — Velocity-window features [Must] *(added — D12, inspired by multi-agent fraud detection research)*
**Source:** `ps.md` "potentially fraudulent transaction patterns"
**Description:** The hot-path feature set shall include rolling-window
velocity features — transaction count and cumulative amount sent by this
user over recent time windows (e.g., last 1 hour, last 24 hours) — in
addition to the single-transaction features in FR-RISK-02. Computed
locally against the synthetic User History Store; no real streaming
infrastructure (Kafka or otherwise) is used or implied.
**Rationale:** closes a specific gap in the original single-transaction
view: a slow-burn, multi-tranche scam (e.g. an "investment/task scam"
that escalates across several small transfers, none individually
unusual) is invisible to a purely single-transaction feature set but
visible to a rolling window.
**Inputs:** `user_id`, `window_definitions` (e.g., `1h`, `24h` — a fixed,
documented set, not user-configurable in the prototype).
**Outputs:** `velocity_txn_count[window]`, `velocity_cumulative_amount[window]`,
each contributing to the hot-path feature vector (`04-risk-and-policy.md` §1).
**Acceptance Criteria:**
- AC1: Given 4 payments to escalating recipients within the last hour,
  each individually below any single-transaction anomaly threshold, when
  scored, then `velocity_txn_count[1h] = 4` contributes positively to
  `hot_score`, distinct from any single transaction's own
  `amount_deviation`.
- AC2: Given a single isolated payment with no other activity in the
  last 24 hours, when scored, then velocity features contribute neutrally
  (no penalty for normal, non-clustered activity).
**Dependencies:** FR-SIM-02 (history store); feeds
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §2 (Behavioral
Velocity specialist)

---

## 9. Functional Requirements — Recipient Verification (FR-REC)

#### FR-REC-01 — Recipient identity resolution [Must]
**Source:** `ps.md` "recipient verification workflow"
**Description:** The system shall resolve every recipient identifier
against a mock recipient directory, returning a registered identity
category distinct from the attacker-controlled display name or note.
**Outputs:** `identity_category` (`individual_personal` |
`registered_biller` | `registered_merchant` | `unresolved`),
`account_age_days` (integer), `is_on_hard_blocklist` (boolean).
**Acceptance Criteria:**
- AC1: Given a `recipient_id` present in the directory, when resolved,
  then `identity_category` is one of the three defined categories, never
  null or freeform text.
- AC2: Given a `recipient_id` absent from the directory, when resolved,
  then `identity_category = unresolved` and this is treated as a
  cautious-default signal, not ignored.
**Dependencies:** [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.2

#### FR-REC-02 — Purpose–identity consistency check [Must]
**Source:** `ps.md` "recipient verification workflow," "impersonation" (D1)
**Description:** The system shall compare the payment's stated purpose
(from the note, or an LLM-derived purpose classification — see
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §2) against the
recipient's resolved `identity_category`, and produce a
`purpose_identity_consistent` boolean plus a one-line `explanation`.
**Main Flow:**
1. Derive `stated_purpose_category` from the note (e.g., "electricity
   bill" → `utility`), or `none_stated` if the note has no discernible
   purpose.
2. Compare against `identity_category` using a fixed compatibility table
   (e.g., `utility` purpose is only consistent with
   `registered_biller`).
3. Emit `consistent: bool` + `explanation`.
**Acceptance Criteria:**
- AC1: Given `stated_purpose_category = utility` and
  `identity_category = individual_personal`, when compared, then
  `consistent = false`.
- AC2: Given `stated_purpose_category = none_stated`, when compared, then
  `consistent` is not asserted `true` by default — it is treated as
  "unknown," feeding the uncertainty-dampening rule (FR-RISK-04) rather
  than being scored as safe.
**Dependencies:** FR-REC-01, [`03-agent-and-tools.md`](./03-agent-and-tools.md) §3 (`check_purpose_consistency` tool)

#### FR-REC-03 — First-time-recipient flag [Must]
**Source:** `ps.md` "unusual recipients"
**Description:** The system shall flag recipients never paid before by
this user (per FR-SIM-02's history) as a standalone signal, distinct from
FR-REC-02.
**Acceptance Criteria:**
- AC1: Given the user's history contains at least one prior payment to
  this recipient, when flagged, then `is_first_time_for_user = false`.

#### FR-REC-04 — Simulated account age [Should]
**Source:** `ps.md` "unusual recipients"
**Description:** The mock directory shall expose a simulated
`account_age_days` per recipient; newer accounts are weighted more
cautiously in the hot-path feature set. Explicitly labeled as simulated
data, never a real registry lookup.
**Acceptance Criteria:**
- AC1: Given `account_age_days < 14`, when scored, then this contributes
  positively to `hot_score` relative to an otherwise-identical older
  account.

#### FR-REC-05 — Visible recipient verification step [Must] *(added by audit finding F-2)*
See FR-SIM-05 — the UI-facing requirement for this capability lives there
to keep all screen-level requirements together; this entry exists so the
FR-REC group is traceable to `ps.md`'s "workflow" wording without
duplicating the flow description.
**Acceptance Criteria:** As FR-SIM-05.
**Dependencies:** FR-SIM-05, FR-REC-01, FR-REC-03, FR-REC-04

---

## 10. Functional Requirements — Agentic Reasoning (FR-AGT)

#### FR-AGT-01 — Warm-path invocation [Must]
**Source:** `ps.md` "LLM-based reasoning"
**Description:** For transactions in the MEDIUM or HIGH tier (not
confidently LOW, not a hard override), the system shall invoke the
bounded LLM-driven Guardian Agent.
**Acceptance Criteria:**
- AC1: Given `hot_tier = MEDIUM` or `HIGH` and `hard_block = false`, when
  evaluated, then the agent is invoked exactly once per transaction.
- AC2: Given `hot_tier = LOW` (confident) or `hard_block = true`, when
  evaluated, then the agent is never invoked.
**Dependencies:** FR-RISK-01, FR-RISK-03

#### FR-AGT-02 — Conditional tool selection [Must]
**Source:** Differentiator D2; honesty commitment in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §4
**Description:** Each specialist (FR-AGT-07) shall be capable of
conditionally selecting which of its tools to call based on intermediate
findings, per the exact logic in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §4.1, with the
documented fallback (§4.2) if this is not demo-stable in the available
build time — the fallback must be labeled accurately wherever the system
is described, per that document's honesty requirement.
**Dependencies:** [`03-agent-and-tools.md`](./03-agent-and-tools.md) §3, §4

#### FR-AGT-03 — Manipulation & typology classification [Must]
**Source:** `ps.md` "urgency-based social engineering," "impersonation"
**Description:** The agent shall classify, when applicable, the
manipulation pattern present in the payment note (at minimum: urgency,
secrecy, authority impersonation) and a best-guess scam typology.
**Outputs:** See schema in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §7.
**Acceptance Criteria:**
- AC1: Given a note containing an explicit urgency marker (e.g.
  "immediately," "before midnight") and a secrecy marker (e.g. "don't
  tell anyone"), when classified, then both `manipulation_signals.urgency`
  and `manipulation_signals.secrecy` are `true`.
- AC2: Given a note with no manipulation language, when classified, then
  `scam_typology = null` and all `manipulation_signals` are `false`.

#### FR-AGT-04 — Structured, schema-validated output only [Must]
**Source:** `ps.md` "safe autonomous decision-making"
**Description:** The agent's output shall be a schema-validated
structured object, never free text consumed directly by the policy layer.
**Acceptance Criteria:**
- AC1: Given the agent returns output that fails schema validation, when
  processed, then it is treated identically to a timeout (NFR-REL-01) —
  never partially trusted or partially applied.
**Dependencies:** [`03-agent-and-tools.md`](./03-agent-and-tools.md) §7

#### FR-AGT-05 — Bounded, read-only, timed execution [Must]
**Source:** `05-threat-model-and-safety.md` NFR-SEC-02
**Description:** The agent shall operate under a hard timeout (NFR-PERF-02)
and shall have no ability to read, write, or call anything beyond its
declared read-only tool set.
**Acceptance Criteria:**
- AC1: Given the agent's tool set as defined in
  [`03-agent-and-tools.md`](./03-agent-and-tools.md) §3, when audited,
  then no tool has write access to funds, account state, or any external
  system.
**Dependencies:** NFR-SEC-02, NFR-PERF-02

#### FR-AGT-06 — Escalate-only recommendation [Must]
**Source:** `ps.md` "safe autonomous decision-making" (D5)
**Description:** The agent's `recommended_tier_delta` shall only ever be
able to increase caution relative to the hot-path tier, never decrease
it — enforced by the policy layer (FR-POL-04), not merely requested by
the agent.
**Acceptance Criteria:**
- AC1: Given any value of `recommended_tier_delta`, including a malformed
  or adversarially manipulated one, when applied by the Policy Engine,
  then `final_tier` is never lower than `hot_tier`.
**Dependencies:** FR-POL-04

#### FR-AGT-07 — Multi-specialist coordination [Must] *(added — D10, inspired by comparison against `multi-specialist fraud architecture`)*
**Source:** `ps.md` "analyzing a payment request... evaluating risk"
**Description:** The warm path shall run four bounded specialist
reasoning lenses (Identity & Purpose, Linguistic Manipulation, Behavioral
Velocity, Historical Pattern) concurrently, then a Coordinator step shall
reconcile their individual findings into the single structured verdict
consumed by the Policy Engine (FR-AGT-04). The Coordinator introduces no
new evidence of its own — only synthesis. Full specification in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §2.
**Acceptance Criteria:**
- AC1: Given the warm path is invoked (FR-AGT-01), when it completes
  successfully, then the audit record shows which of the four specialists
  returned findings and what the Coordinator's `specialist_agreement`
  value was (`03-agent-and-tools.md` §7).
- AC2: Given one specialist times out while the other three succeed, when
  the Coordinator runs, then it synthesizes from the three available
  findings rather than failing the entire warm path (§5 of the same
  document — degradation semantics).
- AC3: Given all four specialists agree on a `RAISE_TO_MAX`
  recommendation independently, when synthesized, then
  `specialist_agreement = "unanimous"` and this is visible in the
  operator view (FR-EXP-03) — not collapsed into an unexplained single
  number.
**Dependencies:** FR-AGT-01, FR-AGT-04, FR-POL-04

#### FR-AGT-08 — Historical pattern retrieval (RAG) [Must] *(added — D11, inspired by comparison against `multi-specialist fraud architecture`)*
**Source:** `ps.md` "potentially fraudulent transaction patterns"
**Description:** The Historical Pattern specialist (FR-AGT-07) shall
query a small, static, project-authored corpus of documented scam
typologies (not live or cross-user case data — see `00-overview.md`
§5.1.1, §5.3 C10) via similarity search, and report the closest matching
typology and its similarity score, or explicitly report no match if
nothing clears a minimum similarity floor.
**Inputs:** A query composed from the note text plus the other
specialists' preliminary findings (per the conditional-query design in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §4.1).
**Outputs:** `matched_pattern: {typology, similarity_score, corpus_entry_id}`
or `null`.
**Acceptance Criteria:**
- AC1: Given a note closely resembling a corpus entry (e.g., matching the
  "family emergency scam" pattern's characteristic language), when
  queried, then `matched_pattern.typology` names that entry and
  `similarity_score >= ` the configured minimum floor.
- AC2: Given a note that resembles nothing in the corpus, when queried,
  then `matched_pattern = null` — the specialist never forces a weak
  match to appear confident.
**Dependencies:** [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.5 (corpus specification)

#### FR-AGT-09 — Feedback-driven corpus growth [Should] *(added — B2, bonus tier)*
**Source:** Differentiator B2
**Description:** An operator shall be able to mark a past, terminal
transaction's outcome as "confirmed scam," which adds a new entry
(typology + a redacted/generalized description, not the raw personal
note) to the FR-AGT-08 corpus, available to future retrievals.
**Acceptance Criteria:**
- AC1: Given a past transaction is marked "confirmed scam," when the
  corpus is next queried, then the new entry is a retrievable candidate.
- AC2: Given this feature, when audited, then it is clearly distinct from
  and does not claim to be retraining of the hot-path risk model
  (`00-overview.md` §5.3, C9) — it only grows what can be retrieved.
**Dependencies:** FR-AGT-08, FR-AUD-01 (source transaction must be a real
audit record)

---

## 11. Functional Requirements — Policy & Action Decision (FR-POL)

#### FR-POL-01 — Sole decision authority [Must]
**Source:** `ps.md` "risk score/category," "pause/block mechanism"
**Description:** A single Policy Engine shall be the sole authority
mapping `(hot_tier, hard_block, agent verdict, hot_confidence)` to exactly
one final action: **ALLOW, ADVISE, CHALLENGE, PAUSE, or BLOCK**. No other
component may emit a final action directly to the UI.
**Acceptance Criteria:**
- AC1: Given any input combination, when decided, then exactly one of the
  five actions is produced — never zero, never more than one.
**Dependencies:** FR-RISK-01…04, FR-AGT-04, FR-AGT-06

#### FR-POL-02 — PAUSE always retains an override path [Must]
**Source:** `ps.md` "pause/block mechanism," "human-in-the-loop
intervention"
**Description:** PAUSE shall never be silent or permanent: the user is
always shown the reason and always has an explicit path to either cancel
or consciously proceed. This applies **only** to PAUSE — see FR-POL-05
for the distinct BLOCK action, which does not offer this path.
**Acceptance Criteria:**
- AC1: Given action = PAUSE, when rendered, then both "Cancel" and "I
  understand the risk, proceed anyway" are present and actionable.
**Dependencies:** FR-INT-03, FR-POL-05

#### FR-POL-03 — Friction scales with tier and amount [Must]
**Source:** `ps.md` "user confirmation step"
**Description:** Friction shall scale with both amount and action tier:
ALLOW = none; ADVISE = non-blocking banner; CHALLENGE = active engagement
required before pay is enabled; PAUSE = blocks pay until the full evidence
report is acknowledged; BLOCK = pay action is disabled entirely, no
acknowledgment path re-enables it.
**Acceptance Criteria:**
- AC1: Given action = ALLOW, when rendered, then no additional UI element
  interrupts the payment flow.
- AC2: Given action = BLOCK, when rendered, then the pay action remains
  permanently disabled for this transaction attempt; the only available
  actions are "Cancel" and (optionally) a link to simulated
  support/recourse information.
**Dependencies:** FR-INT-01…04

#### FR-POL-04 — Escalate-only invariant (tested) [Must]
**Source:** `ps.md` "safe autonomous decision-making" (D5, D9)
**Description:** The Policy Engine shall enforce, as a **tested
invariant**, that agent output can only move `final_tier` toward more
caution than `hot_tier`, never less.
**Acceptance Criteria:**
- AC1: Given the full scenario suite plus the red-team payload set
  ([`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.6),
  when run, then zero cases exist where `final_tier < hot_tier`.
**Dependencies:** FR-AGT-06; test defined in
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.1

#### FR-POL-05 — BLOCK: non-overridable hard-override action [Must] *(added by audit finding F-1)*
**Source:** `ps.md` "pause/block mechanism"
**Description:** A distinct **BLOCK** action, reserved exclusively for
`hard_block = true` cases (FR-RISK-03), shall have **no user override
path** — this is the one place this system deliberately fails closed with
no "proceed anyway" option, because it represents a hard rule (e.g., a
confirmed blocklist match), not a probabilistic judgment. BLOCK is never
reachable from a score alone, no matter how high `hot_score` is; only
`hard_block = true` produces it.
**Acceptance Criteria:**
- AC1: Given `hard_block = true`, when the Policy Engine decides, then
  `action = BLOCK` unconditionally, regardless of `hot_score`,
  `hot_confidence`, or any agent output (the agent is never invoked in
  this path per FR-RISK-03 AC2).
- AC2: Given `action = BLOCK`, when rendered, then no "proceed anyway"
  control exists anywhere in the UI for this transaction attempt.
- AC3: Given `hot_score = 100` but `hard_block = false`, when decided,
  then `action = PAUSE` (per §6's score-driven tiers), never `BLOCK` —
  score alone never produces BLOCK.
**Dependencies:** FR-RISK-03; demonstrated in Scenario 8,
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §3

---

## 12. Functional Requirements — Intervention UI (FR-INT)

#### FR-INT-01 — Active-engagement CHALLENGE [Must]
**Source:** `ps.md` "user confirmation step"
**Description:** The CHALLENGE tier's UI shall require the user to
actively engage — typing the resolved recipient identity, or waiting out
a `4000ms` **[calibration default]** enforced pause with the pay button
disabled — rather than a single dismissible "OK."
**Acceptance Criteria:**
- AC1: Given action = CHALLENGE, when rendered, then the pay action is
  disabled for at least `4000ms` or until the required typed input is
  correctly entered, whichever mechanism is configured for that scenario.
- AC2: Given the user attempts to bypass the countdown (e.g., rapid
  repeated taps), when tested, then the pay action does not enable early.

#### FR-INT-02 — Evidence report on every non-ALLOW surface [Must]
**Source:** `ps.md` "explainable security alerts"
**Description:** Every ADVISE/CHALLENGE/PAUSE/BLOCK surface shall include
the plain-language evidence report (FR-EXP-01), never a bare score or
tier label alone.
**Dependencies:** FR-EXP-01

#### FR-INT-03 — Override logging [Must]
**Source:** `ps.md` "transaction audit history," "human-in-the-loop
intervention"
**Description:** If the user proceeds despite a CHALLENGE or PAUSE
warning, the system shall log this explicitly as
`user_override_after_warning` — never indistinguishable from an
uncontested ALLOW in the audit trail. (Not applicable to BLOCK, which has
no proceed path — FR-POL-05.)
**Acceptance Criteria:**
- AC1: Given the user clicks "proceed anyway" on a PAUSE or CHALLENGE
  surface, when the audit record is written, then
  `user_decision = "proceeded_after_override"`, distinct from
  `"proceeded"` (the uncontested-ALLOW value).
**Dependencies:** FR-AUD-01

#### FR-INT-04 — Trusted-contact escalation [Should]
**Source:** Differentiator B1
**Description:** For the intersection of PAUSE tier + low agent
confidence (`< 0.40`) + a simulated vulnerable-user flag, the system may
offer a simulated trusted-contact notification/co-approval step.
**Acceptance Criteria:**
- AC1: Given `action = PAUSE`, `agent.confidence < 0.40`, and
  `user.vulnerable_flag = true`, when rendered, then an additional
  "Notify trusted contact" control is offered alongside "Cancel" /
  "proceed anyway."
**Dependencies:** [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §1.1

---

## 13. Functional Requirements — Explainability (FR-EXP)

#### FR-EXP-01 — Plain-language causal narrative [Must]
**Source:** `ps.md` "explainable security alerts"
**Description:** Every non-ALLOW decision shall produce a plain-language
narrative naming the specific evidence that drove it (e.g., "this
recipient account is new to you and your note mentions urgency and
secrecy"), never a numeric score alone.
**Acceptance Criteria:**
- AC1: Given any non-ALLOW action, when the evidence report renders, then
  it contains at least one sentence naming a specific, checkable
  observation (not a generic "this looks risky" statement).
**Dependencies:** FR-RISK-06 (numeric score is shown *alongside*, not
instead of, the narrative)

#### FR-EXP-02 — Fact-based, non-accusatory phrasing [Must]
**Source:** `05-threat-model-and-safety.md` §5
**Description:** Explanations shall describe observable facts, never
accusations (e.g., never "this recipient is a known fraud ring member";
instead "this recipient does not match a registered biller").
**Acceptance Criteria:**
- AC1: Given the full explanation-phrasing rule set
  ([`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) §5),
  when any generated narrative is checked against it, then no output
  contains an accusatory claim about a specific party's guilt or identity.

#### FR-EXP-03 — Technical/operator view [Must]
**Source:** "safe autonomous decision-making" (verifiability)
**Description:** A secondary, more technical view of the evidence
(feature-level detail, which specialists ran and what each concluded,
which tools each called and in what order, the RAG match if any, timing)
shall be available for the operator/judge, separate from the
plain-language consumer-facing view.
**Acceptance Criteria:**
- AC1: Given the operator view is opened for a WARM_EVALUATED
  transaction, when displayed, then it shows the exact tool-call sequence
  and each tool's raw output per specialist, not only the Coordinator's
  final summary.
- AC2: Given a RAG match occurred (FR-AGT-08), when displayed, then the
  matched typology, similarity score, and `specialist_agreement`
  (FR-AGT-07) are all visible.

---

## 14. Functional Requirements — Audit History (FR-AUD)

#### FR-AUD-01 — Append-only audit record per transaction [Must]
**Source:** `ps.md` "transaction audit history"
**Description:** Every evaluated transaction shall produce an audit
record containing: inputs (redacted where appropriate), `hot_score`,
`hot_tier`, agent output (if invoked), final `action`, and
`user_decision`.
**Acceptance Criteria:**
- AC1: Given any transaction reaches the `AUDITED` state (§5), when the
  log is inspected, then exactly one record exists for it, with no field
  missing.

#### FR-AUD-02 — Hash-chained tamper evidence [Must]
**Source:** `ps.md` "transaction audit history"
**Description:** Audit records shall be hash-chained (each record
includes a SHA-256 hash of the previous record) so tampering with
historical records is detectable.
**Acceptance Criteria:**
- AC1: Given a historical record is mutated after the fact, when the
  chain is verified, then verification fails at the mutated record.
**Dependencies:** Tested in
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.7

#### FR-AUD-03 — Browsable history view [Must]
**Source:** `ps.md` "transaction audit history"
**Description:** A history view shall let the user or operator browse
past transactions and open the full evidence report for any of them.
**Acceptance Criteria:**
- AC1: Given 5+ transactions exist in history, when the history view
  opens, then all 5 are listed with at least date, recipient, amount, and
  final action visible without opening the detail view.

#### FR-AUD-04 — History filtering [Should] *(added by audit finding F-4)*
**Source:** `ps.md` "transaction audit history"
**Description:** The history view shall support filtering by date range,
tier, and recipient.
**Acceptance Criteria:**
- AC1: Given a filter by `action = BLOCK`, when applied, then only
  BLOCK-action transactions are shown.

---

## 15. Functional Requirements — Human-in-the-Loop (FR-HITL)

#### FR-HITL-01 — Human final authority for reversible actions [Must]
**Source:** `ps.md` "human-in-the-loop intervention"
**Description:** For every action other than BLOCK, the final decision to
proceed or cancel rests with the human user — the system recommends and
delays the default path, it does not autonomously complete or
permanently deny the payment. BLOCK (FR-POL-05) is the sole exception,
standing in for a legally-mandated block a real system would already be
required to enforce, not a probabilistic AI decision.
**Acceptance Criteria:**
- AC1: Given `action` is ALLOW, ADVISE, CHALLENGE, or PAUSE, when the
  transaction reaches a terminal state, then a human decision (implicit
  for ALLOW/ADVISE, explicit for CHALLENGE/PAUSE) is what produced it.

#### FR-HITL-02 — Trusted-contact as a second human in the loop [Should]
**Source:** Differentiator B1
**Description:** The trusted-contact flow (FR-INT-04) represents a second
human in the loop for the specific case where the primary user's own
judgment is most likely compromised.
**Dependencies:** FR-INT-04

---

## 16. Non-Functional Requirements

#### NFR-PERF-01 — Hot-path latency [Must]
**Source:** `ps.md` "real-time security reasoning"
**Target [calibration default]:** hot path (FR-RISK-01) completes in
`<= 15ms` p95, measured locally on the development machine. A design
target for local execution, not a claimed production SLA (see
[`02-architecture.md`](./02-architecture.md) §2, §6).
**Acceptance Criteria:**
- AC1: Given 100 sequential local hot-path evaluations, when timed, then
  p95 latency is `<= 15ms`.

#### NFR-PERF-02 — Warm-path timeout [Must]
**Target [calibration default]:** each of the four specialists (FR-AGT-07)
has its own sub-timeout of `3000ms`; the Coordinator has `1500ms`; the
whole warm path has a hard total cap of `6000ms`. On any single stage's
timeout, one retry is permitted for that stage before it is treated as
degraded (§5 of [`03-agent-and-tools.md`](./03-agent-and-tools.md)). No
unbounded retry loops, at any stage.
**Acceptance Criteria:**
- AC1: Given a specialist has not returned after `3000ms`, when checked,
  then that specialist is retried once, then treated as degraded if still
  not returned — the other specialists are not blocked by this.
- AC2: Given the total warm path has not completed after `6000ms`
  (specialists + Coordinator combined), when checked, then the pipeline
  proceeds to the fail-open path (NFR-REL-01), never waits indefinitely.

#### NFR-REL-01 — Fail-open on agent failure [Must]
**Source:** `ps.md` "safe autonomous decision-making"
**Description:** If the LLM/agent call errors, times out, or returns a
schema-invalid response, the system shall fail open: the transaction
proceeds according to `hot_tier` alone, and this fallback is logged and
demonstrable (Scenario 5,
[`08-data-and-scenarios.md`](./08-data-and-scenarios.md)).
**Acceptance Criteria:**
- AC1: Given the agent call is forced to fail, when the pipeline
  completes, then `final_tier == hot_tier` and the audit record has
  `degraded = true`.

#### NFR-REL-02 — Single retry, then fallback [Must]
**Description:** Exactly one retry is permitted on agent timeout or
schema-invalid output before falling back to NFR-REL-01's behavior.

#### NFR-REL-03 — Demo-specific reliability fallback [Must]
**Description:** A pre-scripted, cached fallback path shall exist for the
live demo specifically, distinct from the general fail-open behavior —
see [`07-demo-script.md`](./07-demo-script.md) §6.

#### NFR-SEC-01 — Untrusted-input isolation [Must]
**Source:** `05-threat-model-and-safety.md` §1–2
**Description:** The payment note (and any other user-controllable text
reaching the LLM) shall be treated as untrusted input; agent system
instructions shall be structurally isolated from user-provided content.
**Acceptance Criteria:**
- AC1: Given the red-team payload set
  ([`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.6),
  when run, then `final_tier` is never lowered below `hot_tier` by any
  payload (same invariant as FR-POL-04, exercised adversarially).

#### NFR-SEC-02 — Read-only agent tools [Must]
**Description:** No agent tool shall have write access to funds, account
state, or any external system.
**Dependencies:** FR-AGT-05

#### NFR-EXP-01 — Reconstructible decisions [Must]
**Description:** Every decision must be reconstructible after the fact
from its audit record alone, without re-running the pipeline.
**Dependencies:** FR-AUD-01

#### NFR-PRIV-01 — Synthetic data only [Must]
**Description:** All personal data used (user profiles, recipient
directory, transaction history) is synthetic and generated by this
project. Stated in the UI/demo materials, not only in internal
documentation.

#### NFR-HON-01 — No overclaiming [Must]
**Description:** No UI element, log message, or documentation claim shall
imply real bank/NPCI connectivity, real multi-user data, or measured
real-world performance figures.

---

## 17. Data Validation Rules

| Field | Type | Rule |
|---|---|---|
| `recipient_id` | string | Non-empty, `<= 100` characters |
| `amount` | decimal | `> 0`, `<= 10,000,000`, max 2 decimal places |
| `note` | string | `<= 500` characters; may be empty (treated per FR-REC-02 AC2, not defaulted to safe) |
| `timestamp` | ISO-8601 string | System-generated, not user-editable |
| `user_id` / `sender_id` | string | Fixed to the active demo persona; not user-editable in the simulator |
| Simulated device-state toggles (e.g., "call active") | boolean | Default `false`; only settable via the scenario loader (FR-SIM-04) or an explicit demo control, never inferred |

Any field failing validation blocks submission (FR-SIM-01 AC2) before any
risk evaluation is invoked — invalid input never reaches the hot path.

---

## 18. UI Screen Inventory

| Screen | Purpose | Key requirements |
|---|---|---|
| **Compose Payment** | Recipient, amount, note entry | FR-SIM-01, §17 |
| **Recipient Check panel** *(inline within Compose Payment)* | Shows resolved identity category, account age, first-time status | FR-SIM-05, FR-REC-01/03/04 |
| **Review & Pay** | Final review before evaluation | FR-SIM-01 |
| **Advisory banner** *(inline)* | ADVISE-tier non-blocking notice | FR-INT-02, FR-POL-03 |
| **Challenge modal** | CHALLENGE-tier active-engagement surface | FR-INT-01 |
| **Pause screen** | PAUSE-tier full evidence report + Cancel/Proceed | FR-INT-02, FR-POL-02 |
| **Blocked screen** | BLOCK-tier terminal notice, no proceed option | FR-POL-05, FR-POL-03 AC2 |
| **Audit History (list)** | Browsable past transactions | FR-AUD-03, FR-AUD-04 |
| **Audit History (detail)** | Full evidence report for one past transaction | FR-AUD-01, FR-EXP-01 |
| **Operator/Technical view** | Feature-level detail, agent tool-call trace | FR-EXP-03 |
| **Scenario selector** | Loads a pre-defined demo scenario | FR-SIM-04 |

---

## 19. Priority, Dependency & Test Traceability Summary

| Priority | Requirement IDs |
|---|---|
| **Must** (49) | FR-SIM-01…05, FR-RISK-01…07, FR-REC-01…03/05, FR-AGT-01…04/05…08, FR-POL-01…05, FR-INT-01…03, FR-EXP-01…03, FR-AUD-01…03, FR-HITL-01, NFR-PERF-01…02, NFR-REL-01…03, NFR-SEC-01…02, NFR-EXP-01, NFR-PRIV-01, NFR-HON-01 |
| **Should** (5) | FR-REC-04, FR-AGT-09, FR-INT-04, FR-AUD-04, FR-HITL-02 |
| **Total** | 54 requirements |

Full scenario-level traceability (which scenario proves which requirement)
is in [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §4. Full
test-suite-level traceability (which automated test proves which
invariant) is in
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §4.

---

## 20. Definition of Done (MVP)

The build is considered demoable when:

1. All 49 Must requirements pass their stated acceptance criteria.
2. All 9 scenarios in
   [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) §3 run
   end-to-end and produce the documented action for each.
3. The escalate-only invariant (FR-POL-04) has zero violations across the
   scenario suite and the red-team payload set.
4. The fail-open path (NFR-REL-01) is demonstrated live without a crash.
5. No UI, log, or documentation text violates NFR-HON-01.
6. The multi-specialist Coordinator (FR-AGT-07) correctly degrades to a
   subset of specialists at least once in testing (proving §5 of
   `03-agent-and-tools.md` is real, not just documented).

Should-tier requirements (5) are explicitly not required for this
definition of done — see [`00-overview.md`](./00-overview.md) §5.2.

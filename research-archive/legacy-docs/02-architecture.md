# Architecture Specification
## Project Kurukshetra — Agentic Guardian

---

## 1. Technology Choice per Concern

| Concern | Tool | Why |
|---|---|---|
| Is this amount/timing/recipient numerically unusual for this user? | Deterministic rules + a trained gradient-boosted-tree model | Sub-millisecond, reproducible, auditable — a structured numeric pattern, no reasoning required. |
| Does this recipient's registered identity match what the payment claims it's for? | Deterministic lookup + comparison (mock directory) | A lookup and category comparison, not a reasoning task. The *result* is handed to the agent as evidence, not derived by it. |
| Does this payment note contain manipulation language, and what does it imply? | LLM | The one job in the pipeline that is genuinely unstructured/context-dependent language understanding — what ps.md's "LLM-based reasoning" requirement is for. |
| Given everything found so far, should this transaction be paused? | Deterministic policy layer, never the LLM directly | Safety-critical and must be auditable and non-manipulable. The LLM's output is one input to it, capped to only increase caution. |
| Should multiple angles of the same evidence be reasoned about separately? | Yes — four fixed specialist lenses (D10) feeding one coordinator | A single generalist LLM pass tends to under-weight signals it isn't explicitly prompted to look for. Four narrow, specific questions (§3.1) each get a focused answer; the coordinator then reconciles them into one verdict. This is *not* the same as unbounded multi-agent negotiation (next row) — it's a fixed-shape decomposition of one reasoning job into four sub-questions, still bounded, still timed, still subordinate to the Policy Engine. |
| Multiple agents independently negotiating/voting on the *final decision*? | Rejected | The specialists above answer sub-questions, not the final action — they do not vote, debate, or have decision authority. Splitting *decision* authority across negotiating agents adds latency, cost, and non-determinism with no corresponding capability gained, and — per the comparison against `streaming-fraud-intelligence` (`00-overview.md` §5.1.1) — hands final-confidence judgment to the model itself, which this project explicitly does not do. |
| Retrieval-augmented generation? | Used narrowly (D11) | Not for general document search — for one specific, bounded lookup: does this payment's shape match a known, documented scam typology? The corpus is small (tens of entries), static, and project-authored, not a live or growing index of real cases (see `08-data-and-scenarios.md` §1.5). This is retrieval against a reference, not memory of real people. |

**Summary:** deterministic/ML components handle everything structured and
numeric; the LLM (across four bounded specialist lenses plus one
synthesis step) handles what is unstructured, linguistic, or requires
comparing against known patterns; a deterministic policy layer has final
authority and can only be moved toward caution by what the agent finds,
never away from it.

---

## 2. Where Reasoning Happens

Reasoning happens in the **confirmation step**, before the simulated "Pay"
action fires — not inside a synchronous payment-clearing call.

- Real payment switches operate on a tight synchronous budget; LLM
  reasoning takes roughly two orders of magnitude longer than that budget
  allows. This is a physical constraint, not a design preference.
- ps.md's actual requirement is "before transaction completion" — an
  ordering constraint, not a hard-latency one. Nothing in ps.md requires
  reasoning inside a bank's clearing call.
- "Real-time" in this project means the system responds promptly to the
  user's specific payment as they compose it — not that it operates
  inside a bank's internal clearing latency budget, which this project
  does not simulate or claim.

---

## 3. Pipeline

```
 Payment Simulator UI
 Compose payment (recipient, amount, note) → "Review & Pay"
                │
                ▼
 HOT PATH (deterministic + ML)
 Rule checks (incl. hard_block) → Recipient resolution (mock directory) →
 Purpose–identity comparison → Feature vector →
 Trained gradient-boosted-tree model → hot_score (0-100), hot_tier,
 confidence, hard_block
                │
    hard_block == true? ──yes──► POLICY LAYER → action = BLOCK (terminal,
                │                no override path — skips warm path)
                │ no
    hot_tier confidently LOW? ──yes──► ALLOW
                │ no
                ▼
 WARM PATH (bounded, four specialist lenses + one coordinator — see §3.1)
 Given: note, resolved recipient identity, purpose–identity result,
 user history summary, rolling-window velocity features, RAG corpus.
 Specialists run concurrently, each bounded; Coordinator synthesizes
 their findings into ONE structured verdict:
 { scam_typology, manipulation_signals[], confidence, evidence[],
   matched_pattern_reference, recommended_tier_delta }
 Hard total timeout; on failure/timeout at any stage → fail open.
                │
                ▼
 POLICY LAYER (deterministic, sole authority)
 final_tier = max(hot_tier, capped(agent verdict))   # never below hot_tier
 → action: ALLOW / ADVISE / CHALLENGE / PAUSE   (BLOCK only via the
   hard_block branch above — never reachable from score alone)
                │
                ▼
 EXPLAINABILITY + INTERVENTION UI
 Plain-language evidence report · graduated friction · user decision
 (cancel / proceed) captured
                │
                ▼
 AUDIT LOG (hash-chained, append-only)
```

### 3.1 Warm-Path Internal Structure (D10)

```
                    WARM PATH INVOKED
                            │
        ┌───────────┬───────┴───────┬───────────────┐
        ▼           ▼               ▼               ▼
   Identity &   Linguistic     Behavioral       Historical
    Purpose    Manipulation     Velocity         Pattern
   Specialist   Specialist     Specialist       Specialist
        │           │               │               │
   (checks tool  (classifies    (checks rolling  (RAG lookup
    outputs       note for       windows —        against the
    already       urgency/       txn count/       static scam-
    computed by   secrecy/       amount over      typology corpus,
    the hot path) authority)     recent time)     08-data-and-scenarios.md §1.5)
        │           │               │               │
        └───────────┴───────┬───────┴───────────────┘
                             ▼
                       COORDINATOR
          Reconciles all four findings into ONE schema-
          validated verdict (03-agent-and-tools.md §7).
          Does not add new evidence of its own — only
          synthesizes and resolves conflicts between the
          four specialists' outputs.
                             │
                             ▼
              → Policy Engine (still sole final authority)
```

Each specialist is bounded independently (its own smaller timeout inside
the total warm-path budget, §6); if one specialist fails or times out,
the Coordinator synthesizes from whichever specialists *did* return,
rather than failing the whole warm path — full degradation semantics in
[`03-agent-and-tools.md`](./03-agent-and-tools.md) §5. Full specialist
definitions are in [`03-agent-and-tools.md`](./03-agent-and-tools.md) §2;
tool access is in §3; the Coordinator's synthesis output is in §7.

---

## 4. Components

| Component | Responsibility | Real or Simulated |
|---|---|---|
| Payment Simulator UI | Compose/review a payment; render evidence reports, graduated friction, audit history | Real |
| Recipient Directory | Resolves a recipient identifier to an identity category + simulated account age | Simulated (mock, in-project dataset) |
| User History Store | Prior recipients, typical amounts/timing for the demo persona | Simulated (synthetic dataset) |
| Risk Engine (hot path) | Rule checks + trained model + rolling-window velocity features → score and tier | Real — trained model, on synthetic data, labeled as such |
| Historical Pattern Store (RAG corpus) | Small, static, project-authored embeddings of documented scam typologies | Real — a genuine small local vector store (or equivalent similarity search), over synthetic/authored reference text, not live case data |
| Guardian Agent (warm path) | Four bounded specialist reasoning lenses + one coordinator synthesis step (§3.1) | Real — genuine LLM calls, structured output at every stage. Replaces the fully-mocked module in the existing partial prototype. |
| Policy Engine | Sole authority mapping (hot tier, agent verdict, uncertainty) → final action | Real |
| Explainability Engine | Plain-language evidence report; safe phrasing | Real |
| Audit Log | Hash-chained append-only decision record | Real — local hash chain, not enterprise WORM/blockchain |
| Orchestrator | Ties the above together; owns fail-open timeout logic | Real |

---

## 5. Data Flow

1. UI submits `{sender_id, recipient_id, amount, note, timestamp}`.
2. Recipient Directory resolves `recipient_id → {identity_category, account_age_days, is_first_time_for_user}`.
3. A purpose classifier derives `stated_purpose_category` from the note
   (rule/keyword-based, or folded into the Identity & Purpose specialist
   — see [`03-agent-and-tools.md`](./03-agent-and-tools.md) §2).
4. Risk Engine computes rolling-window velocity features (transaction
   count/cumulative amount over recent time windows, against the User
   History Store) alongside the rest of the feature vector, and produces
   `{hot_score (0-100), hot_tier, hot_confidence, hard_block}`.
5. If `hard_block = true`, Policy Engine immediately sets `action = BLOCK`
   (terminal, no override path) and processing skips to step 11 — no
   agent call.
6. Else if `hot_tier` is confidently LOW, orchestrator short-circuits to
   ALLOW — no agent call, no added latency.
7. Otherwise the orchestrator invokes the Guardian Agent's four
   specialists concurrently (§3.1), each with the assembled context; the
   Historical Pattern specialist additionally queries the RAG corpus.
8. The Coordinator synthesizes whichever specialists returned (all four,
   or fewer under degradation — `03-agent-and-tools.md` §5) into one
   structured verdict, or the pipeline hits the total-timeout fallback
   path.
9. Policy Engine computes `final_tier` and `action` (one of ALLOW,
   ADVISE, CHALLENGE, PAUSE — BLOCK only arises via step 5).
10. Explainability Engine renders the plain-language report for `action`.
11. UI presents graduated friction; captures the user's final choice.
12. Audit Log appends the record, hash-chained to the previous entry.

---

## 6. Latency Design Targets

| Stage | Local target | Note |
|---|---|---|
| Hot path (steps 1–5, incl. velocity features) | Low single-digit ms | Achievable locally; not a claimed production SLA |
| Each specialist (4x, concurrent) | ≤3s per specialist, own sub-timeout | Run concurrently, not sequentially — total warm-path time is not 4x a single call |
| Coordinator synthesis | ≤1.5s | One additional LLM call over the specialists' combined findings |
| Warm path total (steps 7–8) | ≤6s, hard-capped | Bounded by real LLM API calls — the one stage this project does not fully control, hence fail-open. Wider than the original single-agent 4s budget because it now covers four concurrent specialist calls plus one synthesis call, not one call. |
| End-to-end (ambiguous case) | Under ~7s perceived | Acceptable for a confirmation-step UX, not evaluated against a payment-rail SLA |

All timing figures reported in evaluation are measured locally during
testing and labeled as such — see
[`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §1.

---

## 7. Failure Modes

| Failure | Handling |
|---|---|
| LLM API times out or errors | Fail open: proceed at `hot_tier` only, log the degradation event |
| LLM returns schema-invalid output | Treated as a timeout — one retry, then fail open |
| Recipient directory lookup fails | Recipient treated as unresolved/novel (most cautious default); pipeline does not crash |
| Prompt injection in the payment note | Structural isolation of untrusted input; `final_tier` still cannot drop below `hot_tier` regardless of agent output |
| Policy layer itself errors | Defaults to the most cautious available tier — the one place this system fails *closed*, since it is the final safety authority |

---

## 8. Out of Scope (Restated From `00-overview.md`)

No real bank/NPCI/UPI integration · no real device telemetry · no
multi-user network signals · no enterprise infrastructure · no
*unbounded* multi-agent swarm (the bounded four-specialist-plus-
coordinator structure in §3.1 is in scope) · no RAG against live/
cross-user case data (RAG against the small static corpus in §4 and
`08-data-and-scenarios.md` §1.5 is in scope) · no live retraining of the
hot-path model · no autonomous permanent actions outside BLOCK. See
[`00-overview.md`](./00-overview.md) §3.1 and §5.3 for the full, binding
list.

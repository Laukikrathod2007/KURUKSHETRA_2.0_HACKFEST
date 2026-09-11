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
| Multiple agents negotiating/voting? | Rejected — one bounded agent is sufficient | This problem has one reasoning job (interpret note + recipient context) and one decision job (apply policy). Splitting reasoning across multiple negotiating agents adds latency, cost, and non-determinism with no corresponding capability gained. |
| Retrieval-augmented generation? | Not used | No large evolving document corpus to search — the recipient directory and user history are small structured lookups exposed as tools, not a RAG index. |

**Summary:** deterministic/ML components handle everything structured and
numeric; the LLM handles the one thing that is unstructured and
linguistic; a deterministic policy layer has final authority and can only
be moved toward caution by what the LLM finds, never away from it.

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
 Rule checks → Recipient resolution (mock directory) →
 Purpose–identity comparison → Feature vector →
 Trained gradient-boosted-tree model → hot_tier + confidence
                │
    hot_tier confidently LOW? ──yes──► ALLOW
                │ no
                ▼
 WARM PATH (bounded LLM agent)
 Given: note, resolved recipient identity, purpose–identity result,
 user history summary. Agent conditionally calls its read-only tools,
 emits a structured verdict:
 { scam_typology, manipulation_signals[], confidence, evidence[],
   recommended_tier_delta }
 Hard timeout; on failure/timeout → fail open.
                │
                ▼
 POLICY LAYER (deterministic, sole authority)
 final_tier = max(hot_tier, capped(agent verdict))   # never below hot_tier
 → action: ALLOW / ADVISE / CHALLENGE / PAUSE
                │
                ▼
 EXPLAINABILITY + INTERVENTION UI
 Plain-language evidence report · graduated friction · user decision
 (cancel / proceed) captured
                │
                ▼
 AUDIT LOG (hash-chained, append-only)
```

---

## 4. Components

| Component | Responsibility | Real or Simulated |
|---|---|---|
| Payment Simulator UI | Compose/review a payment; render evidence reports, graduated friction, audit history | Real |
| Recipient Directory | Resolves a recipient identifier to an identity category + simulated account age | Simulated (mock, in-project dataset) |
| User History Store | Prior recipients, typical amounts/timing for the demo persona | Simulated (synthetic dataset) |
| Risk Engine (hot path) | Rule checks + trained model → score and tier | Real — trained model, on synthetic data, labeled as such |
| Guardian Agent (warm path) | Bounded LLM reasoning via a small read-only tool set | Real — genuine LLM calls, structured output. Replaces the fully-mocked module in the existing partial prototype. |
| Policy Engine | Sole authority mapping (hot tier, agent verdict, uncertainty) → final action | Real |
| Explainability Engine | Plain-language evidence report; safe phrasing | Real |
| Audit Log | Hash-chained append-only decision record | Real — local hash chain, not enterprise WORM/blockchain |
| Orchestrator | Ties the above together; owns fail-open timeout logic | Real |

---

## 5. Data Flow

1. UI submits `{sender_id, recipient_id, amount, note, timestamp}`.
2. Recipient Directory resolves `recipient_id → {identity_category, account_age_days, is_first_time_for_user}`.
3. A purpose classifier derives `stated_purpose_category` from the note
   (rule/keyword-based, or folded into the agent step — see
   [`03-agent-and-tools.md`](./03-agent-and-tools.md) §1).
4. Risk Engine assembles the feature vector and produces
   `{hot_score, hot_tier, hot_confidence}`.
5. If `hot_tier` is confidently LOW, orchestrator short-circuits to ALLOW —
   no agent call, no added latency.
6. Otherwise the orchestrator invokes the Guardian Agent with the
   assembled context; it returns its structured verdict or the pipeline
   hits the timeout/fallback path.
7. Policy Engine computes `final_tier` and `action`.
8. Explainability Engine renders the plain-language report for `action`.
9. UI presents graduated friction; captures the user's final choice.
10. Audit Log appends the record, hash-chained to the previous entry.

---

## 6. Latency Design Targets

| Stage | Local target | Note |
|---|---|---|
| Hot path (steps 1–5) | Low single-digit ms | Achievable locally; not a claimed production SLA |
| Warm path (agent call) | 1–5s, hard-capped | Bounded by a real LLM API call — the one stage this project does not fully control, hence fail-open |
| End-to-end (ambiguous case) | Under ~5s perceived | Acceptable for a confirmation-step UX, not evaluated against a payment-rail SLA |

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
multi-agent swarm · no RAG pipeline · no autonomous permanent actions.
See [`00-overview.md`](./00-overview.md) §3.1 and §5.3 for the full,
binding list.

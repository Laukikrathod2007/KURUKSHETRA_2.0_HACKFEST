# 08 — Observability

Observability is designed against three audiences: an operator watching the system run, a judge verifying the Real/Simulated/Conceptual claims live, and a future auditor reconstructing why a specific transaction got the decision it got.

## Structured logging

Every request through the Risk Engine emits one structured log line per stage:
```jsonc
{
  "transaction_id": "txn_8f2a...",
  "stage": "TIER_1_COMPLETE",
  "elapsed_ms": 31.2,
  "tier_reached": 1,
  "data_completeness": "FULL",
  "checks_executed": ["...", "..."],
  "decision_so_far": null   // null until the scoring engine finalizes it
}
```
No raw payer/beneficiary identifiers ever appear in logs — only the same hashed references used in the canonical contracts.

## Metrics (per-tier latency + decision distribution)

- **Tier 0 latency histogram** — target p50/p95/p99, alarm if p99 approaches the 10ms internal budget.
- **Tier 1 latency histogram** — alarm if p99 approaches the 45ms hard budget.
- **Circuit-breaker trip counter** — every time the fallback contract fires (timeout or missing data source), incremented with a label for which detector caused it. A rising trend here is itself a signal worth watching (either infra degradation or an adversary probing for timeouts).
- **Decision distribution** — rolling count of ALLOW/STEP_UP/COACH/FREEZE, so an operator can see at a glance whether the system's posture is drifting (e.g., a sudden spike in FREEZE could mean either a real attack wave or a miscalibrated threshold after a self-tuning update from feature #36).
- **Intervention outcome rate** — per intervention template, what fraction of users proceeded vs. aborted after seeing it (feature #36's raw input).

## Audit trail verification

A standalone script periodically re-walks the `audit_entries` hash chain (`04-infrastructure-and-mocks.md`) and confirms `entry_hash == sha256(prev_hash + canonical_json(entry))` for every row, flagging any break in the chain — this is the concrete, checkable version of the "WORM audit" concept from `fresh_base.md`, and it is something a judge can be shown running live rather than asked to trust.

## The judge-facing "system truth" panel

A small always-visible panel in the Demo Frontend (and in the NPCI Ops Dashboard) that reads the `label` field already present on every Tier 1/Tier 2 evidence entry and renders it as a visible badge: **REAL** (solid), **SIMULATED** (hatched), **CONCEPTUAL** (outlined only). This directly closes the peer-review-identified gap of "nothing lets a judge verify the claims live" — the labels aren't just written in `03-feature-tier-map.md`, they travel with the actual API response and render on screen during the live demo.

## MCP tool-call tracing

Every MCP tool invocation is logged with its exact input evidence bundle and output, specifically so the prompt-injection boundary described in `05-mcp-architecture.md` is auditable after the fact: a reviewer can confirm that `explain_decision` never received anything beyond the frozen evidence bundle, and that `select_intervention_template`'s chosen template is fully explained by the reason codes in that bundle, not by any free-text field.

## What "done" looks like for observability before a live demo

- [ ] Every API response carries `data_completeness` and per-signal `label`.
- [ ] The judge-facing panel renders those labels live, not from a static slide.
- [ ] The circuit-breaker trip counter is visible somewhere on screen during the ORANGE/RED demo scenarios, so a timeout-induced STEP_UP (rather than a silent ALLOW) can be shown happening, not just claimed.
- [ ] The audit-chain verifier can be run on stage and shown passing.

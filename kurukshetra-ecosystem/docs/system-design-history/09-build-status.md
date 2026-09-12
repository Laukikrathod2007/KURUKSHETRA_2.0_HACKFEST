# 09 — Build Status

Live status of the implementation against the plan in `07-build-order.md`.
Verified by the test suite (`pytest`, 28 tests) plus end-to-end HTTP smoke runs.

## Built and verified working

| Component | Where | Status |
|---|---|---|
| Canonical contracts (Pydantic) | `src/kurukshetra/contracts.py` | Done |
| Relational schema (all 5 DBs) | `src/kurukshetra/models.py`, `db.py` | Done — `DATABASE_URL` env var swaps SQLite→managed Postgres with zero code change |
| Tier 0 router | `src/kurukshetra/tier0.py` | Done — features #3, #4, #9, #10 + known-beneficiary gate |
| Tier 1 local-ledger detectors | `src/kurukshetra/tier1_ledger.py` | Done — features #6, #14, #15, #16, #17, #27, #35 |
| Tier 1 CBS forensics | `src/kurukshetra/tier1_cbs.py` | Done — features #7, #18, #19, #20, #21 |
| Tier 1 switch counters | `src/kurukshetra/tier1_switch.py` | Done — features #1, #2 (single-PSP proxy) |
| Community reputation + Sybil resistance | `src/kurukshetra/reputation.py` | Done — feature #11, min-3-reporter threshold + per-identity rate limit + decay |
| Tier 2 conceptual registry | `src/kurukshetra/registry.py` | Done — features #22, #23, #24, always `CONCEPTUAL`-labeled |
| Deterministic scoring engine | `src/kurukshetra/scoring.py` | Done — incl. the fallback/degradation contract |
| Hash-chained audit log | `src/kurukshetra/audit.py` | Done — `verify_chain()` runs live |
| MCP server (FastMCP) | `src/kurukshetra_mcp/server.py` | Done — 5 tools, independently runnable |
| MCP host (in-process) | `src/kurukshetra_mcp/host.py` | Done — invoked only on COACH/FREEZE |
| Mock NPCI switch | `src/services/mock_npci_switch.py` | Done |
| Mock PSP app | `src/services/mock_psp_app.py` | Done |
| Card CNP / 3DS adapter | `src/services/mock_card_acs.py` | Done — feeds RBA recommendation, does not authorize |
| NetBanking adapter | `src/services/mock_netbanking.py` | Done |
| Public Scam Score Lookup | `src/services/public_lookup.py` | Done — feature #34, no bank dependency |
| Community report endpoint | `src/services/community_reports.py` | Done |
| Consolidated deployable app | `src/main.py` | Done — one process, Procfile for Railway/GCP |
| Demo frontend | `frontend/` | Done — static, Vercel-ready, includes judge panel |
| Seed data (4 demo scenarios) | `src/kurukshetra/seed.py` | Done |

## Verified demo scenarios (live HTTP)

| Scenario | Beneficiary | Result |
|---|---|---|
| GREEN | `grocer.local@oksbi` | `ALLOW`, score 0.0, Tier 0 only (Tier 1 never runs — the progressive-computation claim, demonstrated) |
| YELLOW | `newshop.mumbai@oksbi` | `STEP_UP`, `data_completeness: PARTIAL` — fallback contract prevents a silent ALLOW on missing data |
| ORANGE | `cbi.clearance.cell@sbi` + `GOVT_FINE` | `COACH` at lookup, `FREEZE` once a ₹75,000 amount is added; MCP renders `PURPOSE_CONTRADICTION_SCREEN` |
| RED | `mule.syndicate@axis` | `FREEZE`, score 1.0, five signals fired across CBS + reputation + registry |

## Not built (deliberate, documented)

- **Features #5, #8, #12, #13, #32, #33** — require NPCI-native deployment or Central Mapper access. These are `CONCEPTUAL` in `03-feature-tier-map.md`; the NPCI Ops Dashboard staging view for #32/#33 is the remaining optional demo asset.
- **Real LLM call inside `explain_decision`** — currently deterministic templates. The seam is marked in `kurukshetra_mcp/tools.py`; swapping in a model call needs an API key and changes nothing else.
- **One-Way Account Detection (#18) heuristic** is simplified — the Mock CBS seeds one synthetic sender per credit row, so the sink ratio is an approximation rather than a true unique-counterparty count.

## Known follow-ups

- `datetime.utcnow()` is deprecated in Python 3.12; switch to timezone-aware `datetime.now(dt.UTC)` before this goes anywhere near production.
- `main.py` CORS is `allow_origins=["*"]` — tighten to the real Vercel domain before production use.
- No Alembic migrations yet; schema is created via `Base.metadata.create_all`. Fine for the demo, needs migrations for a real deployment.

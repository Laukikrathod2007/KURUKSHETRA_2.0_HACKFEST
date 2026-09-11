# Kurukshetra System — Implementation-Oriented Design & Build

This is the buildable product. It supersedes the research/planning material now archived under `../research-archive/`. Its foundation is three decision documents kept in `docs/`: `docs/00-fresh-base.md` (the 33 finalized detection features), `docs/00-implementation-plan.md` (the NPCI/PSP/card/netbanking integration reality-check), and `docs/00-council-verdict.md` (the architecture council verdict). Those documents established *what* to build and *why*; the rest of `docs/` establishes *how it actually functions as a running system*, in the order the council recommended: **function first, then infrastructure, then build order, then observability.** `src/` is the actual implementation.

Nothing in here contradicts the prior documents. This folder makes them buildable.

## Read order

0. **[00-fresh-base.md](docs/00-fresh-base.md)**, **[00-implementation-plan.md](docs/00-implementation-plan.md)**, **[00-council-verdict.md](docs/00-council-verdict.md)** — the decision record this whole system is built on.
1. **[01-architecture.md](docs/01-architecture.md)** — the complete component list and how they talk to each other. Read this first; everything else assumes it.
2. **[02-transaction-lifecycle.md](docs/02-transaction-lifecycle.md)** — the exact data flow and action flow for a transaction moving through the system, for UPI, Cards, and NetBanking.
3. **[03-feature-tier-map.md](docs/03-feature-tier-map.md)** — every one of the 33 features assigned to a tier, a data source, and a Real / Simulated / Conceptual label. This is the artifact the council named as the single highest-leverage thing to build first.
4. **[04-infrastructure-and-mocks.md](docs/04-infrastructure-and-mocks.md)** — every database and mock service required, what real-world entity each one stands in for, and the exact seam where real integration would replace it.
5. **[05-mcp-architecture.md](docs/05-mcp-architecture.md)** — what the MCP server does, what it does not do, its tools, and how it's invoked.
6. **[06-canonical-contracts.md](docs/06-canonical-contracts.md)** — the exact request/response schemas that cross every component boundary.
7. **[07-build-order.md](docs/07-build-order.md)** — the dependency graph and the phased order to actually write code in.
8. **[08-observability.md](docs/08-observability.md)** — what to log, trace, and dashboard once the system is running.
9. **[09-build-status.md](docs/09-build-status.md)** — what is actually built and verified right now, versus deliberately not built.

## Running it

```bash
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt   # add --trusted-host flags behind a corporate proxy
bash scripts/dev.sh        # seeds the demo data and starts the consolidated backend on :8000
./.venv/Scripts/python.exe -m pytest -q                          # 28 tests
```

Frontend: open `frontend/index.html` (or serve that folder) while the backend runs — see `frontend/README.md` for Vercel deployment.

MCP server, standalone: `PYTHONPATH=src ./.venv/Scripts/python.exe -m kurukshetra_mcp.server`

## Key endpoints

| Endpoint | Purpose |
|---|---|
| `POST /pay/initiate` | UPI Event 1 (recipient lookup → Tier 0, escalating to Tier 1 if needed) |
| `POST /pay/confirm` | UPI Event 2 (amount entered → full scoring + MCP intervention on COACH/FREEZE) |
| `POST /v1/score-vpa`, `POST /v1/score-transaction` | The risk engine directly, for a PSP integrating against it |
| `POST /card/authorize` | 3-D Secure RBA signal for card-not-present |
| `POST /netbanking/add-payee`, `POST /netbanking/confirm-transfer` | NetBanking equivalents |
| `GET /public/lookup/{ref}` | Public Scam Score Lookup (feature #34) |
| `POST /community/report` | Submit a community fraud report (feature #11) |

## The one-paragraph mental model

A transaction enters the system through a **mock NPCI switch** that speaks the same message shapes NPCI's real UPI API spec uses. The **Kurukshetra Risk Engine** (a FastAPI service) sits where a bank/PSP's own switch adapter would call out to it (Model B from `IMPLEMENTATION_PLAN.md`), but every internal decision is made *as if* it were already running inside NPCI itself (Model A) — because that is the architecture being pitched, and Model B is only the proof-of-concept shell around it. Every request first hits **Tier 0** (in-memory, sub-10ms, genuinely real logic against the payer's own local transaction ledger — no privileged access required). If the beneficiary is new or anything in Tier 0 fires, the request escalates to **Tier 1** (target sub-45ms, real detector logic running against seeded/simulated CBS-, reputation-, and registry-shaped data). A small number of features that fundamentally require NPCI-wide visibility (cross-victim correlation, the nationwide kill-switch, government registries) live in **Tier 2**, which is never presented as live — it's staged, and the demo says so out loud. A deterministic scoring engine turns all of this into one of four decisions (ALLOW / STEP-UP / COACH / FREEZE). Only when the decision is COACH or FREEZE does an **MCP-orchestrated agent** get invoked — off the hard latency budget, never deciding risk, only choosing which intervention screen to render and writing the explanation for it. Everything is logged to an append-only, hash-chained audit trail, and every API response carries a label declaring whether the data behind it was Real, Simulated, or Conceptual — because that honesty is the actual differentiator, not a weakness to hide.

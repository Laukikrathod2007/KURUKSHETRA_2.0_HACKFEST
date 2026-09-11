# 01 — System Architecture

## Component inventory

| # | Component | Stands in for (production) | Real / Simulated / Conceptual | Language/stack |
|---|---|---|---|---|
| 1 | **Mock NPCI Switch** | NPCI's UPI switch (`ReqValAdd`/`ReqPay`, Central Mapper) | Simulated (real message shapes, per NPCI's published UPI API spec) | Python/FastAPI |
| 2 | **Mock PSP App** | A UPI app (GPay/PhonePe/Paytm/BHIM) | Simulated | Python/FastAPI + simple web UI |
| 3 | **Kurukshetra Risk Engine** | The engine itself — this is the actual product | Real | Python/FastAPI |
| 4 | **Local Ledger DB** | The payer's own app-side transaction history | Real (schema + logic); seeded with synthetic rows | PostgreSQL (SQLite for local dev) |
| 5 | **Mock CBS Service** | Core Banking System (Finacle/BaNCS/Flexcube) | Simulated | Python/FastAPI, backed by its own Postgres schema |
| 6 | **Reputation/Community DB** | Decentralized post-transaction fraud reports | Real logic (Sybil-resistance rules genuinely implemented); seeded data | PostgreSQL |
| 7 | **Mock Government Registry** | I4C/CFCFRMS, Aadhaar/PAN freeze registry, TRAI CNAP/Sanchar Saathi (collapsed into one mock for the hackathon) | Conceptual | Python/FastAPI, static/seeded responses |
| 8 | **MCP Host + MCP Server** | Internal AI-agent orchestration for post-decision coaching | Real | Python (MCP SDK) |
| 9 | **Audit/Observability Stack** | Merkle-style WORM audit trail + metrics | Real | Append-only Postgres table (hash-chained) + structured logging |
| 10 | **Public Scam Score Lookup** | `kurukshetra.gov.in/lookup`-style public portal | Real, standalone (no bank dependency at all) | Python/FastAPI + static frontend |
| 11 | **Demo Frontend** | The GREEN/YELLOW/ORANGE/RED payment UX + a judge-facing "system truth" panel | Real | Static HTML/JS or a small SPA |
| 12 | **NPCI Ops Dashboard (staged)** | What an NPCI operator would see running this centrally (campaign map, kill-switch button) | Conceptual — a scripted demo view, not backed by live cross-PSP data | Static HTML/JS, canned data |

## Why this shape

The Risk Engine (3) is deployed exactly the way `IMPLEMENTATION_PLAN.md`'s **Model B** describes: as a sidecar service the Mock PSP App (2) calls out to at the same two hook points a real PSP would use (`ReqValAdd`, `ReqPay` pre-flight). Everything the engine calls *outward* to (4–7) is built to the shape those services would actually have in production, so that swapping a mock for the real thing later is a configuration change, not a rewrite. This is the "seam" — see `04-infrastructure-and-mocks.md` for exactly where each seam sits.

The MCP Host (8) is architecturally separate from the Risk Engine's hot path. It is invoked *after* a decision is made, never before — see `05-mcp-architecture.md` for why this boundary is non-negotiable.

## Component diagram

```
┌──────────────┐        ┌────────────────────┐
│ Demo Frontend │◄──────►│   Mock PSP App      │
│ (payer's UI)  │        │ (GPay-shaped client)│
└──────────────┘        └──────────┬──────────┘
                                     │ 1. ReqValAdd(payer, beneficiary)
                                     │ 2. ReqPay(amount)  — pre-PIN
                                     ▼
                         ┌────────────────────┐
                         │  Mock NPCI Switch    │  (message shapes match real UPI API spec)
                         └──────────┬──────────┘
                                     │ forwards to sponsor-bank-side hook
                                     ▼
                    ┌───────────────────────────────────┐
                    │        KURUKSHETRA RISK ENGINE       │
                    │                                       │
                    │  Tier 0 Router (in-memory, <10ms)     │──► Local Ledger DB (4)
                    │        │ escalate if new/flagged       │
                    │        ▼                               │
                    │  Tier 1 Detectors (<45ms target)        │──► Mock CBS (5)
                    │        │                                 │──► Reputation DB (6)
                    │        ▼                                  │──► Mock Gov Registry (7, Tier 2 only)
                    │  Deterministic Scoring Engine              │
                    │        │                                    │
                    │        ▼                                     │
                    │  Decision: ALLOW / STEP_UP / COACH / FREEZE   │
                    └───────────────┬───────────────────────────────┘
                                     │ if COACH or FREEZE
                                     ▼
                         ┌────────────────────┐
                         │   MCP Host + Server  │──► generates explanation,
                         │  (post-decision only)│    selects intervention screen,
                         └──────────┬──────────┘    notifies trusted contact
                                     ▼
                         ┌────────────────────┐
                         │   Demo Frontend      │  renders GREEN/YELLOW/ORANGE/RED screen
                         └────────────────────┘

                    (all decisions + evidence async-logged to Audit Stack (9),
                     independent of the above hot path)

┌────────────────────────┐        ┌───────────────────────────┐
│ Public Scam Score Lookup │        │  NPCI Ops Dashboard (staged) │
│ (10 — real, standalone)  │        │  (12 — conceptual, scripted)  │
└────────────────────────┘        └───────────────────────────┘
```

## Trust and data boundaries

- The Demo Frontend never sees or transmits a UPI PIN, OTP, banking password, or CVV — these stay entirely inside the Mock PSP App / Mock NPCI Switch's own authorization step, which happens *after* the Risk Engine's decision and is never called by the Risk Engine.
- The Risk Engine never receives raw PII beyond what's needed for the current request (VPA/account reference, resolved name, merchant category code, amount, hashed identifiers). See `06-canonical-contracts.md`.
- The MCP Host never receives PIN/OTP/CVV either, and never calls back into Tier 0/1/scoring — it is strictly downstream of a decision that has already been made deterministically.

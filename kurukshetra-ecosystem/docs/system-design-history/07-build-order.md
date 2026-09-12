# 07 — Build Order and Dependency Graph

## Dependency graph

```
Local Ledger DB ──────────────┐
                                ├──► Tier 0 Router ──────┐
VPA/URI parsing (no deps) ─────┘                          │
                                                            ├──► Scoring Engine ──► Decision
Mock CBS ───────────┐                                      │        ▲
Reputation DB ───────┼──► Tier 1 Detectors ────────────────┘        │
Mock Registry (Tier 2)┘                                              │
                                                                       │
Mock NPCI Switch ──► Mock PSP App ──► calls Risk Engine ─────────────┘
                                                                       │
                                                     Decision == COACH/FREEZE
                                                                       ▼
                                                              MCP Host + Server
                                                                       │
                                                                       ▼
                                                              Demo Frontend renders

Audit Log ◄──────────── (async, subscribes to every decision regardless of path)
Public Scam Score Lookup ◄──── (reads Reputation DB directly, independent of everything else)
```

## Phased build order

**Phase 1 — Foundation (no dependencies, can start immediately):**
1. Local Ledger DB schema + seed script (synthetic payers, beneficiaries, transaction history).
2. Canonical input/output contracts as Pydantic models (`06-canonical-contracts.md`) — everything downstream imports these.
3. Mock NPCI Switch + Mock PSP App skeleton — just enough to send a `ReqValAdd`/`ReqPay`-shaped request somewhere.

**Phase 2 — Tier 0 (depends on Phase 1):**
4. Tier 0 Router: known-beneficiary lookup, name-clash check, authority-regex check, QR/deep-link parsing.
5. Wire Mock PSP App → Risk Engine → Tier 0 → response, end to end. **This is the first demoable slice**: known beneficiary → fast ALLOW; new beneficiary → visible escalation.

**Phase 3 — Tier 1 + Scoring Engine (depends on Phase 2):**
6. Mock CBS service + seed data matching the `fresh_base.md` scenarios.
7. Reputation DB + Sybil-resistance rules.
8. Tier 1 detectors (#1, #2, #6, #7, #11, #14–21, #27).
9. Deterministic weighted scoring engine, risk bands wired to 0.30/0.65/0.85, and the fallback/degradation contract from `02-transaction-lifecycle.md`.

**Phase 4 — MCP + Demo UX (depends on Phase 3):**
10. MCP Server tools (`05-mcp-architecture.md`) — `explain_decision` first (the only LLM call), then the deterministic tools.
11. Demo Frontend: the four screens (GREEN pass-through, YELLOW warning, ORANGE with explicit acknowledgment, RED hard block).
12. Trusted Contact notifier (mocked delivery), Bank Helpline directory, Purpose Declaration UI.

**Phase 5 — Conceptual staging + Public tool (can run in parallel with Phase 4):**
13. Mock Government Registry, clearly labeled Conceptual, wired into Tier 2 evidence only.
14. NPCI Ops Dashboard — the scripted "if NPCI ran this centrally" demo (campaign map + kill-switch button), built as a canned-data presentation layer, not a real system.
15. Public Scam Score Lookup — independent build, only needs the Reputation DB from Phase 3.

**Phase 6 — Observability (threaded through from Phase 2, hardened last):**
16. Audit log hash-chaining + verification script.
17. Per-tier latency histograms and circuit-breaker trip counter.
18. The judge-facing "system truth" panel that surfaces the Real/Simulated/Conceptual label live for whatever the demo is currently showing.

**Phase 7 — Additional payment-method adapters (depends on Phase 3's core being stable):**
19. Card CNP adapter (3DS RBA-shaped endpoint) — reuses the Tier 0/1 core, new adapter only.
20. NetBanking adapter (add-payee / confirm-transfer hooks) — reuses ~90% of Tier 1 unchanged.

## What can be skipped or stubbed without weakening the demo

- Multi-VPA Phone Mapping (#5), Unlinked Island Node Detection (#8), Cross-Victim Caller-Recipient Correlation (#12), Aadhaar/PAN freeze (#22), I4C (#23), TRAI (#24), Cross-App Smurfing (#32), Kill-Switch (#33) — all Conceptual, all satisfied by Phase 5's staged dashboard, none need real algorithmic work beyond a static seeded response.
- Verification Fan-In (#13) — build only the weak single-PSP proxy if time allows; otherwise fold into the Conceptual staging.

## What must NOT be skipped

- The fallback/degradation contract (Phase 3, item 9) — this is the specific gap the architecture council's peer review caught as missing from every advisor's answer. Skipping it leaves the adversarial "induce a timeout to get a free ALLOW" gap open.
- The Real/Simulated/Conceptual labeling surfaced through to the API response and the judge-facing panel (Phase 6, item 18) — this is the single highest-leverage credibility artifact identified by the council; it must exist before the first live demo, not be added afterward.

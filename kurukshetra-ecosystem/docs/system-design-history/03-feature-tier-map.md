# 03 — Feature → Tier → Data Source → Label

This is the table the architecture council named as the single highest-leverage artifact to build before writing detector code. Every one of the 33 features from `fresh_base.md` is assigned a tier, a concrete data source, and one of three labels:

- **Real** — genuine logic running on data the system actually has access to (usually the payer's own local ledger, or pure parsing of a string/URI the payer's own device already has).
- **Simulated** — genuine detection logic, but the data source is a mock standing in for infrastructure we don't have access to in a hackathon (CBS, reputation network at scale).
- **Conceptual** — cannot be demonstrated live under any hackathon setup; requires NPCI-native deployment (Model A) or a government MoU. Shown only as a staged/scripted scenario, never presented as running on live data.

| # | Feature | Category | Tier | Data source | Label |
|---|---|---|---|---|---|
| 1 | Verify-to-Abandon Ratio | A | 1 | Mock NPCI Switch's own request counters (PSP-scoped, not cross-PSP) | Simulated |
| 2 | Resolution Burst Detection | A | 1 | Mock NPCI Switch's own request counters (PSP-scoped) | Simulated |
| 3 | Beneficiary Name vs. Claimed Identity | A | 0 | `RespValAdd` (resolved name + mc code) — already returned to the payer's own app | Real |
| 4 | UPI Handle Authority Pattern | A | 0 | The VPA string itself + mc code | Real |
| 5 | Multi-VPA Phone Mapping | B | 2 | NPCI Central Mapper (requires real Mapper credentials) | Conceptual |
| 6 | New-Beneficiary High-Value Outlier | B | 1 (amount-dependent) | Local Ledger DB — payer's OWN transaction history only | Real |
| 7 | Rapid Fund Drainage Velocity | B | 1 | Mock CBS (recipient-side ledger) | Simulated |
| 8 | Unlinked Island Node Detection | B | 2 | Interbank transaction graph (no single entity holds this outside NPCI) | Conceptual |
| 9 | P2P Dynamic QR 'Scan-to-Receive' Trap | C | 0 | The scanned QR's URI string itself | Real |
| 10 | Payment Link Deep-Intent Forensics | C | 0 | The incoming deep-link's URI parameters | Real |
| 11 | Community Scam Reports | D | 1 | Reputation DB — seeded, with Sybil-resistance rules genuinely implemented | Simulated |
| 12 | Cross-Victim Caller-Recipient Correlation | D | 2 | Requires cross-session, cross-victim correlation at NPCI scale | Conceptual |
| 13 | Verification Fan-In Indicator | D | 2 (weak Tier-1 proxy possible) | True form needs cross-PSP totals (NPCI-native); a single-PSP proxy is Simulated but materially weaker | Conceptual (Simulated proxy noted) |
| 14 | Drip Scam Escalation Detection | E | 1 (amount-dependent) | Local Ledger DB — payer's own history with THIS recipient | Real |
| 15 | Threshold Evasion (Smurfing) | E | 1 (amount-dependent) | Local Ledger DB — payer's own rolling-window transactions | Real |
| 16 | Refund Reversal Scam Detection | E | 1 (amount-dependent) | Local Ledger DB — payer's own inbound/outbound history with this entity | Real |
| 17 | UPI Collect Request Abuse Detection | E | 0 | The incoming collect request's note field | Real |
| 18 | One-Way Account Detection | F | 1 | Mock CBS (recipient-side ledger) | Simulated |
| 19 | Burst-Drain-Dormant Lifecycle | F | 1 | Mock CBS (recipient-side balance history) | Simulated |
| 20 | Scam Hours Activity Concentration | F | 1 | Mock CBS (recipient-side credit timestamps) | Simulated |
| 21 | Recipient Account Graph Analysis | G | 1 | Mock CBS + Mock Gov Registry composite (age/KYC/geo fields seeded) | Simulated |
| 22 | Aadhaar & PAN Regulatory Freeze Cross-Verification | G | 2 | Requires police/regulatory freeze registry access | Conceptual |
| 23 | I4C & CFCFRMS 1930 Registry Integration | G | 2 | Requires MHA/I4C government API | Conceptual (seeded "known reported VPA" list as a partial stand-in) |
| 24 | TRAI CNAP & Sanchar Saathi Telecom Integration | G | 2 | Requires DoT/TRAI telecom authority API | Conceptual |
| 26 | Trusted Contact Emergency Dual-Key Override | H | Post-decision (MCP) | Real logic; notification delivery channel (SMS/push) is mocked | Real (mocked delivery channel) |
| 27 | Purpose Declaration Contradiction Detection | H | 1 (amount-dependent) | User's own declared purpose + `RespValAdd` mc code | Real |
| 29 | Recipient Account Timeline Visualization | H | Post-decision (MCP, rendering) | Mock CBS data, rendered as a real UI component | Simulated data, real UI |
| 30 | One-Tap Real Bank Verification Helpline | H | Post-decision (MCP) | Static official helpline directory | Real |
| 32 | Cross-App Smurfing Detection | I | 2 | Requires correlation across ≥2 real PSPs (NPCI-native or multi-partner) | Conceptual (staged with 2 simulated PSP instances for demo) |
| 33 | Real-Time Campaign Detection & Nationwide Kill-Switch | I | 2 | Requires NPCI-native deployment | Conceptual (scripted NPCI Ops Dashboard demo only) |
| 34 | Public Scam Score Lookup (Web/API) | I | Standalone | Reputation DB — same one backing feature #11 | Real, standalone (no bank dependency at all) |
| 35 | Post-Hold Escalation Detection | J | Background watcher | Local Ledger DB — tracks the payer's own post-hold transactions | Real |
| 36 | Intervention Effectiveness Tracking | J | Background/analytics | Audit log — which intervention shown, whether user proceeded/aborted | Real logic, synthetic volume in demo |

## Summary by label

- **Real (12 features):** #3, #4, #6, #9, #10, #14, #15, #16, #17, #26, #27, #30, #34, #35, #36 — genuinely buildable, zero privileged access required. *(Note: this is 15, not 12 — corrected count below.)*
- **Real, fully counted: 15 features** — #3, #4, #6, #9, #10, #14, #15, #16, #17, #26, #27, #30, #34, #35, #36.
- **Simulated (9 features):** #1, #2, #7, #11, #18, #19, #20, #21, #29 — real algorithms, mock data standing in for infrastructure we don't have.
- **Conceptual (9 features):** #5, #8, #12, #13, #22, #23, #24, #32, #33 — staged/scripted only, require NPCI-native deployment or a government MoU.

This 15/9/9 split is exactly the honest story to open the demo with: **almost half the feature set is already real today**, a third is real logic waiting on infrastructure access, and the remainder is explicitly the pitch for why NPCI should run this centrally.

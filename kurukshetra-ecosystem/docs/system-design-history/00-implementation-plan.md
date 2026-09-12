# Kurukshetra — Integration & Implementation Plan
## Connecting the Intelligence Layer to NPCI/UPI, Bank CBS, Card Networks, and NetBanking

This document answers the concrete "how does this actually plug in" question left open by `fresh_base.md`. It is split into: (1) a reality check on what "MCP" and "sitting inside NPCI's switch" can and cannot mean, (2) the actual integration points that exist in Indian payment rails today, (3) a phased architecture for each rail (UPI, NetBanking, Cards), and (4) a build sequence.

---

## 0. Reality Check — What You Can and Cannot Do

Before the architecture, three hard constraints that shape every decision below:

1. **NPCI's switch is a closed financial network.** It speaks ISO 8583 / NPCI-XML over dedicated leased-line/VPN links to onboarded members only (banks + certified PSPs/TSPs). You cannot "deploy into" the NPCI switch as a startup. The only ways in are:
   - Become a **Third-Party Application Provider (TPAP)** or **Technology Service Provider (TSP)** partnered with a **sponsor bank/PSP**, and ride their existing NPCI membership.
   - Sell your risk engine **as a vendor product to a bank or PSP**, who calls you from *their* side of the NPCI connection (this is how existing fraud vendors — FRM/AI vendors like ACI, Bureau, Razorpay Thirdwatch-style products — actually operate today).
   - Partner with NPCI directly under their **Fraud & Risk Management (FRM) framework** (NPCI already mandates every PSP run an FRM system; you position Kurukshetra as a plug-in FRM scoring service certified against NPCI's FRM API spec).
   There is no fourth path where a startup injects itself into the switch itself.

2. **"MCP" in your diagram ≠ Anthropic's Model Context Protocol as a wire protocol NPCI speaks.** NPCI/banks do not and will not adopt MCP (an LLM tool-calling protocol) as a payments rail. What you *can* legitimately do is use **MCP internally** as the way your own risk-and-coaching AI agents call your own tools (VPA lookup tool, CBS graph tool, I4C registry tool, telecom tool, cross-app correlation tool). MCP is your **internal orchestration layer for the LLM-driven coaching/decisioning agents**, not the bank-facing integration protocol. The bank-facing protocol is ISO 8583 / NPCI-XML / REST-JSON APIs exposed by the PSP's existing infrastructure. Keep these two clearly separate in every deck/plan — reviewers who know banking will otherwise flag this as a fatal misunderstanding.

3. **You will never get direct access to CBS ledgers, Aadhaar/PAN records, or I4C's CFCFRMS database as a startup on day one.** These require RBI/NPCI/MeitY-level MoUs. The implementation plan below is staged so the product works and demos convincingly on synthetic/sandbox data now, and is architected so each real integration slots in later without a rewrite.

---

## 0.5 Pitch Framing — Who Actually Deploys This

NPCI is not a government department, but it is the **single, RBI-promoted, not-for-profit body that exclusively operates the UPI/IMPS/RuPay/NACH switch** — every bank and PSP in India connects through it, and it already mandates that every member run a Fraud Risk Management (FRM) system. That combination — sole chokepoint + existing FRM mandate — is exactly why the **primary pitch target is NPCI itself, not individual banks.**

This matters because a whole class of features in `fresh_base.md` (Category D: cross-victim correlation, Category I: cross-app smurfing + nationwide kill-switch, and the verification fan-in metric) are **only real if one system sees `ReqValAdd`/`ReqPay` traffic from every PSP at once.** No single bank or PSP can ever build these correctly — they'd only see their own slice. NPCI is the only entity structurally positioned to run them. So the pitch is not "please let us bolt onto your switch," it is:

> **"Kurukshetra is a reference implementation / PoC of what NPCI's next-generation, centralized FRM layer should look like. We are proposing it as infrastructure NPCI operates natively inside the switch, not as a third-party plugin banks each integrate separately."**

Two deployment models follow from this, and you should present both, in this order:

- **Model A — NPCI-Native (the pitch, the end-state):** Kurukshetra's scoring engine runs *inside* NPCI's own switch infrastructure, invoked on every `ReqValAdd`/`ReqPay` from every member bank/PSP in one place. This is what unlocks the cross-victim/cross-app/kill-switch features for real, and it's the version worth putting on the cover slide.
- **Model B — PSP/Bank-Embedded (the proof, the interim path):** A sidecar inside one sponsor bank's or PSP's existing switch adapter (detailed in Section 1 below). This is how you'd actually build and demo a working pilot *before* NPCI adoption — it proves the scoring engine and intervention UX work, using real (or realistic sandbox) traffic from one member, while being explicit that the cross-entity features are simulated/limited until Model A exists.

Framed this way, the roadmap in Section 5 reads correctly: Phase 1 (synthetic simulator) and Phase 2 (single-partner pilot) are you *proving Model B works* as evidence to bring to NPCI; Phase 3 is NPCI adopting or sanctioning Model A. You are not asking NPCI to bless a startup's side-integration — you are handing them a working reference design for infrastructure they already have a mandate to run.

---

## 1. Where Kurukshetra Physically Sits (Realistic Topology)

*(This section describes Model B — the bank/PSP-embedded pilot topology used to build and prove the engine before NPCI-native adoption. See §0.5 for Model A, the NPCI-native end-state that is the actual pitch.)*

```
┌────────────┐      ┌──────────────────────┐      ┌───────────────────┐      ┌─────────────┐
│  UPI App    │◄────►│  Sponsor Bank / PSP   │◄────►│   NPCI UPI Switch  │◄────►│ Beneficiary │
│ (GPay/PhonePe│      │  Switch (existing)    │      │  (ISO 8583/NPCI-XML)│      │ Bank / PSP  │
│  /Paytm/BHIM)│      │                       │      └───────────────────┘      └─────────────┘
└────────────┘      │  ┌─────────────────┐  │
                     │  │  Kurukshetra    │  │   <-- deployed HERE: inside the PSP's/bank's
                     │  │  Risk Engine    │  │       existing FRM hook point, not inside NPCI
                     │  │  (gRPC/REST     │  │
                     │  │   sidecar)      │  │
                     │  └─────────────────┘  │
                     └──────────────────────┘
```

- Kurukshetra is a **sidecar/plugin service inside the PSP's or bank's switch layer**, invoked synchronously at two hook points the PSP already has: the outbound `ReqValAdd` call and the outbound `ReqPay` call, both of which the PSP itself originates toward NPCI. You intercept **your partner's own outbound calls**, not NPCI's internals.
- This means **the pilot/GTM strategy is "sell to one PSP or one bank first"**, not "connect to NPCI." NPCI only enters the picture once you're embedded inside a member's infrastructure and (optionally) later certified under NPCI's FRM API spec for cross-member signal sharing (this is what makes Category D and I features — cross-victim correlation, cross-app smurfing, kill-switch — possible; they require NPCI or a consortium to broker cross-PSP data, which is a multi-year regulatory play, not a v1 feature).

---

## 2. Integration Point by Integration Point

### 2.1 UPI Rail (the whole current `fresh_base.md` scope)

| Hook | Where it lives today | How Kurukshetra attaches |
|---|---|---|
| `ReqValAdd` / `RespValAdd` | PSP's UPI adapter, calling NPCI's Mapper/Switch | PSP calls `POST /kurukshetra/v1/score-vpa` synchronously between receiving `RespValAdd` and rendering it to the user. Budget: 45ms P99, fail-open. |
| `ReqPay` pre-flight | PSP's app backend, before invoking NPCI's PIN/settlement flow | PSP calls `POST /kurukshetra/v1/score-transaction` with amount + sender history digest + recipient digest. Response is `ALLOW / STEP_UP / COACH / FREEZE` + reason codes, never raw PII. |
| CBS ledger signals (Category F, E) | Bank's Core Banking System (Finacle, TCS BaNCS, Flexcube, etc.) | Cannot query live CBS directly (regulatory + core-banking vendor restriction). Instead: bank runs a **nightly/streaming feature-export job** (Kafka CDC or batch ETL) that pushes de-identified account-level aggregates (residence time, sink ratio, KYC tier, account age bucket) into Kurukshetra's feature store. Kurukshetra never touches raw CBS. |
| I4C/1930 CFCFRMS (Category G-23) | MHA/I4C government system | Requires an MoU with I4C or routing through the bank's existing regulatory-reporting channel (banks already push/pull to CFCFRMS under RBI mandate). v1: stub with a manually-curated "reported VPA" list seeded from public 1930 helpline disclosures; v2: formal I4C API integration once government MoU exists. |
| TRAI CNAP / Sanchar Saathi (Category G-24) | DoT/TRAI system | CNAP is being rolled out via telecom operators, not a public API. v1: accept caller-number metadata **only when the user voluntarily enters it** (never auto-captured — this preserves the zero-surveillance boundary); check against TRAI's published DND/spam complaint bulk data and DoT's public fraud-SIM disclosures where available. |
| NPCI Central Mapper (Category B-5) | NPCI's mobile-to-VPA registry | Only NPCI or a PSP with Mapper query rights can look this up. Ship this as a **PSP-side API call** your sidecar makes using the PSP's own existing Mapper credentials — you never hold Mapper credentials yourself. |
| Interbank graph (Category B-8, G-21) | Doesn't exist as a single graph anywhere today | This is the hardest one — no single entity has cross-bank transaction graphs. Two paths: (a) build it incrementally from **your own partner banks' outbound transaction logs only** (a partial graph, labeled honestly as partial-coverage), or (b) advocate for this becoming an NPCI-hosted shared service (this is genuinely a multi-year, regulator-brokered feature — flag it in the roadmap as "Phase 3, contingent on NPCI/RBI consortium buy-in," not a v1 deliverable). |

### 2.2 NetBanking Rail

NetBanking transactions (NEFT/RTGS/IMPS initiated from a browser/app, not UPI) go through the bank's **Internet Banking (IB) gateway**, not NPCI's UPI switch. Integration path:
1. Bank's IB gateway already has a **pre-debit confirmation screen** ("You are transferring ₹X to account Y, IFSC Z — Confirm"). Kurukshetra hooks in exactly there via a server-side call from the IB backend, symmetric to the `ReqPay` pre-flight hook on UPI.
2. Beneficiary-add flow (adding a new payee before first NEFT/RTGS) is the NetBanking equivalent of `ReqValAdd` — same VPA-resolution-intelligence logic applies, keyed on account number + IFSC instead of VPA.
3. IMPS transfers settle near-instantly like UPI, so the same latency budget (45ms fail-open) applies; NEFT/RTGS have batch/multi-hour settlement windows, so for those the **Post-Payment cooling-off / hold mechanisms have far more room to operate** (you can hold an NEFT batch item for the full regulatory window without any UX cost, unlike UPI/IMPS which is instant).
4. Feature reuse: ~90% of the recipient-forensics features (Categories F, G) work unchanged since they key off the beneficiary account, not the payment rail. Only the QR/deep-link features (Category C) are UPI-specific and don't apply to NetBanking.

### 2.3 Card Rail (Debit/Credit/RuPay/Visa/Mastercard)

Cards are architecturally different: authorization runs over **ISO 8583** through the **card network** (RuPay/NPCI, Visa, Mastercard) to the **issuer's authorization host**, typically in under 200ms end-to-end, with far less room for added latency than UPI's already-tight budget.

1. **Card-Present / POS / ATM:** Out of scope for a first version — no user-facing app moment to intervene in (a swipe/tap has no "confirm screen"). Kurukshetra's role here is passive: issuer-side risk scoring feeding the issuer's existing Fraud Risk Management (FRM) engine, contributing a risk field the issuer can use to trigger step-up (OTP) rather than blocking outright.
2. **Card-Not-Present / eCommerce (3D Secure flow):** This *does* have a UX moment — the ACS (Access Control Server) OTP/challenge page during checkout. Kurukshetra integrates as a **risk-scoring input to the issuer's ACS**, following the same `ALLOW/STEP_UP/COACH/FREEZE` contract, injected via the standard **EMV 3-D Secure 2.x Risk-Based Authentication (RBA) data fields** that issuers already consume. This is the realistic card integration point — you feed a score into an existing decision engine, you don't intercept the ISO 8583 message yourself.
3. **UPI-linked RuPay Credit Card on UPI:** Since RuPay credit cards route through the UPI switch when used via UPI apps, this path is **already covered by the UPI integration in 2.1** — no separate work needed.
4. Scam-specific relevance: card rails see different fraud shapes than UPI (CNP fraud, card-testing, OTP phishing for card details) — categories 6 (value-spike anomaly), 14 (drip escalation), 21 (recipient/merchant graph analysis) port over conceptually to "merchant risk scoring" but need re-derivation against card scheme MCC data, not UPI `mc` codes. Treat this as a **separate model, sharing the same scoring service and intervention UI framework**, not a reuse of the UPI model's weights.

---

## 3. Internal Architecture — Where MCP Actually Fits

```
                    ┌───────────────────────────────────────────────────┐
                    │            KURUKSHETRA RISK ENGINE (per-PSP)        │
                    │                                                     │
  PSP hook  ───────►│  API Gateway (REST/gRPC, mTLS, <5ms)               │
  (ReqValAdd/        │        │                                          │
   ReqPay/NB/3DS)    │        ▼                                          │
                    │  Phase 0/1 Feature Assembly (deterministic, no LLM) │
                    │        │                                          │
                    │        ▼                                          │
                    │  LightGBM Calibrated Scorer  ──► risk_score, reasons│
                    │        │                                          │
                    │        ▼ (only if score ≥ COACH threshold)         │
                    │  ┌───────────────────────────────────────────┐    │
                    │  │   MCP HOST (internal orchestrator)          │    │
                    │  │   Agent picks an intervention template via  │    │
                    │  │   MCP tool calls to:                        │    │
                    │  │     - reason-code-explainer tool            │    │
                    │  │     - intervention-template-selector tool   │    │
                    │  │     - A/B routing tool (Category J-36)      │    │
                    │  │     - trusted-contact-notify tool (26)       │    │
                    │  └───────────────────────────────────────────┘    │
                    │        │                                          │
                    │        ▼                                          │
                    │  Response: {decision, reason_codes, ui_payload}    │
                    └───────────────────────────────────────────┘
```

- **Phase 0/1 (the hard-latency-budget path, <45ms)** is plain deterministic code + a small gradient-boosted model. No LLM, no MCP, no network hop beyond your own feature store. This is what actually has to hit NPCI's timing envelope.
- **MCP is used only in the intervention-authoring path**, which runs **after** the ALLOW/STEP_UP/COACH/FREEZE decision is already made and is rendering client-side UI — it has no latency constraint tied to the payment rail because the payment hasn't been authorized yet; the user is looking at a screen, not waiting on a network response. This is exactly why Category H (interventions) and Category J (learning/self-tuning) are the natural MCP-agent surface: an agent with tools for "fetch reason codes," "select template," "check trusted contact," "log outcome for A/B tracking" is a genuine multi-step tool-use loop, unlike the sub-45ms scoring path which must stay deterministic and boring.
- Each bank/PSP deployment runs its own instance of this engine inside their network boundary (or a VPC-peered instance you host under a data-processing agreement) — this satisfies both the latency requirement and the data-residency/RBI localization requirement (payment system data must stay in India and, per RBI, generally not leave the regulated entity's control without contractual safeguards).

---

## 4. Data Contracts (what crosses the PSP ↔ Kurukshetra boundary)

To keep the "zero surveillance" boundary defensible under audit, define the API contracts narrowly:

```jsonc
// POST /v1/score-vpa   (Event 1 — ReqValAdd)
{
  "vpa_hash": "sha256:...",           // never raw VPA in logs beyond TTL needed for scoring
  "resolved_name": "Manoj Kumar",     // from RespValAdd, needed for name-clash check
  "merchant_category_code": "0000",
  "handle_string": "cbi.clearance.cell@sbi", // needed only for regex/authority check
  "requesting_psp": "psp_id_123",
  "declared_purpose": null             // populated only if user already declared it
}
// -> { "decision": "COACH", "risk_score": 0.78, "reason_codes": ["AUTHORITY_HANDLE_MISMATCH","NAME_CLASH"] }
```

```jsonc
// POST /v1/score-transaction  (Event 2 — ReqPay pre-flight)
{
  "sender_id_hash": "sha256:...",
  "amount": 55000,
  "recipient_vpa_hash": "sha256:...",
  "sender_new_beneficiary_stats": {"median": 450, "stddev": 120, "count_90d": 340},
  "recipient_signals_ref": "feature_store_key_abc" // pre-fetched in Phase 0
}
// -> { "decision": "STEP_UP", "risk_score": 0.61, "reason_codes": ["VALUE_SPIKE_ZSCORE_4_5"] }
```

Only hashes, aggregates, and reason codes cross the wire and get logged — never raw VPAs/account numbers/phone numbers in the persistent audit store (the Merkle-tree WORM audit log mentioned in Phase 2 hashes these, it doesn't store them in clear text).

---

## 5. Phased Build Sequence

**Phase 1 — Standalone Simulator (0–2 months, what you can build today with zero external MoUs)**
- Build the full scoring engine + MCP intervention layer against a **synthetic UPI switch simulator** you write yourself (mock `ReqValAdd`/`ReqPay`/`RespValAdd` following NPCI's published UPI API spec structure) plus a synthetic CBS feature generator.
- All 33 features are implementable and demoable end-to-end on synthetic data — this is your hackathon/demo deliverable and does not require any bank partnership.
- Public Scam Score Lookup (Category I-34) can go live for real today as a standalone web tool seeded from public/scraped fraud-report data (e.g., publicly shared 1930 complaint VPAs, community reports you crowdsource) — this is the one feature with no bank dependency at all and the best early credibility signal.

**Phase 2 — Single PSP/Bank Pilot (2–6 months, requires one partner)**
- Integrate as a sidecar inside one sponsor bank's or one licensed PSP's existing UPI switch adapter, using their real `ReqValAdd`/`ReqPay` hooks and a CBS feature-export pipeline (batch, not live query).
- NetBanking hook added in parallel since it reuses ~90% of the same recipient-forensics code against the bank's IB gateway.
- Community reports (Category D-11) and cross-app smurfing (I-32) are **fake at this stage unless you have 2+ partner PSPs** — with one partner you can only see one app's leg of a smurfing attempt. Be explicit in any pitch that these features activate at 2+ partners.

**Phase 3 — Multi-PSP / NPCI FRM Certification (6–18 months)**
- Formal application to NPCI's FRM framework to become a certified shared-signal contributor, unlocking true cross-PSP correlation (Category D, I) and the kill-switch (I-33), which fundamentally require a broker above individual PSPs — this is NPCI's role, not something a single vendor can fake convincingly beyond 2-3 partners.
- I4C/CFCFRMS and TRAI/Sanchar Saathi real API integration pursued via MHA/DoT MoU in parallel — realistically the longest pole, government-timeline-dependent.
- Card-rail integration (3DS RBA scoring) as a second product line, sold to issuers separately from the UPI/PSP product.

---

## 6. Summary of Honest Constraints to Carry Into Any Pitch/Demo

1. You integrate **through** a bank/PSP's existing NPCI membership, never **into** NPCI itself as a standalone entity.
2. "MCP" is your internal AI-agent orchestration layer for interventions/coaching, not a protocol NPCI or banks will ever speak on the wire.
3. Cross-victim, cross-app, and kill-switch features (Categories D, I) require either NPCI as a broker or 2+ signed partners — they cannot be genuinely demonstrated with one bank's data alone.
4. Government registry integrations (I4C, TRAI) are MoU-gated and are the correct things to roadmap as "Phase 3," not promise as day-one features.
5. Card and NetBanking rails are extensions of the same scoring core but attach at different technical hook points (3DS RBA for cards, IB gateway confirm-screen for NetBanking) — plan them as parallel workstreams sharing the Phase 0/1 engine, not a UPI-only build.

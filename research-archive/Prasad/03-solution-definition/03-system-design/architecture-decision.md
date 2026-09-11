# Architecture Decision Record (ADR-001): Selection of Federated Dual-Path Tiered Triage Architecture

---

## 1. Metadata
- **ADR Identifier:** ADR-001
- **Title:** Selection of Federated Dual-Path Tiered Triage Architecture for Real-Time Scam Interception
- **Status:** **ACCEPTED & LOCKED**
- **Date:** 2026-09-11
- **Deciders:** Principal Architect, Security Lead, ML Systems Lead, Product Engineering Lead
- **Technical Horizon:** Phase 3 System Design & Phase 4 Implementation

---

## 2. Context and Problem Statement
The Indian digital payments ecosystem processes over 500 million daily UPI transactions with sub-two-second end-to-end settlement and peak surges exceeding 25,000 TPS. Within this environment, Authorized Push Payment (APP) scams (Digital Arrest, fake utility threats, investment funnels) inflict over ₹1,750 Crore in annual consumer losses because authentic remitters willingly authorize transfers under acute psychological manipulation.

The architectural challenge requires reconciling three seemingly irreconcilable constraints:
1. **The Latency Constraint:** Hot-path risk evaluation must complete in $\le 15\text{ms}$ to prevent switch timeouts (`U30`).
2. **The Intelligence Constraint:** Detecting complex extortion scripts and institutional impersonation requires deep semantic language comprehension and abductive hypothesis testing (which takes 800ms–2,500ms).
3. **The Regulatory & Privacy Constraint:** Under the DPDP Act 2023, systems cannot scrape private messaging apps (WhatsApp/SMS) or exfiltrate raw biometric sensor data to cloud servers.

---

## 3. Decision
We formally select **Option 3: The Federated Dual-Path Tiered Triage Architecture** as the definitive system architecture for GuardianPay (PS09).

```
                      THE FEDERATED DUAL-PATH DECISION
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. CLIENT-SIDE ENCLAVE (Native Android/iOS TPAP SDK):                       │
  │    • Captures zero-privilege OS sensor telemetry (Call state, dwell time)   │
  │    • Enforces local deterministic blocks (AnyDesk detection in < 1ms)       │
  │    • Renders dynamic cognitive challenge modals over the checkout UI        │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 2. EDGE RISK GATEWAY (High-Throughput Go Microservices):                    │
  │    • Ingests telemetry digests; evaluates LightGBM C++ models in < 8ms       │
  │    • Clears 99.5% of safe transactions immediately (Hot Path: TIER_0_PASS)  │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 3. WARM-PATH AGENTIC ENCLAVE (Selective Python/FastAPI Microservice):       │
  │    • Invoked strictly for ambiguous cases (0.20 <= P <= 0.85; 0.5% volume)  │
  │    • Executes during the human Pre-PIN review dwell window (1.5s - 2.5s)    │
  │    • Resolves CBS legal names via `RespValAdd` and tests competing hyp.     │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │ 4. DETERMINISTIC POLICY ENGINE & WORM AUDIT VAULT:                          │
  │    • Fuses risk telemetry against amount-scaled threshold curves            │
  │    • Emits ECDSA-signed directives to client; logs immutable dossiers to S3 │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rationale for Selecting Option 3

1. **Resolves the Latency Paradox:** By enforcing a strict tiered triage, 99.5% of transactions bypass the agent entirely, experiencing sub-10ms latency. The 0.5% of transactions requiring deep investigation execute during the user's natural Pre-PIN dwell window (1.5s–4.0s).
2. **Superior Compute Economics:** Evaluating 100% of transactions with an LLM costs $\$1.825\text{ Billion}$ annually. Routing only 0.5% of ambiguous cases brings annual compute costs below $\$10\text{ Million}$, easily absorbed by tier-1 banking fraud operations budgets.
3. **Total Privacy Compliance (DPDP Act 2023):** Micro-behavioral sensor telemetry is processed strictly on-device in transient RAM and discarded immediately. Zero raw biometric curves leave the physical phone.
4. **Decisive Recipient Verification (`RespValAdd`):** Leverages native UPI core banking legal name lookups to catch fresh mule accounts on Day 1, Transaction 1, eliminating reliance on stale blacklists.
5. **Cryptographic Tamper Resistance:** Directives transmitted from the gateway to the client SDK are signed using ECDSA P-256, preventing adversaries on rooted devices from overriding risk verdicts.

---

## 5. Explicit Rejection of Alternative Paradigms

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        RATIONALE FOR REJECTING ALTERNATIVES                               │
├─────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ REJECTED PARADIGM   │ FATAL DEFECT CAUSING FORMAL REJECTION                               │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Monolithic LLM on │ Breaches 2,000ms switch SLA; annual cloud cost > $1.5B; causes      │
│   Hot Switch Path** │ catastrophic switch drops (`U30`); non-deterministic legal liability│
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Option 1: Pure    │ Crippled on budget Indian Android smartphones ($80 MediaTek chipsets│
│   Client SDK Only** │ struggle with on-device LLMs); zero cross-bank mule graph visibility│
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Option 2: Pure    │ Client is treated as untrusted dummy; misses rich client-side       │
│   Gateway Only**    │ sensor telemetry; fails completely if network drops                 │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Private Messaging │ Illegal wiretapping under Indian Telegraph Act 1885 and DPDP Act    │
│   Scraping Engine** │ 2023; causes immediate removal from Google Play Developer Store     │
└─────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Consequences, Tradeoffs, and Mitigations

### Positive Consequences
- Real-time protection against previously undetectable Authorized Push Payment scams.
- Sub-15ms execution for 99.5% of volume; zero friction on safe daily commerce.
- Full compliance with RBI Digital Payment Security Directions and DPDP Act 2023.

### Negative Consequences & Architectural Tradeoffs
- **Cross-Repository Coordination:** Requires maintaining both a native mobile client SDK (Android Kotlin) and a high-performance backend risk gateway (Go/Python).
  - *Mitigation:* Define rigid, versioned Protocol Buffer / JSON API contracts with automated integration tests.
- **Dependency on Pre-PIN Dwell Window:** Relies on users naturally spending 1.5s–3.5s reviewing the confirmation screen.
  - *Mitigation:* For rapid habitual users, the SDK introduces an artificial micro-pause if the hot-path score enters the ambiguous corridor.

---

## 7. Assumptions
1. **[Engineering Assumption 1]:** The hosting TPAP application permits the Guardian SDK to register lifecycle hooks immediately prior to launching the NPCI Common Library activity.
2. **[Engineering Assumption 2]:** NPCI `RespValAdd` APIs return Core Banking legal KYC names within an average network latency of $<150\text{ms}$.
3. **[Engineering Assumption 3]:** Android `TelephonyManager` continues to expose `CALL_STATE_OFFHOOK` to foreground financial applications without requiring high-risk telephony permissions.

---

## 8. Epistemic Milestone
ADR-001 locks the system architecture. All subsequent system designs, component specifications, and data models in Phase 3 will elaborate this chosen federated topology. Zero further debate on monolithic LLM gatekeepers will be entertained.

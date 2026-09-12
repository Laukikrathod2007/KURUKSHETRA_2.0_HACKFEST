# 02 — Transaction Lifecycle (Data Flow + Action Flow)

## UPI lifecycle — the primary flow

```
1. Recipient selected in Mock PSP App
        │
        ▼
2. Mock PSP App → Mock NPCI Switch: ReqValAdd(payer_vpa, beneficiary_ref)
        │
        ▼
3. Mock NPCI Switch resolves the name → RespValAdd(resolved_name, mc_code)
        │  (this resolution is itself simulated — in production it's the real NPCI Mapper)
        ▼
4. Mock PSP App → Kurukshetra Risk Engine: POST /v1/score-vpa   [EVENT 1]
        │
        ▼
5. TIER 0 (in-memory, <10ms, always runs):
   ├─ Known-beneficiary lookup (Local Ledger DB — has THIS payer paid THIS beneficiary before?)
   ├─ VPA authority-keyword regex check (feature #4)
   ├─ Beneficiary name-clash check against resolved_name + mc_code (feature #3)
   └─ Decision gate:
        IF known beneficiary AND nothing fired → return ALLOW, STOP HERE (no Tier 1)
        ELSE → escalate to Tier 1, run concurrently while user is shown the resolved name
        │
        ▼
6. TIER 1 (target <45ms, runs only on escalation):
   ├─ Verify-to-Abandon Ratio, Resolution Burst Detection (features #1, #2 — PSP-local proxy)
   ├─ Recipient account forensics via Mock CBS (features #7, #18, #19, #20, #21)
   ├─ Reputation/community report lookup (feature #11)
   ├─ QR/link forensics if this VPA arrived via a scanned QR or deep link (features #9, #10)
   └─ (Tier 2 signals, if any, are fetched but weighted as Conceptual evidence only — see 03-feature-tier-map.md)
        │
        ▼
7. Kurukshetra returns RiskDecision (see 06-canonical-contracts.md) to Mock PSP App
        │
        ▼
8. Mock PSP App renders the resolved name + any Tier-0/1 warning inline (this is still EVENT 1's UI)
        │
        ▼
9. User enters an amount, taps "Pay"
        │
        ▼
10. Mock PSP App → Kurukshetra Risk Engine: POST /v1/score-transaction   [EVENT 2]
        │
        ▼
11. Amount-dependent detectors run (these need the amount, so they could not run at step 5-6):
    ├─ New-Beneficiary High-Value Outlier — Z-score vs LOCAL sender history (feature #6)
    ├─ Drip Scam Escalation, Threshold Evasion, Refund Reversal Scam (features #14, #15, #16 — local ledger, genuinely real)
    ├─ UPI Collect Request Abuse, if this is an incoming collect request (feature #17)
    └─ Purpose Declaration Contradiction, if the user has declared a purpose (feature #27)
        │
        ▼
12. Scoring engine combines ALL evidence gathered across steps 5, 6, and 11 into one risk_score + decision
        │
        ▼
13. Decision routing:
    ALLOW      → proceed straight to Mock NPCI Switch's PIN screen. Kurukshetra is never called again for this transaction.
    STEP_UP    → Mock PSP App shows a lightweight "confirm details" screen (2-3s), then proceeds to PIN.
    COACH      → MCP Host is invoked (see 05-mcp-architecture.md) to select and render an intervention screen (Category H
                 features), require explicit acknowledgment, THEN proceed to PIN if the user still chooses to.
    FREEZE     → hard block. Mock NPCI Switch's PIN screen is never reached. No acknowledgment can bypass this.
        │
        ▼
14. If the user proceeds: Mock PSP App → Mock NPCI Switch handles PIN validation and settlement.
    Kurukshetra NEVER sees the PIN and is not in this step's call path at all.
        │
        ▼
15. PHASE 2 — asynchronous, off the critical path, fires regardless of the decision:
    ├─ Append-only audit log write (hash-chained, includes risk_score, decision, evidence, NOT raw PII)
    ├─ Post-Hold Escalation Detection watcher registered if decision was COACH/FREEZE with a cooling-off hold (feature #35)
    └─ Intervention Effectiveness Tracking — logs which intervention template was shown and whether the user
       proceeded or aborted, for feature #36's A/B analysis
```

## The circuit breaker and fallback contract

The 45ms P99 budget from `fresh_base.md` is enforced as a hard timeout around steps 5–12. Two distinct failure modes, handled differently (this fallback contract is the gap the architecture council explicitly flagged as missing from the original spec):

- **Timeout with a KNOWN beneficiary:** Tier 0 already returned ALLOW before Tier 1 was even invoked in the common case — this failure mode barely matters here, since Tier 1 for known beneficiaries is best-effort/logged-only, not decision-blocking.
- **Timeout or missing data source with a NEW beneficiary:** the missing signal is **not treated as "safe"**. The circuit breaker trips to a pre-declared floor of **STEP_UP**, never straight to ALLOW, whenever the beneficiary is new and any Tier 1 data source needed for a real decision was unavailable. This preserves the original "legitimate transactions are never blocked by latency" principle (the user still gets through, just with one extra confirmation step) while closing the adversarial gap the council identified: an attacker cannot get a free ALLOW on a brand-new mule account simply by causing the CBS mock (or, in production, the real CBS feed) to time out.

## Card lifecycle (Card-Not-Present / 3-D Secure)

```
1. Checkout initiated on a merchant site → issuer's ACS (Access Control Server) challenge triggered
        │
        ▼
2. ACS → Kurukshetra Risk Engine: POST /v1/score-transaction  (payment_method = "CARD_CNP")
        │  reuses the SAME Tier 0/1 core and scoring engine — only the adapter differs
        ▼
3. Kurukshetra returns a risk_score consumed as an EMV 3DS2 Risk-Based-Authentication (RBA) signal
        │
        ▼
4. ACS decides: frictionless pass, OTP challenge, or decline — Kurukshetra informs this decision,
   it does not make the final authorization call (that stays with the issuer's ACS/authorization host)
```
Card-present (POS/ATM) has no interceptable UX moment and is out of scope — see `IMPLEMENTATION_PLAN.md` §2.3.

## NetBanking lifecycle

```
1. User adds a new payee in NetBanking → equivalent of ReqValAdd (Tier 0 + Tier 1 recipient forensics apply unchanged)
        │
        ▼
2. User confirms a NEFT/RTGS/IMPS transfer → equivalent of ReqPay pre-flight (amount-dependent detectors apply unchanged)
        │
        ▼
3. IMPS settles near-instantly → same 45ms budget as UPI applies.
   NEFT/RTGS settle in batches → the cooling-off hold mechanisms (Category H, feature #35) have
   far more room to operate here with zero UX cost, since the transfer wasn't going to clear instantly anyway.
```
~90% of the recipient-forensics logic (Tier 1) is shared unchanged between UPI and NetBanking — only the adapter translating VPA↔account-number/IFSC differs.

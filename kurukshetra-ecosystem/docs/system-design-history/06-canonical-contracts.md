# 06 — Canonical Input/Output Contracts

## Input contract: `TransactionAnalysisRequest`

```jsonc
{
  "event": "VPA_RESOLUTION",              // "VPA_RESOLUTION" (Event 1) | "PAYMENT_PREFLIGHT" (Event 2)
  "transaction_id": "txn_8f2a...",
  "payment_method": "UPI",                // "UPI" | "CARD_CNP" | "NETBANKING"

  "payer_context": {
    "payer_id_hash": "sha256:...",        // never the raw phone/account number
    "app_local_history_ref": "ledger_key_abc"   // pointer into Local Ledger DB, not inline history
  },

  "recipient_context": {
    "beneficiary_ref_hash": "sha256:...", // hashed VPA or account+IFSC
    "resolved_name": "Manoj Kumar",       // from RespValAdd — needed for name-clash check
    "mc_code": "0000",
    "raw_handle_string": "cbi.clearance.cell@sbi",  // needed only for the regex/authority check
    "declared_purpose": null              // populated only if the user has already declared it
  },

  "transaction": {
    "amount": 55000,                      // present only on PAYMENT_PREFLIGHT
    "currency": "INR",
    "type": "P2P"                         // "P2P" | "P2M" | "COLLECT_REQUEST"
  },

  "provenance": {
    "arrived_via": "MANUAL_ENTRY",        // "MANUAL_ENTRY" | "QR_SCAN" | "DEEP_LINK"
    "raw_uri": null                       // populated only for QR_SCAN / DEEP_LINK, parsed by Tier 0
  }
}
```

**Required fields:** `event`, `transaction_id`, `payment_method`, `payer_context.payer_id_hash`, `recipient_context.beneficiary_ref_hash`.
**Optional fields:** `transaction.amount` (absent on Event 1), `recipient_context.declared_purpose`, `provenance.raw_uri`.
**Sensitive fields, always hashed before this object is constructed:** payer identifier, beneficiary identifier. Raw values never enter this schema.
**Derived fields (computed by the engine, not sent by the caller):** none — this is the request shape, computed values live in the response.
**Fields that must NEVER be passed, under any circumstance:** UPI PIN, OTP, banking password, card CVV, any authentication credential. This is enforced by the Mock PSP App's client library not exposing a field for them at all — there is no field to accidentally populate.

## Output contract: `RiskDecision`

```jsonc
{
  "transaction_id": "txn_8f2a...",
  "risk_score": 0.78,
  "confidence": 0.9,                      // engine's confidence in this score, given data completeness
  "risk_zone": "COACH",                   // "ALLOW" | "STEP_UP" | "COACH" | "FREEZE"
  "decision": "REQUIRE_ACKNOWLEDGMENT",   // the concrete action the client must take
  "data_completeness": "PARTIAL",         // "FULL" | "PARTIAL" | "DEGRADED" — see fallback contract in 02-transaction-lifecycle.md
  "tier_reached": 1,                      // 0, 1, or 2 — how far escalation went
  "checks_executed": ["known_beneficiary_lookup", "name_clash_check", "cbs_sink_ratio", "reputation_lookup"],
  "signals": [
    {
      "feature_id": 3,
      "feature_name": "Beneficiary Name vs. Claimed Identity",
      "label": "REAL",
      "triggered": true,
      "risk_contribution": 0.35,
      "severity": "HIGH",
      "evidence": { "resolved_name": "Manoj Kumar", "declared_purpose": "GOVT_FINE", "mc_code": "0000" },
      "explanation_code": "AUTHORITY_HANDLE_INDIVIDUAL_ACCOUNT_MISMATCH"
    }
  ],
  "reasons": ["AUTHORITY_HANDLE_INDIVIDUAL_ACCOUNT_MISMATCH", "COMMUNITY_REPORTS_ABOVE_THRESHOLD"],
  "recommended_action": "SHOW_PURPOSE_CONTRADICTION_SCREEN",
  "audit_ref": "audit_seq_918234"
}
```

**Per-signal contract** (each entry in `signals`), matching the brief's requested schema exactly:
- `identifier` → `feature_id` + `feature_name`
- `triggered / not triggered` → `triggered`
- `risk contribution` → `risk_contribution`
- `confidence` → rolled up into the top-level `confidence`, since per-signal confidence in a deterministic rule system collapses to "did we have the data" (see `data_completeness`)
- `severity` → `severity`
- `evidence` → `evidence`
- `explanation` → `explanation_code` (a stable code, not free text — free text is generated later by the MCP `explain_decision` tool, kept separate so the deterministic engine never emits unbounded strings)
- `recommended escalation` → rolled up into the top-level `tier_reached` / `recommended_action`

**Never included in this object:** raw payer/beneficiary identifiers, PIN/OTP/CVV, chain-of-thought or LLM reasoning traces (those exist only inside the MCP Host's internal process and are never persisted or returned to the client).

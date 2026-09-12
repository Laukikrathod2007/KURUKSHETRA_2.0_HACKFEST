# 04 — Infrastructure, Databases, and Mock Services

Every service below is built to the shape its real-world counterpart would have, so that replacing a mock with the real integration is a configuration/adapter change, not a rewrite. Each entry names the exact **seam** — the one thing that changes on the path to production.

## Databases

### 1. Local Ledger DB (Real)
**What it is:** the payer's own app-side transaction history — the thing a real UPI app (or its PSP backend) genuinely already has, and the honest answer to "does anyone have payer↔beneficiary history" from the architecture council.

**Schema (Postgres/SQLite):**
```sql
CREATE TABLE payers (payer_id TEXT PRIMARY KEY, display_name TEXT, created_at TIMESTAMP);

CREATE TABLE beneficiaries (
  beneficiary_ref TEXT PRIMARY KEY,   -- VPA or account+IFSC
  first_seen_at TIMESTAMP
);

CREATE TABLE payer_beneficiary_link (
  payer_id TEXT REFERENCES payers,
  beneficiary_ref TEXT REFERENCES beneficiaries,
  first_transaction_at TIMESTAMP,
  successful_transaction_count INT,
  PRIMARY KEY (payer_id, beneficiary_ref)
);

CREATE TABLE transactions (
  transaction_id TEXT PRIMARY KEY,
  payer_id TEXT, beneficiary_ref TEXT,
  amount NUMERIC, currency TEXT,
  initiated_at TIMESTAMP,
  decision TEXT,          -- ALLOW / STEP_UP / COACH / FREEZE
  held_until TIMESTAMP,   -- null unless a cooling-off hold was applied
  completed BOOLEAN
);
```
**Seam:** in production this table doesn't need to exist as a new system at all — it already exists inside the PSP's own app backend. Kurukshetra's Tier 0 query becomes a call into the PSP's existing user-transaction-history service instead of this local table.

### 2. Reputation / Community DB (Real logic, seeded data)
```sql
CREATE TABLE scam_reports (
  report_id TEXT PRIMARY KEY,
  target_ref TEXT,              -- VPA or account reference being reported
  reporter_identity_hash TEXT,  -- hashed, never raw
  reason_code TEXT,
  reported_at TIMESTAMP
);

CREATE TABLE reputation_scores (
  target_ref TEXT PRIMARY KEY,
  distinct_reporter_count INT,
  community_risk_score NUMERIC,
  last_updated_at TIMESTAMP
);
```
**Sybil-resistance rules (genuinely implemented, not mocked):**
- A `community_risk_score` only escalates once `distinct_reporter_count >= 3` (minimum-report threshold).
- One report per `reporter_identity_hash` per `target_ref` (rate-limited).
- Score decays over time if no new reports arrive (staleness handling) — halves every 14 days with no new corroborating report.

**Seam:** this is the one database that is architecturally identical whether deployed by a single PSP or by NPCI centrally — it just gets more valuable with more contributing PSPs. No seam change needed beyond scale.

### 3. Mock CBS Service (Simulated)
**What it stands in for:** a bank's Core Banking System (Finacle/BaNCS/Flexcube).
```sql
CREATE TABLE cbs_accounts (
  account_ref TEXT PRIMARY KEY,
  opened_at TIMESTAMP,
  kyc_tier TEXT,               -- 'FULL' / 'BASIC_OTP'
  account_type TEXT,           -- 'SAVINGS' / 'MERCHANT'
  mc_code TEXT,
  current_balance NUMERIC
);

CREATE TABLE cbs_ledger_entries (
  entry_id TEXT PRIMARY KEY,
  account_ref TEXT,
  direction TEXT,               -- 'CREDIT' / 'DEBIT'
  amount NUMERIC,
  counterparty_state TEXT,      -- geographic dispersion signal
  occurred_at TIMESTAMP
);
```
Seeded with synthetic account profiles matching the `fresh_base.md` scenarios (a 5-day-old account with 16 deposits from 7 states, a dormant account that suddenly bursts, etc.) so the Tier 1 forensics (#7, #18, #19, #20, #21) have realistic data to run real algorithms against.

**Seam:** in production, this is replaced by a **feature-export pipeline** (batch/streaming CDC) that the bank runs against its real CBS, pushing de-identified aggregates into the same schema — Kurukshetra never gets live raw CBS access even in production, per `IMPLEMENTATION_PLAN.md`.

### 4. Mock Government Registry (Conceptual)
```sql
CREATE TABLE registry_flags (
  target_ref TEXT PRIMARY KEY,
  flag_type TEXT,     -- 'I4C_CFCFRMS' / 'AADHAAR_PAN_FREEZE' / 'TRAI_SPAM'
  reference_id TEXT,
  flagged_at TIMESTAMP
);
```
Seeded with a small, clearly-fictional set of "known bad" identifiers used only to demonstrate the query shape. Every API response from this service carries `"label": "CONCEPTUAL"` in its payload — the Risk Engine surfaces this label all the way through to the audit log and the judge-facing panel, so it can never be silently presented as live.

**Seam:** requires an MoU with I4C/MeitY/TRAI/DoT (`IMPLEMENTATION_PLAN.md` Phase 3). No amount of engineering closes this seam — it is a regulatory dependency, not a technical one.

### 5. Audit Log (Real)
```sql
CREATE TABLE audit_entries (
  sequence_no BIGSERIAL PRIMARY KEY,
  transaction_id TEXT,
  prev_hash TEXT,
  entry_hash TEXT,          -- sha256(prev_hash + canonical_json(entry))
  decision TEXT,
  risk_score NUMERIC,
  evidence_json JSONB,      -- reason codes + tier provenance, NO raw PII
  written_at TIMESTAMP
);
```
Append-only (enforced by a database trigger that rejects UPDATE/DELETE). Each entry's hash chains to the previous one — a lightweight WORM (write-once-read-many) audit trail, matching the Merkle-tree concept in `fresh_base.md` without requiring a real blockchain.

## Mock services (as running processes)

| Service | Port (dev) | Role |
|---|---|---|
| `mock-npci-switch` | 8001 | Accepts `ReqValAdd`/`ReqPay`-shaped requests from the Mock PSP App, forwards to the Risk Engine, returns `RespValAdd`/decision |
| `mock-psp-app` | 8002 | The demo's "client" — a minimal UPI-app-shaped web client a user interacts with |
| `kurukshetra-engine` | 8000 | The actual product |
| `mock-cbs` | 8003 | Serves seeded CBS-shaped account/ledger data |
| `mock-registry` | 8004 | Serves seeded, clearly-labeled Conceptual registry flags |
| `mcp-server` | 8005 | MCP tool server for post-decision orchestration |
| `public-lookup` | 8006 | The real, standalone Public Scam Score Lookup — reads the same Reputation DB, no other dependency |

## Mock payment call sequence (concrete example)

```
POST http://mock-psp-app:8002/pay/initiate
  { "payer_id": "payer_42", "beneficiary_ref": "military.canteen.cctv@oksbi" }
       │
       ▼
mock-psp-app → POST http://mock-npci-switch:8001/ReqValAdd
  { "payer_vpa": "...", "beneficiary_ref": "military.canteen.cctv@oksbi" }
       │
       ▼
mock-npci-switch resolves via its own seeded directory → { "resolved_name": "Ramesh G", "mc_code": "0000" }
       │
       ▼
mock-npci-switch → POST http://kurukshetra-engine:8000/v1/score-vpa
  (canonical input contract — see 06-canonical-contracts.md)
       │
       ▼
kurukshetra-engine → queries local-ledger, (conditionally) mock-cbs, reputation-db
       │
       ▼
kurukshetra-engine → returns RiskDecision to mock-npci-switch
       │
       ▼
mock-npci-switch → returns RespValAdd + risk metadata to mock-psp-app
       │
       ▼
mock-psp-app renders the result in the Demo Frontend
```
Every hop in this chain is a plain HTTP/JSON call in the hackathon build — no message queue, no ISO 8583 binary framing — but the **field names and semantics** mirror NPCI's real UPI API spec closely enough that the seam to real integration is a serialization/transport change, not a logic change.

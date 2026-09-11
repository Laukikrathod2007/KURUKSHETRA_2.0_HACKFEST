# Software Requirements Specification (SRS)
## Project Kurukshetra — Agentic Guardian

Requirements are grouped by concern, each with an ID, a MoSCoW priority,
and a trace to a `ps.md` bullet and/or a differentiator (D1–D9, B1) from
[`00-overview.md`](./00-overview.md). "Must" = demoable core. "Should" =
bonus tier. Anything not listed here is out of scope per
`00-overview.md` §3.1 and §5.3.

---

## 1. Actors

| Actor | Description |
|---|---|
| **Payer (User)** | The person using the simulated payment app to send money. The primary actor for every scenario. |
| **Guardian Agent** | The system under specification — the combined deterministic + LLM reasoning pipeline sitting between the payer's "Pay" action and simulated settlement. |
| **Trusted Contact** (bonus only) | A simulated secondary party who can be notified/co-approve for a vulnerable-user, high-risk, low-confidence case (B1). |
| **Operator/Judge** | Anyone inspecting the audit history, evaluation harness, or red-team suite after the fact. |

---

## 2. Traceability Matrix (ps.md → Requirement → Differentiator)

| ps.md requirement | Requirement IDs | Differentiator |
|---|---|---|
| Payment simulation interface | FR-SIM-01…04 | — |
| Transaction-risk analysis | FR-RISK-01…05 | D8 |
| Rule-based and/or LLM-based reasoning | FR-RISK-01, FR-AGT-01…06 | D2, D5 |
| Recipient verification workflow | FR-REC-01…03 | D1 |
| Risk score/category | FR-RISK-04, FR-POL-01 | D8 |
| User confirmation step | FR-INT-01…04 | D3 |
| Pause/block mechanism | FR-POL-02…04 | D3, D5 |
| Explainable security alerts | FR-EXP-01…03 | D4 |
| Transaction audit history | FR-AUD-01…03 | D6 |
| "Normal / new-recipient / suspicious / high-risk" demo scenarios | FR-SIM-04, all of §7 in `07-demo-script.md` | — |
| Real-time security reasoning | NFR-PERF-01…02 | — |
| Fraud prevention | (emergent from FR-RISK + FR-AGT + FR-POL) | D1, D2 |
| Human-in-the-loop intervention | FR-INT-01…04, FR-HITL-01…02 | D3 |
| Explainability | FR-EXP-01…03 | D4 |
| Safe autonomous decision-making | FR-SAFE-01…04 | D5, D8, D9 |

---

## 3. Functional Requirements

### 3.1 Payment Simulation (FR-SIM)

- **FR-SIM-01 (Must):** The system shall provide a UI to compose a
  simulated payment: sender (fixed demo persona), recipient identifier
  (e.g. a VPA-like handle or name), amount, and a free-text payment
  note/memo.
- **FR-SIM-02 (Must):** The system shall maintain at least one persistent
  demo user profile with a synthetic transaction history (prior
  recipients, typical amounts, typical times) so that "unusual for this
  user" signals are meaningful, not hardcoded per scenario.
- **FR-SIM-03 (Must):** The system shall simulate, not execute, real money
  movement. No component may claim or imply a connection to a real bank,
  UPI, or NPCI system.
- **FR-SIM-04 (Must):** The system shall support loading pre-defined
  scenarios (see [`08-data-and-scenarios.md`](./08-data-and-scenarios.md))
  via a selector, for reliable, repeatable demonstration.

### 3.2 Transaction Risk Analysis (FR-RISK)

- **FR-RISK-01 (Must):** The system shall compute a deterministic,
  sub-second risk score for every submitted payment using a combination of
  rule checks and a trained tabular ML model (gradient-boosted trees),
  before any LLM call is made. This is the **hot path**.
- **FR-RISK-02 (Must):** The hot-path feature set shall include, at
  minimum: amount relative to the user's own history, recipient novelty
  (first-time payee), time-of-day/velocity anomaly, and a placeholder for
  entity–purpose consistency (populated by FR-REC-02 when available).
- **FR-RISK-03 (Must):** Hard deterministic overrides (e.g., a recipient
  on a simulated blocklist) shall bypass scoring and route directly to the
  most protective tier, regardless of any other signal.
- **FR-RISK-04 (Must):** The system shall map the risk score to a
  categorical tier (e.g., LOW / MEDIUM / HIGH / CRITICAL) using
  documented, inspectable thresholds — not a black-box cutoff. See
  [`04-risk-and-policy.md`](./04-risk-and-policy.md) §2.
- **FR-RISK-05 (Must):** The hot path alone shall be sufficient to handle
  the "normal payment" demo scenario with zero added friction — the
  system must not add visible delay or friction to transactions the
  deterministic layer is confident are benign.

### 3.3 Recipient Verification (FR-REC)

- **FR-REC-01 (Must):** The system shall resolve every recipient
  identifier against a mock recipient directory, returning a registered
  identity category (e.g., "individual/personal account," "registered
  utility biller," "registered merchant") distinct from the
  attacker-controlled display name or note.
- **FR-REC-02 (Must):** The system shall compare the payment's stated
  purpose (from the note, or an LLM-derived purpose classification) with
  the recipient's resolved identity category, and surface a
  **purpose–identity consistency signal** when they conflict (e.g., a note
  reading "electricity bill" paid to a personal individual account). This
  is D1, the project's primary differentiator.
- **FR-REC-03 (Must):** The system shall flag first-time recipients
  (never paid before by this user in the synthetic history) as a
  standalone signal, distinct from FR-REC-02.
- **FR-REC-04 (Should):** The system shall expose a recipient's simulated
  "account age" in the mock directory as an additional signal (newer
  accounts weighted more cautiously) — explicitly labeled as simulated
  data, not a real registry lookup.

### 3.4 Agentic Reasoning (FR-AGT)

- **FR-AGT-01 (Must):** For transactions in an ambiguous risk band (not
  confidently low, not confidently critical), the system shall invoke a
  bounded LLM-driven agent — the **warm path** — to reason over the
  payment note, the resolved recipient identity, and the user's history.
- **FR-AGT-02 (Must):** The agent shall be capable of conditionally
  selecting which of its available tools to call based on intermediate
  findings (e.g., only escalate to a deeper history check if an initial
  purpose–identity mismatch is found), not always execute a fixed sequence
  regardless of findings. See [`03-agent-and-tools.md`](./03-agent-and-tools.md)
  §3 for the exact conditional logic and the documented fallback if this
  proves unstable to build in time.
- **FR-AGT-03 (Must):** The agent shall classify, when applicable, the
  scam manipulation pattern present in the payment note (at minimum:
  urgency, secrecy/"don't tell anyone," authority impersonation) and a
  best-guess scam typology (e.g., tech-support scam, family-emergency
  scam, investment scam, government-impersonation scam).
- **FR-AGT-04 (Must):** The agent's output shall be a schema-validated
  structured object (scam typology, confidence, evidence list,
  recommended tier adjustment) — never free text consumed directly by the
  policy layer.
- **FR-AGT-05 (Must):** The agent shall operate under a hard timeout (see
  NFR-REL-02) and shall have no ability to read, write, or call anything
  beyond its declared read-only tool set (see
  [`03-agent-and-tools.md`](./03-agent-and-tools.md) §2).
- **FR-AGT-06 (Must):** The agent's recommended tier adjustment shall only
  ever be able to **increase** caution relative to the deterministic
  hot-path tier, never decrease it. This is enforced by the policy layer
  (FR-POL-04), not merely requested by the agent.

### 3.5 Policy & Intervention (FR-POL / FR-INT)

- **FR-POL-01 (Must):** A single policy component shall be the sole
  authority that maps a (hot-path tier, agent output, uncertainty) tuple
  to a final action: ALLOW, ADVISE, CHALLENGE, or PAUSE. No other
  component may emit a final action directly to the UI.
- **FR-POL-02 (Must):** PAUSE shall never be silent or permanent-by-default:
  the user is always shown the reason and always has an explicit path to
  either cancel or consciously proceed, and that choice is logged (see
  FR-AUD-02).
- **FR-POL-03 (Must):** Friction shall scale with both the amount and the
  action tier — ALLOW adds no UI friction; ADVISE shows a non-blocking
  banner; CHALLENGE requires active engagement (not a single tap) before
  the pay action is enabled; PAUSE blocks the pay action until the user
  explicitly acknowledges the full evidence report.
- **FR-POL-04 (Must):** The policy component shall enforce, as a testable
  invariant, that agent output can only ever move the action tier toward
  more caution, never less, relative to the deterministic hot-path tier.
  See [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §2.1
  for the test that verifies this with zero tolerance for violation.
- **FR-INT-01 (Must):** The CHALLENGE tier's UI shall require the user to
  actively engage (e.g., type the resolved recipient identity, or wait
  out a brief enforced pause with the pay button disabled) rather than
  offering a single dismissible "OK" — this defeats the documented
  sub-second habituation dismissal pattern.
- **FR-INT-02 (Must):** Every ADVISE/CHALLENGE/PAUSE surface shall include
  the plain-language evidence report (FR-EXP-01), not a bare score.
- **FR-INT-03 (Must):** If the user proceeds despite a CHALLENGE or PAUSE
  warning, the system shall log this explicitly as an override event
  (see FR-AUD-02) — it must never be indistinguishable from an
  uncontested ALLOW in the audit trail.
- **FR-INT-04 (Should):** For the intersection of PAUSE tier + low agent
  confidence + a simulated vulnerable-user flag, the system may offer a
  simulated trusted-contact notification/co-approval step (B1, bonus).

### 3.6 Explainability (FR-EXP)

- **FR-EXP-01 (Must):** Every non-ALLOW decision shall produce a
  plain-language causal narrative naming the specific evidence that
  drove it (e.g., "this recipient account is new to you and your note
  mentions urgency and secrecy"), not a numeric score alone.
- **FR-EXP-02 (Must):** Explanations shall describe observable facts, not
  accusations — the system shall never claim to have identified the
  recipient as "a known fraud ring member" or similar; it states what was
  observed (e.g., "this recipient does not match a registered biller"),
  consistent with real-world constraints on informing a user that a
  counterparty has been specifically flagged. See
  [`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) §5.
- **FR-EXP-03 (Must):** A secondary, more technical view of the evidence
  (feature-level detail, agent tool calls made, timing) shall be available
  for the demo's "judge/operator" view, separate from the plain-language
  consumer-facing view.

### 3.7 Audit History (FR-AUD)

- **FR-AUD-01 (Must):** Every evaluated transaction shall produce an
  append-only audit record containing: inputs (redacted where
  appropriate), hot-path score and tier, agent output (if invoked), final
  policy decision, and user action.
- **FR-AUD-02 (Must):** Audit records shall be hash-chained (each record
  includes a hash of the previous record) so that any tampering with
  historical records is detectable, without requiring real blockchain or
  enterprise WORM infrastructure.
- **FR-AUD-03 (Must):** A history view shall let the user (or a judge)
  browse past transactions and open the full evidence report for any of
  them.

### 3.8 Human-in-the-Loop (FR-HITL)

- **FR-HITL-01 (Must):** For every non-ALLOW tier, the final decision to
  proceed or cancel rests with the human user — the system recommends and
  blocks the default path, it does not autonomously complete or
  permanently deny the payment on the user's behalf (except the hard
  deterministic blocklist override in FR-RISK-03, which is a simulated
  stand-in for a legally-mandated block, not a probabilistic AI decision).
- **FR-HITL-02 (Should):** The bonus trusted-contact flow (FR-INT-04)
  represents a second human in the loop for the specific case where the
  primary user's own judgment is the thing most likely compromised.

---

## 4. Non-Functional Requirements

### 4.1 Performance (NFR-PERF)

- **NFR-PERF-01 (Must):** The hot path (FR-RISK-01) shall complete in
  low-single-digit milliseconds on the development machine. This is a
  **design target for local execution**, not a claimed production SLA —
  see [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) §1
  on honest metric reporting.
- **NFR-PERF-02 (Must):** The warm path (agent invocation) shall be
  bounded by a hard timeout (default 3–5 seconds); if exceeded, the system
  falls back per NFR-REL-02. This bound exists so the demo's live
  reasoning step has a predictable upper bound, not because it models a
  real payment-rail SLA.

### 4.2 Reliability & Safety (NFR-REL)

- **NFR-REL-01 (Must):** If the LLM/agent call errors, times out, or
  returns a schema-invalid response, the system shall **fail open**: the
  transaction proceeds according to the deterministic hot-path tier alone
  (never silently blocked, never silently allowed at a lower tier than
  the deterministic layer already decided), and this fallback is itself
  visibly logged and demonstrable (D7).
- **NFR-REL-02 (Must):** A single retry is permitted on agent timeout
  before falling back; no unbounded retry loops.
- **NFR-REL-03 (Must):** The system shall have a pre-scripted, cached
  fallback path for the live demo specifically, in case the live LLM
  dependency is unavailable or flaky during a judged presentation — this
  is a demo-reliability requirement distinct from the general fail-open
  behavior. See [`07-demo-script.md`](./07-demo-script.md) §6.

### 4.3 Security (NFR-SEC)

- **NFR-SEC-01 (Must):** The payment note field (and any other
  user-controllable text reaching the LLM) shall be treated as untrusted
  input; the agent's system instructions shall be structurally isolated
  from user-provided content, and any instruction-like content found
  inside user input shall be inert. See
  [`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) §2.
- **NFR-SEC-02 (Must):** No agent tool shall have write access to funds,
  account state, or any external system. All tools are read-only against
  mock data. See [`03-agent-and-tools.md`](./03-agent-and-tools.md) §2.

### 4.4 Explainability & Auditability (NFR-EXP)

- **NFR-EXP-01 (Must):** Every decision must be reconstructible after the
  fact from its audit record alone, without needing to re-run the
  pipeline.

### 4.5 Privacy (NFR-PRIV)

- **NFR-PRIV-01 (Must):** All personal data used (user profiles, recipient
  directory, transaction history) is synthetic and generated by this
  project. This shall be stated in the UI/demo materials, not only in
  internal documentation.

### 4.6 Honesty / Non-Overclaiming (NFR-HON)

- **NFR-HON-01 (Must):** No UI element, log message, or documentation
  claim shall imply real bank/NPCI connectivity, real multi-user data, or
  measured real-world performance figures. This is a first-class
  requirement, not a stylistic preference — it is the difference between
  a defensible hackathon prototype and an overclaiming one, per §5.3 of
  `00-overview.md`.

---

## 5. Requirement Priorities Summary

| Priority | Count | Composition |
|---|---|---|
| Must | 39 | The full demoable core; corresponds to D1–D9 |
| Should | 3 | FR-REC-04, FR-INT-04, FR-HITL-02 — correspond to B1 and one recipient-directory enrichment |
| Won't (this build) | — | Everything in `00-overview.md` §5.3 (C1–C8) |

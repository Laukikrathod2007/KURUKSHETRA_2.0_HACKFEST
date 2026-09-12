# 05 — MCP Server Architecture

## What MCP does and does not do (non-negotiable boundary)

MCP is **not** the protocol Kurukshetra speaks to the Mock NPCI Switch, the Mock PSP App, or any bank/PSP infrastructure — that boundary is plain HTTP/JSON in the hackathon build (see `04-infrastructure-and-mocks.md`), and ISO 8583/NPCI-XML in real production. MCP is used **only** as the internal orchestration protocol between the Risk Engine's decision output and the set of post-decision "what do we show the user, and who do we notify" tools.

MCP is invoked **if and only if** the deterministic scoring engine has already produced a decision of `COACH` or `FREEZE`. It is never invoked for `ALLOW` or `STEP_UP`, and it never runs before or during Tier 0/1 scoring. This keeps MCP entirely off the hard 45ms latency budget — the transaction's fate is already decided before MCP does anything; MCP's job is purely how the confirmed decision gets communicated and acted on.

**MCP never decides risk.** The risk_score, risk_zone, and decision fields in the canonical output contract are frozen by the time MCP is invoked. MCP tools operate only on that already-final evidence bundle.

## MCP Host

A lightweight orchestrator (Python, using the MCP SDK) that:
1. Receives the frozen `RiskDecision` object (see `06-canonical-contracts.md`) when decision is `COACH` or `FREEZE`.
2. Calls the MCP Server's tools to (a) pick which intervention screen to render, (b) generate the plain-language explanation, and (c) fire any side-effect notifications (trusted contact).
3. Returns a single `InterventionPayload` to the Demo Frontend — never raw tool-call traces, never chain-of-thought.

## MCP Server — tool inventory

Tools are grouped by responsibility, not mapped 1:1 to the 33 features — five tools cover everything Category H/J needs:

| Tool | Input | Output | Notes |
|---|---|---|---|
| `explain_decision` | The frozen evidence bundle (reason codes, tier provenance) | A plain-language explanation string | The ONLY place an LLM call happens in the whole system. Reads evidence as inert data — never treats any field (including scam-message text or collect-request notes) as instructions. |
| `select_intervention_template` | `risk_zone`, fired reason codes | Which Category H screen to render: Purpose Contradiction (#27), Account Timeline (#29), Bank Helpline button (#30), or a generic COACH screen | Deterministic mapping table, not a free-form agent decision — this keeps the UI predictable and testable. |
| `notify_trusted_contact` | `payer_id`, transaction summary | Delivery receipt (mocked — logs the "notification" rather than sending a real SMS/push in the hackathon build) | Feature #26. The mocked delivery channel is the one Simulated piece; the trigger logic is Real. |
| `log_intervention_outcome` | `intervention_template_id`, `user_action` (proceeded/aborted) | Write confirmation | Feeds feature #36's A/B effectiveness tracking. Pure logging, no LLM. |
| `check_helpline_directory` | `bank_id` | Verified official helpline number | Feature #30. Static lookup, no LLM. |

Only `explain_decision` involves an LLM call. Every other tool is deterministic code exposed through the MCP interface purely for consistent orchestration — this matters because it means MCP's latency cost in the demo is dominated by one LLM call (a few hundred ms to ~2s), which fits comfortably inside the COACH tier's existing "5 seconds" human-cognitive-friction budget from `fresh_base.md`, without ever touching the 45ms machine-latency budget.

## Prompt-injection boundary (the gap the architecture council flagged)

Some evidence fields legitimately contain untrusted external text — a collect-request note (feature #17), a scam-message transcript a user pastes in, a QR code's transaction note. These fields are passed to `explain_decision` **strictly as quoted data inside a fixed evidence structure**, never concatenated into the instruction portion of the prompt. The tool's system instructions are static and are not derived from, or modifiable by, any field in the evidence bundle. No MCP tool call's target or arguments are ever chosen based on parsing untrusted text — `select_intervention_template` only reads structured reason codes the scoring engine already computed, never raw text.

## Sync vs. async

- **Synchronous, on the critical path (but off the 45ms budget):** `explain_decision`, `select_intervention_template` — the user is looking at a screen waiting for the COACH/FREEZE explanation, so this must return before the screen renders, but it is bounded by the COACH tier's multi-second cognitive-friction budget, not the machine-latency budget.
- **Asynchronous, fire-and-forget:** `notify_trusted_contact`, `log_intervention_outcome` — neither blocks the user's screen from rendering.

## Tool permissions

Every MCP tool receives only the frozen evidence bundle for the current transaction — no tool has a database credential, no tool can query the Local Ledger DB, Mock CBS, or Reputation DB directly, and no tool can call back into the Tier 0/1 scoring path. This is enforced by giving the MCP Server process a read-only, pre-fetched evidence object as its only input, with no network egress configured to the other services in `04-infrastructure-and-mocks.md`.

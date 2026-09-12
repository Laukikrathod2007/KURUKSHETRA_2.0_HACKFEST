# Agent Requirements: Bounded Agency, Diagnostic Tooling, and Epistemic Bounds

---

## 1. Executive Understanding
In high-stakes financial systems, **unbounded agency is an existential risk**. An agent endowed with free-form execution authority or unilateral power to move money, debit accounts, or override compliance policies is an invitation to catastrophic failure via prompt injection, model drift, or stochastic hallucination.

This document defines the **formal requirements, behavioral bounds, diagnostic capabilities, and non-negotiable constraints governing the Agentic Reasoner in GuardianPay**. The agent is architected strictly as a **forensic diagnostic investigator and contextual synthesizer**, operating under rigid deterministic supervision.

---

## 2. Core Agentic Responsibilities and Lifecycle

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE BOUNDED AGENTIC LIFECYCLE                                   │
├─────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ LIFECYCLE PHASE     │ OPERATIONAL BEHAVIOR & SYSTEM BOUNDS                                │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **1. Invocation**   │ Triggered strictly by the hot-path GBDT when risk enters the        │
│                     │ ambiguous corridor ($0.20 \le P \le 0.85$). Bypassed for safe tx.   │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **2. Hypothesis     │ Instantiates two mutually exclusive hypotheses:                     │
│    Formulation**    │ • $H_A$: Malicious Social Engineering / Impersonation Scam          │
│                     │ • $H_B$: Legitimate High-Value Commercial / Emergency Remittance    │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **3. Diagnostic     │ Executes bounded, read-only diagnostic API queries:                 │
│    Tool Queries**   │ • Query CBS legal name & MCC via `RespValAdd`                       │
│                     │ • Query biller API to verify if real outstanding debt exists        │
│                     │ • Query mule blacklist cache for historical complaints              │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **4. Evidence       │ Reconciles conflicting signals: weighs entity mismatch against      │
│    Reconciliation** │ emergency keywords; identifies deceptive psychological patterns.   │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **5. Structured     │ Emits an immutable, Pydantic-validated JSON dossier containing:     │
│    Directive**      │ Identified Scam Vector, Confidence Score, TreeSHAP Reason Weights,  │
│                     │ and Recommended Friction Tier ($T0 - T3$). Zero free-form action.   │
└─────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Explicit Agent Functional Requirements

### AR-CORE-01: Bounded Read-Only Tool Execution
- **Requirement:** The agent MUST possess access strictly to **read-only diagnostic tools** (e.g. `lookup_payee_kyc()`, `verify_utility_biller()`, `query_blacklist_cache()`). The agent MUST have ZERO access to write APIs capable of modifying balances, moving funds, or altering user profiles.
- **Rationale:** Prevents unauthorized financial motion or privilege escalation even in the event of total model compromise.
- **Priority:** MUST HAVE.

### AR-CORE-02: Structured Pydantic JSON Output Schema
- **Requirement:** The agent's output MUST strictly conform to the following JSON schema; any output failing validation triggers an immediate fallback to deterministic rules:
  ```json
  {
    "scam_vector_identified": "IMPERSONATION_POLICE | UTILITY_DISCONNECT | TASK_SCAM | NONE",
    "scam_confidence": 0.88,
    "hypothesis_evaluation": {
      "scam_hypothesis_weight": 0.91,
      "legitimate_hypothesis_weight": 0.09,
      "reconciliation_rationale": "Stated purpose is customs duty but beneficiary is an individual P2P account."
    },
    "recommended_friction_tier": "TIER_2_COGNITIVE_CHALLENGE",
    "custom_challenge_text": "You are transferring funds to Raju Paswan, NOT the Customs Bureau. Type RAJU PASWAN to proceed."
  }
  ```
- **Priority:** MUST HAVE.

### AR-CORE-03: Hard Execution Timeout (1,800ms SLA)
- **Requirement:** The agent execution runtime MUST enforce a hard execution ceiling of **$1,800\text{ms}$** across all tool queries and reasoning steps.
- **Rationale:** Ensures total warm-path processing completes within the human 2–4 second dwell window without causing UI freezing or switch timeouts.
- **Priority:** MUST HAVE.
- **Validation Criteria:** A timer aborts the agent thread at 1,800ms and returns the hot-path GBDT fallback score.

---

## 4. The Five Non-Negotiable Forbidden Agent Behaviors

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                         NON-NEGOTIABLE AGENTIC BOUNDARIES                                 │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **1. FORBIDDEN: FINANCIAL WRITE CAPABILITIES**                                            │
│ The agent cannot debit, credit, refund, freeze, or transfer funds. It is strictly an     │
│ investigative diagnostic advisor.                                                         │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **2. FORBIDDEN: OVERRIDING DETERMINISTIC SECURITY RULES**                                 │
│ An agent cannot override or relax a deterministic security rule. If AnyDesk is running,   │
│ the app is blocked, regardless of what the agent reasons. The agent can only ELEVATE      │
│ friction; it can NEVER dismiss a hard security policy.                                    │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **3. FORBIDDEN: UNBOUNDED NATURAL-LANGUAGE EXECUTION**                                    │
│ The agent cannot execute code or terminal commands. Output is strictly bounded to the     │
│ pre-defined Pydantic JSON schema.                                                         │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **4. FORBIDDEN: PRIVATE MESSAGING SCRAPING**                                              │
│ The agent cannot invoke tools to scrape WhatsApp, Telegram, or SMS databases.             │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **5. FORBIDDEN: UNGUARDED MULTI-AGENT RECURSION**                                         │
│ The system prohibits unconstrained multi-agent debate loops. Investigation is bounded to  │
│ a maximum of TWO diagnostic tool round-trips before emitting a final decision.            │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

| Dimension | Architectural Takeaway |
| :--- | :--- |
| **Agent Role** | Purely an **epistemic investigator and explainer**, operating strictly within a bounded diagnostic loop. |
| **Enforcement** | Final transaction action is enforced by a **Deterministic Policy Engine**, not the agent itself. |
| **Security** | Sandboxed inputs, read-only tools, and strict timeout circuit breakers eliminate systemic risk. |

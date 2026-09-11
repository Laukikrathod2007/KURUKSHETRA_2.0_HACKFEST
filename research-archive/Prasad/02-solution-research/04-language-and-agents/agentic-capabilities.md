# Agentic Capabilities: Autonomous Investigation, Hypothesis Testing, and Tool Orchestration

---

## 1. Executive Understanding
The defining distinction between a passive model (like a classifier or standalone LLM) and an **Agent** is **autonomous agency**: the capacity to iteratively plan, execute diagnostic actions, inspect tool outputs, formulate hypotheses, reconcile contradictory evidence, and adaptively decide next steps to achieve a goal.

In payment security, an agent is not an autonomous bot executing financial transfers. It is an **Autonomous Investigative Forensic Guardian** operating in an epistemic loop:
$$\text{Perceive} \longrightarrow \text{Hypothesize} \longrightarrow \text{Query Tools} \longrightarrow \text{Synthesize Evidence} \longrightarrow \text{Select Bounded Action}$$

However, introducing agency into high-stakes financial pipelines introduces severe risks. We must rigorously question **where an agent is genuinely indispensable versus where simpler deterministic code is superior**.

---

## 2. Core Agentic Capabilities and Critical Necessity Evaluation

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                       AGENTIC CAPABILITY EVALUATION MATRIX                                │
├─────────────────────┬───────────────────────────────┬──────────────┬──────────────────────┤
│ CAPABILITY          │ OPERATIONAL MECHANISM         │ IS AN AGENT  │ DETERMINISTIC / ML   │
│                     │                               │ NECESSARY?   │ ALTERNATIVE          │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **1. Dynamic Tool   │ Decides which APIs to query   │ **MODERATE** │ Hardcoded waterfall: │
│   Orchestration**   │ (e.g., I4C, MCC lookup, Bill  │              │ Always query tool X, │
│                     │  verification API)            │              │ then tool Y if flag  │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **2. Competing      │ Generates and tests multiple  │ **EXTREMELY  │ Tabular models cannot│
│   Hypotheses**      │ explanations: (Scam vs. Urgent│   HIGH**     │ reason over counter- │
│                     │  Hospital Emergency)          │              │ factual narratives   │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **3. Out-of-Band    │ Queries external utility or   │ **HIGH**     │ Impossible via static│
│   Fact Verification**│ merchant API to verify if real│              │ rules without complex│
│                     │ bill debt actually exists     │              │ manual API adapters  │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **4. Targeted User  │ Formulates adaptive, surgical │ **EXTREMELY  │ Hardcoded drop-downs │
│   Clarification**   │ question based on exact contra-│   HIGH**    │ or static dialogs    │
│                     │ dictions observed             │              │ (ignored by users)   │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **5. Final Action   │ Decides whether to allow,     │ **NO /       │ **MUST BE A HARD     │
│   Authorization**   │ pause, or block the financial │ DANGEROUS**  │ DETERMINISTIC POLICY │
│                     │ transaction                   │              │ ENGINE (Zero Agent)**│
└─────────────────────┴───────────────────────────────┴──────────────┴──────────────────────┘
```

---

## 3. Deep Dive: The Hypothesis-Testing Engine

When a transaction falls into the **Ambiguous Risk Zone** (e.g., Risk Score = 0.65; new payee; high amount; active call), a passive classifier merely outputs a high probability. An agent performs **Iterative Abductive Reasoning**:

```
                       AGENTIC HYPOTHESIS-TESTING LOOP
                       [Ambiguous Transaction Input]
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ HYPOTHESIS A: Digital Arrest / Extortion Scam           │
        │ HYPOTHESIS B: Legitimate Urgent Medical Emergency       │
        └────────────────────────────┬────────────────────────────┘
                                     │
                    Formulate Diagnostic Tool Queries
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
       [Tool: Verify Beneficiary Entity]   [Tool: Inspect Stated Purpose]
       Result: Individual Account          Result: Claims "Customs Clearance"
       in rural branch.                    Duty for confiscated parcel.
                     │                               │
                     └───────────────┬───────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ EVIDENCE RECONCILIATION:                                │
        │ • Customs duty cannot legally be paid to a rural P2P VPA│
        │ • Reject Hypothesis B (Medical). Confirm Hypothesis A.  │
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │ RESULT: Formulate targeted cognitive challenge for user │
        └─────────────────────────────────────────────────────────┘
```

---

## 4. Why Agentic Action Selection Must Be Strictly Bounded

A lethal architectural error is granting an agentic LLM **unbounded execution authority** (e.g., giving the agent an API tool `block_user_account()` or `execute_transfer()`).

### The Threat of Agent Drift and Stochastic Misclassification
- If an agent is granted authority to execute or cancel payments based on free-form reasoning, prompt injections (e.g., in transaction notes) or stochastic reasoning errors can lead to unauthorized financial disruption.
- **The Bounded Action Space Principle:** The agent does not execute financial commands. The agent outputs a **Structured Evidentiary Assessment (JSON)** containing:
  - `identified_scam_vector`: Enum (`IMPERSONATION_POLICE`, `UTILITY_THREAT`, etc.)
  - `confidence_score`: Float ($0.0 - 1.0$)
  - `evidentiary_justification`: String (Auditable factual reasons)
  - `recommended_friction_tier`: Enum (`TIER_1_BANNER`, `TIER_2_CHALLENGE`, `TIER_3_COOLING_OFF`)
- The **Deterministic Policy Engine** reads this structured JSON, validates it against hard compliance rules, and executes the physical UI intervention.

---

## 5. Epistemic Assessment for PS09

| Dimension | Agentic Capability Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Value Addition** | **High in Ambiguous Gray Zones:** Resolves complex, multi-factor scams that trip conventional models into false positives. | Deploy agents strictly for **Tier-2 / Tier-3 escalated cases**, never on Tier-1 clear-cut transactions. |
| **Latency Penalty** | **Significant (2–8 seconds across multiple tool calls):** Exceeds synchronous payment switch limits. | Must run during the **pre-PIN review window** or as an **interactive cooling-off pause**, not on the hot switch path. |
| **Autonomous Control** | **Dangerous if Unbounded:** Stochastic reasoning cannot be trusted with unilateral blocking power. | Agent must remain **strictly diagnostic and advisory**, with final action enforcement governed by deterministic rules. |

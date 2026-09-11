# PHASE 6 — BARE-MINIMUM PRD & PRODUCT DEFINITION

## Role

Act as a **senior product manager and systems product architect** with experience in fintech, payment security, fraud/scam prevention, AI systems, and high-risk decision workflows.

The project is:

> **Agentic Guardian for Real-Time Payment Scam Interception**

The knowledge base now contains:

- Phase 0 — Project Context
- Phase 1 — Domain & Background Knowledge
- Phase 2 — Problem Understanding
- Phase 3 — Existing Landscape & Prior Art
- Phase 4 — Research Synthesis & Validated Gaps
- Phase 5 — Requirements Discovery

Your task is now to define the **smallest coherent product that can meaningfully address the validated problem and satisfy the highest-priority requirements**.

This is the first phase where concrete product capabilities may be defined.

---

# CORE OBJECTIVE

Answer:

> **"What is the minimum product we need to build for this project to genuinely address the most important validated requirements?"**

The result should be a **bare-minimum PRD**, not a wishlist.

The product must emerge from:

```text id="pg6j3w"
Evidence
    ↓
Problem
    ↓
Validated Gap
    ↓
Requirement
    ↓
Product Capability
    ↓
Minimum Product
```

Do not reverse this chain.

---

# INPUT

Read all previous phases before beginning.

Pay particular attention to:

- validated gaps
- MUST requirements
- SHOULD requirements
- requirement conflicts
- data assumptions
- timing requirements
- safety requirements
- existing landscape
- known limitations
- unresolved validation questions

Previous phases are the source of truth.

If the requirements contradict one another or contain unsupported assumptions, flag the issue rather than silently inventing a resolution.

---

# CRITICAL PRODUCT PRINCIPLE

## Build the minimum necessary product.

Do NOT ask:

> "What would make this product impressive?"

Ask:

> **"What is the smallest coherent system that can satisfy the validated MUST requirements and demonstrate meaningful resolution of the core problem?"**

Anything that does not contribute materially to that objective should be excluded from the bare-minimum PRD.

---

# PART 1 — PRODUCT DEFINITION

Define the product in one clear statement.

The definition must explain:

- who it is for
- what problem it addresses
- what the product fundamentally does
- where it operates in the payment lifecycle
- what outcome it seeks to improve

Avoid marketing language.

Do not claim capabilities that have not been established by the requirements.

---

# PART 2 — PRODUCT BOUNDARY

Explicitly define:

### Product includes

What the minimum product actually does.

### Product does not include

What is intentionally excluded.

### Depends on external systems

What the product assumes exists outside the product.

### Unknown / requires validation

What cannot yet be confidently defined.

This section is mandatory.

---

# PART 3 — CORE USER / ACTOR MODEL

Identify the actors who actually interact with or depend upon the product.

For each:

- actor
- goal
- interaction
- information received
- action taken
- responsibility
- failure consequence

Do not turn every stakeholder from Phase 2 into a product user.

---

# PART 4 — CORE PRODUCT WORKFLOW

Define the minimum end-to-end product workflow.

For example, conceptually:

```text id="9cr4n5"
Payment Event
      ↓
Context Available
      ↓
Risk Assessment
      ↓
Decision
      ↓
Intervention
      ↓
Transaction Outcome
      ↓
Evidence / Audit Record
```

The actual workflow must be derived from the requirements.

Document:

- inputs
- processing stages
- decision points
- outputs
- human interaction
- failure paths
- fallback paths

Do not yet choose technical implementation.

---

# PART 5 — MINIMUM PRODUCT CAPABILITIES

Derive the smallest set of product capabilities required to satisfy the MUST requirements.

For every capability:

```text id="1d4bqk"
Capability ID
Name
Description
Purpose
Requirement(s) satisfied
Gap(s) addressed
Actor(s)
Inputs
Outputs
Dependencies
Priority
```

Do not add capabilities simply because they would be interesting.

Every core capability must have traceability.

---

# PART 6 — CORE PRODUCT FEATURES

Only after defining capabilities, translate them into concrete product features.

Every feature must answer:

> **Which requirement does this satisfy?**

Create:

| Feature ID | Feature | Requirement | Gap | User/Actor | Priority | MVP? |
| ---------- | ------- | ----------- | --- | ---------- | -------- | ---- |

A feature without a requirement should be challenged.

If a feature is retained despite having no direct requirement, document why.

---

# PART 7 — USER EXPERIENCE

Define only the UX necessary for the bare-minimum product.

Determine:

- what the user sees
- when they see it
- what decision they must make
- what information they need
- what action they can take
- what happens afterward

Avoid designing visual details.

Do not specify:

- colors
- typography
- exact layouts
- animations
- branding

Those belong elsewhere.

Focus on **interaction logic**.

---

# PART 8 — RISK / DECISION EXPERIENCE

If the product makes or supports risk decisions, define:

- decision states
- relevant outcomes
- uncertainty handling
- escalation
- user/analyst interaction
- override behavior

Do not specify the ML/AI implementation.

For example, the product may conceptually need:

```text id="yqz5sl"
LOW RISK
→ normal flow

ELEVATED RISK
→ additional intervention

HIGH RISK
→ stronger intervention / review
```

But do not assume these exact categories unless supported by the requirements.

---

# PART 9 — INTERVENTION EXPERIENCE

Define the minimum product behavior around intervention.

Document:

- trigger
- timing
- affected actor
- information shown/provided
- available action
- outcome
- fallback
- audit requirement

Do not optimize the UX yet.

The objective is functional completeness.

---

# PART 10 — EXPLANATION / EVIDENCE EXPERIENCE

If required by Phase 5, define what the product exposes as decision evidence.

Distinguish:

### End-user explanation

What the user needs to understand.

### Analyst explanation

What a reviewer needs to investigate.

### Audit record

What must be retained for accountability.

Do not equate these with one generic "explanation."

---

# PART 11 — FAILURE & EDGE CASES

Define the minimum product behavior when:

- required data is missing
- a dependency fails
- the risk assessment cannot complete
- the system times out
- confidence is insufficient
- the user disagrees
- an analyst overrides a decision
- duplicate events occur
- transactions change state
- the system is unavailable

The product must not silently assume ideal conditions.

---

# PART 12 — SAFETY BOUNDARY

Explicitly define what the product is **allowed and not allowed to do**.

For example, depending on requirements:

- when it may warn
- when it may intervene
- when human review is required
- when it must defer
- when it must not make an autonomous decision

Do not invent safety policies.

Derive them from Phase 5.

---

# PART 13 — DATA CONTRACT AT PRODUCT LEVEL

Define what information the product expects.

This is NOT a database schema.

For each input:

| Input | Purpose | Required? | Source | Availability | Sensitivity | Fallback |
| ----- | ------- | --------- | ------ | ------------ | ----------- | -------- |

Explicitly distinguish:

- guaranteed inputs
- assumed inputs
- simulated inputs
- optional inputs
- unavailable inputs

This is particularly important for a hackathon prototype.

---

# PART 14 — DEMONSTRABLE MVP

Define what can realistically be demonstrated.

The MVP should prove:

1. the core problem is represented
2. the core detection/decision capability exists
3. intervention can occur at the relevant point
4. the product provides the necessary information/evidence
5. important safety constraints are respected
6. the outcome can be evaluated

Do not add demo-only features that have no relationship to the real product.

If simulation is necessary because real payment infrastructure is inaccessible, explicitly distinguish:

> **Production assumption**

from:

> **Hackathon simulation**

---

# PART 15 — MVP EXCLUSIONS

Create an explicit:

> **NOT IN MVP**

list.

Examples may include:

- advanced analytics
- additional user roles
- extensive integrations
- advanced dashboards
- secondary scam types
- sophisticated automation
- optimization features

Do not populate this list from imagination.

Exclude items because:

- they are not required
- they are insufficiently validated
- they add disproportionate complexity
- they belong to later product evolution

---

# PART 16 — ACCEPTANCE CRITERIA

Translate the core requirements into product-level acceptance criteria.

For each core feature/capability:

```text id="y1e8r9"
Given [condition]

When [event]

Then [expected behavior]

And [required outcome]
```

Acceptance criteria must be objectively testable where possible.

Do not write:

> "The system should intelligently detect scams."

Write behavior that can actually be evaluated.

---

# PART 17 — MVP SUCCESS CRITERIA

Define what would constitute a successful MVP.

Separate:

### Product success

Does the workflow function?

### Detection success

Does the system identify relevant scenarios?

### Intervention success

Does it intervene at the appropriate point?

### Safety success

Does it avoid unacceptable behavior?

### User success

Can the intended actor understand and act on the system output?

### Technical success

Does the prototype satisfy relevant performance/reliability constraints?

Do not invent target values without evidence.

---

# PART 18 — PRODUCT TRADE-OFFS

Document deliberate compromises.

For example:

```text id="u8v8a4"
Full ecosystem integration
        ↓
Prototype simulation

Maximum detection complexity
        ↓
Explainable / testable minimum

Broad scam coverage
        ↓
Deep coverage of validated priority scenarios
```

Only include actual trade-offs arising from the requirements and constraints.

---

# PART 19 — TRACEABILITY

Create:

```text id="9q2u3c"
Gap
 ↓
Requirement
 ↓
Capability
 ↓
Feature
 ↓
Acceptance Criterion
```

Create a traceability matrix:

| Gap | Requirement | Capability | Feature | Acceptance Criterion |
| --- | ----------- | ---------- | ------- | -------------------- |

Every MUST requirement should be represented or explicitly marked as deferred/validation-dependent.

---

# PART 20 — INDEPENDENT PRODUCT REVIEW

After constructing the MVP, ignore the proposed feature list.

Ask:

> **"If I started only from the validated requirements, is this actually the smallest coherent product that could satisfy them?"**

Look for:

- unnecessary features
- missing capabilities
- accidental complexity
- feature creep
- requirements not represented
- features without evidence
- hidden assumptions

Remove anything unnecessary.

Add anything genuinely required.

---

# EXPECTED LEVEL OF DETAIL

This phase should be **product-definition grade**.

The document must be specific enough that an engineering team can understand:

- what the product does
- who interacts with it
- what the core workflow is
- what capabilities are mandatory
- what the MVP includes
- what the MVP excludes
- what each feature is intended to accomplish
- how success will be tested

But it should NOT become an architecture document.

Aim for approximately **10,000–20,000 words** across the Phase 6 knowledge base.

Prefer:

> **a small, coherent PRD over a huge feature specification.**

---

# OUTPUT

Create:

```text id="p5e8lc"
06-prd/
```

Suggested structure:

```text
06-prd/
├── product-definition.md
├── product-boundary.md
├── actor-model.md
├── core-workflow.md
├── capabilities.md
├── feature-specification.md
├── user-experience.md
├── risk-decision-experience.md
├── intervention-experience.md
├── explanation-and-evidence.md
├── failure-and-edge-cases.md
├── safety-boundary.md
├── product-data-contract.md
├── demonstrable-mvp.md
├── mvp-exclusions.md
├── acceptance-criteria.md
├── success-criteria.md
├── trade-offs.md
├── traceability.md
└── phase-6-review.md
```

Modify the structure if necessary, but keep the documentation logically separated.

---

# EXPLICIT STOP & EXIT CRITERIA

## STOP CONDITION

Stop Phase 6 when:

> **A coherent bare-minimum product has been defined that satisfies the highest-priority validated requirements, has explicit boundaries, and has testable acceptance criteria.**

Do not continue adding features merely because they could improve the demo.

---

# PHASE 6 IS COMPLETE ONLY WHEN

### 1. Product definition is clear

A reader can explain what the product does in one or two sentences.

### 2. Product boundary is explicit

We know what is and is not part of the MVP.

### 3. Core workflow exists

The end-to-end user/system workflow is defined.

### 4. Capabilities are derived

Core capabilities trace to requirements.

### 5. Features are derived from capabilities

Features have clear justification.

### 6. MVP is minimal

Unnecessary features have been removed.

### 7. Data assumptions are explicit

We know what the MVP expects and what must be simulated.

### 8. Failure behavior is defined

Important failure and edge cases are covered.

### 9. Safety boundaries are explicit

The product's decision authority is defined.

### 10. Acceptance criteria exist

Core capabilities can be tested.

### 11. Success criteria exist

We know what a successful MVP demonstration means.

### 12. Traceability is complete

The chain from gap to requirement to feature to acceptance criterion exists.

### 13. Independent review is complete

The product has been challenged for unnecessary features and missing capabilities.

---

# FINAL COMPLETENESS TEST

Ask:

> **"If we were given only this PRD and the previous research, could an engineering team build the intended MVP without inventing what the product is supposed to do?"**

If **no**:

→ Resolve the missing product definition.

If **yes**:

→ Phase 6 is complete.

---

# FINAL OUTPUT STATUS

End `phase-6-review.md` with:

```text
PHASE 6 STATUS: COMPLETE

Product definition:
[CLEAR / UNCLEAR]

Core capabilities:
[NUMBER]

Core MVP features:
[NUMBER]

MUST requirements covered:
[NUMBER / TOTAL]

Requirements requiring validation:
[LIST]

MVP boundary:
[DEFINED / INCOMPLETE]

Core workflow:
[DEFINED / INCOMPLETE]

Data assumptions:
[DEFINED / INCOMPLETE]

Failure behavior:
[DEFINED / INCOMPLETE]

Safety boundary:
[DEFINED / INCOMPLETE]

Acceptance criteria:
[COMPLETE / INCOMPLETE]

Success criteria:
[DEFINED / INCOMPLETE]

Traceability:
[COMPLETE / INCOMPLETE]

Features removed during review:
[LIST]

Critical unresolved decisions:
[LIST]

Premature technical decisions:
[NONE / LIST]

Reason Phase 6 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
```

If all mandatory criteria are satisfied:

> **DERIVE → MINIMIZE → SPECIFY → TEST → REVIEW → MARK COMPLETE → STOP.**

Do not proceed into advanced features or technical architecture within Phase 6.

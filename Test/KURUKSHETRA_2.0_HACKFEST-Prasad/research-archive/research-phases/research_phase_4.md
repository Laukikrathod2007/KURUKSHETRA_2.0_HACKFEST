# PHASE 4 — RESEARCH SYNTHESIS & GAP DISCOVERY

## Role

Act as a **senior research synthesist and problem-discovery analyst** specializing in financial technology, payment security, fraud/scam prevention, cybersecurity, and applied AI.

The project is:

> **Agentic Guardian for Real-Time Payment Scam Interception**

The knowledge base now contains:

- Phase 0 — Project Context
- Phase 1 — Domain & Background Knowledge
- Phase 2 — Problem Understanding
- Phase 3 — Existing Landscape & Prior Art

Your task is to synthesize these bodies of evidence and determine:

> **What important problems remain insufficiently addressed by existing approaches?**

This is the phase where **gaps are discovered from evidence**.

It is NOT the phase where we invent product features.

---

# CORE OBJECTIVE

Answer:

> **"After understanding the problem and studying what already exists, what genuinely remains unsolved, inadequately solved, or poorly addressed?"**

The output must distinguish between:

```text
Problem
   ↓
Existing approach
   ↓
Observed capability
   ↓
Observed limitation
   ↓
Evidence
   ↓
Unresolved gap
```

Do not skip the evidence chain.

---

# INPUT

Before beginning:

1. Read the complete Phase 0 documentation.
2. Read the complete Phase 1 documentation.
3. Read the complete Phase 2 documentation.
4. Read the complete Phase 3 documentation.

Treat these as the current project knowledge base.

Do not rely on isolated statements from one phase.

Look for relationships, contradictions, patterns, and missing connections across phases.

---

# CRITICAL BOUNDARY

This phase may identify:

- problems
- deficiencies
- limitations
- unmet needs
- unresolved challenges
- capability gaps
- research gaps
- operational gaps
- information gaps
- timing gaps
- user-experience problems
- systemic constraints

This phase must NOT finalize:

- features
- product requirements
- architecture
- technology choices
- model choices
- agent design
- implementation
- MVP scope

The question is:

> **"What is missing?"**

NOT:

> **"What should we build?"**

---

# PART 1 — RECONSTRUCT THE PROBLEM MODEL

Before identifying gaps, briefly reconstruct the Phase 2 problem model.

Establish:

- core problem
- major problem classes
- major actors
- relevant lifecycle stages
- important failure modes
- major consequences
- important temporal constraints

Do not rewrite Phase 2 in full.

The purpose is to establish the reference model against which the existing landscape will be evaluated.

---

# PART 2 — MAP EXISTING CAPABILITIES TO THE PROBLEM

Create a structured mapping:

| Problem / Failure Mode | Existing Approach | What It Addresses | What It Does Not Address | Evidence |
| ---------------------- | ----------------- | ----------------- | ------------------------ | -------- |

The goal is to discover where:

> **Problem requirements exceed existing capabilities.**

Do not assume a gap simply because an existing system does not do something.

The missing capability must be relevant to the actual problem.

---

# PART 3 — GAP DISCOVERY FRAMEWORK

Investigate potential gaps across multiple dimensions.

These are investigation categories, NOT assumptions that gaps exist.

## A. Detection Gaps

Ask:

- Are certain scam behaviors difficult to detect?
- Are important signals unavailable?
- Are certain signals available only too late?
- Are legitimate and scam-induced transactions difficult to distinguish?
- Are there behavioral patterns current approaches struggle with?

---

## B. Temporal Gaps

Ask:

- Is detection occurring too late?
- Is intervention possible only after irreversible actions?
- Are relevant signals available before the transaction completes?
- Are current approaches fundamentally post-transaction?

Do not invent latency requirements.

---

## C. Context Gaps

Ask:

- Do systems lack sufficient transaction context?
- Do they consider isolated transactions rather than broader behavior?
- Is relevant history unavailable?
- Are relationships between entities difficult to represent?
- Is user/scammer interaction context missing?

Only claim these as gaps where evidence supports them.

---

## D. Behavioral Gaps

Investigate whether existing approaches adequately capture:

- behavioral changes
- unusual user actions
- deviations from normal behavior
- social-engineering indicators
- interaction patterns

Do not assume behavioral analysis is superior.

Determine what evidence says.

---

## E. Information Gaps

Determine whether relevant systems lack:

- transaction context
- beneficiary context
- device context
- behavioral context
- network context
- external intelligence
- user-provided context

Distinguish:

> information that does not exist

from:

> information that exists but is inaccessible

from:

> information that exists but is not integrated.

These are fundamentally different gaps.

---

## F. Intervention Gaps

Investigate whether there are deficiencies between:

```text
Risk detected
     ↓
Decision
     ↓
User interaction
     ↓
Transaction outcome
```

Potential questions:

- Is detection disconnected from intervention?
- Is intervention too generic?
- Is intervention poorly timed?
- Is there excessive friction?
- Are high-risk situations treated similarly to low-risk situations?

Do not propose the solution.

---

## G. Explainability / Decision-Transparency Gaps

Investigate:

- whether users understand why they are being warned
- whether analysts understand why something was flagged
- whether decisions can be audited
- whether evidence supporting decisions is available
- whether automated decisions are sufficiently interpretable

Do not conclude that an "AI explanation" is the answer.

First establish whether a meaningful problem exists.

---

## H. Human-in-the-Loop Gaps

Investigate where humans are involved in existing systems.

Ask:

- what decisions require human judgment
- what information humans receive
- where human review becomes a bottleneck
- where automation may be insufficient
- where automation may introduce unacceptable risk

Do not conclude that humans should be removed.

---

## I. Adaptability Gaps

Investigate whether existing systems struggle with:

- changing scam patterns
- novel attack strategies
- concept drift
- adversarial adaptation
- emerging fraud behavior

Determine whether this is a documented systemic issue or merely a theoretical possibility.

---

## J. False-Positive / Friction Gaps

Investigate the trade-off between:

```text
More aggressive detection
        ↕
More false positives / user friction
```

Determine:

- where false positives matter
- what consequences they create
- whether existing systems expose evidence of this trade-off
- whether different risk levels are treated differently

Do not optimize this trade-off yet.

---

## K. Coordination Gaps

Investigate whether relevant information or actions are fragmented across:

- users
- banks
- PSPs
- payment networks
- applications
- fraud teams
- law enforcement
- other institutions

Do not assume centralized coordination is desirable or feasible.

First establish whether fragmentation creates a genuine problem.

---

## L. Recovery Gaps

Investigate what happens **after** a scam occurs.

Determine whether problems remain around:

- reporting
- investigation
- tracing
- recovery
- communication
- resolution

Keep recovery distinct from prevention/interception.

---

# PART 4 — CROSS-SYSTEM PATTERN ANALYSIS

Do not evaluate systems independently only.

Look across the landscape for recurring patterns.

Ask:

> **What limitations appear repeatedly across otherwise different approaches?**

For each recurring limitation determine:

- systems affected
- problem stage
- evidence
- likely underlying cause
- severity
- whether it is genuinely unresolved

Repeated patterns are stronger evidence than isolated deficiencies.

---

# PART 5 — GAP VALIDATION

Every proposed gap must pass a validation test.

For each candidate gap ask:

### 1. Is the underlying problem real?

Evidence from Phase 2.

### 2. Is it materially important?

Evidence of impact/severity.

### 3. Does the existing landscape actually fail to address it?

Evidence from Phase 3.

### 4. Is the limitation meaningful rather than cosmetic?

Avoid gaps that are merely:

- different UI
- different branding
- different technology
- minor convenience improvements

### 5. Is the gap technically/operationally meaningful?

### 6. Is the gap still unresolved?

Avoid claiming a gap if a credible existing approach already solves it.

---

# PART 6 — GAP CLASSIFICATION

Classify each validated gap.

Possible categories:

- **Problem Gap** — an important aspect of the problem remains insufficiently addressed.
- **Capability Gap** — existing systems lack an important capability.
- **Information Gap** — necessary information is unavailable or poorly integrated.
- **Temporal Gap** — relevant detection/intervention occurs too late.
- **Operational Gap** — workflows remain inefficient or incomplete.
- **Human-Interaction Gap** — users or analysts encounter a meaningful deficiency.
- **Coordination Gap** — fragmented actors/processes create an unresolved issue.
- **Research Gap** — evidence itself is insufficient to establish how the problem should be handled.
- **Infrastructure Gap** — existing ecosystem constraints prevent effective handling.

Do not force every gap into one category.

A gap may have multiple classifications.

---

# PART 7 — GAP SEVERITY

Do not assign arbitrary scores.

Instead establish evidence-based dimensions such as:

- impact
- frequency
- affected population
- financial consequence
- irreversibility
- time sensitivity
- existing mitigation strength
- evidence confidence

Create a transparent assessment framework.

If numerical scoring is useful, define the methodology before applying it.

Do not create a score merely to rank things visually.

---

# PART 8 — PRIORITIZE THE GAPS

After validating the gaps, classify them into:

### Critical

A major unresolved problem strongly supported by evidence.

### Important

Meaningful problem with substantial evidence, but lower urgency or impact.

### Secondary

Real but lower-impact problem.

### Uncertain

Potential gap requiring additional evidence.

Explain the reasoning behind every classification.

---

# PART 9 — GAP RELATIONSHIPS

Determine whether gaps interact.

For example:

```text
Information limitation
        ↓
Poor contextual understanding
        ↓
Detection limitation
        ↓
Delayed intervention
        ↓
User loss
```

Do not assume causal relationships.

Establish them from evidence or clearly label them as hypotheses.

This helps distinguish:

> root gaps

from:

> downstream symptoms.

---

# PART 10 — FALSE GAPS

This is mandatory.

Actively search for gaps that **appear** to exist but are actually addressed by existing systems.

For each rejected gap:

- apparent gap
- evidence suggesting it is addressed
- relevant existing approach
- conclusion

This prevents confirmation bias.

---

# PART 11 — CONTRADICTIONS

Identify contradictions such as:

- one source claims a capability exists
- another indicates it is ineffective
- vendors claim real-time operation
- technical documentation suggests otherwise
- research demonstrates effectiveness under conditions not present in real deployments

For every contradiction:

- describe both claims
- assess evidence quality
- determine what can safely be concluded
- preserve unresolved uncertainty where necessary

---

# PART 12 — INDEPENDENT GAP DISCOVERY

After completing the framework, independently ask:

> **"If I ignored the categories in this prompt and simply compared the actual problem with the actual landscape, what important unresolved gaps might I discover?"**

Perform an independent pass.

Do not force discoveries into the predefined categories.

For each independent gap, provide:

- description
- evidence
- affected actors
- problem stage
- existing approaches
- why they appear insufficient
- confidence
- classification

---

# PART 13 — GAP-TO-EVIDENCE TRACEABILITY

Every final gap must be traceable.

Use:

```text
Gap
 ↓
Problem finding
 ↓
Existing-landscape evidence
 ↓
Limitation
 ↓
Supporting sources
```

Create a traceability table:

| Gap ID | Gap | Problem Evidence | Landscape Evidence | Limitation | Confidence |
| ------ | --- | ---------------- | ------------------ | ---------- | ---------- |

This becomes a critical artifact for later requirement discovery.

---

# PART 14 — DO NOT TURN GAPS INTO FEATURES

This rule is absolute.

Do NOT write:

> Gap G-04 → Feature F-04.

Instead write:

```text
G-04
Observed unresolved problem:
...

Evidence:
...

Why existing approaches are insufficient:
...

Potential implication:
A capability addressing this area may be valuable.

What remains undecided:
The form of that capability.
```

The form of the solution must remain open.

---

# EXPECTED LEVEL OF DETAIL

Phase 4 should be **evidence-dense and analytical**.

This phase is not primarily about discovering more information.

It is about extracting meaning from the information already gathered.

For each important gap, the reader should be able to reconstruct:

> **Problem → Existing approach → Limitation → Evidence → Gap**

A rough guideline is **15,000–30,000 words** across the Phase 4 knowledge base.

Do not optimize for word count.

Prefer:

> **fewer strongly validated gaps > dozens of speculative gaps.**

A final list containing **5 genuinely important gaps** is more valuable than **30 weakly supported ones**.

---

# OUTPUT

Create:

```text
04-gaps/
```

Suggested structure:

```text
04-gaps/
├── synthesis.md
├── problem-to-landscape-map.md
├── gap-discovery.md
├── detection-gaps.md
├── temporal-gaps.md
├── context-and-information-gaps.md
├── behavioral-gaps.md
├── intervention-gaps.md
├── explainability-gaps.md
├── human-in-the-loop-gaps.md
├── adaptability-gaps.md
├── friction-and-false-positive-gaps.md
├── coordination-gaps.md
├── recovery-gaps.md
├── validated-gaps.md
├── false-gaps.md
├── gap-prioritization.md
├── gap-relationships.md
├── contradictions.md
├── independent-discoveries.md
├── gap-traceability.md
├── knowledge-gaps.md
└── phase-4-review.md
```

You may alter the structure if the research demonstrates a better organization.

---

# PHASE 4 REVIEW

Before completion, perform an adversarial review.

Ask:

### Evidence

Does every major gap have evidence?

### Novelty

Are these genuinely unresolved gaps or merely things our imagined product would do differently?

### Confirmation bias

Did we search for evidence that disproves our preferred interpretation?

### Existing capability

Did we fairly represent what current systems can already do?

### Severity

Are we prioritizing based on evidence rather than intuition?

### Root causes

Are we identifying fundamental gaps rather than symptoms?

### Scam specificity

Are the gaps actually relevant to payment scams rather than generic fraud?

### Feasibility neutrality

Have we avoided selecting solutions simply because they seem technically easy?

### Completeness

Could an important category of unresolved problem have been overlooked?

### Contradictions

Have conflicting sources been explicitly addressed?

---

# EXPLICIT STOP & EXIT CRITERIA

## STOP CONDITION

Stop Phase 4 when:

> **The important unresolved gaps have been systematically derived from the Phase 2 problem model and Phase 3 landscape, validated against evidence, prioritized, and made traceable.**

Do NOT continue searching merely to produce more gaps.

More gaps do not automatically mean better research.

---

## PHASE 4 IS COMPLETE ONLY WHEN

### 1. Problem-to-landscape mapping exists

The major problem/failure areas have been compared against existing approaches.

### 2. Candidate gaps have been generated

Potential deficiencies have been systematically identified.

### 3. Gaps have been validated

Weak or unsupported gaps have been rejected.

### 4. False gaps have been documented

We have actively demonstrated where existing systems already address apparent deficiencies.

### 5. Important gaps are evidence-backed

Every major gap has a defensible evidence chain.

### 6. Gaps are prioritized

Importance is based on explicit reasoning and evidence.

### 7. Root causes are distinguished from symptoms

Where possible, the underlying gap is separated from downstream effects.

### 8. Contradictions are documented

Conflicting evidence has not been silently resolved.

### 9. Gap traceability exists

Every final gap can be traced back to problem and landscape evidence.

### 10. No features have been predetermined

The research has not been converted into product design.

### 11. Independent discovery is complete

An additional unconstrained pass has been performed to discover overlooked gaps.

---

# FINAL COMPLETENESS TEST

Ask:

> **"If we were forbidden from inventing any feature right now, could we still clearly explain the handful of most important things that existing approaches fail to adequately address?"**

If **no**:

→ Continue research/synthesis.

If **yes**:

→ Phase 4 is complete.

---

# FINAL OUTPUT STATUS

End `phase-4-review.md` with:

```text
PHASE 4 STATUS: COMPLETE

Problem-to-landscape mapping:
[COMPLETE / INCOMPLETE]

Candidate gaps identified:
[NUMBER]

Validated gaps:
[NUMBER]

Rejected / false gaps:
[NUMBER]

Critical gaps:
[LIST]

Important gaps:
[LIST]

Uncertain gaps:
[LIST]

Evidence quality:
[SUFFICIENT / INSUFFICIENT]

Gap traceability:
[COMPLETE / INCOMPLETE]

Major contradictions:
[LIST]

Critical unresolved research questions:
[LIST]

Premature features or product decisions:
[NONE / LIST]

Reason Phase 4 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
```

If all mandatory criteria are satisfied:

> **SYNTHESIZE → VALIDATE → REVIEW → MARK COMPLETE → STOP.**

Do not proceed into requirements or product design within Phase 4.

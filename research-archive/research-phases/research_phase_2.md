# EXPECTED LEVEL OF DETAIL

Phase 2 must go significantly deeper than Phase 1.

Phase 1 established:

> **"What is this domain and how does it work?"**

Phase 2 must establish:

> **"What exactly is the problem occurring within this domain, how does it occur, who experiences it, why does it happen, and where does the existing process fail?"**

The output should be **problem-research grade**, not a superficial problem statement expansion.

---

## 1. Required Depth

For every major problem area, do not stop at describing the problem.

Investigate the chain:

```text
Context
   ↓
Actor
   ↓
Intent
   ↓
Action
   ↓
System state
   ↓
Scam / failure mechanism
   ↓
Observable consequence
   ↓
Impact
   ↓
Current response
   ↓
Remaining problem
```

The exact structure may differ depending on the scenario.

The objective is to understand the **causal mechanics of the problem**.

---

# 2. Problem Statement Must Be Deconstructed

Do not treat:

> "Agentic Guardian for Real-Time Payment Scam Interception"

as a single concept.

Break it down and determine what each important term actually implies about the problem.

For each major term, document:

- literal meaning
- domain meaning
- operational meaning
- implications
- ambiguities
- assumptions
- evidence
- unanswered questions

Do not assume that the wording of the problem statement accurately describes the complete underlying problem.

Challenge it.

---

# 3. Evidence Depth

Do not build the problem model from intuition alone.

Use evidence to establish:

- that the problem occurs
- how it occurs
- who is affected
- how frequently / materially it occurs where reliable data exists
- what forms it takes
- what consequences it creates
- what mechanisms contribute to it
- what existing responses exist at a conceptual level

Prioritize primary and authoritative evidence.

Where quantitative evidence exists, capture:

- metric
- value
- date/time period
- geography
- population/sample
- methodology if available
- source

Never present an isolated statistic without its context.

---

# 4. Scenario Depth

Develop **representative end-to-end scenarios**.

Each important scenario should capture:

```text
Scenario
├── Initial condition
├── Actors
├── Victim state
├── Attacker/scammer objective
├── Interaction / deception mechanism
├── Payment initiation
├── Authentication / authorization
├── Transaction progression
├── Point of failure
├── Consequence
├── Current response
└── Why the problem persists
```

Do not manufacture scenarios and present them as real-world evidence.

Clearly distinguish:

- documented real-world scenario
- synthesized scenario based on multiple sources
- hypothetical scenario

---

# 5. Failure-Mode Depth

Do not merely list:

> "Scams are difficult to detect."

Break the statement down.

Ask:

- difficult for whom?
- at what stage?
- because of what information?
- because of what behavior?
- because of what system constraint?
- because of what timing constraint?
- because of what attacker behavior?
- because of what legitimate-user behavior?
- what happens if the failure occurs?
- what happens afterward?

Represent important failure modes using a structured format:

| Failure mode | Cause | Stage | Actor affected | Consequence | Existing response | Residual problem | Evidence |
| ------------ | ----- | ----- | -------------- | ----------- | ----------------- | ---------------- | -------- |

---

# 6. Actor Understanding

Do not merely create a stakeholder list.

For important actors, determine:

- goals
- incentives
- responsibilities
- capabilities
- information available
- information unavailable
- decisions they make
- constraints
- failure modes
- conflicts of interest where relevant

The goal is to understand **why the problem exists within the ecosystem**, not simply who participates in it.

---

# 7. Temporal Depth

Because the problem includes "real-time", analyze the problem across time.

Determine:

- what happens before a transaction
- what happens during transaction initiation
- what happens during authorization
- what happens immediately after authorization
- what happens after completion
- what happens after fraud/scam recognition
- when intervention is still potentially meaningful
- when intervention becomes increasingly difficult

Do not turn these observations into latency requirements yet.

---

# 8. Distinguish Problem Classes

Where multiple problem types exist, separate them.

For example:

```text
Unauthorized transaction
        ≠
Authorized fraudulent transaction
        ≠
Scam-induced authorized transaction
        ≠
Compromised account
        ≠
Compromised device
```

Do not force everything into one "payment scam" category.

Determine which distinctions are actually supported by evidence and relevant to the problem.

---

# 9. Current-State Understanding

Document what happens **today**, at a conceptual/operational level.

Investigate:

- what users currently do
- what institutions currently do
- what systems currently do
- where detection occurs
- where intervention occurs
- what reporting mechanisms exist
- what happens after a suspected scam
- what happens after a completed fraudulent transaction

This is not yet a competitive-product study.

The purpose is to establish the **current problem environment**.

---

# 10. Problem Boundaries

Explicitly establish:

### Inside the problem

What is genuinely part of the problem?

### Adjacent

What is related but not necessarily part of it?

### Outside

What should not be treated as part of this project?

Also document boundary uncertainties.

Do not create artificial boundaries merely to make the project easier.

---

# 11. Severity & Impact

Where evidence permits, characterize impact across dimensions such as:

- financial loss
- time loss
- operational burden
- user harm
- institutional burden
- recovery difficulty
- trust/reputation
- downstream financial movement

Do not assign arbitrary severity scores without evidence.

If a severity assessment is your interpretation, label it explicitly.

---

# 12. Causal Reasoning

For major problem areas, try to answer:

> **Why does this problem happen?**

Do not stop at symptoms.

Build causal chains where possible:

```text
Underlying condition
        ↓
Attacker opportunity
        ↓
Victim manipulation / system weakness
        ↓
Payment action
        ↓
Detection limitation
        ↓
Delayed intervention
        ↓
Loss / downstream consequence
```

The actual causal structure must be derived from research.

---

# 13. Unknowns Must Remain Unknown

Do not fill missing information with assumptions merely to create a clean narrative.

Explicitly classify information as:

- Established fact
- Strongly supported finding
- Reasonable interpretation
- Hypothesis
- Assumption
- Unknown
- Conflicting evidence

This distinction is mandatory.

---

# 14. Independent Investigation

After completing the predefined framework, independently ask:

> **"If I were responsible for understanding this problem before allowing an engineering team to build anything, what would I still want to know?"**

Investigate additional areas that emerge.

Do not restrict yourself to the prompt's headings.

However, every additional investigation must have a clear connection to understanding the actual problem.

---

# 15. No Solution Leakage

During this phase, you may identify:

> **"There appears to be a failure at this point in the process."**

You may NOT jump to:

> **"Therefore we need feature X."**

If a possible intervention naturally emerges, record it only as a **problem/intervention hypothesis**, without turning it into a requirement or feature.

Example:

```text
Observed problem:
Users may authorize payments while under active social engineering.

Potential intervention point:
Transaction authorization stage.

What is NOT yet concluded:
Whether, how, or with what technology intervention should occur.
```

---

# 16. Expected Deliverable Quality

The final documentation should allow a reader to answer:

### What is happening?

### Why is it happening?

### Who is affected?

### When does it happen?

### How does it happen?

### What makes it difficult?

### What happens when it goes wrong?

### What is currently done?

### Where do current mechanisms appear insufficient?

### What do we still not know?

If these questions cannot be answered from the documentation, Phase 2 is incomplete.

---

# 17. Target Size

Do not impose a fixed page count.

As a rough guideline, expect the Phase 2 knowledge base to be approximately **20,000–40,000 words**, depending on the complexity and amount of evidence uncovered.

This is NOT a target to hit.

A concise, evidence-dense 15,000-word analysis is better than a padded 40,000-word document.

Likewise, exceeding 40,000 words is justified if the additional material resolves important uncertainty.

Prioritize:

> **Evidence density > word count.**

---

# 18. Research Quality Standard

For significant conclusions, aim for **triangulation**.

Where possible, establish important findings through multiple evidence types:

- regulatory/institutional evidence
- incident or industry data
- academic research
- operational documentation
- credible reporting
- documented case studies

A single anecdote should not establish a systemic problem.

A single vendor's marketing claim should not establish an industry-wide capability or failure.

---

# 19. Final Critical Review

Before declaring Phase 2 complete, perform an adversarial review.

Ask:

### Are we describing the actual problem or merely repeating the SIH wording?

### Are our claims evidence-backed?

### Have we confused symptoms with root causes?

### Have we conflated scams with other forms of fraud?

### Have we accidentally assumed the solution?

### Have we ignored inconvenient evidence?

### Are there contradictory sources?

### Are there important actor perspectives missing?

### Are our scenarios representative or cherry-picked?

### Are there important unknowns being hidden behind assumptions?

### Could another researcher independently reproduce our understanding from the cited evidence?

Document the answers.

---

# PHASE 2 STANDARD

The final standard is:

> **A defensible, evidence-backed model of the problem that is detailed enough to allow the team to discover meaningful gaps and requirements later—without those gaps or requirements having been predetermined by us.**

In other words:

**Phase 1 = Understand the domain.**

**Phase 2 = Understand the actual problem within that domain.**

Do not move from:

> "This is a problem"

directly to:

> "Here is our solution."

The purpose of Phase 2 is to make the intermediate understanding rigorous enough that whatever comes next is **discovered from evidence rather than invented first and justified afterward.**

part b:

# EXPLICIT STOP & EXIT CRITERIA

## STOP CONDITION

**STOP Phase 2 immediately when all mandatory exit criteria below are satisfied.**

Do not continue researching simply because additional information exists.

The existence of more possible research does **not** mean Phase 2 is incomplete.

The objective is to reach **sufficient problem understanding**, not exhaustive knowledge of the entire payment-scam domain.

Once the exit criteria are satisfied:

1. finalize the Phase 2 documentation
2. perform the final critical review
3. record remaining uncertainties
4. record unresolved research questions
5. record what evidence is still unavailable
6. mark Phase 2 as **COMPLETE**
7. STOP

Do **not** begin the next phase.

---

# MANDATORY EXIT CRITERIA

Phase 2 may be marked **COMPLETE** only if all of the following are true.

## 1. Problem Definition

We can clearly explain:

- what the core problem is
- what makes it a problem
- who experiences it
- under what circumstances it occurs
- what consequences result

The explanation must go beyond simply repeating the SIH problem statement.

---

## 2. Problem Mechanics

For each major problem class identified, we understand the relevant causal chain:

```text
Cause / Context
      ↓
Actor behavior
      ↓
Scam / failure mechanism
      ↓
Payment interaction
      ↓
System / human limitation
      ↓
Outcome
```

Where the evidence does not allow a complete causal chain, the missing portion is explicitly marked as unknown.

---

## 3. Actor Model

The major actors relevant to the problem have been identified and their:

- goals
- responsibilities
- capabilities
- constraints
- information
- limitations
- interactions

are sufficiently understood.

---

## 4. Scenario Coverage

The major representative problem scenarios discovered during research have been documented.

Each important scenario clearly distinguishes:

- real-world evidence
- synthesized scenario
- hypothetical scenario

No hypothetical scenario is being presented as evidence.

---

## 5. Problem Boundaries

The documentation clearly identifies:

- what is inside the problem
- what is adjacent
- what is outside scope
- what boundaries remain uncertain

---

## 6. Failure Modes

The important failure modes have been identified and analyzed.

For each significant failure mode, we understand, where evidence permits:

- cause
- stage
- affected actor
- mechanism
- consequence
- existing response
- residual difficulty

---

## 7. Temporal Understanding

We understand the problem across the relevant payment timeline:

- before payment
- payment initiation
- authentication / authorization
- transaction processing
- transaction completion
- immediate aftermath
- post-transaction discovery / response

We understand where timing appears to matter.

We have **not** prematurely converted this into technical latency requirements.

---

## 8. Current-State Understanding

We have sufficient understanding of what currently happens when relevant scam/fraud situations occur, including:

- user actions
- institutional actions
- system behavior
- detection
- intervention
- reporting
- post-transaction response

Where the current state cannot be established reliably, that uncertainty is documented.

---

## 9. Evidence Quality

Major problem claims are supported by credible evidence.

Important claims are not based solely on:

- intuition
- assumptions
- vendor marketing
- isolated anecdotes
- unsupported statistics

Evidence limitations are explicitly documented.

---

## 10. Conceptual Distinctions

The research clearly distinguishes relevant concepts, including where applicable:

- scam vs fraud
- authorized vs unauthorized transaction
- social engineering vs technical compromise
- detection vs intervention
- pre-transaction vs transaction-time vs post-transaction response

Additional distinctions should be included where the research demonstrates they matter.

---

## 11. Unknowns Register

There is an explicit record of:

- unresolved questions
- missing evidence
- conflicting evidence
- uncertain assumptions
- areas requiring further investigation

Unknowns do **not** prevent completion if they have been properly documented and are not critical to establishing the basic problem model.

---

## 12. No Premature Solution

The documentation does NOT contain:

- a final feature list
- finalized product requirements
- architecture
- technology selection
- ML model selection
- LLM/agent design
- implementation decisions
- an MVP specification

Potential intervention points may be recorded only as **observed opportunities or hypotheses**, not as committed solutions.

---

## 13. Independent Review Completed

The final review must explicitly answer:

> **"What important aspect of the problem might we still be misunderstanding?"**

The researcher must actively attempt to falsify the current problem model.

If a significant weakness is discovered:

1. research it
2. update the documentation
3. repeat the review

Do not mark the phase complete while a known critical contradiction remains unresolved.

---

# COMPLETENESS TEST

Before stopping, perform this final test.

A new team member should be able to read the Phase 2 documentation and answer:

> **What exactly is the problem?**

> **How does it happen?**

> **Who is involved?**

> **Who is harmed or burdened?**

> **Why is it difficult?**

> **When does the problem become consequential?**

> **Where do existing processes encounter difficulty?**

> **What evidence proves or supports these conclusions?**

> **What remains unknown?**

If any of these questions cannot be answered adequately, determine whether additional research is genuinely required.

If yes → research the missing area.

If no → document the uncertainty and continue toward completion.

---

# RESEARCH STOP RULE

Use the following rule to prevent endless research:

> **Research another topic only if it can reasonably change, strengthen, weaken, qualify, or clarify our understanding of the problem.**

If additional research would merely:

- add another example of an already-established phenomenon
- repeat an established fact
- provide another definition of the same concept
- add unrelated domain knowledge
- explore potential technologies
- suggest product features

then **STOP researching that topic.**

---

# PHASE 2 COMPLETION STATEMENT

At the end of `phase-2-review.md`, include:

```text
PHASE 2 STATUS: COMPLETE

Problem understanding:
[COMPLETE / INCOMPLETE]

Evidence sufficiency:
[SUFFICIENT / INSUFFICIENT]

Actor understanding:
[SUFFICIENT / INSUFFICIENT]

Scenario coverage:
[SUFFICIENT / INSUFFICIENT]

Failure-mode understanding:
[SUFFICIENT / INSUFFICIENT]

Current-state understanding:
[SUFFICIENT / INSUFFICIENT]

Problem boundaries:
[DEFINED / PARTIALLY DEFINED]

Critical unknowns:
[LIST]

Critical contradictions:
[LIST]

Premature solution decisions:
[NONE / LIST]

Reason Phase 2 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
```

The status may be **COMPLETE** only when there are no unresolved **critical** deficiencies.

Non-critical unknowns should be carried forward explicitly rather than forcing artificial certainty.

---

# FINAL INSTRUCTION TO THE AGENT

**Do not continue into another phase after achieving these criteria.**

Your job is not to maximize research volume.

Your job is to produce the **minimum sufficient, evidence-backed understanding of the problem required to responsibly proceed**.

Once that standard is met:

> **DOCUMENT → REVIEW → MARK COMPLETE → STOP.**

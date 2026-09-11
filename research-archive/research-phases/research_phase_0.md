# PHASE 0 — PROJECT CONTEXT & PROBLEM STATEMENT UNDERSTANDING

## Role

Act as a **research lead and domain analyst** helping a team begin a project based on the following problem statement:

> **Agentic Guardian for Real-Time Payment Scam Interception**

Your task in this phase is **NOT to design the solution**.

You are establishing the factual foundation from which later research will be conducted.

Think of this phase as answering:

> **"What exactly are we dealing with, what do we currently know, what information has been given to us, and what do we need to understand before we can intelligently research this problem?"**

---

# PRIMARY OBJECTIVE

Create a clear and evidence-based **Phase 0 Project Context Document**.

The document should establish:

1. What the problem statement actually says.
2. What the terminology in the problem statement means at a basic level.
3. What is explicitly stated versus what we are interpreting.
4. What the apparent objective of the problem is.
5. Who may be involved in or affected by the problem.
6. What context is already known.
7. What context is missing.
8. What constraints are known.
9. What assumptions would be dangerous to make at this stage.
10. What questions need to be answered in subsequent research.

Do NOT attempt to answer all of those questions through speculation.

Where information is unavailable, explicitly mark it as:

> **Unknown / Requires Research**

---

# IMPORTANT: DO NOT SOLVE THE PROBLEM YET

At this stage, do NOT:

- design an architecture
- propose features
- select technologies
- select ML models
- design agents
- propose databases
- propose APIs
- design security mechanisms
- create a technical implementation
- decide what the MVP should be
- claim that a particular approach is the solution
- manufacture gaps in the existing ecosystem

You may mention a concept if it is necessary to understand the problem statement, but **do not turn that concept into a proposed solution**.

For example, if discussing "agentic", explain what the term generally means and identify possible interpretations.

Do NOT conclude:

> "Therefore our system should use multiple AI agents."

That belongs to a later phase.

---

# PART 1 — PRESERVE THE ORIGINAL PROBLEM STATEMENT

Start by recording the problem statement exactly:

> **Agentic Guardian for Real-Time Payment Scam Interception**

If additional official information about the problem statement is available, identify it separately.

Clearly distinguish:

### Official information

Information explicitly provided by the problem statement or its issuing authority.

### Our interpretation

Reasonable interpretation of the wording.

### Unknown

Information that cannot currently be established.

Do not mix these three.

---

# PART 2 — DECOMPOSE THE WORDING

Analyze the terminology at a **conceptual level only**.

Break down:

- Agentic
- Guardian
- Real-Time
- Payment
- Scam
- Interception

For each term, explain:

1. Basic meaning.
2. Meaning in the context of this problem.
3. Possible interpretations.
4. Ambiguities.
5. Questions that need further research.

Do not select one interpretation prematurely when multiple interpretations are plausible.

Example structure:

| Term | Basic meaning | Possible meaning here | Ambiguity | Needs research? |
| ---- | ------------- | --------------------- | --------- | --------------- |

---

# PART 3 — WHAT PROBLEM IS BEING DESCRIBED?

Without proposing a solution, try to understand the underlying problem.

Answer questions such as:

- What appears to be going wrong?
- Who experiences the problem?
- At what point does the problem occur?
- What is the apparent consequence?
- What makes this problem difficult?
- What part of the payment process appears relevant?
- Is the problem primarily about fraud, scams, payment security, user behavior, transaction monitoring, or something else?
- Are these distinctions currently clear or do they require research?

Be careful:

**Do not invent facts merely because they sound plausible.**

When something is not established, say so.

---

# PART 4 — INITIAL STAKEHOLDER MAP

Identify potential stakeholders at a high level.

Consider whether the problem could involve:

- payment users
- victims
- banks
- payment service providers
- payment applications
- payment networks
- merchants
- beneficiaries
- fraud/security teams
- regulators
- law enforcement
- other ecosystem participants

Do not assume all of these are stakeholders.

Determine which ones appear relevant and explain why.

For each stakeholder, document:

| Stakeholder | Possible role | Relationship to problem | Confidence |
| ----------- | ------------- | ----------------------- | ---------- |

Keep this preliminary.

The purpose is to identify **who we may need to study later**, not to define their requirements yet.

---

# PART 5 — SYSTEM / ECOSYSTEM BOUNDARY

At a high level, determine what ecosystem this problem appears to sit within.

For example, investigate whether understanding the following will eventually be necessary:

- digital payments
- banking
- payment networks
- payment applications
- transaction processing
- authentication
- fraud management
- cybersecurity
- regulatory systems
- users and social engineering

Do not assume these are all in scope.

Instead create:

### Clearly relevant

### Potentially relevant

### Probably outside the problem

### Unknown / requires investigation

The purpose is to prevent the project from becoming unnecessarily broad.

---

# PART 6 — KNOWN CONSTRAINTS

Identify any constraints that are already explicitly known.

Examples of constraint categories:

- competition constraints
- geographical context
- payment-system constraints
- regulatory constraints
- data availability
- privacy
- security
- real-time requirements
- integration limitations
- prototype limitations
- infrastructure limitations

Only record a constraint as **known** if there is evidence for it.

Otherwise classify it as:

> Potential constraint — requires research/validation.

---

# PART 7 — INITIAL ASSUMPTION REGISTER

Create a table of assumptions that a team might naturally make at the beginning.

For each:

| Assumption | Why someone might assume it | Is it verified? | What would verify it? |
| ---------- | --------------------------- | --------------- | --------------------- |

Examples can include assumptions about:

- what "real-time" means
- what constitutes a scam
- who is responsible for intervention
- whether transactions can actually be intercepted
- what information is available during a payment
- whether users can be queried during payment
- whether external intelligence is available
- whether the system operates inside a bank, payment application, or independently

**Do not resolve these assumptions unless reliable evidence is available.**

The purpose is to expose them so later research can validate or invalidate them.

---

# PART 8 — INITIAL KNOWLEDGE MAP

Create four categories:

## We know

Facts currently established.

## We reasonably understand

Concepts that have a reasonable preliminary interpretation but may require deeper research.

## We don't know

Important missing information.

## We should investigate

Questions or areas that need research.

This section should become the starting point for Phase 1.

---

# PART 9 — RESEARCH QUESTION BACKLOG

Based ONLY on what you discover in Phase 0, create a preliminary list of questions that later research should answer.

Do not answer them now.

Examples of question types:

### Domain questions

"What exactly is the relevant payment ecosystem?"

### Problem questions

"What types of scams fall under this problem?"

### Operational questions

"Where in the payment lifecycle could intervention theoretically occur?"

### Regulatory questions

"What rules govern fraud monitoring and payment intervention?"

### Technical questions

"What information is available at transaction time?"

### User questions

"What does the victim experience during a scam?"

Do NOT restrict yourself to these examples.

Generate the questions that YOU independently determine are necessary.

Prioritize them:

- Critical
- Important
- Useful
- Optional

---

# PART 10 — INDEPENDENT BRAINSTORM

This is deliberately separate from the structured methodology above.

Now temporarily ignore the framework and ask yourself:

> **"If I were responsible for understanding this problem from scratch, what would I want to know before allowing a team to start designing a solution?"**

Brainstorm anything that appears missing.

You may identify:

- additional background areas
- additional stakeholders
- hidden assumptions
- missing constraints
- ambiguous terminology
- missing context
- questions
- risks in our current understanding
- potentially important dimensions of the problem

Do NOT turn these into product features.

Label every addition:

> **Independent Recommendation**

and explain why you think it should be investigated.

---

# PART 11 — PHASE 0 CRITICAL REVIEW

Before finishing, critically review your own work.

Ask:

### Completeness

What important contextual information might still be missing?

### Premature assumptions

Did we accidentally assume a solution?

### Scope

Have we made the problem too broad or too narrow?

### Terminology

Are any key terms ambiguous?

### Evidence

Which statements are facts and which are interpretations?

### Unknowns

What could substantially change our understanding if discovered later?

### Research readiness

Do we now have a sufficiently clear starting point for deeper domain research?

---

# REQUIRED OUTPUT

Produce a single primary Markdown document:

```text
00-project-context.md
```

Use the following structure:

```text
# Agentic Guardian for Real-Time Payment Scam Interception

## 1. Problem Statement

## 2. Officially Known Information

## 3. Terminology Decomposition

## 4. Preliminary Problem Understanding

## 5. Preliminary Stakeholder Map

## 6. Initial Ecosystem Boundary

## 7. Known Constraints

## 8. Assumption Register

## 9. Knowledge Map

### 9.1 What We Know
### 9.2 What We Reasonably Understand
### 9.3 What We Don't Know
### 9.4 What Requires Investigation

## 10. Preliminary Research Question Backlog

## 11. Independent Recommendations

## 12. Phase 0 Critical Review

## 13. Phase 0 Exit Criteria

## 14. Sources
```

---

# SOURCE DISCIPLINE

Use external research where necessary to establish factual context.

Prefer:

1. official sources
2. government/regulatory sources
3. payment-network documentation
4. reputable industry sources
5. academic sources

Record sources clearly.

Do not flood the document with citations for basic reasoning.

More importantly, **do not cite a source as evidence for a claim unless the source actually supports that claim.**

---

# PHASE 0 EXIT CRITERIA

Consider Phase 0 complete only if the resulting document allows a new team member to answer:

> What problem statement are we working on?

> What do the important words in it mean?

> What do we actually know right now?

> What are we merely assuming?

> Who and what appears to be involved?

> What don't we know?

> What questions must we investigate next?

The goal is **clarity, not completeness**.

Do not try to finish the entire project in Phase 0.

---

# FINAL INSTRUCTION

Be intellectually independent.

The framework above tells you **how to investigate**, not **what conclusions to reach**.

If your research shows that our initial framing is wrong, say so.

If something appears irrelevant, say so.

If an important dimension is missing, add it.

If there is insufficient evidence, mark it as unknown.

Do not optimize your answer for producing an impressive-looking project.

Optimize it for producing an **accurate starting point for the next phase of research**.

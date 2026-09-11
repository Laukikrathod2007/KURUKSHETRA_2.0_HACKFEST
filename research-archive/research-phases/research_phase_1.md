# PHASE 1 — DOMAIN & BACKGROUND KNOWLEDGE

## Role

Act as a **domain research lead** for the project:

> **Agentic Guardian for Real-Time Payment Scam Interception**

Phase 0 has already established the initial project context.

Your task in this phase is to build the **foundational domain knowledge required to properly understand the problem space before conducting solution-oriented research**.

You are NOT designing the product.

You are NOT identifying the final gaps.

You are NOT deciding what we should build.

You are building the team's understanding of the world in which this problem exists.

---

# CORE OBJECTIVE

Answer:

> **"What does our team need to understand about payments, scams, fraud, security, and the surrounding ecosystem before we can intelligently research this problem?"**

The goal is **domain literacy**, not solution design.

Someone who has never worked in payment systems should be able to read the resulting documentation and understand the relevant ecosystem and terminology.

---

# USE PHASE 0 AS CONTEXT

First read the completed Phase 0 documentation.

Use it to understand:

- the problem statement
- terminology already identified
- known context
- known stakeholders
- identified uncertainties
- initial research questions

However, do not simply repeat Phase 0.

Use Phase 0 to determine **what background knowledge needs to be established**.

If Phase 0 contains incorrect assumptions or missing areas, identify them.

---

# IMPORTANT BOUNDARY

Do NOT prematurely research:

- specific product features
- final system architecture
- ML model selection
- LLM architecture
- agent frameworks
- database choices
- implementation
- MVP design
- final requirements
- final gap analysis
- technology stack

Those belong to later stages.

You may explain technologies or concepts when they are **part of the existing domain**, but do not evaluate them as potential components of our solution yet.

For example:

It is appropriate to explain:

> What transaction monitoring is.

It is NOT appropriate to conclude:

> Therefore our system should use transaction monitoring with XGBoost.

---

# RESEARCH PRINCIPLE

Do not assume that every possible background topic is relevant.

Start with the problem context and determine:

> **What knowledge is necessary to understand this domain properly?**

You are expected to independently identify missing areas.

The structure below is a starting framework, not a complete list.

---

# PART 1 — PAYMENT SYSTEM FUNDAMENTALS

Build the basic conceptual model of digital payments relevant to the problem.

Investigate as appropriate:

- what constitutes a digital payment
- major participants
- payer
- payee / beneficiary
- banks
- payment service providers
- payment applications
- payment networks
- merchants
- intermediaries
- transaction authorization
- transaction processing
- settlement
- payment lifecycle
- transaction states

Explain the concepts in a way that makes their relationships clear.

Where relevant, show flows using Mermaid diagrams.

For example, if appropriate, explain:

```text
User
 ↓
Payment Application
 ↓
Payment Service Provider
 ↓
Bank / Payment Network
 ↓
Beneficiary Bank
 ↓
Beneficiary
```

Do not assume this exact flow applies universally.

Research and document the appropriate model.

---

# PART 2 — RELEVANT PAYMENT ECOSYSTEM

Determine what payment ecosystem is relevant to this problem.

Because the project may involve the Indian digital-payment environment, investigate relevant Indian payment infrastructure and institutions where appropriate.

Potential areas include:

- UPI
- banks
- PSPs
- payment applications
- NPCI
- RBI
- merchants
- beneficiaries
- authentication mechanisms
- transaction processing

Do not assume every component is relevant.

Determine relevance from authoritative sources.

Document:

- what each component is
- what role it plays
- how it interacts with others
- what information or control it may have
- what it does not control

---

# PART 3 — FRAUD FUNDAMENTALS

Establish what "payment fraud" means.

Research:

- fraud
- financial fraud
- payment fraud
- unauthorized transactions
- account takeover
- identity-related fraud
- transaction fraud
- fraudulent beneficiaries
- mule accounts
- suspicious transactions

The goal is not to catalogue every fraud type.

The goal is to understand the **fundamental concepts and terminology**.

Clearly distinguish concepts that are commonly confused.

---

# PART 4 — SCAM FUNDAMENTALS

Establish what a "scam" means in the context of payments.

Understand:

- scams
- social engineering
- deception
- manipulation
- victim authorization
- scammer-controlled payment flows
- scam-induced transactions

Investigate the conceptual difference between:

> A transaction made without the user's authorization

and

> A transaction the user authorizes because they have been deceived.

Do not yet determine how our system should detect these.

The purpose is simply to understand the phenomenon.

---

# PART 5 — FRAUD VS SCAM VS CYBERSECURITY INCIDENT

Build a clear conceptual distinction between related areas.

Investigate where these concepts overlap and where they differ:

- fraud
- scam
- cybercrime
- account compromise
- credential theft
- malware
- social engineering
- payment fraud
- unauthorized payment
- authorized scam-induced payment

Create a comparison table.

The goal is to prevent the team from using these terms interchangeably later.

---

# PART 6 — PAYMENT SCAM MECHANISMS

Develop foundational knowledge about how payment scams operate.

Do NOT yet perform the complete threat/scam landscape research.

Instead understand the general mechanics:

- how victims are approached
- how trust is established
- how deception influences payment behavior
- how payment requests are generated
- how beneficiaries are involved
- how funds move
- how scammers attempt to extract value
- what makes scam transactions difficult to distinguish from legitimate transactions

Use representative examples only where useful.

The objective is **mechanistic understanding**, not an exhaustive taxonomy.

---

# PART 7 — PAYMENT SECURITY FUNDAMENTALS

Build the background knowledge required to understand payment security.

Investigate concepts such as:

- authentication
- authorization
- identity verification
- transaction authorization
- device identity
- device binding
- credentials
- PINs
- biometrics
- MFA
- encryption
- secure communication
- tokenization
- transaction integrity
- account security

For each concept, explain:

- what it protects
- what it does not protect
- where it occurs in a payment flow
- why it exists

Do not evaluate whether our eventual system should use these mechanisms.

---

# PART 8 — FRAUD/RISK MANAGEMENT FUNDAMENTALS

Understand how organizations conceptually manage payment risk.

Investigate:

- fraud detection
- transaction monitoring
- risk scoring
- anomaly detection
- behavioral monitoring
- transaction profiling
- customer profiling
- velocity monitoring
- suspicious activity
- alerts
- intervention
- investigation
- case management
- fraud response

Again:

**Explain the domain concepts.**

Do not yet research which existing companies implement them or decide which ones our system needs.

---

# PART 9 — REAL-TIME CONCEPTS

The problem statement explicitly uses:

> **Real-Time**

Therefore establish foundational knowledge around what this means in payment systems.

Investigate:

- real-time payments
- transaction-time decisions
- streaming events
- latency
- synchronous vs asynchronous processing
- pre-transaction checks
- transaction-time checks
- post-transaction monitoring

Do not invent a latency target.

Instead explain:

- what real-time means conceptually
- why timing matters in payments
- what changes when a decision is delayed
- what "too late" could mean conceptually

Specific technical requirements will be researched later.

---

# PART 10 — INTERCEPTION FUNDAMENTALS

Understand the terminology around responding to suspicious payments.

Distinguish between:

- detection
- alerting
- warning
- authentication
- challenge
- intervention
- blocking
- holding
- cancellation
- reversal
- investigation
- post-transaction response

Do not decide which response our project should implement.

The purpose is to understand the vocabulary and operational concepts.

---

# PART 11 — MONEY MOVEMENT & MULE ACCOUNTS

Establish basic domain understanding of what happens after fraudulent/scam-related funds are received.

Investigate:

- mule accounts
- fund movement
- rapid transfers
- layering
- cash-out
- beneficiary networks
- suspicious transaction patterns

Do not yet design graph-based solutions.

The goal is simply to understand why the movement of funds may be relevant to payment scams.

---

# PART 12 — REGULATORY / INSTITUTIONAL BACKGROUND

Identify the major institutions and frameworks relevant to the problem.

Prioritize authoritative sources.

Where applicable investigate:

- RBI
- NPCI
- government cybercrime initiatives
- financial-sector guidance
- payment security requirements
- fraud reporting
- consumer protection
- relevant regulatory terminology

Do not perform a complete regulatory/legal analysis.

The goal is to establish the background needed to understand the ecosystem.

Clearly flag anything requiring dedicated legal/regulatory research later.

---

# PART 13 — DATA & INFORMATION FUNDAMENTALS

Without designing our data architecture, establish what kinds of information generally exist around a payment.

Investigate categories such as:

- transaction information
- account information
- beneficiary information
- device information
- authentication information
- behavioral information
- temporal information
- geographic information
- network relationships
- fraud indicators
- user-reported information

For each category determine at a conceptual level:

- what it represents
- where it may originate
- when it may exist
- whether it is generally sensitive
- what limitations may exist around access

Do not assume our eventual system will have access to any particular data.

---

# PART 14 — PRIVACY & SECURITY CONTEXT

Build foundational understanding of why payment data is sensitive.

Investigate concepts such as:

- financial privacy
- personal data
- sensitive information
- data minimization
- access control
- encryption
- auditability
- data retention
- secure processing

Do not design our security architecture.

The goal is to understand the constraints surrounding the domain.

---

# PART 15 — DOMAIN GLOSSARY

Create a comprehensive but practical glossary.

Include terms that a new team member is likely to encounter during later research.

For each term:

```text
Term
Definition
Context in this project
Common confusion / distinction
Source
```

Prioritize terms that affect understanding of the problem.

Do not create an unnecessarily huge dictionary.

---

# PART 16 — KNOWLEDGE DEPENDENCIES

After researching the above, determine:

> **What background concepts depend on other concepts?**

Create a conceptual dependency map.

For example:

```text
Payment ecosystem
       ↓
Payment lifecycle
       ↓
Transaction processing
       ↓
Authentication / authorization
       ↓
Fraud / scam
       ↓
Risk management
```

The actual dependency structure should come from your analysis.

---

# PART 17 — INDEPENDENT BRAINSTORM

Now step outside the provided framework.

Ask:

> **"What background knowledge would I personally want the team to possess before beginning serious research into Agentic Guardian for Real-Time Payment Scam Interception?"**

Independently brainstorm:

- missing domain areas
- terminology
- institutions
- technical concepts
- operational concepts
- regulatory concepts
- security concepts
- user concepts
- financial concepts

You are explicitly encouraged to add areas not mentioned in this prompt.

For every addition, label it:

> **Independent Recommendation**

and explain:

- what it is
- why it matters
- whether it is essential, useful, or optional

Do NOT turn the recommendation into a product feature.

---

# PART 18 — KNOWLEDGE GAPS

At the end of Phase 1, identify:

> **What do we still not understand about the domain?**

This is different from identifying product gaps.

We are asking:

> "What don't WE know yet?"

Examples may include:

- unclear payment mechanics
- unclear regulatory constraints
- unclear data availability
- unclear terminology
- unclear stakeholder responsibilities
- unclear scam mechanisms

For each:

| Knowledge gap | Why it matters | Research needed | Priority |
| ------------- | -------------- | --------------- | -------- |

---

# PART 19 — PHASE 1 REVIEW

Critically review the research.

Ask:

### Completeness

Do we understand the fundamental domain well enough?

### Accuracy

Are definitions supported by reliable sources?

### Terminology

Are commonly confused concepts clearly separated?

### Scope

Did we research too much or too little?

### Bias

Did we accidentally begin designing our solution?

### Missing knowledge

What important background area did we overlook?

### Conflicts

Do authoritative sources disagree?

### Readiness

What must be understood before moving to the next phase?

---

# OUTPUT

Create a structured Markdown knowledge base under:

```text
01-background/
```

At minimum:

```text
01-background/
├── payments-overview.md
├── payment-ecosystem.md
├── payment-lifecycle.md
├── fraud-fundamentals.md
├── scam-fundamentals.md
├── fraud-vs-scam.md
├── payment-security.md
├── risk-management.md
├── real-time-payments.md
├── interception-concepts.md
├── money-mules-and-fund-movement.md
├── regulatory-background.md
├── data-information-context.md
├── privacy-security-context.md
├── glossary.md
├── knowledge-dependencies.md
├── knowledge-gaps.md
└── phase-1-review.md
```

You may modify this structure if your research indicates a better organization.

If you add/remove documents, explain why.

---

# SOURCE REQUIREMENTS

Use authoritative sources wherever possible.

Prioritize:

1. government/regulatory sources
2. payment-network documentation
3. official institutional documentation
4. standards organizations
5. peer-reviewed academic research
6. reputable industry sources

For every significant factual claim, maintain source traceability.

Do not rely on a single source for important concepts when multiple authoritative sources are available.

Where information is uncertain or conflicting, explicitly say so.

---

# WHAT "DONE" MEANS

Phase 1 is complete when a technically capable person who knows nothing about payment scams can read the documentation and understand:

- the relevant payment ecosystem
- how payments conceptually work
- the relevant actors
- what fraud means
- what scams mean
- how scams differ from fraud and cybersecurity incidents
- basic payment security concepts
- basic risk-management concepts
- what real-time means in this context
- what interception-related terminology means
- how money-mule/fund-movement concepts fit into the domain
- relevant institutional/regulatory context
- important data categories
- important terminology

AND:

> We have a clearly documented list of what we still need to learn.

Do NOT proceed into solution design.

Do NOT declare product gaps.

Do NOT produce a final feature list.

Do NOT select technologies.

The output of this phase should be **domain knowledge, not a solution.**

# EXPECTED LEVEL OF DETAIL

The output must be **research-grade and reusable as a project knowledge base**.

Do NOT optimize for brevity.
Do NOT optimize for maximum volume either.

The target is:

> **Enough depth that the team can make informed decisions in later phases without repeatedly relearning the domain.**

## 1. Depth Standard

For every major domain concept, explain at least:

1. **What it is**
2. **Why it exists**
3. **How it works conceptually**
4. **Where it appears in the payment/scam ecosystem**
5. **Who is involved**
6. **What information or state is relevant**
7. **What its limitations are**
8. **How it relates to adjacent concepts**
9. **Why understanding it matters for this problem**
10. **Authoritative sources supporting the explanation**

Do not stop at one-sentence definitions when the concept materially affects understanding of the problem.

---

## 2. Use Layers of Detail

Organize information in layers.

### Layer 1 — Executive Understanding

A technically literate reader should be able to understand the concept in approximately **1–3 paragraphs**.

### Layer 2 — Mechanism

Explain the concept sufficiently to answer:

> "What actually happens?"

Use:

- process flows
- lifecycle diagrams
- tables
- examples
- state transitions
- actor relationships

where they improve understanding.

### Layer 3 — Technical / Operational Detail

Include deeper details when they are relevant to payment security or scam interception.

Examples:

- transaction states
- authentication vs authorization
- synchronous vs asynchronous processing
- transaction timing
- risk signals
- information sources
- institutional responsibilities
- operational limitations

Do not add technical details merely because they are interesting.

### Layer 4 — Boundaries and Exceptions

For important concepts, explicitly document:

- what the concept covers
- what it does not cover
- common misconceptions
- important exceptions
- cases where the model breaks down

This is especially important for concepts such as:

- fraud
- scam
- authorization
- authentication
- real-time
- interception
- risk
- suspicious transactions

---

# 3. Depth by Topic

Not every topic requires the same amount of research.

Use approximately these standards:

| Topic                       | Expected depth    |
| --------------------------- | ----------------- |
| Payment ecosystem           | Deep              |
| Payment lifecycle           | Deep              |
| Fraud fundamentals          | Deep              |
| Scam fundamentals           | Deep              |
| Fraud vs scam               | Deep              |
| Payment security            | Deep              |
| Risk/fraud management       | Deep              |
| Real-time payments          | Deep              |
| Interception concepts       | Deep              |
| Money mules / fund movement | Moderate–Deep     |
| Regulatory background       | Moderate          |
| Data/information context    | Moderate–Deep     |
| Privacy/security context    | Moderate          |
| Glossary                    | Broad but concise |

"Deep" does **not** mean exhaustive. It means the team should understand the mechanisms and boundaries well enough to reason about the problem later.

---

# 4. Diagrams Are Expected Where They Clarify the Domain

Do not turn the documentation into walls of text.

Use Mermaid diagrams where appropriate for:

- payment flows
- actor relationships
- transaction lifecycle
- scam mechanics
- authentication/authorization relationships
- fund movement
- information flows
- conceptual dependencies

Diagrams should represent researched concepts accurately.

Do not create architecture diagrams for our proposed product.

---

# 5. Examples Are Expected

Use representative examples when they make an abstract concept easier to understand.

For example, when explaining a scam concept, distinguish conceptually between scenarios such as:

```text
Scenario A:
User does not initiate or authorize the transaction.

Scenario B:
User authorizes the transaction after being deceived.

Scenario C:
User is manipulated into performing a sequence of legitimate payment actions.
```

The examples are for **domain understanding**, not for proposing detection rules or features.

---

# 6. Distinguish Fact From Interpretation

Every document should clearly distinguish:

### Established Fact

Directly supported by authoritative evidence.

### Research Finding

A conclusion derived from multiple pieces of evidence.

### Interpretation

A reasonable interpretation of the available evidence.

### Uncertainty

Something that could not be established confidently.

### Assumption

Something being temporarily assumed because evidence is unavailable.

Do not present interpretations or assumptions as facts.

---

# 7. Source Depth

For important topics, do more than find the first search result.

Aim for:

- multiple authoritative sources for foundational claims
- primary sources wherever available
- recent sources where the subject changes over time
- academic/technical literature for technical concepts
- regulatory/institutional sources for policy and ecosystem claims

For each important topic, the documentation should make it possible to answer:

> **"Where did this understanding come from?"**

---

# 8. Avoid Two Failure Modes

## Failure Mode A — Too Shallow

Avoid documentation like:

> "UPI is a real-time payment system developed by NPCI."

That is a definition, not domain understanding.

Instead explain the relevant ecosystem, actors, transaction flow, authentication/authorization context, lifecycle, and limitations at an appropriate conceptual level.

## Failure Mode B — Unfocused Over-Research

Do not spend dozens of pages explaining unrelated subjects merely because they are adjacent to payments.

For every section ask:

> **Does understanding this materially improve our ability to understand payment scams and the problem described in Phase 0?**

If no, omit it or mark it as optional background.

---

# 9. Target Size

Do not enforce an arbitrary page count.

As a rough expectation, the complete Phase 1 knowledge base will likely be in the range of **15,000–30,000 words**, depending on how much genuinely relevant domain complexity is uncovered.

This is a guideline, not a quota.

A shorter document is preferable to padded content.

A longer document is justified when the additional material resolves important domain complexity.

---

# 10. Quality Test

Before declaring Phase 1 complete, perform this test:

> **Could a new team member read these documents and explain the payment ecosystem, payment lifecycle, scam mechanics, fraud/scam distinction, security concepts, risk-management concepts, real-time constraints, relevant actors, and important terminology without needing a separate introductory course?**

If not, identify what is missing and research it.

The final standard is:

> **Comprehensive enough to establish domain competence; focused enough to remain a usable engineering/project knowledge base; neutral enough that it does not prematurely dictate the eventual solution.**

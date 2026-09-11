# PHASE 3 — EXISTING LANDSCAPE & PRIOR ART RESEARCH

## Role

Act as a **senior research analyst specializing in financial technology, payment security, fraud/scam prevention, cybersecurity, and applied AI systems**.

The project is:

> **Agentic Guardian for Real-Time Payment Scam Interception**

Phase 0 established the project context.

Phase 1 established the relevant domain and background knowledge.

Phase 2 established an evidence-backed understanding of the actual problem.

Your task now is to investigate:

> **What already exists to address this problem, how does it work, what approaches are being used, what capabilities exist today, and where do those approaches appear limited?**

This is **landscape research**, not product design.

---

# CORE OBJECTIVE

Answer:

> **"If we were entering this problem space today, what would we discover already exists?"**

The research must cover the relevant ecosystem broadly enough that we do not accidentally propose something that already exists or overlook an important existing approach.

However, do NOT attempt to find reasons to build our predetermined solution.

We are investigating the landscape **before deciding what our solution should be**.

---

# INPUT

Before beginning:

1. Read all relevant Phase 0 documentation.
2. Read the Phase 1 background knowledge.
3. Read the Phase 2 problem model.
4. Read the Phase 2 unresolved questions and boundaries.

Treat those documents as the current project knowledge base.

Do not blindly trust them.

If your research reveals that an assumption from an earlier phase is incorrect, record the contradiction and update the appropriate research notes rather than silently accepting it.

---

# IMPORTANT BOUNDARY

Do NOT yet produce:

- our final feature list
- our product requirements
- our architecture
- our technology stack
- our MVP
- our final differentiation strategy
- our implementation plan

You ARE allowed to identify:

- existing capabilities
- existing approaches
- weaknesses
- limitations
- research gaps
- unresolved problems
- architectural patterns used by others
- opportunities suggested by evidence

But do not convert these directly into:

> "Therefore our product should implement X."

That belongs to later synthesis.

---

# PART 1 — DEFINE THE LANDSCAPE

Before searching, determine what "existing solution" should mean for this problem.

The landscape may include:

- commercial products
- banking systems
- payment-network mechanisms
- fraud detection systems
- scam prevention systems
- transaction monitoring systems
- academic research
- research prototypes
- open-source projects
- government systems
- regulatory/institutional mechanisms
- cybersecurity products
- identity/security systems
- behavioral analytics systems
- intervention mechanisms

Do not assume every category is equally relevant.

Define inclusion criteria.

For each category, explain:

- why it belongs in the landscape
- what kind of evidence qualifies
- what should be excluded

---

# PART 2 — EXISTING INDUSTRY / COMMERCIAL SYSTEMS

Research relevant commercial and institutional solutions.

Investigate organizations such as:

- banks
- payment providers
- payment networks
- fraud-prevention vendors
- scam-prevention vendors
- cybersecurity companies
- identity/security providers
- transaction-monitoring providers

Do not simply collect company names.

For each materially relevant system, determine:

### What problem does it claim to address?

### Who uses it?

### At what stage does it operate?

### What inputs/signals does it use?

### What does it actually do?

### Is it detection, prediction, prevention, intervention, investigation, recovery, or some combination?

### Is it real-time?

### What type of fraud/scam does it address?

### What evidence exists that it works?

### What limitations are publicly documented?

### What information is unavailable because of proprietary implementation?

Clearly distinguish:

> **Documented capability**

from:

> **Vendor claim**

Do not treat marketing language as independently verified evidence.

---

# PART 3 — EXISTING PAYMENT-NETWORK / INSTITUTIONAL MECHANISMS

Investigate mechanisms already used by payment ecosystems and institutions.

Where relevant examine:

- transaction monitoring
- fraud-risk systems
- beneficiary checks
- account-level controls
- transaction limits
- authentication mechanisms
- risk-based controls
- alerts
- transaction blocking
- holds
- reporting systems
- fraud intelligence sharing
- mule-account detection
- suspicious transaction monitoring
- post-transaction response

The purpose is to understand:

> **What infrastructure and controls already exist before we build anything?**

Do not assume these mechanisms are inadequate.

Evaluate them based on evidence.

---

# PART 4 — ACADEMIC RESEARCH

Search the academic literature for approaches to payment fraud and scam prevention.

Investigate relevant research areas such as:

- fraud detection
- anomaly detection
- behavioral analysis
- transaction classification
- graph-based fraud detection
- temporal modeling
- sequential behavior analysis
- supervised learning
- unsupervised learning
- semi-supervised learning
- anomaly detection
- explainable AI
- adversarial fraud detection
- social-engineering detection
- scam detection
- real-time fraud detection
- intervention systems
- human-in-the-loop fraud prevention

Do NOT assume these techniques are suitable for our system.

For each important research direction determine:

- problem addressed
- methodology
- data used
- features/signals
- model/approach
- evaluation methodology
- results
- limitations
- deployment constraints
- relevance to our problem

Prioritize strong and recent research, while retaining seminal work when it establishes an important concept.

---

# PART 5 — OPEN-SOURCE & RESEARCH PROTOTYPES

Investigate relevant:

- open-source fraud detection systems
- research implementations
- datasets
- benchmark environments
- simulation frameworks
- fraud/scam detection repositories
- transaction-risk systems

Evaluate them based on what can actually be verified.

Do not assume a GitHub repository is production-grade because it has many stars.

Document:

- maturity
- purpose
- scope
- methodology
- limitations
- reproducibility
- relevance

---

# PART 6 — DETECTION APPROACH TAXONOMY

Construct a taxonomy of how existing systems attempt to recognize suspicious behavior.

Potential categories may include:

- rules
- thresholds
- statistical methods
- supervised ML
- unsupervised anomaly detection
- behavioral profiling
- graph/network analysis
- sequence modeling
- ensemble approaches
- hybrid systems
- human review
- intelligence-driven approaches

Do not assume this taxonomy is complete.

Develop it from the research.

For each approach explain:

- what signal it uses
- what type of problem it handles well
- what it struggles with
- typical false-positive/false-negative considerations
- data requirements
- timing requirements
- interpretability
- operational constraints

---

# PART 7 — INTERVENTION APPROACH TAXONOMY

Research how existing systems respond once risk is identified.

Examples may include:

- passive monitoring
- notification
- warning
- user confirmation
- step-up authentication
- transaction delay
- transaction blocking
- account restriction
- manual review
- post-transaction investigation
- recovery mechanisms

Again, do not decide which intervention is appropriate for our project.

Understand the existing intervention spectrum.

Document:

- trigger
- timing
- actor making the decision
- action taken
- user experience
- operational consequence
- advantages
- limitations
- evidence

---

# PART 8 — REAL-TIME CAPABILITY

Specifically investigate existing systems that claim to operate in:

- real-time
- near-real-time
- transaction-time
- streaming environments

Determine what these terms mean in practice.

Where evidence permits, document:

- decision timing
- processing model
- data availability
- intervention point
- operational constraints

Do not invent or normalize latency numbers that are not supported by evidence.

---

# PART 9 — AGENTIC / AI SYSTEMS

Because the problem statement uses the term **Agentic**, investigate whether existing systems use:

- autonomous agents
- multi-agent systems
- LLMs
- reasoning systems
- workflow agents
- AI investigation agents
- automated fraud analysts
- AI-assisted case management
- autonomous decision systems

However, do NOT assume:

> Agentic = better.

Research what these systems actually do.

For each relevant system/research effort determine:

- agent responsibilities
- information available
- decisions made
- tools/actions available
- autonomy level
- human oversight
- reasoning role
- limitations
- evidence of effectiveness

Distinguish genuine agentic behavior from ordinary automation marketed as "agentic AI."

---

# PART 10 — USER-FACING SCAM PREVENTION

Investigate systems that attempt to prevent scams through user interaction.

Examples may include:

- contextual warnings
- payment confirmation mechanisms
- beneficiary warnings
- suspicious-call warnings
- scam education
- behavioral prompts
- transaction friction
- intervention dialogs
- user confirmation

Study:

- when intervention occurs
- what information is presented
- how users respond
- usability trade-offs
- false-positive consequences
- evidence of effectiveness

Do not turn these into our product requirements.

---

# PART 11 — DATA & SIGNAL LANDSCAPE

Research what types of signals existing systems actually use.

Possible categories include:

- transaction attributes
- account history
- beneficiary history
- device signals
- behavioral signals
- temporal patterns
- network relationships
- authentication signals
- location information
- merchant information
- historical fraud information
- external intelligence
- user interaction signals

For each signal type determine:

- who can potentially access it
- when it becomes available
- what it can indicate
- limitations
- privacy considerations
- evidence of usefulness

This should reveal the practical information environment surrounding the problem.

---

# PART 12 — DATASETS & BENCHMARKS

Research publicly available datasets and benchmarks relevant to the problem.

For each important dataset:

- name
- source
- domain
- size
- features
- labels
- class imbalance
- temporal characteristics
- limitations
- licensing/access
- relevance

Determine whether existing benchmarks actually represent **payment scams**, rather than merely generic transaction fraud.

This distinction is important.

---

# PART 13 — EVALUATION METHODS

Research how existing systems evaluate themselves.

Investigate:

- precision
- recall
- F1
- ROC-AUC
- PR-AUC
- false-positive rate
- false-negative rate
- detection latency
- intervention rate
- financial loss prevented
- customer friction
- recovery rate
- analyst workload
- calibration
- robustness

Do not assume accuracy is the primary metric.

Determine which evaluation metrics actually matter for this problem.

---

# PART 14 — LIMITATIONS OF EXISTING APPROACHES

This is a critical section.

Do NOT simply state:

> "Existing systems have limitations."

For every significant limitation, ask:

- What exactly is limited?
- Why does the limitation exist?
- Is it technical, behavioral, operational, regulatory, economic, or informational?
- Is the limitation documented or inferred?
- Which systems experience it?
- Under what conditions?
- How significant is it?
- Is there evidence that it remains unresolved?

Separate:

> **Known limitation**

from:

> **Our hypothesis about a limitation.**

---

# PART 15 — COMPARATIVE MATRIX

Create a structured comparison of the most relevant existing approaches.

At minimum consider:

| Approach/System | Problem addressed | Detection | Intervention | Timing | Signals | AI/ML | Human involvement | Evidence | Limitations |
| --------------- | ----------------- | --------- | ------------ | ------ | ------- | ----- | ----------------- | -------- | ----------- |

Do not create meaningless feature checklists.

The comparison should help us understand **fundamental differences in approach**.

---

# PART 16 — LANDSCAPE EVOLUTION

Where useful, determine how the landscape has evolved.

For important approaches, identify:

```text
Earlier approach
      ↓
Observed limitation
      ↓
New approach
      ↓
Remaining limitation
```

This is particularly valuable when understanding why modern systems use combinations of:

- rules
- ML
- behavioral analysis
- graph analysis
- human review
- intervention

Do not force an evolution narrative where evidence does not support one.

---

# PART 17 — INDEPENDENT RESEARCH

After completing the framework, independently ask:

> **"What important existing approach, system, research direction, or mechanism would be dangerous for us to overlook?"**

Search for it.

You are explicitly expected to discover categories that this prompt did not mention.

For every independent discovery, explain:

- what it is
- why it matters
- evidence
- relevance
- limitations

---

# PART 18 — LANDSCAPE KNOWLEDGE GAPS

At the end of the phase, identify what we still do not know about the existing landscape.

Examples:

- proprietary system behavior cannot be verified
- insufficient evidence for effectiveness
- unclear real-time capabilities
- unclear data requirements
- limited public information
- conflicting claims
- lack of scam-specific benchmarks

These are **research knowledge gaps**, not product gaps.

---

# 19 — NO PREMATURE GAP-TO-FEATURE JUMP

You may identify an observation such as:

> Existing approaches primarily detect suspicious transactions after several behavioral signals accumulate.

You may NOT conclude:

> Therefore our product needs an agent that reasons over transaction context.

Instead record:

```text
Observation
Evidence
Implication
Open question
```

The eventual solution must emerge from synthesis across the research.

---

# SOURCE REQUIREMENTS

Prioritize:

1. regulatory/government sources
2. payment-network documentation
3. official technical documentation
4. peer-reviewed research
5. reputable research institutions
6. credible industry reports
7. credible case studies
8. open-source repositories where appropriate
9. reputable technical journalism

For commercial products:

- distinguish vendor claims from independently verified evidence
- do not reproduce marketing copy
- document uncertainty where implementation details are proprietary

For academic research:

- prefer primary papers
- capture methodology and evaluation rather than only abstracts
- distinguish laboratory results from real-world deployment evidence

---

# EXPECTED LEVEL OF DETAIL

This phase should be **substantially deeper than Phase 2 in breadth**, because we are mapping an entire existing landscape.

However:

> **Breadth does not mean collecting hundreds of irrelevant products.**

Prioritize **representative and materially relevant approaches**.

For each major approach, provide enough detail to understand:

- what problem it addresses
- how it works
- what information it requires
- where it operates in the lifecycle
- what evidence supports it
- what it cannot do
- why those limitations exist

Aim for approximately **25,000–50,000 words** across the Phase 3 knowledge base as a rough guideline.

This is NOT a word-count target.

Prefer:

> **high-quality comparative evidence > volume of entries.**

---

# OUTPUT

Create:

```text
03-landscape/
```

Suggested structure:

```text
03-landscape/
├── landscape-scope.md
├── industry-solutions.md
├── institutional-mechanisms.md
├── academic-research.md
├── open-source-and-prototypes.md
├── detection-approaches.md
├── intervention-approaches.md
├── real-time-systems.md
├── agentic-ai-landscape.md
├── user-facing-prevention.md
├── signal-landscape.md
├── datasets-and-benchmarks.md
├── evaluation-methods.md
├── limitations.md
├── comparative-matrix.md
├── landscape-evolution.md
├── independent-discoveries.md
├── landscape-knowledge-gaps.md
└── phase-3-review.md
```

Modify this structure if the research demonstrates that another organization is better.

Document why.

---

# PHASE 3 REVIEW

Before completing the phase, critically review the landscape.

Ask:

### Coverage

Did we investigate the major categories of existing approaches?

### Bias

Did we focus only on approaches that resemble what we were already imagining?

### Commercial bias

Did we confuse marketing claims with evidence?

### Academic bias

Did we assume laboratory research translates directly to production?

### Scam vs fraud

Did we accidentally research generic fraud while failing to understand scam-specific approaches?

### Real-time

Did we distinguish real-time systems from post-transaction systems?

### Agentic claims

Did we distinguish genuine agentic systems from ordinary automation?

### Evidence

Can the important claims be traced to credible sources?

### Missing approaches

What might we still be overlooking?

### Solution leakage

Did we accidentally start designing our own product?

Correct any problems discovered during the review.

---

# EXPLICIT STOP & EXIT CRITERIA

## STOP CONDITION

Stop Phase 3 when the existing landscape is **sufficiently mapped to make it unlikely that a major existing approach would materially surprise the project during later product discovery**.

Do not pursue exhaustive knowledge of every company, paper, or implementation.

---

## PHASE 3 IS COMPLETE ONLY WHEN

### 1. Landscape categories are defined

We understand what types of existing solutions/approaches are relevant.

### 2. Major approach families are mapped

We understand the principal ways the problem is currently approached.

### 3. Representative systems are documented

Important commercial, institutional, academic, and open-source examples have been investigated where relevant.

### 4. Detection approaches are understood

We understand the major detection paradigms and their trade-offs.

### 5. Intervention approaches are understood

We understand how existing systems respond to detected risk.

### 6. Real-time capabilities are understood

We understand which approaches actually operate at transaction time and which do not.

### 7. Data/signal requirements are understood

We have a reasonable model of what information existing approaches depend upon.

### 8. Evaluation is understood

We know how existing approaches measure effectiveness and what metrics matter.

### 9. Limitations are evidence-backed

Important limitations are documented with their supporting evidence and uncertainty.

### 10. Knowledge gaps are explicit

We know what remains unknown about the landscape.

### 11. No product has been selected

We have not decided what our solution should contain.

### 12. Independent review is complete

We have actively attempted to discover overlooked approaches.

---

# FINAL COMPLETION TEST

Before stopping, answer:

> **If another team proposed a payment-scam prevention system tomorrow, could we confidently determine what is genuinely novel about it, what is already established, and which approaches it is building upon?**

If **no**, identify the missing landscape knowledge and research it.

If **yes**, stop.

---

# FINAL OUTPUT STATUS

End `phase-3-review.md` with:

```text
PHASE 3 STATUS: COMPLETE

Landscape coverage:
[SUFFICIENT / INSUFFICIENT]

Major approach families identified:
[YES / NO]

Commercial/institutional landscape:
[SUFFICIENT / INSUFFICIENT]

Academic landscape:
[SUFFICIENT / INSUFFICIENT]

Detection approaches:
[SUFFICIENT / INSUFFICIENT]

Intervention approaches:
[SUFFICIENT / INSUFFICIENT]

Real-time landscape:
[SUFFICIENT / INSUFFICIENT]

Agentic/AI landscape:
[SUFFICIENT / INSUFFICIENT]

Evidence quality:
[SUFFICIENT / INSUFFICIENT]

Critical unknowns:
[LIST]

Major unresolved contradictions:
[LIST]

Premature product decisions:
[NONE / LIST]

Reason Phase 3 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
```

If all mandatory criteria are satisfied:

> **DOCUMENT → REVIEW → MARK COMPLETE → STOP.**

Do not proceed into requirements, PRD, architecture, or feature selection within Phase 3.

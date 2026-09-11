# PHASE 5 — REQUIREMENTS DISCOVERY

## Role

Act as a senior product-research and systems-requirements analyst specializing in financial technology, payment security, fraud/scam prevention, cybersecurity, AI systems, and safety-critical decision workflows.

The project is:

Agentic Guardian for Real-Time Payment Scam Interception

The knowledge base now contains:

Phase 0 — Project Context

Phase 1 — Domain &amp; Background Knowledge

Phase 2 — Problem Understanding

Phase 3 — Existing Landscape &amp; Prior Art

Phase 4 — Research Synthesis &amp; Validated Gaps

Your task is to transform the validated understanding of the problem into a set of evidence-derived system requirements.

This is NOT yet the PRD.

This is NOT yet feature design.

This is NOT architecture.

The purpose of this phase is to determine:

“What must a successful solution be capable of doing, and what constraints must it satisfy, given what we now know?”

# CORE OBJECTIVE

Build a defensible chain:

Research Evidence
↓
Problem
↓
Validated Gap
↓
Required Capability
↓
Requirement
Every important requirement should have a reason for existing.The requirement must originate from:

a validated problem

a validated gap

an important domain constraint

a stakeholder need

an operational constraint

a safety/security requirement

or another clearly justified source.

Do not create requirements simply because they sound useful.

# INPUT

Before beginning:

Read Phase 0 completely.

Read Phase 1 completely.

Read Phase 2 completely.

Read Phase 3 completely.

Read Phase 4 completely.

Pay particular attention to:

validated gaps

gap prioritization

problem boundaries

actor constraints

current-state limitations

data limitations

temporal constraints

regulatory/security constraints

contradictions

unresolved uncertainties

Do not treat every statement in previous phases as equally authoritative.

Use the strongest available evidence.

# CRITICAL BOUNDARY

This phase MAY define:

required capabilities

functional requirements

non-functional requirements

safety requirements

security requirements

privacy requirements

usability requirements

operational requirements

data requirements

explainability requirements

observability requirements

evaluation requirements

constraints

assumptions

acceptance criteria

This phase MUST NOT finalize:

UI screens

exact features

architecture

implementation

database schema

programming language

ML model

LLM

agent framework

cloud infrastructure

deployment stack

A requirement describes what must be true.

A feature describes how the product chooses to provide it.

Keep these separate.

# PART 1 — REQUIREMENT-DERIVATION METHOD

For every important requirement, establish:

Requirement
↓
Why is it necessary?
↓
Which gap/problem establishes the need?
↓
What evidence supports that gap?
↓
Who needs it?
↓
What happens if it is absent?
Use traceability IDs.For example:

REQ-001
↓
GAP-004
↓
FINDING-012
↓
EVIDENCE-023
Do not use this example as an actual requirement.# PART 2 — STAKEHOLDER REQUIREMENTS

Derive requirements from the relevant actors identified in Phase 2.

For each important stakeholder ask:

What do they need?

What decision do they need to make?

What information do they require?

What constraints do they operate under?

What failure would materially affect them?

What would a successful system need to enable or prevent?

Possible stakeholders may include:

payment users

banks

PSPs

payment applications

fraud analysts

security teams

payment networks

administrators

investigators

Do not assume every stakeholder becomes a direct user of the product.

# PART 3 — FUNCTIONAL REQUIREMENTS

Determine what the system must be capable of doing.

Do not begin by listing features.

Start from capabilities.

Potential capability categories might include:

receiving relevant transaction information

assessing transaction risk

incorporating contextual information

detecting suspicious patterns

identifying scam-related indicators

generating a decision

communicating risk

supporting intervention

recording evidence

supporting investigation

learning/adapting

maintaining an audit trail

These are examples of categories only.

Derive the actual requirements from the research.

For every functional requirement define:

unique ID

requirement

rationale

source gap/problem

priority

measurable acceptance condition

dependencies

uncertainty

# PART 4 — REAL-TIME REQUIREMENTS

Because the problem explicitly involves real-time interception, investigate what timing requirements logically follow from the research.

Do NOT simply invent:

“The system must respond in 100 ms.”

Instead derive timing from:

transaction lifecycle

intervention opportunities

irreversible events

available information

operational constraints

For each timing requirement distinguish:

hard requirement

desirable target

engineering assumption

unknown requiring validation

If the research does not justify a precise value, do not manufacture one.

# PART 5 — RISK DECISION REQUIREMENTS

Determine what the system needs to be capable of regarding risk decisions.

Examples of questions:

Does the system need to distinguish different levels of risk?

Does it need confidence?

Does it need supporting evidence?

Does it need to distinguish scam types?

Does it need to communicate uncertainty?

Does it need to support different intervention levels?

Do not assume the answer.

Derive it from the problem and gap analysis.

Avoid prescribing the algorithm.

The requirement should describe the decision capability, not the implementation.

# PART 6 — CONTEXT REQUIREMENTS

If Phase 4 identified context/information gaps, determine what information the solution would need to reason about the problem.

For each required information category determine:

what information is needed

why it matters

when it becomes available

who potentially provides it

whether access is assumed or uncertain

what happens if it is unavailable

Separate:

Required information

from:

Convenient information

and:

Information we would like but cannot assume access to.

This distinction is mandatory.

# PART 7 — INTERVENTION REQUIREMENTS

If validated gaps indicate that intervention is necessary, determine the required properties of intervention.

Ask:

When must intervention be possible?

Who should be able to act?

What decisions need to be supported?

What happens when confidence is low?

What happens when risk is high?

What happens when the system is uncertain?

What happens if the system fails?

Do NOT select the final intervention mechanism yet.

For example, do not immediately specify:

“Show a warning popup.”

Instead determine whether the system needs:

A mechanism capable of communicating risk to the relevant actor before an irreversible payment outcome.

The actual product mechanism can be decided later.

# PART 8 — EXPLAINABILITY REQUIREMENTS

If explainability emerged as a validated need, determine what “explainability” actually means.

Distinguish between:

explanation for the end user

explanation for analysts

evidence for audit

model interpretability

decision rationale

event history

Do not assume a generic “AI explanation” satisfies the requirement.

Define what information must be available for the relevant stakeholder to understand or challenge a decision.

# PART 9 — HUMAN-IN-THE-LOOP REQUIREMENTS

Determine where human involvement is required or desirable.

Ask:

Which decisions can safely be automated?

Which require human review?

What information must humans receive?

When should uncertainty trigger human involvement?

What happens when humans disagree with automated decisions?

What must be logged?

Do not assume full automation is desirable.

Do not assume humans must approve everything.

Derive the appropriate requirement from the problem.

# PART 10 — SAFETY REQUIREMENTS

This is a high-priority section.

A payment-risk system can create harm by:

incorrectly blocking legitimate payments

failing to stop scams

generating excessive warnings

creating user confusion

delaying legitimate transactions

producing unjustified decisions

making decisions that cannot be challenged

Identify requirements that prevent or reduce these failure modes.

For each:

failure being prevented

requirement

rationale

evidence

severity

acceptance condition

# PART 11 — FALSE-POSITIVE / FALSE-NEGATIVE REQUIREMENTS

Do not treat this as a generic ML metrics section.

Translate the research into system-level requirements.

Ask:

What kinds of false positives are unacceptable?

What kinds of false negatives are especially costly?

Are different risk classes allowed different error trade-offs?

Is intervention reversible?

Is user friction proportional to risk?

Do not select numerical thresholds unless research justifies them.

# PART 12 — SECURITY REQUIREMENTS

Derive security requirements from the domain and problem.

Consider:

authentication

authorization

access control

data protection

integrity

auditability

tamper resistance

secure communications

secrets

abuse prevention

adversarial manipulation

Do not design the security architecture.

State what the system must protect and what security properties it must maintain.

# PART 13 — PRIVACY REQUIREMENTS

Derive privacy requirements based on the information the system may need.

Consider:

data minimization

purpose limitation

access control

retention

sensitive financial information

user privacy

auditability

data exposure

Do not invent legal obligations.

Where a requirement is regulatory, cite the relevant authority.

Where it is a prudent engineering requirement, label it as such.

# PART 14 — AVAILABILITY &amp; RESILIENCE

Because this is associated with real-time payment decisions, investigate requirements around:

availability

failure handling

graceful degradation

timeout behavior

dependency failure

partial data

stale information

service interruption

Do not specify infrastructure yet.

Define the required system behavior under failure.

# PART 15 — OBSERVABILITY &amp; AUDITABILITY

Determine what must be observable after a decision.

Potential requirements may involve:

event logging

decision records

evidence records

timestamps

risk signals

intervention history

human overrides

system failures

Do not decide the logging technology.

Define the information that must be retained to support:

investigation

debugging

audit

evaluation

accountability

# PART 16 — ADAPTABILITY REQUIREMENTS

If Phase 4 identified changing scam patterns as a genuine problem, determine what the system must be capable of doing as the environment changes.

Potential requirements may concern:

updating detection logic

incorporating new patterns

monitoring performance degradation

detecting drift

reviewing model behavior

updating intelligence

Do not decide whether this should be accomplished using:

retraining

rules

agents

LLMs

reinforcement learning

another technique

The requirement is about the capability, not the implementation.

# PART 17 — DATA REQUIREMENTS

Create a requirements-level data inventory.

For each required data category:

DataWhy neededWhen availableSourceRequired?Access assumptionSensitivityDo not create a database schema.

Do not assume data access simply because the data would be useful.

Flag impossible or uncertain data dependencies.

# PART 18 — NON-FUNCTIONAL REQUIREMENTS

Identify requirements concerning:

latency

reliability

availability

scalability

security

privacy

explainability

auditability

maintainability

usability

accessibility

resilience

Only include requirements that matter to this project.

Do not generate a generic software-engineering checklist.

# PART 19 — REQUIREMENT PRIORITIZATION

Classify requirements using an explicit methodology.

For example:

### MUST

Without this, the core problem is not meaningfully addressed.

### SHOULD

Strongly valuable but not essential to the minimum viable solution.

### COULD

Useful but not necessary.

### UNKNOWN

Potentially important but insufficient evidence exists.

You may use another prioritization framework if it is more appropriate.

Explain the methodology before applying it.

# PART 20 — REQUIREMENT CONFLICTS

Requirements may conflict.

Examples:

Detection sensitivity
↕
False positivesSecurity
↕
User frictionContext richness
↕
Privacy / data minimizationAutomation
↕
Human oversightSpeed
↕
Decision complexity
Identify genuine conflicts.For each:

conflicting requirements

source of conflict

stakeholders affected

severity

unresolved decision

evidence needed to resolve it

Do not arbitrarily choose a side.

# PART 21 — REQUIREMENT TESTABILITY

Every important requirement should be testable.

Avoid vague requirements such as:

“The system should be intelligent.”

Instead define a measurable condition.

For example:

“For a defined evaluation scenario, the system must produce a risk decision before the documented intervention deadline.”

The actual thresholds must come from evidence or later validation.

If a requirement cannot currently be made testable because information is missing, mark it:

Validation Required

# PART 22 — TRACEABILITY MATRIX

Create a complete traceability chain:

Evidence
↓
Finding
↓
Problem
↓
Gap
↓
Requirement
At minimum:Requirement IDRequirementGap IDProblem IDEvidencePriorityAcceptance ConditionEvery MUST requirement must have traceability.

A requirement without a defensible origin should be challenged.

# PART 23 — REQUIREMENT QUALITY REVIEW

For every requirement, check:

### Necessary?

Is it actually required?

### Evidence-backed?

Can its existence be justified?

### Specific?

Is the requirement sufficiently precise?

### Testable?

Can we determine whether it has been satisfied?

### Solution-neutral?

Does it describe WHAT rather than HOW?

### Feasible?

Is there evidence that it could realistically be satisfied?

### Non-redundant?

Does another requirement already cover it?

### Conflict-free?

Does it create an unresolved conflict with another requirement?

# PART 24 — INDEPENDENT REQUIREMENT DISCOVERY

Now ignore the predefined categories.

Ask:

“If I were independently responsible for defining what a successful system would have to accomplish given everything discovered so far, what requirements might I identify that this prompt has not explicitly asked for?”

Perform an independent pass.

Any new requirement must still pass the same evidence and traceability standards.

Label these:

Independent Discovery

# PART 25 — REQUIREMENTS THAT CANNOT YET BE DEFINED

Some requirements may depend on information we do not yet possess.

Do not invent values.

Create a section:

Requirements Requiring Validation

For each:

requirement concept

why it matters

missing evidence

what needs to be validated

consequence of getting it wrong

This prevents false precision.

# EXPECTED LEVEL OF DETAIL

Phase 5 should be more precise than Phases 1–4.

The output is intended to become a direct input into the eventual PRD and engineering process.

However:

Precision does not mean inventing numbers.

Every important requirement should be sufficiently detailed that an engineer, tester, or product designer could eventually determine what satisfying it means.

Aim for approximately 10,000–25,000 words across the Phase 5 knowledge base.

Do not optimize for word count.

A smaller set of strong requirements is preferable to hundreds of weak ones.

Prioritize:

Traceability + testability + necessity.

# OUTPUT

Create:

05-requirements/
Suggested structure:05-requirements/
├── requirements-overview.md
├── stakeholder-requirements.md
├── functional-requirements.md
├── real-time-requirements.md
├── risk-decision-requirements.md
├── context-requirements.md
├── intervention-requirements.md
├── explainability-requirements.md
├── human-in-the-loop-requirements.md
├── safety-requirements.md
├── false-positive-negative-requirements.md
├── security-requirements.md
├── privacy-requirements.md
├── resilience-requirements.md
├── observability-auditability.md
├── adaptability-requirements.md
├── data-requirements.md
├── non-functional-requirements.md
├── requirement-prioritization.md
├── requirement-conflicts.md
├── requirement-traceability.md
├── validation-required.md
├── independent-discoveries.md
└── phase-5-review.md
You may modify this structure when justified by the actual requirements.# EXPLICIT STOP &amp; EXIT CRITERIA

## STOP CONDITION

Stop Phase 5 when:

The validated problem gaps have been translated into a coherent, prioritized, testable, and traceable set of solution requirements, with unresolved requirements explicitly identified.

Do not continue generating requirements merely to increase the number of requirements.

# PHASE 5 IS COMPLETE ONLY WHEN

### 1. Every major validated gap has been considered

There is either:

a requirement addressing it

a documented reason why no requirement is necessary

or an explicit validation question.

### 2. Requirements are traceable

Every MUST requirement traces back to evidence/problem/gap.

### 3. Requirements are solution-neutral

They describe required capabilities or constraints rather than implementation.

### 4. Functional requirements are defined

The essential system capabilities are documented.

### 5. Non-functional requirements are defined

Relevant performance, security, privacy, safety, reliability, and operational constraints are documented.

### 6. Data dependencies are explicit

Required information and access assumptions are documented.

### 7. Timing requirements are explicit

Real-time requirements are documented without unsupported precision.

### 8. Safety requirements are explicit

Potential harms from incorrect decisions are addressed.

### 9. Requirement conflicts are documented

Trade-offs have not been silently resolved.

### 10. Requirements are testable

Important requirements have acceptance conditions or are explicitly marked for validation.

### 11. Priorities are justified

MUST/SHOULD/COULD/UNKNOWN classifications have clear reasoning.

### 12. Independent discovery is complete

An unconstrained review has been performed for overlooked requirements.

# FINAL COMPLETENESS TEST

Ask:

“If we handed this requirements knowledge base to a product team and forbade them from inventing additional requirements, would they understand what the eventual system MUST accomplish and what constraints it MUST obey?”

If no:

→ Identify the missing requirement.

→ Trace it back to the evidence/gap.

→ Add and validate it.

If yes:

→ Phase 5 is complete.

# FINAL OUTPUT STATUS

End phase-5-review.md with:

PHASE 5 STATUS: COMPLETE

Validated gaps considered:
[NUMBER]Requirements identified:
[NUMBER]MUST:
[NUMBER]SHOULD:
[NUMBER]COULD:
[NUMBER]UNKNOWN / VALIDATION REQUIRED:
[NUMBER]Traceability:
[COMPLETE / INCOMPLETE]Testability:
[SUFFICIENT / INSUFFICIENT]Functional requirements:
[COMPLETE / INCOMPLETE]Non-functional requirements:
[COMPLETE / INCOMPLETE]Safety requirements:
[COMPLETE / INCOMPLETE]Security/privacy requirements:
[COMPLETE / INCOMPLETE]Data dependencies:
[DEFINED / PARTIALLY DEFINED]Requirement conflicts:
[LIST]Critical unresolved validation questions:
[LIST]Premature feature decisions:
[NONE / LIST]Reason Phase 5 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
If all mandatory criteria are satisfied:DERIVE → TRACE → TEST → REVIEW → MARK COMPLETE → STOP.

Do not proceed into PRD, feature selection, architecture, or implementation within Phase 5.

# PHASE 5 — REQUIREMENTS DISCOVERY

## Role

Act as a senior product-research and systems-requirements analyst specializing in financial technology, payment security, fraud/scam prevention, cybersecurity, AI systems, and safety-critical decision workflows.

The project is:

Agentic Guardian for Real-Time Payment Scam Interception

The knowledge base now contains:

Phase 0 — Project Context

Phase 1 — Domain &amp; Background Knowledge

Phase 2 — Problem Understanding

Phase 3 — Existing Landscape &amp; Prior Art

Phase 4 — Research Synthesis &amp; Validated Gaps

Your task is to transform the validated understanding of the problem into a set of evidence-derived system requirements.

This is NOT yet the PRD.

This is NOT yet feature design.

This is NOT architecture.

The purpose of this phase is to determine:

“What must a successful solution be capable of doing, and what constraints must it satisfy, given what we now know?”

# CORE OBJECTIVE

Build a defensible chain:

Research Evidence
↓
Problem
↓
Validated Gap
↓
Required Capability
↓
Requirement
Every important requirement should have a reason for existing.The requirement must originate from:

a validated problem

a validated gap

an important domain constraint

a stakeholder need

an operational constraint

a safety/security requirement

or another clearly justified source.

Do not create requirements simply because they sound useful.

# INPUT

Before beginning:

Read Phase 0 completely.

Read Phase 1 completely.

Read Phase 2 completely.

Read Phase 3 completely.

Read Phase 4 completely.

Pay particular attention to:

validated gaps

gap prioritization

problem boundaries

actor constraints

current-state limitations

data limitations

temporal constraints

regulatory/security constraints

contradictions

unresolved uncertainties

Do not treat every statement in previous phases as equally authoritative.

Use the strongest available evidence.

# CRITICAL BOUNDARY

This phase MAY define:

required capabilities

functional requirements

non-functional requirements

safety requirements

security requirements

privacy requirements

usability requirements

operational requirements

data requirements

explainability requirements

observability requirements

evaluation requirements

constraints

assumptions

acceptance criteria

This phase MUST NOT finalize:

UI screens

exact features

architecture

implementation

database schema

programming language

ML model

LLM

agent framework

cloud infrastructure

deployment stack

A requirement describes what must be true.

A feature describes how the product chooses to provide it.

Keep these separate.

# PART 1 — REQUIREMENT-DERIVATION METHOD

For every important requirement, establish:

Requirement
↓
Why is it necessary?
↓
Which gap/problem establishes the need?
↓
What evidence supports that gap?
↓
Who needs it?
↓
What happens if it is absent?
Use traceability IDs.For example:

REQ-001
↓
GAP-004
↓
FINDING-012
↓
EVIDENCE-023
Do not use this example as an actual requirement.# PART 2 — STAKEHOLDER REQUIREMENTS

Derive requirements from the relevant actors identified in Phase 2.

For each important stakeholder ask:

What do they need?

What decision do they need to make?

What information do they require?

What constraints do they operate under?

What failure would materially affect them?

What would a successful system need to enable or prevent?

Possible stakeholders may include:

payment users

banks

PSPs

payment applications

fraud analysts

security teams

payment networks

administrators

investigators

Do not assume every stakeholder becomes a direct user of the product.

# PART 3 — FUNCTIONAL REQUIREMENTS

Determine what the system must be capable of doing.

Do not begin by listing features.

Start from capabilities.

Potential capability categories might include:

receiving relevant transaction information

assessing transaction risk

incorporating contextual information

detecting suspicious patterns

identifying scam-related indicators

generating a decision

communicating risk

supporting intervention

recording evidence

supporting investigation

learning/adapting

maintaining an audit trail

These are examples of categories only.

Derive the actual requirements from the research.

For every functional requirement define:

unique ID

requirement

rationale

source gap/problem

priority

measurable acceptance condition

dependencies

uncertainty

# PART 4 — REAL-TIME REQUIREMENTS

Because the problem explicitly involves real-time interception, investigate what timing requirements logically follow from the research.

Do NOT simply invent:

“The system must respond in 100 ms.”

Instead derive timing from:

transaction lifecycle

intervention opportunities

irreversible events

available information

operational constraints

For each timing requirement distinguish:

hard requirement

desirable target

engineering assumption

unknown requiring validation

If the research does not justify a precise value, do not manufacture one.

# PART 5 — RISK DECISION REQUIREMENTS

Determine what the system needs to be capable of regarding risk decisions.

Examples of questions:

Does the system need to distinguish different levels of risk?

Does it need confidence?

Does it need supporting evidence?

Does it need to distinguish scam types?

Does it need to communicate uncertainty?

Does it need to support different intervention levels?

Do not assume the answer.

Derive it from the problem and gap analysis.

Avoid prescribing the algorithm.

The requirement should describe the decision capability, not the implementation.

# PART 6 — CONTEXT REQUIREMENTS

If Phase 4 identified context/information gaps, determine what information the solution would need to reason about the problem.

For each required information category determine:

what information is needed

why it matters

when it becomes available

who potentially provides it

whether access is assumed or uncertain

what happens if it is unavailable

Separate:

Required information

from:

Convenient information

and:

Information we would like but cannot assume access to.

This distinction is mandatory.

# PART 7 — INTERVENTION REQUIREMENTS

If validated gaps indicate that intervention is necessary, determine the required properties of intervention.

Ask:

When must intervention be possible?

Who should be able to act?

What decisions need to be supported?

What happens when confidence is low?

What happens when risk is high?

What happens when the system is uncertain?

What happens if the system fails?

Do NOT select the final intervention mechanism yet.

For example, do not immediately specify:

“Show a warning popup.”

Instead determine whether the system needs:

A mechanism capable of communicating risk to the relevant actor before an irreversible payment outcome.

The actual product mechanism can be decided later.

# PART 8 — EXPLAINABILITY REQUIREMENTS

If explainability emerged as a validated need, determine what “explainability” actually means.

Distinguish between:

explanation for the end user

explanation for analysts

evidence for audit

model interpretability

decision rationale

event history

Do not assume a generic “AI explanation” satisfies the requirement.

Define what information must be available for the relevant stakeholder to understand or challenge a decision.

# PART 9 — HUMAN-IN-THE-LOOP REQUIREMENTS

Determine where human involvement is required or desirable.

Ask:

Which decisions can safely be automated?

Which require human review?

What information must humans receive?

When should uncertainty trigger human involvement?

What happens when humans disagree with automated decisions?

What must be logged?

Do not assume full automation is desirable.

Do not assume humans must approve everything.

Derive the appropriate requirement from the problem.

# PART 10 — SAFETY REQUIREMENTS

This is a high-priority section.

A payment-risk system can create harm by:

incorrectly blocking legitimate payments

failing to stop scams

generating excessive warnings

creating user confusion

delaying legitimate transactions

producing unjustified decisions

making decisions that cannot be challenged

Identify requirements that prevent or reduce these failure modes.

For each:

failure being prevented

requirement

rationale

evidence

severity

acceptance condition

# PART 11 — FALSE-POSITIVE / FALSE-NEGATIVE REQUIREMENTS

Do not treat this as a generic ML metrics section.

Translate the research into system-level requirements.

Ask:

What kinds of false positives are unacceptable?

What kinds of false negatives are especially costly?

Are different risk classes allowed different error trade-offs?

Is intervention reversible?

Is user friction proportional to risk?

Do not select numerical thresholds unless research justifies them.

# PART 12 — SECURITY REQUIREMENTS

Derive security requirements from the domain and problem.

Consider:

authentication

authorization

access control

data protection

integrity

auditability

tamper resistance

secure communications

secrets

abuse prevention

adversarial manipulation

Do not design the security architecture.

State what the system must protect and what security properties it must maintain.

# PART 13 — PRIVACY REQUIREMENTS

Derive privacy requirements based on the information the system may need.

Consider:

data minimization

purpose limitation

access control

retention

sensitive financial information

user privacy

auditability

data exposure

Do not invent legal obligations.

Where a requirement is regulatory, cite the relevant authority.

Where it is a prudent engineering requirement, label it as such.

# PART 14 — AVAILABILITY &amp; RESILIENCE

Because this is associated with real-time payment decisions, investigate requirements around:

availability

failure handling

graceful degradation

timeout behavior

dependency failure

partial data

stale information

service interruption

Do not specify infrastructure yet.

Define the required system behavior under failure.

# PART 15 — OBSERVABILITY &amp; AUDITABILITY

Determine what must be observable after a decision.

Potential requirements may involve:

event logging

decision records

evidence records

timestamps

risk signals

intervention history

human overrides

system failures

Do not decide the logging technology.

Define the information that must be retained to support:

investigation

debugging

audit

evaluation

accountability

# PART 16 — ADAPTABILITY REQUIREMENTS

If Phase 4 identified changing scam patterns as a genuine problem, determine what the system must be capable of doing as the environment changes.

Potential requirements may concern:

updating detection logic

incorporating new patterns

monitoring performance degradation

detecting drift

reviewing model behavior

updating intelligence

Do not decide whether this should be accomplished using:

retraining

rules

agents

LLMs

reinforcement learning

another technique

The requirement is about the capability, not the implementation.

# PART 17 — DATA REQUIREMENTS

Create a requirements-level data inventory.

For each required data category:

DataWhy neededWhen availableSourceRequired?Access assumptionSensitivityDo not create a database schema.

Do not assume data access simply because the data would be useful.

Flag impossible or uncertain data dependencies.

# PART 18 — NON-FUNCTIONAL REQUIREMENTS

Identify requirements concerning:

latency

reliability

availability

scalability

security

privacy

explainability

auditability

maintainability

usability

accessibility

resilience

Only include requirements that matter to this project.

Do not generate a generic software-engineering checklist.

# PART 19 — REQUIREMENT PRIORITIZATION

Classify requirements using an explicit methodology.

For example:

### MUST

Without this, the core problem is not meaningfully addressed.

### SHOULD

Strongly valuable but not essential to the minimum viable solution.

### COULD

Useful but not necessary.

### UNKNOWN

Potentially important but insufficient evidence exists.

You may use another prioritization framework if it is more appropriate.

Explain the methodology before applying it.

# PART 20 — REQUIREMENT CONFLICTS

Requirements may conflict.

Examples:

Detection sensitivity
↕
False positivesSecurity
↕
User frictionContext richness
↕
Privacy / data minimizationAutomation
↕
Human oversightSpeed
↕
Decision complexity
Identify genuine conflicts.For each:

conflicting requirements

source of conflict

stakeholders affected

severity

unresolved decision

evidence needed to resolve it

Do not arbitrarily choose a side.

# PART 21 — REQUIREMENT TESTABILITY

Every important requirement should be testable.

Avoid vague requirements such as:

“The system should be intelligent.”

Instead define a measurable condition.

For example:

“For a defined evaluation scenario, the system must produce a risk decision before the documented intervention deadline.”

The actual thresholds must come from evidence or later validation.

If a requirement cannot currently be made testable because information is missing, mark it:

Validation Required

# PART 22 — TRACEABILITY MATRIX

Create a complete traceability chain:

Evidence
↓
Finding
↓
Problem
↓
Gap
↓
Requirement
At minimum:Requirement IDRequirementGap IDProblem IDEvidencePriorityAcceptance ConditionEvery MUST requirement must have traceability.

A requirement without a defensible origin should be challenged.

# PART 23 — REQUIREMENT QUALITY REVIEW

For every requirement, check:

### Necessary?

Is it actually required?

### Evidence-backed?

Can its existence be justified?

### Specific?

Is the requirement sufficiently precise?

### Testable?

Can we determine whether it has been satisfied?

### Solution-neutral?

Does it describe WHAT rather than HOW?

### Feasible?

Is there evidence that it could realistically be satisfied?

### Non-redundant?

Does another requirement already cover it?

### Conflict-free?

Does it create an unresolved conflict with another requirement?

# PART 24 — INDEPENDENT REQUIREMENT DISCOVERY

Now ignore the predefined categories.

Ask:

“If I were independently responsible for defining what a successful system would have to accomplish given everything discovered so far, what requirements might I identify that this prompt has not explicitly asked for?”

Perform an independent pass.

Any new requirement must still pass the same evidence and traceability standards.

Label these:

Independent Discovery

# PART 25 — REQUIREMENTS THAT CANNOT YET BE DEFINED

Some requirements may depend on information we do not yet possess.

Do not invent values.

Create a section:

Requirements Requiring Validation

For each:

requirement concept

why it matters

missing evidence

what needs to be validated

consequence of getting it wrong

This prevents false precision.

# EXPECTED LEVEL OF DETAIL

Phase 5 should be more precise than Phases 1–4.

The output is intended to become a direct input into the eventual PRD and engineering process.

However:

Precision does not mean inventing numbers.

Every important requirement should be sufficiently detailed that an engineer, tester, or product designer could eventually determine what satisfying it means.

Aim for approximately 10,000–25,000 words across the Phase 5 knowledge base.

Do not optimize for word count.

A smaller set of strong requirements is preferable to hundreds of weak ones.

Prioritize:

Traceability + testability + necessity.

# OUTPUT

Create:

05-requirements/
Suggested structure:05-requirements/
├── requirements-overview.md
├── stakeholder-requirements.md
├── functional-requirements.md
├── real-time-requirements.md
├── risk-decision-requirements.md
├── context-requirements.md
├── intervention-requirements.md
├── explainability-requirements.md
├── human-in-the-loop-requirements.md
├── safety-requirements.md
├── false-positive-negative-requirements.md
├── security-requirements.md
├── privacy-requirements.md
├── resilience-requirements.md
├── observability-auditability.md
├── adaptability-requirements.md
├── data-requirements.md
├── non-functional-requirements.md
├── requirement-prioritization.md
├── requirement-conflicts.md
├── requirement-traceability.md
├── validation-required.md
├── independent-discoveries.md
└── phase-5-review.md
You may modify this structure when justified by the actual requirements.# EXPLICIT STOP &amp; EXIT CRITERIA

## STOP CONDITION

Stop Phase 5 when:

The validated problem gaps have been translated into a coherent, prioritized, testable, and traceable set of solution requirements, with unresolved requirements explicitly identified.

Do not continue generating requirements merely to increase the number of requirements.

# PHASE 5 IS COMPLETE ONLY WHEN

### 1. Every major validated gap has been considered

There is either:

a requirement addressing it

a documented reason why no requirement is necessary

or an explicit validation question.

### 2. Requirements are traceable

Every MUST requirement traces back to evidence/problem/gap.

### 3. Requirements are solution-neutral

They describe required capabilities or constraints rather than implementation.

### 4. Functional requirements are defined

The essential system capabilities are documented.

### 5. Non-functional requirements are defined

Relevant performance, security, privacy, safety, reliability, and operational constraints are documented.

### 6. Data dependencies are explicit

Required information and access assumptions are documented.

### 7. Timing requirements are explicit

Real-time requirements are documented without unsupported precision.

### 8. Safety requirements are explicit

Potential harms from incorrect decisions are addressed.

### 9. Requirement conflicts are documented

Trade-offs have not been silently resolved.

### 10. Requirements are testable

Important requirements have acceptance conditions or are explicitly marked for validation.

### 11. Priorities are justified

MUST/SHOULD/COULD/UNKNOWN classifications have clear reasoning.

### 12. Independent discovery is complete

An unconstrained review has been performed for overlooked requirements.

# FINAL COMPLETENESS TEST

Ask:

“If we handed this requirements knowledge base to a product team and forbade them from inventing additional requirements, would they understand what the eventual system MUST accomplish and what constraints it MUST obey?”

If no:

→ Identify the missing requirement.

→ Trace it back to the evidence/gap.

→ Add and validate it.

If yes:

→ Phase 5 is complete.

# FINAL OUTPUT STATUS

End phase-5-review.md with:

PHASE 5 STATUS: COMPLETE

Validated gaps considered:
[NUMBER]Requirements identified:
[NUMBER]MUST:
[NUMBER]SHOULD:
[NUMBER]COULD:
[NUMBER]UNKNOWN / VALIDATION REQUIRED:
[NUMBER]Traceability:
[COMPLETE / INCOMPLETE]Testability:
[SUFFICIENT / INSUFFICIENT]Functional requirements:
[COMPLETE / INCOMPLETE]Non-functional requirements:
[COMPLETE / INCOMPLETE]Safety requirements:
[COMPLETE / INCOMPLETE]Security/privacy requirements:
[COMPLETE / INCOMPLETE]Data dependencies:
[DEFINED / PARTIALLY DEFINED]Requirement conflicts:
[LIST]Critical unresolved validation questions:
[LIST]Premature feature decisions:
[NONE / LIST]Reason Phase 5 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
If all mandatory criteria are satisfied:DERIVE → TRACE → TEST → REVIEW → MARK COMPLETE → STOP.

Do not proceed into PRD, feature selection, architecture, or implementation within Phase 5.

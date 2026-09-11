# PHASE 8 — TECHNICAL ARCHITECTURE & SYSTEM DESIGN

## Role

Act as a **principal systems architect and AI/ML systems engineer** specializing in fintech, real-time payment systems, fraud/scam detection, cybersecurity, distributed systems, and agentic AI.

The project is:

> **Agentic Guardian for Real-Time Payment Scam Interception**

The knowledge base now contains:

- Phase 0 — Project Context
- Phase 1 — Domain & Background Knowledge
- Phase 2 — Problem Understanding
- Phase 3 — Existing Landscape & Prior Art
- Phase 4 — Research Synthesis & Validated Gaps
- Phase 5 — Requirements Discovery
- Phase 6 — Bare-Minimum PRD
- Phase 7 — Advanced Directions & Differentiation

Your task is to convert the validated product definition and requirements into a **technically coherent system architecture**.

This is the first phase where concrete technical decisions are expected.

---

# CORE OBJECTIVE

Answer:

> **"What technical system should we build to satisfy the validated requirements and product definition, and why is this architecture appropriate?"**

The architecture must follow:

```text
Problem
   ↓
Validated Gap
   ↓
Requirement
   ↓
Product Capability
   ↓
Technical Component
   ↓
Implementation Decision
```

Do not reverse this chain.

---

# INPUT

Read all previous phases completely.

Pay particular attention to:

- MUST requirements
- acceptance criteria
- MVP boundaries
- product workflow
- required data
- timing constraints
- safety requirements
- security/privacy requirements
- advanced capabilities selected for inclusion
- explicitly rejected directions
- unresolved validation questions

Previous phases define **what the system must accomplish**.

This phase determines **how the system should accomplish it**.

---

# ARCHITECTURE PRINCIPLES

The architecture must be:

- requirement-driven
- minimal where possible
- explainable
- testable
- observable
- secure
- resilient
- appropriately modular
- realistic for the project's implementation constraints
- extensible where justified
- simple enough to actually build

Do not introduce complexity merely because it is architecturally interesting.

---

# PART 1 — ARCHITECTURAL DRIVERS

Identify the requirements that materially influence architecture.

Examples may include:

- real-time processing
- decision latency
- explainability
- safety
- data availability
- scalability
- privacy
- availability
- human intervention
- auditability
- agentic reasoning
- model evaluation

For each:

```text id="4zjv9v"
Architectural Driver
Requirement
Why it affects architecture
Constraint imposed
Evidence / source
```

---

# PART 2 — SYSTEM BOUNDARY

Define the system boundary precisely.

Document:

### Inside the system

Components we control.

### Outside the system

External entities and services.

### Integration boundaries

Where information crosses the boundary.

### Simulation boundaries

What must be simulated for the hackathon prototype.

This must remain consistent with the Phase 6 PRD.

---

# PART 3 — HIGH-LEVEL ARCHITECTURE

Design the complete system at a conceptual level.

Show major components and interactions.

Use Mermaid.

For example:

```text id="77up9c"
Payment Event
      ↓
Event / Input Layer
      ↓
Context Aggregation
      ↓
Risk Assessment
      ↓
Decision Layer
      ↓
Intervention
      ↓
Evidence / Audit
      ↓
Feedback / Evaluation
```

This is illustrative only.

Derive the actual architecture.

---

# PART 4 — COMPONENT DECOMPOSITION

For every major component define:

- responsibility
- inputs
- outputs
- dependencies
- interfaces
- state
- failure behavior
- security considerations
- scalability considerations
- requirements satisfied

Avoid creating components that exist only because they sound sophisticated.

---

# PART 5 — DATA ARCHITECTURE

Design the technical data model required by the product.

Determine:

- core entities
- relationships
- event structures
- transaction representation
- user/account representation
- beneficiary representation
- risk representation
- decision representation
- evidence representation
- intervention representation
- audit records

This may include:

- schemas
- entity relationships
- event models
- data flow diagrams

Do NOT over-engineer the schema for hypothetical future requirements.

---

# PART 6 — DATA FLOW

Document the complete information flow:

```text
Input
 ↓
Validation
 ↓
Enrichment
 ↓
Feature/context generation
 ↓
Risk assessment
 ↓
Decision
 ↓
Intervention
 ↓
Logging
 ↓
Feedback
```

Derive the actual pipeline from the PRD.

For every important data element determine:

- origin
- transformation
- consumer
- lifetime
- sensitivity
- failure behavior

---

# PART 7 — REAL-TIME ARCHITECTURE

Because the system is explicitly intended for real-time interception, determine:

- event processing model
- synchronous vs asynchronous operations
- critical path
- non-critical path
- latency budget
- timeout behavior
- concurrency
- queueing where necessary
- caching where justified
- fallback behavior

Do not choose technologies before understanding the requirements.

Create a conceptual latency budget.

Example:

```text id="m1x8d4"
Input ingestion        X ms
Context retrieval      X ms
Risk assessment        X ms
Decision                X ms
Intervention            X ms
----------------------------
Total                   X ms
```

Only populate values that can be justified by requirements or engineering validation.

---

# PART 8 — DETECTION / RISK ENGINE ARCHITECTURE

Design the technical structure of the risk-assessment subsystem.

Determine whether the requirements justify:

- rules
- statistical models
- ML models
- anomaly detection
- behavioral models
- graph models
- ensembles
- other approaches

Now technology selection is permitted.

However, justify every major choice using:

- requirements
- data characteristics
- latency
- interpretability
- accuracy
- operational complexity
- evidence from Phase 3/7

Do not choose an LLM merely because the project uses the word "Agentic."

---

# PART 9 — AGENTIC ARCHITECTURE

If the final product includes agentic capabilities, define precisely:

- agent responsibilities
- tools
- inputs
- outputs
- memory/state
- reasoning boundaries
- autonomy level
- decision authority
- human oversight
- escalation
- failure behavior

Critically distinguish:

### Deterministic logic

What should be handled with ordinary software.

### ML

What should be statistically inferred.

### Agentic reasoning

What genuinely benefits from flexible multi-step reasoning/tool use.

### Human decision

What should remain under human control.

Do NOT make the agent responsible for everything.

---

# PART 10 — MODEL ARCHITECTURE

Where ML/AI is required, determine:

- model responsibilities
- input features
- output
- training data
- inference process
- evaluation
- versioning
- monitoring
- fallback
- retraining/update mechanism

Do not overcomplicate the model architecture.

Prefer the simplest model capable of satisfying the requirement.

---

# PART 11 — DECISION ENGINE

Define the technical decision layer.

Separate:

```text id="xj9t5f"
Signals
   ↓
Models / Rules
   ↓
Risk assessment
   ↓
Decision policy
   ↓
Action
```

Do not hide policy inside an ML model.

Document:

- risk representation
- decision states
- thresholds where justified
- uncertainty
- escalation
- override
- policy versioning

---

# PART 12 — INTERVENTION ARCHITECTURE

Define how the system technically performs intervention.

Determine:

- trigger
- decision authority
- communication channel
- timing
- transaction-state interaction
- user interaction
- fallback
- failure handling
- audit trail

Do not assume that the prototype has authority to actually block real financial transactions.

Clearly separate:

> **Prototype simulation**

from:

> **Production integration requirement.**

---

# PART 13 — EXPLAINABILITY & EVIDENCE ARCHITECTURE

Design how the system produces and stores evidence supporting decisions.

Determine:

- evidence collection
- evidence representation
- decision rationale
- model signals
- confidence
- timestamps
- event history
- human overrides
- audit records

Avoid generating explanations that are merely plausible narratives.

The explanation architecture should be tied to actual decision evidence.

---

# PART 14 — SECURITY ARCHITECTURE

Design security controls appropriate to the system.

Consider:

- authentication
- authorization
- role-based access
- secrets
- encryption
- API security
- service identity
- audit logging
- tamper resistance
- abuse prevention
- model/API security

Threat-model the architecture.

Identify:

- assets
- attack surfaces
- threats
- mitigations
- residual risks

---

# PART 15 — PRIVACY ARCHITECTURE

Translate Phase 5 privacy requirements into architecture.

Determine:

- data minimization
- access boundaries
- retention
- sensitive data handling
- anonymization/pseudonymization where appropriate
- logging restrictions
- data isolation

Do not store data merely because it may be useful someday.

---

# PART 16 — FAILURE & RESILIENCE ARCHITECTURE

For each major dependency determine:

- failure mode
- impact
- timeout
- fallback
- recovery
- degraded behavior

Examples:

```text id="7o0kha"
Risk engine unavailable
       ↓
What happens?

Context service unavailable
       ↓
What happens?

Agent unavailable
       ↓
What happens?

Database unavailable
       ↓
What happens?

External service unavailable
       ↓
What happens?
```

Safety-critical failure behavior must be explicit.

---

# PART 17 — OBSERVABILITY

Design:

- logs
- metrics
- traces
- decision telemetry
- model telemetry
- agent telemetry
- intervention telemetry
- error monitoring

Define what must be observable to determine:

- whether the system is functioning
- whether decisions are degrading
- whether latency is increasing
- whether false positives are increasing
- whether an agent is behaving unexpectedly

---

# PART 18 — EVALUATION ARCHITECTURE

Design the system so it can actually be evaluated.

Include:

- test scenarios
- simulation
- historical/replay data where available
- synthetic data where necessary
- model evaluation
- end-to-end evaluation
- intervention evaluation
- safety testing
- adversarial testing

Do not build an architecture that cannot demonstrate whether it solves the problem.

---

# PART 19 — TECHNOLOGY SELECTION

Only after architecture is defined, evaluate concrete technologies.

For each major technology decision:

| Decision | Options | Selected | Why | Requirements | Trade-offs |
| -------- | ------- | -------- | --- | ------------ | ---------- |

Potential areas:

- programming language
- backend framework
- frontend framework
- database
- event system
- ML framework
- model provider
- LLM
- agent framework
- vector store
- deployment
- observability

Do not select technology because it is fashionable.

Optimize for:

- requirements
- reliability
- simplicity
- implementation speed
- evaluation
- maintainability

---

# PART 20 — HACKATHON VS PRODUCTION ARCHITECTURE

Create two explicit views.

## Hackathon architecture

What can realistically be implemented and demonstrated.

## Production architecture

What would be required for real deployment.

Do not pretend the hackathon prototype is production-ready.

Explicitly document:

- simulated integrations
- mocked services
- simplified security
- synthetic data
- local components
- scalability limitations

This distinction is mandatory.

---

# PART 21 — IMPLEMENTATION BOUNDARIES

Define clear module boundaries so multiple coding agents/developers can work independently.

For each module:

- responsibility
- public interface
- inputs
- outputs
- owner
- dependencies
- test boundary

Avoid circular dependencies.

---

# PART 22 — ARCHITECTURAL TRADE-OFFS

Document major choices and alternatives.

For each:

```text id="i4s0tp"
Decision
Alternatives
Chosen approach
Why
Benefits
Costs
Risks
Rejected alternatives
```

Architecture is not complete until important trade-offs are explicit.

---

# PART 23 — ARCHITECTURAL TRACEABILITY

Create:

```text id="1d3j4a"
Requirement
     ↓
Product Capability
     ↓
Architecture Component
     ↓
Technology
     ↓
Implementation Module
```

Create a traceability matrix:

| Requirement | Capability | Component | Technology | Test |
| ----------- | ---------- | --------- | ---------- | ---- |

Every MUST requirement must map to architecture.

Every major architecture component must have a reason to exist.

---

# PART 24 — INDEPENDENT ARCHITECTURE REVIEW

After designing the architecture, challenge it.

Ask:

> **"If I had to build this system from scratch while preserving all validated requirements, would I choose this architecture?"**

Then check for:

- unnecessary components
- missing components
- bottlenecks
- single points of failure
- security weaknesses
- privacy problems
- latency problems
- unjustified AI usage
- unjustified agent usage
- over-engineering
- hidden assumptions
- inability to test
- inability to demonstrate

Simplify wherever possible.

---

# EXPECTED LEVEL OF DETAIL

Phase 8 should be **engineering-design grade**.

The documentation must be detailed enough that an experienced engineer can begin implementation without needing to redesign the entire system.

It should include:

- architecture diagrams
- component specifications
- interfaces
- data flows
- data models
- decision flows
- failure behavior
- security model
- AI/agent boundaries
- technology decisions
- trade-offs
- testing architecture

Aim for approximately **15,000–30,000 words** across the Phase 8 knowledge base.

Do not optimize for word count.

Prefer:

> **clear diagrams + precise interfaces + explicit decisions > enormous prose.**

---

# OUTPUT

Create:

```text id="l6x1na"
08-architecture/
```

Suggested structure:

```text id="8f2j8d"
08-architecture/
├── architecture-overview.md
├── architectural-drivers.md
├── system-boundary.md
├── high-level-architecture.md
├── component-decomposition.md
├── data-architecture.md
├── data-flow.md
├── real-time-architecture.md
├── risk-engine-architecture.md
├── agentic-architecture.md
├── model-architecture.md
├── decision-engine.md
├── intervention-architecture.md
├── explainability-architecture.md
├── security-architecture.md
├── privacy-architecture.md
├── resilience-architecture.md
├── observability.md
├── evaluation-architecture.md
├── technology-selection.md
├── hackathon-vs-production.md
├── implementation-boundaries.md
├── architectural-tradeoffs.md
├── architecture-traceability.md
└── phase-8-review.md
```

Modify the structure if necessary, but preserve logical separation.

---

# EXPLICIT STOP & EXIT CRITERIA

## STOP CONDITION

Stop Phase 8 when:

> **The system architecture is sufficiently specified that implementation can begin without making fundamental architectural decisions on behalf of the research/product team.**

Do not continue refining architecture indefinitely.

---

# PHASE 8 IS COMPLETE ONLY WHEN

### 1. Architectural drivers are documented.

### 2. System boundary is explicit.

### 3. High-level architecture is complete.

### 4. Major components are defined.

### 5. Data architecture is defined.

### 6. Data flows are defined.

### 7. Real-time critical path is defined.

### 8. Risk/detection architecture is defined.

### 9. Agentic responsibilities are explicitly bounded.

### 10. AI/ML responsibilities are explicitly bounded.

### 11. Decision authority is defined.

### 12. Intervention architecture is defined.

### 13. Explainability/evidence architecture is defined.

### 14. Security and privacy architecture are defined.

### 15. Failure and resilience behavior is defined.

### 16. Observability is defined.

### 17. Evaluation architecture exists.

### 18. Technology choices are justified.

### 19. Hackathon and production architectures are distinguished.

### 20. Architectural trade-offs are documented.

### 21. Requirements have architecture traceability.

### 22. Independent architecture review is complete.

---

# FINAL COMPLETENESS TEST

Ask:

> **"Could an engineering team implement the MVP from this architecture without having to invent the system's fundamental structure, responsibilities, interfaces, or technical approach?"**

If **no**:

→ Resolve the missing architectural definition.

If **yes**:

→ Phase 8 is complete.

---

# FINAL OUTPUT STATUS

End `phase-8-review.md` with:

```text id="q2x9dk"
PHASE 8 STATUS: COMPLETE

Architectural drivers:
[DEFINED / INCOMPLETE]

System boundary:
[DEFINED / INCOMPLETE]

High-level architecture:
[COMPLETE / INCOMPLETE]

Components:
[NUMBER]

Data architecture:
[COMPLETE / INCOMPLETE]

Real-time path:
[DEFINED / INCOMPLETE]

Risk engine:
[DEFINED / INCOMPLETE]

AI/ML architecture:
[DEFINED / INCOMPLETE]

Agentic architecture:
[DEFINED / INCOMPLETE]

Decision authority:
[DEFINED / INCOMPLETE]

Intervention:
[DEFINED / INCOMPLETE]

Security:
[DEFINED / INCOMPLETE]

Privacy:
[DEFINED / INCOMPLETE]

Resilience:
[DEFINED / INCOMPLETE]

Observability:
[DEFINED / INCOMPLETE]

Evaluation:
[DEFINED / INCOMPLETE]

Technology decisions:
[NUMBER]

Hackathon/production separation:
[CLEAR / UNCLEAR]

Requirement traceability:
[COMPLETE / INCOMPLETE]

Critical architectural risks:
[LIST]

Unresolved technical decisions:
[LIST]

Premature / unjustified complexity:
[NONE / LIST]

Reason Phase 8 is complete:
[SHORT EVIDENCE-BASED STATEMENT]
```

If all mandatory criteria are satisfied:

> **DERIVE → DESIGN → JUSTIFY → TRACE → REVIEW → MARK COMPLETE → STOP.**

Do not proceed into implementation within Phase 8.

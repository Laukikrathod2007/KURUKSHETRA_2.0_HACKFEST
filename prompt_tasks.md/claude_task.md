The current working directory (PWD/root folder) contains the complete project knowledge base and documentation.

It includes material brainstormed and explored across multiple areas: ideas, research, possible features, architecture concepts, agentic approaches, ML/AI approaches, implementation considerations, evaluation ideas, and other project-development material.

**Council on this.**

This is for a hackathon, so do NOT optimize for a basic, minimal, or generic implementation. We need a project that is genuinely impressive, technically ambitious, demonstrable, and differentiated.

Your task is to first deeply understand the problem statement in `ps.md`. Treat `ps.md` as the authoritative source for what the hackathon problem actually requires. The other documents in the PWD are supporting knowledge, brainstorming, research, and ideas that can be used to build upon the problem statement.

## 1. Read and Understand the Entire Knowledge Base

Before defining anything, **read and understand every relevant document present in the PWD/root folder**.

Do not selectively read only a few documents.

For every document:

- Understand its purpose and contents.
- Extract relevant ideas, requirements, research, constraints, assumptions, features, architecture concepts, risks, and insights.
- Determine what is valuable and should carry forward.
- Identify contradictions between documents.
- Identify duplicate or overlapping ideas.
- Identify weak, unrealistic, unnecessary, or purely cosmetic ideas.
- Identify gaps that the existing material has not addressed.

Do not simply summarize the documents.

**Synthesize the entire knowledge base into a stronger project.**

`ps.md` is the authoritative source for the actual hackathon problem. Everything else is supporting knowledge that should be evaluated and used appropriately.

---

# 2. Understand the Problem Statement Deeply

Extract the actual problem being solved from `ps.md`.

Determine:

- What problem actually needs to be solved.
- Who the users/stakeholders are.
- What the real-world workflow looks like.
- What the system must accomplish.
- Explicit requirements.
- Implicit requirements.
- Constraints.
- Failure modes.
- Safety considerations.
- What constitutes genuinely solving the PS.
- What would merely be superficial compliance.

Do not design the project around technology first.

Design it around **solving the problem extremely well**.

---

# 3. Define a Serious Hackathon-Level Project

I do NOT want the council to simply produce:

- a basic agent architecture
- a generic multi-agent system
- a simple ML model
- an LLM wrapper
- a CRUD/dashboard application with AI attached
- a collection of obvious/basic features
- buzzword-heavy architecture without meaningful functionality

Instead, rigorously determine what would make this a **serious, technically impressive, differentiated hackathon solution**.

The goal is:

> **What is the strongest technically credible system we could build that directly and convincingly solves this PS, demonstrates meaningful intelligence, has genuinely standout capabilities, and creates an exceptional hackathon demonstration?**

Do not artificially constrain the conceptual scope at this stage.

If a large number of capabilities genuinely contribute to solving the problem, include them.

Do not add features simply to make the project look large.

---

# 4. Go Beyond Basic Functionality

Explore capabilities that could make the project substantially more advanced than a standard hackathon implementation.

Consider, where genuinely relevant:

- intelligent orchestration
- autonomous reasoning and decision loops
- evidence-based decisions
- uncertainty/confidence estimation
- explainability and traceability
- adaptive behavior
- simulation and what-if analysis
- real-time capabilities
- anomaly detection
- predictive capabilities
- continuous learning/feedback
- adversarial/failure-aware behavior
- human-in-the-loop escalation
- automated evidence generation
- verification and cross-validation
- robust evaluation
- operational intelligence
- useful visualizations
- novel user interactions
- other capabilities discovered from the knowledge base or through your analysis

These are **examples, not requirements**.

Only include something if it meaningfully improves the solution.

---

# 5. Challenge the Architecture

Do not assume that multi-agent architecture is inherently better.

Determine objectively:

- Where agents are useful.
- Where deterministic logic is better.
- Where conventional ML is better.
- Where LLMs are useful.
- Where RAG is useful.
- Where external tools/data sources are useful.
- Where rules or constraints should override model decisions.
- How components should cooperate.
- How decisions should be validated.
- How uncertainty should be handled.
- How the system should fail safely.

Every major architectural choice should have a reason.

Avoid AI/agentic decoration.

---

# 6. Define the Project Comprehensively

Once the council has synthesized the knowledge base and explored the solution space, converge on a **complete project definition**.

Define the project at the level of detail required for another technical team to understand exactly what is intended to be built.

Cover all aspects that are relevant, including as appropriate:

- Problem definition
- Objectives
- Users
- Use cases
- User journeys
- Functional capabilities
- Advanced capabilities
- Differentiators
- System behavior
- End-to-end workflows
- Modules
- Components
- Architecture
- AI/ML/LLM responsibilities
- Agent responsibilities
- Data
- Integrations
- Interfaces
- Decision-making
- Human-in-the-loop behavior
- Security
- Safety
- Failure handling
- Evaluation
- Metrics
- Testing
- Demo strategy
- Implementation priorities
- Risks
- Assumptions
- Scope boundaries
- Non-goals
- Future extensions

**Do not treat the above as a mandatory document structure.**

Use your own judgment to determine what the final project actually requires.

---

# 7. Design the Hackathon Demonstration

The project must have a compelling end-to-end demonstration.

Determine:

- The strongest demo scenarios.
- Realistic inputs.
- How the system responds.
- What intelligence is visible.
- What decisions are made.
- What actions are taken.
- Where humans intervene.
- How edge cases are demonstrated.
- How failures are demonstrated.
- What measurable outcomes can be shown.
- What should be shown to judges in the first 2–5 minutes.
- What makes the project memorable and clearly differentiated.

---

# 8. Define Rigorous Evaluation

Do not simply use "accuracy" as the evaluation strategy.

Determine meaningful metrics for the actual PS, potentially including:

- Detection performance
- False positives / false negatives
- Latency
- Reliability
- Robustness
- Explainability
- Intervention success
- Human workload
- Cost/efficiency
- Generalization
- Adversarial/failure-case performance
- Other domain-specific metrics

Define how realistic evaluation data, simulations, scenarios, and test cases could be created for the hackathon.

---

# 9. Be Brutally Critical

Challenge every major idea.

For every proposed feature/capability, ask:

- Does this actually solve the PS?
- Is it technically meaningful?
- Is it demonstrable?
- Is it differentiated?
- Is it feasible?
- Is it worth the complexity?
- Does it create real user value?
- Is it merely AI/agentic decoration?
- Does it introduce unnecessary risk?
- Does it make the overall system better?

Explicitly reject weak ideas.

Do not be afraid to make the project smaller in one area and significantly deeper in another if that produces a stronger solution.

---

# 10. Create the Project Documentation

After fully analyzing the entire knowledge base and converging on the strongest project definition, **create a new `docs/` folder in the PWD/root directory.**

Inside it, create a **professional, comprehensive project documentation package** describing the project the council has decided should be built.

**You decide what documents are necessary.**

Do NOT follow a predefined documentation structure.

Determine the appropriate documentation architecture based on:

- The nature of the PS.
- The complexity of the proposed system.
- The modules and capabilities you decide are necessary.
- The engineering requirements.
- The AI/ML requirements.
- The security/safety requirements.
- The evaluation requirements.
- The hackathon requirements.

If the project requires an SRS, create an SRS.

If it requires architecture specifications, create them.

If it requires module specifications, create them.

If it requires threat models, evaluation specifications, data specifications, API/interface specifications, agent specifications, workflows, decision policies, or other technical documentation, create those as well.

If something is unnecessary, do not create filler documentation.

The final `docs/` directory should be a **coherent professional documentation set**, not a random collection of files.

The documents should cross-reference one another where appropriate and remain internally consistent.

The documentation should capture **every important aspect of the project that the council decides should exist**.

The `docs/` folder should ultimately become the **authoritative project specification for the development phase that comes later**.

---

# 11. NO DEVELOPMENT

This task is strictly:

**PROJECT RESEARCH → SYNTHESIS → DEFINITION → SPECIFICATION → DOCUMENTATION**

Do NOT develop the project.

Do NOT:

- write application code
- build the frontend
- build the backend
- implement agents
- implement ML models
- implement LLM pipelines
- configure infrastructure
- install dependencies
- create production code
- start development
- build the prototype

You may use pseudocode, schemas, diagrams, workflows, interface definitions, examples, or technical specifications **inside the documentation when necessary to precisely define the system**.

But do not implement anything.

---

# Final Objective

The final result should be:

1. A deeply understood and synthesized knowledge base.
2. A rigorously interpreted `ps.md`.
3. A carefully reasoned, technically ambitious project definition.
4. A complete understanding of every module, capability, workflow, dependency, and requirement the proposed project should contain.
5. A professionally organized `docs/` directory containing whatever documentation is necessary to fully specify that project.

Do not merely give me recommendations in chat.

**Actually create the documentation in the PWD.**

The council should decide what the project needs to be.

The council should decide what capabilities it should have.

The council should decide how the system should be structured.

The council should decide what documentation is necessary.

The council should decide what belongs in each document.

The only fixed anchors are:

- `ps.md` is the authoritative problem statement.
- The entire PWD knowledge base must be understood and synthesized.
- The result must be a serious, differentiated hackathon project.
- The result must be comprehensively documented.
- **No development is to be performed.**

Stop after the project has been fully defined and documented.

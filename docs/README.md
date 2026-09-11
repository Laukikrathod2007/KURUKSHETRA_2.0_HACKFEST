# Project Kurukshetra — Agentic Guardian
## Documentation Index

Authoritative build specification for PS09 — Agentic Guardian for
Real-Time Payment Scam Interception. `ps.md` (repository root) is the
source problem statement; everything here specifies how it will be
solved. No application code has been written against this spec yet.

### Primary Submissions & Specifications

- **Official Hackathon Submission (DOCX):** [`Kurukshetra_Agentic_Guardian_PS09_Submission.docx`](./Kurukshetra_Agentic_Guardian_PS09_Submission.docx)
- **Complete Project Documentation (MD):** [`PS09_Agentic_Guardian_Documentation.md`](./PS09_Agentic_Guardian_Documentation.md)
- **Comprehensive Product Requirements Document (PRD):** [`PRD.md`](./PRD.md)
- **Original Problem Statement:** [`PROBLEM_STATEMENT.md`](./PROBLEM_STATEMENT.md) (also at repo root as [`ps.md`](../ps.md))
- **Research Papers & Literature:** [`papers/`](./papers/)

### Detailed Specification Modules (Reading Order)

1. [`00-overview.md`](./00-overview.md) -- Scope, objectives, and the
   differentiator decision table (core / bonus / cut, with reasons).
2. [`01-srs.md`](./01-srs.md) -- Functional and non-functional
   requirements, traced to `ps.md`.
3. [`02-architecture.md`](./02-architecture.md) -- Pipeline, components,
   data flow, why each technology is used where it is.
4. [`03-agent-and-tools.md`](./03-agent-and-tools.md) -- The Guardian
   agent's reasoning design, tool contracts, output schema.
5. [`04-risk-and-policy.md`](./04-risk-and-policy.md) -- Risk scoring,
   uncertainty handling, decision tiers, the policy engine.
6. [`05-threat-model-and-safety.md`](./05-threat-model-and-safety.md) --
   Threats, safety invariants, fail-safe design, privacy posture.
7. [`06-evaluation-and-testing.md`](./06-evaluation-and-testing.md) --
   What is measured, how, and the evaluation harness structure.
8. [`07-demo-script.md`](./07-demo-script.md) -- Judge-facing walkthrough.
9. [`08-data-and-scenarios.md`](./08-data-and-scenarios.md) -- Data model
   and the nine-scenario suite.

### The design filter behind every decision in this spec

> A user is about to send money based on a false belief about who
> they're paying or why. The only lever any protective system has is
> inserting a true fact, or a deliberate delay, before they authorize.

A capability that doesn't serve this is not in the core build — see
[`00-overview.md`](./00-overview.md) §5 for the full core/bonus/cut list.

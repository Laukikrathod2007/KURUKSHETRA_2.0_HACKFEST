# Kurukshetra 2.0 -- Agentic Guardian (PS09)

> **Real-Time Autonomous Payment Scam Interception System**  
> Submission for **HACKFEST 2026** | Problem Statement: **PS09**  
> Team ID: **KH051** | Team: **Kurukshetra**

---

## Team Details

- **Team ID:** KH051
- **Team Name:** Kurukshetra
- **Team Leader:** Laukik Rathod
- **Team Members:**
  - Laukik Rathod (Team Leader)
  - Aayush Deshpande
  - Prasad Bhalerao
  - Harshal Yadav
- **Submission Date:** September 11, 2026

---

## Executive Summary

Digital payment scams (such as Authorized Push Payment / APP fraud) exploit a fundamental gap in modern instant clearing rails (UPI, Faster Payments, FedNow): payments clear in seconds and are irreversible, while the legitimate user is tricked into authorizing the transfer themselves.

**Agentic Guardian** intercepts payments at the pre-authorization confirmation window using a dual-path architecture:
1. **Hot Path (Deterministic & ML):** Evaluates hard blocklists, recipient registry classifications, purpose-identity consistency, and rolling-window velocity features via a trained Gradient Boosted Tree (GBT) model in <15ms.
2. **Warm Path (Bounded Multi-Specialist LLM Agent):** Evaluates ambiguous or elevated transactions across four concurrent specialized agents (Identity & Purpose, Linguistic Manipulation, Behavioral Velocity, and Scam Typology RAG Retrieval).
3. **Deterministic Policy Engine:** Enforces an uncompromised safety invariant (`final_tier = max(hot_tier, agent_recommendation)`), ensuring LLM agents can only increase caution and never lower baseline risk.
4. **Graduated Human-in-the-Loop Friction:** Maps verdicts to five action tiers: `ALLOW`, `ADVISE`, `CHALLENGE`, `PAUSE`, and `BLOCK`, complete with factual explainable evidence reports and an immutable SHA-256 hash-chained audit log.

---

## Project Structure

```
MIT_Hackathon/
├── README.md                                    # Master project overview & index
├── base.md                                      # 36 technical features & banking protocol specs
├── FR.md                                        # Functional requirements & PS09 traceability
├── ps.md                                        # PS09 challenge overview (single source of truth)
├── docs/                                        # Consolidated documentation & submission
│   ├── Kurukshetra_Agentic_Guardian_PS09_Submission.docx  # Final HACKFEST 2026 DOCX
│   ├── PS09_Agentic_Guardian_Documentation.md   # Complete project documentation (MD)
│   ├── PRD.md                                   # Comprehensive Product Requirements Document
│   ├── PROBLEM_STATEMENT.md                     # Problem statement archive
│   ├── README.md                                # Documentation guide & reading order
│   ├── 00-overview.md ... 08-data-and-scenarios.md
│   └── papers/                                  # Research literature & domain papers
│       ├── 84-8.pdf
│       ├── REAL_TIME_FRAUD_DETECTION_IN_DIGITAL_BAN.pdf
│       └── research_paper_1.pdf
├── src/kurukshetra/                             # Core Python implementation
├── analysis/                                    # Research phases 00 through 09
├── Prasad/                                      # Project context and domain research
└── prompt_tasks.md/                             # Research prompt task logs
```

---

## Key Documentation Links

- **Official Submission Document (DOCX):** [`docs/Kurukshetra_Agentic_Guardian_PS09_Submission.docx`](./docs/Kurukshetra_Agentic_Guardian_PS09_Submission.docx)
- **Product Requirements Document (PRD):** [`docs/PRD.md`](./docs/PRD.md)
- **Documentation Index:** [`docs/README.md`](./docs/README.md)
- **Architecture Specification:** [`docs/02-architecture.md`](./docs/02-architecture.md)
- **Evaluation Scenarios:** [`docs/08-data-and-scenarios.md`](./docs/08-data-and-scenarios.md)

---

## Safety & Architectural Invariants

1. **Deterministic Supremacy:** The LLM agent can recommend increasing risk caution (raising friction), but can **never** lower risk below what the deterministic ML baseline identified.
2. **Fail-Safe Operation:** If LLM specialists time out or fail schema validation, the system falls back safely to hot-path deterministic tiers without blocking legitimate transactions or crashing.
3. **Adversarial Resilience:** Untrusted transaction notes are treated purely as data and wrapped inside strict delimiters, neutralizing prompt injection attempts.
4. **Audit Integrity:** Every evaluation generates a cryptographically sealed, SHA-256 hash-chained log entry for transparent regulatory auditability.

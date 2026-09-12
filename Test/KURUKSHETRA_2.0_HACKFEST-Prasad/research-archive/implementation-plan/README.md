# Kurukshetra // Implementation Plan & Master Specifications

This directory houses the authoritative, engineering-grade technical specifications, implementation blueprints, and requirement traceability matrices for **Project Kurukshetra — Agentic Guardian for Real-Time Payment Scam Interception (PS09)**.

---

## Authoritative Documentation Artifacts

### 1. [COMPLETE_36_SCENARIOS_AND_FEATURES_SPECIFICATION.md](./COMPLETE_36_SCENARIOS_AND_FEATURES_SPECIFICATION.md)
The **complete technical catalog of all 36 real-world fraud scenarios, banking protocol hooks, mathematical detection formulas, and code mappings** derived from `research-archive/base.md`. Covers:
- **Category A:** VPA Resolution Intelligence (Features 1–4)
- **Category B:** Transaction Context & Initiation Intelligence (Features 5–8)
- **Category C:** QR Code & Payment Link Forensics (Features 9–10)
- **Category D:** Network-Level Cross-Victim Intelligence (Features 11–13)
- **Category E:** Transaction Pattern & Evasion Forensics (Features 14–17)
- **Category F:** Recipient Account Forensics & CBS Indicators (Features 18–20)
- **Category G:** Banking & National Regulatory Infrastructure (Features 21–24)
- **Category H:** Cognitive Interventions & Decoupling Gates (Features 25–31)
- **Category I:** Cross-App MCP Ecosystem Middleware (Features 32–34)
- **Category J:** Adaptive Learning & Self-Tuning Closed Loop (Features 35–36)
- **Complete 36-Feature Traceability Matrix to Implementation Code & Test Files**

### 2. [MASTER_PS09_SYSTEM_SPECIFICATION.md](./MASTER_PS09_SYSTEM_SPECIFICATION.md)
The comprehensive, 48-section canonical system architecture, product specification, and end-to-end requirement traceability document. It connects:
- **PS09 Problem Statement** $\longleftrightarrow$ **SRS Requirements (`FR-SIM-01` to `FR-HITL-02`, NFRs)**
- **PRD Product Personas & Workflows** $\longleftrightarrow$ **Engine Architecture**
- **Dual-Path Latency Architecture (Hot <15ms / Warm $\le$1200ms)** $\longleftrightarrow$ **5-Tier Policy Router**
- **Causal TreeSHAP Explainability** $\longleftrightarrow$ **5-Second Cognitive Dwell Gate**
- **WORM Merkle Audit Vault** $\longleftrightarrow$ **Demonstration Scenarios A through H**
- **8 Architecture Decision Records (ADRs 001–008)** $\longleftrightarrow$ **Judge Defense Strategy**

### 3. [MODULE_ARCHITECTURE_AND_TECHNICAL_APPROACH.md](./MODULE_ARCHITECTURE_AND_TECHNICAL_APPROACH.md)
Granular, code-level architectural breakdown of every module across `kurukshetra-ecosystem`, `laukik/USPs/guardian/`, and `UI/`.

### 4. [Implementation Plan & Milestones](../analysis/09-implementation/implementation-plan.md)
The phased vertical-slice engineering plan detailing milestones M1 through M8, testing targets, and module layouts.

---

## Quick Reference: The Core Traceability Matrices
- **Section 14 in 36-Scenarios Spec:** Complete 36-Feature Code & Test Traceability Matrix
- **Section 37 in Master Spec:** SRS Traceability Matrix (Requirement ID $\rightarrow$ System Component $\rightarrow$ Code Path $\rightarrow$ Status)
- **Section 38 in Master Spec:** PRD Traceability Matrix (PRD Section $\rightarrow$ UX Flow $\rightarrow$ Backend Component $\rightarrow$ Demo Scenario)
- **Section 39 in Master Spec:** Problem Statement Traceability Matrix (PS09 Element $\rightarrow$ Problem Addressed $\rightarrow$ Solution $\rightarrow$ Demo Proof)
- **Section 40 in Master Spec:** Research-to-Architecture Traceability Matrix (Research Finding $\rightarrow$ Engineering Implication $\rightarrow$ ADR)

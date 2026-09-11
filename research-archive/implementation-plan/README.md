# Kurukshetra // Implementation Plan & Master Specifications

This directory houses the authoritative, engineering-grade technical specifications, implementation blueprints, and requirement traceability matrices for **Project Kurukshetra — Agentic Guardian for Real-Time Payment Scam Interception (PS09)**.

---

## Authoritative Documentation Artifacts

### 1. [MASTER_PS09_SYSTEM_SPECIFICATION.md](./MASTER_PS09_SYSTEM_SPECIFICATION.md)
The comprehensive, 48-section canonical system architecture, product specification, and end-to-end requirement traceability document. It connects:
- **PS09 Problem Statement** $\longleftrightarrow$ **SRS Requirements (FR-01 to FR-36, NFRs)**
- **PRD Product Personas & Workflows** $\longleftrightarrow$ **Engine Architecture**
- **16 Scam Typologies Threat Matrix** $\longleftrightarrow$ **Observable Telemetry Signals**
- **Dual-Path Latency Architecture (Hot <15ms / Warm $\le$1200ms)** $\longleftrightarrow$ **5-Tier Policy Router**
- **Causal TreeSHAP Explainability** $\longleftrightarrow$ **5-Second Cognitive Dwell Gate**
- **WORM Merkle Audit Vault** $\longleftrightarrow$ **Demonstration Scenarios A through H**
- **8 Architecture Decision Records (ADRs 001–008)** $\longleftrightarrow$ **Judge Defense Strategy**

### 2. [Implementation Plan & Milestones](../analysis/09-implementation/implementation-plan.md)
The phased vertical-slice engineering plan detailing milestones M1 through M8, testing targets, and module layouts.

---

## Quick Reference: The 4 Core Traceability Matrices
For fast auditing and evaluation, consult the following sections in the master specification:
- **Section 37: SRS Traceability Matrix** (Requirement ID $\rightarrow$ System Component $\rightarrow$ Code Path $\rightarrow$ Status)
- **Section 38: PRD Traceability Matrix** (PRD Section $\rightarrow$ UX Flow $\rightarrow$ Backend Component $\rightarrow$ Demo Scenario)
- **Section 39: Problem Statement Traceability Matrix** (PS09 Element $\rightarrow$ Problem Addressed $\rightarrow$ Solution $\rightarrow$ Demo Proof)
- **Section 40: Research-to-Architecture Traceability Matrix** (Research Finding $\rightarrow$ Engineering Implication $\rightarrow$ ADR)

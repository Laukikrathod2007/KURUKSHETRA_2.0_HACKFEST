# Knowledge Gaps & Epistemic Uncertainties: What Remains Unresolved After Phase 1

---

## 1. Executive Understanding (Layer 1)
A disciplined scientific inquiry does not pretend to possess total omniscience upon concluding a research phase. In cutting-edge cybersecurity and financial systems engineering, identifying and cataloging **what we do NOT know** is just as vital as cataloging what we have established.

While Phase 1 has firmly established the payment ecosystem topology, the APP scam threat model, social engineering mechanics, and real-time operational constraints, several **critical domain uncertainties** remain. These uncertainties stem from proprietary banking secrets, competitive TPAP algorithms, unpublished hackathon evaluation parameters, and evolving central bank policy directives.

---

## 2. Categorized Knowledge Gap Matrix (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REMAINING EPISTEMIC UNCERTAINTIES                        │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ PRIORITY TIER     │ UNRESOLVED DOMAIN QUESTIONS                             │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **[CRITICAL]**    │ • Evaluation Interface Topology (SDK vs Proxy vs Web)   │
│                   │ • Test Vector Context Richness (URI vs Chat logs)       │
│                   │ • Legal Override Limits (Can AI permanently block?)     │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **[IMPORTANT]**   │ • Beneficiary Bank Metadata Latency in `ReqValAdd`      │
│                   │ • NPCI In-Flight Switch Timeouts for P2P vs P2M         │
│                   │ • Ground-Truth Benchmark Distribution & Loss Metrics    │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **[USEFUL]**      │ • Android 14/15 Telephony API Permissions Policy        │
│                   │ • Operational Cost per Query for Private Indian SLMs    │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **[OPTIONAL]**    │ • Cross-Border UPI Remittance Scam Vectors (Singapore)  │
│                   │ • Offline UPI 123PAY Feature Phone Scam Typologies      │
└───────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 3. Deep Analysis of Critical Knowledge Gaps (Layer 3)

### Gap 1: Evaluation Interface Topology [CRITICAL]
* **The Uncertainty:** The problem statement mandates a *"Payment simulation interface"* demonstrating an *"end-to-end workflow"*. It does not specify whether the judges expect:
  1. A modern web-based dashboard simulating a smartphone UI and banking backend.
  2. A real Android application package (APK) running on an emulator with simulated banking hooks.
  3. A headless CLI testing harness evaluating JSON transaction streams.
* **Impact:** Determines the entire software engineering stack for the demo prototype.
* **Working Interim Assumption:** A rich, responsive web application modeling a consumer mobile payment screen paired with an active security telemetry panel provides the highest demonstration clarity for competition judging.

### Gap 2: Test Vector Context Richness [CRITICAL]
* **The Uncertainty:** When judges evaluate the 4 required scenarios (Normal, Unverified, Suspicious, High-Risk), what data will be injected? Will test cases contain **only standard UPI Intent parameters** (`pa`, `pn`, `am`, `tn`), or will they include **synthetic conversational chat logs** (e.g., transcripts of the preceding phone call)?
* **Impact:** Determines whether the Guardian must extract 100% of its semantic risk from minimal payment strings, or whether a multi-turn chat analysis pipeline is evaluated.
* **Working Interim Assumption:** System must be engineered to succeed on **minimal on-rail payment parameters alone**, while supporting optional contextual ingestion if richer data is provided.

### Gap 3: The Hard Autonomous Block Authority Boundary [CRITICAL]
* **The Uncertainty:** In real-world Indian banking law, an app cannot permanently seize or refuse a user's right to transfer their own funds. Does the hackathon evaluation reward a system that **autonomously hard-blocks** high-risk transactions, or does it penalize hard blocks as a violation of user sovereignty, rewarding **cognitive friction and temporary pauses** instead?
* **Impact:** Directly affects the decision threshold for the high-risk scenario.
* **Working Interim Assumption:** Implement a **proportional intervention hierarchy**: autonomous hard blocks are enforced exclusively on verified malicious blacklists and remote-access attacks; for severe social engineering, enforce an unbypassable cooling-off pause and cognitive challenge.

---

## 4. Boundaries & Research Directives for Downstream Phases (Layer 4)

### 4.1 Epistemic Invariants
* The team must actively test and resolve these gaps during Phase 2 (Threat Modeling) and Phase 3 (Architecture & Evaluation Design).
* **Zero Guesswork:** If an uncertainty cannot be resolved through public documentation, it must be explicitly exposed and defended as a **justified engineering design decision**.

---
**Primary References:**
1. Official Hackathon Evaluation Rubric & FAQ Addendum: *PS09 Clarifications*.
2. Reserve Bank of India: *Regulatory Sandbox Framework on Retail Payments and Cyber Security*.

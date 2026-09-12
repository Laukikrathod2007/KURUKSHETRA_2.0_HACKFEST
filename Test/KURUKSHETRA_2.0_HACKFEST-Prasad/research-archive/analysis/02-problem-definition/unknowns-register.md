# Unknowns & Epistemic Uncertainty Register: Verified Facts vs. Hypotheses & Gaps

---

## 1. Executive Summary

A core discipline of scientific problem analysis is the **rigorous separation of established facts from working assumptions and unverified unknowns**. In high-stakes engineering domains like financial crime defense, mistaking a hypothesis for a proven fact leads directly to building systems on false premises.

This document establishes the formal **Epistemic Classification Register** for Phase 2. Every critical dimension of the problem space is categorized across six explicit evidentiary tiers: **Established Fact**, **Strongly Supported Finding**, **Reasonable Interpretation**, **Working Hypothesis**, **Unverified Assumption**, and **Critical Unknown / Conflicting Evidence**.

---

## 2. Epistemic Classification Framework

```
+-----------------------------------------------------------------------------------------------+
| EVIDENTIARY TIER TAXONOMY                                                                     |
|                                                                                               |
| 1. ESTABLISHED FACT (EF)            | Directly supported by official statutes, network specs,  |
|                                     | or incontrovertible primary empirical data.             |
| 2. STRONGLY SUPPORTED FINDING (SF)  | Derived from multiple authoritative industry/government |
|                                     | reports and consistent empirical observations.          |
| 3. REASONABLE INTERPRETATION (RI)   | Logical analytical conclusion derived from established  |
|                                     | domain facts; not yet formally codified.                |
| 4. WORKING HYPOTHESIS (WH)          | Plausible operational theory requiring empirical testing|
|                                     | and validation in subsequent research.                  |
| 5. UNVERIFIED ASSUMPTION (UA)       | Presumed premise held by practitioners; unproven or     |
|                                     | doubtful under adversarial conditions.                  |
| 6. CRITICAL UNKNOWN / CONFLICT (CU) | Missing evidence, unmapped protocol behavior, or direct |
|                                     | contradiction between authoritative sources.            |
+-----------------------------------------------------------------------------------------------+
```

---

## 3. Comprehensive Epistemic Register

### 3.1 Tier 1: Established Facts (EF)
*   `[EF-01]` Modern retail instant payment rails (UPI, FedNow, UK Faster Payments) settle transactions irrevocably and immediately (< 2–5 seconds). *(Source: CPMI/BIS; NPCI Procedural Guidelines; FedNow Operating Circular 8)*.
*   `[EF-02]` Authorized Push Payment (APP) scams pass 100% of cryptographic multi-factor authentication (MFA) and PIN checks because the authentic account holder enters the credentials. *(Source: UK PSR PS23/3; RBI Cyber Fraud Reports)*.
*   `[EF-03]` Mobile payment applications operate in isolated user space and cannot inspect plaintext PINs entered into the native secure enclave (Common Library). *(Source: NPCI Common Library ICD; Android KeyStore Spec)*.
*   `[EF-04]` Post-clearing asset recovery rates through law enforcement portals remain below 3% to 5% globally due to rapid mule dispersion. *(Source: I4C CFCFRMS Compendium 2024; Europol EMMA Report)*.

---

### 3.2 Tier 2: Strongly Supported Findings (SF)
*   `[SF-01]` Static text warning dialogues are routinely dismissed by scam victims within 400–800ms due to sensory warning habituation and scammer pre-scripting. *(Source: Cialdini 2021; ENISA Threat Landscape; Acquisti et al. HCI Studies)*.
*   `[SF-02]` Organized scam syndicates maintain industrial supply chains of freshly opened or rented mule accounts, rotating them within 24 to 72 hours of first credit. *(Source: Europol; UK Finance; Cyber Peace Foundation)*.
*   `[SF-03]` High-stress impersonation scams ("digital arrest") require sustained active telephone/video communications (>30 minutes) during the transaction preparation phase. *(Source: Indian Cyber Crime Coordination Centre I4C Threat Dossier 2024)*.

---

### 3.3 Tier 3: Reasonable Interpretations (RI)
*   `[RI-01]` Placing an autonomous agentic reasoning pipeline (requiring >2 seconds) directly into the synchronous, in-flight authorization socket of a payment switch will cause gateway timeouts and protocol failures.
*   `[RI-02]` The optimal architectural locus for behavioral context evaluation is the client-side payment application during the 2-to-5 minute pre-flight formulation window, rather than the 500ms network transit window.
*   `[RI-03]` Sending banks fail to detect scams primarily because they evaluate transaction risk looking only at the solvent, authentic payer, completely blind to the destination account’s mule anomalies.

---

### 3.4 Tier 4: Working Hypotheses (WH)
*   `[WH-01]` Introducing **contextual cognitive friction** (e.g., interactive de-biasing questions specific to the scam narrative) can break psychological cognitive capture more effectively than static visual warnings.
*   `[WH-02]` A hybrid architecture—combining sub-50ms local on-device behavioral heuristics with asynchronous near-real-time graph intelligence—can satisfy both payment switch latency SLAs and scam detection accuracy.
*   `[WH-03]` Detecting anomalous typing hesitation, clipboard paste events, and active telephone call states simultaneously yields a high-confidence indicator of active social engineering coercion.

---

### 3.5 Tier 5: Unverified Assumptions (UA)
*   `[UA-01]` *Assumption*: Mobile operating systems (Android, iOS) will permit payment applications to query active telephone call states without triggering App Store bans or privacy violations. *(Status: Unverified; Google Play policies severely restrict background telephony inspection)*.
*   `[UA-02]` *Assumption*: Payment network switches can be modified to support a 60-second "risk pause" or "escrow hold" without breaking the underlying ISO 20022 message state machine. *(Status: Doubtful; current instant rails operate on binary Approve/Decline semantics)*.
*   `[UA-03]` *Assumption*: Commercial banks will willingly share real-time recipient risk scores across institutional borders without violating bank secrecy or competition laws. *(Status: Unverified; requires formal regulatory safe-harbor legislation)*.

---

### 3.6 Tier 6: Critical Unknowns & Contradictions (CU)

| # | Critical Unknown / Conflict | Nature of the Gap | Why It Cannot Be Resolved Today | Phase 3 Investigation Priority |
| :- | :--- | :--- | :--- | :--- |
| **CU-01** | **Switch API Extensibility for In-Flight Holds** | Missing Protocol Evidence | Proprietary switch internal specifications (NPCI UPI Switch ICD) are not publicly published; requires formal architecture interviews. | **Critical (P0)** |
| **CU-02** | **Legal Duty of Mandate vs. Algorithmic Interception** | Conflicting Legal Precedents | Common law (*Philipp v Barclays*) enforces strict duty of mandate, whereas UK PSR regulations enforce mandatory scam prevention. Jurisdictional split. | **High (P1)** |
| **CU-03** | **Empirical Efficacy Rate of Interactive Friction** | Missing Empirical Data | While literature proves static warnings fail, quantitative data on the conversion rate of interactive friction puzzles on coerced victims is unavailable. | **High (P1)** |
| **CU-04** | **On-Device SLM Inference Latency on Budget Handsets** | Technical Performance Gap | Benchmark data for running quantised Small Language Models (1B–3B parameters) locally on $100 Android smartphones is currently unmeasured. | **Medium (P2)** |
| **CU-05** | **P2M Merchant Aggregator Fraud Underwriting Standards** | Opaque Commercial Practice | The exact KYC bypass mechanisms used by scammers to register shell merchant accounts with payment gateways remain proprietary to aggregators. | **Medium (P2)** |

---

## 4. Methodological Governance Rule

To maintain scientific integrity as the project progresses into subsequent phases:
1.  **No Unknown May Be Silently Converted to a Fact**: An item in Tier 5 (Unverified Assumption) or Tier 6 (Critical Unknown) can only be moved to Tier 1 or Tier 2 through **documented, primary empirical evidence**.
2.  **Architecture Must Respect Gaps**: If `CU-01` (In-Flight Hold Feasibility) remains unresolved, no system architecture may assume that in-flight network holding is a functional reality.

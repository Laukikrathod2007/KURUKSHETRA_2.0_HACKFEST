# Multidimensional Gap Discovery Framework

## 1. Executive Summary & Framework Architecture

To systematically discover what remains unresolved across the scam defense landscape, we construct a **Multidimensional Gap Discovery Framework**. Rather than examining the problem through a single narrow lens (e.g., purely machine learning accuracy or purely user interface design), this framework interrogates the intersection of problem requirements and existing capabilities across **twelve distinct analytical dimensions**:

```text
                    TWELVE DIMENSIONS OF GAP DISCOVERY
                    
  [Core Technical & Algorithmic]      [Operational & Ecosystem]
  1. Detection Gaps (A)               7. Explainability & Transparency (G)
  2. Temporal & Latency Gaps (B)       8. Human-in-the-Loop Bottlenecks (H)
  3. Context & Information Gaps (C/E)  9. Adaptability & Adversarial Drift (I)
  4. Behavioral Dynamics Gaps (D)     10. False-Positive & Friction Limits (J)
  5. Intervention & De-Biasing (F)    11. Multi-Actor Coordination (K)
  6. Recovery & Tracing Gaps (L)      12. Systemic & Epistemic Boundaries
```

This framework establishes the strict epistemological rules and analytical criteria governing each dimension, ensuring that gap discovery is driven by empirical evidence rather than speculative product design.

---

## 2. Epistemological Rules for Gap Discovery

To prevent confirmation bias, speculative inflation, and solution leakage, every candidate gap discovered across the twelve dimensions must adhere to five mandatory rules:

### Rule 1: The Problem Reality Test
A gap cannot be asserted based on an abstract theoretical scenario. The underlying failure mode must have been empirically documented and validated in Phase 2 (e.g., supported by regulatory reports from UK PSR, Reserve Bank of India, Australian NASC, or verified academic field studies).

### Rule 2: The Landscape Exhaustion Test
Before declaring that a capability is "missing," we must rigorously verify that it is not already solved by an existing approach analyzed in Phase 3. If an existing system (e.g., Featurespace, BioCatch, Confirmation of Payee) already adequately solves the issue under real-world conditions, it is classified as a **False Gap** and rejected.

### Rule 3: The Relevance and Materiality Test
The deficiency must be materially relevant to the primary objective: intercepting authorized push payment scams. Deficiencies that pertain strictly to generic card-not-present fraud, credit scoring, or post-hoc litigation that do not impact scam interception are excluded.

### Rule 4: Structural vs. Cosmetic Demarcation
A gap must represent a **structural limitation**—inherent to algorithms, network latency physics, legal secrecy boundaries, or human cognitive architecture. Cosmetic differences (e.g., "the warning modal uses blue instead of red text" or "vendor X does not have a mobile SDK") do not constitute systemic research gaps.

### Rule 5: Zero Solution Prescription (The Gap Boundary)
Every discovery must be articulated in terms of **what is missing in capability or understanding**, strictly avoiding prescriptive feature definitions. 
- *Permitted*: "Existing systems lack the capability to evaluate recipient account risk across competing institutions prior to payment clearance due to legal and technical barriers."
- *Forbidden*: "The system requires an autonomous multi-agent consensus network to query banks."

---

## 3. Overview of the Twelve Investigation Dimensions

### Dimension A: Detection Gaps
Focuses on the statistical and algorithmic boundaries of existing models. Investigates why supervised learning, gradient-boosted decision trees, and anomaly detection struggle to separate scam-induced transfers from legitimate atypical consumer spending.

### Dimension B: Temporal & Latency Gaps
Focuses on the physical timeline of payment execution. Evaluates the profound mismatch between instant settlement switches (<50ms–100ms budget), human psychological deception realization (hours to days), and the 90-second mule cash-out window.

### Dimension C & E: Context & Information Gaps
Examines the informational asymmetry paralyzing the ecosystem. Categorizes missing context into three distinct classes:
1. *Information that does not exist* (e.g., unrecorded verbal threats during a call).
2. *Information that exists but is inaccessible* (e.g., recipient account age locked behind bank secrecy laws).
3. *Information that exists but is unintegrated* (e.g., mobile device touch tremor disconnected from core payment risk engine).

### Dimension D: Behavioral Dynamics Gaps
Evaluates how systems observe and interpret human behavior. Explores why biometric sensors fail to capture cognitive coercion, how user distraction mimics hesitation, and why device-level indicators fail on Apple iOS due to OS sandboxing.

### Dimension F: Intervention & De-Biasing Gaps
Analyzes the breakdown between risk detection and user response. Investigates why static warning banners suffer from >85% neurological habituation within <800ms, how scammers pre-coach victims to bypass dynamic prompts, and why aggressive transaction blocking induces psychological reactance.

### Dimension G: Explainability & Decision-Transparency Gaps
Explores the opacity of existing automated fraud decisions. Evaluates the legal and operational barriers imposed by Model Risk Management guidelines (SR 11-7) and Adverse Action regulations (ECOA), and why black-box neural networks fail regulatory auditability.

### Dimension H: Human-in-the-Loop Bottlenecks
Examines the operational capacity of Security Operations Centers (SOCs) and fraud investigation teams. Analyzes the mathematical impossibility of using human analysts to review instant push payments when alert queues have an average dwell time of 4 to 24 hours while funds disperse in 90 seconds.

### Dimension I: Adaptability & Adversarial Drift
Evaluates how existing rule engines and supervised models degrade when criminal syndicates evolve their social engineering scripts, shift payout rails (e.g., from domestic bank transfers to cryptocurrency kiosks), or age mule accounts to evade tenure checks.

### Dimension J: False-Positive & Friction Limits
Examines the non-negotiable commercial ceiling on customer insult. Analyzes why banks cannot simply maximize recall by setting aggressive thresholds, as high false-positive rates trigger catastrophic cart abandonment and paralyze inbound customer call centers.

### Dimension K: Multi-Actor Coordination Gaps
Examines structural silos across the payment ecosystem. Analyzes why telecommunications providers, mobile OS vendors, sending banks, receiving banks, and law enforcement agencies operate in complete isolation without synchronized threat response.

### Dimension L: Post-Scam Recovery & Tracing Gaps
Investigates the collapse of post-facto remediation. Explores why victim reporting latency (24–72 hours) and multi-hop mule layering render traditional police freezes and clawback mechanisms ineffective in recovering stolen capital.

---

## 4. The Investigation Roadmap

The subsequent documents in `analysis/04-gaps/` execute a deep-dive investigation into each of these twelve dimensions:

```text
04-gaps/
├── detection-gaps.md                    <── Dimension A
├── temporal-gaps.md                     <── Dimension B
├── context-and-information-gaps.md      <── Dimensions C & E
├── behavioral-gaps.md                   <── Dimension D
├── intervention-gaps.md                 <── Dimension F
├── explainability-gaps.md               <── Dimension G
├── human-in-the-loop-gaps.md            <── Dimension H
├── adaptability-gaps.md                 <── Dimension I
├── friction-and-false-positive-gaps.md  <── Dimension J
├── coordination-gaps.md                 <── Dimension K
└── recovery-gaps.md                     <── Dimension L
```

Following this detailed dimensional investigation, candidate gaps will be subjected to the formal **Validation Test** (`validated-gaps.md`), counter-balanced against **False Gaps** (`false-gaps.md`), and prioritized through an evidence-based severity matrix (`gap-prioritization.md`).

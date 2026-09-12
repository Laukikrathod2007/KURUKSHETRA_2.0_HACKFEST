# Gap Prioritization and Severity Framework

## 1. Executive Summary & Methodology

Not all validated gaps are created equal. Some represent fundamental architectural blockades that paralyze the entire defensive apparatus, while others represent narrower operational frictions. To prioritize resources and direct future requirements discovery toward the highest-leverage intervention points, we construct a transparent, evidence-based **Gap Severity and Prioritization Framework**.

In strict compliance with Part 7 and Part 8 of the research mandate, prioritization is not determined by subjective preference or arbitrary numerical rankings. Instead, each gap is evaluated across **six objective evaluation criteria** derived from financial crime data, operational realities, and system constraints.

---

## 2. The Six Objective Severity Criteria

```text
                     THE SIX SEVERITY EVALUATION CRITERIA
                     
  [C1: Financial & Systemic Impact]
  Direct dollar loss volume, insolvency risk, and threat to national payment trust.
  
  [C2: Frequency & Exploitation Rate]
  Prevalence of the gap across daily scam incidents and criminal playbooks.
  
  [C3: Irreversibility & Temporal Velocity]
  Speed of exploitation and finality of loss once the gap is breached.
  
  [C4: Population Vulnerability]
  Disproportionate impact on vulnerable, elderly, or digitally illiterate demographics.
  
  [C5: Existing Mitigation Deficit]
  Absence or failure of compensating controls in the current landscape.
  
  [C6: Evidentiary Confidence]
  Quality and consistency of empirical proof validating the gap.
```

### Evaluation Scale (1 to 5 per Criterion):
- **1 (Negligible / Low)**: Minimal impact, rare occurrence, easily mitigated, weak evidence.
- **3 (Moderate)**: Meaningful operational impact, regular occurrence, partial mitigations exist.
- **5 (Catastrophic / Critical)**: Systemic failure, ubiquitous exploitation, zero existing mitigations, overwhelming empirical evidence.

---

## 3. Comprehensive Multi-Criteria Evaluation Matrix

| Gap ID | Gap Title | C1: Impact | C2: Freq | C3: Irrev | C4: Vuln | C5: Deficit | C6: Conf | Total Severity Score (Max 30) | Priority Classification |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **VG-01** | Authenticated Intent Decoupling | 5 | 5 | 5 | 5 | 5 | 5 | **30 / 30** | **CRITICAL** |
| **VG-02** | Real-Time Switch Latency vs. AI | 5 | 5 | 5 | 3 | 5 | 5 | **28 / 30** | **CRITICAL** |
| **VG-03** | Bilateral Inter-Bank Asymmetry | 5 | 5 | 5 | 4 | 5 | 5 | **29 / 30** | **CRITICAL** |
| **VG-04** | Habituation & Pre-Coaching Failure | 5 | 5 | 4 | 5 | 4 | 5 | **28 / 30** | **CRITICAL** |
| **VG-05** | Telephony & Communicative Silo | 4 | 5 | 4 | 4 | 5 | 5 | **27 / 30** | **CRITICAL** |
| **VG-06** | Mule Velocity vs. SOC Triage | 4 | 5 | 5 | 3 | 4 | 5 | **26 / 30** | **IMPORTANT** |
| **VG-07** | Commercial Customer Insult Ceiling | 4 | 4 | 3 | 3 | 4 | 5 | **23 / 30** | **IMPORTANT** |
| **VG-08** | Model Governance & Opacity Barrier | 4 | 4 | 3 | 2 | 4 | 4 | **21 / 30** | **IMPORTANT** |
| **VG-09** | Public Scam Benchmark Vacuum | 3 | 3 | 2 | 2 | 5 | 5 | **20 / 30** | **SECONDARY** |
| **VG-10** | AML "Tipping Off" Legal Paradox | 3 | 4 | 3 | 4 | 4 | 4 | **22 / 30** | **SECONDARY** |

---

## 4. Detailed Priority Tiers & Classification Rationale

```text
                        THE FOUR GAP PRIORITY TIERS
                        
  ┌─────────────────────────────────────────────────────────────┐
  │ TIER 1: CRITICAL GAPS (Score: 27 - 30)                      │
  │ Foundational architectural bottlenecks that enable >90% of  │
  │ scam losses. Must be addressed for any solution to succeed. │
  │ [VG-01, VG-02, VG-03, VG-04, VG-05]                         │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │ TIER 2: IMPORTANT GAPS (Score: 23 - 26)                     │
  │ High-impact operational and governance constraints that     │
  │ severely limit production efficacy and scalability.         │
  │ [VG-06, VG-07, VG-08]                                       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │ TIER 3: SECONDARY GAPS (Score: 20 - 22)                     │
  │ Real, validated constraints, but operate as legal boundaries│
  │ or research prerequisites rather than real-time blockades.  │
  │ [VG-09, VG-10]                                              │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │ TIER 4: UNCERTAIN GAPS (Pending Further Field Evidence)     │
  │ Emerging theoretical gaps with incomplete empirical backing.│
  │ [UG-01: Deepfake Acoustic Telephony Saturation]             │
  └─────────────────────────────────────────────────────────────┘
```

---

### 4.1 Tier 1: Critical Gaps (Foundational Systemic Bottlenecks)

These five gaps represent the core structural failure modes of modern payment defense. If a future solution does not resolve or circumvent these bottlenecks, it cannot succeed:

1. **VG-01: Authenticated Intent Decoupling (Score: 30/30)**:
   - *Rationale*: This is the root cause of the entire Authorized Push Payment crisis. The entire global security infrastructure is optimized for *credential possession*, while the attacker exploits *human psychological intent*. Until payment authorization verifies human volition rather than mathematical key possession, every downstream defense remains vulnerable to social engineering.
2. **VG-03: Bilateral Inter-Bank Asymmetry Void (Score: 29/30)**:
   - *Rationale*: Senders cannot see payee risk, and receivers cannot see victim distress. This cross-institutional data silo is the primary operational seam exploited by criminal syndicates. Resolving this cross-bank information barrier is mathematically essential to identifying mules prior to clearance.
3. **VG-02: Real-Time Switch Latency vs. Deep AI Paradox (Score: 28/30)**:
   - *Rationale*: The physical constraint of payment clearing (<50ms) makes it impossible to run deep reasoning at the switch level. Any defense architecture that attempts to place heavy AI or multi-hop GNNs directly into the synchronous switch clearance path is doomed to failure by physics.
4. **VG-04: Neurological Habituation and Pre-Coaching Failure (Score: 28/30)**:
   - *Rationale*: Over 85% of users dismiss existing warnings in <800ms, and scammers actively script victim answers to bank questionnaires. If user-facing intervention cannot break System 1 panic and neutralize scammer coaching, detection accuracy is irrelevant because the user will force the transaction through anyway.
5. **VG-05: Communicative & Telephony Telemetry Silo (Score: 27/30)**:
   - *Rationale*: Impersonation and digital arrest scams rely on active, continuous voice calls. Mobile OS sandboxing and telco silos blind banking apps to this single most predictive signal. Bridging this communication boundary is essential to intercepting coercive scams.

---

### 4.2 Tier 2: Important Gaps (Operational & Governance Bottlenecks)

These three gaps constrain the scalability, deployability, and economic viability of defense systems:

6. **VG-06: Mule Velocity vs. SOC Triage Mismatch (Score: 26/30)**:
   - *Rationale*: Funds disperse across mule hops and cash out in 90 seconds, while human investigator queues take 4 to 24 hours. While slightly secondary to pre-clearing prevention, near-real-time streaming containment (0–90s) is critical to intercepting multi-hop smurfing before terminal ATM extraction.
7. **VG-07: Commercial Customer Insult Ceiling (Score: 23/30)**:
   - *Rationale*: The 40:1 insult ratio cap prevents banks from deploying aggressive detection models. Solving this requires shifting from blunt, binary transaction blocks to calibrated, adaptive micro-friction that does not trigger customer churn or call center meltdowns.
8. **VG-08: Model Governance & Adverse Action Opacity (Score: 21/30)**:
   - *Rationale*: Even if an advanced neural network achieves high accuracy, it cannot legally be deployed in banking operations unless it satisfies Federal Reserve SR 11-7 repeatability audits and ECOA Adverse Action disclosure mandates.

---

### 4.3 Tier 3: Secondary Gaps (Legal & Research Prerequisites)

9. **VG-10: AML "Tipping Off" Legal Paradox (Score: 22/30)**:
   - *Rationale*: Restricts banks from disclosing counterparty mule intelligence to victims. While legally frustrating, systems can compensate by providing alternative behavioral or contextual justifications without breaching statutory tipping-off provisions.
10. **VG-09: Public Scam Benchmark Vacuum (Score: 20/30)**:
    - *Rationale*: Academic research is crippled by the lack of open datasets representing authorized scams. While critical for the broader scientific community, private enterprise banks can partially circumvent this by training on proprietary internal data under non-disclosure agreements.

---

### 4.4 Tier 4: Uncertain Gaps (Emerging Frontiers Requiring Evidence)

- **UG-01: Deepfake Acoustic Telephony Saturation**:
  - *Description*: The hypothesis that real-time AI voice cloning will completely replace human social engineering callers in consumer payment scams.
  - *Current Status*: **Uncertain**. While verified in high-profile corporate CEO fraud (BEC) and targeted grandparent kidnapping scams, widespread industrialization of live real-time voice deepfakes targeting retail consumers remains limited by PSTN telephony codec compression and computational latency. Marked for continuous monitoring as voice generation technology advances.

---

## 5. Summary Matrix of Prioritized Gaps

```text
  SEVERITY SCORE
  ▲
  │  [VG-01: Intent Decoupling (30)]
  │  [VG-03: Bank Asymmetry (29)]
  │  [VG-02: Latency Paradox (28)]   [VG-04: Pre-Coaching (28)]
  │  [VG-05: Telephony Silo (27)]
  │─────────────────────────────────────────────────────────────◄ CRITICAL TIER (27+)
  │  [VG-06: Mule Velocity (26)]
  │  [VG-07: Insult Ceiling (23)]
  │  [VG-08: Model Governance (21)]
  │─────────────────────────────────────────────────────────────◄ IMPORTANT TIER (23-26)
  │  [VG-10: Tipping Off (22)]
  │  [VG-09: Benchmark Void (20)]
  │─────────────────────────────────────────────────────────────◄ SECONDARY TIER (20-22)
  │  [UG-01: Deepfake Voice Saturation (Pending Evidence)]
  └─────────────────────────────────────────────────────────────►
                                                    EMPIRICAL IMPACT
```

This prioritization establishes clear strategic focus: any future solution design must concentrate its primary architectural innovations on the **Five Critical Gaps**, while respecting the operational and legal constraints imposed by the Important and Secondary tiers.

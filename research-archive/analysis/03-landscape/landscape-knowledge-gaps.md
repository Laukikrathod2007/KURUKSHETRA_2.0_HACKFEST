# Landscape Knowledge Gaps & Unresolved Research Questions

## 1. Executive Summary & Context

A rigorous landscape investigation must define not only what is known, but also **what remains unknown, unverified, or contradictory** across the existing body of knowledge. In financial crime defense, vast portions of critical operational data, model architectures, and performance metrics are guarded as trade secrets or obscured behind corporate marketing.

In strict compliance with Part 18 and Part 19 of the research mandate, this document records **research knowledge gaps**—not product requirements or solution recommendations. Each gap is structured under the disciplined four-part format:
```text
Observation
Evidence
Implication
Open question
```
Under no circumstances does this document conclude with premature product prescriptions (e.g., *"Therefore our system must build an agent to solve X"*). The objective is purely to map the boundaries of empirical knowledge.

---

## 2. Structured Landscape Knowledge Gaps

### 2.1 Gap 1: Real-World In-Line Inference Latency of Client-Side Behavioral Biometrics

- **Observation**: Commercial behavioral biometric vendors (e.g., BioCatch, ThreatFabric, Sardine) claim to detect user hesitation, dictation, and emotional distress during payment setup, but public documentation does not reveal the exact latency, network overhead, or battery footprint of streaming this telemetry to the backend risk engine.
- **Evidence**: Vendor whitepapers emphasize high AUC scores and "continuous invisible profiling," but independent technical benchmarks showing end-to-end latency distributions (P50, P99, P99.9) for on-device feature extraction and upstream API transmission are absent from peer-reviewed literature.
- **Implication**: It is unclear whether continuous behavioral feature extraction can execute smoothly on low-end consumer Android smartphones (which dominate emerging markets like India and Southeast Asia) without causing UI stutter, app crashes, or unacceptable network payload overhead.
- **Open Question**: What is the minimum computational and network bandwidth budget required to reliably compute and transmit behavioral hesitation features from a mobile client to a scoring engine before payment authorization?

---

### 2.2 Gap 2: Cross-Border Efficacy of Centralized Inter-Bank Mule Consortiums

- **Observation**: Centralized clearing house fraud solutions (e.g., Mastercard CFR, NPCI MuleHunter.ai) demonstrate strong mule account detection within domestic payment boundaries, but their ability to track funds that cross national borders into international payment corridors remains unverified.
- **Evidence**: Published case studies from UK Pay.UK and Mastercard CFR report impressive 40% reductions in domestic mule activity. However, international law enforcement reports (Interpol Financial Fraud Assessments 2023–2024) document that major scam syndicates route proceeds out of domestic jurisdictions within minutes via peer-to-peer cryptocurrency platforms, hawala networks, or cross-border payment gateways.
- **Implication**: Domestic inter-bank graph models may merely push scam proceeds into unmonitored cross-border channels rather than permanently dismantling criminal cash-out operations.
- **Open Question**: How effective are domestic graph-based mule detection systems when scam syndicates immediately convert fiat proceeds into multi-chain cryptocurrency assets or cross-border trade invoices?

---

### 2.3 Gap 3: Long-Term User Habituation to Dynamic Cognitive Friction

- **Observation**: Tailored, context-specific warning screens and interactive speed bumps show promising initial results in laboratory experiments and early field pilots, but longitudinal studies tracking habituation over multi-year periods do not exist.
- **Evidence**: Behavioral economics literature establishes that static warnings lose >85% of their deterrent efficacy within days due to neurological habituation. Studies on dynamic prompts (NatWest, Barclays) demonstrate a 30% reduction in scam completions over 3-to-6 month pilot windows, but no published research verifies whether users eventually develop automated click-through reflexes to dynamic prompts as well.
- **Implication**: What appears to be an effective behavioral intervention in the short term may experience progressive decay over time as users learn to treat dynamic prompts as routine bureaucratic hurdles.
- **Open Question**: Does dynamic, context-tailored cognitive friction maintain its de-biasing effectiveness over a multi-year deployment lifecycle, or do users undergo secondary habituation?

---

### 2.4 Gap 4: Ground-Truth Multimodal Datasets for Authorized Push Payment Scams

- **Observation**: There is an absolute void of publicly accessible, standardized benchmark datasets representing real-world Authorized Push Payment (APP) scams with synchronized behavioral, transactional, and communicative telemetry.
- **Evidence**: Over 95% of published academic papers in financial fraud machine learning utilize datasets representing unauthorized credit card theft (Kaggle CreditCard, IEEE-CIS) or synthetic mobile money cash-outs (PaySim). None of these benchmarks contain client-side sensor streams, device call states, payment memo semantics, or social engineering dialogue contexts.
- **Implication**: Academic research claiming "state-of-the-art" fraud detection performance may be fundamentally misaligned with the real-world operational challenges of authorized push payment scams, producing models that cannot be deployed in production.
- **Open Question**: Can realistic, privacy-preserving synthetic benchmark environments be mathematically constructed that accurately reproduce the causal dynamics of victim psychological manipulation and multi-hop mule routing?

---

### 2.5 Gap 5: The Economic Tipping Point of False-Positive Customer Insult

- **Observation**: With the introduction of mandatory scam reimbursement regulations (e.g., UK PSR mandate October 2024), banks face massive direct liability for scam losses, yet the precise economic break-even point between customer friction (insult rate) and reimbursement savings remains undocumented publicly.
- **Evidence**: Retail banks traditionally capped false-positive ratios at ~5:1 to avoid cart abandonment and call-center overload. Under mandatory reimbursement up to £85,000 per scam event, banks are economically incentivized to tolerate much higher friction (e.g., 20:1 or 50:1), but empirical data measuring the resulting customer churn and brand damage has not been released.
- **Implication**: Without verified economic models, financial institutions risk either over-insulting legitimate customers (triggering severe commercial churn) or under-protecting against scams (triggering massive regulatory reimbursement liabilities).
- **Open Question**: What is the optimal mathematical balance in Net Economic Utility (NEU) between the operational/churn cost of customer friction and the financial liability of unreimbursed scam losses?

---

### 2.6 Gap 6: Latency and Scalability of Cryptographic Privacy-Preserving Inter-Bank Queries

- **Observation**: Cryptographic mechanisms such as Private Set Intersection (PSI) and Secure Multi-Party Computation (SMPC) theoretically solve the legal barrier of cross-bank data silos, but their computational feasibility under sub-50ms payment clearing constraints is unproven.
- **Evidence**: Published academic cryptographic benchmarks demonstrate that executing a secure set intersection across graphs containing hundreds of millions of account entities requires between 500ms and 5,000ms, even on high-performance server clusters.
- **Implication**: Cryptographic privacy-preserving lookups may be architecturally restricted to asynchronous post-settlement monitoring, leaving the real-time synchronous clearance path reliant on isolated, single-institution data.
- **Open Question**: Can modern cryptographic zero-knowledge or multi-party protocols achieve sub-30ms execution latencies for real-time beneficiary risk queries at national payment scale?

---

### 2.7 Gap 7: Detection Visibility Over Encrypted Over-The-Top (OTT) Communication Channels

- **Observation**: Scammers are rapidly migrating victim communication from traditional cellular voice calls (monitored by telecom carriers via STIR/SHAKEN and CAMARA APIs) to end-to-end encrypted VoIP applications (WhatsApp Voice, Telegram, Signal).
- **Evidence**: Industry reports from cybersecurity agencies in 2024–2025 indicate that over 60% of digital arrest and investment scam communications occur exclusively over WhatsApp or Telegram. Mobile operating system sandboxing completely prevents external security software from inspecting the connection state, metadata, or audio of these encrypted apps.
- **Implication**: Current investments in carrier-level telephony APIs (GSMA Open Gateway) may be rendered partially obsolete as criminal syndicates systematically exploit encrypted messaging channels.
- **Open Question**: Are there privacy-preserving, non-invasive behavioral or acoustic signals accessible to client mobile applications that can reliably infer active encrypted VoIP communication without violating application sandboxing?

---

## 3. Summary of Research Knowledge Gaps

| Gap ID | Research Domain | Core Unknown | Why It Matters |
| :--- | :--- | :--- | :--- |
| **GAP-01** | Mobile Client Telemetry | True latency & resource overhead of behavioral biometrics on low-end hardware | Feasibility of client-side continuous profiling across mass-market devices. |
| **GAP-02** | Graph Intelligence | Efficacy of domestic inter-bank mule tracking against cross-border crypto cash-outs | Determines whether domestic graph consortiums actually stop money or just displace it. |
| **GAP-03** | Human-Computer Interaction | Longitudinal habituation rates to dynamic, context-tailored friction prompts | Long-term sustainability of interactive cognitive de-biasing mechanisms. |
| **GAP-04** | Data & Benchmarking | Methodologies to synthesize realistic, privacy-compliant APP scam benchmarks | Foundation for reproducible machine learning and agentic evaluation. |
| **GAP-05** | Risk Economics | Exact commercial churn tipping point under mandatory bank scam reimbursement | Economic viability of aggressive preventative friction policies. |
| **GAP-06** | Applied Cryptography | Sub-50ms feasibility of Private Set Intersection (PSI) for inter-bank risk queries | Ability to solve cross-bank data silos without breaching real-time switch deadlines. |
| **GAP-07** | Channel Security | Methods to infer encrypted VoIP scam communication within mobile OS sandboxes | Resilience against scammer migration to WhatsApp and Telegram. |

```text
CORE LANDSCAPE TAKEAWAY:
These knowledge gaps represent the true scientific and engineering frontier 
of payment scam prevention. They cannot be solved by simply claiming to build 
an "AI agent." Any rigorous future solution design must explicitly acknowledge 
these empirical unknowns and structure its assumptions accordingly.
```

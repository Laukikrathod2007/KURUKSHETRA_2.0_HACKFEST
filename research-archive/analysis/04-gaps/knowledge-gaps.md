# Knowledge Gaps: Epistemic Unknowns in Scam Defense Research

## 1. Executive Summary & Context

A rigorous research synthesis must explicitly document the boundaries of its own knowledge. While Phase 4 has validated ten foundational structural gaps and four independent systemic discoveries, there remain several empirical questions where **the available scientific, industry, and regulatory evidence is incomplete, contested, or evolving**.

In strict compliance with Part 18 of the research mandate, this document records **research knowledge gaps**—unresolved empirical questions about the problem space and the gaps themselves. Each entry is structured under the four-part format:
```text
Observation
Evidence
Implication
Open question
```
Under no circumstances does this document jump to solution prescriptions. It serves as an epistemic register of what remains genuinely unknown.

---

## 2. Structured Catalog of Research Knowledge Gaps

### 2.1 Knowledge Gap 1: On-Device Edge NPU Inference Footprint on Mass-Market Hardware

- **Observation**: Shifting cognitive intervention into the pre-flight client drafting window (2–5 minutes) theoretically enables running lightweight semantic or behavioral neural models on the user's smartphone before payment dispatch. However, the exact memory footprint, battery drain, and thermal throttling of running continuous on-device inference on low-end consumer hardware remains undocumented in financial security literature.
- **Evidence**: Over 70% of digital payment users in emerging markets (such as India, Brazil, and Southeast Asia) operate smartphones powered by entry-level processors (e.g., MediaTek Helio, Qualcomm Snapdragon 4-series) with 2GB–4GB of RAM and no dedicated Neural Processing Unit (NPU). Benchmarks from edge AI research demonstrate that running quantized transformer or vision models on such devices can induce 200ms–800ms UI thread freezes and accelerate battery discharge by 15%–25%.
- **Implication**: If on-device edge defense models cannot execute within strict hardware resource bounds, client-side pre-flight intervention will cause app crashes or unacceptable user interface lag, triggering massive customer churn on the very demographic cohorts most vulnerable to scams.
- **Open Question**: What is the maximum parameter size and computational budget for an on-device edge model that can reliably extract behavioral and semantic scam indicators on a sub-$100 Android smartphone without degrading application responsiveness?

---

### 2.2 Knowledge Gap 2: The Longitudinal Habituation Half-Life of Dynamic Cognitive Friction

- **Observation**: While static warnings suffer immediate habituation (<800ms dismissal), early field pilots of dynamic, context-tailored prompts (e.g., CBA NameCheck, NatWest interactive speed bumps) show promising 30%–50% scam abandonment in the short term. However, longitudinal studies tracking user habituation to dynamic prompts over multi-year periods do not exist.
- **Evidence**: Human cognitive neuroscience establishes that the human brain seeks cognitive efficiency. In other security domains (such as browser SSL certificate warnings and mobile OS permission prompts), users initially paid close attention to dynamic modals, but gradually developed automated click-through reflexes over an 18-to-24 month period as the prompts became routine.
- **Implication**: Dynamic cognitive de-biasing techniques that appear highly effective in 6-month laboratory or pilot studies may experience progressive decay over a 3-to-5 year deployment lifecycle as users learn to treat dynamic prompts as routine bureaucratic hurdles.
- **Open Question**: What is the mathematical "habituation half-life" of dynamic, interactive cognitive friction prompts, and what mechanisms prevent users from developing automated System 1 click-through heuristics over prolonged exposure?

---

### 2.3 Knowledge Gap 3: Empirical Prevalence of Real-Time Generative Voice Clones in Retail Scams

- **Observation**: Industry discourse and cybersecurity advisories frequently warn that criminal syndicates are weaponizing generative AI voice cloning (deepfakes) to impersonate family members and executives in live phone calls. However, rigorous statistical data separating real-world deepfake incidents from traditional human impersonators is virtually nonexistent.
- **Evidence**: High-profile corporate CEO fraud incidents ($35M Hong Kong case) and isolated kidnapping scams have been verified by law enforcement. However, comprehensive empirical audits from telecommunications carriers (such as the Global Anti-Scam Alliance 2024 survey) indicate that over 95% of active scam call centers still employ human callers reading scripts from physical cubicles in Southeast Asia.
- **Implication**: Over-indexing defense investments on synthetic voice detection may divert resources from solving the foundational problem: human social engineering executed over standard telephone lines.
- **Open Question**: What proportion of active retail payment scam losses is currently attributable to real-time generative voice cloning versus human operators utilizing traditional social engineering scripts?

---

### 2.4 Knowledge Gap 4: Sub-30ms Feasibility of Cryptographic Private Set Intersection (PSI)

- **Observation**: Cryptographic protocols—specifically Private Set Intersection (PSI) and Secure Multi-Party Computation (SMPC)—theoretically solve the bilateral inter-bank information silo (VG-03) by allowing Bank A to query if a recipient account is flagged at Bank B without revealing raw customer PII. However, their computational latency at national payment switch scale remains unproven.
- **Evidence**: Published academic cryptographic benchmarks (e.g., *ACM CCS 2023*) report that state-of-the-art PSI protocols require **150ms to 800ms** to compute set intersection across sets of 10 million entities, even when utilizing multi-core server hardware and pre-computed oblivious transfer keys.
- **Implication**: If cryptographic cross-bank queries cannot execute in under 30ms, they cannot participate directly in the synchronous in-line clearance path of payment switches, restricting privacy-preserving collaboration to asynchronous post-settlement monitoring.
- **Open Question**: Can modern hardware-accelerated zero-knowledge or elliptic-curve PSI protocols achieve sub-30ms round-trip latency for real-time beneficiary risk verification across national payment graphs processing 50,000 TPS?

---

### 2.5 Knowledge Gap 5: The Net Economic Equilibrium of Bank Scam Reimbursement

- **Observation**: Regulatory mandates holding banks 50/50 liable for APP scam losses (such as the UK PSR mandate effective October 2024) fundamentally alter institutional incentives, encouraging banks to implement aggressive friction. However, the resulting macroeconomic equilibrium between scam reimbursement savings, customer churn, and friendly fraud remains unmeasured.
- **Evidence**: Initial retail banking models predict that aggressive preventative holds (e.g., 24-hour delays on new payees) reduce scam reimbursement payouts by 40%, but increase customer checkout abandonment and customer service call volume by 15%–25%. Concurrently, financial crime economists project a 20% increase in first-party friendly fraud claims as consumers exploit mandatory reimbursement policies.
- **Implication**: Without verified empirical equilibrium data, financial institutions risk either over-insulting legitimate consumers (destroying digital payment volume) or under-protecting against collusive first-party fraud.
- **Open Question**: What is the empirical Net Economic Utility (NEU) equilibrium point where the marginal savings from scam loss reimbursement equal the marginal operational cost of customer friction, call-center volume, and first-party fraud?

---

## 3. Summary of Research Knowledge Gaps

| Knowledge Gap ID | Domain | Core Empirical Unknown | Primary Impact on Defense Design |
| :--- | :--- | :--- | :--- |
| **K-GAP-01** | Edge Computing | Resource & thermal limits of edge neural inference on sub-$100 smartphones | Feasibility of client-side pre-flight cognitive reasoning on mass-market devices. |
| **K-GAP-02** | Cognitive Science | Longitudinal habituation decay rate of dynamic friction over multi-year lifecycles | Long-term sustainability of interactive cognitive de-biasing techniques. |
| **K-GAP-03** | Threat Intelligence| True proportion of retail scam volume driven by live AI deepfake audio | Proportional allocation of acoustic vs. semantic defense investments. |
| **K-GAP-04** | Applied Cryptography | Sub-30ms feasibility of Private Set Intersection (PSI) at national switch scale | Possibility of solving cross-bank data silos within in-line switch deadlines. |
| **K-GAP-05** | Risk Economics | Net macroeconomic equilibrium between mandatory reimbursement, churn, and moral hazard | Economic optimization of preventative transaction delay policies. |

```text
CORE KNOWLEDGE GAP TAKEAWAY:
Documenting these five research unknowns ensures the project maintains 
intellectual humility. We do not pretend to possess answers to questions 
that remain unresolved across the global scientific and industrial community. 
Future requirements discovery in Phase 5 must explicitly design around these 
epistemic boundaries.
```

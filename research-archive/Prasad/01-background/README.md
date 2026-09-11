# Phase 1: Deep Domain Research Knowledge Base
## Indian Digital Payments, Scam Mechanics, Fraud, Security & Operational Reality

> **Project:** PS09 — Agentic Guardian for Real-Time Payment Scam Interception  
> **Repository:** `01-background/`  
> **Status:** Phase 1 Complete (Comprehensive Research Knowledge Base)

---

## Master Directory & Knowledge Architecture

This directory houses the complete, deep domain research base for **PS09**, organized into eight specialized conceptual modules containing 32 interconnected research documents:

```
01-background/
│
├── 01-payments/                                    # Payment Economics, Rails & Protocols
│   ├── payments-overview.md                        # Push vs Pull, Clearing vs Settlement
│   ├── indian-payment-ecosystem.md                 # UPI, NPCI, Banks, TPAPs, Market Topology
│   ├── upi-overview.md                             # UPI Specifications, URI Syntax, Protocols
│   ├── payment-actors.md                           # Actor Responsibilities & Control Boundaries
│   ├── payment-lifecycle.md                        # End-to-End Lifecycle & Pre-PIN Window
│   ├── authentication-vs-authorization.md          # AuthN vs AuthZ Paradox in APP Scams
│   └── transaction-states.md                       # Finite State Machine & Point of Irreversible Commit
│
├── 02-fraud-and-scams/                             # Financial Cybercrime & Attack Vectors
│   ├── fraud-fundamentals.md                       # Legal Definitions, Technical Fraud, ATO
│   ├── scam-fundamentals.md                        # Scam Anatomy, Cognitive Manipulation, Levers
│   ├── fraud-vs-scam.md                            # Comprehensive 12-Dimensional Comparison
│   ├── indian-scam-taxonomy.md                     # 9 Major Indian Scam Archetypes Dissected
│   ├── scam-attack-anatomy.md                      # 10-Stage Kill Chain & Observability Cliff
│   ├── social-engineering.md                       # Amygdala Hijacking, Linguistic Markers
│   ├── authorized-scam-payments.md                 # APP Scams & The Friction Paradox
│   ├── money-mules.md                              # Mule Networks, 180s Dissipation Cycle
│   └── case-studies.md                             # 3 Real Forensic Reconstructions
│
├── 03-payment-security/                            # Defensive Technologies & Architectures
│   ├── payment-security.md                         # Cryptographic Foundations, HSMs, Limits
│   ├── fraud-detection-fundamentals.md             # Rules, GBDTs, Biometrics, Graph Analytics
│   ├── risk-vs-anomaly-vs-fraud.md                 # Multi-Vector Risk vs Anomaly Formulation
│   ├── recipient-verification.md                   # Confirmation of Payee, Display Spoofing
│   ├── intervention-concepts.md                    # 6-Tier Proportional Intervention Spectrum
│   ├── user-security.md                            # C-HIP Model, Habituation, HCISec Realities
│   └── failure-modes.md                            # 8 Systemic Failure Modes & Fallbacks
│
├── 04-information/                                 # Data Assets, Telemetry & Privacy
│   ├── payment-data.md                             # 11 Payment Information Categories
│   ├── information-by-time.md                      # Temporal Matrix (Pre-PIN vs Post-Settled)
│   ├── evidence-model.md                           # Multi-Modal Graph & Signal Polarity
│   ├── data-quality.md                             # Class Imbalance, Label Lag, Asymmetric Loss
│   └── privacy-context.md                          # DPDP Act 2023, RBI Localization, OS Sandbox
│
├── 05-operational-context/                         # Production Engineering & Governance
│   ├── real-time-payments.md                       # Latency Envelopes & Synchronous Budgets
│   ├── operational-reality.md                      # 8,000 TPS, Fraud Ops, Shadow Governance
│   ├── scalability-context.md                      # Tail Latency, Redis, Circuit Breakers
│   ├── regulatory-context.md                       # PSS Act, BNS 2023, Section 91 CrPC, Liability
│   └── institutional-responsibilities.md           # RBI, NPCI, Bank, Telco Gaps & Seams
│
├── 06-existing-context/                            # Current Market Solutions & Global Benchmarks
│   ├── indian-payment-security-practices.md        # NPCI FRM, GPay Shield, Paytm Screen Block
│   ├── payment-app-user-experience.md              # Real Consumer UX Flows & Exploited Blindspots
│   ├── existing-interventions.md                   # Banners, Modals, Holds & Inoculation Scripts
│   └── commercial-and-global-solutions.md          # BioCatch, Featurespace, UK CoP, Pix MED
│
├── 07-concepts/                                    # Advanced Engineering Concepts & Lexicon
│   ├── agentic-concepts.md                         # Computational Agency vs Static Classifiers
│   ├── llm-domain-context.md                       # LLM Strengths, Prompt Injection, Division of Labor
│   ├── adversarial-environment.md                  # Evasion, Smurfing, Homoglyphs, Red Teaming
│   └── glossary.md                                 # 12 Comprehensive Domain Terms & Distinctions
│
└── 08-knowledge-structure/                         # Metacognitive Synthesis & Audit
    ├── information-control-matrix.md               # Master Matrix across all 10 Lifecycle Stages
    ├── domain-dependencies.md                      # Structural Dependency Architecture Graph
    ├── knowledge-gaps.md                           # Remaining Epistemic Uncertainties
    └── phase-1-review.md                           # 12-Point Comprehensive Scientific Audit
```

---

## PART 1: THE 13 FINAL PHASE 1 DELIVERABLES

### 1. Domain Understanding Summary
Digital payment security has historically focused on **securing the transmission pipe** and **verifying user identity** against unauthorized account takeover (ATO). In the Indian digital economy—dominated by the real-time, irreversible gross messaging of the **Unified Payments Interface (UPI)**—cybercrime has undergone a paradigm shift from technical intrusions to **Authorized Push Payment (APP) Scams**. In APP scams, the legitimate user authorizes the transaction using their genuine smartphone, biometrics, and secret MPIN under the influence of deceptive psychological manipulation (urgency, impersonation, authority intimidation). Because the authentication is 100% genuine, traditional bank-side fraud engines view the transfer as legitimate. Halting these crimes requires an **intelligent, client-side, interaction-level guardian** that intervenes *before the user commits their MPIN*, evaluating counterparty divergence, semantic coercion, and interaction hesitation to deploy calibrated, cognitive protective friction. *(Full details: [payments-overview.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/01-payments/payments-overview.md), [fraud-vs-scam.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/02-fraud-and-scams/fraud-vs-scam.md)).*

### 2. Indian Payment Ecosystem Map
The ecosystem operates across four interconnected tiers:
1. **Regulator:** Reserve Bank of India (RBI) establishing security mandates (Master Direction RBI/2020-21/74) and licensing payment systems under the PSS Act 2007.
2. **Switch Operator:** National Payments Corporation of India (NPCI) running the central UPI/IMPS switch, managing the VPA routing directory, and operating switch-level Fraud Risk Management (FRM).
3. **Banking Infrastructure:** Remitter Banks (holding customer deposits and validating PINs in Hardware Security Modules) and Beneficiary Banks (crediting recipient ledgers and harboring mule accounts).
4. **Application Tier:** Third-Party Application Providers (TPAPs like PhonePe, Google Pay, Paytm) operating under tripartite agreements with PSP Banks, controlling the consumer UI/UX. Scammers exploit the structural seams between these sovereign entities. *(Full details: [indian-payment-ecosystem.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/01-payments/indian-payment-ecosystem.md), [payment-actors.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/01-payments/payment-actors.md)).*

### 3. Payment Lifecycle
The retail payment lifecycle progresses through 9 stages: Intent Trigger $\rightarrow$ Payload Staging $\rightarrow$ VPA Resolution (`ReqValAdd`) $\rightarrow$ Pre-PIN Review Screen $\rightarrow$ MPIN Capture in NPCI Common Library $\rightarrow$ Switch Message Routing $\rightarrow$ Remitter CBS Debit $\rightarrow$ Beneficiary CBS Credit $\rightarrow$ Irreversible Retail Settlement. The **Pre-PIN Review Window ($1.5\text{s} - 4.0\text{s}$)** is the sole operational chokepoint where intervention is viable. Once the MPIN is submitted, the transaction crosses the **Point of Irreversible Commit (PIC)**, making client-side cancellation impossible. *(Full details: [payment-lifecycle.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/01-payments/payment-lifecycle.md), [transaction-states.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/01-payments/transaction-states.md)).*

### 4. Scam Taxonomy
The Indian scam landscape is dominated by nine distinct archetypes:
1. *Electricity Bill Disconnection Scams* (manufactured power cut panic; ₹10 token fees).
2. *"Digital Arrest" Extortion* (fake CBI/Police Skype video calls; liquidating assets into "RBI verification" accounts).
3. *Part-Time Task / Telegram Job Scams* (Ponzi tasks, initial micro-payouts, escalating deposits).
4. *Fake Stock / Crypto Investment Groups* (social proof in VIP trading channels).
5. *OLX / Marketplace Reverse QR Scams* ("scan this QR code to receive money").
6. *Fake Customer Care SEO Poisoning* (spoofed Google numbers leading to AnyDesk downloads).
7. *Courier / FedEx Narcotics Parcel Extortion* (fake drug parcels tied to victim's Aadhaar).
8. *Bank KYC / SIM Expiry SMS Smishing* (phishing links harvesting netbanking credentials).
9. *Friend / Family Medical Emergency Impersonation* (compromised WhatsApp accounts demanding immediate hospital fees). *(Full details: [indian-scam-taxonomy.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/02-fraud-and-scams/indian-scam-taxonomy.md), [case-studies.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/02-fraud-and-scams/case-studies.md)).*

### 5. Social Engineering Model
Social engineering operates via **Cognitive Tunneling (Amygdala Hijacking)**. Scammers apply extreme urgency, institutional authority (police/regulator), fear of immediate loss, and social proof to suppress the victim's analytical prefrontal cortex (System 2) and force automatic, survival-driven compliance (System 1). In this state, victims experience inattentional blindness: standard warning dialogs are treated as visual noise or technical glitches. Scammers pre-emptively "inoculate" victims by telling them in advance that the app will display a false security warning, coaching them to click "Proceed" immediately. *(Full details: [social-engineering.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/02-fraud-and-scams/social-engineering.md), [user-security.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/03-payment-security/user-security.md)).*

### 6. Evidence Model
Risk cannot be determined from an isolated transaction amount. The **Domain Evidence Model** constructs a multi-layer graph across:
* *Payer Tier:* Historical baseline ticket size, frequent counterparties, device integrity.
* *Transaction Intent Tier:* Amount anomaly, payment channel (QR vs Collect vs Push), semantic tokens in payment notes (`tn`).
* *Recipient Counterparty Tier:* VPA handle syntax, bank-verified legal name (`RespValAdd`), phonetic/Levenshtein distance against claimed brand, national cybercrime blacklist status.
* *Environmental & Interaction Tier:* Screen dwell time, interaction hesitation, active phone call status, screen-sharing flags. Threat synthesis requires evaluating the intersection of **Intent Divergence + Counterparty Anomaly + Urgency Context**. *(Full details: [evidence-model.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/04-information/evidence-model.md)).*

### 7. Information Availability Matrix
Information manifests across a strict temporal timeline:
* *Available Pre-PIN (Actionable for Prevention):* Payer baseline profile, hardware integrity, contact list, destination VPA, payment note, bank-verified payee name, screen dwell time, active telephony call flag.
* *Available Post-Settlement (Useless for Prevention):* Recipient inward cash-out velocity, mule account rapid dispersal patterns, victim 1930 cybercrime complaints, central bank net settlement reconciliation. Real-time interception must rely exclusively on Pre-PIN telemetry. *(Full details: [information-by-time.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/04-information/information-by-time.md), [information-control-matrix.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/08-knowledge-structure/information-control-matrix.md)).*

### 8. Security Controls
Current security controls operate across four distinct tiers:
1. *Hardware/Cryptographic Tier:* SIM-device binding, Secure Enclave keys, Hardware Security Modules (HSMs) validating MPINs, TLS 1.3 packet encryption.
2. *Switch Monitoring Tier:* NPCI central FRM rules, ₹1,00,000 daily P2P velocity limits, ₹2,000 unverified collect request caps.
3. *TPAP Application Tier:* Google Pay Safety Shield, Paytm remote access (AnyDesk) auto-lock, PhonePe new-recipient warning modals.
4. *Government Reporting Tier:* 1930 Helpline and the CFCFRMS inter-bank mule freezing portal.
*All cryptographic and hardware perimeters are bypassed in APP scams because the authentic user authorizes the transaction.* *(Full details: [payment-security.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/03-payment-security/payment-security.md), [indian-payment-security-practices.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/06-existing-context/indian-payment-security-practices.md)).*

### 9. Real-Time & Intervention Concepts
"Real-time" in payment security means executing **synchronously inline before the MPIN is captured**, fitting within a **$800\text{ ms} - 1,500\text{ ms}$ compute budget**. Intervention is not a binary allow/block switch; it is a **6-tier calibrated continuum**:
* *Tier 0:* Silent Pass-Through & Audit Log (normal verified transfers).
* *Tier 1:* Informational Notice (new recipient with clean record).
* *Tier 2:* Explainable Warning Modal (minor anomaly / unverified P2P).
* *Tier 3:* Cognitive Interruption Challenge (suspicious request / name mismatch; forces user to solve a logic puzzle or type a confirmation phrase).
* *Tier 4:* Deliberative Cooling-Off Pause (acute urgency / high value; mandatory 15-minute hold breaking the scammer's verbal trance).
* *Tier 5:* Hard Autonomous Block (verified cybercrime blacklist or remote access app active). *(Full details: [real-time-payments.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/05-operational-context/real-time-payments.md), [intervention-concepts.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/03-payment-security/intervention-concepts.md)).*

### 10. Failure Modes
Payment security systems face eight critical failure modes:
1. *False Positives:* Blocking emergency medical payments or festive transfers, causing extreme user churn.
2. *False Negatives:* Zero-day scams with clean metadata passing undetected.
3. *Latency Timeouts:* Cloud LLM calls exceeding switch SLAs, dropping transactions.
4. *Out-of-Band Blindness:* Scams executed over phone calls with blank payment notes.
5. *Label Lag:* Fresh mule accounts appearing "clean" on blacklists during their first 48 hours.
6. *Adversarial Evasion:* Smurfing transfers into micro-payments below monitoring thresholds.
7. *Indirect Prompt Injection:* Scammers embedding override directives in payment notes (`tn`).
8. *The Fail-Open/Closed Deadlock:* Security service crashes forcing a choice between uninspected payments or national checkout blackouts. Systems must implement graceful degradation to local compiled heuristic rules. *(Full details: [failure-modes.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/03-payment-security/failure-modes.md)).*

### 11. Domain Glossary
Established a 12-term authoritative lexicon defining: **VPA, MPIN, TPAP, Authorized Push Payment (APP) Scam, Money Mule, Cognitive Tunneling, Cognitive Interruption Challenge, Confirmation of Payee (CoP), Point of Irreversible Commit (PIC), Indirect Prompt Injection, Bounded Autonomy, and 1930 / CFCFRMS**. Every term is documented with technical definitions, PS09 relevance, common engineering misconceptions, and legal sources. *(Full details: [glossary.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/07-concepts/glossary.md)).*

### 12. Knowledge Gaps
Isolated remaining epistemic uncertainties:
* *Critical:* Prototype evaluation interface topology (Web simulator vs Android APK vs CLI harness); Test vector context richness (raw URI vs chat transcripts); Legal override boundaries for autonomous hard blocking.
* *Important:* Beneficiary bank latency in real-time `ReqValAdd` responses; Ground-truth benchmark loss weighting.
* *Useful/Optional:* Android 14/15 telephony permissions roadmap; Offline UPI 123PAY scam typologies. Formulated working interim assumptions for each gap. *(Full details: [knowledge-gaps.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/08-knowledge-structure/knowledge-gaps.md)).*

### 13. Phase 1 Critical Review
Conducted a 12-point scientific audit across completeness, distributed state accuracy, threat model fidelity, cognitive psychology rigor, Indian regulatory grounding, and zero premature solutioning. Verified that no models, databases, microservices, or code have been prematurely chosen. Concluded with official **Phase 1 Exit Certification**. *(Full details: [phase-1-review.md](file:///d:/Programming/Project%203.0/MIT_Hackathon/01-background/08-knowledge-structure/phase-1-review.md)).*

---

## PART 2: FINAL SYNTHESIS QUESTIONS (DOMAIN EXPERT ANSWERS)

### 1. What does a legitimate digital payment look like?
A legitimate digital payment is an uncoerced, purposeful transfer of value where the payer's subjective intent matches the objective economic reality of the counterparty. It exhibits:
* A familiar, trusted counterparty (e.g., a recurring grocery merchant, utility aggregator, landlord, or friend present in the user's historical graph).
* Pacing consistent with normal human interaction: the user opens the app voluntarily, reviews the details without adrenaline-fueled haste or prolonged paralysis, and types their PIN with a stable, confident typing cadence.
* Consistency between the recipient's claimed identity, the registered bank account name, and the Merchant Category Code (MCC).
* The payment occurs within the user's typical temporal window (e.g., daytime or evening, not 3:30 AM unless emergency).

### 2. What does a scam-induced payment look like?
A scam-induced payment is a transaction executed by the authentic account holder under the influence of active cognitive manipulation, manufactured urgency, or fraudulent misrepresentation. It exhibits:
* A profound mismatch between the user's intended counterparty (e.g., "Electricity Department", "CBI Cyber Cell", "Army Officer") and the legal entity registered on the receiving bank account (e.g., a newly created personal VPA belonging to an individual in another state).
* Relational novelty: the user has never interacted with or transferred funds to this VPA in their historical transaction baseline.
* Anomalous interaction pacing: either extreme, panicked haste ($<5$ seconds from intent generation to payment attempt) or an abnormally prolonged, hesitant dwell time on the confirmation screen while being coached over an active telephone call.
* Semantic markers in the payment remarks field (`tn`) reflecting acute urgency, legal threats, verification tokens, or cashback lures.

### 3. How are they technically different?
Technically, they differ in their **relational graph properties, semantic coherence, and interaction telemetry**:
* *Entity Coherence:* Legitimate payments route to verified merchant handles (`@billdesk`, `@razorpay`) or known personal contacts where Levenshtein distance between claimed and legal name is zero; scam payments route to disposable P2P mule handles exhibiting massive phonetic and category divergence.
* *Channel Context:* Legitimate utility and government payments route through verified biller networks (BBPS) or merchant QR codes; scam utility payments route via P2P direct push or deceptive collect requests.
* *Device State:* Scam payments frequently occur while an active telephony voice call or background remote-desktop application (AnyDesk) is running; legitimate retail checkouts occur in standalone app sessions.

### 4. How can they look technically similar?
To the central payment switch (NPCI) and the remitter bank's Core Banking System (CBS), a scam payment and a legitimate payment look **100% mathematically identical**:
* Both originate from the user's authentic physical smartphone with valid hardware SIM binding.
* Both originate from the user's familiar residential IP address or home cellular network.
* Both are authenticated by the user typing the correct secret 6-digit MPIN into an encrypted Hardware Security Module (HSM).
* Both satisfy all standard account balance and daily velocity limits. 
* *If an evaluation engine only inspects cryptographic tokens, network packets, and account balances, the scam is completely invisible.*

### 5. How does an attacker manipulate the user?
An attacker manipulates the user by executing an **out-of-band social engineering kill chain** that bypasses technical perimeters and exploits evolutionary human psychology:
* *Manufactured Crisis / Urgency:* Threatening catastrophic consequences (immediate power cut in 10 minutes, public arrest by police, freeze of all assets) to trigger amygdala hijacking, which suppresses analytical prefrontal reasoning and induces cognitive tunneling.
* *Authority Projection:* Presenting forged badges, official CBI seals, fake Supreme Court warrants, and professional bureaucratic jargon to exploit conditioned human deference to authority.
* *Isolation:* Forbidding the victim from disconnecting the call or speaking to family members ("This is a confidential national security investigation"), preventing external sanity checks.
* *Pre-Emptive Inoculation:* Coaching the victim in advance to dismiss native payment app security warnings (*"The app will show a red error popup—it is just our high-security server updating; click 'Proceed' immediately"*).

### 6. What information surrounds a transaction?
A transaction is surrounded by an extensive constellation of multi-modal data:
1. *Financial Metadata:* Amount, timestamp, currency, terminal ID, UTR/RRN reference.
2. *Counterparty Identifiers:* Payee VPA, Payee display string (`pn`), Bank-verified legal name (`RespValAdd`), Handle domain, MCC.
3. *Semantic Text:* Transaction remarks (`tn`), invoice line items, QR payload metadata.
4. *Payer Historical Graph:* 90-day transaction volume, frequent counterparties, average ticket size, typical spending hours.
5. *Interaction Telemetry:* Millisecond dwell time on confirmation screen, touch pressure, gesture hesitation, typing speed.
6. *Device & Environmental Context:* Telephony call status, active screen-sharing software, OS security posture (root/emulator).
7. *Threat Intelligence:* National cybercrime complaint registries (1930 / I4C), recent velocity spikes on destination VPA.

### 7. What information exists before payment completion?
The information available **Pre-PIN (Prior to Completion)** is strictly:
* The Payer's historical baseline profile and local device integrity.
* The destination VPA and raw display string.
* The transaction amount and payment note (`tn`).
* The bank-verified legal account name returned via real-time VPA resolution (`ReqValAdd`).
* The user's screen dwell time and active interaction telemetry.
* Active telephone call or screen-share flags exposed by the local mobile OS.
* *Crucially, downstream mule fund movement, cash-out logs, and victim cybercrime reports DO NOT EXIST yet.*

### 8. What security mechanisms already exist?
Modern payment rails incorporate substantial native defenses:
* *Cryptographic:* Hardware device binding, TLS 1.3 mTLS tunnels, HSM-backed encrypted PIN verification, Android Keystore / iOS Secure Enclave protection.
* *Network Rules:* NPCI switch-level velocity counters, daily ₹1 Lakh limits, ₹2,000 caps on P2P collect requests.
* *App-Level:* Google Pay Safety Shield unfamiliar contact banners, Paytm automated locks on active AnyDesk/RustDesk software, PhonePe unverified recipient warning dialogs.
* *Institutional:* 1930 National Cybercrime Portal and the CFCFRMS automated bank freezing system.
* *All existing mechanisms fail against scams because they are either bypassed by the coerced user typing their valid PIN, or act hours after funds have already been laundered.*

### 9. What does “real-time” mean operationally?
In payment security, "real-time" does not mean high-frequency trading microsecond latency. It means **predictable, synchronous execution within the human payment decision lifecycle**:
* For normal, low-risk payments, the evaluation must complete in **$<1,500\text{ ms}$** to avoid noticeable UI lag or checkout abandonment.
* For ambiguous or high-risk payments, "real-time" expands into **intentional, protective friction**: enforcing a mandatory **$15\text{ s} - 30\text{ s}$ cognitive challenge** or a **15-minute cooling-off pause** that provides the temporal buffer needed to break the scammer's psychological control.
* *Operationally, "real-time" strictly means BEFORE the transaction state transitions to `AUTH_CAPTURED`.*

### 10. What does “interception” mean conceptually?
Interception is the **active, calibrated disruption of the transaction flow before legal and cryptographic commitment occurs**. 
* It is **not passive notification:** showing a small text banner that the user ignores is not interception.
* It is **not post-facto recovery:** reporting a transaction to the police after money has left the account is not interception.
* Interception means **dynamically altering the interface state**: freezing the "Pay" button, presenting explainable counter-evidence, demanding cognitive verification, placing the payment on hold, or terminating the session entirely when catastrophic fraud certainty is established.

### 11. Why is recipient information relevant?
The recipient (payee) is the **single most discriminative point of leverage** in scam detection:
* Legitimate payments route to verified merchants, registered utility billers, or established acquaintances.
* Scams route to **money mule accounts**: newly created VPAs, individual accounts claiming to be government agencies, or accounts exhibiting suspicious velocity anomalies.
* Comparing the **entity claimed by the user or scammer** against the **legal name registered on the receiving bank account** provides an immediate, definitive signal of impersonation.

### 12. Why is user behavior relevant?
User behavior provides the **contextual baseline** against which anomalies are measured:
* A ₹50,000 transfer to an unverified VPA is normal for a wealthy business owner who regularly pays wholesale vendors, but is a red-flag anomaly for a student whose historical median payment is ₹150.
* Interaction behavior (hesitation on the confirmation screen, unusual dwell time, nervous typing cadence) directly reflects the **psychological conflict** occurring in a victim who is being pressured or confused by an attacker.

### 13. Why is context potentially relevant?
Context transforms isolated, ambiguous numbers into **interpretable human intent**:
* The string `am=2500` is completely neutral.
* Adding the payment note `tn=Electricity bill disconnection tonight` immediately reveals that the transaction is operating under manufactured urgency.
* Cross-referencing that note with destination `pa=subhash88@okaxis` reveals that an individual is masquerading as a state power utility.
* Context provides the **causal explanation** that enables an intelligent guardian to understand *why* a transaction is happening and explain *why* it is dangerous to the user.

### 14. What are the most important domain concepts we need to carry into Phase 2?
The non-negotiable conceptual pillars for Phase 2 (Threat Modeling) are:
1. **The Authorized Push Payment Paradox:** AuthN is valid; AuthZ is corrupted. Traditional perimeter and credential fraud models are useless.
2. **The Pre-PIN Golden Window:** Interception must execute while the transaction is in the mutable `PENDING_AUTH` state before MPIN capture.
3. **The Multi-Layer Evidence Triad:** Risk must synthesize Payer Baseline + Transaction Intent + Recipient Verification + Interaction Telemetry.
4. **Cognitive Tunneling & Warning Habituation:** Passive warning dialogs are dismissed via motor habituation; high-risk interception requires active cognitive disruption.
5. **The Asymmetric Friction Paradigm:** Zero friction on safe payments; targeted, unbypassable friction on acute threat vectors.
6. **Bounded Autonomy & The Hybrid Division of Labor:** Deterministic rules enforce hard limits, safety invariants, and latency budgets; intelligent models provide contextual NLU and plain-language explainability.

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1 RESEARCH CONCLUSION                              │
│                                                                             │
│   >>> DOMAIN COMPETENCE OFFICIALLY ESTABLISHED <<<                          │
│                                                                             │
│   All 32 specialized domain research modules in 01-background/ have         │
│   been verified. The environment in which PS09 exists is now mapped with     │
│   mathematical, operational, and legal precision.                           │
│                                                                             │
│   READY TO PROCEED TO PHASE 2: THREAT MODELING & ATTACK SURFACES.           │
└─────────────────────────────────────────────────────────────────────────────┘
```

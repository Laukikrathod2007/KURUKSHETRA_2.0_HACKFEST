# Comparative Matrix of Existing Scam Defense Approaches

## 1. Executive Summary & Context

To understand the existing landscape without falling into superficial product checklists, this document constructs a **comparative matrix of the leading paradigm families** in fraud and scam mitigation. Rather than comparing minor user interface features or marketing brochures, this matrix evaluates fundamental architectural, algorithmic, temporal, and operational differences across the primary approaches operating in production banking, payment networks, and research laboratories today.

---

## 2. Core Comparative Matrix

| Approach / System Family | Primary Problem Addressed | Detection Paradigm | Intervention Mechanism | Operational Timing & Latency | Input Signals Required | Underlying AI / ML Technology | Human Involvement | Verified Real-World Evidence | Primary Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Static Rules & Threshold Engines** *(e.g., Legacy Core Banking, Drools)* | High-velocity bots, gross limit violations, obvious geographic mismatches | Boolean logic, deterministic thresholds (e.g., Amount > $5,000) | Hard transaction rejection or mandatory SMS OTP step-up | In-line synchronous (<1ms–5ms) | Tabular transaction payload (Amount, Payer ID, Time of Day) | None (Deterministic boolean rules) | Manual rule writing and tuning by risk analysts | Universally deployed across 100% of global banking switches | Blind to authorized scams; zero behavioral awareness; extremely high false positives on legitimate unusual transfers. |
| **2. Supervised Tabular Scoring Engines** *(e.g., Featurespace ARIC, Feedzai Railgun)* | Complex multi-variate unauthorized transaction fraud, account takeover | Supervised classification; gradient boosted decision trees (GBDT) | Real-time score dispatch; automated block if score > threshold; alert queuing | In-line synchronous (15ms–45ms) | Transaction attributes, 90-day sender velocity features, device hashes | GBDT (XGBoost, LightGBM), Random Forests, compiled neural embeddings | Risk teams calibrate cutoff thresholds; Tier-1 SOC analysts review alerts | Tier-1 bank standard; documented 70%–85% detection of unauthorized card fraud | Poor performance on authorized scams (legitimate credentials used); cannot inspect client hesitation or recipient mule networks. |
| **3. Client-Side Behavioral Sensor SDKs** *(e.g., BioCatch, Sardine.ai, ThreatFabric)* | Social engineering manipulation, coached hesitation, remote access tool (RAT) usage | Anomaly detection over continuous sensor streams; touch pressure, swipe dynamics, gyro | In-app warning dialog; session termination; risk payload injected into payment request | Client-side continuous (pre-authorization: 200ms–1000ms) | Touch coordinates, accelerometer, screen-sharing status, clipboard events, active call state | Unsupervised behavioral profiling, temporal RNNs, autoencoders | Passive telemetry; rules trigger UI dialogs | Documented >65% correlation with tech-support scams; deployed by major UK/US retail banks | Restricted by mobile OS sandboxing (blind on iOS); environmental noise (walking/typing); high false positives from user distraction. |
| **4. Centralized Graph Analytics & Mule Trackers** *(e.g., Mastercard CFR, NPCI MuleHunter.ai)* | Multi-account money laundering, distributed mule smurfing rings, cross-bank cash-out | Graph topology analysis, community detection, heterogeneous GNNs | Flagging mule accounts to receiving banks; central rail hold; inter-bank freeze alerts | Near-real-time to post-settlement (500ms–60s) | Inter-bank transaction edges, account creation dates, inflow-outflow ratios | Heterogeneous GNNs (RGCN, CARE-GNN), PageRank, clustering | Investigators review complex multi-bank ring cases | Mastercard CFR documents 40% reduction in scam losses across UK pilot banks | Inter-bank data sharing barriers; computational latency prevents in-line scoring before clearance; cold data if reporting is delayed. |
| **5. Pre-Settlement Payee Verification** *(e.g., UK Confirmation of Payee, Pay.UK)* | Misdirected payments, fake invoice scams, payee impersonation | Deterministic cryptographic name-matching against receiving bank core records | Warning screens displayed to sender: Full Match, Close Match, No Match | Interactive pre-flight (500ms–1500ms during payee setup) | Account number, sort-code / routing number, recipient legal name | Deterministic fuzzy string matching (Levenshtein / Jaro-Winkler) | User decides whether to proceed past warning | Reduced misdirected payments by >70% across the UK banking system | Scammers pre-coach victims to ignore "No Match" warnings; useless against genuine mules whose legal name matches the account. |
| **6. Contextual Dynamic Friction & Speed Bumps** *(e.g., CBA NameCheck, NatWest Typology Prompts)* | Impersonation, romance, and purchase scams where victim is in emotional panic | Typology classification based on payee attributes and transaction context | Timed countdowns, interactive de-biasing quizzes, 24-hour holds on first transfers | Interactive pre-flight (active user friction: 5s to 24 hours) | Payee age, transaction value, payment memo text, sender demographic risk | Decision trees, NLP keyword classifiers, behavioral risk scoring | User actively answers questions; exception overrides handled by phone support | CBA reported >AUD $100M in scam losses prevented; NatWest reported 30% scam drop-off | High customer insult and cart abandonment; scammers script answers in advance; high inbound support call volume. |
| **7. Generative AI Case Management Copilots** *(e.g., SymphonyAI Sensa, Palantir AIP, Unit21)* | Investigator alert fatigue, slow manual triage, complex SAR regulatory filing | LLM multi-source synthesis; automated natural language investigative drafting | Generates pre-filled Suspicious Activity Reports (SARs) and investigative summaries | Asynchronous offline (10 seconds to several minutes) | Core banking transaction ledgers, KYC documents, watchlist databases, historical alerts | Large Language Models (GPT-4, Claude, PaLM), Retrieval-Augmented Generation (RAG) | Human investigator must validate and legally sign off on all SAR submissions | Documented 60%–75% reduction in analyst narrative drafting time | Strictly post-facto; zero capability to intercept transactions in-line; risk of LLM factual hallucinations on transaction figures. |
| **8. Autonomous Conversational Honeypots** *(e.g., Academic Prototypes: ScamCom, Apate)* | Criminal syndicate intelligence gathering, wasting scammer time, mule account extraction | Conversational intent detection, persona-conditioned multi-turn dialogues | Autonomous multi-turn engagement over SMS, WhatsApp, or VoIP | Real-time external communication channels (minutes to hours) | Inbound scammer messages, voice audio streams, phone numbers, payment links | Multi-agent LLM systems, voice synthesis, autonomous tool calling | Human researchers monitor agent safety and review extracted endpoints | Successfully kept scammers engaged for 40+ minutes; extracted active mule accounts | Operates outside the victim's payment app; does not protect an active victim during payment authorization; prompt injection risks. |
| **9. Institutional Liability & Reimbursement Frameworks** *(e.g., UK PSR Mandate, Brazil Pix MED)* | Moral hazard across banks; failure of receiving banks to police mule accounts | Regulatory audit, dispute arbitration, automated post-settlement clawback | Mandatory 50/50 reimbursement split; automated API freezing of recipient accounts | Post-settlement to 14-day regulatory resolution window | Crime reports, transaction UTR numbers, evidence of gross negligence | None (Legal and regulatory mandate) | Payment Ombudsman, bank dispute resolution teams | UK PSR mandate drastically accelerated bank investments in scam defense infrastructure | Does not technically stop the fraud at execution time; moral hazard risks (first-party consumer fraud); complex dispute arbitration. |

---

## 3. Structural Comparison: The Four Critical Trade-Off Dimensions

When evaluating the fundamental approaches above, four non-negotiable trade-offs emerge:

```text
                               THE FOUR-WAY TRADE-OFF
                               
                                  [Interception Timing]
                                     In-Line Clearance
                                       ▲
                                       │
                                       │
            [Privacy & OS Access] ─────┼───── [Reasoning Depth]
            Deep Sensor Telemetry      │      Complex Multi-Hop / AI
                                       │
                                       ▼
                               [Customer Friction]
                             Zero-Click Frictionless
```

### 3.1 Interception Timing vs. Reasoning Depth
- **In-Line Approaches (1 & 2)** operate within the non-negotiable <50ms window. To achieve this speed, they are mathematically forced to use shallow, tabular, localized features.
- **Deep Reasoning Approaches (4, 7, & 8)** can traverse multi-hop graphs or execute LLM chains, but require between 2 seconds and several minutes, completely disqualifying them from in-line transaction clearance.

### 3.2 Detection Efficacy vs. Customer Friction
- **Frictionless Approaches (1, 2, & 4)** evaluate transactions passively in the background. While they preserve smooth user experience, they are chronically ineffective against authorized scams because the victim willingly inputs credentials.
- **Aggressive Friction Approaches (5 & 6)** actively interrupt the user with countdowns, quizzes, and 24-hour holds. They achieve the highest scam abandonment rates, but impose severe commercial costs in cart abandonment and customer support overhead.

### 3.3 Client-Side Context vs. Inter-Bank Visibility
- **Client-Side Approaches (3 & 6)** have exclusive access to the user's behavioral hesitation, active phone calls, and device state, but have zero visibility into whether the recipient account is a high-velocity mule.
- **Network / Central Rail Approaches (4 & 5)** have multi-bank visibility into the mule network, but are completely blind to the victim's psychological state and device integrity.

---

## 4. Key Takeaways from the Comparative Matrix

1. **No Single Approach Is Architecturally Sufficient**: Every single approach in the matrix possesses a structural blindspot that is actively exploited by criminal syndicates.
2. **The "Real-Time Scam Defense" Paradox**: Systems that are fast enough to clear transactions (<50ms) cannot reason deeply about social engineering; systems that can reason deeply about social engineering are too slow for in-line clearance.
3. **The Unbridged Divide**: The greatest operational gap in the existing landscape is the total decoupling between **client-side behavioral context** (the sender's phone) and **inter-bank graph risk** (the receiver's mule status).

```text
CORE LANDSCAPE TAKEAWAY:
The comparative matrix demonstrates that scam defense cannot be solved by 
a single "silver bullet" technology. Existing paradigms are fragmented into 
isolated silos: fast-but-shallow switch rules, deep-but-offline case managers, 
client-side sensors blind to recipient risk, and network graphs blind to victim 
manipulation. True structural advancement requires bridging these disconnected 
islands without violating the hard 50ms latency physics of payment switches.
```

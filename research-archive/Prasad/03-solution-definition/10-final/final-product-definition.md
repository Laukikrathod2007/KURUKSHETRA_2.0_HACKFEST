# Final Product Definition & Operational Blueprint

## Document Metadata
- **Module:** 10-final
- **File:** final-product-definition.md
- **Status:** APPROVED / LOCKED
- **Traceability:** Direct fulfillment of `PROBLEM_STATEMENT.md` (PS09 — Agentic Guardian for Real-Time Payment Scam Interception).

---

## 1. Product Overview & Identity

The **Agentic Guardian for Real-Time Payment Scam Interception** is an on-device and client-orchestrated payment security system engineered specifically for the Indian Unified Payments Interface (UPI) ecosystem. It intercepts social engineering, impersonation, deceptive collect requests, and coercive fraud attempts *before* the user authorizes a transaction via their secret UPI MPIN.

---

## 2. The 12 Foundational Operational Questions

### Q1: What is the official product name?
**Agentic Guardian (UPI Scam Interceptor)** — internal codename `Project Astra-Shield`.

### Q2: Exactly what problem does it solve?
It prevents authorized push payment (APP) fraud in India's UPI network. Scammers exploit social engineering (e.g., "Digital Arrests", utility bill cancellation threats, deceptive inverted collect requests, fake customer care, and marketplace advance fees) to trick legitimate account holders into willingly entering their MPIN. Existing banking controls only detect technical account takeover or post-facto fund draining; the Guardian prevents loss *pre-authorization*.

### Q3: Who is the end-user?
Any Indian consumer or business transacting on UPI payment applications (e.g., PhonePe, Google Pay, Paytm, BHIM, and banking apps) across Android and iOS devices, spanning digitally novice seniors to tech-savvy professionals facing sophisticated spear-phishing.

### Q4: Who is the deploying customer / commercial buyer?
1. **Primary Deployers:** Third-Party Application Providers (TPAPs like PhonePe, GPay, Paytm) and Payment Service Provider (PSP) Sponsor Banks (e.g., HDFC, ICICI, SBI, Axis) who embed the Guardian as an integrated client-side SDK and edge microservice.
2. **Ecosystem Regulatory Stakeholders:** National Payments Corporation of India (NPCI) and the Indian Cybercrime Coordination Centre (I4C / MHA) utilizing the standardized protocol for fraud intelligence exchange.

### Q5: Where does the software execute?
Across a **Federated Dual-Path Hybrid Architecture**:
- **On-Device Edge SDK:** Embedded within the mobile UPI client application. Listens to device sensors (telephony call state, screen sharing/accessibility flags, clipboard paste, navigation timing) and runs the compiled Hot-Path decision tree locally in memory.
- **Warm-Path Edge Gateway / Microservice:** A high-throughput, low-latency regional microservice hosting the SLM/LLM Agentic Reasoner, caching the NPCI `RespValAdd` directory lookups, and orchestrating the multi-modal evidence store.

### Q6: At what exact microsecond in the payment lifecycle does it intercept?
It intercepts during the **Pre-PIN Review Interval** (the natural 1.5 to 2.5-second dwell time between the user tapping "Pay / Proceed" and the loading of the secure NPCI Common Library MPIN entry screen).

### Q7: How does it make security decisions?
Through a **Tiered Dual-Path Triage Engine**:
1. **Deterministic Hot Path (<10ms):** A compiled LightGBM model evaluates 25 tabular features. If risk probability $P < 0.20$, the transaction is cleared instantly with zero friction.
2. **Cognitive Warm Path (1.2s - 1.8s):** If risk falls in the ambiguous corridor ($0.20 \le P \le 0.85$), the Agentic Reasoner retrieves the registered bank account legal name from NPCI CBS, evaluates semantic dissonance against entered details, tests competing hypotheses ($H_{\text{Scam}}$ vs $H_{\text{Emergency}}$), and emits structured intervention directives.

### Q8: What autonomous actions can it take?
- Emitting explainable real-time warning cards displaying official bank legal names.
- Enforcing graduated cognitive friction (disabling the pay button until the user reads the warning or acknowledges an identity mismatch).
- Pausing transaction flow and presenting a typing-based confirmation challenge for inverted collect requests.
- Imposing a physical **Call-Termination Interlock** that refuses to unlock MPIN entry until an active phone call is hung up.
- Initiating a 1-tap direct connection to the National Cybercrime Helpline `1930`.

### Q9: What actions can it NEVER take? (Hard Guardrails)
- **Zero Financial Write Agency:** It can NEVER debit, credit, hold, freeze, or redirect funds.
- **No Secret Interception:** It NEVER captures, logs, or transmits the user's secret 4/6-digit UPI MPIN (which remains strictly sandboxed inside the NPCI Common Library).
- **No Unilateral Blocking of Legitimate Emergencies:** It cannot permanently block a non-malware transaction without offering a transparent human confirmation path.

### Q10: How does it handle failures and network outages?
Through **Graceful Deterministic Degradation**:
- If the Warm-Path Agent times out past the strict **1,800ms circuit breaker**, the client immediately falls back to local edge deterministic heuristics.
- If network connectivity is lost entirely, the local Edge SDK defaults to verified local cache rules, ensuring legitimate payments are never stranded while high-risk call-and-paste signals still trigger safety badges.

### Q11: How is success quantitatively measured?
- **PR-AUC $\ge 0.88$** on severe class-imbalanced transaction distributions ($1:10,000$).
- **Friction Rate $\le 0.50\%$** (99.5% of legitimate everyday transactions experience zero friction).
- **Hot-Path Latency $p99 \le 15\text{ms}$**; Warm-Path Latency $p99 \le 1,800\text{ms}$.
- **Scam De-escalation Rate $\ge 65\%$** of targeted victims abandoning scam payments.
- **Positive Net Economic Value ($+\text{INR } 3.4\text{ Cr}$ per $10\text{M}$ transactions)**.

### Q12: What makes it fundamentally unique compared to existing defenses?
1. **Asymmetric Cognitive Friction vs Passive Popups:** Traditional apps show generic warnings that 96% of users dismiss. The Guardian forces active re-orientation (e.g., typing the scammer's real bank name, hanging up phone calls).
2. **Dual-Path Latency Architecture:** Unlike naive AI solutions that add 3-second delays to every transaction, our Hot/Warm triage keeps 99.5% of volume sub-10ms.
3. **Entity-Purpose Semantic Clash Detection:** By resolving NPCI Core Banking System (CBS) legal names in real time and comparing them against user intent, it exposes impersonators instantly.

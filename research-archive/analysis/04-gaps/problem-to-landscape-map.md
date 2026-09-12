# Problem-to-Landscape Capability Mapping

## 1. Executive Summary & Mapping Methodology

A gap cannot be discovered in a vacuum. A gap only exists where **the objective requirements of a problem exceed the verified capabilities of existing solutions**.

This document systematically cross-references the 8 core systemic failure modes (FM-01 through FM-08) and 5 major scam typologies established in Phase 2 against the 9 defensive approach families documented in Phase 3. For each intersection, we document:
1. What the existing approach successfully addresses (its validated capability).
2. What the existing approach fails to address (its operational boundary).
3. The empirical evidence establishing this boundary.

---

## 2. Comprehensive Problem-to-Landscape Capability Matrix

| Problem / Failure Mode | Existing Approach Family | Validated Capability (What It Successfully Addresses) | Unaddressed Operational Boundary (What It Fails to Address) | Verifiable Empirical Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **FM-01: Valid Credential Deception** *(Legitimate user completes biometrics, MFA, and PIN under deception)* | **Hardware Biometrics & FIDO2 / WebAuthn** | Prevents 100% of unauthorized remote credential theft, bot stuffing, and replay attacks. | **Zero protection against authorized push scams.** The legitimate user physically provides valid biometrics and session credentials while under psychological deception. | UK PSR Data (2024): Over 90% of APP scam losses occur through fully authenticated, biometrically verified sessions. |
| **FM-01: Valid Credential Deception** | **Supervised Tabular GBDTs** *(e.g., Feedzai, Featurespace)* | Detects device anomalies, unusual IP geolocation shifts, and high-frequency velocity bursts. | Fails when transaction value is within normal variance or when the victim makes small, gradual transfers (pig-butchering/task scams). Tabular models cannot assess user psychological intent. | Academic benchmarks on IEEE-CIS & Feedzai BAF: Models trained on tabular features collapse when attacker actions mimic authentic user behavior. |
| **FM-02: Real-Time Irrevocability Mismatch** *(Settlement in <2.5s; realization takes hours or days)* | **Mandatory Step-Up MFA & SMS OTPs** | Ensures the person holding the phone is authorized to debit the account; halts bot automation. | Does not slow down irrevocable clearance. The victim eagerly inputs the OTP to "save their money" or "secure their investment," instantly locking in the irreversible loss. | UK Treasury Committee Hearings on Economic Crime: 78% of impersonation scam victims voluntarily entered SMS OTPs within 15 seconds of receipt. |
| **FM-02: Real-Time Irrevocability Mismatch** | **Central Rail Immediate Settlement** *(e.g., UPI, FedNow, Pix)* | Provides instantaneous, 24/7 liquidity, deterministic clearing, and sub-second merchant settlement. | Strips the payment ecosystem of any post-clearance cancellation or recall window. Once the debit/credit ledger is updated, funds cannot be unilaterally clawed back without counterparty consent. | Federal Reserve FedNow Operating Circular No. 8 & NPCI UPI Procedural Guidelines: Credit transfers are final and irrevocable upon ledger acknowledgement. |
| **FM-03: Two-Ended Asymmetric Blindness** *(Sending bank blind to payee; receiving bank blind to victim)* | **Confirmation of Payee (CoP)** *(e.g., Pay.UK)* | Verifies if the legal name registered to the recipient sort-code/account matches the name entered by the sender. | Does not evaluate recipient account risk, age, or velocity. Useless when the mule account was opened under the mule's genuine legal name. Blind to whether the recipient is a high-velocity laundering hub. | Pay.UK CoP Annual Report (2023): CoP eliminated >70% of accidental misdirection, but APP scam losses continued to rise because mules operate under their real legal names. |
| **FM-03: Two-Ended Asymmetric Blindness** | **Bilateral Bank Secrecy Regulations** *(e.g., GLBA, DPDP, GDPR)* | Protects consumer financial privacy, prevents unlawful surveillance, and preserves competitive commercial separation. | Prohibits the receiving bank from sharing granular real-time telemetry (account age, inflow velocity, balance) with the sending bank before payment clearance. | US CFPB Guidance on Financial Privacy & European Banking Authority Guidelines on Data Sharing: Cross-institutional customer telemetry sharing is legally restricted without explicit statutory safe harbors. |
| **FM-04: Warning Dialog Habituation** *(Static UI disclaimers dismissed in <800ms)* | **Static Warning Banners & Confirmation Modals** | Fulfills legal liability and compliance disclosure mandates; reminds cautious users of standard risks. | Suffers from complete neurological habituation and inattentional blindness. Dismissed unconsciously by users in under 800ms through automated muscle reflex. | Peer-reviewed HCI studies (*ACM TOCHI 2022*): Over 85% of users dismiss static warning dialogs in under 800ms without reading body text. |
| **FM-05: Scammer Pre-Coaching Bypass** *(Scammer scripts answers to security questions in advance)* | **Interactive Dynamic Prompts & Quizzes** *(e.g., NatWest, Barclays, CBA)* | Prompts users to categorize the transaction (e.g., "Paying for goods", "Investing in crypto", "Transfer to family"). | Scammers anticipate the questionnaire and coach victims to lie (e.g., *"Select 'Family Gift', otherwise the bank's corrupt fraud department will block your funds"*). The questionnaire reinforces the scammer's narrative. | Australian National Anti-Scam Centre (NASC) Quarterly Report (2024): 62% of coached victims actively selected false multiple-choice responses to bypass bank security prompts. |
| **FM-06: The In-Line Latency Paradox** *(Switch ceiling <50ms vs. AI reasoning >2s)* | **Sub-50ms Compiled Rules & Decision Trees** | Evaluates basic limits, negative watchlists, and simple mathematical thresholds without breaching switch timeouts. | Incapable of executing multi-hop graph traversals, deep neural sequence analysis, or LLM reasoning. Misses complex, multi-account laundering rings and social engineering semantics. | Engineering benchmarks from NPCI, FedNow, and Feedzai Railgun: Graph traversals beyond 1-hop and LLM token generation physically exceed switch timeout ceilings (2,000ms–2,500ms). |
| **FM-06: The In-Line Latency Paradox** | **Generative AI Copilots & LLMs** *(e.g., Sensa, Palantir AIP)* | Deeply analyzes multi-source evidence, synthesizes unstructured logs, and generates regulatory SAR narratives. | Restricted entirely to offline back-office case management (10s to minutes). Zero capability to participate in the synchronous transaction clearance path to stop money from leaving. | Basel Committee on Banking Supervision (BCBS 2024): LLMs in financial crime are strictly advisory tools for post-event investigator workflows. |
| **FM-07: Mule Smurfing & Cash-Out Velocity** *(Proceeds dispersed and cashed out within 90s)* | **Bank SOC Fraud Alert Queues** *(Human Analyst Review)* | Provides nuanced human judgment, investigates edge cases, and satisfies regulatory oversight mandates. | Human investigation operates on a linear timescale (20–40 alerts per day per analyst; triage takes 4–24 hours). Funds are cashed out via ATMs or crypto within 90 seconds. Human review is strictly post-mortem. | ACFCS Industry Benchmarking (2024): Average alert queue dwell time exceeds 6 hours across retail banks; scam cash-out occurs in under 15 minutes. |
| **FM-07: Mule Smurfing & Cash-Out Velocity** | **Centralized Inter-Bank GNNs** *(e.g., Mastercard CFR, MuleHunter)* | Tracks multi-hop fund dispersion across member banks, identifying mule rings and shared syndicates. | Operates asynchronously near-real-time or in batch (5s to hours post-settlement). By the time a multi-bank graph cluster is flagged, the terminal mules have already withdrawn cash. | Mastercard CFR Technical Whitepapers & UK Pilot Audits: Inter-bank graph tracking successfully identifies mule accounts, but fund recovery rates remain under 20% once cash-out commences. |
| **FM-08: Cold Regulatory Intelligence** *(National blacklists lag fraud waves by 24h–72h)* | **National Suspect Registries** *(e.g., India I4C, Scamwatch, IC3)* | Aggregates police reports, coordinates frozen account notices, and provides macro-level crime analytics. | Victims report scams 24 to 72 hours after the event. By the time a phone number or UPI ID enters the blacklist, the scam syndicate has already abandoned the mule account and activated new ones. | Indian Ministry of Home Affairs (I4C Data 2024): Over 80% of funds reported after 2 hours are unrecoverable; mule accounts have an active operational lifespan of under 24 hours. |

---

## 3. Typology-Specific Coverage Analysis

To ensure complete coverage, we map existing capabilities against the five major scam typologies:

```text
                       TYPOLOGY-CAPABILITY COVERAGE DEFICIT
                       
  Typology                  Dominant Defense Today           Core Unaddressed Deficit
  ──────────────────────────────────────────────────────────────────────────────────────────
  1. Digital Arrest /       Client BioCatch SDK +             OS sandboxing blinds app on iOS;
     Impersonation          Static CoP Name Check             Victim coached to ignore CoP;
                                                              Switch blind to phone call state.
  ──────────────────────────────────────────────────────────────────────────────────────────
  2. Pig-Butchering /       Standard GBDT Scoring +           Transactions mimic normal savings
     Investment Romance     Daily Velocity Rules              deposits; gradual value buildup
                                                              bypasses single-transfer thresholds.
  ──────────────────────────────────────────────────────────────────────────────────────────
  3. Task & Employment      Basic Rule Limits                 Micro-deposits appear legitimate;
     Prepaid Traps          (e.g., Amount > $500)             scam operates below reporting
                                                              thresholds until final large loss.
  ──────────────────────────────────────────────────────────────────────────────────────────
  4. Commercial &           Confirmation of Payee             Mule operates under real name;
     Marketplace Scams      (Payee Name Match)                CoP returns "Match", giving victim
                                                              false confidence in fake seller.
  ──────────────────────────────────────────────────────────────────────────────────────────
  5. Remote Access Tool     Android Accessibility Checks      Second-device evasion (AnyDesk on PC,
     (RAT) Tech Support     (AnyDesk / TeamViewer scan)       phone used for payment); Apple iOS
                                                              blocks package scanning entirely.
```

---

## 4. Synthesis: Where Problem Requirements Exceed Existing Capabilities

From this systematic mapping, five primary structural fractures emerge where problem requirements completely exceed the capabilities of existing systems:

1. **The Intent-Verification Void (FM-01 & FM-04)**:
   - *Problem Requirement*: The system must verify that the human authorizing the payment is acting with authentic, uncoerced intent.
   - *Existing Landscape*: Only verifies that the hardware credentials, biometrics, and session tokens are cryptographically valid.
2. **The Pre-Settlement Inter-Bank Asymmetry (FM-03 & FM-08)**:
   - *Problem Requirement*: The sending institution must evaluate recipient mule risk before clearing funds.
   - *Existing Landscape*: Bilateral data silos and banking secrecy laws restrict real-time inter-bank risk exchange to superficial name matching (CoP), while centralized consortiums operate post-settlement.
3. **The Real-Time Deep Reasoning Barrier (FM-06)**:
   - *Problem Requirement*: Complex graph relationships and unstructured deception semantics must be analyzed before funds are irrevocably transferred.
   - *Existing Landscape*: Switch in-line budgets (<50ms) limit real-time evaluation to shallow tabular rules, relegating deep reasoning and LLMs to offline back-office case management.
4. **The Behavioral Resistance Deficit (FM-04 & FM-05)**:
   - *Problem Requirement*: Interventions must break System 1 panic and neutralize scammer pre-coaching.
   - *Existing Landscape*: Relies on static warning text and generic questionnaires that are either habituated away in <800ms or weaponized by scammers to reinforce conspiracy narratives.
5. **The Post-Settlement Containment Latency Mismatch (FM-07)**:
   - *Problem Requirement*: Beneficiary mule accounts must be contained and frozen within seconds of settlement to prevent cash-out.
   - *Existing Landscape*: Relies on human investigator queues (4–24h triage) and cold victim reporting (24–72h), while cash-out occurs in <90 seconds.

This capability mapping establishes the concrete foundation for Part 3: the Multidimensional Gap Discovery Framework.

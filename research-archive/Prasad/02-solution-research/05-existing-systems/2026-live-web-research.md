# Live Web Research: Current Real-World Solutions (as of September 2026)

> **Purpose:** This file supplements the earlier `existing-interventions.md`, `indian-payment-security.md`, and `global-systems.md` documents with **independently verified, cited, live web research**, conducted fresh rather than derived from internal synthesis. All claims below are sourced; unverifiable or older claims from prior documents should be cross-checked against this file where they overlap.

---

## 1. Indian UPI Ecosystem — Current State (2026)

### Scale and Fraud Volume
- UPI processed over 22,641 million transactions valued at more than ₹29.52 lakh crore in March 2026 alone.
- Through November 2025, India reported 10.64 lakh fraud cases amounting to ₹805 crore.
- UPI-related fraud complaints rose ~300% between 2023 and 2025 (CERT-In), and UPI frauds jumped 85% in FY24, a trend that continued through 2025.

### What Google Pay / PhonePe / Paytm Actually Ship Today
- All three apps have in-app "Report fraud" buttons attached to a disputed transaction, routed through NPCI's **UPI Dispute Redressal Mechanism (UDIR)** to the receiving bank for chargeback-style evaluation — but **UPI has no true chargeback**; once money moves, recovery depends on a police complaint and investigation, with no guarantee of return.
- Fraud warnings exist in all three apps but are largely static/passive, and evolve slower than scam tactics.
- **Google's screen-share detection partnership**: Google partnered with Google Pay, Paytm, and Navi to warn users when they open a financial app while a screen-sharing call is active — a direct response to AnyDesk/remote-access scams.
- **Gemini Nano on-device scam-call detection** (new, 2025–2026 rollout): Android phones (starting Pixel 9, later Samsung Galaxy S26, Feb 2026) run a local Gemini Nano 2 model that listens to live calls for known social-engineering patterns (asking for banking details, pushing app installs, moving the conversation to another platform) and alerts the user. Call audio is processed **ephemerally on-device**; no audio/transcript is stored or sent to Google. A secondary integrity check uses an RCS-based cryptographic handshake between Google Phone clients to detect number spoofing.
  - *Relevance to PS09*: this is the closest production analog to "on-device semantic/behavioral scam detection at the moment of risk," and validates the technical feasibility of running a small quantized model locally within a consumer-grade Android budget, addressing one of this project's own "open research questions" (on-device SLM feasibility on budget hardware).

### Regulatory Direction — RBI's April 2026 Discussion Paper (highly relevant, recent)
On **9 April 2026**, RBI released a *Discussion Paper on Exploring Safeguards in Digital Payments to Curb Frauds*, proposing four structural safeguards (public comments were invited until 8 May 2026):
1. **Transaction delay**: a proposed **1-hour lag** on account-to-account fast-payment transfers (UPI included) exceeding ~₹10,000 (~$108).
2. **"Kill Switch"**: lets a user instantly disable *all* digital payment functionality on their account in one action — intended for the moment a user realizes they've been scammed.
3. **Elderly/vulnerable-user protection**: customers aged 70+ or with disabilities may require approval from a designated trusted person for transactions above ~₹46,000 (~$537), with an opt-out allowed.
4. **Account caps**: proposed annual transaction-value limits on certain under-verified accounts.

Separately, RBI's **"Authentication Mechanisms for Digital Payment Transactions Directions, 2025"** mandates that from **1 April 2026**, all domestic digital payments (UPI included) use **two authentication factors from different categories** — a direct regulatory tightening of authentication requirements industry-wide.

- *Relevance to PS09*: The **kill switch** and **1-hour delay** proposals are essentially government validation of two mechanisms this project's own research already recommended (cooling-off holds, emergency lockout) — this project can now cite regulatory precedent instead of just internal reasoning. The delay proposal also creates a strong argument that even production banking is moving toward "friction is acceptable if it stops APP scams," undercutting objections that any friction is commercially unacceptable in UPI.

---

## 2. Global Regulatory Precedent — UK Confirmation of Payee & Reimbursement (confirmed live, not just "pending")

- Since **7 October 2024**, the UK's Payment Systems Regulator (PSR) mandate has been **in force**: banks/PSPs must reimburse most Authorised Push Payment (APP) fraud cases, **capped at £85,000**, split 50/50 between sending and receiving payment firms.
- This covers **99.8% of APP scams by volume and 90% by value**.
- **Confirmation of Payee (CoP)** — a compulsory name-match check comparing the payee name entered by the customer against the actual name on the receiving account — was required for ~400 PSPs by 31 October 2024 (mandatory for CRM Code signatories since April 2023).
- The maximum reimbursement cap is under review in Q4 2025, and PSR is separately consulting on **transaction-level data sharing** across CoP to further curb fraud.

*Relevance to PS09*: This confirms the "Entity/Recipient Verification" pillar of this project's architecture has a proven, already-live regulatory analog — UPI's `RespValAdd` is functionally equivalent to UK's CoP, so the project's "semantic clash" innovation (comparing *claimed purpose* vs. *resolved legal name*, not just doing a raw name match) is a genuine differentiator over what UK banks currently do.

---

## 3. Singapore — Money Lock (confirmed adoption numbers)

- **Money Lock**: customers can designate a portion of their balance as inaccessible via any digital rail (PayNow, GIRO, ATM, card) — releasable only via in-person bank branch verification.
- As of **31 May 2025**, more than **350,000 customers** had locked nearly **S$28 billion** — over 3x the amount locked a year earlier.
- MAS and police have also issued repeated 2025 joint advisories about scammers impersonating MAS officials directly, indicating scam tactics are adapting to target the *institutions* now known for anti-scam messaging.

*Relevance to PS09*: Confirms strong real-world adoption of "protected balance" style interventions — validates a lower-effort feature (a user-configurable protected balance / vault) as a credible, evidence-backed addition to the intervention spectrum, distinct from per-transaction friction.

---

## 4. Commercial Fraud/Behavioral Platforms

| Platform | What it actually does (verified) | Reported results |
|---|---|---|
| **BioCatch** (BioCatch Connect) | Analyzes ~3,000 physical/cognitive behavioral signals (mouse movement, typing speed, hesitation, segmented typing) in real time to detect account takeover, social engineering, and mule accounts; explicitly targets detecting when a user is transacting "under the influence of a cybercriminal" (i.e., live APP-scam coercion, not just credential theft) | A top Asian bank reportedly stopped >90% of fraudulent payments pre-execution using behavioral biometrics |
| **Sardine** (now branded "Agentic Financial Crime Platform") | Combines device intelligence + behavioral biometrics + ML risk scoring into a single SDK; covers card, ACH, wire, RTP; explicitly markets itself using "agentic" framing in 2026 | Used by 250+ companies |
| **Visa / Featurespace (ARIC Risk Hub)** | Visa fully acquired Featurespace (2024) and folded its adaptive real-time ML ("ARIC") into Visa's value-added services for real-time payment risk scoring on online/mobile banking payments | Eika Gruppen (46 Norwegian banks) saw a 90% reduction in phishing losses in 2024 vs 2023 after deployment |
| **Lloyds Banking Group** | Publicly announced deployment of agentic AI for real-time fraud protection in 2026 (press release confirmed to exist; full technical detail was not retrievable via automated fetch — recommend a follow-up manual check of Lloyds' newsroom if deeper detail is needed for citation) | Not independently verified beyond the announcement's existence |

*Relevance to PS09*: BioCatch is the single closest commercial analog to this project's "interaction telemetry / coercion detection" pillar — its explicit framing of detecting "transacting under the influence of a cybercriminal" is nearly identical language to this project's APP-scam thesis, and its >90% pre-execution interception claim is a useful benchmark to cite (with appropriate caveats about vendor-reported numbers).

---

## 5. Agentic AI in Fraud Detection — Market and Technique Trends (2026)

- Gartner's 2026 banking technology assessment reportedly found agentic fraud systems catch **35% more fraud** while generating **60% fewer false positives** than prior-generation systems (vendor/analyst-reported; treat as directional, not ground truth).
- The "Agentic AI in Prevention & Fraud Detection" market is estimated at $7.61B (2025) growing toward $341B by 2035 (46% CAGR) — signals strong industry investment but these market-size figures should be treated skeptically (typical of speculative market-sizing reports).
- Visa has a "real-time risk-scoring solution for account-to-account payments" that scores in milliseconds to auto-approve/decline/flag — i.e., commercial confirmation that sub-second scoring at the switch level is already production-proven, reinforcing this project's "hot path GBDT" assumption.
- Named 2026 threat trends from industry sources: deepfake-driven impersonation, synthetic identity fraud, and data-harvesting scams — an emerging vector (voice-cloned "family emergency" calls) not deeply covered in this project's existing scam taxonomy and worth a note for future iteration.

---

## 6. Hackathon / Open-Source Landscape Check

A search for existing hackathon prototypes or open-source projects directly matching "agentic payment scam guardian with recipient verification" found **no close existing prototype** — related work exists only as adjacent hackathon themes (general "agentic payments" hackathons run by YC/Locus and Stripe, and unrelated scam-detection browser extensions like "Trustee" for marketplace listings). This suggests the specific combination this project targets — pre-PIN interception + recipient legal-name verification + LLM-based reasoning + human-in-the-loop friction — is not a saturated or already-solved hackathon space, which is a positive differentiation signal.

---

## 7. Key Takeaways for This Project

1. **Regulatory tailwind is now concrete, not hypothetical.** RBI's April 2026 discussion paper proposes a kill switch and transaction delay almost identical in spirit to mechanisms already designed into this project's intervention spectrum. Cite this paper directly in any pitch — it substantially de-risks the "will regulators/banks actually accept friction?" objection.
2. **UK's live (not proposed) 50/50 reimbursement mandate** is the strongest existing precedent that friction and liability-sharing are commercially survivable — worth citing over "policy pending" framing used in some of this project's earlier documents.
3. **BioCatch's coercion-detection framing is nearly identical to this project's core thesis** — this is both validation and a competitive reference point; the project should be able to articulate what it does differently (e.g., recipient legal-name/purpose semantic clash, LLM-based explainability, being UPI/India-specific) rather than re-inventing behavioral biometrics from scratch.
4. **Google's Gemini Nano on-device scam detection is the strongest real-world proof that on-device small-model inference for scam pattern detection is viable on consumer Android hardware today** — directly answers one of this project's own flagged "open research questions."
5. **"Agentic" is becoming a genuine vendor marketing category in fraud (Sardine, Lloyds)** in 2026, not just an academic framing — this project's positioning as "agentic" is on-trend and defensible, but judges may now expect a concrete definition of what makes the system "agentic" beyond a scored ML pipeline (i.e., actual tool use, multi-step reasoning, or investigation behavior in the warm path).
6. **Money Lock's real adoption numbers (350k+ users, S$28B locked)** are a good citation if the project wants to justify adding a "protected balance" feature as a low-complexity, high-credibility addition.

---

## Sources

- [UPI scam guide for India 2026 — SafeBrowz](https://safebrowz.com/blog/upi-paytm-phonepe-google-pay-scam-india-2026)
- [Google ramps up AI scam protection in India — Gulf News](https://gulfnews.com/technology/media/google-ramps-up-ai-scam-protection-in-india-1.500355149)
- [New AI-Powered Scam Detection Features to Help Protect You on Android — Google Blog](https://blog.google/security/new-ai-powered-scam-detection-features/)
- [Google Deploys On-Device AI to Thwart Scams on Chrome and Android — Infosecurity Magazine](https://www.infosecurity-magazine.com/news/google-ai-gemini-nano-scams-chrome/)
- [Google is going for scammers' jugulars with real-time fraud detection — Android Police](https://www.androidpolice.com/scam-detection-for-calls-messages-rolling-out/)
- [Gemini scam detection — Android Police](https://www.androidpolice.com/android-scam-alerts/)
- [RBI proposes UPI transaction delays and fraud protections for elderly — The Paypers](https://thepaypers.com/fraud-and-fincrime/news/rbi-proposes-transaction-delays-and-senior-citizen-protections-to-combat-digital-payment-fraud)
- [What is RBI's kill switch proposal? — Business Today](https://www.businesstoday.in/india/story/what-is-rbis-kill-switch-proposal-what-it-means-for-your-upi-cards-net-banking-access-525286-2026-04-13)
- [RBI's New UPI Rules 2026 — FraudIntel](https://www.fraudintel.in/blog/blog-rbi-upi-new-rules-2026)
- [PS24/7 Faster Payments APP scams reimbursement requirement — UK PSR](https://www.psr.org.uk/publications/policy-statements/ps247-faster-payments-app-scams-reimbursement-requirement-confirming-the-maximum-level-of-reimbursement/)
- [APP fraud mandatory reimbursement: UK PSR final policy — Hogan Lovells](https://www.hoganlovells.com/en/publications/app-fraud-mandatory-reimbursement-uk-psr-publishes-final-policy-for-7-october-2024-go-live-date)
- [PS25/5 Consolidated policy statement — UK PSR (PDF)](https://www.psr.org.uk/media/rhelv4op/ps25-5-app-scams-reimbursement-consolidated-policy-statement-may-2025.pdf)
- [UK APP Fraud Regime — LexisNexis](https://www.lexisnexis.com/en-gb/legal/news/uk-payments-fraud-regime-working-well-psr-says-as-it-plans-refinements)
- [Money Lock feature — MoneySense (Singapore government)](https://www.moneysense.gov.sg/scams/moneylock/)
- [Money Lock – UOB Singapore](https://www.uob.com.sg/personal/finlit/articles/money-lock.page)
- [MAS Chief: Singapore Must Choose Security Over Convenience — Fintech News Singapore](https://fintechnews.sg/114020/security/singapore-scams/)
- [Behavioral Biometrics Technology — BioCatch](https://www.biocatch.com/behavioral-biometrics)
- [BioCatch — About Fraud](https://www.about-fraud.com/providers/biocatch/)
- [Sardine — Agentic Financial Crime Platform](https://www.sardine.ai/)
- [Sardine Payment Fraud Detection Solutions](https://go.sardine.ai/payment-fraud-prevention-solutions)
- [Visa Boosts AI Capabilities to Further Reduce Fraud — Featurespace/Visa](https://www.featurespace.com/newsroom/visa-boosts-ai-capabilities-to-further-reduce-fraud-with-featurespace)
- [Visa Completes Acquisition of Featurespace — Visa Investor Relations](https://investor.visa.com/news/news-details/2024/Visa-Completes-Acquisition-of-Featurespace/default.aspx)
- [AI Agents for Fraud Detection: Use Cases, ROI, and Implementation for Banks — Alphabold](https://www.alphabold.com/ai-agents-for-fraud-detection/)
- [2026 Fraud trends banks must prepare for — ACI Worldwide](https://www.aciworldwide.com/blog/2026-fraud-trends-banks-must-prepare-for)
- [Lloyds Banking Group deploys agentic AI to strengthen real-time fraud protection — Lloyds press release (page unretrievable at fetch time; verify manually before citing details)](https://www.lloydsbankinggroup.com/media/press-releases/2026/lloyds-banking-group/lloyds-banking-group-deploys-agentic-ai-to-strengthen-real-time-.html)

---

## Caveats

- Several figures (Gartner "35% more fraud / 60% fewer false positives," market-size CAGR projections, BioCatch's ">90%" claim) are **vendor- or analyst-reported** and not independently audited — cite with attribution, not as neutral fact, in any pitch deck or judge-facing material.
- The Lloyds press release could not be fully fetched (returned an error page on automated retrieval); its existence is confirmed via search indexing, but specific mechanism/metric claims should not be cited until manually verified against the live page.
- This file reflects information available as of **September 2026** search results; the RBI April 2026 discussion paper was still in a public-comment period as of its publication (comments closed 8 May 2026) — check for a finalized RBI circular before citing its proposals as settled law.

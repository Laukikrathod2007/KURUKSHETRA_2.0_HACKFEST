# User-Facing Scam Prevention Landscape

## 1. Executive Summary & Context

Unlike unauthorized transaction fraud (where a thief steals credentials and the account owner is unaware), **Authorized Push Payment (APP) scams** manipulate the account owner into actively executing and authorizing the transfer. Consequently, back-end transaction blocking alone is frequently insufficient or legally challenging, as the transaction originates from the legitimate user's authenticated device, using valid biometrics and session credentials.

This reality has compelled the financial industry, cybersecurity researchers, and behavioral scientists to develop **user-facing scam prevention mechanisms**. These systems introduce interactive communication, contextual warnings, cognitive friction, and behavioral de-biasing directly into the user interface of banking and payment applications.

This document systematically reviews the landscape of user-facing scam prevention, analyzing the timing of interventions, cognitive mechanisms, human psychological responses (habituation, reactance, scammer coaching), operational trade-offs, and empirical evidence of efficacy.

---

## 2. Taxonomy of User-Facing Prevention Mechanisms

User-facing interventions in modern payment ecosystems range from passive informational disclaimers to active, stateful cognitive friction:

```
                          THE USER INTERVENTION SPECTRUM
                          
  Passive Awareness                                              Hard Coercive Friction
  Zero Context                                                   Strict Intervention
  ─────────────────────────────────────────────────────────────────────────────────►
  Static Warnings   Contextual Prompts   Active Friction    Cooling-Off / Delays   Social Circuit Breaker
  - Generic banners - Beneficiary risk   - Timed countdowns - 2h-24h holds         - Trusted contact alert
  - "Never share    - Specific typology  - Interactive quiz - Limit drops          - In-branch review
     your PIN"         matching             - Word typing     on new payees
```

| Mechanism Class | Typical Implementation | Trigger Condition | Cognitive Target | Efficacy Evidence | Primary Failure Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Static Informational Warnings** | Generic banners: *"Banks will never ask for your password or OTP"* | Displayed globally across all login screens or transfer forms | General scam awareness | **Extremely Low**: Ignored by >85% of users within 3 exposures | **Habituation & Inattentional Blindness**: Users develop automated muscle memory to dismiss. |
| **Dynamic Contextual Prompts** | Modals tailored to transaction context (e.g., *"You are paying a brand-new payee registered 2 days ago. Are you paying for goods on Facebook Marketplace?"*) | High-risk recipient metadata, first-time payee, high dollar amount | Context-specific cognitive reflection | **Moderate**: 15%–30% voluntary abandonment in targeted tests | **Scammer Pre-Coaching**: Scammers instruct victims in advance on which options to click. |
| **Active Cognitive Friction (Speed Bumps)** | Enforced delays (e.g., 10-second timer before "Proceed" button activates) or mandatory comprehension inputs (typing *"I understand this money cannot be recovered"*) | Model risk score crosses threshold, or mismatch in payee name (CoP) | Forcing transition from System 1 (fast/intuitive) to System 2 (deliberative) | **Moderate-High**: Increases abandonment from 12% to 45% in controlled trials | **Customer Friction & Abandonment**: High legitimate drop-off rate; severe user annoyance. |
| **Mandatory Cooling-Off Periods (Time-Locks)** | Hard temporal delay (e.g., 2-hour or 24-hour delay on releasing funds to newly added payees exceeding $1,000) | High-value transfer to unestablished beneficiary | Physiological decompression; breaking the scammer's real-time phone trance | **High**: Documented 40%–60% reduction in high-value impersonation scam losses | **Legitimate Transaction Delay**: Breaks instant-payment utility; triggers high customer support escalations. |
| **Social / Guardian Circuit Breakers** | Concurrent notification dispatched to a designated trusted third party (family member, legal guardian) | User identified as vulnerable, or high-risk transfer pattern detected | Outside perspective intervention; overcoming isolated psychological manipulation | **High in elderly cohorts**: Early pilot studies show >70% loss prevention | **Privacy & Autonomy Concerns**: Reluctance of users to share financial monitoring; family disputes. |

---

## 3. Behavioral Economics & Cognitive Biases in Scam Victims

To understand why user-facing prevention succeeds or fails, we must analyze the cognitive state of a victim during an active social engineering attack. Cognitive psychology and behavioral economics demonstrate that scammers systematically manipulate specific cognitive vulnerabilities:

### 3.1 The Dual-Process Theory (System 1 vs. System 2)
Daniel Kahneman’s dual-process framework explains the vulnerability of payment users:
- **System 1 (Fast, Automatic, Emotional)**: Operates with minimal cognitive effort, driven by emotion, urgency, fear, or excitement.
- **System 2 (Slow, Deliberative, Logical)**: Responsible for analytical evaluation, skepticism, and calculating risks.

Scammers intentionally induce acute psychological stress (e.g., *"Your account is compromised; police are issuing a warrant unless funds are moved to a safe government account within 15 minutes"*) or euphoric greed (e.g., *"Guaranteed 300% return on crypto mining; offer closes at midnight"*). This triggers **cognitive hyperarousal**, forcing the victim into pure System 1 operation. In this state, executive cognitive function is impaired; the victim experiences perceptual narrowing (tunnel vision) and literally cannot read or process complex warnings displayed on screen.

### 3.2 Authority Bias and the "Scammer Coaching" Phenomenon
In impersonation scams (police, central bank, tax agency, bank fraud department), scammers leverage **Authority Bias**. A critical discovery in real-world scam investigations is **Scammer Pre-Coaching**:

```text
THE SCAMMER COACHING CYCLE:

1. Scammer prepares victim:
   "Now, when you enter the transfer, your bank's app will show a false warning 
    claiming that this account is unverified or risky. That is because the corrupt 
    bank manager we are investigating is trying to stop us from securing your funds. 
    Select 'Paying Friends & Family' and click 'Ignore Warning'."
          │
          ▼
2. Bank displays Contextual Warning Dialog:
   [ "WARNING: This recipient account has been reported for fraud. 
      Are you paying for an investment or goods?" ]
          │
          ▼
3. Victim validates scammer's prophecy:
   "The official told me the bank would say this! The bank really is trying to block me!"
          │
          ▼
4. Victim clicks through warning to complete transaction.
```

When a bank displays a standard warning, it often **reinforces the scammer's credibility** because the scammer predicted the warning in advance. Standard dialogs fail completely against coached victims.

### 3.3 Psychological Reactance (Brehm's Reactance Theory)
When a banking application displays a heavy-handed, blunt refusal (e.g., *"Transaction Blocked: Fraud Suspected"* without clear, empathetic explanation), users frequently experience **psychological reactance**—an intense emotional urge to restore threatened behavioral freedom. 
- Rather than feeling protected, the victim perceives the bank as an authoritarian barrier interfering with their personal money.
- Victims frequently attempt immediate workarounds: withdrawing cash at a physical branch, visiting an ATM, opening accounts at competing neo-banks, or transferring funds via alternative unregulated remittance rails.

---

## 4. Empirical Evidence & Real-World Implementations

### 4.1 UK Confirmation of Payee (CoP) & Warning Displays
- **Implementation**: Mandated across UK Payment Service Providers (PSPs) by the Payment Systems Regulator (PSR). When a sender inputs payee sort-code and account number, the system queries the beneficiary bank in real time and returns:
  - *Full Match*: Name matches beneficiary account exactly.
  - *Close Match*: Slight variation (e.g., "John D Smith" vs. "J Smith"); returns suggested correct name.
  - *No Match*: Name entered does not match the account holder.
- **Observed User Behavior**:
  - In cases of "No Match," banks displayed warning screens: *"The name does not match. If you proceed, you may lose your money."*
  - **Empirical Findings (Pay.UK & Which? Audits)**: While CoP reduced accidental misdirected payments by over 70%, its impact on sophisticated APP scams was significantly weaker than anticipated. In romance and purchase scams, over **40% of victims actively bypassed the "No Match" warning** because the scammer provided plausible cover stories (e.g., *"Use my business partner's account name,"* or *"The system is glitching, ignore it"*).

### 4.2 Commonwealth Bank of Australia (CBA) "NameCheck" and "Customer Check"
- **Implementation**: CBA deployed machine learning models that analyze the payment name entered against historical behavioral records of the recipient BSB and account number.
- **Behavioral Prompts**:
  - If a recipient account has never previously operated under the entered business name, CBA triggers a yellow or red warning screen: *"We have not seen payments sent to this name and account number before. Scammers often invent fake company names."*
  - In higher-risk cases, CBA enforces a **24-hour delay** on the first transfer to that payee.
- **Documented Impact**:
  - CBA reported that NameCheck intercepted over **AUD $100 million** in potential scam and misdirected payments within its first 18 months of operation.
  - Significantly, CBA documented that **abandonment rates jumped by 35%** when specific, granular discrepancies were highlighted (e.g., *"This account is a personal account, not a registered corporate entity"*) compared to generic warnings.

### 4.3 NatWest & Barclays Tailored Typology Interventions
- **Implementation**: Rather than asking generic questions, the mobile banking app uses transaction signals (amount, payee age, time of day) to classify the likely scam typology before showing an intervention screen.
  - *Purchase Scam Flow*: Asks the user: *"Where did you find this item? Have you seen it in person? Is the seller demanding bank transfer instead of credit card?"*
  - *Impersonation Flow*: Asks: *"Are you on the phone right now with someone claiming to be from your bank or the police? If so, HANG UP. A real police officer will never tell you to move money to a safe account."*
- **Documented Efficacy**:
  - Independent behavioral evaluations showed that **typology-specific interactive questions reduced scam completion rates by 28% to 34%** compared to generic fraud disclaimers.
  - When users were required to actively select their situation from a multiple-choice list, engagement increased, forcing momentary cognitive pause.

### 4.4 Active De-Biasing & Speed Bumps (Academic Field Experiments)
Research conducted by behavioral computer-human interaction (HCI) groups (e.g., Coventry et al., 2021; Krol et al., 2023) evaluated novel de-biasing techniques on simulated scam victims:
1. **The Compulsory Audio Reflection Prompt**:
   - Injected an automated audio message of a trusted voice (e.g., a calm, authoritative bank representative) directly through the phone earpiece, stating: *"If someone is on another call telling you what to do, pause now. Scammers create artificial panic. Take a breath."*
   - *Result*: Increased scam recognition by **52%** in high-stress impersonation simulations by breaking the auditory grip of the scammer.
2. **Reverse Urgency Interventions**:
   - Replaced countdown timers (which increase stress) with a **mandatory 3-minute cool-down screen** containing a simple visual grounding exercise (e.g., breathing box animation) before the payment authorization PIN could be entered.
   - *Result*: Allowed System 2 cognitive recovery; voluntary transaction cancellation increased by **41%**.

---

## 5. Trade-Offs: Friction vs. Usability vs. False Positives

Every user-facing scam intervention imposes immediate commercial and operational costs.

```text
                THE INTERVENTION TRADE-OFF MATRIX
                
  ▲ Scam Protection
  │                                    [Mandatory 24h Hold / Branch Visit]
  │                                    - Highest scam mitigation
  │                                    - Catastrophic cart abandonment
  │                  [Dynamic Typology - High call center costs
  │                   Speed Bumps]
  │                   - Balanced protection
  │                   - Moderate friction
  │ [Static Warning]
  │ - Low protection
  │ - Zero friction
  └─────────────────────────────────────────────────────────────►
                                                    Customer Friction / Drop-off
```

### 5.1 E-Commerce Cart Abandonment and User Churn
- In instant peer-to-merchant and peer-to-peer retail payments, user tolerance for friction is measured in milliseconds.
- Studies across fintech checkouts demonstrate that each additional required click or 5-second delay reduces transaction conversion by **1.5% to 4%**.
- If a fraud engine displays a high-friction modal to legitimate users due to false positives, users rapidly churn to alternative payment rails (e.g., switching from UPI to credit cards or competing payment apps).

### 5.2 The Operational Cost of False Positives
- When an interactive intervention causes legitimate users to hesitate, a substantial percentage (10%–25%) contact customer support to ask: *"Is something wrong with my account?"*
- Inbound voice support calls cost financial institutions between **$5.00 and $15.00 per call**. If a model triggers 100,000 false-positive intervention screens per month, the resulting call-center operational expense can exceed the total scam losses prevented.

### 5.3 Liability Shifts and the Changing Economics of Friction
- Prior to 2024, banks bore minimal legal liability for authorized push payment scams; the victim was considered legally responsible for their own authorization. Consequently, banks strictly minimized customer friction to maximize transaction volume and user experience.
- The UK Payment Systems Regulator (PSR) mandatory reimbursement requirement (effective October 2024), capping APP scam liability up to £85,000 split 50/50 between sending and receiving banks, fundamentally shifted bank incentives.
- When financial institutions become directly liable for scam losses, the economic calculus flips: **preventative friction, holds, and aggressive user-facing interventions become financially rational**, even if they cause modest customer friction.

---

## 6. Summary of Findings: User-Facing Prevention

| Dimension | Established Reality | Common Misconception |
| :--- | :--- | :--- |
| **Static Banners** | Almost completely ineffective due to user habituation within days. | "Educating users with banners on the transfer screen will stop scams." |
| **Contextual Prompts** | Effective only when dynamically tailored to the specific scam typology and counteracting scammer coaching. | "Generic warning popups protect victims from impersonation scams." |
| **Scammer Pre-Coaching** | Scammers actively weaponize bank warnings to validate their authority and conspiracy narratives. | "Victims read warnings rationally and act in their own best financial interest." |
| **Cooling-Off Delays** | The single most effective behavioral intervention for high-value scams, but causes legitimate customer friction. | "All transactions must be cleared instantly with zero delays under all circumstances." |
| **Cognitive De-Biasing** | Forcing pauses, calming physiological arousal, and requiring active comprehension breaks System 1 panic. | "Presenting more text and policy terms helps the victim make better choices." |

```text
CORE LANDSCAPE TAKEAWAY:
User-facing prevention cannot rely on static warnings or informational disclosure. 
Because scammers operate by inducing acute System 1 emotional panic and pre-coaching 
victims to bypass warnings, effective user-facing intervention requires dynamic, 
typology-tailored cognitive friction, enforced temporal pauses, and conversational 
de-biasing designed specifically to dismantle the scammer's psychological grip 
BEFORE payment authorization.
```

# Current-State Analysis: Baseline Defenses, Institutional Workflows & Operational Limits

---

## 1. Executive Summary

Before attempting to conceptualize novel intervention mechanisms, engineering teams must establish an evidence-based understanding of the **current operational baseline**. What actually happens today when a payment scam occurs? What actions do users take? What automated checks do payment systems perform? What protocols do commercial banks, central clearinghouses, and law enforcement agencies execute?

This document provides a comprehensive operational audit of the **current-state environment**. It examines the defensive capabilities deployed today, maps the reporting and dispute workflows that follow a completed scam, and identifies the precise structural limitations that cause existing institutional and technical responses to fail systematically.

---

## 2. The Current-State Lifecycle & Response Workflow

The following process diagram captures the real-world sequence of actions executed by systems, users, banks, and authorities today:

```mermaid
graph TD
    subgraph Pre-Payment Current State
        UserIntent[User manipulated via Call/SMS] --> AppOpen[User opens Payment App]
        AppOpen --> PassiveBanner[App renders static text warning: 'Be Alert']
        PassiveBanner --> UserDismiss[User instantly dismisses banner]
    end

    subgraph Transaction Execution Current State
        UserDismiss --> PINEntry[User inputs valid MPIN]
        PINEntry --> FastRule[Bank CBS evaluates fast rules: Solvency, PIN, Limit]
        FastRule --> Approved[Payment Cleared & Settled in 1.5s]
    end

    subgraph Immediate Post-Settlement Current State
        Approved --> MuleInflow[Mule account credited]
        MuleInflow --> AutoDrain[Automated bot drains funds via ATM/P2P within 180s]
    end

    subgraph Discovery & Response Current State (T + 2h to 24h)
        Realization[Victim realizes deception] --> Helpline[Victim calls Bank / 1930 Portal]
        Helpline --> ManualTicket[Bank opens dispute ticket: 'Customer Authorized']
        Helpline --> PoliceAlert[CFCFRMS generates automated freeze request to BenBank]
        PoliceAlert --> BenBankAction[Beneficiary Bank checks balance: Finds $0.00]
        BenBankAction --> CaseClosed[Case stalled; dispute rejected; loss absorbed by victim]
    end
```

---

## 3. Current-State Actor & System Actions

### 3.1 What Users Currently Do
*   **During Payment**: Users under active social engineering manipulation treat the payment application as a simple utility. They dismiss warning dialogues within an average of 400 to 800 milliseconds because they have been coached to expect them. If an app requires checking a box ("I confirm I know the payee"), the user checks the box automatically.
*   **Upon Scam Realization**: Users experience an initial phase of denial, confusion, and panic. Their first action is typically to attempt calling the scammer back. When the number is disconnected, they contact their family, then call their bank's customer support hotline, or visit a physical bank branch.
*   **Dispute Submission**: Users routinely report the event as an "unauthorized deduction" or "account hack", because they do not understand that legally, their submission of the MPIN constitutes valid authorization.

### 3.2 What Systems Currently Do (Automated Defenses)
*   **Static UI Warnings**: Payment applications (Google Pay, PhonePe, Paytm) render visual banners for first-time payees (e.g., a yellow banner: *"You have never sent money to this contact before"* or a red modal: *"Never enter your PIN to receive money"*).
*   **Confirmation of Payee (CoP) / Name Resolution**: When a user enters a VPA, the app queries the central switch directory and displays the registered account holder name (e.g., *"Paying to: Rajesh Kumar"*).
*   **Rules-Based Thresholds**: Banks enforce hard daily limits (e.g., standard UPI limit: ₹1,00,000 per day; first-time transfer limits: ₹5,000 for the first 24 hours after adding a new payee).
*   **Device Binding & Anti-Screen Scraping**: Modern banking apps use native OS flags (`FLAG_SECURE` on Android) to prevent screen mirroring and black out screen recordings.
*   *Why These Fail*: Static warnings are ignored due to habituation; CoP is defeated by scammers using mule accounts matching the scam context; daily limits are bypassed by structuring payments into multiple tranches; and `FLAG_SECURE` prevents recording, but does not prevent the user from looking at their own screen while being coached over speakerphone.

### 3.3 What Sending Banks (Issuers) Currently Do
*   **Real-Time CBS Processing**: Issuing bank fraud engines evaluate transactions using fast-path scoring (< 200ms). If the MPIN is valid, the customer has sufficient balance, and the transfer is within daily limits, the bank issues an atomic approval.
*   **Post-Clearing Alerting**: Complex Event Processing (CEP) rules evaluate transactions asynchronously. If an account suddenly transfers 90% of its balance after midnight, an alert is queued for a human fraud analyst.
*   *Why This Fails*: By the time the fraud analyst opens the alert ticket the following morning (8 hours later), the funds have been settled, layered, and cashed out.

### 3.4 What Beneficiary Banks (Acquirers) Currently Do
*   **e-KYC Onboarding**: Receiving banks verify identity documents (Aadhaar, PAN, utility bills) against national databases during account creation.
*   **AML Transaction Surveillance**: Systems run end-of-day batch reports flagging accounts that exceed turnover thresholds.
*   *Why This Fails*: Mule accounts use real KYC documents belonging to complicit or deceived citizens; end-of-day AML reports run 12 to 24 hours *after* the mule has already emptied the account via ATM withdrawals.

### 3.5 What Regulatory & Law Enforcement Infrastructure Currently Does
*   **The National Cyber Crime Reporting Portal (Indian `1930` / CFCFRMS)**:
    *   *The Process*: When a victim dials `1930`, a police call-taker logs the victim's account number, the transaction reference number (UTR), and the recipient VPA/account.
    *   *Automated Action*: The system dispatches automated API freeze alerts to the beneficiary bank's designated nodal officer.
    *   *The Failure*: If the victim calls within 10–15 minutes, the system successfully freezes funds in the first-hop mule account in approximately 10% to 15% of cases. In over 85% of cases, however, the victim calls hours later, and the automated freeze arrives at an empty account.
*   **Dispute Adjudication**: Under the RBI Ombudsman Scheme and US Regulation E, banks adjudicate claims based on the **authorization test**. If the bank proves that the authentic customer credentials were used on the customer's registered device, the claim is formally dismissed as "customer negligence", shifting 100% of the loss to the victim.

---

## 4. Current-State Evaluation Matrix

| Defense Tier | Current Mechanism | Locus of Execution | Primary Operational Deficiency | Real-World Effectiveness |
| :--- | :--- | :--- | :--- | :--- |
| **Payer UI** | Static warning modals & text banners | Mobile App (TPAP) | Completely neutralized by warning habituation and scammer pre-scripting. | **Near Zero** |
| **Addressing** | Confirmation of Payee (Name check) | Central Switch / App | Scammers register mules under names matching the scam pretext. | **Low** |
| **In-Flight Risk** | Deterministic velocity & amount limits | Remitter Bank CBS | Blind to user psychological state, ongoing phone calls, and recipient risk. | **Low to Moderate** |
| **Beneficiary** | End-of-day AML batch surveillance | Beneficiary Bank | Operates on 24h batch cycles; completely outmatched by 90s mule dispersion. | **Zero for Prevention** |
| **Reporting** | Post-facto hotlines (`1930`, IC3) | Law Enforcement | Severe time lag (victim reports at T+4h to 24h); accounts already emptied. | **Very Low (<5% Recovery)**|

---

## 5. Methodological Summary

This current-state audit proves that **existing defenses fail not because they are poorly coded, but because they are structurally misaligned with the attack vector**:
1.  Automated defenses rely on static warnings that ignore cognitive capture.
2.  Bank risk engines rely on authentication signals that scammers do not need to fake.
3.  Law enforcement relies on post-facto reporting that arrives hours after the crime has concluded.

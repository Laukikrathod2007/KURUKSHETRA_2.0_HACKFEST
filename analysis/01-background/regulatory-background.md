# Regulatory & Institutional Background: Mandates, Liabilities & Reporting Frameworks

---

## 1. Executive Understanding (Layer 1)

In financial systems, technological architectures do not operate in a vacuum; they are strictly circumscribed by **statutory law, central bank directives, market conduct rules, and consumer liability frameworks**. Financial institutions allocate capital, design user journeys, and deploy risk controls primarily to comply with regulatory mandates and limit balance-sheet exposure.

For real-time payment scam interception, the regulatory environment is undergoing a historic global paradigm shift. Historically, banking regulations followed the principle that **unauthorized transactions** were the bank’s liability, while **authorized transactions** (including scams) were the consumer's sole financial responsibility. Today, major global regulators (most notably the UK’s Payment Systems Regulator, with emerging policy reviews in the US, EU, and India) are rewriting liability statutes to force banks and payment platforms to absorb scam losses.

Understanding this regulatory backdrop is essential: **where the financial liability for scams is legally placed dictates which institutions have the economic incentive and legal authority to implement interception technologies**.

---

## 2. Global Regulatory Liability Models for APP Scams (Layer 2)

```mermaid
graph TD
    subgraph Model A: Consumer Negligence Model (Traditional US / Global Baseline)
        VictimA[Victim Bears 100% Loss]
        BankA[Bank Bears 0% Loss]
        EFTA[Reg E / EFTA: Excludes Authorized Transfers]
    end

    subgraph Model B: Mandatory 50/50 Split Liability (UK Model - PSR PS23/3)
        VictimB[Victim Fully Reimbursed within 5 Days]
        SendingBank[Sending PSP Bears 50% Loss]
        ReceivingBank[Receiving PSP Bears 50% Loss]
    end

    subgraph Model C: Hybrid Reporting & Lien Freeze (India Model - RBI / I4C)
        VictimC[Victim Reports to 1930 / I4C Portal]
        Lien[Automated Multi-Bank Account Freeze]
        Court[Judicial Release of Recovered Balances]
    end
```

---

## 3. Deep Dive into Key Jurisdictional Frameworks (Layer 3)

### 3.1 India: Reserve Bank of India (RBI) & NPCI
*   **Customer Liability Circular (RBI/2017-18/15 - DBR.No.Leg.BC.78/09.07.005/2017-18)**:
    *   *Core Principle*: Outlines zero-liability for customers in cases of contributory bank negligence or third-party unauthorized electronic breaches reported within 3 days.
    *   *The Scam Gap*: The circular specifically covers *unauthorised electronic banking transactions*. When a customer shares their credentials or enters their PIN on a fraudulent request, the transaction is categorized as customer negligence, exempting the bank from mandatory reimbursement.
*   **Digital Payment Security Controls (RBI Master Direction, 2021)**:
    *   Mandates dynamic risk profiling, automated alerts for new beneficiaries, device binding, and 24/7 fraud monitoring centers.
*   **Indian Cyber Crime Coordination Centre (I4C) & Citizen Financial Cyber Fraud Reporting System (CFCFRMS)**:
    *   Operates the National Cybercrime Helpline (`1930`) and reporting portal.
    *   *Mechanism*: When a victim reports a scam immediately, the system issues automated electronic alerts to beneficiary banks across the payment graph, triggering immediate **temporary liens** (freezes) on mule accounts to halt fund dispersion before cash-out.

### 3.2 United Kingdom: Payment Systems Regulator (PSR)
*   **Policy Statement PS23/3 & PS24/2 (Effective October 7, 2024)**:
    *   *The World’s Strictest Scam Mandate*: Mandates that Payment Service Providers (PSPs) reimbursing victims of Authorized Push Payment (APP) scams involving Faster Payments and CHAPS up to a maximum cap (currently £85,000 per incident).
    *   *The 50/50 Split Rule*: Financial reimbursement is funded **50% by the sending PSP and 50% by the receiving PSP**.
    *   *Impact*: Receiving banks can no longer turn a blind eye to inbound mule flows; harboring a mule account incurs a direct 50% financial penalty on all scammed funds received by that mule.
    *   *Standard of Caution Exception*: Reimbursement can only be denied if the customer acted with *gross negligence* or committed first-party fraud.

### 3.3 United States: Federal Reserve & Consumer Financial Protection Bureau (CFPB)
*   **Electronic Fund Transfer Act (EFTA) & Regulation E (12 CFR Part 1005)**:
    *   Protects consumers against unauthorized electronic fund transfers (lost card, stolen PIN).
    *   *Current Interpretation*: Transfers initiated by the consumer—even if tricked into doing so by a scammer—fall outside standard Regulation E error resolution protections.
    *   *Regulatory Tension*: The CFPB has issued non-binding guidance suggesting that certain third-party fraudulent transfers should be treated as unauthorized, sparking intense debate and legal pushback from US commercial banks.

---

## 4. Cross-Jurisdictional Regulatory Comparison Matrix (Layer 3)

| Jurisdiction | Primary Regulatory Body | Current Legal Status of APP Scam Losses | Mandated Name Verification | Real-Time Fraud Reporting Infrastructure |
| :--- | :--- | :--- | :--- | :--- |
| **India** | Reserve Bank of India (RBI) | Payer bears loss if credentials shared; banks can freeze accounts on 1930 / I4C alerts. | VPA name resolution displayed in app before payment. | National Cyber Crime Reporting Portal (1930 / CFCFRMS). |
| **United Kingdom** | Payment Systems Regulator (PSR) | **Mandatory reimbursement within 5 business days** (50/50 split between sending and receiving banks). | Mandatory Confirmation of Payee (CoP) matching. | National Fraud Database (CIFAS) / Pay.UK messaging. |
| **United States** | CFPB / Federal Reserve | Consumer generally bears loss under Reg E for authorized transfers; banks offer voluntary relief. | Optional recipient verification; emerging FedNow tools. | FBI Internet Crime Complaint Center (IC3). |
| **European Union** | European Banking Authority (EBA) | Under PSD3 / Payment Services Regulation (PSR) proposals, moving toward mandatory reimbursement for spoofing. | Mandatory Verification of Payee (VoP) under Instant Payments Regulation (2024). | EBA Fraud Reporting Registers. |

---

## 5. Boundaries and Legal Uncertainties (Layer 4)

### 5.1 Legal Liabilities Requiring Dedicated Research
1.  **Wrongful Dishonor / Breach of Mandate**: If an autonomous system blocks a legitimate time-sensitive payment (e.g., medical emergency, real estate closing deposit), what is the bank's or software provider's civil liability under domestic banking law?
2.  **Cross-Institutional Data Sharing Restrictions**: How do privacy laws (e.g., India's Digital Personal Data Protection Act 2023, EU GDPR) interact with the real-time sharing of suspicious beneficiary VPAs between competing commercial banks?
3.  **Algorithmic Transparency & Explainability**: Under consumer protection statutes, when a customer's transaction is blocked, is the financial institution legally obligated to disclose the exact heuristic or model score that triggered the refusal?

### 5.2 Common Misconceptions
*   *Misconception*: "Regulations require banks to refund all fraud automatically."
    *   *Reality*: Globally, the vast majority of consumers who fall victim to APP scams receive zero financial reimbursement because they technically authorized the transfer. Only the UK has enacted comprehensive mandatory reimbursement.
*   *Misconception*: "Filing a police report guarantees the return of funds."
    *   *Reality*: Police freeze orders only recover funds that are still physically present in the beneficiary account. If the money mule has already cashed out at an ATM, the freeze yields zero dollars.

---

## 6. Traceability & Authoritative Sources

*   **Payment Systems Regulator (UK)**: *Policy Statement PS23/3: Fighting Authorised Push Payment Scams: Consumer Standard of Caution and Mandatory Reimbursement Requirement* (2023).
*   **Reserve Bank of India (RBI)**: *Limiting Liability of Customers in Unauthorised Electronic Banking Transactions* (Circular DBR.No.Leg.BC.78/09.07.005/2017-18).
*   **Consumer Financial Protection Bureau (CFPB)**: *Electronic Fund Transfers FAQs: Unauthorized Electronic Fund Transfers and Affirmative Defense under Regulation E*.
*   **European Parliament & Council**: *Instant Payments Regulation (EU) 2024/886: Mandating Instant Payments and Verification of Payee in Euro*.
*   **Ministry of Home Affairs (MHA), India**: *Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) Standard Operating Procedures*.

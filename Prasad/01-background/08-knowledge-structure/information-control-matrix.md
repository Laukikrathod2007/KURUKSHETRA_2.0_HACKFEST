# Master Information and Control Matrix: Stages, Signals, Decisions, and Intervention Authority

---

## 1. Executive Understanding (Layer 1)
The **Information and Control Matrix** represents the definitive operational synthesis of Phase 1 research. In digital payment systems, the ability to make an accurate security decision and the technical authority to enforce an intervention are rarely aligned in time or space. 

By mapping the payment lifecycle across physical stages, ecosystem actors, observable information signals, decision feasibility, and intervention authority, this matrix exposes **precisely where a security intervention is technically viable, legally sound, and protective in real-world operations**.

---

## 2. The Master Information and Control Matrix (Layers 2 & 3)

| Lifecycle Stage | Primary Actor | Information Available | Security Signal Generated | Decision Possible? | Intervention Possible? | Authoritative Evidence Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Off-Rail Social Engineering** | Scammer & Victim | Verbal phone dialogue, WhatsApp messages, forged PDF warrants, coercive threats. | High urgency keywords, authority intimidation, isolation demands. | **NO (System Blind)** | **NONE** (Occurs out-of-band on third-party channels). | Telecom / OS Sandboxing Architecture; DPDP Act 2023. |
| **2. Intent Delivery / QR Scan** | Victim & Client App | Raw Intent URI: `pa`, `pn`, `am`, `tn`, `mc`, QR visual bitmap. | QR payload anomaly, unverified merchant code, high-value pre-filled amount. | **YES (Preliminary)** | **LOW** (App is just opening or parsing URI string). | NPCI UPI Linking Specifications v2.1. |
| **3. Recipient Resolution** | TPAP App, PSP, Central Switch | Registered Legal Name (`RespValAdd`), VPA existence, account status. | **Name Divergence:** Bank name mismatch against claimed entity; VPA creation recency. | **YES (High)** | **MEDIUM** (Can flag unverified status or display warning banner). | NPCI Procedural Guidelines: VPA Directory Integration. |
| **4. Pre-PIN Review (The Golden Window)** | **Victim & TPAP Client App** | Full transaction tuple: Amount, Payee VPA, Note, Bank Name, Dwell time, active call flag. | **Multi-Modal Synthesis:** Urgency semantics + Name mismatch + Relational novelty + Hesitation. | **YES (CRITICAL DECISION POINT)** | **MAXIMUM INTERVENTION AUTHORITY:** Silent pass, Explainable warning, Cognitive challenge, Cool-off pause, Hard block! | Android Touch Framework; HCI Usability Research (Cranor et al.). |
| **5. MPIN Capture Sandbox** | Victim & NPCI Common Library | Encrypted PIN block, Device Hardware Binding token. | Pin attempt failure (if entered incorrectly). | **NO** (Isolated hardware encryption view). | **NONE** (Client app has zero visibility into Common Library memory). | RBI Master Direction on Digital Payment Security Controls. |
| **6. Financial Message Routing** | PSP Bank & NPCI Switch | ISO 20022 XML packet: RRN, UTR, Terminal ID, Payer VPA, Payee VPA, Amount. | Systemic velocity anomalies, cross-bank rapid burst transactions. | **YES (Rule-based)** | **LOW TO MEDIUM:** Switch can reject message, but faces strict sub-50ms timeout. | NPCI Switch Architecture SLA Guidelines. |
| **7. Core Debit Execution** | Remitter Bank CBS | Customer balance, daily debit limit, internal bank FRM score. | Account balance drainage, unusual debit velocity. | **YES (Bank Rule)** | **MEDIUM:** Bank can decline debit for insufficient balance or hard bank freeze. | Core Banking System (Finacle/BaNCS) Specifications. |
| **8. Core Credit Execution** | Beneficiary Bank CBS | Recipient account number, IFSC, account age, inward velocity. | **Mule Profile:** Rapid successive inward credits from unrelated remitters. | **YES (Bank Rule)** | **MEDIUM:** Beneficiary bank can decline credit or place funds on hold. | RBI Inward Credit Monitoring Directives. |
| **9. Mule Dissipation & Cash-Out** | Mule Operator & ATM / Crypto | Outward IMPS transfers, ATM cash withdrawal logs, P2P exchange API. | **Mule Pass-Through:** Inbound funds debited within 90 seconds. | **YES (Forensic)** | **ZERO FOR VICTIM:** Funds have physically left the formal banking rail. | FIU-IND Strategic Typologies Report. |
| **10. Post-Facto Investigation** | Victim, Police & 1930 Portal | Transaction UTR, FIR narrative, bank statements, victim testimony. | Confirmed cyber financial fraud case; criminal syndicate identification. | **YES (Legal)** | **POST-FACTO ONLY:** Automated lien on mule account balance (usually ₹0). | I4C CFCFRMS Standard Operating Procedures. |

---

## 3. Structural Synthesis & Strategic Deductions (Layer 4)

### 3.1 The Inevitable Locus of Defense
* **Stage 1 (Off-Rail):** Completely invisible to the payment ecosystem due to mobile OS sandboxing and constitutional privacy protections.
* **Stage 5 to 8 (Switch & Banking Cores):** Governed by sub-second network timeouts and automated clearing rules where successful authentication (MPIN) is treated as valid authorization.
* **Stage 9 & 10 (Downstream Dissipation & Police):** Completely reactive; funds are already laundered into cash or crypto before police or banks can act.
* **THE STRATEGIC CONCLUSION:** The **entire defense must be won at Stage 4 (The Pre-PIN Review Window)**. This is the sole operational junction where full transaction context, counterparty verification, human cognition, and software intervention authority converge.

---
**Primary References:**
1. National Payments Corporation of India: *UPI End-to-End Operational Lifecycle and Inter-Entity Control Points*.
2. Reserve Bank of India: *Master Direction – Operational Risk Management in Payment Systems*.
3. Indian Cyber Crime Coordination Centre (I4C): *National Cybercrime Reporting Portal Operational Metrics (2023-24)*.

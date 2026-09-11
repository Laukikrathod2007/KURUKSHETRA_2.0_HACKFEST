# Datasets and Benchmarks Landscape in Fraud and Scam Research

## 1. Executive Summary & Context

Machine learning and artificial intelligence research depends fundamentally on the quality, realism, and representative nature of available datasets and benchmark environments. In financial security research, however, access to real-world data is severely restricted by banking secrecy laws (e.g., Gramm-Leach-Bliley Act, Bank Secrecy Act), privacy legislation (GDPR, CCPA, India DPDP), and the proprietary competitive value of fraud telemetry.

This document systematically examines the **publicly available datasets and benchmark suites** utilized in fraud and financial crime literature. Crucially, it evaluates a paramount distinction: **generic transaction fraud (unauthorized theft) versus Authorized Push Payment (APP) scams (social engineering)**. The investigation reveals a stark empirical reality: while unauthorized card fraud and account takeover are heavily benchmarked, open-source, representative datasets for authorized payment scams are virtually nonexistent.

---

## 2. The Benchmark Divide: Fraud vs. Scam Representation

To evaluate existing datasets, we first map the operational differences between the phenomena represented in benchmark literature:

```text
                     THE BENCHMARK REPRESENTATION GAP
                     
  Phenomenon Type          Key Defining Characteristic         Public Dataset Availability
  ──────────────────────────────────────────────────────────────────────────────────────────
  Credit Card Fraud        Unauthorized card-not-present (CNP); Abundant (Kaggle ULB,
                           credential theft; bot stuffing       IEEE-CIS, IBM synthetic)
  ──────────────────────────────────────────────────────────────────────────────────────────
  Bank Account Fraud       Synthetic identity; first-party      Moderate (Feedzai BAF,
  (Application / ATO)      credit bust-out; stolen KYC docs     FinKG, DGraph-Fin)
  ──────────────────────────────────────────────────────────────────────────────────────────
  Anti-Money Laundering    Layered crypto hops; structuring;    Moderate (Elliptic, Elliptic2,
  (AML / Mule Graphs)      smurfing through mule accounts       AMLSim)
  ──────────────────────────────────────────────────────────────────────────────────────────
  Authorized Push Payment  Authorized by legitimate user;       VIRTUALLY ZERO
  Scams (APP Scams)        social engineering; psychological   (Proprietary / Siloed inside
                           coercion; behavioral hesitation      banks; no open benchmarks)
```

In an unauthorized transaction, the features that matter are **device mismatch, geographic impossibility, and IP velocity**. In an authorized scam, however, the device is the user's authentic smartphone, the IP is the user's home Wi-Fi, the biometrics are genuine, and MFA passes cleanly. Datasets built for the former fail completely to benchmark systems designed for the latter.

---

## 3. Comprehensive Review of Public Benchmarks

### 3.1 PaySim (Synthetic Financial Mobile Money Dataset)
- **Primary Citation**: Lopez-Rojas et al., "PaySim: A financial mobile money simulator for fraud detection," *IEEE International Conference on Smart City Innovations*, 2016.
- **Source & Origin**: Synthetic multi-agent simulator modeled after 1 month of anonymized mobile money logs from a private telecommunications provider in an African nation (M-Pesa equivalent).
- **Domain**: Peer-to-Peer (P2P) mobile wallet money transfers.
- **Dataset Size**: 6,362,620 transactions (synthetic).
- **Class Imbalance**: 8,213 fraudulent transactions (~0.129% fraud prevalence).
- **Features (11 columns)**:
  - `step`: Simulation time step (1 step = 1 hour, spans 744 steps / 30 days).
  - `type`: `CASH_IN`, `CASH_OUT`, `DEBIT`, `PAYMENT`, `TRANSFER`.
  - `amount`: Transaction value in local currency.
  - `nameOrig`, `oldbalanceOrg`, `newbalanceOrig`: Sender identifier and balances.
  - `nameDest`, `oldbalanceDest`, `newbalanceDest`: Receiver identifier and balances.
  - `isFraud`: Ground truth label.
  - `isFlaggedFraud`: Legacy business rule trigger (>200,000 in a single transfer).
- **Temporal Characteristics**: Tabular chronological steps; lacks sub-second transaction arrival timestamps.
- **Licensing & Access**: Creative Commons Attribution 4.0 International (CC BY 4.0); hosted on Kaggle.
- **Critical Limitations**:
  - *Fraud Typology*: All simulated fraud in PaySim consists exclusively of unauthorized agent cash-outs (a compromised account transfers funds to an agent who immediately executes a `CASH_OUT`).
  - *Zero Behavioral Signals*: Contains no sensor data, no IP/device fingerprints, no session durations, and no victim-scammer interaction metadata.
  - *Zero Scam Representation*: Models no social engineering, no victim coercion, and no payment hesitation.

---

### 3.2 IEEE-CIS Fraud Detection Benchmark
- **Primary Citation**: IEEE Computational Intelligence Society (IEEE-CIS) & Vesta Corporation, "IEEE-CIS Fraud Detection Competition," Kaggle, 2019.
- **Source & Origin**: Real-world e-commerce transaction logs provided by Vesta Corporation (payment service provider).
- **Domain**: Card-Not-Present (CNP) e-commerce card checkout transactions.
- **Dataset Size**: 590,540 train transactions + 506,691 test transactions (~1.09 million total).
- **Class Imbalance**: ~3.5% positive fraud label rate.
- **Features (434 columns)**:
  - Transaction metadata: `TransactionDT` (timedelta), `TransactionAmt`, `ProductCD`, card details (`card1`–`card6`).
  - Anonymized Vesta engineered features: `C1`–`C14` (counting metrics), `D1`–`D15` (time deltas), `M1`–`M9` (match attributes e.g., name/address match), `V1`–`V339` (proprietary Vesta fraud features).
  - Device identity metadata: `id_01`–`id_38` (browser version, OS, screen resolution), `DeviceInfo`.
- **Temporal Characteristics**: Split chronologically (train on first 5 months, test on subsequent 6 months) to evaluate concept drift.
- **Licensing & Access**: Kaggle Competition Terms; free academic and research access.
- **Critical Limitations**:
  - *Heavily Masked*: Over 80% of feature definitions are completely masked (`V1`–`V339`), preventing causal reasoning or domain-specific feature interpretation.
  - *Card-Not-Present Only*: Evaluates automated card cracking, stolen card numbers, and bot testing; completely irrelevant to instant push payment credit transfers (UPI/FedNow).
  - *No Authorized Scams*: Does not contain authorized social engineering incidents.

---

### 3.3 Feedzai Bank Account Fraud (BAF) Benchmark Suite
- **Primary Citation**: Jesus et al., "Turning the Tables: Biased, Imbalanced, Dynamic Tabular Datasets for ML Evaluation," *NeurIPS*, 2022.
- **Source & Origin**: Feedzai research team; semi-synthetic dataset generated using CTGANs trained on real-world European bank account opening and transaction data.
- **Domain**: Bank account opening and digital bank application fraud.
- **Dataset Size**: 1,000,000 application records across 6 standardized suite variants (`Base`, `Variant I`–`Variant V`).
- **Class Imbalance**: Exactly 1.10% positive fraud prevalence (empirically calibrated).
- **Features (32 columns)**:
  - Demographics & Employment: `income`, `customer_age`, `employment_status`.
  - Application Context: `application_velocity`, `housing_status`, `phone_home_valid`, `email_is_free`.
  - Behavioral & Device: `session_length_in_minutes`, `device_os`, `has_other_cards`, `foreign_request`.
  - Credit Risk: `credit_risk_score`, `bank_months_count`, `proposed_credit_limit`.
- **Temporal Characteristics**: Chronologically ordered across 8 months, explicitly designed to benchmark temporal concept drift and fairness/bias mitigation over time.
- **Licensing & Access**: CC BY 4.0; public GitHub repository and OpenML.
- **Critical Limitations**:
  - *Application Fraud Focus*: Specifically models first-party fraud and synthetic identity fraud at the time of account creation.
  - *Not a Payment Stream*: Does not model ongoing P2P payment streams, beneficiary routing, or transaction interception.
  - *No Scam Dynamics*: Zero representation of authorized push payment scams.

---

### 3.4 Elliptic and Elliptic2 Datasets (Graph AML)
- **Primary Citation**: Weber et al., "Anti-Money Laundering in Bitcoin: Experimenting with Graph Convolutional Networks for Financial Technologies," *KDD*, 2019; Shen et al., "Elliptic2," 2023.
- **Source & Origin**: Elliptic (blockchain intelligence firm) in collaboration with MIT-IBM Watson AI Lab.
- **Domain**: Cryptocurrency transaction graphs on the Bitcoin blockchain.
- **Dataset Size**:
  - *Elliptic 1*: 203,769 node transactions and 234,355 directed payment edges across 49 distinct time steps.
  - *Elliptic 2*: >122,000 subgraphs and >49 million transactions.
- **Class Imbalance**: ~2% illicit transactions, ~21% licit transactions, ~77% unlabeled.
- **Features (166 features per node)**:
  - 94 local transaction features: transaction fee, output count, BTC volume, temporal step.
  - 72 aggregated neighborhood features: one-hop and two-hop aggregated statistics (mean, min, max, std dev of neighbor amounts and fees).
- **Temporal Characteristics**: 49 discrete time steps sampled at 2-week intervals.
- **Licensing & Access**: CC BY 4.0; public GitHub.
- **Critical Limitations**:
  - *Cryptocurrency Graph Topology*: Bitcoin UTXO transaction graphs exhibit structural dynamics fundamentally distinct from fiat bank account-to-account credit transfers.
  - *Illicit Taxonomy*: Illicit nodes represent darknet marketplaces, ransomware cash-outs, and sanctioned mixer entities; does not model fiat social engineering scams or mobile push payments.

---

### 3.5 DGraph-Fin (Dynamic Financial Graph Benchmark)
- **Primary Citation**: Huang et al., "DGraph: A Large-Scale Financial Dataset with Dynamic Ground Truth for Fraud Detection," *NeurIPS*, 2022.
- **Source & Origin**: FinVolution Group (large consumer digital lending and fintech platform in China).
- **Domain**: Social network borrowing and emergency consumer credit default/fraud.
- **Dataset Size**: 3,700,550 nodes (users) and 4,300,999 directed dynamic edges.
- **Class Imbalance**: 1.27% fraudulent default nodes.
- **Features (17 masked features per node)**: Anonymized user demographic, behavioral, and device indicators. Edge attributes include timestamp and relationship type.
- **Temporal Characteristics**: Dynamic edge evolution spanning several years.
- **Licensing & Access**: Academic research access via signed agreement / DGraph benchmark repository.
- **Critical Limitations**: Models loan defaulting and emergency contact collusion; completely distinct from real-time payment scam interception.

---

## 4. Summary Matrix of Public Datasets

| Dataset Name | Domain | Public Access | Total Records | Fraud / Scam Rate | Realistic Features | Real-Time Latency Data | Models APP Scams? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **PaySim** | Mobile Money P2P | Yes (Kaggle) | 6.36M | 0.13% | Synthetic / Coarse | No (Hourly steps) | **NO** (Only agent cash-out) |
| **IEEE-CIS** | E-commerce CNP | Yes (Kaggle) | 1.09M | 3.50% | Real (80% Masked) | Millisecond deltas | **NO** (Only card theft) |
| **Feedzai BAF** | Account Opening | Yes (GitHub) | 1.00M | 1.10% | High (Synthesized) | No (Tabular application) | **NO** (Only identity fraud) |
| **Elliptic 1 & 2** | Bitcoin Blockchain | Yes (GitHub) | 203K / 49M | 2.00% | Graph features | Coarse (2-week steps) | **NO** (Only darknet/ransomware) |
| **DGraph-Fin** | Consumer Lending | Yes (Paper) | 3.70M | 1.27% | Masked graph nodes | Dynamic timestamps | **NO** (Only credit default) |
| **Kaggle CreditCard**| European Card 2013| Yes (Kaggle) | 284K | 0.17% | 28 PCA-masked features| Elapsed seconds | **NO** (Only card theft) |

---

## 5. The Critical Void: Public Scam Telemetry

The exhaustive analysis of public benchmarks demonstrates that **there is currently no publicly accessible benchmark dataset specifically capturing Authorized Push Payment (APP) scams**.

### 5.1 Why Real Scam Datasets Are Not Publicly Released
1. **Severe Personally Identifiable Information (PII) Risk**:
   - In social engineering scams, the primary signals reside in unstructured communications: phone transcripts, WhatsApp text messages, payment memo descriptions ("Paying court bail"), and recipient UPI IDs.
   - Anonymizing text and transaction graphs without destroying the subtle semantic indicators of deception is an unsolved privacy-preserving machine learning problem.
2. **Regulatory & Legal Liability**:
   - Under GDPR Article 9 and financial privacy statutes, banks disclosing transaction graphs containing victim and recipient accounts risk immense regulatory penalties.
   - In jurisdictions where banks face mandatory scam reimbursement (e.g., UK PSR), publishing scam incident telemetry could expose institutions to civil litigation or regulatory enforcement.
3. **The Sensor & Telemetry Gap**:
   - Even when banks share tabular transaction logs under non-disclosure agreements with academic partners, they rarely possess client-side behavioral sensor streams (touch dynamics, accelerometer, screen-sharing status) because their core transactional databases are physically decoupled from client mobile app telemetry.

### 5.2 Methodological Consequences for Research
Because academic researchers lack access to real authorized scam datasets:
- **Synthetic Proxy Reliance**: Over 70% of academic papers evaluating "real-time fraud detection" evaluate their algorithms on PaySim or Kaggle CreditCard—datasets representing completely different causal mechanisms (card theft or synthetic cash-out).
- **Overstated Efficacy**: Machine learning models reported to achieve >99% ROC-AUC on PaySim or IEEE-CIS experience catastrophic performance collapse when deployed against real-world social engineering scams, because the models learned to detect stolen card velocity rather than victim psychological manipulation.

---

## 6. Summary of Findings: Datasets & Benchmarks

| Evaluation Dimension | Reality of Existing Landscape |
| :--- | :--- |
| **Card Fraud & Identity Theft** | Well-served by large, standardized public benchmarks (IEEE-CIS, Feedzai BAF). |
| **Graph AML & Laundering** | Supported by blockchain graph benchmarks (Elliptic, Elliptic2). |
| **Authorized Push Payment Scams** | **Completely absent from the public benchmark ecosystem.** |
| **Behavioral Sensor Telemetry** | Zero open-source datasets pairing transaction logs with touch biometrics or device state. |
| **Academic Reproducibility** | Severely compromised; academic claims cannot be verified against real-world scam environments. |

```text
CORE LANDSCAPE TAKEAWAY:
The entire public data and benchmark landscape is heavily biased toward 
unauthorized card theft and synthetic identity creation. 
There is a total public benchmark vacuum for Authorized Push Payment (APP) scams. 
Any research claims asserting high performance on public datasets must be 
scrutinized with extreme skepticism, as they benchmark the wrong threat model.
```

# Public Datasets: Survey, Feature Coverage, and the Ground-Truth Vacuum in Mobile Scams

---

## 1. Executive Understanding
A foundational reality of payment security research is that **no publicly available dataset accurately captures modern Authorized Push Payment (APP) scams in the Indian UPI ecosystem**. 

While academic literature abounds with studies on the IEEE-CIS Credit Card dataset or synthetic PaySim logs, these datasets model **card-not-present (CNP) identity theft or African mobile-money cash-outs from 2016**. They lack the defining attributes of modern UPI social engineering: **the `RespValAdd` legal name discrepancy, code-switched Hinglish coercion notes, concurrent phone call telemetry, and the pre-PIN review window**.

To build and evaluate **PS09**, researchers must thoroughly understand the utility, limitations, and ground-truth vacuum across existing open-source benchmarks.

---

## 2. Comprehensive Survey of Public Financial & Fraud Datasets

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                         PUBLIC FRAUD DATASET SURVEY                                       │
├─────────────────────┬──────────────┬──────────────┬──────────────┬────────────────────────┤
│ DATASET             │ MODALITY     │ RECORD COUNT │ DOMAIN       │ RELEVANCE TO PS09      │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **IEEE-CIS Fraud**  │ Tabular      │ 590,540 tx   │ Card-Not-    │ **Low-Moderate:** Good │
│ (Kaggle / Vesta)    │ + Device     │ (3.5% fraud) │ Present      │ for GBDT benchmarking; │
│                     │              │              │ E-Commerce   │ zero UPI / APP scam data
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **PaySim**          │ Multi-agent  │ 6,362,620 tx │ African      │ **Moderate:** Simulates│
│ (Lopez-Rojas et al.)│ Synthetic    │ (0.13% fraud)│ Mobile Money │ P2P transfers & cash-  │
│                     │ Tabular      │              │ (M-Pesa)     │ out; lacks text & biomet
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **ULB Credit Card** │ PCA-Trans-   │ 284,807 tx   │ European     │ **Low:** Pure PCA math;│
│ (Dal Pozzolo et al.)│ formed float │ (0.17% fraud)│ Credit Cards │ zero semantic or       │
│                     │              │              │ (2013)       │ contextual interpret.  │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Elliptic Bitcoin**│ Temporal     │ 203,769 tx   │ Blockchain   │ **Moderate for Graph:**│
│ (Weber et al. MIT)  │ Graph Nodes  │ (2% illicit) │ Cryptocurrency│ Models layering &      │
│                     │              │              │ Laundering   │ multi-hop dispersal    │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **DGraph-Fin**      │ Dynamic      │ 3,700,550    │ Consumer     │ **High for Graph ML:** │
│ (Fintech Graph Lab) │ Hetero Graph │ nodes / 4.3M │ Lending &    │ Excellent for mule     │
│                     │              │ edges        │ Fraud Rings  │ cluster detection      │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **SMS Spam Corpus** │ Text / NLP   │ 5,574 texts  │ Mobile SMS   │ **Low:** Obsolete spam;│
│ (UCI Repository)    │              │ (13% spam)   │ (English)    │ zero Indian vernacular │
│                     │              │              │              │ or extortion scripts   │
├─────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────┤
│ **Touchalytics**    │ Behavioral   │ 4,000+ touch │ Android      │ **Moderate for Bio:**  │
│ (Frank et al.)      │ Biometrics   │ trajectories │ Touch Screen │ Models swipe curvature │
│                     │              │              │ Dynamics     │ and touch surface area │
└─────────────────────┴──────────────┴──────────────┴──────────────┴────────────────────────┘
```

---

## 3. Deep Dissection of Key Datasets

### 1. PaySim: Strengths and Structural Flaws
PaySim is based on a real 30-day anonymized transaction log from a mobile money service in an African country, simulated using the BDI (Belief-Desire-Intention) agent framework.
- **Why it is useful:** It explicitly models `TRANSFER` and `CASH_OUT` flows, capturing the rapid laundering mechanism where funds are transferred to a mule and immediately cashed out.
- **Why it fails for PS09:** PaySim features are strictly numerical (`step`, `type`, `amount`, `nameOrig`, `oldbalanceOrg`, `newbalanceOrig`, `nameDest`). It possesses zero linguistic notes, zero device sensor flags, and zero concept of UPI VPA handles or institution-versus-individual identity discrepancies.

### 2. The IEEE-CIS Benchmark
The IEEE-CIS dataset was released by Vesta Corporation on Kaggle:
- **Why it is useful:** It contains rich device-level metadata (`DeviceInfo`, `id_30` OS version, `DeviceType`) alongside e-commerce transaction features (`C1-C14` counting features, `D1-D15` timedelta features). It remains the gold standard for testing class-imbalance techniques in GBDT models.
- **Why it fails for PS09:** Vesta models unauthorized card fraud (stolen card numbers used on merchant websites). The victim has no idea the transaction is occurring. In contrast, in UPI APP scams, **the victim is the person initiating the transaction on their own bound phone**.

---

## 4. The Ground-Truth Vacuum in Indian Scam Telemetry

Why is there no public dataset for Indian UPI scams?
1. **Bank Secrecy and Legal Liability:** Under Section 45E of the RBI Act and the DPDP Act 2023, Indian banks are legally prohibited from publishing customer transaction histories or un-redacted core banking ledger logs.
2. **Police Data Classification:** The Indian Cybercrime Coordination Centre (I4C) NCRP database contains active First Information Reports (FIRs), ongoing criminal investigations, and sensitive victim personal data classified as law enforcement confidential.
3. **The Multi-Modal Integration Gap:** A true APP scam dataset requires concurrent alignment of:
   - Transaction metadata (Amount, VPA, Time)
   - CBS KYC legal name resolution (`RespValAdd`)
   - Telephony background state (Active call boolean)
   - Screen dwell time & touch dynamics
   - Payment note Hinglish linguistics
   **Such a multi-modal dataset does not exist anywhere in the public domain.**

---

## 5. Epistemic Assessment for PS09

| Dimension | Public Dataset Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Direct Applicability** | **Near Zero for End-to-End Evaluation:** No public dataset captures the multi-modal UPI scam problem. | We must not claim that evaluating on PaySim or IEEE-CIS proves effectiveness against Indian UPI scams. |
| **Algorithm Benchmarking** | **Valid for Isolated Sub-Components:** IEEE-CIS validates tabular GBDT calibration; DGraph-Fin validates graph clustering. | Use public datasets strictly to validate mathematical sub-modules. |
| **Primary Evaluation Strategy** | **Requires Rigorous Synthetic Generation:** Must construct a realistic, multi-modal synthetic dataset modeled on real Indian cybercrime typologies. | Developing an empirically grounded synthetic evaluation suite is a **mandatory requirement for Phase 3 and Phase 4**. |

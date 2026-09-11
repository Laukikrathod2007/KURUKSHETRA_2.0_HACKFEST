# Data Quality, Labeling Dynamics, and the Myth of Clean Fraud Datasets

---

## 1. Executive Understanding (Layer 1)
In academic machine learning benchmarks, researchers frequently work with clean, pre-packaged CSV datasets (e.g., Kaggle Credit Card Fraud Detection) where rows represent transactions, columns represent static features, and a neat binary target variable `Class ∈ {0, 1}` defines ground truth.

In real-world payment systems engineering, **clean fraud labels are a total myth**. Real-world payment data is characterized by **extreme class imbalance** (1 scam per 10,000 to 50,000 benign transfers), **severe label lag** (it takes weeks or months for an authorized scam transaction to be reported, investigated, and confirmed), **noisy/disputed labels** (users claiming fraud to reverse legitimate impulsive purchases), and **aggressive adversarial concept drift** (scam syndicates rotating narratives as soon as detection rules are updated).

---

## 2. Structural Pathologies of Payment Data (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE SIX PATHOLOGIES OF PAYMENT DATA                      │
├─────────────────────┬───────────────────────────────────────────────────────┤
│ PATHOLOGY           │ TECHNICAL MANIFESTATION & IMPACT                      │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **1. Extreme Class**│ $99.99\%$ benign vs $0.01\%$ scam. Standard loss      │
│ **Imbalance**       │ functions predict all zeros and achieve $99.99\%$     │
│                     │ "accuracy" while catching zero scams!                 │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **2. Severe Label** │ A transaction executed today is reported 3 weeks later│
│ **Lag**             │ and confirmed by police 2 months later. Real-time     │
│                     │ training sets are permanently blind to current week.  │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **3. Unreported**   │ High percentage of victims (especially elderly or    │
│ **Dark Figure**     │ romance victims) feel ashamed and never report loss.  │
│                     │ Scams are falsely labeled as "Benign 0" in historicals│
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **4. Adversarial**  │ Scammers rotate payment note keywords and mule handles│
│ **Concept Drift**   │ every 72 hours. Static models decay rapidly.          │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **5. Friendly Fraud**│ User buys crypto or gaming skins, regrets purchase,  │
│ **Noise**           │ and falsely reports it as a scam to seek bank refund. │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **6. Partial**      │ Crucial social engineering dialogue occurs out-of-band│
│ **Context**         │ (WhatsApp/phone call), leaving transaction record thin│
└─────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. Deep Operational Impact on Modeling (Layer 3)

### 3.1 The Label Lag Timeline
```
Day 0: Scam Payment Executed (Money transferred to mule VPA).
       Model records transaction as "Unlabeled / Presumed Benign".
Day 4: Victim realizes investment platform is fake; attempts customer care.
Day 8: Victim calls 1930 Cybercrime Helpline; FIR lodged.
Day 25: Beneficiary bank receives police freeze notice; confirms mule account.
Day 60: Remitter bank reconciles fraud loss report.
       Model finally receives Ground Truth Label: `y = 1`.
```
* **The Engineering Consequence:** Any supervised learning model trained on recent data will suffer from **Label Contamination**: hundreds of active scam transactions executed over the past 30 days are mislabeled as `0` because the victims have not yet realized or reported the fraud.

### 3.2 The Asymmetric Loss Function Reality
Because financial crime is inherently asymmetric, evaluating models using symmetric metrics like **Accuracy** or **F1-Score** is catastrophic:
* Cost of False Positive ($C_{\text{FP}}$): Temporary user irritation, customer support ticket (~₹200 operational cost).
* Cost of False Negative ($C_{\text{FN}}$): Entire victim savings lost, police investigation, regulatory fine (~₹50,000 to ₹5,00,000+).
* In production, the loss function must be parameterized by **Cost-Sensitive Learning**:
  $$\mathcal{L}_{\text{cost}} = C_{\text{FN}} \cdot \sum (y \cdot (1 - \hat{y})) + C_{\text{FP}} \cdot \sum ((1 - y) \cdot \hat{y})$$
  where $C_{\text{FN}} \gg C_{\text{FP}}$.

---

## 4. Boundaries & Epistemic Realities for PS09 (Layer 4)

### 4.1 Synthesizing Test Datasets for Prototype Evaluation
* In prototype evaluation and competition benchmarks, teams cannot rely on proprietary banking ledgers containing live user PII.
* **The Epistemic Mandate:** The test dataset must be **synthesized with extreme structural fidelity**:
  * Benign transactions must include realistic legitimate anomalies (e.g., high-value emergency transfers, new merchants, festive gifting).
  * Scam transactions must not be cartoonish; they must mirror real Indian playbooks with subtle linguistic cues, authentic VPA handle structures, and plausible amounts.

---
**Primary References:**
1. Hand, David J.: *Mining the Past to Determine the Future: Problems and Possibilities in Fraud Detection (Statistical Science)*.
2. Dal Pozzolo, Andrea et al.: *Credit Card Fraud Detection: A Realistic Modeling and a Novel Learning Strategy (IEEE TNNLS)*.
3. Reserve Bank of India: *Guidelines on Data Governance and Quality in Banking Operations*.

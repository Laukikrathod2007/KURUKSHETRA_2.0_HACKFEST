# Signal Reliability: Evidentiary Weighting, Noise Ratios, and Manipulability

---

## 1. Executive Understanding
In evidence-based security engineering, **treating all signals equally is an architectural pathology**. An isolated high transaction amount is not evidence of a scam; an unverified recipient is usually just a new friend; and the absence of a blacklist record is not proof of legitimacy.

A production-grade risk engine must evaluate signals through an **Evidentiary Hierarchy** parameterized by three mathematical properties:
1. **Signal-to-Noise Ratio (SNR):** How frequently does this signal appear in malicious transactions relative to benign transactions?
2. **Attacker Manipulability:** How easily can the adversary alter, suppress, or spoof this signal?
3. **Information Freshness:** Does the signal reflect real-time ground truth or stale historical records?

---

## 2. The 5-Tier Signal Reliability Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SIGNAL RELIABILITY HIERARCHY                          │
├─────────────────────┬───────────────────────────────────────────────────────┤
│ RELIABILITY TIER    │ EXAMPLES & OPERATIONAL BEHAVIOR                       │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **Tier 1: High-     │ • Bank-Verified Name Mismatch (`RespValAdd`)          │
│  Fidelity / Strong**│ • Active Remote Access APK (AnyDesk running)          │
│                     │ • National Cybercrime Police Blacklist Hit (I4C)      │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **Tier 2: Moderate  │ • P2P handle receiving institutional utility payment  │
│  Discriminative**   │ • Severe ticket size anomaly ($Z > 4.5\sigma$)        │
│                     │ • First-time recipient + Active voice call flag       │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **Tier 3: Context-  │ • High-urgency keyword density in note                │
│  Dependent**        │ • Screen dwell time $>4\times$ normal baseline        │
│                     │ • Unusual transaction hour (e.g., 3:30 AM)            │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **Tier 4: Weak /    │ • Isolated high transaction amount                    │
│  Ambiguous**        │ • First-time recipient with normal ticket size        │
│                     │ • User has no prior transaction history (Cold start)  │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ **Tier 5: Easily    │ • User-entered payment note (`tn`) on its own         │
│  Manipulated**      │ • Raw Payee Display Name (`pn`) in unverified URI     │
│                     │ • User verbally asserting: "I know this person"       │
└─────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. Deep Analysis of Signal Reliability Dimensions

| Signal | Evidentiary Weight | Attacker Manipulability | False Positive Risk if Used in Isolation | Production Decision Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Bank Name Mismatch** (`RespValAdd`) | **Extremely High (0.95)** | **Zero:** Set by bank during KYC; attacker cannot modify CBS record. | Low (unless user intentionally pays a spouse/relative). | **Triggers Immediate High-Tier Intervention:** Highlights legal name in high contrast. |
| **Active Remote Desktop** (AnyDesk) | **Extremely High (0.98)** | **Low:** Attacker must persuade user to install and grant accessibility. | Negligible (Users almost never execute legitimate payments while using AnyDesk). | **Triggers Mandatory Hard Block:** Forces user to close screen-share software. |
| **Payment Note Keywords** | **Context-Dependent (0.40)**| **High:** Scammer can instruct victim to leave blank or write "gift". | Extremely High (Common words like "bill" or "urgent" appear in safe transfers). | **Advisory Trigger Only:** Used to hydrate contextual risk; NEVER used to block alone. |
| **Absence of Blacklist Hit** | **Zero (0.00)** | **High:** Attacker rotates fresh mule VPAs every 48 hours. | Total Failure Mode (Treats brand-new mules as completely safe). | **Classified as UNKNOWN, never as SAFE.** |
| **New Recipient Status** | **Weak (0.20)** | **None:** Relational property of user graph. | **Catastrophic (50%+ false positives):** Millions of safe daily payments are to new payees. | **Triggers Low-Friction Verification Banner Only:** Never adds intrusive friction alone. |

---

## 4. Boundaries & Epistemic Invariants for PS09

### 4.1 The Negative Proof Fallacy
* **The Dangerous Invariant:** In cybersecurity, **absence of evidence is NOT evidence of absence**. 
* A clean record on a recipient VPA does not prove the account is legitimate; it merely proves that **the account has not yet been caught**. 
* Any risk engine that assigns a low risk score simply because `blacklist_match == False` will fail against zero-day scam campaigns.

---
**Primary References:**
1. Good, I.J.: *Probability and the Weighing of Evidence (Charles Griffin & Co.)*.
2. Pearl, Judea: *Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference*.
3. ACM Transactions on Computer-Human Interaction: *Designing Dependable Security Warnings: Evidentiary Calibration and False Alarm Mitigation*.

# Dimension A: Detection Gaps in Scam Defense

## 1. Executive Summary & Context

In traditional financial cybersecurity, **detection** is formulated as identifying anomalous deviations from authentic account behavior (e.g., automated credential stuffing, bot velocity bursts, sudden geographic jumps from New York to Lagos). In Authorized Push Payment (APP) scams, however, this foundational assumption collapses: **the transaction is authorized by the genuine account holder using their authentic device, valid biometrics, and typical network IP**.

This document investigates the specific structural **detection gaps** inherent to existing algorithmic paradigms (rules, supervised gradient-boosted decision trees, unsupervised anomaly detection, and deep learning). It demonstrates why current systems struggle to distinguish scam-induced transfers from authentic consumer behavior, and maps the fundamental signal deficits that blind real-time risk engines.

---

## 2. Core Detection Deficiencies

### 2.1 The Authentic Behavioral Mimicry Problem
- **Deficiency**: Existing supervised ML models and statistical baselines cannot differentiate between legitimate atypical consumer spending and scam-induced payments.
- **Underlying Cause**: Scammers intentionally design their pretexts to mirror normal, high-value life events:
  - *Impersonation Scams* mimic urgent legal fees, tax payments, or medical emergencies.
  - *Pig-Butchering Scams* mimic personal wealth accumulation, high-yield savings deposits, or crypto portfolio diversification.
  - *Purchase Scams* mimic routine e-commerce marketplace transactions.
- **Algorithmic Failure**: A customer transferring $8,000 to an unestablished payee to buy a used car looks mathematically identical in tabular feature space (amount, time, channel) to a customer transferring $8,000 to a mule account under digital arrest coercion.
- **Empirical Evidence**: Featurespace and Feedzai operational whitepapers confirm that when risk models evaluate tabular transaction attributes alone, achieving an 80% recall on authorized scams results in a Customer Insult Ratio exceeding **40:1** (40 legitimate customer payments blocked for every 1 scam caught), which is commercially intolerable.

### 2.2 Blindness to Gradual, Multi-Stage Value Escalation (The "Slow-Burn" Scam)
- **Deficiency**: Existing fraud detection rules and velocity counters evaluate transactions either in isolation or over narrow rolling time windows (e.g., 10 minutes, 24 hours), completely missing multi-week trust-building scams.
- **Underlying Cause**: In pig-butchering and task scams, the victim is manipulated over weeks:
  1. *Day 1*: Victim transfers $50 (test task). Scammer returns $65 (positive reinforcement).
  2. *Day 4*: Victim transfers $500. Fictitious dashboard shows balance growing to $750.
  3. *Day 12*: Victim transfers $2,500.
  4. *Day 25*: Victim transfers life savings of $75,000 to "unlock" accrued profits.
- **Algorithmic Failure**: Steps 1, 2, and 3 fall well within the customer's normal daily debit limits and standard velocity thresholds. Because the early transfers establish a legitimate behavioral baseline, Step 4 is scored as lower risk by baseline anomaly models because the recipient payee has a 3-week history of successful transfers!
- **Empirical Evidence**: UK Financial Ombudsman Service (FOS) case records show that over 65% of investment scam dispute claims involve multi-stage payment funnels spanning 14 to 45 days, evading single-transaction velocity rules.

### 2.3 The Semantic & Communicative Context Vacuum
- **Deficiency**: Real-time payment switch scoring engines operate in complete isolation from the communication channels where the social engineering attack actually occurs.
- **Underlying Cause**: The social engineering deception occurs over WhatsApp, Telegram, cellular phone calls, or phishing websites. The payment switch receives strictly a rigid ISO 20022 or JSON payload containing:
  ```json
  {
    "PayerID": "usr_9981",
    "PayeeID": "mule_4412@okaxis",
    "Amount": 4500.00,
    "Currency": "INR",
    "Timestamp": "2026-09-11T12:05:22Z",
    "Channel": "MOBILE_UPI"
  }
  ```
- **Algorithmic Failure**: The risk engine cannot see that the user has been on a 4-hour continuous WhatsApp call, has received forged Supreme Court arrest warrants via PDF, or was instructed to type "Home Renovation" into the payment memo. The critical causal signals exist exclusively in the **semantic communication layer**, which is invisible to the core banking switch.
- **Empirical Evidence**: Regulatory reviews by the Reserve Bank of India (RBI Working Group on Digital Lending 2023) and UK PSR Consultation CP23/4 emphasize that over 95% of scam evidence resides in external communication channels that never touch the banking switch.

### 2.4 Cold-Start Failure on Novel Scam Typologies
- **Deficiency**: Supervised machine learning algorithms exhibit catastrophic detection collapse when confronted with novel, emerging scam typologies.
- **Underlying Cause**: Supervised GBDTs and neural networks are trained on historical fraud labels. When criminal syndicates invent a brand-new social engineering narrative (e.g., the sudden emergence of "Digital Arrest" video-call impersonation in 2023–2024, or AI voice-cloned kidnapping lures in 2024–2025), historical training datasets contain zero positive labels for these behavioral patterns.
- **Algorithmic Failure**: The model assigns low risk scores because the features do not correlate with previously learned fraud patterns (which were dominated by stolen card numbers or phishing links). By the time banks accumulate enough labeled scam cases to retrain models (typically 3 to 6 months), syndicates have extracted millions of dollars and shifted to new scripts.
- **Empirical Evidence**: Academic studies on financial concept drift (Jesus et al., NeurIPS 2022 on Feedzai BAF) demonstrate that model performance degrades by up to **42% in PR-AUC** within 90 days if adversarial concept drift is unmitigated.

### 2.5 In-Line Graph Query Scalability Bottlenecks
- **Deficiency**: Centralized transaction scoring systems cannot execute multi-hop graph neural network (GNN) inference or circular path traversals within the synchronous clearance window (<50ms).
- **Underlying Cause**: Graph algorithms require aggregating multi-hop neighborhood features ($k$-hop message passing). On real-world financial graphs containing hundreds of millions of nodes and billions of edges, querying beyond 1-hop incurs exponential latency ($O(b^d)$).
- **Algorithmic Failure**: Real-time scoring is forced to evaluate only immediate 1-hop attributes (e.g., "Has this specific account received money from this sender before?"), leaving organized multi-hop mule networks (where money is routed through 3 intermediate accounts in 30 seconds) completely invisible to the in-line risk engine.
- **Empirical Evidence**: Computer science benchmarks on CARE-GNN, GraphConsis, and PyGOD show that dynamic graph inference across large financial networks requires **350ms to 2,500ms**, far exceeding the 30ms–50ms switch risk budget.

---

## 3. Summary of Dimension A Detection Gaps

```text
                  STRUCTURE OF DIMENSION A DETECTION GAPS
                  
  [GAP-DET-01] Authentic Behavioral Mimicry
  └─► Scams mathematically resemble legitimate high-value life events in tabular space.
  
  [GAP-DET-02] Multi-Stage / Slow-Burn Blindness
  └─► Micro-deposits over weeks establish false baselines, neutralizing velocity rules.
  
  [GAP-DET-03] Communicative Context Vacuum
  └─► Switch receives rigid tabular payloads, completely blind to WhatsApp/call coercion.
  
  [GAP-DET-04] Cold-Start Vulnerability to Novel Typologies
  └─► Supervised models fail on novel scripts due to 3-6 month retraining label lag.
  
  [GAP-DET-05] Real-Time Graph Traversal Barrier
  └─► Sub-50ms switch budgets mathematically prevent multi-hop mule ring detection in-line.
```

These detection deficiencies establish why simply upgrading machine learning models within existing banking pipelines is insufficient: the core information required to detect social engineering does not exist in the tabular data streams currently fed into in-line fraud engines.

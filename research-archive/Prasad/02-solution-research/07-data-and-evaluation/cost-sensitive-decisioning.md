# Cost-Sensitive Decision Making: Asymmetric Loss Matrices and Dynamic Thresholding

---

## 1. Executive Understanding
In standard academic machine learning, classification models typically apply a static decision threshold at probability $\tau = 0.50$. In financial risk engineering, **a static 0.50 threshold is an economic catastrophe**.

The real-world consequences of classification errors are radically asymmetric:
- Letting a **₹1,00,000 extortion scam pass (False Negative)** costs the victim their entire life savings.
- Displaying a **5-second cognitive verification challenge on a legitimate ₹1,00,000 transfer (False Positive)** costs the user 5 seconds of mild cognitive friction.
- Conversely, **hard-blocking an emergency ₹50,000 hospital ICU deposit (False Positive)** can cause irreversible human tragedy and catastrophic institutional liability.

Cost-sensitive decision making is the mathematical framework that **tunes intervention thresholds dynamically based on the exact financial magnitude, error costs, and friction tier of the transaction**.

---

## 2. The Asymmetric Cost Matrix in Payment Risk

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE ASYMMETRIC LOSS MATRIX                                      │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ OUTCOME             │ GROUND TRUTH: SCAM (Y = 1)      │ GROUND TRUTH: LEGITIMATE (Y = 0)  │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **DECISION: ACT**   │ **TRUE POSITIVE (TP)**          │ **FALSE POSITIVE (FP)**           │
│ (Intervene / Halt)  │ Cost = $C_{\text{intervene}} \approx ₹10$│ Cost = Friction Tier Dependent:   │
│                     │ Loss Prevented = $\text{Amount}$│ • Banner: $₹0$ (Negligible)       │
│                     │                                 │ • Challenge: $₹20$ (Mild annoyance│
│                     │                                 │ • Hard Block: $0.20 \times \text{Amt}$ + Churn│
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **DECISION: PASS**  │ **FALSE NEGATIVE (FN)**         │ **TRUE POSITIVE (TN)**            │
│ (Allow Transfer)    │ Cost = $\mathbf{\text{Amount}}$ │ Cost = **₹0.00**                  │
│                     │ + Regulatory Penalty + Trauma   │ Perfect frictionless execution    │
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. The Bayes Risk Decision Theory and Dynamic Thresholds

Under classical decision theory, an optimal agent chooses the action that minimizes **Expected Loss (Bayes Risk)**:

$$\mathbb{E}[\text{Cost}(\text{Act})] = (1 - p) \times C_{\text{FP}} + p \times C_{\text{TP}}$$
$$\mathbb{E}[\text{Cost}(\text{Pass})] = p \times C_{\text{FN}} + (1 - p) \times C_{\text{TN}}$$

Equating the expected costs yields the **Optimal Theoretical Decision Threshold ($\tau^*$)**:

$$\tau^* = \frac{C_{\text{FP}}}{C_{\text{FP}} + C_{\text{FN}}}$$

### The Mathematical Consequence: Threshold Scales with Amount
Because the Cost of False Negative ($C_{\text{FN}}$) is dominated by the transaction magnitude ($C_{\text{FN}} \approx \text{Amount}$), **the optimal threshold $\tau^*$ is a declining function of transaction value**:

$$\tau^*(\text{Amount}) = \frac{C_{\text{FP}}}{C_{\text{FP}} + \text{Amount}}$$

```
                      DYNAMIC DECISION THRESHOLDS BY VALUE
  Threshold (τ)
   ▲
1.0│
   │      τ = 0.65 for ₹200 Chai Transfer
   │      (Avoids annoying user for micro-payments)
0.5│
   │
   │
0.1│                      τ = 0.08 for ₹85,000 Transfer
   │                      (Extremely sensitive; even mild suspicion triggers challenge)
0.0└─────────────────────────────────────────────────────────────►
   ₹100                 ₹5,000               ₹100,000      Amount (INR)
```

1. **Micro-Payments (₹50 - ₹500):** $C_{\text{FN}}$ is trivial (₹50 loss). $C_{\text{FP}}$ (annoying the user during a busy street checkout) exceeds the risk. Threshold $\tau^*$ sits high at **0.65**. The system ignores mild anomalies.
2. **Macro-Payments (₹50,000 - ₹2,00,000):** $C_{\text{FN}}$ is catastrophic (₹50,000+ life-savings loss). Threshold $\tau^*$ drops to **0.08**. Even a slight discrepancy (first-time payee + active phone call) immediately triggers a cognitive challenge.

---

## 4. Multi-Tiered Threshold Partitioning

Instead of a single binary decision boundary (Pass vs. Block), production systems map calibrated risk scores into **tiered intervention envelopes**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      MULTI-TIERED INTERVENTION ENVELOPES                                  │
├─────────────────────┬───────────────────────┬─────────────────────────────────────────────┤
│ RISK SCORE RANGE    │ SELECTED INTERVENTION │ OPERATIONAL USER EXPERIENCE                 │
├─────────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ $P(\text{Scam}) < 0.15$│ **Tier 0: Fast Path** │ Invisible execution directly to MPIN pad.   │
├─────────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ $0.15 \le P < 0.40$ │ **Tier 1: Salient**   │ High-contrast banner highlighting the legal │
│                     │ **Advisory**          │ name from CBS. No mandatory user input.     │
├─────────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ $0.40 \le P < 0.75$ │ **Tier 2: Cognitive** │ Interlocks "Pay" button; requires typing    │
│                     │ **Challenge**         │ legal name or answering intent prompt.      │
├─────────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ $P \ge 0.75$        │ **Tier 3: Cooling-Off**│ 15-minute mandatory delay on execution;     │
│                     │ **or Call Interlock** │ requires hanging up active phone call.      │
├─────────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ Hard Blacklist / Mal│ **Tier 4: Hard Block**│ Immediate termination with reason code `U16`│
└─────────────────────┴───────────────────────┴─────────────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

| Dimension | Cost-Sensitive Decision Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Static Thresholds** | **Fundamentally flawed in financial payments.** | Reject static 0.5 thresholds; enforce **amount-weighted dynamic thresholding**. |
| **Friction Design** | **Must match intervention cost to risk severity.** | Never use hard blocks for low-confidence warnings; use **graded cognitive friction**. |
| **High-Value Protection** | **High amounts demand aggressive low thresholds.** | Lower the bar for cognitive challenges as transaction ticket sizes cross ₹25,000. |

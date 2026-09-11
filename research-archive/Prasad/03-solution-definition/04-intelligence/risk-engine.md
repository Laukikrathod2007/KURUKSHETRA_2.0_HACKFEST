# Risk Engine: The Dual-Path Evaluation Pipeline and Mathematical Scoring Formulation

---

## 1. Executive Understanding
The Risk Engine is the quantitative and decision-theoretic core of GuardianPay. It is responsible for transforming raw telemetry, tabular transaction metadata, semantic language embeddings, and agentic hypothesis assessments into a **calibrated scam probability $P(\text{Scam}) \in [0, 1]$ and an actionable friction tier**.

To survive national-scale payment throughput, the Risk Engine operates as a **Dual-Path Decoupled Architecture**, executing low-latency tabular scoring in $<10\text{ms}$ and selectively invoking deep contextual reasoning during the human Pre-PIN review dwell window.

---

## 2. Mathematical Risk Formulation and Fusion

```
                       THE DUAL-PATH RISK PIPELINE
  [Raw Telemetry & Tx Data]
             │
             ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ HOT PATH (Sub-10ms): Tabular GBDT Scoring Engine                           │
  │ • LightGBM Tree Ensemble: 150 trees, max depth 6                            │
  │ • Evaluates 25+ features: Amount Z-score, Payee Age, Call Flag, Dwell       │
  │ • Outputs Calibrated Base Probability: $P_{\text{GBDT}} \in [0, 1]$         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼ (Risk $P_{\text{GBDT}} < 0.20$)               ▼ (Risk $0.20 \le P_{\text{GBDT}} \le 0.85$)
  ┌─────────────────────────────┐                 ┌─────────────────────────────────────────────┐
  │ FAST-PATH PASS              │                 │ WARM PATH (1.5s - 2.2s Dwell Window):       │
  │ • Final Risk = $P_{\text{GBD│                 │ 1. Semantic Clash Score: $S_{\text{clash}}  │
  │ • Directive: TIER_0_PASS    │                 │ 2. Agent Hypothesis Weight: $W_{\text{agent}}│
  └─────────────────────────────┘                 └──────────────────────┬──────────────────────┘
                                                                         │
                                                                         ▼
                                                  ┌─────────────────────────────────────────────┐
                                                  │ MULTI-SIGNAL FUSED SCORING FORMULATION      │
                                                  │ $P_{\text{fused}} = \alpha P_{\text{GBDT}}  │
                                                  │   + \beta S_{\text{clash}}                  │
                                                  │   + \gamma W_{\text{agent}}$                │
                                                  └──────────────────────┬──────────────────────┘
                                                                         │
                                                                         ▼
                                                  ┌─────────────────────────────────────────────┐
                                                  │ DYNAMIC AMOUNT-SCALED POLICY ENFORCEMENT    │
                                                  │ • Evaluates $P_{\text{fused}}$ vs $\tau^*(A)│
                                                  │ • Emits Signed Directive: TIER_1, 2, or 3   │
                                                  └─────────────────────────────────────────────┘
```

### The Multi-Signal Fusion Equation
For transactions escalated to the warm path, the fused probability of an active scam is defined by:
$$P_{\text{fused}} = \alpha \cdot P_{\text{GBDT}} + \beta \cdot S_{\text{clash}} + \gamma \cdot W_{\text{agent}}$$

Where:
- $P_{\text{GBDT}} \in [0, 1]$: Calibrated tabular risk probability from the hot path.
- $S_{\text{clash}} \in [0, 1]$: Normalized semantic inconsistency score between entered purpose and resolved CBS legal entity.
- $W_{\text{agent}} \in [0, 1]$: Agentic posterior confidence derived from diagnostic tool queries.
- **Calibrated Weight Parameters:**
  $$\alpha = 0.35, \quad \beta = 0.45, \quad \gamma = 0.20 \quad (\alpha + \beta + \gamma = 1.00)$$
  *Note:* The Semantic Clash score ($\beta = 0.45$) holds the highest weight because core banking legal identity mismatches represent the single most unforgeable indicator of impersonation fraud.

---

## 3. Tabular Feature Store Architecture (Hot Path)

The hot path evaluates 25 engineered features assembled in $<1\text{ms}$ from in-memory Redis caches:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           HOT-PATH TABULAR FEATURE MATRIX                                 │
├─────────────────────┬───────────────────┬──────────────┬──────────────────────────────────┤
│ FEATURE NAME        │ TYPE              │ SOURCE       │ DEFINITION / NORMALIZATION       │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `amount_log_zscore` │ Float ($-3 to +8$)│ Redis / Calc │ $\frac{\ln(A) - \mu}{\sigma}$ (90d spend baseline│
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `is_call_active`    │ Boolean (0 or 1)  │ Native SDK   │ `CALL_STATE_OFFHOOK` at payment  │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `is_clipboard_paste`│ Boolean (0 or 1)  │ Native SDK   │ Paste latency $< 150\text{ms}$   │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `screen_dwell_ratio`│ Float ($0 to 10$) │ Native SDK   │ $\frac{\text{Dwell}}{\text{Normal Dwell}}$│
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `payee_in_velocity` │ Integer           │ Redis Feature│ Inbound tx count in last 1 hour  │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `payee_first_seen`  │ Integer (Days)    │ Redis Feature│ Days since VPA first recorded    │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `is_typosquat_vpa`  │ Boolean (0 or 1)  │ Regex C++    │ Levenshtein hit on bank keywords │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ `hour_of_day_sin`   │ Float ($-1 to +1$)│ Timestamp    │ Circular temporal encoding       │
└─────────────────────┴───────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 4. Probability Calibration and Explainability (TreeSHAP)

### 1. Platt Scaling (Logistic Calibration)
Raw margin outputs $z(x)$ from gradient boosted decision trees are uncalibrated and cannot be interpreted as true statistical probabilities. We apply post-hoc sigmoid calibration:
$$P(\text{Scam} \,|\, x) = \frac{1}{1 + \exp(A \cdot z(x) + B)}$$
Parameters $A$ and $B$ are fitted using Maximum Likelihood Estimation on a held-out validation cohort.

### 2. Deterministic Feature Attribution (TreeSHAP)
To satisfy RBI Model Governance guidelines, the hot path computes exact Shapley values in $<1\text{ms}$ using C++ TreeSHAP:
$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} [f(S \cup \{i\}) - f(S)]$$
The engine extracts the top three positive $\phi_i$ features and maps them directly to standardized regulatory reason codes:
- $\phi(\text{is\_call\_active}) > 0.40 \implies \text{Code: } \texttt{ACTIVE\_CALL\_COERCION}$
- $\phi(\text{amount\_log\_zscore}) > 0.35 \implies \text{Code: } \texttt{TICKET\_SIZE\_SPIKE}$

---

## 5. Epistemic Assessment for PS09

The Risk Engine couples **ultra-low-latency tabular GBDT inference on the hot path** with **high-context semantic and agentic reasoning on the warm path**, guaranteeing both national payment switch compliance and deep protection against deceptive fraud.

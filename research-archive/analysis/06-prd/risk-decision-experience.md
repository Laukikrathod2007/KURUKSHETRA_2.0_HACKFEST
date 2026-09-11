# Risk & Decision Experience Framework

## 1. Executive Summary & Epistemic Decision Philosophy

In high-velocity payment fraud defense, an algorithm's output cannot simply be a raw scalar floating-point number (e.g., `0.7842`). A raw number provides zero actionable insight to a consumer, gives no regulatory defensibility under fair banking laws, and offers no operational directive to downstream core banking switches.

The *Agentic Guardian* implements an **Epistemic Decisioning Framework** that couples statistical risk scoring with explicit uncertainty bounds, social engineering typology classification, and deterministic operational directives.

---

## 2. Decision State Model

Every evaluated payment transitions through a deterministic state machine:

```text
                                DECISION STATE MACHINE
                                
       [State: INTAKE] ──────► Ingests telemetry, history, counterparty
              │
       [State: EVALUATING] ──► Sub-45ms ML inference & uncertainty scoring
              │
              ├─────────────────┬─────────────────┬─────────────────┐
              ▼                 ▼                 ▼                 ▼
        [State: ALLOW]    [State: INFORM]  [State: INTERVENE] [State: HOLD]
        Direct to Switch  Ambient Advisory Pre-PIN Challenge  Cooling-Off
              │                 │                 │                 │
              │                 │                 ├────────┐        │
              │                 │                 ▼        ▼        │
              │                 │             Aborted  Confirmed    │
              │                 │                │         │        │
              └─────────────────┴────────────────┼─────────┴────────┘
                                                 │
                                                 ▼
                                        [State: SETTLED]
                                                 │
                                                 ▼
                                        [State: AUDITED]
```

### 2.1 State Definitions & Transition Criteria

| Operational State | Risk Bounds ($R$) | Epistemic Uncertainty ($\sigma$) | Permitted Operational Action | Reversibility |
| :--- | :--- | :--- | :--- | :--- |
| **STATE-ALLOW** | $R < 0.30$ | Any | Clear transaction immediately to payment switch. | Irreversible once cleared |
| **STATE-INFORM** | $0.30 \le R < 0.65$ | Any | Display non-blocking contextual counterparty advisory. | Fully reversible |
| **STATE-INTERVENE** | $0.65 \le R < 0.85$ | $\sigma \le 0.35$ (High Confidence) | Inject pre-PIN dynamic cognitive de-biasing challenge. | Fully user-reversible |
| **STATE-HOLD** | $R \ge 0.85$ | $\sigma \le 0.25$ (Extreme Confidence) | Sequester funds in sender account; enforce cooling-off. | Reversible by user/analyst |

---

## 3. Epistemic Uncertainty Handling

A central breakthrough of the Guardian's decision engine is the explicit separation between **Model Risk ($R$)** and **Epistemic Uncertainty ($\sigma$)**:
- **High Risk + Low Uncertainty ($R \ge 0.70, \sigma < 0.25$)**: The system has rich historical baselines and clear affirmative signals of scam coercion (active call + mule recipient + hesitation). $\rightarrow$ **Trigger Level 3 / Level 4 Intervention**.
- **High Risk + High Uncertainty ($R \ge 0.70, \sigma \ge 0.35$)**: The system flags an anomaly, but the anomaly is driven by *missing features* or a *newly opened sender account* rather than confirmed fraud signals.
  - *Safety Boundary Policy*: The system is **categorically forbidden** from enforcing a Level 4 Hold under high uncertainty (`REQ-DEC-002`, `REQ-SAF-002`).
  - *Automated Downgrade*: The directive is automatically downgraded to **Level 2 (Inform)** or non-disruptive micro-friction, preventing customer insult cascades.

---

## 4. Escalation and Override Governance

### 4.1 User-Initiated Escalation & Redress
When a transaction is placed in `STATE-HOLD` or challenged in `STATE-INTERVENE`, the user has three structured recourse options:
1. **Self-Service Verification**: Completing the interactive cognitive challenge unlocks the PIN pad directly for Level 3 events (`REQ-ERR-003`).
2. **Emergency Life-Safety Bypass**: Single-tap bypass for verified hospital/utility expenses instantly clears the payment (`REQ-SAF-001`).
3. **Formal In-App Redress Request**: Dedicated 1-click challenge button triggers expedited review by a human SOC investigator with a guaranteed $<60\text{m}$ SLA (`REQ-SAF-004`).

### 4.2 Bank Staff Override Protocols (Dual-Control Governance)
Bank customer support representatives and branch tellers frequently face social engineering from coerced victims demanding that security blocks be removed. To eliminate insider threats and staff manipulation:
- **Single-Analyst Limit**: A single analyst can only override low-value holds ($< ₹25,000$ or $\$500$).
- **Mandatory Dual-Control**: Any override on a Level 4 Hold exceeding this threshold requires **two independent authorized staff signatures** (`REQ-HITL-003`).
- **Cryptographic Audit**: Overrides log employee ID, IP, supervisor authorization token, justification narrative, and timestamp directly to immutable WORM storage (`REQ-OBS-003`).

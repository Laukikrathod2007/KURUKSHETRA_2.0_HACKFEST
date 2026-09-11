# Architectural Trade-Offs & Compromise Analysis

## 1. Trade-Off Philosophy

Software architecture is not the pursuit of an imaginary, compromise-free ideal; it is the **conscious, explicit management of conflicting constraints**. Every architectural choice that enhances one quality attribute inevitably imposes penalties on another.

Kurukshetra makes its technical trade-offs completely explicit across five critical system dilemmas:

---

## 2. Exhaustive Architectural Decision Trade-Offs

### Trade-Off 1: In-Line Model Engine: LightGBM (GBDT) vs. Generative LLMs

```text
Decision:           Deploy LightGBM GBDT compiled to ONNX runtime for in-line synchronous pre-clearance scoring.
Alternatives:       Cloud LLM APIs (GPT-4o, Claude 3.5), Local SLM (Llama 3 8B on GPU), Deep Neural Network (MLP).
Chosen Approach:    LightGBM running on x86_64 AVX2 CPUs via Microsoft ONNX Runtime C++.
Why:                Hard real-time payment clearance requires P99 <= 45ms. Cloud LLMs take 1,500ms–4,000ms and introduce non-deterministic hallucinations.
Benefits:           - Deterministic 4.5ms inference.
                    - Exact, non-approximated TreeSHAP attributions.
                    - Zero GPU hardware dependency; commodity infrastructure.
Costs:              Requires explicit manual feature engineering (114 tabular features) rather than raw semantic comprehension.
Risks:              May require weekly retraining to catch novel semantic phrasing in payment remarks.
Rejected Alt:       Cloud LLMs: Catastrophic latency failure (> 30x over budget) and severe regulatory anti-hallucination non-compliance.
```

---

### Trade-Off 2: Intervention Locus: Client UI Interceptor vs. Core Banking Switch Hold

```text
Decision:           Intercept transaction in the mobile client SDK *prior to PIN/biometric entry*.
Alternatives:       Backend Payment Switch Hold (quarantining transaction after PIN entry on core rail).
Chosen Approach:    Client SDK hooks "Proceed" button, suppresses PIN pad, renders 5-second dwell gate.
Why:                Once a victim enters their authentic PIN, cognitive commitment cements, and payment engines immediately initiate irrevocable interbank clearing messages. Breaking the cognitive trance requires intervention *before* the commitment action.
Benefits:           - Preserves victim autonomy and self-realization.
                    - Zero risk of core interbank ledger desynchronization or clearing penalties.
                    - Allows rich, interactive, multi-modal counter-coaching modals.
Costs:              Requires embedding SDK inside client mobile applications; client-side tamper-proofing required.
Risks:              Rooted devices or malicious clients could attempt to bypass the SDK UI overlay.
Mitigation:         Hardware attestation (Play Integrity / App Attest) + backend gateway drops payment if SDK signature is absent.
```

---

### Trade-Off 3: Explainability Paradigm: Exact Causal TreeSHAP vs. Free-Form Generative Narratives

```text
Decision:           Base all explanations and regulatory dossiers strictly on exact mathematical Shapley values.
Alternatives:       Free-form LLM narrative generation summarizing transaction context.
Chosen Approach:    Mathematical TreeSHAP attribution mapped to pre-certified regulatory reason templates.
Why:                Under FCRA, GDPR Art. 22, and AML regulations, financial adverse action notices cannot be based on plausible hallucinated stories. They must reflect the true mathematical signals that altered the decision boundary.
Benefits:           - 100% mathematical fidelity; zero hallucination.
                    - Legal compliance with adverse action notification laws.
                    - Computationally instantaneous (< 1.2ms).
Costs:              Explanations are more structured and less conversational than an unconstrained chatbot.
Risks:              Naive users may find mathematical feature attributions confusing if not properly translated by UI templates.
Mitigation:         Dual-surface projection: technical SHAP waterfalls for SOC analysts; simplified empathic guidance for consumers.
```

---

### Trade-Off 4: Decision Certainty: Epistemic Uncertainty Clamping vs. Raw Thresholding

```text
Decision:           Enforce conformal prediction calibration and clamp decisions when epistemic uncertainty sigma > 0.35.
Alternatives:       Raw scalar thresholding (If Score >= 0.85 -> Freeze Account, regardless of confidence).
Chosen Approach:    Two-dimensional decision boundary: Calibrated Risk Probability P_scam combined with Epistemic Uncertainty sigma.
Why:                A model encountering unfamiliar feature distributions (e.g. an unusual new payment rail or international currency) might output a high score purely due to model ignorance rather than fraud. Freezing legitimate customer accounts destroys bank NPS and induces severe regulatory penalties.
Benefits:           - Prevents catastrophic false-positive account freeze cascades.
                    - Maintains customer insult ratio <= 10:1.
                    - Directs genuinely ambiguous cases to educational step-up verification rather than punitive blocks.
Costs:              Some sophisticated, novel scam typologies operating in high-uncertainty spaces may only receive a step-up prompt rather than an outright freeze.
Risks:              Scammers deliberately engineering out-of-distribution feature combinations to force uncertainty downgrades.
Mitigation:         Step-up verification still halts automated drain; high uncertainty events are immediately flagged for human SOC review.
```

---

### Trade-Off 5: Telemetry Retention: Ephemeral Volatile Buffering vs. Raw Biometric Data Lakes

```text
Decision:           Process behavioral biometrics (touch dynamics, keystroke intervals) in transient RAM and zeroize immediately; store only scalar summaries.
Alternatives:       Persisting full raw continuous sensor time-series to S3/HDFS for extensive offline research.
Chosen Approach:    Strict ephemeral buffering with instantaneous `memset(0)` memory zeroization; zero raw biometric persistence.
Why:                Storing raw continuous physical touch and motion data transforms the bank into a massive biometric surveillance liability under GDPR Art. 9, exposing the institution to massive data breach penalties.
Benefits:           - Eliminates GDPR Special Category biometric legal exposure.
                    - Reduces storage costs by 98%.
                    - Guarantees customer privacy while still extracting necessary psychological stress signals.
Costs:              Impossible to retrain future models on raw physical sensor waveforms; models must be trained on engineered summary metrics.
Risks:              Missing subtle, un-engineered micro-gestures that might have been discoverable with deep raw sequence models.
Mitigation:         The 114 engineered summary metrics capture > 95% of actionable psychological coercion variance.
```

# Observability Architecture: Metrics, Distributed Tracing, and Model Telemetry

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **Core Requirements of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Transaction audit history.*
- *• Real-time security reasoning... and safe autonomous decision-making.*

In distributed financial infrastructure, **you cannot defend what you cannot observe**. When transactions execute in single-digit milliseconds, real-time telemetry is the only mechanism that allows fraud operations engineers to detect outages, monitor model accuracy, track scam de-escalation rates, and identify adversarial attacks before widespread financial harm occurs.

This document defines the **Full-Stack Observability Framework for GuardianPay**, spanning OpenTelemetry metrics, distributed traces, structured logs, and real-time model health monitoring.

---

## 2. The Core Metrics Hierarchy (Prometheus / OpenTelemetry)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION METRICS REGISTRY                                  │
├───────────────────────────────┬──────────────┬──────────────┬─────────────────────────────┤
│ METRIC IDENTIFIER             │ TYPE         │ LABELS       │ OPERATIONAL PURPOSE         │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_hot_latency_ms`     │ Histogram    │ status, tier │ Tracks sub-15ms SLA compliance│
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_warm_latency_ms`    │ Histogram    │ agent_status │ Tracks 1,800ms agent budget │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_evaluations_total`  │ Counter      │ tier, action │ Volume processed per tier   │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_challenge_outcomes` │ Counter      │ outcome, type│ Measures scam aborts vs.    │
│                               │              │              │ legitimate user completions │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_circuit_breaker`    │ Gauge        │ state, region│ 0=Closed, 1=Half, 2=Open    │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_prompt_injections`  │ Counter      │ pattern_type │ Tracks adversarial attacks  │
├───────────────────────────────┼──────────────┼──────────────┼─────────────────────────────┤
│ `guardian_model_psi_drift`    │ Gauge        │ feature_name │ Tracks feature distribution │
└───────────────────────────────┴──────────────┴──────────────┴─────────────────────────────┘
```

---

## 3. Distributed Tracing Architecture (OpenTelemetry / Jaeger)

Every payment evaluation is assigned an immutable OpenTelemetry trace context propagated across HTTP/2 headers:

```
                      DISTRIBUTED TRACE TIMELINE (SPAN MAP)
  [Trace: eval_018f4a21] Total Duration: 14.2ms (Clear Pass)
  ├─► [Span 1: client_sdk.sensor_extraction] ──────────────── 1.2ms
  ├─► [Span 2: network.client_to_gateway_mTLS] ───────────── 4.8ms
  ├─► [Span 3: gateway.redis_feature_fetch] ───────────────── 0.8ms
  ├─► [Span 4: hot_scorer.lightgbm_inference] ─────────────── 4.1ms
  ├─► [Span 5: gateway.ecdsa_signature_attestation] ──────── 1.1ms
  └─► [Span 6: network.gateway_to_client_response] ────────── 2.2ms
```

- **Forensic Visibility:** If a transaction exceeds the 15ms latency SLA, distributed traces immediately expose whether the bottleneck was network jitter, Redis connection pooling, or CPU contention.

---

## 4. Real-Time Fraud Operations Dashboard (Streamlit / Grafana)

The prototype and production systems expose an administrative monitoring console rendering real-time operational telemetry:
1. **Live Transaction Firehose:** Streaming feed showing transactions categorized by risk tier (`T0_PASS`, `T1_ADVISORY`, `T2_CHALLENGE`, `T3_INTERLOCK`, `T5_BLOCK`).
2. **Scam Interception Gauge:** Real-time counter of total financial value protected (₹ INR saved from confirmed scam vectors).
3. **De-escalation Funnel:** Tracks user behavior on Tier 2 Cognitive Challenges:
   - Legitimate Users Completing Challenge: Target $\ge 92\%$.
   - Coerced Victims Aborting Payment: Target $\ge 60\%$.
4. **Adversarial Alert Banner:** Flashes when prompt injection attempts or high-velocity mule spikes are detected.

---

## 5. Epistemic Assessment for PS09

The Observability Architecture provides **complete transparency into GuardianPay's real-time security reasoning**, satisfying the evaluation criteria of `PROBLEM_STATEMENT.md` by making every step of the decision pipeline measurable, auditable, and alertable.

# Failure Handling and Resiliency: Circuit Breakers, Fallback Matrices, and Graceful Degradation

---

## 1. Executive Understanding
In mission-critical retail payments, **the security system must never cause an outage of the payment rails**. If an external AI API times out, or if an edge gateway experiences a regional network partition, the payment app cannot freeze or crash.

This document formalizes the **Failure Handling Matrix and Circuit Breaker Protocols** for GuardianPay, specifying the exact operational behavior for every failure scenario across the computational stack.

---

## 2. The Comprehensive Failure Handling Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     SYSTEM FAILURE HANDLING MATRIX                                               │
├─────────────────────┬───────────────────┬─────────────────────────────────────┬──────────────────────────────────┤
│ FAILURE SCENARIO    │ DETECTION TRIGGER │ OPERATIONAL FALLBACK ACTION         │ IMPACT ON TRANSACTION            │
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **1. Cloud Gateway  │ Network timeout   │ • Envoy circuit breaker trips OPEN  │ • Low value (< ₹5,000): PASS     │
│    Timeout (>120ms)│ or HTTP 5xx error │ • Client falls back to Local Rules  │ • High value: Local Warning Modal│
│                     │ rate > 5%         │ • Evaluates AnyDesk & SQLite cache  │ • Zero checkout freeze           │
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **2. Warm Agent     │ Execution timer   │ • Thread cancellation signal sent   │ • Falls back to Hot-Path GBDT    │
│    Timeout (>1,800ms│ exceeds 1,800ms   │ • Agent investigation aborted       │   base score                     │
│                     │                   │ • Logs `AGENT_TIMEOUT` to audit sink│ • Zero switch timeout (`U30`)    │
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **3. Cloud LLM /    │ Cloud provider API│ • Gateway bypasses agent loop       │ • Evaluates Hot GBDT + CBS Name  │
│    SLM API Outage** │ returns 500/503   │ • Evaluates deterministic matrix    │   Clash score deterministically  │
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **4. `RespValAdd`   │ External banking  │ • Sets `cbs_name_status = UNKNOWN`  │ • Assigns Dempster-Shafer mass   │
│    Switch Timeout** │ query > 200ms     │ • Bypasses semantic clash check     │   to Uncertainty ($\Theta$)      │
│                     │                   │                                     │ • Triggers Tier 1 Advisory Banner│
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **5. Mobile Sensor  │ Hardware driver   │ • Exception caught in coroutine     │ • Returns safe default flag      │
│    Driver Crash**   │ throws exception  │   isolated bulkhead                 │   (`is_call_active = FALSE`)     │
│                     │                   │ • Prevents app ANR crash            │ • Transaction proceeds normally  │
├─────────────────────┼───────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
│ **6. Feature Store  │ Redis connection  │ • Worker switches to local in-memory│ • Uses cached user baselines;    │
│    Disconnection**  │ pool exhausted    │   read replica                      │   zero blocking delay            │
└─────────────────────┴───────────────────┴─────────────────────────────────────┴──────────────────────────────────┘
```

---

## 3. The Circuit Breaker Protocol (Resilience4j / Envoy)

```
                       CIRCUIT BREAKER STATE MACHINE
                              [Normal Operation]
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │    STATE: CLOSED    │
                           │ Traffic flows to AI │
                           └──────────┬──────────┘
                                      │
                     Error Rate > 5% OR Latency > 120ms
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │     STATE: OPEN     │
                           │ Bypasses cloud AI;  │
                           │ Local rules act     │
                           └──────────┬──────────┘
                                      │
                               After 15 seconds
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   STATE: HALF-OPEN  │
                           │ Tests 5% of traffic │
                           └──────────┬──────────┘
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼ (Success Rate > 98%)                  ▼ (Errors Persist)
         [Reset to CLOSED]                               [Return to OPEN]
```

---

## 4. Fail-Open vs. Fail-Closed Policy by Financial Magnitude

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      FAIL-SAFE POLICY BY FINANCIAL MAGNITUDE                              │
├─────────────────────┬──────────────┬──────────────────────────────────────────────────────┤
│ TRANSACTION AMOUNT  │ FALLBACK     │ OPERATIONAL JUSTIFICATION                            │
├─────────────────────┼──────────────┼──────────────────────────────────────────────────────┤
│ **< ₹5,000**        │ **FAIL-OPEN**│ Prioritizes retail commerce velocity. The economic   │
│ (Routine Commerce)  │ (Allow)      │ cost of blocking safe commerce exceeds fraud risk.   │
├─────────────────────┼──────────────┼──────────────────────────────────────────────────────┤
│ **₹5,000 - ₹25,000**│ **LOCAL      │ Renders a non-blocking on-device advisory banner:    │
│ (Elevated Commerce) │ ADVISORY**   │ *"Security service offline. Ensure you know payee."* │
├─────────────────────┼──────────────┼──────────────────────────────────────────────────────┤
│ **> ₹25,000**       │ **LOCAL      │ Disables fast-path; presents local confirmation modal│
│ (Life-Savings Zone) │ CONFIRMATION│ requiring explicit user checkbox verification.       │
└─────────────────────┴──────────────┴──────────────────────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

The Failure Handling specification guarantees that GuardianPay is **resilient to distributed failures**: the system fails gracefully, preserves national payment continuity, and adapts its fallback posture dynamically based on financial exposure.

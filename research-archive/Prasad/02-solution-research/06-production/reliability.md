# Reliability and Fault Tolerance: Fail-Open vs. Fail-Safe, Circuit Breakers, and High Availability

---

## 1. Executive Understanding
In payment security engineering, **the security system must never become an availability liability**. A fraud detection engine that exhibits 99.9% detection accuracy but causes intermittent gateway timeouts or crashes the payment application is an architectural failure.

Payment switches (NPCI, CBS) operate under strict **High Availability (HA) mandates: 99.999% uptime ("Five Nines")**, equating to less than 5.26 minutes of unscheduled downtime per calendar year. Therefore, every component of **PS09** must be designed with **autonomous fault isolation, bounded recovery, and clear fail-open versus fail-safe failure semantics**.

---

## 2. The Core Dilemma: Fail-Open vs. Fail-Closed in Payments

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE SYSTEMIC FAILURE MODES                                      │
├─────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ FAILURE MODE        │ BEHAVIOR & REAL-WORLD IMPLICATIONS                                  │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **FAIL-CLOSED**     │ • **Behavior:** If fraud service times out or crashes, DECLINE tx.  │
│ (Security-First)    │ • **Consequence:** Total economic paralysis. If the cloud AI gateway│
│                     │   experiences a 60-second outage, millions of citizens cannot pay   │
│                     │   for groceries, fuel, or emergency hospital bills.                 │
│                     │ • **Verdict: UNACCEPTABLE IN RETAIL PAYMENTS.**                     │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **FAIL-OPEN**       │ • **Behavior:** If fraud service times out or crashes, ALLOW tx.    │
│ (Availability-First)│ • **Consequence:** Attackers can execute denial-of-service (DoS) on │
│                     │   the fraud API to force the system into bypass mode, executing     │
│                     │   fraud unhindered during the outage.                               │
│                     │ • **Verdict: DANGEROUS IF UNGUARDED.**                              │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **TIERED DEGRADED** │ • **Behavior:** If cloud service fails, fall back to **ON-DEVICE    │
│ (Production Standard│   DETERMINISTIC HEURISTICS & LOCAL CACHE**. Hard limits enforced;   │
│  for PS09)**        │   high-risk transfers delayed; ordinary low-value transfers passed. │
│                     │ • **Verdict: THE ONLY DEFENSIBLE PRODUCTION ARCHITECTURE.**         │
└─────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## 3. High-Resilience Architectural Patterns

```
                 HIGH-RESILIENCE DEGRADATION WATERFALL
                               [Payment Initiated]
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ LEVEL 0: LOCAL ON-DEVICE INTEGRITY SHIELD │
                  │ • AnyDesk / Remote Access Package check   │
                  │ • Local SQLite / MMAP Known Mule Cache    │
                  │ (Zero network dependency; runs in < 2ms)  │
                  └─────────────────────┬─────────────────────┘
                                        │ [Passed Level 0]
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ LEVEL 1: CLOUD RISK GATEWAY CALL          │
                  │ • Latency Budget: 80 ms                   │
                  │ • Circuit Breaker: Timeout at 120 ms      │
                  └─────────────────────┬─────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                 [Call Succeeds]               [Call Times Out / Errors]
                         │                             │
                         ▼                             ▼
               [Full Multi-Signal]             [TRIGGER CIRCUIT BREAKER]
               [Evidence Fusion  ]             [Graceful Fallback Mode ]
                                                       │
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │ LEVEL 2: DEGRADED LOCAL FALLBACK│
                                      │ • Enforce static amount limits  │
                                      │ • Block if Active Phone Call    │
                                      │ • Allow low-risk transactions   │
                                      │ • Log telemetry for cold-path   │
                                      └─────────────────────────────────┘
```

### 1. Circuit Breaker Mechanics (Envoy / Resilience4j)
To prevent a slow backend service (e.g., an overloaded LLM endpoint) from exhausting application thread pools:
- **Metrics Polling:** Monitor rolling request success rate over 100-request sliding windows.
- **Trip Condition:** If 50% of requests exceed 150ms or return HTTP 5xx errors, the circuit trips to **OPEN**.
- **Open State Behavior:** The client immediately short-circuits, invoking the local fallback engine in 0ms without attempting the network socket call.
- **Half-Open Recovery:** After 15 seconds, test the cloud gateway with 5% of traffic. If responses return within SLA (<50ms), reset circuit to **CLOSED**.

### 2. Bulkheading and Process Isolation
On mobile operating systems (Android/iOS):
- Sensor collection (accelerometer, telephony listeners) must run in **isolated worker coroutines**.
- If the gyroscope sensor driver hangs or throws an unexpected hardware exception, the exception is caught within the isolated coroutine bulkhead, preventing an app crash (ANR - Application Not Responding).

---

## 4. Disaster Recovery and Data Localization (RBI Compliance)

Under **RBI Directive on Storage of Payment System Data (April 2018)**:
- All payment system data, transactional logs, and user security telemetry must be stored **exclusively in servers physically located within India**.
- **Active-Active Multi-Region Deployment:**
  - Production Primary: Mumbai Region (Data Center A)
  - Production Secondary: Hyderabad Region (Data Center B)
  - Cross-region replication via high-speed dedicated fiber links with synchronization lag $< 5\text{ms}$.
  - In the event of a catastrophic regional grid failure in Mumbai, the DNS traffic manager shifts all API routing to Hyderabad within 3 seconds.

---

## 5. Epistemic Assessment for PS09

| Dimension | Reliability Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **System Outages** | **Network partitions and cloud failures are inevitable.** | The Guardian must be capable of **autonomous offline defense** using client-side rules and local caches. |
| **Fail-Open Policy** | **Unconditional fail-closed is prohibited in consumer payments.** | Implement **tiered degraded fallback**: low-value payments pass; high-value unverified transfers face local friction. |
| **Infrastructure SLA** | **Must match 99.999% standard of UPI switch.** | All server-side components must be stateless, horizontally redundant, and protected by circuit breakers. |

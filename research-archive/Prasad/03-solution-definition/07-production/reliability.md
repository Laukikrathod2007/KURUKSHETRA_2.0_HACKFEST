# Reliability and High Availability: Five-Nines Architecture, Disaster Recovery, and Bulkheading

---

## 1. Executive Understanding & Alignment with Problem Statement

Under **What a Strong Solution Demonstrates (`PROBLEM_STATEMENT.md`)**:
- *• Safe autonomous decision-making... fraud prevention.*

In digital banking infrastructure, **system availability is a statutory mandate**. Under Reserve Bank of India (RBI) prudential guidelines, critical payment processing systems must guarantee **Five Nines availability (99.999%)**, permitting no more than 5.26 minutes of unscheduled downtime across an entire calendar year.

This document specifies the **Reliability Engineering Architecture for GuardianPay**, establishing the active-active multi-region topology, circuit breaker parameters, thread bulkheading, and disaster recovery recovery objectives.

---

## 2. Active-Active Geographically Redundant Topology

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      ACTIVE-ACTIVE DUAL-REGION INFRASTRUCTURE                             │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **REGION A: MUMBAI (PRIMARY ACTIVE DC)**                                                  │
│ • AWS Route 53 Anycast DNS routing 50% of traffic to Mumbai Ingress NLB                   │
│ • Kubernetes Production Cluster running 40 Go Gateways and 12 Triton GPU Nodes            │
│ • Synchronous cross-AZ replication across 3 Availability Zones                            │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **REGION B: HYDERABAD (SECONDARY ACTIVE DC)**                                             │
│ • AWS Route 53 Anycast DNS routing 50% of traffic to Hyderabad Ingress NLB                │
│ • Identical active capacity handling 50% of national volume                               │
│ • Dedicated high-speed inter-region fiber connection with latency < 12ms                  │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **AUTOMATED FAILOVER SLA**                                                                │
│ • Health checks poll regional gateway endpoints every 1,000ms                             │
│ • If 3 consecutive health checks fail, Route 53 shifts 100% of traffic in < 3 seconds     │
│ • RTO (Recovery Time Objective): < 3.0 Seconds | RPO (Recovery Point Objective): 0 Seconds│
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Circuit Breaker & Thread Bulkheading Architecture

To prevent a slow downstream dependency (e.g. an external utility biller API or an overloaded GPU worker) from exhausting system threads:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THREAD BULKHEAD PARTITIONING                                    │
├─────────────────────┬───────────────────┬──────────────┬──────────────────────────────────┤
│ SUBSYSTEM POOL      │ DEDICATED THREADS │ QUEUE CEILING│ ISOLATION POLICY                 │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **Hot-Path Scorer** │ 128 Dedicated CPU │ 2,000 reqs   │ Completely isolated from warm    │
│                     │ Cores (Go/C++)    │              │ agent; zero thread starvation    │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **Warm Agent Loop** │ 32 Worker Threads │ 250 reqs     │ Bounded queue; drops to fallback │
│                     │ per GPU Pod       │              │ if queue depth exceeds 250       │
├─────────────────────┼───────────────────┼──────────────┼──────────────────────────────────┤
│ **External APIs**   │ 16 Async Coroutine│ 100 reqs     │ Wrapped in 150ms timeout; cannot │
│ (`RespValAdd`/BBPS) │ Sockets           │              │ exhaust gateway memory           │
└─────────────────────┴───────────────────┴──────────────┴──────────────────────────────────┘
```

---

## 4. Disaster Recovery Targets (RTO and RPO)

- **Recovery Time Objective (RTO):** $\le 3.0\text{ Seconds}$. If an entire data center region suffers a catastrophic grid collapse, automated DNS health probes reroute national traffic to the secondary active region within 3 seconds.
- **Recovery Point Objective (RPO):** $0.0\text{ Seconds}$. All financial decisions and audit dossiers are synchronously mirrored across multi-AZ Kafka brokers before an acknowledgment is returned to the client SDK. Zero decision records are lost.

---

## 5. Epistemic Assessment for PS09

The Reliability specification guarantees that GuardianPay **meets the Five-Nines standard required for critical payment infrastructure**: it isolates component failures, prevents cascading stalls, and ensures continuous operational uptime.

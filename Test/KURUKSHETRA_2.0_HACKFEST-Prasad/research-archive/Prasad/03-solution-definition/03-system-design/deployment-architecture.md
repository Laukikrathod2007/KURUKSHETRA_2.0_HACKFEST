# Deployment Architecture: Prototype Infrastructure and Production Enterprise Evolution

---

## 1. Executive Understanding
A credible systems architecture must define two concrete deployment profiles:
1. **The Hackathon Prototype Deployment:** A lightweight, containerized, and reproducible environment designed to demonstrate end-to-end multi-signal interception, cognitive interlocks, and audit logging during evaluations.
2. **The Production Enterprise Evolution:** An active-active, geographically redundant cloud topology capable of sustaining 25,000 TPS in strict compliance with RBI data localization and five-nines availability mandates.

This document formalizes both deployment topologies, proving that the prototype is an authentic, scaled-down slice of the production enterprise system.

---

## 2. Hackathon Prototype Deployment Topology

```
                         HACKATHON PROTOTYPE DOCKER TOPOLOGY
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ TEST / DEMO RUNTIME ENVIRONMENT                                             │
  │ • Android Smartphone / Emulated Device running GuardianPay Client APK        │
  │ • Simulates real-time phone calls, dwell times, and clipboard paste actions │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         │ (mTLS via ngrok / Local Bridge)
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ DOCKER COMPOSE CORE SERVICES (`docker-compose.yml`)                         │
  │                                                                             │
  │  ┌─────────────────────────────┐           ┌─────────────────────────────┐  │
  │  │ `ingress-gateway` (Go 1.22) │           │ `feature-store` (Redis 7.2) │  │
  │  │ • Port: 8080 (REST/gRPC)    │◄─────────►│ • Port: 6379                │  │
  │  │ • Evaluates Hot LightGBM    │           │ • 5,000 Mock Mule Hashes    │  │
  │  └──────────────┬──────────────┘           └─────────────────────────────┘  │
  │                 │                                                           │
  │                 ▼                                                           │
  │  ┌─────────────────────────────┐           ┌─────────────────────────────┐  │
  │  │ `warm-agent-enclave`        │           │ `mock-npci-cbs-switch`      │  │
  │  │ • Python 3.11 / FastAPI     │◄─────────►│ • Emulates `RespValAdd`     │  │
  │  │ • INT8 IndicBERT Runtime    │           │ • SQLite Core Banking DB    │  │
  │  └──────────────┬──────────────┘           └─────────────────────────────┘  │
  │                 │                                                           │
  │                 ▼                                                           │
  │  ┌─────────────────────────────┐           ┌─────────────────────────────┐  │
  │  │ `audit-logger`              │           │ `admin-forensic-dashboard`  │  │
  │  │ • Local JSONL WORM Sink     │◄─────────►│ • Streamlit / React (Port   │  │
  │  │ • HMAC Signature Verifier   │           │   3000) Live Causal Telemetry│ │
  │  └─────────────────────────────┘           └─────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────────────────┘
```

- **Hardware Footprint:** Runs comfortably on an 8-core, 16GB RAM laptop or a single AWS `t3.xlarge` instance ($0.16/hour).
- **Execution:** Spun up via a single terminal command: `docker compose up --build`.

---

## 3. Production Enterprise Deployment Topology (Tier-1 Bank / NPCI)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ACTIVE-ACTIVE ENTERPRISE TOPOLOGY                         │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **PRIMARY REGION: MUMBAI (AWS ap-south-1 / MeitY-Accredited DC A)**                       │
│ • AWS Route 53 Geolocation DNS Traffic Manager with 2-second failover                     │
│ • AWS Network Load Balancer (NLB) terminating 25,000 TPS mTLS connections                 │
│ • Kubernetes (EKS) Production Cluster:                                                    │
│   - Node Pool 1 (Compute): 40x `c6i.2xlarge` instances running Go Ingress Gateways        │
│   - Node Pool 2 (Inference): 12x `g5.xlarge` (Nvidia A10G) running Quantized SLMs         │
│ • In-Memory Feature Tier: Multi-AZ Aerospike Enterprise Cluster (32TB RAM, Sub-ms p99)    │
│ • Event Streaming Backbone: Multi-Broker Apache Kafka Cluster (Partitioned by VPA Hash)   │
│ • WORM Forensic Storage: AWS S3 Object Lock in Compliance Mode (7-Year Legal Retention)  │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ **SECONDARY REGION: HYDERABAD (AWS ap-south-2 / MeitY-Accredited DC B)**                  │
│ • Identical active-active hot standby cluster replicating Kafka streams in < 5ms lag      │
│ • Instant DNS cutover in the event of a catastrophic regional grid failure in Mumbai       │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Production vs. Prototype Component Mapping

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE MAPPING MATRIX                                   │
├─────────────────────┬───────────────────────────────┬─────────────────────────────────────┤
│ INFRASTRUCTURE TIER │ HACKATHON PROTOTYPE           │ ENTERPRISE PRODUCTION               │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **Compute / Orchest.│ Local Docker Compose          │ Kubernetes (EKS) with HPA (Autoscale│
│                     │ on single Linux/macOS host    │ from 20 to 120 pods on traffic spike│
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **Feature Cache**   │ Redis 7.2 Container           │ Aerospike Enterprise Multi-AZ       │
│                     │ (Single instance in-memory)   │ Cluster with persistent NVMe flash  │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **AI Inference**    │ ONNX Runtime CPU (INT8)       │ Triton Inference Server on Nvidia   │
│                     │ executing on local thread     │ L4 Tensor Core GPU instances        │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **Audit Storage**   │ Local append-only JSONL file  │ Apache Kafka -> S3 Compliance Mode  │
│                     │ with HMAC-SHA256 hash         │ Object Lock with Hardware HSM roots │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **Monthly Cost**    │ **~$0.00 (Local / Free Tier)**│ **~$18,500 / month (Full Scale)**   │
└─────────────────────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

The deployment architecture proves that GuardianPay is **operationally grounded**: the prototype demonstrates the full end-to-end multi-tier pipeline in a lightweight Docker stack, while the production design adheres to RBI data localization and five-nines disaster recovery mandates.

# System Boundaries, Trust Zones, and Network Architecture

## 1. Executive Summary & Security Boundary Model

In high-stakes banking cybersecurity, a system boundary is not merely a box drawn on an architectural slide; it is a **formally enforced cryptographic and network perimeter**. Data crossing a trust boundary must undergo strict input sanitization, mutual authentication, runtime attestation, and statutory minimization.

In strict compliance with Part 3 of the Phase 8 mandate, this document defines the system boundaries, network segmentation zones, external system interfaces, and ingress/egress controls governing the *Agentic Guardian*.

---

## 2. Global Trust Zones & Network Segmentation

The Guardian architecture partitions system components across four isolated **Trust Zones**:

```text
  [ZONE 0: UNTRUSTED CLIENT ENVIRONMENT]
  Consumer Mobile Device (Android / iOS)
  Host Mobile Banking App Container
  Embedded Guardian Mobile Telemetry SDK
         │
         │ mTLS 1.3 + Runtime Attestation (Play Integrity / App Attest)
         ▼
  [ZONE 1: SECURE DMZ INGRESS GATEWAY]
  Hardware Load Balancers & DDoS Mitigation (Envoy / F5)
  API Rate Limiting & Token Bucket Throttling
         │
         │ Internal Private Network (VPC Peering / Dedicated Fibers)
         ▼
  [ZONE 2: PROTECTED CORE DECISION CLUSTER]
  In-Line Scoring Gateway (Go / C++ / FastAPI ONNX)
  Low-Latency Cache Tier (Redis Sentinel Cluster)
  Decoupled Policy Rules Engine
         │
         │ Zero-Trust mTLS with Role-Based Access Control
         ▼
  [ZONE 3: SECURE DATA & COMPLIANCE VAULT]
  Immutable WORM Append-Only Audit Storage (AES-256-GCM)
  Kafka Event Streaming Cluster
  Offline Graph Neural Network & Drift Pipelines
```

---

## 3. External System Interfaces (Ingress & Egress)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       EXTERNAL SYSTEM INTERFACE CONTRACTS                                        │
├────────────────────┬───────────────┬───────────────────────────┬─────────────────────────────────────────────────┤
│ External Entity    │ Direction     │ Protocol / Wire Format    │ Security & Trust Mechanism                      │
├────────────────────┼───────────────┼───────────────────────────┼─────────────────────────────────────────────────┤
│ Mobile Banking App │ Ingress       │ HTTPS / gRPC over mTLS 1.3│ Mobile Runtime Attestation + Device Nonce       │
│ Payment Switch GW  │ Ingress/Egress│ ISO 20022 / gRPC Protobuf │ Hardware HSM Mutual TLS + Digital Signatures    │
│ Core Banking DB    │ Ingress (Read)│ Read-Only Redis Replica   │ Internal Private VPC; AES-256 in Transit        │
│ Beneficiary Banks  │ Egress (Alert)│ ISO 20022 camt.056 REST   │ Institutional PKI Certificate + Signing Keys    │
│ Telecom Operators  │ Ingress (Ext) │ HTTPS REST (Camara API)   │ OAuth 2.0 Mutual Client Credentials             │
│ National Cyber Port│ Egress (Audit)│ HTTPS JSON / PDF          │ Section 65B Cryptographic Digital Signatures    │
└────────────────────┴───────────────┴───────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 4. Ingress & Egress Security Controls

### 4.1 Client-to-Gateway Ingress Security (Zone 0 $\rightarrow$ Zone 1)
- **Mutual TLS 1.3**: Every mobile client establishes a TLS 1.3 session with hardware-backed certificate pinning, preventing man-in-the-middle interception (`REQ-SEC-001`).
- **Runtime Attestation**: Before accepting telemetry payloads, the gateway validates device integrity via Google Play Integrity API or Apple App Attest, rejecting emulators, rooted devices, and hooked environments (e.g., Frida, Magisk) (`REQ-SEC-002`).
- **Token Bucket Rate Limiting**: The ingress layer enforces strict client-level rate limiting (maximum 10 requests/minute per device UUID), preventing DDoS attacks designed to force gateway fail-open states (`REQ-SEC-005`).

### 4.2 Switch Gateway Ingress & Latency Isolation (Zone 1 $\rightarrow$ Zone 2)
- **Direct Fiber Peering**: Dedicated 10 Gbps private interconnects connect the bank's transaction routing engine directly to the Guardian scoring cluster with sub-millisecond physical transit times.
- **Hardware Circuit Breaking**: The switch interceptor enforces an unconditional hardware deadline clock: if Zone 2 does not return a directive in $45\text{ms}$, the switch interceptor severs the socket and emits `Allow` locally in $\le 5\text{ms}$ (`REQ-RES-002`).

### 4.3 Outbound Inter-Bank Alert Egress (Zone 2 $\rightarrow$ Zone 0/External)
- **Cryptographic Non-Repudiation**: Outbound ISO 20022 `camt.056` hold advisories are signed using the sending bank's hardware-stored RSA-4096 / Ed25519 private key before transmission (`REQ-SEC-006`).
- **Asynchronous Dead-Lettering**: Outbound alerts execute out-of-band over persistent background worker threads, ensuring that a slow or unresponsive beneficiary bank never impacts the sending bank's in-line payment throughput.

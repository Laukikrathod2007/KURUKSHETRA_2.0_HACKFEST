# Architecture Options: Detailed Candidate Topologies and Comparative Tradeoffs

---

## 1. Executive Understanding
Following the exploratory solution-space research in Phase 2, we formalized three serious reference candidates for final system selection:
- **Option 1: Client-First Smart Guardian (TPAP SDK Focus)**
- **Option 2: Gateway-Centric Dual-Path Risk Engine (Bank/PSP Focus)**
- **Option 3: Federated Hybrid Guardian (Coordinated Client + Cloud Enclave)**

This document defines the exact structural layout, component boundaries, latency budgets, and operational tradeoffs for each candidate option, establishing the formal engineering foundation for the final Architecture Decision Record (ADR).

---

## 2. Option 1: Client-First Smart Guardian (TPAP SDK Focus)

### Architecture Description
In Option 1, the intelligence and enforcement reside **predominantly on the user's physical smartphone** as a native SDK embedded directly inside the TPAP application (Google Pay, PhonePe, BHIM).

```
                      OPTION 1: CLIENT-FIRST SMART GUARDIAN
  [TPAP User Interface] ──► [Native Android Telephony & Sensor Coroutine]
                        ──► [On-Device INT8 IndicBERT (ONNX Mobile Runtime)]
                        ──► [Local SQLite Known-Mule Bloom Filter Cache]
                        ──► [On-Device Rule & Cognitive Challenge Controller]
                                    │
                                    ▼ (Pre-PIN Interruption Rendered Locally)
                        [Common Library MPIN Pad]
```

- **Component Allocation:** Feature extraction, semantic intent classification (via INT8 quantized MobileBERT on device NPU), and cognitive challenge rendering execute entirely on-device. The server gateway is queried only asynchronously for blacklist updates.
- **Latency Profile:** Ultra-low ($<30\text{ms}$ total decision latency on modern mobile NPUs).
- **Strengths:** Zero server compute cost; 100% DPDP privacy compliance (biometric and sensor data never leaves device RAM); completely immune to cloud gateway outages.
- **Weaknesses:** Hardware fragmentation across low-end Indian Android phones ($80 MediaTek devices struggle with on-device transformers); zero real-time visibility into cross-bank transaction graphs or syndicated mule velocity; Apple iOS sandbox prevents background sensor capture.

---

## 3. Option 2: Gateway-Centric Dual-Path Risk Engine (Bank/PSP Focus)

### Architecture Description
In Option 2, the intelligence resides **predominantly on the server-side API gateway** operated by the Payment Service Provider (PSP) Bank (e.g. HDFC, ICICI, Axis) or payment aggregator.

```
                  OPTION 2: GATEWAY-CENTRIC DUAL-PATH ENGINE
  [Thin Client App] ──(mTLS Tx Payload)──► [PSP Edge Risk Gateway]
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼ (Hot Path: < 8ms)                                     ▼ (Warm Path: 1.8s)
             [Compiled LightGBM Model]                               [Cloud Agentic Enclave]
             • Evaluates Aerospike Features                          • Queries CBS RespValAdd
             • Returns Signed Pass/Hold                              • Evaluates Semantic NLP
                      │                                                       │
                      └───────────────────────────┬───────────────────────────┘
                                                  │
                                                  ▼ (ECDSA Signed Directive)
                                          [Thin Client Enforces UI]
```

- **Component Allocation:** The client app is a "thin sensor" that packages telemetry (VPA, amount, call state) and posts it to the edge gateway. The gateway runs compiled LightGBM models in 5ms, selectively routing ambiguous transactions to a cloud-based agent cluster.
- **Latency Profile:** Hot path: 12ms (including network round-trip); Warm path: 1,800ms.
- **Strengths:** Powerful server-side compute; centralized access to banking feature stores and real-time mule blacklists; uniform performance across all smartphone models.
- **Weaknesses:** Client-side telemetry is vulnerable to tampering on rooted phones; requires robust high-availability infrastructure to handle 25,000 TPS; depends on network connectivity.

---

## 4. Option 3: Federated Hybrid Guardian (Coordinated Client + Cloud Enclave)

### Architecture Description
Option 3 implements a **cooperative federated topology**, distributing responsibilities dynamically across the client smartphone and the edge cloud gateway based on capability and trust.

```
                   OPTION 3: FEDERATED HYBRID GUARDIAN
  [Client Guardian SDK (TPAP)]                     [Edge Cloud Gateway (Bank/PSP)]
  ┌──────────────────────────────┐                 ┌──────────────────────────────┐
  │ • Native Sensor Listeners    │                 │ • In-Memory Feature Store    │
  │ • Immediate AnyDesk Blocker  │                 │ • Sub-10ms GBDT Model Scorer │
  │ • Ephemeral Telemetry Hasher │                 │ • Warm-Path Agentic Enclave  │
  │ • Dynamic UI Interlock Modal │                 │ • Cryptographic Signer       │
  └──────────────┬───────────────┘                 └──────────────┬───────────────┘
                 │                                                │
                 │─── 1. mTLS Signed Telemetry Digest ───────────►│
                 │    (VPA, Note, Call Flag, Dwell Time)          │
                 │                                                │
                 │◄── 2. ECDSA Attested Friction Directive ───────│
                 │    (TIER_2_CHALLENGE: Expected Legal Name)     │
                 ▼                                                ▼
  [Client Interlocks UI Locally]                   [Kafka Emits WORM Audit Dossier]
```

- **Component Allocation:** 
  - *Client SDK:* Captures local sensor telemetry, enforces immediate deterministic blocks (e.g. AnyDesk detected), renders cognitive challenges, and verifies server cryptographic signatures.
  - *Edge Cloud Gateway:* Ingests telemetry digests, fetches CBS legal names via `RespValAdd`, runs hot GBDT scoring in 8ms, invokes selective warm-path agents for ambiguous cases, and streams audit dossiers to WORM storage.
- **Latency Profile:** Hot path: 10–14ms; Warm path: 1,600–2,100ms.
- **Strengths:** Combines the best attributes of Options 1 and 2: local privacy isolation + server-side compute power; resilient to client tampering via ECDSA attestation; autonomous fallback on cloud failure.
- **Weaknesses:** Slightly higher architectural and integration complexity across client and server repositories.

---

## 5. Comparative Tradeoff Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE OPTION COMPARISON                                  │
├─────────────────────┬───────────────────┬─────────────────────┬───────────────────────────┤
│ CRITERION           │ OPTION 1: CLIENT  │ OPTION 2: GATEWAY   │ OPTION 3: FEDERATED HYBRID│
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Latency**         │ **Instant (<5ms)**│ Moderate (12ms Hot) │ **Optimal (10ms Hot)**    │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Compute Cost**    │ **$0.00 Server**  │ $90 / 1M Tx         │ **$45 / 1M Tx (Tiered)**  │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Low-End Phones**  │ Poor (NPU lag)    │ **Uniform / Fast**  │ **Uniform / Fast**        │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **DPDP Privacy**    │ **Total (Local)** │ High (Encrypted)    │ **Total (Ephemeral)**     │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Mule Intel**      │ Weak (Stale cache)│ **Total (Real-time)│ **Total (Real-time)**     │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Fault Tolerance** │ **Autonomous**    │ Depends on gateway  │ **Degraded Local Fallback │
├─────────────────────┼───────────────────┼─────────────────────┼───────────────────────────┤
│ **Tamper Defense**  │ Vulnerable (Frida)│ High                │ **Extreme (ECDSA Attest)**│
└─────────────────────┴───────────────────┴─────────────────────┴───────────────────────────┘
```

---

## 6. Epistemic Assessment for PS09

The comparative evaluation demonstrates that **Option 3 (Federated Hybrid Guardian)** provides the optimal architectural balance: it leverages client-side sensor privacy while maintaining server-side compute scalability, real-time recipient intelligence, and cryptographic tamper resistance. Option 3 is recommended for formal selection in the ADR.

# Information Flow: Data Lineage, Sequence Flows, and Cryptographic Boundaries

---

## 1. Executive Understanding
This document defines the **precise information lineage, cryptographic boundaries, and sequence dynamics** of GuardianPay. It maps exactly where data originates, what components transform it, how trust boundaries are traversed, and where immutable audit proofs are deposited.

---

## 2. End-to-End Sequence Diagram

```
[User UI]       [Client SDK]        [Edge Gateway]       [Feature Store]     [Warm Agent]       [Common Library]
    │                │                     │                    │                 │                    │
    │── 1. Enter Tx ─►│                     │                    │                 │                    │
    │   (Amt, VPA)   │                     │                    │                 │                    │
    │                │── 2. Poll Sensors ──│                    │                 │                    │
    │                │   (Call, Dwell)     │                    │                 │                    │
    │                │                     │                    │                 │                    │
    │                │── 3. Post Digest ──►│                    │                 │                    │
    │                │   (mTLS Payload)    │                    │                 │                    │
    │                │                     │── 4. Fetch Baseln ─►│                 │                    │
    │                │                     │◄─ 5. Return Feat ──│                 │                    │
    │                │                     │                    │                 │                    │
    │                │                     │── 6. Hot GBDT Eval (5ms)             │                    │
    │                │                     │                                      │                    │
    │                │                     │── 7. IF Ambiguous ($0.20 <= P <= 0.85)                    │
    │                │                     │      Route to Warm Agent ───────────►│                    │
    │                │                     │                                      │── 8. ReqValAdd     │
    │                │                     │                                      │   (Fetch CBS Name) │
    │                │                     │                                      │── 9. IndicBERT     │
    │                │                     │                                      │   (Semantic Clash) │
    │                │                     │◄─ 10. Return Friction Directive ─────│                    │
    │                │                     │                                                           │
    │                │◄─ 11. Return ECDSA ─│                                                           │
    │                │   Signed Verdict    │                                                           │
    │                │   (TIER_2_CHALLENGE)│                                                           │
    │                │                     │                                                           │
    │◄─ 12. Render ──│                     │                                                           │
    │   Challenge UI │                     │                                                           │
    │   (Type Name)  │                     │                                                           │
    │                │                     │                                                           │
    │── 13. Name ───►│                     │                                                           │
    │   Matched      │                     │                                                           │
    │                │── 14. Friction Satisfied: Launch MPIN Activity ────────────────────────────────►│
    │                │                                                                                 │── 15. User MPIN
    │                │                                                                                 │   (CBS Debit)
```

---

## 3. Detailed Data Flow Specifications

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     INFORMATION FLOW SPECIFICATION MATRIX                                        │
├───────┬───────────────────┬───────────────────┬──────────────────────┬─────────────┬──────────────┬──────────────┤
│ FLOW  │ SOURCE            │ DESTINATION       │ PAYLOAD DATA         │ PROTOCOL    │ LATENCY SLA  │ TRUST BOUND  │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F1**│ Client Mobile UI  │ Client SDK        │ Amount, VPA, Note,   │ Native Call │ < 0.5 ms     │ Intra-Process│
│       │                   │                   │ Touch Coordinates    │ (Memory)    │              │ (Local App)  │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F2**│ Android OS API    │ Client SDK        │ `CALL_STATE_OFFHOOK`,│ Binder IPC  │ < 1.0 ms     │ OS Kernel to │
│       │ (Telephony/Pkg)   │                   │ Installed Pkg List   │             │              │ User Space   │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F3**│ Client SDK        │ Ingress Gateway   │ `TelemetryDigest`    │ HTTPS/mTLS  │ < 8.0 ms     │ Untrusted Dev│
│       │                   │                   │ (HMAC salted tokens) │ (HTTP/2)    │ (Network RTT)│ to Cloud Gate│
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F4**│ Ingress Gateway   │ Aerospike Feature │ User ID Hash ->      │ Aerospike C │ < 1.0 ms     │ Internal VPC │
│       │                   │ Store (Redis)     │ 90d Velocity Vector  │ Client API  │ (p99)        │ Private Net  │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F5**│ Warm Agent Enclave│ NPCI Switch Sim / │ Payee VPA -> Core    │ gRPC / REST │ < 150 ms     │ Cloud VPC to │
│       │                   │ Beneficiary Bank  │ Banking Legal KYC Nam│             │ (External)   │ Inter-Bank   │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F6**│ Edge Gateway      │ Client SDK        │ `SignedDirective`    │ HTTPS       │ < 8.0 ms     │ Cloud Gate to│
│       │                   │                   │ (ECDSA P-256 Sig)    │ Response    │              │ Client SDK   │
├───────┼───────────────────┼───────────────────┼──────────────────────┼─────────────┼──────────────┼──────────────┤
│ **F7**│ Edge Gateway      │ Apache Kafka Sink │ `AuditDecisionRecord`│ Kafka TCP   │ Async        │ Internal VPC │
│       │                   │ (WORM Storage)    │ Full causal JSON     │ Producer    │ (Zero Block) │ Audit Vault  │
└───────┴───────────────────┴───────────────────┴──────────────────────┴─────────────┴──────────────┴──────────────┘
```

---

## 4. Cryptographic Envelope and Data Minimization

To guarantee complete compliance with the **DPDP Act 2023**:
1. **Flow F3 (Client to Gateway):** The client transmits the transaction amount, VPA, and note, but **anonymizes user identifiers** using daily salted hashes:
   $$\text{ClientToken} = \text{HMAC-SHA256}(\text{DeviceIMEI} \,||\, \text{DateKey})$$
2. **Flow F6 (Gateway to Client):** To prevent local tampering by Frida or malicious rooted OS hooks, the gateway signs the response payload:
   $$\text{Attestation} = \text{ECDSA-P256-Sign}_{K_{\text{gateway\_priv}}}(\text{eval\_id} \,||\, \text{Directive} \,||\, \text{Timestamp})$$
   The client SDK verifies this signature before unlocking the payment activity. If the signature is modified or stripped, the SDK enters an unconditional defensive lockdown.

---

## 5. Epistemic Assessment for PS09

The information flow establishes that data moves across **authenticated, cryptographically attested channels with zero sensitive biometric leakage**, satisfying both the performance requirements of UPI and the statutory demands of Indian privacy law.

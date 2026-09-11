# Trust Boundaries: Security Zoning, Perimeter Enclaves, and Interface Controls

---

## 1. Executive Understanding
In enterprise fintech architecture, **security is defined by how boundaries between untrusted and trusted zones are governed**. Treating all internal microservices as trusted or assuming client-side telemetry is authentic invites catastrophic compromise.

GuardianPay partitions its architecture into **five distinct Security Trust Zones**, enforcing strict mutual authentication (mTLS), input validation, least privilege, and cryptographic attestation across every perimeter crossing.

---

## 2. The Five Architectural Trust Zones

```
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  ZONE 0: UNTRUSTED / HOSTILE ENVIRONMENT
  • Cellular Voice Network, Public Internet, Scammer Infrastructure, Potential Device Root/Frida
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
                                │
                                │ [Boundary 0-1: OS Sandboxing & Play Integrity]
                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ZONE 1: CLIENT SANDBOX ENCLAVE (TPAP APPLICATION RUNTIME)                                   │
  │ • Native Guardian SDK (C++ / Kotlin), Transient RAM Buffers, Local SQLite Cache             │
  └──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                         │
                                         │ [Boundary 1-2: mTLS over HTTPS / TLS 1.3 Pinning]
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ZONE 2: EDGE INGRESS DMZ (BANK / PSP PERIMETER)                                             │
  │ • Envoy Proxy, TLS Termination, Token Auth, Rate Limiting, Circuit Breakers                │
  └──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                         │
                                         │ [Boundary 2-3: Private VPC gRPC / Mutual Auth]
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ZONE 3: TRUSTED RISK & REASONING CORE (PRIVATE VPC)                                         │
  │ • Hot-Path LightGBM Scorer, Aerospike Feature Store, Warm Agent Enclave, HSM Signer         │
  └──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                         │
                                         │ [Boundary 3-4: NPCI Dedicated Leased Line / ISO 20022]
                                         ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  ZONE 4: ISOLATED BANKING CORE & SWITCH INFRASTRUCTURE
  • NPCI Central Switch, Core Banking System (CBS) Mainframes, Common Library MPIN Sandbox
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
```

---

## 3. Boundary Control Specifications

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY CONTROL SPECIFICATIONS                           │
├───────────┬─────────────────────────────────┬─────────────────────────────────────────────┤
│ BOUNDARY  │ INTERFACE CROSSED               │ SECURITY & VALIDATION CONTROLS              │
├───────────┼─────────────────────────────────┼─────────────────────────────────────────────┤
│ **B 0-1** │ OS to Mobile Client App         │ • Google Play Integrity API attestation     │
│           │                                 │ • Native C++ anti-Frida / anti-hooking      │
│           │                                 │ • Android App Sandboxing (`FLAG_SECURE`)    │
├───────────┼─────────────────────────────────┼─────────────────────────────────────────────┤
│ **B 1-2** │ Mobile Client SDK to Edge Gate  │ • Mutual TLS (mTLS) with Certificate Pinning│
│           │                                 │ • Ephemeral client device tokens (HMAC)     │
│           │                                 │ • Strict JSON schema ingress validation     │
├───────────┼─────────────────────────────────┼─────────────────────────────────────────────┤
│ **B 2-3** │ Edge Gateway to Internal Risk   │ • Private AWS VPC / Kubernetes NetworkPolicy│
│           │ Microservices                   │ • gRPC with internal mutual authentication  │
│           │                                 │ • Zero public internet exposure             │
├───────────┼─────────────────────────────────┼─────────────────────────────────────────────┤
│ **B 3-4** │ Risk Core to NPCI & Core Banking│ • Dedicated MPLS / Leased Line encryption   │
│           │ Switch (`RespValAdd`)           │ • Hardware Security Module (HSM) digital sig│
│           │                                 │ • ISO 8583 / ISO 20022 banking protocols   │
└───────────┴─────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 4. Epistemic Assessment for PS09

The Trust Boundary architecture guarantees that GuardianPay operates under **Zero Trust principles**: no component relies on unverified assertions, and communication across perimeters is cryptographically locked and audited.

# Architectural Traceability Matrix

## 1. Traceability Methodology

To ensure architectural integrity, every technical component, model, and data store in Kurukshetra must trace directly to a validated product capability from Phase 6 and a foundational requirement from Phase 5.

The traceability chain strictly follows:
$$\text{Requirement (Phase 5)} \longrightarrow \text{Capability (Phase 6)} \longrightarrow \text{Architecture Component (Phase 8)} \longrightarrow \text{Technology Decision} \longrightarrow \text{Implementation Module}$$

---

## 2. Comprehensive Traceability Matrix (MUST Requirements)

| Req ID | Requirement Description | Phase 6 Capability | Architecture Component | Technology / Subsystem | Implementation Module | Verification Test |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-PERF-01** | Synchronous pre-clearance decision delivered $\le 45\text{ms}$ P99. | CAP-INT-01 (In-Line Interception) | CMP-01 Interception Orchestrator | Go 1.22+ `netpoll` + Redis Sentinel L1 cache | `MOD-03: orchestrator` | 20k TPS load test asserting P99 $\le 45\text{ms}$. |
| **REQ-DET-01** | Detect active psychological coercion (phone call + remote access + velocity). | CAP-DET-01 (Multi-Modal Risk Engine) | CMP-03 Risk Engine Core | LightGBM GBDT compiled to ONNX Runtime C++ | `MOD-04: risk-engine` | Scenario replay across 15 fraud typologies. |
| **REQ-DET-02** | Real-time graph mule detection and fan-in risk scoring. | CAP-DET-02 (Mule Graph Intelligence) | CMP-04 GNN Subgraph Engine | PyG 2-layer RGCN + Redis Feature Cache | `MOD-04: risk-engine` | Subgraph embedding refresh latency $\le 450\text{ms}$. |
| **REQ-INT-01** | Intercept UI *strictly prior to PIN pad rendering*. | CAP-INT-01 (Pre-PIN Interception) | CMP-02 Client SDK Interceptor | Native Android (Kotlin) / iOS (Swift) UI Hooks | `MOD-01: client-sdk` | UI state machine assertion verifying PIN pad suppression. |
| **REQ-INT-02** | Enforce deterministic 5-second anti-habituation dwell gate. | CAP-INT-02 (Dwell Gate & De-Biasing) | CMP-02 Client SDK Interceptor | Native OS countdown timer + disabled button gate | `MOD-01: client-sdk` | Tamper test verifying button cannot be clicked before 5.0s. |
| **REQ-INT-03** | Typology-specific counter-coaching narrative injection. | CAP-INT-03 (Counter-Coaching Modals) | CMP-02 & CMP-05 Policy Router | Template synthesizer with regex safety validator | `MOD-01` & `MOD-05` | Typology match assertion on 500 test scenarios. |
| **REQ-POL-01** | Decouple statistical risk score from deterministic action policy. | CAP-POL-01 (4-Tier Policy Router) | CMP-05 Decision Engine | Go deterministic rule matrix + atomic RCU pointer swap | `MOD-05: policy-router` | Unit tests achieving 100% path coverage over rule matrix. |
| **REQ-POL-02** | Clamp action directives when epistemic uncertainty $\sigma > 0.35$. | CAP-POL-02 (Safe-Harbor Uncertainty Clamping) | CMP-05 & CMP-03 Conformal Calibrator | Platt scaling + ensemble variance conformal estimation | `MOD-04` & `MOD-05` | Boundary test verifying no freeze issued when $\sigma > 0.35$. |
| **REQ-EXP-01** | Generate exact, causal feature attribution explanations. | CAP-EXP-01 (Causal Explainability) | CMP-06 Evidence & Audit Engine | Exact TreeSHAP decomposition algorithm in C++ | `MOD-06: audit-engine` | Assertion that sum of SHAP values equals base model delta. |
| **REQ-EXP-02** | Enforce AML anti-tipping-off safe harbor on customer explanations. | CAP-EXP-02 (Regulatory Safe-Harbor Filter) | CMP-06 Evidence & Audit Engine | Deterministic safe-harbor regex sanitizer & template projector | `MOD-06: audit-engine` | Automated DLP scan verifying zero mule cluster terms in client UI. |
| **REQ-SEC-01** | Hardware-backed client device integrity attestation. | CAP-SEC-01 (Device Attestation) | CMP-02 & Edge Ingress Gateway | Google Play Integrity API + Apple App Attest tokens | `MOD-01` & `MOD-02` | Injection test rejecting tampered / unsigned client payloads. |
| **REQ-SEC-02** | Mutual TLS 1.3 encryption across all microservices. | CAP-SEC-02 (Zero Trust Mesh) | Istio Service Mesh / SPIFFE | TLS 1.3 with ephemeral X.509 certificates | `MOD-02` & `MOD-03` | Network packet capture verifying 100% encrypted traffic. |
| **REQ-SEC-03** | Immutable, non-repudiable WORM audit trail for all decisions. | CAP-AUD-01 (WORM Compliance Vault) | CMP-06 Evidence & Audit Engine | AWS S3 Object Lock (Compliance Mode) + Merkle hashing | `MOD-06: audit-engine` | Attempted deletion API call rejected with S3 403 Forbidden. |
| **REQ-PRIV-01**| Zero raw biometric persistence; ephemeral RAM buffering. | CAP-PRIV-01 (Privacy-by-Design) | CMP-02 Client SDK Local Extractor | Volatile RAM buffer with native `memset(0)` zeroization | `MOD-01: client-sdk` | Memory leak analysis asserting zero raw coordinate strings. |
| **REQ-PRIV-02**| Cryptographic account pseudonymization and tokenization. | CAP-PRIV-02 (Data Minimization) | Edge Ingress Gateway | HMAC-SHA256 with HSM-protected bank salt | `MOD-02: edge-gateway` | Database inspection verifying zero plain-text IBAN/PANs. |
| **REQ-RES-01**| Five Nines Availability (99.999%) with deterministic fail-open. | CAP-RES-01 (Fail-Open Resilience) | CMP-01 Orchestrator Circuit Breaker | Multi-tier circuit breaker with 5ms cache timeout | `MOD-03: orchestrator` | Chaos injection verifying clean fallback to `ALLOW` within 45ms. |
| **REQ-AGN-01**| Bounded agentic SOC investigation copilot with read-only tools. | CAP-AGN-01 (Analyst Copilot) | CMP-08 SOC Investigation Agent | Local Mistral-7B / Claude 3.5 Sonnet with Pydantic grammar | `MOD-07: soc-copilot` | Red-team test asserting zero database write permissions. |

---

## 3. Reverse Traceability: Component Justification

Every major architectural component is verified to possess a legitimate parent requirement:

- **CMP-01 (Interception Orchestrator)**: Justified by `REQ-PERF-01`, `REQ-RES-01`.
- **CMP-02 (Client Interceptor SDK)**: Justified by `REQ-INT-01`, `REQ-INT-02`, `REQ-PRIV-01`.
- **CMP-03 (In-Line Risk Scorer)**: Justified by `REQ-DET-01`, `REQ-PERF-02`.
- **CMP-04 (GNN Mule Subgraph Engine)**: Justified by `REQ-DET-02`.
- **CMP-05 (Decision Engine & Policy Router)**: Justified by `REQ-POL-01`, `REQ-POL-02`.
- **CMP-06 (Explainability & WORM Audit Engine)**: Justified by `REQ-EXP-01`, `REQ-EXP-02`, `REQ-SEC-03`.
- **CMP-07 (Cross-Rail Mule Containment Service)**: Justified by `REQ-DET-02`.
- **CMP-08 (SOC Investigation Copilot)**: Justified by `REQ-AGN-01`.

**Zero orphan components detected.** No technology exists merely because it is fashionable or architecturally interesting.

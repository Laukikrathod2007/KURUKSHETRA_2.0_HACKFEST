# Requirement Traceability Matrix: End-to-End Causal Verification

---

## 1. Executive Understanding
A robust systems architecture requires **strict bi-directional traceability**. Every system component must exist to satisfy one or more functional requirements; every functional requirement must trace directly to a verified threat vector or user need; and every requirement must be verified by a deterministic test case.

This **Requirement Traceability Matrix (RTM)** guarantees that GuardianPay has zero architectural bloat (no orphan components introduced for cosmetic appeal) and zero security blind spots (every critical threat vector has an explicit functional countermeasure).

---

## 2. Master Requirement Traceability Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       REQUIREMENT TRACEABILITY MATRIX                                            │
├──────────────┬──────────────────────────────┬──────────────┬───────────────────┬──────────────┬──────────────────┤
│ USER NEED /  │ THREAT VECTOR                │ FUNCTIONAL   │ SYSTEM COMPONENT  │ TEST CASE    │ VERIFICATION     │
│ OBJECTIVE    │ ADDRESSED                    │ REQUIREMENT  │ RESPONSIBLE       │ ID           │ METHOD           │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Safe Instant │ Routine Commerce             │ FR-OBS-01    │ Client SDK Ingress│ TC-PERF-01   │ Automated Bench  │
│ Payments     │ (Zero False Alarms)          │ NFR-LAT-01   │ Hot GBDT Engine   │              │ Latency < 10ms   │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Protection   │ "Digital Arrest" Extortion / │ FR-SEN-01    │ Android Telephony │ TC-SCAM-01   │ Hardware Emul.   │
│ from Terror  │ Fake Police Call             │ FR-POL-02    │ Call Interlock UI │              │ Offhook = Lock   │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Protection   │ Institutional Impersonation  │ FR-REC-01    │ NPCI RespValAdd   │ TC-SCAM-02   │ Mock CBS API     │
│ from Impers. │ (Fake Electricity/Customs)   │ FR-NLP-01    │ Semantic NLP Gate │              │ Clash >= 0.90    │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Prevent App  │ Remote Access Tool Theft     │ FR-SEN-02    │ Package Inspector │ TC-MALW-01   │ AnyDesk Package  │
│ Hijacking    │ (AnyDesk / TeamViewer)       │ FR-POL-05    │ Rule Enforcer     │              │ Immediate Block  │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Emergency    │ Legitimate Hospital ICU      │ FR-AGT-02    │ Agent Reasoner    │ TC-SAFE-01   │ Emergency MCC    │
│ Preservation │ False-Positive Block         │ FR-POL-01    │ Policy Matrix     │              │ Non-blocking Ban.│
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Statutory    │ Privacy Violation Penalties  │ NFR-PRV-01   │ On-Device Memory  │ TC-PRIV-01   │ Memory Inspection│
│ Compliance   │ (DPDP Act 2023 - ₹250 Cr)    │ NFR-PRV-02   │ Flusher Coroutine │              │ Zero PII Leak    │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ High Avail.  │ Regional Cloud Outage        │ NFR-REL-02   │ Resilience4j      │ TC-RELI-01   │ Network Kill Sim.│
│ Standard     │ (National Payment Freeze)    │ UC-09        │ Circuit Breaker   │              │ Local Rule Pass  │
├──────────────┼──────────────────────────────┼──────────────┼───────────────────┼──────────────┼──────────────────┤
│ Legal Action │ Cybercrime Prosecution       │ FR-AUD-01    │ WORM Kafka Sink   │ TC-AUDT-01   │ Merkle Hash Att. │
│ Support      │ (Section 65B / BSA 2023)     │ NFR-SEC-01   │ Audit Vault       │              │ Cryptographic Ver│
└──────────────┴──────────────────────────────┴──────────────┴───────────────────┴──────────────┴──────────────────┘
```

---

## 3. Coverage Analysis

1. **Threat Coverage Completeness:** All eight in-scope threat classes defined in Phase 2 (`scam-taxonomy.md`) trace directly to at least one functional requirement and an automated test case.
2. **Component Justification:** Every component in the architecture (Client SDK, Hot GBDT, NLP Classifier, Agentic Reasoner, Policy Matrix, Audit Vault) has multiple upstream functional drivers.
3. **Absence of Orphan Code:** Zero requirements exist without an explicit acceptance test, and zero components exist without a functional requirement.

---

## 4. Epistemic Assessment for PS09

The Requirement Traceability Matrix validates that GuardianPay is an **engineered, purpose-built defense system** where every line of planned code traces directly to an empirical real-world threat.

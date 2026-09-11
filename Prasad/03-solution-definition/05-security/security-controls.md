# Security Controls: Cryptographic Primitives, Client Hardening, and Gateway Defense

---

## 1. Executive Understanding
Security controls are the **concrete technical mechanisms** deployed to enforce the threat mitigations and trust boundaries defined in the preceding specifications.

In GuardianPay, security controls are applied in a **defense-in-depth posture** spanning client-side binary protection, cryptographic transport attestation, API gateway rate limiting, and language model sandboxing.

---

## 2. Cryptographic Controls Specification

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           CRYPTOGRAPHIC CONTROLS MATRIX                                   │
├─────────────────────┬───────────────────┬─────────────────────────────────────────────────┤
│ CONTROL AREA        │ PRIMITIVE / CIPHER│ OPERATIONAL IMPLEMENTATION                      │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Transport Layer** │ TLS 1.3 / mTLS    │ Client SDK enforces Certificate Pinning against │
│                     │ ECDHE-RSA-AES256  │ bank gateway public keys; drops untrusted certs.│
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Decision Verdict  │ ECDSA P-256 with  │ Gateway digitally signs the `SignedDirective`   │
│   Attestation**     │ SHA-256           │ payload; client verifies with native public key.│
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Identity Privacy  │ HMAC-SHA256 with  │ Transforms raw phone numbers and device IDs into│
│   Tokenization**    │ daily salt        │ pseudonymous tokens for central feature caching.│
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Data at Rest**    │ AES-256-GCM       │ Encrypts Aerospike feature records and local    │
│                     │                   │ SQLite cache databases on user flash storage.   │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Audit Log Proof** │ Merkle Tree Roots │ Hourly root hashes signed via RFC 3161 TSA and  │
│                     │ SHA-256 Hash      │ committed to AWS S3 Compliance WORM storage.    │
└─────────────────────┴───────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. Client-Side Mobile SDK Hardening (Anti-Tamper)

Because retail Android devices may be rooted, compromised, or running instrumentation tools (Frida, Xposed, Burp Suite), the Guardian SDK incorporates four native protection layers:

1. **Native C++ JNI Implementation:** Core feature extractors and cryptographic verifiers are compiled into native shared objects (`libguardian.so`) using **Rust / C++**, eliminating Dalvik bytecode reverse-engineering.
2. **Obfuscation (OLLVM):** String literals (such as API endpoints and rule keywords) are encrypted; control-flow flattening prevents static disassembly in Ghidra/IDA Pro.
3. **Anti-Debugging & Hook Detection:**
   - Registers `ptrace(PTRACE_TRACEME, 0)` to detect attached debuggers.
   - Inspects `/proc/self/maps` for the presence of `frida-gadget.so` or `xposed.dex`.
   - Checks for Magisk / Zygisk binaries in `/sbin/` and `/system/xbin/`.
4. **Defensive Lockdown Response:** If tampering is detected, the SDK does not crash (which alerts the attacker); it silently forces all high-value transactions into maximum friction mode.

---

## 4. API Gateway Hardening & Rate Limiting

The Edge Risk Gateway deployed at the bank perimeter enforces:
- **Token Bucket Rate Limiting:** Enforced via Envoy proxy: maximum 10 requests per second per device token, with a burst ceiling of 20 requests.
- **Strict Schema Deserialization:** Incoming payloads are parsed using strict Protocol Buffers / Pydantic schemas. Payloads containing unexpected keys, malformed types, or payload sizes $>10\text{KB}$ are rejected with HTTP 400.
- **IP Reputation Filtering:** Blocks incoming traffic originating from known Tor exit nodes, commercial VPN data centers, or IP ranges flagged for automated DDoS.

---

## 5. Epistemic Assessment for PS09

The Security Controls specification guarantees that GuardianPay is **production-hardened against both external fraud syndicates and local technical adversaries**.

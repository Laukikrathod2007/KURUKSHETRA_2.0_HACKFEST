# System Security and Adversarial Attack Surface: MitM Defense, SDK Hardening, and Evasion Resilience

---

## 1. Executive Understanding
When a security system successfully intercepts financial fraud, **the fraud syndicate's immediate objective becomes hacking, bypassing, or disabling the security system itself**. 

An adversarial threat model must assume that the attacker:
1. Has full access to decompiled client application binaries (APK / IPA).
2. Can inspect network traffic on rooted test devices.
3. Will systematically probe decision boundaries to discover evasion corridors.
4. Will attempt to forge, replay, or alter API responses between the app and the risk gateway.

For **PS09**, the guardian itself must be architected as an **adversarially hardened, tamper-evident security enclave**.

---

## 2. Threat Matrix: Attacks Directed at the Guardian

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        ATTACK SURFACE OF THE GUARDIAN SYSTEM                              │
├─────────────────────┬─────────────────────────────────┬──────────────┬────────────────────┤
│ ATTACK VECTOR       │ EXPLOITATION MECHANISM          │ SEVERITY     │ DEFENSIVE DEFENSE  │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **1. Client Binary  │ Decompiling APK via JADX / Ghidra│ High         │ • ProGuard / R8 /   │
│   Reverse-Eng.**    │ to extract risk thresholds & ML │              │   DexGuard bytecode│
│                     │ feature weights                 │              │ • Native C++ (.so) │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **2. MitM & Response│ Intercepting risk gateway API to│ **CRITICAL** │ • Certificate Pin- │
│   Tampering**       │ flip `RISK: CRITICAL` to `ALLOW`│              │   ning (HPKP/mTLS) │
│                     │ via Frida / Burp Suite          │              │ • Cryptographic Sig│
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **3. API Denial of  │ Flooding risk engine with fake  │ High         │ • Cloudflare / Rate│
│   Service (DoS)**   │ requests to force fail-open mode│              │   limiting by IP   │
│                     │ across the network              │              │ • Local fallback   │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **4. Adversarial    │ Incrementally altering amounts  │ Moderate     │ • Non-linear tree  │
│   Feature Probing** │ and intervals to find the exact │              │   ensembles        │
│                     │ threshold boundary (e.g. ₹9,999)│              │ • Dynamic fuzzing  │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **5. Reputation     │ Mass reporting legitimate VPAs  │ High         │ • Sybil-resistant  │
│   Poisoning**       │ as scams to trigger denial-of-  │              │   weighted voting  │
│                     │ service against competitors     │              │ • Bank-only inputs │
└─────────────────────┴─────────────────────────────────┴──────────────┴────────────────────┘
```

---

## 3. Deep Architectural Defenses

### 1. End-to-End Cryptographic Response Attestation
In an untrusted client environment (e.g., a rooted device or a victim coerced into running malicious developer tools):
- The client cannot simply trust a boolean JSON response `{"action": "BLOCK"}`.
- **HMAC / ECDSA Attestation:** The risk engine signs its evaluation using a private server-side key:
  $$\text{Signature} = \text{Sign}_{K_{\text{server}}}(\text{TxID} \,||\, \text{Timestamp} \,||\, \text{RiskScore} \,||\, \text{Action})$$
- The client-side NPCI Common Library or payment coordinator verifies this signature before deciding whether to unlock the MPIN entry activity. Any modification to the payload invalidates the signature, causing an immediate transaction abort.

### 2. Native Code Obfuscation (C++ / Rust via JNI)
- Client-side heuristic rules and feature extraction code must **never be written in plaintext Java/Kotlin**, which compiles into easily decompiled Dalvik bytecode.
- **Native Implementation:** Core feature computation and sensor listeners are compiled into native shared libraries (`.so`) using **Rust or C++** with symbol stripping, string encryption (OLLVM), and anti-debugging hooks (`ptrace(PTRACE_TRACEME, 0)`).
- If the binary detects Frida, Xposed, Magisk, or an attached debugger, it silently degrades risk scores to maximum friction.

```
                      SECURE CLIENT-SERVER EVALUATION ENCLAVE
  [Untrusted Android Device]                    [Trusted Server Enclave]
  ┌─────────────────────────────┐               ┌─────────────────────────────┐
  │ Native C++ Guardian SDK     │               │ Cloud Risk Gateway          │
  │ • Obfuscated via OLLVM      │               │ • High-performance Go      │
  │ • Detects Frida / Root      │               │ • Evaluates Fused Models    │
  └──────────────┬──────────────┘               └──────────────┬──────────────┘
                 │                                             │
                 │── 1. Encrypted mTLS (Pinned Cert) ─────────►│
                 │      Payload: DeviceTelemetry + TxHash      │
                 │                                             │
                 │◄── 2. Cryptographically Signed Verdict ─────│
                 │      Payload: ECDSA_Sign(Action, TxID)      │
  ┌──────────────┴──────────────┐                              │
  │ Verified Signature Check    │                              │
  │ • Unlocks MPIN or Intercepts│                              │
  └─────────────────────────────┘                              │
```

---

## 4. Adversarial Machine Learning Resilience

When fraud syndicates realize that payments are being scored by automated models:
1. **Adversarial Perturbations:** Attackers test small variations in transaction timing or amounts to find low-probability valleys in the model's decision surface.
   - *Defense: Adversarial Training:* Augment training datasets with synthetic boundary-probing examples and enforce monotonic constraints on risk-critical features (e.g., higher amount to a new payee *must never* decrease risk).
2. **Reputation Laundering:** Scammers execute dozens of legitimate ₹10 micro-transactions between mule accounts to fabricate an artificial history of clean transactions.
   - *Defense: Age & Value-Weighted Graph Topology:* Micro-transactions between fresh accounts do not increment trust scores; trust requires aged, diverse, and multi-party payment histories.

---

## 5. Epistemic Assessment for PS09

| Dimension | System Security Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Client Environment** | **Inherently hostile and untrusted.** | Protect client-side guardian code using **native compilation, bytecode obfuscation, and anti-tamper hooks**. |
| **API Transport** | **Subject to interception on compromised devices.** | Enforce **TLS Certificate Pinning** and **cryptographic response signing**. |
| **Adversarial Adaptation**| **Attackers adapt tactics within days.** | The system must be dynamic; static thresholds and public model weights are fatal vulnerabilities. |

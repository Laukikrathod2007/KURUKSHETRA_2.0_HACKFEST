# System Boundary: Architectural Perimeter, External Dependencies, and Simulation Mapping

---

## 1. Executive Understanding
In safety-critical fintech systems, an ambiguous system boundary leads to architectural collapse. If developers assume the system can inspect Core Banking mainframes or modify UPI switch routing protocols, the design becomes unbuildable.

This document establishes the **strict architectural perimeter of GuardianPay (PS09)**, defining what components sit inside the system, what entities reside across external trust boundaries, and how prototype simulations cleanly map to enterprise production reality.

---

## 2. The Architectural Perimeter: Inside vs. Outside

```
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  OUTSIDE: UNTRUSTED / EXTERNAL ENVIRONMENT (OS & Network)
  • External Cellular Voice Network & OTT Messaging (WhatsApp / Telegram)
  • Scammer Infrastructure & Remote Call Centers (Mewat, Jamtara, SE Asia)
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
        │
        ▼ (User Initiates Payment in TPAP App: Scan QR / Enter VPA)
  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                INSIDE THE GUARDIANPAY SYSTEM                                │
  │                                                                                             │
  │  ┌────────────────────────────────────────┐  ┌───────────────────────────────────────────┐  │
  │  │ CLIENT GUARDIAN SDK (TPAP LAYER)       │  │ EDGE RISK GATEWAY (BANK / CLOUD LAYER)    │  │
  │  │ • Native Telephony & Sensor Listeners  │  │ • In-Memory Feature Store (Redis Cache)   │  │
  │  │ • Screen Dwell & Paste Latency Tracker │  │ • Sub-10ms GBDT Risk Scorer (LightGBM)    │  │
  │  │ • On-Device Quantized SLM Parser       │  │ • Selective Warm-Path Agentic Reasoner    │  │
  │  │ • Dynamic Cognitive Challenge UI       │  │ • Bounded Deterministic Policy Engine     │  │
  │  │ • Immutable Local Hash Attestation     │  │ • Tamper-Evident Audit Logger (BSA 2023)  │  │
  │  └────────────────────────────────────────┘  └───────────────────────────────────────────┘  │
  └──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                                 │
                                                 │ [Pre-PIN Review Cleared]
                                                 ▼
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
  OUTSIDE: ISOLATED NPCI & BANKING CORE INFRASTRUCTURE
  • NPCI Common Library (CL) MPIN Screen Activity (`FLAG_SECURE` - Zero Guardian Overlays)
  • Remitter Bank Core Banking System (CBS) Ledger Debit
  • NPCI National Central Payment Switch & Routing Hub
  • Beneficiary Bank Core Banking System (CBS) Ledger Credit
  ═══════════════════════════════════════════════════════════════════════════════════════════════════
```

---

## 3. Explicit Boundary Definitions

### Inside the System (Owned & Maintained by GuardianPay)
1. **Client-Side Guardian SDK:** Embedded within the TPAP mobile application (e.g. PhonePe/Google Pay/BHIM), operating prior to the MPIN entry activity.
2. **On-Device Telemetry Extractors:** Native Android/iOS listeners tracking dwell time, clipboard paste velocity, active cellular call state, and installed package signatures.
3. **Hot-Path Tabular Risk Engine:** High-speed compiled Go/C++ LightGBM scoring engine operating under sub-10ms SLAs.
4. **Contextual & Semantic NLP Engine:** Small quantized transformer (IndicBERT/mDeBERTa) classifying Hinglish payment notes and stated intent.
5. **Selective Agentic Investigator:** Bounded reasoning loop triggered strictly on ambiguous transactions during the 2–4 second pre-PIN review window.
6. **Dynamic Cognitive Interruption UI:** Custom interactive modal challenges (legal name typing, call interlock) interlocked with the payment button.
7. **Immutable Audit Ledger:** WORM-compliant forensic logging pipeline emitting signed decision dossiers.

### Outside the System (External Entities & Dependencies)
1. **NPCI Common Library (CL):** The secure Android activity that renders the PIN pad. The guardian cannot inspect, modify, or render on top of this screen.
2. **Bank Core Banking Systems (CBS):** Mainframe ledgers (Finacle, BaNCS) that hold account balances and execute debits/credits.
3. **NPCI Central Switch:** National routing switch connecting remitter and beneficiary PSPs.
4. **External Messaging Apps:** WhatsApp, Telegram, and SMS inboxes are strictly outside the boundary (zero direct scraping).

---

## 4. Prototype Simulation vs. Real Production Mapping

To preserve complete scientific and engineering integrity, we explicitly distinguish between simulated prototype components and real production infrastructure:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROTOTYPE VS. PRODUCTION BOUNDARY                                  │
├─────────────────────┬───────────────────────────────┬─────────────────────────────────────┤
│ COMPONENT           │ HACKATHON PROTOTYPE           │ REAL-WORLD PRODUCTION               │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **1. `RespValAdd`   │ Simulated REST service backed │ Real-time NPCI switch routing to    │
│   KYC Lookup**      │ by SQLite mock database       │ beneficiary bank CBS (150ms SLA)    │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **2. Background     │ Android native `Telephony-    │ OEM-specific battery optimization   │
│   Call Telemetry**  │ Manager` on physical device   │ handlers (Xiaomi MIUI / Vivo)       │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **3. I4C Mule       │ In-memory Redis cache with    │ Streaming API integration with MHA  │
│   Blacklist**       │ 5,000 synthetic mule hashes   │ National Cybercrime Portal (CFCFRMS)│
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **4. Payment Flow   │ High-fidelity mobile emulator │ Native integration inside Google Pay│
│   Integration**     │ or standalone Android app     │ or PhonePe pre-PIN checkout flow    │
├─────────────────────┼───────────────────────────────┼─────────────────────────────────────┤
│ **5. Forensic Audit │ Local append-only JSONL file  │ Distributed Kafka stream into S3    │
│   Storage**         │ with HMAC-SHA256 signatures   │ Object Lock WORM storage + HSM root │
└─────────────────────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

| Dimension | Architectural Takeaway |
| :--- | :--- |
| **Integration Point** | Must sit **in the TPAP application layer directly before the Common Library invocation**. |
| **Data Scope** | Zero reliance on illegal wiretapping; operates strictly on **native payment parameters and legal OS sensor states**. |
| **Prototype Integrity** | Maintain clear documentation of simulated vs. native interfaces; never disguise simulation as core banking access. |

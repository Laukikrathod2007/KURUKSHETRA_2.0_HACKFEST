# Data Strategy: Source Categorization, Governance, and Lifecycle Management

---

## 1. Executive Understanding & Alignment with Problem Statement

Under the **Challenge and Objectives of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• Analyzing a payment request, evaluating risk, verifying relevant information...*
- *• Transaction-risk analysis... Recipient verification workflow... Transaction audit history.*

In digital payment security, an algorithm is only as reliable as the data feeding it. An architecture that relies on fantasy data sources (such as "reading the user's private WhatsApp chats") is legally dead on arrival.

This document formalizes the **Six-Category Data Strategy for GuardianPay**, establishing the precise origins, freshness, legal boundaries, retention policies, and accessibility constraints for every data element ingested by the system.

---

## 2. The Six Data Source Categories

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE SIX DATA SOURCE CATEGORIES                                  │
├─────────────────────┬─────────────────────────────────┬──────────────┬────────────────────┤
│ CATEGORY            │ SPECIFIC DATA ASSETS            │ AVAILABILITY │ LEGAL STATUS       │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **1. Production-    │ • UPI URI Parameters (`pa, am`) │ **Real-Time  │ Native to payment  │
│    Available**      │ • `RespValAdd` CBS Legal Name   │   Hot Path** │ switch; fully      │
│                     │ • Telephony Call State (`OFFHOOK│              │ compliant with RBI │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **2. External       │ • I4C / 1930 Cybercrime Portal  │ **Near-Real- │ Law enforcement    │
│    Intelligence**   │ • NPCI CFMS Central Fraud Score │   Time**     │ database integration│
│                     │ • Telecom Spammer Hash Lists    │ (Redis Cache)│ under MHA mandate  │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **3. User-Provided  │ • Free-form payment note (`tn`) │ **Real-Time**│ Provided directly  │
│    Data**           │ • Typed response to challenge   │ (User Input) │ by user in UI      │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **4. Derived Math-  │ • Amount Z-score vs 90d baseline│ **Computed   │ Ephemeral feature  │
│    ematical Feat.** │ • Clipboard paste velocity      │   in < 1ms** │ vectors; flushed   │
│                     │ • Semantic Clash Cosine Distance│              │ immediately        │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **5. Synthetic      │ • Agent-Based Simulated Sessions│ **Prototype  │ Zero real PII;     │
│    Prototype Data** │ • Synthetic Indian Scam Scripts │   Testing**  │ scientifically     │
│                     │ • Mock Core Banking Databases   │              │ benchmarked        │
├─────────────────────┼─────────────────────────────────┼──────────────┼────────────────────┤
│ **6. Inaccessible / │ • Private WhatsApp / SMS inbox  │ **STRICTLY   │ **ILLEGAL:** Wire- │
│    Forbidden Data** │ • Phone microphone call audio   │   OFF-LIMITS │ tapping under      │
│                     │ • External bank account turnover│              │ Telegraph Act 1885 │
└─────────────────────┴─────────────────────────────────┴──────────────┴────────────────────┘
```

---

## 3. Data Governance and the DPDP Act 2023

GuardianPay enforces four non-negotiable statutory governance rules:
1. **Data Minimization:** The system captures only the minimum telemetry required to compute risk. It does not track GPS location, contact address books, or browsing history.
2. **Ephemeral Biometric Isolation:** Sensor telemetry (touch hesitation, keystroke dynamics) is computed strictly in volatile device RAM and discarded immediately after feature extraction.
3. **Pseudonymization of Customer Identifiers:** User account IDs and mobile numbers are hashed via `HMAC-SHA256` with daily rotating salts before being written to server-side feature caches.
4. **Purpose Limitation:** Transaction data is used strictly for real-time scam interception and regulatory fraud auditing; it is never monetized or shared with third-party ad networks.

---

## 4. Data Lifecycle and Retention Schedules

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA RETENTION SCHEDULE MATRIX                               │
├─────────────────────┬───────────────────┬─────────────────────────────────────────────────┤
│ DATA ASSET          │ RETENTION PERIOD  │ STORAGE TIER & DISPOSAL PROTOCOL                │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Raw Biometrics**  │ **0 Seconds**     │ Processed in volatile RAM; flushed immediately  │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Session Context** │ **10 Minutes**    │ In-memory Redis cache; auto-purged via TTL      │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Feature Vectors** │ **90 Days**       │ Aerospike feature store; rolling FIFO window    │
├─────────────────────┼───────────────────┼─────────────────────────────────────────────────┤
│ **Audit Dossiers**  │ **7 Years**       │ AWS S3 Object Lock Compliance WORM Storage      │
│                     │                   │ (Mandated by RBI Master Directions on Audit)    │
└─────────────────────┴───────────────────┴─────────────────────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

The Data Strategy ensures that GuardianPay is **legally bulletproof and technically grounded**: it leverages high-value native payment signals (`RespValAdd`, telephony state) while strictly respecting the statutory privacy boundaries of Indian law.

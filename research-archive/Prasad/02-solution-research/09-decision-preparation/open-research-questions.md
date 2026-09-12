# Open Research Questions: Unresolved Uncertainties, Technical Risks, and Priority Backlog

---

## 1. Executive Understanding
A rigorous research phase must culminate in an **honest, explicit accounting of what remains unknown**. Pretending that all scientific, legal, and operational questions have been resolved is the definitive marker of superficial analysis.

Following our comprehensive solution-space survey, we classify remaining uncertainties across **eight critical research domains**, ranking each by its potential to impact system architecture in Phase 3.

---

## 2. The Open Research Question Backlog

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           OPEN RESEARCH QUESTION BACKLOG                                  │
├─────────────────────┬─────────────────────────────────────────────────┬───────────────────┤
│ UNCERTAINTY DOMAIN  │ SPECIFIC RESEARCH INQUIRY                       │ PRIORITY RANKING  │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **1. Technical /    │ • What is the exact inference latency of INT8   │ **CRITICAL**      │
│    On-Device SLM**  │   quantized IndicBERT on budget MediaTek Helio  │ (Determines edge  │
│                     │   processors ($100 Indian Android phones)?      │  vs cloud design) │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **2. Platform OS /  │ • Can OTT VoIP calls (WhatsApp / Telegram voice)│ **CRITICAL**      │
│    VoIP Detection** │   be reliably detected via native Android APIs  │ (Major blind spot │
│                     │   without requiring high-risk permissions?      │  for phone calls) │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **3. Regulatory &   │ • Will the DPDP Act 2023 Rules classify local   │ **CRITICAL**      │
│    DPDP Compliance**│   touch dwell dynamics as sensitive biometrics? │ (Governs sensor   │
│                     │ • Expected RBI mandates on 4-hour cooling-off?  │  feature design)  │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **4. Behavioral &   │ • What is the empirical completion rate of      │ **IMPORTANT**     │
│    UX Friction**    │   legal-name typing challenges among elderly /  │ (Direct impact    │
│                     │   semi-literate users in rural India?           │  on abandonment)  │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **5. Security /     │ • Can fraudsters trick victims into paying via  │ **IMPORTANT**     │
│    Adversarial**    │   split micro-transactions below the friction   │ (Governs dynamic  │
│                     │   trigger threshold across multiple accounts?   │  velocity rules)  │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **6. Data & Text    │ • What percentage of real-world Indian UPI scam │ **IMPORTANT**     │
│    Prevalence**     │   transactions actually contain informative     │ (Validates NLP    │
│                     │   payment notes versus completely blank strings?│  feature utility) │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **7. Evaluation &   │ • How accurately does an Agent-Based Simulator  │ **USEFUL**        │
│    Fidelity**       │   model real-world human panic and irrationality│ (Affects benchmark│
│                     │   during high-stakes extortion?                 │  credibility)     │
├─────────────────────┼─────────────────────────────────────────────────┼───────────────────┤
│ **8. IP & Novelty** │ • Are dynamic cognitive challenge interlocks in │ **USEFUL**        │
│                     │   mobile payment apps already patented?         │ (Affects hackathon│
│                     │                                                 │  differentiation) │
└─────────────────────┴─────────────────────────────────────────────────┴───────────────────┘
```

---

## 3. Deep Analysis of Critical Priority Questions

### Critical Question 1: Budget Mobile Hardware Latency
- **The Challenge:** India's smartphone market is dominated by low-cost devices ($80–$150) powered by low-end processors (MediaTek Helio G-series, Unisoc T606) with 3GB–4GB RAM.
- **The Research Need:** Benchmarking whether a 4-bit quantized Small Language Model (e.g., MobileBERT / Qwen-0.5B-Instruct via ONNX Runtime Mobile) can execute text classification within **$<35\text{ms}$** without triggering memory-pressure app kills.
- **Contingency:** If on-device NPU compute is too slow on budget phones, semantic classification must execute on edge cloud gateways during the pre-PIN review pause.

### Critical Question 2: The OTT VoIP Detection Barrier
- **The Challenge:** While cellular calls trigger Android's `TelephonyManager.CALL_STATE_OFFHOOK`, modern scammers increasingly use **WhatsApp or Telegram voice calls** to evade telecom spam filters.
- **The Research Need:** Investigating whether querying Android's `AudioManager.getMode()` (which returns `MODE_IN_COMMUNICATION` when a VoIP call is active) or inspecting active `AudioDeviceInfo` can reliably detect WhatsApp calls without requiring high-risk permissions that trigger Google Play de-listing.

### Critical Question 3: The Rural UX & Literacy Friction Boundary
- **The Challenge:** Forcing a user to type the legal name "RAMESH PATEL" works well for literate smartphone users in tier-1 cities. In rural India, semi-literate users utilizing voice-based UPI (UPI 123Pay or regional vernacular apps) may struggle with typing English text challenges.
- **The Research Need:** Designing **Vernacular Voice-Assisted Cognitive Challenges** where the phone speaks: *"Aap Ramesh Patel ko paise bhej rahe hain, kisi company ko nahi. Kya aap inhe jaante hain?"* and requires a simple, unmistakable voice or physical gesture confirmation.

---

## 4. Phase 3 Resolution Strategy

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      PHASE 3 UNCERTAINTY RESOLUTION ROADMAP                               │
├─────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ UNCERTAINTY         │ RESOLUTION PROTOCOL IN PHASE 3  │ ACCEPTANCE CRITERIA               │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **On-Device SLM**   │ Benchmark ONNX Runtime INT8 on  │ Latency < 40ms; RAM < 80MB on     │
│                     │ emulated low-end Android ARM64  │ low-tier hardware profile         │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **VoIP Call State** │ Test `AudioManager` mode flags   │ 100% reliable detection of active │
│                     │ against WhatsApp/Telegram calls │ WhatsApp audio with zero privs    │
├─────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ **Blank Note Ratio**│ Empirical survey of published   │ Establish sensitivity of fallback │
│                     │ I4C and bank chargeback reports │ conjunction features (Call+Amt)   │
└─────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

1. **Acknowledge the VoIP Blind Spot:** Acknowledge upfront that cellular calls are easy to detect, while WhatsApp calls require specialized audio-mode polling.
2. **Prioritize Edge-Cloud Hybridity:** Because device hardware in India is highly heterogeneous, the architecture must support **dynamic compute shifting**: running on-device on flagship phones, and falling back to edge gateways on low-tier phones.
3. **Focus Phase 3 System Design on Resolving the Top 3 Critical Uncertainties.**

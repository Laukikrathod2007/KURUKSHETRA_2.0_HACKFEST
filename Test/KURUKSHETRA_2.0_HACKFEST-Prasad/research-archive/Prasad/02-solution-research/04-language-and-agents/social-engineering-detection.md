# Social-Engineering Detection: Semantic Intent, Psychological Manipulation, and Multilingual NLP

---

## 1. Executive Understanding
Social engineering does not hack software; it **exploits human cognitive heuristics**. Scammers manipulate psychological vulnerabilities—fear of authority, fear of loss, manufactured urgency, or greed—to compel victims into willingly transferring funds.

A persistent pathology in amateur security engineering is treating social-engineering detection as a **keyword matching exercise** (e.g., scanning for "urgent", "police", or "lottery"). Keyword filters suffer from catastrophic false-positive rates and trivial adversarial evasion. True social-engineering detection requires **semantic intent classification, psychological pressure taxonomy modeling, and multilingual code-switched (Hinglish) text comprehension**.

---

## 2. Why Keyword Matching ≠ Social-Engineering Detection

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                     KEYWORD MATCHING VS. SEMANTIC INTENT ANALYSIS                         │
├───────────────────┬───────────────────────────────────┬───────────────────────────────────┤
│ TEST PHRASE       │ NAIVE KEYWORD FILTER ("POLICE")   │ SEMANTIC INTENT & ENTITY MODEL    │
├───────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ "Traffic police   │ **FLAGGED AS SCAM (False Pos.)**  │ **SAFE:** Matches official e-challan│
│  fine challan"    │ Contains keyword "police"         │ utility portal VPA (MCC 9311)     │
├───────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ "Transfer fee for │ **FLAGGED AS SCAM (False Pos.)**  │ **SAFE:** Standard P2P tuition/hostel│
│  police academy"  │ Contains keyword "police"         │ payment between private individuals│
├───────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ "Clear your legal │ **MISSED (False Negative)**       │ **SCAM DETECTED:** Coercive legal │
│  case settlement" │ Attacker deliberately avoids the  │ threat combined with urgent P2P   │
│                   │ word "police" or "arrest"         │ individual fund transfer          │
├───────────────────┼───────────────────────────────────┼───────────────────────────────────┤
│ "Turant bhejo nahi│ **MISSED (False Negative)**       │ **SCAM DETECTED:** Indic urgency  │
│  toh bati gul"    │ Code-switched Hinglish; zero      │ threat (electricity cut-off) to   │
│                   │ standard English dictionary match │ personal mobile VPA               │
└───────────────────┴───────────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Taxonomy of Psychological Manipulation Vectors

Modern social-engineering classifiers model text against five distinct psychological exploitation axes:

```
                          PSYCHOLOGICAL MANIPULATION TAXONOMY
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 1. AUTHORITY & COERCION (Fear of Legal Sanction)                                        │
  │    • Exploits institutional intimidation (CBI, ED, Cyber Crime Police, Supreme Court)   │
  │    • Narrative: "Your Aadhaar is implicated in drug trafficking; pay bond for clearance"│
  ├─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2. TIME SCARCITY & URGENCY (Manufactured Panic)                                         │
  │    • Compresses decision window to bypass deliberate, rational thinking                 │
  │    • Narrative: "Power connection will be disconnected tonight at 9:30 PM if unpaid"    │
  ├─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 3. COGNITIVE INOCULATION (Preempting Detection Warnings)                                │
  │    • Instructs victim to ignore system security prompts                                 │
  │    • Narrative: "The bank will show a red fraud warning because it is a test account"   │
  ├─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 4. ASYMMETRIC REWARD / GREED (Sunk-Cost Exploitation)                                   │
  │    • Entices victim with compounding micro-tasks and fabricated investment returns      │
  │    • Narrative: "Transfer ₹10,000 VIP fee to release your accumulated ₹1,50,000 profit" │
  ├─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 5. EMOTIONAL EMPATHY / PRETEXTING (Family in Distress)                                 │
  │    • Impersonates a child, friend, or relative facing an immediate medical crisis       │
  │    • Narrative: "Accident in hospital, phone broken, pay doctor immediately at this VPA"│
  └─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Algorithmic Architectures for Text & Intent Classification

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      NLP ARCHITECTURES FOR SOCIAL ENGINEERING                             │
├─────────────────────┬───────────────────────────────┬──────────────┬──────────────────────┤
│ ARCHITECTURE        │ MODEL / FORM FACTOR           │ LATENCY      │ DEPLOYMENT LOCATION  │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **1. Quantized      │ • IndicBERT / MobileBERT      │ 15 - 35 ms   │ **On-Device (Local)**│
│   Small Transformer │ • 4-bit INT8 ONNX Runtime     │ (CPU/NPU)    │ Private, zero cloud  │
│   (SLM)**           │ • Fine-tuned on scam intent   │              │ network dependency   │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **2. Cloud-Based    │ • RoBERTa-large / DeBERTa-v3  │ 80 - 150 ms  │ **Edge Cloud Gate**  │
│   Transformer**     │ • Multi-label classification  │ (Network+GPU)│ Server-side pre-PIN  │
│                     │ • 14 psychological classes    │              │ evaluation pipeline  │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **3. Multimodal OCR │ • Tesseract / EasyOCR + BERT  │ 150 - 400 ms │ **Client / Cloud**   │
│   Pipeline**        │ • Inspects uploaded fake FIRs,│              │ Evaluates scanned    │
│                     │   notices, or payment slips   │              │ fake document images │
├─────────────────────┼───────────────────────────────┼──────────────┼──────────────────────┤
│ **4. Large Language │ • Llama-3-8B / Claude-3.5     │ 800 - 2500 ms│ **Cold / Deep Path** │
│   Model (LLM)**     │ • Complex multi-step reasoning│ (High latency│ Post-flag review /   │
│                     │   and contextual explanation  │  and cost)   │ Interactive dialogue │
└─────────────────────┴───────────────────────────────┴──────────────┴──────────────────────┘
```

### The Multilingual Challenge: Code-Switched Indic Text
In the Indian subcontinent, over 80% of scam communications utilize **code-mixed Hinglish** (Hindi written in the Latin alphabet) or regional vernaculars (Tamil-English, Telugu-English):
- *Example:* "Aapka bijli connection kaat diya jayega agar turant bill update nahi kiya."
- Standard English models (like base BERT or RoBERTa) fail on these strings because tokenizers fragment code-mixed words into uninformative sub-words.
- **Solution:** Fine-tuning multilingual encoders (e.g., **AI4Bharat's IndicBERT** or **mDeBERTa**) trained on native Indian social media and messaging corpora, coupled with phonetic transliteration normalizers.

---

## 5. Adversarial Robustness and Counter-Techniques

1. **Adversarial Typo Injection:** Scammers intentionally insert zero-width spaces, special characters, or homoglyphs into text (`C.B.I`, `P0LICE`, `URG3NT`) to break sub-word tokenization.
   - *Mitigation:* Robust regex-based text normalization and character-level embedding layers.
2. **The "Empty Text" Escape:** The most effective adversarial countermeasure is simply **instructing the victim to leave the payment note empty**.
   - *Epistemic Reality:* An NLP classifier cannot classify text that does not exist. Therefore, social-engineering detection can **never exist as an isolated text classifier**; it must operate in tandem with behavioral and recipient verification.

---

## 6. Epistemic Assessment for PS09

| Dimension | Social-Engineering NLP Reality | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Intent Understanding** | **High:** Small fine-tuned models can reliably classify urgency, coercion, and authority impersonation. | Essential for analyzing payment notes, scanned notices, and user prompts. |
| **On-Device Execution** | **Proven:** Quantized IndicBERT / MobileBERT runs in under 30ms on modern smartphone NPUs. | Enables **private, on-device semantic screening** of in-app text without leaking user data to cloud APIs. |
| **Complete Scam Defense** | **Insufficient Alone:** Completely blind when scammers instruct victims to omit notes or when communication is oral. | Must be fused into a multi-signal risk matrix alongside behavioral and recipient intelligence. |

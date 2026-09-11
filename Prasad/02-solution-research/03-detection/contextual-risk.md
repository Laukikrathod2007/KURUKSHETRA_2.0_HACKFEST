# Context-Aware Payment Risk: Semantic Correlation, Ingress Channels, and Narrative Synthesis

---

## 1. Executive Understanding
In classical card-not-present fraud, risk is evaluated through **transactional physics**: amount, velocity, IP geolocation, and device cardhash. In social-engineering scams, however, the transactional physics appear normal. What makes the payment fraudulent is the **external narrative that induced it**.

**Context-Aware Payment Risk** is the discipline of evaluating a payment not merely as a numerical transfer between two addresses, but within the **full operational and narrative context of its initiation**. This includes the ingress channel (scanned QR vs. deep link vs. clipboard paste), linguistic notes, discrepancies between stated intent and legal payee entity, and temporal proximity to external communications.

---

## 2. Taxonomy of Contextual Telemetry Channels

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           CONTEXTUAL RISK TELEMETRY SPECTRUM                              │
├─────────────────────┬─────────────────────────────────────┬──────────────┬────────────────┤
│ INGRESS CHANNEL     │ EXTRACTABLE CONTEXT                 │ ATTACK SURFACE│ SCAM RELEVANCE │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **1. Payment Note   │ • Free-form string (`tn` parameter) │ Attacker can │ High when      │
│   Linguistics**     │ • Claims of purpose ("penalty",     │ instruct to  │ present; can be│
│                     │   "police verification", "refund")  │ leave blank  │ suppressed     │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **2. URI Deep Link  │ • Intent URI origin (WhatsApp link, │ High         │ Extreme        │
│   Metadata**        │   SMS link, browser redirect)       │ (Spoofable   │ (Phishing link │
│                     │ • Injected `am`, `pn`, `cu` params  │  domains)    │  detection)    │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **3. QR Code Pay-   │ • Static paper sticker vs Dynamic   │ QR tampering │ High           │
│   load Inspection** │   terminal display vs Screen image  │ sticker swap │ (Fake merchant │
│                     │ • Encoded merchant category & params│              │  QR deception) │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **4. Clipboard      │ • Latency between app focus & paste │ Attacker-    │ Critical for   │
│   Ingress Dynamics**│ • Clipboard string entropy & source │ directed     │ out-of-band    │
│                     │ • Detection of copied account info  │ copy-paste   │ chat guidance  │
├─────────────────────┼─────────────────────────────────────┼──────────────┼────────────────┤
│ **5. Entity-Purpose │ • Discrepancy between stated note   │ Invariant to │ **The Gold     │
│   Semantic Clash**  │   ("Electricity Bill") and recipient│ attacker     │ Standard       │
│                     │   KYC name ("Raju Paswan")          │ manipulation │ Discriminator**│
└─────────────────────┴─────────────────────────────────────┴──────────────┴────────────────┘
```

---

## 3. The Entity-Purpose Semantic Clash (The Core Contextual Triad)

The most powerful contextual detection mechanism in digital payments is the **Triangular Semantic Consistency Check**:

```
                       THE TRIANGULAR CONSISTENCY CHECK
                          [Stated Purpose / Note]
                          "Customs Clearance Duty"
                                     ▲
                                    ╱ ╲
     Semantic Inconsistency        ╱   ╲  Unusual Ticket Size
     (Duty cannot be paid         ╱     ╲ for Regulatory Fee
      to Individual Account)     ╱       ╲
                                ▼         ▼
        [Resolved KYC Recipient] ─────────► [Transaction Magnitude]
         "Sunil Kumar (P2P)"                   ₹84,500
```

1. **Stated Purpose:** Derived from payment note (`tn`), scanned invoice metadata, or user prompt.
2. **Resolved Recipient Identity:** Cryptographic legal name from CBS via `RespValAdd` + MCC code.
3. **Transaction Amount:** Financial magnitude.

### Mathematical Formulation
Let $E_{\text{purpose}}$ be the semantic text embedding of the stated purpose, $E_{\text{payee}}$ be the semantic embedding of the resolved payee identity and category, and $A$ be the transaction amount.
$$\text{ClashScore} = 1.0 - \text{CosineSimilarity}(E_{\text{purpose}}, E_{\text{payee}})$$
If the stated purpose relates to **Government / Regulatory / Police / Utility** and the resolved payee category is **Individual P2P**, $\text{ClashScore} \to 1.0$, immediately elevating the transaction to Critical Intervention tier.

---

## 4. Ingress Channel Profiling: Deep-Links vs. Scanned QRs

The technical pathway through which a payment is initiated carries strong prior probabilities:
- **Scan-and-Pay at Merchant (Physical QR):** Scanned via camera hardware; device location matches merchant terminal coordinates; typical ticket size ₹50–₹2,000 $\to$ **Baseline Safe (P(Scam) < 0.001)**.
- **Deep-Link from External App (e.g., WhatsApp/Telegram):** Payment initiated via `upi://pay?...` intent fired from an untrusted messaging package; contains pre-filled amount and unverified display name $\to$ **Elevated Prior (P(Scam) = 0.08)**.
- **Clipboard Ingress:** User opens payment app, immediately clicks "To Bank/UPI ID", and pastes a VPA within 120ms of opening $\to$ Indicates out-of-band social coaching $\to$ **Elevated Prior (P(Scam) = 0.12)**.

---

## 5. Adversarial Adaptation: The "Blank Note" Countermeasure

When automated systems begin filtering transactions based on suspicious keywords in payment notes (`tn`):
1. **Attacker Inoculation:** Fraud syndicates immediately update their calling scripts:
   > *"Sir, when PhonePe opens, do not type anything in the note field. Keep it completely blank, otherwise the bank server will reject your security deposit."*
   or
   > *"Type 'Family Gift' in the note field."*
2. **The "Missing Context" Dilemma:** Because payment notes are optional in UPI, over 75% of legitimate transactions have blank notes. A blank note cannot be treated as suspicious by default without generating massive false positives.
3. **Defense Counter-Measure:** The system cannot rely on user-entered text alone; it must evaluate **Context Discrepancy by Ingress**:
   - If a payment is ₹50,000 to an unknown individual with a blank note and an active phone call, the **conjunction of missing expected context + high value + external guidance** becomes the primary feature.

---

## 6. Epistemic Assessment for PS09

| Dimension | Context-Aware Risk Capability | Implication for PS09 Architecture |
| :--- | :--- | :--- |
| **Semantic Inconsistency** | **Decisive:** The only technique capable of exposing impersonation without relying on blacklists. | Core differentiator; should form a key analytical capability in the guardian. |
| **Ingress Channel Tracking** | **High Fidelity:** Native Android/iOS intent inspection provides reliable origin telemetry. | The app client should tag transactions with their exact ingress provenance (QR/Link/Paste). |
| **Linguistic Vulnerability** | **Adversarially Fragile:** Attackers can easily instruct victims to falsify or omit notes. | Text analysis must be a **reinforcing feature**, never the sole gatekeeper. |
| **Privacy Boundaries** | **Strict:** The payment app can only inspect the UPI URI params and in-app text, not external chats. | Must operate strictly on the boundary data received at payment entry. |

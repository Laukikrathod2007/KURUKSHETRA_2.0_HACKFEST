# Final Problem Definition: Authorized Push Payment Scam Interception in Indian UPI

---

## 1. Executive Problem Statement

> **Digital payments in India have perfected real-time frictionless settlement, but this very speed has created an asymmetric vulnerability: Authorized Push Payment (APP) scams, where legitimate, authenticated users are psychologically coerced or deceived into willingly executing irrevocable transfers to organized criminal mule networks.**

In the Indian Unified Payments Interface (UPI) ecosystem, existing security infrastructure successfully validates **Authentication (AuthN)**—confirming that the correct hardware device, SIM binding, biometric, and 4/6-digit MPIN were supplied. However, the ecosystem has **zero visibility into Authorization Intent (AuthZ)**—whether the remitter is acting with genuine uncoerced intent or operating under acute psychological manipulation, institutional impersonation, or manufactured panic.

**PS09 defines the construction of an intelligent, multi-signal interception guardian that detects deception and coercion in real-time during the pre-commitment window, breaking the victim's compliance state through adaptive cognitive friction before funds leave the account.**

---

## 2. Definitive Problem Scope and Operating Bounds

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           PROBLEM BOUNDARY SPECIFICATION                                  │
├─────────────────────┬─────────────────────────────────────────────────────────────────────┤
│ BOUNDARY DIMENSION  │ SYSTEM SPECIFICATION                                                │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Primary Actor**   │ Indian retail payment remitter using a UPI smartphone app (TPAP).   │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Protected Asset** │ Retail bank deposits, liquid savings, and UPI-linked accounts.       │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Core Adversary**  │ Coordinated social-engineering syndicates operating mule networks    │
│                     │ (Digital Arrest, fake utility bills, task scams, customer support). │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Interception      │ **The Pre-PIN Review Window (1.5s - 4.0s)** in the `PENDING_AUTH`   │
│   Chokepoint**      │ state, strictly inside the TPAP before NPCI Common Library handoff. │
├─────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ **Primary Failure   │ Post-facto 1930 / I4C reporting fails because funds are laundered   │
│   of Status Quo**   │ via ATM/crypto within 2–5 minutes; passive app banners are ignored. │
└─────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### In-Scope Attack Classes
1. **Institutional Impersonation / "Digital Arrest":** Scammers posing as CBI, ED, Mumbai Police, or Supreme Court coercing victims into "clearance bonds".
2. **Fake Utility & Service Disconnection:** Urgent threats to sever electricity, water, or telecom services within hours unless an immediate fee is transferred.
3. **Task & High-Yield Investment Ponzi Funnels:** Multi-stage telegram/WhatsApp investment tasks escalating into large outbound transfers.
4. **Remote Access Screen-Sharing:** Scammers inducing victims to install AnyDesk, TeamViewer, or RustDesk for "refunds".
5. **Collect Request (`ReqPay`) Inversion:** Tricking victims into typing their MPIN under the false premise of "receiving" money.
6. **Lookalike / Typo-Squatted Payee Handles:** Personal handles masquerading as institutional services (`sbi.verification@ybl`).

### Out-of-Scope Threat Vectors
1. **Account Takeover via SIM Cloning / Physical Theft:** Governed by telecom KYC and device-binding layers.
2. **Automated Credential Stuffing / Brute-Force MPIN:** Governed by bank CBS rate-limiters and NPCI hardware security modules.
3. **Merchant E-Commerce Product Dispute / Friendly Fraud:** Non-delivery of goods by registered merchants (governed by ODR / chargeback workflows).
4. **Corporate ERP Wire Fraud / SWIFT / RTGS Host-to-Host Attacks:** Wholesale banking risk outside the retail consumer envelope.

---

## 3. Why This Problem Requires Intervention

Under current Indian jurisprudence (**RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18**), customers bear **100% financial liability** if they willingly entered their MPIN or shared credentials:

```
               THE REGULATORY AND OPERATIONAL LIABILITY GAP
  ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
  │ UNAUTHORIZED THIRD-PARTY FRAUD  │       │ AUTHORIZED PUSH PAYMENT (APP)   │
  │ (Account Takeover, Card Skim)   │       │ (Digital Arrest, Coerced Wire)  │
  ├─────────────────────────────────┤       ├─────────────────────────────────┤
  │ • Customer entered NO PIN       │       │ • Customer entered VALID PIN    │
  │ • Bank bears 100% liability     │       │ • Customer bears 100% loss      │
  │ • Aggressively blocked by banks │       │ • Ignored by bank risk engines  │
  └─────────────────────────────────┘       └─────────────────────────────────┘
```

Because banks historically faced zero financial loss from APP scams, payment systems were optimized solely for transaction velocity. The result is an epidemic causing **over ₹1,750 Crore in consumer losses annually (I4C 2024 data)**, with recovery rates below 10%.

---

## 4. What This Problem Is NOT

To maintain absolute architectural discipline, the engineering team must continuously enforce what this system is **NOT**:
1. **NOT a Post-Facto Recovery Portal:** We are not building a ticket management system for filing police FIRs or requesting bank account freezes after the money has fled. We are an **in-line real-time interceptor**.
2. **NOT a General-Purpose Chatbot:** We are not providing a general financial advisor or conversational agent that the user voluntarily consults. The system is a **protective security interlock** triggered conditionally by risk telemetry.
3. **NOT a Passive Text Warning Engine:** We are not rendering dismissible yellow/red banners that say *"Be careful"*. Research proves passive banners suffer 95%+ habituation blindness.
4. **NOT an Autonomous Fund Mover:** The system does not hold write permissions to user bank accounts, cannot debit funds, and cannot transfer balances.
5. **NOT an Invasive Surveillance Spyware:** We do not inspect private WhatsApp chats, monitor SMS inboxes, or record microphone audio. Such proposals violate the DPDP Act 2023 and Google Play policies.

---

## 5. Success Criteria for PS09

The problem is successfully solved if and only if:
1. **Interception Efficacy:** The system intercepts $\ge 85\%$ of targeted in-scope APP scam transactions before the MPIN screen is invoked.
2. **Asymmetric Cognitive Friction:** Friction is concentrated strictly on ambiguous/malicious transactions ($<0.5\%$ of volume), preserving frictionless sub-10ms execution for safe commerce.
3. **De-escalation Impact:** Dynamic cognitive challenges prompt $\ge 60\%$ of coerced victims to voluntarily abort fraudulent transfers.
4. **Zero Latency Degradation:** Hot-path risk evaluation executes in $<15\text{ms}$, fully compliant with national UPI switch SLAs.

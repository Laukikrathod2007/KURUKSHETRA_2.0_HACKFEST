# Payment Fraud Fundamentals: Legal Typologies, Technical Vectors, and Detection Evidence

---

## 1. Executive Understanding (Layer 1)
In jurisprudence and financial criminology, **fraud** is an intentional perversion of truth for the purpose of inducing another in reliance upon it to part with some valuable thing belonging to him or to surrender a legal right. Under Indian penal jurisprudence (previously Section 420 of the Indian Penal Code, now **Section 318 of the Bharatiya Nyaya Sanhita, 2023**), fraud involves dishonest inducement leading to wrongful gain for the perpetrator and wrongful loss to the victim.

In digital payment systems, **payment fraud** traditionally refers to **unauthorized transactions**—scenarios where an attacker breaches technological controls, compromises access credentials, or hijacks an authenticated session to transfer funds without the knowledge, presence, or genuine participation of the authentic account owner. 

Understanding traditional fraud is essential because the multi-billion dollar fraud detection industry (FICO Falcon, LexisNexis ThreatMetrix, NetGuardians) was engineered specifically to detect these unauthorized technical breaches. When applied to social-engineering scams, these legacy systems fail catastrophically because their core assumptions about what constitutes "fraudulent evidence" do not hold.

---

## 2. Structural Typology & Taxonomy of Fraud (Layer 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PAYMENT FRAUD CLASSIFICATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. FIRST-PARTY FRAUD            2. SECOND-PARTY FRAUD                     │
│   • Friendly Fraud (Chargeback)   • Account holder colludes with a friend   │
│   • Sleeper / Bust-Out Fraud      • Sells/rents account credentials         │
│   • Intentional default           • "Rent-a-Mule" syndicate operations      │
│                                                                             │
│   3. THIRD-PARTY FRAUD (UNAUTHORIZED TECHNICAL BREACH)                      │
│   ┌───────────────────────────────┬─────────────────────────────────────┐   │
│   │ Credential Compromise         │ Device & Network Attacks            │   │
│   │ • Phishing / Credential Stuff │ • SIM Swap / Telecom Intercept      │   │
│   │ • Keylogger / Malware Spyware │ • Man-in-the-Middle (MITM)          │   │
│   │ • Database Dumps / Dark Web   │ • Session Token Hijacking           │   │
│   └───────────────────────────────┴─────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Fraud Category | Primary Mechanism | Attacker Goal | Primary Evidence Traces |
| :--- | :--- | :--- | :--- |
| **Account Takeover (ATO)** | Credential stuffing, password reuse, session cookie theft. | Total control of victim's digital banking profile. | New device fingerprint, unfamiliar IP geolocation, sudden password reset preceding transfer. |
| **SIM Swapping** | Social engineering of telecom operator to reassign victim's IMSI. | Intercept SMS-based OTPs and two-factor tokens. | Telecom network reset event, phone unreachability, immediate device re-registration. |
| **Banking Malware / Trojans** | Malicious APKs (overlay attacks, accessibility service abuse). | Read screen, log keystrokes, auto-dispatch transfers. | Active Accessibility API usage, screen overlay flags, unverified app sideloading. |
| **Synthetic Identity Fraud** | Combining real and fabricated KYC data (forged PAN + real Aadhaar). | Open lines of credit or mule accounts that have no real human victim to complain. | Inconsistent credit bureau history, mismatched address databases, newly aged bureau files. |
| **Card Not Present (CNP) Fraud** | Stolen CVV, magnetic stripe cloning, web skimming. | Unauthorized e-commerce purchasing. | Velocity bursts across multiple merchant categories, billing/shipping address mismatch. |

---

## 3. The Technical Fraud Lifecycle & Observable Evidence (Layer 3)

### 3.1 The 4-Stage Unauthorized Fraud Lifecycle
```
[Stage 1: Reconnaissance & Infiltration]
Attacker harvests credentials via phishing kit, database dump, or malware dropper.
       │
       ▼
[Stage 2: Perimeter Breach & Account Access]
Attacker authenticates using stolen credentials, bypassing or intercepting OTP.
       │
       ▼
[Stage 3: Cash Extraction (Monetization)]
Attacker dispatches maximum permissible balance to mule account or digital gift cards.
       │
       ▼
[Stage 4: Laundering & Dispersal]
Funds layered through P2P crypto desks, hawala networks, or ATM cash-outs.
```

### 3.2 Evidence Signals of Traditional Technical Fraud
Legacy fraud detection engines rely on specific anomaly signals that emerge during Stage 2 and Stage 3:
1. **Hardware & Device Discontinuities:** An unknown IMEI, MAC address, canvas fingerprint, or Android ID that has never completed a transaction for this account.
2. **Kinematic & Behavioral Anomalies:** "Impossible Travel Velocity" (e.g., user transacted in Mumbai 10 minutes ago, and is now attempting a transfer from an IP address in Bucharest).
3. **Session Telemetry:** Keystroke dynamics (copy-pasting credentials rather than typing; typing speed exceeding human capability indicating bot automation).
4. **Network Footprint:** Traffic originating from Tor exit nodes, commercial VPN data centers, or known bulletproof hosting providers.

---

## 4. Boundaries, Misconceptions & Epistemic Realities (Layer 4)

### 4.1 Why Traditional Fraud Engines Are Structurally Blind to PS09
* In traditional fraud, the **attacker is the actor**. Therefore, hardware signals, IP addresses, keystrokes, and biometric typing all belong to the attacker—creating massive statistical anomalies against the legitimate user's baseline.
* In **Payment Scams (PS09)**, the **victim is the actor**. The hardware is the victim's phone; the IP is the victim's residential Wi-Fi; the biometric is the victim's thumb; the MPIN is typed by the victim's fingers.
* **Epistemic Invariant:** A fraud engine designed to catch unauthorized breaches will assign a scam transaction a **near-zero risk score**, because from a technical and perimeter standpoint, the transaction is 100% genuine!

---
**Primary References:**
1. Association of Certified Fraud Examiners (ACFE): *Occupational Fraud 2024: A Report to the Nations*.
2. Bharatiya Nyaya Sanhita, 2023: *Section 318 (Cheating and Dishonestly Inducing Delivery of Property)*.
3. European Union Agency for Cybersecurity (ENISA): *Threat Landscape for Financial Sector: Account Takeover and Credential Stuffing*.

# Granular Scam Taxonomy: Technical Entry Points, Exploited Heuristics, and Footprints

---

## 1. Executive Understanding
A robust scam interception system requires an exhaustive, structured taxonomy of attacks. Rather than treating scams as generic "social engineering," this taxonomy categorizes the threat landscape across **four operational families**:
1. **Authority & Coercion-Driven Scams** (High terror, large financial extraction, multi-day isolation).
2. **Incentive & Reciprocity-Driven Scams** (Greed, sunk cost, multi-stage task escalation).
3. **Procedural & Protocol Deception** (Exploiting mental confusion between sending vs receiving money).
4. **Device-Assisted Hybrid Attacks** (Combining social engineering with remote access tooling).

---

## 2. Granular Scam Taxonomy Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 4 SCAM OPERATIONAL FAMILIES                       │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ 1. AUTHORITY & COERCION │ 2. INCENTIVE & LURES    │ 3. PROTOCOL DECEPTION   │
│ • Digital Arrest (CBI)  │ • Part-time YouTube task│ • Reverse QR ("Receive")│
│ • Electricity bill cut  │ • VIP Stock trading app │ • Deceptive Collect Req │
│ • Courier / Drug parcel │ • Fake loan disbursement│ • Spoofed Payment Links │
├─────────────────────────┴─────────────────────────┴─────────────────────────┤
│ 4. DEVICE-ASSISTED HYBRID ATTACKS                                           │
│ • Fake customer care SEO $\rightarrow$ AnyDesk / RustDesk remote control    │
│ • Malicious APK SMS forwarders / Banking accessibility overlays             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| ID | Scam Archetype | Entry Point & Channel | Exploited Heuristic | Transaction Footprint | Counterparty Footprint | Detection Opportunities |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A1** | **Digital Arrest** | Spoofed IVR $\rightarrow$ Skype Video Call | Authority (CBI), Fear, Isolation | ₹1 Lakh to ₹50 Lakhs; multiple rapid RTGS/UPI pushes | New individual/commercial current accounts; distant state | Video call active; high-value anomaly; legal keywords in notes |
| **A2** | **Electricity Cutoff** | Bulk SMS (`VK-POWER`) $\rightarrow$ Phone Call | Urgency ($<2$ hrs), Panic | ₹10 initially $\rightarrow$ ₹50,000 via phishing link | Personal P2P VPA mimicking official utility name | Display name mismatch; high-urgency keywords; collect request |
| **A3** | **Courier / Drug Parcel**| Automated voice call $\rightarrow$ WhatsApp | Fear of imprisonment, Loss aversion | ₹50,000 to ₹10,00,000; breaking FDs | Fresh mule accounts; rapid outward layering | Phone call active; large first-time payee; sudden FD liquidation |
| **B1** | **Part-Time Task Job** | Telegram / WhatsApp unsolicited text | Reciprocity, Sunk Cost Fallacy | Small inward credits (₹150), escalating outward pushes (₹50k) | Diverse personal VPAs; changing every 2 hours | Reversal of flow (inward then outward); "task/deposit" remarks |
| **B2** | **Fake Stock / Crypto** | Instagram / Facebook Ad $\rightarrow$ VIP WhatsApp Group | Social Proof, Greed, Exclusivity | ₹25,000 to ₹1,00,00,000 over weeks | Personal VPA handles labeled "Institutional Broker" | Large amounts to individual VPAs; high frequency to new payees |
| **C1** | **OLX Reverse QR** | Inbound Marketplace chat $\rightarrow$ WhatsApp QR | Procedural confusion ("Scan to receive") | ₹5,000 to ₹50,000; often repeated twice | Individual P2P VPA; static QR with pre-filled debit URI | Inbound QR containing `am` parameter; fast execution; no prior chat |
| **C2** | **Deceptive Collect** | Outbound UPI Collect Request to victim VPA | Inattention, Habitual clicking | ₹2,000 to ₹25,000 | Unregistered entity using deceptive name | Collect request type; unfamiliar requester VPA; urgent remark |
| **D1** | **Customer Care SEO** | Google Search for airline/bank support number | Relieved trust, Procedural guidance | Full account balance drained | Attacker controls device via screen share | Active AnyDesk / TeamViewer package running in background |

---

## 3. Deep Analysis of Complex Multi-Stage Vectors

### 3.1 The Part-Time Task Scam Liquidity Trap (B1)
* **The Cognitive Hook:** Victim receives ₹150 for liking three YouTube videos. This proves the system "really pays."
* **The Escalation:** The victim is added to a VIP Telegram group where bot accounts celebrate large earnings. The victim is assigned a "pre-paid task" requiring ₹5,000 to earn ₹7,500.
* **The Financial Extraction:** Once ₹50,000 is transferred, the platform freezes: *"System error: You made a typo. Transfer ₹1,50,000 to unlock your balance."* Sunk cost bias drives the victim to liquidate savings to recover trapped funds.

### 3.2 The Reverse QR Code Deception (C1)
* **The Mental Model Exploit:** In physical banking, receiving money requires giving an account number. In UPI, consumers know that "QR codes transfer money." Fraudsters exploit this vague mental model to convince sellers that **scanning a QR code receives money**.
* **The Protocol Abuse:** The QR payload encodes an instant debit:
  `upi://pay?pa=mule@upi&pn=Army_Canteen_Credit&am=18000&cu=INR`
  Because the victim expects an incoming credit, they treat the PIN entry screen as an "acceptance authorization."

---
**Primary References:**
1. Reserve Bank of India: *BE(A)WARE – A Booklet on Modus Operandi of Financial Frauds*.
2. Indian Cyber Crime Coordination Centre (I4C): *Compendium of Emerging Modus Operandi in Cyber Financial Crimes*.
3. Interpol Financial Crime and Anti-Corruption Centre (IFCAC): *Global Financial Fraud Assessment (2024)*.

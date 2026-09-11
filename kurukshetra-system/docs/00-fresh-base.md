# Kurukshetra — Master Technical Feature Base & Verification Architecture
## All 33 Features Explained with Exact Banking Protocols, Detection Logic, Zero-Surveillance Privacy Boundaries, and Verification Latency Budgets

---

## 1. System Architecture & Technical Operating Boundary

Kurukshetra operates as an anti-scam intelligence layer and Model Context Protocol (MCP) middleware between client UPI payment applications (Google Pay, PhonePe, Paytm, BHIM), participating Bank Payment Service Providers (PSPs), and the National Payments Corporation of India (NPCI) UPI Switch.

```
                      ┌─────────────────────────────────────────────────────────┐
                      │                     USER & CLIENT                       │
                      │  UPI App (Google Pay / PhonePe / Paytm / BHIM)          │
                      └─────────────────────────────────────────────────────────┘
                                   │                              ▲
       1. ReqValAdd (Recipient Lookup)                            │ 2. RespValAdd + Risk Metadata
                                   ▼                              │    (Abandon Ratio, Account Age)
                      ┌─────────────────────────────────────────────────────────┐
                      │              KURUKSHETRA INTELLIGENCE LAYER             │
                      │               (Deployed as MCP Middleware)               │
                      └─────────────────────────────────────────────────────────┘
                         │             │               │               │
        Query I4C/1930   │             │ Query CBS     │ Query Telecom │ Query Crowd DB
        Registry         ▼             ▼ Graph         ▼ (CNAP/TAFCOP) ▼ (Cross-App MCP)
                  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌──────────────┐
                  │ I4C 1930   │ │ Core Bank  │ │ TRAI CNAP / │ │ Multi-App    │
                  │ Cybercrime │ │ Ledger     │ │ Sanchar     │ │ Verification │
                  │ Registry   │ │ Graph (CBS)│ │ Saathi      │ │ Cluster      │
                  └────────────┘ └────────────┘ └─────────────┘ └──────────────┘
                                   │                              ▲
 3. User taps "Pay"                │                              │ 4. If High-Risk: Cognitive Stepper
    Pre-Flight Intercept           ▼                              │    If Safe: Instant Pass to MPIN
                      ┌─────────────────────────────────────────────────────────┐
                      │             NPCI UPI SWITCH & SETTLEMENT                │
                      │   (MPIN Validation, Escrow Buffer, IMPS Settlement)     │
                      └─────────────────────────────────────────────────────────┘
```

### The Non-Negotiable Privacy Boundary
Kurukshetra strictly adheres to the principle: **Profile the Attacker, Never Surveil the Victim.**
* **ZERO Background Surveillance:** No background services, no call listening, no SMS interception, no access to other apps (Instagram, WhatsApp, Telegram).
* **ZERO Biometric Keystroke Logging:** No tracking of inter-keystroke timing, typing cadence, screen dwell times, or touchscreen pressure.
* **ZERO Navigation Journey Tracking:** No tracking of how the user browses the app, how fast they click tabs, or what screens they visit before paying.

### The Two Discrete Protocol Trigger Points
Kurukshetra executes its analysis exclusively at two standard, legally sanctioned UPI protocol events:
1. **Trigger Event 1 (VPA Resolution / Profile Click — NPCI `ReqValAdd`):** When the user inputs or selects a UPI ID/phone number to pay, the app must resolve the legal registered name via the NPCI switch. Kurukshetra inspects the *recipient's* historical forensics, caller reputation databases, and national fraud registries.
2. **Trigger Event 2 (Payment Initiation / Pre-PIN — NPCI `ReqPay` Pre-Flight):** When the user enters an amount and taps "Proceed / Pay" (before the secure NPCI MPIN screen is invoked), Kurukshetra evaluates the transaction amount and contextual clash. If high risk is detected, educational cognitive interventions are rendered *before* the user authorizes settlement.

---

## 2. Verification Timing & Latency Budget

In payment processing, timing consists of two distinct dimensions:
* **Machine Verification Latency:** Total execution time of the intelligence engine. Hard P99 budget of **$< 45\text{ ms}$**. Total added user-perceived overhead is **under 20 ms**.
* **Human Cognitive Friction:** Forced pauses injected **only** if a scam pattern is confirmed.

```
Risk Score Spectrum:
0.00 ──────────────── 0.30 ──────────────── 0.65 ──────────────── 0.85 ──────── 1.00
       ALLOW                STEP-UP               COACH                 FREEZE
    [0 seconds]          [2-3 seconds]         [5 seconds]          [4-hour hold]
```

### System Processing Lifecycle:
1. **Phase 0: Parallel Pre-fetch (~25 ms, 0 ms added user wait):**
   * Initiated concurrently while the client app waits for NPCI's `ReqValAdd` name resolution (~120 ms).
   * Runs 13 recipient & network signals (Category A: 1–4, Category F: 18–20, Category G: 21–24, Category D: 11, 13).
2. **Phase 1: Pre-Flight Inference (~12–18 ms):**
   * Initiated when user taps "Pay" with a specified amount.
   * Runs 14 contextual & pattern signals (Category B: 5–8, Category C: 9–10, Category D: 12, Category E: 14–17, Category I: 32).
   * Executes dense feature assembly + LightGBM calibrated inference.
3. **Phase 2: Asynchronous Background Audit (0 ms on critical path):**
   * Merkle tree WORM audit hashing, cross-app smurfing updates, and self-tuning metrics run out-of-band.
4. **The Fail-Open Safe Harbor:**
   * If total execution exceeds **45 ms**, the circuit breaker trips instantly to `TIER_3_FAIL_OPEN` (`ALLOW`). Legitimate transactions are never blocked by network latency.

---

# Category A: VPA Resolution Intelligence (4 Features)
*Triggered at Event 1 (`ReqValAdd`) when the recipient address is resolved on the NPCI switch.*

---

### 1. Verify-to-Abandon Ratio
* **Technical Mechanism (How It Works):** 
  Tracks the ratio between NPCI `ReqValAdd` (address resolution queries) and subsequent `ReqPay` (payment execution calls) for any given VPA on the network switch:
  $$\text{Abandonment Ratio} = 1.0 - \left(\frac{\sum \mathtt{ReqPay}}{\sum \mathtt{ReqValAdd}}\right)$$
  For normal users or legitimate merchants, 85%–95% of address validations proceed to payment. If an account has 100 address resolutions but only 6 actual transfers (Abandonment Ratio = 94%), it indicates that crowd intelligence has identified something suspicious upon seeing the resolved account name.
* **Privacy & Trigger Boundary:** 
  100% server-side mathematical metric on the payment switch. Zero client tracking.
* **Real-World Quick Scenario (Fake OLX Buyer Scam):**
  * Rajesh posts an antique sofa on OLX for ₹18,000. A buyer claiming to be an army officer messages: *"Verify my defense canteen clearance UPI ID first: `military.canteen.cctv@oksbi`."*
  * Over the preceding 48 hours, 42 sellers across India typed this VPA, but 39 immediately aborted without paying upon noticing the resolved bank name was "Ramesh G — Savings Account". The switch logs an abandonment ratio of 93%.
  * When Rajesh inputs the VPA, Kurukshetra warns: *"High Abandonment Rate: 39 out of 42 people who checked this account recently chose not to send money."* Rajesh cancels the transfer.

---

### 2. Resolution Burst Detection
* **Technical Mechanism (How It Works):** 
  Monitors the second-order derivative (velocity of lookups) of `ReqValAdd` queries arriving for an individual VPA across all connected PSP apps. A dormant or low-velocity account suddenly receiving a Poisson arrival spike of $>30 \text{ lookups/hour}$ indicates an active, coordinated social media blast or mass-dialing fraud campaign.
* **Privacy & Trigger Boundary:** 
  Switch-level time-series anomaly detection. No device telemetry.
* **Real-World Quick Scenario (Telegram Task Scam Outbreak):**
  * At 2:00 PM, a cyber fraud syndicate blasts 5,000 users on Telegram offering a part-time job rating hotels. Victims are told to send a ₹2,000 "registration deposit" to `vip.merchant.desk@paytm`.
  * Between 2:00 PM and 2:30 PM, 54 distinct UPI users across 4 different apps resolve `vip.merchant.desk@paytm`. The baseline lookup velocity for this 4-day-old account surges from 0.02 to 108 lookups/hour.
  * Kurukshetra flags an active campaign burst. Every subsequent user sees: *"Active High-Volume Alert: 50+ users are resolving this account right now. This velocity signature matches mass job/investment scams."*

---

### 3. Beneficiary Name vs. Claimed Identity (Name Clash)
* **Technical Mechanism (How It Works):** 
  Detects deterministic identity contradictions between the legal registered name returned in `RespValAdd` and verified contextual authority sources. This feature does **NOT** guess what was said on an unrecorded phone call. It operates strictly when:
  1. The VPA handle string itself contains institutional authority syntax (e.g. `cbi.officer@oksbi`), OR
  2. The user selects an official purpose in the Purpose Declaration prompt (e.g., selects "Court Bail / Govt Fine", but Core Banking returns `account_type="SAVINGS"` and `mc="0000"`).
* **Privacy & Trigger Boundary:** 
  Syntactic string parsing of the public VPA handle + NPCI merchant code (`mc`) verification. Zero surveillance.
* **Real-World Quick Scenario (Digital Arrest / CBI Impersonation):**
  * Mrs. Anita is threatened by an impersonator claiming to be a CBI Inspector investigating an illegal courier. The caller tells her to send ₹75,000 "provisional court security bail" to `cbi.clearance.cell@sbi`.
  * The handle contains the keyword `cbi`. However, NPCI `RespValAdd` returns: Registered Name: *"Manoj Kumar"*, Account Category: *"Individual Savings"*, MCC: `0000`. In Indian law, government courts and investigative agencies never collect bail into personal savings accounts.
  * Kurukshetra displays a hard contradiction screen: *"CRITICAL MISMATCH: You are transferring funds to an individual personal savings account belonging to Manoj Kumar. Official law enforcement agencies NEVER collect security bail via personal savings accounts."*

---

### 4. UPI Handle Authority Pattern Detection
* **Technical Mechanism (How It Works):** 
  Executes regex and semantic matching on the VPA handle against a curated dictionary of Indian institutional keywords (`cbi`, `rbi`, `police`, `customs`, `ebill`, `tneb`, `bescom`, `incometax`, `court`, `narcotics`). If a match is found, the system verifies whether the recipient account is an authenticated Government/Enterprise merchant (`mc=9311`, `9399`, or verified PSP onboarding). If it resolves to an unverified retail personal account (`mc=0000`), the handle is flagged as an unauthorized authority impersonation.
* **Privacy & Trigger Boundary:** 
  Standard regex check on the recipient's VPA string during `ReqValAdd`.
* **Real-World Quick Scenario (Electricity Disconnection Scam):**
  * A homeowner receives an urgent SMS: *"Power will be cut at 9:30 PM tonight due to unpaid electricity bill of ₹1,450. Pay immediately to `tneb.billing.officer@oksbi`."*
  * The handle contains `tneb` (Tamil Nadu Electricity Board) and `officer`. Bank records confirm the account is a private savings account opened 12 days ago with basic OTP-based KYC.
  * The payment is blocked: *"Impersonation Handle Detected: This UPI ID uses utility authority keywords (`tneb`), but belongs to a private individual savings account."*

---

# Category B: Transaction Context & Initiation Intelligence (4 Features)
*Triggered strictly at Event 1 (Contact/VPA Lookup) or Event 2 (Tapping Pay before PIN). Zero client-side keystroke or navigation tracking.*

---

### 5. Multi-VPA Phone Mapping (Mule Cluster Concentration)
* **Technical Mechanism (How It Works):** 
  When a user initiates payment to a mobile phone number, Kurukshetra queries the NPCI Central Mapper to determine the total number of distinct VPAs and bank accounts linked to that single mobile number, along with their creation timestamps. A genuine retail user has 1 to 3 VPAs linked to personal accounts. A money mule recruiter or aggregator systematically links 6 to 15+ VPAs across multiple banks within a 30-day window to serve as distributed collection sinks.
* **Privacy & Trigger Boundary:** 
  Server-side query to NPCI's mobile-to-VPA routing registry. Zero device snooping.
* **Real-World Quick Scenario (Mule Recruitment Ring):**
  * An attacker running an illegal instant-loan extortion racket gives a borrower a phone number to pay ₹8,000.
  * Central Mapper query reveals that this single mobile number is linked to 9 different UPI IDs across 5 different regional banks, with 7 of those handles registered within the past 14 days.
  * The system flags the recipient as a high-density mule aggregator node: *"High Risk: This phone number is associated with 9 newly created UPI handles across multiple banks — a signature of mule collection networks."*

---

### 6. New Beneficiary High-Value Outlier (Value Spike Anomaly)
* **Technical Mechanism (How It Works):** 
  Evaluated at Event 2 (when the user taps "Pay"). Evaluates the transfer amount $A$ against the user's historical 90-day distribution of first-time beneficiary transfers:
  $$\text{Z-Score} = \frac{A - \mu_{\text{first\_time}}}{\sigma_{\text{first\_time}}}$$
  If the sender's median payment to new recipients is ₹450, and they suddenly attempt a ₹65,000 transfer to a recipient created 4 days ago with zero prior relationship, it triggers an extreme outlier anomaly.
* **Privacy & Trigger Boundary:** 
  Pure ledger comparison of the payment amount against sender's historical bank statement. Triggers only upon tapping "Pay".
* **Real-World Quick Scenario (Coerced High-Ticket Transfer):**
  * A retired teacher who normally uses UPI only for ₹150–₹500 grocery payments is pressured by a scammer into sending ₹55,000 for a "customs clearance penalty".
  * ₹55,000 is 110x the user's median first-time transaction value ($\text{Z-Score} > 4.5$) to a recipient with zero transaction history.
  * The app pauses before the PIN screen to present an educational verification step rather than allowing a 1-second impulsive transfer.

---

### 7. Rapid Fund Drainage Velocity (Short Residence Time)
* **Technical Mechanism (How It Works):** 
  Interrogates Core Banking System (CBS) transaction metrics for the recipient account to calculate the **Median Fund Residence Time**: the duration inbound deposits remain in the account before outbound transfer or cash withdrawal:
  $$T_{\text{residence}} = \text{Median}(t_{\text{debit}} - t_{\text{credit}})$$
  * *Legitimate Personal / Small Business Accounts:* Funds sit for days or weeks to pay rent, suppliers, bills, or accumulate savings ($T_{\text{residence}} > 72 \text{ hours}$).
  * *Money Mule Accounts:* Funds are drained immediately to prevent freezing by police or banks ($T_{\text{residence}} < 300 \text{ seconds}$).
* **Privacy & Trigger Boundary:** 
  Core banking ledger telemetry on the recipient account. Zero client tracking.
* **Real-World Quick Scenario (Instant Cash-Out Mule):**
  * A victim transfers ₹40,000 to an account provided by an online fraudster.
  * The recipient account shows that over the past 7 days, 98.2% of all inbound funds were transferred out via IMPS or withdrawn at ATMs within 4 minutes of receipt. The account maintains a near-zero average balance.
  * The recipient is identified as a pass-through transit mule. Kurukshetra enforces a 4-hour cooling-off hold, preventing immediate cash draining.

---

### 8. Unlinked Island Node Detection (Graph Isolation)
* **Technical Mechanism (How It Works):** 
  Evaluates graph distance on the interbank transaction graph between the sender's cluster and the recipient's cluster. Legitimate transactions (even first-time payments to small merchants, tutors, or local vendors) almost always share 2nd or 3rd-degree graph ties (e.g., common geographic nodes, shared merchants, mutual transacting peers). A scam mule operates as a disconnected "island node"—an isolated account receiving funds from distant, unconnected clusters with zero shared graph density.
* **Privacy & Trigger Boundary:** 
  Interbank topological graph query performed at the switch level.
* **Real-World Quick Scenario (Remote Extortion Target):**
  * A resident in Kochi is targeted by a cybercriminal based in Mewat, Rajasthan, asking for ₹20,000.
  * The Kochi sender and the Mewat recipient share zero 1st, 2nd, or 3rd-degree graph connections. The recipient has no transactional overlap with any node in South India.
  * Combined with low account age, graph isolation elevates the composite risk score, triggering an intervention challenge.

---

# Category C: QR Code & Payment Link Forensics (2 Features)
*Triggered when scanning a QR code or launching a UPI deep-link intent.*

---

### 9. P2P Dynamic QR Code & 'Scan-to-Receive' Trap Analysis
* **Technical Mechanism (How It Works):** 
  Parses the payload of a scanned QR code under NPCI UPI QR Specification v1.6. Identifies whether the QR contains an embedded debit amount (`am=...`) and points to a personal savings account (`mc=0000` or absent) rather than an authenticated merchant (`mode=01/02` with verified Merchant Category Code).
  * **Protection for Real Small Businesses:** Legitimate small merchants (kirana shops, home bakers, local services) with personal accounts are **NOT** blocked. They have established account longevity, steady local transaction history, and normal fund retention.
  * The system provides a **universal educational safeguard**: whenever any dynamic QR with a pre-filled amount to a personal account is scanned from a saved image file, an informational reminder is shown.
* **Privacy & Trigger Boundary:** 
  Evaluates only the URI string inside the scanned QR code at the time of scanning.
* **Real-World Quick Scenario (Marketplace "Scan-to-Receive" Refund Fraud):**
  * A seller on Facebook Marketplace is told by an interested buyer: *"I have sent you a QR code on WhatsApp for ₹12,000 advance. Just scan it in your GPay to receive the payment into your account."*
  * The user opens the QR image. The URI contains `upi://pay?pa=mule7@oksbi&am=12000`. The recipient is a personal savings account.
  * The app displays an unmissable warning: *"CRITICAL REMINDER: Scanning a QR code ALWAYS SENDS money. You never need to scan a QR code or enter your UPI PIN to receive money."* The seller realizes the trap and cancels.

---

### 10. Payment Link Deep-Intent Forensics
* **Technical Mechanism (How It Works):** 
  Parses incoming Android/iOS deep-link intents (`upi://pay?...`) triggered by external SMS or web links. Evaluates parameter integrity:
  1. Checks for URL shorteners (bit.ly, tinyurl) masking the destination VPA.
  2. Detects authority-impersonating transaction notes (`tn=KYC_VERIFY`, `tn=ELECTRICITY_CLEAR`).
  3. Checks if the destination VPA matches known phishing campaign signatures.
* **Privacy & Trigger Boundary:** 
  Inspects only the parameters of the incoming payment URI passed to the app via OS intent.
* **Real-World Quick Scenario (Bank NetBanking Phishing SMS):**
  * A customer receives an SMS: *"Your SBI YONO account will be blocked today. Click here to verify: `upi://pay?pa=sbi.kyc.portal@axis&am=15000&tn=KYC_REACTIVATION`."*
  * The link embeds a ₹15,000 debit instruction, has a fraudulent note `KYC_REACTIVATION`, and points to an Axis Bank personal VPA claiming to be SBI.
  * The deep link is intercepted before the payment screen is rendered, displaying an alert that the link is an SMS phishing attack.

---

# Category D: Network-Level Cross-Victim Intelligence (3 Features)
*Cross-app intelligence powered by the centralized MCP middleware switch.*

---

### 11. Community Scam Reports (Decentralized Reputation Feedback)
* **Technical Mechanism (How It Works):** 
  Aggregates decentralized, post-transaction feedback from users across all connected UPI apps. When a user reports a recipient as fraudulent, the system runs an automated verification check (checking if 1930 reports exist or if other users flagged the same VPA). If multiple independent reports accumulate, the VPA's community risk score escalates across the entire banking network.
* **Privacy & Trigger Boundary:** 
  Aggregated server-side reputation database. No tracking of non-reporting users.
* **Real-World Quick Scenario (Predatory Loan App Repayment):**
  * A victim of an illegal instant-loan app is harassed to pay ₹10,000 to `recovery.desk@icici`.
  * Over the previous 72 hours, 8 other borrowers who transferred funds to this VPA submitted post-transaction fraud reports citing blackmail and morphed photo threats.
  * When the new victim initiates payment, the app displays: *"Community Fraud Alert: 8 users reported this account for illegal loan harassment in the past 3 days."*

---

### 12. Cross-Victim Caller-Recipient Correlation
* **Technical Mechanism (How It Works):** 
  Correlates caller phone numbers with destination UPI handles across multiple victims. When multiple unrelated users in different cities receive incoming calls from the same phone number (reported at payment time or verified via TRAI telecom registries) and subsequently attempt transfers to the same recipient VPA within a 2-hour window, the system establishes a deterministic caller-mule syndicate link.
* **Privacy & Trigger Boundary:** 
  Correlates caller metadata provided at transaction point across independent banking sessions on the central server.
* **Real-World Quick Scenario (Coordinated Extortion Ring):**
  * A scammer calling from `+91-98711-XXXXX` convinces Victim A in Mumbai to pay ₹40,000 to `mule88@kotak`. Two hours later, the same number calls Victim B in Bengaluru and instructs her to pay ₹35,000 to `mule88@kotak`.
  * The central switch correlates that both victims received calls from `+91-98711-XXXXX` shortly before initiating transfers to the exact same recipient account.
  * Kurukshetra establishes a high-confidence criminal syndicate link. Victim B's payment is hard-blocked, and the VPA is blacklisted across the entire UPI ecosystem.

---

### 13. Verification Fan-In as a Leading Indicator (NPCI Protocol Metric)
* **Technical Mechanism (How It Works):** 
  Measures the network-wide ratio of `ReqValAdd` queries arriving for an account relative to completed `ReqPay` transactions. This feature has **zero awareness of third-party apps (Instagram, WhatsApp, etc.)**. It is a purely mathematical server-side calculation:
  $$\text{Fan-In Metric} = \frac{\text{Total Count of } \mathtt{ReqValAdd} \text{ across all PSPs}}{\text{Total Count of } \mathtt{ReqPay} \text{ across all PSPs}}$$
  If an account receives 200 address validation lookups in 2 hours, but only 5 payments settle, it means 195 real banking users independently looked up the name and walked away. This acts as a real-time leading indicator of an ongoing scam campaign before formal police FIRs are filed.
* **Privacy & Trigger Boundary:** 
  Pure server-side count of NPCI API calls. Zero client surveillance.
* **Real-World Quick Scenario (Viral Social Media Task Campaign):**
  * A fraudulent investment scheme goes viral online, promising 300% returns if users transfer ₹3,000 to `growfast@sbi`.
  * Across India, 320 users enter the UPI ID to check the name. 308 of them see an unknown personal name and abandon the flow. The switch observes a 25:1 fan-in ratio within 90 minutes.
  * Kurukshetra flags the VPA as an active campaign target before the initial 12 victims even realize they have been defrauded or file bank complaints, protecting hundreds of subsequent users.

---

# Category E: Transaction Pattern Intelligence (4 Features)
*Evaluates structural transaction anomalies in Core Banking records.*

---

### 14. Drip Scam Escalation Detection
* **Technical Mechanism (How It Works):** 
  Tracks geometric progression in sequential payment amounts to the same recipient accompanied by decaying time deltas:
  $$A_n \ge k \cdot A_{n-1} \quad (k \ge 2.5) \quad \text{and} \quad (t_n - t_{n-1}) < (t_{n-1} - t_{n-2})$$
  Identifies classic slow-burn grooming scams that start with small test transfers and rapidly multiply.
* **Privacy & Trigger Boundary:** 
  Historical ledger comparison of the sender's past transactions to this specific recipient.
* **Real-World Quick Scenario (Crypto Investment / Pig Butchering Scam):**
  * A victim is lured into a fake crypto platform:
    * Day 1: Deposits ₹1,000 (receives ₹1,300 "profit" to build trust).
    * Day 2: Deposits ₹5,000.
    * Day 3: Deposits ₹25,000.
    * Day 4: Directed to deposit ₹1,20,000 for "tier-1 VIP liquidity clearance".
  * The transaction sequence ($₹1,000 \to ₹5,000 \to ₹25,000 \to ₹1,20,000$) exhibits geometric scaling ($k \approx 5$) with shrinking intervals.
  * The payment is halted: *"Pattern Match: Pig-Butchering Investment Scam. Fraudsters allow small withdrawals early to build confidence before demanding large non-refundable sums."*

---

### 15. Threshold Evasion Detection (Smurfing / Structured Splitting)
* **Technical Mechanism (How It Works):** 
  Detects when a user executes multiple transfers to the same recipient within a sliding 60-minute window, where each individual transfer is priced just below regulatory reporting thresholds (e.g., ₹9,999 to stay under ₹10,000, or ₹49,999 to stay under ₹50,000):
  $$\sum_{i=1}^m A_i > T_{\text{threshold}} \quad \text{where each } A_i = (T_{\text{threshold}} - \epsilon)$$
* **Privacy & Trigger Boundary:** 
  Rolling transaction window summation in the Core Banking System.
* **Real-World Quick Scenario (Coerced Blackmail Splitting):**
  * An extortionist tells a victim: *"Send ₹50,000 immediately, but do not send it in one shot or your bank will stop it. Send ₹9,999 five times right now."*
  * The user sends ₹9,999 at 10:02 AM, ₹9,999 at 10:07 AM, ₹9,999 at 10:13 AM, and attempts a 4th at 10:19 AM.
  * Kurukshetra identifies structured threshold evasion (cumulative ₹39,996 across 4 transfers, each just below ₹10,000) and halts the sequence to prevent account draining.

---

### 16. Refund Reversal Scam Detection
* **Technical Mechanism (How It Works):** 
  Analyzes Core Banking records for micro-inbound credit transactions followed immediately by massive outbound payment attempts to the same entity:
  $$\text{Ratio} = \frac{A_{\text{outbound}}}{A_{\text{inbound}}} > 500 \quad \text{where } A_{\text{inbound}} \le ₹10 \text{ and } \Delta t < 2 \text{ hours}$$
* **Privacy & Trigger Boundary:** 
  Standard ledger reconciliation between sender and recipient.
* **Real-World Quick Scenario ("Accidental Transfer" Trap):**
  * A user receives ₹10 in their account with note "UPI". Minutes later, a man calls weeping: *"Sir, I am a poor farmer. I accidentally transferred ₹50,000 to your UPI instead of the hospital! Please check your bank SMS and return my ₹50,000!"* The victim sees a recent bank SMS, gets confused, and prepares to transfer ₹50,000.
  * Ledger lookup reveals the actual inbound deposit from this entity was ₹10, while the outbound attempt is ₹50,000 (ratio 5,000:1).
  * Kurukshetra displays: *"Accidental Transfer Trap Detected: You received only ₹10 from this person, NOT ₹50,000. Do not send any money back."*

---

### 17. UPI Collect Request Abuse Detection
* **Technical Mechanism (How It Works):** 
  Flags incoming NPCI `ReqAuthDetails` (UPI Collect Requests) initiated by unknown or unverified VPAs where the transaction note contains deceptive terminology implying a credit or claim action (`claim`, `refund`, `cashback`, `bonus`, `receive`, `reward`).
* **Privacy & Trigger Boundary:** 
  Syntactic evaluation of the incoming collect request note parameter (`tn`).
* **Real-World Quick Scenario (OLX Buyer Collect Request Scam):**
  * A seller is told by an online buyer: *"I have sent you a ₹5,000 deposit via UPI. Just accept the collect request and enter your UPI PIN to receive the money into your account."*
  * The incoming notification is a *debit* collect request for ₹5,000 with note *"Cashback Received - Tap to Claim"*.
  * The confirmation screen displays a red alert: *"DANGER: Entering your UPI PIN will DEDUCT ₹5,000 from your account. A UPI PIN is NEVER required to receive money."*

---

# Category F: Recipient Account Forensics (3 Features)
*Deep structural banking forensics on the recipient account via Core Banking System (CBS) telemetry.*

---

### 18. One-Way Account Detection (Pure Sink Anomaly)
* **Technical Mechanism (How It Works):** 
  Calculates the Inbound-to-Outbound transactional topology of the recipient account:
  $$\text{Sink Ratio} = \frac{\text{Unique Inbound Senders}}{\text{Unique Outbound Beneficiaries}} > 20 \quad \text{and} \quad \text{Merchant Retail Outflow} = 0$$
  Legitimate personal accounts have bidirectional cash flows (salary in, rent/groceries/utilities out). Money mule accounts receive funds from dozens of strangers and forward 100% of outflows to crypto P2P traders, cash ATMs, or layering accounts.
* **Privacy & Trigger Boundary:** 
  Core banking ledger forensics on the recipient account.
* **Real-World Quick Scenario (Money Mule Layering Ring):**
  * A mule account receives 35 deposits totaling ₹5.8 Lakhs in 4 days from victims across India, with zero payments for food, fuel, or utilities.
  * The account exhibits a 99.1% sink ratio, with all outbound funds routed to cryptocurrency OTC desks.
  * When a new victim attempts payment, Kurukshetra identifies the account as an active mule sink and blocks the transfer.

---

### 19. Burst-Drain-Dormant Lifecycle Detection
* **Technical Mechanism (How It Works):** 
  Identifies the temporal lifecycle signature of disposable mule accounts:
  $$\text{Dormancy } (>180 \text{ days, balance } < ₹500) \longrightarrow \text{Burst Inflows } (10\times \text{ volume in } 48\text{h}) \longrightarrow \text{Drain } (95\% \text{ withdrawn in } <15 \text{ mins})$$
* **Privacy & Trigger Boundary:** 
  Historical balance and turnover profile in Core Banking.
* **Real-World Quick Scenario (Compromised Dormant Account):**
  * A criminal ring buys access to a dormant student account with an average balance of ₹150 over the past year. In 48 hours, it receives 16 transfers totaling ₹3.2 Lakhs, all withdrawn at ATMs within 5 minutes of arrival.
  * The temporal profile matches the Burst-Drain-Dormant signature.
  * Transfers to this account are paused with a 4-hour cooling-off hold, preventing immediate cash draining.

---

### 20. Scam Hours Activity Concentration
* **Technical Mechanism (How It Works):** 
  Evaluates the temporal distribution of inbound transactions. Industrial boiler rooms and digital arrest syndicates operate on standard corporate working shifts (Monday to Friday, 10:00 AM – 5:30 PM). Genuine retail personal and merchant accounts receive payments across evenings, weekends, and late nights.
* **Privacy & Trigger Boundary:** 
  Server-side timestamp analysis of recipient account credits.
* **Real-World Quick Scenario (Industrial Boiler Room Operation):**
  * A commercial call center running fake courier scams operates strictly from 10:00 AM to 5:30 PM on weekdays.
  * 100% of all credits into the recipient account arrive between 10:00 AM and 5:30 PM on weekdays, with zero weekend or night activity.
  * Contributes to the composite risk score, distinguishing commercial boiler rooms from authentic personal accounts.

---

# Category G: Banking & Government Infrastructure (4 Features)
*Direct API integration with Indian national fraud registries and regulatory databases.*

---

### 21. Recipient Account Graph Analysis (Age, KYC, Geographic Dispersion)
* **Technical Mechanism (How It Works):** 
  Interrogates recipient parameters available via the interbank switch: account age, KYC verification level, geographic dispersion of past senders, and fund velocity:
  $$\text{Risk} = w_1 \cdot \frac{1}{\text{Age (days)}} + w_2 \cdot \text{GeoEntropy} + w_3 \cdot \text{Velocity}$$
  * **Safe Small Business Profile:** Account age > 180 days, full KYC, localized regular customer base, normal fund holding.
  * **Mule Profile:** Account age < 7 days, basic OTP KYC, incoming payments from 8 different states within 48 hours.
* **Privacy & Trigger Boundary:** 
  Interbank switch metadata lookup.
* **Real-World Quick Scenario (Cross-State Mule Syndicate):**
  * A victim in Pune is directed to pay ₹35,000 to an account in Assam.
  * The Assam account was opened 5 days ago with basic OTP KYC. Over the last 48 hours, it received payments from 16 distinct users across 7 different states, with funds cleared within 4 minutes.
  * High geographic dispersion + low account age + instant velocity triggers a composite risk score of 0.96. The payment is hard-blocked.

---

### 22. Aadhaar & PAN Regulatory Freeze Cross-Verification
* **Technical Mechanism (How It Works):** 
  Cross-references the recipient's PAN and Aadhaar against regulatory enforcement databases:
  1. Checks if other bank accounts linked to the same Aadhaar/PAN have been frozen under Section 91 CrPC by state police.
  2. Compares declared PAN occupation (e.g. "Student / Homemaker" with annual income < ₹1 Lakh) against daily turnover exceeding ₹5 Lakhs.
* **Privacy & Trigger Boundary:** 
  Regulatory compliance query executed via the banking switch.
* **Real-World Quick Scenario (Synthetic Identity / Student Mule):**
  * An account belonging to an 18-year-old whose PAN lists "Student" with annual income < ₹1 Lakh is suddenly receiving ₹4 Lakhs daily.
  * Declared PAN profile clashes with transactional volume, and an allied bank account tied to the same Aadhaar was recently frozen by state police.
  * Immediate block: *"High-Risk Account: Recipient identity credentials have active regulatory freeze flags."*

---

### 23. I4C & CFCFRMS Integration (1930 Cyber Fraud Registry)
* **Technical Mechanism (How It Works):** 
  Executes a real-time API query against the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) operated by the Indian Cyber Crime Coordination Centre (I4C, Ministry of Home Affairs). Checks if the VPA, account number, or IFSC has active complaints filed via the 1930 Helpline.
* **Privacy & Trigger Boundary:** 
  Secure government API lookup for recipient identifier.
* **Real-World Quick Scenario (Active Police FIR Match):**
  * A senior citizen in Jaipur is targeted by a stock advisory scam. Two hours prior, a victim in Chandigarh reported the same UPI ID to the 1930 Cybercrime Helpline.
  * I4C registers the VPA in the national fraud database. When the Jaipur victim initiates transfer, Kurukshetra's query returns an active match.
  * The payment is blocked before settlement: *"MHA Cybercrime Registry Alert: This account is currently frozen under active cybercrime investigation (CFCFRMS Incident #2026/IN-8891)."*

---

### 24. TRAI CNAP & Sanchar Saathi Telecom Integration
* **Technical Mechanism (How It Works):** 
  Queries TRAI's Caller Name Presentation (CNAP), DND spam registries, and the DoT Sanchar Saathi portal (TAFCOP/CEIR) for the phone number associated with the payment or verified caller. Checks if the SIM card was reported lost/stolen, fraudulently issued, or carries high spam complaints.
* **Privacy & Trigger Boundary:** 
  Telecom authority API lookup for the target phone number.
* **Real-World Quick Scenario (Spoofed Telecom Caller):**
  * A scammer calling from a mobile number claims to be an officer from Mumbai Customs.
  * Sanchar Saathi lookup reveals the SIM card was reported lost/fraudulently issued 3 days ago and has 35+ spam complaints on TRAI DND.
  * System alerts: *"Caller Identity Alert: The calling number is registered on national spam registries and flagged in Sanchar Saathi."*

---

# Category H: Intelligent Intervention Design (4 Features)
*Psychologically calibrated cognitive interventions deployed on the confirmation screen before PIN entry.*

---

### 26. Trusted Contact Emergency Dual-Key Override
* **Technical Mechanism (How It Works):** 
  For high-risk transactions, the app triggers a dual-key notification to a pre-designated family member (spouse, child, parent) with a direct call prompt before the payment can proceed.
* **Real-World Quick Scenario (Elder Financial Extortion):**
  * A 72-year-old grandfather is told his grandson is arrested after a college altercation and needs ₹40,000 for hospital release immediately.
  * High-risk new beneficiary transfer. The app initiates a 15-minute cooling hold and pushes an alert to his daughter's phone: *"Your father is attempting an urgent ₹40,000 transfer under potential scam coercion. Call him immediately."*
  * The daughter calls her father, confirms the grandson is sitting in class, and stops the transfer.

---

### 27. Purpose Declaration with Contradiction Detection
* **Technical Mechanism (How It Works):** 
  Prompts the user to declare the payment purpose from a categorized list (e.g., Utility, Government Fine, Investment, Friend/Family, Medical). Evaluates the declared purpose against the recipient's verified account type (`mc` code).
* **Real-World Quick Scenario (Court Bail / Government Fine Contradiction):**
  * A user intimidated by a scammer attempts to pay a "court penalty".
  * App asks: *"What is this payment for?"* The user selects *"Government Fine / Court Bail"*.
  * Recipient is `arun.kumar1988@sbi` (Individual Savings, `mc=0000`).
  * Warning: *"Contradiction Detected: You declared this is a Government Fine, but the recipient is an individual savings account. Government fines are only collected through official Treasury/Court merchant portals, never personal accounts."*

---

### 29. Recipient Account Timeline Visualization
* **Technical Mechanism (How It Works):** 
  Displays an intuitive, graphic timeline of the recipient account's activity instead of showing text descriptions.
* **Real-World Quick Scenario (Stock Trading IPO Scam):**
  * A victim believes they are transferring ₹2,00,000 to an authorized institutional brokerage account for pre-IPO allocation.
  * Timeline Display:
    * 🗓️ **Account Opened:** 5 days ago with ₹500 initial deposit.
    * ⚡ **Past 48 Hours:** 16 strangers from 5 states deposited ₹8.4 Lakhs.
    * 💨 **Fund Velocity:** 99% of all money was withdrawn at ATMs within 4 minutes.
    * 📍 **Status:** *"You are Person #17 about to transfer to this 5-day-old account."*
  * The visual proof that the account is an active churn-and-drain mule instantly shatters the institutional broker illusion.

---

### 30. One-Tap Real Bank Verification Helpline
* **Technical Mechanism (How It Works):** 
  When an interaction matches bank impersonation patterns, the app displays a single-tap button that dials the user's authentic, verified bank customer support helpline.
* **Real-World Quick Scenario (Credit Card KYC Update Scam):**
  * A scammer calls claiming to be from SBI Card Fraud Prevention, asking the victim to transfer ₹10,000 to "verify card security".
  * The app detects bank impersonation markers and displays: **[Call Official SBI Helpline (1800-1234)]**.
  * The user taps the button, connects to genuine SBI support, and is informed that no such call was initiated by the bank.

---

# Category I: Cross-App Intelligence (MCP Architecture Exclusive) (3 Features)
*Cross-application correlation made possible by Kurukshetra operating as an MCP middleware.*

---

### 32. Cross-App Smurfing Detection
* **Technical Mechanism (How It Works):** 
  Correlates transaction attempts across different payment apps (Google Pay, PhonePe, Paytm). Identifies when an attacker instructs a victim to distribute payments across multiple apps to circumvent single-app limits.
* **Real-World Quick Scenario (Multi-App Coerced Splitting):**
  * Scammer instructs victim: *"Send ₹15,000 from GPay, ₹15,000 from PhonePe, and ₹15,000 from Paytm to `clearance@axis`."*
  * GPay sees one ₹15,000 transfer (normal). PhonePe sees one ₹15,000 transfer (normal). Paytm sees one ₹15,000 transfer (normal). Kurukshetra's MCP server correlates the sender and recipient across all three apps within a 15-minute window, identifying a composite ₹45,000 smurfing attack.
  * Kurukshetra blocks the 2nd and 3rd legs of the transaction across all participating apps.

---

### 33. Real-Time Scam Campaign Detection & Nationwide Kill-Switch
* **Technical Mechanism (How It Works):** 
  Detects systemic fraud outbreaks across the entire banking ecosystem within minutes. Automatically issues a synchronized blacklist update across all connected UPI apps.
* **Real-World Quick Scenario (Mass Electricity Phishing Outbreak):**
  * At 6:00 PM, a cyber syndicate sends 100,000 SMS messages across India regarding fake electricity disconnections, directing victims to `quickbill.desk@icici`.
  * Within 35 minutes, 28 victims across 6 different banks attempt payments to this ID. Kurukshetra identifies the campaign signature across the MCP network.
  * An automated campaign termination order is broadcast to every UPI application, neutralizing the VPA nationwide within 40 minutes of the first victim report.

---

### 34. Public Scam Score Lookup (Web/API)
* **Technical Mechanism (How It Works):** 
  A publicly accessible verification portal and API allowing any citizen to look up the risk profile of a UPI ID prior to initiating a transaction from any device.
* **Real-World Quick Scenario (Pre-Payment Family Safety Check):**
  * An elderly mother receives a WhatsApp message from a "temple trust" requesting a ₹5,000 donation to `darshan.seva@kotak`. She asks her son to check if it is safe.
  * The son enters `darshan.seva@kotak` into `kurukshetra.gov.in/lookup`.
  * The portal displays: *Risk Score: 96/100 (Extremely High). Account opened 3 days ago. 22 past abandonments. 0 religious trust verification.* The family avoids losing funds.

---

# Category J: Learning & Self-Improvement (2 Features)
*System feedback loops that refine threat models and coaching efficacy over time.*

---

### 35. Post-Hold Escalation Detection
* **Technical Mechanism (How It Works):** 
  Monitors user actions following the completion of a mandatory cooling-off period. If a user completes a delayed payment and immediately initiates a second, larger transfer to the same recipient, it indicates the scammer coached the victim through the hold.
* **Real-World Quick Scenario (Coached Cooling-Off Bypass):**
  * A user's ₹25,000 transfer is held for 4 hours. The scammer tells the victim: *"The bank is testing you. Wait 4 hours, confirm it, and immediately send the remaining ₹75,000."*
  * Exactly at hour 4, the user confirms the ₹25,000 payment and within 60 seconds initiates a new ₹75,000 payment to the same recipient.
  * Kurukshetra flags the post-hold immediate escalation as an active coaching signature and escalates to mandatory operator intervention.

---

### 36. Intervention Effectiveness Tracking & Self-Tuning
* **Technical Mechanism (How It Works):** 
  Measures conversion and abort metrics across different intervention templates (text warnings vs. visual playbooks vs. voice debiasing). Optimizes intervention wording and design dynamically based on empirical success rates.
* **Real-World Quick Scenario (A/B Testing Coaching Scripts):**
  * Kurukshetra tests two approaches for Digital Arrest interception:
    * *Script A (Formal Legal Notice):* 32% of coerced victims abort payment.
    * *Script B (Visual Comic Playbook + "They will ask for more in Step 5"):* 88% of coerced victims abort payment.
  * The system updates its routing policy to deploy Script B across all digital arrest scenarios, maximizing life-saving intervention rates.

---

## Complete Feature Matrix (Privacy-Compliant & Technically Verifiable)

| # | Category | Feature Name | Detection Protocol / Layer | Primary Fraud Target |
|---|---|---|---|---|
| 1 | A. VPA Intel | Verify-to-Abandon Ratio | NPCI `ReqValAdd` vs `ReqPay` Delta | Marketplace (OLX), Impersonation |
| 2 | A. VPA Intel | Resolution Burst Detection | `ReqValAdd` Arrival Poisson Spike | Task Scams, Mass Phishing |
| 3 | A. VPA Intel | Beneficiary Name vs. Claimed Identity | VPA Syntax & User Declaration vs CBS Name | Digital Arrest, Police Impersonation |
| 4 | A. VPA Intel | UPI Handle Authority Pattern | Regex Keyword vs. MCC Verification | Utility Bill, Government Penalty |
| 5 | B. Context & Initiation | Multi-VPA Phone Mapping | NPCI Central Mapper Lookup | Mule Account Recruiter Networks |
| 6 | B. Context & Initiation | High-Value Outlier Anomaly | Z-Score vs Sender Historical Median | Coerced High-Ticket Transfers |
| 7 | B. Context & Initiation | Rapid Fund Drainage Velocity | CBS Median Fund Residence Time ($T_{\text{res}}$) | Churn-and-Burn Mule Transit |
| 8 | B. Context & Initiation | Unlinked Island Node Detection | Interbank Topological Graph Clustering | Disconnected Extortion Syndicates |
| 9 | C. QR & Links | P2P Dynamic QR & Refund Trap | QR URI Parsing + Educational Shield | "Scan to Receive" Advance Fraud |
| 10 | C. QR & Links | Payment Link Intent Forensics | OS Intent Parameters (`upi://pay`) | NetBanking KYC Suspension SMS |
| 11 | D. Cross-Victim | Community Scam Reports | Decentralized Post-Tx Feedback DB | Predatory Loan App Extortion |
| 12 | D. Cross-Victim | Caller-Recipient Correlation | Cross-Victim Caller to VPA Linkage | Coordinated Extortion Rings |
| 13 | D. Cross-Victim | Verification Fan-In Indicator | Leading Inbound Lookup Surge | Job / Investment Pre-Launch |
| 14 | E. Tx Patterns | Drip Scam Escalation Detection | Geometric Growth + Shorter Intervals | Pig Butchering, Crypto Grooming |
| 15 | E. Tx Patterns | Threshold Evasion (Smurfing) | Sub-Threshold Summation in Window | Blackmail, Extortion Splitting |
| 16 | E. Tx Patterns | Refund Reversal Scam Detection | Micro-Credit followed by Macro-Debit | "Accidental Transfer" Trap |
| 17 | E. Tx Patterns | UPI Collect Request Abuse | Deceptive Verbs in `ReqAuthDetails` | OLX Collect Scam, Fake Cashback |
| 18 | F. Account Forensics| One-Way Account Detection | CBS Inflow/Outflow Sink Ratio | Money Mule Layering Networks |
| 19 | F. Account Forensics| Burst-Drain-Dormant Lifecycle | Dormancy to Burst Transition in CBS | Churn-and-Burn Mule Accounts |
| 20 | F. Account Forensics| Scam Hours Activity Concentration| Timestamp Shift Analysis in CBS | Industrial Fraud Boiler Rooms |
| 21 | G. Infrastructure | Recipient Account Graph Analysis | Age, KYC Level, Geographic Spread | Cross-State Mule Syndicates |
| 22 | G. Infrastructure | Aadhaar & PAN Cross-Verification | Regulatory Police Freeze Registry | Synthetic Identity Mules |
| 23 | G. Infrastructure | I4C & CFCFRMS Integration | Real-time Query to 1930 Cyber Registry| Active Crime FIR Accounts |
| 24 | G. Infrastructure | TRAI CNAP & Sanchar Saathi | CNAP, TAFCOP, Blacklisted SIMs | Spoofed Telecom Callers |
| 26 | H. Interventions | Trusted Contact Dual-Key Override | Dual-Key Notification to Kin | Elderly Exploitation, Kidnap Hoax |
| 27 | H. Interventions | Purpose Declaration Contradiction | User Purpose vs. Recipient MCC Clash | Fake Fines, Bogus Investments |
| 29 | H. Interventions | Account Timeline Visualization | Graphical CBS Age & Drainage Timeline | Fake Institutional IPOs |
| 30 | H. Interventions | One-Tap Bank Helpline Verification | Authenticated Bank Support Dialing | Bank Officer / Card KYC Scams |
| 32 | I. Cross-App MCP | Cross-App Smurfing Detection | Distributed Payments across Apps | Multi-App Structured Evasion |
| 33 | I. Cross-App MCP | Campaign Termination Kill-Switch | Ecosystem-Wide Rapid Blacklist | Mass Phishing & Viral Scams |
| 34 | I. Cross-App MCP | Public Scam Score Lookup | Citizen Web Portal & API Pre-Screening| Pre-Payment Family Safety |
| 35 | J. Learning | Post-Hold Escalation Detection | Rapid Re-transfer after Cooling-off | Coached Cooling-Off Bypass |
| 36 | J. Learning | Intervention Effectiveness Tracking| A/B Testing Intervention Conversion| Adaptive Behavioral Persuasion |

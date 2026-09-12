# Dimensions C & E: Context and Information Gaps in Scam Defense

## 1. Executive Summary & Context

Information is the raw fuel of risk decisioning. In the payment scam ecosystem, however, the informational landscape is severely fragmented, distorted, and partitioned behind architectural, regulatory, and commercial walls. No single entity—neither the mobile app, the sending bank, the central switch, the receiving bank, nor law enforcement—possesses a complete, end-to-end view of the transaction.

In strict compliance with Part 3.C and Part 3.E of the research framework, this document systematically classifies the information gaps into three fundamentally distinct categories:
1. **Category 1: Information that Does Not Exist** (epistemic non-existence).
2. **Category 2: Information that Exists but is Inaccessible** (regulatory, platform, or legal barriers).
3. **Category 3: Information that Exists but is Not Integrated** (architectural and engineering silos).

---

## 2. The Three Categories of Information Gaps

```text
                   THE THREE INFORMATION DEFICIT CATEGORIES
                   
  Category 1: Does Not Exist           Category 2: Inaccessible           Category 3: Unintegrated
  ┌─────────────────────────────┐     ┌─────────────────────────────┐     ┌─────────────────────────────┐
  │ - Unrecorded verbal coercion│     │ - Recipient account age &   │     │ - Client touch tremor not   │
  │ - Secret physical meetings  │     │   velocity (Bank secrecy)   │     │   sent to switch risk engine│
  │ - Epistemic mental state    │     │ - iOS call state & RAT scan │     │ - Telco active call state   │
  │   of the victim             │     │ - Encrypted WhatsApp audio  │     │   disconnected from banking │
  └─────────────────────────────┘     └─────────────────────────────┘     └─────────────────────────────┘
```

---

## 3. Deep Analysis of Information Deficits

### 3.1 Category 1: Information That Does Not Exist (Epistemic Non-Existence)
Certain vital pieces of context are never digitized or recorded in any system at transaction time:
- **Verbal Psychological Coercion**: When a scammer issues verbal threats over a private phone call (*"If you disconnect, police will arrive at your door in 10 minutes"*), this audio stream is ephemeral. Unless the victim records the call, no digital trace of the coercion exists anywhere in the world.
- **Victim Epistemic Mental Model**: The internal cognitive belief of the victim (*"I believe I am transferring funds to an RBI-verified safety account"*) exists purely within the human brain. The banking system has zero direct measurement of the user's subjective intention.
- **Physical Out-of-Band Staging**: Fraudsters frequently conduct initial contact or hand over forged physical documents outside digital channels (e.g., meeting in person, paper brochures for fake real estate).

### 3.2 Category 2: Information That Exists but Is Inaccessible (Regulatory & Platform Barriers)
High-value risk signals exist in digital databases, but defense systems are legally or technically barred from accessing them:
- **The Recipient Risk Profile (Cross-Bank Secrecy Barrier)**:
  - *Where it exists*: The receiving bank holds detailed database records: the recipient account was created 3 days ago, has had 14 incoming transfers in the last 20 minutes, and has zero historical utility or salary transactions.
  - *Why it is inaccessible*: Banking privacy legislation (e.g., US Gramm-Leach-Bliley Act, UK Data Protection Act, Indian Banking Regulation Act) and competitive barriers strictly prohibit Bank B from broadcasting recipient account telemetry to Bank A in real time prior to clearance.
- **Mobile OS Client Sandboxing (Apple iOS vs. Android 13+)**:
  - *Where it exists*: The smartphone operating system knows whether AnyDesk or TeamViewer is running, and whether a phone call is active.
  - *Why it is inaccessible*: Apple iOS strictly prohibits third-party banking apps from inspecting running background processes, querying installed application lists, or reading cellular telephony state. On Android, Google Play Store policies have progressively restricted accessibility and package query APIs under penalty of app store expulsion.
- **Encrypted OTT Application Channels (WhatsApp / Telegram)**:
  - *Where it exists*: Scammer chat transcripts, fake PDF summons, and group investment chats exist on the device storage.
  - *Why it is inaccessible*: End-to-end encryption (Signal protocol) and mobile OS application sandboxing make it legally and cryptographically impossible for a banking app to inspect messages or calls occurring inside WhatsApp or Telegram.

### 3.3 Category 3: Information That Exists but Is Not Integrated (Architectural Silos)
Signals are actively collected by one component of the defense ecosystem, but are dropped or disconnected before reaching the decision engine:
- **Client Sensor Telemetry Dropped at Network Gateway**:
  - *Where it exists*: Client-side behavioral SDKs (e.g., BioCatch, Sardine) calculate touch hesitation scores, swipe velocity, and clipboard paste timestamps within the mobile app.
  - *Why it is unintegrated*: The standard inter-bank clearing payload (ISO 20022 / UPI API specs) has no schema fields for behavioral sensor telemetry. The client app strips or hashes these rich signals into a coarse numerical risk score, or drops them entirely when dispatching the transaction request to the core switch. The central rail evaluates the payment in total blindness to client behavioral hesitation.
- **Telecommunications Carrier Data Disconnected from Payment Rails**:
  - *Where it exists*: Telecom network carriers (e.g., Jio, Airtel, Vodafone, AT&T) maintain real-time signaling data indicating whether a specific phone number is engaged in a live cellular voice call.
  - *Why it is unintegrated*: Historically, telecom signaling networks (SS7 / IMS) and banking payment switches (NPCI, FedNow) operate in complete operational isolation with zero real-time data exchange infrastructure. While APIs like GSMA Open Gateway exist, they are not integrated into the standard clearing path.
- **National Cybercrime Watchlists Disconnected from Bank Pre-Auth Engines**:
  - *Where it exists*: Law enforcement agencies maintain databases of verified cybercrime complaints (e.g., India I4C portal with millions of reported mule UPI IDs and accounts).
  - *Why it is unintegrated*: Many retail banks do not query national cybercrime registries in real time during pre-authorization due to API latency (200ms–800ms) and concerns over gateway reliability, querying them only post-settlement or in daily batch jobs.

---

## 4. Contextual Analysis Gaps: Isolated Transactions vs. Relational Dynamics

Beyond raw data availability, existing fraud detection architectures suffer from severe **contextual myopia**:

```text
                        THE CONTEXTUAL MYOPIA GAP
                        
  Existing System Evaluation: [ISOLATED POINT-IN-TIME TRANSACTION]
  ┌─────────────────────────────────────────────────────────────┐
  │ Sender: User_A | Recipient: User_B | Amount: $2,500 | P=OK  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ Missing Contextual Layers:
  ┌─────────────────────────────────────────────────────────────┐
  │ Layer 1: Social Context (Who introduced User_B to User_A?)  │
  │ Layer 2: Relational Graph (How many hops between A and B?)  │
  │ Layer 3: Psychological State (Is User_A crying or coached?) │
  │ Layer 4: Recipient Multi-Bank Flow (Is B smurfing cash?)    │
  └─────────────────────────────────────────────────────────────┘
```

- **Point-in-Time Evaluation**: Modern fraud scoring treats each transaction as an independent, identically distributed (i.i.d.) statistical event, evaluated against the user's historical tabular profile. It lacks relational context regarding *how* the payee entered the user's life.
- **Lack of Entity Resolution**: Criminal syndicates rotate through dozens of synthetic accounts across multiple banks that share identical physical phone IMEI numbers, IP subnets, or common cash-out agents. Because banks do not integrate entity resolution across institutional boundaries, each account appears as a fresh, low-risk individual customer.

---

## 5. Summary of Dimensions C & E Gaps

```text
             STRUCTURE OF DIMENSIONS C & E INFORMATION GAPS
             
  [GAP-INFO-01] Epistemic Unrecorded Coercion
  └─► Scammer verbal threats occur off-chain and leave zero digital record.
  
  [GAP-INFO-02] Cross-Bank Secrecy Silos
  └─► Bank secrecy laws legally prevent sharing recipient mule velocity with sending bank.
  
  [GAP-INFO-03] Mobile OS Platform Blindness
  └─► Apple iOS and Android sandboxing prevent inspecting call states and screen-sharing tools.
  
  [GAP-INFO-04] Architectural Telemetry Dropping
  └─► Rich client behavioral hesitation is stripped before reaching the core payment switch.
  
  [GAP-INFO-05] Isolated Transaction Myopia
  └─► Systems evaluate transactions as isolated events rather than relational social funnels.
```

The context and information analysis demonstrates that solving payment scams is not a matter of building bigger neural networks on existing tabular feeds. The foundational limitation is that **the critical predictive signals are legally locked, platform-blocked, or architecturally stripped** before reaching the decision engine.

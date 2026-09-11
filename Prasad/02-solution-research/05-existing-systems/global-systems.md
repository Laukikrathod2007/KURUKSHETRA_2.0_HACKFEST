# Global Payment Security Systems: International Architectures, Liability Regimes, and Transferable Insights

---

## 1. Executive Understanding
Authorized Push Payment (APP) scams are not an Indian anomaly; they represent the **fastest-growing category of financial crime globally**. As instant payment rails have expanded across the United Kingdom (Faster Payments), Singapore (PayNow), Australia (NPP), the European Union (SEPA Instant), and the United States (FedNow), fraudsters worldwide have pivoted away from credential theft toward social-engineering manipulation.

By analyzing how leading international jurisdictions and global payment giants (Visa, Mastercard, Stripe, BioCatch) combat APP fraud, we can extract **proven architectural patterns, regulatory liability shifts, and concrete technical solutions** directly applicable to PS09.

---

## 2. International Regulatory and Technical Architectures

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      GLOBAL PAYMENT SECURITY ARCHITECTURES                                │
├───────────────────┬─────────────────────────────────┬─────────────────────────────────────┤
│ JURISDICTION      │ KEY TECHNICAL / POLICY SYSTEM   │ ARCHITECTURAL ADVANCE               │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **United Kingdom**│ • Confirmation of Payee (CoP)   │ • Cryptographic name matching before│
│ (Faster Payments) │ • PSR 50:50 Reimbursement       │   clearing; mandatory bank liability│
│                   │   Mandate (October 2024)        │   split (Sending vs Receiving Bank) │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Singapore**     │ • MAS Shared Responsibility     │ • "Money Lock" architecture; telco- │
│ (PayNow / MAS)    │   Framework                     │   bank SMS sender ID registry;      │
│                   │ • Kill-Switch / Money Lock      │   biometric step-up for new tokens  │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **Australia**     │ • Confirmation of Payee (CoP)   │ • Inter-industry data fusion cell   │
│ (NPP / PayID)     │ • National Anti-Scam Centre     │   (Banks + Telcos + Big Tech)       │
│                   │   (NASC) Real-Time Fusion       │   halting coordinated syndicates    │
├───────────────────┼─────────────────────────────────┼─────────────────────────────────────┤
│ **United States** │ • Early Warning Systems (Zelle) │ • In-app behavioral alerts; high-   │
│ (FedNow / Zelle)  │ • FedNow Fraud Mitigation Tools │   friction confirmation for novel   │
│                   │   (Thresholds, negative lists)  │   unlinked bank recipient accounts  │
└───────────────────┴─────────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Deep Analysis of Global Breakthroughs

### 1. The UK Confirmation of Payee (CoP) and the 50:50 Liability Revolution
The UK was the first major market to implement **Confirmation of Payee (CoP)** across Open Banking APIs:
- When a remitter enters a Sort Code and Account Number, the receiving bank matches the name and returns: `Exact Match`, `Close Match` (with proposed correct name), or `No Match`.
- **The October 2024 PSR Mandate:** The Payment Systems Regulator (PSR) enacted a radical rule: **Banks must reimburse APP scam victims up to £85,000, split 50/50 between the sending and receiving banks**.
- **The Architectural Impact:** This single regulatory change transformed anti-scam technology from a "cost center" to a **boardroom-level financial imperative**, forcing banks to deploy advanced behavioral biometrics and recipient profiling.

### 2. Singapore's "Money Lock" Architecture (MAS)
Recognizing that cognitive manipulation can induce victims into authorizing transfers despite warnings, the Monetary Authority of Singapore (MAS) and major banks (DBS, OCBC, UOB) introduced **Money Lock**:
- Customers designate a specific balance (e.g., $50,000) that is **completely inaccessible via digital payment rails (PayNow/Web)**.
- Funds in the Money Lock can only be unlocked through physical in-branch verification or an offline hardware security key.
- **Result:** Even if a victim is thoroughly coerced by a "Digital Arrest" scammer, the scammer cannot drain their core life savings.

### 3. Global Commercial Fraud Platforms (Visa, BioCatch, Stripe)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                      GLOBAL VENDOR FRAUD CAPABILITIES                                     │
├───────────────────┬─────────────────────────────────┬──────────────┬──────────────────────┤
│ PLATFORM          │ CORE METHODOLOGY                │ LATENCY      │ SPECIALIZED VALUE    │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **Visa Advanced   │ Deep neural networks scoring    │ < 50 ms      │ Global risk scoring  │
│  Authorization**  │ 500+ attributes across global   │ (Switch net) │ across billions of   │
│                   │ clearing network                │              │ merchant terminals   │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **BioCatch**      │ Behavioral Biometrics: Gyro,    │ 10 - 25 ms   │ Detects "Coercion &  │
│                   │ Touch pressure, mouse jitter,   │ (Client SDK) │ Hesitation" during   │
│                   │ hesitation intervals            │              │ real-time session    │
├───────────────────┼─────────────────────────────────┼──────────────┼──────────────────────┤
│ **Sardine.ai**    │ Device integrity + Ingress      │ 40 - 80 ms   │ Correlates phone call│
│                   │ telemetry + AML Graph           │ (API Gateway)│ state with instant   │
│                   │                                 │              │ fintech fund flows   │
└───────────────────┴─────────────────────────────────┴──────────────┴──────────────────────┘
```

---

## 4. Transferability to the Indian UPI Landscape

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                    GLOBAL PATTERN TRANSFERABILITY TO INDIA / UPI                          │
├───────────────────────┬───────────────────────────────┬───────────────────────────────────┤
│ INTERNATIONAL PATTERN │ TRANSFERABLE TO UPI?          │ SYSTEMIC BOTTLENECK IN INDIA      │
├───────────────────────┼───────────────────────────────┼───────────────────────────────────┤
│ **Confirmation of     │ **ALREADY NATIVE:**           │ Users misinterpret "Verified Name"│
│   Payee (CoP)**       │ UPI `RespValAdd` already      │ checkmark as a safety endorsement │
│                       │ resolves legal name from CBS  │ rather than simple identity lookup│
├───────────────────────┼───────────────────────────────┼───────────────────────────────────┤
│ **Mandatory 50:50     │ **POLICY PENDING:**           │ Current RBI circulars place 100%  │
│   Reimbursement**     │ Under active RBI review; not  │ liability on remitter if MPIN was │
│                       │ yet legally enforceable       │ entered willingly                 │
├───────────────────────┼───────────────────────────────┼───────────────────────────────────┤
│ **Behavioral Coercion │ **HIGHLY TRANSFERABLE:**      │ Must be packaged into lightweight │
│   Biometrics**        │ BioCatch-style sensor tracking│ SDKs compatible with low-end      │
│                       │ runs on standard Android APIs │ Android smartphones ($100 devices)│
├───────────────────────┼───────────────────────────────┼───────────────────────────────────┤
│ **Money Lock Vault**  │ **HIGHLY TRANSFERABLE:**      │ Requires bank CBS integration to  │
│                       │ Segmenting UPI-linked balance │ isolate core deposits from UPI    │
│                       │ from core savings accounts    │ primary virtual address           │
└───────────────────────┴───────────────────────────────┴───────────────────────────────────┘
```

---

## 5. Epistemic Assessment for PS09

1. **Leverage Native UPI CoP:** We do not need to invent a recipient name verification service; UPI's `RespValAdd` already exists. The innovation is in **semantic discrepancy detection** (matching expected purpose against resolved legal name).
2. **Adopt Behavioral Sensor Paradigms:** The global success of BioCatch proves that **touch hesitation, accelerometer jitter, and concurrent phone call flags** are viable discriminators for psychological coercion.
3. **Anticipate Regulatory Alignment:** As India moves toward enhanced consumer protection, solutions that provide **defensible, auditable pre-PIN cognitive friction** will become mission-critical compliance assets for banks and TPAPs.

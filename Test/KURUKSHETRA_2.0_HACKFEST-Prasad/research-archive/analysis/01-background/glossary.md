# Domain Glossary: Payments, Fraud & Security Terminology

---

### Account Takeover (ATO)
*   **Definition**: A form of unauthorized fraud where an adversary illicitly obtains a legitimate user's login credentials and takes control of their account to initiate transfers.
*   **Context in this project**: Represents the primary threat traditional bank fraud engines were built to solve; must be strictly contrasted with APP scams.
*   **Common confusion**: Often confused with scams; in ATO, the *criminal* logs in and executes the payment, whereas in a scam, the *victim* logs in and executes the payment.
*   **Source**: Federal Reserve FraudClassifier Model; UK Finance.

---

### Authorized Push Payment (APP) Scam
*   **Definition**: A fraudulent scheme where a payer is deceived or manipulated into initiating an electronic transfer from their own account to an account controlled by a criminal.
*   **Context in this project**: The exact threat class targeted by the project problem statement.
*   **Common confusion**: Often conflated with unauthorized card fraud. Unlike unauthorized fraud, APP scams involve explicit, valid authentication by the account holder.
*   **Source**: UK Payment Systems Regulator (PSR PS23/3); CPMI/BIS.

---

### Beneficiary Bank (Acquiring Bank)
*   **Definition**: The financial institution holding the deposit account of the payee that receives and credits incoming payment instructions from the payment switch.
*   **Context in this project**: The locus where money mule accounts reside and where post-settlement funds can be frozen before cash-out.
*   **Common confusion**: Often confused with the Remitter Bank; the beneficiary bank receives credit, the remitter bank debits.
*   **Source**: ISO 20022 Financial Messaging Standard; NPCI Procedural Guidelines.

---

### Common Library (CL)
*   **Definition**: A secure, isolated native UI component mandated by payment networks (such as NPCI in UPI) for capturing customer PINs inside an isolated OS process.
*   **Context in this project**: Represents an unmodifiable boundary that protects customer credentials from host apps, blinding host apps to the raw PIN.
*   **Common confusion**: Conflated with general software developer SDKs; the CL is specifically a security enclave for credential capture.
*   **Source**: NPCI UPI Common Library Technical Specifications.

---

### Confirmation of Payee (CoP)
*   **Definition**: An account name checking service that validates whether the account name entered by the payer matches the legal registered name on the receiving bank account.
*   **Context in this project**: A primary baseline scam mitigation mechanism; helps prevent simple invoice redirect scams, but easily circumvented by mules.
*   **Common confusion**: Believed to eliminate all scams; in reality, scammers create mule accounts matching the scam pre-text (e.g., "Electricity Dept").
*   **Source**: Pay.UK CoP Rules; European Instant Payments Regulation (VoP).

---

### Deferred Net Settlement (DNS)
*   **Definition**: A settlement mechanism where payment instructions are cleared in real time between customers, but net interbank obligations are settled periodically in batches.
*   **Context in this project**: Explains why retail payments appear instantaneous to users even though central bank reserve movements occur periodically throughout the day.
*   **Common confusion**: Confused with RTGS; DNS settles net balances periodically, whereas RTGS settles gross amounts continuously.
*   **Source**: Bank for International Settlements (BIS) Red Book.

---

### Device Binding
*   **Definition**: A security protocol that cryptographically ties a mobile banking application to the physical SIM card, IMEI, and cryptographic hardware keystore of a specific handset.
*   **Context in this project**: Ensures that transactions originate from the genuine user's phone, confirming that APP scams occur from authentic hardware.
*   **Common confusion**: Believed to prevent scams; device binding prevents device spoofing, but does nothing when the legitimate user uses their own phone.
*   **Source**: RBI Master Direction on Digital Payment Security Controls.

---

### Digital Arrest Scam
*   **Definition**: An aggressive cyber extortion scheme where scammers impersonate law enforcement/customs via video call, claiming the victim is under investigation and coercing them to transfer funds to a "safe government escrow" account.
*   **Context in this project**: A high-impact, high-value APP scam typology prevalent in instant payment ecosystems.
*   **Common confusion**: Thought to involve physical arrest; it is a purely psychological confidence game conducted over phone/video calls.
*   **Source**: Indian Cyber Crime Coordination Centre (I4C); RBI Advisories (2024).

---

### Hardware Security Module (HSM)
*   **Definition**: A hardened, tamper-resistant physical computing device used by financial institutions for cryptographic key generation, digital signing, and PIN verification.
*   **Context in this project**: The central cryptographic anchor within issuing banks that validates encrypted PIN blocks in hardware.
*   **Common confusion**: Assumed to be software; HSMs are dedicated, certified physical server appliances.
*   **Source**: NIST FIPS 140-2/140-3 Cryptographic Module Standards; PCI PIN Security.

---

### In-Flight Transaction
*   **Definition**: The temporal state of a payment instruction between the moment it is dispatched from the client application and the moment it achieves final settlement confirmation.
*   **Context in this project**: The synchronous window (< 2000ms) where real-time rail interception must occur.
*   **Common confusion**: Confused with pre-transaction drafting; an in-flight transaction is actively transiting network switches.
*   **Source**: ISO 20022 Operational Guidelines.

---

### Money Mule
*   **Definition**: An individual whose bank account is utilized to receive and rapidly disperse stolen or scammed funds to obscure the money trail.
*   **Context in this project**: The critical off-ramp infrastructure required to monetize payment scams.
*   **Common confusion**: Assumed to always be criminal masterminds; many mules are unwitting victims of fake job offers or rented account schemes.
*   **Source**: Europol European Money Mule Action (EMMA); FATF Red Flag Indicators.

---

### MPIN (Mobile Personal Identification Number)
*   **Definition**: A 4- or 6-digit numeric secret passcode held exclusively by the customer and entered into a secure enclave to authorize payment instructions on mobile rails.
*   **Context in this project**: The cryptographic possession/knowledge factor that provides non-repudiation for authorized push payments.
*   **Common confusion**: Confused with an SMS OTP; an MPIN is a static secret known only to the user, whereas an OTP is a dynamic one-time code generated by the server.
*   **Source**: NPCI UPI Architecture Guidelines.

---

### Payment Service Provider (PSP)
*   **Definition**: A licensed financial entity or bank that connects front-end payment applications to the central clearing network and processes payment message requests.
*   **Context in this project**: An architectural intermediary holding message routing authority and transaction telemetry.
*   **Common confusion**: Conflated with TPAPs; TPAPs provide the consumer app UI, while PSPs provide the regulated banking and payment gateway backend.
*   **Source**: Reserve Bank of India PSSA Guidelines; European PSD2.

---

### Real-Time Gross Settlement (RTGS)
*   **Definition**: A funds transfer mechanism where the transfer of money or securities takes place from one bank to another on a real-time and gross (individual transaction) basis.
*   **Context in this project**: Represents the foundational settlement standard for wholesale interbank transfers, contrasting with retail DNS systems.
*   **Common confusion**: Confused with retail real-time payments (RTP/UPI); RTGS traditionally handles high-value corporate transfers.
*   **Source**: Committee on Payments and Market Infrastructures (CPMI).

---

### Remitter Bank (Issuing Bank)
*   **Definition**: The commercial bank where the payer maintains their deposit account; responsible for debiting the customer's balance upon valid authentication.
*   **Context in this project**: The entity that bears regulatory pressure and possesses final authority to approve or decline the debit instruction.
*   **Common confusion**: Confused with the payment app; the app is merely a front-end; the remitter bank holds the actual funds.
*   **Source**: ISO 20022 pacs.008 Specification.

---

### Social Engineering
*   **Definition**: The psychological manipulation of individuals into performing actions or divulging confidential information, exploiting cognitive biases rather than technical vulnerabilities.
*   **Context in this project**: The core attack vector responsible for inducing authorized payment scams.
*   **Common confusion**: Conflated with software hacking; social engineering hacks human psychology, not computer code.
*   **Source**: NIST SP 800-63-3; ENISA Threat Landscape.

---

### Third-Party Application Provider (TPAP)
*   **Definition**: A software company that provides a customer-facing mobile application for payments (e.g., Google Pay, PhonePe, Paytm) under sponsorship from a licensed PSP bank.
*   **Context in this project**: The client-side touchpoint possessing the richest real-time behavioral and device telemetry.
*   **Common confusion**: Assumed to be banks; TPAPs are technology platforms that do not hold banking licenses or customer deposits.
*   **Source**: NPCI Unified Payments Interface Procedural Guidelines.

---

### Unified Payments Interface (UPI)
*   **Definition**: An interoperable instant real-time payment system developed by NPCI facilitating inter-bank peer-to-peer (P2P) and peer-to-merchant (P2M) transactions in India.
*   **Context in this project**: The premier real-world instant payment ecosystem exemplifying high-volume, sub-second settlement.
*   **Common confusion**: Confused with a single mobile app; UPI is an underlying national protocol used across hundreds of banks and apps.
*   **Source**: National Payments Corporation of India (NPCI).

---

### Virtual Payment Address (VPA)
*   **Definition**: A unique financial identifier (alias) used in UPI (e.g., `username@bankname`) that maps to a user's underlying bank account and routing details without exposing them.
*   **Context in this project**: The primary addressing token utilized in routing transactions and identifying destination mule accounts.
*   **Common confusion**: Assumed to be an account number; a VPA is a flexible, revocable alias pointing to an account.
*   **Source**: NPCI UPI Architecture Specification.

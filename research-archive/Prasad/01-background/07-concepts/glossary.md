# Comprehensive Domain Glossary: Technical, Regulatory, and Fraud Terminology

---

### 1. VPA (Virtual Payment Address)
* **Definition:** A unique financial identifier used in the Unified Payments Interface (UPI) that maps a user-friendly handle (e.g., `name@bank`) to an underlying physical bank account number and IFSC code.
* **Context in PS09:** The primary destination identifier parsed by the Guardian during payment initiation. Target of the Recipient Verification Workflow.
* **Distinction / Confusion:** Often confused with a username or email. A VPA is an active cryptographic routing address managed by a PSP bank.
* **Source:** NPCI UPI Procedural Guidelines.

### 2. MPIN (Mobile Personal Identification Number)
* **Definition:** A 4- or 6-digit secret numerical password known only to the user, entered inside the secure NPCI Common Library to authorize a debit from their bank account.
* **Context in PS09:** Marks the absolute **Point of Irreversible Commit (PIC)**. Once the MPIN is submitted, client-side intervention is impossible.
* **Distinction / Confusion:** Often confused with an ATM card PIN or OTP. Unlike an SMS OTP (which is sent over telecommunication networks), the MPIN is never transmitted in cleartext and is authenticated directly by the bank's HSM.
* **Source:** RBI Master Direction on Digital Payment Security Controls.

### 3. TPAP (Third-Party Application Provider)
* **Definition:** An entity that provides a consumer-facing mobile payment application interface (e.g., Google Pay, PhonePe, Paytm, CRED) to facilitate UPI transactions through a partner PSP bank.
* **Context in PS09:** The primary operational layer where the "Agentic Guardian" conceptually resides, capturing user dwell time, rendering explainable security alerts, and deploying protective friction before MPIN entry.
* **Distinction / Confusion:** Often mistakenly called "payment gateways" or "banks." TPAPs do not hold banking licenses and do not touch or settle customer funds.
* **Source:** NPCI Tripartite Agreement Model.

### 4. Authorized Push Payment (APP) Scam
* **Definition:** A financial fraud scheme wherein a legitimate account holder is deceived or coerced by an adversary into instructing their bank to transfer funds directly to an account controlled by the criminal.
* **Context in PS09:** The core threat model of the entire problem statement. Traditional fraud engines fail because the transaction is 100% authenticated by the legitimate user.
* **Distinction / Confusion:** Conflated with "unauthorized fraud" (such as stolen credit cards or hacked passwords). In APP scams, the user's mind was hacked, not their credentials.
* **Source:** UK Payment Systems Regulator (PSR) Policy Statement PS23/4.

### 5. Money Mule
* **Definition:** A person who transfers or withdraws illegally acquired money on behalf of others, providing the infrastructure for cybercrime syndicates to layer and cash out stolen funds.
* **Context in PS09:** The counterparty in virtually all digital payment scams. Detecting mule characteristics (account creation age, name mismatch, handle anomalies) is central to recipient verification.
* **Distinction / Confusion:** Often assumed to be stolen or fake accounts. In reality, most mule accounts in India are genuine, KYC-compliant accounts rented from students or daily-wage workers.
* **Source:** Financial Action Task Force (FATF) Typology on Money Mules.

### 6. Cognitive Tunneling / Amygdala Hijacking
* **Definition:** A psychological state induced by extreme urgency, terror, or excitement wherein analytical processing (prefrontal cortex) shuts down, forcing reflexive, tunnel-vision compliance (amygdala).
* **Context in PS09:** Explains why scam victims ignore traditional security dialogs and vigorously click "Proceed" while on the phone with an impersonator.
* **Distinction / Confusion:** Often dismissed as "user stupidity." Cognitive tunneling affects educated professionals, doctors, and judges under targeted psychological pressure.
* **Source:** Kahneman, Daniel: *Thinking, Fast and Slow*.

### 7. Cognitive Interruption Challenge
* **Definition:** A security interaction pattern that forces a user out of automatic compliance by requiring active mental effort (e.g., typing a confirmation keyword or answering a context-specific logic question) that directly contradicts the scam narrative.
* **Context in PS09:** The optimal implementation of the mandated *"User confirmation step"* for high-risk transactions.
* **Distinction / Confusion:** Distinct from traditional "OK/Cancel" modals, which users dismiss within 300 milliseconds via motor habituation.
* **Source:** Cranor, Lorrie Faith: *Human-in-the-loop Security Framework*.

### 8. Confirmation of Payee (CoP)
* **Definition:** An automated pre-transaction lookup mechanism that verifies whether the name entered by the payer matches the actual legal name registered on the receiving bank account.
* **Context in PS09:** The conceptual gold standard for the *"Recipient verification workflow"*.
* **Distinction / Confusion:** Verifying that a name matches proves identity; it does **not** prove trustworthiness (since mules are also identity-verified).
* **Source:** UK PSR CoP Technical Standards.

### 9. Point of Irreversible Commit (PIC)
* **Definition:** The state transition boundary in a payment lifecycle beyond which a financial instruction cannot be recalled, paused, or canceled by client-side software.
* **Context in PS09:** Defines the non-negotiable temporal boundary: all Guardian evaluations and interventions must complete **prior to PIC (Pre-PIN)**.
* **Distinction / Confusion:** Often assumed to be when the money arrives in the recipient's bank. In reality, PIC occurs the moment the remitter bank HSM confirms the debit.
* **Source:** ISO 20022 Financial Services Specifications.

### 10. Indirect Prompt Injection
* **Definition:** An adversarial AI vulnerability where untrusted data ingested by an LLM contains natural language instructions that hijack the model's control flow and override its system prompt.
* **Context in PS09:** A primary threat vector when an LLM is used to evaluate free-text payment remarks (`tn`) or merchant display names (`pn`).
* **Distinction / Confusion:** Distinct from direct jailbreaking. Indirect injection arrives through passive data channels (the payment note), not from the user chat window.
* **Source:** OWASP Top 10 for Large Language Model Applications (LLM01).

### 11. Bounded Autonomy
* **Definition:** An architectural paradigm where an AI agent possesses cognitive freedom to investigate, call tools, and synthesize explanations, but its final permitted action space is strictly confined by deterministic, verifiable rules.
* **Context in PS09:** Satisfies the requirement for *"Safe autonomous decision-making"* while preventing catastrophic AI hallucinations in financial transactions.
* **Distinction / Confusion:** Distinct from unbounded autonomy (where an agent can execute arbitrary API commands or make final unconstrained financial decisions).
* **Source:** NIST AI Risk Management Framework (AI RMF 1.0).

### 12. 1930 / CFCFRMS
* **Definition:** The National Cyber Crime Reporting Portal helpline and the Citizen Financial Cyber Fraud Reporting and Management System operated by the Indian Cyber Crime Coordination Centre (I4C).
* **Context in PS09:** Represents the existing institutional mechanism for post-transaction cybercrime reporting and inter-bank mule freezing in India.
* **Distinction / Confusion:** It is a reactive, post-facto recovery system, not a real-time pre-transaction interception system.
* **Source:** Ministry of Home Affairs (MHA), Government of India.

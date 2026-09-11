# Core User and Actor Model

## 1. Executive Summary & Actor Taxonomy

In socio-technical financial security architectures, confusing general ecosystem stakeholders with **direct operational product actors** produces bloated user interfaces, contradictory permission models, and confused interaction workflows.

Phase 2 identified eight broad ecosystem stakeholders (including national payment switches, telecom providers, and criminal syndicates). The Bare-Minimum PRD winnows this list down to the **four direct operational actors** who actively interface with, receive data from, or execute decisions within the Agentic Guardian system:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCT ACTOR TAXONOMY                                    │
├───────────────────┬───────────────────────────────┬────────────────────────────────────┤
│ Actor Role        │ Interface Channel             │ Operational Primary Goal           │
├───────────────────┼───────────────────────────────┼────────────────────────────────────┤
│ 1. Payment Sender │ Mobile Banking Client SDK / UI│ Complete authentic payment safely  │
│ 2. Fraud SOC Ops  │ Web-based Analyst Workbench   │ Triage flagged alerts & overrides  │
│ 3. Bank Switch GW │ Machine-to-Machine API        │ Route & clear transactions ≤45ms   │
│ 4. Recipient Bank │ Inter-Bank Out-of-Band API    │ Ingest mule alerts & freeze funds  │
└───────────────────┴───────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Detailed Actor Specifications

### 2.1 Actor 1: The Payment Sender (Victim / Consumer)
- **Role & Profile**: The authenticated account owner initiating an instant push payment via a mobile banking application. May be under acute psychological coercion (System 1 tunnel vision) or conducting a routine benign payment.
- **Primary Goal**: Complete an intended fund transfer quickly, or be protected from deceptive theft if being defrauded.
- **Interaction with System**:
  - *Pre-Flight*: Interacts normally with payment fields; telemetry SDK passively measures touch intervals, clipboard pastes, and navigation timing.
  - *Intervention*: If transaction is flagged (Level 2 or Level 3), sender encounters non-dismissive, dynamic de-biasing dialogues and active cognitive comprehension checks before PIN entry.
  - *Redress*: If transaction is placed on hold (Level 4), sender can trigger emergency bypass (for medical/utility bills) or initiate an expedited review challenge.
- **Information Received**: Causal risk transparency statements (e.g., *"Warning: The recipient account was created today and has received multiple rapid transfers"*), cognitive grounding questions, and cooling-off status notices.
- **Action Taken**: Confirms, cancels, completes verification questions, or exercises emergency bypass.
- **Responsibility**: Authenticates payment credentials; provides truthful contextual answers during de-biasing challenges.
- **Failure Consequence**: If the system fails to intervene, the sender loses irreversible personal funds; if the system insults the sender with false blocks, sender suffers friction and payment abandonment.

---

### 2.2 Actor 2: Fraud Operations Specialist (SOC Analyst)
- **Role & Profile**: Tier-1 and Tier-2 bank fraud investigators monitoring escalated transaction queues and managing exception workflows.
- **Primary Goal**: Rapidly triage high-risk/high-uncertainty payment alerts, review customer challenges, and authorize legitimate high-value exceptions without creating queue backlogs.
- **Interaction with System**:
  - Accesses web-based operational dashboard displaying prioritized queues of Level 3 (Intervene) and Level 4 (Hold) transactions.
  - Reviews automated case synthesis packages containing timeline graphs, risk factor attributions, and telephony status flags.
  - Enforces dual-control overrides when releasing held funds (`REQ-HITL-003`).
- **Information Received**: Pre-computed causal feature attribution summaries, risk scores, epistemic confidence intervals, device attestation records, and customer self-reported explanations.
- **Action Taken**: Approves, denies, extends hold, escalates to law enforcement, or initiates customer callback.
- **Responsibility**: Exercises final human authority on irreversible adverse actions; ensures regulatory compliance with SAR and AML guidelines.
- **Failure Consequence**: Slow triage causes customer queue abandonment; accidental approval of fraud allows syndicate cash-out; wrongful denial sparks customer complaints and regulatory fines.

---

### 2.3 Actor 3: Core Banking Payment Switch Gateway (Automated System Actor)
- **Role & Profile**: In-line transaction processing engine connecting the sending bank's core ledger to the national central switch (e.g., NPCI, FedNow, Faster Payments).
- **Primary Goal**: Clear transactions within strict regulatory latency SLAs ($\le 50\text{ms}$) while enforcing bank risk policies.
- **Interaction with System**:
  - Injects transaction authorization requests into the Guardian In-Line Evaluation API via low-latency gRPC / REST over mTLS 1.3.
  - Receives structured decision directives (`Allow`, `Inform`, `Intervene`, `Hold`) within the $\le 45\text{ms}$ budget.
  - Executes circuit-breaker fail-open if the risk engine fails to respond within $45\text{ms}$.
- **Information Received**: Machine-readable JSON/Protocol Buffer payload containing directive, action codes, risk scores, and timeout flags.
- **Action Taken**: Routes payment to switch, suspends payment pending client de-biasing, or executes immediate payment decline.
- **Responsibility**: Enforces hard network timeouts; guarantees transactional ledger integrity.
- **Failure Consequence**: If the gateway hangs or exceeds $50\text{ms}$, national switch drops the connection, causing transaction failure across the bank.

---

### 2.4 Actor 4: Recipient Institution Fraud Gateway (Inter-Bank Node)
- **Role & Profile**: Beneficiary bank hosting the receiving account / mule VPA.
- **Primary Goal**: Protect institution from hosting money-laundering mules and comply with national fraud reimbursement mandates.
- **Interaction with System**:
  - Receives asynchronous, out-of-band containment alerts dispatched by the Guardian within $\le 60\text{s}$ of payment clearance.
  - Ingests cryptographically signed ISO 20022 `camt.056` payment reversal or provisional hold advisories.
- **Information Received**: Digital certificate, transaction reference, inbound transfer amount, sending bank risk score, and requested containment action (e.g., 2-hour outbound debit restriction).
- **Action Taken**: Automatically restricts outbound debit transfers from the mule account or routes account to urgent mule investigation queue.
- **Responsibility**: Authenticates signature of sending bank; applies proportional containment according to inter-bank operating compacts.
- **Failure Consequence**: If the receiving bank ignores or drops the alert, syndicate liquidates funds at an ATM within 90 seconds, destroying all recovery potential.

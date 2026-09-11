# Digital Payment Transaction States: Finite State Machine and Irreversibility Boundaries

---

## 1. Executive Understanding (Layer 1)
A digital transaction is governed by a strict **Finite State Machine (FSM)** executed asynchronously across distributed ledgers. In high-velocity retail payment protocols like UPI and IMPS, the state transitions move rapidly through transient staging states before reaching one of three final terminal states: **`SUCCESS`**, **`FAILURE`**, or **`DEEMED / PENDING`**.

The single most consequential boundary in this state machine is the **Point of Irreversible Commit (PIC)**. Prior to this point, the transaction can be aborted, canceled, paused, or dropped with zero financial impact. Once the PIC is crossed, the remitter's core banking ledger is debited, and the transaction is mathematically and operationally irreversible by client-side software.

---

## 2. Finite State Machine & State Transition Architecture (Layer 2)

```mermaid
stateDiagram-v2
    [*] --> INITIATED: User enters VPA / Scans QR
    INITIATED --> VALIDATING: Client App sends ReqValAdd
    
    VALIDATING --> REJECTED: Invalid VPA / Blocked Handle
    VALIDATING --> PENDING_AUTH: VPA Resolved (Payee Name Returned)
    
    note right of PENDING_AUTH
        THE CRITICAL GUARDIAN WINDOW
        - Transaction mutable
        - Risk scoring & reasoning
        - User challenge / Pause / Block
    end note

    PENDING_AUTH --> ABORTED_BY_USER: User Cancels / Back Button
    PENDING_AUTH --> BLOCKED_BY_GUARDIAN: High Risk Interception
    PENDING_AUTH --> AUTH_CAPTURED: User enters MPIN in Common Library
    
    AUTH_CAPTURED --> ROUTED_SWITCH: Encrypted ISO 20022 Packet Sent
    
    ROUTED_SWITCH --> DEBIT_PENDING: Switch dispatches to Remitter CBS
    DEBIT_PENDING --> DEBIT_FAILED: Insufficient Funds / Bad MPIN
    DEBIT_PENDING --> DEBIT_COMMITTED: Remitter CBS Debits Account
    
    note right of DEBIT_COMMITTED
        POINT OF IRREVERSIBLE COMMIT (PIC)
        - Money has left Payer's custody
        - Client interception impossible
    end note

    DEBIT_COMMITTED --> CREDIT_PENDING: Switch dispatches to Beneficiary CBS
    
    CREDIT_PENDING --> SUCCESS: Beneficiary CBS Credits Mule Ledger
    CREDIT_PENDING --> DEEMED_PENDING: Network Timeout / Bank Downtime
    
    DEEMED_PENDING --> SUCCESS: Resolved via Post-Facto Auto-Reconciliation
    DEEMED_PENDING --> AUTO_REVERSED: Beneficiary Bank Rejects; Auto-Refund to Payer (T+1)

    SUCCESS --> [*]: Money Available for Cash-Out
    DEBIT_FAILED --> [*]: Transaction Terminated
    REJECTED --> [*]: Transaction Terminated
    ABORTED_BY_USER --> [*]: Transaction Terminated
    BLOCKED_BY_GUARDIAN --> [*]: Threat Intercepted Safely
    AUTO_REVERSED --> [*]: Funds Restored
```

---

## 3. State Definitions & Operational Latencies (Layer 3)

| Protocol State | Owner / Locus | Ledger Impact | Typical Dwell Time | Reversibility Status |
| :--- | :--- | :--- | :--- | :--- |
| **`INITIATED`** | Client Device | None | $100\text{ ms} - 500\text{ ms}$ | **100% Reversible** (Local state only). |
| **`VALIDATING`** | PSP / Switch | None | $150\text{ ms} - 400\text{ ms}$ | **100% Reversible** (Read-only query). |
| **`PENDING_AUTH`** | Client UI / Payer | None | **$2,000\text{ ms} - 15,000\text{ ms}$** | **100% Reversible** (Funds untouched; user has not authorized). |
| **`AUTH_CAPTURED`** | NPCI Common Library | None | $500\text{ ms} - 1,500\text{ ms}$ | **Reversible** (PIN captured locally, packet not committed). |
| **`ROUTED_SWITCH`** | NPCI Central Core | None | $50\text{ ms} - 150\text{ ms}$ | **Practically Irreversible** (Packet in-flight in switch). |
| **`DEBIT_COMMITTED`**| Remitter Bank CBS | Payer Account Debited | $100\text{ ms} - 300\text{ ms}$ | **IRREVERSIBLE COMMIT:** Legal ownership transfer begins. |
| **`CREDIT_PENDING`** | Beneficiary Bank CBS| Inter-bank clearing hold | $100\text{ ms} - 400\text{ ms}$ | **Irreversible:** Beneficiary bank must honor instruction. |
| **`SUCCESS`** | Beneficiary Ledger | Recipient Account Credited | Permanent Terminal State | **Final:** Irreversible except via court order or beneficiary approval. |
| **`DEEMED_PENDING`** | Switch / Settlement | Payer Debited; Recipient Pending | Hours to Days | Reconciled via NPCI automated settlement dispute files. |

---

## 4. Boundaries, Misconceptions & Epistemic Realities (Layer 4)

### 4.1 The "Deemed Success" Dilemma
In high-volume payment networks, a percentage of transactions (~0.2%–0.5%) enter the `DEEMED_PENDING` state due to network dropouts between NPCI and the beneficiary bank.
* Under RBI's **Harmonisation of Turn Around Time (TAT) and Customer Compensation** circular (DPSS.CO.PD No.629/02.01.014/2019-20), banks have **$T+1$ business days** to either complete the credit or reverse the funds to the remitter, subject to a ₹100/day penalty for delays.
* **Scam Implications:** Scammers know that if a transaction shows "Pending" in the victim's app, the victim might attempt it a second time. Scammers frequently exploit network pending states to double-dip, tricking victims into paying twice.

### 4.2 The Absolute Point of No Return
Engineers must understand: once the state transitions from `PENDING_AUTH` to `AUTH_CAPTURED`, client-side software ceases to have any control over execution. The NPCI Common Library encrypts the PIN using the Remitter Bank's public key inside a protected OS display surface. **All agentic reasoning, recipient verification, explainability alerts, and cognitive friction challenges must complete while the transaction is in the `PENDING_AUTH` state.**

---
**Primary References:**
1. NPCI: *UPI Unified Clearing and Settlement Operating Guidelines: State Machine Specifications*.
2. Reserve Bank of India: *Harmonisation of Turn Around Time (TAT) and Customer Compensation for Failed Transactions (RBI/2019-20/67)*.
3. IEEE Transactions on Dependable and Secure Computing: *Formal Verification of Instant Payment Protocols*.

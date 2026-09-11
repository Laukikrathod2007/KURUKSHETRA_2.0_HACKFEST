# 01 — System Model: How the Payment Ecosystem Actually Works

This is the mental model everything else in this folder is built from. It is derived from the established knowledge base (`../kurukshetra-system/docs/00-fresh-base.md`, `00-implementation-plan.md`, `00-council-verdict.md`) — not re-derived from scratch.

---

## 1. Who the actors actually are

A payment is not one system. It is at minimum **six independent parties** exchanging messages, each holding a *different slice* of the truth. Getting this right is the whole point, because our solution's value depends entirely on **which party can see what, at which moment**.

| Actor | What it owns (and nobody else does) | What it cannot see |
|---|---|---|
| **Customer** | Intent. Why they're paying. | Everything about the recipient |
| **Payment app (PSP/TPAP)** — GPay, PhonePe, Paytm, BHIM | *Its own* app-local history: which recipients this user paid **through this app** | Any other app's history; the recipient's bank internals |
| **Payer's bank (remitter)** | The payer's account, balance, full statement across all rails | The recipient's account internals |
| **Payee's bank (beneficiary)** | The recipient's account: age, KYC tier, balance, who paid in, how fast it drained | The payer's history |
| **NPCI switch** | Routing metadata for **every** PSP and bank: VPA→account mapping, every `ReqValAdd` and `ReqPay` that crosses the network | Account ledgers (it routes instructions, it is not a ledger) |
| **Card network + issuer/acquirer** | Card authorization path, 3DS challenge decision | UPI-rail activity |

**The load-bearing consequence** (this is the council's Q3 finding, and it shapes the entire build): *nobody holds a complete "has payer X ever paid beneficiary Y" ledger across all apps.* The payment app holds its own slice. That is why, in this simulation, **each PSP has its own separate app-local history view**, and the demo can visibly show GPay not knowing what PhonePe knows — which is exactly the gap that makes the NPCI-level position valuable.

---

## 2. Where money actually moves

The critical distinction most demos get wrong: **NPCI does not move money. Banks do.**

NPCI is a *switch* — it routes instructions and guarantees both legs happen. The actual debit and credit are **postings in two different banks' core banking systems**. So in this simulation:

- Every account has a **balance in integer paise** (never floats — money in floats is a real bug class).
- Every completed payment writes **two ledger entries**: a `DEBIT` at the payer's bank and a `CREDIT` at the payee's bank.
- A blocked payment writes **zero** ledger entries and the balances are provably unchanged.

If the demo can't show balances actually changing (and *not* changing when blocked), it isn't a simulation — it's a slideshow.

---

## 3. The real UPI flow, step by step

```
 [1] Customer opens payment app, types/selects a UPI ID
        │
        ▼
 [2] PSP app ──── ReqValAdd(payee_vpa) ────► NPCI SWITCH
        │                                        │
        │                            [3] Central Mapper: VPA → (bank, account, name)
        │                                        │
        │                            [4] ★ KURUKSHETRA HOOK 1 (recipient intelligence)
        │                                   Tier 0 always; Tier 1 only if new/flagged
        │                                        │
        │◄─── RespValAdd(payee_name, risk meta) ─┘
        │
 [5] App shows resolved name (+ any warning). Customer enters amount, taps Pay.
        │
        ▼
 [6] PSP app ──── ReqPay(amount, payer, payee) ──► NPCI SWITCH
        │                                             │
        │                            [7] ★ KURUKSHETRA HOOK 2 (full transaction scoring)
        │                                   amount-dependent detectors now run
        │                                             │
        │                                   Decision: ALLOW / STEP_UP / COACH / FREEZE
        │                                             │
        │         ┌───────────────────────────────────┤
        │         │ FREEZE → payment never reaches auth. Zero ledger entries. Done.
        │         │ COACH  → user must explicitly acknowledge before continuing
        │         │ STEP_UP→ lightweight confirm
        │         │ ALLOW  → straight through
        │         ▼
 [8] Customer enters UPI PIN  ── encrypted on NPCI Common Library ──►  NPCI
        │   ⚠ The PIN never touches the PSP app and NEVER touches Kurukshetra.
        ▼
 [9] NPCI ──── ReqDebit ────► PAYER'S BANK (CBS)
        │                     checks balance + account status, posts DEBIT
        │◄─── RespDebit(ok) ──┘
        │
 [10] NPCI ──── ReqCredit ───► PAYEE'S BANK (CBS)
        │                      posts CREDIT
        │◄─── RespCredit(ok) ─┘
        │
 [11] NPCI records a settlement obligation between the two banks
        │
        ▼
 [12] RespPay(SUCCESS) ──► PSP app ──► Customer sees the result
```

**Where our solution sits:** steps [4] and [7] — invoked *by the NPCI switch*, before any money moves. This is Model A (NPCI-native) from `00-implementation-plan.md`, which is what we simulate, because it is the position that makes cross-PSP intelligence possible. Model B (PSP-embedded sidecar) is the same engine called from step [2]/[6] instead — the simulation supports reasoning about both, but wires the NPCI-native position.

---

## 4. The card flow (card-not-present)

Different topology entirely — there is no VPA resolution, and the "recipient" is a **merchant**, not a person.

```
 Customer at merchant checkout
        │
        ▼
 Merchant ──► ACQUIRER bank ──► CARD NETWORK (RuPay/Visa) ──► ISSUER bank
                                                                  │
                                              3-D Secure decision: challenge or not?
                                                                  │
                                              ★ KURUKSHETRA supplies an RBA risk signal
                                                  (informs; does NOT authorize)
                                                                  │
                                    ┌─────────────────────────────┤
                                    │ FRICTIONLESS → authorize straight away
                                    │ OTP_CHALLENGE → issuer sends OTP, customer enters
                                    │ DECLINE → authorization refused
                                    ▼
                          Issuer posts the DEBIT (authorization hold → capture)
```

Card-present (POS/ATM) is deliberately **out of scope**: there is no interceptable moment where a human could be warned.

---

## 5. The net-banking flow

```
 Customer logs into their bank's internet banking portal
        │
        ▼
 [A] "Add payee" (account number + IFSC)   ← equivalent of ReqValAdd
        │   ★ KURUKSHETRA HOOK 1 (same recipient intelligence, keyed on account+IFSC)
        ▼
 [B] Initiate transfer → pre-debit confirmation screen  ← equivalent of ReqPay pre-flight
        │   ★ KURUKSHETRA HOOK 2
        ▼
 [C] Bank authenticates (password + OTP), then posts the DEBIT itself
        │
        ▼
 [D] IMPS → routed via NPCI (instant).  NEFT/RTGS → batch window.
        │
        ▼
 [E] Beneficiary bank posts the CREDIT
```

Note the asymmetry worth demoing: **NEFT/RTGS settle in batches**, so a cooling-off hold there costs the user nothing — unlike UPI/IMPS where any delay is felt immediately.

---

## 6. Transaction state machine

Every payment in the simulation is a real state machine, not a boolean.

```
                    INITIATED
                        │  (recipient resolved via mapper)
                        ▼
                     RESOLVED
                        │  (Kurukshetra hook 1 + 2)
                        ▼
                  RISK_EVALUATED
                        │
        ┌───────────────┼───────────────┬──────────────────┐
        │               │               │                  │
    (FREEZE)        (COACH)         (STEP_UP)          (ALLOW)
        │               │               │                  │
        ▼               ▼               ▼                  │
     BLOCKED      AWAITING_ACK   AWAITING_CONFIRM          │
     (terminal)         │               │                  │
                        └───────┬───────┘                  │
                          user proceeds                    │
                                └──────────┬───────────────┘
                                           ▼
                                    AWAITING_AUTH   (PIN / OTP — never seen by us)
                                           │
                                    ┌──────┴───────┐
                              auth ok            auth fail
                                    ▼                 ▼
                                 DEBITED           FAILED
                                    │
                          ┌─────────┴──────────┐
                    credit ok              credit fail
                          ▼                     ▼
                      COMPLETED            REVERSED
```

Terminal states: `COMPLETED`, `BLOCKED`, `FAILED`, `CANCELLED`, `REVERSED`.
**Invariant the simulation enforces:** ledger entries exist **only** for transactions that reached `DEBITED` or beyond.

---

## 7. Which component talks to which

```
┌──────────────┐   HTTP    ┌─────────────────┐
│  FRONTEND    │◄─────────►│   API LAYER      │   (one FastAPI process)
│ user view +  │           └────────┬─────────┘
│ system view  │                    │ in-process calls
└──────────────┘                    │
                    ┌───────────────┼────────────────┬──────────────────┐
                    ▼               ▼                ▼                  ▼
            ┌──────────────┐ ┌─────────────┐ ┌──────────────┐  ┌───────────────┐
            │  PSP APPS    │ │ NETBANKING  │ │ CARD NETWORK │  │  SCENARIO     │
            │ (GPay etc.)  │ │  PORTAL     │ │  + ACQUIRER  │  │  ENGINE       │
            └──────┬───────┘ └──────┬──────┘ └──────┬───────┘  └───────────────┘
                   │                │               │
                   └────────┬───────┴───────────────┘
                            ▼
                    ┌────────────────┐        ┌──────────────────────┐
                    │  NPCI SWITCH   │───────►│   KURUKSHETRA FRM    │
                    │  + Central     │◄───────│  Tier0→Tier1→Tier2   │
                    │    Mapper      │        │  scoring + decision  │
                    └───────┬────────┘        └──────────┬───────────┘
                            │                            │ (COACH/FREEZE only)
              ┌─────────────┴────────────┐               ▼
              ▼                          ▼        ┌──────────────┐
      ┌───────────────┐          ┌───────────────┐│  MCP SERVER  │
      │ PAYER'S BANK  │          │ PAYEE'S BANK  ││  (FastMCP)   │
      │    (CBS)      │          │    (CBS)      │└──────────────┘
      └───────┬───────┘          └───────┬───────┘
              └──────────┬───────────────┘
                         ▼
                 ┌───────────────┐
                 │   DATABASE    │  (accounts, ledger, txns, risk, traces)
                 └───────────────┘
                         ▲
                 ┌───────┴───────┐
                 │ TRACE SERVICE │  every component emits events here
                 └───────────────┘
```

**Every arrow above is a real function call in this codebase.** Nothing is faked at the frontend.

---

## 8. Where each piece of information comes from

This table is the answer to "what does our solution actually receive, and from where":

| Information | Owned by | How Kurukshetra gets it |
|---|---|---|
| Payee's registered name, MCC | NPCI Central Mapper + payee's bank | Returned in `RespValAdd`, passed into hook 1 |
| Has this payer paid this payee before? | **The payment app** (app-local) | Passed in by the PSP as app-scoped history — *not* global |
| Payer's own spending history/median | Payer's bank + the app | App-local ledger view |
| Payee account age, KYC tier, balance behaviour | **Payee's bank (CBS)** | Feature-export interface from the payee bank (batch in production, direct query in sim) |
| How many people looked this payee up and walked away | **NPCI switch** (only NPCI sees all PSPs) | Switch metrics counters |
| Community fraud reports | Shared reputation service | Reputation DB |
| I4C / Aadhaar-PAN freeze / TRAI flags | Government registries | Mocked, permanently labelled `CONCEPTUAL` |

---

## 9. What happens after each decision

| Decision | What the user sees | What happens to the money | What's written |
|---|---|---|---|
| **ALLOW** | Straight to PIN | Debit + credit posted | txn `COMPLETED`, 2 ledger entries |
| **STEP_UP** | One confirmation screen | Posted after confirm | txn `COMPLETED`, 2 ledger entries |
| **COACH** | Full warning + explicit "I understand… at my own risk" checkbox | Posted only if they acknowledge and authenticate | `COMPLETED` or `CANCELLED` |
| **FREEZE** | Hard block, no bypass | **Nothing moves.** Balances provably unchanged | txn `BLOCKED`, **zero** ledger entries |

---

## 10. Honesty boundary (carried forward, non-negotiable)

- This is a **simulation of the integration point**, not a connection to NPCI. Nothing here touches a real payment network.
- Every risk signal is labelled `REAL` (works on data genuinely available), `SIMULATED` (real algorithm, mocked data source), or `CONCEPTUAL` (requires a government MoU; shown but never presented as live).
- Kurukshetra never receives a UPI PIN, OTP, password, or CVV. In this codebase that is structurally enforced: the authentication step is a separate component and the risk engine's input contract has no field for a credential.

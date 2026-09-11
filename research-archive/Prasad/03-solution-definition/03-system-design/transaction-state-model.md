# Transaction State Model: Formal Finite State Machine and Transition Invariants

---

## 1. Executive Understanding
In financial transaction engineering, **state ambiguity is the root cause of race conditions, double debits, and security bypasses**. A payment cannot simply be "in progress"; it must occupy a mathematically verified state in a **Finite State Machine (FSM)** with strictly defined transition invariants, timeouts, and terminal states.

This document formalizes the transaction state lifecycle for GuardianPay, detailing every valid transition from payment initiation through hot-path evaluation, cognitive challenge interlocking, MPIN handoff, and final settlement.

---

## 2. Complete Transaction State Diagram

```
                                 THE GUARDIANPAY STATE MACHINE
                                       [Payment Initiated]
                                                │
                                                ▼
                                      ┌───────────────────┐
                                      │   1. INITIATED    │
                                      └─────────┬─────────┘
                                                │
                                                ▼
                                      ┌───────────────────┐
                                      │ 2. UNDER_HOT_EVAL │
                                      └─────────┬─────────┘
                                                │
                ┌───────────────────────────────┼───────────────────────────────┐
                ▼ (Risk P < 0.20)               ▼ (0.20 <= P <= 0.85)           ▼ (AnyDesk / Blacklist)
     ┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
     │ 3. FAST_PATH_CLEARED │        │ 4. WARM_INVESTIGATE  │        │ 8. HARD_BLOCKED      │
     └──────────┬───────────┘        └──────────┬───────────┘        │ (Terminal Decline)   │
                │                               │                    └──────────────────────┘
                │               ┌───────────────┴───────────────┐
                │               ▼ (Entity Clash)                ▼ (Active Call + High P)
                │    ┌──────────────────────┐        ┌──────────────────────┐
                │    │ 5. CHALLENGE_ACTIVE  │        │ 6. CALL_INTERLOCK    │
                │    │ (Legal Name Typing)  │        │ (Awaiting Hangup)    │
                │    └──────────┬───────────┘        └──────────┬───────────┘
                │               │                               │
                │       ┌───────┴───────┐               ┌───────┴───────┐
                │       ▼ (User Types)  ▼ (User Aborts) ▼ (Call Ends)   ▼ (User Aborts)
                │  [Name Matched]  [User Aborts]   [Call Hangup]   [User Aborts]
                │       │               │               │               │
                │       ▼               │               ▼               │
                │  [Friction Satisfied] │          [Friction Satisfied] │
                │       │               │               │               │
                ├───────┴───────────────┼───────────────┘               │
                │                       │                               │
                ▼                       ▼                               ▼
     ┌──────────────────────┐ ┌───────────────────┐           ┌───────────────────┐
     │ 7. PENDING_MPIN_AUTH │ │ 9. USER_ABORTED   │           │ 9. USER_ABORTED   │
     │ (Common Library Hand)│ │ (Scam Intercepted)│           │ (Scam Intercepted)│
     └──────────┬───────────┘ └───────────────────┘           └───────────────────┘
                │
        ┌───────┴───────┐
        ▼ (MPIN Valid)  ▼ (MPIN Invalid)
  ┌───────────┐   ┌───────────┐
  │10. SETTLED│   │11. FAILED │
  │(Completed)│   │(CBS Error)│
  └───────────┘   └───────────┘
```

---

## 3. Formal State Definitions and Transition Invariants

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              FORMAL STATE TRANSITION MATRIX                               │
├────────┬─────────────────────────┬─────────────────────────┬──────────────────────────────┤
│ STATE  │ STATE NAME              │ VALID EXIT STATES       │ TRANSITION TRIGGER CONDITION │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S1** │ `INITIATED`             │ `UNDER_HOT_EVAL`        │ App captures amount and VPA  │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S2** │ `UNDER_HOT_EVAL`        │ `FAST_PATH_CLEARED`     │ Hot GBDT score $P < 0.20$    │
│        │                         │ `WARM_INVESTIGATE`      │ Hot GBDT score $0.20 \le P \le 0.85$│
│        │                         │ `HARD_BLOCKED`          │ AnyDesk active / Blacklist hit│
│        │                         │ `DEGRADED_FALLBACK`     │ Cloud API timeout $> 120\text{ms}$ │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S3** │ `FAST_PATH_CLEARED`     │ `PENDING_MPIN_AUTH`     │ Client launches Common Library│
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S4** │ `WARM_INVESTIGATE`      │ `CHALLENGE_ACTIVE`      │ Policy selects Tier 2 friction│
│        │                         │ `CALL_INTERLOCK_ACTIVE` │ Policy selects Tier 3 friction│
│        │                         │ `FAST_PATH_CLEARED`     │ Agent resolves as Legitimate │
│        │                         │ `FAST_PATH_CLEARED`     │ Agent timeout (1,800ms SLA)  │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S5** │ `CHALLENGE_ACTIVE`      │ `PENDING_MPIN_AUTH`     │ Typed name matches legal name│
│        │                         │ `USER_ABORTED`          │ User taps "Cancel & Report"  │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S6** │ `CALL_INTERLOCK_ACTIVE` │ `CHALLENGE_ACTIVE`      │ `CALL_STATE_IDLE` broadcast  │
│        │                         │ `USER_ABORTED`          │ User taps "Cancel & Report"  │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S7** │ `PENDING_MPIN_AUTH`     │ `SETTLED`               │ CBS returns debit success    │
│        │                         │ `FAILED`                │ Incorrect MPIN / Switch drop │
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S8** │ `HARD_BLOCKED`          │ [TERMINAL STATE]        │ Transaction aborted by system│
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S9** │ `USER_ABORTED`          │ [TERMINAL STATE]        │ Transaction aborted by victim│
├────────┼─────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ **S10**│ `SETTLED`               │ [TERMINAL STATE]        │ Funds irrevocably transferred│
└────────┴─────────────────────────┴─────────────────────────┴──────────────────────────────┘
```

---

## 4. Mathematical State Invariants

1. **The Irreversibility Boundary Axiom:**
   $$\text{State} \in \{S5, S6, S8\} \implies \text{Transition}(S7) = \text{FALSE}$$
   A transaction that is currently under an active cognitive challenge ($S5$) or call interlock ($S6$) **CANNOT transition to the Common Library MPIN Activity ($S7$) under any operational condition**.
2. **The Terminal State Invariant:**
   $$\text{State} \in \{S8, S9, S10, S11\} \implies \text{Transitions Out} = \emptyset$$
   Terminal states are strictly immutable; once aborted or settled, the transaction ID cannot be resurrected for a subsequent attempt.
3. **The Pre-Commit Chokepoint Invariant:**
   $$\text{Timestamp}(S7) - \text{Timestamp}(S1) \ge 1,500\text{ms}$$
   Guarantees that warm-path investigation runs during the minimum required human dwell window before the Common Library takes control.

---

## 5. Epistemic Assessment for PS09

The formal state model provides **mathematical guarantees of correctness**: transactions cannot bypass security interlocks through race conditions, and victim actions (aborting a transfer) cleanly terminate the execution lifecycle.

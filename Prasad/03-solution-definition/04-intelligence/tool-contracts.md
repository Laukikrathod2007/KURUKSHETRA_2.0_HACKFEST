# Tool Contracts: Diagnostic Specifications, Interfaces, and Trust Boundaries

---

## 1. Executive Understanding & Alignment with Problem Statement

Under the **Core Objective of PS09 (`PROBLEM_STATEMENT.md`)**:
- *• ...verifying relevant information, and taking appropriate protective action before transaction completion.*
- *• Core Requirement: Recipient verification workflow.*

To conduct hypothesis testing, the Agentic Reasoner requires access to external verification tools. In high-stakes payment engineering, **every tool must have a strictly bounded, typed, and read-only interface contract**. 

The agent is never given open-ended API access. It is restricted to **five specialized diagnostic tools** designed to verify recipient identity, utility bill claims, and historical fraud complaints within strict sub-second latency budgets.

---

## 2. The Diagnostic Tool Suite Overview

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE DIAGNOSTIC TOOL SPECIFICATION                               │
├────────┬───────────────────────────────┬──────────────┬──────────────┬────────────────────┤
│ TOOL ID│ TOOL NAME                     │ ACCESS LEVEL │ LATENCY SLA  │ DATA SOURCE        │
├────────┼───────────────────────────────┼──────────────┼────────────────────┤
│ **T-01**│ `verify_recipient_kyc`        │ READ-ONLY    │ < 150 ms     │ NPCI RespValAdd API│
├────────┼───────────────────────────────┼──────────────┼────────────────────┤
│ **T-02**│ `check_mule_blacklist`        │ READ-ONLY    │ < 5 ms       │ In-Memory I4C Cache│
├────────┼───────────────────────────────┼──────────────┼────────────────────┤
│ **T-03**│ `verify_utility_biller_debt`  │ READ-ONLY    │ < 200 ms     │ BBPS Biller API    │
├────────┼───────────────────────────────┼──────────────┼────────────────────┤
│ **T-04**│ `get_user_spending_profile`   │ READ-ONLY    │ < 2 ms       │ Redis Feature Store│
├────────┼───────────────────────────────┼──────────────┼────────────────────┤
│ **T-05**│ `format_cognitive_challenge`  │ UI DIRECTIVE │ < 1 ms       │ Local Policy Module│
└────────┴───────────────────────────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 3. Detailed Tool Interface Contracts

### Tool T-01: `verify_recipient_kyc`
- **Purpose:** Fulfills the *Recipient verification workflow* requirement; retrieves Core Banking KYC legal name and MCC code.
- **Input Contract:**
  ```json
  {
    "vpa": "customs.clearance.dept@okhdfcbank"
  }
  ```
- **Output Contract:**
  ```json
  {
    "status": "SUCCESS",
    "vpa": "customs.clearance.dept@okhdfcbank",
    "resolved_cbs_legal_name": "Suresh Ramesh Patel",
    "mcc_code": "0000",
    "account_category": "INDIVIDUAL_P2P",
    "bank_name": "HDFC Bank Ltd",
    "verification_timestamp_utc": "2026-09-11T13:44:02Z"
  }
  ```
- **Failure Semantics:** If CBS API times out (>200ms), returns `status: "TIMEOUT"`; agent falls back to handle syntax analysis.

---

### Tool T-02: `check_mule_blacklist`
- **Purpose:** Verifies whether the beneficiary VPA has active cybercrime complaints on the I4C NCRP portal.
- **Input Contract:**
  ```json
  {
    "vpa": "customs.clearance.dept@okhdfcbank"
  }
  ```
- **Output Contract:**
  ```json
  {
    "is_blacklisted": false,
    "fir_complaint_count": 0,
    "last_reported_date": null,
    "reputation_status": "CLEAN_OR_NEW_ACCOUNT"
  }
  ```
- **Failure Semantics:** Returns `is_blacklisted: false` on cache miss; failure does not trigger false blocks.

---

### Tool T-03: `verify_utility_biller_debt`
- **Purpose:** Verifies whether a claimed utility disconnection threat is genuine by querying the Bharat Bill Payment System (BBPS) mock registry.
- **Input Contract:**
  ```json
  {
    "biller_category": "ELECTRICITY",
    "claimed_consumer_id": "MSEB-9182341",
    "claimed_amount_inr": 24500.00
  }
  ```
- **Output Contract:**
  ```json
  {
    "bill_exists": false,
    "actual_outstanding_balance_inr": 0.00,
    "biller_official_vpa": "mseb.bills@icici",
    "debt_verification_verdict": "FRAUDULENT_DEBT_CLAIM"
  }
  ```
- **Failure Semantics:** If BBPS API is unavailable, returns `bill_exists: "UNVERIFIED"`.

---

### Tool T-04: `get_user_spending_profile`
- **Purpose:** Retrieves user's historical spending baseline to differentiate normal high spending from panic anomalies.
- **Input Contract:**
  ```json
  {
    "user_token_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```
- **Output Contract:**
  ```json
  {
    "user_30d_avg_amount_inr": 450.00,
    "user_90d_max_amount_inr": 2500.00,
    "historical_tx_count": 142,
    "user_spending_tier": "MICRO_COMMERCE_DOMINANT"
  }
  ```

---

### Tool T-05: `format_cognitive_challenge`
- **Purpose:** Prepares the final structured user-facing challenge directive.
- **Input Contract:**
  ```json
  {
    "friction_tier": "TIER_2_COGNITIVE_CHALLENGE",
    "resolved_legal_name": "Suresh Ramesh Patel",
    "stated_purpose": "Customs Duty Fine"
  }
  ```
- **Output Contract:**
  ```json
  {
    "directive": "TIER_2_COGNITIVE_CHALLENGE",
    "required_user_action": "TYPE_LEGAL_NAME",
    "target_string_to_match": "Suresh Patel",
    "ui_headline": "Security Interlock: Recipient Identity Mismatch",
    "ui_explanation": "You indicated this is for Customs Duty. However, this account legally belongs to Suresh Patel. Customs departments never use personal savings accounts."
  }
  ```

---

## 4. Epistemic Assessment for PS09

The Tool Contracts guarantee that the agent operates as a **safe, bounded, and verifiable diagnostic system** that retrieves facts strictly related to the payment request without touching unauthorized user data or possessing write capabilities.

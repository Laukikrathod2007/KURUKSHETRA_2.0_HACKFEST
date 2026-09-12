# Product-Level Data Contract & Input Taxonomy

## 1. Executive Summary & Purpose

A product-level data contract establishes the **functional information boundaries** of a software system. It defines what data attributes the product requires to make decisions, their sources, expected availability, statutory sensitivities, and mandatory fallbacks when inputs are missing.

This document is **NOT a database schema or physical storage specification**; it is an analytical data contract mapping inputs to functional requirements and distinguishing production dependencies from prototype simulation assumptions.

---

## 2. Product-Level Input Inventory

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             PRODUCT INPUT DATA CONTRACT                                                │
├────────────────────┬─────────────────────────┬───────────┬──────────────┬──────────────┬─────────────┬─────────────────┤
│ Input Attribute    │ Purpose / Feature       │ Required? │ Source       │ Availability │ Sensitivity │ Fallback        │
├────────────────────┼─────────────────────────┼───────────┼──────────────┼──────────────┼─────────────┼─────────────────┤
│ Transaction Amount │ Core financial exposure │ MUST      │ Switch Hook  │ Guaranteed   │ High (PII)  │ Reject (Abort)  │
│ Source Account ID  │ Sender baseline query   │ MUST      │ Core Banking │ Guaranteed   │ Restricted  │ Reject (Abort)  │
│ Dest. VPA / IBAN   │ Recipient risk query    │ MUST      │ Payment App  │ Guaranteed   │ Restricted  │ Reject (Abort)  │
│ Payment Timestamp  │ Temporal velocity       │ MUST      │ Switch Hook  │ Guaranteed   │ Low         │ System clock    │
│ Touch Hesitation   │ Behavioral hesitation   │ SHOULD    │ Client SDK   │ Assumed      │ High (RAM)  │ Impute median   │
│ Typing Cadence     │ Dictated typing speed   │ SHOULD    │ Client SDK   │ Assumed      │ High (RAM)  │ Impute median   │
│ Clipboard Paste Evt│ Scripted lure copying   │ MUST      │ Client SDK   │ Assumed      │ Medium      │ Default: false  │
│ Active Call Flag   │ Remote voice coercion   │ MUST      │ Client OS    │ Assumed      │ Medium      │ Default: false  │
│ Screen Share Flag  │ RAT / Screen takeover   │ MUST      │ Client OS    │ Assumed      │ Medium      │ Default: false  │
│ Recipient Age (Ten)│ Mule account detection  │ MUST      │ Beneficiary  │ Assumed (API)│ Restricted  │ Default: 30 days│
│ Recipient Velocity │ Mule liquidity velocity │ MUST      │ Switch Cache │ Assumed (API)│ Restricted  │ Default: 1.0    │
│ Stated Purpose Code│ Cognitive challenge test│ COULD     │ User UI Entry│ Optional     │ Low         │ Default: None   │
│ Private Chat Text  │ Inaccessible (WhatsApp) │ FORBIDDEN │ N/A          │ UNAVAILABLE  │ Extreme     │ Explicit Exclus.│
│ Raw Audio Stream   │ Inaccessible (Voice)    │ FORBIDDEN │ N/A          │ UNAVAILABLE  │ Extreme     │ Explicit Exclus.│
└────────────────────┴─────────────────────────┴───────────┴──────────────┴──────────────┴─────────────┴─────────────────┘
```

---

## 3. Epistemic Input Classifications

To bridge the gap between enterprise production and hackathon prototype validation, all product inputs are categorized across five distinct epistemic tiers:

### 3.1 Guaranteed Inputs (100% Production Availability)
- **Definition**: Core payment transaction payload attributes that are cryptographically required for payment clearing under national switch rules (ISO 20022).
- **Attributes**: `Transaction Amount`, `Currency`, `Source Account Hash`, `Destination Account/VPA`, `Client IP`, `Timestamp`.
- **Availability SLA**: 100%. If any of these fields are missing, the payment switch itself rejects the transaction prior to invoking the risk engine.

### 3.2 Assumed Inputs (High Availability via Standard APIs)
- **Definition**: Device telemetry and environmental signals available through standard Android and iOS runtime APIs without requiring specialized OS jailbreaks or root permissions.
- **Attributes**: `is_call_active` (via `TelecomManager`), `is_screen_shared` (via `MediaProjectionManager`), `clipboard_pasted` (via standard input field listener), `field_dwell_ms` (via UI focus listeners).
- **Production Availability**: $\ge 95\%$ on modern mobile operating systems.
- **Fallback Policy**: If an OS blocks permission or an older device fails to report, the system sets the flag to `false` or imputes population medians, incrementing epistemic uncertainty ($\sigma$).

### 3.3 Simulated Inputs (Hackathon Prototype Boundary)
- **Definition**: Data attributes that in enterprise banking depend on inter-institutional API federation (e.g., querying a competing beneficiary bank's internal mule score), which are physically inaccessible during hackathon prototyping.
- **Attributes**:
  - `Recipient Account Tenure`: Age of the destination account in hours/days.
  - `Recipient 24-Hour Inbound Velocity`: Count of unique senders transferring funds to the payee in the last 24 hours.
  - `Carrier SIM Swap / Call State`: GSMA Open Gateway network carrier API response.
- **Prototype Handling**: Explicitly simulated via a realistic, synthetic mock generator that injects realistic beneficiary risk attributes and carrier statuses for benchmark testing.

### 3.4 Optional Inputs (Progressive Dynamic Capture)
- **Definition**: Attributes captured only when the user is actively escalated into a high-risk cognitive intervention journey.
- **Attributes**: `User Stated Purpose Code` (captured during Level 3 interactive challenge), `Emergency Declaration Affirmation` (captured during Level 4 emergency bypass).
- **Fallback**: System operates normally without them if the transaction does not enter Level 3 or Level 4.

### 3.5 Categorically Unavailable Inputs (Explicitly Excluded)
- **Definition**: Data points that privacy regulations, mobile operating system sandboxes, and cryptographic messaging protocols make it physically or legally impossible to obtain.
- **Attributes**:
  - Encrypted messaging payloads (WhatsApp, Telegram, Signal chat text).
  - Raw phone call microphone audio streams.
  - Plain-text banking login credentials or cryptographic PINs.
- **Product Contract Rule**: The Guardian is architecturally designed to operate with **zero dependence** on these attributes (`REQ-CTX-006`).

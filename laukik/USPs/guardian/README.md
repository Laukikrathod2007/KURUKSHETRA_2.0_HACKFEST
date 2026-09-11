# 🛡️ Kavach / Guardian Core Module (`USPs/guardian`)
> **PS09 — Real-Time Agentic Payment Scam Interception**
> Core Autonomous Fraud Defense Package for **Kurukshetra 2.0 Hackfest**.

This module is an isolated, plug-and-play Python security package with zero external frontend coupling. Any teammate can import and use it in any backend (FastAPI, Flask, Django) or via the **Model Context Protocol (MCP)** server.

---

## 🚀 Key Capabilities

1. **Multi-Agent Fraud Intelligence**:
   - **Transaction Velocity Agent**: Dynamic baseline deviation vs personal spending history.
   - **Recipient Intelligence Agent**: Mule account syntax & trusted counterparty relationship graph.
   - **Intent & Coercion NLP Agent**: Scans for psychological pressure, digital arrest threats, electricity cuts, and CEO fraud.
   - **Context-Adaptive Persona Engine**: Dynamic thresholds tuned for Senior Citizens, Students, or SME Business Owners.

2. **TruGen AI Live Video Avatar (The Face)**:
   - Real-time conversational video officer (Aria) powered by Huma-2 Gaussian Avatars.
   - Dynamically pre-briefed on user incidents with custom opening spoken remarks.

3. **Vapi AI Emergency Phone Line (The Voice)**:
   - Ultra-low latency (~400ms) outbound phone call dialed directly to victim's mobile to break active scammer coaching.

4. **Zero-Friction MCP Server**:
   - Exposes tools over JSON-RPC for payment checkout copilots, GPay hooks, and AI agents.

---

## 📦 How to Import & Use in Python

```python
from guardian import (
    evaluate_payment, 
    ask_aria, 
    emergency_call, 
    analyze_problem, 
    launch_incident_video_guardian
)

# --- Use Case 1: Intercept an Active Payment ---
payment_data = {
    "transaction_id": "txn_102",
    "user_name": "Laukik",
    "amount": 25000,
    "recipient_id": "police.penalty@upi",
    "recipient_name": "Cyber Police Desk",
    "payment_note": "urgent fine or digital arrest"
}

dossier = evaluate_payment(payment_data)
print(dossier.composite_risk_score)    # e.g., 69.8 / 100
print(dossier.recommended_action)      # PAUSE
print(dossier.detected_scam_types)     # ['Authoritative Impersonation', ...]

# If held for verification, spawn TruGen video avatar:
video_session = await ask_aria(dossier)
print(video_session.conversation_url)  # Render in frontend iframe!

# If critical risk, dial user's real phone line immediately:
call_res = await emergency_call(dossier, phone_number="+919876543210")
print(call_res.status)                 # "in-progress"

# --- Use Case 2: Analyze an Uploaded Problem (SMS / WhatsApp / Chat) ---
upload = {
    "user_name": "Laukik",
    "problem_text": "Electricity board notice: power cut tonight at 9:30 PM. Pay 1,450 to avoid disconnect."
}

analysis = analyze_problem(upload)
print(analysis.scam_category)          # ELECTRICITY_BILL
print(analysis.aria_first_message)     # Dynamic first spoken words

# Launch TruGen video avatar briefed on this exact incident:
incident_video = await launch_incident_video_guardian(analysis)
print(incident_video.conversation_url)
```

---

## 🤖 Running the MCP Server
Add this to your MCP host configuration (Claude Desktop, Cursor, or your AI payment agent):
```json
{
  "mcpServers": {
    "kavach-guardian": {
      "command": "python",
      "args": [
        "USPs/guardian/mcp_server.py"
      ]
    }
  }
}
```

Exposed MCP Tools:
- `intercept_payment`: Scans transaction intent and returns risk score (0-100) + action (`ALLOW`, `VERIFY`, `PAUSE`, `BLOCK`).
- `launch_video_guardian`: Prepares TruGen video avatar with dynamic incident context.
- `dispatch_emergency_call`: Dispatches Vapi outbound emergency call.
- `analyze_scam_upload`: Ingests uploaded chat screenshots or SMS notes.

---

## 🗂️ Package Architecture
```
guardian/
├── __init__.py          # evaluate_payment, ask_aria, emergency_call, analyze_problem
├── mcp_server.py        # Model Context Protocol stdio interface
├── config.py            # Centralized settings with dev fallbacks
├── requirements.txt     # Lightweight dependencies (httpx, pydantic)
├── .env.example         # Sanitized environment template
├── agents/              # Intelligence agents
│   ├── txn_agent.py     # Velocity & amount deviation vs baseline
│   ├── recipient_agent.py # Counterparty trust graph & mule check
│   ├── intent_agent.py  # Coercion & social engineering NLP
│   ├── incident_agent.py# Unstructured problem parser
│   └── orchestrator.py  # Composite scoring & policy engine
├── services/            # Zero-latency agent connectors
│   ├── trugen.py        # TruGen AI video avatar manager
│   └── vapi.py          # Vapi AI outbound emergency caller
├── utils/
│   └── prompt_builder.py# Dynamic persona & anti-scam guardrails
└── models/
    └── schemas.py       # Pydantic data schemas
```

---

## 🔒 Security & Environment Setup
Copy `.env.example` to `.env` in the `guardian/` folder:
```env
TRUGEN_AGENT_ID=8700376f-dd31-4ae6-b890-59b4c22f0aab
VAPI_ASSISTANT_ID=eeec707c-8499-4b0b-b81e-e9e3d08742e8
```
*(Note: `.env` is gitignored to protect sensitive API keys).*


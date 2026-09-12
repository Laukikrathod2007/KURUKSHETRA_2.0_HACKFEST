# 🛡️ Kurukshetra Ecosystem — PS09 Agentic Guardian

> **Consolidated Full-Stack Monorepo for Real-Time Payment Scam Interception**

---

## 📁 Clean Monorepo Directory Architecture

```
kurukshetra-ecosystem/
├── backend/                  # Python FastAPI Backend & Deterministic Risk Engine
│   ├── src/
│   │   ├── main.py           # Unified entrypoint (static mounting of / and /main)
│   │   └── ecosystem/        # 8 modular banking, switch, risk, and scenario packages
│   │       ├── api/          # FastAPI routes, citizen public lookup, trace streaming
│   │       ├── banks/        # Core Banking System (CBS) simulation & ledger double-entry
│   │       ├── cards/        # Card CNP & 3D Secure ACS simulation
│   │       ├── mcp/          # FastMCP tool providers, evidence interpolation, LLM seam
│   │       ├── npci/         # NPCI UPI Switch & Central Mapper simulation
│   │       ├── psp/          # Multi-PSP application layer (GPay, PhonePe)
│   │       ├── risk/         # Tier 0 (Device), Tier 1 (CBS/Switch/Ledger), Reputation
│   │       └── scenarios/    # E2E Seed generator and test runners
│   ├── tests/                # 9 comprehensive Pytest files (37 passed tests)
│   ├── pyproject.toml        # Backend package metadata & dependencies
│   └── pytest.ini            # Pytest configuration
├── frontend/                 # Complete Frontend Applications & Pre-Built UI
│   ├── gpay-app/             # Interactive Citizen Payment App & SOC Guardian UI (React + Vite)
│   ├── landing/              # Marketing Landing Page (React + Vite)
│   ├── dist/                 # Pre-compiled production bundles served by FastAPI
│   │   ├── index.html        # Landing page entrypoint (served at /)
│   │   ├── assets/           # Landing page static styles and scripts
│   │   └── app/              # Citizen payment app entrypoint (served at /main/)
│   └── package.json          # Workspace script runner for frontends
├── common/                   # Shared Cross-Platform Contracts & Definitions
│   ├── scenarios.json        # Authoritative definitions of the 5 demo scenarios
│   └── risk_contracts.json   # Machine-readable risk spectrum, feature IDs & tiers
├── docs/                     # System architecture, PS09 specs, and flow diagrams
├── start-demo.ps1            # 🚀 1-Click PowerShell Demo Launcher
├── ecosystem.db              # Seeded SQLite database with live ledger state
└── pyproject.toml / pytest.ini # Root configuration forwarding to backend/
```

---

## 🚀 1-Click Demo Quickstart

To launch the complete system (FastAPI backend + Risk Engine + Citizen GPay Demo + Landing Page):

```powershell
.\start-demo.ps1
```

This will automatically:
1. Initialize the Python environment and load `.env` credentials.
2. Verify production UI bundles in `frontend/dist/`.
3. Start the Uvicorn server on `http://127.0.0.1:8000`.
4. Open your default web browser directly to `http://localhost:8000/main/`.

### Accessible URLs:
- **📱 Citizen GPay Demo & SOC Guardian Center**: [http://localhost:8000/main/](http://localhost:8000/main/)
- **🌐 Marketing Landing Page**: [http://localhost:8000/](http://localhost:8000/)
- **🔍 Public Scam Score Lookup**: [http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis](http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis)
- **📖 Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Running Automated Tests

Run the complete 37-test suite from either the root or `backend/`:

```powershell
pytest
```
*or*
```powershell
cd backend
pytest
```

---

## 🛠️ Frontend Development

To run the frontends with hot module reload:

```powershell
# In one terminal, start backend:
cd backend/src
uvicorn main:app --reload

# In another terminal, run GPay demo with Vite HMR:
cd frontend/gpay-app
npm run dev

# Or run landing page with Vite HMR:
cd frontend/landing
npm run dev
```

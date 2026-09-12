# 🛡️ Kurukshetra Ecosystem — PS09 Agentic Guardian

> **Production-Grade Full-Stack Monorepo for Real-Time Payment Scam Interception**  
> Sub-15ms deterministic multi-tier risk engine paired with an autonomous FastMCP Agentic Guardian seam for proactive citizen scam prevention.

---

## 📑 Table of Contents
1. [Architecture & Directory Structure](#-architecture--directory-structure)
2. [Prerequisites](#-prerequisites)
3. [Environment Configuration (.env)](#-environment-configuration-env)
4. [Installation & Dependency Setup](#-installation--dependency-setup)
   - [Backend Dependencies](#1-backend-dependencies-python)
   - [Frontend Dependencies](#2-frontend-dependencies-nodejs--npm)
   - [Database Seeding](#3-database-initialization--seeding)
5. [Running the Ecosystem](#-running-the-ecosystem)
   - [Option 1: 1-Click Demo Launcher (Recommended)](#option-1-1-click-demo-launcher-recommended)
   - [Option 2: Unified Production Full-Stack](#option-2-unified-production-full-stack-fastapi)
   - [Option 3: Full Development Mode (Vite HMR + FastAPI)](#option-3-full-development-mode-vite-hmr--fastapi)
6. [Interactive 5 Core Demo Scenarios](#-interactive-5-core-demo-scenarios)
7. [Running Automated Tests](#-running-automated-tests)
8. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 📁 Architecture & Directory Structure

The repository is organized into a clean, modular monorepo structure where backend logic, frontend applications, and shared risk contracts are decoupled and maintainable:

```
kurukshetra-ecosystem/
├── backend/                       # Python FastAPI Backend & Deterministic Risk Engine
│   ├── src/
│   │   ├── main.py                # Unified app entrypoint & static mount routing (/ and /main)
│   │   └── ecosystem/             # 8 modular banking, switch, risk, and scenario packages
│   │       ├── api/               # FastAPI endpoints, citizen public lookup, trace streaming
│   │       ├── banks/             # Core Banking System (CBS) simulation & double-entry ledger
│   │       ├── cards/             # Card CNP & 3D Secure ACS simulation
│   │       ├── mcp/               # FastMCP tool providers, evidence interpolation, LLM seam
│   │       ├── npci/              # NPCI UPI Switch & Central Mapper simulation
│   │       ├── psp/               # Multi-PSP application layer (GPay, PhonePe)
│   │       ├── risk/              # Tier 0 (Device), Tier 1 (CBS/Switch/Ledger), Reputation
│   │       └── scenarios/         # E2E Seed generator and test runners
│   ├── tests/                     # Comprehensive Pytest suite (37 tests across 9 test files)
│   ├── pyproject.toml             # Backend package metadata & dependencies
│   └── pytest.ini                 # Backend Pytest configuration
├── frontend/                      # Frontend Applications & Production Distribution
│   ├── gpay-app/                  # Citizen Payment App & SOC Guardian Center (React + Vite)
│   ├── landing/                   # Interactive 3D/Canvas Product Landing Page (React + Vite)
│   ├── dist/                      # Pre-compiled production bundles served directly by FastAPI
│   │   ├── index.html             # Landing page bundle (served at /)
│   │   ├── assets/                # Landing page stylesheets and scripts
│   │   └── app/                   # Citizen app bundle (served at /main/)
│   └── package.json               # Frontend workspace orchestrator (builds & runs both apps)
├── common/                        # Shared Cross-Platform Contracts & Definitions
│   ├── scenarios.json             # Authoritative definitions of the 5 demo scenarios
│   └── risk_contracts.json        # Machine-readable risk spectrum, feature IDs & tier specs
├── docs/                          # System architecture specs, flow diagrams & PS09 documentation
├── start-demo.ps1                 # 🚀 1-Click PowerShell Demo Launcher
├── ecosystem.db                   # Pre-seeded SQLite database with simulated banking state
├── .env                           # Environment credentials (Gemini API keys & configs)
├── pyproject.toml                 # Root package configuration forwarding to backend/
└── pytest.ini                     # Root test runner configuration forwarding to backend/
```

---

## 💻 Prerequisites

Ensure the following tools are installed on your workstation:

- **Python**: Version `3.10` or higher (`3.11` or `3.12` recommended)
- **Node.js**: Version `18.0.0` or higher (`v20+` recommended) and `npm`
- **Shell**: PowerShell 5.1+ or PowerShell Core 7+ (on Windows) or Bash (on Linux/macOS)
- **Optional API Key**: Google Gemini API Key (Required for dynamic AI intervention coaching; if omitted, the system falls back seamlessly to deterministic explainability templates).

---

## 🔑 Environment Configuration (.env)

The ecosystem features an intelligent **Multi-Key Fallback Seam** for Google Gemini API integration. Create or verify `.env` in the `kurukshetra-ecosystem/` root directory:

```ini
# Primary Gemini API Key for Agentic Guardian Post-Decision Reasoning
GEMINI_API_KEY=your_primary_gemini_api_key

# Secondary Gemini API Key (Automatic failover if primary key encounters quota limits)
GEMINI_API_KEY_FALLBACK=your_fallback_gemini_api_key

# Server settings
ENVIRONMENT=development
FASTAPI_PORT=8000
```

> **Adaptive Resilience**: If `GEMINI_API_KEY` hits a rate-limit or quota exhaustion, `backend/src/ecosystem/mcp/tools.py` automatically retries the request using `GEMINI_API_KEY_FALLBACK` before falling back to forensic explanation templates.

---

## 📦 Installation & Dependency Setup

Follow these steps to set up both backend and frontend dependencies from scratch.

### 1. Backend Dependencies (Python)

Navigate to `kurukshetra-ecosystem` and initialize a Python virtual environment:

```powershell
cd kurukshetra-ecosystem

# Create a local virtual environment (.venv)
python -m venv .venv

# Activate the virtual environment:
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install the backend package in editable mode with all dependencies
pip install -e backend
```

**Key Python Libraries Installed:**
- `fastapi>=0.115.0` & `uvicorn>=0.32.0` (High-performance async web framework)
- `sqlalchemy>=2.0.35` (Banking ledger and account persistence)
- `pydantic>=2.9.2` (Schema validation and strict typing)
- `fastmcp>=1.0` (Fast Model Context Protocol tool execution)
- `pytest>=8.3.3` (Test runner)
- `python-dotenv>=1.0.0` (Environment variable loading)

---

### 2. Frontend Dependencies (Node.js & npm)

The ecosystem has two Vite React frontend applications located in `frontend/`:
- `frontend/landing` (Product Landing Page)
- `frontend/gpay-app` (Citizen Payment Simulation & SOC Guardian)

Install dependencies and compile the production distribution:

```powershell
# Install dependencies for the Landing Page
cd frontend/landing
npm install

# Install dependencies for the Citizen GPay App
cd ../gpay-app
npm install

# Return to frontend root and build both apps into frontend/dist/
cd ..
npm run build

# Return to kurukshetra-ecosystem root
cd ..
```

The build command compiles:
1. `frontend/landing` -> Output into `frontend/dist/` (served at `http://localhost:8000/`)
2. `frontend/gpay-app` -> Output into `frontend/dist/app/` (served at `http://localhost:8000/main/`)

---

### 3. Database Initialization & Seeding

The repository includes a ready-to-use pre-seeded SQLite database (`ecosystem.db`). If you ever need to reset or rebuild the database from scratch:

```powershell
# Ensure virtual environment is active
.\.venv\Scripts\Activate.ps1

# (Optional) Delete existing DB
if (Test-Path ecosystem.db) { Remove-Item ecosystem.db }

# Re-run the deterministic scenario seed generator
$env:PYTHONPATH = "backend/src"
python -m ecosystem.scenarios.seed
```

This seeds:
- 4 Simulated Banks: SBI, HDFC, ICICI, Axis
- Bank Accounts with verified double-entry ledgers
- Citizen profiles (`citizen.rajesh@oksbi`, `mule.syndicate@axis`, etc.)
- NPCI UPI Switch routes & Central Mapper directory

---

## 🚀 Running the Ecosystem

### Option 1: 1-Click Demo Launcher (Recommended)

The fastest and most reliable way to run the entire system on Windows:

```powershell
.\start-demo.ps1
```

**What `start-demo.ps1` does automatically:**
1. Verifies Python virtual environment (`.venv`).
2. Confirms production UI bundles exist in `frontend/dist/` (builds them if missing).
3. Reads `.env` configuration for Gemini LLM keys.
4. Starts FastAPI Uvicorn server on `http://127.0.0.1:8000`.
5. Spawns your default web browser directly to `http://localhost:8000/main/`.

---

### Option 2: Unified Production Full-Stack (FastAPI)

Run the backend and let FastAPI serve both the API and the pre-built frontend applications simultaneously from a single port:

```powershell
# Activate environment
.\.venv\Scripts\Activate.ps1

# Run Uvicorn server
python -m uvicorn main:app --app-dir backend/src --host 0.0.0.0 --port 8000 --reload
```

#### 🌐 Endpoints Available:
| Service / Page | URL | Description |
| :--- | :--- | :--- |
| **📱 Citizen Payment App & SOC Guardian** | [http://localhost:8000/main/](http://localhost:8000/main/) | Interactive GPay simulator with real-time scam interception modals and SOC inspector |
| **🌐 Marketing Landing Page** | [http://localhost:8000/](http://localhost:8000/) | 3D Interactive neural particle universe and product overview |
| **🔍 Public Citizen Scam Lookup** | [http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis](http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis) | Open community verification API for checking UPI handles and phone numbers |
| **📖 Interactive OpenAPI Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Complete Swagger UI for testing all banking, NPCI switch, and risk engine APIs |

---

### Option 3: Full Development Mode (Vite HMR + FastAPI)

For making live modifications to the React frontends with Hot Module Replacement (HMR):

#### **Terminal 1: FastAPI Backend**
```powershell
cd kurukshetra-ecosystem
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --app-dir backend/src --host 0.0.0.0 --port 8000 --reload
```

#### **Terminal 2: Citizen GPay App (Vite Dev Server)**
```powershell
cd kurukshetra-ecosystem/frontend/gpay-app
npm run dev
```
> App runs at `http://localhost:5173/main/`. Vite automatically proxies all `/api` network requests to `http://127.0.0.1:8000`.

#### **Terminal 3: Landing Page (Vite Dev Server)**
```powershell
cd kurukshetra-ecosystem/frontend/landing
npm run dev
```
> Landing page runs at `http://localhost:5174/`. Vite proxies `/api` and `/main` to port `8000`.

*(Alternatively, use the workspace shortcuts from `frontend/`: `npm run dev:gpay` or `npm run dev:landing`)*.

---

## 🎮 Interactive 5 Core Demo Scenarios

Once you launch the Citizen App at [http://localhost:8000/main/](http://localhost:8000/main/), select any of the 5 pre-configured demo scenarios from the top dropdown to observe real-time fraud interception:

```
+-----------------------------------------------------------------------------------------+
| SCENARIO 1: GREEN (ALLOW)                                                               |
| Recipient : grocer.local@oksbi | Amount: ₹350                                           |
| Behavior  : Everyday verified merchant, trusted velocity history.                       |
| Engine    : Fast path sub-15ms deterministic approval (ALLOW zone). No friction.        |
+-----------------------------------------------------------------------------------------+
| SCENARIO 2: YELLOW (STEP-UP)                                                            |
| Recipient : newshop.mumbai@oksbi | Amount: ₹4,500                                       |
| Behavior  : Unregistered merchant handle, new beneficiary payment.                     |
| Engine    : Step-Up verification triggered. Introduces cooling-off & 2FA confirmation.  |
+-----------------------------------------------------------------------------------------+
| SCENARIO 3: ORANGE (COACH / DIGITAL ARREST SCAM)                                        |
| Recipient : cbi.clearance.cell@sbi | Amount: ₹50,000                                    |
| Behavior  : Impersonating government agency (CBI) targeting an individual savings acct. |
| Engine    : COACH intervention. Anti-coercion UI prompt, trusted contact SMS notification|
|             alert dispatched, and Gemini LLM generates tailored victim counseling.    |
+-----------------------------------------------------------------------------------------+
| SCENARIO 4: RED (FREEZE / MULE SYNDICATE DRAIN)                                         |
| Recipient : mule.syndicate@axis | Amount: ₹98,000                                       |
| Behavior  : Layered mule network signature: rapid inbound credits emptied in <300s.    |
| Engine    : Instant FREEZE. Transaction intercepted at switch. Zero money debited.      |
+-----------------------------------------------------------------------------------------+
| SCENARIO 5: BLUE (COACH / HIGH-VALUE CRYPTO OUTLIER)                                    |
| Recipient : unknown.crypto.trader | Amount: ₹75,000                                     |
| Behavior  : Extreme statistical Z-score outlier compared to payer's historical baseline.|
| Engine    : Dynamic friction intervention explaining volatility & peer-to-peer risks.   |
+-----------------------------------------------------------------------------------------+
```

---

## 🧪 Running Automated Tests

The ecosystem includes an extensive automated test suite covering all layers: sub-15ms deterministic risk engine, Core Banking double-entry accounting, NPCI UPI switch flows, 3D Secure Card simulation, FastMCP tool execution, and E2E scenario pipelines.

Run all 37 tests from either the root or `backend/`:

```powershell
# From root directory:
.\.venv\Scripts\Activate.ps1
pytest

# Or specifically with verbose output:
pytest -v
```

### Test Coverage Breakdown:
- `backend/tests/test_risk_tier0_1.py`: Sub-15ms deterministic pipeline verification (Tier 0 Device & Tier 1 CBS/Switch).
- `backend/tests/test_mcp_guardian.py`: FastMCP tool execution, evidence verification, and Gemini LLM post-decision explainability seam.
- `backend/tests/test_api_endpoints.py`: Public Scam Score lookup, transaction execution, and trace streaming APIs.
- `backend/tests/test_ecosystem_cbs.py`: CBS double-entry ledger invariant checks and balance integrity.
- `backend/tests/test_card_and_netbanking.py`: Card CNP, 3D Secure ACS challenge flow, and netbanking authentication.
- `backend/tests/test_cross_psp.py`: Inter-PSP transaction coordination between simulated GPay and PhonePe.
- `backend/tests/test_scenarios.py`: Full end-to-end simulation of all 5 authoritative scam scenarios.

---

## ❓ Troubleshooting & FAQs

### Q1: `start-demo.ps1` gives a script execution policy error
**Resolution**: Run PowerShell as Administrator or bypass execution policy for the current session:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start-demo.ps1
```

### Q2: Port 8000 is already in use
**Resolution**: Check what process is running on port 8000 and terminate it:
```powershell
Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Q3: I modified the frontend React code, but the browser still shows old UI
**Resolution**: If running in production mode (via FastAPI on port 8000), you must recompile the bundles into `frontend/dist/`:
```powershell
cd frontend
npm run build
cd ..
```
*Tip: When actively developing frontend UI, use Option 3 (Vite HMR on port 5173/5174) for instant live reloading.*

### Q4: How do I test the Public Scam Score Lookup API?
**Resolution**: Open your browser or run `curl`:
```powershell
curl http://localhost:8000/api/ecosystem/public/lookup/mule.syndicate@axis
```
Returns a machine-readable JSON scam risk evaluation including safety score, known fraud signals, and risk category.

---

## 🛡️ Hackathon Submission Information
- **Problem Statement**: PS09 — Agentic Guardian for Real-Time Payment Scam Interception
- **Team**: Kurukshetra Hackfest Team
- **Core Architecture**: Deterministic Sub-15ms Risk Pipeline (Fast Path) + FastMCP Dynamic LLM Seam (Slow Path)

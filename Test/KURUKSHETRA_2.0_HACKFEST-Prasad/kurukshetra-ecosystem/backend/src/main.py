"""Unified application entrypoint for the complete simulated payment ecosystem.

Runs FastAPI with:
- Simulated Core Banking APIs (SBI, HDFC, Axis, ICICI)
- Simulated NPCI UPI Switch & Central Mapper
- Simulated Multi-PSP routing (GPay, PhonePe)
- Simulated Card CNP 3DS & NetBanking portals
- Kurukshetra Fraud Interception Engine (Tier 0 -> Tier 1 -> Tier 2)
- FastMCP tool integrations
- Live trace stream & Observability SOC Observer
- Static frontend UI
"""
from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from ecosystem.api.server import router as ecosystem_router
from ecosystem.db import init_db
from ecosystem.scenarios.seed import init_and_seed

_ECOSYSTEM_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIR = _ECOSYSTEM_ROOT / "frontend" / "dist"
if not FRONTEND_DIR.exists():
    FRONTEND_DIR = _ECOSYSTEM_ROOT / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed clean demo state on startup
    init_and_seed()
    yield


app = FastAPI(
    title="Kurukshetra Simulated Payment Ecosystem",
    description="End-to-End Payment Simulation with Kurukshetra Fraud Interception Engine",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ecosystem_router)

# Mount the GPay-clone + SOC demo app at /main, and the marketing landing
# page at / -- both are plain static folders under frontend/.
APP_DIR = FRONTEND_DIR / "app"
if APP_DIR.exists():
    # StaticFiles only serves index.html for a request already ending in
    # "/" -- redirect the bare "/main" so the demo doesn't 404 there.
    @app.get("/main")
    def _redirect_to_main() -> RedirectResponse:
        return RedirectResponse(url="/main/")

    app.mount("/main", StaticFiles(directory=str(APP_DIR), html=True), name="app")

UNIVERSE_DIR = Path(__file__).resolve().parents[3] / "UI" / "dist"
if UNIVERSE_DIR.exists():
    @app.get("/universe")
    def _redirect_to_universe() -> RedirectResponse:
        return RedirectResponse(url="/universe/")

    app.mount("/universe", StaticFiles(directory=str(UNIVERSE_DIR), html=True), name="universe")

if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

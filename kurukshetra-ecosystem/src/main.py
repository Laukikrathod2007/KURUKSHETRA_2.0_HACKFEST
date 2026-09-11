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
from fastapi.staticfiles import StaticFiles

from ecosystem.api.server import router as ecosystem_router
from ecosystem.db import init_db
from ecosystem.scenarios.seed import init_and_seed

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


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

# Mount frontend static files if present
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

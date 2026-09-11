"""Consolidated app: risk engine + mock NPCI switch + mock PSP app, one process.

This is the actual deployable unit (Railway/GCP) per docs/00-council-verdict.md's
decision to keep the demo's decision pipeline to one network hop from the
frontend. The three routers stay in separate modules for clarity -- they call
each other as plain Python functions, not HTTP -- but ship as one service.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from kurukshetra.db import init_db
from kurukshetra.engine_api import router as engine_router
from services.mock_card_acs import router as card_acs_router
from services.mock_netbanking import router as netbanking_router
from services.mock_npci_switch import router as npci_switch_router
from services.mock_psp_app import router as psp_app_router
from services.community_reports import router as community_reports_router
from services.public_lookup import router as public_lookup_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("kurukshetra.main")

app = FastAPI(title="Kurukshetra")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tightened to the Vercel frontend origin before production use
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(engine_router)
app.include_router(npci_switch_router)
app.include_router(psp_app_router)
app.include_router(card_acs_router)
app.include_router(netbanking_router)
app.include_router(public_lookup_router)
app.include_router(community_reports_router)


@app.on_event("startup")
def _startup() -> None:
    init_db()
    log.info("Kurukshetra consolidated service started. DB initialized (%s).", init_db.__module__)


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}

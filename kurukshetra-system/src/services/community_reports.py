"""Community scam reporting endpoint -- the write side of feature #11.

Sybil resistance lives in kurukshetra.reputation.submit_report (minimum
distinct-reporter threshold before any escalation, one report per identity
per target, time decay), not here -- this is only the transport.
"""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from kurukshetra.db import SessionLocal
from kurukshetra.reputation import submit_report

router = APIRouter(tags=["community-reports"])


class ReportRequest(BaseModel):
    target_ref: str
    reporter_identity_hash: str
    reason_code: str = "SCAM_SUSPECTED"


@router.post("/community/report")
def report(req: ReportRequest) -> dict:
    session = SessionLocal()
    try:
        accepted = submit_report(
            session,
            target_ref=req.target_ref,
            reporter_identity_hash=req.reporter_identity_hash,
            reason_code=req.reason_code,
        )
        return {
            "accepted": accepted,
            "note": "accepted" if accepted else "duplicate report from this identity -- rate limited, ignored",
        }
    finally:
        session.close()

"""Thin HTTP surface over engine_core -- exposed as its own router so it can
still be mounted standalone if ever split out again, but consumed in-process
by the mock switch/PSP router when running as the consolidated app (main.py).
"""
from __future__ import annotations

from fastapi import APIRouter

from kurukshetra.contracts import RiskDecision, TransactionAnalysisRequest
from kurukshetra.engine_core import evaluate

router = APIRouter(tags=["risk-engine"])


@router.post("/v1/score-vpa", response_model=RiskDecision)
def score_vpa(req: TransactionAnalysisRequest) -> RiskDecision:
    """Event 1 -- ReqValAdd. Tier 0 always runs; Tier 1 only on escalation."""
    return evaluate(req)


@router.post("/v1/score-transaction", response_model=RiskDecision)
def score_transaction_endpoint(req: TransactionAnalysisRequest) -> RiskDecision:
    """Event 2 -- ReqPay pre-flight. Amount-dependent Tier 1 detectors land here in Phase 3."""
    return evaluate(req)

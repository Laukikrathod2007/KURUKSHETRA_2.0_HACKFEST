"""Tests for genuine database forensics, Hook 2 MCC retention, and MCP explanation enhancements.
"""
from __future__ import annotations

import pytest
from starlette.testclient import TestClient

from main import app
from ecosystem.mcp import tools


@pytest.fixture
def client():
    return TestClient(app)


def test_public_lookup_genuine_cbs_forensics(client):
    """Verify that /public/lookup uses real database metrics instead of fabricated strings."""
    client.post("/api/ecosystem/reset-and-seed")

    # 1. Lookup the high-risk mule account
    res = client.get("/api/ecosystem/public/lookup/mule.syndicate@axis")
    assert res.status_code == 200
    data = res.json()

    assert data["target_ref"] == "mule.syndicate@axis"
    assert data["risk_level"] in ("HIGH_RISK", "CRITICAL_BLOCKED")
    assert data["community_reporters"] >= 3

    # Ensure mule warning contains genuine calculated median seconds from CBS ledger entries (90s in seed)
    assert data["mule_warning"] is not None
    assert "median fund residence time" in data["mule_warning"]
    assert "90 seconds" in data["mule_warning"]
    # Ensure fabricated '98% within 4 minutes' string is NOT present
    assert "98% of received funds are transferred within 4 minutes" not in data["mule_warning"]


def test_public_lookup_genuine_merchant_provenance(client):
    """Verify verified merchant returns actual ledger transaction count and days."""
    client.post("/api/ecosystem/reset-and-seed")

    res = client.get("/api/ecosystem/public/lookup/grocer.local@oksbi")
    assert res.status_code == 200
    data = res.json()

    assert data["risk_level"] == "SAFE"
    assert data["merchant_badge"] is not None
    assert "MCC 5411" in data["merchant_badge"]
    # Ensure fabricated '1,240+ completed peer transactions' string is NOT present
    assert "1,240+ completed peer transactions" not in data["merchant_badge"]


def test_explain_decision_evidence_interpolation():
    """Verify evidence values are interpolated into explanations while retaining semantic keywords."""
    reasons = ["INSTANT_CASH_OUT_MULE_PATTERN", "AMOUNT_EXTREME_OUTLIER_VS_HISTORY"]
    evidence_map = {
        "INSTANT_CASH_OUT_MULE_PATTERN": {"median_residence_seconds": 125.4},
        "AMOUNT_EXTREME_OUTLIER_VS_HISTORY": {"z_score": 4.15, "amount": "Rs 85,000"},
    }

    explanation = tools.explain_decision(reasons, evidence_map=evidence_map, use_llm=False)
    assert "125s" in explanation
    assert "4.15" in explanation
    assert "pass-through mule" in explanation
    assert "urgent, coercive scam" in explanation


def test_explain_decision_llm_fail_open_safe_fallback():
    """Verify LLM seam falls back safely to deterministic explanation when offline or invalid key."""
    reasons = ["AUTHORITY_CLAIM_PERSONAL_SAVINGS_MISMATCH"]
    # Even if called with use_llm=True, it must always return valid text without throwing
    explanation = tools.explain_decision(reasons, use_llm=True)
    assert "personal account" in explanation
    assert "Official fines and court bail" in explanation

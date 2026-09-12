"""Tests for master feature extensions:
- Feature #33: NPCI Real-Time Campaign Detection & Nationwide Kill-Switch
- Feature #34: Citizen Public Scam Score Lookup Portal
- Feature #11: Citizen Community Reporting with Anti-Sybil Rate Limits
- Features #9 & #10: QR & Deep-Link Forensics Parser
- NetBanking Payees & Cooling-Off Tracking
"""
import pytest
from starlette.testclient import TestClient

from ecosystem.db import reset_db, session_scope
from ecosystem.models import Account, AccountStatus, VpaMapping
from ecosystem.npci import mapper, switch
from ecosystem.scenarios import seed
from main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed.seed_all(session)


def test_nationwide_kill_switch_revokes_vpa_and_freezes_cbs():
    with session_scope() as session:
        target_vpa = "mule.syndicate@axis"

        # Verify initial active state
        resolved = mapper.resolve_vpa(session, target_vpa)
        assert resolved is not None
        assert resolved.is_active is True

        # Execute Nationwide Kill-Switch
        res = switch.execute_nationwide_kill_switch(
            session,
            target_ref=target_vpa,
            reason="MASS_PHISHING_CAMPAIGN_INTERCEPTION",
            operator_id="NPCI_SEC_OPS_77",
        )
        assert res["success"] is True
        assert res["vpa_revoked"] is True
        assert res["account_frozen"] is True
        assert res["status"] == "NATIONWIDE_KILL_SWITCH_ACTIVE"

        # Verify VPA is now revoked in mapper
        resolved_after = mapper.resolve_vpa(session, target_vpa)
        assert resolved_after is not None
        assert resolved_after.is_active is False
        assert resolved_after.suspended_reason == "MASS_PHISHING_CAMPAIGN_INTERCEPTION"

        # Verify account is frozen in CBS
        acc = session.get(Account, resolved.account_id)
        assert acc is not None
        assert acc.status == AccountStatus.FROZEN

        # Verify switch rejects payment lookup with VPA_NATIONWIDE_SUSPENDED
        lookup_res = switch.handle_req_val_add(
            session,
            trace_id="trc_test_kill_switch",
            psp_id="gpay",
            payer_id="cust_aarav",
            payer_account_id="acc_aarav_sbi",
            payee_vpa=target_vpa,
        )
        assert lookup_res["success"] is False
        assert lookup_res["error"] == "VPA_NATIONWIDE_SUSPENDED"


def test_api_npci_campaigns_and_kill_switch_endpoints(client):
    # 1. Fetch campaigns
    resp = client.get("/api/ecosystem/npci/campaigns")
    assert resp.status_code == 200
    campaigns = resp.json()
    assert isinstance(campaigns, list)

    # 2. Engage Kill-Switch via API
    target = "cbi.clearance.cell@sbi"
    kill_resp = client.post(
        "/api/ecosystem/npci/kill-switch",
        json={
            "target_ref": target,
            "reason": "DIGITAL_ARREST_EXTORTION_CELL",
            "operator_id": "CERT_IN_INVESTIGATOR",
        },
    )
    assert kill_resp.status_code == 200
    data = kill_resp.json()
    assert data["success"] is True
    assert data["vpa_revoked"] is True
    assert data["account_frozen"] is True


def test_api_public_scam_score_lookup(client):
    # Test safe merchant lookup
    res_safe = client.get("/api/ecosystem/public/lookup/grocer.local@oksbi")
    assert res_safe.status_code == 200
    data_safe = res_safe.json()
    assert data_safe["risk_level"] == "SAFE"
    assert "VERIFIED" in data_safe["verdict_plain"]

    # Test high-risk mule lookup
    res_mule = client.get("/api/ecosystem/public/lookup/mule.syndicate@axis")
    assert res_mule.status_code == 200
    data_mule = res_mule.json()
    assert data_mule["community_reporters"] >= 3 or data_mule["risk_score"] > 0.4
    assert data_mule["risk_level"] in ("HIGH_RISK", "CRITICAL_BLOCKED")


def test_api_community_report_and_sybil_protection(client):
    # Submit first report
    rep1 = client.post(
        "/api/ecosystem/community/report",
        json={
            "target_ref": "unknown.phishing@oksbi",
            "reporter_identity_hash": "rep_aadhaar_hash_alpha",
            "reason_code": "ELECTRICITY_BILL_FRAUD",
        },
    )
    assert rep1.status_code == 200
    assert rep1.json()["success"] is True

    # Duplicate report from same reporter identity must be rejected (Sybil resistance)
    rep2 = client.post(
        "/api/ecosystem/community/report",
        json={
            "target_ref": "unknown.phishing@oksbi",
            "reporter_identity_hash": "rep_aadhaar_hash_alpha",
            "reason_code": "ELECTRICITY_BILL_FRAUD",
        },
    )
    assert rep2.status_code == 200
    assert rep2.json()["success"] is False


def test_api_qr_parse_detects_scan_to_receive_debit_trap(client):
    # Fraudulent QR: Scan-to-receive trap with prefilled debit amount
    trap_uri = "upi://pay?pa=scam.lottery@oksbi&pn=Cashback%20Reward&am=25000&tn=claim_reward"
    res = client.post("/api/ecosystem/qr/parse", json={"raw_uri": trap_uri})
    assert res.status_code == 200
    data = res.json()
    assert data["payee_vpa"] == "scam.lottery@oksbi"
    assert data["amount_rupees"] == 25000.0
    assert data["is_suspicious"] is True
    assert data["alert_type"] == "QR_OR_LINK_PREFILLED_DEBIT_TRAP"


def test_api_netbanking_payees(client):
    res = client.get("/api/ecosystem/netbanking/payees?customer_id=cust_aarav")
    assert res.status_code == 200
    payees = res.json()
    assert isinstance(payees, list)
    assert len(payees) >= 1
    first = payees[0]
    assert "payee_ref" in first
    assert "is_cooling_off" in first


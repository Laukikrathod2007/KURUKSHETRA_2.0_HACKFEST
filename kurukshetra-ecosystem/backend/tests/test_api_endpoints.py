"""Live HTTP smoke test for the consolidated ecosystem FastAPI app.
"""
from __future__ import annotations

import pytest
from starlette.testclient import TestClient

from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_api_reset_and_seed(client):
    res = client.post("/api/ecosystem/reset-and-seed")
    assert res.status_code == 200
    assert res.json()["success"] is True


def test_api_login(client):
    # Valid credentials
    res_ok = client.post("/api/ecosystem/auth/login", json={"username": "android1", "password": "1234"})
    assert res_ok.status_code == 200
    data = res_ok.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Aarav Sharma"
    assert data["user"]["account_id"] == "acc_aarav_sbi"

    # Invalid credentials
    res_bad = client.post("/api/ecosystem/auth/login", json={"username": "wrong", "password": "000"})
    assert res_bad.status_code == 401


def test_api_check_balance(client):
    # Correct PIN
    res_ok = client.post("/api/ecosystem/upi/check-balance", json={"account_id": "acc_aarav_sbi", "pin": "1234"})
    assert res_ok.status_code == 200
    assert res_ok.json()["success"] is True
    assert "balance_formatted" in res_ok.json()

    # Wrong PIN
    res_bad = client.post("/api/ecosystem/upi/check-balance", json={"account_id": "acc_aarav_sbi", "pin": "9999"})
    assert res_bad.status_code == 403


def test_api_list_accounts(client):
    res = client.get("/api/ecosystem/accounts")
    assert res.status_code == 200
    accounts = res.json()
    assert len(accounts) >= 5
    acc_ids = {a["account_id"] for a in accounts}
    assert "acc_aarav_sbi" in acc_ids
    assert "acc_suresh_sbi" in acc_ids


def test_api_val_add_and_pay(client):
    # 1. ValAdd
    val_res = client.post(
        "/api/ecosystem/upi/val-add",
        json={
            "psp_id": "gpay",
            "payer_id": "cust_aarav",
            "payer_account_id": "acc_aarav_sbi",
            "payee_vpa": "grocer.local@oksbi",
        },
    )
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["success"] is True
    assert val_data["risk"]["risk_zone"] == "ALLOW"
    txn_id = val_data["txn_id"]
    trace_id = val_data["trace_id"]

    # 2. Pay
    pay_res = client.post(
        "/api/ecosystem/upi/pay",
        json={
            "trace_id": trace_id,
            "txn_id": txn_id,
            "amount_rupees": 250.0,
            "user_acknowledged": True,
            "pin": "1234",
        },
    )
    assert pay_res.status_code == 200
    pay_data = pay_res.json()
    assert pay_data["status"] == "COMPLETED"

    # 3. Fetch Traces
    trace_res = client.get(f"/api/ecosystem/traces/{trace_id}")
    assert trace_res.status_code == 200
    events = trace_res.json()
    assert len(events) >= 6


def test_api_scenarios_run(client):
    for name in ["green", "yellow", "orange", "red", "blue"]:
        res = client.get(f"/api/ecosystem/scenarios/run/{name}")
        assert res.status_code == 200
        data = res.json()
        assert data["scenario"] == name.upper()


def test_api_audit_verify(client):
    res = client.get("/api/ecosystem/audit/verify")
    assert res.status_code == 200
    assert res.json()["valid"] is True

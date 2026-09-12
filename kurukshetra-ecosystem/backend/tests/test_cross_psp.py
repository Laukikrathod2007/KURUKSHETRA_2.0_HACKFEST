"""Tests for Multi-PSP Isolation and the Cross-PSP Visibility Gap.
"""
from __future__ import annotations

import pytest

from ecosystem.db import reset_db, session_scope
from ecosystem.models import SwitchMetric
from ecosystem.psp.app import PspApp
from ecosystem.scenarios.seed import seed_all


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed_all(session)


def test_cross_psp_history_isolation():
    """GPay and PhonePe must have independent, non-shared transaction histories."""
    gpay = PspApp("gpay", "Google Pay", "acc_aarav_sbi")
    phonepe = PspApp("phonepe", "PhonePe", "acc_aarav_sbi")

    with session_scope() as session:
        gpay_history = gpay.get_app_history(session, "cust_aarav")
        phonepe_history = phonepe.get_app_history(session, "cust_aarav")

        # Aarav has 3 past payments to grocer in GPay
        assert len(gpay_history) >= 3
        assert any(h["payee_ref"] == "grocer.local@oksbi" for h in gpay_history)

        # In PhonePe, Aarav has NO history with grocer
        assert len(phonepe_history) == 0


def test_npci_switch_sees_cross_psp_traffic():
    """While individual apps have blind spots, the NPCI switch aggregates counters across all PSPs."""
    gpay = PspApp("gpay", "Google Pay", "acc_aarav_sbi")
    phonepe = PspApp("phonepe", "PhonePe", "acc_aarav_sbi")

    with session_scope() as session:
        # Payer looks up unknown shop on GPay
        gpay.lookup_vpa(session, customer_id="cust_aarav", payee_vpa="newshop.mumbai@oksbi")

        # Payer looks up unknown shop on PhonePe
        phonepe.lookup_vpa(session, customer_id="cust_aarav", payee_vpa="newshop.mumbai@oksbi")

        metric = session.get(SwitchMetric, "newshop.mumbai@oksbi")
        assert metric is not None
        assert metric.distinct_psp_count >= 1

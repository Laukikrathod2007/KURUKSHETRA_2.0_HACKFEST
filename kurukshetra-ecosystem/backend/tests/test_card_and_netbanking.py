"""Tests for Alternative Rails: Card CNP 3DS and Internet Banking (NetBanking).
"""
from __future__ import annotations

import pytest

from ecosystem.banks import cbs, netbanking
from ecosystem.cards.acs import handle_card_checkout
from ecosystem.config import to_paise
from ecosystem.db import reset_db, session_scope
from ecosystem.scenarios.seed import seed_all


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed_all(session)


def test_netbanking_flow_e2e():
    with session_scope() as session:
        aarav = cbs.get_account(session, "acc_aarav_sbi")
        suresh = cbs.get_account(session, "acc_suresh_sbi")
        aarav_start = aarav.balance_paise
        suresh_start = suresh.balance_paise

        # 1. Add Payee (unfamiliar in netbanking -> triggers STEP_UP per fallback contract)
        add_res = netbanking.add_payee(
            session,
            trace_id="trc_nb_01",
            customer_id="cust_aarav",
            beneficiary_account_number=suresh.account_number,
            ifsc=suresh.ifsc,
            nickname="Suresh Kirana",
        )
        assert add_res["success"] is True
        assert add_res["risk"]["risk_zone"] == "STEP_UP"

        # 2. Transfer Rs 1,000 via IMPS
        amount = to_paise(1000)
        tx_res = netbanking.transfer_funds(
            session,
            trace_id="trc_nb_01",
            customer_id="cust_aarav",
            payer_account_id=aarav.account_id,
            beneficiary_account_id=suresh.account_id,
            amount_paise=amount,
            transfer_mode="IMPS",
            user_acknowledged=True,
        )
        assert tx_res["status"] == "COMPLETED"
        assert aarav.balance_paise == aarav_start - amount
        assert suresh.balance_paise == suresh_start + amount


def test_card_3ds_challenge_and_verification():
    with session_scope() as session:
        aarav = cbs.get_account(session, "acc_aarav_sbi")
        aarav_start = aarav.balance_paise
        amount = to_paise(85_000)

        # 1. Checkout triggers 3DS challenge
        res1 = handle_card_checkout(
            session,
            trace_id="trc_card_01",
            card_id="card_aarav_rupay",
            merchant_id="merch_croma_retail",
            amount_paise=amount,
            otp_submitted=None,
        )
        assert res1["status"] == "CHALLENGE_REQUIRED"
        assert aarav.balance_paise == aarav_start  # 0 balance change

        # 2. Submit wrong OTP -> Fails
        res_fail = handle_card_checkout(
            session,
            trace_id="trc_card_01",
            card_id="card_aarav_rupay",
            merchant_id="merch_croma_retail",
            amount_paise=amount,
            otp_submitted="999999",
        )
        assert res_fail["status"] == "FAILED"
        assert aarav.balance_paise == aarav_start

        # 3. Submit valid OTP -> Completes
        res_ok = handle_card_checkout(
            session,
            trace_id="trc_card_01",
            card_id="card_aarav_rupay",
            merchant_id="merch_croma_retail",
            amount_paise=amount,
            otp_submitted="123456",
        )
        assert res_ok["status"] == "COMPLETED"
        assert aarav.balance_paise == aarav_start - amount

"""Tests for Core Banking System (CBS) and Double-Entry Ledger Invariants.
"""
from __future__ import annotations

import pytest
from sqlalchemy import select

from ecosystem.banks import cbs
from ecosystem.config import to_paise
from ecosystem.db import reset_db, session_scope
from ecosystem.models import Account, LedgerEntry
from ecosystem.npci import switch
from ecosystem.scenarios.seed import seed_all


@pytest.fixture(autouse=True)
def setup_db():
    reset_db()
    with session_scope() as session:
        seed_all(session)


def test_completed_payment_creates_exactly_two_ledger_entries():
    with session_scope() as session:
        aarav = cbs.get_account(session, "acc_aarav_sbi")
        suresh = cbs.get_account(session, "acc_suresh_sbi")
        aarav_start = aarav.balance_paise
        suresh_start = suresh.balance_paise

        val_res = switch.handle_req_val_add(
            session,
            trace_id="trc_test_01",
            psp_id="gpay",
            payer_id="cust_aarav",
            payer_account_id="acc_aarav_sbi",
            payee_vpa="grocer.local@oksbi",
        )
        txn_id = val_res["txn_id"]

        amount = to_paise(500)
        pay_res = switch.handle_req_pay(
            session,
            trace_id="trc_test_01",
            txn_id=txn_id,
            amount_paise=amount,
            user_acknowledged=True,
            pin_verified=True,
        )

        assert pay_res["status"] == "COMPLETED"

        # Invariant: exactly 2 ledger entries created for this transaction
        entries = session.scalars(select(LedgerEntry).where(LedgerEntry.txn_id == txn_id)).all()
        assert len(entries) == 2

        directions = {e.direction.value for e in entries}
        assert directions == {"DEBIT", "CREDIT"}

        # Invariant: balances updated exactly by amount
        assert aarav.balance_paise == aarav_start - amount
        assert suresh.balance_paise == suresh_start + amount


def test_blocked_payment_creates_zero_ledger_entries_and_zero_balance_change():
    with session_scope() as session:
        aarav = cbs.get_account(session, "acc_aarav_sbi")
        mule = cbs.get_account(session, "acc_mule_axis")
        aarav_start = aarav.balance_paise
        mule_start = mule.balance_paise

        val_res = switch.handle_req_val_add(
            session,
            trace_id="trc_test_02",
            psp_id="gpay",
            payer_id="cust_aarav",
            payer_account_id="acc_aarav_sbi",
            payee_vpa="mule.syndicate@axis",
        )
        txn_id = val_res["txn_id"]

        amount = to_paise(50_000)
        pay_res = switch.handle_req_pay(
            session,
            trace_id="trc_test_02",
            txn_id=txn_id,
            amount_paise=amount,
            user_acknowledged=False,
            pin_verified=True,
        )

        assert pay_res["status"] == "BLOCKED"

        # Invariant: zero ledger entries created for blocked payment
        entries = session.scalars(select(LedgerEntry).where(LedgerEntry.txn_id == txn_id)).all()
        assert len(entries) == 0

        # Invariant: balances 100% unchanged
        assert aarav.balance_paise == aarav_start
        assert mule.balance_paise == mule_start

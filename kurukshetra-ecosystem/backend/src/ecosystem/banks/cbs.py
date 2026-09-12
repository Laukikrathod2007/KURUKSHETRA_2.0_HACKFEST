"""Core Banking System (CBS) simulation.

Every bank account has its balance stored in INTEGER PAISE.
Money is only ever moved via atomic double-entry ledger postings:
- A completed payment generates 1 DEBIT ledger entry on the remitter account
  and 1 CREDIT ledger entry on the beneficiary account.
- A blocked or failed payment generates ZERO ledger entries, and account balances
  remain completely unchanged.
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.config import format_inr
from ecosystem.models import Account, AccountStatus, Direction, LedgerEntry


class InsufficientFundsError(Exception):
    pass


class AccountNotActiveError(Exception):
    pass


def get_account(session: Session, account_id: str) -> Optional[Account]:
    return session.get(Account, account_id)


def check_account_status(session: Session, account_id: str) -> tuple[bool, str]:
    account = get_account(session, account_id)
    if not account:
        return False, f"Account {account_id} not found"
    if account.status == AccountStatus.FROZEN:
        return False, f"Account {account_id} is FROZEN by order"
    if account.status == AccountStatus.DORMANT:
        return False, f"Account {account_id} is DORMANT"
    return True, "ACTIVE"


def check_balance(session: Session, account_id: str, amount_paise: int) -> tuple[bool, str]:
    account = get_account(session, account_id)
    if not account:
        return False, f"Account {account_id} not found"
    if account.balance_paise < amount_paise:
        return (
            False,
            f"Insufficient funds: available {format_inr(account.balance_paise)}, requested {format_inr(amount_paise)}",
        )
    return True, "OK"


def post_debit(
    session: Session,
    *,
    account_id: str,
    amount_paise: int,
    txn_id: Optional[str] = None,
    counterparty_account_id: Optional[str] = None,
    counterparty_state: Optional[str] = None,
    narration: str = "",
) -> LedgerEntry:
    account = session.get(Account, account_id)
    if not account:
        raise ValueError(f"Account {account_id} not found")
    if account.status != AccountStatus.ACTIVE:
        raise AccountNotActiveError(f"Account {account_id} is {account.status.value}")
    if account.balance_paise < amount_paise:
        raise InsufficientFundsError(
            f"Insufficient balance in {account_id}: {account.balance_paise} < {amount_paise}"
        )

    account.balance_paise -= amount_paise
    entry_id = f"led_{uuid.uuid4().hex[:12]}"
    entry = LedgerEntry(
        entry_id=entry_id,
        account_id=account.account_id,
        txn_id=txn_id,
        direction=Direction.DEBIT,
        amount_paise=amount_paise,
        balance_after_paise=account.balance_paise,
        counterparty_account_id=counterparty_account_id,
        counterparty_state=counterparty_state,
        narration=narration or f"UPI-DB/{txn_id or 'TXN'}",
        posted_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(entry)
    return entry


def post_credit(
    session: Session,
    *,
    account_id: str,
    amount_paise: int,
    txn_id: Optional[str] = None,
    counterparty_account_id: Optional[str] = None,
    counterparty_state: Optional[str] = None,
    narration: str = "",
) -> LedgerEntry:
    account = session.get(Account, account_id)
    if not account:
        raise ValueError(f"Account {account_id} not found")
    if account.status != AccountStatus.ACTIVE:
        raise AccountNotActiveError(f"Account {account_id} is {account.status.value}")

    account.balance_paise += amount_paise
    entry_id = f"led_{uuid.uuid4().hex[:12]}"
    entry = LedgerEntry(
        entry_id=entry_id,
        account_id=account.account_id,
        txn_id=txn_id,
        direction=Direction.CREDIT,
        amount_paise=amount_paise,
        balance_after_paise=account.balance_paise,
        counterparty_account_id=counterparty_account_id,
        counterparty_state=counterparty_state,
        narration=narration or f"UPI-CR/{txn_id or 'TXN'}",
        posted_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(entry)
    return entry


def execute_transfer(
    session: Session,
    *,
    remitter_account_id: str,
    beneficiary_account_id: str,
    amount_paise: int,
    txn_id: str,
    narration: str = "",
) -> tuple[LedgerEntry, LedgerEntry]:
    """Execute both legs in the same database session.
    If either fails, the caller rollbacks the session, guaranteeing that
    no money is deducted without being credited.
    """
    remitter = session.get(Account, remitter_account_id)
    beneficiary = session.get(Account, beneficiary_account_id)
    if not remitter or not beneficiary:
        raise ValueError("Both remitter and beneficiary accounts must exist")

    debit_entry = post_debit(
        session,
        account_id=remitter_account_id,
        amount_paise=amount_paise,
        txn_id=txn_id,
        counterparty_account_id=beneficiary_account_id,
        counterparty_state=beneficiary.branch_state,
        narration=narration or f"TRANSFER-TO/{beneficiary_account_id}",
    )
    credit_entry = post_credit(
        session,
        account_id=beneficiary_account_id,
        amount_paise=amount_paise,
        txn_id=txn_id,
        counterparty_account_id=remitter_account_id,
        counterparty_state=remitter.branch_state,
        narration=narration or f"TRANSFER-FROM/{remitter_account_id}",
    )
    return debit_entry, credit_entry


def freeze_account(session: Session, account_id: str, reason: str = "") -> Account:
    account = session.get(Account, account_id)
    if not account:
        raise ValueError(f"Account {account_id} not found")
    account.status = AccountStatus.FROZEN
    return account


def get_statement(session: Session, account_id: str, limit: int = 50) -> list[LedgerEntry]:
    stmt = (
        select(LedgerEntry)
        .where(LedgerEntry.account_id == account_id)
        .order_by(LedgerEntry.posted_at.desc())
        .limit(limit)
    )
    return list(session.scalars(stmt).all())

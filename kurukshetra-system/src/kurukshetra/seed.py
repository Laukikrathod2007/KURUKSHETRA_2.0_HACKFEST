"""Seed script -- synthetic demo data covering all four demo scenarios
(GREEN / YELLOW / ORANGE(COACH) / RED(FREEZE)) from docs/00-council-verdict.md's
recommended demo flow.

Run with: .venv/Scripts/python.exe -m kurukshetra.seed
"""
from __future__ import annotations

import datetime as dt

from kurukshetra.db import SessionLocal, init_db
from kurukshetra.models import (
    Beneficiary,
    CbsAccount,
    CbsLedgerEntry,
    LedgerTransaction,
    Payer,
    PayerBeneficiaryLink,
    RegistryFlag,
)
from kurukshetra.reputation import submit_report

DEMO_PAYER_ID = "payer_demo_rajesh"

# Scenario 1 -- GREEN: known, legitimate small merchant.
KNOWN_BENEFICIARY = "grocer.local@oksbi"

# Scenario 2 -- YELLOW: brand new beneficiary, no CBS record at all
# (data_completeness=PARTIAL triggers the fallback-contract STEP_UP floor).
NEW_UNKNOWN_BENEFICIARY = "newshop.mumbai@oksbi"

# Scenario 3 -- ORANGE/COACH: CBI-impersonation handle (Tier 0 alone gets this to COACH).
IMPERSONATION_BENEFICIARY = "cbi.clearance.cell@sbi"

# Scenario 4 -- RED/FREEZE: cross-state mule syndicate account (Tier 1 CBS + reputation).
MULE_BENEFICIARY = "mule.syndicate@axis"

_now = dt.datetime.utcnow


def seed() -> None:
    init_db()
    session = SessionLocal()
    try:
        if session.get(Payer, DEMO_PAYER_ID) is None:
            session.add(Payer(payer_id=DEMO_PAYER_ID, display_name="Rajesh (demo payer)"))

        for ref in (KNOWN_BENEFICIARY, NEW_UNKNOWN_BENEFICIARY, IMPERSONATION_BENEFICIARY, MULE_BENEFICIARY):
            if session.get(Beneficiary, ref) is None:
                session.add(Beneficiary(beneficiary_ref=ref))

        # --- Scenario 1: known-beneficiary transaction history --------------
        if session.get(PayerBeneficiaryLink, (DEMO_PAYER_ID, KNOWN_BENEFICIARY)) is None:
            session.add(
                PayerBeneficiaryLink(
                    payer_id=DEMO_PAYER_ID,
                    beneficiary_ref=KNOWN_BENEFICIARY,
                    first_transaction_at=_now() - dt.timedelta(days=90),
                    successful_transaction_count=14,
                )
            )
            for i in range(14):
                session.add(
                    LedgerTransaction(
                        transaction_id=f"seed_known_{i}",
                        payer_id=DEMO_PAYER_ID,
                        beneficiary_ref=KNOWN_BENEFICIARY,
                        amount=350 + i * 10,
                        direction="OUTBOUND",
                        decision="ALLOW",
                        completed=True,
                        initiated_at=_now() - dt.timedelta(days=90 - i * 5),
                    )
                )

        # --- Scenario 1 CBS record: legitimate small merchant ----------------
        if session.get(CbsAccount, KNOWN_BENEFICIARY) is None:
            session.add(
                CbsAccount(
                    account_ref=KNOWN_BENEFICIARY,
                    opened_at=_now() - dt.timedelta(days=400),
                    kyc_tier="FULL",
                    account_type="MERCHANT",
                    mc_code="5411",
                    current_balance=42000,
                )
            )
            for i in range(10):
                session.add(
                    CbsLedgerEntry(
                        entry_id=f"seed_grocer_credit_{i}",
                        account_ref=KNOWN_BENEFICIARY,
                        direction="CREDIT",
                        amount=300 + i * 15,
                        counterparty_state="Maharashtra",
                        occurred_at=_now() - dt.timedelta(days=i * 3),
                    )
                )
                session.add(
                    CbsLedgerEntry(
                        entry_id=f"seed_grocer_debit_{i}",
                        account_ref=KNOWN_BENEFICIARY,
                        direction="DEBIT",
                        amount=250,
                        counterparty_state="Maharashtra",
                        occurred_at=_now() - dt.timedelta(days=i * 3) + dt.timedelta(days=1),
                    )
                )

        # --- Scenario 4: cross-state mule syndicate CBS + reputation ---------
        if session.get(CbsAccount, MULE_BENEFICIARY) is None:
            session.add(
                CbsAccount(
                    account_ref=MULE_BENEFICIARY,
                    opened_at=_now() - dt.timedelta(days=5),
                    kyc_tier="BASIC_OTP",
                    account_type="SAVINGS",
                    mc_code="0000",
                    current_balance=480,
                )
            )
            states = ["Assam", "Bihar", "WestBengal", "UttarPradesh", "Rajasthan", "Odisha", "Jharkhand"]
            for i in range(16):
                credit_time = _now() - dt.timedelta(hours=47) + dt.timedelta(hours=i * 3)
                amount = 45000 + (i % 5) * 3000
                session.add(
                    CbsLedgerEntry(
                        entry_id=f"seed_mule_credit_{i}",
                        account_ref=MULE_BENEFICIARY,
                        direction="CREDIT",
                        amount=amount,
                        counterparty_state=states[i % len(states)],
                        occurred_at=credit_time,
                    )
                )
                session.add(
                    CbsLedgerEntry(
                        entry_id=f"seed_mule_debit_{i}",
                        account_ref=MULE_BENEFICIARY,
                        direction="DEBIT",
                        amount=round(amount * 0.98),
                        counterparty_state=states[i % len(states)],
                        occurred_at=credit_time + dt.timedelta(minutes=4),
                    )
                )

            for i in range(3):
                submit_report(
                    session,
                    target_ref=MULE_BENEFICIARY,
                    reporter_identity_hash=f"sha256:demo_reporter_{i}",
                    reason_code="MULE_SUSPECTED",
                )

            if session.get(RegistryFlag, MULE_BENEFICIARY) is None:
                session.add(
                    RegistryFlag(
                        target_ref=MULE_BENEFICIARY,
                        flag_type="I4C_CFCFRMS",
                        reference_id="DEMO-ILLUSTRATIVE-2026-0001",
                    )
                )

        session.commit()
        print("Seed complete. Demo scenarios:")
        print(f"  GREEN  (known, ALLOW):        payer={DEMO_PAYER_ID!r} beneficiary={KNOWN_BENEFICIARY!r}")
        print(f"  YELLOW (new, no CBS record):  payer={DEMO_PAYER_ID!r} beneficiary={NEW_UNKNOWN_BENEFICIARY!r}")
        print(f"  ORANGE (CBI impersonation):   payer={DEMO_PAYER_ID!r} beneficiary={IMPERSONATION_BENEFICIARY!r} declared_purpose=GOVT_FINE")
        print(f"  RED    (cross-state mule):    payer={DEMO_PAYER_ID!r} beneficiary={MULE_BENEFICIARY!r}")
    finally:
        session.close()


if __name__ == "__main__":
    seed()

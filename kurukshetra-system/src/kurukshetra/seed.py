"""Seed script -- synthetic demo data for the Local Ledger DB.

Run with: .venv/Scripts/python.exe -m kurukshetra.seed

Answers the cold-start problem the architecture council flagged
(docs/00-council-verdict.md, "Blind Spots the Council Caught" #2): a fresh
sidecar has zero transaction history on day one, so the "known beneficiary"
fast path has nothing to demo against without this.
"""
from __future__ import annotations

import datetime as dt

from kurukshetra.db import SessionLocal, init_db
from kurukshetra.models import Beneficiary, LedgerTransaction, Payer, PayerBeneficiaryLink

DEMO_PAYER_ID = "payer_demo_rajesh"
DEMO_KNOWN_BENEFICIARY = "grocer.local@oksbi"
DEMO_NEW_BENEFICIARY = "military.canteen.cctv@oksbi"


def seed() -> None:
    init_db()
    session = SessionLocal()
    try:
        if session.get(Payer, DEMO_PAYER_ID) is None:
            session.add(Payer(payer_id=DEMO_PAYER_ID, display_name="Rajesh (demo payer)"))

        for ref in (DEMO_KNOWN_BENEFICIARY, DEMO_NEW_BENEFICIARY):
            if session.get(Beneficiary, ref) is None:
                session.add(Beneficiary(beneficiary_ref=ref))

        known_link = session.get(PayerBeneficiaryLink, (DEMO_PAYER_ID, DEMO_KNOWN_BENEFICIARY))
        if known_link is None:
            session.add(
                PayerBeneficiaryLink(
                    payer_id=DEMO_PAYER_ID,
                    beneficiary_ref=DEMO_KNOWN_BENEFICIARY,
                    first_transaction_at=dt.datetime.utcnow() - dt.timedelta(days=90),
                    successful_transaction_count=14,
                )
            )
            for i in range(14):
                session.add(
                    LedgerTransaction(
                        transaction_id=f"seed_known_{i}",
                        payer_id=DEMO_PAYER_ID,
                        beneficiary_ref=DEMO_KNOWN_BENEFICIARY,
                        amount=350 + i * 10,
                        decision="ALLOW",
                        completed=True,
                        initiated_at=dt.datetime.utcnow() - dt.timedelta(days=90 - i * 5),
                    )
                )

        session.commit()
        print("Seed complete.")
        print(f"  Known beneficiary demo: payer={DEMO_PAYER_ID!r} beneficiary={DEMO_KNOWN_BENEFICIARY!r}")
        print(f"  New beneficiary demo:   payer={DEMO_PAYER_ID!r} beneficiary={DEMO_NEW_BENEFICIARY!r}")
    finally:
        session.close()


if __name__ == "__main__":
    seed()

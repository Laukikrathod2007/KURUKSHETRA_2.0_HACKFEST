"""NPCI Central Mapper simulation.

Resolves Virtual Payment Addresses (VPAs) to bank accounts and registered names.
In the real world, only NPCI operates the Central Mapper across all banks and PSPs.

DYNAMIC PROVISIONING: the seed script only pre-creates a handful of curated
demo identities. In real UPI, any syntactically valid, registered VPA
resolves to SOME real bank account -- the space of payees is not limited to
a memorized list. `resolve_or_provision_vpa` reproduces that: the first time
an unrecognized VPA is looked up, it deterministically synthesizes a
plausible new Account+Customer+VpaMapping (seeded from a hash of the VPA
string, so the same VPA always produces the same result) and persists it as
a real row, so it becomes a permanent part of the simulated ecosystem from
then on -- exactly like a real UPI onboarding. This is what lets the demo
answer arbitrary typed input instead of only the curated preset VPAs.

Critically, the synthesized *name* is drawn from a generic name pool, NEVER
derived from the VPA's local-part text. This mirrors the real-world fact a
scam handle like `cbi.clearance.cell@sbi` resolves to the account holder's
actual registered name, not to whatever the handle claims -- which is
exactly the contradiction features #3/#4 are built to catch. Without this,
only the one hand-written seeded example would ever trigger those detectors.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import uuid
from typing import Optional

from pydantic import BaseModel
from sqlalchemy.orm import Session

from ecosystem.models import (
    Account,
    AccountType,
    Bank,
    Customer,
    Direction,
    KycTier,
    LedgerEntry,
    VpaMapping,
)

_NOW = lambda: dt.datetime.now(dt.UTC).replace(tzinfo=None)  # noqa: E731

# Deterministic synthesis pools -- chosen by hashing the VPA, never from its text.
_GENERIC_NAMES = [
    "Ramesh Gupta", "Sunita Devi", "Manoj Kumar", "Priya Nair", "Arjun Verma",
    "Kavita Joshi", "Sanjay Patil", "Neha Reddy", "Vikram Singh", "Anjali Rao",
    "Deepak Yadav", "Pooja Iyer", "Rahul Mehta", "Shalini Bose", "Ajay Kapoor",
    "Meena Pillai", "Rohit Chauhan", "Divya Menon", "Suresh Naidu", "Kiran Shah",
]
_STATES = [
    "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal",
    "Gujarat", "Rajasthan", "Uttar Pradesh", "Bihar", "Assam", "Kerala",
]
_HANDLE_TO_BANK = {
    "oksbi": ("SBIN", "State Bank of India"),
    "okhdfcbank": ("HDFC", "HDFC Bank"),
    "okicici": ("ICIC", "ICICI Bank"),
    "okaxis": ("UTIB", "Axis Bank"),
    "ybl": ("YESB", "Yes Bank (PhonePe)"),
    "paytm": ("PYTM", "Paytm Payments Bank"),
    "axl": ("UTIB", "Axis Bank"),
    "ibl": ("IDFB", "IDFC First Bank"),
}
_MERCHANT_KEYWORDS = ("shop", "store", "mart", "kirana", "retail", "traders", "enterprises", "electronics")


class ResolvedVpa(BaseModel):
    vpa: str
    account_id: str
    bank_id: str
    bank_name: str
    customer_id: str
    customer_name: str
    mcc: str
    kyc_tier: str
    branch_state: str
    is_active: bool = True
    suspended_reason: Optional[str] = None
    newly_provisioned: bool = False


def resolve_vpa(session: Session, vpa: str) -> Optional[ResolvedVpa]:
    """Look up VPA in NPCI Central Mapper. Returns None if never provisioned."""
    mapping = session.get(VpaMapping, vpa)
    if not mapping:
        return None

    account = session.get(Account, mapping.account_id)
    if not account:
        return None

    customer = session.get(Customer, account.customer_id)
    bank = session.get(Bank, account.bank_id)

    return ResolvedVpa(
        vpa=vpa,
        account_id=account.account_id,
        bank_id=account.bank_id,
        bank_name=bank.name if bank else account.bank_id,
        customer_id=customer.customer_id if customer else "CUST_UNKNOWN",
        customer_name=customer.name if customer else "Unknown Beneficiary",
        mcc=account.mcc,
        kyc_tier=account.kyc_tier.value,
        branch_state=account.branch_state,
        is_active=mapping.is_active,
        suspended_reason=mapping.suspended_reason,
    )


def _hash_int(vpa: str, salt: str = "") -> int:
    return int(hashlib.sha256((vpa + salt).encode()).hexdigest(), 16)


def _synthesize_account(session: Session, vpa: str) -> ResolvedVpa:
    """Deterministically provisions a brand-new Account+Customer+VpaMapping
    for a VPA nobody has seen before, and persists it for real."""
    h = _hash_int(vpa)
    local_part, _, handle = vpa.partition("@")
    bank_id, bank_name = _HANDLE_TO_BANK.get(handle.lower(), ("NEWB", "New-Age Payments Bank"))

    is_merchant = any(kw in local_part.lower() for kw in _MERCHANT_KEYWORDS)
    is_suspicious_bucket = (h % 100) < 15  # ~15% of fresh unknown VPAs synthesize as mule-like

    name = _GENERIC_NAMES[h % len(_GENERIC_NAMES)]
    state = _STATES[(h // 97) % len(_STATES)]

    if is_merchant:
        account_type = AccountType.MERCHANT
        mcc = "5411"
        kyc_tier = KycTier.FULL
        age_days = 180 + (h % 700)
        balance_paise = 10_000_00 + (h % 50_000_00)
    elif is_suspicious_bucket:
        account_type = AccountType.SAVINGS
        mcc = "0000"
        kyc_tier = KycTier.BASIC_OTP
        age_days = 1 + (h % 6)  # brand new, 1-6 days old
        balance_paise = 100_00 + (h % 900_00)
    else:
        account_type = AccountType.SAVINGS
        mcc = "0000"
        kyc_tier = KycTier.FULL if (h % 3) else KycTier.BASIC_OTP
        age_days = 30 + (h % 500)
        balance_paise = 500_00 + (h % 20_000_00)

    account_id = f"acc_syn_{uuid.uuid4().hex[:10]}"
    customer_id = f"cust_syn_{uuid.uuid4().hex[:10]}"
    opened_at = _NOW() - dt.timedelta(days=age_days)

    if session.get(Bank, bank_id) is None:
        session.add(Bank(bank_id=bank_id, name=bank_name, ifsc_prefix=bank_id[:4]))

    session.add(
        Customer(
            customer_id=customer_id,
            name=name,
            phone=f"+91{6_000_000_000 + (h % 3_999_999_999)}",
            kyc_tier=kyc_tier,
            home_state=state,
        )
    )
    session.add(
        Account(
            account_id=account_id,
            bank_id=bank_id,
            customer_id=customer_id,
            account_number=str(10_000_000_000 + (h % 89_999_999_999)),
            ifsc=f"{bank_id[:4]}0{h % 1000000:06d}",
            account_type=account_type,
            mcc=mcc,
            balance_paise=balance_paise,
            kyc_tier=kyc_tier,
            branch_state=state,
            opened_at=opened_at,
        )
    )
    session.add(VpaMapping(vpa=vpa, account_id=account_id, psp_handle=handle or "unknown", is_active=True))

    # A little synthetic CBS history so Tier 1 forensics have something real
    # to look at, instead of every fresh VPA reading as NO_CBS_DATA_AVAILABLE.
    # Merchants are deliberately excluded from the suspicious-bucket seeding --
    # a verified, 180+ day old, full-KYC merchant account has no business
    # showing a mule-style burst-drain pattern in this synthetic model.
    if is_suspicious_bucket and not is_merchant:
        # Mule-like burst-and-drain: several large credits from different
        # states, each drained within minutes -- feeds #7/#18/#19/#21.
        for i in range(3 + (h % 4)):
            credit_time = _NOW() - dt.timedelta(hours=(h + i * 7) % 48)
            amount = 20_000_00 + ((h * (i + 1)) % 80_000_00)
            session.add(
                LedgerEntry(
                    entry_id=f"led_syn_{uuid.uuid4().hex[:10]}",
                    account_id=account_id,
                    direction=Direction.CREDIT,
                    amount_paise=amount,
                    balance_after_paise=balance_paise,
                    counterparty_state=_STATES[(h + i) % len(_STATES)],
                    narration="Synthetic onboarding history",
                    posted_at=credit_time,
                )
            )
            session.add(
                LedgerEntry(
                    entry_id=f"led_syn_{uuid.uuid4().hex[:10]}",
                    account_id=account_id,
                    direction=Direction.DEBIT,
                    amount_paise=round(amount * 0.97),
                    balance_after_paise=balance_paise,
                    counterparty_state=_STATES[(h + i) % len(_STATES)],
                    narration="Synthetic drain",
                    posted_at=credit_time + dt.timedelta(minutes=2 + (i % 5)),
                )
            )
    elif not is_merchant and (h % 4) == 0:
        # A normal, quiet personal account: a couple of small, unremarkable entries.
        for i in range(1 + (h % 2)):
            t = _NOW() - dt.timedelta(days=(h + i * 13) % max(age_days, 1))
            session.add(
                LedgerEntry(
                    entry_id=f"led_syn_{uuid.uuid4().hex[:10]}",
                    account_id=account_id,
                    direction=Direction.CREDIT if i % 2 == 0 else Direction.DEBIT,
                    amount_paise=200_00 + (h % 5_000_00),
                    balance_after_paise=balance_paise,
                    counterparty_state=state,
                    narration="Synthetic routine activity",
                    posted_at=t,
                )
            )

    session.flush()

    return ResolvedVpa(
        vpa=vpa,
        account_id=account_id,
        bank_id=bank_id,
        bank_name=bank_name,
        customer_id=customer_id,
        customer_name=name,
        mcc=mcc,
        kyc_tier=kyc_tier.value,
        branch_state=state,
        is_active=True,
        newly_provisioned=True,
    )


def resolve_or_provision_vpa(session: Session, vpa: str) -> ResolvedVpa:
    """The real entry point for the switch: resolve if known, else provision
    a deterministic new account on the fly so any typed VPA produces a real,
    reproducible risk assessment instead of a VPA_NOT_FOUND dead end."""
    existing = resolve_vpa(session, vpa)
    if existing is not None:
        return existing
    return _synthesize_account(session, vpa)


def kill_switch_revoke(session: Session, target_vpa: str, reason: str = "NATIONWIDE_KILL_SWITCH_ENGAGED") -> bool:
    """Revokes a VPA across the entire national payment ecosystem."""
    mapping = session.get(VpaMapping, target_vpa)
    if not mapping:
        return False
    mapping.is_active = False
    mapping.suspended_reason = reason
    session.flush()
    return True

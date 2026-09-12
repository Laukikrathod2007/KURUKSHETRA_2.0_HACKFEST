"""Bulk synthetic population for a populated-looking, richly interconnected
live registry.

The 5 curated identities in seed.py exist to make the 5 canonical demo
scenarios land in an exact, reproducible risk zone every run -- they must
stay hand-scripted. This module adds ~100 additional accounts/customers/VPAs
around them AND wires real peer-to-peer ledger entries between them (every
LedgerEntry carries a real counterparty_account_id, not just a state label),
so the registry graph -- and its live SSE feed to the external Three.js
visualization -- shows an actual expandable network, not ~100 isolated dots.

Same honest convention as npci/mapper.py's on-the-fly provisioning: every
value is derived deterministically from a seeded index via SHA-256, never
Python's random module, so a re-seed always produces the identical graph --
the demo is reproducible, not a fresh roll of dice each launch.
"""
from __future__ import annotations

import datetime as dt
import hashlib

from sqlalchemy.orm import Session

from ecosystem.models import (
    Account,
    AccountType,
    Bank,
    Customer,
    Direction,
    KycTier,
    LedgerEntry,
    ReputationScore,
    ScamReport,
    SwitchMetric,
    VpaMapping,
)

BULK_ACCOUNT_COUNT = 100

_FIRST_NAMES = [
    "Ramesh", "Sunita", "Manoj", "Priya", "Arjun", "Kavita", "Sanjay", "Neha",
    "Vikram", "Anjali", "Deepak", "Pooja", "Rahul", "Shalini", "Ajay", "Meena",
    "Rohit", "Divya", "Suresh", "Kiran", "Amitabh", "Geeta", "Naveen", "Swati",
    "Rajesh", "Lakshmi", "Vivek", "Nisha", "Ashok", "Rekha",
]
_LAST_NAMES = [
    "Gupta", "Devi", "Kumar", "Nair", "Verma", "Joshi", "Patil", "Reddy",
    "Singh", "Rao", "Yadav", "Iyer", "Mehta", "Bose", "Kapoor", "Pillai",
    "Chauhan", "Menon", "Naidu", "Shah",
]
_STATES = [
    "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal",
    "Gujarat", "Rajasthan", "Uttar Pradesh", "Bihar", "Assam", "Kerala",
    "Punjab", "Haryana", "Telangana", "Odisha",
]
_BANKS = [
    ("SBIN", "State Bank of India", "oksbi"),
    ("HDFC", "HDFC Bank", "okhdfcbank"),
    ("AXIS", "Axis Bank", "okaxis"),
    ("ICIC", "ICICI Bank", "okicici"),
]
_MERCHANT_NAMES = [
    "Kirana Store", "Electronics Mart", "Medical Store", "Fashion Boutique",
    "Hardware Traders", "Bakery Corner", "Mobile Shop", "Book Depot",
    "Auto Spares", "Sweet House",
]
_ROLE_WEIGHTS = [
    # (weight_out_of_100, role)
    (50, "NORMAL_PERSONAL"),
    (18, "SMALL_MERCHANT"),
    (12, "NEW_UNVERIFIED"),
    (8, "COMMUNITY_REPORTED"),
    (12, "MULE_LIKE"),
]


def _hash_int(seed: str) -> int:
    return int(hashlib.sha256(seed.encode()).hexdigest(), 16)


def _role_for_index(h: int) -> str:
    bucket = h % 100
    cursor = 0
    for weight, role in _ROLE_WEIGHTS:
        cursor += weight
        if bucket < cursor:
            return role
    return "NORMAL_PERSONAL"


def _make_identity(i: int, h: int) -> dict:
    bank_id, bank_name, handle = _BANKS[h % len(_BANKS)]
    role = _role_for_index(h)
    first = _FIRST_NAMES[h % len(_FIRST_NAMES)]
    last = _LAST_NAMES[(h // 31) % len(_LAST_NAMES)]
    name = f"{first} {last}"
    state = _STATES[(h // 97) % len(_STATES)]

    is_merchant = role == "SMALL_MERCHANT"
    vpa_local = f"{first.lower()}{last.lower()}{i}"
    if is_merchant:
        merchant_label = _MERCHANT_NAMES[h % len(_MERCHANT_NAMES)]
        name = f"{merchant_label} ({last})"
        vpa = f"{vpa_local}.shop@{handle}"
    else:
        vpa = f"{vpa_local}@{handle}"

    account_type = AccountType.MERCHANT if is_merchant else AccountType.SAVINGS
    mcc = "5411" if is_merchant else "0000"
    kyc_tier = (
        KycTier.FULL if role in ("NORMAL_PERSONAL", "SMALL_MERCHANT")
        else KycTier.BASIC_OTP if role == "COMMUNITY_REPORTED"
        else KycTier.MINIMAL
    )
    if role in ("NEW_UNVERIFIED", "MULE_LIKE"):
        age_days = 1 + (h % 6)
    elif role == "COMMUNITY_REPORTED":
        age_days = 5 + (h % 20)
    else:
        age_days = 60 + (h % 800)

    return {
        "index": i,
        "hash": h,
        "role": role,
        "bank_id": bank_id,
        "bank_name": bank_name,
        "handle": handle,
        "name": name,
        "state": state,
        "vpa": vpa,
        "is_merchant": is_merchant,
        "account_type": account_type,
        "mcc": mcc,
        "kyc_tier": kyc_tier,
        "age_days": age_days,
        "customer_id": f"cust_bulk_{i:03d}",
        "account_id": f"acc_bulk_{i:03d}",
        "balance_paise": 500_00 + (h % 90_000_00),
    }


def _peers_for(identity: dict, pool: list[dict], want: int, role_filter=None) -> list[dict]:
    """Deterministically picks `want` other identities from the pool for
    identity to transact with, using the same hash-offset trick as
    mapper.py -- never random, always the same graph on re-seed."""
    h = identity["hash"]
    candidates = [p for p in pool if p["index"] != identity["index"] and (role_filter is None or p["role"] in role_filter)]
    if not candidates:
        return []
    picks = []
    for k in range(want):
        idx = (h + k * 31 + identity["index"] * 7) % len(candidates)
        picks.append(candidates[idx])
    return picks


def seed_bulk_population(
    session: Session,
    now: dt.datetime,
    count: int = BULK_ACCOUNT_COUNT,
    anchor_account_ids: list[str] | None = None,
) -> None:
    anchor_account_ids = anchor_account_ids or []
    identities = [_make_identity(i, _hash_int(f"bulk_entity_{i}")) for i in range(count)]
    by_role = {}
    for ident in identities:
        by_role.setdefault(ident["role"], []).append(ident)

    # 1. Create every Bank/Customer/Account/VpaMapping row first, so every
    # peer-to-peer ledger entry below can reference a real counterparty
    # account that already exists.
    for ident in identities:
        if session.get(Bank, ident["bank_id"]) is None:
            session.add(Bank(bank_id=ident["bank_id"], name=ident["bank_name"], ifsc_prefix=ident["bank_id"][:4]))

        opened_at = now - dt.timedelta(days=ident["age_days"])
        h = ident["hash"]
        session.add(Customer(
            customer_id=ident["customer_id"],
            name=ident["name"],
            phone=f"+91{7_000_000_000 + (h % 2_999_999_999)}",
            kyc_tier=ident["kyc_tier"],
            home_state=ident["state"],
            created_at=opened_at,
        ))
        session.add(Account(
            account_id=ident["account_id"],
            bank_id=ident["bank_id"],
            customer_id=ident["customer_id"],
            account_number=str(30_000_000_000 + (h % 69_999_999_999)),
            ifsc=f"{ident['bank_id'][:4]}0{h % 1000000:06d}",
            account_type=ident["account_type"],
            mcc=ident["mcc"],
            balance_paise=ident["balance_paise"],
            kyc_tier=ident["kyc_tier"],
            branch_state=ident["state"],
            opened_at=opened_at,
        ))
        session.add(VpaMapping(vpa=ident["vpa"], account_id=ident["account_id"], psp_handle=ident["handle"], is_active=True))

    session.flush()

    # 2. Wire real peer-to-peer ledger entries -- every entry gets a genuine
    # counterparty_account_id so the registry graph has real edges to draw,
    # and every account ends up with several connections instead of zero.
    for ident in identities:
        h = ident["hash"]
        account_id = ident["account_id"]
        vpa = ident["vpa"]
        role = ident["role"]
        balance = ident["balance_paise"]

        if role == "MULE_LIKE":
            # Rapid inbound credits from several distinct "victim" accounts
            # (drawn from the general population, mirroring real fan-in),
            # each drained onward to another mule-like account within minutes
            # -- a real multi-hop layering chain, not a dead-end sink.
            victims = _peers_for(ident, identities, 3 + (h % 4), role_filter=("NORMAL_PERSONAL", "NEW_UNVERIFIED", "COMMUNITY_REPORTED"))
            drain_targets = _peers_for(ident, identities, 1 + (h % 2), role_filter=("MULE_LIKE",)) or victims[:1]

            for j, victim in enumerate(victims):
                credit_time = now - dt.timedelta(hours=(h + j * 7) % 48)
                amount = 20_000_00 + ((h * (j + 1)) % 80_000_00)
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{ident['index']:03d}_cr_{j}",
                    account_id=account_id,
                    direction=Direction.CREDIT,
                    amount_paise=amount,
                    balance_after_paise=balance,
                    counterparty_account_id=victim["account_id"],
                    counterparty_state=victim["state"],
                    narration=f"INFLOW/{victim['name']}",
                    posted_at=credit_time,
                ))
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{victim['index']:03d}_out_{ident['index']:03d}_{j}",
                    account_id=victim["account_id"],
                    direction=Direction.DEBIT,
                    amount_paise=amount,
                    balance_after_paise=victim["balance_paise"],
                    counterparty_account_id=account_id,
                    counterparty_state=ident["state"],
                    narration=f"OUTFLOW/{ident['name']}",
                    posted_at=credit_time,
                ))
            for j, target in enumerate(drain_targets):
                drain_time = now - dt.timedelta(hours=(h + j * 7) % 48) + dt.timedelta(minutes=1 + (j % 4))
                drain_amount = round((20_000_00 + ((h * (j + 1)) % 80_000_00)) * 0.96)
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{ident['index']:03d}_db_{j}",
                    account_id=account_id,
                    direction=Direction.DEBIT,
                    amount_paise=drain_amount,
                    balance_after_paise=balance,
                    counterparty_account_id=target["account_id"],
                    counterparty_state="Offshore" if target is victims[:1] else target["state"],
                    narration=f"LAYERING/{target['name']}",
                    posted_at=drain_time,
                ))
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{target['index']:03d}_in_{ident['index']:03d}_{j}",
                    account_id=target["account_id"],
                    direction=Direction.CREDIT,
                    amount_paise=drain_amount,
                    balance_after_paise=target["balance_paise"],
                    counterparty_account_id=account_id,
                    counterparty_state=ident["state"],
                    narration=f"LAYERING_IN/{ident['name']}",
                    posted_at=drain_time,
                ))

            session.add(SwitchMetric(
                target_ref=vpa,
                lookup_count=30 + (h % 60),
                pay_count=1 + (h % 4),
                distinct_psp_count=2,
                first_lookup_at=now - dt.timedelta(hours=6),
                last_lookup_at=now - dt.timedelta(minutes=h % 60),
                baseline_lookups_per_hour=0.03,
            ))
            reporters = _peers_for(ident, identities, 1 + (h % 3))
            for k, reporter in enumerate(reporters):
                session.add(ScamReport(
                    report_id=f"rep_bulk_{ident['index']:03d}_{k}",
                    target_ref=vpa,
                    reporter_identity_hash=f"victim_hash_{reporter['account_id']}",
                    reason_code="MULE_SUSPECTED",
                    reported_at=now - dt.timedelta(hours=1 + ((h + k) % 20)),
                ))
            session.add(ReputationScore(
                target_ref=vpa,
                distinct_reporter_count=len(reporters),
                community_risk_score=0.55 + (h % 40) / 100,
                last_updated_at=now,
            ))

        elif role == "COMMUNITY_REPORTED":
            reporters = _peers_for(ident, identities, 1 + (h % 2))
            for k, reporter in enumerate(reporters):
                session.add(ScamReport(
                    report_id=f"rep_bulk_{ident['index']:03d}_{k}",
                    target_ref=vpa,
                    reporter_identity_hash=f"victim_hash_{reporter['account_id']}",
                    reason_code="COMMUNITY_FLAGGED",
                    reported_at=now - dt.timedelta(days=1 + ((h + k) % 5)),
                ))
            session.add(ReputationScore(
                target_ref=vpa,
                distinct_reporter_count=len(reporters),
                community_risk_score=0.2 + (h % 20) / 100,
                last_updated_at=now,
            ))
            peers = _peers_for(ident, identities, 2 + (h % 3))
            for j, peer in enumerate(peers):
                t = now - dt.timedelta(days=(h + j * 3) % max(ident["age_days"], 1))
                amount = 500_00 + (h % 5_000_00)
                direction = Direction.CREDIT if j % 2 == 0 else Direction.DEBIT
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{ident['index']:03d}_peer_{j}",
                    account_id=account_id,
                    direction=direction,
                    amount_paise=amount,
                    balance_after_paise=balance,
                    counterparty_account_id=peer["account_id"],
                    counterparty_state=peer["state"],
                    narration=f"{'INFLOW' if direction == Direction.CREDIT else 'OUTFLOW'}/{peer['name']}",
                    posted_at=t,
                ))
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{peer['index']:03d}_rpeer_{ident['index']:03d}_{j}",
                    account_id=peer["account_id"],
                    direction=Direction.DEBIT if direction == Direction.CREDIT else Direction.CREDIT,
                    amount_paise=amount,
                    balance_after_paise=peer["balance_paise"],
                    counterparty_account_id=account_id,
                    counterparty_state=ident["state"],
                    narration=f"{'OUTFLOW' if direction == Direction.CREDIT else 'INFLOW'}/{ident['name']}",
                    posted_at=t,
                ))

        else:
            # Normal personal accounts and small merchants: several genuine
            # bidirectional peer/merchant transactions -- real cash flow,
            # no risk signal, but real edges so the graph is densely woven
            # rather than a scatter of unconnected points.
            peer_count = 4 + (h % 5) if role == "SMALL_MERCHANT" else 3 + (h % 4)
            role_filter = None if role == "SMALL_MERCHANT" else ("NORMAL_PERSONAL", "SMALL_MERCHANT", "NEW_UNVERIFIED")
            peers = _peers_for(ident, identities, peer_count, role_filter=role_filter)
            for j, peer in enumerate(peers):
                t = now - dt.timedelta(days=(h + j * 11) % max(ident["age_days"], 1))
                amount = 300_00 + (h % 8_000_00)
                direction = Direction.CREDIT if j % 2 == 0 else Direction.DEBIT
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{ident['index']:03d}_norm_{j}",
                    account_id=account_id,
                    direction=direction,
                    amount_paise=amount,
                    balance_after_paise=balance,
                    counterparty_account_id=peer["account_id"],
                    counterparty_state=peer["state"],
                    narration=f"{'INFLOW' if direction == Direction.CREDIT else 'OUTFLOW'}/{peer['name']}",
                    posted_at=t,
                ))
                session.add(LedgerEntry(
                    entry_id=f"led_bulk_{peer['index']:03d}_rnorm_{ident['index']:03d}_{j}",
                    account_id=peer["account_id"],
                    direction=Direction.DEBIT if direction == Direction.CREDIT else Direction.CREDIT,
                    amount_paise=amount,
                    balance_after_paise=peer["balance_paise"],
                    counterparty_account_id=account_id,
                    counterparty_state=ident["state"],
                    narration=f"{'OUTFLOW' if direction == Direction.CREDIT else 'INFLOW'}/{ident['name']}",
                    posted_at=t,
                ))
            session.add(SwitchMetric(
                target_ref=vpa,
                lookup_count=2 + (h % 20),
                pay_count=1 + (h % 18),
                distinct_psp_count=1 + (h % 2),
                first_lookup_at=now - dt.timedelta(days=ident["age_days"]),
                last_lookup_at=now - dt.timedelta(hours=h % 72),
                baseline_lookups_per_hour=0.1 + (h % 5) / 10,
            ))

    # 3. Bridge the bulk population into the curated 5-identity scenario
    # graph: a handful of bulk accounts also transact directly with the
    # curated accounts (Aarav, the grocer, the mule syndicate account), so
    # the two halves of the registry render as one connected network instead
    # of two disjoint islands.
    if anchor_account_ids:
        bridge_sources = [identities[i] for i in range(0, count, max(1, count // (len(anchor_account_ids) * 3)))]
        for k, ident in enumerate(bridge_sources):
            anchor_id = anchor_account_ids[k % len(anchor_account_ids)]
            h = ident["hash"]
            t = now - dt.timedelta(days=1 + (h % 15))
            amount = 400_00 + (h % 3_000_00)
            session.add(LedgerEntry(
                entry_id=f"led_bridge_{ident['index']:03d}_{k}",
                account_id=ident["account_id"],
                direction=Direction.DEBIT,
                amount_paise=amount,
                balance_after_paise=ident["balance_paise"],
                counterparty_account_id=anchor_id,
                counterparty_state=ident["state"],
                narration="Cross-network settlement",
                posted_at=t,
            ))

    session.flush()

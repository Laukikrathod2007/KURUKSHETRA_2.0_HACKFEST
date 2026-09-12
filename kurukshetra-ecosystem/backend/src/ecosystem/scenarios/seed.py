"""Comprehensive ecosystem database seeder.

Seeds realistic data for all 6 participants:
- Banks (SBI, HDFC, Axis, ICICI)
- Customers (Payer, Grocer, Unknown merchant, Extortionist, Mule)
- Core Banking Accounts with integer paise balances
- NPCI Central Mapper VPAs
- App-Local history demonstrating cross-PSP isolation (GPay vs PhonePe)
- Switch metrics counters
- Community reputation reports
- Conceptual government registries
- Cards and merchants
"""
from __future__ import annotations

import datetime as dt

from sqlalchemy.orm import Session

from ecosystem.config import to_paise
from ecosystem.db import reset_db, session_scope
from ecosystem.models import (
    Account,
    AccountStatus,
    AccountType,
    AppLocalHistory,
    Bank,
    Card,
    Customer,
    Direction,
    KycTier,
    LedgerEntry,
    Merchant,
    Psp,
    RegistryFlag,
    ReputationScore,
    SavedBeneficiary,
    ScamReport,
    SwitchMetric,
    VpaMapping,
)


def seed_all(session: Session) -> None:
    now = dt.datetime.now(dt.UTC).replace(tzinfo=None)

    # 1. Banks
    banks = [
        Bank(bank_id="SBIN", name="State Bank of India", ifsc_prefix="SBIN000"),
        Bank(bank_id="HDFC", name="HDFC Bank", ifsc_prefix="HDFC000"),
        Bank(bank_id="AXIS", name="Axis Bank", ifsc_prefix="UTIB000"),
        Bank(bank_id="ICIC", name="ICICI Bank", ifsc_prefix="ICIC000"),
    ]
    session.add_all(banks)

    # 2. Customers
    customers = [
        Customer(
            customer_id="cust_aarav",
            name="Aarav Sharma",
            phone="+919820011223",
            kyc_tier=KycTier.FULL,
            declared_occupation="Software Engineer",
            declared_annual_income_paise=to_paise(18_00_000),
            home_state="Maharashtra",
            created_at=now - dt.timedelta(days=700),
        ),
        Customer(
            customer_id="cust_suresh",
            name="Suresh Kirana Store",
            phone="+919820099887",
            kyc_tier=KycTier.FULL,
            declared_occupation="Merchant",
            home_state="Maharashtra",
            created_at=now - dt.timedelta(days=900),
        ),
        Customer(
            customer_id="cust_newshop",
            name="Unregistered New Shop",
            phone="+919811122334",
            kyc_tier=KycTier.BASIC_OTP,
            declared_occupation="Trader",
            home_state="Delhi",
            created_at=now - dt.timedelta(days=3),  # Brand new customer
        ),
        Customer(
            customer_id="cust_fake_cbi",
            name="Manoj Kumar (Fake Officer)",
            phone="+919700011222",
            kyc_tier=KycTier.BASIC_OTP,
            declared_occupation="Unemployed",
            home_state="Haryana",
            created_at=now - dt.timedelta(days=12),
        ),
        Customer(
            customer_id="cust_mule",
            name="Deepak Layering Account",
            phone="+919600033445",
            kyc_tier=KycTier.MINIMAL,
            declared_occupation="Student",
            home_state="Bihar",
            created_at=now - dt.timedelta(days=4),
        ),
    ]
    session.add_all(customers)

    # 3. Core Banking Accounts
    accounts = [
        Account(
            account_id="acc_aarav_sbi",
            bank_id="SBIN",
            customer_id="cust_aarav",
            account_number="20348911001",
            ifsc="SBIN0001234",
            account_type=AccountType.SAVINGS,
            mcc="0000",
            balance_paise=to_paise(150_000),  # Rs 1,50,000
            status=AccountStatus.ACTIVE,
            kyc_tier=KycTier.FULL,
            branch_state="Maharashtra",
            opened_at=now - dt.timedelta(days=700),
        ),
        Account(
            account_id="acc_suresh_sbi",
            bank_id="SBIN",
            customer_id="cust_suresh",
            account_number="20348999042",
            ifsc="SBIN0001234",
            account_type=AccountType.MERCHANT,
            mcc="5411",  # Grocery Store
            balance_paise=to_paise(42_500),  # Rs 42,500
            status=AccountStatus.ACTIVE,
            kyc_tier=KycTier.FULL,
            branch_state="Maharashtra",
            opened_at=now - dt.timedelta(days=900),
        ),
        Account(
            account_id="acc_newshop_hdfc",
            bank_id="HDFC",
            customer_id="cust_newshop",
            account_number="50100456123",
            ifsc="HDFC0000567",
            account_type=AccountType.SAVINGS,  # Personal savings pretending to be shop
            mcc="0000",
            balance_paise=to_paise(4_000),
            status=AccountStatus.ACTIVE,
            kyc_tier=KycTier.BASIC_OTP,
            branch_state="Delhi",
            opened_at=now - dt.timedelta(days=3),
        ),
        Account(
            account_id="acc_fake_cbi_sbi",
            bank_id="SBIN",
            customer_id="cust_fake_cbi",
            account_number="20349887711",
            ifsc="SBIN0009876",
            account_type=AccountType.SAVINGS,  # Personal savings account
            mcc="0000",
            balance_paise=to_paise(11_500),
            status=AccountStatus.ACTIVE,
            kyc_tier=KycTier.BASIC_OTP,
            branch_state="Haryana",
            opened_at=now - dt.timedelta(days=12),
        ),
        Account(
            account_id="acc_mule_axis",
            bank_id="AXIS",
            customer_id="cust_mule",
            account_number="91802004567",
            ifsc="UTIB0000888",
            account_type=AccountType.SAVINGS,
            mcc="0000",
            balance_paise=to_paise(850),  # Drained down to Rs 850
            status=AccountStatus.ACTIVE,
            kyc_tier=KycTier.MINIMAL,
            branch_state="Bihar",
            opened_at=now - dt.timedelta(days=4),
        ),
    ]
    session.add_all(accounts)

    # 4. NPCI Central Mapper VPAs
    vpas = [
        VpaMapping(vpa="grocer.local@oksbi", account_id="acc_suresh_sbi", psp_handle="oksbi"),
        VpaMapping(vpa="newshop.mumbai@oksbi", account_id="acc_newshop_hdfc", psp_handle="oksbi"),
        VpaMapping(vpa="cbi.clearance.cell@sbi", account_id="acc_fake_cbi_sbi", psp_handle="sbi"),
        VpaMapping(vpa="mule.syndicate@axis", account_id="acc_mule_axis", psp_handle="axis"),
        VpaMapping(vpa="aarav@oksbi", account_id="acc_aarav_sbi", psp_handle="oksbi"),
    ]
    session.add_all(vpas)

    # 5. PSP Applications
    psps = [
        Psp(psp_id="gpay", name="Google Pay", sponsor_bank_id="SBIN"),
        Psp(psp_id="phonepe", name="PhonePe", sponsor_bank_id="YESB"),
    ]
    session.add_all(psps)

    # 6. App-Local History (GPay has history with grocer; PhonePe has NONE)
    gpay_histories = [
        AppLocalHistory(
            psp_id="gpay",
            customer_id="cust_aarav",
            payee_ref="grocer.local@oksbi",
            amount_paise=to_paise(350),
            direction=Direction.DEBIT,
            succeeded=True,
            occurred_at=now - dt.timedelta(days=20),
        ),
        AppLocalHistory(
            psp_id="gpay",
            customer_id="cust_aarav",
            payee_ref="grocer.local@oksbi",
            amount_paise=to_paise(480),
            direction=Direction.DEBIT,
            succeeded=True,
            occurred_at=now - dt.timedelta(days=7),
        ),
        AppLocalHistory(
            psp_id="gpay",
            customer_id="cust_aarav",
            payee_ref="grocer.local@oksbi",
            amount_paise=to_paise(290),
            direction=Direction.DEBIT,
            succeeded=True,
            occurred_at=now - dt.timedelta(days=2),
        ),
    ]
    session.add_all(gpay_histories)

    # Saved beneficiary in GPay
    saved_ben = SavedBeneficiary(
        psp_id="gpay",
        customer_id="cust_aarav",
        payee_ref="grocer.local@oksbi",
        nickname="Suresh Kirana",
        added_at=now - dt.timedelta(days=30),
    )
    session.add(saved_ben)

    # 7. Seed Mule Account rapid drain history (Feature #7, #18, #21)
    # Rapid inflows followed within 60 seconds by debits
    mule_entries = []
    for i in range(8):
        t_in = now - dt.timedelta(hours=24 - i * 2)
        t_out = t_in + dt.timedelta(seconds=90)  # Drained in 90 seconds!
        mule_entries.append(
            LedgerEntry(
                entry_id=f"led_mule_cr_{i}",
                account_id="acc_mule_axis",
                direction=Direction.CREDIT,
                amount_paise=to_paise(25_000),
                balance_after_paise=to_paise(25_850),
                counterparty_account_id=f"acc_victim_{i}",
                counterparty_state="Gujarat" if i % 2 == 0 else "Tamil Nadu",
                narration=f"INFLOW/VICTIM_{i}",
                posted_at=t_in,
            )
        )
        mule_entries.append(
            LedgerEntry(
                entry_id=f"led_mule_db_{i}",
                account_id="acc_mule_axis",
                direction=Direction.DEBIT,
                amount_paise=to_paise(25_000),
                balance_after_paise=to_paise(850),
                counterparty_account_id="acc_crypto_desk",
                counterparty_state="Offshore",
                narration="ATM-CASH-OUT",
                posted_at=t_out,
            )
        )
    session.add_all(mule_entries)

    # 8. Switch Metrics (Feature #1, #2)
    switch_metrics = [
        SwitchMetric(
            target_ref="grocer.local@oksbi",
            lookup_count=45,
            pay_count=42,
            distinct_psp_count=2,
            first_lookup_at=now - dt.timedelta(days=90),
            last_lookup_at=now - dt.timedelta(minutes=10),
            baseline_lookups_per_hour=0.5,
        ),
        SwitchMetric(
            target_ref="newshop.mumbai@oksbi",
            lookup_count=3,
            pay_count=1,
            distinct_psp_count=1,
            first_lookup_at=now - dt.timedelta(hours=2),
            last_lookup_at=now - dt.timedelta(minutes=5),
            baseline_lookups_per_hour=0.05,
        ),
        SwitchMetric(
            target_ref="cbi.clearance.cell@sbi",
            lookup_count=3,
            pay_count=1,
            distinct_psp_count=1,
            first_lookup_at=now - dt.timedelta(hours=1),
            last_lookup_at=now - dt.timedelta(minutes=10),
            baseline_lookups_per_hour=0.05,
        ),
        SwitchMetric(
            target_ref="mule.syndicate@axis",
            lookup_count=64,
            pay_count=4,  # 94% abandonment rate + burst
            distinct_psp_count=2,
            first_lookup_at=now - dt.timedelta(hours=1),
            last_lookup_at=now - dt.timedelta(minutes=1),
            baseline_lookups_per_hour=0.02,
        ),
    ]
    session.add_all(switch_metrics)

    # 9. Community Reputation Reports (Feature #11)
    reps = [
        ScamReport(
            report_id="rep_mule_1",
            target_ref="mule.syndicate@axis",
            reporter_identity_hash="victim_hash_01",
            reason_code="INVESTMENT_FRAUD",
            reported_at=now - dt.timedelta(days=1),
        ),
        ScamReport(
            report_id="rep_mule_2",
            target_ref="mule.syndicate@axis",
            reporter_identity_hash="victim_hash_02",
            reason_code="TASK_SCAM",
            reported_at=now - dt.timedelta(hours=14),
        ),
        ScamReport(
            report_id="rep_mule_3",
            target_ref="mule.syndicate@axis",
            reporter_identity_hash="victim_hash_03",
            reason_code="DIGITAL_ARREST",
            reported_at=now - dt.timedelta(hours=4),
        ),
        ScamReport(
            report_id="rep_mule_4",
            target_ref="mule.syndicate@axis",
            reporter_identity_hash="victim_hash_04",
            reason_code="IMPERSONATION",
            reported_at=now - dt.timedelta(hours=1),
        ),
    ]
    session.add_all(reps)
    session.add(
        ReputationScore(
            target_ref="mule.syndicate@axis",
            distinct_reporter_count=4,
            community_risk_score=0.80,
            last_updated_at=now,
        )
    )

    # 10. Conceptual Registries (Feature #22, #23)
    session.add(
        RegistryFlag(
            target_ref="mule.syndicate@axis",
            flag_type="I4C_CFCFRMS",
            reference_id="MHA-I4C-2026-98124",
            flagged_at=now - dt.timedelta(hours=6),
        )
    )
    session.add(
        RegistryFlag(
            target_ref="mule.syndicate@axis",
            flag_type="AADHAAR_PAN_FREEZE",
            reference_id="FIU-IND-STR-2026-0044",
            flagged_at=now - dt.timedelta(hours=5),
        )
    )

    # 11. Cards & Merchants
    session.add(
        Card(
            card_id="card_aarav_rupay",
            account_id="acc_aarav_sbi",
            masked_number="6071-XXXX-XXXX-3829",
            network="RUPAY",
            issuer_bank_id="SBIN",
            expiry="08/29",
        )
    )
    session.add(
        Merchant(
            merchant_id="merch_croma_retail",
            name="Croma Electronics Online",
            mcc="5732",  # Consumer Electronics
            settlement_account_id="acc_suresh_sbi",
            acquirer_bank_id="HDFC",
            onboarded_at=now - dt.timedelta(days=365),
        )
    )

    session.flush()


def init_and_seed() -> None:
    reset_db()
    with session_scope() as session:
        seed_all(session)

"""Synthetic Scenario and Transaction Generator for Kurukshetra Validation."""

from __future__ import annotations
import uuid
import random
from typing import List, Tuple, Dict
from kurukshetra.contracts import (
    TelemetryVector,
    AccountContext,
    ScamTypology,
)


class ScenarioSimulator:
    """Generates synthetic test transactions across 15 scam and benign scenarios."""

    @staticmethod
    def generate_scenario(scenario_id: int) -> Tuple[str, TelemetryVector, AccountContext, ScamTypology]:
        tx_id = f"tx_{uuid.uuid4().hex[:12]}"

        # 1. Benign Routine E-Commerce ($45)
        if scenario_id == 1:
            telemetry = TelemetryVector(active_call=False, remote_access_software_active=False)
            context = AccountContext(
                sender_account_hash="acc_benign_01",
                recipient_account_hash="merchant_amazon_us",
                amount=45.50,
                sender_balance_before_tx=3200.0,
                is_first_time_recipient=False,
                recipient_mule_cluster_score=0.01,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 2. Benign P2P Dinner Split ($28)
        elif scenario_id == 2:
            telemetry = TelemetryVector(active_call=False, remote_access_software_active=False)
            context = AccountContext(
                sender_account_hash="acc_benign_02",
                recipient_account_hash="acc_friend_bob",
                amount=28.00,
                sender_balance_before_tx=1500.0,
                is_first_time_recipient=False,
                recipient_mule_cluster_score=0.02,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 3. Benign High-Value Rent ($2,200 to established landlord)
        elif scenario_id == 3:
            telemetry = TelemetryVector(active_call=False, remote_access_software_active=False)
            context = AccountContext(
                sender_account_hash="acc_benign_03",
                recipient_account_hash="acc_landlord_corp",
                amount=2200.0,
                sender_balance_before_tx=8500.0,
                is_first_time_recipient=False,
                payee_relationship_age_hours=4320,
                recipient_mule_cluster_score=0.01,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 4. Law Enforcement Impersonation / Digital Arrest ($4,800)
        elif scenario_id == 4:
            telemetry = TelemetryVector(
                active_call=True,
                call_duration_seconds=1840,
                call_type="GSM",
                remote_access_software_active=False,
                hesitation_dwell_time_ms=1850,
                touch_pressure_deviation=0.082,
            )
            context = AccountContext(
                sender_account_hash="acc_victim_04",
                recipient_account_hash="acc_mule_police_spoof",
                amount=4800.0,
                sender_balance_before_tx=5100.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.88,
            )
            return tx_id, telemetry, context, ScamTypology.IMPERSONATION_POLICE

        # 5. Bank Fraud Dept Impersonation ($3,500)
        elif scenario_id == 5:
            telemetry = TelemetryVector(
                active_call=True,
                call_duration_seconds=920,
                call_type="VOIP",
                remote_access_software_active=False,
                hesitation_dwell_time_ms=1200,
            )
            context = AccountContext(
                sender_account_hash="acc_victim_05",
                recipient_account_hash="acc_mule_safe_reserve",
                amount=3500.0,
                sender_balance_before_tx=3800.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.74,
            )
            return tx_id, telemetry, context, ScamTypology.IMPERSONATION_BANK_SUPPORT

        # 6. Remote Access Tech Support Takeover ($1,450)
        elif scenario_id == 6:
            telemetry = TelemetryVector(
                active_call=True,
                remote_access_software_active=True,
                remote_access_package_name="AnyDesk",
                screen_sharing_active=True,
            )
            context = AccountContext(
                sender_account_hash="acc_victim_06",
                recipient_account_hash="acc_tech_support_refund",
                amount=1450.0,
                sender_balance_before_tx=2000.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.68,
            )
            return tx_id, telemetry, context, ScamTypology.REMOTE_ACCESS_TAKEOVER

        # 7. High-Yield Crypto Pig Butchering ($7,500)
        elif scenario_id == 7:
            telemetry = TelemetryVector(active_call=False, remote_access_software_active=False)
            context = AccountContext(
                sender_account_hash="acc_victim_07",
                recipient_account_hash="acc_crypto_exchange_fake",
                amount=7500.0,
                sender_balance_before_tx=8000.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.92,
            )
            return tx_id, telemetry, context, ScamTypology.INVESTMENT_CRYPTO_PIG_BUTCHERING

        # 8. Romance Grooming ($1,800)
        elif scenario_id == 8:
            telemetry = TelemetryVector(active_call=False, remote_access_software_active=False)
            context = AccountContext(
                sender_account_hash="acc_victim_08",
                recipient_account_hash="acc_romance_partner",
                amount=1800.0,
                sender_balance_before_tx=3000.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.45,
            )
            return tx_id, telemetry, context, ScamTypology.ROMANCE_GROOMING

        # 9. Advance Fee Loan Scam ($350)
        elif scenario_id == 9:
            telemetry = TelemetryVector(active_call=True, call_duration_seconds=120)
            context = AccountContext(
                sender_account_hash="acc_victim_09",
                recipient_account_hash="acc_loan_processing_fee",
                amount=350.0,
                sender_balance_before_tx=600.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.52,
            )
            return tx_id, telemetry, context, ScamTypology.ADVANCE_FEE_LOAN

        # 10. Money Mule Fast Smurfing ($6,200)
        elif scenario_id == 10:
            telemetry = TelemetryVector(active_call=False)
            context = AccountContext(
                sender_account_hash="acc_mule_smurf_01",
                recipient_account_hash="acc_mule_consolidator",
                amount=6200.0,
                sender_balance_before_tx=6500.0,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.96,
                recipient_in_degree_24h=19,
            )
            return tx_id, telemetry, context, ScamTypology.MULE_RAPID_DISPERSION

        # 11. High Uncertainty Out-of-Distribution Case (New device + Root)
        elif scenario_id == 11:
            telemetry = TelemetryVector(
                active_call=False,
                is_device_rooted=True,
                hardware_attestation_valid=False,
            )
            context = AccountContext(
                sender_account_hash="acc_novel_traveler",
                recipient_account_hash="acc_unfamiliar_merchant",
                amount=2400.0,
                sender_account_age_days=3,
                is_first_time_recipient=True,
                recipient_mule_cluster_score=0.20,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 12. Sanctions Override Test ($1,000 to blacklisted entity)
        elif scenario_id == 12:
            telemetry = TelemetryVector(active_call=False)
            context = AccountContext(
                sender_account_hash="acc_entity_12",
                recipient_account_hash="acc_sanctioned_entity_01",
                amount=1000.0,
                is_sanctioned_recipient=True,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 13. Vulnerable Senior Pension Target ($1,200)
        elif scenario_id == 13:
            telemetry = TelemetryVector(active_call=True, call_duration_seconds=600)
            context = AccountContext(
                sender_account_hash="acc_senior_grandparent",
                recipient_account_hash="acc_grandchild_emergency_spoof",
                amount=1200.0,
                sender_balance_before_tx=2500.0,
                is_first_time_recipient=True,
                customer_age=76,
                is_vulnerable_customer=True,
                recipient_mule_cluster_score=0.62,
            )
            return tx_id, telemetry, context, ScamTypology.IMPERSONATION_POLICE

        # 14. High-Volume E-Commerce Flash Sale ($150)
        elif scenario_id == 14:
            telemetry = TelemetryVector(active_call=False)
            context = AccountContext(
                sender_account_hash="acc_shopper_14",
                recipient_account_hash="merchant_target_stores",
                amount=150.0,
                sender_24h_velocity_count=4,
                is_first_time_recipient=False,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

        # 15. Urgent Travel Booking ($850)
        else:
            telemetry = TelemetryVector(active_call=False)
            context = AccountContext(
                sender_account_hash="acc_traveler_15",
                recipient_account_hash="merchant_delta_airlines",
                amount=850.0,
                is_first_time_recipient=False,
            )
            return tx_id, telemetry, context, ScamTypology.BENIGN

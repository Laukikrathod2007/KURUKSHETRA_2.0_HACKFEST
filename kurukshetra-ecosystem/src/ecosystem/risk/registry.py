"""Mock Government Registry -- Tier 2, ALWAYS labeled CONCEPTUAL.

Stands in for I4C/CFCFRMS (#23), Aadhaar/PAN regulatory freeze (#22), and
TRAI CNAP/Sanchar Saathi (#24). These are permanently tagged as CONCEPTUAL
because real integration requires government MoUs.
"""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.models import RegistryFlag
from ecosystem.risk.contracts import DetectionSignal, Severity, SignalLabel

_FEATURE_META = {
    "I4C_CFCFRMS": (23, "I4C & CFCFRMS 1930 Registry Integration"),
    "AADHAAR_PAN_FREEZE": (22, "Aadhaar & PAN Regulatory Freeze Cross-Verification"),
    "TRAI_SPAM": (24, "TRAI CNAP & Sanchar Saathi Telecom Integration"),
}


def check_registry_flags(session: Session, target_ref: str) -> list[DetectionSignal]:
    """Returns signals for government registries, strictly labeled CONCEPTUAL."""
    flags = session.execute(
        select(RegistryFlag).where(RegistryFlag.target_ref == target_ref)
    ).scalars().all()
    flagged_types = {f.flag_type for f in flags}

    signals = []
    for flag_type, (feature_id, feature_name) in _FEATURE_META.items():
        triggered = flag_type in flagged_types
        signals.append(
            DetectionSignal(
                feature_id=feature_id,
                feature_name=feature_name,
                label=SignalLabel.CONCEPTUAL,
                triggered=triggered,
                risk_contribution=0.6 if triggered else 0.0,
                severity=Severity.CRITICAL if triggered else Severity.LOW,
                evidence={
                    "flag_type": flag_type,
                    "note": "CONCEPTUAL -- requires government MoU, strictly simulated",
                },
                explanation_code=f"CONCEPTUAL_{flag_type}_MATCH"
                if triggered
                else f"CONCEPTUAL_{flag_type}_NO_MATCH",
            )
        )
    return signals

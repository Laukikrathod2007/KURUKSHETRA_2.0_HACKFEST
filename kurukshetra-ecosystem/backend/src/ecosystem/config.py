"""Ecosystem-wide configuration.

Money is handled as INTEGER PAISE everywhere internally. Floats are never
used for money -- rupee amounts only exist at the API/UI boundary, where
`to_paise` / `to_rupees` convert.
"""
from __future__ import annotations

import os
from pathlib import Path

# --- Storage ---------------------------------------------------------------
_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_ENV_FILE = _PROJECT_ROOT / ".env"
if _ENV_FILE.exists():
    try:
        for line in _ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip("'\""))
    except Exception:
        pass

DEFAULT_SQLITE = f"sqlite:///{_PROJECT_ROOT / 'ecosystem.db'}"
DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_SQLITE)

# --- Risk bands (from docs/00-fresh-base.md's risk spectrum) ---------------
ALLOW_MAX = 0.30
STEP_UP_MAX = 0.65
COACH_MAX = 0.85
# above COACH_MAX -> FREEZE

# --- Latency budget (machine verification), milliseconds -------------------
TIER0_BUDGET_MS = 10
TIER1_BUDGET_MS = 45

# --- Reputation / Sybil-resistance rules -----------------------------------
MIN_DISTINCT_REPORTERS_TO_ESCALATE = 3
REPUTATION_DECAY_HALF_LIFE_DAYS = 14

# --- Detector thresholds ---------------------------------------------------
DRIP_GROWTH_FACTOR = 2.5
SMURF_WINDOW_MINUTES = 60
SMURF_THRESHOLD_PAISE = 10_000_00
REFUND_RATIO_THRESHOLD = 500
REFUND_MAX_INBOUND_PAISE = 10_00
REFUND_WINDOW_HOURS = 2
POST_HOLD_ESCALATION_WINDOW_MINUTES = 5
HIGH_VALUE_Z_SCORE = 3.0
HIGH_VALUE_MIN_SAMPLE_SIZE = 3

ABANDON_RATIO_MIN_LOOKUPS = 10
ABANDON_RATIO_THRESHOLD = 0.85
BURST_MULTIPLIER = 50

# Core Banking Forensics Thresholds
CBS_DRAINAGE_MEDIAN_SECONDS = 300  # < 5 minutes pass-through drainage
CBS_ONE_WAY_SINK_RATIO = 10.0      # Inflow senders vs outflow beneficiaries
CBS_ONE_WAY_MIN_INBOUND = 5        # Minimum credit count for sink analysis
CBS_DORMANT_DAYS = 180             # Inactivity period for dormant account
CBS_DORMANT_MAX_BALANCE_PAISE = 50_000  # Rs 500
CBS_BURST_INFLOW_THRESHOLD_PAISE = 100_000_00  # Rs 1,00,000 burst inflow
CBS_BURST_DRAIN_RATIO = 0.9        # 90%+ drainage of burst inflow
CBS_SCAM_HOURS_RATIO = 0.95        # 95%+ concentration in business shift
CBS_SCAM_HOURS_MIN_CREDITS = 5     # Minimum sample size for shift analysis
CBS_GRAPH_MAX_AGE_DAYS = 7         # Maximum account age for mule syndicate
CBS_GRAPH_MIN_GEO_ENTROPY = 3      # Minimum distinct states for geographic entropy


def to_paise(rupees: float | int) -> int:
    """Rupees (API boundary) -> paise (internal). Rounds to the nearest paisa."""
    return int(round(float(rupees) * 100))


def to_rupees(paise: int) -> float:
    """Paise (internal) -> rupees (API boundary)."""
    return round(paise / 100, 2)


def format_inr(paise: int) -> str:
    return f"Rs {to_rupees(paise):,.2f}"

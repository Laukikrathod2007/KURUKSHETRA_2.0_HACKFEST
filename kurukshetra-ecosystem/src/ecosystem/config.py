"""Ecosystem-wide configuration.

Money is handled as INTEGER PAISE everywhere internally. Floats are never
used for money -- rupee amounts only exist at the API/UI boundary, where
`to_paise` / `to_rupees` convert.
"""
from __future__ import annotations

import os
from pathlib import Path

# --- Storage ---------------------------------------------------------------
_PROJECT_ROOT = Path(__file__).resolve().parents[2]
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

ABANDON_RATIO_MIN_LOOKUPS = 10
ABANDON_RATIO_THRESHOLD = 0.85
BURST_MULTIPLIER = 50


def to_paise(rupees: float | int) -> int:
    """Rupees (API boundary) -> paise (internal). Rounds to the nearest paisa."""
    return int(round(float(rupees) * 100))


def to_rupees(paise: int) -> float:
    """Paise (internal) -> rupees (API boundary)."""
    return round(paise / 100, 2)


def format_inr(paise: int) -> str:
    return f"Rs {to_rupees(paise):,.2f}"

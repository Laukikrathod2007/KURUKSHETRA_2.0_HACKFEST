"""Risk bands, timeouts, and other tunables.

Values mirror fresh_base.md's risk spectrum (docs/00-fresh-base.md) exactly.
Kept in one place so the scoring engine, the fallback contract, and tests all
agree on the same numbers.
"""

# Risk score -> zone boundaries
ALLOW_MAX = 0.30
STEP_UP_MAX = 0.65
COACH_MAX = 0.85
# above COACH_MAX -> FREEZE

# Latency budget (machine verification), milliseconds
TIER0_BUDGET_MS = 10
TIER1_BUDGET_MS = 45

# Reputation DB Sybil-resistance rules (docs/04-infrastructure-and-mocks.md)
MIN_DISTINCT_REPORTERS_TO_ESCALATE = 3
REPUTATION_DECAY_HALF_LIFE_DAYS = 14

DB_PATH = "kurukshetra.db"

"""Append-only, SHA-256 hash-chained immutable audit log.

Every risk decision creates an entry linked to the previous entry's cryptographic hash.
The chain can be verified live to prove regulatory compliance and non-tampering.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.models import AuditEntry

GENESIS_HASH = "0" * 64


def _canonical_json(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)


def _entry_hash(prev_hash: str, payload: dict) -> str:
    return hashlib.sha256((prev_hash + _canonical_json(payload)).encode("utf-8")).hexdigest()


def write_entry(
    session: Session,
    *,
    txn_id: str,
    decision: str,
    risk_score: float,
    evidence: dict[str, Any],
) -> AuditEntry:
    stmt = select(AuditEntry).order_by(AuditEntry.sequence_no.desc()).limit(1)
    last = session.scalars(stmt).first()
    prev_hash = last.entry_hash if last else GENESIS_HASH

    payload = {
        "txn_id": txn_id,
        "decision": decision,
        "risk_score": risk_score,
        "evidence": evidence,
    }
    entry = AuditEntry(
        txn_id=txn_id,
        prev_hash=prev_hash,
        entry_hash=_entry_hash(prev_hash, payload),
        decision=decision,
        risk_score=risk_score,
        evidence_json=_canonical_json(evidence),
        written_at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
    )
    session.add(entry)
    session.flush()
    return entry


def verify_chain(session: Session) -> tuple[bool, str | None]:
    """Re-walk every audit row and confirm the hash chain is unbroken."""
    prev_hash = GENESIS_HASH
    stmt = select(AuditEntry).order_by(AuditEntry.sequence_no.asc())
    rows = list(session.scalars(stmt).all())
    for row in rows:
        payload = {
            "txn_id": row.txn_id,
            "decision": row.decision,
            "risk_score": row.risk_score,
            "evidence": json.loads(row.evidence_json),
        }
        expected = _entry_hash(prev_hash, payload)
        if expected != row.entry_hash or row.prev_hash != prev_hash:
            return False, row.txn_id
        prev_hash = row.entry_hash
    return True, None

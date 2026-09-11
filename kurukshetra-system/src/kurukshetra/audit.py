"""Append-only, hash-chained audit log.

The lightweight WORM (write-once-read-many) trail described in
docs/04-infrastructure-and-mocks.md and docs/08-observability.md. Every write
chains to the previous entry's hash; `verify_chain` re-walks the whole table
and can be run live in a demo to prove the trail hasn't been tampered with.
"""
from __future__ import annotations

import hashlib
import json

from sqlalchemy.orm import Session

from kurukshetra.models import AuditEntry

GENESIS_HASH = "0" * 64


def _canonical_json(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)


def _entry_hash(prev_hash: str, payload: dict) -> str:
    return hashlib.sha256((prev_hash + _canonical_json(payload)).encode("utf-8")).hexdigest()


def write_entry(
    session: Session,
    *,
    transaction_id: str,
    decision: str,
    risk_score: float,
    evidence: dict,
) -> AuditEntry:
    last = session.query(AuditEntry).order_by(AuditEntry.sequence_no.desc()).first()
    prev_hash = last.entry_hash if last else GENESIS_HASH

    payload = {
        "transaction_id": transaction_id,
        "decision": decision,
        "risk_score": risk_score,
        "evidence": evidence,
    }
    entry = AuditEntry(
        transaction_id=transaction_id,
        prev_hash=prev_hash,
        entry_hash=_entry_hash(prev_hash, payload),
        decision=decision,
        risk_score=risk_score,
        evidence_json=_canonical_json(evidence),
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


def verify_chain(session: Session) -> tuple[bool, str | None]:
    """Re-walk every audit row and confirm the hash chain is unbroken.

    Returns (ok, first_broken_transaction_id_or_None).
    """
    prev_hash = GENESIS_HASH
    rows = session.query(AuditEntry).order_by(AuditEntry.sequence_no.asc()).all()
    for row in rows:
        payload = {
            "transaction_id": row.transaction_id,
            "decision": row.decision,
            "risk_score": row.risk_score,
            "evidence": json.loads(row.evidence_json),
        }
        expected = _entry_hash(prev_hash, payload)
        if expected != row.entry_hash or row.prev_hash != prev_hash:
            return False, row.transaction_id
        prev_hash = row.entry_hash
    return True, None

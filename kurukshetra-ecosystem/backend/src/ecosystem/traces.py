"""Observability and transaction journey tracing.

Every component in the payment ecosystem records its events here.
This powers the live miniature ecosystem SOC observer, showing the exact
hop-by-hop journey of money, data, and risk decisions.
"""
from __future__ import annotations

import datetime as dt
import json
import time
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ecosystem.models import TraceEvent


class TraceRecorder:
    def __init__(self, trace_id: str, session: Session):
        self.trace_id = trace_id
        self.session = session
        self.start_time = time.perf_counter()
        self._seq = 0

    def emit(
        self,
        *,
        component: str,
        action: str,
        summary: str,
        txn_id: Optional[str] = None,
        detail: Optional[dict[str, Any]] = None,
    ) -> TraceEvent:
        self._seq += 1
        elapsed_ms = round((time.perf_counter() - self.start_time) * 1000, 2)
        event = TraceEvent(
            trace_id=self.trace_id,
            txn_id=txn_id,
            seq=self._seq,
            component=component,
            action=action,
            summary=summary,
            detail_json=json.dumps(detail or {}, default=str),
            elapsed_ms=elapsed_ms,
            at=dt.datetime.now(dt.UTC).replace(tzinfo=None),
        )
        self.session.add(event)
        self.session.flush()
        return event


def get_trace_events(session: Session, trace_id: str) -> list[dict[str, Any]]:
    stmt = (
        select(TraceEvent)
        .where(TraceEvent.trace_id == trace_id)
        .order_by(TraceEvent.seq.asc())
    )
    events = session.scalars(stmt).all()
    results = []
    for ev in events:
        try:
            detail = json.loads(ev.detail_json)
        except Exception:
            detail = {}
        results.append(
            {
                "event_id": ev.event_id,
                "trace_id": ev.trace_id,
                "txn_id": ev.txn_id,
                "seq": ev.seq,
                "component": ev.component,
                "action": ev.action,
                "summary": ev.summary,
                "detail": detail,
                "elapsed_ms": ev.elapsed_ms,
                "at": ev.at.isoformat() if ev.at else None,
            }
        )
    return results


def get_recent_traces(session: Session, limit: int = 20) -> list[dict[str, Any]]:
    stmt = (
        select(TraceEvent)
        .order_by(TraceEvent.event_id.desc())
        .limit(limit * 5)
    )
    events = session.scalars(stmt).all()
    seen_traces = {}
    for ev in events:
        if ev.trace_id not in seen_traces:
            seen_traces[ev.trace_id] = {
                "trace_id": ev.trace_id,
                "txn_id": ev.txn_id,
                "last_component": ev.component,
                "last_action": ev.action,
                "last_summary": ev.summary,
                "at": ev.at.isoformat() if ev.at else None,
            }
        if len(seen_traces) >= limit:
            break
    return list(seen_traces.values())

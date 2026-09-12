"""In-process live event fan-out for the external registry visualization.

Mirrors traces.py's role for the SOC observer: every risk-engine evaluation
and every registry-mutating action (kill-switch, campaign flags) publishes
a normalized event here. SSE subscribers each get their own asyncio.Queue;
publishing is synchronous and non-blocking (queues are unbounded but pruned
by the ring buffer, so a slow/gone subscriber never backs up the engine).
"""
from __future__ import annotations

import asyncio
import datetime as dt
import json
import uuid
from collections import deque
from typing import Any

_MAX_HISTORY = 200
_history: deque[dict[str, Any]] = deque(maxlen=_MAX_HISTORY)
_subscribers: set[asyncio.Queue] = set()


def publish(event: dict[str, Any]) -> dict[str, Any]:
    """Publishes one registry/decision event to all live SSE subscribers.

    Safe to call from synchronous code (risk engine, switch) with no running
    event loop -- in that case the event is still recorded in history for any
    subscriber that connects afterwards, it just isn't pushed live.
    """
    event = {
        "event_id": f"evt_{uuid.uuid4().hex[:12]}",
        "timestamp": dt.datetime.now(dt.UTC).replace(tzinfo=None).isoformat(),
        **event,
    }
    _history.append(event)
    for q in list(_subscribers):
        try:
            q.put_nowait(event)
        except Exception:
            continue
    return event


def recent(limit: int = 50) -> list[dict[str, Any]]:
    return list(_history)[-limit:]


async def subscribe() -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.add(q)
    return q


def unsubscribe(q: asyncio.Queue) -> None:
    _subscribers.discard(q)


async def stream() -> Any:
    """Async generator yielding SSE-formatted lines for one subscriber."""
    q = await subscribe()
    try:
        for ev in recent(20):
            yield f"data: {json.dumps(ev, default=str)}\n\n"
        while True:
            ev = await q.get()
            yield f"data: {json.dumps(ev, default=str)}\n\n"
    finally:
        unsubscribe(q)

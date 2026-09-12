"""Database engine + session management for the whole ecosystem.

One store backs every simulated participant (banks, NPCI, PSPs, risk engine,
traces) with tables namespaced by owner. In the real world each of these is a
different institution's private database -- the ownership boundaries are
documented per-table in models.py and respected in code: e.g. the PSP layer
only ever reads its own app-local history tables, never another PSP's.
"""
from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from ecosystem.config import DATABASE_URL

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
ENGINE = create_engine(DATABASE_URL, echo=False, future=True, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=ENGINE, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


@contextmanager
def session_scope() -> Iterator[Session]:
    """Transactional scope. Commits on success, rolls back on exception --
    which is what keeps a failed payment from leaving half a ledger behind."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db() -> None:
    import ecosystem.models  # noqa: F401 -- registers all tables on Base

    Base.metadata.create_all(ENGINE)


def reset_db() -> None:
    """Drop and recreate everything -- used by the seed script and tests."""
    import ecosystem.models  # noqa: F401

    Base.metadata.drop_all(ENGINE)
    Base.metadata.create_all(ENGINE)

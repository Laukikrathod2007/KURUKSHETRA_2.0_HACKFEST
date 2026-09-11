"""SQLAlchemy engine/session setup.

One relational database backs every mock service in the hackathon build
(Local Ledger, Reputation, Mock CBS, Mock Registry, Audit) -- they are
namespaced as separate tables, matching the schemas in
docs/04-infrastructure-and-mocks.md. In production each of these would be
its own service with its own store; the seam is the DB connection string,
not the table layout.

Set DATABASE_URL to point at a managed Postgres instance (Railway/Neon/
Supabase all work unchanged -- e.g. postgresql+psycopg://user:pass@host/db).
Falls back to a local SQLite file for offline dev.
"""
from __future__ import annotations

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from kurukshetra.config import DB_PATH

_DEFAULT_SQLITE_PATH = Path(__file__).resolve().parents[2] / DB_PATH
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{_DEFAULT_SQLITE_PATH}")

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
ENGINE = create_engine(DATABASE_URL, echo=False, future=True, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=ENGINE, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db() -> None:
    import kurukshetra.models  # noqa: F401 -- registers tables on Base

    Base.metadata.create_all(ENGINE)

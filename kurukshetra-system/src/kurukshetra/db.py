"""SQLAlchemy engine/session setup.

One SQLite file backs every mock service in the hackathon build (Local
Ledger, Reputation, Mock CBS, Mock Registry, Audit) -- they are namespaced as
separate tables, matching the schemas in docs/04-infrastructure-and-mocks.md.
In production each of these would be its own service with its own store; the
seam is the DB connection string, not the table layout.
"""
from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from kurukshetra.config import DB_PATH

DB_FILE = Path(__file__).resolve().parents[2] / DB_PATH
ENGINE = create_engine(f"sqlite:///{DB_FILE}", echo=False, future=True)
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

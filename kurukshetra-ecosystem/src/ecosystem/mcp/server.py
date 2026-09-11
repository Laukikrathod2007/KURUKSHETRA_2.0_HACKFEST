"""Standalone FastMCP server for Kurukshetra intervention tools.

Exposes tools for explanation generation, coaching UI screens, trusted contact
notifications, and helpline lookups.
"""
from __future__ import annotations

from fastmcp import FastMCP

from ecosystem.db import SessionLocal
from ecosystem.mcp import tools

mcp = FastMCP("Kurukshetra Intervention Server")


@mcp.tool()
def explain_decision(reasons: list[str]) -> str:
    """Turn a list of fired reason codes into a transparent, plain-English explanation."""
    return tools.explain_decision(reasons)


@mcp.tool()
def select_intervention_template(risk_zone: str, reasons: list[str]) -> str:
    """Select the appropriate Category H cognitive intervention screen."""
    return tools.select_intervention_template(risk_zone, reasons)


@mcp.tool()
def notify_trusted_contact(customer_id: str, txn_id: str, amount_paise: int | None = None) -> dict:
    """Notify pre-designated trusted family or emergency contact regarding blocked transaction."""
    session = SessionLocal()
    try:
        res = tools.notify_trusted_contact(session, customer_id=customer_id, txn_id=txn_id, amount_paise=amount_paise)
        session.commit()
        return res
    finally:
        session.close()


@mcp.tool()
def log_intervention_outcome(txn_id: str, template_id: str, user_action: str) -> str:
    """Log whether user acknowledged or aborted after being shown an intervention."""
    session = SessionLocal()
    try:
        out_id = tools.log_intervention_outcome(session, txn_id=txn_id, template_id=template_id, user_action=user_action)
        session.commit()
        return out_id
    finally:
        session.close()


@mcp.tool()
def check_helpline_directory(bank_id: str) -> str:
    """Lookup official 24x7 customer support or cyber helpline numbers."""
    return tools.check_helpline_directory(bank_id)


if __name__ == "__main__":
    mcp.run()

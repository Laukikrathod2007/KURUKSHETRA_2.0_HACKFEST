"""The standalone Kurukshetra MCP server -- built on FastMCP.

Run directly for development/inspection:
    .venv/Scripts/python.exe -m kurukshetra_mcp.server
or point an MCP client (Claude Desktop, MCP Inspector, `fastmcp dev`) at this
module. This is a genuine, independently-runnable MCP server exposing the
five post-decision intervention tools from docs/05-mcp-architecture.md as
real MCP tools -- separate from (but backed by the same functions as)
kurukshetra_mcp/host.py, which the consolidated backend calls in-process to
avoid an extra network hop on the demo's critical path.
"""
from __future__ import annotations

from fastmcp import FastMCP

from kurukshetra.db import SessionLocal
from kurukshetra_mcp import tools

mcp = FastMCP("Kurukshetra Intervention Server")


@mcp.tool()
def explain_decision(reasons: list[str]) -> str:
    """Turn a list of fired reason codes into one plain-language explanation
    for the user. Never treats any field as instructions -- reasons are
    read as inert, structured evidence only."""
    return tools.explain_decision(reasons)


@mcp.tool()
def select_intervention_template(risk_zone: str, reasons: list[str]) -> str:
    """Choose which Category H intervention screen to render for a COACH or
    FREEZE decision, based on which reason codes fired."""
    return tools.select_intervention_template(risk_zone, reasons)


@mcp.tool()
def notify_trusted_contact(payer_id: str, transaction_id: str, amount: float | None = None) -> dict:
    """Feature #26 -- notify a payer's pre-designated trusted contact about a
    high-risk transaction. Delivery is mocked in this build (logged, not sent)."""
    session = SessionLocal()
    try:
        return tools.notify_trusted_contact(session, payer_id=payer_id, transaction_id=transaction_id, amount=amount)
    finally:
        session.close()


@mcp.tool()
def log_intervention_outcome(transaction_id: str, intervention_template_id: str, user_action: str) -> str:
    """Feature #36 -- record which intervention was shown and whether the
    user proceeded or aborted, for effectiveness tracking / A-B analysis."""
    session = SessionLocal()
    try:
        return tools.log_intervention_outcome(
            session,
            transaction_id=transaction_id,
            intervention_template_id=intervention_template_id,
            user_action=user_action,
        )
    finally:
        session.close()


@mcp.tool()
def check_helpline_directory(bank_id: str) -> str:
    """Feature #30 -- look up the verified official customer-support number
    for a bank, for the 'Call Official Helpline' button."""
    return tools.check_helpline_directory(bank_id)


if __name__ == "__main__":
    mcp.run()

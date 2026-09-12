"""
Agentic Guardian MCP Server
Model Context Protocol (MCP) interface for Real-Time Payment Scam Interception.
Exposes security tools to AI payment copilots, browser agents, and GPay/PhonePe interceptors.
"""

import asyncio
import json
import sys
from typing import Any, Dict, List

# Ensure current module is in path
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from guardian import (
    evaluate_payment,
    analyze_problem,
    ask_aria,
    launch_incident_video_guardian,
    emergency_call,
    PaymentRequest,
    ProblemUploadRequest
)

# Standard MCP Tool Definitions
MCP_TOOLS = [
    {
        "name": "intercept_payment",
        "description": "Evaluates an active payment intent (e.g. from GPay, PhonePe, or UPI checkout) for scam risk, psychological coercion, and mule account patterns. Returns risk score (0-100) and action (ALLOW, VERIFY, PAUSE, BLOCK).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "transaction_id": {"type": "string", "description": "Unique transaction ID"},
                "user_id": {"type": "string", "description": "Sender user ID"},
                "user_name": {"type": "string", "description": "Name of the sender"},
                "user_phone": {"type": "string", "description": "Sender phone number for emergency voice alerts"},
                "amount": {"type": "number", "description": "Payment amount in INR"},
                "recipient_id": {"type": "string", "description": "Recipient UPI VPA or account handle"},
                "recipient_name": {"type": "string", "description": "Name of recipient"},
                "payment_note": {"type": "string", "description": "Transaction remarks or description note"}
            },
            "required": ["transaction_id", "amount", "recipient_id", "recipient_name"]
        }
    },
    {
        "name": "launch_video_guardian",
        "description": "Launches Aria, the TruGen AI live interactive video avatar, pre-loaded with the exact transaction incident context and anti-scam guardrails. Returns the video session URL.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "transaction_id": {"type": "string", "description": "Transaction ID of the paused payment"}
            },
            "required": ["transaction_id"]
        }
    },
    {
        "name": "dispatch_emergency_call",
        "description": "Initiates an emergency outbound telephone call via Vapi AI to the user's phone to break ongoing scammer coaching in real time.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "transaction_id": {"type": "string", "description": "Transaction ID of the suspicious payment"},
                "phone_number": {"type": "string", "description": "Target phone number to dial"}
            },
            "required": ["transaction_id"]
        }
    },
    {
        "name": "analyze_scam_upload",
        "description": "Analyzes an uploaded problem (e.g. suspicious SMS, WhatsApp message, Telegram task job, or electricity cut notice) and returns threat classification plus TruGen video avatar embed URL.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_text": {"type": "string", "description": "Raw text or OCR of the suspicious message/notice"},
                "user_name": {"type": "string", "description": "User's name"},
                "source_channel": {"type": "string", "description": "whatsapp, sms, telegram, email, or phone"}
            },
            "required": ["problem_text"]
        }
    }
]

# In-memory store for active session dossiers
_ACTIVE_SESSIONS: Dict[str, Any] = {}

async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "intercept_payment":
        payment_req = PaymentRequest(**arguments)
        dossier = evaluate_payment(payment_req)
        _ACTIVE_SESSIONS[dossier.transaction_id] = dossier
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({
                        "transaction_id": dossier.transaction_id,
                        "risk_score": dossier.composite_risk_score,
                        "risk_level": dossier.risk_level.value,
                        "recommended_action": dossier.recommended_action.value,
                        "scam_types": dossier.detected_scam_types,
                        "anomaly_summary": dossier.anomaly_summary,
                        "requires_guardian_intervention": dossier.composite_risk_score >= 40.0
                    }, indent=2)
                }
            ]
        }

    elif name == "launch_video_guardian":
        txn_id = arguments["transaction_id"]
        dossier = _ACTIVE_SESSIONS.get(txn_id)
        if not dossier:
            return {"isError": True, "content": [{"type": "text", "text": f"No active dossier found for transaction {txn_id}"}]}
        
        session = await ask_aria(dossier)
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({
                        "status": "video_session_ready",
                        "session_id": session.session_id,
                        "video_embed_url": session.conversation_url,
                        "instructions": "Render this URL inside an iframe or modal on GPay/checkout interface."
                    }, indent=2)
                }
            ]
        }

    elif name == "dispatch_emergency_call":
        txn_id = arguments["transaction_id"]
        phone = arguments.get("phone_number")
        dossier = _ACTIVE_SESSIONS.get(txn_id)
        if not dossier:
            return {"isError": True, "content": [{"type": "text", "text": f"No active dossier found for transaction {txn_id}"}]}
        
        call_res = await emergency_call(dossier, phone_number=phone)
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({
                        "status": "call_dispatched",
                        "call_id": call_res.call_id,
                        "target_phone": call_res.phone_number,
                        "provider": "vapi"
                    }, indent=2)
                }
            ]
        }

    elif name == "analyze_scam_upload":
        req = ProblemUploadRequest(**arguments)
        analysis = analyze_problem(req)
        video_session = await launch_incident_video_guardian(analysis)
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({
                        "incident_id": analysis.incident_id,
                        "scam_category": analysis.scam_category,
                        "risk_score": analysis.risk_score,
                        "impersonated_entity": analysis.impersonated_entity,
                        "demanded_amount": analysis.demanded_amount,
                        "immediate_guidance": analysis.immediate_guidance,
                        "aria_greeting": analysis.aria_first_message,
                        "trugen_video_url": video_session.conversation_url
                    }, indent=2)
                }
            ]
        }

    else:
        return {"isError": True, "content": [{"type": "text", "text": f"Unknown tool: {name}"}]}

async def main():
    """Simple stdio-based MCP JSON-RPC server loop."""
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await asyncio.get_running_loop().connect_read_pipe(lambda: protocol, sys.stdin)
    
    while True:
        line = await reader.readline()
        if not line:
            break
        try:
            req = json.loads(line.decode("utf-8"))
            req_id = req.get("id")
            method = req.get("method")

            if method == "tools/list":
                res = {"jsonrpc": "2.0", "id": req_id, "result": {"tools": MCP_TOOLS}}
            elif method == "tools/call":
                params = req.get("params", {})
                tool_name = params.get("name")
                tool_args = params.get("arguments", {})
                result = await handle_call_tool(tool_name, tool_args)
                res = {"jsonrpc": "2.0", "id": req_id, "result": result}
            elif method == "initialize":
                res = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "serverInfo": {"name": "agentic-guardian-mcp", "version": "1.0.0"},
                        "capabilities": {"tools": {}}
                    }
                }
            else:
                res = {"jsonrpc": "2.0", "id": req_id, "result": {}}

            sys.stdout.write(json.dumps(res) + "\n")
            sys.stdout.flush()
        except Exception as e:
            err_res = {"jsonrpc": "2.0", "id": None, "error": {"code": -32603, "message": str(e)}}
            sys.stdout.write(json.dumps(err_res) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    asyncio.run(main())

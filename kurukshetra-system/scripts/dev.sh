#!/usr/bin/env bash
# Launches the risk engine + mock NPCI switch + mock PSP app for local dev/demo.
# Run from kurukshetra-system/: bash scripts/dev.sh
set -e
cd "$(dirname "$0")/.."
export PYTHONPATH=src

./.venv/Scripts/python.exe -m kurukshetra.seed

./.venv/Scripts/python.exe -m uvicorn kurukshetra.engine_api:app --port 8000 --log-level info &
./.venv/Scripts/python.exe -m uvicorn services.mock_npci_switch:app --port 8001 --log-level info &
./.venv/Scripts/python.exe -m uvicorn services.mock_psp_app:app --port 8002 --log-level info &

echo "Risk engine:      http://127.0.0.1:8000"
echo "Mock NPCI switch: http://127.0.0.1:8001"
echo "Mock PSP app:     http://127.0.0.1:8002"
echo "Ctrl-C to stop all three."
wait

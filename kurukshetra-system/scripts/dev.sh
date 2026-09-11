#!/usr/bin/env bash
# Launches the consolidated Kurukshetra backend (engine + mock switch + mock PSP app)
# for local dev/demo. Run from kurukshetra-system/: bash scripts/dev.sh
set -e
cd "$(dirname "$0")/.."
export PYTHONPATH=src

./.venv/Scripts/python.exe -m kurukshetra.seed
./.venv/Scripts/python.exe -m uvicorn main:app --port 8000 --reload

#!/usr/bin/env bash
set -euo pipefail

start_if_needed() {
  local pid_file="$1"
  shift
  if [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
    return
  fi
  "$@"
}

start_if_needed /tmp/pythonpro-backend.pid bash -c \
  'cd backend && nohup python run.py >/tmp/pythonpro-backend.log 2>&1 & echo $! >/tmp/pythonpro-backend.pid'

start_if_needed /tmp/pythonpro-frontend.pid bash -c \
  'cd frontend && VITE_USE_API=true nohup pnpm dev --host 0.0.0.0 >/tmp/pythonpro-frontend.log 2>&1 & echo $! >/tmp/pythonpro-frontend.pid'

echo "PythonPro services are starting."
echo "Frontend log: /tmp/pythonpro-frontend.log"
echo "Backend log:  /tmp/pythonpro-backend.log"

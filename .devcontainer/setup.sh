#!/usr/bin/env bash
set -euo pipefail

python -m pip install --disable-pip-version-check -r backend/requirements.txt
corepack enable
pnpm --dir frontend install --frozen-lockfile

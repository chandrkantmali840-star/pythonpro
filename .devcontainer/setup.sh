#!/usr/bin/env bash
set -euo pipefail

python -m pip install --disable-pip-version-check -r backend/requirements.txt
corepack enable
corepack install --global pnpm@11.19.0
pnpm --dir frontend install --frozen-lockfile

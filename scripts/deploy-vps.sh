#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="${APP_NAME:-dailyhotapi-rww}"

echo "[deploy] project_dir=${PROJECT_DIR}"

cd "${PROJECT_DIR}"

echo "[deploy] fetch latest code"
git fetch origin
git checkout master
git pull --ff-only origin master

echo "[deploy] install dependencies"
pnpm install --frozen-lockfile

echo "[deploy] build project"
pnpm build

echo "[deploy] done"
echo "[deploy] if you use command-line PM2, run:"
echo "pm2 reload ecosystem.server.cjs --only ${APP_NAME} || pm2 start ecosystem.server.cjs --only ${APP_NAME}"
echo "[deploy] if you use 宝塔 PM2项目, go to the panel and restart the project."

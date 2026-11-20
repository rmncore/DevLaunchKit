#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
: "${TEST_DATABASE_URL:?Set TEST_DATABASE_URL to a disposable PostgreSQL database}"
case "$TEST_DATABASE_URL" in
  */launchkit_e2e|*/launchkit_e2e\?*) ;;
  *) echo "Use a disposable database named launchkit_e2e." >&2; exit 1 ;;
esac

export DATABASE_URL="$TEST_DATABASE_URL"
export AUTH_BASE_URL=http://127.0.0.1:3100
export AUTH_SECRET_KEY="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("hex"))')"
export AUTH_PROVISION_PASSWORD="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))')"
export E2E_ADMIN="admin-$(date +%s)-$RANDOM@example.test"
export E2E_MEMBER="member-$(date +%s)-$RANDOM@example.test"
export NEXT_TELEMETRY_DISABLED=1

pnpm build --filter=@devlaunchkit/web
pnpm --filter @devlaunchkit/database db:migrate
pnpm --filter @devlaunchkit/database exec tsx ../../tests/e2e/seed-check.ts
pnpm --filter @devlaunchkit/web auth:provision "$E2E_ADMIN" "Test Administrator" admin
pnpm --filter @devlaunchkit/web auth:provision "$E2E_MEMBER" "Test Member"
mkdir -p apps/web/.next/standalone/apps/web/.next/static
cp -a apps/web/.next/static/. apps/web/.next/standalone/apps/web/.next/static/
pnpm exec playwright test

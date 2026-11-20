# Quick Start Guide

Launch your production-ready SaaS application framework locally in under ten minutes.

---

## Purpose

This document provides a fast-track sequence for developers who want to initialize and start interacting with DevLaunchKit instantly.

## Prerequisites

Use Node.js 20 or newer and pnpm 9.15.0. Docker is optional for the component demos, and can provide PostgreSQL for database-backed development.

## Start the component demos

From the repository root, install dependencies and start the web app:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:3000** and select **Workspace** to explore the dashboard. To try the admin console with sample records, start development with `DEVLAUNCHKIT_ADMIN_DEMO=true pnpm dev` and select **Admin Center** in the workspace sidebar. Use this mode on a private development instance.

## Run with PostgreSQL

Start the development database, then apply the checked-in migrations:

```bash
docker compose up -d --wait db
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/launchkit
pnpm --filter @devlaunchkit/database db:migrate
pnpm dev
```

For sample rows, run `pnpm --filter @devlaunchkit/database db:seed` before starting the app. Follow [Enable email sign-in](#enable-email-sign-in) to provision an administrator for the database-backed console.

To run both PostgreSQL and the web app in containers, use `docker compose up --build`. Apply migrations from the host using the same database URL above.

If your Docker build uses an HTTPS proxy with a custom CA, forward the proxy settings and pass the CA bundle as a BuildKit secret. The Dockerfiles use that bundle during dependency installation.

```bash
docker build --build-arg HTTP_PROXY --build-arg HTTPS_PROXY \
  --secret id=registry_ca,src="$NODE_EXTRA_CA_CERTS" \
  -f Dockerfile.dev -t devlaunchkit-web .
```

---

## Scaffold a standalone app

From this repository, build the CLI, then invoke it from the directory where you want the new app created:

```bash
pnpm build --filter=@devlaunchkit/cli
node packages/cli/bin/cli.js create my-new-saas
cd my-new-saas
pnpm install
pnpm dev
```

## Troubleshooting

- If port 5432 is occupied, use your existing development database and export its connection URL before running migrations or starting the app.
- If you update a workspace package, restart the development command to rebuild its compiled output.
- Run `pnpm doctor` to inspect local environment and database settings.

## Enable email sign-in

Set `DATABASE_URL`, `AUTH_BASE_URL` (the app's public origin, or `http://localhost:3000` for local development), and a random `AUTH_SECRET_KEY` of at least 32 characters. Use HTTPS for the production origin. Apply the database migrations before enabling authentication.

Web registration is disabled. An operator supplies the initial password through the `AUTH_PROVISION_PASSWORD` environment variable and provisions the account from a trusted shell:

```bash
pnpm --filter @devlaunchkit/database build
pnpm --filter @devlaunchkit/web auth:provision admin@example.com "Workspace Admin" admin
```

Open `/sign-in`. New accounts default to the user role. The provisioning command preserves the role of an existing profile. The maintenance switch in Platform Settings pauses the public overview and workspace during service work. Sign-in and the admin console remain accessible.

## Run browser checks

Install Playwright Chromium with `pnpm exec playwright install chromium`. Point `TEST_DATABASE_URL` at a disposable PostgreSQL database named `launchkit_e2e`, then run `pnpm test:e2e`. The runner applies migrations and creates its own test accounts.

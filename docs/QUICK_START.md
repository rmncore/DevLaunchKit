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

For a fresh development database that needs sample rows, run `pnpm --filter @devlaunchkit/database db:seed` before starting the app. Seed data does not create an administrator sign-in session. Connect your authentication provider to use the admin console with real records.

To run both PostgreSQL and the web app in containers, use `docker compose up --build`. Apply migrations from the host using the same database URL above.

If your Docker build uses an HTTPS proxy with a custom CA, forward the proxy settings and pass the CA bundle as a BuildKit secret. The Dockerfiles use that bundle during dependency installation.

```bash
docker build --build-arg HTTP_PROXY --build-arg HTTPS_PROXY \
  --secret id=registry_ca,src="$NODE_EXTRA_CA_CERTS" \
  -f Dockerfile.dev -t devlaunchkit-web .
```

---

## Example Quick Scaffolding

To scaffold a new workspace sub-project using our official CLI, run:

```bash
pnpm --filter @devlaunchkit/cli devlaunchkit create my-new-saas
```

---

## Screenshots Placeholder

![Command Line Run & App Launch](/assets/authentication.png)
_Initial authentication screen visible after local boot._

---

## Troubleshooting

- If port 5432 is occupied, use your existing development database and export its connection URL before running migrations or starting the app.
- If you update a workspace package, restart the development command to rebuild its compiled output.
- Run `pnpm doctor` to inspect local environment and database settings.

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3100",
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node apps/web/.next/standalone/apps/web/server.js",
    url: "http://127.0.0.1:3100/sign-in",
    env: { HOSTNAME: "127.0.0.1", PORT: "3100" },
    timeout: 60_000,
  },
});

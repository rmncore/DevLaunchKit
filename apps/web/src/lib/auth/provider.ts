import {
  authAccounts,
  authSessions,
  authUsers,
  authVerifications,
  db,
} from "@devlaunchkit/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export function createAuth(allowProvisioning = false) {
  const baseURL = process.env.AUTH_BASE_URL;
  const secret = process.env.AUTH_SECRET_KEY;

  if (!process.env.DATABASE_URL || !baseURL || !secret || secret.length < 32) return null;

  return betterAuth({
    baseURL,
    secret,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: authUsers,
        session: authSessions,
        account: authAccounts,
        verification: authVerifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowProvisioning,
      autoSignIn: false,
      minPasswordLength: 12,
    },
    user: { changeEmail: { enabled: false } },
    plugins: allowProvisioning ? [] : [nextCookies()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  if (auth === undefined) auth = createAuth();
  return auth;
}

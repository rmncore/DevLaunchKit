import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, profiles, sessions } from "@devlaunchkit/database";
import { eq } from "drizzle-orm";
import { getAuth } from "./provider";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatarUrl: string | null;
}

export interface AdminSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface AuthContext {
  isAuthenticated: boolean;
  user: AdminUser | null;
  session: AdminSession | null;
}

export function isDatabaseMockMode(): boolean {
  return process.env.NODE_ENV === "development" && process.env.DEVLAUNCHKIT_ADMIN_DEMO === "true";
}

export const DEMO_ADMIN_SESSION = "tok_mock_admin";

// Get standard mock admin user
export const MOCK_ADMIN_USER: AdminUser = {
  id: "u_admin",
  email: "admin@devlaunchkit.com",
  name: "Super Administrator",
  role: "admin",
  status: "active",
  avatarUrl: "https://avatar.vercel.sh/admin",
};

// Get the current session context
export async function getSessionContext(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("auth_session")?.value;

  const signedOut = { isAuthenticated: false, user: null, session: null };

  if (isDatabaseMockMode()) {
    if (sessionToken !== DEMO_ADMIN_SESSION) {
      return signedOut;
    }

    return {
      isAuthenticated: true,
      user: MOCK_ADMIN_USER,
      session: {
        id: "sess_mock_admin",
        token: DEMO_ADMIN_SESSION,
        userId: MOCK_ADMIN_USER.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    };
  }

  try {
    const auth = getAuth();
    const identity = auth && (await auth.api.getSession({ headers: await headers() }));
    if (identity) {
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, identity.user.email))
        .limit(1);
      if (!profile || profile.deletedAt) return signedOut;
      return {
        isAuthenticated: true,
        user: { ...profile, name: profile.name || identity.user.name },
        session: {
          id: identity.session.id,
          token: identity.session.token,
          userId: profile.id,
          expiresAt: identity.session.expiresAt,
        },
      };
    }
    if (!sessionToken) return signedOut;
    const results = await db
      .select({
        session: sessions,
        profile: profiles,
      })
      .from(sessions)
      .innerJoin(profiles, eq(sessions.profileId, profiles.id))
      .where(eq(sessions.token, sessionToken))
      .limit(1);

    const match = results[0];
    if (!match || match.profile.deletedAt) {
      return signedOut;
    }

    // Check expiry
    if (match.session.expiresAt.getTime() <= Date.now()) {
      // Clean up expired session asynchronously
      db.delete(sessions)
        .where(eq(sessions.id, match.session.id))
        .catch(() => {});
      return signedOut;
    }

    return {
      isAuthenticated: true,
      user: {
        id: match.profile.id,
        email: match.profile.email,
        name: match.profile.name || "User",
        role: match.profile.role,
        status: match.profile.status,
        avatarUrl: match.profile.avatarUrl,
      },
      session: {
        id: match.session.id,
        token: match.session.token,
        userId: match.session.profileId,
        expiresAt: match.session.expiresAt,
      },
    };
  } catch {
    console.error("Failed to fetch session context.");
    return signedOut;
  }
}

// Check permissions for server-rendered pages and actions.
export async function requireAdmin(): Promise<AdminUser> {
  const context = await getSessionContext();

  if (!context.isAuthenticated || !context.user) {
    throw new Error("UNAUTHORIZED");
  }

  if (
    context.user.role !== "admin" &&
    context.user.role !== "super_admin" &&
    context.user.role !== "owner"
  ) {
    throw new Error("FORBIDDEN");
  }

  if (context.user.status === "suspended" || context.user.status === "banned") {
    throw new Error("SUSPENDED");
  }

  return context.user;
}

export async function requireAdminPage(): Promise<AdminUser> {
  return requireAdmin().catch(() =>
    redirect(isDatabaseMockMode() ? "/dashboard/admin" : "/sign-in")
  );
}

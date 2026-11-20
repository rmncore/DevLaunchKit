import { cookies } from "next/headers";
import { db, profiles, sessions } from "@devlaunchkit/database";
import { eq } from "drizzle-orm";

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

  if (!sessionToken) {
    return signedOut;
  }

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
  } catch (error) {
    console.error("Failed to fetch session context:", error);
    return signedOut;
  }
}

// Middleware or route guard requiring admin access
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

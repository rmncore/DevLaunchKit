"use server";

import { DEMO_ADMIN_SESSION, requireAdmin, isDatabaseMockMode } from "@/lib/auth-server";
import { db, profiles, feedback, sessions, systemSettings } from "@devlaunchkit/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface ActionResponse<T = null> {
  success: boolean;
  data: T | null;
  error?: string;
}

// User Actions
export async function suspendUserAction(userId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db
      .update(profiles)
      .set({ status: "suspended", updatedAt: new Date() })
      .where(eq(profiles.id, userId));

    revalidatePath("/admin/users");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to suspend user" };
  }
}

export async function unsuspendUserAction(userId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db
      .update(profiles)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(profiles.id, userId));

    revalidatePath("/admin/users");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to unsuspend user" };
  }
}

export async function promoteToAdminAction(userId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db
      .update(profiles)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(profiles.id, userId));

    revalidatePath("/admin/users");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to promote user" };
  }
}

export async function demoteAdminAction(userId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db
      .update(profiles)
      .set({ role: "user", updatedAt: new Date() })
      .where(eq(profiles.id, userId));

    revalidatePath("/admin/users");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to demote user" };
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    // Hard delete or soft delete (setting deletedAt)
    await db
      .update(profiles)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(profiles.id, userId));

    revalidatePath("/admin/users");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to delete user" };
  }
}

// Feedback Actions
export async function resolveFeedbackAction(feedbackId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db.update(feedback).set({ status: "resolved" }).where(eq(feedback.id, feedbackId));

    revalidatePath("/admin/feedback");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to resolve feedback" };
  }
}

export async function deleteFeedbackAction(feedbackId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      return { success: false, data: null, error: "Sample records are read-only in the demo." };
    }

    await db.delete(feedback).where(eq(feedback.id, feedbackId));

    revalidatePath("/admin/feedback");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to delete feedback" };
  }
}

// Settings Actions
export async function updateSystemSettingsAction(data: {
  appName: string;
  logoUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowedDomains: string;
}): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (isDatabaseMockMode()) {
      // In mock mode, store settings in cookies so they persist between requests in dev
      const cookieStore = await cookies();
      cookieStore.set("mock_settings", JSON.stringify(data), { maxAge: 60 * 60 * 24 });
      return { success: true, data: null };
    }

    // Upsert into systemSettings KV store
    const settingsList = [
      { key: "app_name", value: data.appName, description: "Application Name" },
      { key: "logo_url", value: data.logoUrl, description: "Application Logo URL" },
      { key: "support_email", value: data.supportEmail, description: "Support Contact Email" },
      {
        key: "maintenance_mode",
        value: data.maintenanceMode,
        description: "Maintenance Mode Gate status",
      },
      { key: "allowed_domains", value: data.allowedDomains, description: "Allowed CORS Domains" },
    ];

    for (const item of settingsList) {
      await db
        .insert(systemSettings)
        .values(item)
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: { value: item.value, updatedAt: new Date() },
        });
    }

    revalidatePath("/admin/settings");
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, data: null, error: error.message || "Failed to update settings" };
  }
}

export async function startAdminDemoAction(): Promise<ActionResponse> {
  if (!isDatabaseMockMode()) {
    return { success: false, data: null, error: "The local admin demo is unavailable." };
  }

  const cookieStore = await cookies();
  cookieStore.set("auth_session", DEMO_ADMIN_SESSION, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return { success: true, data: null };
}

export async function signOutAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("auth_session")?.value;

  try {
    if (sessionToken && sessionToken !== DEMO_ADMIN_SESSION) {
      await db.delete(sessions).where(eq(sessions.token, sessionToken));
    }
  } catch (error) {
    console.error("Could not end the session:", error);
    return { success: false, data: null, error: "Could not sign out. Please try again." };
  }

  cookieStore.delete("auth_session");
  cookieStore.delete("mock_role");
  return { success: true, data: null };
}

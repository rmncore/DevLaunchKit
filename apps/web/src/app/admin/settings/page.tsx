import * as React from "react";
import { requireAdminPage, isDatabaseMockMode } from "@/lib/auth/session";
import { db, systemSettings } from "@devlaunchkit/database";
import SettingsForm from "./settings-form";
import { cookies } from "next/headers";

interface SettingsData {
  appName: string;
  logoUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;
}

async function getSystemSettings(): Promise<SettingsData> {
  const isMock = isDatabaseMockMode();

  if (isMock) {
    // Read from cookies in mock mode if available
    const cookieStore = await cookies();
    const cookieSettingsStr = cookieStore.get("mock_settings")?.value;
    if (cookieSettingsStr) {
      try {
        return JSON.parse(cookieSettingsStr);
      } catch {
        // ignore parsing errors
      }
    }

    return {
      appName: "DevLaunchKit Sandbox",
      logoUrl: "https://logo.vercel.sh/launchkit",
      supportEmail: "support@devlaunchkit.com",
      maintenanceMode: false,
    };
  }

  const dbSettings = await db.select().from(systemSettings);
  const lookup = (key: string, defVal: string) => {
    const row = dbSettings.find((s) => s.key === key);
    return row ? String(row.value) : defVal;
  };

  return {
    appName: lookup("app_name", "DevLaunchKit"),
    logoUrl: lookup("logo_url", "https://logo.vercel.sh/launchkit"),
    supportEmail: lookup("support_email", "support@devlaunchkit.com"),
    maintenanceMode: lookup("maintenance_mode", "false") === "true",
  };
}

export default async function AdminSettingsPage() {
  await requireAdminPage();

  const initialSettings = await getSystemSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Platform Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Configure branding settings and configure maintenance parameters.
        </p>
      </div>

      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}

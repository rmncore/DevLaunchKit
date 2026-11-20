import { db, systemSettings } from "@devlaunchkit/database";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";

export async function MaintenanceGate({ children }: { children: ReactNode }) {
  await connection();

  if (process.env.DATABASE_URL) {
    const [setting] = await db
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, "maintenance_mode"))
      .limit(1);

    if (setting?.value === true || setting?.value === "true") {
      return (
        <main className="mx-auto max-w-lg space-y-4 p-8">
          <h1 className="text-3xl font-semibold">Scheduled maintenance</h1>
          <p>The workspace is temporarily unavailable. Please check back soon.</p>
          <Link href="/admin/settings" className="text-indigo-600 hover:underline">
            Administrator access
          </Link>
        </main>
      );
    }
  }

  return children;
}

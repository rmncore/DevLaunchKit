import type { ReactNode } from "react";
import { isDatabaseMockMode, requireAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import AdminShell from "./admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin().catch(() => redirect("/dashboard/admin"));

  return (
    <AdminShell userEmail={admin.email} demo={isDatabaseMockMode()}>
      {children}
    </AdminShell>
  );
}

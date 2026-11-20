import type { ReactNode } from "react";
import { isDatabaseMockMode, requireAdminPage } from "@/lib/auth/session";
import AdminShell from "./admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminPage();

  return (
    <AdminShell userEmail={admin.email} demo={isDatabaseMockMode()}>
      {children}
    </AdminShell>
  );
}

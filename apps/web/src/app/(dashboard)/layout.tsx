import { MaintenanceGate } from "@/lib/settings/maintenance";
import type { ReactNode } from "react";
import DashboardShell from "./dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <MaintenanceGate>
      <DashboardShell>{children}</DashboardShell>
    </MaintenanceGate>
  );
}

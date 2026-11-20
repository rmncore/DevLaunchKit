import { MaintenanceGate } from "@/lib/settings/maintenance";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <MaintenanceGate>{children}</MaintenanceGate>;
}

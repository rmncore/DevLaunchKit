"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DashboardProviders,
  DashboardSidebar,
  Topbar,
  CommandPalette,
  NotificationCenter,
  useSidebar,
  useBreadcrumbs,
  CommandItem,
  NavGroup,
} from "@devlaunchkit/ui";
import {
  Home,
  Users,
  Building2,
  Settings,
  CreditCard,
  Flag,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { signOutAction } from "./actions";
import Link from "next/link";

const adminNavigationGroups: NavGroup[] = [
  {
    label: "Admin Overview",
    items: [
      { title: "Control Panel", href: "/admin/dashboard", icon: Home },
      { title: "Users Directory", href: "/admin/users", icon: Users },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { title: "User Feedback", href: "/admin/feedback", icon: MessageSquare },
    ],
  },
  {
    label: "Platform Systems",
    items: [
      { title: "Organizations", href: "/admin/organizations", icon: Building2 },
      { title: "Feature Flags", href: "/admin/feature-flags", icon: Flag },
    ],
  },
  {
    label: "Configuration",
    items: [{ title: "System Settings", href: "/admin/settings", icon: Settings }],
  },
];

type AdminShellProps = { children: React.ReactNode; userEmail: string; demo: boolean };

function AdminShellInner({ children, userEmail, demo }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { isCollapsed } = useSidebar();

  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [signOutError, setSignOutError] = React.useState("");

  async function signOut() {
    try {
      const result = await signOutAction();
      if (result.success) {
        router.replace("/dashboard/admin");
      } else {
        setSignOutError(result.error ?? "Could not sign out.");
      }
    } catch {
      setSignOutError("Could not sign out. Please try again.");
    }
  }

  React.useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = segments.map((seg, idx) => {
      const href = idx === 0 ? "/dashboard/admin" : "/" + segments.slice(0, idx + 1).join("/");
      const title = seg.charAt(0).toUpperCase() + seg.slice(1).replace("-", " ");
      return { title, href: idx === segments.length - 1 ? undefined : href };
    });
    setBreadcrumbs(crumbs.length > 0 ? crumbs : [{ title: "Admin Console" }]);
  }, [pathname, setBreadcrumbs]);

  const handleMarkRead = () => {};
  const handleMarkAllRead = () => {};

  const globalCommands: CommandItem[] = [
    {
      id: "go-admin",
      title: "Go to Admin Dashboard",
      category: "Admin",
      action: () => router.push("/admin/dashboard"),
      icon: Home,
    },
    {
      id: "go-users",
      title: "Go to Users Directory",
      category: "Admin",
      action: () => router.push("/admin/users"),
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-white">
      <DashboardSidebar
        groups={adminNavigationGroups}
        activeHref={pathname}
        onNavigate={(href) => router.push(href)}
        organizationName="LaunchKit Admin"
        homeHref="/"
        showItemActions={false}
      />

      <div
        className={
          (isCollapsed ? "md:pl-16" : "md:pl-56") +
          " flex flex-col min-h-screen transition-all duration-300"
        }
      >
        <Topbar
          onSearchClick={() => setCommandPaletteOpen(true)}
          onNotificationsClick={() => setNotificationsOpen(true)}
          unreadNotifications={0}
          userEmail={userEmail}
          onLogout={signOut}
          onNavigate={(href) => router.push(href)}
        />

        {demo && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 sm:px-6">
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4" aria-hidden="true" /> Admin demo · Sample records
            </p>
            <button
              type="button"
              onClick={signOut}
              className="rounded-md px-2 py-1 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900"
            >
              Exit demo
            </button>
          </div>
        )}
        {signOutError && (
          <p role="alert" className="px-4 py-2 text-sm text-red-700 dark:text-red-300">
            {signOutError}
          </p>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Link
            href="/dashboard"
            className="mb-5 inline-block text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300"
          >
            Back to workspace
          </Link>
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={globalCommands}
      />

      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={[]}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}

export default function AdminShell(props: AdminShellProps) {
  return (
    <DashboardProviders>
      <AdminShellInner {...props} />
    </DashboardProviders>
  );
}

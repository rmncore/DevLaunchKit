"use client";

import { useRouter } from "next/navigation";
import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  SettingsLayout,
  SettingsCard,
  useTheme,
} from "@devlaunchkit/ui";
import { User, Settings, ShieldAlert, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const settingsTabs = [
    { id: "settings", label: "General Settings", icon: Settings },
    { id: "account", label: "Account Parameters", icon: User },
    { id: "profile", label: "User Profile", icon: User },
    { id: "security", label: "Security & Keys", icon: ShieldAlert },
    { id: "billing", label: "Subscription Billing", icon: CreditCard },
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="General Preferences"
          description="Choose how LaunchKit looks in this browser."
        />

        <SettingsLayout
          sidebarItems={settingsTabs}
          activeId="settings"
          onSectionSelect={(id) => router.push(`/dashboard/${id}`)}
        >
          <SettingsCard
            title="Appearance"
            description="Use a light or dark theme, or follow your device preference."
          >
            <label htmlFor="workspace-theme" className="block text-sm font-medium">
              Color theme
            </label>
            <select
              id="workspace-theme"
              value={theme}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "light" || value === "dark" || value === "system") setTheme(value);
              }}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </SettingsCard>
        </SettingsLayout>
      </ContentWrapper>
    </PageContainer>
  );
}

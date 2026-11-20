"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  SettingsLayout,
  SettingsCard,
} from "@devlaunchkit/ui";
import { User, Settings, ShieldAlert, CreditCard } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

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
          title="Security Controls"
          description="Configure multi-factor credentials, security keys, and active user sessions."
        />

        <SettingsLayout
          sidebarItems={settingsTabs}
          activeId="security"
          onSectionSelect={(id) => router.push(`/dashboard/${id}`)}
        >
          <SettingsCard
            title="Account security"
            description="Configure password changes, multi-factor authentication, and session controls through the authentication provider you connect to this workspace."
          >
            <Link
              href="/dashboard/docs"
              className="text-sm font-semibold text-indigo-700 underline dark:text-indigo-300"
            >
              View authentication setup
            </Link>
          </SettingsCard>
        </SettingsLayout>
      </ContentWrapper>
    </PageContainer>
  );
}

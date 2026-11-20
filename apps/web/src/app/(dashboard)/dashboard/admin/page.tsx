import Link from "next/link";
import { ContentWrapper, PageContainer, PageHeader, SettingsCard } from "@devlaunchkit/ui";
import { isDatabaseMockMode, requireAdmin } from "@/lib/auth-server";
import AdminDemoButton from "./admin-demo-button";

export default async function AdminPage() {
  let hasAdminSession = false;
  try {
    await requireAdmin();
    hasAdminSession = true;
  } catch {
    // Display the entry options for visitors without an administrator session.
  }

  const demoEnabled = isDatabaseMockMode();

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Admin console"
          description="Manage users, subscriptions, and platform settings."
        />
        <SettingsCard
          title={
            hasAdminSession
              ? "Administrator session active"
              : demoEnabled
                ? "Local admin demo"
                : "Administrator access required"
          }
          description={
            hasAdminSession
              ? "Open the console to continue."
              : demoEnabled
                ? "Explore the console with sample records in this development instance."
                : "Connect an authentication provider and sign in with an administrator account to use the console."
          }
        >
          {hasAdminSession ? (
            <Link
              className="inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              href="/admin/dashboard"
            >
              Open admin console
            </Link>
          ) : demoEnabled ? (
            <AdminDemoButton />
          ) : (
            <Link
              href="/dashboard/docs"
              className="text-sm font-semibold text-indigo-700 underline dark:text-indigo-300"
            >
              View workspace documentation
            </Link>
          )}
        </SettingsCard>
      </ContentWrapper>
    </PageContainer>
  );
}

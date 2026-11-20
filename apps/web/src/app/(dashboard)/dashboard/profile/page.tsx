"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  SettingsLayout,
  SettingsCard,
} from "@devlaunchkit/ui";
import { User, Settings, ShieldAlert, CreditCard, Building2, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Alex Developer");
  const [bio, setBio] = useState("Full-stack software developer.");
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("launchkit-sample-profile");
      if (saved) {
        const profile = JSON.parse(saved);
        if (typeof profile.name === "string") setName(profile.name);
        if (typeof profile.bio === "string") setBio(profile.bio);
      }
    } catch {
      // Use the sample profile when browser storage is unavailable.
    }
  }, []);

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
          title="Profile Settings"
          description="Update your user profile, avatar icon, and display name."
        />

        <SettingsLayout
          sidebarItems={settingsTabs}
          activeId="profile"
          onSectionSelect={(id) => router.push(`/dashboard/${id}`)}
        >
          <SettingsCard
            title="Public Profile Details"
            description="Try profile editing. Changes are saved for this browser tab."
          >
            <form
              className="max-w-md space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!name.trim()) {
                  setStatus("Enter a display name.");
                  return;
                }
                try {
                  sessionStorage.setItem(
                    "launchkit-sample-profile",
                    JSON.stringify({ name: name.trim(), bio })
                  );
                  setStatus("Sample profile saved.");
                } catch {
                  setStatus("Browser storage is unavailable.");
                }
              }}
            >
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium">
                  Display name
                </label>
                <input
                  type="text"
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="profile-bio" className="block text-sm font-medium">
                  Biography
                </label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={400}
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3.5 py-2 text-xs outline-none focus:border-indigo-500 h-20"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
              >
                Save Profile
              </button>
              <p className="text-sm" role="status">
                {status}
              </p>
            </form>
          </SettingsCard>
        </SettingsLayout>
      </ContentWrapper>
    </PageContainer>
  );
}

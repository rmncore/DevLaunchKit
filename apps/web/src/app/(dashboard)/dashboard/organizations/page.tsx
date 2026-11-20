"use client";

import * as React from "react";
import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  OrgSwitcherPopover,
  OrgMembersList,
  OrgInvitationsList,
  SettingsCard,
} from "@devlaunchkit/ui";

export default function OrganizationsPage() {
  const [activeOrgId, setActiveOrgId] = React.useState("org_1");

  const orgs = [
    { id: "org_1", name: "SaaS Dev Group", slug: "saas-dev", role: "admin" },
    { id: "org_2", name: "LaunchKit Workspace", slug: "launchkit", role: "owner" },
  ];

  const initialMembers = [
    {
      id: "mem_1",
      name: "Alex Admin",
      email: "alex@saas.com",
      role: "admin",
      joinedAt: new Date("2026-06-12T12:00:00Z"),
    },
    {
      id: "mem_2",
      name: "Blake Engineer",
      email: "blake@saas.com",
      role: "member",
      joinedAt: new Date("2026-06-27T12:00:00Z"),
    },
  ];

  const [members, setMembers] = React.useState(initialMembers);
  const [invitations, setInvitations] = React.useState([
    {
      id: "inv_1",
      email: "charlie@saas.com",
      role: "member",
      createdAt: new Date("2026-07-12T12:00:00Z"),
    },
  ]);

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRevokeInvite = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Organization Workspaces"
          description="Switch between sample workspaces and preview member management."
          actions={
            <OrgSwitcherPopover
              organizations={orgs}
              activeId={activeOrgId}
              onSwitch={setActiveOrgId}
            />
          }
        />

        <div className="space-y-8">
          <SettingsCard
            title="Workspace Members Roster"
            description={`Members of ${orgs.find((org) => org.id === activeOrgId)?.name}.`}
          >
            {activeOrgId === "org_1" ? (
              <OrgMembersList members={members} onRemoveMember={handleRemoveMember} />
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No sample members in this workspace.
              </p>
            )}
          </SettingsCard>

          <SettingsCard
            title="Pending Member Invitations"
            description="Sample invitations awaiting a response."
          >
            {activeOrgId === "org_1" ? (
              <OrgInvitationsList invitations={invitations} onRevokeInvite={handleRevokeInvite} />
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                No pending invitations.
              </p>
            )}
          </SettingsCard>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}

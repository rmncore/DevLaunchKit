import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, FolderKanban, KeyRound } from "lucide-react";
import { ContentWrapper, PageContainer, PageHeader } from "@devlaunchkit/ui";

const metrics = [
  { label: "Monthly recurring revenue", value: "$12,480", change: "+12.3%" },
  { label: "Workspace users", value: "1,248", change: "+4.1%" },
  { label: "API requests", value: "284,200", change: "−2.4%" },
];

const workspaceLinks = [
  {
    title: "Projects",
    detail: "Repositories, branches, and deployment status",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "API credentials",
    detail: "Create and copy sample keys",
    href: "/dashboard/api-keys",
    icon: KeyRound,
  },
  {
    title: "Billing",
    detail: "Plans and checkout preview",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Documentation",
    detail: "Authentication, roles, and organizations",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
];

export default function DashboardIndexPage() {
  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Workspace overview"
          description="Sample workspace metrics and tools."
          actions={
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              View projects <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <section
          aria-labelledby="workspace-metrics"
          className="rounded-lg border border-border bg-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold" id="workspace-metrics">
              Workspace metrics
            </h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Compared with last week
            </span>
          </div>
          <dl className="grid gap-px bg-border md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5 bg-card px-4 py-4 sm:px-5">
                <dt className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</dt>
                <dd className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums tracking-tight">
                    {metric.value}
                  </span>
                  <span
                    className={
                      metric.change.startsWith("+")
                        ? "text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        : "text-xs font-medium text-red-700 dark:text-red-400"
                    }
                  >
                    {metric.change}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section
            aria-labelledby="workspace-tools"
            className="rounded-lg border border-border bg-card"
          >
            <h2
              id="workspace-tools"
              className="border-b border-border px-4 py-3 text-base font-semibold sm:px-5"
            >
              Workspace tools
            </h2>
            <ul className="divide-y divide-border">
              {workspaceLinks.map(({ title, detail, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted sm:px-5"
                  >
                    <Icon
                      className="size-4 shrink-0 text-slate-500 dark:text-slate-400"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{title}</span>
                      <span className="block text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {detail}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-slate-500 dark:text-slate-400"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="workspace-activity"
            className="rounded-lg border border-border bg-card"
          >
            <h2
              id="workspace-activity"
              className="border-b border-border px-4 py-3 text-base font-semibold sm:px-5"
            >
              Activity
            </h2>
            <p className="px-4 pt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:px-5">
              See sample events for sign-ins, key changes, and billing.
            </p>
            <div className="px-4 py-4 sm:px-5">
              <Link
                href="/dashboard/activity"
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300"
              >
                Open the audit log <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}

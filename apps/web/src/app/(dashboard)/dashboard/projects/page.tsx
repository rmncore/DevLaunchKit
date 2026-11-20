import Link from "next/link";
import { PageContainer, ContentWrapper, PageHeader } from "@devlaunchkit/ui";
import { Folder, GitBranch, Globe, ArrowUpRight } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { name: "launchkit-dashboard", branch: "main", url: "https://launchkit.dev", status: "Active" },
    {
      name: "supabase-connector",
      branch: "master",
      url: "https://db.launchkit.dev",
      status: "Inactive",
    },
    {
      name: "better-auth-service",
      branch: "main",
      url: "https://auth.launchkit.dev",
      status: "Active",
    },
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Projects"
          description="Sample projects showing repository, branch, and deployment status."
          actions={
            <Link
              href="/dashboard/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Browse setup guides <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-950 dark:text-white">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                    <GitBranch className="h-3 w-3" />
                    <span>{project.branch}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <span className="flex items-center gap-1 text-neutral-500">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="break-all">{project.url.replace("https://", "")}</span>
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    project.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ContentWrapper>
    </PageContainer>
  );
}

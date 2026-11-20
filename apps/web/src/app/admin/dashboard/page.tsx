import { Card, Charts, PageHeader, SystemStatus } from "@devlaunchkit/ui";
import { isDatabaseMockMode, requireAdminPage } from "@/lib/auth/session";
import {
  db,
  profiles,
  sessions,
  authSessions,
  subscriptions,
  prices,
  auditLogs,
} from "@devlaunchkit/database";
import { and, count, eq, gt, isNull, sql } from "drizzle-orm";

// Define stats shape
interface StatsData {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  annualRevenue: number;
  freeUsers: number;
  paidUsers: number;
  userGrowth: number[];
  revenueGrowth: number[];
  subscriptionDistribution: number[];
  recentActivity: {
    id: string;
    action: string;
    target: string;
    actor: string;
    time: string;
  }[];
  isMock: boolean;
}

// Fetch stats helper
async function getStats(): Promise<StatsData> {
  const isMock = isDatabaseMockMode();

  if (isMock) {
    return {
      totalUsers: 1420,
      newUsersToday: 24,
      activeUsers: 342,
      activeSubscriptions: 184,
      monthlyRevenue: 9016,
      annualRevenue: 108192,
      freeUsers: 1236,
      paidUsers: 184,
      userGrowth: [100, 150, 230, 310, 450, 680, 890, 1100, 1420],
      revenueGrowth: [2000, 2500, 3800, 4900, 6000, 7200, 8100, 9016],
      subscriptionDistribution: [120, 45, 19], // Free, Pro, Enterprise
      recentActivity: [
        {
          id: "1",
          action: "User Registered",
          target: "alice.vance@clerk.com",
          actor: "System",
          time: "5 mins ago",
        },
        {
          id: "2",
          action: "Subscription Upgraded",
          target: "Pro Plan — $49/mo",
          actor: "bob.carter@gmail.com",
          time: "15 mins ago",
        },
        {
          id: "3",
          action: "Feedback Submitted",
          target: "Bug in auth redirect",
          actor: "charlie@stripe.dev",
          time: "1 hour ago",
        },
        {
          id: "4",
          action: "Subscription Cancelled",
          target: "Basic Plan",
          actor: "dave.miller@yahoo.com",
          time: "4 hours ago",
        },
      ],
      isMock: true,
    };
  }

  // Database-backed metrics
  const [usersCount] = await db
    .select({ val: count() })
    .from(profiles)
    .where(isNull(profiles.deletedAt));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [newUsersCount] = await db
    .select({ val: count() })
    .from(profiles)
    .where(and(gt(profiles.createdAt, todayStart), isNull(profiles.deletedAt)));

  const now = new Date();
  const [[legacySessions], [providerSessions]] = await Promise.all([
    db.select({ val: count() }).from(sessions).where(gt(sessions.expiresAt, now)),
    db.select({ val: count() }).from(authSessions).where(gt(authSessions.expiresAt, now)),
  ]);

  const [activeSubsCount] = await db
    .select({ val: count() })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));

  // Aggregate monthly revenue (sum of active subscriptions)
  const activeSubsWithPrices = await db
    .select({
      unitAmount: prices.unitAmount,
      interval: prices.interval,
      quantity: subscriptions.quantity,
    })
    .from(subscriptions)
    .innerJoin(prices, eq(subscriptions.priceId, prices.id))
    .where(eq(subscriptions.status, "active"));

  let mrr = 0;
  activeSubsWithPrices.forEach((s) => {
    const amountInDollars = s.unitAmount / 100;
    if (s.interval === "month") {
      mrr += amountInDollars * s.quantity;
    } else if (s.interval === "year") {
      mrr += (amountInDollars / 12) * s.quantity;
    }
  });

  const arr = mrr * 12;

  const paidUsers = activeSubsCount.val;
  const freeUsers = Math.max(0, usersCount.val - paidUsers);

  // Get recent audit logs or feedback for activity feed
  const recentLogs = await db
    .select()
    .from(auditLogs)
    .orderBy(sql`${auditLogs.createdAt} DESC`)
    .limit(5);

  const mappedActivity = recentLogs.map((log) => ({
    id: log.id,
    action: log.action,
    target: log.resource,
    actor: log.profileId || "System",
    time: log.createdAt.toISOString().slice(0, 10),
  }));

  return {
    totalUsers: usersCount.val,
    newUsersToday: newUsersCount.val,
    activeUsers: legacySessions.val + providerSessions.val,
    activeSubscriptions: activeSubsCount.val,
    monthlyRevenue: Math.round(mrr),
    annualRevenue: Math.round(arr),
    freeUsers,
    paidUsers,
    userGrowth: [],
    revenueGrowth: [],
    subscriptionDistribution: [freeUsers, paidUsers],
    recentActivity: mappedActivity,
    isMock: false,
  };
}

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const stats = await getStats();

  const metrics = [
    {
      title: "Registered users",
      value: stats.totalUsers.toLocaleString(),
      detail: `${stats.newUsersToday} joined today`,
    },
    {
      title: "Monthly recurring revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      detail: `$${stats.annualRevenue.toLocaleString()} annualized`,
    },
    {
      title: "Active sessions",
      value: stats.activeUsers.toLocaleString(),
      detail: "Unexpired sign-in sessions",
    },
    { title: "Active subscriptions", value: stats.activeSubscriptions.toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Control Panel" description="User, subscription, and audit activity." />

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border xl:grid-cols-4">
        {metrics.map(({ title, value, detail }) => (
          <div key={title} className="min-w-0 space-y-1.5 bg-card p-4 sm:p-5">
            <dt className="text-sm text-slate-600 dark:text-slate-400">{title}</dt>
            <dd className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
              {value}
            </dd>
            {detail && <dd className="text-xs text-slate-600 dark:text-slate-400">{detail}</dd>}
          </div>
        ))}
      </dl>

      {stats.isMock && (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card>
            <h2 className="text-base font-semibold">User growth</h2>
            <Charts
              type="area"
              data={stats.userGrowth}
              ariaLabel="Sample cumulative users increase from 100 to 1,420"
            />
          </Card>
          <Card>
            <h2 className="text-base font-semibold">Recurring revenue</h2>
            <Charts
              type="bar"
              data={stats.revenueGrowth}
              ariaLabel="Sample monthly recurring revenue grows from 2,000 to 9,016 dollars"
            />
          </Card>
        </div>
      )}

      <div
        className={
          stats.isMock
            ? "grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
            : ""
        }
      >
        <section
          aria-labelledby="admin-activity"
          className="rounded-lg border border-border bg-card"
        >
          <h2
            id="admin-activity"
            className="border-b border-border px-4 py-3 text-base font-semibold sm:px-5"
          >
            Recent activity
          </h2>
          {stats.recentActivity.length ? (
            <ul className="divide-y divide-border">
              {stats.recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0 break-words text-sm">
                    <span className="font-medium">{log.action}</span>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">{log.target}</span>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      By {log.actor}
                    </p>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{log.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-sm text-slate-600 dark:text-slate-400">
              No audit events recorded.
            </p>
          )}
        </section>

        {stats.isMock && (
          <SystemStatus
            services={[
              { name: "PostgreSQL", status: "operational", latency: "1.5 ms" },
              { name: "AI gateway", status: "operational" },
              { name: "Email delivery", status: "operational" },
            ]}
          />
        )}
      </div>
    </div>
  );
}

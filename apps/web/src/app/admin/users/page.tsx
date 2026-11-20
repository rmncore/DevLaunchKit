import * as React from "react";
import { Card, Avatar, Badge } from "@devlaunchkit/ui";
import {
  Search,
  ShieldAlert,
  CheckCircle,
  Ban,
  Shield,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { requireAdminPage, isDatabaseMockMode } from "@/lib/auth/session";
import {
  db,
  profiles,
  oauthAccounts,
  subscriptions,
  prices,
  products,
} from "@devlaunchkit/database";
import { and, or, ilike, eq, count, desc, asc, isNull, sql } from "drizzle-orm";
import Link from "next/link";
import AdminActionButton from "../action-button";
import { demoUsers, type DisplayUser } from "./demo-users";
import {
  suspendUserAction,
  unsuspendUserAction,
  promoteToAdminAction,
  demoteAdminAction,
  deleteUserAction,
} from "../actions";

interface SearchParams {
  q?: string;
  role?: string;
  status?: string;
  sort?: string;
  order?: string;
  page?: string;
}

// User shape representing display fields
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const q = params.q || "";
  const filterRole = params.role || "";
  const filterStatus = params.status || "";
  const sortField = params.sort || "createdAt";
  const sortOrder = params.order || "desc";
  const requestedPage = Number(params.page);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 100000
      ? requestedPage
      : 1;
  const limit = 8;
  const offset = (page - 1) * limit;

  const isMock = isDatabaseMockMode();
  let users: DisplayUser[] = [];
  let totalCount = 0;

  if (isMock) {
    // 2. Mock mode: generate and filter/sort/paginate mock users in-memory
    // Filter
    const filtered = demoUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase());
      const matchRole = filterRole ? u.role === filterRole : true;
      const matchStatus = filterStatus ? u.status === filterStatus : true;
      return matchSearch && matchRole && matchStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") comparison = a.name.localeCompare(b.name);
      else if (sortField === "email") comparison = a.email.localeCompare(b.email);
      else comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? comparison : -comparison;
    });

    totalCount = filtered.length;
    users = filtered.slice(offset, offset + limit);
  } else {
    // 3. Database mode: query postgres using Drizzle ORM
    const conditions = [isNull(profiles.deletedAt)];
    if (filterRole) {
      conditions.push(eq(profiles.role, filterRole));
    }
    if (filterStatus) {
      conditions.push(eq(profiles.status, filterStatus));
    }

    const whereClause = and(
      ...conditions,
      q ? or(ilike(profiles.name, `%${q}%`), ilike(profiles.email, `%${q}%`)) : undefined
    );

    // Fetch count
    const [countResult] = await db.select({ val: count() }).from(profiles).where(whereClause);
    totalCount = countResult.val;

    // Resolve sort order
    let orderExpr = desc(profiles.createdAt);
    if (sortField === "name") {
      orderExpr = sortOrder === "asc" ? asc(profiles.name) : desc(profiles.name);
    } else if (sortField === "email") {
      orderExpr = sortOrder === "asc" ? asc(profiles.email) : desc(profiles.email);
    } else if (sortField === "createdAt") {
      orderExpr = sortOrder === "asc" ? asc(profiles.createdAt) : desc(profiles.createdAt);
    }

    const provider = db
      .select({ name: oauthAccounts.provider })
      .from(oauthAccounts)
      .where(eq(oauthAccounts.profileId, profiles.id))
      .orderBy(desc(oauthAccounts.createdAt), asc(oauthAccounts.id))
      .limit(1)
      .as("latest_provider");

    const activePlan = db
      .select({ name: products.name })
      .from(subscriptions)
      .innerJoin(prices, eq(subscriptions.priceId, prices.id))
      .innerJoin(products, eq(prices.productId, products.id))
      .where(and(eq(subscriptions.userId, profiles.id), eq(subscriptions.status, "active")))
      .orderBy(desc(subscriptions.createdAt), asc(subscriptions.id))
      .limit(1)
      .as("latest_plan");

    // Query database
    const dbUsers = await db
      .select({
        id: profiles.id,
        name: profiles.name,
        email: profiles.email,
        avatarUrl: profiles.avatarUrl,
        role: profiles.role,
        status: profiles.status,
        createdAt: profiles.createdAt,
        provider: provider.name,
        plan: activePlan.name,
      })
      .from(profiles)
      .leftJoinLateral(provider, sql`true`)
      .leftJoinLateral(activePlan, sql`true`)
      .where(whereClause)
      .orderBy(orderExpr, asc(profiles.id))
      .limit(limit)
      .offset(offset);

    users = dbUsers.map((u) => ({
      id: u.id,
      name: u.name || "User",
      email: u.email,
      avatarUrl: u.avatarUrl,
      provider: u.provider || "email",
      role: u.role,
      plan: u.plan || "Free Plan",
      status: u.status,
      createdAt: u.createdAt.toISOString(),
    }));
  }

  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Helpers to rebuild URL with new parameters
  const getHref = (updates: Partial<SearchParams>) => {
    const nextParams = new URLSearchParams();
    if (q) nextParams.set("q", q);
    if (filterRole) nextParams.set("role", filterRole);
    if (filterStatus) nextParams.set("status", filterStatus);
    if (sortField) nextParams.set("sort", sortField);
    if (sortOrder) nextParams.set("order", sortOrder);
    nextParams.set("page", String(page));

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === "") nextParams.delete(key);
      else nextParams.set(key, val);
    });

    return `/admin/users?${nextParams.toString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Users Directory
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage user profiles, assignments, credentials, and state suspensions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        {/* Search */}
        <form className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search users by name or email..."
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none text-neutral-900 dark:text-white"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>

          <Link
            href={getHref({ role: filterRole === "admin" ? "" : "admin", page: "1" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterRole === "admin"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300"
                : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Admins
          </Link>

          <Link
            href={getHref({ status: filterStatus === "suspended" ? "" : "suspended", page: "1" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "suspended"
                ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Suspended
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                  <Link
                    href={getHref({ sort: "name", order: sortOrder === "asc" ? "desc" : "asc" })}
                    className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-white"
                  >
                    Name <ArrowUpDown className="h-3 w-3" />
                  </Link>
                </th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                  <Link
                    href={getHref({ sort: "email", order: sortOrder === "asc" ? "desc" : "asc" })}
                    className="flex items-center gap-1 hover:text-neutral-700 dark:hover:text-white"
                  >
                    Email <ArrowUpDown className="h-3 w-3" />
                  </Link>
                </th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                  Provider
                </th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">Role</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                  Active Plan
                </th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">Status</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-neutral-400">
                  Registered
                </th>
                <th className="p-4 text-right font-semibold text-neutral-500 dark:text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-400 font-medium">
                    No users found matching parameters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatarUrl || undefined}
                          alt={user.name}
                          fallback={user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        />
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                      {user.email}
                    </td>
                    <td className="p-4 font-medium uppercase text-xs text-neutral-400">
                      {user.provider}
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === "admin" ? "secondary" : "primary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-neutral-600 dark:text-neutral-300 font-medium text-xs">
                      {user.plan}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          user.status === "active"
                            ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-1.5 shrink-0">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 inline-flex items-center"
                        title="View profile details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {!isMock && (
                        <>
                          {user.status === "active" ? (
                            <AdminActionButton
                              action={suspendUserAction.bind(null, user.id)}
                              label="Suspend user"
                            >
                              <ShieldAlert className="size-4" />
                            </AdminActionButton>
                          ) : (
                            <AdminActionButton
                              action={unsuspendUserAction.bind(null, user.id)}
                              label="Reactivate user"
                            >
                              <CheckCircle className="size-4" />
                            </AdminActionButton>
                          )}
                          {user.role === "admin" ? (
                            <AdminActionButton
                              action={demoteAdminAction.bind(null, user.id)}
                              label="Demote admin"
                            >
                              <UserX className="size-4" />
                            </AdminActionButton>
                          ) : (
                            <AdminActionButton
                              action={promoteToAdminAction.bind(null, user.id)}
                              label="Promote to admin"
                            >
                              <Shield className="size-4" />
                            </AdminActionButton>
                          )}
                          <AdminActionButton
                            action={deleteUserAction.bind(null, user.id)}
                            label="Delete account"
                            confirmation="Delete this user profile?"
                          >
                            <Ban className="size-4" />
                          </AdminActionButton>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-900/50">
            <span className="text-xs text-neutral-400 font-semibold">
              Showing page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Link
                href={getHref({ page: String(Math.max(1, page - 1)) })}
                className={`p-1.5 border rounded-lg text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 ${
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-white dark:hover:bg-neutral-850"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <Link
                href={getHref({ page: String(Math.min(totalPages, page + 1)) })}
                className={`p-1.5 border rounded-lg text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-white dark:hover:bg-neutral-850"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

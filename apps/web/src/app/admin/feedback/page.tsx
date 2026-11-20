import * as React from "react";
import { Card, Avatar, Badge } from "@devlaunchkit/ui";
import { Search, CheckCircle, Trash2, AlertCircle, Filter, Star } from "lucide-react";
import { requireAdminPage, isDatabaseMockMode } from "@/lib/auth/session";
import { db, feedback, profiles } from "@devlaunchkit/database";
import { eq, desc, and, like, or } from "drizzle-orm";
import Link from "next/link";
import AdminActionButton from "../action-button";
import { resolveFeedbackAction, deleteFeedbackAction } from "../actions";

interface SearchParams {
  q?: string;
  status?: string;
}

interface DisplayFeedback {
  id: string;
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
  subject: string;
  message: string;
  category: string;
  rating: number;
  status: string;
  createdAt: string;
}

async function getFeedbackData(params: SearchParams): Promise<{
  list: DisplayFeedback[];
  isMock: boolean;
}> {
  const isMock = isDatabaseMockMode();
  const q = params.q || "";
  const filterStatus = params.status || "";

  if (isMock) {
    const mockList: DisplayFeedback[] = [
      {
        id: "fb_1",
        userName: "Bob Carter",
        userEmail: "bob.carter@gmail.com",
        avatarUrl: "https://avatar.vercel.sh/bob",
        subject: "Great template!",
        message:
          "The Clerk integration worked flawlessly out of the box. Absolutely saved me weeks of coding.",
        category: "general",
        rating: 5,
        status: "open",
        createdAt: "2026-07-16T12:00:00Z",
      },
      {
        id: "fb_2",
        userName: "Charlie Ding",
        userEmail: "charlie@stripe.dev",
        avatarUrl: "https://avatar.vercel.sh/charlie",
        subject: "Bug in billing webhook",
        message:
          "Stripe invoice.payment_succeeded webhook fails when customer metadata is missing. Please fix.",
        category: "bug",
        rating: 3,
        status: "open",
        createdAt: "2026-07-15T09:15:00Z",
      },
      {
        id: "fb_3",
        userName: "Dave Miller",
        userEmail: "dave.miller@yahoo.com",
        avatarUrl: "https://avatar.vercel.sh/dave",
        subject: "Request: Tailwind CSS v4 support",
        message:
          "Would love to see the main page styled with CSS variables from v4 tailwind config.",
        category: "feature",
        rating: 4,
        status: "resolved",
        createdAt: "2026-07-10T14:30:00Z",
      },
    ];

    const filtered = mockList.filter((item) => {
      const matchSearch =
        item.subject.toLowerCase().includes(q.toLowerCase()) ||
        item.message.toLowerCase().includes(q.toLowerCase()) ||
        item.userName.toLowerCase().includes(q.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(q.toLowerCase());
      const matchStatus = filterStatus ? item.status === filterStatus : true;
      return matchSearch && matchStatus;
    });

    return { list: filtered, isMock: true };
  }

  const conditions = [];
  if (q) {
    conditions.push(
      or(
        like(feedback.subject, `%${q}%`),
        like(feedback.comment, `%${q}%`),
        like(profiles.name, `%${q}%`),
        like(profiles.email, `%${q}%`)
      )
    );
  }
  if (filterStatus) {
    conditions.push(eq(feedback.status, filterStatus));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const dbFeedback = await db
    .select({
      id: feedback.id,
      category: feedback.category,
      rating: feedback.rating,
      comment: feedback.comment,
      subject: feedback.subject,
      message: feedback.message,
      status: feedback.status,
      createdAt: feedback.createdAt,
      profileName: profiles.name,
      profileEmail: profiles.email,
      avatarUrl: profiles.avatarUrl,
    })
    .from(feedback)
    .leftJoin(profiles, eq(feedback.profileId, profiles.id))
    .where(whereClause)
    .orderBy(desc(feedback.createdAt));

  const list: DisplayFeedback[] = dbFeedback.map((f) => ({
    id: f.id,
    userName: f.profileName || "Anonymous Developer",
    userEmail: f.profileEmail || "anonymous@dev.local",
    avatarUrl: f.avatarUrl,
    subject: f.subject || `${f.category.toUpperCase()} Feedback`,
    message: f.message || f.comment || "No detailed message provided.",
    category: f.category,
    rating: f.rating,
    status: f.status,
    createdAt: f.createdAt.toISOString(),
  }));

  return { list, isMock: false };
}

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const q = params.q || "";
  const filterStatus = params.status || "";
  const { list, isMock } = await getFeedbackData(params);

  // Helper to build filter URLs
  const getHref = (updates: Partial<SearchParams>) => {
    const nextParams = new URLSearchParams();
    if (q) nextParams.set("q", q);
    if (filterStatus) nextParams.set("status", filterStatus);

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === "") nextParams.delete(key);
      else nextParams.set(key, val);
    });

    return `/admin/feedback?${nextParams.toString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {isMock && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>Feedback submissions in the admin demo are sample records.</div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          User Feedback
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Review user feedback ratings, bug reports, and feature requests.
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
            placeholder="Search feedback subject or message..."
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none text-neutral-900 dark:text-white"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>

          <Link
            href={getHref({ status: filterStatus === "open" ? "" : "open" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "open"
                ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Open
          </Link>

          <Link
            href={getHref({ status: filterStatus === "resolved" ? "" : "resolved" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === "resolved"
                ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300"
                : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            Resolved
          </Link>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-6">
        {list.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-400 font-medium">
            No feedback entries found matching parameters.
          </div>
        ) : (
          list.map((item) => (
            <Card
              key={item.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between p-5 gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={item.avatarUrl || undefined}
                      alt={item.userName}
                      fallback={item.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {item.userName}
                      </div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">
                        {item.userEmail}
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.category === "bug"
                          ? "danger"
                          : item.category === "feature"
                            ? "secondary"
                            : "primary"
                      }
                    >
                      {item.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                      {item.subject}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed mt-1">
                      {item.message}
                    </p>
                  </div>

                  {/* Rating star display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-250 dark:text-neutral-800"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-neutral-400 ml-1">
                      Rating: {item.rating}/5
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col justify-between md:items-end shrink-0 gap-3 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.status === "open"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="text-xs text-neutral-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {!isMock && (
                    <div className="flex gap-2">
                      {item.status === "open" && (
                        <AdminActionButton
                          action={resolveFeedbackAction.bind(null, item.id)}
                          label="Mark resolved"
                        >
                          <CheckCircle className="size-4" />
                        </AdminActionButton>
                      )}
                      <AdminActionButton
                        action={deleteFeedbackAction.bind(null, item.id)}
                        label="Delete feedback"
                        confirmation="Delete this feedback?"
                      >
                        <Trash2 className="size-4" />
                      </AdminActionButton>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

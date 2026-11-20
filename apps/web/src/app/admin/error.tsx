"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function AdminError({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <section
      role="alert"
      className="mx-auto max-w-lg space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h1 className="text-xl font-semibold">Could not load this admin page</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Check that your database is running and migrations are current, then try again.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-indigo-700 underline dark:text-indigo-300"
        >
          Back to workspace
        </Link>
      </div>
    </section>
  );
}

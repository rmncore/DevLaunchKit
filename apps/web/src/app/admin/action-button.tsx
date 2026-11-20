"use client";

import { useState, type ReactNode } from "react";
import type { ActionResponse } from "./actions";

export default function AdminActionButton({
  action,
  label,
  confirmation,
  children,
}: {
  action: () => Promise<ActionResponse>;
  label: string;
  confirmation?: string;
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    if (confirmation && !window.confirm(confirmation)) return;

    setPending(true);
    setError("");
    try {
      const result = await action();
      if (!result.success) setError(result.error ?? "Could not complete the action.");
    } catch {
      setError("Could not complete the action. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={run}
        title={label}
        aria-label={label}
        disabled={pending}
        className="inline-flex size-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
      >
        {children}
      </button>
      {error && (
        <span role="alert" className="max-w-40 text-xs text-red-700 dark:text-red-300">
          {error}
        </span>
      )}
    </span>
  );
}

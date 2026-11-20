"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAdminDemoAction } from "@/app/admin/actions";

export default function AdminDemoButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function enterDemo() {
    setPending(true);
    setError("");
    try {
      const result = await startAdminDemoAction();
      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.error ?? "Could not open the admin demo.");
      }
    } catch {
      setError("Could not open the admin demo. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={enterDemo}
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {pending ? "Opening demo…" : "Open admin demo"}
      </button>
      {error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { signIn } from "./actions";

export default function SignInForm() {
  const [error, action, pending] = useActionState(signIn, "");
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
          className="block w-full rounded-md border border-border px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="block w-full rounded-md border border-border px-3 py-2"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}

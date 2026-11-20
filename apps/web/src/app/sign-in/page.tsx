import Link from "next/link";
import { getAuth } from "@/lib/auth/provider";
import { getSessionContext } from "@/lib/auth/session";
import { signOutAndRedirect } from "@/app/admin/actions";
import SignInForm from "./form";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const { user } = await getSessionContext();
  return (
    <main className="mx-auto max-w-md space-y-5 p-6">
      <Link href="/" className="text-sm text-indigo-600">
        Back to LaunchKit
      </Link>
      <div className="space-y-5 rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {user ? (
          <div className="space-y-3">
            <p>Signed in as {user.email}.</p>
            <form action={signOutAndRedirect}>
              <button className="rounded-md border border-border px-4 py-2">Sign out</button>
            </form>
          </div>
        ) : getAuth() ? (
          <SignInForm />
        ) : (
          <p>Sign-in is unavailable until an operator configures authentication.</p>
        )}
      </div>
    </main>
  );
}

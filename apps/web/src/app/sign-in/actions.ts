"use server";

import { getAuth } from "@/lib/auth/provider";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(_previous: string, formData: FormData) {
  const auth = getAuth();
  if (!auth) return "Sign-in is unavailable.";
  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email: String(formData.get("email") ?? "")
          .trim()
          .toLowerCase(),
        password: String(formData.get("password") ?? ""),
      },
    });
  } catch {
    return "Sign-in failed. Check your credentials and try again.";
  }
  redirect("/admin/dashboard");
}

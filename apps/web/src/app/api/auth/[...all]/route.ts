import { getAuth } from "@/lib/auth/provider";

function handle(request: Request) {
  const auth = getAuth();
  return auth ? auth.handler(request) : new Response("Authentication unavailable", { status: 503 });
}

export { handle as GET, handle as POST };

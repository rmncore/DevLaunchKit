import { client, db, profiles } from "@devlaunchkit/database";
import { createAuth } from "../src/lib/auth/provider";

async function main() {
  const [address, name, role = "user"] = process.argv.slice(2);
  const password = process.env.AUTH_PROVISION_PASSWORD;
  const auth = createAuth(true);

  if (!auth || !address || !name || !password || !["user", "admin"].includes(role)) {
    throw new Error(
      "Configure authentication and AUTH_PROVISION_PASSWORD, then pass an email, name, and optional user/admin role."
    );
  }

  const email = address.trim().toLowerCase();
  await db
    .insert(profiles)
    .values({ email, name, role })
    .onConflictDoNothing({ target: profiles.email });
  await auth.api.signUpEmail({ body: { email, name, password } });
  console.log("Account provisioned. Existing profile roles are preserved.");
}

main()
  .catch(() => {
    console.error(
      "Account provisioning failed. Check the configuration, credentials, and whether the account already exists."
    );
    process.exitCode = 1;
  })
  .finally(() => client.end());

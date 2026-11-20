import { and, asc, eq, sql } from "drizzle-orm";
import { pathToFileURL } from "node:url";
import { client, db } from "../utils/connection.js";
import * as schema from "../schema/index.js";

async function main() {
  console.log("🌱 Database seeding started...");

  try {
    await db.transaction(async (tx) => {
      // Serialize seed runs because the legacy billing and membership tables have no natural-key constraints.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext('devlaunchkit:seed'))`);
      // 1. Seed Roles
      console.log("  - Seeding default Roles...");
      await tx
        .insert(schema.roles)
        .values([
          { name: "owner", description: "Organization Owner" },
          { name: "admin", description: "Platform Administrator" },
          { name: "member", description: "General Organization Member" },
          { name: "guest", description: "Read-only Guest Participant" },
        ])
        .onConflictDoNothing();

      // Map role names to IDs
      const roleMap: Record<string, string> = {};
      const existingRoles = await tx.select().from(schema.roles);
      existingRoles.forEach((r) => {
        roleMap[r.name] = r.id;
      });

      // 2. Seed Permissions
      console.log("  - Seeding default Permissions...");
      await tx
        .insert(schema.permissions)
        .values([
          { name: "all", description: "Super Admin privileges" },
          { name: "read:billing", description: "Read billing and subscriptions status" },
          { name: "write:billing", description: "Modify billing plans and coupons" },
          { name: "read:settings", description: "View workspace properties" },
          { name: "write:settings", description: "Edit workspace parameters" },
        ])
        .onConflictDoNothing();

      // 3. Seed Super Admin User Profile
      console.log("  - Seeding admin/user Profiles...");
      await tx
        .insert(schema.profiles)
        .values([
          {
            email: "admin@devlaunchkit.com",
            name: "Super Administrator",
            avatarUrl: "https://avatar.vercel.sh/admin",
            role: "admin",
            status: "active",
          },
          {
            email: "user@devlaunchkit.com",
            name: "Test Developer",
            avatarUrl: "https://avatar.vercel.sh/test-user",
            role: "user",
            status: "active",
          },
        ])
        .onConflictDoNothing();

      const existingProfiles = await tx.select().from(schema.profiles);
      const adminUser = existingProfiles.find((p) => p.email === "admin@devlaunchkit.com");
      const testUser = existingProfiles.find((p) => p.email === "user@devlaunchkit.com");

      if (adminUser && roleMap.admin) {
        const [existingRole] = await tx
          .select()
          .from(schema.userRoles)
          .where(
            and(
              eq(schema.userRoles.profileId, adminUser.id),
              eq(schema.userRoles.roleId, roleMap.admin)
            )
          )
          .limit(1);
        if (!existingRole)
          await tx
            .insert(schema.userRoles)
            .values({ profileId: adminUser.id, roleId: roleMap.admin });
      }

      // 4. Seed Organization
      console.log("  - Seeding Tenant Organization...");
      await tx
        .insert(schema.organizations)
        .values({
          name: "Acme DevLabs",
          slug: "acme-devlabs",
          logoUrl: "https://logo.vercel.sh/acme",
        })
        .onConflictDoNothing();

      const existingOrgs = await tx.select().from(schema.organizations);
      const org = existingOrgs.find((o) => o.slug === "acme-devlabs");

      if (org && testUser && roleMap.owner) {
        const [existingMember] = await tx
          .select()
          .from(schema.organizationMembers)
          .where(
            and(
              eq(schema.organizationMembers.organizationId, org.id),
              eq(schema.organizationMembers.profileId, testUser.id)
            )
          )
          .limit(1);
        if (!existingMember) {
          await tx.insert(schema.organizationMembers).values({
            organizationId: org.id,
            profileId: testUser.id,
            roleId: roleMap.owner,
          });
        }
      }

      // 5. Seed Billing Plan, Product, and Price
      console.log("  - Seeding Billing Plans & Products...");
      const planValues = {
        name: "Pro Tier Plan",
        description: "Standard plan for growing development teams",
      };
      const [existingPlan] = await tx
        .select()
        .from(schema.plans)
        .where(
          and(
            eq(schema.plans.name, planValues.name),
            eq(schema.plans.description, planValues.description)
          )
        )
        .orderBy(asc(schema.plans.createdAt), asc(schema.plans.id))
        .limit(1);
      const plan =
        existingPlan ?? (await tx.insert(schema.plans).values(planValues).returning())[0];

      const productValues = {
        planId: plan.id,
        name: "LaunchKit Pro",
        description: "All-in-one Next.js SaaS monorepo tools",
      };
      const [existingProduct] = await tx
        .select()
        .from(schema.products)
        .where(
          and(eq(schema.products.planId, plan.id), eq(schema.products.name, productValues.name))
        )
        .orderBy(asc(schema.products.createdAt), asc(schema.products.id))
        .limit(1);
      const product =
        existingProduct ?? (await tx.insert(schema.products).values(productValues).returning())[0];

      const priceValues = {
        productId: product.id,
        currency: "usd",
        unitAmount: 4900,
        type: "recurring",
        interval: "month",
      };
      const [existingPrice] = await tx
        .select()
        .from(schema.prices)
        .where(
          and(
            eq(schema.prices.productId, product.id),
            eq(schema.prices.currency, priceValues.currency),
            eq(schema.prices.unitAmount, priceValues.unitAmount),
            eq(schema.prices.type, priceValues.type),
            eq(schema.prices.interval, priceValues.interval)
          )
        )
        .limit(1);
      if (!existingPrice) await tx.insert(schema.prices).values(priceValues);

      // 6. Seed Feature Flags
      console.log("  - Seeding default Feature Flags...");
      await tx
        .insert(schema.featureFlags)
        .values([
          {
            key: "beta:ai-assistant",
            description: "Allows access to the experimental AI Chat window panel.",
            defaultValue: true,
          },
          {
            key: "billing:coupons",
            description: "Enables promo coupon codes inside checkout drawer summaries.",
            defaultValue: false,
          },
        ])
        .onConflictDoNothing();
    });
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding error:", error);
    throw error;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main()
    .catch(() => {
      process.exitCode = 1;
    })
    .finally(() => client.end());
}

export { main };

import assert from "node:assert/strict";
import { client, main as seed } from "../../packages/database/src/index.js";

async function snapshot() {
  return (
    await client`
    select (select count(*) from plans) as plans,
           (select count(*) from products) as products,
           (select count(*) from prices) as prices,
           (select count(*) from organization_members) as members,
           (select count(*) from user_roles) as roles
  `
  )[0];
}

async function main() {
  await seed();
  const first = await snapshot();
  assert.ok(Number(first.prices) > 0, "The first seed should create a price");
  await Promise.all([seed(), seed()]);
  assert.deepEqual(await snapshot(), first);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.end());

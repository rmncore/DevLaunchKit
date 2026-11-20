import { expect, test } from "@playwright/test";

test("production sign-in, admin access, maintenance, and sign-out", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "System dashboard" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN!);
  await page.getByLabel("Password").fill("incorrect-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Sign-in failed" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue(process.env.E2E_ADMIN!);
  await page.getByLabel("Password").fill(process.env.AUTH_PROVISION_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Control Panel" })).toBeVisible();
  await expect(
    page.locator("dt").filter({ hasText: "Active sessions" }).locator("+ dd")
  ).toHaveText("1");

  const member = await browser.newPage({ baseURL: "http://127.0.0.1:3100" });
  await member.goto("/sign-in");
  await member.getByLabel("Email").fill(process.env.E2E_MEMBER!);
  await member.getByLabel("Password").fill(process.env.AUTH_PROVISION_PASSWORD!);
  await member.getByRole("button", { name: "Sign in" }).click();
  await expect(member.getByText(/Signed in as/)).toContainText(process.env.E2E_MEMBER!);
  await member.goto("/admin/users");
  await expect(member.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.goto("/admin/settings");
  const toggle = page.getByRole("switch", { name: "Maintenance mode" });
  const save = page.getByRole("button", { name: "Save Settings" });
  const enabled = toggle.getAttribute("aria-checked");
  expect(await enabled).toBe("false");
  await toggle.click();
  await save.click();
  try {
    await expect(page.getByText("System settings updated successfully.")).toBeVisible();
    await member.goto("/");
    await expect(member.getByRole("heading", { name: "Scheduled maintenance" })).toBeVisible();
    await member.goto("/dashboard");
    await expect(member.getByRole("heading", { name: "Scheduled maintenance" })).toBeVisible();
    await page.reload();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  } finally {
    await page.goto("/admin/settings");
    if ((await toggle.getAttribute("aria-checked")) === "true") {
      await toggle.click();
      await save.click();
      await expect(page.getByText("System settings updated successfully.")).toBeVisible();
    }
  }

  await member.goto("/dashboard");
  await expect(member.getByRole("heading", { name: "Workspace overview" })).toBeVisible();
  await member.close();

  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

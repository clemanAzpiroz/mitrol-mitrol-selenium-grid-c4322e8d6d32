import { test, expect, Page } from "@playwright/test";
import { sleep } from "../test/utils";

test.describe.configure({ mode: "parallel" });

for (let i = 0; i < 1; i++) {
  test(`runs ${[i]}`, async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await page.click("text=Get Started");
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Getting started");
    await sleep(10000);
  });
}

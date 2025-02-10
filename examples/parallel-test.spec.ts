import { test, Page } from "@playwright/test";
import { sleep } from "../utils";

let page: Page;

test.beforeAll(async () => {});

test.afterAll(async () => {});

// test.describe.configure({ mode: 'parallel' });

test("runs first", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await page.click("text=Get Started");
  await sleep(1000);
});

test("runs second", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await page.click("text=Get Started");
  await sleep(1000);
});

import { test, Page, Browser, BrowserContext, expect } from "@playwright/test";
import { sleep, chrome } from "../utils";
import { logIn, seleniumUserListCero } from "../webpad-utils";
import { cambiarEstadoADisponible } from "../omnipad-utils";

const user: string[] = seleniumUserListCero();
let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  browser = await chrome();
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterEach(async () => {
  await context.close();
  await browser.close();
});

test.setTimeout(24 * 60 * 60 * 1000);
test.describe.configure({ mode: "parallel" });

for (let i = 0; i < 100; i++) {
  test("Selenium " + `${i + 1}`.padStart(3, "0"), async () => {
    await page.goto(process.env.OMNIPAD_QA4 || "about.blank/", {
      waitUntil: "load",
    });

    await sleep(500 * i);

    const interval = setInterval(async () => {
      try {
        await expect(page.locator("#logo-aguila")).toBeVisible();
        await logIn(page, user[i]);
        await sleep(1000);
      } catch (err) {
        console.error("Error while logging user: ", user[i]);
      }
      try {
        await page.locator('[data-testid="sidebar-handler-btn"]').click();
        await expect(page.locator('[data-testid="agent-name"]')).toHaveText(
          user[i]
        );

        await cambiarEstadoADisponible(page);
      } catch (err) {
        console.error("Error while changing user's status on user: ", user[i]);
      }
    }, 40 * (1000 + i));
    await sleep(20 * 60 * 1000);
    clearInterval(interval);
  });
}

import { test, Page, Browser, BrowserContext } from "@playwright/test";
import { sleep, chrome, URL } from "../utils";
import { cambiarEstado, logIn, seleniumUserListCero } from "../webpad-utils";

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

for (let i = 0; i < 150; i++) {
  test("Selenium " + `${i + 1}`.padStart(3, "0"), async () => {
    await page.goto(process.env.URL || URL("MITCT") || "about.blank/", {
      waitUntil: "load",
    });

    await sleep(500 * i);

    const interval = setInterval(async () => {
      try {
        if (
          await page
            .locator("#logo-aguila")
            .first()
            .elementHandle({ timeout: 500 })
        ) {
          await logIn(page, user[i]);
          await sleep(1000);
        }
      } catch (err) {}
      try {
        if (
          await page
            .locator("#dropdown1 >> text=No Disponible")
            .first()
            .elementHandle({ timeout: 500 })
        ) {
          await cambiarEstado(page);
        }
      } catch (err) {}
    }, 40 * (1000 + i));
    await sleep(60 * 60 * 1000);
    clearInterval(interval);
  });
}

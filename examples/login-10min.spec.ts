// Usuarios Selenium del 50 al 60
import { test, Page, Browser, BrowserContext } from "@playwright/test";
import { sleep, chrome, URL } from "../utils";
import { cerrarSesion, logIn, seleniumUserList } from "../webpad-utils";

const user: string[] = seleniumUserList();
let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  browser = await chrome();
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterEach(async () => {
  await page.close();
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe.configure({ mode: "parallel" });

for (let i = 0; i < 1; i++) {
  test(`${user[i + 50]}`, async () => {
    await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
      waitUntil: "networkidle",
    });

    await sleep(500 * i);

    await logIn(page, user[i + 50]);
    await sleep(10 * 60 * 1000);

    await cerrarSesion(page);
  });
}

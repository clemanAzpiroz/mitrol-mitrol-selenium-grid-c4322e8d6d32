import { Browser, BrowserContext, Page, test, expect } from "@playwright/test";
import { seleniumUserList, logIn } from "../webpad-utils";
import { chrome, sleep } from "../utils";
import { cambiarEstadoADisponible, cerrarSesion } from "../omnipad-utils";

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
  await context.close();
  await browser.close();
});

test.describe.configure({ mode: "parallel" });

for (let i = 1; i < 11; i++) {
  test("Agente: Selenium " + `${i}`, async () => {
    await page.goto(process.env.OMNIPAD_QA4 || "about.blank/", {
      waitUntil: "networkidle",
    });

    await expect(page.locator("#logo-aguila")).toBeVisible();
    await sleep(500 * i);
    await logIn(page, user[i]);

    await page.locator('[data-testid="sidebar-handler-btn"]').click();

    await expect(page.locator('[data-testid="agent-name"]')).toHaveText(
      user[i]
    );

    await cambiarEstadoADisponible(page);

    await expect(
      page.locator('[data-testid="agent-current-status"]')
    ).toHaveText("Disponible");

    await page
      .locator('[data-testid="agent-status-selector-uncollapsed"]')
      .click();

    await cerrarSesion(page);
  });
}

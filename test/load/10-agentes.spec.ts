// Usuarios de Selenium del 30 al 40
import { expect, test, Page, Browser, BrowserContext } from "@playwright/test";
import { sleep, chrome, URL } from "../utils";
import {
  cambiarEstado,
  cerrarSesion,
  logIn,
  seleniumUserList,
} from "../webpad-utils";

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

for (let i = 0; i < 10; i++) {
  test("Agente: Selenium " + `${i + 30}`.padStart(3, "0"), async () => {
    await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
      waitUntil: "networkidle",
    });

    // Web correcta
    await expect(page.locator("#logo-aguila")).toBeVisible();

    await sleep(500 * i);

    // Enviando usuario y contraseña
    await logIn(page, user[i + 30]);

    // Chequeo inicio sesión correcto.
    await expect(page.locator("span.user-name.ng-binding")).toHaveText(
      user[i + 30]
    );

    // Cambio de estado
    await cambiarEstado(page);

    await expect(
      page.locator("span.user-current-status.agent-status-available")
    ).toHaveText("Disponible");

    // Log Out
    await cerrarSesion(page);
  });
}

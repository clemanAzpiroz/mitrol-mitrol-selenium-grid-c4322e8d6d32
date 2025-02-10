//Usuario selenium 13
require("dotenv").config();
import { test, expect } from "@playwright/test";
import { sleep, URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";
import { chromeBrowser } from "../types";
import { createChrome } from "../utils";

const user: string[] = seleniumUserList();
const usuario = 12;
let chrome: chromeBrowser;

test.beforeEach(async () => {
  chrome = await createChrome({
    contextOptions: { locale: "es-AR" },
  });
});

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "parallel" });

test("Pantalla de mensajes", async () => {
  const page = chrome.page[0];
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);

  //Abriendo funcion mensajes
  await page.locator("a[title='Mensajes']").first().click();
  await expect(page.locator("li.active > a.ng-binding")).toHaveText("Todos");
  await sleep(3 * 1000);

  const elemento = page.locator(".nav.nav-pills.nav-red");
  const pestana = ["Mail", "Sms", "Facebook", "Twitter", "Mensaje Interno"];
  for (let i = 0; i < pestana.length; i++) {
    await elemento
      .locator("li")
      .nth(i + 1)
      .click();
    await expect(await elemento.locator("li.active").innerText()).toEqual(
      pestana[i]
    );

    // Validacion de columnas de estados de mensajes
    await page.locator('h4:has-text("Nuevos")').isVisible();
    await page.locator('h4:has-text("Recibidos")').isVisible();
    await page.locator('h4:has-text("Borradores")').isVisible();
    await page.locator('h4:has-text("Archivados")').isVisible();
    await page.locator('h4:has-text("Enviados")').isVisible();
  }
  await page.locator('[placeholder="Buscar"]').click();
});

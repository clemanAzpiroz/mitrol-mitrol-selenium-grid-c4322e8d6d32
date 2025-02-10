//Usuario selenium 16
require("dotenv").config();
import { test } from "@playwright/test";
import { sleep, URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";
import { chromeBrowser } from "../types";
import { createChrome } from "../utils";

const user: string[] = seleniumUserList();
const usuario = 15;
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

test("Pantalla de pendientes", async () => {
  const page = chrome.page[0];
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);

     await page.pause();
  await page.locator("a[title='Preview']").first().click();

  // Agendar preview y finalizar tarea
  await page
    .locator(
      "#main-view > div.pad-tab-content.container-fluid.padding5.ng-scope.ng-isolate-scope.full-height > div > div.flex-column-box.full-height.col-xs-9 > div:nth-child(1) > div > button:nth-child(3)"
    )
    .first()
    .click();

  await page.locator('#participants:has-text("ejemplo 6")').isVisible();

  await page
    .locator(
      "#interaction-closure > div > div > div > div:nth-child(3) > button"
    )
    .first()
    .click();

  // Ingresar a pestaña de pendientes
  await page.locator("a[title='Pendientes']").first().click();
  await page.locator("text=Seleccionar Campaña").first().click();
  await page.locator("text=PreviewAuto").first().click();
  await page.locator("text=Seleccionar Lote").first().click();
  await page.locator("text=Lote - Selenium11").first().click();



  //await page
  //  .locator(
  //    "#tasks > div.row.ng-scope > div > div > div.contenedorDatosTarea > div.abrirTarea > span > button"
  //  )
  //  .first()
  //  .click();

  //await sleep(1 * 1000);

  await page.locator('#participants:has-text("EJEMPLO 5")').isVisible();
  //await page
  //  .locator(
  //    "#main-view > div.pad-tab-content.container-fluid.padding5.ng-isolate-scope.full-height > div > div.flex-column-box.full-height.col-xs-9 > div:nth-child(1) > div > button:nth-child(3)"
  //  )
  //  .first()
  //  .click();
  //await page
  //  .locator(
  //    "#interaction-closure > div > div > div > div:nth-child(3) > button"
  //  )
  //  .first()
  //  .click();
});

//Usuario selenium 14
require("dotenv").config();
import { test, expect } from "@playwright/test";
import { URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";
import { chromeBrowser } from "../types";
import { createChrome } from "../utils";

const user: string[] = seleniumUserList();
const usuario = 13;
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

test("Pantalla de Llamar", async () => {
  const page = chrome.page[0];
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);

  //Abrir funcion Llamar desde icono
  await page.locator("a[title='Llamar']").first().click();

  //Validacion boton llamada deshabilitado
  const locator = page.locator("#button-video");
  await expect(locator).toBeDisabled();

  //Escritura de numero a llamar
  await page
    .locator(
      "#top > div.modal.fade.ng-isolate-scope.dialogs-default.in > div > div > div > div:nth-child(2) > div > div > div > div.col-xs-7 > input"
    )
    .first()
    .click();
  await page.keyboard.type("12345");

  //Validacion boton llamada habilitado -- TODO revisar tipo de validacion
  await page.locator("#button-video").isVisible();
});

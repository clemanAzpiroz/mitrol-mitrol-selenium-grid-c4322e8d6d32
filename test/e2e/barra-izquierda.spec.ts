// Usuario Selenium 17
require("dotenv").config();
import { test, expect } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, sleep, URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 16;
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

test("Barra-izquierda", async () => {
  const page = chrome.page[0];
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "load",
  });
  page.setDefaultTimeout(50000);

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, users[usuario]);
  // Chequeo inicio sesión correcto.
  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    users[usuario]
  );

  await expect(
    page.locator("span.user-current-status.agent-status-notready")
  ).toHaveText("No Disponible");

  const resultados = page.locator("div.col-sm-12.col-md-6.col-lg-5");
  await expect(resultados).toBeVisible();
  const campanas = page.locator("div.col-sm-12.col-md-12.col-lg-4");
  await expect(campanas).toBeVisible();
  const tiempos = page.locator("div.col-sm-12.col-md-6.col-lg-3");
  await expect(tiempos).toBeVisible();

  await page.locator("a[id='justify-icon']").first().click();

  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    users[usuario]
  );

  await page.locator("a[id='justify-icon']").first().click();

  //Abre la pestana Preview
  await page.locator("a[title='Preview']").first().click();
  await expect(
    page.locator("text=El agente no está asignado a una campaña saliente")
  ).toBeVisible();
  await page.locator("#alertButton").first().click();

  //Abre la pestana Llamar
  await page.locator("a[title='Llamar']").first().click();
  await page
    .locator(".fade.ng-isolate-scope.dialogs-default.in")
    .click({ force: true });

  //Abre la pestana Chatear
  await page.locator("a[title='Chatear']").first().click();
  await expect(page.locator("div.container-fluid.directory.ng-scope"))
    .toBeEditable;

  await expect(page.locator("div.list-group-item.ng-scope")).toContainText;

  //Abre la pestana de Mensaje Interno
  page.keyboard.press("Escape");

  await page.locator("a[title='Mensaje Interno']").first().click();
  await sleep(3 * 1000);
  await expect(page.locator("text=Conectado")).toBeVisible();
  await page
    .locator("button.dropdown-toggle.ng-binding.ng-scope.btn.btn-default")
    .first()
    .click();
  await expect(page.locator("text=Todos")).toBeVisible();
  await expect(page.locator("text=Ninguno")).toBeVisible();
  await expect(
    page.locator("input.form-control.ng-pristine.ng-valid.ng-empty.ng-touched")
  ).toBeEditable;

  //Abre la pestana de Mensajes

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
  }
  await page.locator('[placeholder="Buscar"]').click();

  //Abre la pestana de Pendientes
  await page.locator("a[title='Pendientes']").first().click();
  await expect(page.locator("li.active > a.expandable")).toHaveText(
    "Pendientes"
  );

  //await expect(page.locator("div.inner-addon.left-addon")).toBeEditable;
  //await page.locator("a.btn.btn-primary.pull-right").first().click();
  await expect(
    page.locator("text=Se produjo un error al obtener campañas").first()
  ).toBeVisible();
  await page
    .locator("button#alertButton.btn.btn-primary.ng-binding")
    .first()
    .click();

  //Abre la pestana de Historial
  await page.locator("a[title='Historial']").first().click();
  await expect(page.locator("li.active > a.expandable")).toHaveText(
    "Historial"
  );
  await page.locator("a.btn.btn-primary.pull-right").first().click();
  await expect(page.locator("li.active")).toHaveText("Historial");

  //Abre la pestana de Estadisticas
  await page.locator("a[title='Estadísticas']").first().click();
  await expect(page.locator("li.active > a.expandable")).toHaveText(
    "Estadísticas"
  );
  await expect(resultados).toBeVisible();
  await expect(campanas).toBeVisible();
  await expect(tiempos).toBeVisible();
});

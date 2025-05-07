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
  await page.goto(process.env.URL || URL("OQA4") || "about.blank/", {
    waitUntil: "load",
  });
  page.setDefaultTimeout(50000);

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, users[usuario]);
  
  await page.getByRole("button").nth(1).click();
  // Chequeo inicio sesión correcto.
  await expect(page.locator("text=Selenium17").first()).toBeVisible(); //cuando corrijan lo de mayusc, reemplazar Selenium5 por ${user[index]}
  await expect(page.locator("text=No disponible").nth(0)).toBeVisible();
  await expect(page.locator("text=No disponible").nth(1)).toBeVisible();

  await expect(
    page.locator("div").filter({ hasText: "Resultados de gestión" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Interacciones" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Campañas" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Tiempos" }).nth(3)
  ).toBeVisible();

  //Abre la pestana Preview
  await page.getByTestId("sidebar-preview-btn").click();
  //await expect(
  //  page.locator("text=El agente no está asignado a una campaña saliente")
  //).toBeVisible();
  await page.getByLabel("close").click();

  //Abre la pestana Llamar
  await page.getByTestId("sidebar-call-btn").click();
  await expect(page.getByPlaceholder("Destino")).toBeEditable();
  await page.locator("form").getByRole("button").click();
  await page.pause();
  //Abre la pestana Chatear
  await page.getByTestId("sidebar-chat-btn").click();
  await expect(page.getByPlaceholder("Buscar...")).toBeEditable;
  //page.keyboard.press("Escape"); NO FUNCIONA MAS, REVISAR SI MEJORA
  await page.locator("div.backdrop").click(); //SOLUCION MOMENTANEA
  //Abre la pestana de Mensaje Interno
  /*await page.locator("a[title='Mensaje Interno']").first().click();
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
  */
  //Abre la pestana de Mensajes
  await page.pause();

  await page.locator("a[title='Mensajes']").first().click();
  await expect(page.locator("li.active > a.ng-binding")).toHaveText("Todos");
  await sleep(3 * 1000);

  await page.getByRole("link", { name: "Mensajes" }).click();
  await page.getByRole("button", { name: "Instagram" }).click();
  await page.getByRole("button", { name: "Facebook" }).click();
  await page.getByRole("button", { name: "Twitter" }).click();
  await page.getByRole("button", { name: "Telegram" }).click();
  await page.getByRole("button", { name: "Mail" }).click();
  await page.getByRole("button", { name: "SMS" }).click();
  await page.getByRole("button", { name: "Todos" }).click();
  await expect(page.locator('[placeholder="Buscar"]')).toBeEditable;

  //Abre la pestana de Pendientes
  await page.getByRole("link", { name: "Pendientes" }).click();
  await expect(page.locator("a.w-full.active")).toHaveText("Pendientes");

  await expect(
    page.locator("text=Aun no hay tareas pendientes").first()
  ).toBeVisible();
  await page.getByPlaceholder("Filtrar...").click();

  await expect(
    page.locator("text=Aun no hay tareas pendientes").first()
  ).toBeVisible();
  await page
    .locator("button#alertButton.btn.btn-primary.ng-binding")
    .first()
    .click();

  //Abre la pestana de Historial
  await page.getByRole("link", { name: "Historial" }).click();
  await expect(page.locator("a.w-full.active")).toHaveText("Historial");
  await page.getByRole("button", { name: "Actualizar" }).click();
  await page.getByPlaceholder("Buscar").click();

  //Abre la pestana de Estadisticas
  await page.getByRole("link", { name: "Estadísticas" }).click();
  await expect(page.locator("li.active > a.expandable")).toHaveText(
    "Estadísticas"
  );
  await expect(
    page.locator("div").filter({ hasText: "Resultados de gestión" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Interacciones" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Campañas" }).nth(3)
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: "Tiempos" }).nth(3)
  ).toBeVisible();
});

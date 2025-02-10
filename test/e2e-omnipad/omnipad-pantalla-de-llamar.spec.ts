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
  await page.goto(process.env.URL || URL("OQA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);
  await page.pause();
  //Abrir funcion Llamar desde icono
  await page.getByTestId("sidebar-call-btn").click();

  //Validacion boton llamada deshabilitado
  const locator = page.getByRole("button");
  await expect(locator).toBeDisabled();

  //Escritura de numero a llamar
  await page.getByPlaceholder("Destino").click();
  await page.getByPlaceholder("Destino").press("Enter");
  await page.getByTestId("sidebar-call-btn").click();
  await page.getByPlaceholder("Destino").click();
  await page.getByPlaceholder("Destino").fill("12345");
  await page.locator("form").getByRole("button").click();
});

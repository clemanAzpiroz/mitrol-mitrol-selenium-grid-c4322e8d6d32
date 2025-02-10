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
  await page.getByTestId("sidebar-call-btn").getByRole("img").click();
  await page.getByPlaceholder("Destino").click();
  await page.getByPlaceholder("Destino").fill("91560063663");
  const page1Promise = page.waitForEvent("popup");
  await page.locator("form").getByRole("button").click();
  const page1 = await page1Promise;

  await page.locator(".flex > div:nth-child(2)").first().click();

  await page.locator("div:nth-child(3) > button").first().click();
  await page.locator("div:nth-child(3) > button").first().click();
  await page.locator("div:nth-child(3) > button").first().click();
  await page.locator("div:nth-child(3) > button:nth-child(3)").click();
  await page.locator("div:nth-child(3) > button:nth-child(3)").click();
  await page.locator(".flex > button").first().click();
  await page.getByRole("combobox").selectOption("3");
  await page.getByPlaceholder("Ingrese texto aquí").click();
  await page.getByPlaceholder("Ingrese texto aquí").fill("esto es un ejemplo");
  await page.getByRole("button", { name: "AGREGAR" }).click();
  await page.waitForTimeout(3000);

  await page.locator(".flex > button:nth-child(2)").first().click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "2" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "4" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "6" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "7" }).click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "9" }).click();
  await page.waitForTimeout(3000);
  await page.locator(".flex-1 > div > div > div > button").first().click();
  await page.locator("button:nth-child(3)").first().click();
  await page.getByRole("button", { name: "Finalizar" }).click();
  await page.locator("div:nth-child(3) > button:nth-child(4)").click();
  await page.getByRole("button", { name: "Finalizar" }).click();
  await page.getByText('RESULTADO').click();
  await page.getByText('No Efectivo').click();
  await page.getByRole("button", { name: "Finalizar" }).click();

});

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
  await page.goto(process.env.URL || URL("OQA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);
  await page.getByRole("button").click();

  //Abriendo funcion mensajes
  await page.getByRole("link", { name: "Mensajes" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Todos");
  await sleep(3 * 1000);
  await page.pause();
  await page.getByRole("button", { name: "Instagram" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Instagram");
  await page.getByRole("button", { name: "Instagram" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Todos");

  await page.getByRole("button", { name: "Facebook" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Facebook");

  await page.getByRole("button", { name: "Twitter" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu").nth(1)).toHaveText("Twitter");
  await expect(page.locator(".sc-dhKdcB.gvKlUu").nth(0)).toHaveText("Facebook");

  await page.getByRole("button", { name: "Facebook" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Twitter");

  await page.getByRole("button", { name: "Telegram" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu").nth(0)).toHaveText("Twitter");
  await expect(page.locator(".sc-dhKdcB.gvKlUu").nth(1)).toHaveText("Telegram");

  await page.getByRole("button", { name: "Twitter" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Telegram");

  await page.getByRole("button", { name: "Mail" }).click();
  await page.getByRole("button", { name: "Telegram" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("Mail");

  await page.getByRole("button", { name: "SMS" }).click();
  await page.getByRole("button", { name: "Mail" }).click();
  await expect(page.locator(".sc-dhKdcB.gvKlUu")).toHaveText("SMS");

  await page.getByRole("button", { name: "SMS" }).click();

  // Validacion de columnas de estados de mensajes
  await page.locator('h4:has-text("Nuevos")').isVisible();
  await page.locator('h4:has-text("Recibidos")').isVisible();
  await page.locator('h4:has-text("Borradores")').isVisible();
  await page.locator('h4:has-text("Archivados")').isVisible();
  await page.locator('h4:has-text("Enviados")').isVisible();
});

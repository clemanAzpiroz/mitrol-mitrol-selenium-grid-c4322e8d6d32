require("dotenv").config();
import { test, expect, chromium } from "@playwright/test";
import { sleep, URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";

test.describe.configure({ mode: "parallel" });

test("Pantalla de Llamar y abrir Facebook en otra ventana", async ({
  browser,
}) => {
  // First page (Test Case's main page)
  const context1 = await browser.newContext({ locale: "es-AR" });
  const page1 = await context1.newPage();
  await page1.goto(process.env.URL || URL("OQA4") || "about:blank", {
    waitUntil: "load",
  });

  // Open a second separate browser window
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto(
    "https://qa4.mitrol-intra.net/chat/chat.html?serviceRoute=piloto-chat",
    {
      waitUntil: "load",
    }
  );
  await page2.getByPlaceholder("Ingresa tu nombre").click();
  await page2.getByPlaceholder("Ingresa tu nombre").fill("test automatizado");
  await page2.getByTestId("mitrol-button").click();
  await page1.getByLabel("Usuario").fill("selenium14");
  await page1.getByLabel("Contraseña").fill("selenium14");
  await page1.getByRole("button", { name: "Iniciar sesión" }).click();
  await page1.click(
    "button[class='undefined w-full flex items-center px-3 py-2 justify-center']"
  );
  await page1.getByTestId("status-Disponible").click();
  await sleep(3 * 1000);
  // Close both contexts at the end
  await context1.close();
  await context2.close();
});

test.afterEach(async ({ browser }) => {
  await browser.close();
});

// Iniciando con un usuario y contraseña validos.
// await logIn(page, user[usuario]);
// const page = chrome.page[0];
// await page.goto(process.env.URL || URL("facebook.com") || "about.blank/", {
//   waitUntil: "load",

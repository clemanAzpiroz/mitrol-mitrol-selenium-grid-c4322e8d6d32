// Usuarios Selenium 1 y 2
require("dotenv").config();
import { Page, test } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, sleep } from "../utils";
import {
  cambiarEstadoOmnipad,
  getCallStats,
  InicioDeSesionMultipleOmnipad,
  rtcConnectionCheck,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 150;
let chrome: chromeBrowser;

test.beforeEach(async () => {
  chrome = await createChrome({
    cantidad: 3,
    audio: true,
    contextOptions: { locale: "es-AR" },
  });
});

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "parallel" });

test("Discador Predictivo", async () => {
  // 001 - Discador Predictivo  - 1
  await Promise.all(
    chrome.page.map(async (page, i) => {
      await InicioDeSesionMultipleOmnipad(page, "OQA4", users, usuario + i),
        await cambiarEstadoOmnipad(page);
    })
  );

  const runTestOnPage = async (page) => {
    await page.locator(".flex > div:nth-child(2)").first().click();

    await page.locator("div:nth-child(3) > button").first().click();
    await page.locator("div:nth-child(3) > button").first().click();
    await page.locator("div:nth-child(3) > button").first().click();
    await page.locator("div:nth-child(3) > button:nth-child(3)").click();
    await page.locator("div:nth-child(3) > button:nth-child(3)").click();
    await page.locator(".flex > button").first().click();
    await page.getByRole("combobox").selectOption("3");
    await page.getByPlaceholder("Ingrese texto aquí").click();
    await page
      .getByPlaceholder("Ingrese texto aquí")
      .fill("esto es un ejemplo");
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
    await page.getByText("RESULTADO").click();
    await page.getByText("No Efectivo").click();
    await page.getByRole("button", { name: "Finalizar" }).click();
  };

  await Promise.all([
    runTestOnPage(pages[0]),
    runTestOnPage(pages[1]),
    runTestOnPage(pages[2]),
  ]);

  // Activar el lote de tareas

  // Esperar que el discador comience a marcar

  // Contestar la llamada en el telefono destino

  // Contestar como Operador WebPad, poniendo el mismo en estado disponible

  // ******************************************************************************************************************

  // La interacción esta activa y registrada en base de datos

  // Hay sonido entre Cliente y Agente
  // let stats;
  // const interval = setInterval(async () => {
  //   stats = await getCallStats(page);
  //   console.log(stats);
  //   rtcConnectionCheck(stats.in, stats.out);
  // }, 4 * 1000);

  // Es posible cortar, retener, tranferir y hacer conferencia

  // El corte de llamado es posible tipificar el resultado, ingresar al ID CRM y finalizar la conversacion
  // await colgar(page[1]);

  
});

// Usuarios Selenium 1 y 2
require("dotenv").config();
import { Page, test } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, sleep } from "../utils";
import {
  cambiarEstado,
  getCallStats,
  InicioDeSesionMultiple,
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
      await InicioDeSesionMultiple(page, "QA4", users, usuario + i),
        await cambiarEstado(page);
    })
  );

  await llamarAgente(chrome.page[0], users[usuario + 1]);


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

const llamarAgente = async (page: Page, agente: string) => {
  await page.locator("a[title='Llamar']").first().click();

  const input = page.locator('input[type="tel"]');

  await input.first().type(agente);
  await input.press("Enter");
};

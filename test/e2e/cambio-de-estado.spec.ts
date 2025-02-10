// Usuarios Selenium 18
require("dotenv").config();
import { chromeBrowser } from "../types";
import { test, expect, Page } from "@playwright/test";
import { createChrome, difference, sleep } from "../utils";
import {
  cambiarEstado,
  cerrarSesion,
  InicioDeSesionMultiple,
  logIn,
  obtenerTemporizadorDeTablaTiempos,
  parseStringToSeconds,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 17;
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
test.setTimeout(50 * 1000);

test("Cambio de Estado", async () => {
  const page = chrome.page[0];

  await Promise.all(
    chrome.page.map(
      async (page, i) =>
        await InicioDeSesionMultiple(page, "QA4", users, usuario + i)
    )
  );

  // Estado Inicial
  const status = await page.locator(".user-current-status").innerText();
  expect(status).toContain("No Disponible");
  await testTemporizadorDisponible(page, "No Disponible", 5);

  // Estado Disponible
  await cambiarEstado(page);
  expect(status).toContain("Disponible");
  await testTemporizadorDisponible(page, "Disponible", 5);

  const tiempoOnlineInicial = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, "Login")
  );
  const tiempoOfflineInicial = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, "Desconectado")
  );

  await cerrarSesion(page);

  const t = 10;
  await sleep(t * 1000);
  await logIn(page, users[usuario]);

  // Conectado
  const tiempoOnlineFinal = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, "Login")
  );

  expect(
    difference(tiempoOnlineInicial, tiempoOnlineFinal)
  ).toBeLessThanOrEqual(t + 3);

  // Desconectado
  const tiempoOfflineFinal = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, "Desconectado")
  );
  expect(
    difference(tiempoOfflineInicial, tiempoOfflineFinal)
  ).toBeLessThanOrEqual(t + 4);
});

const testTemporizadorDisponible = async (
  page: Page,
  timer: string,
  t?: number
) => {
  t = t || 3;
  const tiempoUno = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, timer)
  );
  await sleep(t * 1000);
  const tiempoDos = parseStringToSeconds(
    await obtenerTemporizadorDeTablaTiempos(page, timer)
  );
  const d = difference(tiempoUno, tiempoDos);
  expect(d).toBeGreaterThan(0);
  expect(d).toBeLessThanOrEqual(t + 2);
};

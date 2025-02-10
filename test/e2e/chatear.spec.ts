// Usuarios Selenium 1 y 2
require("dotenv").config();
import { test, expect, Page } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, difference, sleep } from "../utils";
import {
  InicioDeSesionMultiple,
  parseStringToSeconds,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
let chrome: chromeBrowser;

test.beforeEach(async () => {
  chrome = await createChrome({
    cantidad: 2,
    contextOptions: { locale: "es-AR" },
  });
});

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "parallel" });

test("Chat", async () => {
  const page = chrome.page;

  // 020 - Chatear - 2
  await Promise.all(
    page.map(
      async (page, i) => await InicioDeSesionMultiple(page, "QA4", users, 0 + i)
    )
  );
  // 020 - Chatear - 4
  await page[1].click("text=Chatear");

  await expect(page[1].locator("#listado")).toBeVisible({
    timeout: 20000,
  });
  expect(await page[1].locator('strong:has-text("Pilotos")')).toBeDefined();
  expect(await page[1].locator("text=Agentes")).toBeDefined();
  expect(
    await page[1].locator('div[data-ng-model="searchText"]')
  ).toBeDefined();

  await page[1].click("text=Selenium1");

  // Desaparecio por el momento -.-
  // await expect(
  //   chrome.page[1].locator("text=selenium1 Chat Iniciado").first()
  // ).toBeVisible();
  // await expect(
  //   chrome.page[0].locator("text=selenium2 Chat Iniciado").first()
  // ).toBeVisible();

  const t = 5;
  const timerInicial = parseStringToSeconds(await timerExtractor(page[0]));
  await sleep(t * 1000);
  const timerFinal = parseStringToSeconds(await timerExtractor(page[0]));
  expect(difference(timerInicial, timerFinal)).toBeGreaterThan(0);
  expect(difference(timerInicial, timerFinal)).toBeLessThan(t + 3);

  // 020 - Chatear - 5
  const btnEnviar = page[1].locator("span.fas.fa-paper-plane").first();

  await btnEnviar.locator("xpath=..").isDisabled();

  await page[1]
    .locator("textarea[placeholder='Escriba su mensaje aquí...']")
    .first()
    .fill(texto);

  await btnEnviar.locator("xpath=..").isEnabled();
  await btnEnviar.click();

  // 020 - Chatear - 6
  await expect(
    page[0].locator("text=1234567890_;:,;[{-}]+´áéíóú'!\"#$%&/()=?¿¡ñ)").first()
  ).toBeVisible();

  // TODO: Chequear timestamp.
});

const texto = `La rueda es un elemento circular y mecánico que gira alrededor  de un eje. Puede ser considerada una máquina simple, y forma parte del conjunto denominado elementos de máquinas.
Es uno de mis tíos fundamentales en la Historia de la humanidad, por su gran utilidad en la elaboración de alfarería, y también en el transporte terrestre, como componente fundamental 
de máquinas. El conocimiento de su origen se pierde en el tiempo, pues nadie sabe quién la inventó   y sus múltiples usos han sido esenciales en el desarrollo del progreso humano: 
como por ejemplo las primeras carreras impulsadas por caballos después siguiendo las máquinas de vapor.
En su forma primitiva, una rueda es un bloque circular de un material duro y duradero en cuyo centro se ha perforado un orificio a través del cual se coloca un cojinete del eje sobre 
el cual gira la rueda cuando se aplica un par motor a la rueda alrededor de su eje. El conjunto de rueda y eje puede considerarse una de las seis máquinas simples. Cuando se coloca verticalmente 
debajo de una plataforma o caja de carga, la rueda que gira sobre el eje horizontal permite transportar cargas pesadas. Esta disposición es el tema principal de este artículo, pero hay muchas otras 
aplicaciones de una rueda que se tratan en los artículos correspondientes: cuando se coloca horizontalmente, la rueda que gira sobre su eje vertical proporciona el movimiento giratorio que 
se utiliza para dar forma a los materiales (por ejemplo, una rueda de alfarero ); cuando está montado en una columna conectada a un timón o al mecanismo de dirección de un vehículo con ruedas, 
puede usarse para controlar la dirección de un barco o vehículo (por ejemplo, el volante de un barco o el volante); cuando se conecta a una manivela o motor, una rueda puede almacenar, 
liberar o transmitir energía (por ejemplo, el volante). Una rueda y un eje con fuerza aplicada para crear torque en un radio puede traducir esto en una fuerza diferente
1234567890_;:,;[{-}]+´áéíóú'!"#$%&/()=?¿¡ñ)`;

const timerExtractor = async (page: Page) => {
  const t = (
    await page.locator(".interaction-timer.ng-isolate-scope").innerText()
  ).trim();
  return "00:" + t;
};

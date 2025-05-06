// Usuarios Selenium 1 y 2
require("dotenv").config();
import { test, expect, Page } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, difference, sleep } from "../utils";
import {
  InicioDeSesionMultiple,
  InicioDeSesionMultipleOmnipad,
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
      async (page, i) =>
        await InicioDeSesionMultipleOmnipad(page, "OQA4", users, 0 + i)
    )
  );
  // 020 - Chatear - 4

  await page[1].getByTestId("sidebar-chat-btn").click();
  //const selector = "h-full w-full pt-[10px] overflow-y-auto";
  //await page[1].waitForSelector(selector, { state: "visible" });

  expect(await page[1].locator('strong:has-text("Pilotos")')).toBeDefined();
  expect(await page[1].locator("text=Agentes")).toBeDefined();
  expect(
    await page[1].locator('div[data-ng-model="searchText"]')
  ).toBeDefined();

  await page[1].click("text=Selenium001");

  // Esperar que el timer arranque desde 00:00:00
  await page[0].waitForFunction(() => {
    const el = document.querySelector('[data-testid="interaction-timer"]');
    return el?.textContent?.trim() === "00:00:00";
  }, null, { timeout: 10000 });

  // Esperar que haya contado al menos 1 segundo
  await page[0].waitForFunction(() => {
    const el = document.querySelector('[data-testid="interaction-timer"]');
    if (!el) return false;
    const [hh, mm, ss] = el.textContent.trim().split(":").map(Number);
    return hh * 3600 + mm * 60 + ss >= 1;
  }, null, { timeout: 10000 });

  const t = 10;
  const timerInicial = parseStringToSeconds(await timerExtractor(page[0]));
  console.log("Timer inicial:", timerInicial);

  await sleep(t * 1000);

  const timerFinal = parseStringToSeconds(await timerExtractor(page[0]));
  console.log("Timer final:", timerFinal);

  expect(difference(timerInicial, timerFinal)).toBeGreaterThan(0);
  expect(difference(timerInicial, timerFinal)).toBeLessThan(t + 3);

  // 020 - Chatear - 5

  const boton = page[1]
  .locator('div')
  .filter({ hasText: /^Chat - InternoEn curso.*Chat Iniciado/ })
  .getByRole('button')
  .nth(4);

  await expect(boton).toBeDisabled();
  await page[1]
    .getByPlaceholder("Mensaje")
    .first()
    .fill(texto);

  await expect(boton).toBeEnabled();
  await boton.click();



  // 020 - Chatear - 6
  await expect(
    page[0].locator("text=una rueda es un bloque circular")
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

//await page[0].pause();

const timerExtractor = async (page: Page) => {
  await page.waitForSelector('[data-testid="interaction-timer"]', {
    state: "visible",
    timeout: 10000,
  });

  const timerElement = await page.$('[data-testid="interaction-timer"]');
  if (!timerElement) throw new Error("No timer element found");

  const timerText = await timerElement.innerText();
  return timerText.trim(); // formato esperado HH:MM:SS
};

//bg-gradient-265-11 py-1 px-2.5 rounded-lg text-white font-bold

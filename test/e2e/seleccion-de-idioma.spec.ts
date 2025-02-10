//Usuario selenium 15
require("dotenv").config();
import { test, expect } from "@playwright/test";
import { URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";
import { chromeBrowser } from "../types";
import { createChrome, sleep } from "../utils";
import { setTimeout } from "timers/promises";

const user: string[] = seleniumUserList();
const usuario = 14;
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

test("Seleccion de idioma", async () => {
  const page = chrome.page[0];
  //   const usuario = 15;
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "load",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);

  await page.locator("#single-button").first().click();

  //Seleccion de idioma portugues
  await page
    .locator(
      "#main-view > div.btn-group.language-selector.ng-scope.dropdown.open > ul > li:nth-child(2) > a"
    )
    .first()
    .click();
  await setTimeout(1000);

  //Cerrar sesion para verifiacion de cambio de idioma
  await page.click("text=Selenium15");

  await page.click("text=Sair");


  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);
  await sleep(5000);

  //Validacion de cambio de idioma en la pagina sobre titulo de cuadra de Campañas y cambio a idioma español
  await expect(
    page.locator("#statistics > div.col-sm-12.col-md-12.col-lg-4 > div > h3")
  ).toHaveText("Campanhas");
  await page.locator("#single-button").first().click();
  await page
    .locator(
      "#main-view > div.btn-group.language-selector.ng-scope.dropdown.open > ul > li:nth-child(1) > a"
    )
    .first()
    .click();
});

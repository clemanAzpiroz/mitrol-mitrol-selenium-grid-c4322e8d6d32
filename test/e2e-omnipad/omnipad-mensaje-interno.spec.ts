// Usuarios Selenium 3 y 4
require("dotenv").config();
import { chromeBrowser } from "../types";
import { test, expect } from "@playwright/test";
import { createChrome, sleep } from "../utils";
import {
  InicioDeSesionMultiple,
  InicioDeSesionMultipleOmnipad,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 2;
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

test.describe.configure({ mode: "serial" });

test("Mensaje Interno", async () => {
  const page = chrome.page;
  //await page.pause();

  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultipleOmnipad(page, "OQA4", users, usuario + i)
    )
  );
  await page[1].pause();
  await page[1].click("text=Mensaje Interno");

  await page[1].click(
    "button[class='dropdown-toggle ng-binding ng-scope btn btn-default']"
  );
  await page[1].click("text=Todos");
  await page[1].click("text=Descartar");

  // 023 - Mensaje Interno - 5
  expect(await page[1].locator("#confirmContent").innerText()).toEqual(
    "¿Desea eliminar este mensaje?"
  );
  expect(await page[1].locator("#confirmCancelButton").innerText()).toEqual(
    "Cancelar"
  );

  const aceptar = page[1].locator("#confirmAcceptButton");
  expect(await aceptar.innerText()).toEqual("Aceptar");
  await aceptar.click();
});

test("Mensaje Interno II", async () => {
  const page = chrome.page;
  // ** Ambos Usuarios **
  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultiple(page, "QA4", users, usuario + i)
    )
  );

  await page[1].click("text=Mensaje Interno");
  await page[1].click(
    "button[class='dropdown-toggle ng-binding ng-scope btn btn-default']"
  );
  await page[1]
    .locator("input[placeholder='Search...']")
    .first()
    .fill(users[usuario]);
  await page[1].locator(`text=${users[usuario]} (${users[usuario]})`).click();

  // 023 - Mensaje Interno - 11
  await page[1]
    .locator("input.form-control.ng-pristine.ng-untouched")
    .first()
    .fill("Asunto Automatizado");
  await page[1]
    .locator("div.ng-pristine.ng-untouched.ng-valid")
    .first()
    .fill("Prueba de texto automatizada!!");

  await page[1].click("text=Enviar");
  expect(await page[1].locator("#confirmContent").innerText()).toEqual(
    "¿Desea enviar el mensaje?"
  );
  await page[1].locator("#confirmAcceptButton").click();
  await sleep(5000);

  await page[0].click("text=Mensajes");

  await page[0].locator("i.fas.fa-redo-alt").first().click();
  await page[0].locator(".list-group-item.ng-scope").first().click();

  // 023 - Mensaje Interno - 12
  await expect(
    page[0].locator(`text=${users[usuario]}@agente.biz`).first()
  ).toBeVisible();
  await expect(
    page[0].locator("text=Prueba de texto automatizada!!").first()
  ).toBeVisible();
});

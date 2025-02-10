// Usuario Selenium 6
require("dotenv").config();
import { test, expect } from "@playwright/test";
import moment from "moment";
import { chromeBrowser } from "../types";
import { createChrome, sleep } from "../utils";
import {
  colgar,
  InicioDeSesionMultiple,
  llamarAgente,
  seleniumUserList,
} from "../webpad-utils";

const user: string[] = seleniumUserList();
let chrome: chromeBrowser;

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "parallel" });

test("No Historial", async () => {
  chrome = await createChrome({
    contextOptions: { locale: "es-AR" },
  });
  const page = chrome.page[0];
  const usuario = 5;

  await InicioDeSesionMultiple(page, "QA4", user, usuario);

  await page.locator("a[title='Historial']").first().click();

  await expect(
    page.locator("text=Aun no hay historial de agente")
  ).toBeVisible();
});

test("Crear y Ver Historial", async () => {
  const usuario = 6;
  chrome = await createChrome({
    cantidad: 2,
    contextOptions: { locale: "es-AR" },
  });
  const page = chrome.page;

  await Promise.all(
    page.map(async (page, i) => {
      await InicioDeSesionMultiple(page, "QA4", user, usuario + i);
    })
  );

  moment().format("ss") > "55" ? await sleep(5000) : "";
  const date = `${moment().format("DD")} de ${moment().format(
    "MMM"
  )}. ${moment().format("HH:mm")}`;

  await expect(page[1].locator("text=Llamar").first()).toBeVisible({
    timeout: 20000,
  });

  await llamarAgente(page[1], `${user[usuario]}`);

  await sleep(5000);
  await colgar(page[1]);
  await sleep(5000);

  await page[0].locator("a[title='Historial']").first().click();
  await expect(
    page[0].locator(`text=${user[usuario]} ${user[usuario]}`).first()
  ).toBeVisible();
});

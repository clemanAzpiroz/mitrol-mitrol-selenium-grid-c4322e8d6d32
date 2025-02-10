// Usuario Selenium 6
require("dotenv").config();
import { test, expect } from "@playwright/test";
import moment from "moment";
import { chromeBrowser } from "../types";
import { createChrome, sleep } from "../utils";
import {
  colgar,
  InicioDeSesionMultiple,
  InicioDeSesionMultipleOmnipad,
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

  await InicioDeSesionMultipleOmnipad(page, "OQA4", user, usuario);
  await page.getByRole("button").click();
  await page.getByRole("link", { name: "Historial" }).click();

  /*  await expect(
    page.locator("text=Aun no hay historial de agente")
  ).toBeVisible();*/
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
      await InicioDeSesionMultipleOmnipad(page, "OQA4", user, usuario + i);
    })
  );

  moment().format("ss") > "55" ? await sleep(5000) : "";
  const date = `${moment().format("DD")} de ${moment().format(
    "MMM"
  )}. ${moment().format("HH:mm")}`;

  await page[1].getByRole("button").click();

  await expect(page[1].locator("text=Llamada").first()).toBeVisible({
    timeout: 20000,
  });

  await page[1].locator("text=Llamada").first().click();
  await expect(page[1].locator(`text=${user[usuario]}`).first()).toBeVisible({
    timeout: 20000,
  });
  await page[1].click(`text=${user[usuario]}`);
  await sleep(3000);
  await page[0].locator("div:nth-child(3) > button > .p-1\\.5").first().click();

  await sleep(5000);

  const btn = page[1]
    .locator("div:nth-child(3) > button:nth-child(4) > .p-1\\.5")
    .first();
  await sleep(1000);
  await expect(btn).toBeVisible({
    timeout: 20000,
  });
  await sleep(1000);
  await btn.click();
  await sleep(5000);
  await page[1].pause();
  await page[1].getByRole("link", { name: "Historial" }).click();
  await expect(
    page[0].locator(`text=${user[usuario]} ${user[usuario]}`).first()
  ).toBeVisible();
});


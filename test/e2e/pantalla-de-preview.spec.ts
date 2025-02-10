/* eslint-disable no-useless-escape */
// Usuarios Selenium 11 y 12
require("dotenv").config();
import { test, expect, Page } from "@playwright/test";
import { createChrome, sleep, URL } from "../utils";
import { logIn, seleniumUserList } from "../webpad-utils";
import moment from "moment";
import { chromeBrowser } from "../types";

const user: string[] = seleniumUserList();
let chrome: chromeBrowser;
let page: Page;

test.beforeEach(async () => {
  chrome = await createChrome();
  page = chrome.page[0];
});

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "parallel" });

test("Preview sin Camapaña", async () => {
  const usuario = 11;
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "networkidle",
  });

  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[usuario]);

  // Chequeo inicio sesión correcto.
  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    "selenium" + `${usuario + 1}`
  );

  await page.locator("a[title='Preview']").first().click();

  await expect(
    page.locator("text=El agente no está asignado a una campaña saliente")
  ).toBeVisible();
  await page.click("text=Aceptar");

  // TODO Sin tareas Pendientes
});

test("Preview con Camapaña", async () => {
  const usuario = 10;
  await page.goto(process.env.URL || URL("QA4") || "about.blank/", {
    waitUntil: "networkidle",
  });

  // 020 - Preview con campaña - 1
  await logIn(page, user[usuario]);
  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    user[usuario]
  );

  await page.locator("a[title='Preview']").first().click();

  // 020 - Preview con campaña - 2
  await previewDos(page);

  // 020 - Preview con campaña - 3
  await previewTres(page);

  // 020 - Preview con campaña - 4
  await previewCuatro(page);

  // 020 - Preview con campaña - 5
  await previewCinco(page);

  // 020 - Preview con campaña - 6
  await previewSeis(page);

  // 020 - Preview con campaña - 7
  await previewSiete(page);
});

const previewDos = async (page: Page) => {
  // Falta checkear contactos.
  //await page.pause();
  await expect(page.locator("text=Desconocido ").first()).toBeVisible({
    timeout: 30000,
  });
  const text = (
    await page
      .locator(".clickable.ng-scope.active")
      .locator("span")
      .first()
      .innerText()
  ).valueOf();
  expect(text).toContain("Desconocido");
};

const previewTres = async (page: Page) => {
  const btn = page.locator(".btn.btn-default.form-control").first();
  await btn.click();

  await page.locator('input[placeholder="Buscar"]').first().fill("e");

  const typifications = ["Exitoso", "No Exitoso", "No Efectivo", "Neutro"];
  const div = await page
    .locator('div[typifications="typifications"]')
    .locator("li");
  for (let i = 0; i < typifications.length; i++) {
    expect(await div.nth(i).innerText()).toEqual(typifications[i]);
  }

  await page.locator('input[placeholder="Buscar"]').first().fill("Otro");
  expect(await div.nth(0).innerText()).toEqual("Otro");
  await div.nth(0).locator("div").click();

  await btn.click();
  await page.click(".ng-binding.closure-notSelected");
  expect(await btn.innerText()).toContain("No Seleccionado");
};

const previewCuatro = async (page: Page) => {
  await page.locator('uib-tab-heading[title="Historial"]').first().click();
  await expect(
    page.locator("text=Aún no hay historial de interacciones")
  ).toBeVisible();
};
const previewCinco = async (page: Page) => {
  // TODO: La barra de idioma cubre el boton de Comentarios, remover la barra y cambiar el selector. (WP-1053)
  await page
    .locator("li:nth-child(4) > .ng-binding")
    .first()
    .click({ position: { x: 5, y: 5 } });
  //await page.locator('uib-tab-heading[title="Comentarios"]').first().click();

  await page
    .locator('button[title="Agregar comentario"]')
    .click({ force: true });

  const button = page.locator('button:has-text("Comentar")');
  await button.isDisabled();

  await page
    .locator(".form-control.custom-control.ng-pristine.ng-valid.ng-empty")
    .fill(
      `Test - Comentario: 1234567890_;:,;[{-}]+´áéíóú'!\"#$%&/()=?¿¡ñ) ${moment().format(
        "DD/MM/YY ha"
      )}`
    );

  await button.isEnabled();
  await button.click();

  await sleep(1000);

  expect(
    await page
      .locator("div:nth-child(2) > .col-xs-10 > .input-group")
      .first()
      .innerText()
  ).toContain(
    `Test - Comentario: 1234567890_;:,;[{-}]+´áéíóú'!\"#$%&/()=?¿¡ñ) ${moment().format(
      "DD/MM/YY ha"
    )}`
  );

  await page
    .locator('div[data-ng-show="showComments"] > input')
    .fill("Selenium999");
  expect(
    await page.locator('div[data-ng-hide="record.inicio"]').count()
  ).toEqual(0);
};

const previewSeis = async (page: Page) => {
  await page.locator(".ng-scope > .fa").first().click();
  // TODO: Falta comprobacion de fecha de próximo contacto.
};
const previewSiete = async (page: Page) => {
  const tipoDeNumero = [
    "General",
    "Teléfono Residencial",
    "Teléfono Laboral",
    "Celular Privado",
    "Celular Laboral",
  ];

  const agregarContactoBtn = page.locator(
    "#task-contacts > div:nth-child(4) > button"
  );
  await agregarContactoBtn.click({ force: true });

  const tipoDeNumeroSelector = page.locator("#tipoNumero");
  for (let i = 0; i < tipoDeNumero.length; i++) {
    expect(
      await tipoDeNumeroSelector.locator("option").nth(i).innerText()
    ).toEqual(tipoDeNumero[i]);
  }

  const numeroTelefono = await cargarNuevoContacto(page);

  await page.reload({ waitUntil: "networkidle" });
  await page.locator("a[title='Preview']").first().click();
  await page.locator(".ng-scope > .fa").first().click();

  // Puede que haya que ampliar el timeout, a tener en cuenta si falla.
  await page.click("i.fa.fa-user");

  const locator = page.locator(`text=${numeroTelefono}`);
  await expect(locator).toBeVisible({ timeout: 50000 });
  expect(await locator.count()).toBeGreaterThan(0);

  await agregarContactoBtn.click({ force: true });
  await cargarNuevoContacto(page, numeroTelefono);

  await expect(
    page.locator("text=El numero ingresado ya existe")
  ).toBeVisible();
  await page.click("text=Aceptar");
};

const cargarNuevoContacto = async (
  page: Page,
  numero?: string,
  tipo?: number,
  prio?: number
) => {
  const button = page.locator('button:has-text("Agregar")');
  await button.isDisabled();
  const telefono = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    .sort(() => Math.random() - 0.5)
    .toString()
    .replace(/,/g, "");
  await page.locator("#contacto").fill(`${numero ? numero : telefono}`);
  await page
    .locator("#mensajeFormateado")
    .fill(`Nuevo Contacto Automatizado. ${moment().format("h:m:sa")}`);

  const tipoSelector = page.locator("#tipoNumero");
  await tipoSelector.selectOption({
    index: tipo ? tipo : Math.floor(Math.random() * 5),
  });

  await page
    .locator("#prioridad")
    .fill(`${prio ? prio : Math.floor(Math.random() * 2)}`);

  await button.isEnabled();
  await button.click();

  return telefono;
};

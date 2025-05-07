// Usuario Selenium 5
require("dotenv").config();
import { test, expect, Page } from "@playwright/test";
import { chromeBrowser } from "../types";
import { createChrome, sleep, URL } from "../utils";
import {
  cerrarSesion,
  idiomaQA4,
  logIn,
  seleniumUserList,
} from "../webpad-utils";

const user: string[] = seleniumUserList();
const index = 4;
let version: number;
let chrome: chromeBrowser;
let page: Page;

test.beforeAll(async () => {
  chrome = await createChrome({
    audio: true,
    contextOptions: { locale: "es-AR" },
  });
  page = chrome.page[0];
});

test.beforeEach(async () => {
  await page.goto(process.env.URL || URL("OQA4") || "about.blank/", {
    waitUntil: "networkidle",
  });
  version = await page.locator("#kc-locale").count();
});

test.afterAll(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "serial" });

test("Comprobación de página de inicio", async () => {
  // Landing Comprobation.
  if (version > 0) {
    await expect(page.locator("text=mitrol").first()).toBeVisible();
    await expect(page.locator("text=Usuario").first()).toBeVisible();
    await expect(page.locator("text=Contraseña").first()).toBeVisible();
    await expect(page.locator("text=Seguir conectado").first()).toBeVisible();
    await expect(
      page.locator("text=¿Has olvidado tu contraseña?").first()
    ).toBeVisible();
    await expect(page.locator("#kc-login")).toHaveValue("Iniciar sesión");
  } else {
    await expect(page.locator("#logo-aguila")).toBeVisible();
    await expect(page.locator("h4")).toHaveText("WebPad");
    expect(await page.locator("#username").getAttribute("placeholder")).toEqual(
      "Usuario"
    );
    expect(
      await page.locator("#shown-password").getAttribute("placeholder")
    ).toEqual("Contraseña");
    await expect(page.locator("button#btn-submit")).toHaveText("Ingresar");
  }
});

test("Login in y Login out", async () => {
  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[index]);

  // Chequeo inicio sesión correcto. ${user[index]}
  /*await expect(
    page.locator(
      "span.w-full.h-full.flex.justify-center.items-center.rounded-full.font-semibold.text-black.uppercase.select-none"
    )
  ).toContainText("S5");
  */
  await page.getByRole("button").nth(1).click();
  //await page.click("sidebar-handler-btn");

  await expect(page.locator("text=Selenium5").first()).toBeVisible();//cuando corrijan lo de mayusc, reemplazar Selenium5 por ${user[index]}

  // Cerrando sesion - Abriendo dropdown
  await page.getByRole("button", { name: "No disponible" }).click();
  await page.getByRole("button", { name: "Salir" }).click();

  // Chequeo cierre de sesion correcto
  if (version > 0) {
    await expect(page.locator("text=mitrol").first()).toBeVisible({
      timeout: 20000,
    });
  } else {
    await expect(page.locator("h4")).toHaveText("OMNIPAD");
  }
});

test("Login Invalido y Vacio", async () => {
  const usuario = page.locator("#username").first();
  let pass;
  let btn;

  if (version > 0) {
    pass = page.locator("#password").first();
    btn = page.locator("#kc-login").first();
  } else {
    pass = page.locator("input[placeholder='Contraseña']").first();
    btn = page.locator(".btn-login").first();
  }

  await btn.click();

  // Chequeo error
  await chequeoError(page, version);

  await usuario.fill(user[index]);
  await btn.click();

  // Chequeo error
  await chequeoError(page, version);

  await usuario.fill("");
  await pass.fill(user[index]);
  await btn.click();

  // Chequeo error
  await chequeoError(page, version);

  await usuario.fill(user[index]);
  await pass.fill(user[index + 1]);
  await btn.click();

  // Chequeo error
  await chequeoError(page, version, 2);
});

test.skip("Recordarme en este equipo", async () => {
  await idiomaQA4(page, "Español");
  // Iniciando con un usuario y contraseña validos.
  await logIn(page, user[index], true);
  // TODO: NO FUNCIONA OPCION RECORDARME EN ESTE EQUIPO.
});

const chequeoError = async (page: Page, vers: number, op?: number) => {
  if (vers > 0) {
    await expect(
      page.locator("text=Usuario o contraseña incorrectos.").first()
    ).toBeVisible();
  } else {
    op == 1
      ? /* TODO: Chequear alert "Completa este campo" de angular, no encontré la forma de seleccionarla.
        await expect(
          page.locator("text=Completa este campo").first()
        ).toBeVisible() */
        " "
      : await expect(
          page.locator("text=Bad credentials").first()
        ).toBeVisible();
  }
};

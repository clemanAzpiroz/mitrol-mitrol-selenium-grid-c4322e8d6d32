// import { WebDriver } from "selenium-webdriver";
// import {get, clickByText} from "./utils";
import { Page, expect } from "@playwright/test";
import { sleep, URL } from "./utils";

/*-------------------------------------------------------UTILS--------------------------------------------------------------*/

// selenium1 a selenium200
export const seleniumUserList = () => {
  const user: string[] = [];
  for (let i = 0; i < 200; i++) {
    user[i] = `selenium${i + 1}`;
  }
  return user;
};

// selenium001 a selenium300
export const seleniumUserListCero = () => {
  const user: string[] = [];
  for (let i = 0; i < parseInt(process.env.AGENT_COUNT || "1"); i++) {
    user[i] = "selenium" + `${i + 1}`.padStart(3, "0");
  }
  return user;
};

export const logIn = async (page: any, user: string, remember?: boolean) => {
  await sleep(1000);

  await page.locator("#username").first().fill(user);
  if ((await page.locator("#kc-locale").count()) > 0) {
    await page.locator("#password").first().fill(user);
    remember ? await page.locator("#rememberMe").first().click() : "";
    await page.locator("#kc-login").first().click();
  } else {
    await page.locator("input[placeholder='Contraseña']").first().fill(user);
    remember ? await page.locator("#rememberme-ckeck").first().click() : "";
    await page.locator(".btn-login").first().click();
  }
  await sleep(3000);
};

export const cambiarEstado = async (page: Page) => {
  await page.locator("#agent-status").first().click();
  await page.locator("i.fa.fa-check-circle").first().click();
};
export const cambiarEstadoOmnipad = async (page: Page) => {
  await page.getByRole("button").click();
  await page.getByRole("button", { name: "No disponible" }).click();
  await page.getByTestId("status-Disponible").click();
};
export const cerrarSesion = async (page: Page) => {
  await page.locator("#agent-status").click();
  await sleep(1000);
  await page.click("#sign-out");
};

export const InicioDeSesionMultiple = async (
  page: Page,
  entorno: string,
  userList: string[],
  userIndex: number
) => {
  await page.goto(process.env.URL || URL(entorno) || "about.blank/", {
    waitUntil: "networkidle",
  });
  await logIn(page, userList[userIndex]);
  await sleep(1000);
  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    userList[userIndex]
  );
};

export const InicioDeSesionMultipleOmnipad = async (
  page: Page,
  entorno: string,
  userList: string[],
  userIndex: number
) => {
  await page.goto(process.env.URL || URL(entorno) || "about.blank/", {
    waitUntil: "networkidle",
  });
  await logIn(page, userList[userIndex]);
  await sleep(1000);
  /*await page.getByRole("button").click();
  await expect(page.locator("span.user-name.ng-binding")).toHaveText(
    userList[userIndex]
  );*/ //CAMBIAR ESTO CUANDO NO SAQUEN LA MAYUSCULA DEL NOMBRE DEL OPERADOR
};

export const idiomaQA4 = async (page: Page, idioma: string) => {
  await page.hover("#kc-locale-dropdown");
  await page.click(`text=${idioma}`);
  await sleep(1000);
};

export const enviarMensaje = async (page: Page, texto: string) => {
  await page
    .locator("textarea[placeholder='Escriba su mensaje aquí...']")
    .first()
    .fill(texto);

  await page.locator("span.fas.fa-paper-plane").first().click();
};

export const llamarAgente = async (page: Page, agente: string) => {
  await page.locator("a[title='Llamar']").first().click();
  await expect(page.locator(`text=${agente}`).first()).toBeVisible({
    timeout: 20000,
  });
  await page.click(`text=${agente}`);
  await sleep(3000);
  await page.click("#button-video");
};

export const colgar = async (page: Page) => {
  const btn = page
    .locator("#button-end-call.interaction-action.btn-danger")
    .first();
  await sleep(1000);
  await expect(btn).toBeVisible({
    timeout: 20000,
  });
  await sleep(1000);
  await btn.click();
};

export const obtenerTemporizadorDeTablaTiempos = async (
  page: Page,
  timer: string
) => {
  const timerSinLimpiar = await page
    .locator(`tr >> text=${timer} >> xpath=..`)
    .first()
    .innerText();
  const timerLimpio = timerSinLimpiar.split(timer)[1].trim();
  return timerLimpio;
};

export const parseStringToSeconds = (t: string) => {
  const a = t.split(":");
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  return seconds;
};

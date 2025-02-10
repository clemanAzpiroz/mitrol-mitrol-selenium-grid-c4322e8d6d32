// Usuarios Selenium 3 y 4
require("dotenv").config();
import { chromeBrowser } from "../types";
import { test, expect } from "@playwright/test";
import { createChrome, sleep } from "../utils";
import { InicioDeSesionMultiple, seleniumUserList } from "../webpad-utils";

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
//test("Conferencia", async () => {
test.skip("Conferencia", async () => {
  const page = chrome.page;
  //await page.pause();

  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultiple(page, "QA4", users, usuario + i)
    )
  );

  //Llama cliente
  await page[1].click("text=Llamar");

  await page[1].getByRole("textbox").click();
  await page[1].getByRole("textbox").fill("91560063663");
  await sleep(5000);
  await page[1].click("button#button-video.btn.interaction-action");
  await sleep(5000);
  //Realiza conferencia
  await page[1].click("i.fa.fa-user-plus");
  await page[1].click("text=Selenium3");

  await page[0].click("i.fa.fa-phone");
  await page[1].click("span.expanded-element.ng-binding.expanded-item");
  await expect(
    page[1]
      .locator("button.interaction-action.clickable.ng-isolate-scope")
      .first()
  ).toBeVisible();
  await expect(page[1].locator("text=91560063663").first()).toBeVisible();
  await expect(page[1].locator("text=9103").first()).toBeVisible();
  await expect(page[1].locator("text=Cliente").first()).toBeVisible();
  await expect(page[1].locator("text=Agente").first()).toBeVisible();
  await page[1].click("button#button-end-call.interaction-action.btn-danger");
});

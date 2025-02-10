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
test("Transferencia ciega", async () => {

//test.skip("Transferencia ciega", async () => {
  const page = chrome.page;
  //await page.pause();

  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultiple(page, "QA4", users, usuario + i)
    )
  );
  //Llamada a cliente
  await page[1].click("text=Llamar");

  await page[1].getByRole("textbox").click();
  await page[1].getByRole("textbox").fill("91560063663");
  await sleep(5000);
  await page[1].click("button#button-video.btn.interaction-action");
  //Transferencia ciega a segundo operador
  await page[1].click("i.fa.fa-arrow-right");
  await page[1].click("text=Selenium3");
  await sleep(5000);
  await page[0].click("i.fa.fa-phone");
  await page[0].click("span.expanded-element.ng-binding.expanded-item");
  await expect(
    page[0]
      .locator("button.interaction-action.clickable.ng-isolate-scope")
      .first()
  ).toBeVisible();
  await expect(page[0].locator("text=91560063663").first()).toBeVisible();

  await page[0].click("i.fas.fa-phone-alt");
});

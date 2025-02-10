import {
  test,
  Page,
  Browser,
  BrowserContext,
  chromium,
} from "@playwright/test";
import { sleep } from "../utils";
import { cambiarEstado, logIn, seleniumUserListCero } from "../webpad-utils";
import { testConfig, frecuenciaVariable } from "./test.config";

const user: string[] = seleniumUserListCero();
const launchOptions = {
  chromiumSandbox: false,
  ignoreDefaultArgs: ["--mute-audio"],
  args: [
    "--no-sandbox",
    "--allow-file-access-from-files",
    "--autoplay-policy=no-user-gesture-required",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
};

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  try {
    test.setTimeout(24 * 60 * 60 * 1000);
    browser = await chromium.launch(launchOptions);
    context = await browser.newContext();
    page = await context.newPage();
  } catch {
    console.log("Error al levantar un browser.");
  }
});

test.afterEach(async () => {
  await page.close();
  await context.close();
  await browser.close();
});
test.setTimeout(24 * 60 * 60 * 1000);

test.describe.configure({ mode: "parallel" });

for (let i = 0; i < testConfig.workers; i++) {
  test("Selenium " + `${i + 1}`.padStart(3, "0"), async () => {
    await page.goto(testConfig.url);

    await sleep(500 * i);

    const interval = setInterval(async () => {
      try {
        if (
          await page
            .locator("#logo-aguila")
            .first()
            .elementHandle({ timeout: 500 })
        ) {
          await logIn(page, user[299]);
          await sleep(10000);
        }
      } catch (err) {}
      try {
        if ((await page.locator(".ng-binding.ng-scope").count()) == 0) {
          await page.reload();
        }
      } catch (err) {}
      try {
        if (
          await page
            .locator("#dropdown1 >> text=No Disponible")
            .first()
            .elementHandle({ timeout: 500 })
        ) {
          await cambiarEstado(page);
        }
      } catch (err) {}
    }, testConfig.frecuenciaFija || frecuenciaVariable(i));
    await sleep(testConfig.duracion || 1000);
    clearInterval(interval);
  });
}

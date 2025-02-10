 // lanzamiento yarn custom -l -w 1 -t omn-carga-variable.spec.ts
 import {
   test,
   Page,
   Browser,
   chromium,
   BrowserContext,
 } from "@playwright/test";
 import { sleep } from "../utils";
 import { logIn, seleniumUserListCero } from "../webpad-utils";
 import { cambiarEstadoADisponible } from "../omnipad-utils";
 import { testConfig, frecuenciaVariable } from "./omn-test.config";
 const user: string[] = seleniumUserListCero();
 const launchOptions = {
   headless: true,
   chromiumSandbox: false,
   ignoreDefaultArgs: ["--mute-audio"],
   args: [
     "--allow-file-access-from-files",
     "--autoplay-policy=no-user-gesture-required",
     "--use-fake-device-for-media-stream",
     "--use-fake-ui-for-media-stream",
     `--use-file-for-fake-audio-capture=${process.env.AUDIODIR}`,
   ],
 };

 let browser: Browser;
 let context: BrowserContext;
 let page: Page;
 test.setTimeout(24 * 60 * 60 * 1000);
 test.afterEach(async () => {
   if (browser) {
     await context.close();
     await browser.close();
   }
 });
 test.afterAll(async () => {
   if (browser) {
     await browser.close();
   }
 });
 test.describe.configure({ mode: "parallel" });
 for (let i = 0; i < testConfig.workers; i++) {
   test("Selenium " + `${i + 1}`.padStart(3, "0"), async () => {
     try {
       await sleep(100 * i);
       browser = await chromium.launch(launchOptions);
       context = await browser.newContext();
       page = await context.newPage();
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
             await logIn(page, user[i]);
             await sleep(1000);
           }
         } catch {}
         try {
           //await page.pause()//pausa de test
           await page.locator('[data-testid="sidebar-handler-btn"]').click();
           await cambiarEstadoADisponible(page);
         } catch {}
       }, testConfig.frecuenciaFija || frecuenciaVariable(i));
       await sleep(testConfig.duracion || 1000);
       clearInterval(interval);
     } catch {
       console.log("Error - Selenium " + `${i + 1}`.padStart(3, "0"));
     }
   });
 }

import { expect, test } from "@playwright/test";
import { get, sleep } from "../utils";
import { cambiarEstado, logIn, seleniumUserListCero } from "../webpad-utils";

const user: string[] = seleniumUserListCero();

for (let i = 0; i < 10; i++) {
  test(`${i}`, async ({ page }) => {
    await page.goto("http://google.com" || "http://about.blank/", {
      waitUntil: "domcontentloaded",
    });
    const btn = await page.locator("text=English").first();
    expect(await btn.innerText()).toBe("English");
    await btn.click();
  });
}

// for (let i = 0; i < 150; i++) {
//   test(`${i}`, async ({ page }) => {
//     await page.goto("http://google.com" || "http://about.blank/", {waitUntil: "domcontentloaded"});

//     let interval = setInterval(async () => {
//       try {
//         if (await get(page, "#logo-aguila", 500)) {
//           await logIn(page, user[i]);
//           await sleep(3 * 1000);
//         }
//       } catch (err) {}
//       try {
//         if (await get(page, "#dropdown1 >> text=No Disponible", 500)) {
//           await cambiarEstado(page);
//         }
//       } catch (err) {}
//     }, 45 * 1000);

//     await sleep(5 * 1000 * 60);
//     clearInterval(interval);
//   });
// }

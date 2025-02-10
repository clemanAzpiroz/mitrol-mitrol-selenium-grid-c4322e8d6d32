import { BrowserContext, expect, Page, test } from "@playwright/test";
import { Context, isContext } from "vm";
import { chrome, chromeContext, get, sleep } from "../utils";

// // getStats();
// const getstats = async (driver: Context) => {
//   try {
//     return await driver.executeAsyncScript(`
//       pc1.getStats("#localVideo").then(stats => {
//       var entries = [];
//       stats.forEach(rep =>  entries.push(rep));
//       var callback = arguments[arguments.length - 1];
//       callback(entries);
//       });
//   `);
//   } catch (err) {
//     return 0;
//   }
// };

// // Filtro de Stats
// const filter = async (stats: any = {}, type: string) => {
//   const item: any = {};
//   for (let i = 0; i < stats.length; i++) {
//     if (stats[i].type === type) {
//       item.timestamp = stats[i].timestamp;
//       item.id = stats[i].id;
//       item.type = stats[i].type;
//       item.bytesSent = stats[i].bytesSent;
//     }
//   }
//   return item;
// };

const result: any = {};

for (let i = 0; i < 1; i++) {
  test(`${i}`, async ({}) => {
    const context = await chromeContext();
    const page = await context.newPage();

    await page.goto(
      "https://webrtc.github.io/samples/src/content/peerconnection/audio/"
    );

    // Creando sesion WebRTC
    await (await get(page, "#callButton")).click();
    await sleep(1000);
    //await page.evaluate(() => window.monaco.editor.getModel(monaco.Uri.parse("")).setValue(' + someJavaScriptCode + '));

    const interval = setInterval(async () => {
      const show = await page.evaluate(() => {
        `
            pc1.getStats("#localVideo").then(stats => {
            var entries = [];
            stats.forEach(rep =>  entries.push(rep));
            var callback = arguments[arguments.length - 1];
            callback(entries);
            });
          `;
      });
      console.log(show);
    }, 3500);

    await sleep(30 * 1000);
    clearInterval(interval);

    // result[result.length - 1] < 0.0005
    //   ? console.info(`NICE`)
    //   : console.info(`BAD`);

    // await expect(result[result.length - 1]).toBeLessThan(1);
  });
}

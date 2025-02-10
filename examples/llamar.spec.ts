// Usuario Selenium 6
require("dotenv").config();
import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { createChrome, sleep } from "../utils";
import { InicioDeSesionMultiple, seleniumUserList } from "../webpad-utils";

const user: string[] = seleniumUserList();
let chrome: {
  browser: Browser[];
  context: BrowserContext[];
  page: Page[];
};

test.afterEach(async () => {
  // await Promise.all(
  //   chrome.browser.map(async (browser) => await browser.close())
  // );
});

test.setTimeout(300 * 1000);
test.describe.configure({ mode: "parallel" });

test.only("Llamar1", async () => {
  const usuario = 12;
  chrome = await createChrome();
  await Promise.all(
    chrome.page.map(async (page, i) => {
      await InicioDeSesionMultiple(page, "QA4", user, usuario + i);
    })
  );

  await expect(chrome.page[0].locator("text=Llamar").first()).toBeVisible({
    timeout: 20000,
  });
  await chrome.page[0].locator("a[title='Llamar']").first().click();
  await sleep(3000);
  await chrome.page[0].click(`text=${user[usuario - 1]}`);
  await chrome.page[0].click("#button-video");

  await sleep(45000);

  await expect(
    chrome.page[0].locator("#button-end-call").first()
  ).toBeVisible();

  await chrome.page[0].click("#button-end-call");
});

/* PRUEBAS DE TESTEO DE LLAMADAS */

const getstats = (page: Page) => {
  return page.evaluate(async () => {
    const stats2 = await _RTCPeerConnection.peerConnection
      .getStats()
      .then((stats: any) => {
        const entries: any = [];
        stats.forEach((rep: any) => entries.push(rep));
        return entries;
      });
    return stats2;
  });
};

// Filtro de Stats
const filter = async (stats: any = {}, type: string) => {
  const item: any = {};
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].type === type) {
      item.timestamp = stats[i].timestamp;
      item.id = stats[i].id;
      item.type = stats[i].type;
      item.jitter = stats[i].jitter;
      item.roundTripTime = stats[i].roundTripTime;
      item.packetsLost = stats[i].packetsLost;
    }
  }
  return item;
};
test("Llamar", async () => {
  const usuario = 12;
  chrome = await createChrome();
  await Promise.all(
    chrome.page.map(async (page, i) => {
      await InicioDeSesionMultiple(page, "QA4", user, usuario + i);
    })
  );

  await expect(chrome.page[0].locator("text=Llamar").first()).toBeVisible({
    timeout: 20000,
  });
  await chrome.page[0].locator("a[title='Llamar']").first().click();
  await sleep(3000);
  await chrome.page[0].click(`text=${user[usuario - 1]}`);
  await chrome.page[0].click("#button-video");
  await sleep(3000);

  const interval = setInterval(async () => {
    try {
      return chrome.page[0].evaluate(async () => {
        console.info(await window.peerConnections);
      });
    } catch (err) {}
  }, 4 * 1000);

  await sleep(300 * 1000);
  clearInterval(interval);

  await chrome.page[0].click("#button-end-call");
});

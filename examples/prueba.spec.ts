/* eslint-disable prettier/prettier */
import { Page, test } from "@playwright/test";
import { get, getRTCStats, sleep, statsFilter } from "../test/utils";
import { logIn } from "../test/webpad-utils";

const getstats = (page: Page) => {
  return page.evaluate(async () => {
    const stats2 = await pc1.getStats().then((stats: any) => {
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

test.only(`123`, async ({ page }) => {
  await page.goto(
    "https://webrtc.github.io/samples/src/content/peerconnection/audio/"
  );

  // Creando sesion WebRTC
  await (await get(page, "#callButton")).click();
  await sleep(1000);

  const interval = setInterval(async () => {
    const asd = await getRTCStats(page, "pc1");
    // console.info(asd[1]);
    const info = await statsFilter(asd[1], "remote-inbound-rtp");

    console.info(info);
  }, 3 * 1000);

  await sleep(120 * 1000);
  clearInterval(interval);
});

// https://gist.github.com/leader22/eeed1860042ebbcbf7b030181cbeffdc

const getMitrolAPI = (page: Page) => {
  return page.evaluate(() => {
    return mitrol.WebPadApiClient.CallState;
  });
};
//WebPadApiClient.CallState
test("Test Api Mitrol", async ({ page }) => {
  await page.goto("https://mitct-int-web-ar.mitrol.net/webpad/login");

  await logIn(page, "selenium155");

  const interval = setInterval(async () => {
    console.log(await getMitrolAPI(page));
  }, 10 * 1000);

  await sleep(300 * 1000);
  clearInterval(interval);
});

/*
window.interactions = [];

mitrol.WebPadApiClient.onInteractionCreated = function (interaction) => {
  // agregar a interactions
}
mitrol.WebPadApiClient.onInteractionUpdated = function (interaction) => {
  // actualizar interactions
}
mitrol.WebPadApiClient.onInteractionEnded = function (interaction) => {
  // borrar de interactions
}
 */

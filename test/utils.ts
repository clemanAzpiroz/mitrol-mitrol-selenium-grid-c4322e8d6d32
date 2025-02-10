/* eslint-disable indent */
require("dotenv").config();
import { Page, Browser, chromium } from "@playwright/test";
import { chromeBrowser, createChromeOptions } from "./types";

const audioDir = `${process.env.AUDIODIR}`;
const defaultTimeout = 15000;

export const URL = (ENV?: string): string => {
  if (process.env.URL) {
    return process.env.URL;
  }
  switch (ENV) {
    case "OQA4":
      return process.env.OMNIPAD_QA4 || "about:blank/";
    case "QA4":
      return process.env.WEBPAD_QA4 || "about:blank/";
    case "DEVOPS":
      return process.env.WEBPAD_DEVOPS || "about:blank/";
    case "MITCT":
      return process.env.WEBPAD_MITCT || "about:blank/";
    default:
      return "about:blank/";
  }
};

export const chrome = async (): Promise<Browser> => {
  return await chromium.launch({
    chromiumSandbox: false,
    ignoreDefaultArgs: ["--mute-audio"],
    args: [
      "--no-sandbox",
      "--allow-file-access-from-files",
      "--autoplay-policy=no-user-gesture-required",
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
      `--use-file-for-fake-audio-capture=${process.env.AUDIODIR}`,
      "--enable-usermedia-screen-capturing",
      "--auto-select-desktop-capture-source=Screen 1",
    ],
  });
};

export const createChrome = async (
  options?: createChromeOptions
): Promise<chromeBrowser> => {
  let fakeAudio = "--character";
  options?.audio
    ? (fakeAudio = `--use-file-for-fake-audio-capture=${audioDir}`)
    : "";

  const launchOptions = {
    chromiumSandbox: false,
    ignoreDefaultArgs: ["--mute-audio"],
    args: [
      "--no-sandbox",
      "--allow-file-access-from-files",
      "--autoplay-policy=no-user-gesture-required",
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
      `${fakeAudio}`,
    ].concat(options?.otherArgs || "--character"),
  };

  const browser = await Promise.all(
    Array.from({ length: options?.cantidad || 1 }, async () => {
      return await chromium.launch(launchOptions);
    }) //crear un array de los context
  );
  const context = await Promise.all(
    browser.map(
      async (browser) => await browser.newContext(options?.contextOptions)
    )
  );
  const page = await Promise.all(
    context.map(async (context) => await context.newPage())
  );

  return { browser: browser, context: context, page: page };
};

export const sleep = async (ms: number) => {
  await new Promise(async (resolve) => setTimeout(resolve, ms));
};

export const getRTCStats = async (page: Page, pcId: any) => {
  return page.evaluate(
    async ([id]: any) => {
      const entries: any = [];
      const conState: any = await eval(`${id}.connectionState`);
      const stats: any = await eval(`${id}.getStats()`);
      await stats.forEach((rep: any) => entries.push(rep));
      return [conState, entries];
    },
    [pcId]
  );
};

// Provisorio, modificar acorde a lo que se necesite cuando se acceda a la api de webpad
export const statsFilter = async (stats: any = {}, type: string) => {
  const filter: any = [];
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].type === type) {
      filter.timestamp = stats[i].timestamp;
      filter.id = stats[i].id;
      filter.type = stats[i].type;
      filter.jitter = stats[i].jitter;
      filter.roundTripTime = stats[i].roundTripTime;
      filter.packetsLost = stats[i].packetsLost;
    }
  }
  return filter;
};

export const get = async (
  page: Page,
  selector: string,
  ms?: number
): Promise<any> =>
  await page
    .locator(selector)
    .first()
    .elementHandle({ timeout: ms || defaultTimeout });

export const getByText = async (page: Page, text: string) =>
  page.locator(`text=${text}`).first();

export const click = async (page: Page, selector: string, ms?: number) => {
  const found = await page.locator(selector).first();
  await found.click({ timeout: ms || defaultTimeout });
};

export const difference = (tI: number, tF: number) => {
  if (tI <= tF) {
    const dif = tF - tI;
    return dif;
  } else {
    return tI - tF;
  }
};

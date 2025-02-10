require("dotenv").config();
import { chromeBrowser } from "../types";
import { test, expect } from "@playwright/test";
import { sleep } from "../utils";
import {
  cambiarEstadoOmnipad,
  InicioDeSesionMultipleOmnipad,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 11;
let chrome: chromeBrowser;

test.beforeEach(async () => {
  const { chromium } = require("@playwright/test");

  // Launch Chrome Beta with WebRTC settings
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe",
    headless: false,
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--enable-blink-features=WebRTC-HW-H264-Encoding",
    ],
  });

  // Create separate contexts for two different users
  const context1 = await browser.newContext({ locale: "es-AR" });
  const context2 = await browser.newContext({ locale: "es-AR" });

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  chrome = {
    browser: [browser],
    context: [context1, context2],
    page: [page1, page2],
  };
});

test.afterEach(async () => {
  await Promise.all(chrome.browser.map(async (browser) => await browser.close()));
});

test.describe.configure({ mode: "serial" });

test("Llamadas con Audio WebRTC", async () => {
  const page = chrome.page;

  // Login both users
  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultipleOmnipad(page, "OQA4", users, usuario + i)
    )
  );

  // Change status to available
  await page[1].click("button[class='undefined w-full flex items-center px-3 py-2 justify-center']");
  await page[1].getByTestId("status-Disponible").click();
  await page[0].click("button[class='undefined w-full flex items-center px-3 py-2 justify-center']");
  await page[0].getByTestId("status-Disponible").click();

  // Start the call
  await sleep(5000);
  await page[0].getByTestId("sidebar-call-btn").click();
  await sleep(5000);
  await page[0].getByTestId("input-destination-modal").click();
  await sleep(3000);
  await page[0].getByTestId("input-destination-modal").fill("91560063663");
  await sleep(3000);
  await page[0].getByTestId("input-destination-modal").press("Enter");

  await sleep(10000); // Ensure call is fully connected

  // **Capture & Analyze Audio Using Web Audio API on page[0]**
  const isAudioPlaying = await page[0].evaluate(async () => {
    return new Promise((resolve) => {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const buffer = new Uint8Array(analyser.frequencyBinCount);

        // Capture all audio elements on the page
        const mediaElements = [...document.querySelectorAll("audio, video")];

        if (mediaElements.length === 0) {
          console.warn("❌ No audio elements found on the page.");
          resolve(false);
          return;
        }

        console.log(`✅ Found ${mediaElements.length} audio/video elements.`);

        // Create audio sources for each media element
        mediaElements.forEach((element) => {
          const source = audioContext.createMediaElementSource(element as HTMLMediaElement);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        });

        // Wait and analyze frequency data
        setTimeout(() => {
          analyser.getByteFrequencyData(buffer);
          const hasAudio = buffer.some((value) => value > 0);

          if (hasAudio) {
            console.log("🔊 Audio detected in system output!");
            resolve(true);
          } else {
            console.warn("❌ No audio detected in system output.");
            resolve(false);
          }
        }, 5000);
      } catch (error) {
        console.error("⚠️ Audio detection failed:", error);
        resolve(false);
      }
    });
  });

  console.log("WebRTC System Audio Active:", isAudioPlaying);
  expect(isAudioPlaying).toBeTruthy();
});

//Usuarios 12 y 13
require("dotenv").config();
import { chromeBrowser } from "../types";
import { test, expect } from "@playwright/test";
import { createChrome, sleep } from "../utils";
import {
  cambiarEstadoOmnipad,
  InicioDeSesionMultiple,
  InicioDeSesionMultipleOmnipad,
  logIn,
  seleniumUserList,
} from "../webpad-utils";

const users: string[] = seleniumUserList();
const usuario = 11;
let chrome: chromeBrowser;

test.beforeEach(async () => {
  const { chromium } = require("@playwright/test");

  // Launch the browser
  const browser = await chromium.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe", // Path to Chrome Beta
    headless: false, // Set to true for headless mode
  });

  // Create two separate contexts (one for each window)
  const context1 = await browser.newContext({ locale: "es-AR" });
  const context2 = await browser.newContext({ locale: "es-AR" });

  // Create one page in each context (separate windows)
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  chrome = {
    browser: [browser],
    context: [context1, context2],
    page: [page1, page2],
  };
});

test.afterEach(async () => {
  await Promise.all(
    chrome.browser.map(async (browser) => await browser.close())
  );
});

test.describe.configure({ mode: "serial" });

test("Llamadas", async () => {
  const page = chrome.page;
  test.setTimeout(180000);
  // Each page is now in a separate browser window
  await Promise.all(
    page.map(
      async (page, i) =>
        await InicioDeSesionMultipleOmnipad(page, "OQA4", users, usuario + i)
    )
  );
  await page[1].click(
    "button[class='undefined w-full flex items-center px-3 py-2 justify-center']"
  );
  await page[1].getByTestId("status-Disponible").click();
  await page[0].click(
    "button[class='undefined w-full flex items-center px-3 py-2 justify-center']"
  );
  await page[0].getByTestId("status-Disponible").click();
  page[0].pause();
  await sleep(3 * 1000);
  await page[0].getByTestId("sidebar-call-btn").click();
  await sleep(3 * 1000);
  await page[0].getByTestId("input-destination-modal").click();
  await sleep(3 * 1000);
  await page[0].getByTestId("input-destination-modal").fill("91560063663");
  await sleep(3 * 1000);
  await page[0].locator("form").getByRole("button").click();
  await sleep(20 * 1000);
  // Obtener el elemento de video WebRTC
  const videoElement = await page[0].$("#webrtc");
  if (!videoElement) {
    throw new Error("No se encontró el elemento de video webrtc");
  }
  // Verificar si el elemento de video tiene un stream con pistas de audio
  const hasAudioTracks = await page[0].evaluate(() => {
    const video = document.getElementById("webrtc");
    const stream = video?.srcObject;
    if (stream && stream.getAudioTracks().length > 0) {
      return true;
    } else {
      return false;
    }
  });
  // Asegurarse de que las pistas de audio están presentes
  expect(hasAudioTracks).toBe(true);

  // Evaluar en el contexto de la página para analizar el audio
  const audioAnalysisResult = await page[0].evaluate(() => {
    return new Promise((resolve) => {
      const video = document.getElementById("webrtc");
      if (!video) {
        resolve("No se encontró el elemento de video");
        return;
      }
      const stream = video.srcObject;
      if (!stream) {
        resolve("No se encontró el stream");
        return;
      }
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        resolve("No se encontraron pistas de audio");
        return;
      }

      // Configurar el contexto de audio y el procesador
      const audioContext = new AudioContext({ sampleRate: 8000 });
      const processorNode = audioContext.createScriptProcessor(2048, 1, 1);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(processorNode);
      processorNode.connect(audioContext.destination); // Necesario en algunos navegadores

      let windowsProcessed = 0;
      let maxRMS = 0;
      const rmsValues = [];

      processorNode.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputBuffer.length; i++) {
          sum += inputBuffer[i] * inputBuffer[i];
        }
        const rms = Math.sqrt(sum / inputBuffer.length);

        // Multiplicar RMS por 1000 y limitar a 2 decimales
        const rmsFormatted = parseFloat((rms * 1000).toFixed(2));
        rmsValues.push(rmsFormatted);

        // Mantener el valor máximo de RMS
        if (rmsFormatted > maxRMS) {
          maxRMS = rmsFormatted;
        }

        windowsProcessed++;
        console.log(`Ventana ${windowsProcessed}: RMS = ${rmsFormatted}`);

        // Detener después de 20 segundos (~8000Hz * 20s / 2048 muestras por ventana)
        if (windowsProcessed >= (8000 * 20) / 2048) {
          processorNode.disconnect();
          source.disconnect();
          audioContext.close();
          resolve({ maxRMS, rmsValues });
        }
      };
    });
  });

  // Esperar 20 segundos para recopilar los datos
  await page[0].waitForTimeout(20000);

  // Mostrar los valores RMS obtenidos
  console.log(
    "Valores RMS obtenidos durante 20 segundos:",
    audioAnalysisResult.rmsValues
  );

  // Asegurarse de que se obtuvieron valores RMS
  expect(audioAnalysisResult.rmsValues.length).toBeGreaterThan(0);

  // Calcular la suma total de RMS y el promedio
  const rmsValues = audioAnalysisResult.rmsValues;
  const totalRMS = rmsValues.reduce((sum, value) => sum + value, 0);
  const averageRMS = totalRMS / rmsValues.length;
  const averageRMSFormatted = parseFloat(averageRMS.toFixed(2));

  // Determinar si la llamada fue muda o no
  const callStatus =
    averageRMSFormatted < 14.9
      ? "esta llamada FUE MUDA"
      : "esta llamada NO FUE MUDA";
  console.log(callStatus);

  await sleep(10 * 1000);
  await page[1].getByTestId("answer-call").click();
  await page[1].locator("div:nth-child(4) > .p-1\\.5").click();
  await page[1].locator("div:nth-child(4) > .p-1\\.5").click();
  await page[1].locator("div:nth-child(3) > .p-1\\.5").click();
  await page[1].locator("div:nth-child(3) > .p-1\\.5").click();
  await page[1].locator(".flex > div > div > .p-1\\.5").first().click();
  await page[1].getByPlaceholder("Destino").press("Escape");
  await page[1]
    .locator("div")
    .filter({ hasText: /^Campaña:Llamada Interna$/ })
    .getByRole("button")
    .first()
    .click();
  await page[1].getByRole("button", { name: "1" }).click();
  await page[1].getByRole("button", { name: "2" }).click();
  await page[1].getByRole("button", { name: "3" }).click();
  await page[1].getByRole("button", { name: "4" }).click();
  await page[1].getByRole("button", { name: "5" }).click();
  await page[1].getByRole("button", { name: "6" }).click();
  await page[1].getByRole("button", { name: "7" }).click();
  await page[1].getByRole("button", { name: "8" }).click();
  await page[1].getByRole("button", { name: "9" }).click();
  await page[1].getByRole("button", { name: "*" }).click();
  await page[1].getByRole("button", { name: "0" }).nth(1).click();
  await page[1].getByRole("button", { name: "#" }).click();
  await page[1].locator("div:nth-child(2) > div > button").first().click();
  await page[1].locator("div:nth-child(5) > .p-1\\.5").click();
  await page[1].getByRole("link").nth(3).click();


  await page[1].getByText("En curso").click();
  await page[1].locator("div:nth-child(4) > .p-1\\.5").click();
  await page[1].locator("div:nth-child(3) > .p-1\\.5").click();
  await page[1]
    .locator(".flex > div > div:nth-child(2) > .p-1\\.5")
    .first()
    .click();
  await page[1].locator(".flex > div > div > .p-1\\.5").first().click();
  await page[1]
    .locator("div")
    .filter({ hasText: "ClienteAgenteCoach" })
    .nth(2)
    .click();
  await page[1]
    .locator("div")
    .filter({
      hasText:
        "ClienteAgenteCoachPilotosAgentesMartiniano Balascoselenium12super",
    })
    .nth(2)
    .click();
  await page[1].locator("body").press("Escape");
  await page[1].locator("div:nth-child(5) > .p-1\\.5").click();
  await page[1].getByLabel("close").click();

  //   // Wait for call to establish
  //   await sleep(10000);

  //   // **Check WebRTC audio activity**
  //   const isAudioActive = await page[1].evaluate(async () => {
  //     return new Promise((resolve) => {
  //       const audioContext = new AudioContext();
  //       const analyser = audioContext.createAnalyser();
  //       analyser.fftSize = 512;

  //       // Get active WebRTC tracks
  //       const peerConnections = window.navigator.mediaDevices as any;
  //       if (!peerConnections || !peerConnections.getUserMedia) {
  //         resolve(false);
  //         return;
  //       }

  //       peerConnections
  //         .getUserMedia({ audio: true })
  //         .then((stream) => {
  //           const audioTracks = stream.getAudioTracks();
  //           if (audioTracks.length === 0) {
  //             resolve(false);
  //             return;
  //           }

  //           // Analyze frequency data
  //           const source = audioContext.createMediaStreamSource(stream);
  //           source.connect(analyser);

  //           const buffer = new Uint8Array(analyser.frequencyBinCount);
  //           analyser.getByteFrequencyData(buffer);

  //           // If any frequency has a value > 0, audio is active
  //           resolve(buffer.some((value) => value > 0));
  //         })
  //         .catch(() => resolve(false));
  //     });
  //   });

  //   // Log result
  //   console.log("WebRTC Audio Active:", isAudioActive);

  //   // Assert audio is detected
  //   expect(isAudioActive).toBeTruthy();
  // });
});

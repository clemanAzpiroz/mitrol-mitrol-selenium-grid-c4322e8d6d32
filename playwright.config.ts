import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./test",
  timeout: 120 * 1000,
  expect: {
    timeout: 100 * 1000,
  },
  reporter: [["line"], ["html"]],
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : 100,
  fullyParallel: false,
  maxFailures: undefined,
  retries: 0,
  use: {
    channel: "chrome",
    headless: process.env.LOCAL ? false : true,
    ignoreHTTPSErrors: true,
    baseURL: "http://about.blank/",
    permissions: ["notifications", "microphone", "camera", "geolocation"],
    screenshot: "off",
    video: "off",
    trace: "off",
    viewport: null, // { width: 800, height: 600 },
    browserName: "chromium",
  },
  projects: [
    {
      name: "e2e",
      use: { ...devices["Desktop Chrome"] },
      testDir: "./test/e2e",
    },
    {
      name: "e2e-omnipad",
      use: { ...devices["Desktop Chrome"] },
      testDir: "./test/e2e-omnipad",
    },
    {
      name: "load-omnipad",
      use: { ...devices["Desktop Chrome"] },
      testDir: "./test/load-omnipad",
    },
    {
      name: "load",
      use: { ...devices["Desktop Chrome"] },
      testDir: "./test/load",
    },
  ],
};

export default config;

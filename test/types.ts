import {
  Page,
  Browser,
  BrowserContext,
  BrowserContextOptions,
} from "@playwright/test";

export interface chromeBrowser {
  browser: Browser[];
  context: BrowserContext[];
  page: Page[];
}

export interface createChromeOptions {
  cantidad?: number;
  audio?: boolean;
  otherArgs?: string[];
  contextOptions?: BrowserContextOptions;
}

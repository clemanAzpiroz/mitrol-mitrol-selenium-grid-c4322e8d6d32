import { Page } from "@playwright/test";
import { sleep } from "./utils";

export const cambiarEstadoADisponible = async (page: Page) => {
  await page
    .locator('[data-testid="agent-status-selector-uncollapsed"]')
    .first()
    .click();
  await page.locator('[data-testid="status-Disponible"]').first().click();
};

export const cerrarSesion = async (page: Page) => {
  await sleep(700);
  await page.locator('[data-testid="logout-btn"]').click();
};

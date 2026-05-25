import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';

/**
 * Custom Fixtures
 *
 * Extends Playwright's base `test` with pre-initialised page objects.
 * This means tests never manually instantiate pages — they just declare
 * what they need and Playwright injects it automatically.
 *
 * Pattern benefit: If a page object constructor changes, you update
 * fixtures once — not in every test file. This is what the
 * "abstract template pattern" in your resume refers to.
 */

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';

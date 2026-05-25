import { test, expect } from '../fixtures';

/**
 * Inventory Test Suite
 * Tags: @smoke, @regression
 *
 * Demonstrates: multi-step flows, data assertions, sort validation
 */

test.describe('Inventory — Products Page', () => {

  // Log in before each test in this suite
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  // ── Smoke Tests ──

  test('@smoke Products page loads after login', async ({ inventoryPage }) => {
    await inventoryPage.assertPageLoaded();
  });

  test('@smoke All 6 products are displayed', async ({ inventoryPage }) => {
    await inventoryPage.assertProductCount(6);
  });

  // ── Regression Tests ──

  test('@regression Adding item to cart updates badge count', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.assertCartBadgeCount(1);
  });

  test('@regression Adding multiple items updates cart correctly', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.assertCartBadgeCount(2);
  });

  test('@regression Products sort A-Z works correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('@regression Products sort Z-A works correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('@regression Products sort low-to-high price works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('@regression Products sort high-to-low price works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getProductPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });
});

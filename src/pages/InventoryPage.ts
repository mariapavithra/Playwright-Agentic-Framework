import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * InventoryPage — Page Object for /inventory (products page)
 * Demonstrates: dynamic element handling, list assertions, sort validation
 *
 * FIX NOTE (self-healing lesson):
 * assertProductCount uses page.locator() directly — not getElement() —
 * because SelfHealingLocator resolves a SINGLE element (first match).
 * For counting multiple elements, we must use page.locator() which
 * returns ALL matches and works correctly with toHaveCount().
 * This is an intentional architectural decision: healing = single elements,
 * direct locators = collections/counts.
 */
export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get pageHeaderStrategy() {
    return {
      description: 'Inventory page header',
      primary: '[data-test="title"]',
      fallbacks: ['.title', 'span.title', 'h2:has-text("Products")'],
    };
  }

  private get sortDropdownStrategy() {
    return {
      description: 'Sort dropdown',
      primary: '[data-test="product-sort-container"]',
      fallbacks: ['select.product_sort_container', 'select[class*="sort"]'],
    };
  }

  private get cartIconStrategy() {
    return {
      description: 'Shopping cart icon',
      primary: '[data-test="shopping-cart-link"]',
      fallbacks: ['.shopping_cart_link', 'a.shopping_cart_link'],
    };
  }

  // ── Product list locator (direct — needed for multi-element count) ──
  // saucedemo uses .inventory_item — no data-test attribute on list items
  private get productItems() {
    return this.page.locator('.inventory_item');
  }

  // ── Actions ──

  async addItemToCart(itemName: string): Promise<void> {
    const addButton = this.page.locator(
      `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`
    );
    await addButton.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    const dropdown = await this.getElement(this.sortDropdownStrategy);
    await dropdown.selectOption(option);
  }

  async goToCart(): Promise<void> {
    const cart = await this.getElement(this.cartIconStrategy);
    await cart.click();
  }

  // ── Assertions ──

  async assertPageLoaded(): Promise<void> {
    const header = await this.getElement(this.pageHeaderStrategy);
    await expect(header).toHaveText('Products');
  }

  async assertProductCount(expectedCount: number): Promise<void> {
    // Uses direct locator (not healer) because toHaveCount needs ALL matches
    await expect(this.productItems).toHaveCount(expectedCount);
  }

  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText(String(expectedCount));
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return names;
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }
}
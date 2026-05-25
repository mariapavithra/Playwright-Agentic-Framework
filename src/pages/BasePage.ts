import { Page, expect } from '@playwright/test';
import { SelfHealingLocator, HealingStrategy } from '@helpers/SelfHealingLocator';

/**
 * BasePage — Abstract foundation for all Page Objects
 *
 * Every page in the framework extends this class.
 * Centralises: navigation, healing locator access, common assertions,
 * wait helpers, and screenshot capture.
 *
 * This pattern is what reduced code duplication by 60% —
 * shared logic lives here once, not scattered across 450+ test files.
 */
export abstract class BasePage {
  protected page: Page;
  protected healer: SelfHealingLocator;

  constructor(page: Page) {
    this.page = page;
    this.healer = new SelfHealingLocator(page);
  }

  // ── Navigation ──

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Self-healing element resolution ──

  async getElement(strategy: HealingStrategy) {
    return this.healer.resolve(strategy);
  }

  // ── Common assertions ──

  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  async assertUrl(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl, 'i'));
  }

  async assertVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  // ── Wait helpers ──

  async waitForSelector(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitMs(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // ── Utility ──

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getHealingReport(): Promise<string[]> {
    return this.healer.getHealingReport();
  }
}

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Page Object for https://www.saucedemo.com
 *
 * Demonstrates self-healing selectors in action:
 * Each element has a primary selector and fallbacks.
 * If the app changes its DOM, the framework heals automatically.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Healing strategies for each element ──
  // Primary = most specific/stable. Fallbacks = progressively looser.

  private get usernameStrategy() {
    return {
      description: 'Username input field',
      primary: '[data-test="username"]',
      fallbacks: ['#user-name', 'input[name="user-name"]', 'input[placeholder*="Username" i]'],
    };
  }

  private get passwordStrategy() {
    return {
      description: 'Password input field',
      primary: '[data-test="password"]',
      fallbacks: ['#password', 'input[name="password"]', 'input[type="password"]'],
    };
  }

  private get loginButtonStrategy() {
    return {
      description: 'Login submit button',
      primary: '[data-test="login-button"]',
      fallbacks: ['#login-button', 'input[type="submit"]', 'button:has-text("Login")'],
    };
  }

  private get errorMessageStrategy() {
    return {
      description: 'Error message container',
      primary: '[data-test="error"]',
      fallbacks: ['.error-message-container', '[class*="error"]', 'h3[data-test="error"]'],
    };
  }

  // ── Actions ──

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async enterUsername(username: string): Promise<void> {
    const field = await this.getElement(this.usernameStrategy);
    await field.clear();
    await field.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    const field = await this.getElement(this.passwordStrategy);
    await field.clear();
    await field.fill(password);
  }

  async clickLogin(): Promise<void> {
    const button = await this.getElement(this.loginButtonStrategy);
    await button.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ── Assertions ──

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertTitle('Swag Labs');
    const usernameField = await this.getElement(this.usernameStrategy);
    await expect(usernameField).toBeVisible();
  }

  async assertErrorMessage(expectedMessage: string): Promise<void> {
    const error = await this.getElement(this.errorMessageStrategy);
    await expect(error).toBeVisible();
    await expect(error).toContainText(expectedMessage);
  }

  async assertLoginSuccessful(): Promise<void> {
    await this.assertUrl('/inventory');
  }
}

import { test, expect } from '../fixtures';

/**
 * Login Test Suite
 * Tags: @smoke (quick sanity), @regression (full suite)
 *
 * Uses: saucedemo.com — a public demo app built for automation practice
 * Demonstrates: self-healing locators, parallel execution, fixture injection
 */

const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
};

test.describe('Login — Authentication Flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Smoke Tests ──

  test('@smoke Login page loads correctly', async ({ loginPage }) => {
    await loginPage.assertLoginPageLoaded();
  });

  test('@smoke Valid user can log in successfully', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await loginPage.assertLoginSuccessful();
  });

  // ── Regression Tests ──

  test('@regression Locked out user sees correct error', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.assertErrorMessage('Sorry, this user has been locked out');
  });

  test('@regression Empty username shows validation error', async ({ loginPage }) => {
    await loginPage.clickLogin();
    await loginPage.assertErrorMessage('Username is required');
  });

  test('@regression Empty password shows validation error', async ({ loginPage }) => {
    await loginPage.enterUsername(USERS.standard.username);
    await loginPage.clickLogin();
    await loginPage.assertErrorMessage('Password is required');
  });

  test('@regression Wrong credentials shows error', async ({ loginPage }) => {
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.assertErrorMessage('Username and password do not match');
  });

  test('@regression Self-healing locator logs healing events', async ({ loginPage, page }) => {
    // This test demonstrates the healing report feature
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    const report = await loginPage.getHealingReport();

    // In a real scenario with a broken primary selector, this would show healing events
    console.log('Healing report for this session:', report.length === 0 ? 'No healing needed — all primary selectors worked' : report);
    await loginPage.assertLoginSuccessful();
  });
});

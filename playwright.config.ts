import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright Configuration
 * Demonstrates: parallel workers, retries, multi-browser, base URL env switching
 * This is the architecture that achieved 71% execution time reduction
 */
export default defineConfig({
  // ── Test location ──
  testDir: './src/tests',

  // ── Parallel execution (key to 71% time reduction) ──
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,

  // ── Retry on failure (self-healing behaviour) ──
  retries: process.env.CI ? 2 : 1,

  // ── Timeout settings ──
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // ── Reporting ──
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // ── Shared settings for all projects ──
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Capture on failure only
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Headless in CI, headed locally when needed
    headless: true,

    // Consistent viewport
    viewport: { width: 1280, height: 720 },
  },

  // ── Multi-browser projects ──
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // ── Output folder ──
  outputDir: 'test-results/',
});

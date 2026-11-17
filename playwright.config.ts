import { defineConfig, devices } from '@playwright/test';

// Tests run against the built site (`npm run build` first), served the way it is
// deployed: under the base path.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:4321${base}`,
    // A Taiwanese browser, so the root page stays in Chinese unless a test says otherwise.
    locale: 'zh-TW',
  },
  // The three browser engines: Chrome/Edge/Android, Firefox, and Safari (iPhone, Mac).
  // Safari's engine needs system libraries most machines don't have, so it runs in CI
  // and in the Playwright container (`npm run test:webkit`), not in a plain local run.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ...(process.env.CI || process.env.WEBKIT ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }] : []),
  ],
  webServer: {
    // --ignore-lock: always a fresh foreground server for this run, whatever else is running.
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: `http://localhost:4321${base}`,
    reuseExistingServer: false,
  },
});

import { defineConfig } from '@playwright/test';

// Tests run against the built site (`npm run build` first), served the way it is
// deployed: under the base path.
const base = process.env.BASE_PATH ?? '/cakeonstick/';

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
  webServer: {
    // --ignore-lock: always a fresh foreground server for this run, whatever else is running.
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: `http://localhost:4321${base}`,
    reuseExistingServer: false,
  },
});

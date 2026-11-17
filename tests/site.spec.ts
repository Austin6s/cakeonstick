import { expect, test, type Page } from '@playwright/test';

const pages = [
  { name: 'zh', path: './', htmlLang: 'zh-Hant-TW' },
  { name: 'en', path: './en/', htmlLang: 'en' },
];
const widths = [360, 768, 1280, 1440];

/** Records window.open calls instead of opening tabs. */
async function recordWindowOpen(page: Page) {
  await page.addInitScript(() => {
    const opened: string[] = [];
    (window as unknown as { __opened: string[] }).__opened = opened;
    window.open = (url) => {
      opened.push(String(url));
      return null;
    };
  });
}
const opened = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

for (const p of pages) {
  test.describe(p.name, () => {
    for (const width of widths) {
      test(`fits ${width}px with no sideways scrolling`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(p.path);
        await expect(page.locator('html')).toHaveAttribute('lang', p.htmlLang);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBe(0);
      });
    }

    test('loads nothing from another host', async ({ page }) => {
      const foreign: string[] = [];
      page.on('request', (r) => {
        const url = new URL(r.url());
        if (url.hostname !== 'localhost' && url.protocol !== 'data:') foreign.push(r.url());
      });
      await page.goto(p.path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');
      expect(foreign).toEqual([]);
    });

    test('quick order: opens, traps focus, closes with Esc and returns focus', async ({ page }) => {
      await page.goto(p.path);
      const trigger = page.locator('[data-order="set-classic"]');
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.locator('#order-set-classic');
      await expect(dialog).toBeVisible();
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');

      // Tab well past the last control: focus must still be inside the dialog.
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        const inside = await page.evaluate(() => {
          const a = document.activeElement;
          return a === document.body || !!a?.closest('#order-set-classic');
        });
        expect(inside).toBe(true);
      }

      const line = dialog.locator('[data-line]');
      const message = await dialog.getAttribute('data-message');
      expect(message).toBeTruthy();
      await expect(line).toHaveAttribute(
        'href',
        'https://line.me/R/oaMessage/%40544zacuj/?' + encodeURIComponent(message!),
      );

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test('quick order: backdrop click and Cancel close it', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(p.path);
      const dialog = page.locator('#order-pkg-wedding');
      await page.locator('[data-order="pkg-wedding"]').click();
      await expect(dialog).toBeVisible();
      await page.mouse.click(10, 10);
      await expect(dialog).toBeHidden();
      await page.locator('[data-order="pkg-wedding"]').click();
      await dialog.locator('[data-close]').click();
      await expect(dialog).toBeHidden();
    });

    test('quick order on Instagram copies the message', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      // The Instagram tab opens, but the test never contacts Instagram.
      await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
      await page.goto(p.path);
      await page.locator('[data-order="set-love"]').click();
      const dialog = page.locator('#order-set-love');
      const popup = page.waitForEvent('popup');
      await dialog.locator('[data-order-ig]').click();
      await (await popup).close();
      await expect(dialog.locator('[data-copied]')).not.toBeEmpty();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        await dialog.getAttribute('data-message'),
      );
    });

    test('header: full nav from 1240px, menu button below', async ({ page }) => {
      await page.setViewportSize({ width: 1240, height: 800 });
      await page.goto(p.path);
      await expect(page.locator('.nav-desktop')).toBeVisible();
      await expect(page.locator('[data-menu-button]')).toBeHidden();

      await page.setViewportSize({ width: 1239, height: 800 });
      await expect(page.locator('.nav-desktop')).toBeHidden();
      const button = page.locator('[data-menu-button]');
      await button.click();
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-nav')).toBeHidden();
      await expect(button).toBeFocused();
    });

    test('carousel: next arrow shows the second photo', async ({ page }) => {
      await page.goto(p.path);
      const media = page.locator('[data-carousel]').first();
      await media.scrollIntoViewIfNeeded();
      await media.locator('[data-carousel-next]').click();
      await expect(media.locator('[data-carousel-dot]').nth(1)).toHaveAttribute('aria-current', 'true');
    });

    test('contact form: error, then a pre-filled LINE message on a phone', async ({ browser }) => {
      const context = await browser.newContext({
        locale: 'zh-TW',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 800 },
        baseURL: test.info().project.use.baseURL,
      });
      const page = await context.newPage();
      await recordWindowOpen(page);
      await page.goto(p.path);
      const form = page.locator('[data-contact-form]');
      await form.locator('[data-via="line"]').click();
      await expect(form.locator('[data-form-error]')).toBeVisible();

      await form.locator('[name="name"]').fill('Test Person');
      await form.locator('[name="email"]').fill('test@example.com');
      await form.locator('[name="message"]').fill('Birthday, 20 guests');
      await form.locator('[data-via="line"]').click();
      await expect(form.locator('[data-form-error]')).toBeHidden();
      await expect(form.locator('[data-form-success]')).toBeVisible();
      const urls = await opened(page);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toContain('https://line.me/R/oaMessage/%40544zacuj/?');
      expect(decodeURIComponent(urls[0])).toContain('Birthday, 20 guests');
      await context.close();
    });

    test('the #nutrition link lands on the nutrition facts', async ({ page }) => {
      await page.goto(p.path + '#nutrition');
      await expect(page.locator('#nutrition h2')).toBeInViewport();
    });

    test('renders without JavaScript', async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        baseURL: test.info().project.use.baseURL,
      });
      const page = await context.newPage();
      await page.goto(p.path);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#shop .card')).toHaveCount(7);
      await expect(page.locator('#packages .card')).toHaveCount(5);
      await expect(page.locator('.faq-item')).toHaveCount(4);
      await expect(page.locator('.facts')).toHaveCount(3);
      await context.close();
    });
  });
}

test.describe('language', () => {
  test('an English browser is sent to /en/ on a first visit, and a choice is remembered', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US', baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto('./');
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Choosing 中文 sticks, even though the browser is English.
    await page.locator('.nav-desktop ~ .header-actions [data-lang="zh"], .header-mobile [data-lang="zh"]').locator('visible=true').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant-TW');
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant-TW');
    await context.close();
  });

  test('a Chinese browser stays on the Chinese page; choosing EN is remembered', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant-TW');
    await page.locator('[data-lang="en"]').locator('visible=true').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await page.goto('./');
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

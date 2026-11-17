import { expect, test, type Browser, type BrowserContext, type Page } from '@playwright/test';

const pages = [
  { name: 'zh', path: './', htmlLang: 'zh-Hant-TW' },
  { name: 'en', path: './en/', htmlLang: 'en' },
];
const widths = [360, 768, 1280, 1440];

const LINE_ADD = 'https://line.me/R/ti/p/@544zacuj?ts=07242156&oat_content=url';
const LINE_MESSAGE = 'https://line.me/R/oaMessage/@544zacuj/?';
const IG_DM = 'https://ig.me/m/cakeonstick';
const EMAIL = 'cakeonstick2026@gmail.com';
const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

/**
 * Stands in for LINE, Instagram and the mail app: every request that would leave the
 * site is answered locally, and whatever the page copies is recorded (reading the real
 * clipboard is not possible in every browser engine).
 */
async function isolate(context: BrowserContext) {
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.fulfill({ status: 200, body: 'ok' }));
  await context.addInitScript(() => {
    const state = { copied: [] as string[] };
    (window as unknown as { __test: typeof state }).__test = state;
    document.addEventListener('copy', () => state.copied.push(String(document.getSelection())), true);
  });
}
const copied = (page: Page) =>
  page.evaluate(() => (window as unknown as { __test: { copied: string[] } }).__test.copied);

/** A page as a phone sees it (LINE can be pre-filled there). */
async function phonePage(browser: Browser) {
  const context = await browser.newContext({
    locale: 'zh-TW',
    userAgent: IPHONE,
    viewport: { width: 390, height: 800 },
    baseURL: test.info().project.use.baseURL,
  });
  await isolate(context);
  return { context, page: await context.newPage() };
}

async function fillForm(page: Page) {
  const form = page.locator('[data-contact-form]');
  await form.locator('[name="name"]').fill('Test Person');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="date"]').fill('2027-01-15');
  await form.locator('[name="message"]').fill('Wedding, 60 guests');
  return form;
}
const formParts = ['Test Person', 'test@example.com', '2027-01-15', 'Wedding, 60 guests'];

for (const p of pages) {
  test.describe(p.name, () => {
    test.beforeEach(async ({ context }) => isolate(context));

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

    test('the hero photo that is preloaded is the one the page shows', async ({ page }) => {
      await page.goto(p.path);
      await page.waitForLoadState('load');
      const hero = await page.evaluate(() => {
        const shown = (document.querySelector('.hero-photo') as HTMLImageElement).currentSrc;
        const fetched = performance
          .getEntriesByType('resource')
          .map((e) => e.name)
          .filter((name) => name.includes('drizzle-trio'));
        return { shown, fetched: [...new Set(fetched)] };
      });
      expect(hero.fetched).toEqual([hero.shown]);
    });

    // ---------- Quick order ----------

    test('quick order: opens, traps focus, closes with Esc and returns focus', async ({ page }) => {
      await page.goto(p.path);
      const trigger = page.locator('[data-order="set-classic"]');
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.locator('#order-set-classic');
      await expect(dialog).toBeVisible();
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');

      // Tab well past the last control: focus must still be inside the dialog.
      for (let i = 0; i < 14; i++) {
        await page.keyboard.press('Tab');
        const inside = await page.evaluate(() => {
          const a = document.activeElement;
          return a === document.body || !!a?.closest('#order-set-classic');
        });
        expect(inside).toBe(true);
      }

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

    test('quick order by LINE on a phone: the chat link carries the message', async ({ browser }) => {
      const { context, page } = await phonePage(browser);
      await page.goto(p.path);
      await page.locator('[data-order="set-classic"]').click();
      const dialog = page.locator('#order-set-classic');
      const message = (await dialog.getAttribute('data-message'))!;
      expect(message.length).toBeGreaterThan(10);
      const line = dialog.locator('[data-line-message]');
      await expect(line).toHaveAttribute('href', LINE_MESSAGE + encodeURIComponent(message));
      const popup = page.waitForEvent('popup');
      await line.click();
      expect((await popup).url()).toContain('line.me/R/oaMessage/@544zacuj/');
      await expect(dialog.locator('[data-status]')).toBeEmpty(); // nothing needed copying
      await context.close();
    });

    test('quick order by LINE on a computer: copies the message, opens the add-friend page', async ({ page }) => {
      await page.goto(p.path);
      await page.locator('[data-order="set-classic"]').click();
      const dialog = page.locator('#order-set-classic');
      const line = dialog.locator('[data-line-message]');
      await expect(line).toHaveAttribute('href', LINE_ADD);
      const popup = page.waitForEvent('popup');
      await line.click();
      expect((await popup).url()).toBe(LINE_ADD);
      await expect(dialog.locator('[data-status]')).toHaveText(/LINE/);
      expect(await copied(page)).toEqual([await dialog.getAttribute('data-message')]);
    });

    test('quick order by Instagram: copies the message, opens the DM', async ({ page }) => {
      await page.goto(p.path);
      await page.locator('[data-order="set-love"]').click();
      const dialog = page.locator('#order-set-love');
      const popup = page.waitForEvent('popup');
      await dialog.locator('a[href="' + IG_DM + '"]').click();
      expect((await popup).url()).toContain('ig.me/m/cakeonstick');
      await expect(dialog.locator('[data-status]')).not.toBeEmpty();
      expect(await copied(page)).toEqual([await dialog.getAttribute('data-message')]);
    });

    test('quick order by email: a mail link with the subject and message filled in', async ({ page }) => {
      await page.goto(p.path);
      await page.locator('[data-order="pkg-birthday"]').click();
      const dialog = page.locator('#order-pkg-birthday');
      const href = (await dialog.locator('[data-order-email]').getAttribute('href'))!;
      const mail = new URL(href);
      expect(mail.protocol).toBe('mailto:');
      expect(mail.pathname).toBe(EMAIL);
      expect(mail.searchParams.get('body')).toBe(await dialog.getAttribute('data-message'));
      expect(mail.searchParams.get('subject')).toContain(await dialog.locator('h2').innerText());
    });

    test('quick order: the Copy button copies the message and says so', async ({ page }) => {
      await page.goto(p.path);
      await page.locator('[data-order="set-friend"]').click();
      const dialog = page.locator('#order-set-friend');
      const button = dialog.locator('[data-copy]');
      const label = await button.innerText();
      await button.click();
      await expect(button).not.toHaveText(label);
      expect(await copied(page)).toEqual([await dialog.getAttribute('data-message')]);
      await expect(button).toBeFocused(); // copying must not steal the focus
    });

    // ---------- Contact form ----------

    test('contact form: missing details show the error and focus the first bad field', async ({ page }) => {
      await page.goto(p.path);
      const form = page.locator('[data-contact-form]');
      await form.locator('[data-via="line"]').click();
      await expect(form.locator('[data-form-error]')).toBeVisible();
      await expect(form.locator('[name="name"]')).toBeFocused();
      await form.locator('[name="name"]').fill('Test Person');
      await form.locator('[name="email"]').fill('not-an-email');
      await form.locator('[data-via="email"]').click();
      await expect(form.locator('[data-form-error]')).toBeVisible();
      await expect(form.locator('[name="email"]')).toBeFocused();
      await expect(form.locator('[data-form-result]')).toBeHidden();
    });

    test('contact form by LINE on a phone: opens the chat with the request typed in', async ({ browser }) => {
      const { context, page } = await phonePage(browser);
      await page.goto(p.path);
      const form = await fillForm(page);
      const popup = page.waitForEvent('popup');
      await form.locator('[data-via="line"]').click();
      const url = (await popup).url();
      expect(url.startsWith(LINE_MESSAGE)).toBe(true);
      for (const part of formParts) expect(decodeURIComponent(url)).toContain(part);
      await expect(form.locator('[data-form-result]')).toBeVisible();
      await expect(form.locator('[data-form-open]')).toHaveAttribute('href', url);
      for (const part of formParts) await expect(form.locator('[data-form-message]')).toContainText(part);
      await context.close();
    });

    test('contact form by LINE on a computer: copies the request, opens the add-friend page', async ({ page }) => {
      await page.goto(p.path);
      const form = await fillForm(page);
      const popup = page.waitForEvent('popup');
      await form.locator('[data-via="line"]').click();
      expect((await popup).url()).toBe(LINE_ADD);
      await expect(form.locator('[data-form-result]')).toBeVisible();
      await expect(form.locator('[data-form-open]')).toHaveAttribute('href', LINE_ADD);
      const text = (await copied(page))[0];
      for (const part of formParts) expect(text).toContain(part);
    });

    test('contact form by Instagram: copies the request, opens the DM', async ({ page }) => {
      await page.goto(p.path);
      const form = await fillForm(page);
      const popup = page.waitForEvent('popup');
      await form.locator('[data-via="instagram"]').click();
      expect((await popup).url()).toContain('ig.me/m/cakeonstick');
      await expect(form.locator('[data-form-result]')).toBeVisible();
      await expect(form.locator('[data-form-open]')).toHaveAttribute('href', IG_DM);
      const text = (await copied(page))[0];
      for (const part of formParts) expect(text).toContain(part);
    });

    test('contact form by email: a pre-filled mail link, and the address to fall back on', async ({ page }) => {
      await page.goto(p.path);
      const form = await fillForm(page);
      await form.locator('[data-via="email"]').click();
      await expect(form.locator('[data-form-result]')).toBeVisible();
      const mail = new URL((await form.locator('[data-form-open]').getAttribute('href'))!);
      expect(mail.protocol).toBe('mailto:');
      expect(mail.pathname).toBe(EMAIL);
      expect(mail.searchParams.get('subject')).toContain('Test Person');
      for (const part of formParts) expect(mail.searchParams.get('body')).toContain(part);
      await expect(form.locator('[data-form-success]')).toContainText(EMAIL);
    });

    test('contact form: a blocked pop-up is explained and a direct link is offered', async ({ page }) => {
      await page.addInitScript(() => {
        window.open = () => null; // what a pop-up blocker does
      });
      await page.goto(p.path);
      const form = await fillForm(page);
      await form.locator('[data-via="instagram"]').click();
      await expect(form.locator('[data-form-result]')).toBeVisible();
      const blocked = (await form.getAttribute('data-blocked'))!;
      await expect(form.locator('[data-form-success]')).toContainText(blocked);
      const link = form.locator('[data-form-open]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', IG_DM);
      await expect(link).toHaveAttribute('target', '_blank');
      // The request was still copied, and the Copy button copies it again.
      await form.locator('[data-form-copy]').click();
      const texts = await copied(page);
      expect(texts).toHaveLength(2);
      expect(texts[1]).toBe(texts[0]);
    });

    // ---------- Everything else ----------

    test('LINE add-friend buttons are plain links to the official address', async ({ page }) => {
      await page.goto(p.path);
      for (const selector of ['.hero .btn-line', '.follow-ctas .btn-line', '.channel.is-line', '.header-actions .is-line']) {
        const link = page.locator(selector);
        await expect(link).toHaveAttribute('href', LINE_ADD);
        await expect(link).toHaveAttribute('target', '_blank');
      }
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

    test('the #nutrition link lands on the nutrition facts', async ({ page }) => {
      await page.goto(p.path + '#nutrition');
      await expect(page.locator('#nutrition h2')).toBeInViewport();
    });

    test('no element id is used twice', async ({ page }) => {
      await page.goto(p.path);
      const repeated = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(repeated).toEqual([]);
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
  // The browser's language list decides: the first Chinese or English entry wins,
  // and a browser with neither gets English.
  for (const [languages, expected] of [
    [['fr-FR', 'de'], 'en'],
    [['ja', 'zh-TW', 'en'], 'zh-Hant-TW'],
    [['en-US', 'zh-TW'], 'en'],
    [['zh-TW', 'en-US'], 'zh-Hant-TW'],
    [['zh-CN'], 'zh-Hant-TW'],
  ] as const) {
    test(`browser languages ${languages.join(', ')} -> ${expected}`, async ({ page }) => {
      await page.addInitScript((list) => {
        Object.defineProperty(navigator, 'languages', { get: () => list });
        Object.defineProperty(navigator, 'language', { get: () => list[0] });
      }, languages);
      await page.goto('./');
      await expect(page.locator('html')).toHaveAttribute('lang', expected);
    });
  }

  test('an English browser is sent to /en/ on a first visit, and a choice is remembered', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US', baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto('./');
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Choosing 中文 sticks, even though the browser is English.
    await page.locator('[data-lang="zh"]').locator('visible=true').click();
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

# Cake on Stick

The website for Cake on Stick, a handmade cakesicle business in Taiwan. One page, in
Traditional Chinese (default) and English. There is no cart or checkout: an order starts
as a pre-written message the visitor sends on LINE or Instagram, or from the contact form.

| | Address | Branch |
|---|---|---|
| Production | https://cakeonstick.com/ (English: `/en/`) | `main` |
| Dev | https://cakeonstick.com/dev/ | `dev` |

The dev copy tells search engines not to index it.

## Changing the site

| To change | Edit |
|---|---|
| Any words, product names, prices, FAQs | `src/content/zh.ts` and `src/content/en.ts` (same shape, one per language) |
| Instagram handle, LINE ID, email, package prices, show/hide all prices | `src/content/settings.ts` |
| Photos for a set or package | put the file in `src/assets/photos/`, then list it in `src/content/photos.ts` (one photo = plain image, several = carousel, none = empty state) |
| Colours, type, spacing | `src/styles/tokens.css` |
| Layout and styles | `src/components/` and `src/styles/site.css` |
| Favicon and link-preview image | `node scripts/make-icons.mjs` (after changing the logo or hero photo) |

There is no admin screen. Content lives in these files and changes go through a commit.

## Working on it

Needs Node 22.23 or newer (CI uses 24).

```
npm install
npm run dev        # local site with live reload, at http://localhost:4321/
npm run check      # everything CI runs: type check, build, site check, browser tests
```

`npm run check` needs the test browsers once: `npx playwright install chromium firefox`.
It tests in Chrome's and Firefox's engines. Safari's engine (iPhones, Macs) needs system
libraries most machines lack, so it runs in CI, or locally in a container with
`npm run test:webkit` (needs Docker and a built `dist/`).

## How a change goes live

1. Push to `dev`. GitHub Actions builds the site, runs the checks, publishes it to the dev
   address, and waits until the live page reports the new commit.
2. When dev looks right, merge `dev` into `main` and push. The same steps publish production.

Both environments are served by GitHub Pages from the `gh-pages` branch: production is the
root of that branch and dev is its `dev/` folder. `scripts/publish.sh` replaces only the
part that belongs to the environment being deployed. Never edit `gh-pages` by hand.

The checks that must pass before anything is published:

- `astro check`: types.
- `scripts/check-site.mjs`: both pages exist with the right language, SEO and sharing
  tags; the dev build is noindex and production is not; **nothing loads from another
  host** and every URL in the output is on a short known list. This is the repo's
  "no Chinese servers" guard (see `CLAUDE.md`).
- `tests/site.spec.ts` (Playwright, in the Chrome, Firefox and Safari engines): no sideways
  scrolling at 360, 768, 1280 and 1440 px; the header breakpoint; the quick-order dialog
  (focus, Esc, backdrop); every way to order and to send the form (LINE on a phone, LINE on
  a computer, Instagram, email, a blocked pop-up, the Copy button); carousels; the
  language rule and memory; the `#nutrition` link; and that the page renders with
  JavaScript off. The tests never contact LINE, Instagram or a mail server: they check
  the links and what gets copied.

### The domain

The site is served at `cakeonstick.com`, bought at Namecheap. Its DNS records there
(Advanced DNS) point at GitHub Pages and should not need touching:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (four records) |
| CNAME | `www` | `austin6s.github.io.` |

Each deploy writes the `CNAME` file that tells GitHub Pages the domain. `www.cakeonstick.com`
and the old `austin6s.github.io/cakeonstick/` address both redirect to `cakeonstick.com`.
The address is set in `astro.config.mjs` and the workflow; the repository variables
`SITE_URL` and `BASE_PATH` override it if they are ever created.

## How it is built

- [Astro](https://astro.build), TypeScript, no client framework. Each language is a real
  pre-rendered page (`/` and `/en/`) with `hreflang` links.
- Language: the 中文 / EN switch is a link, and the choice is remembered in the browser.
  Until a visitor chooses, `/` follows the browser's language list: the first entry that is
  Chinese or English wins, and a browser with neither gets English (`/en/`). A link straight
  to `/en/` always shows English. No location lookup, nothing sent anywhere.
- Photos are compressed to AVIF and WebP in several sizes at build time.
- Fonts: Poppins and Inter are served from the site itself. Chinese text uses the Chinese
  font already on the visitor's device (downloading Noto Sans TC cost about 1.2 MB).
- The quick-order dialog is a native `<dialog>`.
- Ordering and the contact form send nothing to a server. They write the message and
  hand it to an app, by the same rules in both places (`src/scripts/site.ts`):

  | Channel | What happens |
  |---|---|
  | LINE on a phone or tablet | The chat with the account opens with the message typed in. |
  | LINE on a computer | The message is copied and the LINE desktop app opens (LINE's web link for a typed-in message only works on phones). If the app doesn't open within 1.5 seconds, most likely because it isn't installed, the add-friend page with the QR code opens in a new tab. A "LINE didn't open? Open the QR code" link stays on screen either way. The add-friend buttons work the same way on a computer. |
  | Instagram | A DM cannot be pre-filled, so the message is copied and the DM opens. |
  | Email | The visitor's default mail app opens with the subject and message filled in (`mailto:`). |

  The message is always shown with a Copy button. After the form is sent it also shows a
  direct link, and says so if the browser blocked the new tab, so the visitor can still
  send it when an app does not open (a pop-up blocker, no mail app, an in-app browser).
- Search engines: each language has its own title and description, `hreflang` links, a
  sitemap, and structured data (the business, the seven sets with prices, the FAQ) built
  from the content files.

`cake-on-stick-handoff/` is the original design handoff (the prototype, design system and
source images). It is kept for reference and is not part of the build.

## Open questions for the owner

1. **Photos.** Baby Shower and Wedding packages have no photo (they show a placeholder).
   The photos for six sets and packages are 480x600 previews; the full-size originals
   would look sharper. "Our Story" shows the logo; a kitchen or process photo would do more.
2. **Button contrast.** White text on brand coral (3.1:1) and on LINE green (2.3:1) is
   below the 4.5:1 accessibility guideline. The brand colours were kept as designed. It is
   the one thing holding the accessibility score at 97.
3. **Themed set.** "You've Got a Friend" (set and package) refers to a film franchise.
   Confirm you are comfortable with the name and description.
4. **Card photo shape.** Cards show a 4:3 window of 4:5 photos, as designed. The current
   photos have enough margin that nothing is cut off.
5. **Analytics.** None is installed.
6. **A real-phone test.** Ordering by LINE, Instagram and email is tested in three browser
   engines, but not with the real apps. Try each once on an iPhone and an Android phone,
   including from inside Instagram's own browser (the link in the bio opens there).
7. **Google Search Console.** Not set up (it needs the owner's Google login). Google will
   find the site on its own; adding the site there and submitting
   `https://cakeonstick.com/sitemap.xml` makes it faster and shows how it is doing.

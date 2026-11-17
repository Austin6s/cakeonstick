# Cake on Stick

The website for Cake on Stick, a handmade cakesicle business in Taiwan. One page, in
Traditional Chinese (default) and English. There is no cart or checkout: an order starts
as a pre-written message the visitor sends on LINE or Instagram, or from the contact form.

| | Address | Branch |
|---|---|---|
| Production | https://austin6s.github.io/cakeonstick/ (English: `/en/`) | `main` |
| Dev | https://austin6s.github.io/cakeonstick/dev/ | `dev` |

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
npm run dev        # local site with live reload, at http://localhost:4321/cakeonstick/
npm run check      # everything CI runs: type check, build, site check, browser tests
```

`npm run check` needs the test browser once: `npx playwright install chromium`.

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
- `tests/site.spec.ts` (Playwright): no sideways scrolling at 360, 768, 1280 and 1440 px;
  the header breakpoint; the quick-order dialog (focus, Esc, backdrop, LINE link,
  Instagram copy); carousels; the contact form; the language redirect and memory; the
  `#nutrition` link; and that the page renders with JavaScript off.

### Moving to cakeonstick.com

The owner holds `cakeonstick.com` at Namecheap (17 Nov 2026: still on Namecheap's parking
page). Do these in order; the site stays up on github.io until step 3.

1. At Namecheap > Domain List > Manage > Advanced DNS, delete the parking records (the
   "URL Redirect" for `@` and the `CNAME` for `www` to parkingpage.namecheap.com), then add:

   | Type | Host | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `austin6s.github.io.` |

2. Wait until `cakeonstick.com` answers from GitHub (minutes to an hour):
   `curl -sI http://cakeonstick.com | grep -i server` should say `GitHub.com`.
3. Set the two repository variables and redeploy both branches:

   ```
   gh variable set SITE_URL --body https://cakeonstick.com
   gh variable set BASE_PATH --body /
   gh workflow run "CI and deploy" --ref main
   gh workflow run "CI and deploy" --ref dev
   ```

   The deploy writes the `CNAME` file that tells GitHub Pages the domain. Production is
   then `https://cakeonstick.com/` and dev is `https://cakeonstick.com/dev/`.
4. In the repository's Settings > Pages, tick "Enforce HTTPS" once GitHub has issued the
   certificate (usually within the hour).

## How it is built

- [Astro](https://astro.build), TypeScript, no client framework. Each language is a real
  pre-rendered page (`/` and `/en/`) with `hreflang` links.
- Language: the 中文 / EN switch is a link, and the choice is remembered in the browser.
  On a first visit to `/`, a browser that is not set to Chinese is sent to `/en/`. No
  location lookup, nothing sent anywhere.
- Photos are compressed to AVIF and WebP in several sizes at build time.
- Fonts: Poppins and Inter are served from the site itself. Chinese text uses the Chinese
  font already on the visitor's device (downloading Noto Sans TC cost about 1.2 MB).
- The quick-order dialog is a native `<dialog>`.
- The contact form sends nothing to a server. It writes the message and opens LINE
  (pre-filled) or the visitor's mail app.

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
6. **Domain.** The site is on a github.io address until `cakeonstick.com` is pointed at it
   ("Moving to cakeonstick.com" above; step 1 is the owner's, at Namecheap).

# Cake on Stick — build handoff

This folder is everything needed to turn the Cake on Stick design prototype into a real,
deployable website. Read this file first, then ask the owner the questions in section 7
before writing code.

## 1. What is being built

A bilingual (Traditional Chinese for Taiwan, and English) one-page marketing site for a
handmade cakesicle business in Taiwan. There is no cart and no checkout: every order is
started by a pre-written message sent over LINE or Instagram, or by the contact form.

Page sections, in order: sticky header, hero, trust badges and ordering schedule, shop
(7 gift sets), party packages (5 themes, 3 sizes each), our story, 3-step custom order
process, Instagram/LINE follow, FAQ, contact form, nutrition facts and allergens, footer,
plus a quick-order dialog that opens from any product or package.

## 2. What is in this folder

| Path | What it is |
|---|---|
| `design/CakeOnStickSite.dc.html` | The site design. Source of truth for layout, styles, copy and behaviour. |
| `design/CakeOnStickAdmin.dc.html`, `design/BilingualPair.dc.html` | Prototype of a content admin (see section 6). |
| `design/design-system/` | Design tokens (`tokens/*.css`), the brand readme, and the compiled component source (`components.bundle.js`: Button, Badge, SectionHeading, Input, Textarea, ProductCard, NavBar, Footer). |
| `assets/logo/`, `assets/photography/` | Logos and product photography used by the design. |
| `assets/photography/slots/` | Photos the owner dropped into the design's empty photo slots. File name = slot id (see section 4). These are 480x600 previews only. |

## 3. How to read the design files

The `.dc.html` files run on a design-tool runtime that must not be shipped. Port them; do
not embed them.

- Everything between `<x-dc>` and `</x-dc>` is the template. Inline `style="..."` values are
  the exact design values: copy them, do not round or re-derive them.
- `{{name}}` is a value from `renderVals()` in the script at the bottom of the file.
  `<sc-if>` is a conditional, `<sc-for>` is a loop, `style-hover` is a hover style,
  `<x-import component-from-global-scope="...Button">` is a design-system component, and
  `<x-import component-from-global-scope="image-slot">` is an empty photo slot (in the
  build it is a normal image).
- The constants at the top of the script (`STRINGS`, `PRODUCTS`, `PACKAGES`, `STEPS`,
  `FAQS`, `NUTRITION`) are the real site content in both languages. Move them into typed
  content files, one per language. Do not rewrite the copy.
- All colours, type, spacing, radii and shadows come from `design/design-system/tokens/`.
  Keep them as CSS custom properties.

## 4. Photos

Photos used directly by the design are in `assets/photography/`. Photos for the slots:

| Slot id | Used for |
|---|---|
| `set-classic` | Classic Set |
| `set-single-chocolate`, `set-single-vanilla`, `set-single-redvelvet` | Single Flavor Set (3-photo carousel) |
| `set-birthday` | Birthday Set |
| `set-friend` | You've Got a Friend Set |
| `pkg-toy-story` | "You've Got a Friend" party package |
| `pkg-birthday` | Birthday party package (same photo as `set-birthday`) |
| `pkg-gender-reveal`, `pkg-gender-reveal-inside` | Gender Reveal package (2-photo carousel: outside, inside) |
| `pkg-baby-shower`, `pkg-wedding` | No photo yet. Ask the owner. |

Ask the owner for the full-resolution originals of every slot photo before launch.

Every product photo is 4:5 portrait, but the cards show a 4:3 landscape window, so about
40% of each photo is cropped away. Raise this with the owner (section 7).

## 5. From prototype to production

Keep the visual design exactly. These are the parts of the prototype that must be built
properly rather than copied:

1. **Languages.** The prototype swaps language in JavaScript on one URL. Build real
   routes instead: `/` (zh-Hant-TW, default) and `/en`, each pre-rendered, with `hreflang`
   links and the correct `lang` attribute. The 中文 / EN toggle becomes a link between them.
   Remember the visitor's choice.
2. **Language auto-detect.** The prototype calls `https://ipapi.co/json/` from the browser.
   Remove it: it sends every visitor's IP to a third party, flips the language after the
   page has painted, and overrides an English browser inside Taiwan. Use the browser's
   language on first visit only (or the host's geo header, server side).
3. **Images.** Source files are 300 KB to 2.3 MB, and the header logo mark is a 1177 px
   PNG shown at 40 px tall. Serve responsive, compressed images (AVIF/WebP), with width
   and height set, lazy-loaded below the fold. The hero photo is the largest element on
   the page: preload it.
4. **Order links.** Keep the behaviour in `openLineUri`, `orderViaLine`, `orderViaIg` and
   `orderMessage`: LINE opens with the message pre-filled; Instagram cannot be pre-filled,
   so the message is copied to the clipboard and the DM opens.
5. **Contact form.** The prototype opens the visitor's mail app (`mailto:`), which fails
   for anyone without a configured mail app. See section 7.
6. **Quick-order dialog.** Use a native `<dialog>` or an accessible dialog primitive:
   focus moves in on open, is trapped while open, returns to the trigger on close; Esc and
   backdrop click close it; page scroll is locked.
7. **Design-system fixes to fold into the components** (the page already works around
   these):
   - Add a text-safe coral token. Brand coral `#ff5a56` is 3.1:1 on white, so coral text
     under 24 px uses `--coral-700` (`#cc302e`, 5.2:1). The page defines this as
     `--coral-text`. `SectionHeading`'s eyebrow still uses the brand coral and needs it.
   - `--text-secondary` is `#6b6b6f` (was `#767679`, which failed on the coral-tint
     sections).
   - `ProductCard` must be one component that handles a photo, an empty state and a
     carousel, with a real `<button>` to open the order dialog.
   - `Button` needs a visible keyboard focus style. `NavBar` and `Footer` in the bundle
     are unused placeholders (the cart emoji, TikTok and Pinterest links are not real).
8. **SEO and sharing.** Per-language title and description, Open Graph image, favicon
   from the logo mark, sitemap, and `LocalBusiness`/`Bakery` structured data.
9. **Keep** the `#nutrition` deep link working (it is likely linked from packaging).
10. **Do not ship** `localStorage` content overrides (`cos-published-content`); that is
    the prototype admin's mechanism.

## 6. The admin prototype

`CakeOnStickAdmin.dc.html` is a mock-up: any email and password signs in, edits are saved
in the browser's `localStorage`, and "translate" calls an AI helper that only exists
inside the design tool. Nothing in it is production-ready. It shows what the owner wants
to be able to edit without a developer: hero headline and subtitle, the ordering schedule
line, product names/prices/badges, package names, FAQs, contact handles, and a
show/hide-prices switch. See section 7 for how to provide that.

## 7. Questions for the owner (ask before building)

1. **Stack and hosting.** Recommended default: a statically generated site (Astro, or
   Next.js with static rendering) in TypeScript, deployed to Vercel, Netlify or Cloudflare
   Pages. Is there an existing domain or host?
2. **Editing content.** (a) No admin: content lives in files and changes go through
   Claude Code; cheapest and safest. (b) A hosted CMS with real logins. (c) A custom admin
   like the prototype, which needs authentication, a database and a server-side
   translation API key. Which one?
3. **Contact form.** Send through a form/email service so it works on every device, or
   drop the form and rely on LINE, Instagram and an email link?
4. **Pickup.** The process step, the contact section and the pre-written order message mention pickup, but the FAQ says
   pickup is not available yet. Which is true today?
5. **Card photo shape.** Keep 4:3 cards (photos cropped) or switch to 4:5 so each whole
   set is visible?
6. **Missing photos**: Baby Shower and Wedding packages, plus originals for the slot
   photos. The "Our Story" block currently shows the logo; a real kitchen or process photo
   would do more there.
7. **Button contrast.** White text on brand coral (3.1:1) and on LINE green (2.3:1) is
   below the 4.5:1 accessibility guideline. Keep the brand colours as they are, or darken
   the coral buttons to `--coral-700`?
8. **Themed sets.** The "You've Got a Friend" set and package reference a film franchise.
   Confirm the owner is comfortable with how it is named and described.
9. **Analytics**: wanted or not?

## 8. Definition of done

- Both languages render without JavaScript and match the design at 360, 768, 1280 and
  1440 px wide, with no horizontal scrolling.
- Header shows the full nav from 1240 px and the menu button below it.
- Every control is reachable and usable by keyboard; the dialog traps and restores focus.
- Quick order works on a real phone for both LINE and Instagram.
- Lighthouse (mobile) performance and accessibility at 90 or above.

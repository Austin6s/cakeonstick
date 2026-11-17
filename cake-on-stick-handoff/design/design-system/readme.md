# Cake on Stick — Design System

Cake on Stick is a premium, fun, and chic handmade cakesicle brand. Offerings range from
fully customized treats and themed party packages (Toy Story, baby showers, Valentine's, etc.)
to ready-to-buy gift sets and everyday desserts. This design system supports a modern,
visually engaging e-commerce + portfolio website whose job is to showcase the packaging
and guide visitors toward a custom order inquiry.

**Sources provided:** no codebase, Figma file, or slide deck was attached. This system was
built directly from brand materials the user uploaded — a two-color logo lockup and five
product photography sets (Valentine's Collection, an everyday drizzle trio, and boy/girl
baby-shower sets) — plus the user's own notes on palette and tone. If a Figma file, site
codebase, or additional brand guidelines exist, attach them and this system should be
reconciled against that source of truth.

## Index

- `styles.css` — root stylesheet; import this one file to get all tokens + fonts.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `assets/logo/` — logo lockup, coral-background and charcoal-background versions.
- `assets/photography/` — product photography (Valentine's, drizzle/everyday, baby shower boy & girl).
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius, shadow, brand) shown in the Design System tab.
- `components/core/` — `Button`, `Badge`, `SectionHeading`.
- `components/forms/` — `Input`, `Textarea`.
- `components/commerce/` — `ProductCard`.
- `components/navigation/` — `NavBar`, `Footer`.
- `templates/site/` — `CakeOnStickSite.dc.html`, a full marketing-site homepage template (hero, shop grid, custom-order process, contact form, footer) built from the components above.
- `SKILL.md` — portable skill file for using this system in Claude Code or elsewhere.

## Components

| Component | Location | Purpose |
|---|---|---|
| Button | `components/core/Button.jsx` | Primary CTA — primary/secondary/ghost/dark variants, 3 sizes |
| Badge | `components/core/Badge.jsx` | Small pill label for flavor tags, dietary notes, collection badges |
| SectionHeading | `components/core/SectionHeading.jsx` | Eyebrow + display heading, used above every major section |
| Input | `components/forms/Input.jsx` | Labeled text input for contact/custom-order forms |
| Textarea | `components/forms/Textarea.jsx` | Multi-line field for custom-order requests |
| ProductCard | `components/commerce/ProductCard.jsx` | Shop-grid card — image, name, price, badge |
| NavBar | `components/navigation/NavBar.jsx` | Site header — logo, nav links, cart, CTA |
| Footer | `components/navigation/Footer.jsx` | Site footer — brand blurb, nav columns, copyright |

No component inventory was defined by an attached source, so this is a from-scratch set
sized to the brand's actual site needs (a marketing/e-commerce homepage), not a generic kit.

**Intentional additions:** none beyond the standard set above — every component was chosen
because the homepage template below actually uses it.

## Content Fundamentals

Voice, drawn from the logo and product-photography copy ("Valentine's Collection", "I ❤ U", "BABY"):

- **Tone:** warm, celebratory, a little playful — but restrained, not loud. Short, confident
  phrases rather than long sentences ("Sweet, on a stick.").
- **Casing:** the wordmark and section eyebrows are set in ALL CAPS with wide letter-spacing
  for a chic, boutique feel. Body copy and headings otherwise use normal sentence case —
  caps are a deliberate accent, not the default.
- **Person:** speaks to the customer directly and warmly ("we'll follow up with...", "tell us
  about your event") — a "we" making something for "you," not corporate "our company" language.
  Second person ("your celebration", "your event") outnumbers first person.
  **Emoji:** used sparingly and only where genuinely celebratory (a heart on "I ♥ U" packaging).
  Not used as decoration in UI copy or navigation — treat as an occasional, intentional accent.
- **Product naming:** short, concrete, collection-first — "Valentine's Collection," "Baby
  Girl Gift Set" — not cute puns stacked on top of each other.
- **Vibe words:** premium, handmade, chic, celebratory, giftable, custom.

## Visual Foundations

- **Color:** the only true brand colors are dark charcoal (`--charcoal-700`, ~#2e2e30),
  white, and a single coral red (`--coral-500`, ~#ff5a56) — used exactly as instructed, not
  invented. Coral is the energetic accent (CTAs, eyebrows, hover states); charcoal is the
  premium anchor (footer, dark sections, primary text); white is the dominant page/surface
  color, since the product photography itself is almost always shot on white or pale
  backgrounds. Pastel tints (blush pink, baby blue) appear **only inside seasonal packaging
  photography** (Valentine's, gender-reveal sets) — they are not part of the UI palette and
  are documented separately as `--tint-*` tokens so they aren't confused with brand color.
- **Type:** a geometric, confident all-caps sans for the wordmark and headings (Poppins
  substitute — see note below), paired with Inter for body copy and UI text. Headings use
  tight, display-forward sizing; body copy stays comfortably readable at 16–18px.
- **Backgrounds:** mostly clean white or very pale coral tint (`--bg-surface-tint`) for
  content sections — matching the seamless white/light backdrops used in almost all product
  photography. One dark charcoal section per page (hero or footer) for contrast and to
  showcase the logo's dark-background lockup. No gradients, textures, or patterns were found
  in the source materials — keep backgrounds flat and let the photography carry visual
  richness. The hero uses a single full-bleed product photo with a charcoal gradient scrim
  for text legibility — this is the one "photographic" background pattern in the system.
- **Imagery:** top-down (flat-lay) product photography, soft even studio lighting, shot on
  seamless white, pale coral, or pale pastel backdrops depending on collection. Warm, clean,
  no grain or heavy filtering. Every product shot includes the cakesicle's wooden stick
  visible — a recurring, literal brand cue worth preserving in any new photography.
- **Animation:** no motion was present in source materials. Following the brand's restrained,
  premium tone, motion tokens are deliberately gentle and short: `--duration-fast` (150ms)
  for hovers, `--duration-base` (220ms) for card lifts, using soft eases
  (`--ease-standard`, `--ease-out-soft`) — no bounce, no springiness.
- **Hover states:** primary buttons darken one step (`--coral-600`); outlined/ghost buttons
  fill with a pale tint background; product cards lift 3px with a soft shadow
  (`--shadow-md`); nav links shift to coral. No color-inversion or underline-only hovers.
- **Press states:** buttons scale down slightly (0.97) — no color change beyond the existing
  hover state.
- **Borders:** hairline (1–1.5px), low-contrast (`--border-subtle` / `--border-default`),
  used sparingly — mostly to separate the nav from content and to outline product cards
  before they gain a hover shadow. No colored or heavy borders.
- **Shadows:** soft, warm, low-contrast, multi-layer (`--shadow-sm/md/lg`) — never a hard
  single drop shadow. A `--shadow-coral-glow` token exists for rare emphasis (e.g. a featured
  CTA) but is not used by default.
- **Corner radii:** generously rounded throughout — pill-shaped buttons and badges
  (`--radius-pill`), soft-cornered cards (`--radius-lg`, 22px) — echoing the rounded,
  hand-drawn popsicle icon in the logo. Small utility elements (inputs) use a gentler
  `--radius-sm` (8px) so they don't look too playful for a form context.
- **Cards:** white background, soft rounded corners, hairline border at rest, shadow +
  lift only on hover — no colored left-border accent, no permanent shadow.
- **Layout:** centered content max-width (~1280px) with generous side padding that scales
  with viewport; no fixed/sticky elements observed or assumed beyond a standard site header.
- **Transparency & blur:** the only use is a linear-gradient scrim (opacity, no blur) over
  the hero photo for text contrast. No frosted-glass/backdrop-blur UI observed — don't add it
  without a source justification.

## Iconography

No icon system, icon font, or SVG set was included in the provided materials. The line-art
popsicle mark in the logo is the brand's only illustrated asset — it should be treated as
part of the wordmark lockup, not reused as a generic icon. The `NavBar` component currently
uses a 🛍️ emoji as a **placeholder** for the cart icon; this is flagged, not a recommendation.

**Recommendation:** if/when a UI needs icons (cart, menu, search, social), use a neutral,
thin-stroke CDN icon set that won't fight the brand's soft, rounded geometry —
[Lucide](https://lucide.dev) (via CDN) is a reasonable default until the brand supplies its
own. Do not hand-draw new SVG icons for this brand.

## Typography substitution — please confirm

No font files were supplied. The logo wordmark's geometric, wide-tracked all-caps letterforms
were matched to **Poppins** (display/headings) paired with **Inter** (body/UI text), both
loaded from Google Fonts in `tokens/fonts.css`. If Cake on Stick has licensed brand fonts,
please share the font files (`.woff2`/`.otf`) so they can replace this substitution.

## Templates

- **`templates/site/CakeOnStickSite.dc.html`** — "Cake on Stick — Marketing Site": a full
  homepage recreation (nav → hero → shop-the-collection grid → custom-order process →
  contact form → footer) composed entirely from the components above and the real product
  photography. This is the one product surface for this brand (a single marketing +
  e-commerce + portfolio website) — no separate "app" exists.

# No Chinese servers: cakeonstick

## State on 17 November 2026 (first build)

**What it is:** a static website (HTML, CSS, images, two fonts, one small script) in the
public GitHub repository `Austin6s/cakeonstick`, served by GitHub Pages. There is no
database, no server code, no analytics, no form service and no AI.

**What data exists:** none is collected or stored. The site sets one value in the visitor's
own browser (`cos-lang`, their language choice). The contact form does not submit anywhere:
it writes a message and opens LINE or the visitor's mail app.

**Where it runs**

| Part | Who runs it | Where | Note |
|---|---|---|---|
| Hosting | GitHub Pages (GitHub, US), delivered through Fastly's network | Fastly picks the nearest location | Measured from Taiwan on 17 Nov 2026: Singapore (`x-served-by: cache-sin-…`, `x-github-edge-region: southeastasia`) on every request. |
| Build and deploy | GitHub Actions (GitHub-hosted runners, US) | | Build time only; no visitor data. |
| Fonts | The site itself | | Poppins and Inter are npm packages built into the site. The prototype's Google Fonts link was removed. Chinese text uses the device's own font. |
| Language detection | The visitor's browser | | The prototype's call to `ipapi.co` (which sent every visitor's IP address to a third party) was removed. |

**Open point, same kind as the accepted Cloudflare Hong Kong exception.** Fastly's network
includes a Hong Kong location, and Fastly, not this repo, decides which location answers a
visitor. GitHub Pages offers no setting to exclude one. What would pass through it is a
request for public pages and images (the visitor's IP address and browser details, as with
any website); nothing is stored there by this site and there is no personal data to send.
The owner chose GitHub Pages on 17 Nov 2026; raise this again if the site ever handles
personal data (a real form, accounts, orders).

**Links the visitor may click:** Instagram (`instagram.com`, `ig.me`; Meta, US) and LINE
(`line.me`; LY Corporation, Japan). These are the business's own existing channels. The
site loads nothing from them; the visitor goes there by choice. Their servers were not
audited here.

**The guard:** `scripts/check-site.mjs` runs on every build and before every deploy. It
fails if the built site would load any script, style, font or image from another host, if a
form posts to a server, or if any URL in the output names a host that is not on its short
list. A browser test (`loads nothing from another host`) confirms the same thing at run
time. Adding a host means finding out where it runs and recording it here first.

## Audit of 7 November 2026

The repository was private and empty: nothing to audit. The rule was added to `CLAUDE.md`
so it would apply from the first commit.

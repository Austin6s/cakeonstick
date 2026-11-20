# Cake on Stick (cakeonstick.com): project rules

The website for the Cake on Stick cakesicle business: a static, bilingual (zh-Hant-TW at
`/`, English at `/en/`) one-page site built with Astro and hosted on GitHub Pages.
`README.md` says where content lives, how to run the checks and how deploys work.

- `dev` deploys to the dev environment, `main` to production. Work on `dev`; promote by
  merging `dev` into `main`. Never edit the `gh-pages` branch by hand.
- Run `npm run check` before pushing. After pushing, confirm the Actions run is green.
- Copy lives in `src/content/zh.ts` and `en.ts`. Do not rewrite the owner's copy; keep both
  languages in step.
- Keep the visual design as it is in `cake-on-stick-handoff/design/`. Design values are
  tokens in `src/styles/tokens.css`.
- The repository is public. Never commit secrets or private data.

## No Chinese servers (the owner's rule, 7 November 2026)

No data of the owner's or visitors' may be stored on, processed by, or risk passing through a
server in mainland China, Hong Kong or Macau. AI models from Chinese companies (Qwen, DeepSeek,
Kimi, GLM and the like) are out for anything touching user data; open-weight models are fine only
on non-Chinese servers. Before adding a host, CDN, script, font, form service, AI provider or data
store, find out where it runs and say so. Never create a Cloudflare R2 or D1 store in `apac`.
The audit and its evidence are in `docs/no-chinese-servers.md`.

When choosing hosting, a database or an AI provider, pick a region with no Chinese territory and add a deploy check that refuses one elsewhere (see Poker Pengyou's `scripts/deploy.py`).

This repo's check is `scripts/check-site.mjs` plus the "loads nothing from another host" test:
the build fails if the site would load anything from a host other than its own, or if any URL
in the output is not on the list in that script. Adding a host to the list means finding out
where it runs first and recording it in `docs/no-chinese-servers.md`.

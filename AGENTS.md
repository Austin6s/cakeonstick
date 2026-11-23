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

## No Chinese technology

The owner's highest-priority rule; his shared rules hold the full text. Nothing of this project may be stored on, processed by or sent through a server in mainland China, Hong Kong or Macau, and no AI model, service, library or tool made, controlled or started by a company based there may be used, wherever it is hosted. Before adding a host, region, CDN, font, dependency, AI provider or data store, find out who makes it and where it runs, and say so.

This repo's guard is `scripts/check-site.mjs` plus the "loads nothing from another host" test:
the build fails if the site would load anything from a host other than its own, or if any URL
in the output is not on the list in that script. Adding a host to the list means finding out
where it runs first and recording it in `docs/no-chinese-servers.md`, which also holds the audit.

# CLAUDE.md — cakeonstick

A web app for the cakeonstick cakesicle business. Nothing is built yet.

## No Chinese servers (the owner's rule, 7 November 2026)

No data of the owner's or visitors' may be stored on, processed by, or risk passing through a
server in mainland China, Hong Kong or Macau. AI models from Chinese companies (Qwen, DeepSeek,
Kimi, GLM and the like) are out for anything touching user data; open-weight models are fine only
on non-Chinese servers. Before adding a host, CDN, script, font, form service, AI provider or data
store, find out where it runs and say so. Never create a Cloudflare R2 or D1 store in `apac`.
The audit and its evidence are in `docs/no-chinese-servers.md`.

When choosing hosting, a database or an AI provider, pick a region with no Chinese territory and add a deploy check that refuses one elsewhere (see Poker Pengyou's `scripts/deploy.py`).

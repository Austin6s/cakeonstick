import { defineConfig, envField } from 'astro/config';

// Where the site is served. Production: https://austin6s.github.io/cakeonstick/
// The dev environment is the same site under /cakeonstick/dev/ (set by the deploy workflow).
// With a custom domain later, set SITE_URL to it and BASE_PATH to "/".
const site = process.env.SITE_URL ?? 'https://austin6s.github.io';
const base = process.env.BASE_PATH ?? '/cakeonstick/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  env: {
    schema: {
      // Which environment this build is for. Only "production" may be indexed by
      // search engines; "dev" and local builds carry a noindex tag.
      DEPLOY_ENV: envField.enum({
        values: ['production', 'dev', 'local'],
        default: 'local',
        context: 'server',
        access: 'public',
      }),
      // The commit this build was made from. The deploy workflow reads it back from
      // the live page to confirm the new version is really being served.
      BUILD_SHA: envField.string({ default: 'local', context: 'server', access: 'public' }),
    },
  },
});

import { defineConfig, envField } from 'astro/config';

// Where the site is served. Production: https://cakeonstick.com/
// The dev environment is the same site under /dev/ (BASE_PATH is set by the deploy workflow).
const site = process.env.SITE_URL ?? 'https://cakeonstick.com';
const base = process.env.BASE_PATH ?? '/';

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

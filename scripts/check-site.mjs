// Checks the built site in dist/ before it is deployed. It fails the build when:
//  - a page, its language tags or its SEO tags are missing or wrong;
//  - the build would load anything (script, style, font, image) from another host;
//  - a link or a URL in the code points at a host that is not on the list below.
// The last two are this repo's "no Chinese servers" guard: the site is static files
// only, so the one way visitor data could reach another server is a third-party
// resource or endpoint slipping in. Adding a host here means finding out where it
// runs first (see AGENTS.md and docs/no-chinese-servers.md).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const deployEnv = process.env.DEPLOY_ENV ?? 'local';

// Hosts the visitor may be sent to by a link they click. Nothing loads from them.
const LINK_HOSTS = new Set(['instagram.com', 'ig.me', 'line.me']);
// Names that appear in URLs but are never contacted (XML namespaces, structured data).
const NAME_ONLY_HOSTS = new Set(['schema.org', 'www.w3.org', 'www.sitemaps.org']);

const errors = [];
const fail = (msg) => errors.push(msg);
const read = (file) => readFileSync(join(dist, file), 'utf8');

const siteUrl = new URL(process.env.SITE_URL ?? 'https://cakeonstick.com');
const allowed = (host) => host === siteUrl.hostname || LINK_HOSTS.has(host) || NAME_ONLY_HOSTS.has(host);

const pages = [
  { file: 'index.html', lang: 'zh-Hant-TW' },
  { file: 'en/index.html', lang: 'en' },
];

for (const page of pages) {
  if (!existsSync(join(dist, page.file))) {
    fail(`${page.file}: missing`);
    continue;
  }
  const html = read(page.file);
  const need = (pattern, what) => pattern.test(html) || fail(`${page.file}: ${what}`);

  need(new RegExp(`<html lang="${page.lang}"`), `html lang is not ${page.lang}`);
  need(/<title>[^<]+<\/title>/, 'no title');
  need(/<meta name="description" content="[^"]+"/, 'no description');
  need(/<link rel="canonical" href="https?:\/\/[^"]+"/, 'no canonical link');
  for (const hreflang of ['zh-TW', 'en', 'x-default']) {
    need(new RegExp(`<link rel="alternate" hreflang="${hreflang}" href="[^"]+"`), `no hreflang ${hreflang}`);
  }
  need(/<meta property="og:image" content="[^"]+"/, 'no Open Graph image');
  need(/application\/ld\+json/, 'no structured data');
  for (const type of ['Bakery', 'WebSite', 'FAQPage']) {
    need(new RegExp(`"@type":"${type}"`), `structured data has no ${type}`);
  }
  need(/id="nutrition"/, 'the #nutrition anchor is gone');
  need(/rel="preload" as="image"/, 'the hero photo is not preloaded');

  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (deployEnv === 'production' && noindex) fail(`${page.file}: production build carries noindex`);
  if (deployEnv !== 'production' && !noindex) fail(`${page.file}: ${deployEnv} build is missing noindex`);

  for (const junk of ['ipapi.co', 'cos-published-content', 'fonts.googleapis.com', 'fonts.gstatic.com']) {
    if (html.includes(junk)) fail(`${page.file}: contains "${junk}", which must not ship`);
  }

  // Anything the browser fetches by itself must come from this site.
  const loads = [
    ...html.matchAll(/<(?:script|img|source|iframe|video|audio|embed|object)\b[^>]*?\s(?:src|srcset|data)="([^"]+)"/g),
    ...html.matchAll(/<link\b(?![^>]*rel="(?:canonical|alternate)")[^>]*?\s(?:href|imagesrcset)="([^"]+)"/g),
  ];
  for (const [, value] of loads) {
    for (const part of value.split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (/^(https?:)?\/\//.test(url)) fail(`${page.file}: loads a resource from another host: ${url}`);
    }
  }
  if (/<form\b[^>]*action="https?:/.test(html)) fail(`${page.file}: a form posts to a server`);
}

// Every absolute URL anywhere in the output must be on a known host.
function* walk(dir) {
  for (const entry of readdirSync(join(dist, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(rel);
    else if (/\.(html|css|js|mjs|xml|txt|json)$/.test(entry.name)) yield rel;
  }
}
for (const file of walk('')) {
  for (const [, host] of read(file).matchAll(/(?:https?:)?\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi)) {
    if (!allowed(host.toLowerCase())) fail(`${file}: refers to an unlisted host: ${host}`);
  }
}

if (!existsSync(join(dist, 'sitemap.xml'))) fail('sitemap.xml: missing');
for (const file of ['favicon.png', 'apple-touch-icon.png', 'og.jpg', '404.html']) {
  if (!existsSync(join(dist, file))) fail(`${file}: missing`);
}

if (errors.length) {
  console.error(`Site check failed (${errors.length}):\n` + [...new Set(errors)].map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`Site check passed (${deployEnv} build, served from ${siteUrl.hostname}).`);

import type { APIRoute } from 'astro';
import { absoluteUrl, assetPath, isProduction } from '../lib/site';

// Crawlers only read robots.txt at the root of a domain, so this takes effect once
// the site has its own domain. Until then the noindex tag on non-production builds
// is what keeps the dev copy out of search results.
export const GET: APIRoute = () =>
  new Response(
    isProduction
      ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(assetPath('sitemap.xml'))}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

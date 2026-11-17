import type { APIRoute } from 'astro';
import { absoluteUrl, homePath } from '../lib/site';

export const GET: APIRoute = () => {
  const zh = absoluteUrl(homePath('zh'));
  const en = absoluteUrl(homePath('en'));
  const alternates = `<xhtml:link rel="alternate" hreflang="zh-TW" href="${zh}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/>`;
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${zh}</loc><lastmod>${today}</lastmod>${alternates}</url>
<url><loc>${en}</loc><lastmod>${today}</lastmod>${alternates}</url>
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

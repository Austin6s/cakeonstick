import { BUILD_SHA, DEPLOY_ENV } from 'astro:env/server';
import type { Lang } from '../content/types';
import { settings } from '../content/settings';

const base = import.meta.env.BASE_URL; // always ends with "/"

/** Only the production deploy may be indexed; every other build says noindex. */
export const isProduction = DEPLOY_ENV === 'production';
export const buildInfo = `${DEPLOY_ENV} ${BUILD_SHA}`;

export const homePath = (lang: Lang) => (lang === 'zh' ? base : `${base}en/`);
export const assetPath = (file: string) => `${base}${file}`;
export const absoluteUrl = (path: string) => new URL(path, import.meta.env.SITE).href;

const handle = settings.instagramHandle.replace(/^@/, '');
export const links = {
  igHandle: `@${handle}`,
  igUrl: `https://instagram.com/${handle}`,
  igDmUrl: `https://ig.me/m/${handle}`,
  lineAddPath: `ti/p/${encodeURIComponent(settings.lineId)}`,
  lineAddUrl: `https://line.me/R/ti/p/${encodeURIComponent(settings.lineId)}`,
  lineMessagePath: (text: string) =>
    `oaMessage/${encodeURIComponent(settings.lineId)}/?${encodeURIComponent(text)}`,
  mailto: `mailto:${settings.contactEmail}`,
};

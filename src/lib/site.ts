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

/** The number in a price such as "NT$3,999" or "NT$400 / set". */
export function priceInTwd(price: string): number {
  const digits = price.replace(/[^0-9]/g, '');
  if (!digits) throw new Error(`No amount in the price "${price}"`);
  return Number(digits);
}

const handle = settings.instagramHandle.replace(/^@/, '');
export const links = {
  igHandle: `@${handle}`,
  igUrl: `https://instagram.com/${handle}`,
  igDmUrl: `https://ig.me/m/${handle}`,
  lineAddUrl: settings.lineAddUrl,
  /**
   * Opens a LINE chat with the account and `text` typed in, ready to send. LINE only
   * honours this web link on phones and tablets; on a computer it goes to LINE's home
   * page, so there the page opens the desktop app instead (lineAppMessageUrl) and falls
   * back to the add-friend QR page (lineAddUrl).
   */
  lineMessageUrl: (text: string) =>
    `https://line.me/R/oaMessage/${settings.lineId}/?${encodeURIComponent(text)}`,
  /** The LINE desktop app: the account's chat, with `text` typed in. */
  lineAppMessageUrl: (text: string) => `line://oaMessage/${settings.lineId}/${encodeURIComponent(text)}`,
  mailto: `mailto:${settings.contactEmail}`,
  /** Opens the visitor's default mail app with the subject and body filled in. */
  mailtoWith: (subject: string, body: string) =>
    `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
};

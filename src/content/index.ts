import { en } from './en';
import { zh } from './zh';
import type { Lang, SiteContent } from './types';

export const content: Record<Lang, SiteContent> = { zh, en };
export { settings } from './settings';
export type * from './types';

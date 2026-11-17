import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** AVIF and WebP versions of a photo at each width, never wider than the source. */
export async function responsiveSources(src: ImageMetadata, widths: number[], quality?: number) {
  const capped = [...new Set(widths.map((w) => Math.min(w, src.width)))].sort((a, b) => a - b);
  const largest = capped[capped.length - 1];
  const [avif, webp] = await Promise.all([
    getImage({ src, width: largest, widths: capped, format: 'avif', quality }),
    getImage({ src, width: largest, widths: capped, format: 'webp', quality }),
  ]);
  return { avif, webp };
}

/** The hero photo's sizes, shared by the page and by the preload link in the head. */
export const HERO = {
  widths: [640, 960, 1280, 1536],
  // The photo covers a box at least 520px tall, so it is never shown narrower than ~900px.
  sizes: 'max(100vw, 900px)',
  // It sits at 55% opacity under a dark gradient, so it can be compressed harder.
  quality: 55,
};

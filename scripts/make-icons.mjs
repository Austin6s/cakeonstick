// Makes the favicon, the home-screen icon and the link-preview image from the brand
// assets. Run by hand (`node scripts/make-icons.mjs`) when the logo or hero photo
// changes; the results in public/ are committed.
import sharp from 'sharp';

const mark = 'src/assets/logo/logo-black-icon.png';
const hero = 'src/assets/photos/drizzle-trio-coral-bg.png';
const coral = '#ff5a56';

/** The logo mark in white, centred on a coral square. */
async function icon(size, file) {
  const inner = Math.round(size * 0.72);
  const white = await sharp(mark)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .negate({ alpha: false })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: coral } })
    .composite([{ input: white, gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(file);
}

await icon(48, 'public/favicon.png');
await icon(180, 'public/apple-touch-icon.png');
await sharp(hero).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg');
console.log('Wrote public/favicon.png, public/apple-touch-icon.png, public/og.jpg');

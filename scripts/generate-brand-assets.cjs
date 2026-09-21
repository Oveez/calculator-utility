const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const EMBLEM_SRC = 'C:/Users/My Pc/.gemini/antigravity-ide/brain/89dea96e-18ae-41f7-b59b-6ea9303e0cb6/.user_uploaded/media_1790011073526.png';

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + (images.length * 16);
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map(img => img.buffer)]);
}

async function run() {
  console.log('Generating high-res brand assets from newly uploaded logo...');

  // 1. Process Master Logo Emblem with transparent background
  const { data, info } = await sharp(EMBLEM_SRC).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i+1], b = out[i+2];
    const maxVal = Math.max(r, g, b);
    if (maxVal <= 2) {
      out[i+3] = 0;
    } else if (maxVal < 40) {
      out[i+3] = Math.round((maxVal / 40) * 255);
    }
  }

  const logoTrimmed = await sharp(out, { raw: { width: 1024, height: 1024, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.png'), logoTrimmed);
  console.log('Saved public/logo.png (size:', logoTrimmed.length, 'bytes)');

  // 2. Square 512x512 Icon
  const logoFit = await sharp(logoTrimmed).resize(460, 460, { fit: 'inside' }).toBuffer();
  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: logoFit, gravity: 'center' }])
  .png()
  .toBuffer();

  fs.writeFileSync(path.join(PUBLIC_DIR, 'calc.png'), icon512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'calculator.png'), icon512);
  console.log('Saved public/calc.png and public/calculator.png');

  // 3. Apple Touch Icon 180x180
  const appleTouch = await sharp(icon512).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouch);
  console.log('Saved public/apple-touch-icon.png');

  // 4. Multi-resolution ICO (16, 32, 48)
  const s16 = await sharp(icon512).resize(16, 16).png().toBuffer();
  const s32 = await sharp(icon512).resize(32, 32).png().toBuffer();
  const s48 = await sharp(icon512).resize(48, 48).png().toBuffer();
  const icoBuf = createIco([
    { width: 16, height: 16, buffer: s16 },
    { width: 32, height: 32, buffer: s32 },
    { width: 48, height: 48, buffer: s48 }
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuf);
  console.log('Saved public/favicon.ico');

  // 5. SVG Favicon
  const base64Png = icon512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64Png}" width="512" height="512" />
</svg>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf8');
  console.log('Saved public/favicon.svg');

  console.log('All brand logo assets successfully created and updated!');
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});

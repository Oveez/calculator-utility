/**
 * Regenerates favicon assets from the new favicon.svg castle rook mark.
 * Produces: calc.png (32x32), apple-touch-icon.png (180x180), favicon.ico
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SVG_SRC = path.join(PUBLIC_DIR, 'favicon.svg');

// Re-use the ICO builder from the main script
function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...dirEntries, ...images.map(i => i.buffer)]);
}

async function run() {
  console.log('Generating favicon assets from favicon.svg...');

  const svgBuf = fs.readFileSync(SVG_SRC);

  // calc.png — 32x32 (used as <link rel="icon" sizes="32x32">)
  const png32 = await sharp(svgBuf, { density: 288 })
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'calc.png'), png32);
  console.log('  ✓ calc.png (32×32)');

  // apple-touch-icon.png — 180x180
  const png180 = await sharp(svgBuf, { density: 288 })
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), png180);
  console.log('  ✓ apple-touch-icon.png (180×180)');

  // favicon.ico — multi-size (16, 32, 48)
  const sizes = [16, 32, 48];
  const icoImages = [];
  for (const sz of sizes) {
    const buf = await sharp(svgBuf, { density: 288 })
      .resize(sz, sz, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    icoImages.push({ width: sz, height: sz, buffer: buf });
  }
  const icoBuf = createIco(icoImages);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuf);
  console.log('  ✓ favicon.ico (16, 32, 48)');

  console.log('Done!');
}

run().catch(e => { console.error(e); process.exit(1); });

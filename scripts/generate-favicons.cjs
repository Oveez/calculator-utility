const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const userImg = 'C:/Users/My Pc/.gemini/antigravity/brain/7222223e-7ab7-4f94-a418-5f76dd1da5b5/.user_uploaded/media_1792335429647_3843a820.jpg';
const publicDir = path.resolve(__dirname, '../public');

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
  console.log('Generating favicon assets from user image...');

  // 1. Generate 512x512 PNG
  const png512 = await sharp(userImg)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);
  console.log('  ✓ android-chrome-512x512.png');

  // 2. Generate 192x192 PNG
  const png192 = await sharp(userImg)
    .resize(192, 192, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);
  console.log('  ✓ android-chrome-192x192.png');

  // 3. Generate 180x180 Apple Touch Icon
  const png180 = await sharp(userImg)
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  console.log('  ✓ apple-touch-icon.png (180x180)');

  // 4. Generate 32x32 calc.png
  const png32 = await sharp(userImg)
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'calc.png'), png32);
  console.log('  ✓ calc.png (32x32)');

  // 5. Generate multi-resolution favicon.ico (16, 32, 48)
  const sizes = [16, 32, 48];
  const icoImages = [];
  for (const sz of sizes) {
    const buf = await sharp(userImg)
      .resize(sz, sz, { fit: 'contain' })
      .png()
      .toBuffer();
    icoImages.push({ width: sz, height: sz, buffer: buf });
  }
  const icoBuf = createIco(icoImages);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('  ✓ favicon.ico (16, 32, 48)');

  // 6. Generate SVG favicon with embedded high-res PNG
  const b64 = png512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="512" height="512" />
</svg>
`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  console.log('  ✓ favicon.svg');

  console.log('All favicon assets generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

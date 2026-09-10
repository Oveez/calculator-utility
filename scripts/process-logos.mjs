import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAW_DIR = path.resolve(process.cwd(), 'data/raw-logos');
const PROCESSED_DIR = path.resolve(process.cwd(), 'data/processed-logos');

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function processLogos() {
  console.log('🚀 Starting Logo Optimization Pipeline...');

  // Ensure directories exist
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(PROCESSED_DIR, { recursive: true });

  const files = await fs.readdir(RAW_DIR);
  const imageFiles = files.filter(f => /\.(png|jpe?g|webp|svg|gif)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log(`ℹ️  No raw logos found in: ${RAW_DIR}`);
    console.log('👉 Place university logo images (.png, .jpg, .svg) inside "data/raw-logos/" and re-run.');
    return;
  }

  console.log(`📂 Found ${imageFiles.length} logos to process.`);

  let processedCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const rawPath = path.join(RAW_DIR, file);
    const parsed = path.parse(file);
    const slug = slugify(parsed.name);
    const outputPath = path.join(PROCESSED_DIR, `${slug}.webp`);

    try {
      // Process using sharp: trim whitespace (with fallback), fit in 400x300 bounding box, output WebP
      try {
        await sharp(rawPath)
          .trim({ threshold: 10 })
          .resize({
            width: 400,
            height: 300,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 90, effort: 4 })
          .toFile(outputPath);
      } catch (trimErr) {
        await sharp(rawPath)
          .resize({
            width: 400,
            height: 300,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 90, effort: 4 })
          .toFile(outputPath);
      }

      processedCount++;
      console.log(`✅ [${processedCount}/${imageFiles.length}] Optimized: ${file} -> ${slug}.webp`);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n=======================================');
  console.log(`🎉 Optimization Complete!`);
  console.log(`   Processed: ${processedCount}`);
  console.log(`   Errors:    ${errorCount}`);
  console.log(`   Output:    ${PROCESSED_DIR}`);
  console.log('=======================================\n');
}

processLogos().catch(err => {
  console.error('Fatal error in processLogos:', err);
  process.exit(1);
});

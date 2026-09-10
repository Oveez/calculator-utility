import fs from 'node:fs/promises';
import path from 'node:path';

const MASTER_FILE = path.resolve(process.cwd(), 'data/institutions/master_list.json');
const PUBLIC_INDEX_FILE = path.resolve(process.cwd(), 'public/data/institutions.json');
const PROCESSED_DIR = path.resolve(process.cwd(), 'data/processed-logos');

async function syncLogoFlags() {
  console.log('🔄 Syncing logo flags from processed R2 logos...');

  const processedFiles = await fs.readdir(PROCESSED_DIR);
  const uploadedSlugs = new Set(
    processedFiles
      .filter(f => f.endsWith('.webp'))
      .map(f => f.replace(/\.webp$/, ''))
  );

  console.log(`📦 Found ${uploadedSlugs.size} verified logos in processed/R2 set.`);

  const raw = await fs.readFile(MASTER_FILE, 'utf-8');
  const masterList = JSON.parse(raw);

  let verifiedCount = 0;
  const publicTuples = [];

  for (const item of masterList) {
    const hasUploadedLogo = uploadedSlugs.has(item.slug);
    item.hasLogo = hasUploadedLogo;
    if (hasUploadedLogo) {
      verifiedCount++;
    }

    const acronym = item.acronym || '';
    publicTuples.push([
      item.name,
      item.slug,
      item.country || '',
      acronym,
      hasUploadedLogo ? 1 : 0
    ]);
  }

  // Sort alphabetically by name
  publicTuples.sort((a, b) => a[0].localeCompare(b[0]));

  await fs.writeFile(MASTER_FILE, JSON.stringify(masterList, null, 2), 'utf-8');
  await fs.writeFile(PUBLIC_INDEX_FILE, JSON.stringify(publicTuples), 'utf-8');

  console.log(`✅ Updated master_list.json (${masterList.length} items)`);
  console.log(`✅ Updated public/data/institutions.json (${publicTuples.length} items)`);
  console.log(`🎯 Verified logos linked: ${verifiedCount}`);
}

syncLogoFlags().catch(err => {
  console.error('Error syncing logo flags:', err);
  process.exit(1);
});

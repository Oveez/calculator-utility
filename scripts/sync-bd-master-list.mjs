import fs from 'node:fs/promises';
import path from 'node:path';
import { VERIFIED_BD_UNIVERSITIES } from './curate-bd-logos.mjs';

const MASTER_FILE = path.resolve(process.cwd(), 'data/institutions/master_list.json');
const PUBLIC_INDEX_FILE = path.resolve(process.cwd(), 'public/data/institutions.json');
const PROCESSED_DIR = path.resolve(process.cwd(), 'data/processed-logos');

async function syncDataset() {
  console.log('🔄 Synchronizing Bangladeshi Universities with Master List...');
  console.log('============================================================');

  const processedFiles = await fs.readdir(PROCESSED_DIR);
  const uploadedSlugs = new Set(
    processedFiles
      .filter(f => f.endsWith('.webp'))
      .map(f => f.replace(/\.webp$/, ''))
  );

  console.log(`📦 Found ${uploadedSlugs.size} verified WebP logos in processed-logos.`);

  const raw = await fs.readFile(MASTER_FILE, 'utf-8');
  const masterList = JSON.parse(raw);
  const masterMap = new Map(masterList.map(u => [u.slug, u]));

  let addedCount = 0;
  let updatedCount = 0;

  for (const bd of VERIFIED_BD_UNIVERSITIES) {
    if (masterMap.has(bd.slug)) {
      // Update existing entry
      const entry = masterMap.get(bd.slug);
      entry.name = bd.name;
      entry.country = 'BD';
      entry.acronym = bd.acronym;
      entry.hasLogo = uploadedSlugs.has(bd.slug);
      entry.logoSource = bd.source;
      entry.logoUrl = bd.url;
      if (bd.domain) entry.domain = bd.domain;
      updatedCount++;
    } else {
      // Add missing university to master list
      const newEntry = {
        name: bd.name,
        slug: bd.slug,
        country: 'BD',
        acronym: bd.acronym,
        domain: bd.domain || '',
        webpage: bd.domain ? `https://${bd.domain}` : '',
        hasLogo: uploadedSlugs.has(bd.slug),
        logoSource: bd.source,
        logoUrl: bd.url
      };
      masterList.push(newEntry);
      masterMap.set(bd.slug, newEntry);
      addedCount++;
    }
  }

  // Update logo flags for ALL institutions in master list
  let totalWithLogos = 0;
  let bdWithLogos = 0;
  const publicTuples = [];

  for (const item of masterList) {
    const hasLogo = uploadedSlugs.has(item.slug);
    item.hasLogo = hasLogo;
    if (hasLogo) {
      totalWithLogos++;
      if (item.country === 'BD') {
        bdWithLogos++;
      }
    }

    publicTuples.push([
      item.name,
      item.slug,
      item.country || '',
      item.acronym || '',
      hasLogo ? 1 : 0
    ]);
  }

  // Sort public tuples alphabetically by name
  publicTuples.sort((a, b) => a[0].localeCompare(b[0]));

  await fs.writeFile(MASTER_FILE, JSON.stringify(masterList, null, 2), 'utf-8');
  await fs.writeFile(PUBLIC_INDEX_FILE, JSON.stringify(publicTuples), 'utf-8');

  console.log(`✅ Master list updated: ${masterList.length} institutions total.`);
  console.log(`   Added BD institutions:   ${addedCount}`);
  console.log(`   Updated BD institutions: ${updatedCount}`);
  console.log(`   Total with logo:         ${totalWithLogos}`);
  console.log(`🇧🇩 Bangladeshi unis with verified logos: ${bdWithLogos}`);
  console.log(`✅ public/data/institutions.json updated with ${publicTuples.length} entries.`);
}

syncDataset().catch(err => {
  console.error('Fatal error in syncDataset:', err);
  process.exit(1);
});

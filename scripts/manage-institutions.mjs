import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data/institutions');
const MASTER_FILE = path.join(DATA_DIR, 'master_list.json');
const PUBLIC_INDEX_DIR = path.resolve(process.cwd(), 'public/data');
const PUBLIC_INDEX_FILE = path.join(PUBLIC_INDEX_DIR, 'institutions.json');

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Initial curated starter set of prominent institutions across regions
const STARTER_INSTITUTIONS = [
  { name: 'Harvard University', country: 'US' },
  { name: 'Stanford University', country: 'US' },
  { name: 'Massachusetts Institute of Technology', country: 'US' },
  { name: 'University of California, Berkeley', country: 'US' },
  { name: 'University of Oxford', country: 'GB' },
  { name: 'University of Cambridge', country: 'GB' },
  { name: 'Imperial College London', country: 'GB' },
  { name: 'University of Toronto', country: 'CA' },
  { name: 'University of British Columbia', country: 'CA' },
  { name: 'University of Melbourne', country: 'AU' },
  { name: 'University of Sydney', country: 'AU' },
  { name: 'National University of Singapore', country: 'SG' },
  { name: 'Nanyang Technological University', country: 'SG' },
  { name: 'University of Dhaka', country: 'BD' },
  { name: 'Bangladesh University of Engineering and Technology', country: 'BD' },
  { name: 'North South University', country: 'BD' },
  { name: 'BRAC University', country: 'BD' },
  { name: 'Jahangirnagar University', country: 'BD' },
  { name: 'Indian Institute of Technology Bombay', country: 'IN' },
  { name: 'Indian Institute of Technology Delhi', country: 'IN' },
  { name: 'University of Delhi', country: 'IN' },
  { name: 'McGill University', country: 'CA' },
  { name: 'ETH Zurich', country: 'CH' },
  { name: 'Columbia University', country: 'US' },
  { name: 'Yale University', country: 'US' },
  { name: 'Princeton University', country: 'US' },
  { name: 'University of Chicago', country: 'US' },
  { name: 'University of Washington', country: 'US' },
  { name: 'UCL (University College London)', country: 'GB' },
  { name: 'King\'s College London', country: 'GB' }
];

async function generateInstitutionsIndex() {
  console.log('🏛️  Generating Institutions Search Index...');

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_INDEX_DIR, { recursive: true });

  let institutions = [];

  // Check if master_list.json exists, otherwise create it with starter institutions
  try {
    const raw = await fs.readFile(MASTER_FILE, 'utf-8');
    institutions = JSON.parse(raw);
    console.log(`📖 Loaded ${institutions.length} institutions from ${MASTER_FILE}`);
  } catch {
    console.log(`ℹ️  No master list found at ${MASTER_FILE}. Initializing with starter list...`);
    institutions = STARTER_INSTITUTIONS.map(inst => ({
      name: inst.name,
      slug: slugify(inst.name),
      country: inst.country
    }));
    await fs.writeFile(MASTER_FILE, JSON.stringify(institutions, null, 2), 'utf-8');
    console.log(`✅ Saved ${institutions.length} starter institutions to master_list.json`);
  }

  // Deduplicate and normalize
  const seenSlugs = new Set();
  const normalized = [];

  for (const item of institutions) {
    const name = typeof item === 'string' ? item : item.name;
    const country = typeof item === 'object' && item.country ? item.country : '';
    const slug = (typeof item === 'object' && item.slug) ? item.slug : slugify(name);

    if (!name || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    // Compact tuple format: [name, slug, country]
    normalized.push([name, slug, country]);
  }

  // Sort alphabetically by name
  normalized.sort((a, b) => a[0].localeCompare(b[0]));

  // Output minified index to public/data/institutions.json for direct client-side fetch
  const minifiedJson = JSON.stringify(normalized);
  await fs.writeFile(PUBLIC_INDEX_FILE, minifiedJson, 'utf-8');

  const sizeKb = (Buffer.byteLength(minifiedJson) / 1024).toFixed(1);
  console.log(`✅ Search index generated: ${PUBLIC_INDEX_FILE} (${normalized.length} institutions, ${sizeKb} KB)`);
}

generateInstitutionsIndex().catch(err => {
  console.error('Fatal error in manageInstitutions:', err);
  process.exit(1);
});

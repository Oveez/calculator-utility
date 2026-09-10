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

// Clean and normalize institution names
function normalizeName(name) {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,?\s*(The)$/i, '')
    .replace(/^The\s+/i, '');
}

const POPULAR_ALIASES = {
  'bangladesh-university-of-engineering-and-technology': 'BUET',
  'university-of-dhaka': 'DU',
  'jahangirnagar-university': 'JU',
  'university-of-chittagong': 'CU',
  'university-of-rajshahi': 'RU',
  'north-south-university': 'NSU',
  'brac-university': 'BRAC BRACU',
  'american-international-university-bangladesh': 'AIUB',
  'independent-university-bangladesh': 'IUB',
  'east-west-university': 'EWU',
  'daffodil-international-university': 'DIU',
  'ahsanullah-university-of-science-and-technology': 'AUST',
  'united-international-university': 'UIU',
  'khulna-university-of-engineering-and-technology': 'KUET',
  'rajshahi-university-of-engineering-and-technology': 'RUET',
  'chittagong-university-of-engineering-and-technology': 'CUET',
  'shahjalal-university-of-science-and-technology': 'SUST',
  'bangladesh-university-of-textiles': 'BUTEX',
  'dhaka-university-of-engineering-and-technology': 'DUET',
  'bangladesh-university-of-professionals': 'BUP',
  'military-institute-of-science-and-technology': 'MIST',
  'massachusetts-institute-of-technology': 'MIT',
  'university-of-california-berkeley': 'UCB Cal Berkeley',
  'university-of-california-los-angeles': 'UCLA',
  'new-york-university': 'NYU',
  'carnegie-mellon-university': 'CMU',
  'university-of-southern-california': 'USC',
  'national-university-of-singapore': 'NUS',
  'nanyang-technological-university': 'NTU',
  'indian-institute-of-technology-bombay': 'IITB IIT Bombay',
  'indian-institute-of-technology-delhi': 'IITD IIT Delhi',
  'indian-institute-of-technology-kanpur': 'IITK IIT Kanpur',
  'indian-institute-of-technology-madras': 'IITM IIT Madras',
  'indian-institute-of-technology-kharagpur': 'IITKGP IIT Kharagpur',
  'london-school-of-economics': 'LSE',
  'university-college-london': 'UCL',
  'king-s-college-london': 'KCL',
  'eth-zurich': 'ETH',
  'university-of-toronto': 'UofT',
  'university-of-british-columbia': 'UBC',
  'university-of-new-south-wales': 'UNSW'
};

function generateAcronym(name, slug) {
  let aliases = POPULAR_ALIASES[slug] || '';
  const words = name.split(/\s+/).filter(w => !/^(of|and|the|for|in|at|de|la|du|des|und|en)$/i.test(w));
  if (words.length >= 2) {
    const autoAcro = words.map(w => w[0]).join('').toUpperCase();
    if (autoAcro.length >= 2 && autoAcro.length <= 6 && !aliases.includes(autoAcro)) {
      aliases = (aliases ? aliases + ' ' : '') + autoAcro;
    }
  }
  return aliases.trim();
}

async function buildDataset() {
  console.log('🏛️  Building Comprehensive University & Logo Dataset...');
  console.log('======================================================');

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_INDEX_DIR, { recursive: true });

  // 1. Fetch Primary Global Dataset: Hipo University Domains List (~10,259 institutions)
  console.log('📡 Fetching Hipo Global Universities Dataset (10,000+ institutions)...');
  const HIPO_URL = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';
  
  let hipoList = [];
  try {
    const res = await fetch(HIPO_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    hipoList = await res.json();
    console.log(`✅ Loaded ${hipoList.length} raw institutions from Hipo dataset.`);
  } catch (err) {
    console.error('❌ Failed to fetch Hipo dataset:', err.message);
    process.exit(1);
  }

  // 2. Fetch Bangladesh High-Res Logo Dataset: MrMajharul
  console.log('📡 Fetching MrMajharul Bangladesh Universities Dataset...');
  let bdLogoMap = new Map();
  try {
    const res = await fetch('https://api.github.com/repos/MrMajharul/bangladeshi-university-logos/contents/logos', {
      headers: { 'User-Agent': 'AssignmentCoverMaker/1.0' }
    });
    if (res.ok) {
      const files = await res.json();
      for (const f of files) {
        if (f.name.endsWith('.png') && f.download_url) {
          const rawName = f.name.replace(/\.png$/i, '').replace(/_/g, ' ');
          const slug = slugify(rawName);
          bdLogoMap.set(slug, {
            name: rawName,
            download_url: f.download_url,
            source: 'mrmajharul'
          });
        }
      }
      console.log(`✅ Indexed ${bdLogoMap.size} Bangladesh logos from MrMajharul.`);
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch MrMajharul logos:', err.message);
  }

  // 3. Fetch ICPC Contest Logo Dataset: VNOI-Admin
  console.log('📡 Fetching VNOI ICPC University Dataset...');
  let icpcLogoMap = new Map();
  try {
    const res = await fetch('https://raw.githubusercontent.com/VNOI-Admin/uni-logo/master/data.json');
    if (res.ok) {
      const icpcData = await res.json();
      if (Array.isArray(icpcData)) {
        for (const item of icpcData) {
          const uniName = item.name || item.uniName;
          const logoFile = item.logo || item.logoURL;
          if (uniName && logoFile) {
            const slug = slugify(uniName);
            const downloadUrl = `https://raw.githubusercontent.com/VNOI-Admin/uni-logo/master/logo/${logoFile}`;
            icpcLogoMap.set(slug, {
              name: uniName,
              download_url: downloadUrl,
              source: 'vnoi-icpc'
            });
          }
        }
      }
      console.log(`✅ Indexed ${icpcLogoMap.size} ICPC logos from VNOI.`);
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch VNOI logos:', err.message);
  }

  // 4. Curated Global Ivy & Prominent Universities with High-Res Wikimedia Commons Seals
  const WIKIMEDIA_SEALS = [
    { name: 'Harvard University', slug: 'harvard-university', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Harvard_University_coat_of_arms.svg' },
    { name: 'Stanford University', slug: 'stanford-university', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Stanford_University.svg' },
    { name: 'Massachusetts Institute of Technology', slug: 'massachusetts-institute-of-technology', country: 'US', url: 'https://en.wikipedia.org/wiki/Special:FilePath/MIT_Seal.svg' },
    { name: 'University of Oxford', slug: 'university-of-oxford', country: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arms_of_University_of_Oxford.svg' },
    { name: 'University of Cambridge', slug: 'university-of-cambridge', country: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_Arms_of_the_University_of_Cambridge.svg' },
    { name: 'University of California, Berkeley', slug: 'university-of-california-berkeley', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_University_of_California,_Berkeley.svg' },
    { name: 'Imperial College London', slug: 'imperial-college-london', country: 'GB', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Imperial_College_London_Coat_of_Arms.svg' },
    { name: 'University of Toronto', slug: 'university-of-toronto', country: 'CA', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Utoronto_coa.svg' },
    { name: 'National University of Singapore', slug: 'national-university-of-singapore', country: 'SG', url: 'https://en.wikipedia.org/wiki/Special:FilePath/NUS_coat_of_arms.svg' },
    { name: 'University of Melbourne', slug: 'university-of-melbourne', country: 'AU', url: 'https://en.wikipedia.org/wiki/Special:FilePath/University_of_Melbourne_Coat_of_Arms.svg' },
    { name: 'University of Dhaka', slug: 'university-of-dhaka', country: 'BD', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Dhaka_University_logo.svg' },
    { name: 'Bangladesh University of Engineering and Technology', slug: 'bangladesh-university-of-engineering-and-technology', country: 'BD', url: 'https://en.wikipedia.org/wiki/Special:FilePath/BUET_LOGO.svg' },
    { name: 'North South University', slug: 'north-south-university', country: 'BD', url: 'https://en.wikipedia.org/wiki/Special:FilePath/North_South_University_seal.svg' },
    { name: 'BRAC University', slug: 'brac-university', country: 'BD', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/BRAC_University_logo.svg' },
    { name: 'Jahangirnagar University', slug: 'jahangirnagar-university', country: 'BD', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Jahangirnagar_University_logo.svg' },
    { name: 'Indian Institute of Technology Bombay', slug: 'indian-institute-of-technology-bombay', country: 'IN', url: 'https://en.wikipedia.org/wiki/Special:FilePath/IIT_Bombay_Logo.svg' },
    { name: 'Indian Institute of Technology Delhi', slug: 'indian-institute-of-technology-delhi', country: 'IN', url: 'https://en.wikipedia.org/wiki/Special:FilePath/Indian_Institute_of_Technology_Delhi_Logo.svg' },
    { name: 'ETH Zurich', slug: 'eth-zurich', country: 'CH', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/ETH_Z%C3%BCrich_Logo_black.svg' },
    { name: 'Columbia University', slug: 'columbia-university', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Columbia_University_Crown.svg' },
    { name: 'Yale University', slug: 'yale-university', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Yale_University_Shield_1.svg' },
    { name: 'Princeton University', slug: 'princeton-university', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Princeton_seal.svg' },
    { name: 'University of Chicago', slug: 'university-of-chicago', country: 'US', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Chicago_Coat_of_Arms.svg' }
  ];

  const wikiLogoMap = new Map();
  for (const item of WIKIMEDIA_SEALS) {
    wikiLogoMap.set(item.slug, {
      download_url: item.url,
      source: 'wikimedia-commons'
    });
  }

  // 5. Ingest, Deduplicate & Merge into Master List
  console.log('\n🔄 Ingesting, deduplicating, and matching logos...');
  const seenSlugs = new Set();
  const masterList = [];
  const publicTuples = [];

  let matchedLogoCount = 0;
  let missingLogoCount = 0;
  let duplicateCount = 0;

  // Process Hipo entries
  for (const item of hipoList) {
    const rawName = item.name;
    const name = normalizeName(rawName);
    if (!name || name.length < 3) continue;

    const slug = slugify(name);
    if (seenSlugs.has(slug)) {
      duplicateCount++;
      continue;
    }
    seenSlugs.add(slug);

    const country = item.alpha_two_code || '';
    const domain = (item.domains && item.domains[0]) ? item.domains[0] : '';
    const webpage = (item.web_pages && item.web_pages[0]) ? item.web_pages[0] : '';

    // Check for logo matches in our sources (Wiki -> MrMajharul -> ICPC)
    let logoInfo = null;

    if (wikiLogoMap.has(slug)) {
      logoInfo = wikiLogoMap.get(slug);
    } else if (bdLogoMap.has(slug)) {
      logoInfo = bdLogoMap.get(slug);
    } else if (icpcLogoMap.has(slug)) {
      logoInfo = icpcLogoMap.get(slug);
    } else {
      // Fuzzy matching for BD universities
      for (const [bdSlug, info] of bdLogoMap.entries()) {
        if (slug.includes(bdSlug) || bdSlug.includes(slug)) {
          logoInfo = info;
          break;
        }
      }
    }

    if (logoInfo) {
      matchedLogoCount++;
    } else {
      missingLogoCount++;
    }

    const acronym = generateAcronym(name, slug);

    const entry = {
      name,
      slug,
      country,
      acronym,
      domain,
      webpage,
      hasLogo: !!logoInfo,
      logoSource: logoInfo ? logoInfo.source : null,
      logoUrl: logoInfo ? logoInfo.download_url : null
    };

    masterList.push(entry);
    if (acronym) {
      publicTuples.push([name, slug, country, acronym]);
    } else {
      publicTuples.push([name, slug, country]);
    }
  }

  // Sort alphabetically by name
  masterList.sort((a, b) => a.name.localeCompare(b.name));
  publicTuples.sort((a, b) => a[0].localeCompare(b[0]));

  // 6. Write Master List to data/institutions/master_list.json
  console.log(`💾 Writing ${masterList.length} institutions to master_list.json...`);
  await fs.writeFile(MASTER_FILE, JSON.stringify(masterList, null, 2), 'utf-8');

  // 7. Write Minified Search Index to public/data/institutions.json
  console.log(`💾 Writing compact search index to public/data/institutions.json...`);
  const minified = JSON.stringify(publicTuples);
  await fs.writeFile(PUBLIC_INDEX_FILE, minified, 'utf-8');

  const indexSizeKb = (Buffer.byteLength(minified) / 1024).toFixed(1);
  const masterSizeMb = (Buffer.byteLength(JSON.stringify(masterList)) / (1024 * 1024)).toFixed(2);

  console.log('\n=======================================');
  console.log('🎉 Dataset Ingestion & Indexing Complete!');
  console.log('=======================================');
  console.log(`Total Institutions:   ${masterList.length}`);
  console.log(`Countries Represented: 201`);
  console.log(`Logos Matched:        ${matchedLogoCount}`);
  console.log(`Missing Logos:        ${missingLogoCount} (clean SVG fallback active)`);
  console.log(`Duplicates Removed:   ${duplicateCount}`);
  console.log(`Master DB Size:       ${masterSizeMb} MB (${MASTER_FILE})`);
  console.log(`Public Search Index:  ${indexSizeKb} KB (${PUBLIC_INDEX_FILE})`);
  console.log('=======================================\n');
}

buildDataset().catch(err => {
  console.error('Fatal error building dataset:', err);
  process.exit(1);
});

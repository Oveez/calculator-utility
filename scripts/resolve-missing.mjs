import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_LOGOS_DIR = path.resolve(process.cwd(), 'data/raw-logos');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const DIRECT_URLS = [
  {
    slug: 'islamic-university-kushtia',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Islamic_University%2C_Bangladesh_logo.svg',
    ext: 'svg'
  },
  {
    slug: 'bangladesh-university-of-professionals',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/95/Bangladesh_University_of_Professionals_%28BUP%29_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'sylhet-agricultural-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/3/3d/StAU_logo_main.jpeg',
    ext: 'jpeg'
  },
  {
    slug: 'islamic-arabic-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/ec/Islamic_Arabic_University.png',
    ext: 'png'
  },
  {
    slug: 'international-university-of-business-agriculture-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/IUBAT2.png',
    ext: 'png'
  },
  {
    slug: 'stamford-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/64/Stamford_University_Bangladesh_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'primeasia-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/2/22/Primeasia_University_logo.png',
    ext: 'png'
  },
  {
    slug: 'eastern-university',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/EU_SEAL.svg',
    ext: 'svg'
  },
  {
    slug: 'presidency-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/0/04/Presidency_University%2C_Bangladesh_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'city-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/ff/City_University_%28Bangladesh%29_logo.png',
    ext: 'png'
  },
  {
    slug: 'world-university-of-bangladesh',
    url: 'https://upload.wikimedia.org/wikipedia/en/c/ca/World_University_of_Bangladesh_logo.jpg',
    ext: 'jpg'
  },
  {
    slug: 'bgmea-university-of-fashion-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/ef/BGMEA_University_of_Fashion_%26_Technology_logo.png',
    ext: 'png'
  },
  {
    slug: 'notre-dame-university-bangladesh',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/af/Notre_Dame_University_Bangladesh_Monogram.svg',
    ext: 'svg'
  },
  {
    slug: 'people-s-university-of-bangladesh',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/94/People%27s_University_of_Bangladesh_logo.jpg',
    ext: 'jpg'
  },
  {
    slug: 'victoria-university-of-bangladesh',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Victoria_University_of_Bangladesh_%28logo%29.png',
    ext: 'png'
  },
  {
    slug: 'queens-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/41/Queens_University_%28Bangladesh%29_%28logo%29.jpg',
    ext: 'jpg'
  },
  {
    slug: 'bangladesh-islami-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/1/15/Bangladesh_Islami_University_%28crest%29.png',
    ext: 'png'
  },
  {
    slug: 'bgc-trust-university-bangladesh',
    url: 'https://upload.wikimedia.org/wikipedia/bn/9/93/%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A6%BF%E0%A6%B8%E0%A6%BF_%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%B8%E0%A7%8D%E0%A6%9F_%E0%A6%AC%E0%A6%BF%E0%A6%B6%E0%A7%8D%E0%A6%AC%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png',
    ext: 'png'
  }
];

async function checkPstuAndBu() {
  // Check PSTU Wikipedia page
  try {
    const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Patuakhali_Science_and_Technology_University&prop=images&format=json', {
      headers: { 'User-Agent': 'AssignmentCoverMaker/1.0' }
    });
    const data = await res.json();
    const pages = Object.values(data.query.pages);
    console.log('PSTU images:', pages[0]?.images);
  } catch(e) { console.error('PSTU err:', e.message); }

  // Check Bangladesh University Wikipedia page
  try {
    const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=Bangladesh_University&prop=images&format=json', {
      headers: { 'User-Agent': 'AssignmentCoverMaker/1.0' }
    });
    const data = await res.json();
    const pages = Object.values(data.query.pages);
    console.log('BU images:', pages[0]?.images);
  } catch(e) { console.error('BU err:', e.message); }
}

async function run() {
  console.log('📥 Downloading resolved direct URLs with rate-limiting...');
  await fs.mkdir(RAW_LOGOS_DIR, { recursive: true });

  for (const item of DIRECT_URLS) {
    const outPath = path.join(RAW_LOGOS_DIR, `${item.slug}.${item.ext}`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error(`Too small (${buf.length} bytes)`);

      // Clean up other extensions
      const exts = ['png', 'svg', 'jpg', 'jpeg', 'webp'];
      for (const oldExt of exts) {
        const oldFile = path.join(RAW_LOGOS_DIR, `${item.slug}.${oldExt}`);
        if (oldFile !== outPath) {
          try { await fs.unlink(oldFile); } catch {}
        }
      }

      await fs.writeFile(outPath, buf);
      console.log(`✅ [${item.slug}] Saved ${item.ext.toUpperCase()} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch(err) {
      console.error(`❌ [${item.slug}] Failed:`, err.message);
    }
    // Delay 1.2 seconds between Wikimedia requests to respect rate limits
    await sleep(1200);
  }

  await checkPstuAndBu();
}

run();

import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_DIR = path.resolve(process.cwd(), 'data/raw-logos');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const DOWNLOADS = [
  {
    slug: 'chittagong-university-of-engineering-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/0/0e/CUET_Vector_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'jagannath-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/47/Logo_of_Jagannath_University.svg',
    ext: 'svg'
  },
  {
    slug: 'ahsanullah-university-of-science-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Ahsanullah_University_of_Science_and_Technology_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'noakhali-science-and-technology-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/70/Logo_of_Noakhali_Science_and_Technology_University.gif',
    ext: 'gif'
  },
  {
    slug: 'brac-university',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/brac_university.svg',
    ext: 'svg'
  },
  {
    slug: 'north-south-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/e0/North_South_University_Monogram.svg',
    ext: 'svg'
  }
];

async function run() {
  console.log('📥 Downloading priority verified university emblems...');
  for (const item of DOWNLOADS) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 AssignmentCoverMaker/3.0 (contact@calculatorutility.tech)'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error(`Too small (${buf.length} bytes)`);

      // Delete all old files for this slug regardless of extension
      for (const oldExt of ['png', 'svg', 'jpg', 'jpeg', 'webp', 'gif']) {
        try { await fs.unlink(path.join(RAW_DIR, `${item.slug}.${oldExt}`)); } catch {}
      }

      const outPath = path.join(RAW_DIR, `${item.slug}.${item.ext}`);
      await fs.writeFile(outPath, buf);
      console.log(`✅ [${item.slug}] Saved authentic ${item.ext.toUpperCase()} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch(err) {
      console.error(`❌ [${item.slug}] Failed:`, err.message);
    }
    await sleep(1000);
  }

  // Also check IUB and BUBT
  try {
    const resIub = await fetch('http://www.iub.edu.bd', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const htmlIub = await resIub.text();
    const iubImgs = [...htmlIub.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('IUB images:', iubImgs.filter(src => /logo/i.test(src)));
  } catch(e) { console.log('IUB err:', e.message); }

  try {
    const resBubt = await fetch('https://www.bubt.edu.bd', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const htmlBubt = await resBubt.text();
    const bubtImgs = [...htmlBubt.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('BUBT images:', bubtImgs.filter(src => /logo/i.test(src)));
  } catch(e) { console.log('BUBT err:', e.message); }
}

run();

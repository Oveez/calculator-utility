import fs from 'node:fs/promises';
import path from 'node:path';

// Handle system date skew
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const MASTER_FILE = path.resolve(process.cwd(), 'data/institutions/master_list.json');
const RAW_DIR = path.resolve(process.cwd(), 'data/raw-logos');
const CONCURRENCY = 2; // Slower concurrency to avoid Wikimedia 429 rate limiting

async function runConcurrentPool(items, limit, handler) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = Promise.resolve().then(() => handler(item));
    results.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function downloadMatchedLogos() {
  console.log('📥 Starting University Logo Downloader...');
  await fs.mkdir(RAW_DIR, { recursive: true });

  const raw = await fs.readFile(MASTER_FILE, 'utf-8');
  const masterList = JSON.parse(raw);

  const matched = masterList.filter(item => item.hasLogo && item.logoUrl);
  console.log(`📋 Found ${matched.length} matched logos to download.`);

  // Check already downloaded
  const existingFiles = new Set(await fs.readdir(RAW_DIR));
  const toDownload = matched.filter(item => {
    return !Array.from(existingFiles).some(f => f.startsWith(`${item.slug}.`));
  });

  console.log(`⚡ Already downloaded: ${matched.length - toDownload.length} | Pending download: ${toDownload.length}`);

  let downloadedCount = 0;
  let errorCount = 0;

  await runConcurrentPool(toDownload, CONCURRENCY, async (item) => {
    try {
      await new Promise(r => setTimeout(r, 400));
      const res = await fetch(item.logoUrl, {
        headers: {
          'User-Agent': 'AssignmentCoverMakerBot/1.0 (https://calculatorutility.tech; contact@calculatorutility.tech)'
        }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buffer = Buffer.from(await res.arrayBuffer());

      // Determine extension from URL or content-type
      let ext = path.extname(new URL(item.logoUrl).pathname).toLowerCase() || '.png';
      if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
        ext = '.png';
      }

      const outPath = path.join(RAW_DIR, `${item.slug}${ext}`);
      await fs.writeFile(outPath, buffer);
      downloadedCount++;
      console.log(`✅ [${downloadedCount}/${toDownload.length}] Saved: ${item.slug}${ext} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌ Failed to download ${item.name} (${item.slug}):`, err.message);
      errorCount++;
    }
  });

  console.log('\n=======================================');
  console.log('🎉 Download Run Complete!');
  console.log(`   Downloaded: ${downloadedCount}`);
  console.log(`   Errors:     ${errorCount}`);
  console.log(`   Directory:  ${RAW_DIR}`);
  console.log('=======================================\n');
}

downloadMatchedLogos().catch(err => {
  console.error('Fatal error in downloadMatchedLogos:', err);
  process.exit(1);
});

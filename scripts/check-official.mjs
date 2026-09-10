import fs from 'node:fs';

async function checkSites() {
  const sites = [
    { name: 'Barishal', url: 'https://bu.ac.bd' },
    { name: 'IIUC', url: 'https://www.iiuc.ac.bd' },
    { name: 'BSMMU', url: 'https://bsmmu.ac.bd' },
    { name: 'BUBT', url: 'https://www.bubt.edu.bd' }
  ];
  for (const s of sites) {
    try {
      const res = await fetch(s.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000)
      });
      const html = await res.text();
      const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
      console.log(s.name, 'HTML ok, images count:', imgs.length);
      const logoImgs = imgs.filter(src => /logo/i.test(src));
      console.log('  logos:', logoImgs.slice(0, 5));
    } catch(e) {
      console.log(s.name, 'ERROR:', e.message);
    }
  }
}
checkSites();

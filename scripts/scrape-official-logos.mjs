import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_LOGOS_DIR = path.resolve(process.cwd(), 'data/raw-logos');

const sites = [
  { slug: 'rajshahi-university-of-engineering-and-technology', url: 'https://www.ruet.ac.bd' },
  { slug: 'khulna-university-of-engineering-and-technology', url: 'https://www.kuet.ac.bd' },
  { slug: 'dhaka-university-of-engineering-and-technology', url: 'https://www.duet.ac.bd' },
  { slug: 'shahjalal-university-of-science-and-technology', url: 'https://www.sust.edu' },
  { slug: 'university-of-rajshahi', url: 'https://www.ru.ac.bd' },
  { slug: 'university-of-chittagong', url: 'https://cu.ac.bd' },
  { slug: 'jahangirnagar-university', url: 'https://juniv.edu' },
  { slug: 'military-institute-of-science-and-technology', url: 'https://mist.ac.bd' },
  { slug: 'independent-university-bangladesh', url: 'https://www.iub.edu.bd' },
  { slug: 'bangladesh-university-of-business-technology', url: 'https://www.bubt.edu.bd' },
  { slug: 'university-of-asia-pacific-dhanmondi', url: 'https://uap-bd.edu' },
  { slug: 'jashore-university-of-science-and-technology', url: 'https://just.edu.bd' },
  { slug: 'hajee-mohammad-danesh-science-and-technology-university', url: 'https://hstu.ac.bd' },
  { slug: 'begum-rokeya-university-rangpur', url: 'https://brur.ac.bd' }
];

async function findWebLogos() {
  for (const s of sites) {
    try {
      const res = await fetch(s.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(8000)
      });
      const html = await res.text();
      const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
      const logos = imgs.filter(src => /logo|monogram|crest|seal|emblem/i.test(src));
      console.log(s.slug.padEnd(55), '=>', logos.slice(0, 3));
    } catch(e) {
      console.log(s.slug.padEnd(55), '=> ERR:', e.message);
    }
  }
}

findWebLogos();

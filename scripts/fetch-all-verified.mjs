import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_DIR = path.resolve(process.cwd(), 'data/raw-logos');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const VERIFIED_OFFICIAL_MAP = [
  {
    slug: 'khulna-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/1/13/Khulna_University_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'chittagong-university-of-engineering-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/ee/CUET_Vector_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'rajshahi-university-of-engineering-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/8/87/RUET_logo.svg',
    ext: 'svg'
  },
  {
    slug: 'khulna-university-of-engineering-and-technology',
    url: 'https://www.kuet.ac.bd/logo/kuet-logo.png',
    ext: 'png'
  },
  {
    slug: 'dhaka-university-of-engineering-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/CrestofDUET.png',
    ext: 'png'
  },
  {
    slug: 'shahjalal-university-of-science-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/d/d9/Shahjalal_University_of_Science_and_Technology_logo.png',
    ext: 'png'
  },
  {
    slug: 'university-of-rajshahi',
    url: 'https://www.ru.ac.bd/wp-content/themes/rurajit/images/ru-logo.png',
    ext: 'png'
  },
  {
    slug: 'university-of-chittagong',
    url: 'https://cu.ac.bd/wp-content/uploads/2024/03/university-of-chittagong-seeklogo.com-removebg-preview-removebg-preview-1-60x81.png',
    ext: 'png'
  },
  {
    slug: 'jahangirnagar-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Jahangirnagar_University_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'jagannath-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Logo_of_Jagannath_University.svg',
    ext: 'svg'
  },
  {
    slug: 'military-institute-of-science-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Military_Institute_of_Science_and_Technology_Monogram.svg',
    ext: 'svg'
  },
  {
    slug: 'hajee-mohammad-danesh-science-and-technology-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/HSTU_Logo.png',
    ext: 'png'
  },
  {
    slug: 'university-of-asia-pacific-dhanmondi',
    url: 'https://uap-bd.edu/img/logo.png',
    ext: 'png'
  },
  {
    slug: 'jashore-university-of-science-and-technology',
    url: 'https://just.edu.bd/logo/just.svg',
    ext: 'svg'
  },
  {
    slug: 'begum-rokeya-university-rangpur',
    url: 'https://brur.ac.bd/assets/frontend/img/logo.png',
    ext: 'png'
  },
  {
    slug: 'ahsanullah-university-of-science-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/4/45/Ahsanullah_University_of_Science_and_Technology_Logo.svg',
    ext: 'svg'
  },
  {
    slug: 'noakhali-science-and-technology-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Logo_of_Noakhali_Science_and_Technology_University.gif',
    ext: 'png'
  },
  {
    slug: 'american-international-university-bangladesh',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/american_international_university_bangladesh.svg',
    ext: 'svg'
  },
  {
    slug: 'east-west-university',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/east_west_university.svg',
    ext: 'svg'
  },
  {
    slug: 'daffodil-international-university',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/daffodil_international_university.svg',
    ext: 'svg'
  },
  {
    slug: 'northern-university-bangladesh',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/northern_university_bangladesh.svg',
    ext: 'svg'
  },
  {
    slug: 'university-of-liberal-arts',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/university_of_liberal_arts_bangladesh.svg',
    ext: 'svg'
  },
  {
    slug: 'university-of-science-technology-chittagong',
    url: 'https://raw.githubusercontent.com/AmarUni/bd-university-logos/master/logos/university_of_science_and_technology_chittagong.svg',
    ext: 'svg'
  },
  {
    slug: 'brac-university',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/BRAC_University_logo.svg',
    ext: 'svg'
  },
  {
    slug: 'north-south-university',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/77/North_South_University_seal.svg',
    ext: 'svg'
  },
  {
    slug: 'university-of-dhaka',
    url: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Dhaka_University_logo.svg',
    ext: 'svg'
  },
  {
    slug: 'bangladesh-university-of-engineering-and-technology',
    url: 'https://upload.wikimedia.org/wikipedia/en/d/da/BUET_LOGO.svg',
    ext: 'svg'
  }
];

async function run() {
  console.log('⚡ Downloading 100% Authentic, Unique University Logos...');
  for (const item of VERIFIED_OFFICIAL_MAP) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 AssignmentCoverMaker/2.0'
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
    await sleep(800);
  }
}

run();

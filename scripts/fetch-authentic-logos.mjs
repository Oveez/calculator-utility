import fs from 'node:fs/promises';
import path from 'node:path';

const RAW_LOGOS_DIR = path.resolve(process.cwd(), 'data/raw-logos');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Universities that need authentic verified files
const TARGET_UNIS = [
  { slug: 'chittagong-university-of-engineering-and-technology', title: 'File:CUET Vector Logo.svg', wiki: 'en' },
  { slug: 'jagannath-university', title: 'File:Logo of Jagannath University.svg', wiki: 'en' },
  { slug: 'islamic-university-of-technology', title: 'File:Islamic University of Technology (coat of arms).png', wiki: 'en' },
  { slug: 'khulna-university', title: 'File:Khulna University Logo.svg', wiki: 'en' },
  { slug: 'bangladesh-university-of-professionals', title: 'File:Bangladesh University of Professionals (BUP) Logo.svg', wiki: 'en' },
  { slug: 'green-university-of-bangladesh', title: 'File:Green University of Bangladesh logo.svg', wiki: 'en' },
  { slug: 'rajshahi-university-of-engineering-and-technology', article: 'Rajshahi University of Engineering & Technology', bnArticle: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'khulna-university-of-engineering-and-technology', article: 'Khulna University of Engineering & Technology', bnArticle: 'খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'dhaka-university-of-engineering-and-technology', article: 'Dhaka University of Engineering & Technology', bnArticle: 'ঢাকা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'shahjalal-university-of-science-and-technology', article: 'Shahjalal University of Science and Technology', bnArticle: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'university-of-rajshahi', article: 'University of Rajshahi', bnArticle: 'রাজশাহী বিশ্ববিদ্যালয়' },
  { slug: 'university-of-chittagong', article: 'University of Chittagong', bnArticle: 'চট্টগ্রাম বিশ্ববিদ্যালয়' },
  { slug: 'jahangirnagar-university', article: 'Jahangirnagar University', bnArticle: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়' },
  { slug: 'military-institute-of-science-and-technology', article: 'Military Institute of Science and Technology', bnArticle: 'মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি' },
  { slug: 'independent-university-bangladesh', article: 'Independent University, Bangladesh', bnArticle: 'ইন্ডিপেন্ডেন্ট বিশ্ববিদ্যালয়, বাংলাদেশ' },
  { slug: 'united-international-university', article: 'United International University', bnArticle: 'ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি' },
  { slug: 'ahsanullah-university-of-science-technology', article: 'Ahsanullah University of Science and Technology', bnArticle: 'আহছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'bangladesh-university-of-business-technology', article: 'Bangladesh University of Business and Technology', bnArticle: 'বাংলাদেশ ইউনিভার্সিটি অব বিজনেস অ্যান্ড টেকনোলজি' },
  { slug: 'university-of-asia-pacific-dhanmondi', article: 'University of Asia Pacific (Bangladesh)', bnArticle: 'ইউনিভার্সিটি অব এশিয়া প্যাসিফিক' },
  { slug: 'jashore-university-of-science-and-technology', article: 'Jashore University of Science and Technology', bnArticle: 'যশোর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'noakhali-science-and-technology-university', article: 'Noakhali Science and Technology University', bnArticle: 'নোয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'mawlana-bhashani-science-and-technology-university', title: 'File:Logo of Mawlana Bhashani Science And Technology University.png', wiki: 'en' },
  { slug: 'hajee-mohammad-danesh-science-and-technology-university', article: 'Hajee Mohammad Danesh Science and Technology University', bnArticle: 'হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' },
  { slug: 'pabna-university-of-science-and-technology', title: 'File:PUST Logo.png', wiki: 'en' },
  { slug: 'begum-rokeya-university-rangpur', article: 'Begum Rokeya University', bnArticle: 'বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর' },
  { slug: 'jatiya-kabi-kazi-nazrul-islam-university', title: 'File:Jatiya Kabi Kazi Nazrul Islam University Logo.png', wiki: 'en' },
  { slug: 'bangabandhu-sheikh-mujibur-rahman-science-and-technology-university', article: 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University', bnArticle: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়' }
];

async function findArticleLogo(item) {
  // Try English Wikipedia first
  if (item.article) {
    try {
      const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(item.article) + '&prop=images|pageprops&format=json';
      const res = await fetch(url, { headers: { 'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)' } });
      const data = await res.json();
      const p = Object.values(data.query.pages)[0];
      const imgs = (p?.images || []).map(i => i.title).filter(t => /logo|seal|crest|arms|monogram/i.test(t) && !/commons/i.test(t));
      if (imgs.length > 0) {
        return { title: imgs[0], wiki: 'en' };
      }
    } catch {}
  }

  // Try Bengali Wikipedia
  if (item.bnArticle) {
    try {
      const url = 'https://bn.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(item.bnArticle) + '&prop=images&format=json';
      const res = await fetch(url, { headers: { 'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)' } });
      const data = await res.json();
      const p = Object.values(data.query.pages)[0];
      const imgs = (p?.images || []).map(i => i.title).filter(t => !/commons|oojs|flag|wiktionary/i.test(t));
      if (imgs.length > 0) {
        return { title: imgs[0], wiki: 'bn' };
      }
    } catch {}
  }

  return null;
}

async function getImageUrl(fileTitle, wiki = 'en') {
  const domain = wiki === 'bn' ? 'bn.wikipedia.org' : 'en.wikipedia.org';
  const url = `https://${domain}/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)' } });
  const data = await res.json();
  const p = Object.values(data.query.pages)[0];
  return p?.imageinfo?.[0]?.url;
}

async function run() {
  console.log('🔍 Sourcing Authentic Unique Logos from Verified Sources...');
  await fs.mkdir(RAW_LOGOS_DIR, { recursive: true });

  for (const item of TARGET_UNIS) {
    let fileInfo = item.title ? { title: item.title, wiki: item.wiki || 'en' } : null;

    if (!fileInfo) {
      fileInfo = await findArticleLogo(item);
      await sleep(1500);
    }

    if (!fileInfo) {
      console.warn(`⚠️ [${item.slug}] No file found via article`);
      continue;
    }

    console.log(`🔎 [${item.slug}] Found file: ${fileInfo.title} (${fileInfo.wiki})`);
    const directUrl = await getImageUrl(fileInfo.title, fileInfo.wiki);
    await sleep(1500);

    if (!directUrl) {
      console.warn(`❌ [${item.slug}] Could not get direct URL for ${fileInfo.title}`);
      continue;
    }

    // Download image
    try {
      const res = await fetch(directUrl, { headers: { 'User-Agent': 'AssignmentCoverMaker/1.0 (contact@calculatorutility.tech)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error('Too small');

      let ext = 'png';
      if (directUrl.includes('.svg')) ext = 'svg';
      else if (directUrl.includes('.jpg') || directUrl.includes('.jpeg')) ext = 'jpg';
      else if (directUrl.includes('.webp')) ext = 'webp';

      // Clean up old files with other extensions
      for (const oldExt of ['png', 'svg', 'jpg', 'jpeg', 'webp']) {
        try { await fs.unlink(path.join(RAW_LOGOS_DIR, `${item.slug}.${oldExt}`)); } catch {}
      }

      const outPath = path.join(RAW_LOGOS_DIR, `${item.slug}.${ext}`);
      await fs.writeFile(outPath, buf);
      console.log(`✅ [${item.slug}] Saved authentic ${ext.toUpperCase()} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch(err) {
      console.error(`❌ [${item.slug}] Download failed:`, err.message);
    }

    await sleep(1500);
  }

  console.log('\n🎉 Finished authentic logo acquisition!');
}

run();

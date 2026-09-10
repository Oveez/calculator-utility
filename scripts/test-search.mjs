import fs from 'node:fs';

const db = JSON.parse(fs.readFileSync('public/data/institutions.json', 'utf8'));

function search(query) {
  query = query.toLowerCase().trim();
  const matches = db.filter(item => {
    const name = item[0].toLowerCase();
    const slug = item[1] ? item[1].toLowerCase() : '';
    const acros = item[3] ? item[3].toLowerCase().split(/\s+/) : [];
    return name.includes(query) || slug.includes(query) || acros.some(a => a === query || a.startsWith(query));
  }).sort((a, b) => {
    // 1. Exact acronym match (e.g. 'DU', 'KU', 'BUET', 'NU')
    const aExactAcro = a[3] && a[3].toLowerCase().split(/\s+/).includes(query);
    const bExactAcro = b[3] && b[3].toLowerCase().split(/\s+/).includes(query);
    if (aExactAcro && !bExactAcro) return -1;
    if (!aExactAcro && bExactAcro) return 1;
    if (aExactAcro && bExactAcro) {
      if ((b[4] || 0) !== (a[4] || 0)) return (b[4] || 0) - (a[4] || 0);
      if (a[2] === 'BD' && b[2] !== 'BD') return -1;
      if (a[2] !== 'BD' && b[2] === 'BD') return 1;
    }

    // 2. Name starts with query (prefix match)
    const aStarts = a[0].toLowerCase().startsWith(query);
    const bStarts = b[0].toLowerCase().startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    // 3. Verified logo priority
    if ((b[4] || 0) !== (a[4] || 0)) return (b[4] || 0) - (a[4] || 0);

    // 4. BD priority to avoid foreign collisions
    const aIsBd = a[2] === 'BD';
    const bIsBd = b[2] === 'BD';
    if (aIsBd && !bIsBd) return -1;
    if (!aIsBd && bIsBd) return 1;

    return a[0].localeCompare(b[0]);
  }).slice(0, 5);

  console.log(`\n=== Query: "${query}" ===`);
  matches.forEach(m => {
    console.log(`  ${m[4] ? '🟢' : '⚪'} [${m[2]}] ${m[0].padEnd(48)} (acro: ${m[3]}, slug: ${m[1]})`);
  });
}

const terms = ['khulna', 'ku', 'kuet', 'national', 'nu', 'southeast', 'seu', 'aust', 'bubt', 'barishal', 'bau', 'butex', 'du', 'buet', 'iiuc', 'iubat', 'stamford', 'premier', 'presidency'];
terms.forEach(search);

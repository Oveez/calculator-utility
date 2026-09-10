const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) results = results.concat(walk(p));
    else if (p.endsWith('.astro')) results.push(p);
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match lines with tabs
  const matches = [...content.matchAll(/class=["'][^"']*\bflex\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
  matches.forEach(m => {
    const inner = m[1];
    const btnCount = (inner.match(/<button/g) || []).length;
    if (btnCount >= 2 && (inner.includes('tab') || inner.includes('mode') || inner.includes('view') || inner.includes('preset') || inner.includes('action'))) {
      if (!m[0].includes('flex-wrap') && !m[0].includes('overflow-x-auto') && !m[0].includes('sm:flex')) {
        console.log(`\n${f}:`);
        console.log(`  Container: ${m[0].split('>')[0]}>`);
        console.log(`  Buttons (${btnCount})`);
        const btns = [...inner.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map(b => b[1].replace(/\s+/g, ' ').trim().slice(0, 25));
        console.log(`  Labels: ${btns.join(' | ')}`);
      }
    }
  });
});

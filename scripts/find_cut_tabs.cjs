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

const files = walk('./src/pages');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Look for elements with button groups or tab navigation that might overflow
  const tabContainers = [...content.matchAll(/<div[^>]*class=["']([^"']*(?:grid-cols-[3-9]|flex\s+[^"']*rounded)[^"']*)["'][^>]*>/gi)];
  tabContainers.forEach(m => {
    const cls = m[1];
    if ((cls.includes('p-1') || cls.includes('gap-') || cls.includes('border')) && !cls.includes('overflow-x-auto') && !cls.includes('flex-wrap')) {
      // Check if it contains multiple buttons
      const sub = content.slice(m.index, m.index + 800);
      if ((sub.match(/<button/g) || []).length >= 3 || sub.includes('data-tab') || sub.includes('data-mode')) {
        console.log(`\n${f}`);
        console.log(`  Tag: ${m[0].slice(0, 120)}`);
        const buttons = [...sub.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map(b => b[1].replace(/\s+/g, ' ').trim().slice(0, 30));
        console.log(`  Buttons (${buttons.length}): ${buttons.slice(0, 5).join(' | ')}`);
      }
    }
  });
});

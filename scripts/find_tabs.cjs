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
  // Check for tab containers: flex without flex-wrap and without overflow-x-auto
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (
      (line.includes('data-tab') || line.includes('tab-btn') || line.includes('data-mode') || line.includes('data-case') || line.includes('data-action') || line.includes('data-tool-tab')) &&
      (line.includes('<button') || line.includes('<a') || line.includes('<div'))
    ) {
      // Find parent or container
      console.log(`${f}:${idx+1} -> ${line.trim().slice(0, 100)}`);
    }
  });
});

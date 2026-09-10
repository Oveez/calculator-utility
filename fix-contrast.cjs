const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('git grep -l "bg-\\[color:var(--accent)\\]"').toString().trim().split('\n');
let replacedFiles = [];

files.forEach(f => {
  if (!f) return;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('text-[color:var(--bg)]')) {
    content = content.replace(/bg-\[color:var\(--accent\)\]([^>]*?)text-\[color:var\(--bg\)\]/g, 'bg-[color:var(--accent)]$1text-white');
    content = content.replace(/text-\[color:var\(--bg\)\]([^>]*?)bg-\[color:var\(--accent\)\]/g, 'text-white$1bg-[color:var(--accent)]');
    
    fs.writeFileSync(f, content);
    replacedFiles.push(f);
  }
});

console.log('Replaced in:', replacedFiles);

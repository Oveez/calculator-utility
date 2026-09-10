const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Remove data-default="<anything>"
  content = content.replace(/\s*data-default="[^"]*"/g, '');
  content = content.replace(/\s*data-default\b/g, ''); // just in case it's a boolean attribute

  // 2. Replace the JS parsing patterns
  // Pattern 1: parseFloat(xyz.value || xyz.dataset.default || '0') || 400
  // Pattern 2: parseInt(xyz.value || xyz.dataset.default || '0', 10)
  // We want to replace these with (xyz.value !== '' ? parseFloat(xyz.value) : 0)
  
  const regex = /(parseFloat|parseInt)\(\s*([a-zA-Z0-9_]+)\.value(?:\s*\|\|\s*\2\.dataset\.default)?(?:\s*\|\|\s*'[^']*')?(?:\s*,\s*10)?\s*\)(?:\s*\|\|\s*[\d.]+)?/g;
  
  content = content.replace(regex, (match, funcName, varName) => {
    // If it's parsing an integer, pass 10
    const parseCall = funcName === 'parseInt' ? `parseInt(${varName}.value, 10)` : `parseFloat(${varName}.value)`;
    return `(${varName}.value !== '' && !isNaN(${parseCall}) ? ${parseCall} : 0)`;
  });

  // Some scripts might have: xyz.value || xyz.dataset.default || 'fallback' (without parseFloat)
  // But usually they are parsed.

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  let updatedCount = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      updatedCount += walkDir(fullPath);
    } else if (file.endsWith('.astro')) {
      if (processFile(fullPath)) {
        updatedCount++;
      }
    }
  }
  return updatedCount;
}

const targetDir = 'c:\\Users\\My Pc\\.gemini\\antigravity-ide\\scratch\\calculator-utility\\src\\pages';
const count = walkDir(targetDir);
console.log(`Total files updated: ${count}`);

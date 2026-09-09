import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, '../src/pages');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function getColorForDir(dirPath) {
  if (dirPath.includes('developer-tools')) return 'blue';
  if (dirPath.includes('text-tools')) return 'purple';
  if (dirPath.includes('image-tools')) return 'emerald';
  if (dirPath.includes('pdf-tools')) return 'rose';
  if (dirPath.includes('color-tools')) return 'orange';
  if (dirPath.includes('generators')) return 'amber';
  if (dirPath.includes('data-tools')) return 'teal';
  if (dirPath.includes('academic-tools') || dirPath.includes('education-tools')) return 'indigo';
  if (dirPath.includes('finance') || dirPath.includes('tax') || dirPath.includes('calculators')) return 'cyan';
  if (dirPath.includes('pricing-calculators') || dirPath.includes('shipping-calculators')) return 'cyan';
  if (dirPath.includes('research-tools')) return 'fuchsia';
  return 'slate';
}

let modifiedCount = 0;

walkDir(pagesDir, (filePath) => {
  // Only target index.astro files inside subdirectories (hub pages)
  if (filePath.endsWith('index.astro') && path.dirname(filePath) !== pagesDir) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    let colorName = getColorForDir(path.dirname(filePath));

    // The target regex is for the badge span in the hub pages.
    // Let's replace the whole justify-between div block.
    // We look for:
    // <div class="flex items-center justify-between">
    //   <span class="rounded-md bg-[color:var(--surface-strong)] border border-[color:var(--border)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--muted)]">
    // OR it might have been replaced to text-slate-500
    
    const regex = /<div class="flex items-center justify-between">\s*<span class="rounded-md bg-\[color:var\(--surface-strong\)\] border border-\[color:var\(--border\)\] px-2 py-0\.5 text-\[10px\] font-bold text-(?:\[color:var\(--muted\)\]|slate-500)">\s*(.*?)\s*<\/span>\s*<\/div>/s;
    
    // We want to replace it globally in the file (there might be multiple if there are multiple lists, but usually it's just inside the map)
    const newReplacement = `<div class="flex items-center justify-between">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-${colorName}-50 border border-${colorName}-100 text-${colorName}-600">
                  <Icon name={tool.icon || 'calculator'} class="w-4 h-4" />
                </div>
                <span class="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  $1
                </span>
              </div>`;

    // Because the map variable might not be 'tool', we should try to match it dynamically or just assume tool/calc
    // In developer-tools, it's `tool`. In calculators, it's `calc`. Let's just use a more generic approach or fix any reference errors later.
    // Let's do a replace:
    content = content.replace(
      /<div class="flex items-center justify-between">\s*<span class="rounded-md bg-\[color:var\(--surface-strong\)\] border border-\[color:var\(--border\)\] px-2 py-0\.5 text-\[10px\] font-bold text-(?:\[color:var\(--muted\)\]|slate-500)">\s*{(.*?)\.badge}\s*<\/span>\s*<\/div>/g,
      `<div class="flex items-center justify-between">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-${colorName}-50 border border-${colorName}-100 text-${colorName}-600">
                  <Icon name={$1.icon || 'calculator'} class="w-4 h-4" />
                </div>
                <span class="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {$1.badge}
                </span>
              </div>`
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`Updated hub: ${filePath}`);
    }
  }
});

console.log(`Successfully updated ${modifiedCount} hub files.`);

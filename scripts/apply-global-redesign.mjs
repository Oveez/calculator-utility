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

let modifiedCount = 0;

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Primary Buttons
    content = content.replace(
      /bg-\[color:var\(--fg\)\](.*?)text-\[color:var\(--bg\)\](.*?)hover:opacity-90/g,
      'bg-blue-600$1text-white$2hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
    );
    
    // Fallback for primary buttons that don't match exactly
    content = content.replace(
      /class="flex-1 rounded-xl bg-\[color:var\(--fg\)\] py-2\.5 text-xs font-bold text-\[color:var\(--bg\)\] shadow-xs transition hover:opacity-90"/g,
      'class="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"'
    );
    content = content.replace(
      /class="flex-1 rounded-xl bg-\[color:var\(--fg\)\] py-3 text-sm font-bold text-\[color:var\(--bg\)\] shadow-xs transition hover:opacity-90"/g,
      'class="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"'
    );
    content = content.replace(
      /class="w-full rounded-xl bg-\[color:var\(--fg\)\] py-3 text-sm font-bold text-\[color:var\(--bg\)\] shadow-xs transition hover:opacity-90"/g,
      'class="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"'
    );

    // 2. Secondary Buttons
    content = content.replace(
      /class="flex-1 rounded-xl border border-\[color:var\(--border\)\] bg-\[color:var\(--surface-strong\)\] py-2\.5 text-xs font-bold text-\[color:var\(--fg\)\] shadow-xs transition hover:bg-\[color:var\(--surface\)\]"/g,
      'class="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 hover:shadow"'
    );
    content = content.replace(
      /class="flex-1 rounded-xl border border-\[color:var\(--border\)\] bg-\[color:var\(--surface-strong\)\] py-3 text-sm font-bold text-\[color:var\(--fg\)\] shadow-xs transition hover:bg-\[color:var\(--surface\)\]"/g,
      'class="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 hover:shadow"'
    );

    // 3. Inputs
    content = content.replace(
      /class="w-full font-mono text-xs leading-relaxed rounded-2xl border border-\[color:var\(--border\)\] bg-\[color:var\(--surface\)\] p-4 text-\[color:var\(--fg\)\] focus:border-\[color:var\(--border-strong\)\] focus:outline-hidden"/g,
      'class="w-full font-mono text-xs leading-relaxed rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"'
    );
    content = content.replace(
      /class="w-full rounded-xl border border-\[color:var\(--border\)\] bg-\[color:var\(--surface\)\] px-4 py-2\.5 text-sm text-\[color:var\(--fg\)\] focus:border-\[color:var\(--border-strong\)\] focus:outline-hidden"/g,
      'class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"'
    );
    // Generic replace for any stray inputs
    content = content.replace(/focus:border-\[color:var\(--border-strong\)\] focus:outline-hidden/g, 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all');

    // 4. Card Hovers
    content = content.replace(
      /hover:border-\[color:var\(--border-strong\)\] hover:bg-\[color:var\(--surface-strong\)\]/g,
      'hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 hover:bg-white'
    );

    // 5. Action Links (Load Sample, Clear, etc)
    content = content.replace(/text-\[color:var\(--primary\)\] hover:underline font-semibold/g, 'text-blue-600 hover:text-blue-700 hover:underline font-bold');
    content = content.replace(/text-\[color:var\(--muted\)\] hover:text-\[color:var\(--fg\)\]/g, 'text-slate-400 hover:text-slate-700 font-semibold');

    // 6. Generic Panels
    content = content.replace(/border border-\[color:var\(--border\)\] bg-\[color:var\(--surface-strong\)\]/g, 'border border-slate-200 bg-slate-50/50 shadow-xs');
    content = content.replace(/border border-\[color:var\(--border\)\] bg-\[color:var\(--surface\)\]/g, 'border border-slate-200 bg-white shadow-sm');
    
    // Fix up header titles and sections
    content = content.replace(/text-\[color:var\(--fg\)\]/g, 'text-slate-800');
    content = content.replace(/text-\[color:var\(--muted\)\]/g, 'text-slate-500');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
    }
  }
});

console.log(`Successfully updated ${modifiedCount} files.`);

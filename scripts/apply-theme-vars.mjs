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

    // Primary buttons
    content = content.replace(/bg-blue-600/g, 'bg-[color:var(--primary)]');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[color:var(--accent-hover)]');

    // Secondary Buttons & Cards
    content = content.replace(/bg-white/g, 'bg-[color:var(--surface)]');
    content = content.replace(/bg-slate-50\/50/g, 'bg-[color:var(--surface-strong)]');
    content = content.replace(/bg-slate-50/g, 'bg-[color:var(--surface-strong)]');
    
    // Borders
    content = content.replace(/border-slate-200/g, 'border-[color:var(--border)]');
    content = content.replace(/border-slate-300/g, 'border-[color:var(--border-strong)]');
    content = content.replace(/border-blue-200/g, 'border-[color:var(--primary)]');
    content = content.replace(/hover:border-blue-200/g, 'hover:border-[color:var(--primary)]');
    
    // Inputs focus
    content = content.replace(/focus:border-blue-500/g, 'focus:border-[color:var(--primary)]');
    content = content.replace(/focus:ring-blue-500\/10/g, 'focus:ring-[color:var(--accent-glow)]');
    
    // Text colors
    content = content.replace(/text-slate-800/g, 'text-[color:var(--fg)]');
    content = content.replace(/text-slate-700/g, 'text-[color:var(--fg)]');
    content = content.replace(/text-slate-500/g, 'text-[color:var(--muted)]');
    content = content.replace(/text-slate-400/g, 'text-[color:var(--muted)]');
    content = content.replace(/text-blue-600/g, 'text-[color:var(--primary)]');
    content = content.replace(/hover:text-blue-700/g, 'hover:text-[color:var(--accent-hover)]');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
    }
  }
});

console.log(`Successfully updated ${modifiedCount} files to use theme vars.`);

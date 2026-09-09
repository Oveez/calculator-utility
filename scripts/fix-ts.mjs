import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, '../src/pages');

fs.readdirSync(pagesDir).forEach(dir => {
  const p = path.join(pagesDir, dir, 'index.astro');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Using string replacement to cast as any for the Icon component in all hub files
    let newContent = content.replace(/name=\{(.*?)\.icon \|\| 'calculator'\}/g, 'name={($1.icon || "calculator") as any}');
    if (content !== newContent) {
      fs.writeFileSync(p, newContent, 'utf8');
      console.log('Fixed', p);
    }
  }
});

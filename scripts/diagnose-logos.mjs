import fs from 'node:fs';

const pub = JSON.parse(fs.readFileSync('public/data/institutions.json', 'utf8'));
const master = JSON.parse(fs.readFileSync('data/institutions/master_list.json', 'utf8'));

const bdUnis = master.filter(u => u.country === 'BD');
console.log(`Found ${bdUnis.length} BD institutions in master_list`);

// Check which ones have logos
for (const u of bdUnis) {
  console.log(`[${u.hasLogo ? 'HAS_LOGO' : 'NO_LOGO'}] ${u.name} (${u.slug}) -> url: ${u.logoUrl || 'none'}`);
}

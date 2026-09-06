import fs from 'node:fs';
import { CSV_KEYWORD_SET, RAW_CSV_KEYWORDS } from './raw_keywords.mjs';
import { PAGE_KEYWORD_AUDIT } from './validate_seo_integrity.mjs';

// Calculate Unused Keywords Analysis
const allUsedExactKeywords = new Set();
for (const page of Object.values(PAGE_KEYWORD_AUDIT)) {
  allUsedExactKeywords.add(page.primary.keyword.toLowerCase());
  for (const sec of page.secondary) {
    allUsedExactKeywords.add(sec.keyword.toLowerCase());
  }
}

// Categorize unused keywords by reason
const unusedKeywords = [];
for (const item of RAW_CSV_KEYWORDS) {
  const kw = item.keyword.trim();
  const kwLower = kw.toLowerCase();
  if (!allUsedExactKeywords.has(kwLower)) {
    let reason = '';
    if (kwLower.includes('bdt') || kwLower.includes('bangladesh') || kwLower.includes('currency') && item.searches === '') {
      reason = 'Empty/Duplicate regional segmentation header row in Google Keyword Planner CSV';
    } else if (['10 calculator', '100 calculator', '4 calculator', '8 calculator', 'calculator 1', 'calculator 4', 'calculator no', 'date 7', 'one calculator'].includes(kwLower)) {
      reason = 'Ambiguous / low-intent numerical fragments with no clear tool mapping';
    } else if (['pdf calculator', 'pdf calculator tool', 'tool json', 'tool life calculator', 'server calculator', 'sentence calculator', 'text calculator', 'letter calculator', 'data calculator', 'csv calculator'].includes(kwLower)) {
      reason = 'Belongs to specialized non-calculator developer/text/PDF utility pages rather than core calculator engine';
    } else if (['social media calculator', 'media calculator', 'builders calculator', 'storage unit calculator', 'workout calculator', 'calculator workout', 'calculator running', 'calculator project', 'calculator developer', 'calculator grow', 'calculator image', 'calculator from image', 'image to calculator'].includes(kwLower)) {
      reason = 'Irrelevant / niche calculation query not matching existing tool formulas';
    } else if (['at loan calculator', 'com loan calculator', 'into loan calculator', 'to loan calculator', 'see calculator', 'see gpa calculator', 'no calculator', 'one calculator'].includes(kwLower)) {
      reason = 'Malformed / fragmented navigation query or typo variant';
    } else if (kwLower.includes('compound') || kwLower.includes('interest') || kwLower.includes('loan')) {
      reason = 'Duplicate search intent / synonym subsumed by primary loan, compound interest, or simple interest cluster';
    } else if (kwLower.includes('bmi') || kwLower.includes('body weight') || kwLower.includes('body mass')) {
      reason = 'Synonymous or duplicated keyword variation subsumed under primary BMI Calculator cluster';
    } else {
      reason = 'Duplicate intent or insufficient topical match to existing tool suite';
    }
    unusedKeywords.push({
      keyword: kw,
      searchVolume: item.searches || 'N/A',
      competition: item.competition || 'N/A',
      reason
    });
  }
}

console.log(`Total CSV keywords: ${RAW_CSV_KEYWORDS.length}`);
console.log(`Unique used keywords: ${allUsedExactKeywords.size}`);
console.log(`Unused keywords cataloged: ${unusedKeywords.length}`);

fs.writeFileSync('scripts/audit_report_data.json', JSON.stringify({
  totalCsvKeywords: RAW_CSV_KEYWORDS.length,
  usedCount: allUsedExactKeywords.size,
  unusedCount: unusedKeywords.length,
  pageAudits: PAGE_KEYWORD_AUDIT,
  sampleUnused: unusedKeywords.slice(0, 30)
}, null, 2), 'utf8');

console.log('Saved audit_report_data.json');

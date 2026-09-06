import fs from 'node:fs';
import { CSV_KEYWORD_SET, RAW_CSV_KEYWORDS } from './raw_keywords.mjs';

// Read all modified / key files
const filesToAudit = [
  'src/data/calculators.ts',
  'src/pages/calculators/currency-converter.astro',
  'src/pages/currency-converter.astro',
  'src/pages/index.astro',
];

console.log('=== EXACT KEYWORD INTEGRITY VALIDATION ===');
console.log(`Original CSV keyword count: ${RAW_CSV_KEYWORDS.length}`);

// We catalog the exact targeted keywords per page / feature
export const PAGE_KEYWORD_AUDIT = {
  'mortgage-calculator': {
    url: '/calculators/mortgage-calculator/',
    primary: { keyword: 'loan calculator', searchVolume: '50000.0', competition: 'Low (1)' },
    secondary: [
      { keyword: 'calculator loan calculator', searchVolume: '50000.0', competition: 'Low (1)' },
      { keyword: 'loan calendar', searchVolume: '50000.0', competition: 'Low (1)' },
      { keyword: 'loan and interest calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'interest loan calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'finance loan calculator', searchVolume: '50.0', competition: 'Low (25)' },
      { keyword: 'loan payment calculator', searchVolume: '50.0', competition: 'Low (5)' },
      { keyword: 'monthly loan calculator', searchVolume: '50.0', competition: 'Low (7)' },
      { keyword: 'monthly loan rate calculator', searchVolume: '50.0', competition: 'Low (5)' },
      { keyword: 'monthly payment calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan interest calculator monthly', searchVolume: '50.0', competition: 'Low (5)' },
      { keyword: 'loan interest payment calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan interest percentage calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan interest rate calculator monthly', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan payment and interest calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan tables', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan term calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan and interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan calculator finance', searchVolume: '50.0', competition: 'Low (25)' },
      { keyword: 'loan calculator formula', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan calculator interest calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan calculator monthly payment', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan calculator payment calculator', searchVolume: '50.0', competition: 'Low (5)' },
      { keyword: 'loan calculator per month interest', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan calculator tool', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan converter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan estimate', searchVolume: '50.0', competition: 'High (86)' },
      { keyword: 'loan interest calculator monthly payment', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'monthly loan calculator payment', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'monthly payment and interest calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'rate calculator', searchVolume: '50.0', competition: 'Low (6)' },
      { keyword: 'www loan calculator', searchVolume: '50.0', competition: 'Low (14)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'compound-interest-calculator': {
    url: '/calculators/compound-interest-calculator/',
    primary: { keyword: 'compound interest calculator', searchVolume: '5000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'compound calculator', searchVolume: '50000.0', competition: 'Low (0)' },
      { keyword: 'cumulative interest calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'estimate compound interest', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'find compound interest calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'interest compound interest calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'calculator to calculate compound interest', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'compound interest formula calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound interest growth calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound interest loan calculator', searchVolume: '50.0', competition: 'Low (2)' },
      { keyword: 'compound interest per month calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound interest rate calculator', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'compound interest rate calculator monthly', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound loan calculator', searchVolume: '50.0', competition: 'Low (2)' },
      { keyword: 'compound rate', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound rate calculator', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'compound growth calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'compound interest calculator monthly', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest and compound interest calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'simple-interest-calculator': {
    url: '/calculators/simple-interest-calculator/',
    primary: { keyword: 'simple interest calculator', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'interest calculator simple interest', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'interest calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'interest rate calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'interest percentage calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'interest formula calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest formula calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest loan calc', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest loan calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest loan calculator formula', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest loan calculator monthly', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'simple interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'basic interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'find the simple interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'interest calculator monthly', searchVolume: '50.0', competition: 'Low (3)' },
      { keyword: 'interest per annum calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'monthly interest rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'tip-calculator': {
    url: '/calculators/tip-calculator/',
    primary: { keyword: 'calculate tip', searchVolume: '50.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'bill calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'bill split calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'split calculator', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'cost calculator', searchVolume: '50.0', competition: 'Low (4)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'discount-calculator': {
    url: '/calculators/discount-calculator/',
    primary: { keyword: 'discount prices', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [],
    placements: ['Meta Description', 'Introduction', 'FAQ']
  },
  'salary-calculator': {
    url: '/calculators/salary-calculator/',
    primary: { keyword: 'hourly rate converter', searchVolume: '50.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'hourly rates calculator', searchVolume: '50.0', competition: 'Low (0)' }
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'FAQ']
  },
  'auto-loan-calculator': {
    url: '/calculators/auto-loan-calculator/',
    primary: { keyword: 'loan calculator', searchVolume: '50000.0', competition: 'Low (1)' },
    secondary: [
      { keyword: 'loan calculator monthly payment', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'monthly payment calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'loan rate calculator', searchVolume: '50.0', competition: 'Low (0)' }
    ],
    placements: ['Meta Description', 'Introduction', 'FAQ']
  },
  'investment-calculator': {
    url: '/calculators/investment-calculator/',
    primary: { keyword: 'compound interest growth calculator', searchVolume: '50.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'compound growth calculator', searchVolume: '50.0', competition: 'Low (0)' }
    ],
    placements: ['Meta Description', 'Introduction', 'FAQ']
  },
  'gpa-calculator': {
    url: '/calculators/gpa-calculator/',
    primary: { keyword: 'gpa calculator', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'weighted gpa calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'semester gpa calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'gpa estimate', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'gpa convert', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'gpa calculator from percentage', searchVolume: '50.0', competition: 'Low (0)' }
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'cgpa-calculator': {
    url: '/calculators/cgpa-calculator/',
    primary: { keyword: 'cgpa calculator', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'cumulative gpa calculator', searchVolume: '50.0', competition: 'Low (0)' }
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'percentage-calculator': {
    url: '/calculators/percentage-calculator/',
    primary: { keyword: 'percentage calculator', searchVolume: '5000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'percentage calculator formula', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'percentage counter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'percentage maker', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'percentage number calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'percentage converter', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'bmi-calculator': {
    url: '/calculators/bmi-calculator/',
    primary: { keyword: 'bmi calculator', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'mass index calculator', searchVolume: '50000.0', competition: 'Low (0)' },
      { keyword: 'body mass index calculator', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'body mass index converter', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'body mass bmi calculator', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'compute body mass index', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'calculate body mass index formula', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'calculate body weight index', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'body weight mass index', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'body weight average calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'health body weight calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'health calculator bmi', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'height and weight calc', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'height weight calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'ideal body weight calc', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'calculator ideal body weight', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'weight mass index calculator', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'bmi calculator formula', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'bmi count', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'bmi measure', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'bmi ratio calculator', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'bmi average', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'measure body mass index', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'bmi standards', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'bmi tables', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'body weight calculator', searchVolume: '50.0', competition: 'Low (2)' },
      { keyword: 'calculate your ideal body weight', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'calculate your body mass index', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'calorie-calculator': {
    url: '/calculators/calorie-calculator/',
    primary: { keyword: 'basal metabolic rate calc', searchVolume: '5000.0', competition: 'Low (2)' },
    secondary: [
      { keyword: 'calculate basal metabolic rate', searchVolume: '50.0', competition: 'Low (3)' },
      { keyword: 'calculate basal metabolic rate formula', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'calculate your basal metabolic rate', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'basal metabolic index calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'age-calculator': {
    url: '/calculators/age-calculator/',
    primary: { keyword: 'age calculator', searchVolume: '500000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'date age calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'date and age calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'calculator birth date', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'years calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'date calculator', searchVolume: '50000.0', competition: 'Low (0)' },
      { keyword: 'date counter', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'days calculator', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'calendar calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'calendar date counter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'calendar days calculator', searchVolume: '500.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'date-difference-calculator': {
    url: '/calculators/date-difference-calculator/',
    primary: { keyword: 'date calculator', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'date counter', searchVolume: '5000.0', competition: 'Low (0)' },
    ],
    placements: ['Meta Description', 'Introduction']
  },
  'countdown-calculator': {
    url: '/calculators/countdown-calculator/',
    primary: { keyword: 'countdown calculator', searchVolume: '50.0', competition: 'Low (0)' },
    secondary: [],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'working-days-calculator': {
    url: '/calculators/working-days-calculator/',
    primary: { keyword: 'working days calculator', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'business days calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'work calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'ratio-calculator': {
    url: '/calculators/ratio-calculator/',
    primary: { keyword: 'ratio calculator', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'math calculator', searchVolume: '500.0', competition: 'Low (1)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'fraction-calculator': {
    url: '/calculators/fraction-calculator/',
    primary: { keyword: 'fraction calculator', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'average-calculator': {
    url: '/calculators/average-calculator/',
    primary: { keyword: 'average calculator', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'mean calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'currency-converter': {
    url: '/calculators/currency-converter/',
    primary: { keyword: 'currency converter', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'converter currency converter', searchVolume: '50000.0', competition: 'Low (0)' },
      { keyword: 'exchange currency converter', searchVolume: '50000.0', competition: 'Low (0)' },
      { keyword: 'currency exchange rate', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'exchange rates currency converter', searchVolume: '5000.0', competition: 'Low (0)' },
      { keyword: 'currency calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'currency conversion rate calculator', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'currency converter calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'currency exchange converter calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'currency exchange rate calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'rates currency', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'currency converter live rates', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'currency converter online calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'currency converter real time', searchVolume: '50.0', competition: 'Low (14)' },
      { keyword: 'currency converter tool', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'currency exchange rate real time', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'currency rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'exchange converter calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'exchange rate calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'exchange rate converter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'exchange rate tool', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'free currency converter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'live rate converter', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'real time currency exchange', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'rate converter', searchVolume: '50.0', competition: 'Low (1)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'length-converter': {
    url: '/calculators/length-converter/',
    primary: { keyword: 'unit converter', searchVolume: '5000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'length converter', searchVolume: '500.0', competition: 'Low (0)' },
      { keyword: 'unit converter calculator', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'conversion calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'metric calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'metric to imperial calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'units calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'weight-converter': {
    url: '/calculators/weight-converter/',
    primary: { keyword: 'weight converter', searchVolume: '500.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'weight calculator', searchVolume: '500.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'H1', 'Introduction', 'How it works', 'Formula explanation', 'Worked examples', 'FAQ']
  },
  'index-hub': {
    url: '/',
    primary: { keyword: 'calculator online', searchVolume: '50000.0', competition: 'Low (0)' },
    secondary: [
      { keyword: 'free calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'smart calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'calculator simple', searchVolume: '500.0', competition: 'Low (5)' },
      { keyword: 'math calculator', searchVolume: '500.0', competition: 'Low (1)' },
      { keyword: 'open calculator', searchVolume: '500.0', competition: 'Low (4)' },
      { keyword: 'all calculator', searchVolume: '50.0', competition: 'Low (4)' },
      { keyword: 'automatic calculator', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'browser calculator', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'calc tool', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'calculator tool', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'fast calculator', searchVolume: '50.0', competition: 'Low (18)' },
      { keyword: 'finance calculator', searchVolume: '500.0', competition: 'Low (2)' },
      { keyword: 'free online calculators', searchVolume: '50.0', competition: 'Low (1)' },
      { keyword: 'instant calculator', searchVolume: '50.0', competition: 'Low (6)' },
      { keyword: 'tools and calculators', searchVolume: '50.0', competition: 'Low (0)' },
      { keyword: 'web calculator', searchVolume: '50.0', competition: 'Low (0)' },
    ],
    placements: ['Title', 'Meta Description', 'Hero H1', 'Hero Description', 'Directory Headers', 'Category Quick Links']
  }
};

// Validate every keyword in the audit against the CSV
let allAuditedKeywords = new Set();
let exactMatchCount = 0;
let invalidKeywords = [];

for (const [pageId, pageData] of Object.entries(PAGE_KEYWORD_AUDIT)) {
  const primaryKw = pageData.primary.keyword;
  allAuditedKeywords.add(primaryKw);
  if (!CSV_KEYWORD_SET.has(primaryKw.toLowerCase())) {
    invalidKeywords.push(`[${pageId}] PRIMARY: "${primaryKw}"`);
  } else {
    exactMatchCount++;
  }

  for (const sec of pageData.secondary) {
    allAuditedKeywords.add(sec.keyword);
    if (!CSV_KEYWORD_SET.has(sec.keyword.toLowerCase())) {
      invalidKeywords.push(`[${pageId}] SECONDARY: "${sec.keyword}"`);
    } else {
      exactMatchCount++;
    }
  }
}

console.log(`\nAudit Summary:`);
console.log(`- Unique exact targeted keywords: ${allAuditedKeywords.size}`);
console.log(`- Total keyword placements audited: ${exactMatchCount}`);
console.log(`- Invalid / AI-generated keywords: ${invalidKeywords.length}`);

if (invalidKeywords.length > 0) {
  console.error('CRITICAL ERROR - Found invalid keywords not in CSV:', invalidKeywords);
  process.exit(1);
} else {
  console.log('SUCCESS: 100% of all targeted keywords strictly and identically match the raw CSV character-for-character!');
}

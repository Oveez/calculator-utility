import type { CountryTaxProfile } from '../types';

export const jpProfile: CountryTaxProfile = {
  id: 'japan',
  name: 'Japan',
  countryCode: 'JP',
  flagEmoji: '🇯🇵',
  defaultCurrency: 'JPY',
  defaultCurrencySymbol: '¥',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Prefecture / Municipality',
  metaDescription: 'Calculate Japanese national income tax (Shotokuzei), inhabitant tax (Juminzei 10%), Shakai Hoken, and net salary with official 2026 NTA (国税庁) tax reform data.',
  faqItems: [
    {
      question: 'How is income tax calculated for employees in Japan in 2026?',
      answer: 'Japanese wage earners are taxed in two tiers: progressive National Income Tax (Shotokuzei, 5% to 45% plus 2.1% reconstruction surtax) and flat Local Inhabitant Tax (Juminzei, 10%). Standard deductions include the basic deduction (Kiso kojo) and employment income deduction (Kyuyo shotoku kojo), which expand the non-taxable threshold to ~¥1,780,000 under the 2026 tax reform.',
    },
    {
      question: 'What is the employee Shakai Hoken (Social Insurance) rate in Japan?',
      answer: 'Employees contribute ~14.75% of standard monthly remuneration towards Health Insurance (Kenko Hoken ~5%), Employees’ Pension (Kosei Nenkin 9.15%), and Employment Insurance (Koyo Hoken 0.60%).',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'JPY',
      currencySymbol: '¥',
      standardDeduction: 1780000, // 2026 tax reform non-taxable base (increased basic + minimum employment income deduction)
      nationalBrackets: [
        { threshold: 0, upTo: 1950000, rate: 0.05105, label: '5% (+ 2.1% surtax)' },
        { threshold: 1950000, upTo: 3300000, rate: 0.1021, label: '10% (+ 2.1% surtax)' },
        { threshold: 3300000, upTo: 6950000, rate: 0.2042, label: '20% (+ 2.1% surtax)' },
        { threshold: 6950000, upTo: 9000000, rate: 0.23483, label: '23% (+ 2.1% surtax)' },
        { threshold: 9000000, upTo: 18000000, rate: 0.33693, label: '33% (+ 2.1% surtax)' },
        { threshold: 18000000, upTo: 40000000, rate: 0.4084, label: '40% (+ 2.1% surtax)' },
        { threshold: 40000000, rate: 0.45945, label: '45% (+ 2.1% surtax)' },
      ],
      socialContributions: [
        {
          id: 'shakai_hoken',
          name: 'Social Insurance (Shakai Hoken - Pension, Health, Employment)',
          rate: 0.1475,
          employeeRate: 0.1475,
          description: 'Employee share of Health (Kenko Hoken ~5%), Pension (Kosei Nenkin 9.15%), and Employment Insurance (0.6%).',
        },
      ],
      regions: [
        { code: 'standard_juminzei', name: 'Standard Resident Tax / Juminzei (10% flat)', additionalTaxRate: 0.10 },
        { code: 'national_only', name: 'National Income Tax Only', flatRate: 0 },
      ],
      vatConfig: {
        name: 'Consumption Tax (Shouhizei)',
        standardRate: 0.10, // 10%
        reducedRates: [{ name: 'Reduced rate (food, groceries)', rate: 0.08 }],
      },
      officialSourceName: 'National Tax Agency of Japan (NTA / 国税庁)',
      officialSourceUrl: 'https://www.nta.go.jp',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee resident in Japan for tax purposes',
        '2026 tax reform baseline deduction (¥1,780,000 non-taxable threshold) applied',
        'Special Reconstruction Income Tax (2.1% surtax on national tax) included',
        'Standard 10% Inhabitant Tax (Juminzei) applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'JPY',
      currencySymbol: '¥',
      standardDeduction: 1030000,
      nationalBrackets: [
        { threshold: 0, upTo: 1950000, rate: 0.05105, label: '5% (+ 2.1% surtax)' },
        { threshold: 1950000, upTo: 3300000, rate: 0.1021, label: '10% (+ 2.1% surtax)' },
        { threshold: 3300000, upTo: 6950000, rate: 0.2042, label: '20% (+ 2.1% surtax)' },
        { threshold: 6950000, upTo: 9000000, rate: 0.23483, label: '23% (+ 2.1% surtax)' },
        { threshold: 9000000, upTo: 18000000, rate: 0.33693, label: '33% (+ 2.1% surtax)' },
        { threshold: 18000000, upTo: 40000000, rate: 0.4084, label: '40% (+ 2.1% surtax)' },
        { threshold: 40000000, rate: 0.45945, label: '45% (+ 2.1% surtax)' },
      ],
      socialContributions: [
        {
          id: 'shakai_hoken',
          name: 'Social Insurance (Shakai Hoken)',
          rate: 0.1475,
          employeeRate: 0.1475,
        },
      ],
      regions: [
        { code: 'standard_juminzei', name: 'Standard Resident Tax / Juminzei (10% flat)', additionalTaxRate: 0.10 },
        { code: 'national_only', name: 'National Income Tax Only', flatRate: 0 },
      ],
      vatConfig: {
        name: 'Consumption Tax',
        standardRate: 0.10,
      },
      officialSourceName: 'National Tax Agency of Japan (NTA)',
      officialSourceUrl: 'https://www.nta.go.jp',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee for 2025 tax year'],
    },
  },
};

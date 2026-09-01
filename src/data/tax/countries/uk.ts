import type { CountryTaxProfile } from '../types';

export const ukProfile: CountryTaxProfile = {
  id: 'uk',
  name: 'United Kingdom',
  countryCode: 'GB',
  flagEmoji: '🇬🇧',
  defaultCurrency: 'GBP',
  defaultCurrencySymbol: '£',
  defaultTaxYear: '2026/27',
  availableTaxYears: ['2026/27', '2025/26'],
  hasRegionalTax: true,
  regionalEntityName: 'Jurisdiction',
  metaDescription: 'Calculate UK PAYE income tax, National Insurance, and take-home pay for England, Wales, Northern Ireland, and Scotland with official 2026/27 HMRC and Scottish Government tax rates.',
  faqItems: [
    {
      question: 'What is the UK Personal Allowance for 2026/27?',
      answer: 'The standard UK tax-free Personal Allowance is £12,570. If your adjusted net income is over £100,000, your Personal Allowance is reduced by £1 for every £2 of income above £100,000, reaching £0 at £125,140.',
    },
    {
      question: 'What is the difference between Scottish and England/Wales tax rates in 2026/27?',
      answer: 'Scotland sets its own Income Tax rates on earned income across 6 tax bands (Starter 19%, Basic 20%, Intermediate 21%, Higher 42%, Advanced 45%, and Top 48%), with indexed lower bands for 2026/27, whereas England, Wales, and Northern Ireland use 3 bands (Basic 20%, Higher 40%, Additional 45%).',
    },
    {
      question: 'What are the 2026/27 National Insurance rates for employees?',
      answer: 'Class 1 National Insurance for employees is 8% on earnings between the Primary Threshold (£12,570/year, £1,048/month) and Upper Earnings Limit (£50,270/year, £4,189/month), and 2% on earnings above £50,270.',
    },
  ],
  years: {
    '2026/27': {
      taxYear: '2026/27',
      currency: 'GBP',
      currencySymbol: '£',
      standardDeduction: 12570,
      personalAllowance: 12570,
      nationalBrackets: [
        { threshold: 0, upTo: 37700, rate: 0.20, label: 'Basic Rate (20%)' }, // £12,571 to £50,270 taxable
        { threshold: 37700, upTo: 112570, rate: 0.40, label: 'Higher Rate (40%)' }, // £50,271 to £125,140
        { threshold: 112570, rate: 0.45, label: 'Additional Rate (45%)' }, // Over £125,140
      ],
      socialContributions: [
        {
          id: 'national_insurance',
          name: 'National Insurance (Class 1 Employee)',
          rate: 0.08,
          employeeRate: 0.08,
          minThreshold: 12570,
          capAmount: 50270,
          description: '8% between primary threshold (£12,570) and upper earnings limit (£50,270), plus 2% above £50,270.',
        },
      ],
      regions: [
        { code: 'england_wales_ni', name: 'England, Wales & Northern Ireland', flatRate: 0 },
        {
          code: 'scotland',
          name: 'Scotland (Scottish Income Tax 2026/27)',
          brackets: [
            { threshold: 0, upTo: 3967, rate: 0.19, label: 'Starter Rate (19%)' }, // £12,571 to £16,537
            { threshold: 3967, upTo: 16956, rate: 0.20, label: 'Basic Rate (20%)' }, // £16,538 to £29,526
            { threshold: 16956, upTo: 31092, rate: 0.21, label: 'Intermediate Rate (21%)' }, // £29,527 to £43,662
            { threshold: 31092, upTo: 62430, rate: 0.42, label: 'Higher Rate (42%)' }, // £43,663 to £75,000
            { threshold: 62430, upTo: 112570, rate: 0.45, label: 'Advanced Rate (45%)' }, // £75,001 to £125,140
            { threshold: 112570, rate: 0.48, label: 'Top Rate (48%)' }, // Over £125,140
          ],
        },
      ],
      vatConfig: {
        name: 'VAT',
        standardRate: 0.20,
        reducedRates: [
          { name: 'Reduced rate (home energy)', rate: 0.05 },
          { name: 'Zero-rated (food, books, children clothes)', rate: 0.0 },
        ],
      },
      officialSourceName: 'HM Revenue & Customs (HMRC) & Scottish Government / GOV.UK',
      officialSourceUrl: 'https://www.gov.uk/income-tax-rates',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Standard 1257L tax code (Personal Allowance £12,570)',
        'Personal Allowance phased out at £1 for every £2 earned above £100,000',
        'Standard Class 1 National Insurance for employees (8% to UEL, 2% above)',
        'Does not include student loan repayments, workplace pensions, or marriage allowance',
      ],
    },
    '2025/26': {
      taxYear: '2025/26',
      currency: 'GBP',
      currencySymbol: '£',
      standardDeduction: 12570,
      personalAllowance: 12570,
      nationalBrackets: [
        { threshold: 0, upTo: 37700, rate: 0.20, label: 'Basic Rate (20%)' },
        { threshold: 37700, upTo: 112570, rate: 0.40, label: 'Higher Rate (40%)' },
        { threshold: 112570, rate: 0.45, label: 'Additional Rate (45%)' },
      ],
      socialContributions: [
        {
          id: 'national_insurance',
          name: 'National Insurance (Class 1 Employee)',
          rate: 0.08,
          employeeRate: 0.08,
          minThreshold: 12570,
          capAmount: 50270,
        },
      ],
      vatConfig: {
        name: 'VAT',
        standardRate: 0.20,
      },
      officialSourceName: 'HM Revenue & Customs (HMRC)',
      officialSourceUrl: 'https://www.gov.uk/income-tax-rates',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Standard 1257L tax code for tax year 2025/26'],
    },
  },
};

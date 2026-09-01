import type { CountryTaxProfile } from '../types';

export const caProfile: CountryTaxProfile = {
  id: 'ca',
  name: 'Canada',
  countryCode: 'CA',
  flagEmoji: '🇨🇦',
  defaultCurrency: 'CAD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Province / Territory',
  metaDescription: 'Calculate Canadian federal and provincial income tax, CPP, and EI deductions with official 2026 CRA rates, 14% lowest tax tier, and Basic Personal Amount ($16,452).',
  faqItems: [
    {
      question: 'What is the 2026 Canada Basic Personal Amount (BPA)?',
      answer: 'The federal Basic Personal Amount for 2026 is $16,452, which acts as a non-refundable tax credit reducing taxable federal income.',
    },
    {
      question: 'What are the 2026 CPP and EI contribution rates in Canada?',
      answer: 'The employee CPP (Canada Pension Plan) contribution rate is 5.95% on pensionable earnings between $3,500 and $74,600 (maximum $4,230.45), plus second CPP (CPP2) on higher earnings. The Employment Insurance (EI) premium is 1.63% up to maximum insurable earnings of $68,900 (maximum $1,123.07).',
    },
    {
      question: 'What are the federal income tax brackets in Canada for 2026?',
      answer: 'The federal brackets for 2026 are: 14.0% up to $58,523; 20.5% from $58,523 to $117,045; 26.0% from $117,045 to $181,440; 29.0% from $181,440 to $258,482; and 33.0% over $258,482.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'CAD',
      currencySymbol: '$',
      standardDeduction: 16452,
      nationalBrackets: [
        { threshold: 0, upTo: 58523, rate: 0.140, label: '14.0% Federal Bracket' },
        { threshold: 58523, upTo: 117045, rate: 0.205, label: '20.5% Federal Bracket' },
        { threshold: 117045, upTo: 181440, rate: 0.260, label: '26.0% Federal Bracket' },
        { threshold: 181440, upTo: 258482, rate: 0.290, label: '29.0% Federal Bracket' },
        { threshold: 258482, rate: 0.330, label: '33.0% Federal Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'cpp',
          name: 'Canada Pension Plan (CPP)',
          rate: 0.0595,
          employeeRate: 0.0595,
          minThreshold: 3500,
          capAmount: 74600,
          description: '5.95% on pensionable earnings above $3,500 up to $74,600 (max $4,230.45).',
        },
        {
          id: 'ei',
          name: 'Employment Insurance (EI)',
          rate: 0.0163,
          employeeRate: 0.0163,
          capAmount: 68900,
          description: '1.63% on insurable earnings up to $68,900 (max $1,123.07).',
        },
      ],
      regions: [
        { code: 'on', name: 'Ontario (Avg 7.5% - 13.16%)', additionalTaxRate: 0.08 },
        { code: 'bc', name: 'British Columbia (Avg 5.06% - 14.7%)', additionalTaxRate: 0.077 },
        { code: 'ab', name: 'Alberta (Flat 10% - 15%)', additionalTaxRate: 0.10 },
        { code: 'qc', name: 'Quebec (Provincial Tax avg)', additionalTaxRate: 0.15 },
        { code: 'federal_only', name: 'Federal Tax Only (Excl. Provincial)', flatRate: 0 },
      ],
      vatConfig: {
        name: 'GST / HST',
        standardRate: 0.05, // 5% GST base federal
        reducedRates: [{ name: 'HST (Ontario 13%, Maritimes 15%)', rate: 0.13 }],
      },
      officialSourceName: 'Canada Revenue Agency (CRA)',
      officialSourceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single employee claiming standard Basic Personal Amount ($16,452)',
        'Standard CPP (base) and EI rates applied outside Quebec',
        'Optional provincial tax estimated based on selected province',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'CAD',
      currencySymbol: '$',
      standardDeduction: 16129,
      nationalBrackets: [
        { threshold: 0, upTo: 57375, rate: 0.145, label: '14.5% Federal Bracket' },
        { threshold: 57375, upTo: 114750, rate: 0.205, label: '20.5% Federal Bracket' },
        { threshold: 114750, upTo: 177882, rate: 0.260, label: '26.0% Federal Bracket' },
        { threshold: 177882, upTo: 253414, rate: 0.290, label: '29.0% Federal Bracket' },
        { threshold: 253414, rate: 0.330, label: '33.0% Federal Top Bracket' },
      ],
      socialContributions: [
        {
          id: 'cpp',
          name: 'Canada Pension Plan (CPP)',
          rate: 0.0595,
          employeeRate: 0.0595,
          minThreshold: 3500,
          capAmount: 71300,
        },
        {
          id: 'ei',
          name: 'Employment Insurance (EI)',
          rate: 0.0164,
          employeeRate: 0.0164,
          capAmount: 65700,
        },
      ],
      regions: [
        { code: 'on', name: 'Ontario', additionalTaxRate: 0.08 },
      ],
      vatConfig: {
        name: 'GST / HST',
        standardRate: 0.05,
      },
      officialSourceName: 'Canada Revenue Agency (CRA)',
      officialSourceUrl: 'https://www.canada.ca',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single employee claiming standard BPA for 2025'],
    },
  },
};

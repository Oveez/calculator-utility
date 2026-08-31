import type { CountryTaxProfile } from '../types';

export const caProfile: CountryTaxProfile = {
  id: 'ca',
  name: 'Canada',
  countryCode: 'CA',
  flagEmoji: '🇨🇦',
  defaultCurrency: 'CAD',
  defaultCurrencySymbol: '$',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: true,
  regionalEntityName: 'Province / Territory',
  metaDescription: 'Calculate Canadian federal and provincial income tax, CPP, and EI deductions with official 2025 CRA rates and Basic Personal Amount.',
  faqItems: [
    {
      question: 'What is the 2025 Canada Basic Personal Amount (BPA)?',
      answer: 'The federal Basic Personal Amount for 2025 is $16,129, which acts as a non-refundable tax credit reducing taxable federal income.',
    },
    {
      question: 'What are the 2025 CPP and EI contribution rates in Canada?',
      answer: 'The employee CPP (Canada Pension Plan) contribution rate is 5.95% on pensionable earnings between $3,500 and $71,300 (maximum $4,034.10), plus second CPP (CPP2) on earnings between $71,300 and $81,200 (4.0%, max $396). The Employment Insurance (EI) premium is 1.64% up to maximum insurable earnings of $65,700 (maximum $1,077.48).',
    },
  ],
  years: {
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
          description: '5.95% on pensionable earnings above $3,500 up to $71,300 (max $4,034.10).',
        },
        {
          id: 'ei',
          name: 'Employment Insurance (EI)',
          rate: 0.0164,
          employeeRate: 0.0164,
          capAmount: 65700,
          description: '1.64% on insurable earnings up to $65,700 (max $1,077.48).',
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
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single employee claiming standard Basic Personal Amount ($16,129)',
        'Standard CPP (base) and EI rates applied outside Quebec',
        'Optional provincial tax estimated based on selected province',
      ],
    },
  },
};

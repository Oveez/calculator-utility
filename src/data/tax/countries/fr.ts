import type { CountryTaxProfile } from '../types';

export const frProfile: CountryTaxProfile = {
  id: 'france',
  name: 'France',
  countryCode: 'FR',
  flagEmoji: '🇫🇷',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2026',
  availableTaxYears: ['2026', '2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate French income tax (Impôt sur le Revenu), CSG/CRDS, and social security deductions with official 2026 DGFiP & Service-Public.fr tax scale data.',
  faqItems: [
    {
      question: 'What is the 2026 income tax scale in France?',
      answer: 'The French progressive tax scale (barème progressif) for 2026: Up to €11,600 at 0%; €11,601 to €29,579 at 11%; €29,580 to €84,577 at 30%; €84,578 to €181,917 at 41%; and above €181,917 at 45%.',
    },
    {
      question: 'What is the Plafond Annuel de la Sécurité Sociale (PASS) in 2026?',
      answer: 'The PASS for 2026 is €48,060 (€4,005 per month), which serves as the base ceiling for social security pension contributions.',
    },
  ],
  years: {
    '2026': {
      taxYear: '2026',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 11600, // 0% bracket allowance
      nationalBrackets: [
        { threshold: 0, upTo: 17978, rate: 0.11, label: 'Tranche 11%' }, // €11,601 to €29,579
        { threshold: 17978, upTo: 72977, rate: 0.30, label: 'Tranche 30%' }, // €29,580 to €84,577
        { threshold: 72977, upTo: 170317, rate: 0.41, label: 'Tranche 41%' }, // €84,578 to €181,917
        { threshold: 170317, rate: 0.45, label: 'Tranche 45%' }, // Over €181,917
      ],
      socialContributions: [
        {
          id: 'csg_crds',
          name: 'CSG / CRDS',
          rate: 0.097,
          employeeRate: 0.097,
          description: 'Contribution Sociale Généralisée (9.2%) and CRDS (0.5%) applied to 98.25% of gross earnings.',
        },
        {
          id: 'pension_base',
          name: 'Retraite de Base (Sécurité Sociale)',
          rate: 0.073,
          employeeRate: 0.073,
          capAmount: 48060, // PASS 2026 (€4,005 * 12)
          description: 'Basic statutory state pension contribution up to PASS ceiling.',
        },
        {
          id: 'pension_complementaire',
          name: 'Retraite Complémentaire (Agirc-Arrco)',
          rate: 0.05,
          employeeRate: 0.05,
          description: 'Mandatory complementary pension scheme.',
        },
      ],
      vatConfig: {
        name: 'TVA',
        standardRate: 0.20, // 20%
        reducedRates: [
          { name: 'Taux intermédiaire (restaurants, travaux)', rate: 0.10 },
          { name: 'Taux réduit (alimentation, livres)', rate: 0.055 },
        ],
      },
      officialSourceName: 'Direction Générale des Finances Publiques (DGFiP) / Service-Public.fr',
      officialSourceUrl: 'https://www.service-public.fr',
      lastVerifiedDate: '2026-09-01',
      assumptions: [
        'Single adult (1 part de quotient familial)',
        'Salaried employee (salarié non-cadre / cadre standard)',
        'Automatic standard professional expenses deduction and 0% bracket applied',
      ],
    },
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 11294,
      nationalBrackets: [
        { threshold: 0, upTo: 17503, rate: 0.11, label: 'Tranche 11%' },
        { threshold: 17503, upTo: 71047, rate: 0.30, label: 'Tranche 30%' },
        { threshold: 71047, upTo: 165812, rate: 0.41, label: 'Tranche 41%' },
        { threshold: 165812, rate: 0.45, label: 'Tranche 45%' },
      ],
      socialContributions: [
        {
          id: 'csg_crds',
          name: 'CSG / CRDS',
          rate: 0.097,
          employeeRate: 0.097,
        },
        {
          id: 'pension_base',
          name: 'Retraite de Base (Sécurité Sociale)',
          rate: 0.073,
          employeeRate: 0.073,
          capAmount: 47100,
        },
        {
          id: 'pension_complementaire',
          name: 'Retraite Complémentaire (Agirc-Arrco)',
          rate: 0.05,
          employeeRate: 0.05,
        },
      ],
      vatConfig: {
        name: 'TVA',
        standardRate: 0.20,
      },
      officialSourceName: 'DGFiP / Service-Public.fr',
      officialSourceUrl: 'https://www.impots.gouv.fr',
      lastVerifiedDate: '2025-01-15',
      assumptions: ['Single adult for 2025 tax year'],
    },
  },
};

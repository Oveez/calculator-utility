import type { CountryTaxProfile } from '../types';

export const frProfile: CountryTaxProfile = {
  id: 'france',
  name: 'France',
  countryCode: 'FR',
  flagEmoji: '🇫🇷',
  defaultCurrency: 'EUR',
  defaultCurrencySymbol: '€',
  defaultTaxYear: '2025',
  availableTaxYears: ['2025'],
  hasRegionalTax: false,
  metaDescription: 'Calculate French income tax (Impôt sur le Revenu), CSG/CRDS, and social security deductions (Cotisations Salariales) with official 2025 DGFiP data.',
  faqItems: [
    {
      question: 'What is the 2025 income tax scale in France?',
      answer: 'The French progressive tax scale (barème progressif) on 2024/2025 revenue: Up to €11,294 at 0%; €11,295 to €28,797 at 11%; €28,798 to €82,341 at 30%; €82,342 to €177,106 at 41%; and above €177,106 at 45%.',
    },
    {
      question: 'What is the standard 10% deduction for professional expenses (frais professionnels)?',
      answer: 'French tax law automatically applies a 10% deduction for work-related expenses on employment income, with a minimum of €495 and a maximum of €14,171.',
    },
  ],
  years: {
    '2025': {
      taxYear: '2025',
      currency: 'EUR',
      currencySymbol: '€',
      standardDeduction: 11294, // 0% bracket allowance
      nationalBrackets: [
        { threshold: 0, upTo: 17503, rate: 0.11, label: 'Tranche 11%' }, // €11,295 to €28,797
        { threshold: 17503, upTo: 71047, rate: 0.30, label: 'Tranche 30%' }, // €28,798 to €82,341
        { threshold: 71047, upTo: 165812, rate: 0.41, label: 'Tranche 41%' }, // €82,342 to €177,106
        { threshold: 165812, rate: 0.45, label: 'Tranche 45%' }, // Over €177,106
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
          capAmount: 47100, // Plafond Annuel Sécurité Sociale (PASS)
          description: 'Basic statutory state pension contribution.',
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
      officialSourceUrl: 'https://www.impots.gouv.fr',
      lastVerifiedDate: '2025-01-15',
      assumptions: [
        'Single adult (1 part de quotient familial)',
        'Salaried employee (salarié non-cadre / cadre standard)',
        'Automatic 10% standard professional expenses deduction applied',
      ],
    },
  },
};

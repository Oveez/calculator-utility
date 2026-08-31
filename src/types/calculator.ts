export type CalculatorInputType = 'number' | 'range' | 'text' | 'textarea' | 'select' | 'date' | 'datetime-local';

export interface CalculatorInputOption {
  label: string;
  value: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: CalculatorInputType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  placeholder?: string;
  defaultValue?: string | number;
  options?: CalculatorInputOption[];
}

export interface CalculatorFaqItem {
  question: string;
  answer: string;
}

export interface CalculatorExample {
  title: string;
  description: string;
  values: Record<string, number | string>;
  result?: string;
}

export interface CalculatorContent {
  intro: string;
  howItWorks: string;
  formulaExplanation: string;
  examples: CalculatorExample[];
}

export type CalculatorResultFormatter = (value: number | string) => string;

export interface CalculatorConfig {
  metaTitle?: string;
  slug: string;
  title: string;
  category: string;
  metaDescription: string;
  inputs: CalculatorInput[];
  formula: (values: Record<string, number | string>) => number | string;
  resultFormat: CalculatorResultFormatter;
  faq: CalculatorFaqItem[];
  relatedSlugs: string[];
  content: CalculatorContent;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

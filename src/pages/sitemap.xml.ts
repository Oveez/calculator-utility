import type { APIRoute } from 'astro';
import { calculators } from '../data/calculators';
import { countryTaxProfilesMap } from '../data/tax/countries';
import { siteUrl, withBasePath } from '../utils/site';

const basePages = [
  withBasePath('/'),
  withBasePath('/about/'),
  withBasePath('/contact/'),
  withBasePath('/privacy/'),
  withBasePath('/terms/'),
  withBasePath('/currency-converter/'),
  withBasePath('/tax-calculators/'),
  withBasePath('/tax-calculators/vat-calculator/'),
  withBasePath('/tax-calculators/salary-to-hourly/'),
  withBasePath('/tax-calculators/hourly-to-salary/'),
];

const countryTaxPages = Object.keys(countryTaxProfilesMap).map((id) =>
  withBasePath(`/${id}-income-tax-calculator/`)
);

const calculatorPages = calculators.map((calc) =>
  withBasePath(`/calculators/${calc.slug}/`)
);

const allSitemapEntries = Array.from(
  new Set([...basePages, ...countryTaxPages, ...calculatorPages])
);

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${new URL(entry, siteUrl).toString()}</loc>
    <changefreq>weekly</changefreq>
    <priority>${entry === withBasePath('/') ? '1.0' : entry.includes('tax') || entry.includes('currency') ? '0.8' : '0.6'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

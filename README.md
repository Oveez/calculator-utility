# Global Calculator & International Tax Platform

A comprehensive, lightning-fast, and privacy-focused static calculator and international tax web application built with **Astro 7**, **TypeScript**, and **Tailwind CSS v4**.

Every computation runs **100% locally in the browser** with zero backend latency, zero database dependencies, and complete data privacy.

---

## ✨ Features & Architecture

- **🏛️ 24-Country International Tax Engine**: Complete progressive income tax calculators for 24 priority economies (US, UK, Canada, Australia, Germany, France, Spain, Italy, Netherlands, Ireland, Portugal, Switzerland, Belgium, Austria, Sweden, Norway, Denmark, Finland, Poland, Singapore, Japan, South Korea, New Zealand, Mexico).
  - Multi-bracket progressive calculation with personal allowances & standard deductions.
  - Social security / national insurance contributions.
  - Gross-to-Net and Inverse Net-to-Gross salary solver.
  - Paycheck frequency breakdowns (Annual, Monthly, Bi-Weekly, Weekly, Daily, Hourly).
  - Official tax authorities (IRS, CRA, HMRC, ATO, BZSt, DGFiP, AEAT, etc.) and verification timestamps.
- **💱 Real-Time Currency Converter**: Live mid-market foreign exchange rates for 160+ world currencies powered by free real-time interbank feeds, local caching (1-hour TTL), offline fallback, and instant 12-currency matrix.
- **🏷️ Global VAT / GST Tool**: Tax-exclusive and tax-inclusive consumption tax calculator with official standard and reduced rates for 35+ countries.
- **🧮 31+ Curated Utility Calculators**: Organized across 7 core categories (Finance, Converters, Math, Education, Health, Date & Time, Text Tools).
- **⚡ 100% Client-Side & Static**: Generates pure static HTML/CSS/JS with sub-50ms TTFB on global CDNs.
- **🌓 Zero-FOUC Dark Mode**: System-aware theme toggle with persistent `localStorage` memory and zero layout shift.
- **🔍 Full SEO & Schema.org Graph**: Automated XML sitemap at `/sitemap.xml`, `robots.txt`, OpenGraph metadata, and structured JSON-LD (`WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`).
- **🍪 GDPR & AdSense Ready**: Cookie consent banner, comprehensive Privacy Policy, Terms of Service, Contact page, and non-intrusive ad placement slots.

---

## 🗂️ Project Directory Structure

```
calculator/
├── public/
│   ├── favicon.svg             # Modern vector favicon
│   ├── robots.txt              # Production search engine crawl directives
│   ├── sitemap.xml             # Static XML sitemap index
│   └── site.webmanifest        # Web application manifest
├── src/
│   ├── components/
│   │   ├── AdPlacement.astro   # Reusable non-intrusive AdSense placement
│   │   ├── Analytics.astro     # Google Analytics 4 & GSC meta verification
│   │   ├── CalculatorEngine.astro # Reactive form engine
│   │   ├── CookieConsent.astro # GDPR/CCPA privacy consent notice
│   │   ├── CurrencyConverterApp.astro # Real-time currency conversion app
│   │   ├── SiteHeader.astro    # Responsive navigation bar
│   │   ├── ThemeToggle.astro   # Dark/light mode switcher
│   │   └── tax/
│   │       ├── AdSlot.astro    # AdSense monetization slot
│   │       ├── TaxCalculatorApp.astro # 24-country progressive tax calculator
│   │       ├── TaxDisclaimer.astro    # Legal & professional tax disclaimers
│   │       └── TaxFaqSection.astro    # Country-specific FAQ accordion
│   ├── data/
│   │   ├── calculators.ts      # Standard 31 calculator configurations
│   │   ├── currency.ts         # 160+ currencies, metadata & baseline rates
│   │   └── tax/
│   │       ├── types.ts        # Tax engine data interfaces
│   │       ├── countries.ts    # Master 24-country registry
│   │       └── countries/      # Individual country tax profiles (us.ts, uk.ts, etc.)
│   ├── layouts/
│   │   ├── CalculatorLayout.astro # Single calculator SEO & schema wrapper
│   │   └── SiteLayout.astro       # Global HTML shell with blocking theme script
│   ├── pages/
│   │   ├── index.astro         # Homepage with hero, search, and category taxonomy
│   │   ├── about.astro         # About project and methodology
│   │   ├── contact.astro       # Contact support & bug reporting
│   │   ├── privacy.astro       # Privacy policy & cookie disclosures
│   │   ├── terms.astro         # Terms of use & financial disclaimer
│   │   ├── currency-converter.astro # Top-level Currency Converter page
│   │   ├── sitemap.xml.ts      # Dynamic XML sitemap endpoint
│   │   ├── [country]-income-tax-calculator.astro # 24 Country Tax Pages
│   │   ├── tax-calculators/    # Tax hub, VAT calculator, salary tools
│   │   └── calculators/        # 31 Individual calculator routes
│   ├── styles/
│   │   └── global.css          # Design system & Tailwind CSS v4 variables
│   ├── utils/
│   │   ├── calculators.ts      # Category metadata & path helpers
│   │   ├── site.ts             # Domain & canonical URL utilities
│   │   └── tax/                # Tax calculations, inverse solvers, VAT engines
│   └── types/
│       └── calculator.ts       # Type definitions
├── tests/                      # Automated test suites for tax math & endpoints
├── .env.example                # Example environment variables
├── .gitignore                  # Production Git ignore rules
├── astro.config.mjs            # Astro SSG build configuration
├── DEPLOYMENT.md               # Step-by-step production deployment guide
└── package.json
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ or v22 LTS
- `npm`, `pnpm`, or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/calculator.git
cd calculator

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

The site will be live at `http://localhost:4321`.

---

## 📦 Build & Production Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local Astro development server on port 4321 |
| `npm run build` | Builds optimized, minified static assets to `./dist` |
| `npm run preview` | Previews the production `./dist` build locally |
| `npm run check` | Runs Astro & TypeScript type check |

---

## 🌐 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `SITE_URL` | Production website root URL (e.g. `https://yourdomain.com`) | `http://localhost:4321` |
| `BASE_PATH` | Base path for sub-directory hosting (e.g. `/`) | `/` |
| `PUBLIC_GA_MEASUREMENT_ID` | Optional Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) | `""` |
| `PUBLIC_GSC_VERIFICATION` | Optional Google Search Console verification meta tag string | `""` |
| `PUBLIC_ADSENSE_CLIENT_ID` | Optional Google AdSense Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) | `""` |

---

## 🔒 Security & Privacy

1. **Zero Secret Leakage**: No API keys, credentials, or secrets are bundled or required.
2. **Client-Side Processing**: All financial numbers, salaries, and medical figures remain strictly in browser RAM.
3. **Open Exchange Rates**: Currency rates use free public interbank endpoints with local browser caching.

---

## 📄 License & Attribution

Open-source under the [MIT License](LICENSE). Built with Astro and Tailwind CSS.
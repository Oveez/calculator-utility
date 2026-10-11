# Tax Migration Master Roadmap

## Objective
Transform the existing tax-calculator system from a monolithic, US-centric generic calculation engine into a genuinely country-specific, maintainable, year-aware tax-calculation platform covering all 24 countries — while preserving the complete, rich user experience (paycheck schedules, multi-color allocation bars, bracket breakdown tables, quick/advanced dual modes).

## Phases

### PHASE 0: Project Context & Documentation Baseline (COMPLETE)
- [x] Establish agent-portable documentation (`docs/tax-migration/`).
- [x] Create `AGENTS.md`.
- [x] Establish safety backup branch (`backup-phase5-engines`).
- [x] Restore clean, passing Cloudflare production UI baseline (`npm run build` passing 212 pages).
- [x] Approval Gate 0 (Passed)

### PHASE 1: Rich UI Primitives & US Calculator Extraction (COMPLETE)
- [x] Extract rich shared UI primitives from `TaxCalculatorApp.astro` preserving full depth:
  - `TaxAllocationBar.astro` (dynamic multi-color visual breakdown)
  - `TaxBracketsTable.astro` (dynamic marginal bracket slices)
  - `TaxBreakdownTable.astro` (line-item tax audit trail)
  - `PaycheckFrequencyTable.astro` (7-frequency schedule: hourly, daily, weekly, bi-weekly, semi-monthly, monthly, annual)
  - `TaxYearSelector.astro` (year selection)
- [x] Formalize `UsTaxCalculatorApp.astro` retaining Quick & Advanced modes with Form 1040 line items and real-time calculation.
- [x] Wire the US route (`src/pages/us-income-tax-calculator.astro`) to `UsTaxCalculatorApp.astro`.
- [x] Verify build and tests pass (100% passing across 212 pages and 24 test suites).
- [x] Approval Gate 1 (Passed)

### PHASE 2: Tax Data Architecture & Testing Harness (COMPLETE)
- [x] Establish Vitest harness with targeted engine include pattern.
- [x] Create `SourceMetadata` interface in `src/data/tax/types.ts`.
- [x] 24 calculation engines and 24 test suites in place (`tests/*-engine.test.ts`, 47 tests passing).
- [x] Approval Gate 2 (Passed)

### PHASE 3: Tier 1 Countries Implementation (Rich UI + Country Engine) (COMPLETE)
- [x] United Kingdom (HMRC bands, Scotland rates, Class 1 NI, tapering over £100k)
- [x] Canada (Federal + Provincial brackets, CPP, EI, Basic Personal Amount)
- [x] Australia (Stage 3 brackets, Medicare Levy, LITO, MLS, Superannuation)
- [x] Germany (BMF Brutto-Netto, Steuerklasse I–VI, Solidaritätszuschlag, Kirchensteuer, Social Insurance)
- [x] Approval Gate 3 (Passed)

### PHASE 4: Tier 2 Countries Implementation (EU Bloc) (COMPLETE)
- [x] France (Quotient familial, CSG/CRDS, progressive brackets)
- [x] Ireland (Standard rate band, USC, PRSI, Tax credits)
- [x] Netherlands (Box 1, Zvw, Algemene heffingskorting, Arbeidskorting, 30% ruling)
- [x] Spain (State + Autonomous community brackets, Mínimo personal, Seguridad Social)
- [x] Italy (IRPEF, Regional/Municipal surcharges, INPS, Detrazioni)
- [x] Approval Gate 4 (Passed)

### PHASE 5: Tier 3 Countries Implementation (Global) (COMPLETE)
- [x] Japan, Singapore, South Korea, Mexico, New Zealand, Switzerland, Austria, Belgium, Denmark, Finland, Norway, Sweden, Poland, Portugal.
- [x] Approval Gate 5 (Passed)

### PHASE 6: Global Regression, Monolith Deprecation, SEO, & Cleanup (COMPLETE)
- [x] Verify all 24 countries have full functional parity and rich UI.
- [x] Deprecate and delete `TaxCalculatorApp.astro` monolith cleanly after all 24 countries migrated.
- [x] Verify SEO, cross-linking, and routing across all 24 country calculator pages.
- [x] Final global regression checks: 24/24 Vitest suites passing, 212/212 pages built cleanly.
- [x] Final Approval Gate (Completed)

### REMEDIATION & PRODUCTION READINESS PHASES R0–R5 (COMPLETE)
- [x] **Phase R0:** Core Architecture Decoupling & Isomorphic Runtime Foundation (Poland PoC).
- [x] **Phase R1:** Tier 1 Economies Statutory Overhaul (PL, UK, DE, AU, CA, US).
- [x] **Phase R2:** Tier 2 Western European Economies Overhaul (NL, FR, IE, ES, IT).
- [x] **Phase R3:** Tier 3 Developed Economies Overhaul (JP, SG, NZ, KR, MX, CH).
- [x] **Phase R4:** Tier 4 Remaining European Economies Overhaul (AT, BE, DK, FI, NO, SE, PT).
- [x] **Phase R5:** Full-Platform Verification, 24-Country Isomorphic Parity Test, Official Source Metadata Audit & Release Sign-Off (25/25 test suites, 149/149 tests green, 212/212 pages built).

## General Rules
- Target data verification cutoff: **October 1, 2026**.
- No code rewrites to Git history.
- Each phase ends with an explicit approval gate before proceeding.


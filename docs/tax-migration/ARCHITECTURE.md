# Architecture

## Current Architecture
The current architecture relies on a single monolithic component (`src/components/tax/TaxCalculatorApp.astro`) to handle the UI and calculation logic for all 24 countries. 
Data is supplied via `src/data/tax/countries/[cc].ts`.
- **Flaw:** Forces US tax concepts (FICA, W-2, standard deduction, Form 1040) onto foreign tax systems.
- **Flaw:** Monolithic rendering makes it impossible to add country-specific inputs without modifying the core logic for all countries.
- **Flaw:** Lacks testable, isolated calculation engines.

## Target Architecture
### 1. Shared Infrastructure
- **UI Primitives:** `src/components/tax/shared/` (e.g., `<CurrencyInput>`, `<TaxBreakdownTable>`, `<TaxYearSelector>`, `<TaxDisclaimer>`).
- **Layout:** A unified layout shell to ensure visual consistency across all countries.

### 2. Country-Specific Infrastructure
- **UI Components:** `src/components/tax/countries/[cc]TaxCalculatorApp.astro`. Uses shared primitives but contains country-specific inputs and layout.
- **Calculation Engines:** `src/utils/tax/engines/[cc]-engine.ts`. Pure, testable TypeScript functions that take country-specific inputs and return a detailed tax breakdown.
- **Data Models:** `src/data/tax/[cc]/[year].ts`. Strict, typed data representing the tax laws for a specific country and year. Contains `SourceMetadata`.

### 3. Data Flow
`User Input` -> `Country-Specific UI Component` -> `[cc]-engine.ts (using year data)` -> `Result Object` -> `Shared Result Visualization Components`.

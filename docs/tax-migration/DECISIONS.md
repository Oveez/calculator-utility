# Decisions Log

## 1. Split Monolithic Calculator
**Date:** 2026-10-02
**Decision:** Deprecate `TaxCalculatorApp.astro` and replace it with country-specific components.
**Reason:** The monolith forces US tax logic (FICA, standard deduction, Form 1040) onto 23 other countries, leading to massive inaccuracies and a poor UX.
**Alternatives Rejected:** Continuing to use ternary operators (`profile.id === 'us' ? ... : ...`) within the monolith, as it is unmaintainable and does not solve the underlying math flaws.

## 2. Year-Aware Data Architecture
**Date:** 2026-10-02
**Decision:** Create distinct data structures for each tax year (e.g., `src/data/tax/uk/2026.ts`).
**Reason:** Tax laws change annually. Overwriting past years' data destroys the ability to calculate historical returns.

## 3. Strict Verification Cutoff
**Date:** 2026-10-02
**Decision:** Treat **October 1, 2026** as the verification cutoff for all tax research.
**Reason:** Establishes a consistent baseline across all 24 countries. Proposed/future legislation will not be treated as effective unless enacted by this date.

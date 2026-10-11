# Current Phase

**Currently Active Phase:** PHASE R5 COMPLETE (Final Full-Platform Verification, Cross-Country Audit Sign-off & Production Readiness Complete)

## Objective
Execute final full-platform integration verification across all 24 country tax calculator engines, dedicated UI apps, and page routes. Verify zero dual-engine divergence (0.00 discrepancy), 100% isomorphic calculation parity, complete authoritative source metadata as of October 1, 2026, passing test suite (25/25 suites, 149/149 tests), and clean Astro production build across all 212 pages.

## Completed Milestones
- [x] **Phase A:** Complete 24-Country Architecture, Call Path & File Inventory
- [x] **Phase B0:** Independent Reproduction of Critical Architecture Findings (Dual-Engine Divergence & Tautological Tests)
- [x] **Phases B1–B6:** Deep Statutory Audits for all 24 countries against official gazettes and tax authority guidelines
- [x] **Phase C:** Master Audit Synthesis, Cross-Country Audit Matrix, and Isomorphic Remediation Blueprint
- [x] **Phase R0:** Core Architecture Decoupling & Isomorphic Runtime Foundation:
  - Decoupled `src/data/tax/types.ts` (`BaseTaxParams`, marked legacy US Form 1040 types as `@deprecated`).
  - Poland (`pl`) Proof of Concept: statutory KUP & Ulga dla młodych (<26), 0 PLN SSR/Client divergence.
- [x] **Phase R1: Tier 1 Statutory Overhaul:**
  - **Poland (`pl`):** Isomorphic TypeScript engine, statutory KUP (3,000 PLN Art. 22 ust. 2), Ulga dla młodych (<26), 4/4 Vitest tests passing.
  - **United Kingdom (`uk`):** Repaired Higher/Top rate thresholds from 112,570 to statutory 125,140; implemented personal allowance tapering (£100k–£125,140), Class 1 NI (8%/2%), Student Loan Plans (1, 2, 4, 5, Postgrad); isomorphic `UkTaxCalculatorApp.astro`; 6/6 tests passing.
  - **Germany (`de`):** Statutory EStG § 32a linear-progressive polynomial formula (Zones 1–5), *Ehegattensplitting* (§ 32a Abs. 5), Solidarity surcharge Freigrenze (€18,130) with statutory *Milderungszone* (§ 4 SolzG), and 2026 statutory BBG caps (€101,400 pension / €69,750 health); isomorphic `DeTaxCalculatorApp.astro`; 6/6 tests passing.
  - **Australia (`au`):** Fixed Stage 3 statutory second bracket from draft 15% to statutory 16%; implemented statutory LITO phase-out and Medicare low-income phase-in; isomorphic `AuTaxCalculatorApp.astro`; 6/6 tests passing.
  - **Canada (`ca`):** Isomorphic CRA calculation engine in `CaTaxCalculatorApp.astro`; RRSP custom deductions, multi-bracket provincial engines (Ontario, BC) and flat rate (Alberta); statutory CPP/EI payroll caps ($74,600 / $68,900); 5/5 tests passing.
  - **United States (`us`):** Isomorphic calculation engine in `UsTaxCalculatorApp.astro` calling `calculateAdvancedTax` directly in SSR and browser interactivity; 4/4 tests passing.
- [x] **Phase R2: Tier 2 Western European Economies Overhaul:**
  - **Netherlands (`nl`):** Unified `NlTaxCalculatorApp.astro` with isomorphic `calculateNlTax`; Box 1 3-bracket statutory scale; year-aware 4-tier *Arbeidskorting* and tapered *Algemene heffingskorting*; statutory Zvw 5.45% (cap €78,426) and 30% ruling; 5/5 Vitest tests passing.
  - **Ireland (`ie`):** Unshifted SRCOP brackets (€44,000 single in 2026, €42,000 in 2025; married one-earner €53,000 / two-earners up to €88,000); statutory 4-tier Universal Social Charge (USC) with €13,000 exemption; statutory personal and employee PAYE tax credits (€2,000 each in 2026; €1,875 in 2025); unified `IeTaxCalculatorApp.astro`; 5/5 Vitest tests passing.
  - **France (`fr`):** Isomorphic `FrTaxParams` in `fr-engine.ts` supporting statutory 10% *déduction forfaitaire pour frais professionnels* (min €509, max €14,460 in 2026; max €14,171 in 2025); family quotient (*quotient familial* parts); statutory CSG/CRDS (9.7% on 98.25% gross up to 4x PASS) with 6.8% income-tax deductibility; unified `FrTaxCalculatorApp.astro`; 4/4 Vitest tests passing.
  - **Spain (`es`):** Restored statutory Art. 19 LIRPF *gastos deducibles de difícil justificación* (€2,000) and reduced labor income reduction (Art. 20 LIRPF); 5-bracket progressive state and autonomous community scales with regional adjustments (e.g. Madrid -1.5% discount); unified `EsTaxCalculatorApp.astro`; 4/4 Vitest tests passing.
  - **Italy (`it`):** Unshifted IRPEF scaglioni (€28,000 / €50,000); year-aware 2nd bracket rate (33% in 2026 vs 35% in 2025); statutory *Detrazione lavoro dipendente* (Art. 13 TUIR) including €1,955 max allowance and tapered brackets up to €50,000; INPS worker social security (9.19%); unified `ItTaxCalculatorApp.astro`; 5/5 Vitest tests passing.
- [x] **Phase R3: Tier 3 Developed Economies Overhaul:**
  - **Japan (`jp`):** Isomorphic `calculateJpTax` in `jp-engine.ts` with statutory Art. 28 Employment Income Deduction (給与所得控除 up to ¥1.95m cap), Art. 86 Basic Deduction (基礎控除 ¥480k phased out > ¥24m), Shakai Hoken (Health 5% cap ¥16.68m, Pension 9.15% cap ¥7.8m, Employment 0.60%), 2.1% Reconstruction Surtax, flat 10% Juminzei; unified `JpTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Singapore (`sg`):** Isomorphic `calculateSgTax` in `sg-engine.ts` with year-aware CPF Ordinary Wage caps ($96,000 in 2026 vs $88,800 in 2025), age-tiered CPF contribution rates (20%, 15%, 9.5%, 5%), age-tiered Earned Income Relief ($1k, $6k, $8k), and statutory $80,000 personal relief cap; unified `SgTaxCalculatorApp.astro`; 6/6 tests passing.
  - **New Zealand (`nz`):** Isomorphic `calculateNzTax` in `nz-engine.ts` with Budget 2024 progressive thresholds ($15.6k, $53.5k, $78.1k, $180k), year-aware ACC Earners' levy ($156,641 cap @ 1.75% in 2026/27 vs $142,283 @ 1.60% in 2025/26), KiwiSaver (3%–10%), Independent Earner Tax Credit (IETC $520 abated 13c/$ between $44k–$48k), and student loan repayments (12% > $24,128); unified `NzTaxCalculatorApp.astro`; 5/5 tests passing.
  - **South Korea (`kr`):** Isomorphic `calculateKrTax` in `kr-engine.ts` with statutory Art. 47 Earned Income Deduction (근로소득공제 5-tier formula up to ₩20m cap), ₩1.5m basic personal deduction, 4 Major Social Insurances (Pension 4.75% in 2026 vs 4.5% in 2025, Health 3.595%, Care 13.14% of health, Employment 0.90%), and 10% Local Income Tax; unified `KrTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Mexico (`mx`):** Isomorphic `calculateMxTax` in `mx-engine.ts` with statutory Art. 96 LISR progressive 11-bracket table, May 2024 presidential decree *Subsidio para el empleo* (11.82% monthly UMA for monthly earnings <= $9,081 MXN), 25 UMA IMSS worker quota (2.725% capped at $1,070,453.75 in 2026 vs $980,000 in 2025), and personal deductions within 15% limit; unified `MxTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Switzerland (`ch`):** Isomorphic `calculateChTax` in `ch-engine.ts` with Direct Federal Tax (Tarif A), data-driven Cantonal/Communal taxes across all profile regions, AHV/IV/EO (5.30% uncapped), ALV (1.10% capped at CHF 148,200), and optional Pillar 3a deduction (capped at CHF 7,056); unified `ChTaxCalculatorApp.astro`; 6/6 tests passing.
- [x] **Phase R4: Tier 4 Remaining European Economies Overhaul:**
  - **Austria (`at`):** Isomorphic `calculateAtTax` in `at-engine.ts` with statutory § 67 EStG preferential 6% flat tax for 13th & 14th salaries (after €620 tax-free allowance), *Verkehrsabsetzbetrag* (€463 standard credit), uncompressed annual progressive scale on regular income, ASVG social security (18.12% capped at €82,200 *Höchstbeitragsgrundlage*); unified `AtTaxCalculatorApp.astro`; 6/6 tests passing.
  - **Belgium (`be`):** Isomorphic `calculateBeTax` in `be-engine.ts` with statutory 30% *Forfait pour frais professionnels* (Art. 51 CIR 92, capped at €5,750), *Quotité exemptée* (€11,180 in 2026), 4-tier progressive IPP scale (25%, 40%, 45%, 50%), ONSS worker social security (13.07% uncapped), and municipal surcharge (*centimes additionnels*); unified `BeTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Denmark (`dk`):** Isomorphic `calculateDkTax` in `dk-engine.ts` with statutory *Beskæftigelsesfradrag* (10.65% capped at 54,600 DKK in 2026), *Personfradrag* (54,100 DKK), 8% AM-bidrag, 2026 tax reform brackets (Bundskat + Kommune ~37.07%, Mellemskat 7.5%, Topskat 15%), and municipal adjustments; unified `DkTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Finland (`fi`):** Eradicated invented `4000` constant! Isomorphic `calculateFiTax` in `fi-engine.ts` with statutory *Tulonhankkimisvähennys* (€750 work deduction), tapered *Perusvähennys* (max €4,000 phased out 18% > €4k), *Työtulovähennys* (EITC up to €2,140 phased out 4.5% > €22k), 4-tier state scale (Valtionvero), and post-sote municipal tax (Kunnallisvero); unified `FiTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Norway (`no`):** Isomorphic `calculateNoTax` in `no-engine.ts` with statutory *Minstefradrag* (46% capped at 104,300 NOK in 2026), *Personfradrag* (114,540 NOK), flat 22% *Alminnelig inntekt* tax, 5-step *Trinnskatt* on gross personal income, and 7.6% Trygdeavgift; unified `NoTaxCalculatorApp.astro`; 5/5 tests passing.
  - **Sweden (`se`):** Isomorphic `calculateSeTax` in `se-engine.ts` with statutory *Jobbskatteavdrag* (67 kap. 7 § IL 4-tier earned income tax credit), *Grundavdrag* (25,000 kr baseline), municipal tax (*Kommunalskatt* ~32.38%), state tax (*Statlig inkomstskatt* 20% > 643,000 kr *skiktgräns*), and eliminated double-deduction defect for 7% *Allmän pensionsavgift* (100% credited against tax); unified `SeTaxCalculatorApp.astro`; 6/6 tests passing.
  - **Portugal (`pt`):** Isomorphic `calculatePtTax` in `pt-engine.ts` with statutory *Mínimo de Existência* safeguard (Art. 70º CIRS, net salary cannot fall below €12,180 in 2026), 9-tier progressive IRS brackets, *Dedução específica* (€4,462.15 in 2026 or actual SS), Segurança Social (11% uncapped), and IRS Jovem multi-year exemption (100%/75%/50%/25%); unified `PtTaxCalculatorApp.astro`; 7/7 tests passing.

- [x] **Phase R5: Final Full-Platform Verification & Production Sign-off:**
  - **Route & Component Binding Audit:** Audited all 24 country calculator pages in `src/pages/*-income-tax-calculator.astro`. 100% render their dedicated `*TaxCalculatorApp.astro` component, import native country profiles, wrap in `<SiteLayout>`, and feature unique localized SEO metadata. The legacy monolith `TaxCalculatorApp.astro` is 100% eradicated with zero residual references.
  - **Authoritative Source Metadata Audit:** Audited all 24 country profiles in `src/data/tax/countries/*.ts`. Standardized official tax authority sources, verified URLs, and confirmed October 1, 2026 cutoff across all 24 datasets.
  - **End-to-End Isomorphic Parity Suite:** Implemented `tests/all-countries-parity.test.ts` executing end-to-end calculations across all 24 countries. Validated 100% non-zero gross and net incomes, finite effective tax rates, and zero divergence between SSR and client interactive bundles.
  - **Full Vitest Test Suite:** 25/25 test suites passing (149/149 tests passed, 0 failures).
  - **Production Build:** 212/212 pages built cleanly in 30.29s with 0 errors.

## Test & Build Verification
- **Test Suite Status:** 25/25 test suites pass (149/149 tests passed, 0 failures, 100% green).
- **Production Build:** 212/212 pages built cleanly in 30.29s (Astro v7.3.1).
- **SSR/Client Parity:** 0.00 discrepancy across all 24 countries.
- **Authoritative Verification Cutoff:** October 1, 2026 verified across all 24 country profiles.

## Project Status
**TAX MIGRATION FULLY COMPLETE & SIGNED OFF FOR PRODUCTION.**
All 24 countries operate on native statutory engines with zero US bleed-through, zero invented constants, and zero SSR/client divergence.

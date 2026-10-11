# Testing Strategy

## Philosophy
The test suite must protect countries from changes made to shared infrastructure. A change to a currency formatter or a shared UI primitive must not silently break a specific country's tax calculation.

## Testing Architecture
1. **Engine Tests (`src/utils/tax/engines/*.test.ts`)**
   - Unit tests for each country's isolated calculation engine.
   - Must cover edge cases, bracket transitions, phase-outs, and caps.
   - **Crucial:** Use authoritative sample calculations (e.g., government examples) as assertions.
2. **Data Validation Tests**
   - Assert that data objects conform to required schemas and have valid `SourceMetadata`.
3. **UI / Integration Tests**
   - Ensure the country-specific Astro components correctly pass inputs to the engine and render the results accurately.
4. **Regression Protection**
   - Ensure a change to a shared module runs the entire suite across all 24 countries.

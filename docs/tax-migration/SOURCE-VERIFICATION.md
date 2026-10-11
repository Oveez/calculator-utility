# Source Verification Ledger

This document, or the metadata within the codebase, tracks the authoritative sources for tax calculations.

## Schema
For every tax data file, ensure a `sourceMetadata` property exists with the following structure:
```typescript
interface SourceMetadata {
  concept: string;          // e.g., "National Insurance Class 1"
  authority: string;        // e.g., "HM Revenue & Customs"
  url: string;              // e.g., "https://www.gov.uk/..."
  effectiveDate: string;    // e.g., "2026-04-06"
  verifiedAt: string;       // Date the AI/Engineer verified it
  status: 'Enacted' | 'Proposed';
  notes?: string;
}
```

## Tracked Sources
*(This section will be populated as countries are implemented, acting as a global ledger if a centralized script cannot automatically generate it.)*

# Permanent Agent Instructions for Tax Migration

Any AI agent (Copilot, Codex, Antigravity) working on this repository MUST obey these rules:

1. **NO INVENTED TAX RULES:** Do not guess tax brackets, rates, or allowances. Use verified data.
2. **AUTHORITATIVE SOURCES ONLY:** Prioritize official national tax authorities, government ministries, or gazettes. Do not use SEO blogs as primary sources.
3. **OCTOBER 1, 2026 CUTOFF:** All tax data must be verified as of October 1, 2026. Do not include proposed legislation unless enacted.
4. **YEAR-AWARE:** Preserve historical data. Do not overwrite past years' tax rules.
5. **NO US BLEED-THROUGH:** Do not mix country tax logic. A UK tax calculator should not reference FICA, W-2s, or standard deductions. Use native terminology.
6. **STRICT PHASING:** Do not automatically execute future phases. Await user approval ("Execute Phase X").
7. **PRESERVE URLS:** Do not change existing page routes or slugs without explicit instruction.
8. **TEST BEFORE COMPLETION:** Implement unit tests for all calculation engines based on official government examples.
9. **UPDATE HANDOFF:** Whenever a task or phase is completed, you MUST update `docs/tax-migration/HANDOFF.md`, `CURRENT-PHASE.md`, and `COUNTRY-STATUS.md`.
10. **READ BEFORE WRITING:** Always inspect the repository and current architecture before making broad changes.

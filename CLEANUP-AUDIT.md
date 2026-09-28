# Cleanup Audit

This cleanup removes only tracked artifacts proven to be temporary, backup, or saved patch output. No application logic, routes, deployment, infrastructure, verification, or active assets were changed.

## Deleted

| File | Reason | Evidence | Category | Action |
| --- | --- | --- | --- | --- |
| `diff.txt` | Saved PDF editor patch output | No repository references; content is a raw Git diff | Safe to delete | Deleted |
| `diff2.txt` | Duplicate saved PDF editor patch output | No repository references; content duplicates the same patch work | Safe to delete | Deleted |
| `diff3.txt` | Saved historical PDF editor patch/commit output | No repository references; content is a raw Git diff and commit dump | Safe to delete | Deleted |
| `scripts/tmp_MobileDrawer.astro` | Temporary component snapshot | No imports or path references; active component is `src/components/MobileDrawer.astro` | Safe to delete | Deleted |
| `scripts/tmp_SiteHeader.astro` | Temporary component snapshot | No imports or path references; active component is `src/components/SiteHeader.astro` | Safe to delete | Deleted |
| `scripts/tmp_SiteLayout.astro` | Temporary layout snapshot | No imports or path references; active layout is `src/layouts/SiteLayout.astro` | Safe to delete | Deleted |
| `scripts/tmp_global.css` | Temporary stylesheet snapshot | No imports or path references; active stylesheet is `src/styles/global.css` | Safe to delete | Deleted |
| `public/calc.png.bak` | Backup favicon/mark | No references; active favicon assets are `calc.png`, `favicon.svg`, and `favicon.ico` | Safe to delete | Deleted |
| `public/logo.png.bak` | Backup branding image | No references; active brand image is `public/logo.png` | Safe to delete | Deleted |
| `public/logo-wide.png.bak` | Backup wide branding image | No references; no active code depends on the backup variant | Safe to delete | Deleted |
| `public/logo-wide-dark.png.bak` | Backup dark wide branding image | No references; no active code depends on the backup variant | Safe to delete | Deleted |

## Kept

- `public/calc.png`, `public/calculator.png`, `public/favicon.svg`, `public/favicon.ico`, and `public/apple-touch-icon.png` are referenced by layout, metadata, or manifest behavior.
- `public/logo.png` is referenced by `BrandLogo.astro`.
- `public/logos/` is retained because Assignment Cover Maker constructs university logo URLs dynamically from institution slugs and can use bundled fallback logos.
- `public/images/hero-bg.jpg` and `public/images/hero-bg.webp` are both retained because CSS explicitly uses both as a fallback chain.
- `public/images/hero-home.*` and PDF hero variants are retained because their lack of literal source references is not sufficient to rule out content or future route usage.
- `old_editor.astro`, `fix_calculators.cjs`, and `fix-contrast.cjs` are not referenced by the application, but are historical source/tools rather than unambiguous generated artifacts and were deliberately left untouched.
- `tests/`, `data/`, `server.mjs`, deployment files, and documentation remain unchanged.

## Requires Review

- `old_editor.astro`: historical full-page editor snapshot; could be useful for recovery or comparison.
- `fix_calculators.cjs` and `fix-contrast.cjs`: one-off maintenance scripts with historical commit usage.
- Unreferenced hero image variants: possible content or future route assets.
- `public/logo-wide.png` and `public/logo-wide-dark.png`: unreferenced by current source search, but branded assets that may be used externally.

## .gitignore

No `.gitignore` changes were necessary. Existing rules already exclude build output, dependencies, caches, logs, environment files, and generated logo working directories.

## Tests

Run after cleanup:

- `npm run check`
- `npm run build`
- `git diff --check`

## Risk

The deleted files were not imported, dynamically addressed, referenced by configuration, or required by active metadata. Application behavior, routes, calculator logic, UI, assets used by Assignment Cover Maker, PDF/CV tools, infrastructure, and deployment configuration are unchanged.
# Executive Summary

The repository is an Astro static site. The checked-in Wrangler configuration publishes `dist` as Worker assets, but the old GitHub Pages workflow built with a repository-prefixed GitHub Pages URL. That could generate incorrect canonical, sitemap, Open Graph, and asset URLs for CI artifacts even though the currently served production site is already using `https://toolscastle.app`.

The workflow now builds with `SITE_URL=https://toolscastle.app` and `BASE_PATH=/`, then deploys through Wrangler. Wrangler was subsequently authenticated and the existing `edu-logos` bucket was connected to `logos.toolscastle.app`; no objects, old custom domains, DNS records, redirects, or application deployment were deleted or replaced.

Verified production behavior at audit time:

- `https://toolscastle.app/` and representative calculator, converter, and PDF-tool routes return `200`.
- `https://calculatorutility.tech/` and `https://www.calculatorutility.tech/calculators/bmi-calculator/` each make one redirect to the corresponding HTTPS ToolCastle URL with path preservation.
- `https://toolscastle.app/sitemap.xml` and `/robots.txt` return `200`; `/sitemap-index.xml` returns `404` and is not referenced by `robots.txt`.
- `https://www.toolscastle.app/` currently serves the site without a redirect.

# Code Changes

## `.github/workflows/deploy.yml`

Replaced the GitHub Pages deployment with a Cloudflare Wrangler deployment. CI now uses the canonical production site and root base path, preventing GitHub Pages URLs from entering generated metadata. The workflow requires `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` repository or environment secrets.

## `TOOLCASTLE-MIGRATION-AUDIT.md`

Records the audit findings, verified behavior, blocked operations, testing, and target architecture.

# Cloudflare Changes

Wrangler `4.142.0` was authenticated with the Cloudflare account and used for read-only inventory plus one safe R2 custom-domain addition. No application Worker deployment was performed from this branch.

The checked-in Worker asset configuration is named `calculator`, uses compatibility date `2026-09-28`, has no compatibility flags, and publishes `./dist` with `404-page` handling. It contains no Worker entry point, routes, custom domains, bindings, environment variables, or R2 declaration. Cloudflare confirmed an active `calculator` deployment and no Worker secrets. Worker routes, custom domains, redirect rules, DNS records, SSL mode, and compatibility settings remain only partially verified.

# R2 Storage

The source contains an upload utility for the `edu-logos` bucket and defaults its public URL to `https://logos.toolscastle.app`. Cloudflare reports 129 objects and a 2.58 MB bucket. The existing `logos.calculatorutility.tech` custom domain remains active. `logos.toolscastle.app` was added successfully and ownership is active, but SSL is still pending and the hostname does not yet serve successfully. No objects were deleted or migrated.

# Google / DNS

The live site uses `https://toolscastle.app` for canonical URLs, sitemap URLs, and metadata observed during testing. The live sitemap is `/sitemap.xml`; `robots.txt` points to that URL. The Google Analytics measurement ID observed in the live HTML was left unchanged.

The `toolscastle.app` zone is active with Cloudflare nameservers. DNS-record inventory was blocked because the OAuth session has zone metadata read but not DNS-record read permission. Authoritative nameserver, DNSSEC, verification TXT/CNAME values, and the unusual historical `100::` value therefore remain unverified. No DNS record was removed or added.

# Permissions

## Cloudflare API

- Operation blocked: inspect DNS records, DNSSEC, verification records, and the historical AAAA value through the Cloudflare API.
- Reason: the authenticated OAuth session has zone metadata read but lacks DNS-record read access; the direct DNS-record API returned authentication error 10000.
- Minimum access: add DNS Records Read for both zones. DNS Records Edit is not required for inspection and should only be granted for an approved DNS change. Workers Scripts Edit and Account Read remain sufficient for deployment; R2 Read/Edit was sufficient for the approved custom-domain addition.
- Configure at: GitHub repository Settings -> Secrets and variables -> Actions, preferably in a production environment named `production`.
- Required secret names: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Re-authentication: required before Wrangler inspection or deployment can run.

## Google Search Console

- Operation not attempted: obtain a new ToolCastle verification token.
- Reason: Google issues the token from the Search Console property and it must not be invented.
- Manual action: add `https://toolscastle.app` as a Domain or URL-prefix property in Search Console, then publish the genuine TXT token Google provides. Keep the old-domain verification record while it remains useful.

# Manual Tasks

1. Add DNS Records Read to the Cloudflare authentication used for this audit, then inspect both zones, redirect rules, SSL mode, DNSSEC, verification records, and the historical AAAA value. Do not delete or replace records during inspection.
2. Confirm `logos.toolscastle.app` ownership and SSL become active. Keep `logos.calculatorutility.tech` until the new hostname serves a known logo successfully.
3. Configure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets if the new deployment workflow should deploy automatically after merge.
4. In Google Search Console, verify `toolscastle.app` with a genuine Google-issued token and submit `https://toolscastle.app/sitemap.xml`.

# Testing

| Test | Expected result | Actual result | Status |
| --- | --- | --- | --- |
| `https://toolscastle.app/` | Main site responds | HTTP 200 | Pass |
| BMI calculator route | Deep link responds | HTTP 200 | Pass |
| Currency converter route | Tool responds | HTTP 200 | Pass |
| PDF merger route | Tool responds | HTTP 200 | Pass |
| `https://toolscastle.app/robots.txt` | Robots file responds | HTTP 200; points to `/sitemap.xml` | Pass |
| `https://toolscastle.app/sitemap.xml` | Canonical sitemap responds | HTTP 200; locations use ToolCastle | Pass |
| `https://toolscastle.app/sitemap-index.xml` | No broken sitemap reference | HTTP 404; not referenced | Pass |
| Old root domain | One permanent redirect to ToolCastle | One redirect; final HTTP 200 | Pass |
| Old deep link | Preserve path during redirect | BMI path preserved; final HTTP 200 | Pass |
| Old `www` deep link | Preserve path during redirect | One redirect; final HTTP 200 | Pass |
| `https://www.toolscastle.app/` | Serve or safely redirect | HTTP 200, no redirect | Pass |
| Wrangler authentication | API access available | Unauthenticated | Blocked |

# Remaining Issues

- Cloudflare resource inventory and any infrastructure repair remain pending authentication.
- The live `sitemap-index.xml` path is absent, but the site correctly publishes and references `sitemap.xml`; no index file is required unless the sitemap is split later.
- The active production deployment source and exact Worker/custom-domain mapping are not verifiable from this repository alone.

# Final Architecture

```text
toolscastle.app
    ↓
Cloudflare
    ↓
Production Worker / static Worker assets
    ↓
Astro application

Old domains:

calculatorutility.tech
www.calculatorutility.tech
    ↓
301
    ↓
toolscastle.app

R2 if configured:

logos.toolscastle.app
    ↓
Cloudflare R2
    ↓
edu-logos
```
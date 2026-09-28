# Executive Summary

The repository is an Astro static site. The checked-in Wrangler configuration publishes `dist` as Worker assets, but the old GitHub Pages workflow built with a repository-prefixed GitHub Pages URL. That could generate incorrect canonical, sitemap, Open Graph, and asset URLs for CI artifacts even though the currently served production site is already using `https://toolscastle.app`.

The workflow now builds with `SITE_URL=https://toolscastle.app` and `BASE_PATH=/`, then deploys through Wrangler. No Cloudflare resource, DNS record, redirect, R2 object, or production deployment was changed from this environment because Wrangler is unauthenticated.

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

No Cloudflare dashboard or API changes were made. Wrangler `4.142.0` is available through `npx`, but `wrangler whoami` reported that the environment is unauthenticated.

The checked-in Worker asset configuration is named `calculator`, uses compatibility date `2026-09-28`, has no compatibility flags, and publishes `./dist` with `404-page` handling. It contains no Worker entry point, routes, custom domains, bindings, environment variables, or R2 declaration. The actual production Worker name, deployments, routes, custom domains, redirect rules, DNS records, SSL mode, and compatibility settings remain unverified through the Cloudflare API.

# R2 Storage

The source contains an upload utility for the `edu-logos` bucket and defaults its public URL to `https://logos.toolscastle.app`. The application reads that URL from configuration in the assignment cover maker. No R2 bucket, custom domain, CORS policy, or object was inspected or changed because Cloudflare authentication was unavailable. No objects were deleted.

# Google / DNS

The live site uses `https://toolscastle.app` for canonical URLs, sitemap URLs, and metadata observed during testing. The live sitemap is `/sitemap.xml`; `robots.txt` points to that URL. The Google Analytics measurement ID observed in the live HTML was left unchanged.

DNS resolution returned Cloudflare edge addresses for both production zones from this environment. Authoritative nameserver, DNSSEC, record inventory, verification TXT/CNAME values, and the unusual historical `100::` value were not verified through Cloudflare because API authentication was unavailable. No verification record was removed or added.

# Permissions

## Cloudflare API

- Operation blocked: inspect or modify Workers, custom domains, routes, redirect rules, DNS, SSL, and R2.
- Reason: `wrangler whoami` reported `You are not authenticated`.
- Minimum access: a scoped Cloudflare API token with Workers Scripts Edit and Account Read for deployment; Zone DNS Read for DNS inspection; Zone DNS Edit only if an approved DNS change is required; R2 Read for inventory and R2 Edit only for an approved custom-domain/configuration change.
- Configure at: GitHub repository Settings -> Secrets and variables -> Actions, preferably in a production environment named `production`.
- Required secret names: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Re-authentication: required before Wrangler inspection or deployment can run.

## Google Search Console

- Operation not attempted: obtain a new ToolCastle verification token.
- Reason: Google issues the token from the Search Console property and it must not be invented.
- Manual action: add `https://toolscastle.app` as a Domain or URL-prefix property in Search Console, then publish the genuine TXT token Google provides. Keep the old-domain verification record while it remains useful.

# Manual Tasks

1. Create a least-privilege Cloudflare API token for the account and add it to the repository or production environment as `CLOUDFLARE_API_TOKEN`; add the account ID as `CLOUDFLARE_ACCOUNT_ID`.
2. Run `npx wrangler whoami` and `npx wrangler deployments list --name calculator` with that token. Confirm the production Worker name before changing `wrangler.jsonc` or removing any custom domain.
3. Inspect both zones, redirect rules, custom domains, SSL mode, DNSSEC, and the `edu-logos` bucket. Do not delete records, domains, or objects during this inspection.
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
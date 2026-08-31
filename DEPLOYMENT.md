# Production Deployment & Publishing Guide

This guide walks you step-by-step through publishing your calculator website from **GitHub** to **Production Hosting**, setting up a **Custom Domain**, configuring **Google Search Console**, adding **Google Analytics**, and applying for **Google AdSense**.

---

## 📋 Table of Contents

1. [Hosting Platform Recommendation](#1-hosting-platform-recommendation)
2. [Step 1: Push Project to GitHub](#step-1-push-project-to-github)
3. [Step 2: Deploy to Recommended Hosting (Cloudflare Pages)](#step-2-deploy-to-recommended-hosting-cloudflare-pages)
4. [Alternative: Deploy to Vercel](#alternative-deploy-to-vercel)
5. [Step 3: Connect Custom Domain & Configure HTTPS](#step-3-connect-custom-domain--configure-https)
6. [Step 4: Configure Google Search Console & Submit Sitemap](#step-4-configure-google-search-console--submit-sitemap)
7. [Step 5: Configure Google Analytics 4 (GA4)](#step-5-configure-google-analytics-4-ga4)
8. [Step 6: Apply for Google AdSense](#step-6-apply-for-google-adsense)
9. [Step 7: Ongoing Maintenance & Future Updates](#step-7-ongoing-maintenance--future-updates)

---

## 1. Hosting Platform Recommendation

### Winner: 🏆 **Cloudflare Pages**

| Criteria | Cloudflare Pages | Vercel | GitHub Pages |
| :--- | :---: | :---: | :---: |
| **Cost** | **100% Free (Unlimited bandwidth)** | Free (100GB bandwidth limit) | Free (100GB bandwidth limit) |
| **Performance / TTFB** | **~25ms Global Edge (300+ Cities)** | ~40ms Edge | ~120ms Centralized |
| **Astro SSG Compatibility** | **Native Preset (`npm run build` → `dist`)** | Native Preset | Requires GitHub Actions script |
| **SSL / HTTPS** | **Free Instant Cloudflare Universal SSL** | Free Let's Encrypt | Free Let's Encrypt |
| **Build Limits** | **500 builds / month (Free tier)** | 100 builds / day | GitHub Actions minutes |
| **DDoS Protection** | **Enterprise-grade Layer 3/4/7** | Standard | Standard |

**Why Cloudflare Pages is ideal for this project**:
Our calculator platform is built with **Astro SSG**—meaning all 24 country tax engines, 31 standard calculators, currency converters, and pages are pre-compiled into lightweight, pure static HTML, CSS, and client-side JavaScript. There are zero database requirements and zero server-side rendering cold starts. Cloudflare Pages caches everything at the absolute edge worldwide, giving users instant page loads with zero hosting costs.

---

## Step 1: Push Project to GitHub

### 1.1 Open Terminal in Project Folder
Navigate to the project root directory where `package.json` is located.

### 1.2 Initialize Git & Commit Files
```bash
# Check git status
git status

# If git is not initialized yet:
git init -b main

# Stage all production files (respecting .gitignore)
git add .

# Commit changes
git commit -m "feat: complete international tax platform, currency converter, and production setup"
```

### 1.3 Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Enter Repository name: `calculator` (or your preferred name).
3. Set visibility to **Public** or **Private**.
4. Do **not** initialize with README or .gitignore (we already have them).
5. Click **Create repository**.

### 1.4 Link Remote and Push
```bash
# Replace with your actual GitHub repository URL:
git remote add origin https://github.com/YOUR_USERNAME/calculator.git
git push -u origin main
```

---

## Step 2: Deploy to Recommended Hosting (Cloudflare Pages)

### 2.1 Connect Cloudflare to GitHub
1. Create a free account at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. On the Cloudflare sidebar, click **Workers & Pages**.
3. Click **Create application** → Select **Pages** tab → Click **Connect to Git**.
4. Authorize Cloudflare to access your GitHub account and select your `calculator` repository.

### 2.2 Configure Build Settings
Fill in the deployment form:
- **Project Name**: `calculator` (or your brand name).
- **Production Branch**: `main`.
- **Framework Preset**: Select `Astro`.
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Root Directory**: Leave blank (or `/` if prompted).

### 2.3 Set Production Environment Variables
Under **Environment Variables (Advanced)**, click **Add variable**:
- `SITE_URL`: `https://calculatorutility.tech` (or your temporary `*.pages.dev` URL).
- `BASE_PATH`: `/`
- `NODE_VERSION`: `20`

### 2.4 Click "Save and Deploy"
Cloudflare will build your project in ~40 seconds and give you a live URL like `https://calculator-xyz.pages.dev`.

---

## Alternative: Deploy to Vercel

If you prefer Vercel:
1. Sign in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub `calculator` repository.
4. Framework Preset will auto-detect **Astro**.
5. Build Command: `npm run build`, Output Directory: `dist`.
6. Add Environment Variable: `SITE_URL` = `https://calculatorutility.tech`.
7. Click **Deploy**.

---

## Step 3: Connect Custom Domain & Configure HTTPS

### 3.1 On Cloudflare Pages Dashboard
1. Go to your Pages project → Click the **Custom Domains** tab.
2. Click **Set up a custom domain**.
3. Enter your domain: `calculatorutility.tech` (and repeat for `www.calculatorutility.tech`).
4. If your domain's DNS is already on Cloudflare, it automatically configures DNS records with 1 click.
5. If your domain is registered on Namecheap, GoDaddy, or Google Domains:
   - Add a `CNAME` record pointing `calculatorutility.tech` (or `@`) to `<project-name>.pages.dev`.
   - Add a `CNAME` record pointing `www` to `<project-name>.pages.dev`.
6. **HTTPS/SSL**: Cloudflare automatically provisions and renews free SSL certificates. Ensure **SSL/TLS encryption mode** is set to **Full** or **Strict**.

---

## Step 4: Configure Google Search Console & Submit Sitemap

### 4.1 Add Property to Google Search Console
1. Go to [https://search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add Property** → Choose **URL prefix** (e.g. `https://calculatorutility.tech/`).
3. Under verification methods, choose **HTML tag**:
   - Copy the verification token (e.g. `google-site-verification=XXXXXXXXXXXXXXXX`).
   - Add it to your hosting environment variables as `PUBLIC_GSC_VERIFICATION=XXXXXXXXXXXXXXXX` and redeploy.
   - Alternatively, use DNS TXT record verification.
4. Click **Verify** in Search Console.

### 4.2 Submit XML Sitemap
1. In the Google Search Console sidebar, click **Sitemaps**.
2. Under "Add a new sitemap", enter: `sitemap.xml`
3. Click **Submit**.
4. Status will change to **Success** and index all 60+ calculator, country tax, and tool pages.

---

## Step 5: Configure Google Analytics 4 (GA4)

1. Create a free property at [https://analytics.google.com](https://analytics.google.com).
2. Navigate to **Admin** → **Data Streams** → **Web**.
3. Enter your Website URL and Stream Name.
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`).
5. Add the environment variable in your hosting dashboard:
   - Name: `PUBLIC_GA_MEASUREMENT_ID`
   - Value: `G-XXXXXXXXXX`
6. Trigger a deployment. Analytics will automatically start capturing page views and sessions with zero extra code.

---

## Step 6: Apply for Google AdSense

### 6.1 AdSense Policy Compliance Pre-Check
Our site is pre-built to meet all Google AdSense Publisher Policies:
- [x] **Essential Trust Pages**:
  - About Us: `/about/`
  - Contact Support: `/contact/`
  - Privacy Policy with Cookie & Advertising disclosures: `/privacy/`
  - Terms of Service: `/terms/`
- [x] **GDPR/CCPA Cookie Banner**: Built-in compliant consent notice.
- [x] **Substantial Original Content**: 24 official country tax engines with detailed math formulas, 31 standard calculators, and real-time currency converter.
- [x] **Clean Non-Deceptive UI**: Zero misleading buttons, zero fake download links, and clear separation of content and ad slots.

### 6.2 Application Steps
1. Sign up at [https://adsense.google.com](https://adsense.google.com).
2. Click **Sites** → **Add Site** → Enter `https://calculatorutility.tech`.
3. Copy your **AdSense Publisher Client ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`).
4. Set the environment variable in your hosting dashboard:
   - `PUBLIC_ADSENSE_CLIENT_ID`: `ca-pub-XXXXXXXXXXXXXXXX`
5. Submit site for review. Review usually completes in 24 to 72 hours.
6. Once approved, real ads will automatically populate the designated `AdPlacement` and `AdSlot` locations.

---

## Step 7: Ongoing Maintenance & Future Updates

To update tax rates or publish new calculators:
1. Make your changes in `src/data/tax/countries/*.ts` or `src/data/calculators.ts`.
2. Commit and push:
   ```bash
   git add .
   git commit -m "chore: update 2026 tax brackets"
   git push origin main
   ```
3. Cloudflare Pages / Vercel will automatically trigger a production build and deploy your updates within seconds.

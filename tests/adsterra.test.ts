import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Adsterra Ads Integration Verification', () => {
  const snippetsPath = path.resolve(__dirname, '../toolcastle-adsterra-snippets.html');
  const adsDir = path.resolve(__dirname, '../src/components/ads');

  const EXPECTED_UNITS = {
    skyscraper: {
      key: '1498c6c2265c1eb286c77895952e20c5',
      width: 160,
      height: 600,
      scriptUrl: 'https://www.highrevenueformat.com/1498c6c2265c1eb286c77895952e20c5/invoke.js',
      file: 'AdsterraSkyscraper.astro',
    },
    rectangle: {
      key: '870b262b468b958c99d159ae5bafb473',
      width: 300,
      height: 250,
      scriptUrl: 'https://www.highrevenueformat.com/870b262b468b958c99d159ae5bafb473/invoke.js',
      file: 'AdsterraRectangle.astro',
    },
    vertical: {
      key: 'e1a4b96b5bf2fa6b1efb3843ea4e2a01',
      width: 160,
      height: 300,
      scriptUrl: 'https://www.highrevenueformat.com/e1a4b96b5bf2fa6b1efb3843ea4e2a01/invoke.js',
      file: 'AdsterraVertical.astro',
    },
    leaderboard: {
      key: '128ec5e03e4921d4d2751a9cc07d2808',
      width: 728,
      height: 90,
      scriptUrl: 'https://www.highrevenueformat.com/128ec5e03e4921d4d2751a9cc07d2808/invoke.js',
      file: 'AdsterraLeaderboard.astro',
    },
    'mobile-banner': {
      key: '7972ace1d0daa4818b81871a83db36a8',
      width: 320,
      height: 50,
      scriptUrl: 'https://www.highrevenueformat.com/7972ace1d0daa4818b81871a83db36a8/invoke.js',
      file: 'AdsterraMobileBanner.astro',
    },
  };

  const NATIVE_AD = {
    containerId: 'container-629bc705a7b59e4369aca4b34d42b8b8',
    scriptUrl: 'https://pl31859911.profitableratecpmnetwork.com/629bc705a7b59e4369aca4b34d42b8b8/invoke.js',
    file: 'AdsterraNativeAd.astro',
  };

  it('all 5 display components match exact source-of-truth keys, URLs, and dimensions', () => {
    for (const [name, unit] of Object.entries(EXPECTED_UNITS)) {
      const filePath = path.join(adsDir, unit.file);
      expect(fs.existsSync(filePath), `Component file ${unit.file} must exist`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain(unit.key);
      expect(content).toContain(unit.scriptUrl);
      expect(content).toContain(`'width' : ${unit.width}`);
      expect(content).toContain(`'height' : ${unit.height}`);
      expect(content).toContain("'format' : 'iframe'");
    }
  });

  it('native ad component matches exact source-of-truth container ID and script URL', () => {
    const filePath = path.join(adsDir, NATIVE_AD.file);
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain(NATIVE_AD.containerId);
    expect(content).toContain(NATIVE_AD.scriptUrl);
    expect(content).toContain('data-cfasync="false"');
    expect(content).toContain('async="async"');
  });

  it('AdsterraResponsiveBanner includes exact leaderboard and mobile-banner configurations', () => {
    const filePath = path.join(adsDir, 'AdsterraResponsiveBanner.astro');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).toContain(EXPECTED_UNITS.leaderboard.key);
    expect(content).toContain(EXPECTED_UNITS.leaderboard.scriptUrl);
    expect(content).toContain(EXPECTED_UNITS['mobile-banner'].key);
    expect(content).toContain(EXPECTED_UNITS['mobile-banner'].scriptUrl);
  });

  it('preserves Google AdSense verification code and script in SiteLayout.astro', () => {
    const siteLayoutPath = path.resolve(__dirname, '../src/layouts/SiteLayout.astro');
    expect(fs.existsSync(siteLayoutPath)).toBe(true);
    const content = fs.readFileSync(siteLayoutPath, 'utf8');

    expect(content).toContain('ca-pub-7945473545268589');
    expect(content).toContain('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  });

  it('preserves Google ads.txt declaration with direct publisher ID', () => {
    const adsTxtPath = path.resolve(__dirname, '../public/ads.txt');
    expect(fs.existsSync(adsTxtPath)).toBe(true);
    const content = fs.readFileSync(adsTxtPath, 'utf8');

    expect(content).toContain('google.com, pub-7945473545268589, DIRECT, f08c47fec0942fa0');
  });

  it('wrapper components AdsterraDisplayAd and AdsterraNativeAd exist and route correctly', () => {
    const displayAdPath = path.resolve(__dirname, '../src/components/AdsterraDisplayAd.astro');
    const nativeAdPath = path.resolve(__dirname, '../src/components/AdsterraNativeAd.astro');

    expect(fs.existsSync(displayAdPath)).toBe(true);
    expect(fs.existsSync(nativeAdPath)).toBe(true);

    const displayContent = fs.readFileSync(displayAdPath, 'utf8');
    expect(displayContent).toContain('AdsterraSkyscraper');
    expect(displayContent).toContain('AdsterraRectangle');
    expect(displayContent).toContain('AdsterraVertical');
    expect(displayContent).toContain('AdsterraLeaderboard');
    expect(displayContent).toContain('AdsterraMobileBanner');
  });
});


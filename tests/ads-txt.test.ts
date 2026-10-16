import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('AdSense ads.txt validation', () => {
  const adsTxtPath = path.resolve(__dirname, '../public/ads.txt');
  const robotsTxtPath = path.resolve(__dirname, '../public/robots.txt');

  it('ads.txt file must exist and be non-empty', () => {
    expect(fs.existsSync(adsTxtPath)).toBe(true);
    const content = fs.readFileSync(adsTxtPath, 'utf8').trim();
    expect(content.length).toBeGreaterThan(0);
  });

  it('ads.txt must use "pub-" and NEVER "ca-pub-"', () => {
    const content = fs.readFileSync(adsTxtPath, 'utf8');
    // "ca-pub-" is the HTML client prefix; IAB ads.txt spec strictly requires "pub-"
    expect(content).not.toMatch(/ca-pub-/);
    expect(content).toMatch(/google\.com,\s*pub-\d{16},\s*DIRECT,\s*f08c47fec0942fa0/);
  });

  it('robots.txt must not disallow ads.txt or Mediapartners-Google', () => {
    expect(fs.existsSync(robotsTxtPath)).toBe(true);
    const robotsContent = fs.readFileSync(robotsTxtPath, 'utf8');
    expect(robotsContent).not.toMatch(/Disallow:\s*\/ads\.txt/);
    expect(robotsContent).not.toMatch(/Disallow:\s*\//);
  });
});


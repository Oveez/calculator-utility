import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve(process.cwd(), 'src/pages/education-tools/assignment-cover-maker.astro');
const source = fs.readFileSync(pagePath, 'utf8');

describe('Assignment Cover Maker PDF export parity', () => {
  it('uses html2pdf and preview-based export as the active PDF path', () => {
    assert.match(source, /<script\s+is:inline\s+src="\/js\/html2pdf\.bundle\.min\.js"><\/script>/);
    assert.match(source, /async function compilePreviewCoverPdf\(\)/);

    const activeExportCalls = source.match(/await compilePreviewCoverPdf\(\)/g) || [];
    assert.equal(activeExportCalls.length, 2, 'download + merge flow should both use preview export');
  });

  it('exports from an unscaled native A4 preview clone', () => {
    assert.match(source, /const clone = previewPage\.cloneNode\(true\);/);
    assert.match(source, /clone\.style\.transform = 'none';/);
    assert.match(source, /clone\.style\.width = '794px';/);
    assert.match(source, /clone\.style\.height = '1123px';/);
    assert.match(source, /html2canvas:\s*\{[\s\S]*width:\s*794,[\s\S]*height:\s*1123,[\s\S]*\}/);
    assert.match(source, /await document\.fonts\.ready/);
  });

  it('retains all five newer themes and applies theme CSS variables through renderPreview', () => {
    ['blue', 'green', 'burgundy', 'dark', 'neutral'].forEach((themeKey) => {
      assert.match(source, new RegExp(`${themeKey}:\\s*\\{`));
    });

    [
      '--cov-primary',
      '--cov-secondary',
      '--cov-soft',
      '--cov-border',
      '--cov-text',
      '--cov-accent',
      '--cov-badge'
    ].forEach((cssVar) => {
      assert.match(source, new RegExp(`previewPage\\.style\\.setProperty\\('${cssVar}'`));
    });
  });
});

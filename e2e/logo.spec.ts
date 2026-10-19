// Logo SVG proti webu EstatIQ: text se stylem `.splash-logo` (Space Grotesk 700, letter-spacing
// −0,02em) vykreslený prohlížečem vs. obrysy z scripts/make-logo.ts. Snímek: test-results/logo-compare.png.
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { logo } from '../src/design/primitives/logo.generated';

const font = readFileSync(
  'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff',
).toString('base64');

test('logo SVG odpovídá textu z webu', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.setContent('<body style="margin:0;background:#0b0f19"></body>');
  const result = await page.evaluate(
    async ({ font, d, size }) => {
      const face = new FontFace('SG', `url(data:font/woff;base64,${font})`, { weight: '700' });
      document.fonts.add(await face.load());

      const S = 300;
      const [W, H, X, Y] = [1300, 260, 40, 220];
      const make = () => {
        const c = document.createElement('canvas');
        c.width = W;
        c.height = H;
        document.body.append(c);
        return c.getContext('2d', { willReadFrequently: true })!;
      };

      const web = make();
      web.font = `700 ${S}px SG`;
      web.letterSpacing = '-0.02em';
      web.fillStyle = '#f8fafc';
      web.fillText('EstatIQ', X, Y);

      const svg = make();
      svg.translate(X, Y);
      svg.scale(S / size, S / size);
      svg.fillStyle = '#34d399';
      svg.fill(new Path2D(d));

      const diff = make();
      const a = web.getImageData(0, 0, W, H).data;
      const b = svg.getImageData(0, 0, W, H).data;
      const out = diff.createImageData(W, H);
      let union = 0;
      let xor = 0;
      for (let i = 3; i < a.length; i += 4) {
        const pa = a[i]! > 127;
        const pb = b[i]! > 127;
        if (pa || pb) union++;
        if (pa !== pb) {
          xor++;
          out.data.set([229, 72, 77, 255], i - 3);
        } else if (pa) out.data.set([60, 70, 90, 255], i - 3);
      }
      diff.putImageData(out, 0, 0);
      return { union, xor };
    },
    { font, d: logo.estat + logo.iq, size: logo.size },
  );

  await page.screenshot({ path: 'test-results/logo-compare.png', fullPage: true });
  const mismatch = result.xor / result.union;
  console.log(`logo: rozdíl ${(mismatch * 100).toFixed(2)} % pixelů`);
  expect(result.union).toBeGreaterThan(10_000);
  expect(mismatch).toBeLessThan(0.02);
});

import { mkdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { allSlides } from '../src/deck.config';
import { chromiumPath } from './chromium';

const html = pathToFileURL(resolve('dist/index.html')).href;
const output = resolve('export');
const allPageCount = allSlides.reduce((total, slide) => total + slide.steps + 1, 0);
const finalPageCount = allSlides.length;

async function verifyPdf(path: string, expectedPages: number) {
  const pdf = (await readFile(path)).toString('latin1');
  const pages = pdf.match(/\/Type\s*\/Page\b/g)?.length ?? 0;
  const mediaBoxes = pdf.match(/\/MediaBox\s*\[0 0 1440 810\]/g)?.length ?? 0;
  if (pages !== expectedPages || mediaBoxes !== expectedPages) {
    throw new Error(
      `${path}: čekám ${expectedPages} stran 1920×1080, PDF obsahuje ${pages} stran a ${mediaBoxes} správných rozměrů.`,
    );
  }
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: chromiumPath() });
try {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await context.setOffline(true);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${html}?print`);
  await page.evaluate(() => document.fonts.ready);
  const printPages = page.locator('[data-print-page]');
  const foundPages = await printPages.count();
  if (foundPages !== allPageCount)
    throw new Error(`?print: čekám ${allPageCount} stran, našel jsem ${foundPages}`);
  const fontsReady = await page.evaluate(
    () =>
      document.fonts.check('400 28px "Space Grotesk"', 'Příliš žluťoučký kůň') &&
      document.fonts.check('400 28px "JetBrains Mono"', 'Žluťoučký příliš'),
  );
  if (!fontsReady)
    throw new Error('Písmo Space Grotesk nebo JetBrains Mono s českou diakritikou není připravené.');

  // Projdi všechny stavy v DOM, aby export nezachytil chybějící finální vykreslení.
  for (let index = 0; index < foundPages; index++) {
    const current = printPages.nth(index);
    await current.evaluate((element) => element.getBoundingClientRect().height);
  }
  await page.pdf({
    path: resolve(output, 'pitch.pdf'),
    printBackground: true,
    preferCSSPageSize: true,
    width: '1920px',
    height: '1080px',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await verifyPdf(resolve(output, 'pitch.pdf'), allPageCount);

  await page.goto(`${html}?print&final`);
  await page.evaluate(() => document.fonts.ready);
  const finalPages = await page.locator('[data-print-page]').count();
  if (finalPages !== finalPageCount)
    throw new Error(`?print&final: čekám ${finalPageCount} stran, našel jsem ${finalPages}`);
  await page.pdf({
    path: resolve(output, 'pitch-final.pdf'),
    printBackground: true,
    preferCSSPageSize: true,
    width: '1920px',
    height: '1080px',
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await verifyPdf(resolve(output, 'pitch-final.pdf'), finalPageCount);
  if (errors.length) throw new Error(`Chyby v konzoli:\n${errors.join('\n')}`);
  const fullSize = (await stat(resolve(output, 'pitch.pdf'))).size;
  const finalSize = (await stat(resolve(output, 'pitch-final.pdf'))).size;
  console.log(
    `PDF OK: ${foundPages} stran (${(fullSize / 1024 / 1024).toFixed(2)} MB), ${finalPages} finálních (${(finalSize / 1024 / 1024).toFixed(2)} MB).`,
  );
} finally {
  await browser.close();
}

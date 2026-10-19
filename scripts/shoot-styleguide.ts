// Nafotí styleguide (každou desku v klidu i ve stavu „mezera“) do test-results/styleguide/.
// Spouští vlastní Vite dev server, síť nepotřebuje.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import config from '../playwright.config';

const OUT = 'test-results/styleguide';
const BOARDS = 4;

mkdirSync(OUT, { recursive: true });
const server = await createServer({ server: { port: 0 }, logLevel: 'error' });
await server.listen();
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error('Vite nemá URL');

const browser = await chromium.launch(config.use?.launchOptions);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(`${url}#/styleguide`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
for (let b = 1; b <= BOARDS; b++) {
  await page.screenshot({ path: `${OUT}/${b}-klid.png` });
  await page.keyboard.press(' ');
  await page.waitForTimeout(2800);
  await page.screenshot({ path: `${OUT}/${b}-stav.png` });
  await page.keyboard.press(' ');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(600);
}

await browser.close();
await server.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`styleguide: ${BOARDS * 2} snímků v ${OUT}/`);

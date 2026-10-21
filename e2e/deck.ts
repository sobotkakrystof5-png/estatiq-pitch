// Společné pomůcky pro e2e nad buildem z `dist/` přes file://, bez sítě a serveru.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { expect, type Page } from '@playwright/test';

export const url = pathToFileURL(resolve('dist/index.html')).href;

/** Hlavní slajdy a počet kroků podle BRIEF §6. */
export const MAIN = [
  ['s1', 2],
  ['s2', 1],
  ['s3', 6],
  ['s4', 5],
  ['s5', 4],
  ['s6', 3],
  ['s8', 4],
  ['s9', 2],
] as const;

export const positions = MAIN.flatMap(([id, steps], s) =>
  Array.from({ length: steps + 1 }, (_, step) => ({ id, step, hash: `#/${s + 1}/${step}` })),
);

/** Chyby a varování z konzole od posledního `open`. */
export const errors: string[] = [];

export async function open(page: Page, hash = '') {
  errors.length = 0;
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url + hash);
  await expect(page.locator('[data-slide]')).toHaveCount(1);
}

export const hash = (page: Page) => page.evaluate(() => location.hash);

/** Nejnovější (horní) slajd. */
export const top = (page: Page) => page.locator('[data-slide]').last();

export async function expectAt(page: Page, id: string, step: number) {
  await expect(top(page)).toHaveAttribute('data-slide', id);
  await expect(top(page)).toHaveAttribute('data-step', String(step));
}

export async function press(page: Page, key: string, times = 1, gapMs = 0) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    if (gapMs) await page.waitForTimeout(gapMs);
  }
}

export const opacity = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));

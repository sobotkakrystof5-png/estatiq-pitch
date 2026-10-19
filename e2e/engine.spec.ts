// Engine (fáze 2) nad buildem z `dist/` přes file://, bez sítě a serveru.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const url = pathToFileURL(resolve('dist/index.html')).href;

// Dummy deck: D1 (0 kroků), D2 (4), D3 (2), záložní Z1–Z7.
const MAIN = [
  ['D1', 0],
  ['D2', 4],
  ['D3', 2],
] as const;
const positions = MAIN.flatMap(([label, steps], s) =>
  Array.from({ length: steps + 1 }, (_, step) => ({
    hash: `#/${s + 1}/${step}`,
    text: `${label} · ${step}/${steps}`,
  })),
);

const errors: string[] = [];

async function open(page: Page, hash = '') {
  errors.length = 0;
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url + hash);
  await expect(page.locator('[data-slide]')).toHaveCount(1);
}

const hash = (page: Page) => page.evaluate(() => location.hash);
const visible = (page: Page) => page.locator('[data-slide]').last().getByTestId('dummy');

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('projde všechny kroky tam i zpět', async ({ page }) => {
  await open(page);
  for (const [i, p] of positions.entries()) {
    if (i > 0) await page.keyboard.press('ArrowRight');
    await expect(visible(page)).toHaveText(p.text);
    expect(await hash(page)).toBe(p.hash);
    await page.waitForTimeout(450);
  }
  await page.keyboard.press('ArrowRight');
  expect(await hash(page)).toBe('#/3/2');
  for (const p of [...positions].reverse().slice(1)) {
    await page.keyboard.press('ArrowLeft');
    await expect(visible(page)).toHaveText(p.text);
    expect(await hash(page)).toBe(p.hash);
    await page.waitForTimeout(450);
  }
});

test('rychlé klikání a držení šipky: stav odpovídá počtu stisků', async ({ page }) => {
  await open(page);
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await expect(visible(page)).toHaveText('D2 · 4/4');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
  await expect(visible(page)).toHaveText('D2 · 1/4');
  // Držení: opakované keydown s repeat=true.
  for (let i = 0; i < 4; i++) await page.keyboard.down('ArrowRight');
  await page.keyboard.up('ArrowRight');
  await expect(visible(page)).toHaveText('D3 · 0/2');
  expect(await hash(page)).toBe('#/3/0');
  for (let i = 0; i < 30; i++) await page.keyboard.press('ArrowRight');
  expect(await hash(page)).toBe('#/3/2');
  await expect(page.locator('[data-slide]')).toHaveCount(1);
});

async function settledWithin(page: Page, ms: number) {
  await page.waitForTimeout(ms);
  return page.evaluate(() => {
    const slides = [...document.querySelectorAll<HTMLElement>('[data-slide]')];
    const top = slides.at(-1)!;
    return {
      count: slides.length,
      opacity: getComputedStyle(top).opacity,
      steps: [...top.querySelectorAll<HTMLElement>('[data-testid=dummy-step]')].map(
        (el) => getComputedStyle(el).opacity,
      ),
    };
  });
}

test('jeden klik se normálně animuje (≤ 400 ms)', async ({ page }) => {
  await open(page);
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  const mid = await settledWithin(page, 100);
  expect(mid.count).toBe(2);
  expect(Number(mid.opacity)).toBeLessThan(1);
  const end = await settledWithin(page, 450);
  expect(end).toMatchObject({ count: 1, opacity: '1' });
});

test('klik uprostřed přechodu okamžitě ukáže cílový stav', async ({ page }) => {
  await open(page);
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowRight');
  const s = await settledWithin(page, 50);
  expect(s).toEqual({ count: 1, opacity: '1', steps: ['1', '0.15', '0.15', '0.15'] });
  await expect(visible(page)).toHaveText('D2 · 1/4');
});

test('klik po 350 ms: rozběhnutý přechod se dokončí okamžitě', async ({ page }) => {
  await open(page);
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  await page.keyboard.press('ArrowRight');
  const s = await settledWithin(page, 30);
  expect(s.count).toBe(1);
  expect(s.opacity).toBe('1');
});

test('obnovení na #/2/3 ukáže přesně tento krok', async ({ page }) => {
  await open(page, '#/2/3');
  await expect(visible(page)).toHaveText('D2 · 3/4');
  await page.reload();
  await expect(visible(page)).toHaveText('D2 · 3/4');
  expect(await hash(page)).toBe('#/2/3');
});

test('D ukáže kódy kláves', async ({ page }) => {
  await open(page);
  await page.keyboard.press('d');
  await expect(page.getByTestId('debug')).toBeVisible();
  await page.keyboard.press('PageDown');
  await page.keyboard.press('.');
  const keys = page.getByTestId('debug-keys');
  await expect(keys).toContainText('PageDown');
  await expect(keys).toContainText('Period');
  await page.keyboard.press('d');
  await expect(page.getByTestId('debug')).toHaveCount(0);
});

test('nouzový skok, Home/End a číslo + Enter', async ({ page }) => {
  await open(page, '#/2/2');
  await page.keyboard.press('b');
  expect(await hash(page)).toBe('#/3/0');
  await page.keyboard.press('Home');
  expect(await hash(page)).toBe('#/1/0');
  await page.keyboard.press('.');
  expect(await hash(page)).toBe('#/3/0');
  await page.keyboard.press('2');
  await page.keyboard.press('Enter');
  expect(await hash(page)).toBe('#/2/0');
  await page.keyboard.press('End');
  expect(await hash(page)).toBe('#/3/0');
});

test('přehled záložních slajdů a návrat Esc', async ({ page }) => {
  await open(page, '#/2/3');
  await page.keyboard.press('z');
  await expect(page.getByTestId('overview')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overview')).toHaveCount(0);
  expect(await hash(page)).toBe('#/2/3');

  await page.keyboard.press('z');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-selected=true]')).toContainText('Z6');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('overview')).toHaveCount(0);
  expect(await hash(page)).toBe('#/z3/0');
  await expect(visible(page)).toHaveText('Z3 · 0/0');
  await page.keyboard.press('Escape');
  expect(await hash(page)).toBe('#/2/3');
});

test('plátno se škáluje a letterbox má barvu slajdu', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 1000 });
  await open(page, '#/2/0');
  const box = await page.getByTestId('stage').boundingBox();
  expect(box?.width).toBeCloseTo(1000, 0);
  expect(box?.height).toBeCloseTo(562.5, 0);
  const [outer, slide] = await page.evaluate(() => [
    getComputedStyle(document.querySelector('[data-testid=stage]')!.parentElement!).backgroundColor,
    getComputedStyle(document.querySelector('[data-slide]')!).backgroundColor,
  ]);
  expect(outer).toBe(slide);
});

// Engine nad skutečným deckem. Mechaniku přechodů hlídá i při procházení realizovaných slajdů.
import { expect, test, type Page } from '@playwright/test';
import { errors, expectAt, hash, open, positions, top } from './deck';

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('projde všechny kroky tam i zpět', async ({ page }) => {
  test.setTimeout(60_000);
  await open(page);
  for (const [i, p] of positions.entries()) {
    if (i > 0) await page.keyboard.press('ArrowRight');
    await expectAt(page, p.id, p.step);
    expect(await hash(page)).toBe(p.hash);
    await page.waitForTimeout(450);
  }
  await page.keyboard.press('ArrowRight');
  expect(await hash(page)).toBe(positions.at(-1)!.hash);
  for (const p of [...positions].reverse().slice(1)) {
    await page.keyboard.press('ArrowLeft');
    await expectAt(page, p.id, p.step);
    expect(await hash(page)).toBe(p.hash);
    await page.waitForTimeout(450);
  }
});

test('rychlé klikání a držení šipky: stav odpovídá počtu stisků', async ({ page }) => {
  await open(page);
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await expectAt(page, positions[5]!.id, positions[5]!.step);
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
  await expectAt(page, positions[2]!.id, positions[2]!.step);
  // Držení: opakované keydown s repeat=true.
  for (let i = 0; i < 4; i++) await page.keyboard.down('ArrowRight');
  await page.keyboard.up('ArrowRight');
  await expectAt(page, positions[6]!.id, positions[6]!.step);
  expect(await hash(page)).toBe(positions[6]!.hash);
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowRight');
  expect(await hash(page)).toBe(positions.at(-1)!.hash);
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
  await open(page, '#/3/5');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  const mid = await settledWithin(page, 100);
  expect(mid.count).toBe(2);
  expect(Number(mid.opacity)).toBeLessThan(1);
  const end = await settledWithin(page, 450);
  expect(end).toMatchObject({ count: 1, opacity: '1' });
});

test('klik uprostřed přechodu okamžitě ukáže cílový stav', async ({ page }) => {
  await open(page, '#/4/3');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowRight');
  const s = await settledWithin(page, 50);
  expect(s).toEqual({ count: 1, opacity: '1', steps: [] });
  await expectAt(page, 's5', 1);
  await expect(top(page).getByTestId('s5-volume')).toBeVisible();
});

test('klik po 350 ms: rozběhnutý přechod se dokončí okamžitě', async ({ page }) => {
  await open(page, '#/4/3');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  await page.keyboard.press('ArrowRight');
  const s = await settledWithin(page, 30);
  expect(s.count).toBe(1);
  expect(s.opacity).toBe('1');
  await expectAt(page, 's5', 1);
});

test('obnovení na #/5/3 ukáže přesně tento krok', async ({ page }) => {
  await open(page, '#/5/3');
  await expectAt(page, 's5', 3);
  await expect(top(page).getByTestId('s5-b2c-fee')).toBeVisible();
  await page.reload();
  await expectAt(page, 's5', 3);
  expect(await hash(page)).toBe('#/5/3');
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
  await open(page, '#/2/1');
  await page.keyboard.press('b');
  expect(await hash(page)).toBe('#/8/0');
  await page.keyboard.press('Home');
  expect(await hash(page)).toBe('#/1/0');
  await page.keyboard.press('.');
  expect(await hash(page)).toBe('#/8/0');
  await page.keyboard.press('2');
  await page.keyboard.press('Enter');
  expect(await hash(page)).toBe('#/2/0');
  await page.keyboard.press('End');
  expect(await hash(page)).toBe('#/8/0');
});

test('přehled záložních slajdů a návrat Esc', async ({ page }) => {
  await open(page, '#/5/3');
  await page.keyboard.press('z');
  await expect(page.getByTestId('overview')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('overview')).toHaveCount(0);
  expect(await hash(page)).toBe('#/5/3');

  await page.keyboard.press('z');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-selected=true]')).toContainText('Z6');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('overview')).toHaveCount(0);
  expect(await hash(page)).toBe('#/z3/0');
  await expect(top(page).getByTestId('z3-positioning')).toContainText('Evidence');
  await expect(top(page).getByTestId('z3-positioning')).toContainText('Vrstva');
  await page.keyboard.press('Escape');
  expect(await hash(page)).toBe('#/5/3');
});

test('S6 → S7 je okamžitý střih do černé', async ({ page }) => {
  await open(page, '#/6/3');
  await page.waitForTimeout(450);
  await page.keyboard.press('ArrowRight');
  await expectAt(page, 's7', 0);
  await expect(top(page).getByTestId('s7-scene')).toBeVisible();
  const opacity = await top(page).evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
});

test('S7 tok běží přes strokeDashoffset a S8 rozpuštění neblokuje zpětný krok', async ({
  page,
}) => {
  await open(page, '#/7/4');
  await page.waitForTimeout(900);
  const flows = top(page).locator('svg path.stroke-mint');
  await expect(flows).toHaveCount(3);
  const tracks = top(page).locator('svg path.stroke-fg');
  await expect(tracks).toHaveCount(3);
  const trackStyle = await tracks.first().evaluate((path) => ({
    stroke: getComputedStyle(path).stroke,
    opacity: getComputedStyle(path).opacity,
  }));
  expect(trackStyle.stroke).toBe('rgb(248, 250, 252)');
  expect(Number(trackStyle.opacity)).toBeCloseTo(0.18, 2);
  const before = await flows.evaluateAll((paths) =>
    paths.map((path) => getComputedStyle(path).strokeDashoffset),
  );
  await page.waitForTimeout(220);
  const after = await flows.evaluateAll((paths) =>
    paths.map((path) => getComputedStyle(path).strokeDashoffset),
  );
  expect(after).not.toEqual(before);

  await open(page, '#/8/2');
  await page.waitForTimeout(900);
  await page.keyboard.press('ArrowRight');
  await expectAt(page, 's8', 3);
  const strip = top(page).getByTestId('s8-closing-strip');
  await expect(strip).toBeVisible();
  const full = await strip.evaluate((el) => getComputedStyle(el).clipPath);
  await page.waitForTimeout(180);
  const dissolving = await strip.evaluate((el) => getComputedStyle(el).clipPath);
  expect(dissolving).not.toBe(full);
  await page.keyboard.press('ArrowLeft');
  await expectAt(page, 's8', 2);
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

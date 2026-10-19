// 1. dějství (S1–S3): rytmus, rychlé klikání, zpětné kroky, instant a plynulost S2.
import { expect, test, type Page } from '@playwright/test';
import { errors, expectAt, open, opacity, positions, press, top } from './deck';

const ACT1 = positions.filter((p) => ['s1', 's2', 's3'].includes(p.id));
const last = ACT1.at(-1)!;

/** Transformace prvků jako [x, y, scale] z computed matrix. */
const transforms = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((els) =>
    els.map((el) => {
      const m = new DOMMatrix(getComputedStyle(el).transform);
      return [Math.round(m.e), Math.round(m.f), Math.round(m.a * 100) / 100];
    }),
  );

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('průchod v rytmu poznámek: každý klik se projeví hned, tam i zpět', async ({ page }) => {
  await open(page);
  for (const [i, p] of ACT1.entries()) {
    if (i > 0) await page.keyboard.press('ArrowRight');
    await expectAt(page, p.id, p.step);
    await page.waitForTimeout(700);
  }
  expect(await opacity(page, '[data-testid=reveal-logo]')).toEqual([1]);
  for (const p of [...ACT1].reverse().slice(1)) {
    await page.keyboard.press('ArrowLeft');
    await expectAt(page, p.id, p.step);
    await page.waitForTimeout(700);
  }
});

test('10 kliků za sekundu skončí ve správném stavu bez artefaktů', async ({ page }) => {
  await open(page);
  await page.waitForTimeout(600);
  await press(page, 'ArrowRight', ACT1.length - 1, 100);
  await page.waitForTimeout(900);
  await expect(page.locator('[data-slide]')).toHaveCount(1);
  await expectAt(page, last.id, last.step);
  expect(await opacity(page, '[data-testid=reveal-logo]')).toEqual([1]);
  // Slova jsou slitá v logu, papír z rozpadu po sobě nic nenechal.
  expect(await opacity(page, '[data-testid=reveal-word] > div')).toEqual([0, 0, 0]);
  await expect(page.getByTestId('reveal-ghost')).toHaveCount(0);

  await press(page, 'ArrowLeft', ACT1.length - 1, 100);
  await page.waitForTimeout(900);
  await expect(page.locator('[data-slide]')).toHaveCount(1);
  await expectAt(page, 's1', 0);
  expect(await page.getByTestId('s1-bridge').evaluate((el) => getComputedStyle(el).clipPath)).toBe(
    'inset(100% 0% 0%)', // Chrome zkracuje zápis inset()
  );
});

test('S2 → S3: rozpad doběhne do 600 ms a slova stojí v cíli', async ({ page }) => {
  await open(page, '#/2/1');
  await page.waitForTimeout(1200);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(650);
  const ghost = page.getByTestId('reveal-ghost');
  expect(await ghost.evaluate((el) => getComputedStyle(el).clipPath)).toBe('inset(50% 0%)');
  expect(await opacity(page, '[data-testid=reveal-word]')).toEqual([1, 1, 1]);
  expect(await transforms(page, '[data-testid=reveal-word]')).toEqual([
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ]);
});

test('S3 → S2 obnoví chaos v zastaveném stavu a krok zpět ho rozběhne', async ({ page }) => {
  await open(page, '#/3/0');
  await page.waitForTimeout(800);
  await page.keyboard.press('ArrowLeft');
  await expectAt(page, 's2', 1);
  await page.waitForTimeout(500);
  const chaos = top(page);
  expect(await opacity(page, '[data-slide=s2] [data-testid=chaos-hush]')).toEqual([0.62]);
  expect(await chaos.locator('[data-build=fly]').count()).toBe(8);
  expect(await transforms(page, '[data-slide=s2] [data-build=fly]')).toEqual(
    Array.from({ length: 8 }, () => [0, 0, 1]),
  );
  await expect(chaos.locator('.text-number')).toHaveText('300');

  await page.keyboard.press('ArrowLeft');
  await expectAt(page, 's2', 0);
  await page.waitForTimeout(1000);
  expect(await opacity(page, '[data-slide=s2] [data-testid=chaos-hush]')).toEqual([0]);
});

test('instant: skok číslem na S3 ukáže hotová slova bez rozpadu', async ({ page }) => {
  await open(page);
  await page.keyboard.press('3');
  await page.keyboard.press('Enter');
  await expectAt(page, 's3', 0);
  await page.waitForTimeout(80);
  await expect(page.getByTestId('reveal-ghost')).toHaveCount(0);
  expect(await opacity(page, '[data-testid=reveal-word]')).toEqual([1, 1, 1]);
});

test('S2 při CPU throttlingu 4×: snímky timeline', async ({ page }, info) => {
  const cdp = await page.context().newCDPSession(page);
  await open(page, '#/1/2');
  await page.waitForTimeout(800);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => {
    const w = window as unknown as { frames_: number[] };
    w.frames_ = [];
    let prev = performance.now();
    const tick = (t: number) => {
      w.frames_.push(t - prev);
      prev = t;
      if (w.frames_.length < 400) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(3200);
  const frames = await page.evaluate(() =>
    (window as unknown as { frames_: number[] }).frames_.slice(1),
  );
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const sorted = [...frames].sort((a, b) => a - b);
  const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
  const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
  const long = frames.filter((f) => f > 25).length;
  const result = `snímků ${frames.length}, průměr ${(1000 / avg).toFixed(1)} fps, p95 ${p95.toFixed(1)} ms, nad 25 ms: ${long}`;
  info.annotations.push({ type: 'fps', description: result });
  console.log(`S2 throttling 4×: ${result}`);
  expect(1000 / avg).toBeGreaterThan(50);
});

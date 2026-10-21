import { expect, test } from '@playwright/test';
import { errors, open, url } from './deck';

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('single-file deck projde offline všemi hlavními i záložními kroky', async ({ page }) => {
  test.setTimeout(60_000);
  await page.context().setOffline(true);
  await open(page);

  const mainIds = ['s1', 's2', 's3', 's4', 's5', 's6', 's8', 's9'];
  const steps = [2, 1, 5, 6, 4, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let slide = 0; slide < steps.length; slide++) {
    const id = slide < mainIds.length ? `${slide + 1}` : `z${slide - mainIds.length + 1}`;
    for (let step = 0; step <= steps[slide]!; step++) {
      const hash = `#/${id}/${step}`;
      await page.evaluate((nextHash) => {
        window.location.hash = nextHash;
      }, hash);
      await expect(page.locator('[data-slide]').last()).toHaveAttribute(
        'data-slide',
        slide < mainIds.length ? mainIds[slide]! : id,
      );
      await expect(page.locator('[data-slide]').last()).toHaveAttribute('data-step', String(step));
    }
  }
});

test('okno přednášejícího se z file:// synchronizuje v obou směrech', async ({ page }) => {
  await page.context().setOffline(true);
  await open(page, '#/1/0');
  const popupPromise = page.waitForEvent('popup');
  await page.keyboard.press('p');
  const presenter = await popupPromise;
  presenter.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  presenter.on('pageerror', (error) => errors.push(error.message));

  await expect(presenter.getByTestId('presenter-current')).toHaveAttribute(
    'data-presenter-slide',
    's1',
  );
  await expect(presenter.getByTestId('presenter-current')).toHaveAttribute(
    'data-presenter-step',
    '0',
  );

  await presenter.getByRole('button', { name: 'Další krok' }).click();
  await expect(page).toHaveURL(/#\/1\/1$/);
  await expect(presenter.getByTestId('presenter-current')).toHaveAttribute(
    'data-presenter-step',
    '1',
  );

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#\/1\/2$/);
  await expect(presenter.getByTestId('presenter-current')).toHaveAttribute(
    'data-presenter-step',
    '2',
  );
  await expect(presenter.getByTestId('presenter-timer')).not.toHaveText('PŘIPRAVENO');

  await presenter.keyboard.press('t');
  await expect(presenter.getByTestId('presenter-timer')).toContainText('−3:55');
  await presenter.close();
});

test('tiskový pohled vykreslí všechny kroky bez animací', async ({ page }) => {
  await page.context().setOffline(true);
  await page.goto(`${url}?print`);
  await expect(page.locator('[data-print-page]')).toHaveCount(47);
  await expect(page.locator('[data-print-page]').first()).toHaveAttribute('data-step', '0');
  await expect(page.locator('[data-print-page]').last()).toHaveAttribute('data-slide', 'z7');
});

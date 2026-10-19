// `steps` a `budgetSec` jsou v obsahu i v deck.config.ts (otevřená otázka v memory.md).
// Dokud se nerozhodne, hlídá tenhle test, že se nerozejdou.
import { describe, expect, it } from 'vitest';
import { mainSlides } from '../deck.config';
import { slides } from './slides';

describe('obsah a deck.config', () => {
  it.each(slides.map((s) => [s.id, s] as const))('%s: kroky a rozpočet sedí', (id, s) => {
    const def = mainSlides.find((d) => d.id === id);
    expect(def).toBeDefined();
    expect({ steps: def!.steps, budgetSec: def!.budgetSec }).toEqual({
      steps: s.steps,
      budgetSec: s.budgetSec,
    });
  });
});

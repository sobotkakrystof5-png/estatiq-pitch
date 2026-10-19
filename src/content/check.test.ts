import { describe, expect, it } from 'vitest';
import { checkSlides, checkText, countWords, isExempt } from './check';
import type { SlideContent } from './slides';

const NB = ' ';
const slide = (id: string, screen: SlideContent['screen'], notes = ''): SlideContent => ({
  id,
  title: id,
  budgetSec: 0,
  steps: 0,
  screen,
  notes,
});

describe('checkText', () => {
  it('počítá slova bez interpunkce', () => {
    expect(countWords('15 let · student · zakladatel')).toBe(4);
    expect(countWords('Tři nástroje. Jedna obrazovka.')).toBe(4);
  });

  it('hlídá limit 5 slov', () => {
    expect(checkText('jedna dva tři čtyři pět šest', true)).toEqual(['6 slov (max 5)']);
    expect(checkText('jedna dva tři čtyři pět šest', false)).toEqual([]);
  });

  it('česká typografie', () => {
    expect(checkText(`4${NB}990${NB}Kč`, true)).toEqual([]);
    expect(checkText('4 990 Kč', true)).toHaveLength(2);
    expect(checkText(`0,1${NB}%`, true)).toEqual([]);
    expect(checkText('0,1 %', true)).toHaveLength(1);
    expect(checkText('v Ostravě', true)).toHaveLength(1);
    expect(checkText(`v${NB}Ostravě`, true)).toEqual([]);
  });

  it('zakáže znaky, které písmo nemá', () => {
    expect(checkText('Česko → Slovensko', true)).toHaveLength(1);
    expect(checkText(`5,0${NB}★`, true)).toHaveLength(1);
  });
});

describe('checkSlides', () => {
  const slides = [
    slide('s1', { name: 'Kryštof Sobotka · student · zakladatel EstatIQ Ostrava' }),
    slide('s3', { tag: '[doplnit: tag]' }, 'Banka. [klik]'),
    slide('z4', { line: 'systém, transakce, investor, tržiště, energie, služby' }),
  ];

  it('výjimky z limitu slov podle configu', () => {
    expect(isExempt('z4', ['s1', 'z*'])).toBe(true);
    expect(isExempt('s2', ['s1', 'z*'])).toBe(false);
    const r = checkSlides(slides, { release: false, wordLimitExempt: ['s1', 'z*'] });
    expect(r.errors).toEqual([]);
    const strict = checkSlides(slides, { release: false, wordLimitExempt: [] });
    expect(strict.errors).toHaveLength(2);
  });

  it('placeholder je varování, v release chyba', () => {
    const dev = checkSlides(slides, { release: false, wordLimitExempt: ['s1', 'z*'] });
    expect(dev.warnings).toEqual(['s3.tag: zůstal placeholder']);
    const rel = checkSlides(slides, { release: true, wordLimitExempt: ['s1', 'z*'] });
    expect(rel.errors).toEqual(['s3.tag: zůstal placeholder']);
  });
});

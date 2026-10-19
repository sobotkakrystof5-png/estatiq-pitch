import { describe, expect, it } from 'vitest';
import { initialState, reduce, type DeckAction } from './reducer';
import { formatHash, parseHash } from './hash';
import type { DeckShape, DeckState } from './types';

// 3 hlavní slajdy (0, 4 a 2 kroky) a 2 záložní (1 a 0 kroků).
const shape: DeckShape = { steps: [0, 4, 2, 1, 0], mainCount: 3 };
const run = (state: DeckState, ...actions: DeckAction[]) =>
  actions.reduce((s, a) => reduce(shape, s, a), state);
const at = (slide: number, step = 0) => initialState(shape, { slide, step });
const pos = (s: DeckState) => [s.slide, s.step];
const next = { type: 'next' } as const;
const prev = { type: 'prev' } as const;

describe('reducer', () => {
  it('next projde všechny kroky v pořadí', () => {
    const seen: number[][] = [];
    let s = at(0);
    for (let i = 0; i < 8; i++) {
      seen.push(pos(s));
      s = reduce(shape, s, next);
    }
    expect(seen).toEqual([
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 0],
      [2, 1],
    ]);
  });

  it('prev ze kroku 0 skočí na poslední krok předchozího slajdu', () => {
    expect(pos(run(at(2, 0), prev))).toEqual([1, 4]);
    expect(pos(run(at(1, 0), prev))).toEqual([0, 0]);
  });

  it('hranice: na začátku a na konci hlavní sekce se nic nestane', () => {
    const first = at(0);
    expect(reduce(shape, first, prev)).toBe(first);
    const last = at(2, 2);
    expect(reduce(shape, last, next)).toBe(last);
  });

  it('next/prev nepřechází mezi hlavními a záložními slajdy', () => {
    expect(pos(run(at(3, 1), next))).toEqual([4, 0]);
    expect(pos(run(at(4, 0), next))).toEqual([4, 0]);
    expect(pos(run(at(3, 0), prev))).toEqual([3, 0]);
  });

  it('tam a zpět vrátí stejný stav', () => {
    const forward = Array<DeckAction>(9).fill(next);
    const back = Array<DeckAction>(9).fill(prev);
    expect(pos(run(at(0), ...forward))).toEqual([2, 2]);
    expect(pos(run(at(0), ...forward, ...back))).toEqual([0, 0]);
  });

  it('goto ořízne neplatné hodnoty a nastaví směr', () => {
    expect(pos(run(at(0), { type: 'goto', slide: 1, step: 99 }))).toEqual([1, 4]);
    expect(pos(run(at(0), { type: 'goto', slide: -5 }))).toEqual([0, 0]);
    expect(pos(run(at(0), { type: 'goto', slide: 42 }))).toEqual([4, 0]);
    expect(run(at(2), { type: 'goto', slide: 1 }).direction).toBe(-1);
    expect(run(at(0), { type: 'goto', slide: 1 }).direction).toBe(1);
  });

  it('jumpToFinal skočí na poslední hlavní slajd i ze záložního', () => {
    expect(pos(run(at(1, 3), { type: 'jumpToFinal' }))).toEqual([2, 0]);
    expect(pos(run(at(4), { type: 'jumpToFinal' }))).toEqual([2, 0]);
  });

  it('setMode mění jen režim', () => {
    const s = run(at(1, 2), { type: 'setMode', mode: 'instant' });
    expect(s.mode).toBe('instant');
    expect(pos(s)).toEqual([1, 2]);
  });
});

describe('hash', () => {
  it('formát a zpětné čtení', () => {
    expect(formatHash(shape, { slide: 1, step: 3 })).toBe('#/2/3');
    expect(formatHash(shape, { slide: 3, step: 1 })).toBe('#/z1/1');
    expect(parseHash(shape, '#/2/3')).toEqual({ slide: 1, step: 3 });
    expect(parseHash(shape, '#/z2')).toEqual({ slide: 4, step: 0 });
  });

  it('neplatný hash se ořízne nebo ignoruje', () => {
    expect(parseHash(shape, '#/9/9')).toEqual({ slide: 2, step: 2 });
    expect(parseHash(shape, '#/0/0')).toEqual({ slide: 0, step: 0 });
    expect(parseHash(shape, '#/z9/0')).toEqual({ slide: 4, step: 0 });
    expect(parseHash(shape, '')).toBeNull();
    expect(parseHash(shape, '#/abc')).toBeNull();
  });
});

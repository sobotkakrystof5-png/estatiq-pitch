import type { DeckMode, DeckShape, DeckState, Direction, Position } from './types';

export type DeckAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; slide: number; step?: number }
  | { type: 'jumpToFinal' }
  | { type: 'setMode'; mode: DeckMode };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Hlavní a záložní slajdy jsou oddělené sekce: next/prev mezi nimi nepřechází. */
function sectionOf(shape: DeckShape, slide: number): [number, number] {
  return slide < shape.mainCount
    ? [0, shape.mainCount - 1]
    : [shape.mainCount, shape.steps.length - 1];
}

const lastStep = (shape: DeckShape, slide: number) => shape.steps[slide] ?? 0;

function move(state: DeckState, to: Position, direction: Direction): DeckState {
  if (to.slide === state.slide && to.step === state.step) return state;
  return { ...state, ...to, direction };
}

export function clampPosition(shape: DeckShape, slide: number, step = 0): Position {
  const s = clamp(Math.trunc(slide), 0, shape.steps.length - 1);
  return { slide: s, step: clamp(Math.trunc(step), 0, lastStep(shape, s)) };
}

export function initialState(shape: DeckShape, at: Position = { slide: 0, step: 0 }): DeckState {
  return { ...clampPosition(shape, at.slide, at.step), mode: 'normal', direction: 1 };
}

export function reduce(shape: DeckShape, state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case 'next': {
      if (state.step < lastStep(shape, state.slide))
        return move(state, { slide: state.slide, step: state.step + 1 }, 1);
      const [, end] = sectionOf(shape, state.slide);
      if (state.slide < end) return move(state, { slide: state.slide + 1, step: 0 }, 1);
      return state;
    }
    case 'prev': {
      if (state.step > 0) return move(state, { slide: state.slide, step: state.step - 1 }, -1);
      const [start] = sectionOf(shape, state.slide);
      if (state.slide > start)
        return move(state, { slide: state.slide - 1, step: lastStep(shape, state.slide - 1) }, -1);
      return state;
    }
    case 'goto': {
      const to = clampPosition(shape, action.slide, action.step);
      const forward = to.slide > state.slide || (to.slide === state.slide && to.step >= state.step);
      return move(state, to, forward ? 1 : -1);
    }
    case 'jumpToFinal':
      return move(state, { slide: shape.mainCount - 1, step: 0 }, 1);
    case 'setMode':
      return state.mode === action.mode ? state : { ...state, mode: action.mode };
  }
}

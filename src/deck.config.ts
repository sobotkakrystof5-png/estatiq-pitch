// Pořadí slajdů, kroky, časový rozpočet a mapování kláves.
import type { Command, DeckShape, SlideDef } from './deck/types';
import { makeDummy } from './slides/dev/Dummy';

export const stage = { width: 1920, height: 1080 } as const;

/** Časy ovládání v ms (nejsou to animace, ty jsou v motion/presets.ts). */
export const engine = {
  /** Dva kliky rychleji než toto přepnou `mode: 'instant'`. */
  fastClickMs: 300,
  /** Po tolika ms klidu se `instant` vypne. */
  quietMs: 800,
  cursorIdleMs: 2000,
  /** Jak dlouho čeká rozepsané číslo slajdu na Enter. */
  digitBufferMs: 2000,
  /** Pojistka: prezentace se ukáže, i když se asset nenačte. */
  preloadTimeoutMs: 4000,
  overviewColumns: 4,
} as const;

export const totalBudgetSec = 180;

// Fáze 2: dummy slajdy s 0, 4 a 2 kroky. Pořadí je zvolené tak, aby `#/2/3` byl platný krok.
// Ve fázích 4–6 je nahradí S01–S08 a Z01–Z07.
export const mainSlides: SlideDef[] = [
  { id: 'd1', component: makeDummy('D1', 0), steps: 0, background: 'night', budgetSec: 60 },
  { id: 'd2', component: makeDummy('D2', 4), steps: 4, background: 'paper', budgetSec: 60 },
  { id: 'd3', component: makeDummy('D3', 2), steps: 2, background: 'black', budgetSec: 60 },
];

export const backupSlides: SlideDef[] = Array.from({ length: 7 }, (_, i) => ({
  id: `z${i + 1}`,
  component: makeDummy(`Z${i + 1}`, i % 2),
  steps: i % 2,
  background: 'night',
  budgetSec: 0,
}));

export const allSlides: SlideDef[] = [...mainSlides, ...backupSlides];

export const shape: DeckShape = {
  steps: allSlides.map((s) => s.steps),
  mainCount: mainSlides.length,
};

/** Obrázky, které se načtou před startem. Doplní se se skutečnými assety. */
export const preloadImages: string[] = [];

/**
 * Klávesy podle `KeyboardEvent.key`. Písmena se porovnávají bez ohledu na velikost.
 * Číslo + Enter skočí na slajd (řeší useControls). `B` a `.` posílá prezentér
 * tlačítkem „černá obrazovka“: nouzový skok na poslední slajd.
 * F5 posílají některé prezentéry jako „spustit prezentaci“; zachytí se, aby se stránka neobnovila.
 */
export const keymap: Record<string, Command> = {
  ArrowRight: 'next',
  ArrowDown: 'next',
  ' ': 'next',
  PageDown: 'next',
  Enter: 'next',
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  PageUp: 'prev',
  Home: 'first',
  End: 'last',
  b: 'final',
  '.': 'final',
  z: 'overview',
  Escape: 'back',
  p: 'presenter',
  f: 'fullscreen',
  t: 'timer',
  d: 'debug',
  F5: 'ignore',
};

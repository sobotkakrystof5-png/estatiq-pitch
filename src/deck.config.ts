// Pořadí slajdů, kroky, časový rozpočet a mapování kláves.
import type { Command, DeckShape, SlideDef } from './deck/types';
import { makeDummy } from './slides/dev/Dummy';
import { S01Intro } from './slides/S01Intro';
import { S02Problem } from './slides/S02Problem';
import { S03Reveal } from './slides/S03Reveal';
import { s1, s2, s3 } from './content/slides';
import { chaos, cutInVariants, intro, rozpad, s1Variants } from './motion/presets';

export { stage } from './deck/canvas';

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

// S4–S8 jsou zatím dummy se správným počtem kroků podle BRIEF §6. Nahradí je fáze 5–6.
export const mainSlides: SlideDef[] = [
  {
    id: 's1',
    component: S01Intro,
    steps: s1.steps,
    background: 'night',
    budgetSec: s1.budgetSec,
    variants: s1Variants,
    busyMs: intro.busyMs,
  },
  {
    id: 's2',
    component: S02Problem,
    steps: s2.steps,
    background: 'paper',
    budgetSec: s2.budgetSec,
    variants: cutInVariants,
    busyMs: chaos.total * 1000,
  },
  {
    id: 's3',
    component: S03Reveal,
    steps: s3.steps,
    background: 'night',
    budgetSec: s3.budgetSec,
    variants: cutInVariants,
    busyMs: rozpad.busyMs,
  },
  { id: 's4', component: makeDummy('S4', 3), steps: 3, background: 'night', budgetSec: 30 },
  { id: 's5', component: makeDummy('S5', 4), steps: 4, background: 'night', budgetSec: 25 },
  { id: 's6', component: makeDummy('S6', 3), steps: 3, background: 'night', budgetSec: 20 },
  { id: 's7', component: makeDummy('S7', 5), steps: 5, background: 'black', budgetSec: 25 },
  { id: 's8', component: makeDummy('S8', 3), steps: 3, background: 'night', budgetSec: 20 },
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

/**
 * Slajdy bez limitu 5 slov na prvek (check:content). S1 má jméno a podtitul,
 * záložní slajdy odpovídají na otázky poroty a smí mít víc textu. `z*` = všechny Z.
 */
export const wordLimitExempt: readonly string[] = ['s1', 'z*'];

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

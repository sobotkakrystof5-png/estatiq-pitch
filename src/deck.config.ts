// Pořadí slajdů, kroky, časový rozpočet a mapování kláves.
import type { Command, DeckShape, SlideDef } from './deck/types';
import { S01Intro } from './slides/S01Intro';
import { S02Problem } from './slides/S02Problem';
import { S03Reveal } from './slides/S03Reveal';
import { S04Product } from './slides/S04Product';
import { S05Business } from './slides/S05Business';
import { S06Scale } from './slides/S06Scale';
import { S07Vision } from './slides/S07Vision';
import { S08Ask } from './slides/S08Ask';
import {
  Z01BusinessModel,
  Z02Pricing,
  Z03Positioning,
  Z04Roadmap,
  Z05Team,
  Z06Finance,
  Z07Deposit,
} from './slides/backup/Slides';
import { s1, s2, s3, s4, s5, s6, s7, s8, z1, z2, z3, z4, z5, z6, z7 } from './content/slides';
import {
  chaos,
  cutInVariants,
  intro,
  rozpad,
  s1Variants,
  s6ToS7Variants,
  s7Variants,
} from './motion/presets';

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
  presenterTimerTickMs: 200,
  presenterTimerWarningSec: 20,
} as const;

export const totalBudgetSec = 180;

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
  {
    id: 's4',
    component: S04Product,
    steps: s4.steps,
    background: 'night',
    budgetSec: s4.budgetSec,
  },
  {
    id: 's5',
    component: S05Business,
    steps: s5.steps,
    background: 'night',
    budgetSec: s5.budgetSec,
  },
  {
    id: 's6',
    component: S06Scale,
    steps: s6.steps,
    background: 'night',
    budgetSec: s6.budgetSec,
    variants: s6ToS7Variants,
  },
  {
    id: 's7',
    component: S07Vision,
    steps: s7.steps,
    background: 'black',
    budgetSec: s7.budgetSec,
    variants: s7Variants,
  },
  { id: 's8', component: S08Ask, steps: s8.steps, background: 'night', budgetSec: s8.budgetSec },
];

export const backupSlides: SlideDef[] = [
  {
    id: z1.id,
    component: Z01BusinessModel,
    steps: z1.steps,
    background: 'night',
    budgetSec: z1.budgetSec,
  },
  {
    id: z2.id,
    component: Z02Pricing,
    steps: z2.steps,
    background: 'night',
    budgetSec: z2.budgetSec,
  },
  {
    id: z3.id,
    component: Z03Positioning,
    steps: z3.steps,
    background: 'night',
    budgetSec: z3.budgetSec,
  },
  {
    id: z4.id,
    component: Z04Roadmap,
    steps: z4.steps,
    background: 'night',
    budgetSec: z4.budgetSec,
  },
  { id: z5.id, component: Z05Team, steps: z5.steps, background: 'night', budgetSec: z5.budgetSec },
  {
    id: z6.id,
    component: Z06Finance,
    steps: z6.steps,
    background: 'night',
    budgetSec: z6.budgetSec,
  },
  {
    id: z7.id,
    component: Z07Deposit,
    steps: z7.steps,
    background: 'night',
    budgetSec: z7.budgetSec,
  },
];

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

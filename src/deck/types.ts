import type { ComponentType } from 'react';
import type { Variants } from 'motion/react';

export type DeckMode = 'normal' | 'instant';
export type Direction = 1 | -1;
export type Background = 'night' | 'paper' | 'black';

/**
 * Kontrakt slajdu: vzhled je funkce `step`. Žádné vlastní časovače pro navigaci.
 * Vyprávěcí animace se rozhodují při mountu nebo změně kroku: v `mode: 'instant'`
 * skočí rovnou na konec. `direction: -1` znamená příchod zpětným krokem
 * (např. S3 → S2 obnoví chaos v zastaveném stavu).
 */
export type SlideProps = { step: number; mode: DeckMode; direction: Direction };

export type SlideDef = {
  id: string;
  component: ComponentType<SlideProps>;
  /** Počet kliků uvnitř slajdu. Stavy jsou 0…steps. */
  steps: number;
  background: Background;
  budgetSec: number;
  /** Vlastní přechod (`enter` / `center` / `exit`), doplní výchozí prolnutí. */
  variants?: Variants;
  /** Jak dlouho po vstupu běží animace (vyprávěcí). Klik v tomto okně je nejdřív dokončí. */
  busyMs?: number;
};

export type Position = { slide: number; step: number };
export type DeckState = Position & { mode: DeckMode; direction: Direction };

/** Tvar decku pro reducer: počet kroků každého slajdu, hlavní slajdy jsou před záložními. */
export type DeckShape = { steps: readonly number[]; mainCount: number };

export type Command =
  | 'next'
  | 'prev'
  | 'first'
  | 'last'
  | 'final'
  | 'overview'
  | 'back'
  | 'presenter'
  | 'fullscreen'
  | 'timer'
  | 'debug'
  | 'ignore';

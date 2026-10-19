// Jediný zdroj časů, easingů a variant animací. Hodnoty z BRIEF §4.
import type { Variants } from 'motion/react';

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/**
 * Sekundy. `step`, `slide` a `word` jsou z tabulky BRIEF §4. `draw`, `count` a `flow`
 * tabulka nemá, primitiva je potřebují. Drží se rozpočtu z BRIEF §4 pravidla 3:
 * odhalení ≤ 0,4 s, vyprávěcí animace ≤ 3 s, smyčka toku je pomalá.
 */
export const dur = {
  step: 0.32,
  slide: 0.4,
  word: 0.28,
  draw: 0.4,
  count: 2.4,
  flow: 2.8,
} as const;

export const spring = {
  snap: { type: 'spring', stiffness: 520, damping: 42 },
} as const;

export const stagger = {
  rows: 0.06,
} as const;

/**
 * Výchozí přechod mezi slajdy: nový slajd se prolne přes starý. Starý zůstane
 * pod ním plně viditelný a zmizí až po dokončení, takže mezi nimi neprosvítá pozadí.
 */
export const slideFade: Variants = {
  enter: { opacity: 0, zIndex: 1 },
  center: { opacity: 1, zIndex: 1, transition: { duration: dur.slide, ease: ease.out } },
  exit: { opacity: 0, zIndex: 0, transition: { duration: 0, delay: dur.slide } },
};

/** Odhalení kroku. */
export const stepReveal = { duration: dur.step, ease: ease.out } as const;

/** Word: nástup hesla zleva doprava (clip-path) a ztlumení. */
export const wordReveal = { duration: dur.word, ease: ease.out } as const;

/** Strike a FlowLine: tah čáry. Opacity skočí hned, aby kulatý konec nezůstal jako tečka. */
export const drawStroke = {
  pathLength: { duration: dur.draw, ease: ease.inOut },
  opacity: { duration: 0 },
} as const;

/** Counter: 0 → N. */
export const countUp = { duration: dur.count, ease: ease.out } as const;

/** FlowLine: nekonečný tok podél linky, lineárně. */
export const flowLoop = { duration: dur.flow, ease: 'linear', repeat: Infinity } as const;

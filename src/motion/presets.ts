// Jediný zdroj časů, easingů a variant animací. Hodnoty z BRIEF §4.
import type { Variants } from 'motion/react';

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Sekundy. */
export const dur = {
  step: 0.32,
  slide: 0.4,
  word: 0.28,
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

/** Odhalení kroku (dummy slajdy, později primitiva). */
export const stepReveal = { duration: dur.step, ease: ease.out } as const;

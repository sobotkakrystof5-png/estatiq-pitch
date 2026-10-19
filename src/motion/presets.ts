// Jediný zdroj časů, easingů a variant animací. Hodnoty z BRIEF §4.
import type { TargetAndTransition, Variants } from 'motion/react';

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
  flow: 2.4,
  dissolve: 1.2,
} as const;

export const spring = {
  snap: { type: 'spring', stiffness: 520, damping: 42 },
} as const;

/** S4: řádek z výpisu dosedne do platby a krátce nato se označí jako spárovaný. */
export const pairing = {
  greenDelay: 0.24,
} as const;

export const stagger = {
  rows: 0.06,
} as const;

/**
 * Výchozí přechod mezi slajdy: nový slajd se prolne přes starý. Starý zůstane
 * pod ním plně viditelný a zmizí až po dokončení, takže mezi nimi neprosvítá pozadí.
 */
const fade = {
  enter: { opacity: 0, zIndex: 1 },
  center: { opacity: 1, zIndex: 1, transition: { duration: dur.slide, ease: ease.out } },
  exit: { opacity: 0, zIndex: 0, transition: { duration: 0, delay: dur.slide } },
} satisfies Record<string, TargetAndTransition>;
export const slideFade: Variants = fade;

/** Odhalení kroku. */
export const stepReveal = { duration: dur.step, ease: ease.out } as const;

/** Jednorázové vyprávěcí rozpuštění řádku v závěru S8. */
export const stripDissolve = { duration: dur.dissolve, ease: ease.inOut } as const;

/** Okamžitý skok pro přímý vstup nebo instantní režim. */
export const instant = { duration: 0 } as const;

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

// ── 1. dějství (S1–S3) ──────────────────────────────────────────────────────

const FULL = 'inset(0% 0% 0% 0%)';

/** S1, krok 0: fotka 0,4 s, jméno vyjede 24 px zespodu, podtitul o 120 ms později (BRIEF §6 S1). */
export const intro = {
  photo: { duration: dur.slide, ease: ease.out },
  name: { duration: dur.step, ease: ease.out },
  role: { duration: dur.step, ease: ease.out, delay: 0.12 },
  rise: 24,
  busyMs: (0.12 + dur.step) * 1000,
} as const;

/** S1, krok 2: papír vystoupá zespodu do této výšky (inset shora v %). Řádky na něm prosakují s ním. */
export const bridge = {
  paperTop: 55,
  transition: { duration: dur.step, ease: ease.inOut },
  rowsRise: 40,
} as const;

/**
 * S1 → S2: S1 se odkrojí zespodu nahoru a pod ním už stojí papír S2. Hranice papíru tak
 * pokračuje v pohybu z kroku 2. Zpět (S2 → S1) je obyčejné prolnutí.
 */
export const s1Variants: Variants = {
  enter: { ...fade.enter, clipPath: FULL },
  center: { ...fade.center, clipPath: FULL },
  exit: (d: number): TargetAndTransition =>
    d === 1
      ? {
          zIndex: 2,
          clipPath: 'inset(0% 0% 100% 0%)',
          transition: { duration: dur.slide, ease: ease.inOut },
        }
      : fade.exit,
};

/** S2 a S3 vpřed: slajd stojí hned (S1 nad ním odjede, resp. S3 začíná přesně tam, kde S2 skončil). */
export const cutInVariants: Variants = {
  enter: (d: number): TargetAndTransition => (d === 1 ? { opacity: 1, zIndex: 1 } : fade.enter),
  center: fade.center,
  exit: fade.exit,
};

/** S6 → S7: jediný okamžitý střih do černé; zpětný krok zůstává plynulý. */
export const s6ToS7Variants: Variants = {
  enter: fade.enter,
  center: fade.center,
  exit: (d: number): TargetAndTransition =>
    d === 1 ? { opacity: 0, zIndex: 0, transition: { duration: 0 } } : fade.exit,
};

/** S7 vstoupí tvrdým střihem vpřed a běžným prolnutím při návratu ze S8. */
export const s7Variants: Variants = {
  enter: (d: number): TargetAndTransition =>
    d === 1 ? { opacity: 1, zIndex: 1, transition: { duration: 0 } } : fade.enter,
  center: fade.center,
  exit: fade.exit,
};

/**
 * S2: vyprávěcí timeline v sekundách (BRIEF §4: ≤ 3 s, běží sama, nikdy nečeká na klik).
 * Řádky odletí z výpisu do tabulky jeden po druhém, bubliny vyskočí, počítadlo jede 0 → 300.
 */
export const chaos = {
  build: { duration: dur.step, ease: ease.out },
  at: { props: 0, panel: 0, rows: 0.1, sheet: 0.25, count: 0.3, fly: 0.6, rent: 1.0, water: 1.8 },
  rowsEvery: stagger.rows,
  fly: { duration: 0.42, ease: ease.inOut },
  flyEvery: 0.24,
  pop: { duration: dur.step, ease: ease.out },
  count: countUp,
  /** Konec timeline: poslední řádek dosedne v 0,6 + 7 × 0,24 + 0,42 = 2,7 s. */
  total: 2.7,
  /** Ztlumení v kroku 1: „pomalu se stáhne“ (BRIEF §6 S2). Neblokuje klik, další klik jde hned na S3. */
  hush: { duration: 0.8, ease: ease.inOut },
  hushOpacity: 0.62,
  /** Klidná smyčka: každé 4 s přibude v tabulce jeden řádek. */
  loopEvery: 4,
  rowWipe: 0.08,
} as const;

/** Smyčka S2 od hodnoty `from` (počet přibylých řádků) do `to`, lineárně. */
export const chaosLoop = (from: number, to: number, delay: number) =>
  ({ duration: Math.max(0, to - from) * chaos.loopEvery, ease: 'linear', delay }) as const;

/**
 * S2 → S3, rozpad: ≤ 600 ms. Jediná výjimka z limitu 400 ms (zapsaná v memory.md).
 * Kulisy se rozsypou se zpožděním 30 ms, tři slova vyjedou z banky, tabulky a bubliny
 * do levého sloupce a papír se stáhne k vodorovné ose.
 */
export const rozpad = {
  scatter: { duration: 0.24, ease: ease.out },
  scatterEvery: 0.03,
  appear: { duration: 0.14, ease: ease.out },
  travel: { duration: 0.45, ease: ease.inOut },
  curtain: { duration: 0.45, ease: ease.inOut },
  at: { travel: 0.05, curtain: 0.15 },
  fromScale: 0.4,
  busyMs: 600,
} as const;

/** S3, krok 4: slova sjedou do středu, zmenší se a prolnou v logo (ne morph). */
export const merge = {
  transition: { duration: dur.slide, ease: ease.inOut },
  wordScale: 0.3,
  logoFrom: 1.08,
} as const;

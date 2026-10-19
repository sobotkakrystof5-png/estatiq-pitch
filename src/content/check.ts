// Pravidla obsahu (CLAUDE.md §4): hesla max. 5 slov, česká typografie, placeholdery.
import type { Fact, SlideContent } from './slides';

export const MAX_WORDS = 5;

const ORPHAN = /(^|\s)([aikosuvzAIKOSUVZ]) (?=\S)/;
const DIGIT_GROUP = /\d (?=\d{3}(?!\d))/;
const NUMBER_UNIT = /\d [\p{L}%]/u;
const MISSING_GLYPH = /[→★]/;
const PLACEHOLDER = '[doplnit';

export type CheckOptions = { release: boolean; wordLimitExempt: readonly string[] };
export type CheckResult = { errors: string[]; warnings: string[] };

/** `s1` = přesně s1, `z*` = všechno, co začíná na z. */
export function isExempt(id: string, patterns: readonly string[]) {
  return patterns.some((p) => (p.endsWith('*') ? id.startsWith(p.slice(0, -1)) : id === p));
}

/** Slovo = úsek mezi mezerami, který obsahuje písmeno nebo číslici („·“ se nepočítá). */
export function countWords(text: string) {
  // „15 000,00“ je jedno číslo: nezlomitelná mezera mezi číslicemi slova nedělí.
  return text
    .replace(/(?<=\d)\u00a0(?=\d)/g, '')
    .split(/\s+/)
    .filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

export function checkText(text: string, wordLimit: boolean): string[] {
  const problems: string[] = [];
  const words = countWords(text);
  if (wordLimit && words > MAX_WORDS) problems.push(`${words} slov (max ${MAX_WORDS})`);
  if (ORPHAN.test(text)) problems.push('chybí nezlomitelná mezera po jednopísmenném slově');
  if (DIGIT_GROUP.test(text)) problems.push('obyčejná mezera v čísle (4 990 → 4 990)');
  if (NUMBER_UNIT.test(text)) problems.push('obyčejná mezera mezi číslem a jednotkou');
  if (MISSING_GLYPH.test(text)) problems.push('→ a ★ písmo nemá, použij primitivum Glyph');
  return problems;
}

export function checkSlides(slides: readonly SlideContent[], opts: CheckOptions): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const placeholder = (where: string) =>
    (opts.release ? errors : warnings).push(`${where}: zůstal placeholder`);

  for (const slide of slides) {
    const wordLimit = !isExempt(slide.id, opts.wordLimitExempt);
    for (const [key, value] of Object.entries(slide.screen)) {
      const fact = value as string | Fact;
      const text = typeof fact === 'string' ? fact : fact.value;
      const where = `${slide.id}.${key}`;
      for (const p of checkText(text, wordLimit)) errors.push(`${where}: ${p}`);
      if (text.includes(PLACEHOLDER) || (typeof fact !== 'string' && fact.status === 'placeholder'))
        placeholder(where);
    }
    for (const [key, rows] of Object.entries(slide.rows ?? {})) {
      rows.forEach((r, i) => {
        // „·“ mezi poli, aby částka a jméno nevypadaly jako číslo a jednotka.
        const text = [r.date, `VS ${r.vs}`, r.amount, r.name].join(' · ');
        for (const p of checkText(text, wordLimit)) errors.push(`${slide.id}.${key}[${i}]: ${p}`);
      });
    }
    if (slide.notes.includes(PLACEHOLDER)) placeholder(`${slide.id}.notes`);
  }
  return { errors, warnings };
}

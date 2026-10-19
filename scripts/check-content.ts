// Kontrola obsahu: max. 5 slov na prvek, nezlomitelné mezery, placeholdery.
// Se `--release` selže, pokud v obsahu zůstal `[doplnit`.
import { slides, type Fact } from '../src/content/slides';

const MAX_WORDS = 5;
const release = process.argv.includes('--release');
const problems: string[] = [];

const NBSP = ' ';
const orphan = /(^|[\s])([aikosuvzAIKOSUVZ]) (?=\S)/;

function check(slideId: string, key: string, text: string) {
  const where = `${slideId}.${key}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words > MAX_WORDS) problems.push(`${where}: ${words} slov (max ${MAX_WORDS})`);
  if (orphan.test(text)) problems.push(`${where}: chybí nezlomitelná mezera (${NBSP}) po jednopísmenném slově`);
  if (/\d [\p{L}%]/u.test(text)) problems.push(`${where}: obyčejná mezera mezi číslem a jednotkou`);
  if (release && text.includes('[doplnit')) problems.push(`${where}: zůstal placeholder`);
}

for (const slide of slides) {
  for (const [key, value] of Object.entries(slide.screen)) {
    const fact = value as string | Fact;
    check(slide.id, key, typeof fact === 'string' ? fact : fact.value);
  }
  if (release && slide.notes.includes('[doplnit')) problems.push(`${slide.id}.notes: zůstal placeholder`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`check:content OK (${slides.length} slajdů)`);

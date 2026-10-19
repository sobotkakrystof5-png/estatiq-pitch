// Kontrola obsahu: max. 5 slov na prvek (výjimky v deck.config.ts), nezlomitelné mezery,
// znaky mimo písmo, placeholdery. Se `--release` je zbylý `[doplnit` chyba, jinak varování.
import { slides } from '../src/content/slides';
import { checkSlides } from '../src/content/check';
import { wordLimitExempt } from '../src/deck.config';

const release = process.argv.includes('--release');
const { errors, warnings } = checkSlides(slides, { release, wordLimitExempt });

if (warnings.length) console.warn(warnings.map((w) => `varování: ${w}`).join('\n'));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`check:content OK (${slides.length} slajdů, ${warnings.length} varování)`);

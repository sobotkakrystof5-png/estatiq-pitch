// Logo EstatIQ z obrysů Space Grotesk Bold (opentype.js), parametry podle webu EstatIQ:
// `.splash-logo { font-weight: 700; letter-spacing: -0.02em }`, „IQ“ v emerald-400.
// Výstup: public/assets/logos/estatiq.svg (dvoubarevné), estatiq-mono.svg (currentColor)
// a src/design/primitives/logo.generated.ts (obrysy pro komponentu Logo).
import { readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';

const FONT = 'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff';
const SIZE = 100;
const LETTER_SPACING = -0.02;
const SPLIT = 5; // „Estat“ | „IQ“

const buf = readFileSync(FONT);
const font = opentype.parse(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
);

const tokens = readFileSync('src/design/tokens.css', 'utf8');
const token = (name: string) => {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(tokens);
  if (!m?.[1]) throw new Error(`token --color-${name} nenalezen`);
  return m[1].toUpperCase();
};

// Baseline je y = 0, začátek x = 0. Kerning z písma, tracking jako na webu.
const paths = font.getPaths('EstatIQ', 0, 0, SIZE, {
  kerning: true,
  letterSpacing: LETTER_SPACING,
});
const join = (list: opentype.Path[]) => list.map((p) => p.toPathData(2)).join('');
const estat = join(paths.slice(0, SPLIT));
const iq = join(paths.slice(SPLIT));

const boxes = paths.map((p) => p.getBoundingBox());
const x1 = Math.min(...boxes.map((b) => b.x1));
const y1 = Math.min(...boxes.map((b) => b.y1));
const x2 = Math.max(...boxes.map((b) => b.x2));
const y2 = Math.max(...boxes.map((b) => b.y2));
const r = (n: number) => Math.round(n * 100) / 100;
const viewBox = `${r(x1)} ${r(y1)} ${r(x2 - x1)} ${r(y2 - y1)}`;

const svg = (fillEstat: string, fillIq: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="EstatIQ">` +
  `<path fill="${fillEstat}" d="${estat}"/><path fill="${fillIq}" d="${iq}"/></svg>\n`;

writeFileSync('public/assets/logos/estatiq.svg', svg(token('fg'), token('mint')));
writeFileSync('public/assets/logos/estatiq-mono.svg', svg('currentColor', 'currentColor'));
writeFileSync(
  'src/design/primitives/logo.generated.ts',
  `// Vygenerováno skriptem scripts/make-logo.ts. Neupravovat ručně.\n` +
    `// Space Grotesk 700, ${SIZE} px, letter-spacing ${LETTER_SPACING}em, baseline y = 0.\n` +
    `export const logo = {\n  viewBox: '${viewBox}',\n  size: ${SIZE},\n  letterSpacing: ${LETTER_SPACING},\n` +
    `  estat: '${estat}',\n  iq: '${iq}',\n} as const;\n`,
);
console.log(`logo: viewBox ${viewBox}`);

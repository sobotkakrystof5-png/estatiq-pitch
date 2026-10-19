// Diakritika a symboly se musí vykreslit vlastním písmem, ne náhradním (BRIEF §3).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import opentype from 'opentype.js';

const CZECH = 'ěščřžýáíéůúťďňĚŠČŘŽÝÁÍÉŮÚŤĎŇ';
// → a ★ v písmu nejsou, kreslí je primitivum Glyph a check:content je v textu zakáže.
const SYMBOLS = '×Kč%„“…·';

function load(family: string, weight: number) {
  return ['latin', 'latin-ext'].map((subset) => {
    const file = `node_modules/@fontsource/${family}/files/${family}-${subset}-${weight}-normal.woff`;
    const b = readFileSync(file);
    return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  });
}

function missing(family: string, weight: number, chars: string) {
  const fonts = load(family, weight);
  return [...chars].filter((c) => !fonts.some((f) => f.charToGlyphIndex(c) > 0));
}

describe('pokrytí glyfů', () => {
  for (const weight of [400, 500, 700]) {
    it(`Space Grotesk ${weight}`, () => {
      expect(missing('space-grotesk', weight, CZECH + SYMBOLS)).toEqual([]);
    });
  }
  it('JetBrains Mono 400 (řádky výpisu)', () => {
    expect(missing('jetbrains-mono', 400, CZECH + '0123456789,. ')).toEqual([]);
  });
});

// AGENTS.md → Konvence: barvy jen v tokens.css, časy jen v motion/presets.ts.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = 'src';
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const DURATION = /\bduration\b/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

function offenders(pattern: RegExp, allowed: string) {
  return files(ROOT)
    .map((f) => relative(ROOT, f))
    .filter((f) => f !== allowed)
    .flatMap((f) =>
      readFileSync(join(ROOT, f), 'utf8')
        .split('\n')
        .flatMap((line, i) => (pattern.test(line) ? [`${f}:${i + 1}: ${line.trim()}`] : [])),
    );
}

describe('konvence', () => {
  it('žádný hex mimo tokens.css', () => {
    expect(offenders(HEX, 'design/tokens.css')).toEqual([]);
  });
  it('žádné duration mimo presets.ts', () => {
    expect(offenders(DURATION, 'motion/presets.ts')).toEqual([]);
  });
});

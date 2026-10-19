import { clampPosition } from './reducer';
import type { DeckShape, Position } from './types';

// `#/3/2` = hlavní slajd 3 (od 1), krok 2 (od 0). `#/z2/0` = záložní slajd Z2.
export function formatHash(shape: DeckShape, pos: Position): string {
  const backup = pos.slide >= shape.mainCount;
  const n = backup ? `z${pos.slide - shape.mainCount + 1}` : `${pos.slide + 1}`;
  return `#/${n}/${pos.step}`;
}

export function parseHash(shape: DeckShape, hash: string): Position | null {
  const m = /^#\/(z?)(\d+)(?:\/(\d+))?\/?$/i.exec(hash);
  if (!m) return null;
  const n = Number(m[2]) - 1;
  const step = Number(m[3] ?? 0);
  if (m[1]) {
    const backupCount = shape.steps.length - shape.mainCount;
    if (backupCount === 0) return null;
    return clampPosition(shape, shape.mainCount + Math.min(Math.max(n, 0), backupCount - 1), step);
  }
  return clampPosition(shape, Math.min(Math.max(n, 0), shape.mainCount - 1), step);
}

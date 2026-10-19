import { describe, expect, it } from 'vitest';
import { slides } from './content/slides';

describe('smoke', () => {
  it('obsah je zatím prázdný', () => {
    expect(slides).toEqual([]);
  });
});

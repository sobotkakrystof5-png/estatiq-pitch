import { describe, expect, it } from 'vitest';
import { s5Math, s5 } from './slides';

describe('aritmetika S5', () => {
  it('sedí objem nájmů, podíl ceny a rozpětí správy', () => {
    const rentVolume = s5Math.units * s5Math.rentPerUnit;
    const pricePercent = (s5Math.monthlyPrice / rentVolume) * 100;
    const managementFees = s5Math.managementRate.map((rate) => rate * s5Math.selfManagedRent);

    expect(rentVolume).toBe(4_500_000);
    expect(pricePercent).toBeCloseTo(0.11, 2);
    expect(managementFees).toEqual([2_000, 2_400]);
    expect(s5.screen.b2bRatio.value).toBe('0,1 %');
  });
});

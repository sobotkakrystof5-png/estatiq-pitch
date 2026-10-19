import { describe, expect, it } from 'vitest';
import { s5Math, s5 } from './slides';

describe('aritmetika S5', () => {
  it('sedí objem nájmů, podíl ceny a rozpětí správy', () => {
    const rentVolume = s5Math.units * s5Math.rentPerUnit;
    const pricePercent = (s5Math.monthlyPrice / rentVolume) * 100;
    const managementFees = s5Math.managementRate.map((rate) => rate * s5Math.selfManagedRent);

    expect(rentVolume).toBe(5_997_000);
    expect(pricePercent).toBeCloseTo(0.083, 3);
    expect(managementFees[0]).toBeCloseTo(1_999, 5);
    expect(managementFees[1]).toBeCloseTo(2_398.8, 5);
    expect(s5.screen.b2bVolumeMain.value).toBe('6,0');
    expect(s5.screen.b2cFee.value).toBe('1 999–2 399 Kč');
    expect(s5.screen.b2bRatio.value).toBe('0,1 %');
  });
});

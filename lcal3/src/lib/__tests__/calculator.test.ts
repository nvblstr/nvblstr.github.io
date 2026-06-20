import { describe, it, expect } from 'vitest';
import {
  calcSubCostBase,
  calcGearPowerIncrementByType,
  calcGearLLimit,
  calcMainCost,
  calcSubCost,
  calcFireNumber,
  getOptionText,
  generateGearCandidates,
} from '../calculator';

describe('calcSubCostBase', () => {
  it('returns 0.7 for normal weapon', () => {
    expect(calcSubCostBase('normal')).toBe(0.7);
  });

  it('returns 0.6 for neo weapon', () => {
    expect(calcSubCostBase('neo')).toBe(0.6);
  });
});

describe('calcGearPowerIncrementByType', () => {
  it('returns 0 for none', () => {
    expect(calcGearPowerIncrementByType('none')).toBe(0);
  });

  it('returns 10 for comeback', () => {
    expect(calcGearPowerIncrementByType('comeback')).toBe(10);
  });

  it('returns 18 for lastspurt', () => {
    expect(calcGearPowerIncrementByType('lastspurt')).toBe(18);
  });
});

describe('calcGearLLimit', () => {
  it('returns 3 for none', () => {
    expect(calcGearLLimit('none')).toBe(3);
  });

  it('returns 2 for comeback', () => {
    expect(calcGearLLimit('comeback')).toBe(2);
  });

  it('returns 2 for lastspurt', () => {
    expect(calcGearLLimit('lastspurt')).toBe(2);
  });
});

describe('calcMainCost', () => {
  // S1: Happy path
  it('returns base cost when gearPower57 is 0', () => {
    expect(calcMainCost(0)).toBe(0.075);
  });

  // S2: Edge (防御的チェック - 負の値)
  it('returns base cost when gearPower57 is negative', () => {
    const result = calcMainCost(-10);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBe(0.075);
  });

  // S3: Edge (防御的チェック - 大きな値)
  it('returns finite value when gearPower57 is very large', () => {
    const result = calcMainCost(1000);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('returns finite value for normal gear power values', () => {
    const result = calcMainCost(57);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(0.075); // ギアパワーでコストは下がる
  });
});

describe('calcSubCost', () => {
  it('returns subCostBase when gearPower57 is 0', () => {
    expect(calcSubCost('normal', 0.7, 0)).toBe(0.7);
    expect(calcSubCost('neo', 0.6, 0)).toBe(0.6);
  });

  it('returns finite value for negative gearPower57', () => {
    const result = calcSubCost('normal', 0.7, -10);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBe(0.7);
  });

  it('returns lower cost with higher gear power', () => {
    const cost0 = calcSubCost('normal', 0.7, 0);
    const cost57 = calcSubCost('normal', 0.7, 57);
    expect(cost57).toBeLessThan(cost0);
  });
});

// S4: Regression
describe('calcFireNumber', () => {
  it('returns 13 for base cost with no sub shots', () => {
    // 1 - 0.7 * 0 = 1 (ink)
    // 1 / 0.075 = 13.33...
    // Math.floor(13.33) = 13
    expect(calcFireNumber(0.075, 0.7, 0)).toBe(13);
  });

  it('returns 0 when mainCost is 0 or negative', () => {
    expect(calcFireNumber(0, 0.7, 0)).toBe(0);
    expect(calcFireNumber(-0.1, 0.7, 0)).toBe(0);
  });

  it('returns lower fire number with more sub shots', () => {
    const fire0 = calcFireNumber(0.075, 0.7, 0);
    const fire1 = calcFireNumber(0.075, 0.7, 1);
    const fire2 = calcFireNumber(0.075, 0.7, 2);
    expect(fire1).toBeLessThan(fire0);
    expect(fire2).toBeLessThan(fire1);
  });
});

describe('getOptionText', () => {
  const options = [
    { text: 'オプションA', value: 'a' },
    { text: 'オプションB', value: 'b' },
  ];

  it('returns text for existing value', () => {
    expect(getOptionText(options, 'a')).toBe('オプションA');
    expect(getOptionText(options, 'b')).toBe('オプションB');
  });

  it('returns stringified value for non-existing value', () => {
    expect(getOptionText(options, 'c')).toBe('c');
  });
});

// S5: 統合
describe('generateGearCandidates', () => {
  it('returns candidates for valid input', () => {
    const candidates = generateGearCandidates(
      'normal', // weapon
      'none',   // unique
      0,        // subCount
      13,       // targetFireNumber
      30,       // currentCost (3GP)
      0,        // fixedSubL
      0,        // fixedSubS
    );
    expect(Array.isArray(candidates)).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);
  });

  it('returns empty array when currentCost is 0', () => {
    const candidates = generateGearCandidates(
      'normal', 'none', 0, 13, 0, 0, 0
    );
    expect(candidates).toEqual([]);
  });

  it('sorts candidates by fireNumber descending', () => {
    const candidates = generateGearCandidates(
      'normal', 'none', 1, 10, 50, 0, 0
    );
    for (let i = 1; i < candidates.length; i++) {
      const current = candidates[i]!;
      const prev = candidates[i - 1]!;
      expect(current.fireNumber).toBeLessThanOrEqual(prev.fireNumber);
    }
  });

  it('assigns rank starting from 1', () => {
    const candidates = generateGearCandidates(
      'normal', 'none', 1, 10, 50, 0, 0
    );
    if (candidates.length > 0) {
      expect(candidates[0]!.rank).toBe(1);
    }
  });
});

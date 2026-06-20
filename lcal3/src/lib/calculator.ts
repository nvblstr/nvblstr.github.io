/**
 * LunaCalculator for Splatoon 3 - 計算ロジック
 * インク消費量・発射回数・推奨ギア配分を計算する純粋関数
 */

import {
  type SubNumber,
  type UniqueGear,
  type WeaponType,
  type GearCandidate,
  MAIN_COST_BASE,
  SUB_COST_BASE,
  GEAR_POWER_INCREMENT,
  GEAR_L_LIMIT,
  MAIN_EFFECT_RATE,
} from "../types/calculator";

// ===== 基本計算関数 =====

/**
 * サブブキの基本コストを取得
 */
export const calcSubCostBase = (weapon: WeaponType): number => {
  return SUB_COST_BASE[weapon];
};

/**
 * 特殊ギアによるギアパワー増加量を取得
 */
export const calcGearPowerIncrementByType = (gear: UniqueGear): number => {
  return GEAR_POWER_INCREMENT[gear];
};

/**
 * 大スロットの上限値を取得
 */
export const calcGearLLimit = (gear: UniqueGear): number => {
  return GEAR_L_LIMIT[gear];
};

/**
 * ギアパワー57表記からメインブキのインク消費量を計算
 * @param gearPower57 - メイン効率のギアパワー（57表記）
 * @returns メインブキのインク消費量（0-1の範囲、防御的チェック済み）
 */
export const calcMainCost = (gearPower57: number): number => {
  // 防御的チェック: 負の値や無効な値の場合は基本コストを返す
  if (!Number.isFinite(gearPower57) || gearPower57 < 0) {
    return MAIN_COST_BASE;
  }

  const inner = 0.033 * gearPower57 - 0.00027 * gearPower57 ** 2;

  // 底が負の場合、非整数乗でNaNになるため防御
  if (inner < 0) {
    return MAIN_COST_BASE;
  }

  const exponent = Math.log(0.6) / Math.log(0.5); // ≈ 0.737
  const result = (1 - 0.5 * inner ** exponent) * MAIN_COST_BASE;

  // 最終的なNaN/Infinityチェック
  return Number.isFinite(result) ? result : MAIN_COST_BASE;
};

/**
 * ギアパワー57表記からサブブキのインク消費量を計算
 * @param weapon - ブキタイプ
 * @param subCostBase - サブブキの基本コスト
 * @param gearPower57 - サブ効率のギアパワー（57表記）
 * @returns サブブキのインク消費量（防御的チェック済み）
 */
export const calcSubCost = (
  weapon: WeaponType,
  subCostBase: number,
  gearPower57: number,
): number => {
  // 防御的チェック
  if (!Number.isFinite(gearPower57) || gearPower57 < 0) {
    return subCostBase;
  }

  const effectRate = MAIN_EFFECT_RATE[weapon];
  const inner = 0.033 * gearPower57 - 0.00027 * gearPower57 ** 2;

  // 底が負の場合の防御
  if (inner < 0) {
    return subCostBase;
  }

  const result = (1 - effectRate * inner) * subCostBase;

  return Number.isFinite(result) ? result : subCostBase;
};

/**
 * 発射可能回数を計算
 * @param mainCost - メインブキのインク消費量
 * @param subCost - サブブキのインク消費量
 * @param subNumber - サブウェポンの使用回数
 * @returns 発射可能回数（0以上）
 */
export const calcFireNumber = (
  mainCost: number,
  subCost: number,
  subNumber: number,
): number => {
  // 防御的チェック: mainCostが0以下の場合は0を返す
  if (!Number.isFinite(mainCost) || mainCost <= 0) {
    return 0;
  }

  const ink = 1 - subCost * subNumber;
  const result = Math.floor(ink / mainCost);

  return Math.max(0, result);
};

// ===== ユーティリティ =====

/**
 * オプション配列から値に対応するテキストを取得
 */
export const getOptionText = <T extends string | number>(
  options: { text: string; value: T }[],
  value: T,
): string => {
  return options.find((option) => option.value === value)?.text ?? String(value);
};

// ===== 推奨ギア配分 =====

/**
 * 推奨ギア配分の候補を全探索で生成
 * @param weapon - ブキタイプ
 * @param unique - 特殊ギア
 * @param subCount - サブウェポン使用回数
 * @param targetFireNumber - 目標発射回数
 * @param currentCost - 現在のギアパワーコスト
 * @param fixedSubL - 固定するサブ効率大スロット（サブ回数0の場合）
 * @param fixedSubS - 固定するサブ効率小スロット（サブ回数0の場合）
 * @returns ソート済みのギア候補配列
 */
export const generateGearCandidates = (
  weapon: WeaponType,
  unique: UniqueGear,
  subCount: SubNumber,
  targetFireNumber: number,
  currentCost: number,
  fixedSubL: number,
  fixedSubS: number,
): GearCandidate[] => {
  const candidates: GearCandidate[] = [];
  const largeLimit = calcGearLLimit(unique);
  const increment = calcGearPowerIncrementByType(unique);
  const baseSubCost = calcSubCostBase(weapon);

  const maxMainL = subCount === 0 ? largeLimit - fixedSubL : largeLimit;
  for (let mainL = 0; mainL <= maxMainL; mainL += 1) {
    const subLStart = subCount === 0 ? fixedSubL : 0;
    const subLLimit = subCount === 0 ? fixedSubL : largeLimit - mainL;
    for (let subL = subLStart; subL <= subLLimit; subL += 1) {
      const maxMainS = subCount === 0 ? 9 - fixedSubS : 9;
      for (let mainS = 0; mainS <= maxMainS; mainS += 1) {
        const subSStart = subCount === 0 ? fixedSubS : 0;
        const subSLimit = subCount === 0 ? fixedSubS : 9 - mainS;
        for (let subS = subSStart; subS <= subSLimit; subS += 1) {
          const totalSlots = mainL + subL + mainS + subS;
          const gearPowerCost = (mainL + subL) * 10 + (mainS + subS) * 3;
          if (gearPowerCost > currentCost) {
            continue;
          }

          const mainGear57 = 10 * mainL + 3 * mainS + increment;
          const subGear57 = 10 * subL + 3 * subS + increment;
          const candidateMainCost = calcMainCost(mainGear57);
          const candidateSubCost = calcSubCost(weapon, baseSubCost, subGear57);
          const candidateInk = 1 - candidateSubCost * subCount;
          const candidateFireNumber = calcFireNumber(
            candidateMainCost,
            candidateSubCost,
            subCount,
          );

          if (
            candidateInk <= 0 ||
            candidateFireNumber < targetFireNumber ||
            (candidateFireNumber === targetFireNumber &&
              gearPowerCost === currentCost)
          ) {
            continue;
          }

          candidates.push({
            id: `${mainL}-${mainS}-${subL}-${subS}-${candidateFireNumber}`,
            rank: 0,
            gearMainL: mainL,
            gearMainS: mainS,
            gearSubL: subL,
            gearSubS: subS,
            fireNumber: candidateFireNumber,
            ink: candidateInk,
            largeSlots: mainL + subL,
            smallSlots: mainS + subS,
            totalSlots,
            gearPowerCost,
            gearPowerTotal: mainGear57 + subGear57,
          });
        }
      }
    }
  }

  return candidates
    .sort((a, b) => {
      if (a.fireNumber !== b.fireNumber) {
        return b.fireNumber - a.fireNumber;
      }
      if (a.gearPowerCost !== b.gearPowerCost) {
        return a.gearPowerCost - b.gearPowerCost;
      }
      if (a.largeSlots !== b.largeSlots) {
        return a.largeSlots - b.largeSlots;
      }
      if (a.gearPowerTotal !== b.gearPowerTotal) {
        return a.gearPowerTotal - b.gearPowerTotal;
      }
      return b.ink - a.ink;
    })
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
};

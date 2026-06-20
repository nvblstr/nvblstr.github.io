/**
 * LunaCalculator for Splatoon 3 - 型定義
 * ブキ・ギア・インク計算に関するドメイン型
 */

// ===== 基本型 =====

/** サブウェポンの使用回数 */
export type SubNumber = 0 | 1 | 2;

/** 特殊ギアの種類 */
export type UniqueGear = "none" | "comeback" | "lastspurt";

/** ブキの種類（無印/ネオ） */
export type WeaponType = "normal" | "neo";

// ===== オプション型（UI用） =====

/** サブ回数の選択肢 */
export interface SubNumberOption {
  text: string;
  value: SubNumber;
}

/** 特殊ギアの選択肢 */
export interface UniqueGearOption {
  text: string;
  value: UniqueGear;
}

/** ブキの選択肢 */
export interface WeaponTypeOption {
  text: string;
  value: WeaponType;
}

// ===== 計算結果型 =====

/** ギア配分の候補 */
export interface GearCandidate {
  id: string;
  rank: number;
  gearMainL: number;
  gearMainS: number;
  gearSubL: number;
  gearSubS: number;
  fireNumber: number;
  ink: number;
  largeSlots: number;
  smallSlots: number;
  totalSlots: number;
  gearPowerCost: number;
  gearPowerTotal: number;
}

/** 推奨パネルの条件表示 */
export interface RecommendationCondition {
  label: string;
  value: string;
}

// ===== 定数 =====

/** 表示メッセージ */
export const FIRE_NUMBER_MESSAGE = "発撃てます";
export const NOT_ENOUGH_MESSAGE_1 = "今のギアパワーではサブウェポンは";
export const NOT_ENOUGH_MESSAGE_2 = "回使えません";

/** 基本コスト（ver.5.0.0基準） */
export const MAIN_COST_BASE = 0.075;

/** 推奨表示の上限数 */
export const RECOMMENDATION_LIMIT = 5;

/** サブブキの基本コスト（ブキタイプ別） */
export const SUB_COST_BASE = {
  normal: 0.7,
  neo: 0.6,
} as const;

/** 特殊ギアによるギアパワー増加量（ver.5.0.0: ラスパ24→18に変更） */
export const GEAR_POWER_INCREMENT = {
  none: 0,
  comeback: 10,
  lastspurt: 18,
} as const;

/** 大スロットの上限（特殊ギア別） */
export const GEAR_L_LIMIT = {
  none: 3,
  comeback: 2,
  lastspurt: 2,
} as const;

/** メイン効率の効果率（ブキタイプ別） */
export const MAIN_EFFECT_RATE = {
  normal: 0.35,
  neo: 0.3,
} as const;

// ===== 選択肢データ =====

export const WEAPON_TYPE_OPTIONS: WeaponTypeOption[] = [
  { text: "無印", value: "normal" },
  { text: "ネオ", value: "neo" },
];

export const SUB_NUMBER_OPTIONS: SubNumberOption[] = [
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
];

export const UNIQUE_GEAR_OPTIONS: UniqueGearOption[] = [
  { text: "なし", value: "none" },
  { text: "カムバ", value: "comeback" },
  { text: "ラスパ", value: "lastspurt" },
];

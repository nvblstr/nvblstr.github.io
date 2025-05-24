<template>
  <!-- メインコンテナ -->
  <BContainer fluid="sm">
    <!-- 入力セクション -->
    <div class="input-section">
      <!-- サブ回数セクション -->
      <BRow class="section-row">
        <BCol class="label label-number">
          <i class="bi bi-arrow-repeat label-icon"></i>
          サブ回数
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup>
            <!-- サブ回数のラジオボタン（0, 1, 2回） -->
            <BFormRadioGroup
              class="btn-radio"
              v-model="subNumber"
              :options="subNumberOptions"
              button-variant="outline-primary"
              size="lg"
              name="sub-number-radio"
              buttons
            />
          </BFormGroup>
        </BCol>
      </BRow>

      <!-- 特殊ギアセクション -->
      <BRow class="section-row">
        <BCol class="label label-unique">
          <i class="bi bi-mortarboard label-icon"></i>
          特殊ギア
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup>
            <!-- 特殊ギアのラジオボタン（なし、カムバ、ラスパ） -->
            <BFormRadioGroup
              class="btn-radio"
              v-model="uniqueGear"
              :options="uniqueGearOptions"
              button-variant="outline-primary"
              size="lg"
              name="unique-gear-radio"
              buttons
            ></BFormRadioGroup>
          </BFormGroup>
        </BCol>
      </BRow>

      <!-- メイン効率セクション -->
      <BRow class="section-row">
        <BCol class="label label-main">
          <div class="nova-blaster-icon">
            <i class="bi bi-circle-fill small-circle left-circle"></i>
            <div class="large-circle-container">
              <i class="bi bi-circle-fill small-circle top-right-circle"></i>
              <i class="bi bi-circle-fill large-circle"></i>
            </div>
          </div>
          メイン効率
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <!-- メイン効率の大スロット -->
          <BFormSpinbutton
            class="gear-spin"
            v-model="gearMainL"
            min="0"
            :max="gearLLimit"
            size="lg"
            inline
          ></BFormSpinbutton>
        </BCol>
        <BCol>
          <!-- メイン効率の小スロット -->
          <BFormSpinbutton
            class="gear-spin"
            v-model="gearMainS"
            min="0"
            max="9"
            size="lg"
            inline
          ></BFormSpinbutton>
        </BCol>
      </BRow>

      <!-- サブ効率セクション -->
      <BRow class="section-row">
        <BCol class="label label-sub">
          <div class="triangle-icon">
            <i class="bi bi-triangle large-triangle"></i>
            <i class="bi bi-triangle small-triangle"></i>
          </div>
          サブ効率
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <!-- サブ効率の大スロット -->
          <BFormSpinbutton
            class="gear-spin"
            v-model="gearSubL"
            min="0"
            :max="gearLLimit"
            size="lg"
            inline
          ></BFormSpinbutton>
        </BCol>
        <BCol>
          <!-- サブ効率の小スロット -->
          <BFormSpinbutton
            class="gear-spin"
            v-model="gearSubS"
            min="0"
            max="9"
            size="lg"
            inline
          ></BFormSpinbutton>
        </BCol>
      </BRow>

      <!-- スロットサイズのラベル -->
      <BRow>
        <BCol>
          <span class="slot-label">大</span>
        </BCol>
        <BCol>
          <span class="slot-label">小</span>
        </BCol>
      </BRow>
    </div>

    <!-- 結果表示セクション -->
    <BRow class="mt-4">
      <BCol>
        <BCard
          :bg-variant="ink > 0 ? 'light' : 'warning'"
          :text-variant="ink > 0 ? 'dark' : 'dark'"
          class="shadow-sm"
        >
          <!-- インクが十分な場合の表示 -->
          <div v-if="ink > 0" class="d-flex flex-column gap-2">
            <div class="d-flex align-items-baseline justify-content-center gap-2">
              <strong class="display-5 text-dark">{{ fireNumber }}</strong>
              <span class="fs-5 text-secondary">{{ fireNumberMessage }}</span>
            </div>
            <div class="d-flex flex-column align-items-center gap-1">
              <div class="text-secondary small opacity-75 mb-1">ギアパワーによる増加</div>
              <div class="bg-primary bg-opacity-10 rounded-pill px-3 py-1">
                <span class="fs-5 text-primary fw-semibold">+{{ fireNumberIncrement }}</span>
                <span class="text-secondary small ms-1">発</span>
              </div>
            </div>
          </div>
          <!-- インクが不足している場合の表示 -->
          <div v-else class="text-center">
            <strong class="fs-5">
              {{ notEnoughMessage1 }}{{ subNumber }}{{ notEnoughMessage2 }}
            </strong>
          </div>
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { ref, computed, watch } from "vue";
import "bootstrap-icons/font/bootstrap-icons.css";

// ===== 型定義 =====
// サブ回数の型（0, 1, 2回）
type SubNumber = 0 | 1 | 2;
// 特殊ギアの型（なし、カムバック、ラストスパート）
type UniqueGear = "none" | "comeback" | "lastspurt";

// サブ回数のオプション型
interface SubNumberOption {
  text: string;
  value: SubNumber;
  [key: string]: unknown;
}

// 特殊ギアのオプション型
interface UniqueGearOption {
  text: string;
  value: UniqueGear;
  [key: string]: unknown;
}

// ===== 定数 =====
// 表示メッセージ
const FIRE_NUMBER_MESSAGE = "発撃てます";
const NOT_ENOUGH_MESSAGE_1 = "今のギアパワーではサブウェポンは";
const NOT_ENOUGH_MESSAGE_2 = "回使えません";

// 基本コスト
const MAIN_COST_BASE = 0.075; // メイン武器の基本コスト
const SUB_COST_BASE = 0.7; // サブ武器の基本コスト

// ===== リアクティブな状態 =====
// サブ回数の選択値
const subNumber = ref<SubNumber>(0);
// 特殊ギアの選択値
const uniqueGear = ref<UniqueGear>("none");
// メイン効率の大スロット値
const gearMainL = ref<number>(0);
// メイン効率の小スロット値
const gearMainS = ref<number>(0);
// サブ効率の大スロット値
const gearSubL = ref<number>(0);
// サブ効率の小スロット値
const gearSubS = ref<number>(0);

// ===== オプション設定 =====
// サブ回数の選択肢
const subNumberOptions: SubNumberOption[] = [
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "2", value: 2 },
];

// 特殊ギアの選択肢
const uniqueGearOptions: UniqueGearOption[] = [
  { text: "なし", value: "none" },
  { text: "カムバ", value: "comeback" },
  { text: "ラスパ", value: "lastspurt" },
];

// ===== 計算ロジック =====
// 特殊ギアによるギアパワー増加量の計算
const calcGearPowerIncrement = (uniqueGear: UniqueGear): number => {
  switch (uniqueGear) {
    case "none":
      return 0;
    case "comeback":
      return 10;
    case "lastspurt":
      return 18; /* ver.5.0.0から24→18に変更 */
    default:
      return 0;
  }
};

// メイン効率の57表記の計算
const gearMain57 = computed((): number => {
  return (
    10 * gearMainL.value +
    3 * gearMainS.value +
    calcGearPowerIncrement(uniqueGear.value)
  );
});

// サブ効率の57表記の計算
const gearSub57 = computed((): number => {
  return (
    10 * gearSubL.value +
    3 * gearSubS.value +
    calcGearPowerIncrement(uniqueGear.value)
  );
});

// メイン武器のインク消費量の計算
const mainCost = computed((): number => {
  return (
    (1 -
      0.5 *
        (0.033 * gearMain57.value - 0.00027 * gearMain57.value ** 2) **
          (Math.log(0.6) / Math.log(0.5))) *
    MAIN_COST_BASE
  );
});

// サブ武器のインク消費量の計算
const subCost = computed((): number => {
  return (
    (1 - 0.35 * (0.033 * gearSub57.value - 0.00027 * gearSub57.value ** 2)) *
    SUB_COST_BASE
  );
});

// 発射可能回数の計算
const calcFireNumber = (
  mainCost: number,
  subCost: number,
  subNumber: number
): number => {
  return Math.floor((1 - subCost * subNumber) / mainCost);
};

// 発射可能回数の表示値
const fireNumber = computed((): number => {
  return calcFireNumber(mainCost.value, subCost.value, subNumber.value);
});

// ギアパワーによる発射回数増加量の計算
const fireNumberIncrement = computed((): number => {
  if (calcFireNumber(MAIN_COST_BASE, SUB_COST_BASE, subNumber.value) >= 0) {
    return (
      fireNumber.value -
      calcFireNumber(MAIN_COST_BASE, SUB_COST_BASE, subNumber.value)
    );
  }
  return fireNumber.value;
});

// 残りインク量の計算
const ink = computed((): number => {
  return 1 - subCost.value * subNumber.value;
});

// 大スロットの上限値の計算
const gearLLimit = computed((): number => {
  return uniqueGear.value === "none" ? 3 : 2;
});

// ===== 表示メッセージ =====
const fireNumberMessage = computed((): string => FIRE_NUMBER_MESSAGE);
const notEnoughMessage1 = computed((): string => NOT_ENOUGH_MESSAGE_1);
const notEnoughMessage2 = computed((): string => NOT_ENOUGH_MESSAGE_2);

// ===== ウォッチャー =====
// メイン効率の大スロット値が変更された時の処理
watch(gearMainL, () => {
  if (Number(gearMainL.value) + Number(gearSubL.value) > gearLLimit.value) {
    gearSubL.value = gearSubL.value - 1;
  }
});

// サブ効率の大スロット値が変更された時の処理
watch(gearSubL, () => {
  if (Number(gearMainL.value) + Number(gearSubL.value) > gearLLimit.value) {
    gearMainL.value = gearMainL.value - 1;
  }
});

// メイン効率の小スロット値が変更された時の処理
watch(gearMainS, () => {
  if (Number(gearMainS.value) + Number(gearSubS.value) > 9) {
    gearSubS.value = gearSubS.value - 1;
  }
});

// サブ効率の小スロット値が変更された時の処理
watch(gearSubS, () => {
  if (Number(gearMainS.value) + Number(gearSubS.value) > 9) {
    gearMainS.value = gearMainS.value - 1;
  }
});

// 大スロットの上限値が変更された時の処理
watch(gearLLimit, () => {
  if (Number(gearMainL.value) + Number(gearSubL.value) > gearLLimit.value) {
    if (Number(gearMainL.value) > Number(gearSubL.value)) {
      gearMainL.value = gearMainL.value - 1;
    } else {
      gearSubL.value = gearSubL.value - 1;
    }
  }
});

export default {
  name: "Calculator",
  setup() {
    return {
      subNumber,
      uniqueGear,
      gearMainL,
      gearMainS,
      gearSubL,
      gearSubS,
      subNumberOptions,
      uniqueGearOptions,
      fireNumber,
      fireNumberMessage,
      fireNumberIncrement,
      notEnoughMessage1,
      notEnoughMessage2,
      gearLLimit,
      ink,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* 入力セクション
 * フォーム要素を含むメインの入力エリア
 * 上部に余白を設定し、幅をコンテナに合わせる
 */
.input-section {
  padding-top: 1rem;
}

/* 結果表示セクションのカスタムスタイル */
.border-dashed {
  border-style: dashed !important;
}

/* レスポンシブ対応 */
@media (max-width: 576px) {
  .display-4 {
    font-size: 2.5rem;
  }
  
  .fs-5 {
    font-size: 1rem !important;
  }
}

/* セクション間の間隔
 * 各セクション間に一定の間隔を設定
 */
.section-row {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* 最初のセクションのマージンを削除 */
.section-row:first-child {
  margin-top: 0;
}

/* ラベルの基本スタイル
 * 各セクションのタイトル部分のスタイル
 * フォントサイズ、余白、角丸を設定
 */
.label {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.05em;
  position: relative;
  padding: 0.3em 0.8em;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.label-icon {
  font-size: 1.2em;
  opacity: 0.8;
  width: 1em;
  height: 1em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 各セクションのラベルスタイル */
.label-number {
  background: linear-gradient(to bottom, #f0fdf4, #dcfce7);
  color: #166534;
  box-shadow: 0 2px 4px rgba(22, 101, 52, 0.15);
}

.label-unique {
  background: linear-gradient(to bottom, #f7f0ff, #eee3ff);
  color: #4c3c8a;
  box-shadow: 0 2px 4px rgba(128, 90, 213, 0.15);
}

.label-main {
  background: linear-gradient(to bottom, #fff0f5, #fde2e9);
  color: #a32b7a;
  box-shadow: 0 2px 4px rgba(237, 100, 166, 0.15);
}

.label-sub {
  background: linear-gradient(to bottom, #e6f4ff, #b4d9f8);
  color: #2c5a9e;
  box-shadow: 0 2px 4px rgba(66, 153, 225, 0.15);
}

/* ラベルのホバーエフェクト */
.label:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.label:hover .label-icon {
  opacity: 1;
  transition: opacity 0.2s ease;
}

/* フォーム要素のスタイル */
.form-base {
  width: 100%;
  display: flex;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* ラジオボタングループのレイアウト */
.btn-radio {
  width: 100%;
  display: flex;
  white-space: nowrap;
  box-sizing: border-box;
  margin: 0;
}

:deep(.btn-radio label) {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-color: #e2e8f0 !important;
  color: #4a5568 !important;
}

:deep(.btn-radio label:hover) {
  background-color: #f1f5f9 !important;
  border-color: #cbd5e0 !important;
}

:deep(.btn-radio input[type="radio"]:checked + label) {
  background-color: #e2e8f0 !important;
  border-color: #cbd5e0 !important;
  color: #2d3748 !important;
}

/* スピンボタンのレイアウト */
.gear-spin {
  width: 100% !important;
  margin-bottom: 0;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0;
}

:deep(.gear-spin .form-control) {
  text-align: center;
  padding: 0;
  width: 100%;
  border-color: #e2e8f0;
  color: #4a5568;
}

:deep(.gear-spin .form-control:focus) {
  box-shadow: none;
  border-color: #cbd5e0;
  background-color: #f1f5f9;
}

:deep(.gear-spin .btn) {
  color: #4a5568;
  border-color: #e2e8f0;
  background-color: #f1f5f9;
}

:deep(.gear-spin .btn:hover) {
  background-color: #e2e8f0;
  border-color: #cbd5e0;
  color: #2d3748;
}

/* スロットサイズのラベル */
.slot-label {
  color: #6c757d;
}

/* アイコンのスタイル */
.icon-base {
  position: relative;
  width: 1.2em;
  height: 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ノヴァブラスターアイコンのスタイル */
.nova-blaster-icon {
  position: relative;
  width: 1.2em;
  height: 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.08em;
}

.large-circle-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: -0.1em;
}

.nova-blaster-icon i {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.large-circle {
  font-size: 0.6em;
  color: #b83280;
}

.small-circle {
  font-size: 0.3em;
  color: #b83280;
}

.top-right-circle {
  position: absolute;
  top: -0.7em;
  right: -0.8em;
}

.left-circle {
  margin-right: 0;
}

.label:hover .nova-blaster-icon i {
  opacity: 1;
}

/* 三角形アイコンのスタイル */
.triangle-icon {
  position: relative;
  width: 1.2em;
  height: 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.triangle-icon i {
  position: absolute;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.large-triangle {
  font-size: 1.2em;
  color: #2b6cb0;
}

.small-triangle {
  font-size: 0.7em;
  color: #2b6cb0;
  top: 0.2em;
}

.label:hover .triangle-icon i {
  opacity: 1;
}
</style>

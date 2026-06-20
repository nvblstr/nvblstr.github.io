<template>
  <!-- メインコンテナ -->
  <BContainer fluid="sm">
    <!-- 入力セクション -->
    <div class="input-section">
      <!-- ブキセクション -->
      <BRow class="section-row">
        <BCol class="label label-weapon">
          <i class="bi bi-crosshair label-icon"></i>
          ブキ
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup>
            <!-- ブキのラジオボタン（無印、ネオ） -->
            <BFormRadioGroup
              class="btn-radio"
              v-model="weaponType"
              :options="weaponTypeOptions"
              button-variant="outline-primary"
              size="lg"
              name="weapon-type-radio"
              buttons
            />
          </BFormGroup>
        </BCol>
      </BRow>

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
    <BRow class="mt-4 result-row">
      <BCol>
        <BCard
          :bg-variant="ink > 0 ? 'light' : 'warning'"
          :text-variant="ink > 0 ? 'dark' : 'dark'"
          class="shadow-sm result-card"
        >
          <!-- インクが十分な場合の表示 -->
          <div v-if="ink > 0" class="result-content">
            <div
              class="d-flex align-items-baseline justify-content-center gap-2"
            >
              <strong class="display-5 text-dark">{{ fireNumber }}</strong>
              <span class="fs-5 text-secondary">{{ fireNumberMessage }}</span>
            </div>
            <div class="d-flex flex-column align-items-center gap-1">
              <div class="text-secondary small opacity-75 mb-1">
                ギアパワーによる増加
              </div>
              <div class="bg-primary bg-opacity-10 rounded-pill px-3 py-1">
                <span class="fs-5 text-primary fw-semibold"
                  >+{{ fireNumberIncrement }}</span
                >
                <span class="text-secondary small ms-1">発</span>
              </div>
            </div>
          </div>
          <!-- インクが不足している場合の表示 -->
          <div v-else class="result-content">
            <strong class="fs-5">
              {{ notEnoughMessage1 }}{{ subNumber }}{{ notEnoughMessage2 }}
            </strong>
          </div>
        </BCard>
      </BCol>
    </BRow>

    <BRow v-if="ink > 0" class="recommendation-row">
      <BCol>
        <section class="recommendation-panel">
          <div class="recommendation-header">
            <div>
              <h2>ギア配分の改善候補</h2>
              <p>{{ recommendationSummary }}</p>
            </div>
            <span class="current-slots">現在 {{ currentGearPowerCost }}GP</span>
          </div>

          <dl class="recommendation-conditions" aria-label="計算条件">
            <div
              v-for="condition in recommendationConditions"
              :key="condition.label"
              class="condition-chip"
            >
              <dt>{{ condition.label }}</dt>
              <dd>{{ condition.value }}</dd>
            </div>
          </dl>

          <div v-if="recommendedGears.length > 0" class="recommendation-list">
            <button
              v-for="candidate in recommendedGears"
              :key="candidate.id"
              class="recommendation-item"
              type="button"
              @click="applyRecommendedGear(candidate)"
            >
              <span class="candidate-rank">{{ candidate.rank }}</span>
              <span class="candidate-shot">
                {{ candidate.fireNumber }}発
                <template v-if="candidate.fireNumber !== fireNumber">
                  / +{{ candidate.fireNumber - fireNumber }}
                </template>
              </span>
              <span class="candidate-gear">
                <span class="candidate-gear-label">メイン</span>
                <span class="candidate-gear-values">
                  大{{ candidate.gearMainL }} 小{{ candidate.gearMainS }}
                </span>
              </span>
              <span class="candidate-gear">
                <span class="candidate-gear-label">サブ</span>
                <span class="candidate-gear-values">
                  大{{ candidate.gearSubL }} 小{{ candidate.gearSubS }}
                </span>
              </span>
              <span class="candidate-slots">
                {{ candidate.gearPowerCost }}GP
                <template
                  v-if="currentGearPowerCost !== candidate.gearPowerCost"
                >
                  / -{{ currentGearPowerCost - candidate.gearPowerCost }}
                </template>
              </span>
            </button>
          </div>

          <div v-else class="recommendation-empty">
            現在のGP以下で同等以上に撃てる候補はありません。
          </div>
        </section>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useDarkMode } from "../composables/useDarkMode";
import {
  type SubNumber,
  type UniqueGear,
  type WeaponType,
  type GearCandidate,
  type RecommendationCondition,
  FIRE_NUMBER_MESSAGE,
  NOT_ENOUGH_MESSAGE_1,
  NOT_ENOUGH_MESSAGE_2,
  MAIN_COST_BASE,
  RECOMMENDATION_LIMIT,
  WEAPON_TYPE_OPTIONS,
  SUB_NUMBER_OPTIONS,
  UNIQUE_GEAR_OPTIONS,
} from "../types/calculator";
import {
  calcSubCostBase,
  calcGearPowerIncrementByType,
  calcGearLLimit,
  calcMainCost,
  calcSubCost,
  calcFireNumber,
  getOptionText,
  generateGearCandidates,
} from "../lib/calculator";

// ===== リアクティブな状態（コンポーネントスコープ） =====
const weaponType = ref<WeaponType>("normal");
const subNumber = ref<SubNumber>(0);
const uniqueGear = ref<UniqueGear>("none");
const gearMainL = ref<number>(0);
const gearMainS = ref<number>(0);
const gearSubL = ref<number>(0);
const gearSubS = ref<number>(0);

// ===== オプション設定 =====
const weaponTypeOptions = WEAPON_TYPE_OPTIONS;
const subNumberOptions = SUB_NUMBER_OPTIONS;
const uniqueGearOptions = UNIQUE_GEAR_OPTIONS;

// ===== Computed: 基本値 =====
const subCostBase = computed((): number => calcSubCostBase(weaponType.value));

const calcGearPowerIncrement = computed((): number =>
  calcGearPowerIncrementByType(uniqueGear.value),
);

const gearLLimit = computed((): number => calcGearLLimit(uniqueGear.value));

// ===== Computed: ギアパワー57表記 =====
const gearMain57 = computed(
  (): number =>
    10 * gearMainL.value + 3 * gearMainS.value + calcGearPowerIncrement.value,
);

const gearSub57 = computed(
  (): number =>
    10 * gearSubL.value + 3 * gearSubS.value + calcGearPowerIncrement.value,
);

// ===== Computed: インク消費量 =====
const mainCost = computed((): number => calcMainCost(gearMain57.value));

const subCost = computed((): number =>
  calcSubCost(weaponType.value, subCostBase.value, gearSub57.value),
);

// ===== Computed: 発射回数・インク =====
const fireNumber = computed((): number =>
  calcFireNumber(mainCost.value, subCost.value, subNumber.value),
);

const fireNumberIncrement = computed((): number => {
  const baseFireNumber = calcFireNumber(
    MAIN_COST_BASE,
    subCostBase.value,
    subNumber.value,
  );
  return fireNumber.value - baseFireNumber;
});

const ink = computed((): number => 1 - subCost.value * subNumber.value);

// ===== Computed: スロット・GP =====
const currentLargeSlots = computed(
  (): number => gearMainL.value + gearSubL.value,
);

const currentSmallSlots = computed(
  (): number => gearMainS.value + gearSubS.value,
);

const currentGearPowerCost = computed(
  (): number => currentLargeSlots.value * 10 + currentSmallSlots.value * 3,
);

// ===== Computed: 推奨ギア =====
const recommendedGears = computed((): GearCandidate[] => {
  if (currentGearPowerCost.value === 0 || ink.value <= 0) {
    return [];
  }

  return generateGearCandidates(
    weaponType.value,
    uniqueGear.value,
    subNumber.value,
    fireNumber.value,
    currentGearPowerCost.value,
    gearSubL.value,
    gearSubS.value,
  ).slice(0, RECOMMENDATION_LIMIT);
});

const recommendationSummary = computed((): string => {
  if (recommendedGears.value.length > 0) {
    return `${fireNumber.value}発以上 / ${currentGearPowerCost.value}GP以下`;
  }
  return `${fireNumber.value}発以上 / ${currentGearPowerCost.value}GP以下で比較`;
});

const recommendationConditions = computed((): RecommendationCondition[] => [
  {
    label: "ブキ",
    value: getOptionText(weaponTypeOptions, weaponType.value),
  },
  {
    label: "サブ回数",
    value: `${subNumber.value}回`,
  },
  {
    label: "特殊ギア",
    value: getOptionText(uniqueGearOptions, uniqueGear.value),
  },
  {
    label: "探索対象",
    value:
      subNumber.value === 0
        ? "メインのみ（サブ固定）"
        : "メイン効率 + サブ効率",
  },
]);

// ===== Actions =====
const applyRecommendedGear = (candidate: GearCandidate): void => {
  gearMainL.value = candidate.gearMainL;
  gearMainS.value = candidate.gearMainS;
  gearSubL.value = candidate.gearSubL;
  gearSubS.value = candidate.gearSubS;
};

// ===== 表示メッセージ =====
const fireNumberMessage = FIRE_NUMBER_MESSAGE;
const notEnoughMessage1 = NOT_ENOUGH_MESSAGE_1;
const notEnoughMessage2 = NOT_ENOUGH_MESSAGE_2;

// ===== Watch: ダークモード切替 =====
const { setDarkMode } = useDarkMode();

watch(
  weaponType,
  (newValue) => {
    setDarkMode(newValue === "neo");
  },
  { flush: "sync" },
);

// ===== Watch: スロット値の連動調整 =====
// 小スロット: gearMainS + gearSubS <= 9
// 一方が増加して上限超過時、もう一方を減らす
watch(gearMainS, (newVal, oldVal) => {
  if (oldVal == null) return;
  if (newVal > oldVal && newVal + gearSubS.value > 9) {
    gearSubS.value = Math.max(0, 9 - newVal);
  }
}, { flush: 'sync' });

watch(gearSubS, (newVal, oldVal) => {
  if (oldVal == null) return;
  if (newVal > oldVal && gearMainS.value + newVal > 9) {
    gearMainS.value = Math.max(0, 9 - newVal);
  }
}, { flush: 'sync' });

// 大スロット: gearMainL + gearSubL <= gearLLimit
watch(gearMainL, (newVal, oldVal) => {
  if (oldVal == null) return;
  if (newVal > oldVal && newVal + gearSubL.value > gearLLimit.value) {
    gearSubL.value = Math.max(0, gearLLimit.value - newVal);
  }
}, { flush: 'sync' });

watch(gearSubL, (newVal, oldVal) => {
  if (oldVal == null) return;
  if (newVal > oldVal && gearMainL.value + newVal > gearLLimit.value) {
    gearMainL.value = Math.max(0, gearLLimit.value - newVal);
  }
}, { flush: 'sync' });

// 特殊ギア変更時にスロット値が上限を超えないよう調整
watch(gearLLimit, (newLimit, oldLimit) => {
  if (oldLimit == null) return;
  const total = gearMainL.value + gearSubL.value;
  if (total > newLimit) {
    if (gearMainL.value >= gearSubL.value) {
      gearMainL.value = Math.max(0, newLimit - gearSubL.value);
    } else {
      gearSubL.value = Math.max(0, newLimit - gearMainL.value);
    }
  }
}, { flush: 'sync' });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 入力セクション
 * フォーム要素を含むメインの入力エリア
 * 上部に余白を設定し、幅をコンテナに合わせる
 */
.input-section {
  padding-top: 0.75rem;
}

/* 結果表示セクションのカスタムスタイル */
.border-dashed {
  border-style: dashed !important;
}

/* レスポンシブ対応 */
@media (max-width: 576px) {
  .container-sm {
    max-width: 100%;
    padding-right: 0.45rem;
    padding-left: 0.45rem;
    overflow: hidden;
  }

  :deep(.row) {
    --bs-gutter-x: 0.45rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .fs-5 {
    font-size: 0.9rem !important;
  }

  .input-section {
    padding-top: 0.25rem !important;
  }

  .section-row {
    margin-top: 0.34rem !important;
    margin-bottom: 0.18rem !important;
  }

  .label {
    min-height: 27px !important;
    font-size: 13.5px !important;
    padding: 0.18em 0.52em !important;
    gap: 0.4rem !important;
    line-height: 1.15 !important;
  }

  :deep(.btn-radio .btn) {
    min-width: 0;
    flex-basis: 0;
    min-height: 28px;
    --bs-btn-padding-y: 0.18rem;
    --bs-btn-padding-x: 0.35rem;
    --bs-btn-font-size: 0.88rem;
    line-height: 1.15;
  }

  :deep(.gear-spin.btn-group-lg) {
    height: 38px !important;
  }

  :deep(.gear-spin) {
    min-height: 38px !important;
    height: 38px !important;
  }

  :deep(.gear-spin .btn),
  :deep(.gear-spin .form-control) {
    min-height: 38px !important;
    height: 38px !important;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    font-size: 0.9rem;
    line-height: 1.15;
  }

  :deep(.gear-spin .btn) {
    flex: 0 0 30px;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }

  :deep(.gear-spin .form-control) {
    min-width: 0;
  }

  .slot-label {
    font-size: 0.72rem !important;
    line-height: 1.1 !important;
  }

  .result-row {
    margin-top: 0.45rem !important;
  }

  .result-card {
    height: 82px !important;
  }

  .result-card :deep(.card-body) {
    padding: 0.42rem !important;
  }

  .result-content {
    gap: 0.08rem;
  }

  :deep(.result-content .display-5) {
    font-size: 1.55rem;
    line-height: 1.05;
  }

  :deep(.result-content .gap-2) {
    gap: 0.32rem !important;
  }

  :deep(.result-content .gap-1) {
    gap: 0.05rem !important;
  }

  :deep(.result-content .mb-1) {
    margin-bottom: 0 !important;
  }

  :deep(.result-content .px-3) {
    padding-right: 0.6rem !important;
    padding-left: 0.6rem !important;
  }

  :deep(.result-content .py-1) {
    padding-top: 0.04rem !important;
    padding-bottom: 0.04rem !important;
  }

  :deep(.result-content .small) {
    font-size: 0.68rem;
    line-height: 1.1;
  }
}

/* セクション間の間隔
 * 各セクション間に一定の間隔を設定
 */
.section-row {
  margin-top: 0.75rem;
  margin-bottom: 0.4rem;
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
  background: linear-gradient(to bottom, var(--label-number-bg-from), var(--label-number-bg-to));
  color: var(--label-number-text);
  box-shadow: 0 2px 4px var(--label-number-shadow);
}

.label-weapon {
  background: linear-gradient(to bottom, var(--label-weapon-bg-from), var(--label-weapon-bg-to));
  color: var(--label-weapon-text);
  box-shadow: 0 2px 4px var(--label-weapon-shadow);
}

.label-unique {
  background: linear-gradient(to bottom, var(--label-unique-bg-from), var(--label-unique-bg-to));
  color: var(--label-unique-text);
  box-shadow: 0 2px 4px var(--label-unique-shadow);
}

.label-main {
  background: linear-gradient(to bottom, var(--label-main-bg-from), var(--label-main-bg-to));
  color: var(--label-main-text);
  box-shadow: 0 2px 4px var(--label-main-shadow);
}

.label-sub {
  background: linear-gradient(to bottom, var(--label-sub-bg-from), var(--label-sub-bg-to));
  color: var(--label-sub-text);
  box-shadow: 0 2px 4px var(--label-sub-shadow);
}

/* ラベルのホバーエフェクト */
/* .label:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
} */

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
  min-width: 0;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  border-color: var(--color-border) !important;
  color: var(--color-text-secondary) !important;
}

:deep(.btn-radio label:hover) {
  background-color: var(--color-bg-tertiary) !important;
  border-color: var(--color-border-hover) !important;
}

:deep(.btn-radio input[type="radio"]:checked + label) {
  background-color: var(--color-border) !important;
  border-color: var(--color-border-hover) !important;
  color: var(--color-text-primary) !important;
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
  border-color: var(--color-border);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-primary);
}

:deep(.gear-spin .form-control:focus) {
  box-shadow: none;
  border-color: var(--color-border-hover);
  background-color: var(--color-bg-tertiary);
}

:deep(.gear-spin .btn) {
  color: var(--color-text-secondary);
  border-color: var(--color-border);
  background-color: var(--color-bg-tertiary);
}

:deep(.gear-spin .btn:hover) {
  background-color: var(--color-border);
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

/* スロットサイズのラベル */
.slot-label {
  color: var(--color-text-subtle);
  text-align: center;
  display: block;
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
  color: var(--color-icon-pink);
}

.small-circle {
  font-size: 0.3em;
  color: var(--color-icon-pink);
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
  color: var(--color-icon-blue);
}

.small-triangle {
  font-size: 0.7em;
  color: var(--color-icon-blue);
  top: 0.2em;
}

.label:hover .triangle-icon i {
  opacity: 1;
}

/* 結果表示カードのスタイル */
.result-card {
  height: 150px;
}

.result-card :deep(.card-body) {
  height: 100%;
  padding: 1.5rem;
}

.result-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.recommendation-row {
  margin-top: 0.9rem;
  margin-bottom: 1.5rem;
}

.recommendation-panel {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.85rem;
  background: var(--color-bg-primary);
}

.recommendation-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.recommendation-header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
}

.recommendation-header p {
  margin: 0.12rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  line-height: 1.35;
}

.current-slots {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

.recommendation-conditions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.4rem;
  margin: 0 0 0.65rem;
}

.condition-chip {
  min-width: 0;
  border-radius: 6px;
  padding: 0.38rem 0.45rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.condition-chip dt {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.15;
}

.condition-chip dd {
  margin: 0.12rem 0 0;
  color: var(--color-text-primary);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 0.45rem;
}

.recommendation-item {
  display: grid;
  grid-template-columns: 1.35rem 0.9fr 1fr 1fr 1fr;
  align-items: center;
  column-gap: 0.28rem;
  width: 100%;
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.45rem 0.55rem;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  text-align: left;
}

.recommendation-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-tertiary);
}

.candidate-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background: var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
}

.candidate-shot {
  color: var(--color-accent-blue);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.2;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
}

.candidate-gear,
.candidate-slots {
  font-size: 0.82rem;
  line-height: 1.2;
  min-width: 0;
  text-align: center;
}

.candidate-gear {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 0.25em;
  row-gap: 0;
}

.candidate-gear-label,
.candidate-gear-values {
  display: inline-block;
}

.candidate-gear-label {
  flex: 0 0 3em;
}

.candidate-gear-values {
  flex: 0 0 auto;
  white-space: nowrap;
}

.candidate-slots {
  justify-self: end;
  text-align: right;
  color: var(--color-accent-green);
  font-weight: 700;
}

.recommendation-empty {
  border-radius: 6px;
  padding: 0.7rem;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  font-size: 0.86rem;
  line-height: 1.4;
  text-align: center;
}

@media (max-width: 576px) {
  .recommendation-row {
    margin-top: 0.55rem;
    margin-bottom: 0.75rem;
  }

  .recommendation-panel {
    padding: 0.58rem;
  }

  .recommendation-header {
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.48rem;
  }

  .recommendation-header h2 {
    font-size: 0.9rem;
  }

  .recommendation-header p,
  .current-slots {
    font-size: 0.68rem;
  }

  .recommendation-conditions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.32rem;
    margin-bottom: 0.48rem;
  }

  .condition-chip {
    padding: 0.32rem 0.38rem;
  }

  .condition-chip dt {
    font-size: 0.58rem;
  }

  .condition-chip dd {
    font-size: 0.68rem;
  }

  .recommendation-list {
    grid-template-columns: 1fr;
    gap: 0.32rem;
  }

  .recommendation-item {
    grid-template-columns: 1.15rem 0.9fr 1fr 1fr 1fr;
    column-gap: 0.18rem;
    min-height: 38px;
    padding: 0.28rem 0.36rem;
  }

  .candidate-rank {
    width: 1rem;
    height: 1rem;
    font-size: 0.54rem;
  }

  .candidate-shot {
    font-size: 0.63rem;
    line-height: 1.12;
  }

  .candidate-gear,
  .candidate-slots {
    font-size: 0.58rem;
    line-height: 1.12;
  }
}

@media (min-width: 577px) and (max-height: 800px) {
  .input-section {
    padding-top: 0.4rem;
  }

  .section-row {
    margin-top: 0.5rem;
    margin-bottom: 0.28rem;
  }

  .result-row {
    margin-top: 1rem !important;
  }

  .result-card {
    height: 132px;
  }

  .result-card :deep(.card-body) {
    padding: 1rem;
  }
}
</style>

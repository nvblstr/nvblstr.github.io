<template>
  <b-container id="container" fluid="xs">
    <b-row>
      <b-col class="label label-normal">サブ回数</b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            class="btn-radio"
            v-model="subNumber"
            :options="subNumberOptions"
            :aria-describedby="ariaDescribedby"
            button-variant="outline-primary"
            size="lg"
            name="radio-btn-outline"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="label label-normal">特殊ギア</b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            class="btn-radio"
            v-model="uniqueGear"
            :options="uniqueGearOptions"
            :aria-describedby="ariaDescribedby"
            button-variant="outline-primary"
            size="lg"
            name="radio-btn-outline"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="label label-main">メイン効率</b-col>
    </b-row>
    <b-row>
      <b-col class="col-justify">
        <b-form-spinbutton
          class="gear-spin"
          v-model="gearMainL"
          min="0"
          :max=gearLLimit
          size="lg"
          inline
        ></b-form-spinbutton>
        <b-form-spinbutton
          class="gear-spin"
          v-model="gearMainS"
          min="0"
          max="9"
          size="lg"
          inline
        ></b-form-spinbutton>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="label label-sub">サブ効率</b-col>
    </b-row>
    <b-row>
      <b-col class="col-justify">
        <b-form-spinbutton
          class="gear-spin"
          v-model="gearSubL"
          min="0"
          :max=gearLLimit
          size="lg"
          inline
        ></b-form-spinbutton>
        <b-form-spinbutton
          class="gear-spin"
          v-model="gearSubS"
          min="0"
          max="9"
          size="lg"
          inline
        ></b-form-spinbutton>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">大</b-col>
      <b-col cols="6">小</b-col>
    </b-row>
    <b-row>
      <b-col class="result">
        <div v-if="ink > 0">
          <strong>
            {{ fireNumber }}{{ fireNumberMessage }}(+{{ fireNumberIncrement }})
          </strong>
        </div>
        <div v-else>
          <strong>
            {{ notEnoughMessage1 }}{{ subNumber }}{{ notEnoughMessage2 }}
          </strong>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Calculator",
  data() {
    return {
      fireNumberMessage: "発撃てます",
      notEnoughMessage1: "今のギアパワーでは",
      notEnoughMessage2: "回サブが使えません",
      subNumber: 0,
      subNumberOptions: [
        { text: "0", value: 0 },
        { text: "1", value: 1 },
        { text: "2", value: 2 },
      ],
      uniqueGear: "none",
      uniqueGearOptions: [
        { text: "なし", value: "none" },
        { text: "カムバ", value: "comeback" },
        { text: "ラスパ", value: "lastspurt" },
      ],
      gearMainL: 0,
      gearMainS: 0,
      gearSubL: 0,
      gearSubS: 0,
    };
  },

  computed: {
    gearMain57: function() {
      return (
        10 * this.gearMainL +
        3 * this.gearMainS +
        this.calcGearPowerIncrement(this.uniqueGear)
      );
    },
    gearSub57: function() {
      return (
        10 * this.gearSubL +
        3 * this.gearSubS +
        this.calcGearPowerIncrement(this.uniqueGear)
      );
    },
    mainCost: function() {
      return (
        (1 -
          0.5 *
            (0.033 * this.gearMain57 - 0.00027 * this.gearMain57 ** 2) **
              (Math.log(0.6) / Math.log(0.5))) *
        0.075
      );
    },
    subCost: function() {
      return (
        (1 - 0.35 * (0.033 * this.gearSub57 - 0.00027 * this.gearSub57 ** 2)) *
        0.7
      );
    },
    fireNumber: function() {
      return this.calcFireNumber(this.mainCost, this.subCost, this.subNumber);
    },
    fireNumberIncrement: function() {
      return this.calcFireNumberIncrement();
    },
    ink: function() {
      return 1 - this.subCost * this.subNumber;
    },
    gearLLimit: function() {
      if (this.uniqueGear == "none") {
        return 3;
      } else {
        return 2;
      }
    },
  },

  methods: {
    calcFireNumber: function(mainCost, subCost, subNumber) {
      return Math.floor((1 - subCost * subNumber) / mainCost);
    },
    calcFireNumberIncrement: function() {
      if (this.calcFireNumber(0.075, 0.7, this.subNumber) >= 0) {
        return (
          this.fireNumber - this.calcFireNumber(0.075, 0.7, this.subNumber)
        );
      } else {
        return this.fireNumber;
      }
    },
    calcGearPowerIncrement: function(uniqueGear) {
      if (uniqueGear == "none") {
        return 0;
      } else if (uniqueGear == "comeback") {
        return 10;
      } else if (uniqueGear == "lastspurt") {
        return 24;
      }
    },
  },
  watch: {
    gearMainL: function() {
      if (Number(this.gearMainL) + Number(this.gearSubL) > this.gearLLimit) {
        this.gearSubL = this.gearSubL - 1;
      }
    },
    gearSubL: function() {
      if (Number(this.gearMainL) + Number(this.gearSubL) > this.gearLLimit) {
        this.gearMainL = this.gearMainL - 1;
      }
    },
    gearMainS: function() {
      if (Number(this.gearMainS) + Number(this.gearSubS) > 9) {
        this.gearSubS = this.gearSubS - 1;
      }
    },
    gearSubS: function() {
      if (Number(this.gearMainS) + Number(this.gearSubS) > 9) {
        this.gearMainS = this.gearMainS - 1;
      }
    },
    gearLLimit: function() {
      if (Number(this.gearMainL) + Number(this.gearSubL) > this.gearLLimit) {
        if (Number(this.gearMainL) > Number(this.gearSubL)) {
          this.gearMainL = this.gearMainL - 1;
        } else {
          this.gearSubL = this.gearSubL - 1;
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.row {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2px;
  max-width: 400px;
}
.label {
  text-align: left;
  margin-top: 2px;
  font-size: 20px;
}
.label-normal {
  padding: 0.25em 0.5em;/*上下 左右の余白*/
  background: transparent;/*背景透明に*/
  border-left: solid 6px teal;/*左線*/
}
.label-main {
  padding: 0.25em 0.5em;/*上下 左右の余白*/
  background: transparent;/*背景透明に*/
  border-left: solid 6px #ee7a76;/*左線*/
}
.label-sub {
  padding: 0.25em 0.5em;/*上下 左右の余白*/
  background: transparent;/*背景透明に*/
  border-left: solid 6px #7db4e6;/*左線*/
}

.result strong {
  background: linear-gradient(transparent 60%, #ffff66 60%);
  font-size: 1.5em;
}
.btn-radio {
  width: 100%;
  display: flex;
}
.gear-spin {
  width: 49% !important;
}
.col-justify {
  display: flex;
  justify-content: space-between;
}
::v-deep .btn-radio label {
  display: flex;
  flex: 1;
}
::v-deep .btn-radio span {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
::v-deep .btn-radio input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}
</style>

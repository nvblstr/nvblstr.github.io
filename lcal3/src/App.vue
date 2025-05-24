<template>
  <div id="lcalc">
    <img alt="LunaCalculator" src="./assets/LunaCalculator3.png" />
    <Calculator />
  </div>
</template>

<script setup lang="ts">
import Calculator from "./components/Calculator.vue";
</script>

<style>
#lcalc {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 20px;
}

#lcalc img {
  width: 320px;
  max-width: 100%;
  height: auto;
}
</style>

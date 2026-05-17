<template>
  <div id="app">
    <h1>LunaCalculator</h1>
    <h2>(ノヴァ計算機)</h2>
    <a class="latest-link" href="/">スプラ3用はこちら</a>
    <Calculator />
  </div>
</template>

<script setup>
import Calculator from './components/Calculator.vue'
</script>

<style>
#app {
  text-align: center;
  margin-top: 20px;
}

.latest-link {
  position: fixed;
  top: 0.5rem;
  right: 0.75rem;
  z-index: 10;
  color: teal;
  font-size: 0.75rem;
  text-decoration: none;
}

.latest-link:hover {
  text-decoration: underline;
}
</style>

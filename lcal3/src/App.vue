<template>
  <Header />
  <Calculator />
</template>

<script setup lang="ts">
import Calculator from "./components/Calculator.vue";
import Header from "./components/Header.vue";
</script>

<style>
:root {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

[data-bs-theme="dark"] {
  color: #e2e8f0;
}
</style>

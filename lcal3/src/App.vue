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
  color: var(--color-text-primary);
}

body {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

@media (max-width: 576px) {
  body {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }
}
</style>

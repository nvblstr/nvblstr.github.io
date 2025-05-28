<template>
  <header class="header">
    <img :src="titleImage" alt="Lcal3" class="title-image" />
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "../composables/useDarkMode";
import titleImageLight from "../assets/title-light.png";
import titleImageDark from "../assets/title-dark.png";

const { isDarkMode } = useDarkMode();

const titleImage = computed(() => {
  return isDarkMode.value ? titleImageDark : titleImageLight;
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.title-image {
  max-width: 100%;
  height: auto;
}
</style>

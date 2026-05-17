<template>
  <header class="header">
    <div
      class="title-image-frame"
      :class="{ 'is-dark': isDarkMode }"
      role="img"
      aria-label="Lcal3"
    >
      <img :src="titleImageLight" alt="" class="title-image title-image-light" />
      <img :src="titleImageDark" alt="" class="title-image title-image-dark" />
    </div>
    <a class="classic-link" href="/lcal/">スプラ2用はこちら</a>
  </header>
</template>

<script setup lang="ts">
import { useDarkMode } from "../composables/useDarkMode";
import titleImageLight from "../assets/title-light.png";
import titleImageDark from "../assets/title-dark.png";

const { isDarkMode } = useDarkMode();
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.title-image-frame {
  display: grid;
  max-width: 100%;
}

.title-image {
  grid-area: 1 / 1;
  max-width: 100%;
  height: auto;
  opacity: 0;
}

.title-image-light {
  opacity: 1;
  z-index: 1;
}

.title-image-dark {
  z-index: 2;
}

.title-image-frame.is-dark .title-image-light {
  opacity: 0;
}

.title-image-frame.is-dark .title-image-dark {
  opacity: 1;
}

.classic-link {
  position: fixed;
  top: 0.5rem;
  right: 0.75rem;
  z-index: 10;
  color: var(--bs-secondary-color);
  font-size: 0.75rem;
  text-decoration: none;
}

.classic-link:hover {
  text-decoration: underline;
}
</style>

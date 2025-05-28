import { ref, watch } from "vue";

// シングルトンとして状態を保持
const isDarkMode = ref(
  document.documentElement.getAttribute("data-bs-theme") === "dark"
);

export function useDarkMode() {
  const toggle = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  // isDarkModeの変更を監視してDOMを更新
  watch(isDarkMode, (newValue) => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      newValue ? "dark" : "light"
    );
  });

  return {
    isDarkMode,
    toggle,
  };
}

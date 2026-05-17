import { ref } from "vue";

// シングルトンとして状態を保持
const isDarkMode = ref(
  document.documentElement.getAttribute("data-bs-theme") === "dark"
);

const applyDarkMode = (value: boolean) => {
  document.documentElement.setAttribute(
    "data-bs-theme",
    value ? "dark" : "light"
  );
};

export function useDarkMode() {
  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value;
    applyDarkMode(value);
  };

  const toggle = () => {
    setDarkMode(!isDarkMode.value);
  };

  return {
    isDarkMode,
    setDarkMode,
    toggle,
  };
}

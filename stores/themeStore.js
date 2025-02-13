export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const showOverlay = ref(false);

  const toggleTheme = () => {
    showOverlay.value = true;
    setTimeout(() => {
      isDark.value = !isDark.value;
      if (isDark.value) {
        document.body.classList.add("dark");
        sessionStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        sessionStorage.setItem("theme", "light");
      }
      showOverlay.value = false;
    }, 3000);
  };

  const loadTheme = () => {
    const savedTheme = sessionStorage.getItem("theme");
    isDark.value = savedTheme === "dark";
    if (isDark.value) {
      document.body.classList.add("dark");
    }
  };

  return {
    isDark,
    showOverlay,
    toggleTheme,
    loadTheme,
  };
});

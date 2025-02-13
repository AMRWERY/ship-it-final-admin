export default defineNuxtPlugin((nuxtApp) => {
  const applyStoredLocale = () => {
    const storedLocale = sessionStorage.getItem("locale") || "en";
    const { locale } = nuxtApp.$i18n;
    if (locale.value !== storedLocale) {
      locale.value = storedLocale;
      document.documentElement.lang = storedLocale;
      document.documentElement.dir = storedLocale === "ar" ? "rtl" : "ltr";
    }
  };

  // Apply the stored locale immediately when the plugin runs
  applyStoredLocale();

  nuxtApp.hook("page:finish", () => {
    applyStoredLocale();
  });
});

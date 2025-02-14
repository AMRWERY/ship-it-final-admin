export default defineNuxtPlugin((nuxtApp) => {
  const applyStoredLocale = () => {
    const storedLocale = sessionStorage.getItem("locale") || "en";
    const i18n = nuxtApp.$i18n;
    if (i18n.locale !== storedLocale) {
      i18n.setLocale(storedLocale); // Use setLocale method
      document.documentElement.lang = storedLocale;
      document.documentElement.dir = storedLocale === "ar" ? "rtl" : "ltr";
    }
  };

  applyStoredLocale();
  nuxtApp.hook("page:finish", () => {
    applyStoredLocale();
  });
});

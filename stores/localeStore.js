export const useLocaleStore = defineStore("locales", {
  state: () => ({
    // locale: "en",
    locale: process.client ? (sessionStorage.getItem("locale") || "en") : "en",
    isOverlayVisible: false,
  }),

  actions: {
    updateLocale(value) {
      this.isOverlayVisible = true;
      this.locale = value;
      if (process.client) {
        sessionStorage.setItem("locale", value);
      }
      setTimeout(() => {
        this.isOverlayVisible = false;
      }, 3000);
    },

    loadLocale() {
      if (process.client) {
        this.locale = sessionStorage.getItem("locale") || "en";
      }
    },
  },

  getters: {
    isRTL(state) {
      return state.locale === "ar";
    },
  },
});

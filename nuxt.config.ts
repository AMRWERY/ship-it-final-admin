// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@vee-validate/nuxt",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
  ],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    viewer: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  veeValidate: {
    autoImports: true,
  },
  i18n: {
    vueI18n: "./i18n.config.js",
    locales: ["en", "ar"],
    defaultLocale: "en",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: "en",
      redirectOn: "all",
    },
  },
  plugins: ["~/plugins/locale.client.js"],
  css: ["~/assets/css/main.css", "~/assets/css/google-fonts.css"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      title: "Ship-IT",
      script: [{}],
      noscript: [],
      link: [{}],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});

import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    nuxtApp.vueApp.use(VueApexCharts);
  }
});

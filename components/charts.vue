<template>
  <div>
    <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
const { t } = useI18n()

defineProps({
  totalOrders: {
    type: Number,
    required: true,
  },
  totalInventory: {
    type: Number,
    required: true,
  },
  totalCustomers: {
    type: Number,
    required: true,
  }
});

const generateDayWiseTimeSeries = (baseval, count, yrange) => {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = baseval;
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({ x, y });
    baseval += 86400000;
    i++;
  }
  return series;
};

const series = computed(() => [
  {
    name: t('dashboard.orders_placed'),
    data: generateDayWiseTimeSeries(
      new Date("11 Jan 2025 GMT").getTime(),
      20,
      { min: 10, max: 60 }
    ),
  },
  {
    name: t('dashboard.inventory'),
    data: generateDayWiseTimeSeries(
      new Date("11 Jan 2025 GMT").getTime(),
      20,
      { min: 10, max: 20 }
    ),
  },
  {
    name: t('dashboard.total_users'),
    data: generateDayWiseTimeSeries(
      new Date("11 Jan 2025 GMT").getTime(),
      20,
      { min: 10, max: 15 }
    ),
  },
]);

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDark);

const chartOptions = computed(() => {
  return {
    chart: {
      type: "area",
      height: 350,
      stacked: true,
      toolbar: { show: false },
      events: {
        selection: function (chart, e) {
          console.log(new Date(e.xaxis.min));
        },
      },
    },
    colors: isDarkMode.value
      ? ["#66B2FF", "#66FF99", "#CCCCCC"]
      : ["#008FFB", "#00E396", "#CED4DC"],
    dataLabels: { enabled: false },
    stroke: { curve: "monotoneCubic" },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.6, opacityTo: 0.8 },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: isDarkMode.value ? "#ffffff" : "#333333",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: isDarkMode.value ? "#ffffff" : "#333333",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode.value ? "#ffffff" : "#333333",
        },
      },
    },
    tooltip: {
      theme: isDarkMode.value ? "dark" : "light",
      style: {
        fontSize: "12px",
      },
    },
  };
});
</script>
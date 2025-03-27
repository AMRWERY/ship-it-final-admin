<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
    <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.revenue_metrics') }}</h3>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Total Revenue -->
      <div class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-green-700 dark:text-green-400">{{ $t('dashboard.total_revenue') }}</span>
          <icon name="material-symbols:payments" class="text-green-600 dark:text-green-400" />
        </div>
        <p class="mt-2 text-2xl font-semibold text-green-700 dark:text-green-400">
          {{ $n(totalRevenue, 'currency', currencyLocale) }}
        </p>
      </div>

      <!-- Average Order Value -->
      <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ $t('dashboard.avg_order_value') }}</span>
          <icon name="material-symbols:trending-up" class="text-blue-600 dark:text-blue-400" />
        </div>
        <p class="mt-2 text-2xl font-semibold text-blue-700 dark:text-blue-400">
          {{ $n(averageOrderValue, 'currency', currencyLocale) }}
        </p>
      </div>

      <!-- Revenue Growth -->
      <div class="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-purple-700 dark:text-purple-400">{{ $t('dashboard.revenue_growth') }}</span>
          <icon name="material-symbols:trending-up" class="text-purple-600 dark:text-purple-400" />
        </div>
        <p class="mt-2 text-2xl font-semibold text-purple-700 dark:text-purple-400">
          {{ revenueGrowth }}%
        </p>
      </div>

      <!-- Monthly Revenue -->
      <div class="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-orange-700 dark:text-orange-400">{{ $t('dashboard.monthly_revenue') }}</span>
          <icon name="material-symbols:calendar-month" class="text-orange-600 dark:text-orange-400" />
        </div>
        <p class="mt-2 text-2xl font-semibold text-orange-700 dark:text-orange-400">
          {{ $n(monthlyRevenue, 'currency', currencyLocale) }}
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
const checkoutStore = useCheckoutStore();
const { currencyLocale } = useCurrencyLocale();

const totalRevenue = computed(() => checkoutStore.totalRevenue || 0);
const averageOrderValue = computed(() => checkoutStore.averageOrderValue || 0);
const revenueGrowth = computed(() => checkoutStore.revenueGrowth || 0);
const monthlyRevenue = computed(() => checkoutStore.monthlyRevenue || 0);

onMounted(() => {
  checkoutStore.fetchRevenueMetrics();
});
</script> 
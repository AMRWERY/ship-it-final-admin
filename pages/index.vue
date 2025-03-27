<template>
  <div>
    <div class="pt-3 pb-6 mx-auto mb-5 max-w-7xl">
      <!-- Quick Actions Section -->
      <div class="mb-6">
        <quick-actions />
      </div>

      <!-- Main Metrics Cards -->
      <div class="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 md:grid-cols-3">
        <!-- Card 1 - Orders -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.orders_placed') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <icon name="material-symbols:shopping-cart-checkout" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-2 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{{ totalCheckouts }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/orders" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details')
            }}</nuxt-link-locale>
          </div>
        </div>

        <!-- Card 2 - Inventory -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.inventory') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <icon name="lucide:boxes" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-2 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{{ inStockCount }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/items-stock" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details')
            }}</nuxt-link-locale>
          </div>
        </div>

        <!-- Card 3 - Customers -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.total_users') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <icon name="ci:users-group" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-2 bg-gray-100 rounded-full cursor-pointer dark:outline dark:outline-1 dark:outline-gray-300 dark:bg-black hover:bg-gray-200">
              <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{{ totalCustomers }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/users" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details')
            }}</nuxt-link-locale>
          </div>
        </div>
      </div>

      <!-- Revenue Metrics Section -->
      <div class="mb-6">
        <revenue-metrics />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
        <!-- Charts Section -->
        <div
          class="h-[440px] col-span-12 bg-white rounded-lg shadow-md md:col-span-8 dark:bg-black dark:border dark:border-gray-100">
          <div class="p-4">
            <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.statistics') }}</h3>
            <div class="h-[calc(100%-3rem)]">
              <charts :totalOrders="totalCheckouts" :totalInventory="inStockCount" :totalCustomers="totalCustomers" />
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-span-12 space-y-4 md:col-span-4">
          <!-- Recent Activity -->
          <recent-activity />

        </div>
      </div>
      <!-- Three Column Grid -->
      <div class="grid grid-cols-3 gap-4">
        <!-- Top Products -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.top_products') }}</h3>
          <div class="h-[200px] overflow-y-auto no-scrollbar">
            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="product in topProducts" :key="product.id" class="flex justify-between py-3">
                <div class="flex min-w-0 gap-x-2">
                  <img class="flex-none rounded-full size-8 bg-gray-50" :src="product.imageUrl1" />
                  <div class="flex-auto min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate dark:text-gray-200">{{ $i18n.locale === 'ar'
                      ? product.titleAr : product.title }}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-100">{{ $n(parseFloat(product.discountedPrice)
                      || 0, 'currency', currencyLocale) }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Top Categories -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.top_categories') }}</h3>
          <div class="h-[200px] overflow-y-auto no-scrollbar">
            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="category in topCategories" :key="category.id" class="flex justify-between py-3">
                <div class="flex items-center gap-2">
                  <icon :name="category.icon" class="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  <span class="text-xs font-medium text-gray-900 dark:text-gray-200">{{ category.name }}</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ category.count }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Current Deals -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
          <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.current_deals') }}</h3>
          <div class="h-[200px] overflow-y-auto no-scrollbar">
            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="deal in currentDeals" :key="deal.id" class="flex justify-between py-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-900 dark:text-gray-200">{{ deal.title }}</span>
                </div>
                <span class="text-xs font-medium text-red-600 dark:text-red-400">{{ deal.discount }}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const checkoutStore = useCheckoutStore();
const userStore = useUserStore();
const productStore = useProductsStore();

onMounted(() => {
  checkoutStore.fetchTotalCheckouts();
  userStore.fetchUsers();
  productStore.fetchProducts();
});

const totalCheckouts = computed(() => checkoutStore.getTotalCheckouts);
const totalCustomers = computed(() => userStore.totalCustomers);
const inStockCount = computed(() => productStore.inStockProducts);
const topProducts = computed(() => productStore.products.slice(0, 6));

// Top Categories with icons
const topCategories = computed(() => [
  { id: 1, name: 'Electronics', count: 150, icon: 'material-symbols:devices' },
  { id: 2, name: 'Fashion', count: 120, icon: 'material-symbols:checkroom' },
  { id: 3, name: 'Home', count: 90, icon: 'material-symbols:home' },
  { id: 4, name: 'Sports', count: 75, icon: 'material-symbols:sports' },
  { id: 5, name: 'Books', count: 60, icon: 'material-symbols:menu-book' },
]);

// Current Deals
const currentDeals = computed(() => [
  { id: 1, title: 'Summer Sale', discount: 30 },
  { id: 2, title: 'Flash Deal', discount: 50 },
  { id: 3, title: 'Weekend Special', discount: 25 },
  { id: 4, title: 'Clearance', discount: 40 },
  { id: 5, title: 'Limited Time', discount: 35 },
]);

//currency composable
const { currencyLocale } = useCurrencyLocale();

definePageMeta({
  layout: "dashboard",
});

useHead({
  titleTemplate: () => t("head.dashboard"),
});
</script>
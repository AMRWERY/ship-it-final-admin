<template>
  <div>
    <div class="py-6 mx-auto mb-5 max-w-7xl sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <!-- Card 1 - Orders -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.orders_placed') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <icon name="material-symbols:shopping-cart-checkout" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-2 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ totalCheckouts }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/orders" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details')
              }}</nuxt-link-locale>
          </div>
        </div>

        <!-- Card 2 - Inventory -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.inventory') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <icon name="lucide:boxes" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-1.5 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ inStockCount }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/items-stock" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details') }}</nuxt-link-locale>
          </div>
        </div>

        <!-- Card 3 - Customers -->
        <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.total_users') }}</h3>
          <div class="flex items-center justify-between mt-4">
            <div
              class="flex items-center justify-center p-1 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <icon name="ci:users-group" class="text-gray-700 h-7 w-7 dark:text-gray-200" />
            </div>
            <div
              class="flex items-center justify-center px-2 bg-gray-100 rounded-full hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600">
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ totalCustomers }}</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link-locale to="/users" type="button" class="px-4 py-2 text-white btn-style">{{
              $t('btn.view_details') }}</nuxt-link-locale>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 py-4 md:grid-cols-12">
        <div class="h-auto col-span-12 bg-white rounded-lg shadow-md md:col-span-9 dark:bg-black">
          <div class="mt-4">
            <!-- charts component -->
            <charts :totalOrders="totalCheckouts" :totalInventory="inStockCount" :totalCustomers="totalCustomers" />
          </div>
        </div>

        <div class="col-span-12 p-4 bg-white rounded-lg shadow-md md:col-span-3 h-[400px] dark:bg-black">
          <h3 class="text-xl font-semibold text-center">{{ $t('dashboard.top_products') }}</h3>
          <div class="h-full overflow-y-auto no-scrollbar">
            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="product in topProducts" :key="product.id" class="flex justify-between py-5 gap-x-6">
                <div class="flex min-w-0 gap-x-4">
                  <img class="flex-none rounded-full size-12 bg-gray-50" :src="product.imageUrl1" />
                  <div class="flex-auto min-w-0">
                    <p class="font-semibold text-gray-900 truncate text-sm/6 dark:text-gray-200">{{ $i18n.locale ===
                      'ar' ? product.titleAr :
                      product.title }}</p>
                    <div class="flex items-center justify-between">
                      <p class="mt-1 text-gray-500 dark:text-gray-100 text-xs/5">{{ $i18n.locale === 'ar' ?
                        product.brandAr :
                        product.brand }}</p>
                      <p class="mt-1 font-semibold text-gray-700 dark:text-gray-200 text-xs/5">{{
                        $n(parseFloat(product.discountedPrice) || 0, 'currency', currencyLocale) }}</p>
                    </div>
                  </div>
                </div>
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

//currency composable
const { currencyLocale } = useCurrencyLocale();

definePageMeta({
  layout: "dashboard",
});

useHead({
  titleTemplate: () => t("head.dashboard"),
});
</script>
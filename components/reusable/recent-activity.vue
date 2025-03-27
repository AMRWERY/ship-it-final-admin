<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
    <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.recent_activity') }}</h3>
    <div class="space-y-4">
      <!-- Recent Orders -->
      <div v-if="recentOrders.length" class="space-y-2">
        <h4 class="font-medium text-gray-700 dark:text-gray-200">{{ $t('dashboard.recent_orders') }}</h4>
        <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center space-x-2">
            <icon name="material-symbols:shopping-cart-checkout" class="text-gray-600 dark:text-gray-300" />
            <span class="text-sm text-gray-600 dark:text-gray-300">#{{ order.orderNumber }}</span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(order.createdAt) }}</span>
        </div>
      </div>

      <!-- Recent Users -->
      <div v-if="recentUsers.length" class="space-y-2">
        <h4 class="font-medium text-gray-700 dark:text-gray-200">{{ $t('dashboard.recent_users') }}</h4>
        <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center space-x-2">
            <icon name="ci:users-group" class="text-gray-600 dark:text-gray-300" />
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ user.name }}</span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.createdAt) }}</span>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      <div v-if="lowStockProducts.length" class="space-y-2">
        <h4 class="font-medium text-red-600 dark:text-red-400">{{ $t('dashboard.low_stock_alerts') }}</h4>
        <div v-for="product in lowStockProducts" :key="product.id" class="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div class="flex items-center space-x-2">
            <icon name="lucide:alert-circle" class="text-red-600 dark:text-red-400" />
            <span class="text-sm text-red-600 dark:text-red-400">{{ product.title }}</span>
          </div>
          <span class="text-sm text-red-600 dark:text-red-400">{{ product.stock }} left</span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
const checkoutStore = useCheckoutStore();
const userStore = useUserStore();
const productStore = useProductsStore();

const recentOrders = computed(() => checkoutStore.recentOrders || []);
const recentUsers = computed(() => userStore.recentUsers || []);
const lowStockProducts = computed(() => productStore.lowStockProducts || []);

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

onMounted(() => {
  checkoutStore.fetchRecentOrders();
  userStore.fetchRecentUsers();
  productStore.fetchLowStockProducts();
});
</script> 
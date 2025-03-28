<template>
  <div>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        class="flex flex-col w-full max-w-4xl bg-white rounded-xl shadow-2xl dark:bg-gray-800 max-h-[90vh] overflow-hidden">
        <!-- Header with close button -->
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {{ $t('dashboard.order_details') }} - {{ order.orderId }}
          </h2>
          <button @click="closeDialog"
            class="p-1 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <icon name="material-symbols:close" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div class="overflow-y-auto no-scrollbar">
          <div v-if="orders?.length" class="flex flex-col gap-4 p-2 md:flex-row">
            <!-- Customer Info Section -->
            <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-600">
              <div class="flex items-center mb-4 space-s-2">
                <icon name="mdi:account" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-300">
                  {{ order.deliveryDetails.name }} {{ $t('dashboard.s_information') }}
                </h3>
              </div>

              <div class="space-y-4">
                <div class="flex items-start space-s-3">
                  <icon name="mdi:email" class="w-5 h-5 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.email') }}</p>
                    <p class="text-base text-gray-700 dark:text-gray-200">{{ order.deliveryDetails.email }}</p>
                  </div>
                </div>

                <div class="flex items-start space-s-3">
                  <icon name="mdi:phone" class="w-5 h-5 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.phone_number') }}
                    </p>
                    <p class="text-base text-gray-700 dark:text-gray-200">{{ order.deliveryDetails.phoneNumber }}</p>
                  </div>
                </div>

                <div class="flex items-start space-s-3">
                  <icon name="mdi:map-marker" class="w-5 h-5 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.location') }}</p>
                    <p class="text-base text-gray-700 dark:text-gray-200">
                      {{ order.deliveryDetails.city }}, {{ order.deliveryDetails.country }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Order Status -->
              <div class="pt-6 mt-8 border-t dark:border-gray-600">
                <div class="flex items-center mb-4">
                  <icon name="mdi:clock-time-four" class="w-5 h-5 text-indigo-600 me-2 dark:text-indigo-400" />
                  <p class="text-base font-medium text-gray-900 dark:text-gray-200">{{ $t('dashboard.current_status')
                  }}:
                    <span class="font-semibold" :class="{
                      'text-green-600 dark:text-green-400': currentStatusText === 'Order Placed',
                      'text-red-600 dark:text-red-400': currentStatusText === 'Processing',
                      'text-blue-600 dark:text-blue-400': ['Shipped', 'Out for Delivery', 'Delivered'].includes(currentStatusText)
                    }">
                      {{ currentStatusText === 'Delivered' ? 'Completed' : currentStatusText }}
                    </span>
                  </p>
                </div>

                <!-- Status Buttons -->
                <p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">{{
                  $t('dashboard.change_order_status') }}</p>
                <div class="flex flex-wrap gap-4">
                  <button type="button" :disabled="nextStatusId !== orderStatus[0]?.id"
                    @click="updateOrderStatus(order.id, orderStatus[0]?.id)"
                    class="flex items-center justify-center px-4 py-2 text-blue-600 transition-colors bg-white border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-300 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon name="svg-spinners:90-ring"
                      v-if="order.loading && order.targetStatus === orderStatus[0]?.id" />
                    <span v-else class="flex items-center">
                      <icon name="hugeicons:package-delivered" class="w-4 h-4 me-1" />
                      {{ $t('status.order_placed') }}
                    </span>
                  </button>

                  <button type="button" :disabled="nextStatusId !== orderStatus[1]?.id"
                    @click="updateOrderStatus(order.id, orderStatus[1]?.id)"
                    class="flex items-center justify-center px-4 py-2 text-red-600 transition-colors bg-white border border-red-600 rounded-lg hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-300 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon name="svg-spinners:90-ring"
                      v-if="order.loading && order.targetStatus === orderStatus[1]?.id" />
                    <span v-else class="flex items-center">
                      <icon name="ic:baseline-access-time-filled" class="w-4 h-4 me-1" />
                      {{ $t('status.processing') }}
                    </span>
                  </button>

                  <button type="button" :disabled="nextStatusId !== orderStatus[2]?.id"
                    @click="updateOrderStatus(order.id, orderStatus[2]?.id)"
                    class="flex items-center justify-center px-4 py-2 text-green-600 transition-colors bg-white border border-green-600 rounded-lg hover:bg-green-600 hover:text-white focus:ring-2 focus:ring-green-300 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon name="svg-spinners:90-ring"
                      v-if="order.loading && order.targetStatus === orderStatus[2]?.id" />
                    <span v-else class="flex items-center">
                      <icon name="material-symbols:shopping-basket-sharp" class="w-4 h-4 me-1" />
                      {{ $t('status.shipped') }}
                    </span>
                  </button>

                  <button type="button" :disabled="nextStatusId !== orderStatus[3]?.id"
                    @click="updateOrderStatus(order.id, orderStatus[3]?.id)"
                    class="flex items-center justify-center px-4 py-2 text-blue-600 transition-colors bg-white border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-300 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon name="svg-spinners:90-ring"
                      v-if="order.loading && order.targetStatus === orderStatus[3]?.id" />
                    <span v-else class="flex items-center">
                      <icon name="tabler:ship" class="w-4 h-4 me-1" />
                      {{ $t('status.out_for_delivery') }}
                    </span>
                  </button>

                  <button type="button" :disabled="nextStatusId !== orderStatus[4]?.id"
                    @click="updateOrderStatus(order.id, orderStatus[4]?.id)"
                    class="flex items-center justify-center px-4 py-2 text-blue-600 transition-colors bg-white border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-300 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon name="svg-spinners:90-ring"
                      v-if="order.loading && order.targetStatus === orderStatus[4]?.id" />
                    <span v-else class="flex items-center">
                      <icon name="material-symbols:local-shipping-rounded" class="w-4 h-4 me-1" />
                      {{ $t('status.delivered') }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Order Items Section -->
            <div class="flex-1 p-6 bg-white rounded-lg shadow-md dark:bg-gray-600">
              <div class="flex items-center mb-4 space-s-2">
                <icon name="mdi:cart" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-300">
                  {{ $t('dashboard.ordered_items') }}
                </h3>
              </div>

              <div class="space-y-4 overflow-y-auto max-h-[400px] pe-2 custom-scrollbar">
                <div v-for="(item, index) in order.cart || []" :key="item.productId"
                  class="flex items-start p-3 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 space-s-4">
                  <span
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-800 dark:text-indigo-200">
                    {{ index + 1 }}
                  </span>
                  <img :src="item.imageUrl1" class="flex-shrink-0 object-cover w-16 h-16 rounded-md shadow-sm" />
                  <div class="flex-1 min-w-0">
                    <p class="text-base font-semibold text-gray-900 truncate dark:text-gray-200">
                      {{ item.title }}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <div class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md dark:bg-gray-600">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('dashboard.brand')
                        }}:</span>
                        <span class="text-xs text-gray-700 ms-1 dark:text-gray-200">{{ item.brand }}</span>
                      </div>
                      <div class="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md dark:bg-gray-600">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('dashboard.quantity')
                        }}:</span>
                        <span class="text-xs text-gray-700 ms-1 dark:text-gray-200">{{ item.quantity }}</span>
                      </div>
                      <div class="inline-flex items-center px-2 py-1 bg-indigo-100 rounded-md dark:bg-indigo-800">
                        <span class="text-xs font-medium text-indigo-700 dark:text-indigo-200">{{ $t('dashboard.price')
                        }}:</span>
                        <span class="text-xs text-indigo-700 ms-1 dark:text-indigo-200">${{ (item.discountedPrice || 0)
                          *
                          (item.quantity || 1) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="pt-4 mt-6 border-t dark:border-gray-600">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.date') }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ order.date }}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('dashboard.estimated_delivery') }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ order.estimatedDelivery || 'N/A'
                  }}</span>
                </div>
                <div class="flex items-center justify-between mt-4">
                  <span class="text-base font-semibold text-gray-700 dark:text-gray-300">{{ $t('dashboard.total')
                  }}</span>
                  <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ${{ calculateTotal(order.cart) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
          :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: Object
});

const emit = defineEmits(['close']);

const checkoutStore = useCheckoutStore();
const categoryStore = useCategoriesStore();
const orders = computed(() => checkoutStore?.orders || []);

const closeDialog = () => {
  emit('close');
};

const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const { t } = useI18n()

const updateOrderStatus = (orderId, newStatus) => {
  const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
  if (!order) return;
  order.loading = true;
  order.targetStatus = newStatus;
  new Promise((resolve) => setTimeout(resolve, 3000))
    .then(() => {
      return checkoutStore.updateOrderStatus(orderId, newStatus);
    })
    .then(() => {
      return checkoutStore.fetchOrders();
    })
    .then((rss) => {
      checkoutStore.fetchOrders();
      triggerToast({
        message: t('toast.order_status_updated'),
        type: 'success',
        icon: 'mdi-check-circle',
      });
      order.loading = false;
    })
    .catch((error) => {
      console.error(error);
      triggerToast({
        message: t('toast.failed_to_update_order'),
        type: 'error',
        icon: 'mdi:alert-circle',
      });
    })
    .finally(() => {
      const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
      if (order) {
        order.loading = false;
        order.targetStatus = null;
      }
    });
};

onMounted(() => {
  checkoutStore.fetchOrders();
});

const orderStatus = ref([])
const categories = ref([])
const currentStatus = ref('')

onMounted(() => {
  checkoutStore.fetchStatus();
  const statusOrder = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  orderStatus.value = checkoutStore.status.sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });
  orderStatus.value = checkoutStore.status
  categoryStore.fetchCategories();
  categories.value = categoryStore.categories;
  currentStatus.value = checkoutStore.status.find((s) => s.id === props.order.statusId)?.status;
});

const currentStatusText = computed(() => {
  return checkoutStore.status.find((s) => s.id === props.order.statusId)?.status || 'Unknown';
});

const currentStatusIndex = computed(() => {
  return orderStatus.value.findIndex(s => s.id === props.order.statusId);
});

const nextStatusId = computed(() => {
  if (currentStatusIndex.value === -1 || currentStatusIndex.value >= orderStatus.value.length - 1) {
    return null;
  }
  return orderStatus.value[currentStatusIndex.value + 1]?.id;
});

// Calculate total price for the order
const calculateTotal = (cartItems) => {
  if (!cartItems || !cartItems.length) return 0;
  return cartItems.reduce((total, item) => {
    return total + ((item.discountedPrice || 0) * (item.quantity || 1));
  }, 0).toFixed(2);
};
</script>
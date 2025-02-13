<template>
  <div>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div class="flex flex-col w-full max-w-4xl p-3 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div v-if="orders?.length" class="flex space-s-6">
          <!-- Customer Info Section -->
          <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
            <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-300">
              {{ order.deliveryDetails.name }} {{ $t('dashboard.s_information') }}
            </h3>
            <div class="space-y-3">
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.email') }}:</span>
                {{ order.deliveryDetails.email }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.phone_number') }}:</span>
                {{ order.deliveryDetails.phoneNumber }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.country') }}:</span>
                {{ order.deliveryDetails.country }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.city') }}:</span>
                {{ order.deliveryDetails.city }}
              </p>
            </div>

            <!-- Status Buttons -->
            <div class="mt-12">
              <p class="text-sm font-normal text-gray-600 dark:text-gray-100">{{ $t('dashboard.change_order_status') }}
              </p>
              <div class="flex mt-4 space-s-4">
                <button type="button"
                  :disabled="order.statusId === orderStatus[2]?.id || order.statusId === orderStatus[1]?.id || order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[3]?.id || order.statusId === orderStatus[4]?.id"
                  @click="updateOrderStatus(order.id, orderStatus[2]?.id)"
                  class="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-3 py-2.5 me-2 mb-2 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400 dark:hover:text-white dark:focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <icon name="svg-spinners:90-ring" v-if="order.loading && order.targetStatus === orderStatus[2]?.id" />
                  <span v-else>
                    <icon name="material-symbols:shopping-basket-sharp" />
                  </span>
                </button>
                <button type="button"
                  :disabled="order.statusId === orderStatus[1]?.id || order.statusId === orderStatus[3]?.id || order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[4]?.id"
                  @click="updateOrderStatus(order.id, orderStatus[1]?.id)"
                  class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-3 py-2.5 me-2 mb-2 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-white dark:focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <icon name="svg-spinners:90-ring" v-if="order.loading && order.targetStatus === orderStatus[1]?.id" />
                  <span v-else>
                    <icon name="ic:baseline-access-time-filled" />
                  </span>
                </button>
                <button type="button"
                  :disabled="order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[2]?.id || order.statusId === orderStatus[4]?.id || order.statusId === orderStatus[3]?.id"
                  @click="updateOrderStatus(order.id, orderStatus[3].id)"
                  class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2.5 me-2 mb-2 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <icon name="svg-spinners:90-ring" v-if="order.loading && order.targetStatus === orderStatus[3]?.id" />
                  <span v-else>
                    <icon name="tabler:ship" />
                  </span>
                </button>
                <button type="button"
                  :disabled="order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[1]?.id || order.statusId === orderStatus[2]?.id || order.statusId === orderStatus[4]?.id"
                  @click="updateOrderStatus(order.id, orderStatus[4].id)"
                  class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2.5 me-2 mb-2 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <icon name="svg-spinners:90-ring" v-if="order.loading && order.targetStatus === orderStatus[4]?.id" />
                  <span v-else>
                    <icon name="material-symbols:local-shipping-rounded" />
                  </span>
                </button>
                <button type="button"
                  :disabled="order.statusId === orderStatus[0]?.id || order.statusId === orderStatus[1]?.id || order.statusId === orderStatus[2]?.id || order.statusId === orderStatus[3]?.id"
                  @click="updateOrderStatus(order.id, orderStatus[0].id)"
                  class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-2.5 me-2 mb-2 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <icon name="svg-spinners:90-ring" v-if="order.loading && order.targetStatus === orderStatus[0]?.id" />
                  <span v-else>
                    <icon name="hugeicons:package-delivered" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Order Details Section with Hidden Scroll -->
          <div class="flex-1 p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
            <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-300">
              {{ $t('dashboard.order_details') }}
            </h3>
            <div class="space-y-4 overflow-y-auto max-h-96 custom-scroll">
              <div v-for="(item, index) in order.cart || []" :key="item.productId"
                class="flex items-center pb-4 space-x-4 border-b">
                <span class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ index + 1 }}.</span>
                <img :src="item.imageUrl1" class="w-16 h-16 rounded-md shadow-sm" />
                <div class="flex-1">
                  <p class="text-lg font-semibold text-gray-900 dark:text-gray-200">
                    {{ item.title }}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-gray-200">
                    <span class="font-semibold">{{ $t('dashboard.brand') }}:</span>
                    {{ item.brand }}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-gray-200">
                    <span class="font-semibold">{{ $t('dashboard.quantity') }}:</span>
                    {{ item.quantity }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <button class="px-6 py-2.5 btn-style" @click="closeDialog">
            {{ $t('btn.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :title="toastTitle" :message="toastMessage" :toastType="toastType"
          :duration="5000" :toastIcon="toastIcon" @toastClosed="showToast = false" />
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

const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();
const { t } = useI18n()

// const updateOrderStatus = async (orderId, newStatus) => {
//   const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
//   if (!order) return;
//   order.loading = true;
//   order.targetStatus = newStatus;
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   await checkoutStore.updateOrderStatus(orderId, newStatus)
//   await checkoutStore.fetchOrders()
//     .then((rss) => {
//       checkoutStore.fetchOrders();
//       triggerToast({
//         title: t('toast.great'),
//         message: t('toast.order_status_updated'),
//         type: 'success',
//         icon: 'mdi-check-circle',
//       });
//       order.loading = false
//     })
//     .catch((error) => {
//       console.error(error);
//       triggerToast({
//         title: t('toast.error'),
//         message: t('toast.failed_to_update_order'),
//         type: 'error',
//         icon: 'mdi:alert-circle',
//       });
//     })
//     .finally(() => {
//       const order = checkoutStore.paginatedOrders.find((o) => o.id === orderId);
//       if (order) {
//         order.loading = false;
//         order.targetStatus = null;
//       }
//     })
// };
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
        title: t('toast.great'),
        message: t('toast.order_status_updated'),
        type: 'success',
        icon: 'mdi-check-circle',
      });
      order.loading = false;
    })
    .catch((error) => {
      console.error(error);
      triggerToast({
        title: t('toast.error'),
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
  orderStatus.value = checkoutStore.status
  categoryStore.fetchCategories();
  categories.value = categoryStore.categories;
  currentStatus.value = checkoutStore.status.find((s) => s.id === props.order.statusId)?.status;
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}

.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
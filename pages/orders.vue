<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="flex items-center justify-between">
      <h3 class="py-2 mt-5 mb-12 text-2xl font-bold text-start">{{ $t('dashboard.orders') }}</h3>
      <div class="flex items-end space-s-4">
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">{{ $t('form.start_date') }}</label>
          <!-- date-picker componenet -->
          <date-picker v-model="startDate" />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">{{ $t('form.end_date') }}</label>
          <!-- date-picker componenet -->
          <date-picker v-model="endDate" />
        </div>
        <button @click="filterOrdersByDate" class="px-4 py-2 btn-style">
          {{ $t('btn.filter') }}
        </button>
      </div>
    </div>

    <div
      class="relative flex flex-col w-full h-full overflow-scroll overflow-y-hidden text-gray-700 bg-white rounded-lg shadow-md bg-clip-border dark:bg-black dark:text-gray-200">
      <table class="w-full table-auto text-start min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                #
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.order_id') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.email') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.customer_name') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.date') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.phone_number') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.card_expiration') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.card_number') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.cvv') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.full_name_on_card') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.country') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.city') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.status') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
          </tr>
        </thead>

        <tbody v-if="checkoutStore.paginatedOrders.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <!-- skeleton-loader component -->
              <skeleton-loader />
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600"
            v-for="(order, index) in checkoutStore.paginatedOrders" :key="order.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800 dark:text-slate-200">{{ (checkoutStore.currentPage -
                1) *
                checkoutStore.ordersPerPage +
                index +
                1 }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-500 dark:text-slate-100">{{ order.orderId }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm text-slate-500 dark:text-slate-100">{{ order.deliveryDetails.email }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.deliveryDetails.name }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.date }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.deliveryDetails.phoneNumber }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.paymentDetails.cardExpiration }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.paymentDetails.cardNumber }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.paymentDetails.cvv }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.paymentDetails.fullNameOnCard }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.deliveryDetails.country }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ order.deliveryDetails.city }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-blue-700 cursor-pointer dark:text-blue-400" @click="openOrderDetails(order)">
              <div class="flex items-center justify-center" v-if="order.loading">
                <icon name="svg-spinners:tadpole" />
              </div>
              <span v-else>{{ $t('btn.view_details') }}</span>
              </p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm font-semibold" :class="{
                'text-green-700 dark:text-green-400': getStatusTitle(order.statusId)?.status === 'Order Placed',
                'text-red-700 dark:text-red-400': getStatusTitle(order.statusId)?.status === 'Processing',
                'text-blue-700 dark:text-blue-400': getStatusTitle(order.statusId)?.status === 'Shipped',
                'text-blue-700 dark:text-blue-400': getStatusTitle(order.statusId)?.status === 'Out for Delivery',
                'text-blue-700 dark:text-blue-400': getStatusTitle(order.statusId)?.status === 'Delivered',
              }">
                {{ getStatusTitle(order.statusId)?.status === 'Delivered' ? 'Completed' :
                  getStatusTitle(order.statusId)?.status }}
                <!-- {{ getStatusTitle(order.statusId)?.status }} -->
              </p>
            </td>
            <td class="p-4 py-5">
              <tooltip :text="$t('tooltip.delete_order')" position="bottom">
                <button type="button" @click="deleteOrder(order.id)">
                  <icon name="svg-spinners:tadpole" class="text-blue-500" v-if="order.loading" />
                  <icon name="material-symbols:delete-sharp" class="text-red-700 dark:text-red-500" v-else />
                </button>
              </tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div class="flex items-center px-4 py-3">
      <div class="flex mt-3 space-x-1 ms-auto">
        <button @click="checkoutStore.changePage(checkoutStore.currentPage - 1)"
          :disabled="checkoutStore.currentPage === 1"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.previous') }}
        </button>
        <button v-for="page in checkoutStore.totalPages" :key="page" @click="checkoutStore.changePage(page)" :class="{
          'bg-slate-800 text-white': page === checkoutStore.currentPage,
          'bg-white text-slate-500': page !== checkoutStore.currentPage,
        }"
          class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 ease">
          {{ page }}
        </button>
        <button @click="checkoutStore.changePage(checkoutStore.currentPage + 1)"
          :disabled="checkoutStore.currentPage === checkoutStore.totalPages"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.next') }}
        </button>
      </div>
    </div>

    <!-- order-details-dialog component -->
    <transition name="dialog">
      <order-details-dialog v-if="isDialogOpen" :order="selectedOrder" @close="closeDialog" />
    </transition>

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
const { t } = useI18n()
const checkoutStore = useCheckoutStore();
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const currentStatus = ref('')
const orderStatus = ref([])

onMounted(() => {
  checkoutStore.fetchOrders();
  checkoutStore.fetchStatus();
  orderStatus.value = checkoutStore.status
});

const isDialogOpen = ref(false);
const selectedOrder = ref({});

const openOrderDetails = (order) => {
  order.loading = true;
  selectedOrder.value = order;
  new Promise(resolve => setTimeout(resolve, 2000));
  order.loading = false;
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
  selectedOrder.value = {};
};

const startDate = ref('');
const endDate = ref('');

const filterOrdersByDate = () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end dates');
    return;
  }
  const filteredOrders = checkoutStore.orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= new Date(startDate.value) && orderDate <= new Date(endDate.value);
  });
  checkoutStore.paginatedOrders = filteredOrders;
};

const deleteOrder = (orderId) => {
  const order = checkoutStore.paginatedOrders.find(o => o.id === orderId);
  if (order) {
    order.loading = true;
  }
  checkoutStore.deleteOrder(orderId)
    .then(() => {
      checkoutStore.paginatedOrders = checkoutStore.paginatedOrders.filter(order => order.id !== orderId);
      triggerToast({
        title: t('toast.great'),
        message: t('toast.order_deleted_successfully'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    })
    .catch((error) => {
      triggerToast({
        title: t('toast.error'),
        message: t('toast.order_deletion_failed'),
        type: 'error',
        icon: 'mdi:alert-circle',
      });
    })
    .finally(() => {
      setTimeout(() => {
        if (order) {
          order.loading = false;
        }
      }, 3000);
    });
};

// const deleteOrder = async (orderId) => {
//   const order = checkoutStore.paginatedOrders.find(o => o.id === orderId);
//   if (order) {
//     order.loading = true;
//   }
//   try {
//     await checkoutStore.deleteOrder(orderId);
//     checkoutStore.paginatedOrders = checkoutStore.paginatedOrders.filter(order => order.id !== orderId);
//     triggerToast({
//       title: t('toast.great'),
//       message: t('toast.order_deleted_successfully'),
//       type: 'success',
//       icon: 'mdi:check-circle',
//     });
//   } catch (error) {
//     triggerToast({
//       title: t('toast.error'),
//       message: t('toast.order_deletion_failed'),
//       type: 'error',
//       icon: 'mdi:alert-circle',
//     });
//   } finally {
//     setTimeout(() => {
//       if (order) {
//         order.loading = false;
//       }
//     }, 3000);
//   }
// };

const getStatusTitle = (statusId) => {
  currentStatus.value = checkoutStore.status.find((s) => s.id === statusId);
  // console.log(currentStatus.value)
  return currentStatus.value
}

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.orders"),
});
</script>
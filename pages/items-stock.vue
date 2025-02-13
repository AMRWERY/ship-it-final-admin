<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="flex items-center justify-between">
      <h3 class="py-2 mt-5 mb-12 text-2xl font-bold text-start">{{ $t('dashboard.items_stock') }}</h3>
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
                Image
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Product Title
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Brand
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Available Stock
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Original Price
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Price after Discount
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                Discount
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
          </tr>
        </thead>

        <!-- if no data -->
        <tbody v-if="productStore.paginatedProducts.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <!-- skeleton-loader component -->
              <skeleton-loader />
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600"
            v-for="(product, index) in productStore.paginatedProducts" :key="product.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800 dark:text-slate-200">{{ (productStore.currentPage -
                1) *
                productStore.productsPerPage +
                index +
                1 }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm">
                <img :src="product.imageUrl1" alt="" class="w-12 h-12 rounded-lg">
              </p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm text-slate-500 dark:text-slate-100">{{ product.title }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ product.brand }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100"><span
                  class="text-lg font-semibold text-green-600 dark:text-green-400">{{ product.stock
                  }}</span> available</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100" v-if="product.originalPrice">{{
                product.originalPrice }} egp</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ product.discountedPrice }} egp</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100" v-if="product.discount">{{ product.discount }}%</p>
            </td>
            <td class="p-4 py-5">
              <nuxt-link to="" class="text-sm text-blue-700 dark:text-blue-400">
                Edit Product
              </nuxt-link>
            </td>
            <td class="p-4 py-5">
              <tooltip :text="$t('tooltip.delete_item')" position="bottom">
                <button type="button" @click="deleteProduct(product.id)">
                  <icon name="svg-spinners:tadpole" class="text-blue-500" v-if="loading" />
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
        <button @click="productStore.changePage(productStore.currentPage - 1)"
          :disabled="productStore.currentPage === 1"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.previous') }}
        </button>
        <button v-for="page in productStore.totalPages" :key="page" @click="productStore.changePage(page)" :class="{
          'bg-slate-800 text-white': page === productStore.currentPage,
          'bg-white text-slate-500': page !== productStore.currentPage,
        }"
          class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 ease">
          {{ page }}
        </button>
        <button @click="productStore.changePage(productStore.currentPage + 1)"
          :disabled="productStore.currentPage === productStore.totalPages"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.next') }}
        </button>
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
const { t } = useI18n()
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()
const productStore = useProductsStore()
const loading = ref(false)

onMounted(() => {
  productStore.fetchProducts()
});

const deleteProduct = async (productId) => {
  const product = productStore.paginatedProducts.find((p) => p.id === productId);
  if (!product) return;
  loading.value = true;
  try {
    await productStore.deleteProduct(productId);
    productStore.paginatedProducts = productStore.paginatedProducts.filter(
      (product) => product.id !== productId
    );
    triggerToast({
      title: t('toast.great'),
      message: t('toast.product_deleted_successfully'),
      type: 'success',
      icon: 'mdi:check-circle',
    });
  } catch (error) {
    triggerToast({
      title: t('toast.error'),
      message: t('toast.product_deletion_failed'),
      type: 'error',
      icon: 'mdi:alert-circle',
    });
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.items_stock"),
});
</script>
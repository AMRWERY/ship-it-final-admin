<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
      <h3 class="py-2 mt-5 text-2xl font-bold text-start">
        {{ $t('dashboard.items_stock') }}
      </h3>
      <div class="flex flex-col items-start mt-4 space-y-4 md:flex-row md:items-end md:space-y-0 md:space-s-4 md:mt-0">
        <div class="flex flex-col">
          <div class="relative">
            <input type="text" placeholder="Search..."
              class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-4 placeholder:text-slate-400 dark:placeholder:text-slate-300 text-slate-700 dark:text-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow" />
            <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
              <icon name="material-symbols:search-rounded" class="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <nuxt-link to="" role="button" class="flex items-center justify-center w-full px-5 py-2.5 btn-style"
            @click="isDialogOpen = true">
            <icon name="material-symbols:add" class="w-5 h-5 -ms-2 me-2" aria-hidden="true" />
            <span>{{ $t('btn.add_product') }}</span>
          </nuxt-link>

          <add-edit-product-dialog :is-dialog-open="isDialogOpen" :product-id="selectedProductId"
            @close="isDialogOpen = false" />
        </div>
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
                {{ $t('dashboard.image') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.product_title') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.brand') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.available_stock') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.original_price') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.price_after_discount') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.discount') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
          </tr>
        </thead>

        <!-- if no data -->
        <tbody v-if="productStore.paginatedProducts.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <p class="text-xl font-semibold text-gray-800 dark:text-white">{{ $t('dashboard.no_products_found') }}</p>
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
              <p class="block text-sm text-slate-500 dark:text-slate-100">{{ $i18n.locale ===
                'ar' ? product.titleAr :
                product.title }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ $i18n.locale ===
                'ar' ? product.brandAr :
                product.brand }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100"><span
                  class="text-lg font-semibold text-green-600 dark:text-green-400">{{ product.stock
                  }}</span> {{ $t('dashboard.available') }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100" v-if="product.originalPrice">
                {{ !isNaN(parseFloat(product.originalPrice))
                  ? $n(parseFloat(product.originalPrice), 'currency', currencyLocale || {
                    style: 'currency', currency:
                      'USD'
                  })
                  : '-' }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-100" v-else>
                -
              </p>

            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ !isNaN(parseFloat(product.discountedPrice))
                ? $n(parseFloat(product.discountedPrice), 'currency', currencyLocale || {
                  style: 'currency', currency:
                    'USD'
                })
                : '-' }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100" v-if="product.discount">
                {{ product.discount }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-100" v-else>
                -
              </p>
            </td>
            <td class="p-4 py-5">
              <nuxt-link to="" @click="openEditDialog(product.id)" role="button"
                class="text-sm text-blue-700 cursor-pointer dark:text-blue-400">{{
                  $t('btn.edit_product') }}</nuxt-link>
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
    <div class="flex items-center px-4 py-3" v-if="productStore.paginatedProducts.length > 0">
      <div class="flex mt-3 space-s-1 ms-auto">
        <button @click="productStore.changePage(productStore.currentPage - 1)"
          :disabled="productStore.currentPage === 1"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
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
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
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

//currency composable
const { currencyLocale } = useCurrencyLocale();

const isDialogOpen = ref(false);
const selectedProductId = ref(null);

const openEditDialog = (productId) => {
  selectedProductId.value = productId;
  isDialogOpen.value = true;
};

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.items_stock"),
});
</script>
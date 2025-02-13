<template>
    <div>
        <!-- breadcrumb component -->
        <breadcrumb />

        <div class="p-4 mx-auto mt-6 font-sans lg:max-w-6xl md:max-w-4xl">
            <div v-if="loading" class="flex items-center justify-center text-gray-500">
                <icon name="svg-spinners:bars-scale" class="w-16 h-16 text-gray-500 dark:text-gray-100" />
            </div>

            <div v-else-if="productStore.products.length === 0"
                class="text-lg font-semibold text-center text-gray-500 dark:text-gray-100">
                {{ $t('dashboard.no_products_found') }}
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6" v-else>
                <div v-for="product in productStore.paginatedProducts" :key="product"
                    class="bg-white dark:bg-black flex flex-col rounded overflow-hidden shadow-md cursor-pointer hover:scale-[1.01] transition-all">
                    <div class="relative w-full h-full">
                        <img :src="product.imageUrl1" alt="Product" class="object-cover object-top w-full h-full" />
                        <div class="absolute inset-0 flex items-start justify-between p-2">
                            <tooltip :text="$t('tooltip.edit_product')" position="bottom">
                                <nuxt-link :to="`/products/${product.id}`" type="button"
                                    class="bg-white rounded-full shadow-lg ">
                                    <icon name="ep:edit" class="text-gray-600" />
                                </nuxt-link>
                            </tooltip>
                            <div class="flex flex-col items-end space-y-1">
                                <span class="px-2 py-1 text-xs font-bold text-center text-white bg-red-500 rounded-lg"
                                    v-if="product.discount">
                                    {{ product.discount }}%
                                </span>
                                <span class="px-2 py-1 text-xs font-bold text-center text-white bg-blue-700 rounded-lg">
                                    {{ $i18n.locale ===
                                        'ar' ? product.brandAr :
                                    product.brand }}
                                </span>
                                <span class="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded-lg">
                                    {{ product.availability }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-1 p-4">
                        <div class="flex-1">
                            <h5
                                class="block w-full text-sm font-bold text-gray-800 truncate sm:text-base dark:text-gray-200">
                                {{ $i18n.locale ===
                                    'ar' ? product.titleAr :
                                product.title }}
                            </h5>
                            <div class="flex flex-wrap items-center gap-2 mt-2">
                                <h6 class="text-lg font-bold text-gray-800 sm:text-md dark:text-gray-200">{{
                                    $n(parseFloat(product.discountedPrice), 'currency', currencyLocale) }}
                                </h6>
                                <h6 class="text-sm font-bold text-gray-500 line-through sm:text-base dark:text-gray-100"
                                    v-if="product.originalPrice">{{ $n(parseFloat(product.originalPrice), 'currency',
                                        currencyLocale) }}</h6>
                            </div>
                            <div class="mt-1 space-y-2">
                                <div class="flex flex-wrap items-center justify-between">
                                    <p>{{ $t('dashboard.stock') }} <span class="font-semibold text-green-600 dark:text-green-400">{{
                                        product.stock }}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- pagination -->
            <div class="flex items-center px-4 py-3">
                <div class="flex mt-3 space-x-1 ms-auto">
                    <button @click="productStore.changePage(productStore.currentPage - 1)"
                        :disabled="productStore.currentPage === 1"
                        class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                        {{ $t('pagination.previous') }}
                    </button>
                    <button v-for="page in productStore.totalPages" :key="page" @click="productStore.changePage(page)"
                        :class="{
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
        </div>
    </div>
</template>

<script setup>
const productStore = useProductsStore()
const { t } = useI18n();
const loading = ref(false);

onMounted(() => {
    loading.value = true;
    setTimeout(() => {
        productStore.fetchProducts()
        loading.value = false;
    }, 3000);
})

//currency composable
const { currencyLocale } = useCurrencyLocale();

definePageMeta({
    layout: "dashboard",
});

useHead({
    titleTemplate: () => t('head.products'),
});
</script>
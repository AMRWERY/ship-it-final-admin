<template>
    <div>
        <!-- breadcrumb component -->
        <breadcrumb />

        <div class="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
            <h3 class="py-2 mt-5 text-2xl font-bold text-start">
                {{ $t('dashboard.all_deals') }}
            </h3>
            <div class="flex items-center gap-4">
                <button @click="openDealDialog()" class="px-4 py-2 text-white btn-style">
                    {{ $t('btn.add_deal') }}
                </button>
            </div>
        </div>

        <!-- Deals Table -->
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
                                {{ $t('dashboard.title') }}
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
                            <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                                {{ $t('dashboard.brand') }}
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
                            <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                                {{ $t('dashboard.discount') }}
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
                            <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                                {{ $t('dashboard.price') }}
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
                            <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                                {{ $t('dashboard.status') }}
                            </p>
                        </th>
                        <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black"></th>
                    </tr>
                </thead>

                <tbody v-if="!hasDeals">
                    <tr>
                        <td colspan="7" class="p-4 text-center">
                            <p class="text-xl font-semibold text-gray-800 dark:text-white">{{
                                $t('dashboard.no_deals_found') }}</p>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr v-for="(deal, index) in todayDealStore.paginatedDeals" :key="deal.id"
                        class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600">
                        <td class="p-4">
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                {{ (todayDealStore.currentPage - 1) * todayDealStore.itemsPerPage + index + 1 }}
                            </p>
                        </td>
                        <td class="p-4">
                            <div class="w-16 h-16 overflow-hidden rounded-lg">
                                <img :src="deal.imageUrl1" :alt="deal.title" class="object-cover w-full h-full" />
                            </div>
                        </td>
                        <td class="p-4">
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                {{ $i18n.locale === 'ar' ? deal.titleAr : deal.title }}
                            </p>
                        </td>
                        <td class="p-4">
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {{ $i18n.locale === 'ar' ? deal.brandAr : deal.brand }}
                            </p>
                        </td>
                        <td class="p-4">
                            <span
                                class="px-2 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full dark:bg-red-900/20 dark:text-red-400">
                                {{ deal.discount }}%
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex flex-col">
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                    {{ $n(parseFloat(deal.discountedPrice), 'currency', currencyLocale) }}
                                </p>
                                <p class="text-xs text-gray-500 line-through dark:text-gray-400">
                                    {{ $n(parseFloat(deal.originalPrice), 'currency', currencyLocale) }}
                                </p>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 text-sm font-semibold rounded-full" :class="getStatusClass(deal)">
                                {{ getStatusText(deal) }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <tooltip :text="$t('tooltip.edit_deal')" position="bottom">
                                    <button @click="openDealDialog(deal)"
                                        class="flex items-center justify-center w-8 h-8 text-blue-500 rounded hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500">
                                        <icon name="material-symbols:edit" class="w-5 h-5" />
                                    </button>
                                </tooltip>
                                <tooltip :text="$t('tooltip.delete_deal')" position="bottom">
                                    <button @click="deleteDeal(deal.id)"
                                        class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                                        <icon name="material-symbols:delete" class="w-5 h-5" />
                                    </button>
                                </tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- pagination -->
        <div class="flex items-center px-4 py-3" v-if="hasDeals">
            <div class="flex mt-3 space-s-1 ms-auto">
                <button @click="todayDealStore.changePage(todayDealStore.currentPage - 1)"
                    :disabled="todayDealStore.currentPage === 1"
                    class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                    {{ $t('pagination.previous') }}
                </button>
                <button v-for="page in todayDealStore.totalPages" :key="page" @click="todayDealStore.changePage(page)"
                    :class="{
                        'bg-slate-800 text-white': page === todayDealStore.currentPage,
                        'bg-white text-slate-500': page !== todayDealStore.currentPage,
                    }"
                    class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 ease">
                    {{ page }}
                </button>
                <button @click="todayDealStore.changePage(todayDealStore.currentPage + 1)"
                    :disabled="todayDealStore.currentPage === todayDealStore.totalPages"
                    class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
                    {{ $t('pagination.next') }}
                </button>
            </div>
        </div>

        <!-- Deal Form Dialog -->
        <deal-form-dialog v-if="showDealDialog" :is-open="showDealDialog" :deal="selectedDeal" @close="closeDealDialog"
            @save="handleDealSave" />

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
const { t } = useI18n();
const todayDealStore = useTodayDealStore();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const showDealDialog = ref(false);
const selectedDeal = ref(null);

// Update computed property to check products instead of deals
const hasDeals = computed(() => {
    return todayDealStore.products && todayDealStore.products.length > 0;
});

// Update watcher to watch products instead of deals
watch(() => todayDealStore.products, (newProducts) => {
    // console.log('Products updated:', newProducts);
}, { immediate: true });

const openDealDialog = (deal = null) => {
    selectedDeal.value = deal;
    showDealDialog.value = true;
};

const closeDealDialog = () => {
    showDealDialog.value = false;
    selectedDeal.value = null;
};

const handleDealSave = async (dealData, imageFiles) => {
    try {
        if (selectedDeal.value) {
            // Update existing deal
            if (imageFiles && imageFiles.length > 0) {
                // If new images were uploaded
                await todayDealStore.addNewDeal(dealData, imageFiles);
            } else {
                // No new images, just update the deal data
                await todayDealStore.updateDeal(selectedDeal.value.id, dealData);
            }
            triggerToast({
                message: t('toast.deal_updated_successfully'),
                type: 'success',
                icon: 'mdi-check-circle',
            });
        } else {
            // Add new deal - must have images
            if (imageFiles && imageFiles.length > 0) {
                await todayDealStore.addNewDeal(dealData, imageFiles);
                triggerToast({
                    message: t('toast.deal_added_successfully'),
                    type: 'success',
                    icon: 'mdi-check-circle',
                });
            } else {
                triggerToast({
                    message: t('toast.please_upload_at_least_one_image'),
                    type: 'error',
                    icon: 'mdi-alert-circle',
                });
                return; // Don't close dialog
            }
        }
        closeDealDialog();
        await todayDealStore.fetchDeals();
    } catch (error) {
        console.error('Error saving deal:', error);
        triggerToast({
            message: t('toast.failed_to_save_deal'),
            type: 'error',
            icon: 'mdi-alert-circle',
        });
    }
};

const getStatusClass = (deal) => {
    const now = new Date().getTime();
    const startTime = new Date(deal.startTime.seconds * 1000).getTime();
    const endTime = new Date(deal.endTime.seconds * 1000).getTime();
    if (now < startTime) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    } else if (now > endTime) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    } else {
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
};

const getStatusText = (deal) => {
    const now = new Date().getTime();
    const startTime = new Date(deal.startTime.seconds * 1000).getTime();
    const endTime = new Date(deal.endTime.seconds * 1000).getTime();

    if (now < startTime) {
        return t('dashboard.upcoming');
    } else if (now > endTime) {
        return t('dashboard.ended');
    } else {
        return t('dashboard.active');
    }
};

const deleteDeal = async (dealId) => {
    try {
        await todayDealStore.deleteDeal(dealId);
        triggerToast({
            message: t('toast.deal_deleted_successfully'),
            type: 'success',
            icon: 'mdi-check-circle',
        });
    } catch (error) {
        console.error('Error deleting deal:', error);
        triggerToast({
            message: t('toast.failed_to_delete_deal'),
            type: 'error',
            icon: 'mdi-alert-circle',
        });
    }
};

onMounted(() => {
    todayDealStore.fetchDeals();
});

//currency composable
const { currencyLocale } = useCurrencyLocale();

definePageMeta({
    layout: 'dashboard'
});

useHead({
    titleTemplate: () => t('head.deals'),
});
</script>
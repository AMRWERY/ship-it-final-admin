<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <h3 class="py-2 mt-5 mb-12 text-2xl font-bold text-start">{{ $t('dashboard.categories') }}</h3>
    <div
      class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white rounded-lg shadow-md bg-clip-border dark:bg-black dark:text-gray-200">
      <table class="w-full table-auto text-start min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                #
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.category_title') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.image') }}
              </p>
            </th>
          </tr>
        </thead>

        <tbody v-if="categoryStore.paginatedCategories.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <!-- skeleton-loader component -->
              <skeleton-loader />
              <!-- <icon name="svg-spinners:blocks-shuffle-3" class="w-24 h-24" /> -->
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600"
            v-for="(category, index) in categoryStore.paginatedCategories" :key="category.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                {{ (categoryStore.currentPage - 1) * categoryStore.categoriesPerPage + index + 1 }}
              </p>
            </td>
            <td class="p-4 py-5">
              <p class="font-semibold text-md text-slate-500 dark:text-slate-100">{{
                $i18n.locale === 'ar' ? category.titleAr :
                  category.title }}</p>
            </td>
            <td class="p-4 py-5">
              <img :src="category.imgOne" class="w-12 h-12 rounded-lg">
            </td>
            <td class="p-4 py-5 text-center">
              <div class="flex items-center justify-center space-s-4">
                <tooltip :text="$t('tooltip.delete_category')" position="bottom">
                  <button type="button" class="rounded-full" @click="handleDeleteCategory(category.id)">
                    <icon v-if="deleteCat === category.id" name="svg-spinners:6-dots-rotate" size="20px"
                      class="text-red-500" />
                    <icon name="ep:delete" class="w-6 h-6 text-red-700 dark:text-red-500" v-else />
                  </button>
                </tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center justify-end px-4 py-3 mt-4">
        <div class="flex mt-3 space-s-1 ms-auto">
          <button @click="categoryStore.changePage(categoryStore.currentPage - 1)"
            :disabled="categoryStore.currentPage === 1"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.previous') }}
          </button>
          <button v-for="page in categoryStore.totalPages" :key="page" @click="categoryStore.changePage(page)" :class="{
            'bg-slate-800 text-white': page === categoryStore.currentPage,
            'bg-white text-slate-500': page !== categoryStore.currentPage,
          }"
            class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 ease">
            {{ page }}
          </button>
          <button @click="categoryStore.changePage(categoryStore.currentPage + 1)"
            :disabled="categoryStore.currentPage === categoryStore.totalPages"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.next') }}
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
const categoryStore = useCategoriesStore()
const { t } = useI18n();

onMounted(() => {
  categoryStore.fetchCategories()
})

const deleteCat = ref(null);
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast()

const handleDeleteCategory = async (categoryId) => {
  deleteCat.value = categoryId;
  setTimeout(async () => {
    await categoryStore.deleteCategory(categoryId);
    triggerToast({
      title: t('toast.great'),
      message: t('toast.category_deleted_successfully'),
      type: 'success',
      icon: 'mdi:check-circle',
    });
    deleteCat.value = null;
  }, 3000);
};

definePageMeta({
  layout: "dashboard",
});

useHead({
  titleTemplate: () => t('head.categories'),
});
</script>
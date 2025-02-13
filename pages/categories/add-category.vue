<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="max-w-2xl p-6 mx-auto mt-5 bg-white dark:bg-[#181a1b] border rounded-lg">
      <h2 class="mb-4 text-2xl font-medium text-center">{{ $t('dashboard.add_category') }}</h2>
      <form @submit.prevent="handleAddCategory">
        <div class="mb-4">
          <dynamic-inputs :label="t('form.category_title')" :placeholder="t('form.enter_category_title')" type="text"
            name="category" :rules="'required|alpha_spaces'" :required="true" prefixIcon="material-symbols:category"
            v-model="newCategoryTitle" />
        </div>

        <div class="mb-4">
          <dynamic-inputs :label="t('form.category_title_ar')" :placeholder="t('form.enter_category_title_ar')"
            type="text" name="category_title_ar" :rules="'required|alpha_spaces'" :required="true"
            prefixIcon="material-symbols:category" v-model="newCategoryTitleAr" />
        </div>

        <div class="mb-4">
          <div class="mx-auto overflow-hidden rounded-lg">
            <div class="md:flex">
              <div class="w-full">
                <div
                  class="relative flex items-center justify-center h-48 bg-gray-100 border-2 border-blue-700 border-dashed border-dotted rounded-lg">
                  <div class="absolute">
                    <div class="flex flex-col items-center">
                      <icon name="material-symbols:add-photo-alternate" class="w-20 h-20 text-blue-700" />
                      <span class="block font-normal text-gray-400">{{ $t('form.attach_your_files_here') }}</span>
                    </div>
                  </div>
                  <input type="file" class="w-full h-full opacity-0" @change="handleImageUpload">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center mb-4 space-s-6" v-if="previewImage">
          <img :src="previewImage" class="w-48 h-32 rounded-lg">
        </div>

        <button type="submit" class="w-full px-4 py-2 btn-style">
          <div class="flex items-center justify-center" v-if="loadingOne">
            <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
            <icon name="svg-spinners:270-ring-with-bg" />
          </div>
          <span v-else>{{ $t('btn.add_category') }}</span>
        </button>
      </form>
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
const categoryStore = useCategoriesStore();
const loadingOne = ref(false);
const newCategoryTitle = ref('');
const newCategoryTitleAr = ref('');
const previewImage = ref("");
const selectedFile = ref(null);
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  } else {
    selectedFile.value = null;
    previewImage.value = null;
  }
};

const handleAddCategory = () => {
  loadingOne.value = true;
  if (newCategoryTitle.value.trim() && newCategoryTitleAr.value.trim() && selectedFile.value) {
    categoryStore.addCategory(newCategoryTitle.value.trim(), newCategoryTitleAr.value.trim(), selectedFile.value)
      .then(() => {
        triggerToast({
          title: t('toast.great'),
          message: t('toast.category_added_successfully'),
          type: 'success',
          icon: 'mdi-check-circle',
        });
        newCategoryTitle.value = '';
        newCategoryTitleAr.value = '';
        previewImage.value = null;
        selectedFile.value = null;
      })
      .catch((error) => {
        triggerToast({
          title: t('toast.error'),
          message: t('toast.failed_to_add_category'),
          type: 'error',
          icon: 'mdi-alert-circle',
        });
      })
      .finally(() => {
        loadingOne.value = false;
      });
  } else {
    loadingOne.value = false;
  }
};

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.add_category"),
});
</script>
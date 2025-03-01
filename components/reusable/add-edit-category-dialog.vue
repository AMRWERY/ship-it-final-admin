<template>
  <div>
    <!-- Dialog content -->
    <transition name="dialog">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <form @submit.prevent="handleSubmit">
            <!-- Dialog header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">{{ isEditMode ? $t('form.edit_category') : $t('form.add_category') }}</h3>
              <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
                <icon name="material-symbols:close" class="w-6 h-6" />
              </button>
            </div>

            <div class="mb-4">
              <dynamic-inputs :label="t('form.category_title')" :placeholder="t('form.enter_category_title')"
                type="text" name="category" :rules="'required|alpha_spaces'" :required="true"
                prefixIcon="material-symbols:category" v-model="newCategoryTitle" />
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
              <span v-else>{{ isEditMode ? $t('btn.edit_category') : $t('btn.add_category') }}</span>
            </button>
          </form>

          <!-- toast messages -->
          <div v-if="addSuccessfully" class="w-full mt-2">
            <p class="font-normal text-center text-green-800 dark:text-green-400">
              {{ $t('toast.successfully_added_category') }}
            </p>
          </div>

          <div v-if="addFailed && !addSuccessfully" class="mt-2">
            <p class="font-normal text-center text-red-800 dark:text-red-400">
              {{ $t('toast.failed_to_add_category') }}
            </p>
          </div>

          <div v-if="updateSuccessfully && isEditMode" class="w-full mt-2">
            <p class="font-normal text-center text-green-800 dark:text-green-400">
              {{ $t('toast.category_updated_successfully') }}
            </p>
          </div>

          <div v-if="updateFailed && !updateSuccessfully && isEditMode" class="mt-2">
            <p class="font-normal text-center text-red-800 dark:text-red-400">
              {{ $t('toast.failed_to_update_category') }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const { t } = useI18n()
const categoryStore = useCategoriesStore();
const loadingOne = ref(false);
const newCategoryTitle = ref('');
const newCategoryTitleAr = ref('');
const previewImage = ref("");
const selectedFile = ref(null);
const addSuccessfully = ref(false)
const addFailed = ref(false)
const updateSuccessfully = ref(false)
const updateFailed = ref(false)

const props = defineProps({
  isDialogOpen: {
    type: Boolean,
  },
  categoryId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close']);

watch(() => props.categoryId, async (newId) => {
  if (newId && newId !== 'add-category') {
    await categoryStore.fetchCategoryDetails(newId);
    newCategoryTitle.value = categoryStore.currentCategory?.title || '';
    newCategoryTitleAr.value = categoryStore.currentCategory?.titleAr || '';
    previewImage.value = categoryStore.currentCategory?.imgOne || '';
  } else {
    newCategoryTitle.value = '';
    newCategoryTitleAr.value = '';
    previewImage.value = '';
  }
});

const isOpen = computed({
  get: () => props.isDialogOpen,
  set: (value) => emit("update:isOpen", value),
})

const closeDialog = () => {
  emit('close');
};

const isEditMode = computed(() => props.categoryId && props.categoryId !== 'add-category');

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

const handleSubmit = async () => {
  loadingOne.value = true;
  addSuccessfully.value = false;
  addFailed.value = false;
  updateSuccessfully.value = false;
  updateFailed.value = false;
  if (!newCategoryTitle.value.trim() || !newCategoryTitleAr.value.trim()) {
    loadingOne.value = false;
    if (isEditMode.value) {
      updateFailed.value = true;
    } else {
      addFailed.value = true;
    }
    setTimeout(() => {
      addFailed.value = false;
      updateFailed.value = false;
    }, 3000);
    return;
  }
  const baseData = {
    title: newCategoryTitle.value.trim(),
    titleAr: newCategoryTitleAr.value.trim()
  };
  try {
    if (isEditMode.value) {
      await categoryStore.updateCategory(
        props.categoryId,
        baseData,
        selectedFile.value
      );
      updateSuccessfully.value = true;
    } else {
      if (!selectedFile.value) {
        throw new Error('Image is required');
      }
      await categoryStore.addCategory(
        baseData.title,
        baseData.titleAr,
        selectedFile.value,
      );
      addSuccessfully.value = true;
    }
    setTimeout(() => {
      addSuccessfully.value = false;
      updateSuccessfully.value = false;
    }, 3000);

    if (!isEditMode.value) {
      resetForm();
    }
    setTimeout(() => {
      emit('close');
    }, 3000);
  } catch (error) {
    if (isEditMode.value) {
      updateFailed.value = true;
    } else {
      addFailed.value = true;
    }
    setTimeout(() => {
      addFailed.value = false;
      updateFailed.value = false;
    }, 3000);
  } finally {
    loadingOne.value = false;
  }
};

const resetForm = () => {
  newCategoryTitle.value = '';
  newCategoryTitleAr.value = '';
  previewImage.value = '';
  selectedFile.value = null;
};
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.scrollable-dialog {
  overflow-y: auto;
  scrollbar-width: none;
  /* For Firefox */
}

.scrollable-dialog::-webkit-scrollbar {
  display: none;
}
</style>
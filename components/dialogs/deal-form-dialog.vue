<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900"></div>
      </div>

      <div class="inline-block overflow-hidden text-left align-bottom transition-all transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="px-4 pt-5 pb-4 text-center bg-white dark:bg-black sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                {{ deal ? $t('dashboard.edit_deal') : $t('dashboard.add_deal') }}
              </h3>

              <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.title') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="formData.title" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Arabic Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.title_ar') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="formData.titleAr" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Brand -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.brand') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="formData.brand" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Arabic Brand -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.brand_ar') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="formData.brandAr" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Discount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.discount') }} (%)
                  </label>
                  <div class="mt-1">
                    <input type="number" v-model="formData.discount" required min="0" max="100"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Original Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.original_price') }}
                  </label>
                  <div class="mt-1">
                    <input type="number" v-model="formData.originalPrice" required min="0" step="0.01"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Start Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.start_time') }}
                  </label>
                  <div class="mt-1">
                    <input type="datetime-local" v-model="formData.startTime" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.end_time') }}
                  </label>
                  <div class="mt-1">
                    <input type="datetime-local" v-model="formData.endTime" required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>

                <!-- Images -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.images') }}
                  </label>
                  <div class="mt-1 space-y-2">
                    <div v-for="(image, index) in formData.images" :key="index" class="flex items-center gap-2">
                      <input type="text" v-model="formData.images[index]" placeholder="Image URL"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                      <button type="button" @click="removeImage(index)"
                        class="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                        <icon name="material-symbols:delete" class="w-5 h-5" />
                      </button>
                    </div>
                    <button type="button" @click="addImage"
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30">
                      <icon name="material-symbols:add" class="w-5 h-5 mr-1" />
                      {{ $t('btn.add_image') }}
                    </button>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.description') }}
                  </label>
                  <div class="mt-1">
                    <textarea v-model="formData.description" rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
                  </div>
                </div>

                <!-- Arabic Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.description_ar') }}
                  </label>
                  <div class="mt-1">
                    <textarea v-model="formData.descriptionAr" rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
                  </div>
                </div>

                <!-- Colors -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.colors') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="colorsInput" @keyup.enter="addColor"
                      placeholder="Press Enter to add colors"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="(color, index) in formData.colors" :key="index"
                        class="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-800">
                        {{ color }}
                        <button type="button" @click="removeColor(index)"
                          class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <icon name="material-symbols:close" class="w-4 h-4" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Sizes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('dashboard.sizes') }}
                  </label>
                  <div class="mt-1">
                    <input type="text" v-model="sizesInput" @keyup.enter="addSize"
                      placeholder="Press Enter to add sizes"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="(size, index) in formData.sizes" :key="index"
                        class="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full dark:text-gray-300 dark:bg-gray-800">
                        {{ size }}
                        <button type="button" @click="removeSize(index)"
                          class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <icon name="material-symbols:close" class="w-4 h-4" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button type="submit"
                    class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    {{ deal ? $t('btn.update') : $t('btn.add') }}
                  </button>
                  <button type="button" @click="$emit('close')"
                    class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    {{ $t('btn.cancel') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  deal: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
  title: '',
  titleAr: '',
  brand: '',
  brandAr: '',
  discount: 0,
  originalPrice: 0,
  startTime: '',
  endTime: '',
  images: [],
  description: '',
  descriptionAr: '',
  colors: [],
  sizes: []
});

const colorsInput = ref('');
const sizesInput = ref('');

// Initialize form data when deal prop changes
watch(() => props.deal, (newDeal) => {
  if (newDeal) {
    formData.value = {
      title: newDeal.title || '',
      titleAr: newDeal.titleAr || '',
      brand: newDeal.brand || '',
      brandAr: newDeal.brandAr || '',
      discount: newDeal.discount || 0,
      originalPrice: newDeal.originalPrice || 0,
      startTime: newDeal.startTime ? new Date(newDeal.startTime.seconds * 1000).toISOString().slice(0, 16) : '',
      endTime: newDeal.endTime ? new Date(newDeal.endTime.seconds * 1000).toISOString().slice(0, 16) : '',
      images: [...(newDeal.images || [])],
      description: newDeal.description || '',
      descriptionAr: newDeal.descriptionAr || '',
      colors: [...(newDeal.colors || [])],
      sizes: [...(newDeal.sizes || [])]
    };
  } else {
    // Reset form data for new deal
    formData.value = {
      title: '',
      titleAr: '',
      brand: '',
      brandAr: '',
      discount: 0,
      originalPrice: 0,
      startTime: '',
      endTime: '',
      images: [],
      description: '',
      descriptionAr: '',
      colors: [],
      sizes: []
    };
  }
}, { immediate: true });

const addImage = () => {
  formData.value.images.push('');
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);
};

const addColor = () => {
  if (colorsInput.value.trim()) {
    formData.value.colors.push(colorsInput.value.trim());
    colorsInput.value = '';
  }
};

const removeColor = (index) => {
  formData.value.colors.splice(index, 1);
};

const addSize = () => {
  if (sizesInput.value.trim()) {
    formData.value.sizes.push(sizesInput.value.trim());
    sizesInput.value = '';
  }
};

const removeSize = (index) => {
  formData.value.sizes.splice(index, 1);
};

const handleSubmit = () => {
  // Convert datetime strings to Firestore timestamps
  const dealData = {
    ...formData.value,
    startTime: new Date(formData.value.startTime),
    endTime: new Date(formData.value.endTime),
    discountedPrice: formData.value.originalPrice * (1 - formData.value.discount / 100)
  };

  emit('save', dealData);
};
</script> 
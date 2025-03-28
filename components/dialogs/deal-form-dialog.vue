<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900"></div>
        </div>

        <div
          class="inline-block overflow-hidden align-bottom transition-all transform text-start sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="px-4 pt-5 pb-4 text-center bg-white dark:bg-black sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full mt-3 text-center sm:mt-0 sm:text-start">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {{ deal ? $t('form.edit_deal') : $t('form.add_deal') }}
                </h3>

                <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                  <!-- Title -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.title') }}
                    </label>
                    <div class="mt-1">
                      <input type="text" v-model="formData.title" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Arabic Title -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.title_ar') }}
                    </label>
                    <div class="mt-1">
                      <input type="text" v-model="formData.titleAr" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Brand -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.brand') }}
                    </label>
                    <div class="mt-1">
                      <input type="text" v-model="formData.brand" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Arabic Brand -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.brand_ar') }}
                    </label>
                    <div class="mt-1">
                      <input type="text" v-model="formData.brandAr" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Discount -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.discount') }} (%)
                    </label>
                    <div class="mt-1">
                      <input type="number" v-model="formData.discount" required min="0" max="100"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Original Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.original_price') }}
                    </label>
                    <div class="mt-1">
                      <input type="number" v-model="formData.originalPrice" required min="0" step="0.01"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Start Time -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.start_time') }}
                    </label>
                    <div class="mt-1">
                      <input type="datetime-local" v-model="formData.startTime" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- End Time -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.end_time') }}
                    </label>
                    <div class="mt-1">
                      <input type="datetime-local" v-model="formData.endTime" required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <!-- Images -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.images') }}
                    </label>
                    <div class="grid grid-cols-2 gap-6 px-4 mx-auto mt-3 md:grid-cols-4 lg:px-6">
                      <!-- Image 1 -->
                      <div class="flex flex-col items-center">
                        <div v-if="imagePreview.image1" class="relative mb-2 w-28 h-28">
                          <img :src="imagePreview.image1" class="object-cover w-full h-full rounded-lg" />
                          <button type="button" @click="removeImagePreview('image1')" 
                                  class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                            <icon name="material-symbols:close" class="w-4 h-4" />
                          </button>
                        </div>
                        <div v-else class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image1" class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate" class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file') }}</span>
                          </label>
                        </div>
                        <input id="image1" type="file" class="hidden" accept="image/*" @change="handleImageUpload($event, 'image1')" />
                      </div>

                      <!-- Image 2 -->
                      <div class="flex flex-col items-center">
                        <div v-if="imagePreview.image2" class="relative mb-2 w-28 h-28">
                          <img :src="imagePreview.image2" class="object-cover w-full h-full rounded-lg" />
                          <button type="button" @click="removeImagePreview('image2')" 
                                  class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                            <icon name="material-symbols:close" class="w-4 h-4" />
                          </button>
                        </div>
                        <div v-else class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image2" class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate" class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file') }}</span>
                          </label>
                        </div>
                        <input id="image2" type="file" class="hidden" accept="image/*" @change="handleImageUpload($event, 'image2')" />
                      </div>

                      <!-- Image 3 -->
                      <div class="flex flex-col items-center">
                        <div v-if="imagePreview.image3" class="relative mb-2 w-28 h-28">
                          <img :src="imagePreview.image3" class="object-cover w-full h-full rounded-lg" />
                          <button type="button" @click="removeImagePreview('image3')" 
                                  class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                            <icon name="material-symbols:close" class="w-4 h-4" />
                          </button>
                        </div>
                        <div v-else class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image3" class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate" class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file') }}</span>
                          </label>
                        </div>
                        <input id="image3" type="file" class="hidden" accept="image/*" @change="handleImageUpload($event, 'image3')" />
                      </div>

                      <!-- Image 4 -->
                      <div class="flex flex-col items-center">
                        <div v-if="imagePreview.image4" class="relative mb-2 w-28 h-28">
                          <img :src="imagePreview.image4" class="object-cover w-full h-full rounded-lg" />
                          <button type="button" @click="removeImagePreview('image4')" 
                                  class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                            <icon name="material-symbols:close" class="w-4 h-4" />
                          </button>
                        </div>
                        <div v-else class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image4" class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate" class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file') }}</span>
                          </label>
                        </div>
                        <input id="image4" type="file" class="hidden" accept="image/*" @change="handleImageUpload($event, 'image4')" />
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.description') }}
                    </label>
                    <div class="mt-1">
                      <textarea v-model="formData.description" rows="3"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                  </div>

                  <!-- Arabic Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.description_ar') }}
                    </label>
                    <div class="mt-1">
                      <textarea v-model="formData.descriptionAr" rows="3"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                  </div>

                  <!-- Colors -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('form.colors') }}
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
                      {{ $t('form.sizes') }}
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
                      class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ms-3 sm:w-auto sm:text-sm">
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
const imageFiles = ref({
  image1: null,
  image2: null,
  image3: null,
  image4: null
});
const imagePreview = ref({
  image1: '',
  image2: '',
  image3: '',
  image4: ''
});

// Initialize form data when deal prop changes
watch(() => props.deal, (newDeal) => {
  if (newDeal) {
    // Format the dates for the form
    let startTimeStr = '';
    let endTimeStr = '';
    // Handle different timestamp formats
    if (newDeal.startTime) {
      if (newDeal.startTime.seconds) {
        const date = new Date(newDeal.startTime.seconds * 1000);
        startTimeStr = date.toISOString().slice(0, 16);
      } else if (typeof newDeal.startTime.toDate === 'function') {
        startTimeStr = newDeal.startTime.toDate().toISOString().slice(0, 16);
      } else if (typeof newDeal.startTime === 'string') {
        startTimeStr = new Date(newDeal.startTime).toISOString().slice(0, 16);
      } else if (newDeal.startTime instanceof Date) {
        startTimeStr = newDeal.startTime.toISOString().slice(0, 16);
      }
    }

    if (newDeal.endTime) {
      if (newDeal.endTime.seconds) {
        const date = new Date(newDeal.endTime.seconds * 1000);
        endTimeStr = date.toISOString().slice(0, 16);
      } else if (typeof newDeal.endTime.toDate === 'function') {
        endTimeStr = newDeal.endTime.toDate().toISOString().slice(0, 16);
      } else if (typeof newDeal.endTime === 'string') {
        endTimeStr = new Date(newDeal.endTime).toISOString().slice(0, 16);
      } else if (newDeal.endTime instanceof Date) {
        endTimeStr = newDeal.endTime.toISOString().slice(0, 16);
      }
    }

    formData.value = {
      title: newDeal.title || '',
      titleAr: newDeal.titleAr || '',
      brand: newDeal.brand || '',
      brandAr: newDeal.brandAr || '',
      discount: newDeal.discount || 0,
      originalPrice: newDeal.originalPrice || newDeal.price || 0,
      startTime: startTimeStr,
      endTime: endTimeStr,
      images: [...(newDeal.images || [])],
      description: newDeal.description || '',
      descriptionAr: newDeal.descriptionAr || '',
      colors: [...(newDeal.colors || [])],
      sizes: [...(newDeal.sizes || [])]
    };
    
    // Set image previews if available
    if (newDeal.imageUrl1) imagePreview.value.image1 = newDeal.imageUrl1;
    if (newDeal.imageUrl2) imagePreview.value.image2 = newDeal.imageUrl2;
    if (newDeal.imageUrl3) imagePreview.value.image3 = newDeal.imageUrl3;
    if (newDeal.imageUrl4) imagePreview.value.image4 = newDeal.imageUrl4;
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
    // Reset image previews
    imagePreview.value = {
      image1: '',
      image2: '',
      image3: '',
      image4: ''
    };
    // Reset image files
    imageFiles.value = {
      image1: null,
      image2: null,
      image3: null,
      image4: null
    };
  }
}, { immediate: true });

// Handle image upload
const handleImageUpload = (event, imageKey) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Store the file for later upload
  imageFiles.value[imageKey] = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value[imageKey] = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Remove image preview and clear file input
const removeImagePreview = (imageKey) => {
  imagePreview.value[imageKey] = '';
  imageFiles.value[imageKey] = null;
  
  // Reset the file input
  const fileInput = document.getElementById(imageKey);
  if (fileInput) fileInput.value = '';
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
  // Collect all available image files
  const files = [];
  if (imageFiles.value.image1) files.push(imageFiles.value.image1);
  if (imageFiles.value.image2) files.push(imageFiles.value.image2);
  if (imageFiles.value.image3) files.push(imageFiles.value.image3);
  if (imageFiles.value.image4) files.push(imageFiles.value.image4);

  // Retain existing image URLs if no new file is selected
  const imageUrls = {};
  
  // Keep existing images if editing and no new file was uploaded
  if (props.deal) {
    if (!imageFiles.value.image1 && props.deal.imageUrl1) imageUrls.imageUrl1 = props.deal.imageUrl1;
    if (!imageFiles.value.image2 && props.deal.imageUrl2) imageUrls.imageUrl2 = props.deal.imageUrl2;
    if (!imageFiles.value.image3 && props.deal.imageUrl3) imageUrls.imageUrl3 = props.deal.imageUrl3;
    if (!imageFiles.value.image4 && props.deal.imageUrl4) imageUrls.imageUrl4 = props.deal.imageUrl4;
  }

  const dealData = {
    ...formData.value,
    ...imageUrls, // Include existing image URLs
    startTime: new Date(formData.value.startTime),
    endTime: new Date(formData.value.endTime),
    discountedPrice: formData.value.originalPrice * (1 - formData.value.discount / 100)
  };

  // If we're updating with new files, pass both the dealData and files
  if (files.length > 0) {
    emit('save', dealData, files);
  } else {
    emit('save', dealData);
  }
};
</script>
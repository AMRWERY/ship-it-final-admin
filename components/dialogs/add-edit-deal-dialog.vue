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
                <!-- Header with close icon -->
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    {{ deal ? $t('form.edit_deal') : $t('form.add_deal') }}
                  </h3>
                  <button @click="$emit('close')"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                    <icon name="material-symbols:close" class="w-6 h-6" />
                  </button>
                </div>

                <!-- Progress indicator -->
                <div class="flex items-center w-full mb-6">
                  <div class="flex items-center w-full">
                    <div v-for="(s, index) in steps" :key="index" class="flex items-center flex-1">
                      <div :class="[
                        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0',
                        currentStep > index
                          ? 'bg-indigo-600 text-white'
                          : currentStep === index
                            ? 'bg-indigo-100 text-indigo-600 border border-indigo-600'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                      ]">
                        <span v-if="currentStep > index">
                          <icon name="heroicons-outline:check" class="flex items-center w-5 h-5" />
                        </span>
                        <span v-else>{{ index + 1 }}</span>
                      </div>
                      <div v-if="index < steps.length - 1" :class="[
                        'h-1 flex-grow mx-2',
                        currentStep > index ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      ]"></div>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                  <!-- Step 1: Basic Information -->
                  <div v-if="currentStep === 0" class="step-content scrollable-dialog max-h-[400px] overflow-y-auto">
                    <div>
                      <dynamic-inputs :label="t('form.product_title')" :placeholder="t('form.enter_product_title')"
                        type="text" :name="t('form.product_title')" :rules="'required'" :required="true"
                        prefixIcon="mdi:tshirt-v" v-model="formData.title" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.product_title_ar')"
                        :placeholder="t('form.enter_product_title_ar')" type="text" :name="t('form.product_title_ar')"
                        :rules="'required'" :required="true" prefixIcon="mdi:tshirt-v" v-model="formData.titleAr" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.brand')" :placeholder="t('form.enter_brand')" type="text"
                        :name="t('form.brand')" :rules="'required|alpha_spaces'" :required="true"
                        prefixIcon="cib:brand-ai" v-model="formData.brand" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.brand_ar')" :placeholder="t('form.enter_brand_ar')" type="text"
                        :name="t('form.brand_ar')" :rules="'required|alpha_spaces'" :required="true"
                        prefixIcon="cib:brand-ai" v-model="formData.brandAr" />
                    </div>
                  </div>

                  <!-- Step 2: Pricing & Timing -->
                  <div v-if="currentStep === 1" class="step-content scrollable-dialog max-h-[400px] overflow-y-auto">
                    <div>
                      <dynamic-inputs :label="t('form.discount')" :placeholder="t('form.enter_the_discount_percentage')"
                        type="number" :name="t('form.discount')" :rules="'required'" :required="true"
                        prefixIcon="ri:discount-percent-fill" v-model="formData.discount" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.original_price')" :placeholder="t('form.enter_original_price')"
                        type="number" :name="t('form.original_price')" :rules="'required'" :required="true"
                        prefixIcon="solar:dollar-linear" v-model="formData.originalPrice" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.discounted_price')"
                        :placeholder="t('form.enter_discounted_price')" type="number" :name="t('form.discounted_price')"
                        :rules="'required'" :required="true" prefixIcon="solar:dollar-linear"
                        v-model="formData.discountedPrice" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.start_time')" type="datetime-local" :name="t('form.start_time')"
                        :rules="'required'" :required="true" prefixIcon="material-symbols:calendar-today"
                        v-model="formData.startTime" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.end_time')" type="datetime-local" :name="t('form.end_time')"
                        :rules="'required'" :required="true" prefixIcon="material-symbols:calendar-month"
                        v-model="formData.endTime" />
                    </div>
                  </div>

                  <!-- Step 3: Images -->
                  <div v-if="currentStep === 2" class="step-content scrollable-dialog max-h-[400px] overflow-y-auto">
                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        <div v-else
                          class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image1"
                            class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate"
                              class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                            }}</span>
                          </label>
                        </div>
                        <input id="image1" type="file" class="hidden" accept="image/*"
                          @change="handleImageUpload($event, 'image1')" />
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
                        <div v-else
                          class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image2"
                            class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate"
                              class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                            }}</span>
                          </label>
                        </div>
                        <input id="image2" type="file" class="hidden" accept="image/*"
                          @change="handleImageUpload($event, 'image2')" />
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
                        <div v-else
                          class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image3"
                            class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate"
                              class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                            }}</span>
                          </label>
                        </div>
                        <input id="image3" type="file" class="hidden" accept="image/*"
                          @change="handleImageUpload($event, 'image3')" />
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
                        <div v-else
                          class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                          <label for="image4"
                            class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                            <icon name="material-symbols:add-photo-alternate"
                              class="w-10 h-10 text-blue-700 dark:text-blue-400" />
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                            }}</span>
                          </label>
                        </div>
                        <input id="image4" type="file" class="hidden" accept="image/*"
                          @change="handleImageUpload($event, 'image4')" />
                      </div>
                    </div>
                  </div>

                  <!-- Step 4: Description -->
                  <div v-if="currentStep === 3" class="step-content scrollable-dialog max-h-[400px] overflow-y-auto">
                    <div>
                      <dynamic-inputs :label="t('form.product_description')"
                        :placeholder="t('form.enter_product_description')" type="textarea"
                        :name="t('form.product_description')" :rules="'required'" :required="true"
                        prefixIcon="pajamas:text-description" v-model="formData.description" />
                    </div>

                    <div>
                      <dynamic-inputs :label="t('form.product_description_ar')"
                        :placeholder="t('form.enter_product_description_ar')" type="textarea"
                        :name="t('form.product_description_ar')" :rules="'required'" :required="true"
                        prefixIcon="pajamas:text-description" v-model="formData.descriptionAr" />
                    </div>
                  </div>

                  <!-- Navigation buttons -->
                  <div class="flex justify-between mt-6">
                    <button type="button" v-if="currentStep > 0" @click="currentStep--"
                      class="inline-flex justify-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                      {{ $t('btn.previous') }}
                    </button>
                    <div class="flex-grow"></div>
                    <button type="button" v-if="currentStep < steps.length - 1" @click="currentStep++"
                      class="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                      {{ $t('btn.next') }}
                    </button>
                    <button type="submit" v-if="currentStep === steps.length - 1"
                      class="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                      {{ deal ? $t('btn.update') : $t('btn.add') }}
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
const { t } = useI18n()

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
  discountedPrice: 0,
  startTime: '',
  endTime: '',
  description: '',
  descriptionAr: '',
});

// Step handling
const steps = ref([
  { title: 'Basic Info' },
  { title: 'Pricing & Timing' },
  { title: 'Images' },
  { title: 'Description' }
]);
const currentStep = ref(0);

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
      discountedPrice: newDeal.discountedPrice || 0,
      startTime: startTimeStr,
      endTime: endTimeStr,
      description: newDeal.description || '',
      descriptionAr: newDeal.descriptionAr || '',
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
      discountedPrice: 0,
      startTime: '',
      endTime: '',
      description: '',
      descriptionAr: '',
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

    // Reset to first step
    currentStep.value = 0;
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

  // Calculate discounted price if not provided
  if (!formData.value.discountedPrice && formData.value.originalPrice && formData.value.discount) {
    formData.value.discountedPrice = formData.value.originalPrice * (1 - formData.value.discount / 100);
  }

  const dealData = {
    ...formData.value,
    ...imageUrls, // Include existing image URLs
    startTime: new Date(formData.value.startTime),
    endTime: new Date(formData.value.endTime),
  };

  // If we're updating with new files, pass both the dealData and files
  if (files.length > 0) {
    emit('save', dealData, files);
  } else {
    emit('save', dealData);
  }
};
</script>

<style scoped>
.scrollable-dialog {
  overflow-y: auto;
  scrollbar-width: none;
  /* For Firefox */
}

.scrollable-dialog::-webkit-scrollbar {
  display: none;
}

.scrollable-dialog::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 8px;
}

.scrollable-dialog::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 8px;
}

.dark .scrollable-dialog {
  scrollbar-color: #4b5563 #1f2937;
}

.dark .scrollable-dialog::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .scrollable-dialog::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>
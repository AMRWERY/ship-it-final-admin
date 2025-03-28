<template>
  <div>
    <!-- Dialog content -->
    <transition name="dialog">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <form @submit.prevent="handleSubmit">
            <!-- Dialog header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold">{{ isEditMode ? $t('form.edit_product') : $t('form.add_product') }}</h3>
              <button @click="closeDialog"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                <icon name="material-symbols:close" class="w-6 h-6" />
              </button>
            </div>

            <!-- Progress indicator -->
            <div class="w-full px-4 mb-6">
              <div class="flex items-center justify-center w-full">
                <div v-for="(s, index) in steps" :key="index" class="flex items-center"
                  :class="{ 'flex-1': index < steps.length - 1, 'max-w-[80px]': index === steps.length - 1 }">
                  <div class="flex flex-col items-center">
                    <div :class="[
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0',
                      step > index
                        ? 'bg-indigo-600 text-white'
                        : step === index
                          ? 'bg-indigo-100 text-indigo-600 border border-indigo-600'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                    ]">
                      <span v-if="step > index">
                        <icon name="heroicons-outline:check" class="flex items-center w-5 h-5" />
                      </span>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                  </div>
                  <div v-if="index < steps.length - 1" :class="[
                    'h-1 w-full mx-3',
                    step > index ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  ]"></div>
                </div>
              </div>
            </div>

            <!-- Step content -->
            <div class="step-content scrollable-dialog max-h-[450px]">
              <div v-if="step === 1">
                <div class="mb-4">
                  <label for="main-category" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
                    {{ $t('form.category') }}
                  </label>
                  <select id="main-category" name="main-category" v-model="selectedCategory"
                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-16 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow dark:placeholder:text-slate-200">
                    <option value="" disabled class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">
                      {{ $t('form.select_category') }}
                    </option>
                    <option v-for="category in categories" :key="category.id" :value="category.id"
                      class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">
                      {{ $i18n.locale === 'ar' ? category.titleAr : category.title }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.brand')" :placeholder="t('form.enter_brand')" type="text" name="brand"
                    :rules="'required|alpha_spaces'" :required="true" prefixIcon="cib:brand-ai"
                    v-model="product.brand" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.brand_ar')" :placeholder="t('form.enter_brand_ar')" type="text"
                    name="brand_ar" :rules="'required|alpha_spaces'" :required="true" prefixIcon="cib:brand-ai"
                    v-model="product.brandAr" />
                </div>

                <div class="mb-4">
                  <div class="mx-auto overflow-hidden rounded-lg">
                    <div class="md:flex">
                      <div class="w-full">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ $t('form.images') }}
                        </label>
                        <div class="grid grid-cols-2 gap-6 px-4 mx-auto mt-3 md:grid-cols-4 lg:px-6">
                          <!-- Image 1 -->
                          <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl1" class="relative mb-2 w-28 h-28">
                              <img :src="imagePreview.imageUrl1" class="object-cover w-full h-full rounded-lg" />
                              <button type="button" @click="removeImagePreview('imageUrl1')"
                                class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                                <icon name="material-symbols:close" class="w-4 h-4" />
                              </button>
                            </div>
                            <div v-else
                              class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                              <label for="imageUrl1"
                                class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                <icon name="material-symbols:add-photo-alternate"
                                  class="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                                }}</span>
                              </label>
                            </div>
                            <input id="imageUrl1" type="file" class="hidden" accept="image/*"
                              @change="handleSingleImageUpload($event, 'imageUrl1')" />
                          </div>

                          <!-- Image 2 -->
                          <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl2" class="relative mb-2 w-28 h-28">
                              <img :src="imagePreview.imageUrl2" class="object-cover w-full h-full rounded-lg" />
                              <button type="button" @click="removeImagePreview('imageUrl2')"
                                class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                                <icon name="material-symbols:close" class="w-4 h-4" />
                              </button>
                            </div>
                            <div v-else
                              class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                              <label for="imageUrl2"
                                class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                <icon name="material-symbols:add-photo-alternate"
                                  class="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                                }}</span>
                              </label>
                            </div>
                            <input id="imageUrl2" type="file" class="hidden" accept="image/*"
                              @change="handleSingleImageUpload($event, 'imageUrl2')" />
                          </div>

                          <!-- Image 3 -->
                          <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl3" class="relative mb-2 w-28 h-28">
                              <img :src="imagePreview.imageUrl3" class="object-cover w-full h-full rounded-lg" />
                              <button type="button" @click="removeImagePreview('imageUrl3')"
                                class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                                <icon name="material-symbols:close" class="w-4 h-4" />
                              </button>
                            </div>
                            <div v-else
                              class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                              <label for="imageUrl3"
                                class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                <icon name="material-symbols:add-photo-alternate"
                                  class="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                                }}</span>
                              </label>
                            </div>
                            <input id="imageUrl3" type="file" class="hidden" accept="image/*"
                              @change="handleSingleImageUpload($event, 'imageUrl3')" />
                          </div>

                          <!-- Image 4 -->
                          <div class="flex flex-col items-center">
                            <div v-if="imagePreview.imageUrl4" class="relative mb-2 w-28 h-28">
                              <img :src="imagePreview.imageUrl4" class="object-cover w-full h-full rounded-lg" />
                              <button type="button" @click="removeImagePreview('imageUrl4')"
                                class="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600">
                                <icon name="material-symbols:close" class="w-4 h-4" />
                              </button>
                            </div>
                            <div v-else
                              class="p-4 mb-2 border border-indigo-500 rounded-lg shadow-md w-28 h-28 bg-gray-50 dark:bg-gray-800">
                              <label for="imageUrl4"
                                class="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
                                <icon name="material-symbols:add-photo-alternate"
                                  class="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                <span class="font-medium text-gray-600 dark:text-gray-300">{{ $t('form.upload_file')
                                }}</span>
                              </label>
                            </div>
                            <input id="imageUrl4" type="file" class="hidden" accept="image/*"
                              @change="handleSingleImageUpload($event, 'imageUrl4')" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error message below the file input -->
                <div v-if="fileUploadError" class="font-medium text-red-600 dark:text-red-500">
                  {{ fileUploadError }}
                </div>

                <div v-if="isEditMode && productImages.length && !anyImagePreview"
                  class="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-4">
                  <div v-for="(img, index) in productImages" :key="index"
                    class="relative p-1 border border-gray-200 rounded-lg">
                    <img :src="img" alt="Product Image" class="object-cover w-full rounded-lg h-28" />
                  </div>
                </div>
              </div>

              <div v-else-if="step === 2">
                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_title')" :placeholder="t('form.enter_product_title')"
                    type="text" :name="t('form.product_title')" :rules="'required'" :required="true"
                    prefixIcon="mdi:tshirt-v" v-model="product.title" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_title_ar')" :placeholder="t('form.enter_product_title_ar')"
                    type="text" :name="t('form.product_title_ar')" :rules="'required'" :required="true"
                    prefixIcon="mdi:tshirt-v" v-model="product.titleAr" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_description')"
                    :placeholder="t('form.enter_product_description')" type="textarea"
                    :name="t('form.product_description')" :rules="'required'" :required="true"
                    prefixIcon="pajamas:text-description" v-model="product.description" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_description_ar')"
                    :placeholder="t('form.enter_your_product_description_ar')" type="textarea"
                    :name="t('form.product_description_ar')" :rules="'required'" :required="true"
                    prefixIcon="pajamas:text-description" v-model="product.descriptionAr" />
                </div>
              </div>

              <div v-else-if="step === 3">
                <div class="mb-4">
                  <p class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{ $t('form.product_type')
                  }}</p>
                  <div class="grid grid-cols-3 gap-4 ms-2">
                    <label for="new-arrival" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="new-arrival" name="new-arrival" value="New_Arrival"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent"
                        v-model="product.productTypes">New Arrival
                    </label>

                    <label for="express-deals" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="express-deals" name="express-deals" value="Express_Deals"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent"
                        v-model="product.productTypes">Express Deals
                    </label>

                    <label for="sale" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="sale" name="sale" value="Sale"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent"
                        v-model="product.productTypes">Sale
                    </label>

                    <label for="bundle" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="bundle" name="bundle" value="Bundle"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent"
                        v-model="product.productTypes">Bundle
                    </label>

                    <label for="custom" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="custom" name="custom" value="Custom"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent"
                        v-model="product.productTypes">Custom
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{ $t('form.size') }}</p>
                  <div class="grid grid-cols-4 gap-4 md:grid-cols-4 ms-2">
                    <label v-for="size in store.sizes" :key="size.id"
                      class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" :id="`size-${size.id}`" :name="`size-${size.title}`" :value="size.value"
                        v-model="product.sizes"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent">
                      {{ size.title }}
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{ $t('form.color') }}</p>
                  <div class="grid grid-cols-2 gap-4 ms-2">
                    <label v-for="color in store.colors" :key="color.id"
                      class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" :id="`color-${color.id}`" :name="`color-${color.id}`" :value="color.value"
                        v-model="product.colors"
                        class="text-indigo-600 transition duration-150 ease-in-out me-2 form-checkbox checked:border-transparent">
                      {{ $i18n.locale === 'ar' ? color.titleAr : color.title }}
                    </label>
                  </div>
                </div>
              </div>

              <div v-else-if="step === 4">
                <div class="mb-4">
                  <dynamic-inputs :label="t('form.original_price')" :placeholder="t('form.enter_original_price')"
                    type="number" :name="t('form.original_price')" :rules="'required'" :required="true"
                    prefixIcon="solar:dollar-linear" v-model="product.originalPrice" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.discounted_price')" :placeholder="t('form.enter_discounted_price')"
                    type="number" :name="t('form.discounted_price')" :rules="'required'" :required="true"
                    prefixIcon="solar:dollar-linear" v-model="product.discountedPrice" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.discount')" :placeholder="t('form.enter_the_discount_percentage')"
                    type="number" :name="t('form.discount')" :rules="'required'" :required="true"
                    prefixIcon="ri:discount-percent-fill" v-model="product.discount" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.sku')" :placeholder="t('form.enter_sku')" type="text"
                    :name="t('form.sku')" :rules="'required'" :required="true" prefixIcon="material-symbols:barcode"
                    v-model="product.sku" />
                </div>

                <div class="mb-4">
                  <label for="availability" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
                    {{ $t('form.availability') }}
                  </label>
                  <select id="availability" name="availability" v-model="product.availability"
                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-16 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow dark:placeholder:text-slate-200">
                    <option value="" disabled class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">
                      {{ $t('form.select_availability') }}
                    </option>
                    <option class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">In stock</option>
                    <option class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">Out of stock</option>
                  </select>
                </div>

                <div class="mb-4" v-if="product.availability === 'In stock'">
                  <dynamic-inputs :label="t('form.stock')" :placeholder="t('form.enter_stock')" type="number"
                    name="stock" :rules="'required|numeric'" :required="true"
                    prefixIcon="lsicon:management-stockout-filled" v-model="product.stock" />
                </div>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="flex justify-between mt-6">
              <button type="button" v-if="step > 1" @click="prevStep"
                class="inline-flex justify-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                {{ $t('btn.previous') }}
              </button>
              <div class="flex-grow"></div>
              <button type="button" v-if="step < 4" @click="nextStep"
                class="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                {{ $t('btn.next') }}
              </button>
              <button type="submit"
                class="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                v-if="step === 4">
                <div class="flex items-center justify-center" v-if="loading">
                  <span class="text-center me-2">{{ $t('btn.please_wait') }}...</span>
                  <icon name="svg-spinners:270-ring-with-bg" />
                </div>
                <span v-else>
                  {{ isEditMode ? $t('btn.edit_product') : $t('btn.add_product') }}
                </span>
              </button>
            </div>
          </form>

          <!-- toast messages -->
          <div v-if="addSuccessfully" class="w-full mt-2">
            <p class="font-normal text-center text-green-800 dark:text-green-400">
              {{ $t('toast.successfully_added_product') }}
            </p>
          </div>

          <div v-if="addFailed && !addSuccessfully" class="mt-2">
            <p class="font-normal text-center text-red-800 dark:text-red-400">
              {{ $t('toast.failed_to_add_product') }}
            </p>
          </div>

          <div v-if="updateSuccessfully && isEditMode" class="w-full mt-2">
            <p class="font-normal text-center text-green-800 dark:text-green-400">
              {{ $t('toast.product_updated_successfully') }}
            </p>
          </div>

          <div v-if="updateFailed && !updateSuccessfully && isEditMode" class="mt-2">
            <p class="font-normal text-center text-red-800 dark:text-red-400">
              {{ $t('toast.failed_to_update_product') }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const store = useProductsStore()
const loading = ref(false);
const categories = ref([])
const selectedCategory = ref('')
const product = ref({
  brand: '',
  brandAr: '',
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  discountedPrice: '',
  originalPrice: '',
  discount: '',
  sku: '',
  stock: '',
  availability: '',
  productTypes: [],
  sizes: [],
  colors: []
})
const selectedFiles = ref({
  imageUrl1: null,
  imageUrl2: null,
  imageUrl3: null,
  imageUrl4: null
});
const imagePreview = ref({
  imageUrl1: '',
  imageUrl2: '',
  imageUrl3: '',
  imageUrl4: ''
});
const previewImages = ref([])
const fileUploadError = ref('');
const addSuccessfully = ref(false)
const addFailed = ref(false)
const updateSuccessfully = ref(false)
const updateFailed = ref(false)

// Define steps
const steps = ref([
  { title: 'Category' },
  { title: 'Details' },
  { title: 'Options' },
  { title: 'Pricing' }
])

const handleImageUpload = (event) => {
  const files = event.target.files;
  if (files.length > 4) {
    fileUploadError.value = t("form.maximum_four_images_allowed");
    event.target.value = "";
    return;
  } else {
    fileUploadError.value = "";
  }
  if (files.length > 0) {
    selectedFiles.value = Array.from(files);
    previewImages.value = [];
    selectedFiles.value.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  } else {
    selectedFiles.value = [];
    previewImages.value = [];
  }
};

const productImages = computed(() => {
  const images = [];
  if (product.value.imageUrl1) images.push(product.value.imageUrl1);
  if (product.value.imageUrl2) images.push(product.value.imageUrl2);
  if (product.value.imageUrl3) images.push(product.value.imageUrl3);
  if (product.value.imageUrl4) images.push(product.value.imageUrl4);
  return images;
});

const { t } = useI18n();

const props = defineProps({
  isDialogOpen: {
    type: Boolean,
    default: false
  },
  productId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close']);

watch(() => props.productId, async (newId) => {
  if (newId) {
    await store.fetchProductDetail(newId);
    product.value = { ...store.selectedProduct };
    selectedCategory.value = store.selectedProduct.categoryId;

    // Set image previews if available for edit mode
    if (store.selectedProduct.imageUrl1) imagePreview.value.imageUrl1 = store.selectedProduct.imageUrl1;
    if (store.selectedProduct.imageUrl2) imagePreview.value.imageUrl2 = store.selectedProduct.imageUrl2;
    if (store.selectedProduct.imageUrl3) imagePreview.value.imageUrl3 = store.selectedProduct.imageUrl3;
    if (store.selectedProduct.imageUrl4) imagePreview.value.imageUrl4 = store.selectedProduct.imageUrl4;
  } else {
    resetForm();
  }
});

const isOpen = computed({
  get: () => props.isDialogOpen,
  set: (value) => emit("update:isOpen", value),
})

const closeDialog = () => {
  resetToastStates();
  emit('close');
};

const isEditMode = computed(() => props.productId && props.productId !== 'add-product');

const handleSubmit = () => {
  loading.value = true;
  const category = categories.value.find(
    (cat) => cat.id === selectedCategory.value
  );

  if (!product.value.title || !selectedCategory.value) {
    addFailed.value = true;
    loading.value = false;
    setTimeout(() => {
      addFailed.value = false;
    }, 3000);
    return;
  }

  // Calculate discounted price if not provided
  if (!product.value.discountedPrice && product.value.originalPrice && product.value.discount) {
    product.value.discountedPrice = product.value.originalPrice * (1 - product.value.discount / 100);
  }

  // Collect all available image files for upload
  const files = [];
  if (selectedFiles.value.imageUrl1) files.push(selectedFiles.value.imageUrl1);
  if (selectedFiles.value.imageUrl2) files.push(selectedFiles.value.imageUrl2);
  if (selectedFiles.value.imageUrl3) files.push(selectedFiles.value.imageUrl3);
  if (selectedFiles.value.imageUrl4) files.push(selectedFiles.value.imageUrl4);

  // Retain existing image URLs if no new file is selected
  const imageUrls = {};
  if (isEditMode.value) {
    if (!selectedFiles.value.imageUrl1 && product.value.imageUrl1) imageUrls.imageUrl1 = product.value.imageUrl1;
    if (!selectedFiles.value.imageUrl2 && product.value.imageUrl2) imageUrls.imageUrl2 = product.value.imageUrl2;
    if (!selectedFiles.value.imageUrl3 && product.value.imageUrl3) imageUrls.imageUrl3 = product.value.imageUrl3;
    if (!selectedFiles.value.imageUrl4 && product.value.imageUrl4) imageUrls.imageUrl4 = product.value.imageUrl4;
  }

  const filteredProductData = Object.fromEntries(
    Object.entries(product.value).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== "" && value !== null && value !== undefined;
    })
  );

  const productData = {
    ...filteredProductData,
    ...imageUrls, // Include existing image URLs
    categoryId: selectedCategory.value,
  };

  if (isEditMode.value) {
    if (files.length > 0) {
      // Update with new images
      store.updateProductWithImages(props.productId, productData, files)
        .then(() => {
          updateSuccessfully.value = true;
          setTimeout(() => {
            updateSuccessfully.value = false;
          }, 3000)
        })
        .catch((error) => {
          updateFailed.value = true;
          setTimeout(() => {
            updateFailed.value = false;
          }, 3000);
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      // Update without new images
      store.updateProduct(props.productId, productData)
        .then(() => {
          updateSuccessfully.value = true;
          setTimeout(() => {
            updateSuccessfully.value = false;
          }, 3000)
        })
        .catch((error) => {
          updateFailed.value = true;
          setTimeout(() => {
            updateFailed.value = false;
          }, 3000);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  } else {
    // For new products, require at least one image
    if (files.length === 0) {
      fileUploadError.value = t("toast.please_upload_at_least_one_image");
      loading.value = false;
      return;
    }

    store.createProduct(productData, files)
      .then(() => {
        addSuccessfully.value = true;
        resetForm();
        setTimeout(() => {
          addSuccessfully.value = false;
        }, 3000);
      })
      .catch((error) => {
        addFailed.value = true;
        setTimeout(() => {
          addFailed.value = false;
        }, 3000);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const resetForm = () => {
  product.value = {
    brand: '',
    brandAr: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    discountedPrice: '',
    originalPrice: '',
    discount: '',
    sku: '',
    stock: '',
    availability: '',
    productTypes: [],
    sizes: [],
    colors: []
  };
  selectedCategory.value = '';
  selectedFiles.value = {
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
    imageUrl4: null
  };
  imagePreview.value = {
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: ''
  };
  previewImages.value = [];
  step.value = 1;
  fileUploadError.value = '';
};

const categoryStore = useCategoriesStore()

onMounted(async () => {
  await categoryStore.fetchCategories();
  categories.value = categoryStore.categories;

  if (isEditMode.value) {
    try {
      const fetchedProduct = await store.fetchProductDetail(props.productId);
      if (fetchedProduct) {
        product.value = { ...fetchedProduct };
        selectedCategory.value = fetchedProduct.categoryId;
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  }

  store.fetchColors()
  store.fetchSizes()
});

const step = ref(1)

const resetToastStates = () => {
  addSuccessfully.value = false;
  addFailed.value = false;
  updateSuccessfully.value = false;
  updateFailed.value = false;
}

const nextStep = () => {
  resetToastStates()
  step.value++
}

const prevStep = () => {
  resetToastStates()
  step.value--
}

// Calculate if any image preview is available
const anyImagePreview = computed(() => {
  return imagePreview.value.imageUrl1 ||
    imagePreview.value.imageUrl2 ||
    imagePreview.value.imageUrl3 ||
    imagePreview.value.imageUrl4;
});

// Handle single image upload for the new image input design
const handleSingleImageUpload = (event, imageKey) => {
  const file = event.target.files[0];
  if (!file) return;

  // Store the file for later upload
  selectedFiles.value[imageKey] = file;

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
  selectedFiles.value[imageKey] = null;

  // Reset the file input
  const fileInput = document.getElementById(imageKey);
  if (fileInput) fileInput.value = '';
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
</style>
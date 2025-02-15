<template>
  <div>
    <!-- Dialog content -->
    <transition name="dialog">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <form @submit.prevent="handleSubmit">
            <!-- Dialog header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">{{ isEditMode ? $t('form.edit_product') : $t('form.add_product') }}</h3>
              <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
                <icon name="material-symbols:close" class="w-6 h-6" />
              </button>
            </div>

            <!-- Step content -->
            <div class="step-content scrollable-dialog max-h-[450px]">
              <div v-if="step === 1">
                <div class="mb-4">
                  <label for="main-category" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{
                    $t('form.category') }}</label>
                  <select id="main-category" name="main-category" v-model="selectedCategory"
                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-16 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow dark:placeholder:text-slate-200">
                    <option value="" disabled class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">{{
                      $t('form.select_category') }}</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id"
                      class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">{{ $i18n.locale ===
                        'ar' ? category.titleAr :
                        category.title }}</option>
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
                        <div
                          class="relative flex items-center justify-center h-48 bg-gray-100 border-2 border-blue-700 border-dashed border-dotted rounded-lg">
                          <div class="absolute">
                            <div class="flex flex-col items-center">
                              <icon name="material-symbols:add-photo-alternate" class="w-20 h-20 text-blue-700" />
                              <span class="block font-normal text-gray-400">{{ $t('form.attach_your_files_here')
                                }}</span>
                            </div>
                          </div>
                          <input type="file" class="w-full h-full opacity-0" @change="handleImageUpload" multiple>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error message below the file input -->
                <div v-if="fileUploadError" class="font-medium text-red-600 dark:text-red-500">
                  {{ fileUploadError }}
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-3 md:grid-cols-4" v-if="previewImages.length > 0">
                  <div v-for="(image, index) in previewImages" :key="index"
                    class="p-1 border border-gray-200 rounded-lg">
                    <img :src="image" class="object-cover w-full h-32 rounded-lg" />
                  </div>
                </div>

                <div v-if="isEditMode && productImages.length"
                  class="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-3 md:grid-cols-4">
                  <div v-for="(img, index) in productImages" :key="index" class="p-1 border border-gray-200 rounded-lg">
                    <img :src="img" alt="Product Image" class="object-cover w-full h-32 rounded-lg" />
                  </div>
                </div>
              </div>

              <div v-else-if="step === 2">
                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_title')" :placeholder="t('form.enter_product_title')"
                    type="text" name="product_title" :rules="'required'" :required="true" prefixIcon="mdi:tshirt-v"
                    v-model="product.title" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.product_title_ar')" :placeholder="t('form.enter_product_title_ar')"
                    type="text" name="product_title_ar" :rules="'required'" :required="true" prefixIcon="mdi:tshirt-v"
                    v-model="product.titleAr" />
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
                    }}
                  </p>
                  <div class="grid grid-cols-3 gap-4">
                    <label for="new-arrival" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="new-arrival" name="new-arrival" value="New_Arrival"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.productTypes">New Arrival
                    </label>

                    <label for="express-deals" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="express-deals" name="express-deals" value="Express_Deals"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.productTypes">Express Deals
                    </label>

                    <label for="sale" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="sale" name="sale" value="Sale"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.productTypes">Sale
                    </label>

                    <label for="bundle" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="bundle" name="bundle" value="Bundle"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.productTypes">Bundle
                    </label>

                    <label for="custom" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="custom" name="custom" value="Custom"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.productTypes">Custom
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{ $t('form.size') }}</p>
                  <div class="grid grid-cols-4 gap-4 md:grid-cols-5 sm:grid-cols-4">
                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="XXS"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">XXS
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="XS"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">XS
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="S"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">S
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="M"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">M
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="L"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">L
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="XL"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">XL
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="XXL"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">XXL
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="XXXL"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">XXXL
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="6XL"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">6XL
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="0 to 3"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">0 to 3
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="6M"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">6M
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="3t"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">3t
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="26W/32L"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">26W/32L
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="40 EU"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">40 EU
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="40"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">40
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="Mid_Rise"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">Mid Rise
                    </label>

                    <label for="size-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="size-choice" name="size-choice" value="10_Regular"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.sizes">10 Regular
                    </label>
                  </div>
                </div>

                <!-- don't delete it -->
                <div class="mb-4">
                  <p class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{ $t('form.color') }}</p>
                  <div class="grid grid-cols-3 gap-4">
                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Black"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Black
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="White"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">White
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Denim Light"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Denim Light
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Brown Windowpane"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Brown Windowpane
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Blue"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Blue
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Pink"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Pink
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Dark_Wash"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Dark Wash
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Maroon"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Maroon
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Khaki"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Khaki
                    </label>

                    <label for="color-choice" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      <input type="checkbox" id="color-choice" name="color-choice" value="Luggage"
                        class="text-gray-500 transition duration-150 ease-in-out me-2 form-checkbox checked:bg-gray-700 checked:border-transparent"
                        v-model="product.colors">Luggage
                    </label>
                  </div>
                </div>
              </div>

              <div v-else-if="step === 4">
                <div class="mb-4">
                  <dynamic-inputs :label="t('form.original_price')" :placeholder="t('form.enter_original_price')"
                    type="text" name="price" prefixIcon="solar:dollar-linear"
                    @input="(event) => handleInput(event, 'originalPrice')" @blur="() => handleBlur('originalPrice')"
                    v-model="product.originalPrice" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.discounted_price')" :placeholder="t('form.enter_discounted_price')"
                    type="text" name="price" :rules="'required'" :required="true" prefixIcon="solar:dollar-linear"
                    @input="(event) => handleInput(event, 'discountedPrice')"
                    @blur="() => handleBlur('discountedPrice')" v-model="product.discountedPrice" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.discount')" :placeholder="t('form.enter_the_discount_percentage')"
                    type="text" name="discount" prefixIcon="ri:discount-percent-fill" v-model="product.discount" />
                </div>

                <div class="mb-4">
                  <dynamic-inputs :label="t('form.sku')" :placeholder="t('form.enter_sku')" type="text" name="sku"
                    :rules="'required'" :required="true" prefixIcon="material-symbols:barcode" v-model="product.sku" />
                </div>

                <div class="mb-4">
                  <label for="availability" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">{{
                    $t('form.availability') }}</label>
                  <select id="availability" name="availability" v-model="product.availability"
                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-16 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow dark:placeholder:text-slate-200">
                    <option value="" disabled class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">{{
                      $t('form.select_availability') }}</option>
                    <option class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">In stock</option>
                    <option class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">Out of stock</option>
                  </select>
                </div>

                <div class="mb-4" v-if="product.availability === 'In stock'">
                  <dynamic-inputs :label="t('form.stock')" :placeholder="t('form.enter_stock')" type="text" name="stock"
                    :rules="'required|numeric'" :required="true" prefixIcon="lsicon:management-stockout-filled"
                    v-model="product.stock" />
                </div>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="flex justify-between mt-6">
              <button type="button" v-if="step > 1" @click="prevStep"
                class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600">
                {{ $t('form.previous') }}
              </button>
              <div class="flex-grow"></div>
              <button type="button" v-if="step < 4" @click="nextStep"
                class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                {{ $t('form.next') }}
              </button>
              <button type="submit" class="px-4 py-2 btn-style" v-if="step === 4">
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
const product = ref({ brand: '', brandAr: '', title: '', titleAr: '', description: '', descriptionAr: '', discountedPrice: '', originalPrice: '', discount: '', sku: '', stock: '', productTypes: [], sizes: [], colors: [] })
const selectedFiles = ref([]);
const previewImages = ref([])
const fileUploadError = ref('');
const addSuccessfully = ref(false)
const addFailed = ref(false)
const updateSuccessfully = ref(false)
const updateFailed = ref(false)

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
    // required: false
  },
  productId: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['close']);

watch(() => props.productId, async (newId) => {
  if (newId) {
    await store.fetchProductDetail(newId);
    product.value = { ...store.selectedProduct };
    selectedCategory.value = store.selectedProduct.categoryId;
  }
});

const isOpen = computed({
  get: () => props.isDialogOpen,
  set: (value) => emit("update:isOpen", value),
})

const closeDialog = () => {
  emit('close');
};

const isEditMode = computed(() => props.productId && props.productId !== 'add-product');

const handleSubmit = () => {
  loading.value = true;
  const category = categories.value.find(
    (cat) => cat.id === selectedCategory.value
  );
  if (!product.value.title || !selectedCategory.value || !selectedFiles.value) {
    addFailed.value = true;
    loading.value = false;
    setTimeout(() => {
      addFailed.value = false;
    }, 3000);
    return;
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
    categoryId: selectedCategory.value,
  };
  if (isEditMode.value) {
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
  } else {
    store.createProduct(productData, selectedFiles.value)
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
  product.value = { brand: '', brandAr: '', title: '', titleAr: '', description: '', descriptionAr: '', discountedPrice: '', originalPrice: '', discount: '', sku: '', stock: '' };
  selectedCategory.value = '';
  selectedFiles.value = [];
  previewImages.value = [];
};

const categoryStore = useCategoriesStore()

onMounted(async () => {
  await categoryStore.fetchCategories();
  categories.value = categoryStore.categories;

  if (isEditMode.value) {
    const productId = props.productId;
    try {
      const fetchedProduct = await store.fetchProductDetail(productId);
      // console.log("Fetched Product:", fetchedProduct);
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
});

const { formatDecimal, enforceTwoDecimalPlaces } = useFormatter();

const handleInput = (event, key) => {
  const inputElement = event.target;
  const cursorPosition = inputElement.selectionStart;
  const formattedValue = formatDecimal(inputElement.value);
  product.value[key] = formattedValue;
  nextTick(() => {
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  });
};

const handleBlur = (key) => {
  product.value[key] = enforceTwoDecimalPlaces(product.value[key]);
};

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